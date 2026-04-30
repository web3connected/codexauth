module.exports = {
  apps: [
    {
      name: 'codexauth-frontend-local',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/web3codex/projects/codex_hash',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:8001',
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3000'
      },
      error_file: '/home/web3codex/projects/codex_hash/logs/frontend-error.log',
      out_file: '/home/web3codex/projects/codex_hash/logs/frontend-out.log',
      log_file: '/home/web3codex/projects/codex_hash/logs/frontend-combined.log',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: true,
      ignore_watch: ['node_modules', '.next', 'logs'],
      max_memory_restart: '512M'
    },
    {
      name: 'codexauth-backend-local',
      script: 'uvicorn',
      args: 'src.main:app --host 0.0.0.0 --port 8001 --reload',
      cwd: '/home/web3codex/projects/codex_hash/backend',
      env: {
        ENVIRONMENT: 'development',
        API_HOST: '0.0.0.0',
        API_PORT: '8001',
        CORS_ORIGINS: '["http://localhost:3000", "http://127.0.0.1:3000"]'
      },
      error_file: '/home/web3codex/projects/codex_hash/logs/backend-error.log',
      out_file: '/home/web3codex/projects/codex_hash/logs/backend-out.log',
      log_file: '/home/web3codex/projects/codex_hash/logs/backend-combined.log',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M'
    }
  ]
};