# 🐳 CODEX DOCKER TESTBED - TODO FOR TOMORROW

## 📋 Overview
Complete Docker-based end-to-end testing infrastructure for CodexHash with:
- CodexTime mock service (Port 8000)
- CodexHash Python service with REST (3048) + MCP (3046) 
- Automated tester container with pytest/pytest-benchmark
- Persistent bench-results with JSON + Markdown reports

---

## 🎯 Implementation Tasks

### 1. **Docker Infrastructure Setup**
- [ ] Create `docker-compose.yml` with 3 services (codextime, codexhash, tester)
- [ ] Set up health checks and service dependencies
- [ ] Configure environment variables and secrets management
- [ ] Create persistent volume for bench-results

### 2. **CodexTime Mock Service**
- [ ] Create `codextime-mock/Dockerfile` (Python 3.12-slim + FastAPI)
- [ ] Implement `codextime-mock/app.py` with:
  - [ ] `GET /health` endpoint
  - [ ] `GET /tiu` endpoint with bounded oscillation [0, 10]
  - [ ] TIU calculation: `(sin(time) + 1) * 5.0`
- [ ] Expose on port 8000 with health checks

### 3. **CodexHash Service Container**
- [ ] Create `python/Dockerfile` with dependencies:
  - [ ] fastapi, uvicorn, pydantic, pytest, pytest-benchmark, blake3
- [ ] Create `python/entrypoint.sh` to start both:
  - [ ] MCP JSON-RPC server (port 3046) in background
  - [ ] REST FastAPI server (port 3048) as main process
- [ ] Copy existing codexhash_py and codexhash_mcp modules

### 4. **REST API Implementation** 
**Critical: Must implement these exact endpoints for test compatibility:**

- [ ] `POST /hash` → `{ digest_hex, took_ms, meta }`
  - [ ] Accept: `{ input, input_encoding: "utf8|base64", algo: "codex-v1|sha3|blake3", bits: 256|512|1024, salt?, rounds? }`
  - [ ] Return: hex digest + timing + metadata
  
- [ ] `POST /verify` → `{ ok, took_ms }`
  - [ ] Accept: `{ input, expected_hex, ...same hashing params }`
  - [ ] Return: constant-time comparison result
  
- [ ] `POST /bench` → `{ results: [{ algo, size, iters, mean_ms, p95_ms, mbps }] }`
  - [ ] Accept: `{ sizes: [64, 1024, 1048576], iters: 100, algos: ["codex-v1","sha3","blake3"], bits: 256 }`
  - [ ] Return: performance metrics array
  
- [ ] `GET /health` → `{ ok: true }`

### 5. **Security Implementation**
- [ ] HMAC Authentication: `X-Codex-Sign = HMAC_SHA256(secret, raw_body)`
- [ ] Request body size limits (`MAX_BODY_MB`)
- [ ] IP allowlist support (`ALLOWLIST`)
- [ ] Timeout protection
- [ ] Secret management (no dev secrets in prod)

### 6. **Test Container Setup**
- [ ] Create `python-tests/Dockerfile` (Python 3.12-slim + requests, pytest, pytest-benchmark, rich)
- [ ] Implement `python-tests/tests/test_suite.py` with:
  - [ ] `test_health()` - Basic service health check
  - [ ] `test_hash_basic()` - Basic hashing functionality
  - [ ] `test_verify_roundtrip()` - Hash → verify consistency
  - [ ] `test_bench_small_medium_large()` - Performance benchmarks across sizes
- [ ] HMAC signing helper function
- [ ] Results persistence to `/work/bench-results`

### 7. **Results & Reporting**
- [ ] JSON results output (`bench-results/results.json`)
- [ ] Markdown table generation (`bench-results/last_run.md`)
- [ ] Format: `| algo | size | iters | mean_ms | p95_ms | mbps |`
- [ ] Auto-generated reports for easy publishing

