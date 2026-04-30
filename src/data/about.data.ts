import type { OverlayGridCard } from '@/components/codex/shared/panels/BgOverlayCardGridPanel';
import type { TimelineItem } from '@/components/codex/shared/panels/VerticalTimelinePanel';
import type { StatCard } from '@/components/codex/shared/panels/SplitTextStatsPanel';
import type { FactCard } from '@/components/codex/shared/panels/SplitTextFactsPanel';
import type { CtaButton } from '@/components/codex/shared/panels/CenteredCtaPanel';

export const aboutMissionParagraphs: string[] = [
  'Web3Codex builds tamper-evident, time-bound, and chain-verified hashing for developers who need more than SHA-256 — without running a blockchain.',
  'Our flagship product, CodexHarmonicHash, applies HMAC-SHA3-512 across 16 entropy-mixing rounds seeded from physics-derived constants. Collision resistance comes not just from computation, but from the structure of the universe.',
  'Every hash is anchored to the current moment via the TIU — a harmonic float computed from the speed of light, Planck time, and the golden ratio. You cannot spoof a TIU. Time moves, and so does the hash.',
];

export const aboutMissionHighlight = 'CodexHarmonicHash';

export const aboutStatCards: StatCard[] = [
  { value: 'φ = 1.618…', label: 'The same ratio in sunflower seeds, galaxies, and our entropy seeds', color: 'text-auth-primary' },
  { value: 'sin(t × 2π)', label: 'Pythagorean harmonic oscillation — now a cryptographic time anchor', color: 'text-auth-secondary' },
  { value: '16 rounds', label: 'Iterative entropy mixing — each round recombines physics with data', color: 'text-white' },
];

export const aboutPrinciples: OverlayGridCard[] = [
  {
    symbol: 'φ',
    tag: 'golden ratio · entropy seed',
    name: 'The Golden Ratio',
    description: 'φ = 1.6180339… appears without being placed — in nautilus shells, in the proportions of the Parthenon, in the branching of trees. It is not a human invention. We use it as an entropy seed because nature already proved it works.',
    stat: '1.618…',
    statLabel: 'Immovable constant',
  },
  {
    symbol: 'C',
    tag: 'speed of light · time anchor',
    name: 'The Speed of Light',
    description: 'Every hash in CodexHarmonicHash is anchored to physical time via a constant derived from C and Planck time. Not a clock on a server — a constant of the universe. It cannot be faked or rewound.',
    stat: '299,792 km/s',
    statLabel: 'The only clock we trust',
  },
  {
    symbol: '∿',
    tag: 'sin(t × 2π) · TIU function',
    name: 'Harmonic Oscillation',
    description: 'Pythagoras described the universe as a harmony of ratios. We use sin(fractional_time × 2π) — the same oscillation function — to compute the TIU that binds every hash to the present moment.',
    stat: '0.618034',
    statLabel: 'Canonical TIU anchor',
  },
  {
    symbol: '⧖',
    tag: 'chain-linked · tamper-evident',
    name: 'The Chain',
    description: 'Ancient manuscripts were called codices because of how they were bound: sequentially, each page depending on the last. Our hash chains work the same way. Change one entry and every record after it breaks instantly.',
    stat: '1 bit',
    statLabel: 'Change detected across chain',
  },
];

export const aboutNamingParagraphs: string[] = [
  'A codex was not just a book. It was the invention of the bound manuscript — pages linked in sequence, each depending on the position of the last. It replaced the scroll because it was indexed, durable, and tamper-evident in a way scrolls were not.',
  'That is exactly how our hash chains work. Every event links to the one before it. Alter any record, and every record after it becomes invalid. No consensus mechanism. No token. Just mathematics.',
  'The codex was a technology leap in 300 AD. We think the same idea — chained, ordered, verifiable records — is still underused in modern software. We are building the tools to change that.',
];

export const aboutNamingFacts: FactCard[] = [
  { label: 'Chain formula', value: 'SHA256(payload + prev_hash + context)', mono: true },
  { label: 'Chain property', value: 'Alter one record → all downstream hashes invalid', mono: false },
  { label: 'Requires', value: 'No blockchain · No consensus · No token', mono: false },
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
    label: 'Cryptography matures',
    detail: 'SHA-3, HMAC, and post-quantum hashing give engineers tools to build tamper-evident systems at scale.',
  },
  {
    era: 'Now',
    label: 'CodexAuth',
    detail: 'We combine all three layers: physics-derived constants, modern cryptographic primitives, and chain-linked temporal anchoring.',
  },
];

export const aboutCtaButtons: CtaButton[] = [
  { label: 'Read the Docs', href: '/docs', primary: true },
  { label: 'View on GitHub', href: 'https://github.com/web3codex/codexauth', external: true },
];
