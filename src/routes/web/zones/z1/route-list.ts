/**
 * Z1 Route List — CodexAuth Dev Tooling
 *
 * The /routes page — shows all registered routes across all zones.
 * Zone: Z1_PUBLIC (web, GET, no auth)
 *
 * This is a developer portal — the route list is intentionally public.
 * Zone contract applied automatically by Routes.loadCodexZonedRoutes().
 */

export const routes = [
  {
    path: '/routes',
    name: 'route-list',
    zone: 'Z1_PUBLIC',
    // target_zone: after a developer inspects this page they navigate to admin (Z12).
    // Demonstrates zone composition: Z1 → Z12 chain.
    target_zone: 'Z12',
    pattern: {
      // Fields this page renders — used for inside/outside coherence scoring
      inside: ['zone', 'path', 'middleware', 'methods', 'zone_override', 'pattern'],
      // No outside — GET only, no form submissions
      threshold: 0.0,  // public dev tool — no coherence requirement
    },
    meta: { title: 'Route List · CodexAuth' },
  },
];
