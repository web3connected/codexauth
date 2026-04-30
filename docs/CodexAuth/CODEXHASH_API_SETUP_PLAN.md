# CodexHash API Setup Plan
**Created:** January 23, 2026  
**Location:** /home/web3codex/projects/Docker/codexhash_api  
**Domain:** codexhash.web3connected.com  
**Server:** 45.79.180.207 (Docker Server)

---

## Overview
Python-based quantum-resistant hashing API service for the Web3Connected ecosystem. Provides hashing operations, verification, and hash management with a web UI.

---

## Directory Structure

```
/home/web3codex/projects/Docker/codexhash_api/
├── README.md
├── Dockerfile
├── docker-compose.yml
├── docker-compose.production.yml
├── requirements.txt
├── .env
├── .env.example
├── .env.production
├── .gitignore
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── models.py            # Data models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py        # Health check endpoints
│   │   ├── hash.py          # Hashing operations
│   │   └── verify.py        # Verification endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── hash_service.py  # Core hashing logic
│   │   └── db_service.py    # Database operations
│   └── utils/
│       ├── __init__.py
│       ├── logger.py
│       └── validators.py
├── frontend/                 # Web UI (optional)
│   ├── index.html
│   ├── css/
│   └── js/
├── tests/
│   ├── __init__.py
│   ├── test_hash.py
│   └── test_api.py
└── logs/
    └── .gitkeep
```

---

## Technology Stack

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ASGI Server:** Uvicorn
- **Database:** PostgreSQL (shared codex_main)
- **Caching:** Redis (shared instance)
- **Validation:** Pydantic

### Frontend
- **UI Framework:** Vanilla JS or lightweight React
- **Styling:** Tailwind CSS
- **API Client:** Axios

### Infrastructure
- **Container:** Docker
- **Reverse Proxy:** Nginx (within container or shared)
- **SSL:** Let's Encrypt (via Cloudflare/Nginx)
- **Monitoring:** Built-in health checks

---

## Database Schema

