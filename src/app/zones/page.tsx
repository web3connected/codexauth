import { routes } from '@/routes';

export const metadata = { title: 'Zone Registry — CodexAuth' };

const CODEXSECURE_API = process.env.CODEXSECURE_API_URL ?? 'http://localhost:8084';

// Tier colour coding
const TIER_STYLE: Record<string, string> = {
  public:   'bg-gray-800 text-gray-300 border border-gray-700',
  business: 'bg-blue-950 text-blue-300 border border-blue-800',
  critical: 'bg-red-950 text-red-300 border border-red-800',
};

// Zone badge colours by id tier
function zoneBadgeStyle(id: number): string {
  if (id === 0)  return 'bg-gray-700 text-gray-400';
  if (id <= 1)   return 'bg-emerald-900 text-emerald-300';
  if (id <= 3)   return 'bg-blue-900 text-blue-300';
  if (id <= 11)  return 'bg-indigo-900 text-indigo-300';
  return 'bg-red-900 text-red-300'; // Z12
}

interface ZonePolicy {
  id: number;
  key: string;
  name: string;
  description: string;
  rules: {
    auth_required: boolean;
    tiu_required: boolean;
    read_only: boolean;
    executive: boolean;
    methods_allowed: string[];
  };
  tier: string;
}

interface ZonesApiResponse {
  total: number;
  version: string;
  zones: ZonePolicy[];
}

// Governing keywords from the vocabulary (kept in sync with vocabulary.go)
// These are displayed as "locks" on the zone card.
// Z0 is the orchestration layer — it has no governing keywords (it is not a zone).
const GOVERNING: Record<number, string[]> = {
  1:  [], // public never governs
  2:  ['auth', 'login', 'register', 'signin'],
  3:  ['api', 'webhook', 'webhooks'],
  4:  ['dashboard'],
  5:  [],
  6:  ['audit', 'logs'],
  7:  [],
  8:  ['payment', 'payments', 'checkout', 'billing'],
  9:  ['analytics'],
  10: [],
  11: [],
  12: ['admin', 'manage', 'administrator', 'control-panel'],
};

