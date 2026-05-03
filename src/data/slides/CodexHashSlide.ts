import { ProductSlide } from '@/components/codex/shared/Sliders/types';

/**
 * CodexHashSlide — CodexHarmonicHash explainer
 * Layout: comparison-cards — traditional hashing vs CodexHarmonicHash side by side
 */
const CodexHashSlide: ProductSlide = {
  id: 'codexauth-codexhash',
  layout: 'comparison-cards',
  title: 'Powered by CodexHarmonicHash',
  titleGradient: { from: '#2DF4A1', to: '#2563EB' },
  description:
    'Every credential, every session, every device fingerprint in CodexAuth is verified by the CodexHarmonicHash engine — not stored, never reversible.',
  ctaText: 'Explore CodexHash',
  ctaLink: 'https://codexhash.io',
  tagColor: '#2DF4A1',
  backgroundColor: '#070D1F',
  image: '/assets/images/codexauth_slide_03.webp',
  imageAlt: 'CodexHarmonicHash — stateless credential verification engine',
  comparisonCards: [
    {
      label: 'Traditional Hashing',
      items: ['bcrypt / argon2 lookup', 'DB round-trip required', 'Vulnerable to timing attacks'],
      icons: [],
    },
    {
      label: 'CodexHarmonicHash',
      accentColor: '#2DF4A1',
      items: ['Harmonic key derivation', 'Stateless — no DB lookup', 'Cryptographically constant-time'],
      icons: [],
    },
  ],
};

export default CodexHashSlide;
