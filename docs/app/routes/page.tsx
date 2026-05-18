import { validateZoneStructure } from '@/lib/codexsecure/validateZoneStructure';
import { prezoneRequest } from '@/lib/codexsecure/prezoneRequest';
import { zoneGate } from '@/lib/codexsecure/zoneGate';
import type { ZoneGateResult } from '@/lib/codexsecure/zoneGate';
import { routes } from '@/routes';
import type { CodexRoute } from '@/routes';

export const metadata = { title: 'Route List — CodexAuth' };

const ZONE_LABELS: Record<number, string> = {
  0: 'Z0 · Blocked',
  1: 'Z1 · Public',
  2: 'Z2 · Identity',
  3: 'Z3 · API / Ops',
  4: 'Z4 · Protected',
  5: 'Z5 · System',
  6: 'Z6 · Event Logs',
  7: 'Z7 · Comms',
  8: 'Z8 · Payments',
  9: 'Z9 · Analytics',
  10: 'Z10 · Behavior',
  11: 'Z11 · Realtime',
  12: 'Z12 · Admin',
};

export default async function RoutesPage() {
  // Find the route-list entry to pass its declared zone to preZone
  const thisRoute = routes.find((r) => r.path === '/routes');

  // Zone Gate mock contexts — one scenario per row
  const gateScenarios = [
    {
      label: 'Unauthenticated GET /routes (Z1 public)',
      path: '/routes',
      context: { method: 'GET', session: { authenticated: false } },
    },
    {
      label: 'Unauthenticated POST /routes (method not in route)',
      path: '/routes',
      context: { method: 'POST', session: { authenticated: false } },
    },
    {
      label: 'Unknown path /does-not-exist',
      path: '/does-not-exist',
      context: { method: 'GET', session: { authenticated: true } },
    },
  ] as const;

  const [structure, preZone, ...gateResults] = await Promise.all([
    validateZoneStructure(),
    prezoneRequest({
      path:   '/routes',
      method: 'GET',
      // Pass declared zone so reconciliation can phase-lock or detect conflict
      ...(thisRoute?.zone_override ? { declaredZone: thisRoute.zone } : {}),
      // Pass pattern so pattern_validation is populated in the result
      ...(thisRoute?.pattern ? { pattern: thisRoute.pattern } : {}),
      // Pass target_zone for zone composition display
      ...(thisRoute?.target_zone !== undefined ? { targetZone: thisRoute.target_zone } : {}),
      // GET page — no action/submittedFields; pattern_validation will be PATTERN_UNCONFIGURED
    }),
    ...gateScenarios.map(s => zoneGate(s.path, s.context)),
  ]);

  // Group routes by zone
  const byZone = routes.reduce<Record<number, CodexRoute[]>>((acc, r) => {
    (acc[r.zone] ??= []).push(r);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8 font-mono">
      <h1 className="text-2xl font-bold mb-1 text-white">CodexAuth · Route List</h1>
      <p className="text-gray-400 text-sm mb-8">
        Equivalent of <code className="text-emerald-400">php artisan route:list</code>
        {' '}· <span className="text-white">{routes.length}</span> routes registered
      </p>

      {/* Pre-Zone Analysis — Z0 Preprocessor */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
          Pre-Zone Analysis
          <span className="ml-3 text-yellow-400 normal-case">
            Landing zone: <strong>Z0</strong> → Confirmed: <strong>Z{preZone.zone_id} · {preZone.zone_name}</strong>
            {preZone.zone_chain && preZone.zone_chain.length === 2 && (
              <span className="ml-2 text-purple-400">
                → Target: <strong>Z{preZone.zone_chain[1]}</strong>
                <span className="ml-1 text-gray-600 text-xs">(zone chain)</span>
              </span>
            )}
            {preZone.error && <span className="ml-2 text-red-400">({preZone.error})</span>}
          </span>
          <span className="ml-4">
            <PhaseLockBadge status={preZone.phase_status} conflict={preZone.conflict} />
          </span>
        </h2>

        {/* Stage breakdown */}
        <table className="w-full text-sm border border-gray-800 rounded overflow-hidden mb-4">
          <thead className="bg-gray-900 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Stage</th>
              <th className="text-left px-4 py-2">Matched</th>
              <th className="text-left px-4 py-2">Score</th>
              <th className="text-left px-4 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {preZone.stages.map((s) => (
              <tr key={s.stage} className="border-t border-gray-800">
                <td className="px-4 py-2 text-gray-300">{s.stage}</td>
                <td className="px-4 py-2">
                  <span className={s.matched ? 'text-emerald-400' : 'text-gray-600'}>
                    {s.matched ? '\u2713 yes' : '\u2014 no'}
                  </span>
                </td>
                <td className="px-4 py-2 text-yellow-400">{s.score}</td>
                <td className="px-4 py-2 text-gray-500 text-xs">{s.source ?? '\u2014'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pattern Validation */}
        {preZone.pattern_validation && (
          <div className="flex items-center gap-3 mb-4 px-4 py-2 border border-gray-800 rounded bg-gray-900/30 text-sm">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Pattern</span>
            <PatternValidationBadge result={preZone.pattern_validation} />
            {preZone.pattern_validation.status === 'PATTERN_UNCONFIGURED' && (
              <span className="text-gray-600 text-xs">
                GET-only route — no outside shape declared
              </span>
            )}
          </div>
        )}

        {/* Raw JSON from codexsecure-api */}
        <details className="border border-gray-800 rounded">
          <summary className="px-4 py-2 text-xs text-gray-500 cursor-pointer hover:text-gray-300">
            Raw JSON payload from codexsecure-api
          </summary>
          <pre className="px-4 py-4 text-xs text-emerald-300 overflow-auto bg-gray-900/50">
            {JSON.stringify(preZone, null, 2)}
          </pre>
        </details>
      </section>

      {/* Zone Gate — runtime enforcement test */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Zone Gate · Mock Enforcement</h2>
        <table className="w-full text-sm border border-gray-800 rounded overflow-hidden">
          <thead className="bg-gray-900 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Scenario</th>
              <th className="text-left px-4 py-2">Decision</th>
              <th className="text-left px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {gateScenarios.map((s, i) => (
              <tr key={s.label} className="border-t border-gray-800">
                <td className="px-4 py-2 text-gray-300 text-xs">{s.label}</td>
                <td className="px-4 py-2">
                  <ZoneGateBadge result={gateResults[i]} />
                </td>
                <td className="px-4 py-2 text-gray-500 text-xs">
                  <ZoneGateDetail result={gateResults[i]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Zone Structure Status */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Zone Structure</h2>
        <table className="w-full text-sm border border-gray-800 rounded overflow-hidden">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="text-left px-4 py-2">Path</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {structure.items.map((item) => (
              <tr key={item.path} className="border-t border-gray-800">
                <td className="px-4 py-2 text-gray-200">{item.path || 'src/routes/'}</td>
                <td className="px-4 py-2 text-gray-400">{item.type}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Route Table */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Registered Routes</h2>
        {routes.length === 0 ? (
          <div className="border border-gray-800 rounded p-6 text-center text-gray-500 text-sm">
            No routes detected — add zone files to{' '}
            <code className="text-emerald-400">src/routes/web/zones/</code> or{' '}
            <code className="text-emerald-400">src/routes/api/zones/</code>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byZone)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([zoneId, zoneRoutes]) => (
                <div key={zoneId}>
                  <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
                    {ZONE_LABELS[Number(zoneId)] ?? `Zone ${zoneId}`}
                  </h3>
                  <table className="w-full text-sm border border-gray-800 rounded overflow-hidden">
                    <thead className="bg-gray-900 text-gray-500">
                      <tr>
                        <th className="text-left px-4 py-2">Zone</th>
                        <th className="text-left px-4 py-2">Methods</th>
                        <th className="text-left px-4 py-2">Path</th>
                        <th className="text-left px-4 py-2">Name</th>
                        <th className="text-left px-4 py-2">Middleware</th>
                        <th className="text-left px-4 py-2">Chain</th>
                        <th className="text-left px-4 py-2">Lock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zoneRoutes.map((route) => (
                        <tr key={route.path} className="border-t border-gray-800 hover:bg-gray-900/50">
                          <td className="px-4 py-2 text-emerald-400 text-xs font-semibold">
                            Z{route.zone}
                          </td>
                          <td className="px-4 py-2 text-yellow-400 text-xs">
                            {route.methods.join(', ')}
                          </td>
                          <td className="px-4 py-2 text-white">{route.path}</td>
                          <td className="px-4 py-2 text-gray-400">{route.name ?? '—'}</td>
                          <td className="px-4 py-2 text-gray-500 text-xs">
                            {route.middleware.join(', ')}
                          </td>
                          <td className="px-4 py-2 text-xs">
                            {route.zone_chain && route.zone_chain.length === 2 ? (
                              <span className="text-purple-400 font-semibold">
                                Z{route.zone_chain[0]} → Z{route.zone_chain[1]}
                              </span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {route.zone_override && (
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-medium">
                                declared
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Dev nav */}
      <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-600">
        <span className="mr-4">Dev tools:</span>
        <a href="/routes" className="text-emerald-400 hover:text-emerald-300 mr-4">
          → Route List (current)
        </a>
        <a href="/zones" className="text-purple-400 hover:text-purple-300">
          → Zone Registry
        </a>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: 'ok' | 'created' | 'missing' }) {
  const styles = {
    ok:      'bg-emerald-900 text-emerald-300',
    created: 'bg-yellow-900 text-yellow-300',
    missing: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function PhaseLockBadge({
  status,
  conflict,
}: {
  status: import('@/lib/codexsecure/prezoneRequest').PhaseLockStatus;
  conflict?: { declared: number; analyzed: number };
}) {
  if (status === 'PHASE_LOCKED') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-900 text-emerald-300">
        &#x1F512; Phase Locked
      </span>
    );
  }
  if (status === 'ROUTE_OVERRIDE') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-900 text-blue-300">
        &#x26A1; Route Override
      </span>
    );
  }
  if (status === 'PHASE_CONFLICT') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-900 text-red-300">
        &#x26A0; Phase Conflict
        {conflict && <> (declared Z{conflict.declared} vs analyzed Z{conflict.analyzed})</>}
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-500">
      Unresolved
    </span>
  );
}

function PatternValidationBadge({
  result,
}: {
  result: import('@/lib/codexsecure/prezoneRequest').PatternValidationResult;
}) {
  if (result.status === 'PATTERN_MATCH') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-900 text-emerald-300">
        &#x2713; Pattern Match
      </span>
    );
  }
  if (result.status === 'PATTERN_VIOLATION') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-900 text-red-300">
        &#x26A0; Pattern Violation
        {result.missing && result.missing.length > 0 && (
          <> — missing: {result.missing.join(', ')}</>
        )}
        {result.forbidden_found && result.forbidden_found.length > 0 && (
          <> — forbidden: {result.forbidden_found.join(', ')}</>
        )}
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-500">
      Unconfigured
    </span>
  );
}

function ZoneGateBadge({ result }: { result: ZoneGateResult }) {
  if (result.decision === 'allow') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-900 text-emerald-300">
        &#x2713; Allow
      </span>
    );
  }
  if (result.decision === 'redirect') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-900 text-yellow-300">
        &#x21AA; Redirect
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-900 text-red-300">
      &#x26D4; Block
    </span>
  );
}

function ZoneGateDetail({ result }: { result: ZoneGateResult }) {
  if (result.decision === 'allow') {
    return (
      <span>
        Z{result.zone_id} · {result.zone_name}
      </span>
    );
  }
  if (result.decision === 'redirect') {
    return (
      <span>
        → <code className="text-yellow-400">{result.url}</code>
        <span className="ml-2 text-gray-600">({result.reason})</span>
      </span>
    );
  }
  return (
    <span>
      {result.reason} <span className="text-gray-600 ml-1">[{result.code}]</span>
    </span>
  );
}
