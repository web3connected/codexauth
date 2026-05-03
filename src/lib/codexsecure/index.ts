/**
 * CodexSecure — Portal Entry Point (CodexAuth portal)
 *
 * Call CodexSecureInit() once at the app's root (layout.tsx server component).
 *
 * Layer responsibilities:
 *   @web3codex/codex-core              ← canonical zone types + CODEX_ZONES registry
 *   lib/codexsecure/index.ts           ← portal boot: route inventory + dev logging
 *   src/routes/                        ← route declarations (web.ts, api.ts, web/zones/zN/*.ts)
 *   app/layout.tsx                     ← calls CodexSecureInit() on every server render
 */

import type { CodexRoute, ZoneStructureResult } from '@web3codex/codex-core';
import { CodexZone } from '@web3codex/codex-core';
import { routes, getRoute, requiresAuth } from '@/routes';

export interface CodexSecureInitOptions {
  debug?: boolean;
}

export interface CodexSecureBootResult {
  routeCount: number;
  initialized: boolean;
}

export function CodexSecureInit(options: CodexSecureInitOptions = {}): CodexSecureBootResult {
  const { debug = process.env.NODE_ENV === 'development' } = options;

  if (debug) {
    const zoneMap: Record<number, CodexRoute[]> = {};
    for (const r of routes) {
      (zoneMap[r.zone] ??= []).push(r);
    }

    console.log('[CodexSecure] Boot ✓');
    console.log(`[CodexSecure] ${routes.length} route(s) registered`);
    for (const [zone, zRoutes] of Object.entries(zoneMap)) {
      const label = CodexZone[Number(zone)] ?? `Z${zone}`;
      console.log(`[CodexSecure]   ${label}: ${zRoutes.length} route(s)`);
      for (const r of zRoutes) {
        console.log(`[CodexSecure]     ${r.methods?.join('|') ?? 'GET'}  ${r.path}`);
      }
    }
  }

  return { routeCount: routes.length, initialized: true };
}

// Re-export routing helpers so the rest of the portal imports from one place
export { routes, getRoute, requiresAuth };
export type { CodexRoute, ZoneStructureResult };