### 8. **MCP JSON-RPC Server**
- [ ] Implement `codexhash_mcp/server.py` with tools:
  - [ ] `hash` tool (JSON-RPC 2.0)
  - [ ] `verify` tool
  - [ ] `bench` tool  
  - [ ] `info` tool
- [ ] WebSocket/TCP support on port 3046
- [ ] Error handling and proper JSON-RPC responses

---

## 🚀 File Structure to Create

```
codex_hash/
├── docker-compose.yml
├── .env (optional)
├── codextime-mock/
│   ├── Dockerfile
│   └── app.py
├── python/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── codexhash_py/ (copy existing)
│   └── codexhash_mcp/
│       ├── server.py (NEW - MCP JSON-RPC)
│       └── rest_app.py (NEW - FastAPI implementation)
├── python-tests/
│   ├── Dockerfile
│   └── tests/
│       └── test_suite.py
└── bench-results/ (created by volume)
    ├── results.json
    └── last_run.md
```

---

## 🧪 Usage Workflow

```bash
# 1. Bring up the complete stack
docker compose up -d --build codextime codexhash

# 2. Run comprehensive tests + benchmarks  
docker compose run --rm tester

# 3. View results
cat bench-results/last_run.md
cat bench-results/results.json | jq .
```

---

## ⚠️ Critical Implementation Notes

### **TIU Stability for Benchmarks**
- [ ] Lock TIU behavior during benchmarks for comparable results
- [ ] Pin TIU to specific window OR record TIU with each digest
- [ ] Ensure non-deterministic mode consistency during bench runs

### **Security Hardening**
- [ ] Cap request body sizes (prevent payload attacks)
- [ ] Implement proper timeout handling
- [ ] Validate all input parameters strictly
- [ ] Use production-grade HMAC secrets (not dev-secret)
- [ ] Add rate limiting considerations

### **Performance Considerations**  
- [ ] Optimize for 1MB+ input throughput
- [ ] Target 2-5× improvement over PHP baseline
- [ ] Proper memory management for large payloads
- [ ] CPU affinity for consistent benchmark results

### **Integration with Existing Stack**
- [ ] Ensure compatibility with current MCP gateway (port 3046)
- [ ] Maintain REST bridge functionality (port 3048)
- [ ] Preserve CodexTime integration patterns
- [ ] Test against existing KAT vectors

---

## 🎯 Success Criteria

- [ ] **Complete Stack Operational**: All 3 containers healthy
- [ ] **End-to-End Testing**: Full pytest suite passes  
- [ ] **Performance Benchmarks**: Results generated and exported
- [ ] **HMAC Security**: Authentication working correctly
- [ ] **Results Persistence**: JSON + Markdown reports saved
- [ ] **Documentation**: Ready-to-use commands and examples

---

## 📅 Tomorrow's Sprint Plan

### **Morning (2-3 hours)**
1. Docker infrastructure setup (compose, Dockerfiles)
2. CodexTime mock implementation  
3. Basic REST API skeleton

### **Afternoon (3-4 hours)**  
1. Complete REST endpoint implementation
2. HMAC security integration
3. Test suite creation and validation

### **Evening (1-2 hours)**
1. MCP JSON-RPC server implementation
2. End-to-end testing and validation
3. Documentation and usage examples

---

## 🔧 Preparation for Tomorrow

### **Prerequisites Ready:**
- ✅ Current CodexHash Python implementation working
- ✅ MCP infrastructure operational  
- ✅ REST bridge functional
- ✅ KAT test vectors available

### **Architecture Validated:**
- ✅ 100% specification compliance confirmed
- ✅ All services operational in current setup
- ✅ Test framework infrastructure in place

### **Docker Environment:**
- [ ] Verify Docker and docker-compose installed
- [ ] Ensure ports 8000, 3046, 3048 available
- [ ] Test basic container builds work

---

**🎯 GOAL: Complete Docker testbed with automated benchmarking and results publishing ready for production validation.**

**Status: READY TO IMPLEMENT** ✅
