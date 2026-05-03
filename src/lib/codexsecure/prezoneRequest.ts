'use server';

import type { RoutePattern } from '@/routes/types';

/**
 * CodexSecure — Pre-Zone Preprocessor
 *
 * ALL requests land in Z0 first. This function calls codexsecure-api
 * to run the 7-stage zone analysis and determine the actual zone.
 *
 * Flow:
 *   Request arrives → Z0 (staging) → prezoneRequest() → zone analysis
 *   → returns PreZoneResult with confirmed zone + confidence + stages
 *
 * Calls: POST /api/v1/analyzer/route  (codexsecure-api, Go, port 8084)
 *   - URI-based keyword matching  (stage 1)
 *   - Controller pattern matching (stage 2)
 *   - Middleware stack matching   (stage 3)
 *   - Composite detection        (stage 4)
 *   - Confidence scoring         (stage 5)
 *   - Policy validation          (stage 6)
 *   - Zone assignment            (stage 7)
 */

const CODEXSECURE_API  = process.env.CODEXSECURE_API_URL ?? 'http://localhost:8084';
const SERVICE_KEY       = process.env.CODEXSECURE_SERVICE_KEY ?? '';
// Identifies this portal to codexsecure-api — stored in source_portal on every observation.
const SOURCE_PORTAL     = process.env.CODEXSECURE_PORTAL_ID ?? 'unknown';

export interface PreZoneInput {
  path: string;
  method?: string;
  middleware?: string[];
  controller?: string;
  // Explicit zone declared in the route file (e.g. zone: 'Z1_PUBLIC')
  // Used for phase lock reconciliation against the analyzed result
  declaredZone?: string | number;
  // Route pattern from the route file — used for data shape validation
  pattern?: RoutePattern;
  // For POST validation: the named outside action being submitted
  action?: string;
  // Fields present in the submitted request body (POST/PUT/PATCH)
  submittedFields?: string[];
  // Stable opaque identifier for the logical user session.
  // Used for observation session-dedup — count only increments when this changes.
  // No PII — pass a hash of (session_token + path), never the raw token.
  // When omitted every call is treated as a distinct session (no dedup).
  sessionId?: string;
  // Zone Composition (Job 5): destination zone after this route's action completes.
  // Sourced from route.target_zone — passed through to PreZoneResult for display.
  targetZone?: number;
}

export interface PreZoneStageResult {
  stage:      string;
  matched:    boolean;
  score:      number;
  source?:    string;
}

/**
 * Phase lock status — reconciliation between declared zone (route file) and analyzed zone (preZone API).
 *
 * PHASE_LOCKED    — declared === analyzed. Full trust. Both layers agree.
 * ROUTE_OVERRIDE  — analyzer had no data (Z0 fallback). Declared zone is trusted as the source.
 * PHASE_CONFLICT  — declared !== analyzed and analyzer had real data. Route held at Z0. Flag for review.
 * UNRESOLVED      — no declaration in route file. Analyzer result used as-is.
 */
export type PhaseLockStatus = 'PHASE_LOCKED' | 'ROUTE_OVERRIDE' | 'PHASE_CONFLICT' | 'UNRESOLVED';

/**
 * Pattern validation status — result of checking submitted fields against the route’s declared outside shape.
 *
 * PATTERN_MATCH        — all declared fields present, no forbidden fields.
 * PATTERN_VIOLATION    — missing required fields or forbidden fields detected.
 * PATTERN_UNCONFIGURED — route has no pattern.outside for this action (GET pages, etc.).
 */
export type PatternStatus = 'PATTERN_MATCH' | 'PATTERN_VIOLATION' | 'PATTERN_UNCONFIGURED';

export interface PatternValidationResult {
  status: PatternStatus;
  // The action name checked (matches pattern.outside key)
  action?: string;
  // Required fields that were absent from submitted body
  missing?: string[];
  // Fields present but listed as forbidden
  forbidden_found?: string[];
  // What was actually submitted
  submitted?: string[];
  // What was declared as required for this action
  declared?: string[];
}

