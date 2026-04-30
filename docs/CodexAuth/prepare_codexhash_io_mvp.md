# Task: Prepare codexhash.io for API-driven tests, demos, and basic hash tracking

**Priority:** High  
**Status:** Open  
**Created:** August 24, 2025  
**Assigned:** Development Team  
**Project Type:** New MVP Application
**Target:** Public Demo + Test Frontend for CodexHash APIs

## Problem Statement

Stand up codexhash.io as a public demo + test front end for the existing CodexHash APIs. Provide a clean UI to hit endpoints, visualize results, and persist minimal tracking data for hashed items. Shipping mindset: get a reliable, secure, polished MVP online.

## Scope Overview

### Domains & Environment
- **Production:** `codexhash.io` 
- **Staging:** `staging.codexhash.io`
- **Environment Keys:** `CODEXHASH_API_BASE`, `PUBLIC_DEMO_MODE=true`, `ANALYTICS_WRITE_KEY`, `SENTRY_DSN`
- **Security:** Enforce HTTPS, HSTS, rate-limit demo routes

### Core Components
1. **API SDK Client** (TypeScript + fetch/axios)
2. **Demo Playground** (Public `/demo` page)
3. **Basic Service Setup** (Postgres/SQLite persistence)
4. **Analytics & Tracking** (Events + Dashboard)
5. **Documentation** (`/docs` with examples)
6. **Security & Abuse Controls** (Rate limiting, CORS, CSRF)
7. **Observability** (Sentry, structured logs, uptime)

## Phase 1 - Project Setup & Infrastructure

### 1.1 Project Initialization
- [ ] Create new `codexhash-io` repository
- [ ] Setup Next.js/React TypeScript project structure
- [ ] Configure Docker containerization
- [ ] Setup environment configuration (.env templates)
- [ ] Initialize database schema (Postgres)

