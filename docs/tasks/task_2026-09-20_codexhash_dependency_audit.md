# CodexAuth → CodexHash dependency audit — 2026-09-20

The reported missing-class failure is repaired in the running local CodexAuth
service and its local image tag. Authentication is **not fully restored**:
the configured PostgreSQL endpoint refuses connections, and the strict live
invalid-login regression remains failing. No credentials were changed.

## Root cause and dependency chain

The running `codexauth-api` container used image
`codexweb3-codexauth-api` (original image digest
`sha256:5543bf487c05ce5b2ffadee5732863c6529d94603221a0698ab7e2a5ed4be226`).
It has no source bind mounts. Its controller differed from the workspace file.

Exact failing request path:

1. `POST http://127.0.0.1:8003/api/auth/login` reaches the container's Nginx/PHP-FPM.
2. Laravel loads CodexSecure zone routes; `routes/api/zones/Z2/identity.php`
   registers `POST auth/login` against `App\Http\Controllers\AuthController::login`.
3. Laravel resolves that controller and invokes `AuthController::__construct()`.
4. `/app/app/Http/Controllers/AuthController.php:34` executes
   `new CodexHashClient()` using the deployed import
   `Web3Codex\CodexHash\Clients\CodexHashClient`.
5. Composer has neither that class nor its namespace mapping, so PHP throws
   `Error: Class "Web3Codex\CodexHash\Clients\CodexHashClient" not found`.
   This happens before the login method's validation, database lookup, or try/catch.

The next constructor dependency was also absent:
`Web3Codex\CodexTime\Services\CodexTime`. Fixing only the hash import would
expose that second error and leave incompatible method calls.

## Composer evidence and reference inventory

- Root `composer.json` directly maps `Web3Codex\CodexAuth\` to
  `packages/codexauth/src/`, plus CodexCore and CodexSecure. It does not require
  a Web3Codex Composer package or declare a path repository.
- Root `composer.lock` and `vendor/composer/installed.json` contain no installed
  Web3Codex package version. This is not a demonstrated package-version mismatch.
- `vendor/composer/autoload_psr4.php` and `autoload_classmap.php` correctly load
  `Web3Codex\CodexAuth\Services\CodexHashClient` and `CodexTimeClient`.
  Runtime `class_exists()` confirmed both available and both old classes absent.
- Nested `packages/codexauth/composer.json` declares `web3codex/codexhash` and
  `web3codex/codextime`, but the root application only autoloads this directory;
  Composer does not recursively install dependencies from nested manifests.
- The old CodexHash namespace still exists in the separate CodexAdmin package:
  `../codex_admin/packages/web3codex/codexhash/src/Clients/CodexHashClient.php`.
  Its provider imports it. Equivalent provider references also exist in
  `projects/Archived/codex_admin/` and
  `projects/Archived/data/backups/services/codex_admin_backup/`.
  They are not dependencies installed in this service.
- The deployed controller was the only exact old client reference found in its
  `app/`, `packages/`, and `routes/`. The current workspace controller already
  imports the bundled CodexAuth client. `CodexAuthServiceProvider` injects that
  bundled client into `CodexAuthSecure` and `CodexDevices`; `CodexAuthSecure`
  uses `hashPassword()` and `verifyPassword()`.
- `bootstrap/providers.php` also lists absent old Hash/Time providers. Laravel's
  `RegisterProviders::mergeAdditionalProviders()` filters non-existent classes,
  so these entries are not the demonstrated login failure.

Classification: stale deployed integration referencing uninstalled service
modules, while compatible bundled clients are already installed and autoloadable.
No evidence of broken PSR-4 generation, a broken path repository, or a class
being globally renamed/removed. `composer dump-autoload` cannot supply absent
classes and is not the repair.

## API comparison and smallest repair

The separate CodexAdmin client requires a `CodexConnectService` constructor
argument. Its `generateHash(secret, salt, tiu, rounds)` requires a string salt;
its `validateHash(attempted, storedHash, salt, tiu, rounds)` has no `buffer`
parameter. The old deployed controller constructed it with no argument, passed
extra named parameters (`email`/`buffer`), and passed null salts. Installing that
package alone would therefore not repair the deployed controller.

The already-bundled CodexAuth client has a zero-argument constructor and exposes:

- `hashPassword(password, deviceId, tiu = null)` →
  `POST /api/hash/generate`.
- `verifyPassword(password, storedHash, salt, storedTIU, rounds = 16)` →
  `POST /api/hash/validate`.

These payloads match the current Python request models in
`../codexhash_api/src/routes/hash_tracking.py`. The bundled Time client exposes
`getCurrentTIU()`, replacing the old `currentTiu()` call.

The workspace `app/Http/Controllers/AuthController.php` already contains all
these compatible calls. The smallest repair was to deploy that existing file.
No Composer manifest, lockfile, vendor file, client implementation, frontend,
database, or credential change was needed for the missing-class repair.

## Changes applied and operational risk

- Deployed the existing workspace `app/Http/Controllers/AuthController.php` to
  the same path under `/app` in the running container.
- Built a minimal image layer containing only this controller, retaining the
  existing image as `codexweb3-codexauth-api:before-client-repair-20260920` and
  updating `codexweb3-codexauth-api:latest` for subsequent local recreation.
  No dependency download/update or unrelated source rebuild was performed.
- Restarted only `codexauth-api` to reload PHP. Its Supervisor configuration has
  no supervisorctl interface. The running container retains its original image
  identity plus the patched file; the local latest image also contains the fix.
- Verified deployed and workspace controller SHA-256 both equal
  `49e852661dac3cc3b8c96de8a2d9f6c9112c777bea6609474974ce89475c7d0d`.
- Added `tests/Feature/CodexAuthLocalServicesTest.php`: real HTTP health, invalid
  login, and unauthenticated `/me` coverage. Only health connection failures
  skip; HTTP errors fail. Login requires 401, `success: false`, the contract's
  `Invalid credentials` message, and no token. Debug bodies are not printed.
- Added `tests/Feature/AuthControllerDependenciesTest.php`: resolves the actual
  controller with the installed classes, without mocked client bindings.
- Added this audit report.

The referenced pre-existing `CodexAuthLocalServicesTest.php` could not be found
under `/home/web3codex`, including frontend projects. Equivalent permanent
coverage was added in this service; no unavailable tracker file was edited.
Set `CODEXAUTH_LOCAL_URL` to override its default `http://127.0.0.1:8003`.

