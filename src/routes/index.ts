/**
 * CodexAuth — Route Table
 *
 * Combines web + api zone routes into a single table.
 * Boot / validation is handled by CodexSecureInit() in lib/codexsecure/index.ts.
 *
 * Route DECLARATIONS live in:
 *   web.ts          ← Routes.loadCodexZonedRoutes('web')
 *   api.ts          ← Routes.loadCodexZonedRoutes('api')
 *   web/zones/zN/   ← per-zone route files (web)
 *   api/zones/zN/   ← per-zone route files (api)
 */

import type { CodexRoute } from './types';
import { webRoutes } from './web';
import { apiRoutes } from './api';

export type { CodexRoute };
export { CodexZone } from './types';

// ── Combined route table (web + api) ─────────────────────────────────────────

export const routes: CodexRoute[] = [...webRoutes, ...apiRoutes];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getRoute(path: string): CodexRoute | null {
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/';
  const exact = routes.find(r => r.path === clean);
  if (exact) return exact;
  return routes
    .filter(r => r.path !== '/' && clean.startsWith(r.path))
    .sort((a, b) => b.path.length - a.path.length)[0] ?? null;
}

export function requiresAuth(path: string): boolean {
  return getRoute(path)?.middleware.includes('auth') ?? false;
}

