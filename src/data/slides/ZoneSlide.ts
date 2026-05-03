import { ProductSlide } from '@/components/codex/shared/Sliders/types';

/**
 * ZoneSlide — Zone enforcement features checklist
 * Layout: feature-checklist — full-bleed gradient, large headline + bullet points left, mockup right
 */
const ZoneSlide: ProductSlide = {
  id: 'codexauth-zones',
  layout: 'feature-checklist',
  title: 'Zone-based',
  description: '',
  tagColor: '#2563EB',
  backgroundColor: '#0D1F6E',
  bulletPoints: [
    {
      text: 'Z1–Z12 enforcement applied automatically on every authenticated request',
    },
    {
      text: 'Tokens are time-locked with TIU precision — replay attacks are cryptographically impossible',
    },
    {
      text: 'Device trust context verified at login — no additional modules or plugins required',
    },
  ],
  ctaText: 'View Zone Reference',
  ctaLink: '/docs',
  image: '/assets/images/codexzones.png',
  imageAlt: 'CodexAuth zone enforcement — Z1 to Z12 security levels',
};

export default ZoneSlide;
