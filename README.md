# CodexAuth API

CodexAuth is the authentication engine of the Web3Codex ecosystem. This repository is its standalone REST API: a Laravel 13 application that serves JSON over HTTP only. It has no frontend, web pages or browser sessions.

CodexAuth will perform password-based authentication by calling two other Web3Codex services over HTTP:

- **CodexHash**, which creates and validates credential hashes.
- **CodexTime**, which supplies the Time Index Unit (TIU) used when a credential is created.

CodexAuth holds the authentication logic itself. A separate client package may call this API from other applications, but it will not contain the engine.

## Status

**Phase 1: foundation.** The application is installed and configured as an API server. **No authentication endpoints exist yet.**

| Area | State |
| --- | --- |
| `GET /api/health` | Implemented |
| JSON errors for every route (404, 405, 422, 500) | Implemented |
| Redis connection (cache) | Configured |
| CodexHash and CodexTime settings | Configured; not called yet |
| Credential creation and validation | Not started |
| Challenge IDs | Not started; the protocol is undecided |

## Requirements

- PHP 8.3 or later. Development uses PHP 8.4.
- Composer 2
- Redis. The `predis/predis` client is included, so the PHP `redis` extension isn't needed.

## Setup

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --host=127.0.0.1 --port=8013
```

Check the service:

```sh
curl http://127.0.0.1:8013/api/health
# {"service":"codexauth","status":"ok"}
```

## API

All routes are under `/api`, and every response, including errors, is JSON.

### `GET /api/health`

Liveness check. It confirms the application is running; it does not check Redis, CodexHash or CodexTime.

```json
{ "service": "codexauth", "status": "ok" }
```

### Errors

Unknown routes return `404`, and a wrong HTTP method returns `405`, both as JSON with a `message` field. Validation failures will return `422`. With `APP_DEBUG=true` the error body also contains exception details. **Always set `APP_DEBUG=false` outside local development.**

## Configuration

Settings come from the environment. `.env.example` lists every key; a real `.env` is never committed.

| Variable | Purpose | Example default |
| --- | --- | --- |
| `REDIS_CLIENT` | Redis client library | `predis` |
| `REDIS_HOST` / `REDIS_PORT` | Redis server | `127.0.0.1` / `6379` |
| `REDIS_DB` / `REDIS_CACHE_DB` | Redis databases for general use and the cache | `4` / `5` |
| `REDIS_PREFIX` | Key prefix | `codexauth:` |
| `CACHE_STORE` | Cache backend | `redis` |
| `CODEXHASH_URL` | CodexHash base URL | `https://codexhash.web3codex.com` |
| `CODEXHASH_API_KEY` | CodexHash API key, if required | empty |
| `CODEXHASH_TIMEOUT` / `CODEXHASH_CONNECT_TIMEOUT` | Request and connect timeouts, in seconds | `5` / `2` |
| `CODEXTIME_URL` | CodexTime base URL | `https://codextime.web3codex.com` |
| `CODEXTIME_API_KEY` | CodexTime API key (sent as `X-Api-Key`) | empty |
| `CODEXTIME_TIMEOUT` / `CODEXTIME_CONNECT_TIMEOUT` | Request and connect timeouts, in seconds | `5` / `2` |

The service settings are read from `config/services.php` (`services.codexhash.*` and `services.codextime.*`).

Sessions use the `array` driver and queues run synchronously. CodexAuth currently owns no database tables and ships no migrations; database schema for the Web3Codex ecosystem is managed in the Web3Codex project.

## Tests

```sh
php artisan test
```

The feature tests in `tests/Feature/ExampleTest.php` cover the health response and the JSON error responses (404 and 405).

## Project layout

```text
app/Http/Controllers/HealthController.php   GET /api/health
bootstrap/app.php                           API-only routing; JSON rendering for all errors
config/services.php                         CodexHash and CodexTime settings
routes/api.php                              API routes (prefix /api)
tests/Feature/                              HTTP tests
```

## Roadmap

1. HTTP clients for CodexHash and CodexTime that fail closed: if a service is unavailable, the request fails. There is no local substitute for hashing or time.
2. Password credential creation and validation through CodexHash's existing credential endpoints.
3. Challenge ID support, once its protocol is decided.

## History

Earlier versions of this repository held a Next.js website and then a Laravel 11 CodexAuth implementation. Both remain available in the Git history.
