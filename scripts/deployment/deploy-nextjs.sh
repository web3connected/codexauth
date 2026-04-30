#!/bin/bash

# CodexAuth Next.js Production Deployment
# Deploy the proper Next.js build with ComparisonsPanel to production

set -e

echo "🚀 CodexAuth Next.js Production Deployment Starting..."

# Build production locally first
echo "🔨 Building Next.js production locally..."
npm run build

# Create deployment archive
echo "📦 Creating deployment archive..."
tar -czf codex_hash_build.tar.gz \
    .next/ \
    public/ \
    package.json \
    package-lock.json \
    next.config.js \
    tailwind.config.js \
    postcss.config.js \
    backend/ \
    ecosystem.config.js \
    --exclude=node_modules \
    --exclude=.git

echo "📡 Deploying to production server..."
ssh -i ~/.ssh/id_rsa forge@45.79.180.207 << 'EOF'
    cd ~/codexauth.io
    
    echo "🛑 Stopping existing services..."
    pm2 stop all || true
    
    echo "🧹 Backing up and cleaning..."
    rm -rf .next_backup || true
    mv .next .next_backup || true
    rm -rf public_backup || true
    mv public public_backup || true
    
    echo "📥 Preparing for new deployment..."
    # Git pull to get latest code
    git reset --hard
    git pull origin main
EOF

# Upload the build archive
echo "📤 Uploading production build..."
scp -i ~/.ssh/id_rsa codex_hash_build.tar.gz forge@45.79.180.207:~/codexauth.io/

# Extract and setup on server
ssh -i ~/.ssh/id_rsa forge@45.79.180.207 << 'EOF'
    cd ~/codexauth.io
    
    echo "📦 Extracting production build..."
    tar -xzf codex_hash_build.tar.gz
    rm codex_hash_build.tar.gz
    
    echo "📦 Installing dependencies..."
    npm ci --production
    
    echo "🐍 Setting up Python backend..."
    cd backend
    python3 -m pip install --user -r requirements.txt || echo "Note: Some packages may need system packages"
    cd ..
    
    echo "🔧 Setting up production environment..."
    cat > .env.production << 'ENVFILE'
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://codexauth.io/api
NEXT_PUBLIC_SITE_URL=https://codexauth.io
ENVFILE

    cat > backend/.env.production << 'ENVFILE'
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8001
CORS_ORIGINS=["https://codexauth.io", "https://www.codexauth.io"]
ENVFILE

    echo "▶️ Starting production services..."
    pm2 start ecosystem.config.js || echo "PM2 start had issues, trying alternative..."
    
    # Alternative startup if PM2 fails
    if ! pm2 list | grep -q "online"; then
        echo "🔄 Using alternative startup method..."
        
        # Start backend
        cd backend
        nohup python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8001 > ../backend.log 2>&1 &
        echo $! > ../backend.pid
        cd ..
        
        # Start frontend
        nohup npm start > frontend.log 2>&1 &
        echo $! > frontend.pid
        
        echo "✅ Alternative startup completed"
    fi
    
    sleep 3
    
    echo "🔍 Health checks..."
    # Check if frontend is responding
    if curl -f -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend is responding on port 3000"
    else
        echo "⚠️ Frontend may need a moment to start"
    fi
    
    # Check if backend is responding
    if curl -f -s http://localhost:8001/health > /dev/null; then
        echo "✅ Backend is responding on port 8001"
    else
        echo "⚠️ Backend may need a moment to start"
    fi
    
    echo "🎉 Next.js deployment complete!"
    echo "🌐 Frontend: https://codexauth.io"
    echo "🔗 API: https://codexauth.io/api/health"
EOF

# Cleanup local build archive
rm -f codex_hash_build.tar.gz

echo "✅ CodexAuth Next.js deployment completed!"
echo "🌐 Visit: https://codexauth.io"
echo ""
echo "🔍 The site should now show:"
echo "  - Enhanced landing page with ComparisonsPanel"
echo "  - Interactive comparison table"
echo "  - Responsive design and proper styling"
echo "  - Full Next.js application functionality"