import type { PanelCard } from '@/components/codex/shared/panels/ThreePanelCardDesign';

export const codexHashConceptCards: [PanelCard, PanelCard, PanelCard] = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Zone-Aware Auth',
    tagline: 'Z1–Z12 enforcement · route protection',
    description:
      'Every session is issued a zone claim (Z1–Z12) from CodexSecure. Routes and APIs enforce zone boundaries automatically — users only access what their trust level permits.',
    stat: '12',
    statLabel: 'security zones enforced per session',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Time-Locked Tokens',
    tagline: 'TIU temporal anchor · replay-proof JWTs',
    description:
      'Every JWT embeds a TIU (Time Interval Unit) from CodexTime. Tokens are bound to a precise time window — replayed tokens from expired windows are rejected mathematically.',
    stat: 'Zero',
    statLabel: 'valid replays from expired TIU windows',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Hash-Verified Identity',
    tagline: 'CodexHash credentials · tamper-evident',
    description:
      'Credentials are verified through CodexHarmonicHash — not plain bcrypt. Any credential tampering breaks the hash chain instantly, with no blockchain or consensus required.',
    stat: '1 bit',
    statLabel: 'of change detected across credential chain',
  },
];
