#!/bin/bash

# CodexAuth.io Forge Deployment Script
# This script will be used in Laravel Forge deployment

set -e

echo "🚀 Starting CodexAuth.io deployment..."

cd $FORGE_SITE_PATH

# Pull latest changes
git pull origin $FORGE_SITE_BRANCH

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm ci --production=false

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Install Python dependencies for backend
echo "🐍 Installing Python dependencies..."
cd backend
pip3 install -r requirements.txt --user
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 stop ecosystem.config.js || true

# Start processes with PM2
echo "▶️ Starting CodexAuth services..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Generate PM2 startup script if needed
pm2 startup || true

echo "✅ CodexAuth.io deployment completed successfully!"

# Health check
sleep 5
echo "🔍 Performing health checks..."

# Check frontend
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend health check failed"
fi

# Check backend
if curl -f -s http://localhost:8001/health > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend health check failed"
fi

echo "🎉 Deployment complete! CodexAuth.io is live!"