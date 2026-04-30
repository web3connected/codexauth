import type { OverlayGridCard } from '@/components/codex/shared/panels/BgOverlayCardGridPanel';
import type { TimelineItem } from '@/components/codex/shared/panels/VerticalTimelinePanel';
import type { StatCard } from '@/components/codex/shared/panels/SplitTextStatsPanel';
import type { FactCard } from '@/components/codex/shared/panels/SplitTextFactsPanel';
import type { CtaButton } from '@/components/codex/shared/panels/CenteredCtaPanel';

export const aboutMissionParagraphs: string[] = [
  'Web3Codex builds identity and authentication infrastructure for developers who need more than JWT libraries — without the overhead of running an identity provider.',
  'CodexAuth combines three layers of the Web3Codex stack: CodexHarmonicHash for credential verification, CodexTime for TIU-anchored token binding, and CodexSecure for zone-based access enforcement.',
  'The result is a session that is mathematically time-locked, cryptographically chain-verified, and contextually zone-aware — from a single API call.',
];

export const aboutMissionHighlight = 'CodexAuth';

export const aboutStatCards: StatCard[] = [
  { value: 'Z1–Z12', label: 'Zone levels evaluated per session by CodexSecure', color: 'text-auth-primary' },
  { value: 'TIU', label: 'Time Interval Unit anchors every JWT to a precise temporal window', color: 'text-auth-secondary' },
  { value: '< 50ms', label: 'Average auth round-trip including zone evaluation and token issuance', color: 'text-white' },
];

export const aboutPrinciples: OverlayGridCard[] = [
  {
    symbol: '🔐',
    tag: 'CodexHarmonicHash · credential layer',
    name: 'Hash-Verified Identity',
    description: 'Passwords are not stored and compared. They are verified through CodexHarmonicHash — 16 rounds of HMAC-SHA3-512 with physics-derived entropy seeds. A tampered credential breaks the hash chain immediately.',
    stat: '16 rounds',
    statLabel: 'Entropy mixing per credential check',
  },
  {
    symbol: '⧖',
    tag: 'CodexTime · temporal layer',
    name: 'Time-Locked Sessions',
    description: 'Every JWT embeds a TIU — a harmonic float computed from the speed of light, Planck time, and the golden ratio. Tokens from expired TIU windows are rejected without a database lookup. Time moves; the token moves with it.',
    stat: '0.618034',
    statLabel: 'Canonical TIU anchor value',
  },
  {
    symbol: '🛡',
    tag: 'CodexSecure · zone layer',
    name: 'Zone Enforcement',
    description: 'CodexSecure evaluates device fingerprint, IP reputation, and user flags to assign a zone (Z1–Z12). Every route and API endpoint enforces zone boundaries automatically. No custom guard code required.',
    stat: '12',
    statLabel: 'Security zones enforced per session',
  },
  {
    symbol: '∞',
    tag: 'chain-linked · audit trail',
    name: 'Verifiable Auth Trail',
    description: 'Every login, token refresh, zone boundary crossing, and failed attempt is logged as a chain-linked audit record. Alter any entry and every record after it is immediately invalidated. No blockchain required.',
    stat: '1 bit',
    statLabel: 'Change detected across audit chain',
  },
];

export const aboutNamingParagraphs: string[] = [
  'A codex was not just a book. It was the invention of the bound manuscript — pages linked in sequence, each depending on the position of the last. It replaced the scroll because it was indexed, durable, and tamper-evident in a way scrolls were not.',
  'Authentication has the same problem scrolls had: tokens are stateless slips of data with no link to what came before. CodexAuth changes that by binding each session to a time anchor and a zone context — a chain of trust that cannot be silently forged.',
  'The codex was a technology leap in 300 AD. We think the same idea — chained, ordered, verifiable records — is still underused in modern auth. We are building the tools to change that.',
];

export const aboutNamingFacts: FactCard[] = [
  { label: 'Token structure', value: 'sub + zone + tiu + device_hash + exp', mono: true },
  { label: 'Replay prevention', value: 'Expired TIU → rejected without DB lookup', mono: false },
  { label: 'Requires', value: 'No blockchain · No identity provider · No ops overhead', mono: false },
];

export const aboutTimeline: TimelineItem[] = [
  {
    era: 'Ancient',
    label: 'Mathematical constants discovered',
    detail: 'φ, harmonic ratios, and geometric proportion encoded into architecture, music, and navigation for millennia.',
  },
  {
    era: '1800s–1900s',
    label: 'Physics formalises the constants',
    detail: 'Planck, Einstein, and others quantified what the ancients intuited — constants that govern every physical process in the universe.',
  },
  {
    era: '2010s',
    label: 'JWT and modern auth mature',
    detail: 'JSON Web Tokens, OAuth2, and OIDC give engineers a common token format — but replay prevention and zone enforcement remained custom problems.',
  },
  {
    era: 'Now',
    label: 'CodexAuth',
    detail: 'We combine CodexHarmonicHash credential verification, CodexTime TIU anchoring, and CodexSecure zone enforcement into a single auth API.',
  },
];

export const aboutCtaButtons: CtaButton[] = [
  { label: 'Read the Docs', href: '/docs', primary: true },
  { label: 'View on GitHub', href: 'https://github.com/web3connected/codexauth', external: true },
];
