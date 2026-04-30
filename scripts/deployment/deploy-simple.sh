#!/bin/bash

# CodexAuth Simple Deployment Script
# This bypasses the complex frontend build issue

set -e

echo "🚀 CodexAuth Simple Deployment Starting..."

# Deploy backend first
echo "🐍 Deploying Backend..."
ssh -i ~/.ssh/id_rsa forge@45.79.180.207 << 'EOF'
    cd ~/codexauth.io
    echo "📥 Pulling latest code..."
    git reset --hard
    git pull origin main
    
    echo "🐍 Setting up Python backend..."
    cd backend
    pip3 install -r requirements.txt --user
    
    echo "🔧 Creating simple frontend..."
    cd ~/codexauth.io
    cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodexAuth - Quantum-Resistant Hashing</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 2rem; background: #0a0a0a; color: #fff; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #00ff88; margin-bottom: 0.5rem; }
        .subtitle { color: #888; margin-bottom: 2rem; }
        .hash-form { background: #111; padding: 2rem; border-radius: 8px; margin: 2rem 0; }
        input, textarea { width: 100%; padding: 1rem; margin: 0.5rem 0; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; }
        button { background: #00ff88; color: #000; padding: 1rem 2rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #00cc66; }
        .result { background: #001a0a; border: 1px solid #00ff88; padding: 1rem; margin: 1rem 0; border-radius: 4px; word-break: break-all; }
        .api-info { background: #1a1a1a; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
        .status { padding: 0.5rem; border-radius: 4px; margin: 1rem 0; }
        .status.success { background: #001a0a; border: 1px solid #00ff88; }
        .status.error { background: #1a0000; border: 1px solid #ff4444; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 CodexAuth</h1>
        <p class="subtitle">Quantum-Resistant Hashing System</p>
        
        <div class="api-info">
            <h3>🔗 API Status</h3>
            <div id="api-status" class="status">Checking backend...</div>
            <p><strong>Backend API:</strong> <code id="api-url">http://localhost:8001</code></p>
        </div>
        
        <div class="hash-form">
            <h3>Generate Hash</h3>
            <textarea id="input" placeholder="Enter text to hash..." rows="3"></textarea>
            <input type="text" id="salt" placeholder="Salt (optional)">
            <input type="number" id="tiu" placeholder="TIU (default: 0.618034)" step="0.000001" value="0.618034">
            <input type="number" id="iterations" placeholder="Iterations (default: 16)" value="16">
            <button onclick="generateHash()">Generate Hash</button>
        </div>
        
        <div id="result"></div>
    </div>

    <script>
        const API_URL = window.location.origin + '/api';
        document.getElementById('api-url').textContent = API_URL;
        
        // Check API status
        async function checkApiStatus() {
            try {
                const response = await fetch(API_URL + '/health');
                if (response.ok) {
                    document.getElementById('api-status').innerHTML = '✅ Backend API is running';
                    document.getElementById('api-status').className = 'status success';
                } else {
                    throw new Error('API not responding');
                }
            } catch (error) {
                document.getElementById('api-status').innerHTML = '❌ Backend API is offline';
                document.getElementById('api-status').className = 'status error';
            }
        }
        
        // Generate hash
        async function generateHash() {
            const input = document.getElementById('input').value;
            const salt = document.getElementById('salt').value || undefined;
            const tiu = parseFloat(document.getElementById('tiu').value) || 0.618034;
            const iterations = parseInt(document.getElementById('iterations').value) || 16;
            
            if (!input.trim()) {
                alert('Please enter text to hash');
                return;
            }
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<div class="status">⏳ Generating hash...</div>';
            
            try {
                const response = await fetch(API_URL + '/hash', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input, salt, tiu, iterations })
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                const result = await response.json();
                
                resultDiv.innerHTML = \`
                    <div class="result">
                        <h4>✅ Hash Generated</h4>
                        <p><strong>Hash:</strong> \${result.hash}</p>
                        <p><strong>Salt:</strong> \${result.salt}</p>
                        <p><strong>Algorithm:</strong> \${result.meta.algo}</p>
                        <p><strong>Iterations:</strong> \${result.meta.iterations}</p>
                        <p><strong>Duration:</strong> \${result.meta.durationMs}ms</p>
                        <p><strong>Quantum Resistance:</strong> \${result.meta.quantumResistance}/10</p>
                    </div>
                \`;
            } catch (error) {
                resultDiv.innerHTML = \`
                    <div class="status error">
                        <h4>❌ Error</h4>
                        <p>\${error.message}</p>
                    </div>
                \`;
            }
        }
        
        // Check API status on load
        checkApiStatus();
        setInterval(checkApiStatus, 30000); // Check every 30 seconds
    </script>
</body>
</html>
HTML
    
    echo "🔄 Setting up backend proxy..."
    # Create nginx configuration for API proxy
    cat > ~/codexauth.io/nginx.conf << 'NGINX'
server {
    listen 80;
    server_name codexauth.io;
    root /home/forge/codexauth.io;
    index index.html;
    
    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to Python backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
    
    echo "🔄 Starting backend service..."
    cd ~/codexauth.io/backend
    pkill -f uvicorn || true
    nohup python3 -m uvicorn src.main:app --host 127.0.0.1 --port 8001 > ~/codexauth.io/backend.log 2>&1 &
    
    echo "✅ Simple deployment complete!"
    echo "📍 Frontend: https://codexauth.io"
    echo "🔗 API: https://codexauth.io/api/health"
EOF

echo "✅ CodexAuth deployment complete!"
echo "🌐 Visit: https://codexauth.io"