export default async function ZonesPage() {
  // Route count per zone from the loaded route table
  const routeCountByZone = routes.reduce<Record<number, number>>((acc, r) => {
    acc[r.zone] = (acc[r.zone] ?? 0) + 1;
    return acc;
  }, {});

  // Fetch all zones from codexsecure-api
  let allZones: ZonePolicy[] = [];
  let apiVersion = '';
  let apiError: string | undefined;

  try {
    const res = await fetch(`${CODEXSECURE_API}/api/v1/policy/zones`, {
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = (await res.json()) as ZonesApiResponse;
      allZones   = data.zones ?? [];
      apiVersion = data.version ?? '';
    } else {
      apiError = `codexsecure-api returned ${res.status}`;
    }
  } catch (e) {
    apiError = e instanceof Error ? e.message : 'unreachable';
  }

  // Z0 is the orchestration layer — NOT a business zone.
  // Separate it from the 12 business zones (Z1–Z12).
  const orchestrationLayer = allZones.find(z => z.id === 0);
  const zones              = allZones.filter(z => z.id !== 0);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8 font-mono">
      <h1 className="text-2xl font-bold mb-1 text-white">CodexAuth · Zone Registry</h1>
      <p className="text-gray-400 text-sm mb-8">
        Zone contracts from{' '}
        <code className="text-emerald-400">codexsecure-api</code>
        {apiVersion && <span className="ml-2 text-gray-600">v{apiVersion}</span>}
        {' · '}
        <span className="text-white">{zones.length}</span> zones
        {' · '}
        <span className="text-gray-500">1 orchestration layer</span>
        {apiError && (
          <span className="ml-3 text-red-400">⚠ {apiError}</span>
        )}
      </p>

      {/* Orchestration Layer (Z0) — shown separately, not counted as a zone */}
      {orchestrationLayer && (
        <div className="mb-6 border border-dashed border-gray-700 rounded-lg bg-gray-900/20 px-5 py-4 flex items-start gap-4">
          <span className="text-xs font-bold px-2 py-1 rounded font-mono bg-gray-800 text-gray-500 shrink-0 mt-0.5">
            Z0
          </span>
          <div>
            <span className="text-gray-300 font-semibold">{orchestrationLayer.name}</span>
            <span className="ml-2 text-gray-600 text-xs">{orchestrationLayer.key}</span>
            <p className="text-gray-500 text-sm mt-1">{orchestrationLayer.description}</p>
            <p className="text-gray-600 text-xs mt-1 italic">
              Not a business zone — all requests enter here before zone assignment is resolved.
            </p>
          </div>
        </div>
      )}

      {/* 12 Business zone cards (Z1–Z12) */}
      <div className="grid grid-cols-1 gap-4">
        {zones.map((zone) => {
          const gov     = GOVERNING[zone.id] ?? [];
          const rtCount = routeCountByZone[zone.id] ?? 0;

          return (
            <div
              key={zone.id}
              className="border border-gray-800 rounded-lg bg-gray-900/40 overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded font-mono ${zoneBadgeStyle(zone.id)}`}>
                    Z{zone.id}
                  </span>
                  <div>
                    <span className="text-white font-semibold">{zone.name}</span>
                    <span className="ml-2 text-gray-500 text-xs">{zone.key}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Tier badge */}
                  <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${TIER_STYLE[zone.tier] ?? 'bg-gray-800 text-gray-400'}`}>
                    {zone.tier}
                  </span>
                  {/* Route count */}
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                    {rtCount} route{rtCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-4 space-y-3">
                {/* Description */}
                <p className="text-gray-400 text-sm">{zone.description}</p>

                {/* Contract pills row */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {zone.rules.auth_required && (
                    <RulePill label="auth required" colour="yellow" />
                  )}
                  {zone.rules.tiu_required && (
                    <RulePill label="TIU required" colour="orange" />
                  )}
                  {zone.rules.read_only && (
                    <RulePill label="read only" colour="gray" />
                  )}
                  {zone.rules.executive && (
                    <RulePill label="executive" colour="red" />
                  )}
                  {!zone.rules.auth_required && !zone.rules.tiu_required && (
                    <RulePill label="public access" colour="green" />
                  )}
                </div>

                {/* Methods + governing keywords row */}
                <div className="flex items-start gap-6 text-xs">
                  {/* Methods */}
                  <div>
                    <span className="text-gray-600 uppercase tracking-widest mr-2">Methods</span>
                    <span className="text-yellow-400">
                      {zone.rules.methods_allowed.join('  ')}
                    </span>
                  </div>

                  {/* Governing keywords */}
                  {gov.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 uppercase tracking-widest">Governs on</span>
                      {gov.map(w => (
                        <code
                          key={w}
                          className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 text-xs"
                        >
                          {w}
                        </code>
                      ))}
                    </div>
                  )}
                  {gov.length === 0 && (
                    <span className="text-gray-700 italic">no governing keywords</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dev nav */}
      <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-600">
        <span className="mr-4">Dev tools:</span>
        <a href="/routes" className="text-emerald-400 hover:text-emerald-300 mr-4">
          → Route List
        </a>
        <a href="/zones" className="text-purple-400 hover:text-purple-300">
          → Zone Registry (current)
        </a>
      </div>
    </main>
  );
}

function RulePill({ label, colour }: { label: string; colour: string }) {
  const colours: Record<string, string> = {
    green:  'bg-emerald-950 text-emerald-400 border border-emerald-900',
    yellow: 'bg-yellow-950 text-yellow-400 border border-yellow-900',
    orange: 'bg-orange-950 text-orange-400 border border-orange-900',
    red:    'bg-red-950 text-red-400 border border-red-900',
    gray:   'bg-gray-800 text-gray-400 border border-gray-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded font-medium ${colours[colour] ?? colours.gray}`}>
      {label}
    </span>
  );
}
