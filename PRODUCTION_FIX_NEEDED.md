# CodexHash Production Deployment - Fix for Prelaunch Signup

## Issue
The production site at https://codexhash.io is running but the `/api/prelaunch-signup` endpoint is failing with a 500 error because the database environment variables are not configured.

## Solution

The production server needs the `.env` file with database credentials. Since direct SSH access requires special configuration, here are the options:

### Option 1: Via Laravel Forge Panel (Recommended)

1. Login to Laravel Forge: https://forge.laravel.com
2. Navigate to the **CodexHash** site
3. Go to **Environment** tab
4. Add/update these variables:

```env
DB_CONNECTION=pgsql
DB_HOST=172.104.24.82
DB_PORT=5432
DB_DATABASE=codex_main
DB_USERNAME=codex_admin
DB_PASSWORD=7yQ4xR8kP9wN2mL5vB6tE3zF1jK0dA9sG7hU4nM8xC2qW6
DATABASE_URL=postgresql://codex_admin:7yQ4xR8kP9wN2mL5vB6tE3zF1jK0dA9sG7hU4nM8xC2qW6@172.104.24.82:5432/codex_main?schema=public
```

4. Click **Save Environment**
5. Restart the site

### Option 2: Via GitHub Actions (Alternative)

Add these as GitHub Secrets and update the deploy workflow to inject them.

### Option 3: Direct Server Access

If you have access credentials:

```bash
# Connect via your configured method
# Then run:
cd /home/forge/codexhash.io
nano .env

# Add the database variables above
# Save and restart:
pm2 restart codexhash
```

## Verification

After updating the environment variables, test the endpoint:

```bash
curl -X POST https://codexhash.io/api/prelaunch-signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{"success":true,"message":"Thank you for joining our pre-launch!","alreadyExists":false}
```

## Notes

- The database table `prelaunch_signups` already exists in `codex_main` database
- The database is shared across all Codex sites (see `_docs/SHARED_DATABASE_ARCHITECTURE.md`)
- Local development is working correctly - only production needs the env vars
