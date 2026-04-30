# CodexHash Website + n8n Automation Blueprint (MVP → V1)

## 0) Guardrails & Opinionated Defaults

* **Stack**: Next.js 14 (App Router) + TypeScript, Tailwind, shadcn/ui, next-mdx-remote (docs), Contentlayer (content indexing), Prisma (Postgres), Vercel (edge) or Docker/K8s.
* **Docs**: MDX + automatic ToC, code tabs (TS/JS/Python/Go), Mermaid for diagrams, image optimization.
* **Search**: Algolia DocSearch (phase 2). Local Fuse.js in MVP.
* **API**: `/api/hash`, `/api/verify`, `/api/benchmarks`, `/api/telemetry` (opt-in). OpenAPI spec generated with `openapi-typescript` and served at `/docs/api`.
* **Auth**: Clerk/NextAuth (MVP: public docs & tools; auth-gated Playground writes only).
* **Observability**: Sentry + OpenTelemetry (HTTP spans for tools/benchmarks).
* **Security**: Strict CSP, `next-safe`, rate limiting (upstash/redis) on tools.

---

## 1) Information Architecture & Routes

### Top-Level

* `/` — **Homepage** (Hero, interactive hash demo, differentiators, CTA).
* `/learn` — hub for Learn articles.
* `/comparisons` — hub for comparison pages.
* `/docs` — Developer docs hub.
* `/tools` — Interactive utilities hub.
* `/security` — Security & Trust hub.
* `/enterprise` — Enterprise page.
* `/pricing` — Pricing.
* `/customers` — Customer stories.
* `/use-cases` — Use cases.

### Learn

* `/learn/harmonic-hashing` — What/why, math snapshot, visuals.
* `/learn/quantum-resistance` — Current hashes vs PQC, timelines, threats.
* `/learn/crypto-evolution` — MD5 → SHA‑3 → PQ era timeline & predictions.

### Comparisons

* `/comparisons/sha256`
* `/comparisons/blake3`
* `/comparisons/argon2`
* `/comparisons/benchmarks`
* `/comparisons/security`

### Developer Resources

* `/docs/getting-started`
* `/docs/api` (OpenAPI + SDK links)
* `/docs/sdks` (TS, Python, Go; copyable snippets)
* `/examples` (recipe-style snippets)
* `/playground` (interactive)

### Security & Trust

* `/security/whitepaper`
* `/security/audits`
* `/security/disclosure`
* `/security/compliance`

### Tools

* `/tools/generator` (Hash Generator)
* `/tools/calculator` (Performance Calculator)
* `/tools/migration` (Migration Assistant)
* `/tools/threat-assessment` (Quantum Threat Assessment)

---

## 2) Page Blueprints (MVP content blocks)

### Homepage

* **Hero**: headline, subhead, primary CTA (Get Started), secondary CTA (Try Playground).
* **Interactive Demo**: input → hash output, latency/readouts, verify mode.
* **Differentiators**: PQ-ready, harmonic collision spacing, tunable work factors, hardware efficiency.
* **Proof**: early benchmark chart (synthetic), code snippet tabs.
* **Social trust**: badges (audit pending), newsletter CTA.

### Learn: Harmonic Hashing

* **Problem framing** → **Harmonic model** (zones, resonance) → **Security properties** (preimage, second-preimage, collision) → **Why it scales in PQ era**.
* Mermaid diagrams for harmonic rings; math appendix (non-derivational MVP).

### Comparisons: Benchmarks

* Table + charts: throughput (H/s), avg latency (ms), energy/MB, memory footprint.
* Disclaimers, hardware/env notes, reproducibility link.

### Docs: Getting Started

* Install → Initialize client → Hash → Verify → Migrate from SHA‑256.
* Error codes & rate limits; copy-paste snippets; Postman collection.

### Tools: Generator

* Input text/file, salt options, cost parameters, copy/download.
* Rate-limited; no persistence by default (privacy-first toggle for saving to local).

---

## 3) Components Inventory

* `Hero`, `HashDemo`, `CodeTabs`, `BenchmarkChart`, `FeatureCards`, `DocSidebar`, `MDXCallout`, `PricingTable`, `ComparisonTable`, `ComplianceBadges`, `DisclosureForm`, `PlaygroundTerminal`.

---

## 4) Data & Content Models (Prisma)

```prisma
model BenchmarkRun {
  id           String   @id @default(cuid())
  algo         String   // codexhash|sha256|blake3|argon2
  version      String
  dataset      String   // small|medium|large
  hwProfile    String   // CPU/GPU model
  throughput   Float    // hashes/sec
  p50LatencyMs Float
  p95LatencyMs Float
  energyPerMB  Float?
  memoryMB     Float?
  createdAt    DateTime @default(now())
}

model SdkRelease {
  id        String @id @default(cuid())
  lang      String // ts|py|go
  version   String
  notes     String
  url       String
  createdAt DateTime @default(now())
}

model Disclosure {
  id        String @id @default(cuid())
  reporter  String
  email     String
  severity  String // low|med|high|critical
  message   String
  status    String @default("new")
  createdAt DateTime @default(now())
}
```

---

## 5) Public API (MVP) & Rate Limits

### Endpoints

