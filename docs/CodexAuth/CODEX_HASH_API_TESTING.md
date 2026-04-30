# CodexHash API Integration - Testing Guide

**Date:** January 23, 2026  
**Status:** ✅ API Server Running on `http://localhost:8001`  
**Database:** PostgreSQL 16.11 at `172.104.24.82:5432/codex_main`

---

## 🎉 Current Status

### Completed ✅
1. **Database Connection Fixed**
   - Issue: Password authentication failing with asyncpg
   - Solution: Explicit `.env` path loading + individual connection parameters
   - Result: Successfully connected to central database

2. **CodexHash API Running**
   - Health endpoint: Working
   - Database queries: Using asyncpg `$1, $2` syntax (not `%s`)
   - All services initialized successfully

3. **Setup-Codex Endpoint Working**
   - Successfully created CodexHash for `richievc@web3connected.com`
   - Duplicate prevention working
   - Hash stored in `codex` JSON field in database

---

## 🧪 Testing Instructions

### Method 1: HTML Test Page
Open the test page in your browser:
```bash
cd /home/web3codex/projects/Docker/web3connected
python3 -m http.server 8080 --directory .
```
Then visit: `http://localhost:8080/test_codex_integration.html`

### Method 2: cURL Commands

**1. Test Health Endpoint:**
```bash
curl http://localhost:8001/health | python3 -m json.tool
```

**2. Create a Hash Event:**
```bash
curl -X POST http://localhost:8001/api/hash/ \
  -H "Content-Type: application/json" \
  -d '{"data": "test data", "mode": "quick"}'
```

**3. List Hash Events:**
```bash
curl http://localhost:8001/api/hash/?limit=10
```

**4. Get Metrics Summary:**
```bash
curl http://localhost:8001/api/hash/metrics/summary | python3 -m json.tool
```

---

## 🔗 Next Steps

### 1. Start Web3Connected Frontend
```bash
cd /home/web3codex/projects/Docker/web3connected
npm run dev
```
Access at: `http://localhost:3010`

### 2. Test Migration Flow
1. Navigate to login page
2. Enter email: `reserved2@web3connected.com`
3. Should redirect to `/codex-setup?email=reserved2@web3connected.com`
4. Enter password on setup page
5. Auth is handled by **CodexAuth** service (separate from CodexHash)
6. CodexAuth calls CodexHash API for hashing operations

### 3. Test Users Available
- `richievc@web3connected.com` - ✅ Already has CodexHash
- `reserved1@web3connected.com` - ⏳ Needs setup
- `reserved2@web3connected.com` - ⏳ Needs setup

### 4. CodexTime Server Integration
Check if time server is accessible:
```bash
curl -I https://codextime.web3connected.com/tiu
```

If down, the API falls back to local timestamps.

---

## 📊 Database Verification

Check codex field directly:
```bash
psql "postgres://codex_admin:7yQ4xR8kP9wN2mL5vB6tE3zF1jK0dA9sG7hU4nM8xC2qW6@172.104.24.82:5432/codex_main" \
  -c "SELECT email, 
      CASE WHEN codex IS NULL THEN 'No Codex' 
           ELSE 'Has Codex' 
      END as status,
      LEFT(codex->>'hash', 20) as hash_preview
      FROM admins 
      WHERE email LIKE '%@web3connected.com';"
```

---

## 🐛 Troubleshooting

### Server Not Responding
```bash
# Check if running
ps aux | grep uvicorn | grep 8001

# Check logs
tail -f /tmp/codexhash.log

# Restart if needed
pkill -f "uvicorn src.main:app"
cd /home/web3codex/projects/Docker/codexhash_api
nohup python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 > /tmp/codexhash.log 2>&1 &
```

### CORS Issues
If frontend can't connect, check CORS origins in `.env`:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:3010,http://localhost:8082
```

### Database Issues
Test connection directly:
```bash
psql "postgres://codex_admin:PASSWORD@172.104.24.82:5432/codex_main" -c "SELECT NOW();"
```

---

## 📝 API Endpoints Reference

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/` | GET | Service info | ✅ Working |
| `/health` | GET | Health check with DB status | ✅ Working |
| `/api/hash/` | POST | Create hash event | ✅ Working |
| `/api/hash/` | GET | List hash events | ✅ Working |
| `/api/hash/{event_id}` | GET | Get specific hash event | ✅ Working |
| `/api/hash/verify/{event_id}` | POST | Verify hash chain integrity | ✅ Working |
| `/api/hash/metrics/summary` | GET | Analytics dashboard | ✅ Working |
| `/api/hash/chain/{did}` | GET | Get hash chain for DID | ✅ Working |
| `/api/hash/generate` | POST | Generate hash without storing | ✅ Working |
| `/api/hash/validate` | POST | Validate a hash | ✅ Working |

> **Note:** Authentication is handled by the **CodexAuth** service (separate service). CodexHash is a pure hashing service — it has no `/api/auth/*` endpoints.

---

## 🔐 CodexHarmonicHash Details

**Algorithm:** HMAC-SHA3-512 with iterative rounds  
**Temporal Binding:** TIU (Time Index Unit) validation  
**Salt Generation:** HMAC-SHA3-256 from email  
**Rounds:** 16 iterations  
**Drift Tolerance:** 0.000001 seconds  

**Codex Packet Structure:**
```json
{
  "hash": "128-char hash string",
  "salt": "64-char salt string",
  "tiu": 1737681234.567890,
  "rounds": 16,
  "buffer": 0.000001,
  "zone": "Z2",
  "registered_at": "2026-01-23T20:52:34.567890+00:00"
}
```

---

## ✅ Success Criteria

- [x] Database connection stable
- [x] Health endpoint returns database version
- [x] Check-codex detects missing codex field
- [x] Setup-codex generates and stores hash
- [x] Duplicate setup prevention works
- [ ] Frontend login flow redirects to setup
- [ ] Setup page stores password hash
- [ ] Login authenticates with CodexHash
- [ ] CodexTime server integration tested

---

**Last Updated:** January 23, 2026 20:58 UTC  
**Next Action:** Start web3connected frontend and test complete migration flow
