# CodexTime Integration in CodexHash

## Overview
CodexHash uses CodexTime for generating Time Index Units (TIU) which provide temporal fingerprinting for authentication. This document details the integration configuration.

## Configuration

### Environment Variables

#### Docker CodexHash API
**Location:** `/Docker/CodexWeb3/codexhash_api/.env`

```bash
# CodexTime API Configuration
CODEXTIME_API_URL=http://codextime-api:50002/api
CODEXTIME_API_KEY=your_codextime_api_key
CODEXTIME_TENANT_ID=6
```

#### NextJs CodexHash
**Location:** `/NextJs/codexhash/.env.local`

```bash
# CodexTime API Configuration
CODEXTIME_API_URL=http://localhost:50002/api
CODEXTIME_API_KEY=your_codextime_api_key
CODEXTIME_TENANT_ID=6
```

### API Key Details
- **Tenant:** CodexHash (ID: 6)
- **Service:** CodexTime (ID: 2)
- **API Key:** `your_codextime_api_key`
- **Purpose:** TIU generation for temporal authentication

## Integration Code

### Python CodexTime Service
**Location:** `/Docker/CodexWeb3/codexhash_api/src/services/codex_time.py`

```python
class CodexTimeService:
    def __init__(self, codextime_url: Optional[str] = None):
        """Initialize CodexTime service with API authentication"""
        self.codextime_url = codextime_url or os.getenv('CODEXTIME_API_URL', 'http://localhost:50002/api')
        self.api_key = os.getenv('CODEXTIME_API_KEY')
        self.tenant_id = os.getenv('CODEXTIME_TENANT_ID', '6')
        self.fallback_enabled = True
    
    def _get_auth_headers(self) -> dict:
        """Get authentication headers for CodexTime API"""
        headers = {}
        if self.api_key and self.tenant_id:
            headers['X-Codex-API-Key'] = self.api_key
            headers['X-Codex-Tenant-ID'] = self.tenant_id
        return headers
    
    def current_tiu(self) -> float:
        """Get current TIU from CodexTime server"""
        try:
            response = httpx.get(
                f"{self.codextime_url}/time/current-tiu",
                headers=self._get_auth_headers(),
                timeout=2.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return float(data.get('tiu', time.time()))
        except Exception as e:
            print(f"CodexTime unavailable, using fallback: {e}")
        
        return self._fallback_tiu()
```

### Usage in Hash Generation

```python
from services import CodexTime

# Initialize service
codex_time = CodexTime()

# Get current TIU
tiu = codex_time.current_tiu()

# Use TIU in hash generation
hash_result = codex_hash.generate_hash(
    secret="user_password",
    salt="random_salt",
    tiu=tiu,  # Time-bound hash
    rounds=16
)
```

## API Endpoints Used

### Get Current TIU
**Endpoint:** `GET /api/time/current-tiu`

**Headers:**
```
X-Codex-API-Key: your_codextime_api_key
X-Codex-Tenant-ID: 6
```

**Response:**
```json
{
  "tiu": 1738598400.123456,
  "timestamp": 1738598400,
  "formatted": "2026-02-03T12:00:00.123456Z"
}
```

## Fallback Behavior

If CodexTime service is unavailable, the library automatically falls back to system time:

```python
def _fallback_tiu(self) -> float:
    """Generate TIU from system time as fallback"""
    return time.time()
```

This ensures zero downtime even if CodexTime service is offline, though it loses the enhanced temporal validation features.

## Testing

### Test API Connection
```bash
# Test TIU endpoint
curl -X GET http://localhost:50002/api/time/current-tiu \
    -H "X-Codex-API-Key: your_codextime_api_key" \
  -H "X-Codex-Tenant-ID: 6"
```

### Test Hash Generation with TIU
```bash
# Generate hash using CodexHash (will fetch TIU from CodexTime if omitted)
curl -X POST http://localhost:8001/api/hash/generate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "test_password",
    "rounds": 16
  }'
```

### Verify CodexHash Sees TIU
```bash
curl -X GET http://localhost:8001/api/hash/tiu/current
```

### Python Test
```python
# Test from Python
from services import CodexTime

codex_time = CodexTime()
tiu = codex_time.current_tiu()
print(f"Current TIU: {tiu}")
```

## Security Considerations

1. **API Key Storage**: Never commit API keys to version control. Store in `.env` (gitignored).

2. **Key Rotation**: Generate new API key through Web3Connected dashboard at `/tenant/codexhash`.

3. **Fallback Security**: Local fallback maintains functionality but loses temporal binding benefits.

4. **TIU Precision**: Microsecond precision required for accurate temporal validation.

5. **Drift Tolerance**: Default 2.5 TIU drift allows for network latency and time sync variations.

## Troubleshooting

### Service Unavailable Errors
```
CodexTime unavailable, using fallback
```
- **Cause**: CodexTime service not reachable or `CODEXTIME_API_URL` misconfigured
- **Solution**: Start CodexTime service or rely on fallback (functionality maintained, temporal binding lost)

### Authentication Errors
```
401 Unauthorized
```
- **Cause**: Invalid API key or tenant ID
- **Solution**: Verify environment variables match generated key in PIKEYS.MD

### Connection Refused
```
Connection refused
```
- **Cause**: CodexTime service not started or wrong base URL
- **Solution**: Check CodexTime is running: `curl http://localhost:50002/api/time/status`

## Related Documentation

- [CodexHash Integration (CodexAuth)](_docs/CodexIdentity/CODEXHASH_INTEGRATION.md)
- [CodexAuth Integration (CodexAdmin)](_docs/codex_admin/CODEXAUTH_INTEGRATION.md)
- [API Key System Task](_docs/tasks/TASK_API_KEY_SYSTEM.md)
- [CodexTime Documentation](_docs/CodexTime/)

## Integration Status

✅ **Configured:**
- Environment variables set in both Docker and NextJs deployments
- API key generated and stored
- Authentication headers implemented in Python service
- Fallback mechanism active

⏳ **Pending:**
- CodexTime service deployment verification on port 50002
- End-to-end integration testing with live service
- Performance benchmarking (service vs fallback)
- TIU drift tolerance optimization

## Architecture

```
CodexHash (ports 8001, NextJs)
    ↓ [API Key: (optional)]
CodexTime (port 50002)
    → TIU generation
    → Temporal validation
    → Fallback: System time.time()
```

## Notes

- CodexHash depends on CodexTime for TIU generation in all hash operations
- If CodexTime is offline, hash generation continues with system time (degraded mode)
- API key authentication is optional but recommended for production
- TIU-based hashing provides temporal binding that prevents replay attacks
- Hash validity window controlled by drift tolerance parameter
