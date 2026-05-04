#!/bin/bash
# CodexAuth SSH Deploy Script
# Builds locally, copies via scp, restarts PM2 on server
# Usage: bash scripts/deployment/deploy-ssh.sh

set -e

SERVER="forge@172.104.27.176"
SERVER_PATH="~/codexauth.io"
SSH_KEY="${SSH_KEY:-~/.ssh/codexweb3-ssh}"
APP_NAME="codexauth-prod"
PORT=3004
ARCHIVE="codexauth_build.tar.gz"

echo "🚀 CodexAuth SSH Deploy"
echo "   Server : $SERVER"
echo "   Path   : $SERVER_PATH"
echo "   SSH key: $SSH_KEY"
echo "   PM2    : $APP_NAME"
echo "   Port   : $PORT"
echo ""

# ── 1. Build locally ──────────────────────────────────────────────────────────
echo "📦 Installing dependencies..."
npm ci --production=false

echo "🏗️  Building Next.js..."
NEXT_PUBLIC_API_URL=https://codexauth.io/api \
NEXT_PUBLIC_SITE_URL=https://codexauth.io \
NODE_ENV=production \
npm run build

echo "✅ Build complete"
echo ""

# ── 2. Pack the build ─────────────────────────────────────────────────────────
echo "📦 Creating deployment archive..."
tar -czf "$ARCHIVE" \
    --exclude='node_modules' \
    --exclude='.git' \
    .next/ \
    public/ \
    src/ \
    package.json \
    package-lock.json \
    next.config.ts \
    tailwind.config.ts \
    postcss.config.mjs \
    tsconfig.json \
    ecosystem.config.js

echo "✅ Archive created: $ARCHIVE"
echo ""

# ── 3. Copy to server ─────────────────────────────────────────────────────────
echo "📤 Copying archive to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$ARCHIVE" "$SERVER:~/"

echo "✅ Files copied"
echo ""

# ── 4. Extract + restart PM2 on server ───────────────────────────────────────
echo "🔄 Deploying on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER" << ENDSSH
set -e
cd $SERVER_PATH

echo "📦 Extracting build..."
tar -xzf ~/$ARCHIVE
rm -f ~/$ARCHIVE

echo "📦 Installing server dependencies..."
npm ci --production=false

echo "🛑 Stopping existing PM2 processes..."
pm2 stop codexauth-dev  2>/dev/null || true
pm2 delete codexauth-dev 2>/dev/null || true
pm2 stop codexauth      2>/dev/null || true
pm2 delete codexauth     2>/dev/null || true
pm2 stop $APP_NAME      2>/dev/null || true
pm2 delete $APP_NAME     2>/dev/null || true

mkdir -p logs

echo "▶️  Starting $APP_NAME on port $PORT..."
pm2 start ecosystem.config.js --only $APP_NAME
pm2 save

echo "⏳ Waiting for app..."
sleep 8

if curl -sf http://localhost:$PORT > /dev/null; then
    echo "✅ $APP_NAME is live on port $PORT"
else
    echo "❌ Health check failed — logs:"
    pm2 logs $APP_NAME --lines 30 --nostream
    exit 1
fi
ENDSSH

# ── 5. Cleanup local archive ──────────────────────────────────────────────────
rm -f "$ARCHIVE"

echo ""
echo "🎉 CodexAuth deployed → https://codexauth.io"
