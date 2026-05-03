import { ProductSlide } from '@/components/codex/shared/Sliders/types';

/**
 * IdentitySlide — Web2 vs Web3 identity comparison
 * Layout: comparison-cards — gradient headline left, two identity cards center+right
 */
const IdentitySlide: ProductSlide = {
  id: 'codexauth-identity',
  layout: 'comparison-cards',
  title: 'CodexAuth Identity',
  titleGradient: { from: '#818CF8', to: '#2563EB' },
  description:
    'One SDK supports both Web2 email/password flows and Web3 wallet-based sign-in — with zone enforcement applied to both.',
  ctaText: 'Integrate CodexAuth',
  ctaLink: '/getting-started',
  tagColor: '#2563EB',
  backgroundColor: '#070D1F',
  comparisonCards: [
    {
      label: 'Web2 Identity',
      items: ['user@example.com', '••••••••', 'Session Token'],
      icons: [
        '/assets/icons/google.svg',
        '/assets/icons/github.svg',
        '/assets/icons/twitter.svg',
      ],
    },
    {
      label: 'Web3 Identity',
      accentColor: '#2DF4A1',
      items: ['0xCqckLtZ4qgQNXmx4wPv', 'TIU-locked JWT', 'Zone: Z4–Z8'],
      icons: [
        '/assets/icons/metamask.svg',
        '/assets/icons/walletconnect.svg',
        '/assets/icons/coinbase.svg',
      ],
    },
  ],
};

export default IdentitySlide;
