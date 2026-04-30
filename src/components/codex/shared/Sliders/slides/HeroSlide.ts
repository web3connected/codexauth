import { ProductSlide } from '../types';

/**
 * HeroSlide — Main hero for CodexAuth
 * Layout: centered — big headline, subtitle, dual CTAs
 */
const HeroSlide: ProductSlide = {
  id: 'codexauth-hero',
  layout: 'centered',
  tag: 'Quantum-Resistant',
  tagColor: 'sky',
  title: 'Hash with Confidence',
  description:
    'CodexAuth delivers quantum-resistant cryptographic hashing — built for the next generation of secure applications.',
  ctaText: 'Get Started',
  ctaLink: 'https://web3connected.com/getting-started/codexauth',
  image: '/assets/images/quantum-computing.jpg',
  imageAlt: 'Quantum computing visualization',
};

export default HeroSlide;
