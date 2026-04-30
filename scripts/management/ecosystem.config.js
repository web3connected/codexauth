module.exports = {
  apps: [
    {
      name: 'codexauth-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/forge/codexauth.io',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://codexauth.io/api',
        NEXT_PUBLIC_SITE_URL: 'https://codexauth.io'
      },
      error_file: '/home/forge/codexauth.io/logs/frontend-error.log',
      out_file: '/home/forge/codexauth.io/logs/frontend-out.log',
      log_file: '/home/forge/codexauth.io/logs/frontend-combined.log',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'codexauth-backend',
      script: 'uvicorn',
      args: 'src.main:app --host 0.0.0.0 --port 8001 --workers 4',
      cwd: '/home/forge/codexauth.io/backend',
      env: {
        ENVIRONMENT: 'production',
        API_HOST: '0.0.0.0',
        API_PORT: '8001',
        CORS_ORIGINS: '["https://codexauth.io", "https://www.codexauth.io"]'
      },
      error_file: '/home/forge/codexauth.io/logs/backend-error.log',
      out_file: '/home/forge/codexauth.io/logs/backend-out.log',
      log_file: '/home/forge/codexauth.io/logs/backend-combined.log',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    }
  ]
};