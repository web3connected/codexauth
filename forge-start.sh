#!/usr/bin/env bash

cd /home/forge/codexauth.io/current

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm ci
fi

# Build if .next doesn't exist
if [ ! -d ".next" ]; then
    npm run build
fi

# Set environment
export PORT="${PORT:-3004}"
export NODE_ENV="production"

# Start with PM2
pm2 delete codexauth 2>/dev/null || true
pm2 start ecosystem.config.js --only codexauth-prod
pm2 save
