/**
 * Z1 Route — Zones Registry Dev Page
 *
 * /zones — shows all registered zones with live contract data from codexsecure-api.
 * Zone: Z1_PUBLIC (web, GET, no auth)
 */

export const routes = [
  {
    path: '/zones',
    name: 'zone-list',
    zone: 'Z1_PUBLIC',
    pattern: {
      inside: ['id', 'key', 'name', 'description', 'rules', 'tier'],
      threshold: 0.0,
    },
    meta: { title: 'Zone Registry · CodexAuth' },
  },
];
