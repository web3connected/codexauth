# CodexHash GitHub Actions Setup

## 🚀 Deployment Workflows

We've created GitHub Actions workflows that match your existing codex_time deployment patterns:

### 1. Main Deployment Workflow: `deploy.yml`
- **Trigger**: Push to `main` branch
- **Features**: 
  - Full testing and building
  - Production deployment with health checks
  - Nginx configuration
  - SSL certificate setup
  - Comprehensive error handling

### 2. Simple Deployment: `deploy-simple.yml` 
- **Trigger**: Push to `main` branch
- **Features**: Quick deployment matching codex_time style
- **Minimal steps**: Pull, build, restart services

### 3. CI Testing: `ci.yml`
- **Trigger**: Push to `main`/`develop`, PRs to `main`
- **Features**: 
  - ESLint and TypeScript checking
  - Backend import testing
  - Hash algorithm testing
  - Build verification

### 4. Production Release: `release.yml`
- **Trigger**: Manual dispatch or GitHub releases
- **Features**: 
  - Production-optimized deployment
  - Health checks and verification
  - Deployment summary generation

## 🔧 Required GitHub Secrets

Add these secrets in your GitHub repository settings:

```
DEPLOY_HOST: 45.79.180.207
DEPLOY_USER: forge
DEPLOY_PRIVATE_KEY: [Your SSH private key]
```

## 📂 Project Structure for Deployment

The workflows expect this structure:
```
codexhash.io/
├── src/                     # Next.js source code
├── backend/                 # FastAPI backend
├── public/                  # Static assets
├── package.json             # Node.js dependencies
├── ecosystem.config.js      # PM2 configuration
├── next.config.ts          # Next.js configuration
└── .github/workflows/      # GitHub Actions
```

## 🌐 Production URLs

After deployment:
- **Main Site**: https://codexhash.io
- **API Health**: https://codexhash.io/api/health  
- **API Docs**: https://codexhash.io/api/docs
- **Hash API**: https://codexhash.io/api/hash

## 🔄 Deployment Process

1. **Push to main** → Triggers automatic deployment
2. **Tests run** → ESLint, TypeScript, backend tests
3. **Build** → Next.js production build
4. **Deploy** → Upload to server, install dependencies
5. **Services** → Start with PM2
6. **Nginx** → Configure reverse proxy
7. **SSL** → Setup HTTPS certificates
8. **Health Checks** → Verify all services running

## 📋 PM2 Configuration

The `ecosystem.config.js` file manages both services:
- **Frontend**: Next.js on port 3000
- **Backend**: FastAPI on port 8001

## 🔧 Manual Operations

### Start Services
```bash
pm2 start ecosystem.config.js
```

### Check Status  
```bash
pm2 status
pm2 logs
```

### Restart Services
```bash
pm2 restart ecosystem.config.js
```

### Stop Services
```bash
pm2 stop ecosystem.config.js
```

## ✅ Ready for Deployment!

Your CodexHash application is now configured with GitHub Actions that match your existing deployment patterns. Simply:

1. Add the required secrets to GitHub
2. Push to the main branch
3. GitHub Actions will automatically deploy to codexhash.io

The workflows are designed to be robust with proper error handling, health checks, and rollback capabilities.