import { ProductSlide } from '@/components/codex/shared/Sliders/types';

/**
 * HeroSlide — Main hero for CodexAuth
 * Layout: app-showcase — bold headline with accent words, dual CTAs, floating UI card right
 */
const HeroSlide: ProductSlide = {
  id: 'codexauth-hero',
  layout: 'app-showcase',
  tag: 'Zone-Aware Authentication',
  tagColor: '#2563EB',
  title: 'Auth built for Web3 apps and wallets',
  titleAccents: [
    { word: 'apps', color: '#2DF4A1' },
    { word: 'wallets', color: '#818CF8' },
  ],
  description:
    'Drop-in authentication with Z1–Z12 zone enforcement, TIU time-locked JWTs, and CodexHarmonicHash-verified credentials. Sub-50ms on every verify.',
  ctaText: 'Start Building Free',
  ctaLink: '/getting-started',
  ctaSecondary: { text: 'View Docs', link: '/docs' },
  image: '/assets/images/codexauth_slide_01.jpg',
  imageAlt: 'CodexAuth sign-in UI — zone-aware authentication interface',
  backgroundColor: '#050B18',
};

export default HeroSlide;