The controller is shared by login, registration, and password reset. Deploying
the existing compatibility fix also switches registration/reset to the bundled
`hashPassword()` contract, which uses email as its deviceId/salt. Existing stored
hash/salt/TIU/rounds values are still passed unchanged for verification. These
paths could not be fully exercised while dependencies are unavailable. Existing
SHA-256/time fallback behavior in the bundled clients was not changed and is
not evidence of a successful remote integration. No security bypass was added.

## Before/after verification

| Check | Before | After |
| --- | --- | --- |
| Actual `GET /api/health` | 200 | 200 |
| Actual invalid `POST /api/auth/login` | 500, missing CodexHash class | 500, database connection refused; no missing-class error |
| Actual unauthenticated `GET /api/auth/me` | 401 | 401 |
| Resolve deployed AuthController | Missing class in constructor | Resolves both bundled clients |
| Original CodexAuth suite | 3 tests / 7 assertions pass | Included among passing tests below |
| New live regression before deployment | 3 tests / 8 assertions; 1 missing-class failure | Missing-class assertion now passes |
| Full suite after deployment | — | 7 tests / 17 assertions; 6 pass, 1 failure requiring login 401 instead of 500; no skips |

Commands used: `php vendor/bin/phpunit` and
`php vendor/bin/phpunit --filter CodexAuthLocalServicesTest`, with host network
access for the live requests. Also made real requests within the container.
Existing SQLite-based feature tests log non-fatal missing `request_logs` warnings.

No suitable dedicated login fixture was found in the test configuration; a
successful account login was not attempted because database access is already
blocked. No accounts, stored hashes, passwords, or tokens were created or changed.

## Remaining blockers and next steps

1. Both services target PostgreSQL `172.104.24.82:5432`, which refuses connections.
   CodexAuth fails its real user lookup. CodexHash logs show database pool creation
   failed and ASGI startup exited; its container is unhealthy and port 8001 is
   not listening. Restore the configured database's availability through its
   normal operational process, then restart CodexHash and rerun the live suite.
   This audit did not alter the external database or switch to test/mock storage.
2. `config/services.php` has no `codexhash` or `codextime` entry. Runtime
   `services.codexhash.url`/`services.codextime.url` are unset, so the clients
   default to localhost inside CodexAuth, not the other containers. Existing
   `CODEXHASH_API_URL` and `CODEXTIME_API_URL` environment values point to public
   service URLs but are not consumed by these clients. After confirming the
   intended deployment targets, map the environment settings in
   `config/services.php` and configure the local Hash URL as
   `http://codexhash-api:8001`; verify Time's base path as well. This is a separate
   confirmed wiring issue, not a substitute for the missing-class repair.
3. Once CodexHash is healthy and correctly configured, verify an actual remote
   hash validation and, only with existing suitable test credentials, a successful
   login. A nonexistent-user 401 would not alone prove a CodexHash round trip.
4. Other lazy provider bindings still reference the old CodexTime service outside
   this login path; they were left unchanged to avoid unrelated refactoring.

The strict regression intentionally remains red on the database-related 500.
It was not weakened, skipped as a known bug, or changed to expect a server error.