### Table: `codexhash_usage_logs`
Already exists in codex_main database:
```sql
- id (bigint)
- tenant_id (string)
- endpoint (string)
- success (boolean)
- response_time_ms (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### Table: `codexhash_operations` (new)
```sql
CREATE TABLE codexhash_operations (
    id BIGSERIAL PRIMARY KEY,
    hash_id VARCHAR(64) UNIQUE NOT NULL,
    input_data TEXT,
    algorithm VARCHAR(50) NOT NULL,
    hash_value TEXT NOT NULL,
    tenant_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Health & Status
```
GET  /health                  # Service health check
GET  /api/v1/status           # Detailed status
```

### Hashing Operations
```
POST /api/v1/hash             # Create hash (auto-detect algorithm)
POST /api/v1/hash/sha256      # SHA-256 specific
POST /api/v1/hash/sha512      # SHA-512 specific
POST /api/v1/hash/blake2      # BLAKE2 specific
POST /api/v1/hash/batch       # Batch hashing
```

### Verification
```
POST /api/v1/verify           # Verify hash
GET  /api/v1/hash/:id         # Get hash details
```

### Management
```
GET  /api/v1/algorithms       # List supported algorithms
GET  /api/v1/stats            # Usage statistics
```

---

## Docker Configuration

### Ports
- **8001:** API service (internal)
- **3001:** Nginx proxy (external)

### Environment Variables
```env
# Application
CODEXHASH_ENV=production
CODEXHASH_DEBUG=false
CODEXHASH_PORT=8001
CODEXHASH_HOST=0.0.0.0

# Database
DB_HOST=172.104.24.82
DB_PORT=5432
DB_NAME=codex_main
DB_USER=codex_admin
DB_PASSWORD=<from codex_admin .env>

# Redis
REDIS_HOST=redis-prod
REDIS_PORT=6379
REDIS_DB=2

# Security
API_KEY_REQUIRED=false
CORS_ORIGINS=https://web3connected.com,https://codexadmin.web3connected.com

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/codexhash.log
```

---

## Docker Compose Services

### Development (docker-compose.yml)
```yaml
services:
  codexhash-api:
    build: .
    ports:
      - "8001:8001"
    volumes:
      - ./src:/app/src
      - ./logs:/app/logs
    environment:
      - CODEXHASH_ENV=development
      - CODEXHASH_DEBUG=true
```

### Production (docker-compose.production.yml)
```yaml
services:
  codexhash-api:
    image: web3connected/codexhash-api:latest
    container_name: codexhash-api
    restart: unless-stopped
    ports:
      - "8001:8001"
    networks:
      - codex-net
    environment:
      - CODEXHASH_ENV=production
    env_file:
      - .env.production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Nginx Configuration

### Option 1: Shared Nginx (web3connected_nginx)
Add to existing nginx config:
```nginx
# CodexHash API
upstream codexhash_api {
    server codexhash-api:8001;
}

server {
    listen 443 ssl http2;
    server_name codexhash.web3connected.com;
    
    ssl_certificate /etc/letsencrypt/live/web3connected.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/web3connected.com/privkey.pem;
    
    location / {
        proxy_pass http://codexhash_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://codexhash_api/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: Dedicated Nginx Container
Separate nginx container for codexhash only.

---

## Implementation Steps

### Phase 1: Basic Structure ✅ (Next)
1. Create directory structure
2. Set up FastAPI skeleton
3. Implement health check endpoint
4. Create Dockerfile
5. Test locally with docker-compose

### Phase 2: Core Hashing
1. Implement hashing algorithms (SHA-256, SHA-512, BLAKE2)
2. Add input validation
3. Create POST /api/v1/hash endpoint
4. Add unit tests
5. Test with Postman/curl

### Phase 3: Database Integration
1. Connect to PostgreSQL (codex_main)
2. Use existing codexhash_usage_logs table
3. Create codexhash_operations table
4. Log all operations
5. Implement GET /api/v1/hash/:id

### Phase 4: Web UI
1. Create simple HTML/JS frontend
2. Hash input form
3. Results display
4. Copy to clipboard
5. History view

### Phase 5: Production Deployment
1. Build production Docker image
2. Configure production .env
3. Update nginx configuration
4. Deploy to 45.79.180.207
5. Update Cloudflare DNS
6. Test live endpoint
7. Monitor logs

### Phase 6: Integration
1. Test from CodexAdmin dashboard
2. Verify status badge updates
3. Confirm UI link works
4. Check usage logging
5. Validate metrics display

---

## Testing Checklist

### Local Development
- [ ] Health check responds
- [ ] Basic hash operation works
- [ ] Database logging functions
- [ ] Error handling works
- [ ] UI loads and submits

### Production
- [ ] HTTPS works
- [ ] DNS resolves correctly
- [ ] API endpoints accessible
- [ ] Database connection stable
- [ ] Redis caching works
- [ ] Logs writing correctly
- [ ] Health checks passing
- [ ] CodexAdmin dashboard shows green status

---

## Dependencies (requirements.txt)

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9
redis==5.0.1
httpx==0.26.0
python-multipart==0.0.6
```

---

## Migration from Existing CodexHash

### Source Files
Current location: `/home/web3codex/projects/NextJs/codexhash/backend/`

### What to Migrate
- [ ] Review existing Python code
- [ ] Copy hashing algorithms
- [ ] Migrate API endpoints
- [ ] Adapt to FastAPI structure
- [ ] Update dependencies
- [ ] Test compatibility

### What's New
- Integrated with codex_main database
- Uses shared Redis instance
- Reports to CodexAdmin dashboard
- Unified logging with other services

---

## Security Considerations

1. **Input Validation:** Sanitize all inputs
2. **Rate Limiting:** Implement per-IP limits
3. **API Keys:** Optional for public endpoints
4. **CORS:** Restrict to known origins
5. **SQL Injection:** Use parameterized queries
6. **Logging:** Don't log sensitive data

---

## Monitoring & Alerts

### Metrics to Track
- Request count per minute
- Average response time
- Success/error rate
- Active connections
- Memory usage
- CPU usage

### Health Check
- Database connectivity
- Redis connectivity
- Disk space
- Response time < 200ms

---

## Future Enhancements

1. **Quantum-Resistant Algorithms**
   - Post-quantum cryptography
   - Lattice-based hashing

2. **Advanced Features**
   - Webhook notifications
   - Batch processing queues
   - Hash comparison tool
   - API key management

3. **Performance**
   - Caching layer
   - Load balancing
   - Horizontal scaling

4. **Analytics**
   - Usage dashboards
   - Cost analysis
   - Performance metrics

---

## Related Documentation
- [CodexAdmin Dashboard](ADMINLTE_BUILD_FIX.md)
- [Database Schema](codex_main_schema.md)
- [Deployment Guide](CODEX_UNIVERSAL_SETUP_COMPLETE.md)

---

## Notes
- Service will integrate with existing CodexAdmin dashboard
- Uses shared PostgreSQL and Redis from codex_admin setup
- Designed for horizontal scaling if needed
- Frontend UI is optional - API-first approach
