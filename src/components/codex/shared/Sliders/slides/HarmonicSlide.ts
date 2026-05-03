import { ProductSlide } from '../types';

/**
 * HarmonicSlide — Explains the Harmonic Hashing concept
 * Layout: split-right — content left, image right
 */
const HarmonicSlide: ProductSlide = {
  id: 'codexhash-harmonic',
  layout: 'split-right',
  tag: 'Harmonic Hashing',
  tagColor: 'purple',
  title: 'Physics-Backed Security',
  description:
    'Our Harmonic Hash algorithm uses quantum physics constants to generate hashes that are mathematically impossible to reverse — even with quantum computers.',
  ctaText: 'Learn More',
  ctaLink: '/harmonic',
  stats: [
    { label: 'Security Tier', value: 'Quantum' },
    { label: 'Hash Length', value: '512-bit' },
    { label: 'vs SHA-256', value: '10,000×' },
  ],
};

export default HarmonicSlide;
