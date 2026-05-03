/**
 * Zone API Middleware - Next.js API Route Protection
 *
 * Provides middleware functions for protecting Next.js API routes
 * with zone-based access control.
 *
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { CodexRouteAnalyzer, UNASSIGNED_ZONE_ID } from './CodexRouteAnalyzer';
import { CodexRouteServer, HttpMethod } from './CodexRouteServer';

const analyzer = new CodexRouteAnalyzer();

export interface ZoneMiddlewareResult {
  success: boolean;
  zone_id: number;
  zone_name: string;
  error?: string;
  response?: NextResponse;
}

export interface ZoneMiddlewareOptions {
  /** Allow unassigned zones (default: true) */
  allowUnassigned?: boolean;
  /** Enforce method restrictions (default: true) */
  enforceMethod?: boolean;
  /** Add zone headers to response (default: true) */
  addHeaders?: boolean;
  /** Specific zones to allow (if set, only these zones are permitted) */
  allowedZones?: number[];
  /** Custom auth check function */
  authCheck?: () => Promise<boolean> | boolean;
}

/**
 * Analyze zone for a request
 */
export function analyzeZone(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  return analyzer.getZoneForAppRoute(pathname);
}

/**
 * Add zone headers to a response
 */
export function addZoneHeaders(
  response: NextResponse,
  zoneId: number,
  zoneName: string
): NextResponse {
  response.headers.set('X-Codex-Zone', zoneId.toString());
  response.headers.set('X-Codex-Zone-Name', zoneName);
  return response;
}

/**
 * Zone middleware for Next.js API routes
 *
 * @example
 * // In app/api/admin/route.ts
 * import { withZone } from '@/lib/zones/middleware';
 *
 * export const GET = withZone(async (request) => {
 *   return NextResponse.json({ data: 'admin only' });
 * }, { allowedZones: [12] });
 */
export function withZone<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse> | NextResponse,
  options: ZoneMiddlewareOptions = {}
): (request: T) => Promise<NextResponse> {
  const {
    allowUnassigned = true,
    enforceMethod = true,
    addHeaders = true,
    allowedZones,
    authCheck,
  } = options;

  return async (request: T): Promise<NextResponse> => {
    const pathname = request.nextUrl.pathname;
    const method = request.method.toUpperCase() as HttpMethod;

    // Analyze zone
    const detection = analyzer.getZoneForAppRoute(pathname);
    const zoneId = detection.zone_id;
    const zoneName = detection.zone_name;

    // Check for unassigned zone
    if (!allowUnassigned && zoneId === UNASSIGNED_ZONE_ID) {
      const errorResponse = NextResponse.json(
        {
          success: false,
          error: 'Zone Not Found',
          message: 'This route is not assigned to any zone',
          path: pathname,
        },
        { status: 403 }
      );
      return addHeaders ? addZoneHeaders(errorResponse, zoneId, zoneName) : errorResponse;
    }

    // Check allowed zones
    if (allowedZones && !allowedZones.includes(zoneId)) {
      const errorResponse = NextResponse.json(
        {
          success: false,
          error: 'Zone Access Denied',
          message: `Access to zone ${zoneId} (${zoneName}) is not permitted`,
          zone_id: zoneId,
          allowed_zones: allowedZones,
        },
        { status: 403 }
      );
      return addHeaders ? addZoneHeaders(errorResponse, zoneId, zoneName) : errorResponse;
    }

    // Check method restrictions
    if (enforceMethod && zoneId !== UNASSIGNED_ZONE_ID) {
      if (!CodexRouteServer.isMethodAllowed(zoneId, method)) {
        const zone = CodexRouteServer.getZone(zoneId);
        const errorResponse = NextResponse.json(
          {
            success: false,
            error: 'Method Not Allowed',
            message: `${method} is not allowed in zone ${zoneName}`,
            zone_id: zoneId,
            allowed_methods: zone?.rules.methods_allowed || [],
          },
          { status: 405 }
        );
        if (zone) {
          errorResponse.headers.set('Allow', zone.rules.methods_allowed.join(', '));
        }
        return addHeaders ? addZoneHeaders(errorResponse, zoneId, zoneName) : errorResponse;
      }
    }

    // Check auth requirement
    if (zoneId !== UNASSIGNED_ZONE_ID && CodexRouteServer.requiresAuth(zoneId)) {
      if (authCheck) {
        const isAuthenticated = await authCheck();
        if (!isAuthenticated) {
          const errorResponse = NextResponse.json(
            {
              success: false,
              error: 'Unauthorized',
              message: `Authentication required for zone ${zoneName}`,
              zone_id: zoneId,
            },
            { status: 401 }
          );
          return addHeaders ? addZoneHeaders(errorResponse, zoneId, zoneName) : errorResponse;
        }
      }
    }

    // Execute handler
    let response = await handler(request);

    // Add zone headers
    if (addHeaders) {
      response = addZoneHeaders(response, zoneId, zoneName);
    }

    return response;
  };
}

/**
 * Require specific zone(s) for a route
 *
 * @example
 * export const GET = requireZone([12], async (request) => {
 *   return NextResponse.json({ admin: true });
 * });
 */
export function requireZone<T extends NextRequest>(
  zones: number | number[],
  handler: (request: T) => Promise<NextResponse> | NextResponse
): (request: T) => Promise<NextResponse> {
  const allowedZones = Array.isArray(zones) ? zones : [zones];
  return withZone(handler, { allowedZones, allowUnassigned: false });
}

/**
 * Require admin zone (Z12)
 */
export function requireAdmin<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse> | NextResponse
): (request: T) => Promise<NextResponse> {
  return requireZone(12, handler);
}

/**
 * Require protected zone or higher (Z4+)
 */
export function requireProtected<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse> | NextResponse
): (request: T) => Promise<NextResponse> {
  return requireZone([4, 5, 6, 7, 8, 9, 10, 11, 12], handler);
}

/**
 * Public zone only (Z1)
 */
export function publicOnly<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse> | NextResponse
): (request: T) => Promise<NextResponse> {
  return requireZone(1, handler);
}
