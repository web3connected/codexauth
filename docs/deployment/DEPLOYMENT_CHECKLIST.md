# CodexHash.io Deployment Checklist
# Complete deployment guide for quantum-resistant hashing service

## 🎯 Pre-Deployment Requirements

### ✅ Completed Tasks
- [x] **Backend Implementation** - FastAPI with harmonic hashing algorithm
- [x] **Docker Configuration** - Production Dockerfile and docker-compose.prod.yml
- [x] **Nginx Configuration** - Reverse proxy with SSL, rate limiting, CORS
- [x] **CI/CD Pipeline** - GitHub Actions workflow for automated deployment
- [x] **Security Hardening** - Environment variables, non-root user, health checks
- [x] **API Documentation** - Interactive FastAPI docs and comprehensive endpoints
- [x] **Landing Page** - Professional Web3Connected branding with live demos

### 🔲 Pending Tasks

#### 1. Domain & DNS Setup
- [ ] **DNS Configuration**
  ```bash
  # Add A record in domain registrar:
  # codexhash.io → 45.79.180.207
  # www.codexhash.io → 45.79.180.207
  ```
- [ ] **Verify DNS Propagation**
  ```bash
  dig codexhash.io
  nslookup codexhash.io
  ```

#### 2. Laravel Forge SSL Setup
- [ ] **Add Domain to Forge**
  - Login to Laravel Forge
  - Navigate to server 45.79.180.207
  - Add new site: codexhash.io
  - Set document root: /home/forge/codexhash.io/public
- [ ] **Enable SSL Certificate**
  - Go to SSL tab for codexhash.io
  - Click "LetsEncrypt"
  - Add domains: codexhash.io, www.codexhash.io
  - Enable auto-renewal

#### 3. GitHub Repository Secrets
- [ ] **Configure Deployment Secrets**
  ```
  Repository: web3connected/projects
  Settings → Secrets and variables → Actions
  
  Required secrets:
  - FORGE_SERVER_IP: 45.79.180.207
  - FORGE_SERVER_USER: forge
  - FORGE_SSH_PRIVATE_KEY: [Private SSH key for forge user]
  ```

#### 4. Server Preparation
- [ ] **Connect to server and prepare directories**
  ```bash
  ssh forge@45.79.180.207
  sudo mkdir -p /home/forge/codexhash.io
  sudo mkdir -p /home/forge/backups/codexhash
  sudo chown -R forge:forge /home/forge/codexhash.io
  sudo chown -R forge:forge /home/forge/backups/codexhash
  
  # Ensure codex-net Docker network exists
  docker network ls | grep codex-net || docker network create codex-net
  ```

#### 5. Initial Deployment
- [ ] **Trigger GitHub Actions Deployment**
  ```bash
  # Method 1: Push to main branch
  git add .
  git commit -m "Deploy CodexHash to production"
  git push origin main
  
  # Method 2: Manual workflow dispatch
  # Go to GitHub → Actions → Deploy CodexHash to Production → Run workflow
  ```

#### 6. Post-Deployment Verification
- [ ] **Health Checks**
  ```bash
  # Test endpoints
  curl -f https://codexhash.io/health
  curl -X POST https://codexhash.io/hash \
    -H "Content-Type: application/json" \
    -d '{"data": "test message"}'
  ```
- [ ] **SSL Verification**
  ```bash
  # Check SSL certificate
  openssl s_client -connect codexhash.io:443 -servername codexhash.io
  
  # Verify HTTPS redirect
  curl -I http://codexhash.io
  ```
- [ ] **Container Status**
  ```bash
  ssh forge@45.79.180.207
  cd /home/forge/codexhash.io/backend
  docker compose -f docker-compose.prod.yml ps
  docker compose -f docker-compose.prod.yml logs codex-hash-backend
  ```

---

## 🚀 Deployment Commands

### Quick Deployment (After setup)
```bash
# 1. Update code
git add .
git commit -m "Update CodexHash service"
git push origin main

# 2. Monitor deployment
# GitHub → Actions → Watch deployment progress

# 3. Verify deployment
curl -f https://codexhash.io/health
```

### Manual Server Deployment (Backup method)
```bash
# Connect to server
ssh forge@45.79.180.207

# Navigate to deployment directory
cd /home/forge/codexhash.io

# Pull latest code (if using git method)
git pull origin main

# Build and deploy
cd backend
docker compose -f docker-compose.prod.yml down
docker build -f Dockerfile.production -t codex-hash:latest .
docker compose -f docker-compose.prod.yml up -d

# Verify
docker compose -f docker-compose.prod.yml ps
curl -f http://localhost:8001/health
```

---

## 🔧 Troubleshooting Guide

### SSL Certificate Issues
```bash
# Check certificate status in Forge
# Re-run Let's Encrypt if needed
# Verify nginx configuration has correct paths

# Manual certificate verification
sudo certbot certificates
sudo nginx -t
sudo systemctl reload nginx
```

### Docker Container Issues
```bash
# Check container logs
docker compose -f docker-compose.prod.yml logs codex-hash-backend

# Restart containers
docker compose -f docker-compose.prod.yml restart

# Rebuild if needed
docker compose -f docker-compose.prod.yml down
docker build -f Dockerfile.production -t codex-hash:latest .
docker compose -f docker-compose.prod.yml up -d
```

### Network Issues
```bash
# Verify Docker network
docker network ls | grep codex-net
docker network inspect codex-net

# Check port availability
netstat -tulpn | grep :8001
```

### GitHub Actions Issues
```bash
# Check deployment logs in GitHub Actions
# Verify secrets are set correctly
# Test SSH connection manually:
ssh forge@45.79.180.207 "echo 'Connection successful'"
```

---

## 📊 Success Metrics

### ✅ Deployment Complete When:
- [ ] **HTTPS Access**: https://codexhash.io loads with valid SSL
- [ ] **Health Check**: https://codexhash.io/health returns 200 OK
- [ ] **API Functionality**: Hash generation/verification endpoints work
- [ ] **Landing Page**: Professional page with live hash demonstrations
- [ ] **Auto-Redirect**: HTTP → HTTPS redirect functional
- [ ] **Container Health**: Docker containers running and healthy
- [ ] **Rate Limiting**: API rate limits active and working
- [ ] **CORS Headers**: Cross-origin requests properly handled

### 📈 Performance Targets:
- **Response Time**: <200ms average
- **Uptime**: 99.9% target
- **Hash Generation**: <50ms per hash
- **SSL Grade**: A+ rating on SSL Labs
- **Container Health**: Healthy status maintained

---

## 🔄 Next Steps After Deployment

1. **Monitor Performance** - Set up alerts for downtime/errors
2. **Update Documentation** - Add CodexHash to ecosystem progress
3. **Test Integration** - Verify API endpoints with real workloads
4. **Plan CodexIdentity** - Begin next phase of ecosystem deployment
5. **Optimize Performance** - Fine-tune based on production metrics

---

## 📞 Support Contacts

- **Server Management**: Laravel Forge dashboard
- **DNS Management**: Domain registrar control panel
- **Repository**: https://github.com/web3connected/projects
- **Documentation**: /docs/CODEX_ECOSYSTEM_PROGRESS.md

## 🎉 Celebration Message
"CodexHash.io: Quantum-resistant hashing powered by harmonic algorithms and physics constants - another milestone in the Web3Connected ecosystem!"