export interface PreZoneResult {
  // The landing zone — always Z0 until confirmed
  landing_zone: 'Z0';

  // Confirmed zone after reconciliation
  zone_id:    number;
  zone_name:  string;
  zone_key:   string;

  // Analysis metadata
  confidence: number;
  score:      number;
  source:     string;

  // Phase lock reconciliation result
  phase_status: PhaseLockStatus;
  // The zone explicitly declared in the route file (if any)
  declared_zone_id?: number;
  // Populated only on PHASE_CONFLICT — both sides for display
  conflict?: { declared: number; analyzed: number };

  // Pattern validation — submitted fields vs declared outside shape
  pattern_validation?: PatternValidationResult;

  // Zone Composition (Job 5): destination zone after this route's action completes.
  // Sourced from route.target_zone — displayed as 'Z{zone_id} → Z{target_zone}' in UI.
  target_zone?: number;
  // zone_chain — [current_zone_id, target_zone] when both are set.
  zone_chain?: number[];

  // Stage breakdown from codexsecure-api
  stages: PreZoneStageResult[];

  // Raw analyzer response
  raw: unknown;

  // Error if api unreachable
  error?: string;
}

/**
 * validatePattern (pure)
 *
 * Checks submitted fields against the route’s declared outside pattern for a given action.
 * No network calls — purely structural field matching.
 */
function validatePattern(
  pattern: RoutePattern,
  action: string,
  submittedFields: string[],
): PatternValidationResult {
  if (!pattern.outside || !pattern.outside[action]) {
    return { status: 'PATTERN_UNCONFIGURED', action };
  }

  const declared = pattern.outside[action];
  const missing = declared.filter(f => !submittedFields.includes(f));

  let forbidden_found: string[] = [];
  if (pattern.forbidden) {
    if (pattern.forbidden[0] === '*') {
      // Wildcard — any field not declared is forbidden
      forbidden_found = submittedFields.filter(f => !declared.includes(f));
    } else {
      forbidden_found = submittedFields.filter(f =>
        (pattern.forbidden as string[]).includes(f)
      );
    }
  }

  if (missing.length > 0 || forbidden_found.length > 0) {
    return {
      status: 'PATTERN_VIOLATION',
      action,
      ...(missing.length > 0        ? { missing }        : {}),
      ...(forbidden_found.length > 0 ? { forbidden_found } : {}),
      submitted: submittedFields,
      declared,
    };
  }

  return { status: 'PATTERN_MATCH', action, submitted: submittedFields, declared };
}

/**
 * prezoneRequest
 *
 * Sends the incoming request to codexsecure-api for 7-stage zone analysis.
 * Entry point = Z0. Returns the confirmed zone assignment.
 *
 * Safe to call from server components and server actions.
 * Do NOT call from edge middleware (no Node.js APIs, no fetch to internal services).
 */
// ── Phase Logger ──────────────────────────────────────────────────────────────
// Writes to the Next.js server console (terminal running `next dev`).
// Tags every line with [PreZone] so logs are easy to grep/filter.
function phaseLog(phase: string, msg: string, data?: unknown) {
  const tag   = `\x1b[36m[PreZone]\x1b[0m \x1b[33m[${phase}]\x1b[0m`;
  const entry = data !== undefined ? `${msg} ${JSON.stringify(data)}` : msg;
  console.log(`${tag} ${entry}`);
}

