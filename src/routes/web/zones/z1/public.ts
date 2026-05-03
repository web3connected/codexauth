/**
 * Z1 Public Routes — CodexAuth
 *
 * Every route in this file is Z1_PUBLIC.
 * Zone contract applied automatically by Routes.loadCodexZonedRoutes():
 *   middleware: ['web']
 *   methods:    GET, OPTIONS
 *   auth:       not required
 */

export const routes = [
  { path: '/',                name: 'home',            meta: { title: 'CodexAuth - Secure Identity Platform' } },
  { path: '/about',           name: 'about',           meta: { title: 'About CodexAuth' } },
  { path: '/docs',            name: 'docs',            meta: { title: 'CodexAuth Documentation' } },
  { path: '/getting-started', name: 'getting-started', meta: { title: 'Getting Started' } },
  { path: '/terms',           name: 'terms',           meta: { title: 'Terms of Service' } },
  { path: '/privacy',         name: 'privacy',         meta: { title: 'Privacy Policy' } },
];
