#!/bin/bash

# CodexAuth Production Deployment Script
# Prepares and deploys CodexAuth to codexauth.io

echo "🚀 CodexAuth Production Deployment"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the codex_hash directory"
    exit 1
fi

echo "📋 Pre-deployment checklist..."

# 1. Build frontend for production
echo "🔨 Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend build successful"

# 2. Test backend functionality
echo "🧪 Testing backend functionality..."
cd backend
python3 -c "
import sys
sys.path.append('src')
try:
    from main import app
    print('✅ Backend imports successfully')
except Exception as e:
    print(f'❌ Backend import failed: {e}')
    sys.exit(1)
"
if [ $? -ne 0 ]; then
    echo "❌ Backend test failed"
    exit 1
fi
cd ..

# 3. Check environment variables
echo "🔧 Environment configuration..."
echo "Current environment:"
echo "  - NODE_ENV: ${NODE_ENV:-development}"
echo "  - API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:8001}"

# 4. Production environment setup
echo "📝 Setting up production environment..."
cat > .env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://codexauth.io/api
NEXT_PUBLIC_SITE_URL=https://codexauth.io
EOF

cat > backend/.env.production << EOF
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8001
CORS_ORIGINS=["https://codexauth.io", "https://www.codexauth.io"]
EOF

echo "✅ Production environment configured"

# 5. Create production startup script
echo "📜 Creating production startup script..."
cat > start_production.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting CodexAuth Production..."

# Start backend
cd backend
uvicorn src.main:app --host 0.0.0.0 --port 8001 --workers 4 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Start frontend
cd ..
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo "📋 Production services running:"
echo "  Backend: https://codexauth.io/api"
echo "  Frontend: https://codexauth.io"

# Save PIDs for later management
echo $BACKEND_PID > backend.pid
echo $FRONTEND_PID > frontend.pid
EOF

chmod +x start_production.sh

# 6. Create production stop script
cat > stop_production.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping CodexAuth Production..."

if [ -f "backend.pid" ]; then
    kill $(cat backend.pid) 2>/dev/null
    rm backend.pid
    echo "✅ Backend stopped"
fi

if [ -f "frontend.pid" ]; then
    kill $(cat frontend.pid) 2>/dev/null
    rm frontend.pid
    echo "✅ Frontend stopped"
fi

# Cleanup any remaining processes
pkill -f "uvicorn.*8001"
pkill -f "next start"

echo "✅ Production services stopped"
EOF

chmod +x stop_production.sh

# 7. Create nginx configuration template
echo "🌐 Creating nginx configuration..."
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name codexauth.io www.codexauth.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name codexauth.io www.codexauth.io;

    # SSL configuration (configure with your SSL provider)
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo ""
echo "🎉 Production deployment preparation complete!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Upload project to production server"
echo "2. Install dependencies: npm install && pip install -r backend/requirements.txt"
echo "3. Configure SSL certificate"
echo "4. Update nginx configuration"
echo "5. Run: ./start_production.sh"
echo ""
echo "📁 Files created:"
echo "  - .env.production (frontend environment)"
echo "  - backend/.env.production (backend environment)"
echo "  - start_production.sh (production startup)"
echo "  - stop_production.sh (production shutdown)"
echo "  - nginx.conf (web server configuration)"
echo ""
echo "🌐 After deployment, verify:"
echo "  - https://codexauth.io (main site)"
echo "  - https://codexauth.io/api/health (API health)"
echo "  - https://codexauth.io/api/docs (API documentation)"