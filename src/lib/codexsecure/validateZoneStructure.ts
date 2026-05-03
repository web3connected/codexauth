'use server';

/**
 * validateZoneStructure
 *
 * Checks that the required CodexSecure route structure exists inside src/routes/.
 * If any piece is missing, auto-creates the scaffold so the developer can start
 * dropping route files immediately.
 *
 * Expected structure:
 *   src/routes/
 *     web.ts              ← web route entry point
 *     api.ts              ← api route entry point
 *     types.ts            ← CodexZone + CodexRoute types
 *     web/
 *       zones/            ← web zone directories go here (z1/, z4/, z12/ …)
 *     api/
 *       zones/            ← api zone directories go here (z3/ …)
 */

import fs from 'fs';
import path from 'path';

// ── Types ────────────────────────────────────────────────────────────────────

export type ZoneStructureStatus = 'ok' | 'created' | 'missing';

export interface ZoneStructureItem {
  path: string;       // relative to project root
  type: 'file' | 'dir';
  status: ZoneStructureStatus;
}

export interface ZoneStructureResult {
  valid: boolean;     // true if all required items existed already
  items: ZoneStructureItem[];
}

// ── Scaffold templates ────────────────────────────────────────────────────────

const WEB_TS = `/**
 * Web Routes — CodexAuth
 * Loads all zone files under src/routes/web/zones/
 * Usage: CodexSecure.loadRoutesZones('web')
 */
// import { loadRoutesZones } from '@/lib/codexsecure/loadRoutesZones';
// export const webRoutes = loadRoutesZones('web');
export const webRoutes: unknown[] = []; // scaffold — add zone files to web/zones/
`;

const API_TS = `/**
 * API Routes — CodexAuth
 * Loads all zone files under src/routes/api/zones/
 * Usage: CodexSecure.loadRoutesZones('api')
 */
// import { loadRoutesZones } from '@/lib/codexsecure/loadRoutesZones';
// export const apiRoutes = loadRoutesZones('api');
export const apiRoutes: unknown[] = []; // scaffold — add zone files to api/zones/
`;

// ── Core function ─────────────────────────────────────────────────────────────

export async function validateZoneStructure(
  routesDir?: string
): Promise<ZoneStructureResult> {
  // Resolve the src/routes directory relative to the project root
  const base = routesDir ?? path.join(process.cwd(), 'src', 'routes');

  const required: { rel: string; type: 'file' | 'dir'; scaffold?: string }[] = [
    { rel: '',               type: 'dir' },
    { rel: 'types.ts',       type: 'file' },   // types must exist — no scaffold (user owns it)
    { rel: 'web.ts',         type: 'file', scaffold: WEB_TS },
    { rel: 'api.ts',         type: 'file', scaffold: API_TS },
    { rel: 'web',            type: 'dir' },
    { rel: 'web/zones',      type: 'dir' },
    { rel: 'api',            type: 'dir' },
    { rel: 'api/zones',      type: 'dir' },
  ];

  const items: ZoneStructureItem[] = [];
  let allExisted = true;

  for (const entry of required) {
    const abs = entry.rel ? path.join(base, entry.rel) : base;
    const rel = path.join('src/routes', entry.rel);
    const exists = fs.existsSync(abs);

    if (exists) {
      items.push({ path: rel, type: entry.type, status: 'ok' });
      continue;
    }

    allExisted = false;

    if (entry.type === 'dir') {
      fs.mkdirSync(abs, { recursive: true });
      items.push({ path: rel, type: 'dir', status: 'created' });
    } else if (entry.scaffold) {
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, entry.scaffold, 'utf8');
      items.push({ path: rel, type: 'file', status: 'created' });
    } else {
      // Required file with no scaffold (e.g. types.ts — user must create it)
      items.push({ path: rel, type: 'file', status: 'missing' });
    }
  }

  return { valid: allExisted, items };
}
