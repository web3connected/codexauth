#!/bin/bash

# CodexAuth Stop Script
# Stops both frontend and backend services
# Usage: ./stop_codexauth.sh [--pm2]

USE_PM2=false
if [ "$1" = "--pm2" ]; then
    USE_PM2=true
fi

echo "🛑 Stopping CodexAuth Application..."

if [ "$USE_PM2" = true ]; then
    echo "📦 Stopping PM2 processes..."
    pm2 stop ecosystem.local.config.js || true
    pm2 delete ecosystem.local.config.js || true
else
    echo "🔧 Stopping development processes..."
    
    # Find and stop processes
    FRONTEND_PIDS=$(pgrep -f "next dev -p 3000")
    BACKEND_PIDS=$(pgrep -f "uvicorn.*8001")

if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "🌐 Stopping Frontend processes: $FRONTEND_PIDS"
    kill $FRONTEND_PIDS
    echo "✅ Frontend stopped"
else
    echo "⚠️  No frontend processes found"
fi

if [ ! -z "$BACKEND_PIDS" ]; then
    echo "🔗 Stopping Backend processes: $BACKEND_PIDS"
    kill $BACKEND_PIDS
    echo "✅ Backend stopped"
else
    echo "⚠️  No backend processes found"
fi

# Wait a moment for processes to terminate
sleep 2

echo ""
echo "✅ CodexAuth Application stopped"
fi

# Check if any are still running
REMAINING=$(pgrep -f "(next dev -p 3000|uvicorn.*8001)")
if [ ! -z "$REMAINING" ]; then
    echo "⚠️  Some processes still running, force killing: $REMAINING"
    kill -9 $REMAINING
fi

echo ""
echo "✅ CodexAuth Application stopped"
echo "🚀 To start again, run: ./start_codexauth.sh"