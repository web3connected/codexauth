import type { TierCard } from '@/components/codex/shared/panels/TierComparisonGrid';

export const codexHashTiers: TierCard[] = [
  {
    name: 'Commercial',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    stat: '256-bit',
    statLabel: '64 hex characters per hash',
    badge: 'Standard',
    description:
      'Performance-optimised hashing for consumer apps, SaaS platforms, and any use case where throughput matters alongside strong security.',
    useCases: [
      'User data integrity',
      'API payload signing',
      'Document fingerprinting',
      'Session verification',
    ],
    highlight: false,
    ctaLabel: 'Get Started',
    ctaHref: '/docs/getting-started',
  },
  {
    name: 'Enterprise',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    stat: '512-bit',
    statLabel: '128 hex characters per hash',
    badge: 'Most Popular',
    description:
      'Double-width output for regulated industries. Built for SOC2, HIPAA, and GDPR compliance where audit trails and data integrity proofs are mandatory.',
    useCases: [
      'Healthcare records',
      'Financial transactions',
      'Legal document chains',
      'Compliance audit logs',
    ],
    highlight: true,
    ctaLabel: 'Start Free Trial',
    ctaHref: '/pricing',
  },
  {
    name: 'Government',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    stat: '1024-bit',
    statLabel: '256 hex characters per hash',
    badge: 'Defense Grade',
    description:
      'Maximum-strength output with Harmonic Lock — a domain-separated layer that cannot be cross-validated against lower tiers. Designed for critical infrastructure.',
    useCases: [
      'Critical infrastructure',
      'Defense systems',
      'National records integrity',
      'Long-term evidence preservation',
    ],
    highlight: false,
    ctaLabel: 'Contact Sales',
    ctaHref: '/support',
  },
];