export async function prezoneRequest(input: PreZoneInput): Promise<PreZoneResult> {
  // Parse declared zone from route file — 'Z1_PUBLIC' → 1, 'Z1' → 1, 1 → 1
  let declaredZoneId: number | undefined;
  if (input.declaredZone !== undefined) {
    const raw = String(input.declaredZone);
    const parsed = parseInt(raw.replace(/^Z(\d+).*/i, '$1'), 10);
    if (!isNaN(parsed)) declaredZoneId = parsed;
  }

  phaseLog('init', `path=${input.path} method=${input.method ?? 'GET'}`, {
    declaredZone: declaredZoneId ?? null,
    targetZone:   input.targetZone ?? null,
    hasPattern:   !!input.pattern,
  });

  const base: PreZoneResult = {
    landing_zone:  'Z0',
    zone_id:       0,
    zone_name:     'negative',
    zone_key:      'negative',
    confidence:    0,
    score:         0,
    source:        'z0-fallback',
    phase_status:  'UNRESOLVED',
    ...(declaredZoneId !== undefined ? { declared_zone_id: declaredZoneId } : {}),
    stages:        [],
    raw:           null,
  };

  try {
    const res = await fetch(`${CODEXSECURE_API}/api/v1/analyzer/route`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        ...(SERVICE_KEY ? { 'X-Service-Key': SERVICE_KEY } : {}),
      },
      body: JSON.stringify({
        uri:        input.path,
        methods:    [input.method ?? 'GET'],
        middleware: input.middleware ?? [],
        controller: input.controller ?? '',
      }),
      // Don't block the page for more than 2s
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      phaseLog('api', `HTTP ${res.status} from codexsecure-api`);
      return { ...base, error: `codexsecure-api error: ${res.status}` };
    }

    const data = await res.json() as {
      // Flat top-level response shape from codexsecure-api
      zone_id?:   number;
      zone_name?: string;
      zone_key?:  string;
      confidence?: number;
      score?:     number;
      source?:    string;
      match_details?: {
        uri_match?:        boolean;
        controller_match?: boolean;
        middleware_match?: boolean;
      };
    };

    const ar      = data;
    const details = ar.match_details ?? {};

    // Map the 7 stages from the analysis details
    const stages: PreZoneStageResult[] = [
      { stage: '1 · URI keyword match',    matched: details.uri_match        ?? false, score: details.uri_match        ? 200 : 0 },
      { stage: '2 · Controller pattern',   matched: details.controller_match ?? false, score: details.controller_match ? 100 : 0 },
      { stage: '3 · Middleware stack',     matched: details.middleware_match  ?? false, score: details.middleware_match  ? 80  : 0 },
      { stage: '4 · Composite detection', matched: (ar.source === 'composite'),        score: ar.source === 'composite' ? 150 : 0 },
      { stage: '5 · Score threshold',     matched: (ar.score ?? 0) >= 200,            score: ar.score ?? 0 },
      { stage: '6 · Policy validation',   matched: (ar.zone_id ?? -1) >= 1,           score: (ar.zone_id ?? -1) >= 1 ? 50 : 0 },
      { stage: '7 · Zone assignment',     matched: (ar.zone_id ?? -1) >= 0,           score: ar.zone_id ?? 0, source: ar.zone_key ?? 'unassigned' },
    ];

    phaseLog('api',    `raw response → zone=${ar.zone_id} key=${ar.zone_key} score=${ar.score} source=${ar.source} confidence=${ar.confidence}`);
    stages.forEach(s => {
      const hit = s.matched ? '\x1b[32m✓\x1b[0m' : '\x1b[90m–\x1b[0m';
      phaseLog(s.stage, `${hit} score=${s.score}${s.source ? ` source=${s.source}` : ''}`);
    });

    const analyzedZoneId = ar.zone_id  ?? 0;
    // API returns zone_id + score but no confidence/source fields — use score > 0 and zone ≥ 1
    const apiHadData     = (ar.zone_id ?? 0) >= 1 && (ar.score ?? 0) > 0;

    // Phase lock reconciliation
    let phase_status: PhaseLockStatus = 'UNRESOLVED';
    let finalZoneId   = analyzedZoneId;
    let finalZoneName = ar.zone_name  ?? 'negative';
    let finalZoneKey  = ar.zone_key   ?? 'negative';
    let finalConfidence = ar.score != null ? ar.score / 1000 : 0;   // normalize score→confidence proxy
    let finalSource   = ar.source     ?? (apiHadData ? 'api-analysis' : 'z0-fallback');
    let conflict: { declared: number; analyzed: number } | undefined;

    if (declaredZoneId !== undefined) {
      if (!apiHadData) {
        // Analyzer returned nothing — route override wins
        phase_status    = 'ROUTE_OVERRIDE';
        finalZoneId     = declaredZoneId;
        finalConfidence = 1.0;
        finalSource     = 'route-override';
        // zone_name/key derived from declared id for display
        finalZoneName   = `Z${declaredZoneId}`;
        finalZoneKey    = `z${declaredZoneId}`;
        // Mark stage 7 as matched via override
        stages[6] = { ...stages[6], matched: true, source: 'route-override', score: declaredZoneId };
      } else if (analyzedZoneId === declaredZoneId) {
        // All three layers agree — phase locked
        phase_status    = 'PHASE_LOCKED';
        finalConfidence = 1.0;
        finalSource     = 'phase-locked';
      } else {
        // Declared !== analyzed and API had real data — conflict
        phase_status = 'PHASE_CONFLICT';
        finalZoneId  = 0;   // hold at Z0 until resolved
        finalZoneName = 'negative';
        finalZoneKey  = 'negative';
        finalSource   = 'phase-conflict';
        finalConfidence = 0;
        conflict = { declared: declaredZoneId, analyzed: analyzedZoneId };
      }
    }

    phaseLog('lock', `status=${phase_status} finalZone=Z${finalZoneId} source=${finalSource}`,
      conflict ? { conflict } : undefined);

    const result: PreZoneResult = {
      landing_zone:  'Z0',
      zone_id:       finalZoneId,
      zone_name:     finalZoneName,
      zone_key:      finalZoneKey,
      confidence:    finalConfidence,
      score:         ar.score ?? 0,
      source:        finalSource,
      phase_status,
      ...(declaredZoneId !== undefined ? { declared_zone_id: declaredZoneId } : {}),
      ...(conflict ? { conflict } : {}),
      // Pattern validation — only runs when pattern + action + submittedFields are all provided
      ...(input.pattern && input.action && input.submittedFields
        ? { pattern_validation: validatePattern(input.pattern, input.action, input.submittedFields) }
        : input.pattern
          ? { pattern_validation: { status: 'PATTERN_UNCONFIGURED' as PatternStatus } }
          : {}),
      stages,
      raw: data,
      // Zone composition passthrough
      ...(input.targetZone !== undefined ? { target_zone: input.targetZone } : {}),
      ...(input.targetZone !== undefined ? { zone_chain: [finalZoneId, input.targetZone] } : {}),
    };

    // MCP Observation Recording — fire-and-forget, never blocks the response.
    //
    // Only record on non-GET mutations where we have a confirmed phase lock:
    //   PHASE_LOCKED    — declared === analyzed (strongest signal)
    //   ROUTE_OVERRIDE  — analyzer had no data; declared zone trusted
    //
    // PHASE_CONFLICT and UNRESOLVED carry no reliable signal and are never recorded.
    // GET page renders are never recorded (noise that corrupts the statistical model).
    const recordableMethod = (input.method ?? 'GET').toUpperCase();
    const recordableStatus = phase_status === 'PHASE_LOCKED' || phase_status === 'ROUTE_OVERRIDE';
    if (recordableStatus && recordableMethod !== 'GET' && finalZoneId > 0) {
      phaseLog('obs', `recording observation path=${input.path} zone=Z${finalZoneId} phase=${finalSource}`);
      // phaseSource maps directly from finalSource which is already 'phase-locked' or 'route-override'
      fetch(`${CODEXSECURE_API}/api/v1/observations/record`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(SERVICE_KEY ? { 'X-Service-Key': SERVICE_KEY } : {}),
        },
        body: JSON.stringify({
          path:          input.path,
          zone_id:       finalZoneId,
          phase_source:  finalSource,
          source_portal: SOURCE_PORTAL,
          // session_hash enables server-side dedup: count increments only
          // when the hash changes. Omit rather than send undefined.
          ...(input.sessionId ? { session_hash: input.sessionId } : {}),
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => {
        // Observation recording is non-critical — log suppressed intentionally.
        // A failed upsert does not affect the returned PreZoneResult.
      });
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    phaseLog('error', `codexsecure-api unreachable: ${message}`);
    return { ...base, error: `codexsecure-api unreachable: ${message}` };
  }
}
