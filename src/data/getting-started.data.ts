import type { NumberedStep } from '@/components/codex/shared/panels/NumberedStepsPanel';
import type { QuickStartLanguage, InstallCommand } from '@/components/codex/shared/panels/CodeBlockQuickStart';
import type { CtaButton } from '@/components/codex/shared/panels/CenteredCtaPanel';

// ─── Hero ────────────────────────────────────────────────────────────────────
export const gettingStartedHero = {
  badge: 'Developer Guide',
  eyebrow: 'Developer Guide',
  title: 'Get Started with',
  titleHighlight: 'CodexAuth',
  subtitle:
    'Zone-aware authentication for modern applications. Install, integrate, and issue your first time-locked JWT in under ten minutes.',
  backgroundImageSrc: '/assets/images/quantum-computing.jpg',
} as const;

// ─── Feature cards (icon assembled in page) ──────────────────────────────────
export interface GsFeatureCard {
  iconName: 'Zap' | 'Shield' | 'Globe';
  title: string;
  tagline: string;
  description: string;
  stat: string;
  statLabel: string;
}

export const gettingStartedFeatureCards: GsFeatureCard[] = [
  {
    iconName: 'Zap',
    title: 'Fast Integration',
    tagline: 'One SDK, one import',
    description:
      'A clean, intuitive API with full TypeScript types. Login, token refresh, zone enforcement, and protected API calls — all from a single import.',
    stat: '< 10 min',
    statLabel: 'average time to first JWT',
  },
  {
    iconName: 'Shield',
    title: 'Zone-Aware Security',
    tagline: 'Z1–Z12 enforcement',
    description:
      'Every session carries a zone claim evaluated by CodexSecure. Routes and APIs enforce zone boundaries automatically — no custom guard code required.',
    stat: '12',
    statLabel: 'security zones enforced',
  },
  {
    iconName: 'Globe',
    title: 'Replay-Proof JWTs',
    tagline: 'TIU temporal anchor',
    description:
      'Tokens embed a Time Interval Unit from CodexTime. Expired or replayed tokens are rejected without a database lookup — zero overhead on every request.',
    stat: 'Zero',
    statLabel: 'valid replays from expired windows',
  },
];

// ─── Numbered steps ───────────────────────────────────────────────────────────
export const gettingStartedSteps: NumberedStep[] = [
  {
    step: 1,
    title: 'Install the SDK',
    description: 'Add the CodexAuth SDK to your project with your preferred package manager.',
    detail: 'npm install @web3connected/codexauth-sdk   |   yarn add @web3connected/codexauth-sdk',
  },
  {
    step: 2,
    title: 'Initialise the Client',
    description: 'Create a CodexAuthClient instance pointing at the CodexAuth API.',
    detail: 'Pass your CODEXAUTH_APP_ID and the API URL: https://codexauth.web3connected.com/api',
  },
  {
    step: 3,
    title: 'Authenticate a User',
    description: 'Call auth.login() with the user\'s identifier and password to receive a signed JWT.',
    detail: 'The response includes a zone claim (Z1–Z12), a TIU-anchored JWT, and a refresh token.',
  },
  {
    step: 4,
    title: 'Verify Tokens Server-side',
    description: 'Use auth.verify() in your middleware to validate every protected request.',
    detail: 'Verification checks the JWT signature, TIU window, zone claim, and revocation status — no DB hit.',
  },
  {
    step: 5,
    title: 'Enforce Zone Policies',
    description: 'Read the zone claim on each request and gate access to sensitive operations.',
    detail: 'Z1–Z3 = public, Z4–Z7 = authenticated, Z8–Z12 = elevated. See the Docs for the full zone matrix.',
  },
];

// ─── Code examples ────────────────────────────────────────────────────────────
export const gettingStartedLanguages: QuickStartLanguage[] = [
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
];

export const gettingStartedCodeExamples: Record<string, string> = {
  typescript: `import { CodexAuthClient, AuthSession } from '@web3connected/codexauth-sdk';

const auth = new CodexAuthClient({
  apiUrl: 'https://codexauth.web3connected.com/api',
  appId: process.env.CODEXAUTH_APP_ID!,
});

// 1. Login — returns a zone-aware, TIU time-locked session
const session: AuthSession = await auth.login({
  identifier: 'user@example.com',
  password: 'secret',
});

console.log(session.zone);  // "Z4"
console.log(session.token); // "eyJhbGci..."

// 2. Verify server-side (e.g. in middleware)
const claims = await auth.verify(session.token);
if (!claims.valid) throw new Error(claims.reason);

// 3. Enforce zone policy
if (parseInt(claims.zone.slice(1)) < 4) {
  throw new Error('Insufficient zone level');
}

// 4. Refresh before TIU window expires
const refreshed = await auth.refresh(session.refreshToken);`,

  javascript: `const { CodexAuthClient } = require('@web3connected/codexauth-sdk');

const auth = new CodexAuthClient({
  apiUrl: 'https://codexauth.web3connected.com/api',
  appId: process.env.CODEXAUTH_APP_ID,
});

// 1. Login
const session = await auth.login({
  identifier: 'user@example.com',
  password: 'secret',
});

console.log(session.zone);  // "Z4"
console.log(session.token); // "eyJhbGci..."

// 2. Verify & use claims
const claims = await auth.verify(session.token);
console.log(claims.valid); // true

// 3. Protected API call
const profile = await auth.get('/users/me', session.token);
console.log(profile.data);`,
};

export const gettingStartedInstallCommands: InstallCommand[] = [
  { manager: 'npm',  command: 'npm install @web3connected/codexauth-sdk' },
  { manager: 'yarn', command: 'yarn add @web3connected/codexauth-sdk' },
  { manager: 'pnpm', command: 'pnpm add @web3connected/codexauth-sdk' },
];

// ─── CTA ─────────────────────────────────────────────────────────────────────
export const gettingStartedCtaButtons: CtaButton[] = [
  { label: 'Read the Documentation', href: '/docs', primary: true },
  { label: 'View API Reference',      href: '/docs#api-reference' },
];
