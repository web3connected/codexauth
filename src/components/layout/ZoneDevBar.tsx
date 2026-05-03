/**
 * ZoneDevBar — Persistent Zone Inspection Bar
 *
 * Server component. Mounts above every page in layout.tsx.
 * Reads the current path from X-Codex-Path (forwarded by edge middleware),
 * calls prezoneRequest for full 7-stage analysis, and renders a fixed bar
 * at the top of the viewport showing live zone assignment data.
 *
 * Updates on every navigation (re-rendered server-side per request).
 */

import { headers } from 'next/headers';
import { prezoneRequest }  from '@/lib/codexsecure/prezoneRequest';
import { getRoute }        from '@/routes';

// ── Zone colour map ───────────────────────────────────────────────────────────
const ZONE_COLOUR: Record<number, string> = {
  0:  '#4b5563', // gray-600
  1:  '#059669', // emerald-600
  2:  '#2563eb', // blue-600
  3:  '#7c3aed', // violet-600
  4:  '#0891b2', // cyan-600
  5:  '#6366f1', // indigo-500
  6:  '#0284c7', // sky-600
  7:  '#16a34a', // green-600
  8:  '#d97706', // amber-600
  9:  '#9333ea', // purple-600
  10: '#c026d3', // fuchsia-600
  11: '#0f766e', // teal-700
  12: '#dc2626', // red-600
};

const PHASE_LABEL: Record<string, { text: string; colour: string }> = {
  PHASE_LOCKED:   { text: 'LOCKED',    colour: '#059669' },
  ROUTE_OVERRIDE: { text: 'OVERRIDE',  colour: '#d97706' },
  PHASE_CONFLICT: { text: 'CONFLICT',  colour: '#dc2626' },
  UNRESOLVED:     { text: 'UNRESOLVED', colour: '#6b7280' },
};

// Skip the bar for Next.js internal / static paths
function shouldSkip(path: string): boolean {
  return (
    path.startsWith('/_next') ||
    path.startsWith('/favicon') ||
    path.startsWith('/public') ||
    path === ''
  );
}

export default async function ZoneDevBar() {
  const hdrs = await headers();
  const path       = hdrs.get('X-Codex-Path') ?? '/';
  const edgeZoneId = parseInt(hdrs.get('X-Codex-Zone-Id') ?? '-1', 10);

  if (shouldSkip(path)) return null;

  // Look up declared zone from route table (server-safe, not edge)
  const route       = getRoute(path);
  const declaredZone = route?.zone;

  // Call the full 7-stage pre-zone analysis
  const preZone = await prezoneRequest({
    path,
    method:      'GET',
    middleware:  route?.middleware ?? [],
    controller:  route?.name      ?? '',
    declaredZone,
    pattern:     route?.pattern,
  });

  const zoneId      = preZone.zone_id;
  const zoneName    = preZone.zone_name;
  const zoneKey     = preZone.zone_key;
  const phase       = preZone.phase_status;
  const score       = preZone.score;
  const confidence  = Math.round(preZone.confidence * 100);
  const source      = preZone.source;
  const zoneColour  = ZONE_COLOUR[zoneId] ?? '#4b5563';
  const phaseInfo   = PHASE_LABEL[phase] ?? { text: phase, colour: '#6b7280' };

  // Stage hit count
  const stageHits   = preZone.stages.filter(s => s.matched).length;
  const stageTotal  = preZone.stages.length;

  // Edge middleware zone (heuristic) vs analysed zone (Go API)
  const edgeVsApi   = edgeZoneId >= 0 && edgeZoneId !== zoneId
    ? ` edge→Z${edgeZoneId}`
    : null;

  return (
    <div
      style={{
        position:        'sticky',
        top:             0,
        zIndex:          9999,
        backgroundColor: '#0a0a0a',
        borderBottom:    '1px solid #1f2937',
        fontFamily:      'JetBrains Mono, monospace',
        fontSize:        '11px',
        lineHeight:      '1',
        userSelect:      'none',
      }}
    >
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '0',
          height:         '28px',
          paddingLeft:    '12px',
          paddingRight:   '12px',
          overflow:       'hidden',
          whiteSpace:     'nowrap',
        }}
      >
        {/* Zone badge */}
        <span
          style={{
            backgroundColor: zoneColour,
            color:           '#fff',
            padding:         '2px 7px',
            borderRadius:    '3px',
            fontWeight:      700,
            marginRight:     '10px',
            flexShrink:      0,
            letterSpacing:   '0.04em',
          }}
        >
          Z{zoneId}
        </span>

        {/* Zone name */}
        <span style={{ color: '#e5e7eb', fontWeight: 600, marginRight: '8px', flexShrink: 0 }}>
          {zoneName}
        </span>

        {/* Key */}
        <span style={{ color: '#6b7280', marginRight: '14px', flexShrink: 0 }}>
          {zoneKey}
        </span>

        {/* Separator */}
        <span style={{ color: '#374151', marginRight: '14px' }}>│</span>

        {/* Phase lock */}
        <span
          style={{
            color:       phaseInfo.colour,
            fontWeight:  600,
            marginRight: '14px',
            flexShrink:  0,
            fontSize:    '10px',
            letterSpacing: '0.06em',
          }}
        >
          {phaseInfo.text}
        </span>

        {/* Score */}
        <span style={{ color: '#9ca3af', marginRight: '4px', flexShrink: 0 }}>score</span>
        <span style={{ color: '#f3f4f6', marginRight: '14px', flexShrink: 0 }}>{score}</span>

        {/* Confidence */}
        <span style={{ color: '#9ca3af', marginRight: '4px', flexShrink: 0 }}>conf</span>
        <span style={{ color: '#f3f4f6', marginRight: '14px', flexShrink: 0 }}>{confidence}%</span>

        {/* Stages */}
        <span style={{ color: '#9ca3af', marginRight: '4px', flexShrink: 0 }}>stages</span>
        <span style={{ color: '#f3f4f6', marginRight: '14px', flexShrink: 0 }}>
          {stageHits}/{stageTotal}
        </span>

        {/* Source */}
        <span style={{ color: '#9ca3af', marginRight: '4px', flexShrink: 0 }}>src</span>
        <span style={{ color: '#a78bfa', marginRight: '14px', flexShrink: 0 }}>{source}</span>

        {/* Separator */}
        <span style={{ color: '#374151', marginRight: '14px' }}>│</span>

        {/* Path */}
        <span style={{ color: '#6b7280', marginRight: '4px', flexShrink: 0 }}>path</span>
        <span style={{ color: '#34d399', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {path}
        </span>

        {/* Edge vs API discrepancy (if any) */}
        {edgeVsApi && (
          <span style={{ color: '#f59e0b', marginLeft: '10px', flexShrink: 0, fontSize: '10px' }}>
            ⚠{edgeVsApi}
          </span>
        )}

        {/* Error indicator */}
        {preZone.error && (
          <span style={{ color: '#ef4444', marginLeft: '10px', flexShrink: 0, fontSize: '10px' }}>
            ✗ api unreachable
          </span>
        )}

        {/* Stage mini-dots (right-flush) */}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: '3px', flexShrink: 0, paddingLeft: '14px' }}>
          {preZone.stages.map((s, i) => (
            <span
              key={i}
              title={`${s.stage}: ${s.matched ? '✓' : '–'} (${s.score})`}
              style={{
                width:           '6px',
                height:          '6px',
                borderRadius:    '50%',
                backgroundColor: s.matched ? zoneColour : '#1f2937',
                display:         'inline-block',
                flexShrink:      0,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
