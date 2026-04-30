# CodexHash Documentation Index

**Service:** CodexHash - Cryptographic Hashing & Time-Stamping System  
**API Endpoint:** `codexhash.io`  
**Technology:** Python  
**Last Updated:** February 27, 2026

---

## 📋 Quick Reference

### Service Information

- **Primary Service:** Harmonic hashing & cryptographic foundation
- **API Base URL:** `https://codexhash.io`
- **Legacy URL:** `codexhash.web3connected.com`
- **Documentation Portal:** `codexhash.io` (Next.js)
- **Port:** 8001 (internal)

### Key Features

- 256-bit and 1024-bit hash generation
- Time-stamped cryptographic blocks
- Hash chain verification
- Replay protection
- Fork detection
- History mode tracking

---

## 📚 Documentation Files

### API Reference

0. **[CODEXHASH_API_REFERENCE.md](CODEXHASH_API_REFERENCE.md)** ⭐ NEW
   - Complete Python FastAPI endpoint documentation
   - Request/response examples
   - Hash tracking endpoints only (no auth — auth is handled by CodexAuth)

### Core Specifications

1. **[CODEXHASH_CRYPTO_SPEC_V2.md](CODEXHASH_CRYPTO_SPEC_V2.md)**
   - Cryptographic specification version 2
   - Hash algorithm details
   - Security implementation

2. **[CODEXHASH_BLOCK_GENERATION_SPEC.md](CODEXHASH_BLOCK_GENERATION_SPEC.md)**
   - Block generation specification
   - Chain structure
   - Validation rules

3. **[CODEXHASH_1024_BIT_FIX.md](CODEXHASH_1024_BIT_FIX.md)**
   - 1024-bit hash implementation fix
   - Performance improvements

### FAQs & Guides

4. **[CODEXHASH_FAQ.md](CODEXHASH_FAQ.md)**
   - Frequently asked questions
   - Common use cases

5. **[CodexHash FAQ — Chaining & Validity.md](CodexHash%20FAQ%20—%20Chaining%20&%20Validity.md)**
   - Hash chaining explained
   - Validity verification

6. **[CODEXHASH_FORK_FAQ.md](CODEXHASH_FORK_FAQ.md)**
   - Fork detection
   - Chain conflict resolution

7. **[CODEXHASH_REPLAY_FAQ.md](CODEXHASH_REPLAY_FAQ.md)**
   - Replay attack prevention
   - Timestamp validation

8. **[CODEXHASH_TIME_FAQ.md](CODEXHASH_TIME_FAQ.md)**
   - Time-based hashing
   - Temporal validation

### Implementation & Testing

9. **[CODEXHASH_API_SETUP_PLAN.md](CODEXHASH_API_SETUP_PLAN.md)**
   - API setup guide
   - Configuration steps

10. **[CodexHash_Installation_Plan.md](CodexHash_Installation_Plan.md)**
    - Complete installation guide
    - Step-by-step setup
    - Service integration

11. **[CODEXHASH_API_VERIFICATION.md](CODEXHASH_API_VERIFICATION.md)**
    - API verification procedures
    - Endpoint testing

12. **[CODEX_HASH_API_TESTING.md](CODEX_HASH_API_TESTING.md)**
    - Test suite documentation
    - Testing procedures

13. **[HASH_TRACKING_IMPLEMENTATION_COMPLETE.md](HASH_TRACKING_IMPLEMENTATION_COMPLETE.md)**
    - Hash tracking feature completion
    - Implementation notes

14. **[HASH_TRACKING_VERIFICATION_RESULTS.md](HASH_TRACKING_VERIFICATION_RESULTS.md)**
    - Verification test results
    - Performance metrics

### History & Development

15. **[CODEXHASH_HISTORY_MODE.md](CODEXHASH_HISTORY_MODE.md)**
    - History tracking mode
    - Audit trail features

16. **[codex_hash_preview.md](codex_hash_preview.md)**
    - Feature preview
    - Upcoming capabilities

17. **[1.md](1.md)**
    - Additional documentation

### Integrations

18. **[CODEXTIME_INTEGRATION.md](CODEXTIME_INTEGRATION.md)**
    - CodexTime integration
    - Time-stamping coordination

