import { ProductSlide } from '@/components/codex/shared/Sliders/types';

/**
 * CodexHashSlide — CodexHarmonicHash explainer
 * Layout: comparison-cards — traditional credential hashing vs CodexHarmonicHash verification
 */
const CodexHashSlide: ProductSlide = {
  id: 'codexauth-codexhash',
  layout: 'comparison-cards',
  title: 'Powered by CodexHarmonicHash',
  titleGradient: { from: '#2DF4A1', to: '#2563EB' },
  description:
    'CodexAuth uses CodexHarmonicHash to verify credentials, sessions, and device fingerprints through deterministic integrity checks — without exposing or reversing sensitive inputs.',
  ctaText: 'Explore CodexHash',
  ctaLink: 'https://codexhash.io',
  tagColor: '#2DF4A1',
  backgroundColor: '#070D1F',
  image: '/assets/images/codexauth_slide_03.webp',
  imageAlt: 'CodexHarmonicHash — deterministic credential verification engine',
  comparisonCards: [
    {
      label: 'Traditional Hashing',
      items: [
        'Password hash comparison',
        'Credential state tied to database records',
        'Security depends on storage and lookup design',
      ],
      icons: [],
    },
    {
      label: 'CodexHarmonicHash',
      accentColor: '#2DF4A1',
      items: [
        'Deterministic harmonic verification',
        'Sensitive inputs are not reversible',
        'Designed for constant-time validation paths',
      ],
      icons: [],
    },
  ],
};

export default CodexHashSlide;