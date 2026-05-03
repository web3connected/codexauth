/**
 * Web Routes
 *
 * Loads all routes from web/zones/z*\/
 * Zone contract (methods, middleware, auth) comes from the directory name.
 *
 * To add a web route: drop a file in the correct zone directory.
 *   web/zones/z1/  ← public pages (GET, OPTIONS, no auth)
 *   web/zones/z4/  ← protected pages (all methods, auth required)
 */

import type { CodexRoute } from './types';
import { CodexZone } from './types';
import { routes as z1Routes } from './web/zones/z1/public';

export const webRoutes: CodexRoute[] = z1Routes.map(r => ({
  ...r,
  zone: CodexZone.Z1_PUBLIC,
  middleware: ['web'] as const,
  methods: ['GET', 'OPTIONS'],
}));
