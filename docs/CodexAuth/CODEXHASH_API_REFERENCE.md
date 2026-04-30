# CodexHash API Reference

**Service:** CodexHash Python FastAPI  
**Base URL:** `http://localhost:8001` (development) | `https://codexhash.web3connected.com` (production)  
**Technology:** Python FastAPI + asyncpg  
**Last Verified:** March 8, 2026

---

## Overview

The CodexHash API provides tamper-evident hashing with blockchain-style chaining for SaaS request tracking and cryptographic operations.

### Architecture Note

CodexHash has two implementations:

- **Python FastAPI** (this API) - For SaaS tracking, metrics, and standalone hash operations
- **PHP Package** - Embedded in Laravel apps (codex_admin, codexauth_api) for direct use

Both use identical harmonic hash algorithms (PHP mirrors Python).

---

## Health Check

### `GET /health`

Check service health and database connectivity.

**Response:**

```json
{
  "status": "healthy",
  "service": "codexhash-api",
  "database": {
    "status": "healthy",
    "version": "PostgreSQL 16.13"
  }
}
```

---

## Hash Tracking Endpoints

### `POST /api/hash/`

Create a new hash event with tamper-evident chaining.

**Request Body:**

```json
{
  "data": "string", // Required: Data to hash
  "mode": "quick", // Optional: "quick" | "standard" | "secure"
  "algo": "sha256", // Optional: Hash algorithm
  "context": {} // Optional: Additional metadata
}
```

**Response:**

```json
{
  "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
  "created_at": "2026-03-08T18:13:43",
  "payload_hash": "c9ababd6c6298e6b61b10f694bfb5a039a4b46de5c9f6e53a31c0390bb962092",
  "prev_event_hash": "b5a82e40abea0ee1389006dfbf92a6ba7b2d8a901af44279a3f46285832e283b",
  "event_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "mode": "quick",
  "algo": "sha256"
}
```

**Example:**

```bash
curl -X POST http://localhost:8001/api/hash/ \
  -H "Content-Type: application/json" \
  -d '{"data": "password123", "mode": "quick"}'
```

---

### `GET /api/hash/`

List hash events with optional filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 50 | Max events to return |
| `offset` | int | 0 | Pagination offset |
| `mode` | string | null | Filter by mode |
| `algo` | string | null | Filter by algorithm |

**Response:** Array of `HashEventResponse` objects

---

### `GET /api/hash/{event_id}`

Get a specific hash event by ID.

**Path Parameters:**

- `event_id` (string, required): UUID of the hash event

**Response:**

```json
{
  "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
  "created_at": "2026-03-08T18:13:43",
  "payload_hash": "c9ababd6c6298e6b61b10f694bfb5a039a4b46de5c9f6e53a31c0390bb962092",
  "prev_event_hash": "b5a82e40abea0ee1389006dfbf92a6ba7b2d8a901af44279a3f46285832e283b",
  "event_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "mode": "quick",
  "algo": "sha256",
  "context": null
}
```

---

### `POST /api/hash/verify/{event_id}`

Verify the integrity of a hash event's chain.

**Path Parameters:**

- `event_id` (string, required): UUID of the hash event to verify

**Response:**

```json
{
  "event_id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
  "is_valid": true,
  "stored_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "calculated_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "message": "Hash chain is valid"
}
```

**Example:**

```bash
curl -X POST http://localhost:8001/api/hash/verify/a8d1ddee-79e9-4ca0-8156-ac0413d10583
```

---

### `GET /api/hash/metrics/summary`

Get hash operation metrics and analytics.

**Response:**

```json
{
  "total_events": 1234,
  "events_today": 56,
  "events_this_week": 234,
  "by_mode": {
    "quick": 800,
    "standard": 300,
    "secure": 134
  },
  "by_algo": {
    "sha256": 1200,
    "sha512": 34
  }
}
```

---

## Error Responses

All endpoints return standard HTTP error codes:

| Code | Description                                    |
| ---- | ---------------------------------------------- |
| 400  | Bad Request - Invalid input                    |
| 404  | Not Found - Resource doesn't exist             |
| 422  | Validation Error - Schema mismatch             |
| 500  | Internal Server Error                          |
| 503  | Service Unavailable - Database/dependency down |

**Error Format:**

```json
{
  "detail": "Error message description"
}
```

---

## Database Schema

Hash events are stored in `codexhash_events` table:

```sql
CREATE TABLE codexhash_events (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP,
  payload_hash VARCHAR(128),
  prev_event_hash VARCHAR(128),
  event_hash VARCHAR(128),
  mode VARCHAR(20),
  algo VARCHAR(20),
  context JSONB
);
```

---

## Integration with Other Services

### CodexTime

- TIU (Time Index Unit) used for temporal validation
- API: `http://localhost:50002` (dev) | `codextime.web3connected.com` (prod)

### CodexAuth

- Uses CodexHash for password hashing
- Stores `codex` JSON packet in user records

### CodexSecure

- Leverages CodexHash for encryption key derivation

---

## Docker Container

**Container:** `codexhash-api`  
**Port:** 8001  
**Health Check:** `GET /health`  
**Compose Location:** `Docker/web3connected/docker-compose.yml`

**Environment Variables:**

```env
DB_HOST=172.104.24.82
DB_PORT=5432
DB_DATABASE=codex_main
DB_USER=codex_admin
DB_PASSWORD=****
CODEXTIME_API_URL=http://codextime-api:50002
```

---

## Related Documentation

- [CODEXHASH_CRYPTO_SPEC_V2.md](CODEXHASH_CRYPTO_SPEC_V2.md) - Cryptographic specification
- [CODEXTIME_INTEGRATION.md](CODEXTIME_INTEGRATION.md) - TIU integration details
- [HASH_TRACKING_IMPLEMENTATION_COMPLETE.md](HASH_TRACKING_IMPLEMENTATION_COMPLETE.md) - Implementation notes
