'use server';

import { getRoute } from '@/routes';

/**
 * CodexSecure — Zone Gate
 *
 * Runtime enforcement function. Given a path and user context, checks whether
 * the request is allowed to proceed based on the zone contract for that path.
 *
 * Decision hierarchy (first failure wins):
 *   1. Route unknown      → block (404-equivalent)
 *   2. Method not allowed → block (405)
 *   3. Auth required      → redirect to /login (if no session)
 *   4. Executive role     → block (if not in 'exec' or 'admin' roles)
 *   5. Device trust (TIU) → block (if device not trusted)
 *   6. All checks pass    → allow
 *
 * Uses GET /api/v1/policy/zones/:code on codexsecure-api (port 8084).
 * The policy registry is in-memory in the Go process — no DB round-trip.
 */

const CODEXSECURE_API = process.env.CODEXSECURE_API_URL ?? 'http://localhost:8084';
const SERVICE_KEY      = process.env.CODEXSECURE_SERVICE_KEY ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ZoneGateSession {
  userId?:        string;
  authenticated?: boolean;   // true if session is valid and unexpired
  roles?:         string[];  // e.g. ['admin', 'exec', 'user']
}

export interface ZoneGateDevice {
  trusted?: boolean;         // true if device passed TIU (Time Integrity Unit) check
}

export interface ZoneGateContext {
  method:   string;          // HTTP method — GET / POST / PUT / PATCH / DELETE
  session?: ZoneGateSession;
  device?:  ZoneGateDevice;
}

export type ZoneGateResult =
  | { decision: 'allow';    zone_id: number; zone_name: string; zone_key: string }
  | { decision: 'redirect'; url: string;     reason: string }
  | { decision: 'block';    reason: string;  code: number };

// ─── Zone policy shape returned by codexsecure-api ───────────────────────────

interface ZonePolicy {
  id:   number;
  key:  string;
  name: string;
  tier: string;
  rules: {
    auth_required:   boolean;
    tiu_required:    boolean;   // device trust required
    read_only:       boolean;   // only GET permitted
    executive:       boolean;   // requires exec/admin role
    methods_allowed: string[];  // explicit allowed methods list
  };
}

// ─── Gate ────────────────────────────────────────────────────────────────────

/**
 * zoneGate
 *
 * Main enforcement function. Call this from server actions or RSC handlers.
 * Do NOT call from edge middleware (requires Node.js fetch to internal service).
 *
 * @param path    - Request path (e.g. '/dashboard')
 * @param context - User session, device trust, and HTTP method
 * @returns ZoneGateResult — allow | redirect | block
 */
export async function zoneGate(
  path: string,
  context: ZoneGateContext,
): Promise<ZoneGateResult> {
  // 1. Resolve route — if unknown, block immediately
  const route = getRoute(path);
  if (!route) {
    return { decision: 'block', reason: 'route_not_registered', code: 404 };
  }

  // 2. Fetch zone policy from codexsecure-api (in-memory registry, no DB hit)
  const zoneCode = `Z${route.zone}`;
  let policy: ZonePolicy;
  try {
    policy = await fetchZonePolicy(zoneCode);
  } catch (err) {
    // If policy fetch fails, fail-open for public zones (Z0, Z1), fail-closed for all others.
    if (route.zone <= 1) {
      return { decision: 'allow', zone_id: route.zone, zone_name: 'Public', zone_key: 'public' };
    }
    const msg = err instanceof Error ? err.message : String(err);
    return { decision: 'block', reason: `policy_unavailable: ${msg}`, code: 503 };
  }

  const method = context.method.toUpperCase();

  // 3. Method check — read_only zones only allow GET
  if (policy.rules.read_only && method !== 'GET') {
    return { decision: 'block', reason: 'zone_is_read_only', code: 405 };
  }

  // 4. Method allowed list (if non-empty, must match)
  if (
    policy.rules.methods_allowed.length > 0 &&
    !policy.rules.methods_allowed.includes(method)
  ) {
    return {
      decision: 'block',
      reason: `method_not_allowed: ${method} not in [${policy.rules.methods_allowed.join(', ')}]`,
      code: 405,
    };
  }

  // 5. Auth required — redirect to login if no authenticated session
  if (policy.rules.auth_required) {
    if (!context.session?.authenticated) {
      const redirect = `/login?next=${encodeURIComponent(path)}`;
      return { decision: 'redirect', url: redirect, reason: 'auth_required' };
    }
  }

  // 6. Executive access — requires 'exec' or 'admin' role
  if (policy.rules.executive) {
    const roles = context.session?.roles ?? [];
    const hasExec = roles.some(r => r === 'exec' || r === 'admin');
    if (!hasExec) {
      return { decision: 'block', reason: 'executive_access_required', code: 403 };
    }
  }

  // 7. Device trust (TIU) — requires trusted device
  if (policy.rules.tiu_required) {
    if (!context.device?.trusted) {
      return { decision: 'block', reason: 'device_trust_required', code: 403 };
    }
  }

  // All checks passed
  return {
    decision:  'allow',
    zone_id:   policy.id,
    zone_name: policy.name,
    zone_key:  policy.key,
  };
}

// ─── Policy fetch (internal) ──────────────────────────────────────────────────

async function fetchZonePolicy(zoneCode: string): Promise<ZonePolicy> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (SERVICE_KEY) {
    headers['X-Service-Key'] = SERVICE_KEY;
  }

  const res = await fetch(`${CODEXSECURE_API}/api/v1/policy/zones/${zoneCode}`, {
    method:  'GET',
    headers,
    // No caching — policies can change; rely on the in-memory registry in Go
    cache:   'no-store',
  });

  if (!res.ok) {
    throw new Error(`policy fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ZonePolicy>;
}
