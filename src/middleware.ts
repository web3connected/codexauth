/**
 * CodexAuth - Next.js Edge Middleware with Zone Routing
 *
 * Detects zones from URL path and sets X-Codex-Zone headers.
 * codexsecure-networks reads X-Codex-Zone: Z{id} to route to the
 * correct isolated port segment.
 *
 * Auth note: CodexAuth has NO local login/register.
 * Authentication is handled by web3connected.com.
 * Users activate the CodexAuth service at web3connected.com/codexauth/
 * and are redirected back here with a session token.
 *
 * @see src/lib/zones/edge-middleware.ts
 */

// Import directly from edge-specific file — NOT the barrel index.ts
// (index.ts re-exports CodexEthosLattice which uses Node.js crypto, banned in edge runtime)
import { createZoneMiddleware } from '@/lib/zones/edge-middleware';

// Auth lives on web3connected — unauthenticated users are sent there
const WEB3CONNECTED_AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://web3connected.com/codexauth/';

export default createZoneMiddleware({
  addHeaders: true,

  // Protected: developer API key management areas
  protectedPaths: [
    '/dashboard',
    '/api-keys',
    '/settings',
    '/usage',
    '/webhooks',
  ],

  // Admin paths require elevated zone
  adminPaths: [
    '/admin',
  ],

  // No local /login page — send to web3connected
  loginUrl: WEB3CONNECTED_AUTH_URL,

  skipPaths: [
    '/_next',
    '/favicon.ico',
    '/public',
    '/api/health',
  ],

  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)',],
};
