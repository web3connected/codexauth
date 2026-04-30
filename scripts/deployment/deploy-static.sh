#!/bin/bash

echo "🚀 Starting CodexAuth Static Deployment..."

# Exit on any error
set -e

# Build Next.js application locally
echo "📦 Building Next.js application..."
cd /home/web3codex/projects/codex_hash

# Set production environment variables for build
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://codexauth.io/api
export NEXT_PUBLIC_SITE_URL=https://codexauth.io

# Clean and build
rm -rf .next out
npm run build

# Check if we need to export static files
if [ ! -d "out" ]; then
    echo "📤 Exporting static files..."
    npx next export
fi

# Create deployment package
echo "📦 Creating deployment package..."
cd out
tar -czf ../codexauth-static.tar.gz .
cd ..

# Deploy to production server
echo "🌐 Deploying to production server..."
scp codexauth-static.tar.gz forge@45.79.180.207:/tmp/

# Extract on production server and update files
ssh forge@45.79.180.207 << 'EOF'
    cd /home/forge/codexauth.io
    
    # Backup current index.html
    cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)
    
    # Extract new static files
    cd /tmp
    tar -xzf codexauth-static.tar.gz
    
    # Copy the main index.html to the site root
    cp index.html /home/forge/codexauth.io/
    
    # Copy any other static assets
    if [ -d "_next" ]; then
        cp -r _next /home/forge/codexauth.io/
    fi
    
    # Clean up
    rm -rf /tmp/codexauth-static.tar.gz /tmp/_next /tmp/index.html
    
    echo "✅ Static files deployed successfully"
EOF

# Clean up local files
rm -f codexauth-static.tar.gz

echo "🎉 Deployment completed successfully!"
echo "🌐 Site is available at: https://codexauth.io"