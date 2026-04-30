import type { PanelCard } from '@/components/codex/shared/panels/ThreePanelCardDesign';

export const codexHashConceptCards: [PanelCard, PanelCard, PanelCard] = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
        <circle cx="12" cy="12" r="3.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Quantum Resistant',
    tagline: 'HMAC-SHA3-512 · 16 entropy rounds',
    description:
      'CodexHarmonicHash uses physics-based entropy mixing across 16 iterative rounds on top of SHA3-512. The result is a hash that cannot be reversed or collision-forged — even by quantum computers.',
    stat: '65,000×',
    statLabel: 'more collision-resistant than SHA-256',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Time-Bound',
    tagline: 'TIU temporal anchor · replay-proof',
    description:
      'Every hash embeds a TIU (Time Interval Unit) from CodexTime. The hash changes as time progresses — so a hash from five minutes ago will not validate now. Backdating and replay attacks are mathematically impossible.',
    stat: 'Zero',
    statLabel: 'valid replays from past TIU windows',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: 'Chain Verified',
    tagline: 'Tamper-evident event chains',
    description:
      'Each event links to the previous via a chained formula: SHA256(payload + prev_hash + context). Alter any single event and every downstream hash breaks instantly — no blockchain, no consensus required.',
    stat: '1 bit',
    statLabel: 'of change detected across entire chain',
  },
];
