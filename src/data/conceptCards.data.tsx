import type { PanelCard } from '@/components/codex/shared/panels/ThreePanelCardDesign';

export const codexHashConceptCards: [PanelCard, PanelCard, PanelCard] = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Unified Sign-In',
    tagline: 'Web2 + Web3 · one session model',
    description:
      'Email/password and wallet-based sign-in are handled by the same SDK, issuing the same session token format. No separate flows, no separate middleware — one auth surface for all users.',
    stat: '2-in-1',
    statLabel: 'auth modes in a single SDK install',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Time-Locked JWTs',
    tagline: 'TIU window binding · replay-proof',
    description:
      'Every JWT issued by CodexAuth is bound to a Time Interval Unit window. Tokens outside their window are rejected instantly — no database lookup, no session store query.',
    stat: 'Zero',
    statLabel: 'valid replays from expired token windows',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Session Lifecycle',
    tagline: 'refresh · revoke · multi-device',
    description:
      'Token refresh, silent re-authentication, revocation, and multi-device session tracking are built into the SDK. No custom middleware or external session store needed.',
    stat: '<50ms',
    statLabel: 'token refresh and re-auth round-trip',
  },
];
