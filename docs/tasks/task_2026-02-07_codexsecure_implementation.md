# Task: CodexSecure Implementation & Tenant Integration
**Date**: 2026-02-07
**Status**: Planning / Pending

## 1. Overview
We need to implement **CodexSecure**, the security and policy enforcement layer of the ecosystem, and use it to manage the Tenant System.
Currently, `CodexEthosLattice` defines the 12 Security Zones (Z1-Z12), but there is no engine to enforce them.

## 2. Goals
1.  **Reify CodexSecure**: Build the logic that uses `CodexEthosLattice` to make decisions.
2.  **Tenant Security**: Apply these zones to Tenant operations (Creation, Access, Management).
3.  **Vault**: Secure storage for Tenant Secrets (API Keys, Certs) linked to Zones.

## 3. Architecture

### 3.1 Service Location
Initially, we will implement CodexSecure as a **Domain Module** within `codexauth` (Laravel).
*   **Why?**: `codexauth` already owns the User/Tenant relationship and the Token issuance. Secure policies are tightly coupled with Authentication.
*   **Future**: Extract to `codexsecure-api` container when complexity grows.

### 3.2 Database Schema
We need new tables in `codex_main` (Postgres):

```sql
-- Policies: specific rules for a zone
CREATE TABLE codex_security_policies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    zone_code VARCHAR(10), -- e.g., 'Z3', 'Z6'
    rules JSONB, -- { "mfa_required": true, "ip_allowlist": [...] }
    created_at TIMESTAMP
);

-- Tenant Zone Configuration: How a tenant adheres to zones
CREATE TABLE tenant_security_configs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    policy_id INTEGER REFERENCES codex_security_policies(id),
    is_active BOOLEAN DEFAULT true,
    risk_score INTEGER DEFAULT 0 -- Dynamic trust score
);

-- Audit Log (Z6 - Oversight)
CREATE TABLE codex_security_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER,
    user_id INTEGER,
    zone_code VARCHAR(10),
    action VARCHAR(255),
    status VARCHAR(50),
    ip_address VARCHAR(45),
    meta JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 The "Enforcer" Class
`CodexSecure::guard($user, $tenant, $zone)`
Returns: `true`/`false` (or throws `SecurityException`).
Checks:
1.  User's Trust Score.
2.  Tenant's Status.
3.  Zone Requirements (e.g., "Is Time Sync verified?" for Z2).

## 4. Implementation Steps

### Phase 1: Foundation (Engine Layer)
- [x] **CodexAuth Stability**: Verified `codexauth` is stable.
- [x] **Service Stabilization**: `CodexSyncService` guarded by config.
- [x] **Engine Schema Restoration**: Restored `harmonic_zones` and `codex_agents` migration to `codex_admin`.
- [ ] **Engine Schema Execution**:
    - [x] **Status Check**: Verified `harmonic_zones` table is **MISSING** in `codex_main`.
    - [x] **Architecture Verification**: Confirmed `codex_admin` expects separate `codex_zones` DB (`.env`), while `codexauth` points to `codex_main` (Mismatch).
    - [ ] **Config Correction**: Point `codexauth` to `codex_zones` DB to match `codex_admin`.
    - [ ] **Execution**: Start `codex_admin`, create `codex_zones` DB (if missing), and run migrations.
- [x] **Ready for Phase 2**: The core "Codex Framework" engine is prepped.

### Phase 2: Tenant Configuration (Application Layer)
- [ ] **Objective**: Use the Codex Framework to configure Tenants.
- [ ] **Schema Definition**: Create migration for `tenant_security_configs` and `codex_security_policies`.
- [ ] **Integration**: Connect Tenant Models to Zone Policies.
- [ ] **Dashboard**: Show "Security Health" widget in Tenant Dashboard.
- [ ] **Audit**: Log every Login/Change to `codex_security_logs`.

### Phase 3: Frontend (Web3Connected) - Collaborative Design Required
- [ ] **Collaborative Session**: Define the exact UX for 2FA and Security.
    - [ ] How should the 2FA Challenge look? (Modal, redirection, inline?)
    - [ ] Decision on "CodexSecure Panel" placement (Floating widget vs Header vs Settings page).
- [ ] **Technical Implementation** (Pending Approval):
    - [ ] Create `useCodexSecure` hooks (after UX definition).
    - [ ] Implement 2FA Challengers.
    - [ ] Implement Zone Indicator widgets.

### Phase 4: 2FA & MFA Logic - Collaborative Design Required
- [ ] **Strategy Definition**:
    - [ ] Which factors to support first? (TOTP, Email Code, Backup Codes?)
    - [ ] Recovery flow design? (Admin override vs Recovery Key).
- [ ] **Implementation** (Pending Approval).

## 5. First Action Item
- Scaffold the `CodexSecure` Service in `codexauth` and run migrations.