* `POST /api/hash` → `{ input, salt?, cost? }` → `{ hash, meta: { algo, cost, durationMs } }`
* `POST /api/verify` → `{ input, hash }` → `{ valid: boolean, durationMs }`
* `GET /api/benchmarks` → returns latest `BenchmarkRun[]`
* `POST /api/telemetry` (opt-in from Playground) → anonymized perf

### Limits

* 60 req/min per IP (Upstash Redis). Burst 10. HMAC option for higher tiers.

---

## 6) Security & Compliance Stubs

* **CSP** strict, HTTPS-only, `X-Content-Type-Options`, `Referrer-Policy: no-referrer` on tools.
* Input size caps: 1MB text, 5MB file in generator.
* Privacy: no storage by default; explicit toggle for local/session saves.
* Audit artifact placeholders (hash of whitepaper PDF & commit refs).

---

## 7) n8n Workflow Suite (MVP → V1)

### W1. Content → Docs Pipeline

**Trigger**: Git push to `content/` or CMS publish webhook.
**Nodes**: Git (pull) → MDX Lint/Build → Image optimize → Algolia index (phase 2) → Slack/Email notify → Vercel deploy.
**On-Error**: Rollback deploy, alert channel.

### W2. Lead Capture → CRM

**Trigger**: `/enterprise` or `/pricing` form submit.
**Nodes**: HTTP ingest → Email validation → Enrich (Clearbit alt) → CRM upsert (Notion/HubSpot) → SDR Slack ping → Calendar link.
**On-Error**: Queue to retry, send fallback email to sales@.

### W3. Vulnerability Disclosure Intake

**Trigger**: POST `/security/disclosure`.
**Nodes**: Create ticket (Jira/Linear) → PGP‑encrypt details in Vault → PagerDuty (sev≥high) → Acknowledge email to reporter → SLA timer.
**On-Error**: Escalate to on-call.

### W4. Benchmarks → Site

**Trigger**: New `BenchmarkRun` row.
**Nodes**: Validate schema → Render charts → Commit JSON to `public/benchmarks.json` → Purge CDN → Post summary in #eng.

### W5. Playground Abuse Guard

**Trigger**: Rate-limit breach / anomaly from `/api/hash`.
**Nodes**: n8n webhook → blacklist IP in Redis → Notify → Auto-unblock after TTL.

### W6. Uptime & Error Feed

**Trigger**: Sentry issue / UptimeRobot alert.
**Nodes**: Aggregate → Deduplicate → Post to #ops with runbook links.

### W7. Billing Meter (Phase 2)

**Trigger**: API usage logs.
**Nodes**: Aggregate by key → Stripe usage report → Invoice draft → Email.

---

## 8) MVP Cut (2 sprints)

**Sprint 1 (Week 1)**: `/`, `/learn/harmonic-hashing`, `/docs/getting-started`, `/tools/generator`, `/docs/api` (OpenAPI stub), W1, W2, W3.
**Sprint 2 (Week 2)**: Comparisons (skeleton + one filled page), `/tools/benchmarks` (read-only), Benchmarks API & W4, Abuse Guard W5, basic pricing.

---

## 9) Backlog (V1+)

* Algolia search, whitepaper PDF generator, customer stories CMS, compliance badges (SOC2 in-progress), SDK auto-version badges, `/tools/migration` wizard, `/tools/threat-assessment` questionnaire.

---

## 10) Acceptance Criteria (MVP)

* All listed MVP routes render without 500s.
* Hash demo produces deterministic output and verifies correctly.
* Docs pages achieve >90 Lighthouse Accessibility.
* n8n W1/W2/W3 flows succeed with test payloads.
* Rate limiting blocks >99% abusive bursts without impacting normal use.

---

## Implementation Status

- [ ] **Foundation Setup**
  - [x] Next.js project initialized
  - [x] Basic template customization (CodexHash branding)
  - [ ] shadcn/ui components setup
  - [ ] Prisma database setup
  - [ ] Authentication setup (NextAuth/Clerk)

- [ ] **Core Pages (Sprint 1)**
  - [ ] Homepage with Hero and Interactive Demo
  - [ ] `/learn/harmonic-hashing`
  - [ ] `/docs/getting-started`
  - [ ] `/tools/generator`
  - [ ] `/docs/api` (OpenAPI stub)

- [ ] **API Development**
  - [ ] `/api/hash` endpoint
  - [ ] `/api/verify` endpoint
  - [ ] Rate limiting implementation
  - [ ] OpenAPI specification

- [ ] **n8n Workflows (Sprint 1)**
  - [ ] W1: Content → Docs Pipeline
  - [ ] W2: Lead Capture → CRM
  - [ ] W3: Vulnerability Disclosure Intake

- [ ] **Sprint 2 Deliverables**
  - [ ] Comparison pages structure
  - [ ] `/tools/benchmarks` (read-only)
  - [ ] Benchmarks API & W4 workflow
  - [ ] Abuse Guard W5 workflow
  - [ ] Basic pricing page

## Next Steps

1. Set up the foundational components and dependencies
2. Implement the homepage with interactive hash demo
3. Create the core API endpoints
4. Set up the documentation structure with MDX
5. Implement the first n8n workflows
