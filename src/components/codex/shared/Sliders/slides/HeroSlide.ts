import { ProductSlide } from '../types';

/**
 * HeroSlide — Main hero for CodexHash
 * Layout: centered — big headline, subtitle, dual CTAs
 */
const HeroSlide: ProductSlide = {
  id: 'codexhash-hero',
  layout: 'centered',
  tag: 'Quantum-Resistant',
  tagColor: 'sky',
  title: 'Hash with Confidence',
  description:
    'CodexHash delivers quantum-resistant cryptographic hashing — built for the next generation of secure applications.',
  ctaText: 'Get Started',
  ctaLink: 'https://web3connected.com/getting-started/codexhash',
  image: '/assets/images/quantum-computing.jpg',
  imageAlt: 'Quantum computing visualization',
};

export default HeroSlide;
