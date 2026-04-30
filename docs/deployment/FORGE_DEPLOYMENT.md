# CodexHash.io Deployment Configuration for Laravel Forge

## Next.js Application Setup

### 1. Site Configuration in Forge
- **Root Domain**: codexhash.io
- **Project Type**: Static HTML / Nuxt.js / Next.js
- **Web Directory**: `/` (Next.js serves from root)
- **PHP Version**: Not applicable (Node.js app)
- **Allow Wildcard Sub-Domains**: ✅ Enabled (for API subdomain if needed)

### 2. Environment Variables to Set in Forge
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://codexhash.io/api
NEXT_PUBLIC_SITE_URL=https://codexhash.io
PORT=3000
```

### 3. Build Commands for Forge Deployment Script
```bash
#!/bin/bash
cd /home/forge/codexhash.io

# Install Node.js dependencies
npm ci --production=false

# Build Next.js application
npm run build

# Install Python dependencies for backend
cd backend
pip3 install -r requirements.txt
cd ..

# Restart services
pm2 restart all || true
```

### 4. Process Management (PM2 Configuration)
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'codexhash-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/forge/codexhash.io',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'codexhash-backend',
      script: 'uvicorn',
      args: 'src.main:app --host 0.0.0.0 --port 8001 --workers 4',
      cwd: '/home/forge/codexhash.io/backend',
      env: {
        ENVIRONMENT: 'production'
      }
    }
  ]
};
```

### 5. Nginx Configuration for Forge
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# API Backend
location /api/ {
    proxy_pass http://127.0.0.1:8001/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 6. Package.json Scripts Update
Ensure your package.json has the production start script:
```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  }
}
```