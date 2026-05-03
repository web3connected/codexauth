import { ProductSlide } from '@/components/codex/shared/Sliders/types';

/**
 * TIUSlide — Token Identity Units (TIU) explainer
 * Layout: feature-checklist — full-bleed gradient, bold headline + bullet features left, visual right
 */
const TIUSlide: ProductSlide = {
  id: 'codexauth-tiu',
  layout: 'feature-checklist',
  tag: 'Token Identity Units',
  title: 'Time-locked tokens that never lie',
  description: '',
  tagColor: '#2563EB',
  backgroundColor: '#050B18',
  bulletPoints: [
    {
      text: 'TIU JWTs bind every token to a cryptographic time window — expired windows are rejected at the gate',
    },
    {
      text: 'Each token carries wallet address, zone level, and device fingerprint — forged tokens fail immediately',
    },
    {
      text: 'Sub-50ms verification across Z1–Z12 — no DB lookup required, hash-native validation only',
    },
  ],
  ctaText: 'Read TIU Spec',
  ctaLink: '/docs/tiu',
  image: '/assets/images/codexauth_slide_02.jpg',
  imageAlt: 'TIU token flow — time-locked JWT with zone and device context',
  backgroundImage: '/assets/images/codexauth_background.jpg',
};

export default TIUSlide;
