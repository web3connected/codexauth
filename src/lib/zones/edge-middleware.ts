/**
 * Zone Edge Middleware - Next.js Middleware
 *
 * Edge middleware for zone detection and protection.
 * Add this to your middleware.ts to enable zone-based routing.
 *
 * @example
 * // middleware.ts
 * import { zoneMiddleware } from '@/lib/zones/edge-middleware';
 * export default zoneMiddleware;
 * export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
 *
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { UNASSIGNED_ZONE_ID } from './CodexRouteAnalyzer';
import { CODEX_ZONE_REGISTRY } from './CodexZoneRegistry';
// Note: route table (@/routes) uses Node.js fs/path — not available in edge runtime.
// Zone detection uses keyword heuristics here. Use getRoute() in server components only.

// Inline analyzer for edge runtime (no Node.js APIs)
const ZONE_STRATEGIES: Record<string, string[]> = {
  negative: ['blocked', 'quarantine', 'banned', 'restricted'],
  public: ['public', 'home', 'welcome', 'about', 'contact', 'landing'],
  identity: ['auth', 'login', 'logout', 'register', 'identity', 'verify', 'password', 'forgot', 'reset', 'session'],
  ops: ['health', 'status', 'ping', 'api', 'webhook', 'callback', 'test'],
  protected: ['dashboard', 'profile', 'account', 'settings', 'user', 'my'],
  system: ['internal', 'system', 'service', 'worker', 'job', 'queue', 'cron'],
  eventlogs: ['logs', 'events', 'audit', 'history', 'activity'],
  comms: ['messages', 'notifications', 'chat', 'email', 'sms', 'push', 'inbox'],
  payments: ['payments', 'billing', 'invoice', 'checkout', 'transaction', 'sync', 'import', 'export', 'transfer', 'backup'],
  analytics: ['analytics', 'metrics', 'stats', 'reports', 'insights', 'charts'],
  behavior: ['behavior', 'tracking', 'usage', 'engagement', 'patterns'],
  realtime: ['realtime', 'stream', 'streams', 'socket', 'websocket', 'presence', 'live', 'event', 'ai', 'ml', 'model', 'agent', 'copilot'],
  admin: ['admin', 'manage', 'control', 'superuser', 'root', 'master'],
};

const ZONE_NAME_TO_ID: Record<string, number> = Object.entries(CODEX_ZONE_REGISTRY).reduce(
  (accumulator, [zoneId, zoneName]) => {
    accumulator[zoneName] = Number(zoneId);
    return accumulator;
  },
  {} as Record<string, number>
);

export interface ZoneEdgeConfig {
  /** Enable zone headers on all responses */
  addHeaders?: boolean;
  /** Protected paths that require auth */
  protectedPaths?: string[];
  /** Admin paths that require admin auth */
  adminPaths?: string[];
  /** Login redirect URL */
  loginUrl?: string;
  /** Paths to skip zone checking */
  skipPaths?: string[];
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Detect zone from path using keyword heuristics.
 * Edge runtime only — no Node.js APIs (fs/path) allowed here.
 * For accurate route table lookup use getRoute() in server components.
 */
function detectZoneFromPath(path: string): { zone_id: number; zone_name: string } {
  // ── Keyword heuristic (edge-safe) ─────────────────────────────────────────
  const segments = path.toLowerCase().split('/').filter(Boolean);

  let bestZoneId = UNASSIGNED_ZONE_ID;
  let bestZoneName = 'unassigned';
  let bestScore = 0;

  for (const [zoneName, keywords] of Object.entries(ZONE_STRATEGIES)) {
    let score = 0;
    for (const keyword of keywords) {
      if (segments.some(seg => seg.includes(keyword))) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestZoneId = ZONE_NAME_TO_ID[zoneName] ?? UNASSIGNED_ZONE_ID;
      bestZoneName = zoneName;
    }
  }

  // Default API routes to ops
  if (bestZoneId === UNASSIGNED_ZONE_ID && path.startsWith('/api')) {
    return { zone_id: 3, zone_name: 'ops' };
  }

  return { zone_id: bestZoneId, zone_name: bestZoneName };
}

/**
 * Create zone middleware with configuration
 */
export function createZoneMiddleware(config: ZoneEdgeConfig = {}) {
  const {
    addHeaders = true,
    protectedPaths = ['/dashboard', '/profile', '/settings', '/account'],
    adminPaths = ['/admin'],
    loginUrl = '/login',
    skipPaths = ['/_next', '/favicon.ico', '/public'],
    debug = false,
  } = config;

  return async function zoneMiddleware(request: NextRequest): Promise<NextResponse> {
    const pathname = request.nextUrl.pathname;

    // Skip static files and configured paths
    if (skipPaths.some(skip => pathname.startsWith(skip))) {
      return NextResponse.next();
    }

    // Detect zone
    const { zone_id, zone_name } = detectZoneFromPath(pathname);

    // Forward zone info + path as request headers so server components can read them via headers().
    // This is the Next.js pattern for passing middleware data to server components.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-Codex-Zone', `Z${zone_id}`);
    requestHeaders.set('X-Codex-Zone-Name', zone_name);
    requestHeaders.set('X-Codex-Zone-Id', zone_id.toString());
    requestHeaders.set('X-Codex-Path', pathname);

    // Create response — forward the enriched headers to the server component
    const response = NextResponse.next({ request: { headers: requestHeaders } });

    // Also add as response headers (for browser devtools + codexsecure-networks proxy)
    if (addHeaders) {
      response.headers.set('X-Codex-Zone', `Z${zone_id}`);
      response.headers.set('X-Codex-Zone-Name', zone_name);
      response.headers.set('X-Codex-Zone-Id', zone_id.toString());
    }

    // Debug headers
    if (debug) {
      response.headers.set('X-Codex-Debug', 'true');
      response.headers.set('X-Codex-Path', pathname);
    }

    // Check protected paths via config lists (route table not available in edge runtime)
    const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
    const isAdminPath = adminPaths.some(p => pathname.startsWith(p));

    if (isProtectedPath || isAdminPath) {
      // Check for auth cookie/token
      const authToken = request.cookies.get('auth-token')?.value ||
                       request.cookies.get('next-auth.session-token')?.value ||
                       request.headers.get('authorization');

      if (!authToken) {
        // Redirect to login
        const redirectUrl = new URL(loginUrl, request.url);
        redirectUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // For admin paths, could add additional admin check here
      if (isAdminPath) {
        // Could validate admin role from token here
        response.headers.set('X-Codex-Admin-Check', 'true');
      }
    }

    return response;
  };
}

/**
 * Default zone middleware (ready to use)
 */
export const zoneMiddleware = createZoneMiddleware();

/**
 * Export config matcher for middleware.ts
 */
export const zoneMiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default zoneMiddleware;
