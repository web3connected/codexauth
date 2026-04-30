import React from 'react';
import type { TierCard } from '@/components/codex/shared/panels/TierComparisonGrid';

export const codexHashTiers: TierCard[] = [
  {
    name: 'Starter',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    stat: '10K',
    statLabel: 'auth events / month',
    badge: 'Free',
    description:
      'Perfect for side projects and early-stage apps. Includes zone-aware sessions, JWT issuance, and full API access on the free tier.',
    useCases: [
      'Side projects',
      'Prototypes',
      'Internal tools',
      'Developer testing',
    ],
    highlight: false,
    ctaLabel: 'Get Started Free',
    ctaHref: '/getting-started',
  },
  {
    name: 'Growth',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    stat: '500K',
    statLabel: 'auth events / month',
    badge: 'Most Popular',
    description:
      'Built for scaling SaaS. Full zone enforcement (Z1–Z12), device trust, TIU time-locked JWTs, and SOC2-ready audit logs.',
    useCases: [
      'SaaS applications',
      'Web3 portals',
      'API-first products',
      'Multi-tenant platforms',
    ],
    highlight: true,
    ctaLabel: 'Start Free Trial',
    ctaHref: '/getting-started',
  },
  {
    name: 'Enterprise',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    stat: 'Unlimited',
    statLabel: 'auth events + dedicated infra',
    badge: 'Enterprise',
    description:
      'Dedicated infrastructure, custom zone policies, SAML/OIDC federation, 99.99% SLA, and a dedicated support engineer.',
    useCases: [
      'Regulated industries',
      'Financial services',
      'Healthcare platforms',
      'Government portals',
    ],
    highlight: false,
    ctaLabel: 'Contact Sales',
    ctaHref: '/support',
  },
];
