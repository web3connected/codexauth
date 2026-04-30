CodexHash Installation Plan - Step by Step
Architecture Overview
codexhash.web3connected.com → Service API (codex_admin Laravel app)
codexhash.io → Developer Portal (Archived/codex_hash Next.js site)
Installation Phases
Phase 1: Audit Current State

Check packages/web3codex/codexhash/ structure
Verify namespace and autoload configuration
Phase 2: Fix Namespace & Autoload

Run composer dump-autoload
Verify service provider registration
Phase 3: Register Service Provider

Add CodexHashServiceProvider to bootstrap
Ensure proper container binding
Phase 4: Fix SaaSServiceProvider

Update SaaSServiceProvider.php
Fix CodexHashService dependency injection
Phase 5: Test Service Resolution

Use tinker to verify service instantiation
Confirm no binding errors
Phase 6: Configure Environment

Set CODEX_HASH_* variables in .env.local
Clear Laravel caches
Phase 7: Test API Endpoints

Test /api/codexhash/* routes (hash, verify, health)
Verify JSON responses
Phase 8: Test SaaS Endpoints

Test /api/saas/codexhash/* routes
Check admin dashboard access
Phase 9: Database Tables

Create migrations for hash_jobs, verifications tracking
Run migrations
Phase 10: Deploy Portal

Move Archived/codex_hash to production
Point to service API
Deploy to hosting
Ready to begin Phase 1 when you're ready.