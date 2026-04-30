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
    'Quantum-resistant hashing for modern applications. Install, integrate, and generate your first hash in under ten minutes.',
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
    title: 'Easy to Use',
    tagline: 'Simple API surface',
    description:
      'A clean, intuitive API with comprehensive documentation means you can generate your first quantum-resistant hash in minutes, not hours.',
    stat: '< 10 min',
    statLabel: 'average time to first hash',
  },
  {
    iconName: 'Shield',
    title: 'Quantum Secure',
    tagline: '512-bit strength',
    description:
      'Built on the HarmonicHash algorithm using universal physics constants — speed of light, Planck frequency, and the golden ratio — for genuine quantum resistance.',
    stat: '512-bit',
    statLabel: 'cryptographic strength',
  },
  {
    iconName: 'Globe',
    title: 'Versatile',
    tagline: 'Multi-language SDKs',
    description:
      'Official SDKs for JavaScript, TypeScript, and Python. Supports multiple hashing modes, temporal anchoring, and hex / Base64 output formats.',
    stat: '3+',
    statLabel: 'official SDK languages',
  },
];

// ─── Numbered steps ───────────────────────────────────────────────────────────
export const gettingStartedSteps: NumberedStep[] = [
  {
    step: 1,
    title: 'Install the SDK',
    description: 'Add CodexAuth to your project with your preferred package manager.',
    detail: 'npm install @web3codex/codexauth   |   yarn add @web3codex/codexauth   |   pnpm add @web3codex/codexauth',
  },
  {
    step: 2,
    title: 'Import and Initialise',
    description: 'Import HarmonicHash and create a client instance with your preferred configuration.',
    detail: 'Pass sacredMatrix (default: 12) and temporalDynamics (true/false) to tune security and performance.',
  },
  {
    step: 3,
    title: 'Generate Your First Hash',
    description: 'Call hasher.generate(input) with any string, Buffer, or object to produce a quantum-resistant hash.',
    detail: 'The hash output is deterministic for the same input and configuration, and encodes 512 bits of security.',
  },
  {
    step: 4,
    title: 'Verify Hash Integrity',
    description: 'Use hasher.verify(input, hash) to validate that a hash matches its original input.',
    detail: 'Verification is constant-time to prevent timing attacks and returns a boolean result.',
  },
  {
    step: 5,
    title: 'Explore Advanced Features',
    description: 'Unlock temporal anchoring, fork detection, hash chaining, and replay prevention for production use.',
    detail: 'See the full API Reference and Examples sections in Documentation for in-depth guidance.',
  },
];

// ─── Code examples ────────────────────────────────────────────────────────────
export const gettingStartedLanguages: QuickStartLanguage[] = [
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'python',     name: 'Python',     icon: 'PY' },
];

export const gettingStartedCodeExamples: Record<string, string> = {
  typescript: `import { HarmonicHash } from '@web3codex/codexauth';

const hasher = new HarmonicHash({
  sacredMatrix: 12,       // Sacred 12-dimensional matrix
  temporalDynamics: true, // Enable TIU temporal binding
});

// Generate a quantum-resistant hash
const input = 'Hello, CodexAuth!';
const hash = await hasher.generate(input);
console.log(hash);
// → "9a7f5e2d8c1b6e4f3a9d7c2e8b1f5a6c..."

// Verify hash integrity
const isValid = await hasher.verify(input, hash);
console.log(isValid); // true`,

  javascript: `const { HarmonicHash } = require('@web3codex/codexauth');

const hasher = new HarmonicHash({
  sacredMatrix: 12,
  temporalDynamics: true,
});

// Generate a quantum-resistant hash
const input = 'Hello, CodexAuth!';
const hash = await hasher.generate(input);
console.log(hash);
// → "9a7f5e2d8c1b6e4f3a9d7c2e8b1f5a6c..."

// Verify hash integrity
const isValid = await hasher.verify(input, hash);
console.log(isValid); // true`,

  python: `from codexauth import HarmonicHash

hasher = HarmonicHash(
    sacred_matrix=12,
    temporal_dynamics=True,
)

# Generate a quantum-resistant hash
input_data = "Hello, CodexAuth!"
hash_value = hasher.generate(input_data)
print(hash_value)
# → "9a7f5e2d8c1b6e4f3a9d7c2e8b1f5a6c..."

# Verify hash integrity
is_valid = hasher.verify(input_data, hash_value)
print(is_valid)  # True`,
};

export const gettingStartedInstallCommands: InstallCommand[] = [
  { manager: 'npm',  command: 'npm install @web3codex/codexauth' },
  { manager: 'yarn', command: 'yarn add @web3codex/codexauth' },
  { manager: 'pnpm', command: 'pnpm add @web3codex/codexauth' },
  { manager: 'pip',  command: 'pip install codexauth' },
];

// ─── CTA ─────────────────────────────────────────────────────────────────────
export const gettingStartedCtaButtons: CtaButton[] = [
  { label: 'Read the Documentation', href: '/docs', primary: true },
  { label: 'Try API Explorer',        href: '/api-explorer' },
];
