#!/bin/bash

# CodexAuth.io — Forge Auto-Deploy Script
# Triggered by Forge on every push to main
# Runs as: forge user on CodexWeb3 (172.104.27.176)

set -e

echo "🚀 Starting CodexAuth.io deployment..."

cd $FORGE_SITE_PATH

# Install Node.js dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build Next.js
echo "🔨 Building Next.js..."
npm run build

# Create logs directory
mkdir -p logs

# Ensure PM2 is available
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Restart or start PM2 prod process
echo "♻️ Restarting PM2 process..."
pm2 describe codexauth-prod > /dev/null 2>&1 \
    && pm2 restart codexauth-prod \
    || pm2 start ecosystem.config.js --only codexauth-prod

pm2 save

echo "✅ CodexAuth.io deployed!"

# Health check
sleep 3
if curl -fs http://localhost:3003 > /dev/null; then
    echo "✅ Site is responding on port 3003"
else
    echo "⚠️  Health check: no response on :3003 yet (may still be starting)"
fi

echo "🎉 Deployment complete! CodexAuth.io is live!"