### 1.2 Domain & Hosting Setup  
- [ ] Configure DNS for `codexhash.io` and `staging.codexhash.io`
- [ ] Setup SSL certificates (Let's Encrypt/Cloudflare)
- [ ] Configure HTTPS enforcement and HSTS headers
- [ ] Setup staging and production environments

### 1.3 Database Schema
```sql
-- Minimal persistence schema
CREATE TABLE hash_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  algo VARCHAR(20) NOT NULL,
  input_type VARCHAR(10) NOT NULL CHECK (input_type IN ('text', 'file')),
  bytes INTEGER NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('queued', 'ok', 'fail')),
  digest TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64) NOT NULL,
  request_id VARCHAR(50)
);

CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  algo VARCHAR(20) NOT NULL,
  expected_digest TEXT NOT NULL,
  match BOOLEAN NOT NULL,
  duration_ms INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64) NOT NULL,
  request_id VARCHAR(50)
);

CREATE TABLE service_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(255) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Phase 2 - API SDK Development

### 2.1 TypeScript SDK Client
- [ ] Create `src/lib/codexhash-sdk.ts` with core methods:
  - [ ] `hash.create({algo, input, options})`
  - [ ] `hash.verify({algo, input, expected})`
  - [ ] `hash.meta(id)`
- [ ] Implement resilient retries with exponential backoff
- [ ] Add timeout handling and typed error responses
- [ ] Auto-detect supported algorithms from API

### 2.2 API Integration
- [ ] Configure base URL from `CODEXHASH_API_BASE` environment
- [ ] Implement request/response logging with request IDs
- [ ] Add performance measurement (latency tracking)
- [ ] Handle API authentication if required

## Phase 3 - Demo Playground UI

### 3.1 Demo Page (`/demo`)
- [ ] **Hash It Panel:**
  - [ ] Text/file input component
  - [ ] Algorithm selector (auto-populated)
  - [ ] Display digest, size, time, request ID
- [ ] **Verify Panel:**
  - [ ] Input digest + source verification
  - [ ] Boolean result with timing display
- [ ] **Batch Panel:**
  - [ ] CSV upload functionality
  - [ ] Stream progress indicator
  - [ ] Success/failure results display

### 3.2 Performance & Sharing
- [ ] Performance stats display (p50/p95 latency, throughput, error rate)
- [ ] Copy-to-clipboard functionality
- [ ] "Share result" link generation (short URL with request ID)
- [ ] JSON view toggle for technical users

## Phase 4 - Analytics & Tracking

### 4.1 Event Tracking
- [ ] Implement event emission:
  - [ ] `hash_job_created`
  - [ ] `hash_job_succeeded` 
  - [ ] `hash_job_failed`
  - [ ] `verify_run`
- [ ] Store events in database with metadata

### 4.2 Analytics Dashboard (`/stats`)
- [ ] Authentication-gated access
- [ ] Counters for today/7d/30d periods
- [ ] P50/P95 latency calculations
- [ ] Error rate tracking
- [ ] Top algorithms usage
- [ ] Simple line charts for trends

## Phase 5 - Documentation & Developer Experience

### 5.1 Documentation Page (`/docs`)
- [ ] **Quick Start Section:**
  - [ ] cURL examples
  - [ ] JavaScript examples
  - [ ] Python examples
- [ ] **API Reference:**
  - [ ] Endpoints table
  - [ ] Authentication details
  - [ ] Rate limits documentation
  - [ ] Status codes reference
- [ ] **Downloads:**
  - [ ] OpenAPI JSON generation
  - [ ] Postman collection export

### 5.2 Health & Status
- [ ] `/status` healthcheck endpoint
- [ ] Live API probe functionality
- [ ] Service status monitoring

## Phase 6 - Security & Abuse Controls

### 6.1 Rate Limiting
- [ ] 60 RPM per IP on demo routes
- [ ] Burst allowance configuration
- [ ] Friendly error page for rate limits
- [ ] File size caps (5MB on demo)

### 6.2 Security Headers & CORS
- [ ] CORS restriction to codexhash.io + staging
- [ ] CSRF protection for non-GET requests
- [ ] No secrets in URL policy
- [ ] Security headers implementation

## Phase 7 - UI/UX Implementation

### 7.1 Design System
- [ ] Dark-leaning theme consistent with Web3Connected palette
- [ ] Component library:
  - [ ] Algorithm selector
  - [ ] Input switch (text/file)
  - [ ] Result cards
  - [ ] Progress toasts
  - [ ] JSON view toggle

### 7.2 Accessibility
- [ ] Keyboard-first navigation
- [ ] Focus states implementation
- [ ] ARIA labels for screen readers
- [ ] High contrast mode support

## Phase 8 - Observability & Monitoring

### 8.1 Error Tracking
- [ ] Sentry integration for frontend errors
- [ ] Sentry integration for backend errors
- [ ] Error boundary components

### 8.2 Logging & Monitoring
- [ ] Structured JSON logging
- [ ] Request ID correlation
- [ ] Duration tracking for all operations
- [ ] Simple uptime ping (cron job)

## Phase 9 - DevOps & Deployment

### 9.1 Containerization
- [ ] Dockerfile optimization
- [ ] Docker Compose for local development
- [ ] One-command setup documentation

### 9.2 CI/CD Pipeline
- [ ] GitHub Actions workflow:
  - [ ] Lint → Test → Build → Push → Deploy
  - [ ] Staging deployment on PR to main
  - [ ] Production deployment on tag v*
- [ ] Smoke tests:
  - [ ] Create/verify hash functionality
  - [ ] Batch 10 items test
  - [ ] 95th percentile < 1.5s on staging

## Acceptance Criteria (Must Pass)

### Core Functionality
- [ ] `/demo` performs single + batch hashes and verify
- [ ] Shows digest, timing, request ID for all operations
- [ ] Algorithms list auto-populates from API
- [ ] Selecting unsupported algo handles gracefully (no 200s)

### Data Persistence
- [ ] `hash_jobs` and `verifications` persist metadata only
- [ ] No secrets/raw content stored when `PUBLIC_DEMO_MODE=true`
- [ ] File metadata stored client-side only

### Analytics & Documentation
- [ ] `/stats` shows counts + p50/p95 + error rate for 7d, 30d
- [ ] `/docs` includes runnable curl/JS/Python snippets
- [ ] Downloadable OpenAPI + Postman collections available

### Security & Performance
- [ ] Rate limiting functional with friendly errors
- [ ] Large files blocked appropriately
- [ ] All traffic HTTPS with HSTS max-age ≥ 30 days
- [ ] CI deploys staging on merge; prod on tag v*

## Technical Stack

### Frontend
- **Framework:** Next.js 14+ with TypeScript
- **UI Library:** Tailwind CSS + Headless UI
- **State Management:** React Query for API state
- **Charts:** Chart.js or Recharts for analytics

### Backend
- **API Layer:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js (for /stats dashboard)
- **Rate Limiting:** Redis + node-rate-limiter-flexible

### Infrastructure
- **Hosting:** Vercel or DigitalOcean App Platform
- **Database:** Managed PostgreSQL (DigitalOcean/Neon)
- **CDN:** Cloudflare
- **Monitoring:** Sentry + Uptime Robot

## Related Files/Components
- [ ] `src/lib/codexhash-sdk.ts` - Main SDK client
- [ ] `src/pages/demo.tsx` - Demo playground page
- [ ] `src/pages/stats.tsx` - Analytics dashboard
- [ ] `src/pages/docs.tsx` - Documentation page
- [ ] `src/components/` - Reusable UI components
- [ ] `prisma/schema.prisma` - Database schema
- [ ] `.github/workflows/` - CI/CD pipelines

## Notes
- **Reference:** Existing CodexHash APIs (need API documentation)
- **Dependencies:** Access to CodexHash API endpoints and documentation
- **Timeline:** Target 2-3 week MVP delivery
- **Post-MVP:** Advanced analytics, user accounts, API key management

---
**Next Steps:** 
1. Create project repository structure
2. Setup development environment
3. Begin Phase 1 implementation