19. **[CODEXHASH_CODEXTIME_WEB3_SOLUTION_BRIEF.md](CODEXHASH_CODEXTIME_WEB3_SOLUTION_BRIEF.md)**
    - Combined solution architecture
    - Web3 integration approach

### Patents & IP

20. **[CODEX_HASH_TIME_PATENT_REPORT.md](CODEX_HASH_TIME_PATENT_REPORT.md)**
    - Patent documentation
    - Intellectual property overview

### Main Documentation

21. **[README.md](README.md)**
    - Main README file
    - Getting started guide

---

## 🔗 Related Documentation

### Web3Connected Integration

- [WEB3CONNECTED_SERVICE_SUBDOMAINS.md](../Achived/WEB3CONNECTED_SERVICE_SUBDOMAINS.md) - Service subdomain architecture
- [UNIFIED_PLATFORM_ARCHITECTURE.md](../Achived/web3connected/UNIFIED_PLATFORM_ARCHITECTURE.md) - Platform architecture
- [ZONE_INTEGRATION.md](../Achived/web3connected/ZONE_INTEGRATION.md) - Zone integration patterns

### CodexAuth Integration

- [CODEXEGO_PRIMARY_PROJECT_GOAL.md](../Achived/web3connected/CODEXEGO_PRIMARY_PROJECT_GOAL.md) - Explains CodexHash as authentication foundation

### CodexAdmin Documentation

- [codex_admin/web3codex/README.md](../Achived/codex_admin/web3codex/README.md) - Package integration
- [codex_admin/CODEXAUTH_INTEGRATION.md](../Achived/codex_admin/CODEXAUTH_INTEGRATION.md) - Auth integration with CodexHash

---

## 🏗️ Project Structure

### Source Code

- **API Service:** `/home/web3codex/projects/NextJs/codexhash/backend/` (Python)
- **Documentation Portal:** `/home/web3codex/projects/NextJs/codexhash/` (Next.js)
- **Docker Config:** `/home/web3codex/projects/Docker/codexhash_api/`

### Documentation

- **Service Docs:** `/home/web3codex/projects/_docs/CodexHash/` (this folder)
- **Archived Docs:** `/home/web3codex/projects/_docs/Achived/CodexHash/` (moved to current location)

---

## 🚀 Quick Start

### API Endpoints

```bash
# Health check
curl https://codexhash.io/health

# Generate 256-bit hash
curl -X POST https://codexhash.io/api/hash \
  -H "Content-Type: application/json" \
  -d '{"data": "test", "bits": 256}'

# Generate 1024-bit hash
curl -X POST https://codexhash.io/api/hash \
  -H "Content-Type: application/json" \
  -d '{"data": "test", "bits": 1024}'

# Verify hash
curl -X POST https://codexhash.io/api/verify \
  -H "Content-Type: application/json" \
  -d '{"hash": "...", "data": "test"}'
```

### Local Development

```bash
# Test with Host header (local gateway)
curl -H "Host: codexhash.web3connected.com" http://localhost:3010/health

# Or add to /etc/hosts
echo "127.0.0.1 codexhash.web3connected.com" >> /etc/hosts
```

---

## 📊 Service Status

**Current Status:** ✅ Active  
**Environment:** Production  
**Database:** CodexCore (PostgreSQL)  
**Authentication:** CodexAuth API

**Service Capabilities:**

- ✅ 256-bit hash generation
- ✅ 1024-bit hash generation
- ✅ Hash verification
- ✅ Chain validation
- ✅ Time-stamping
- ✅ History tracking
- ✅ Fork detection
- ✅ Replay protection

---

## 🔧 Configuration

### Environment Variables

```bash
CODEXHASH_API_URL=https://codexhash.io
CODEXHASH_API_KEY=codex_codexhash_[key]
CODEXHASH_SERVICE_ID=6
```

### Database Tables

- `hash_blocks` - Generated hashes
- `hash_chains` - Chain relationships
- `hash_history` - Historical tracking

---

## 📝 Notes

- CodexHash is the cryptographic foundation for all Web3Connected services
- All password hashing uses CodexHash algorithms
- CodexAuth depends on CodexHash for secure operations
- Service ID is reserved in range 1-1000 (ID: 6)

---

**Organization Date:** February 27, 2026  
**Maintained By:** Web3Codex Team  
**Contact:** See main project documentation
