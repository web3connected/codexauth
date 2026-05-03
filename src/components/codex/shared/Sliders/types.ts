export interface PartnerLogo {
  /** Brand name shown as large text if no logoSrc provided */
  name: string;
  /** URL to logo image (SVG or PNG). Falls back to name text if omitted. */
  logoSrc?: string;
  /** Optional site URL shown in footer area */
  url?: string;
}

export interface FooterLink {
  label: string;
  url?: string;
}

export interface BulletPoint {
  /** Short text for the bullet line */
  text: string;
  /** Optional icon URL — falls back to a filled circle checkmark if omitted */
  icon?: string;
}

export interface ComparisonCard {
  /** Label displayed in the header tab of the card */
  label: string;
  /** Optional accent/border color for the card (e.g. teal for Web3 side) */
  accentColor?: string;
  /** Rows of text shown inside the card (e.g. wallet address, email, feature names) */
  items: string[];
  /** Optional row of small icon image URLs shown at the bottom of the card */
  icons?: string[];
}

export interface ProductSlide {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  tag?: string;
  tagColor?: string;
  // Supported layouts: split-right (content left, image right), split-left (image left),
  // centered (hero), diagonal (angled image), grid (content + stats), overlay (full-image with overlayed content),
  // app-showcase (headline with accent words + dual CTAs + floating UI mockup right),
  // comparison-cards (headline + description + CTA left, two comparison identity cards center+right),
  // feature-checklist (large bold headline + bullet checklist left, device mockup image right, full-bleed bg)
  // partnership-collab (full-bleed dark bg, 3 glow blobs, eyebrow title, two brand logos + connector, footer URLs)
  layout?: 'split-right' | 'split-left' | 'centered' | 'diagonal' | 'grid' | 'overlay' | 'app-showcase' | 'comparison-cards' | 'feature-checklist' | 'partnership-collab';
  // optional extension fields
  codeSnippet?: string;
  stats?: { label: string; value: string }[];
  /** Color specific words in the title. Each entry matches a word and applies an inline color. */
  titleAccents?: { word: string; color: string }[];
  /** Apply a CSS gradient to the first word of the title */
  titleGradient?: { from: string; to: string; firstWord?: boolean };
  /** Secondary ghost CTA button (shown alongside ctaText in app-showcase layout) */
  ctaSecondary?: { text: string; link: string };
  /** Two comparison cards shown in comparison-cards layout (e.g. Web2 vs Web3 identity) */
  comparisonCards?: ComparisonCard[];
  /** Checklist bullet points shown in feature-checklist layout */
  bulletPoints?: BulletPoint[];
  /** Two brand logos shown in partnership-collab layout */
  partnerLogos?: PartnerLogo[];
  /** Symbol between the two logos in partnership-collab layout (default: ×) */
  connector?: string;
  /** Footer links pinned to bottom in partnership-collab layout */
  footerLinks?: FooterLink[];
  /** Full-bleed background image URL. Rendered behind the gradient overlay in feature-checklist and comparison-cards layouts. */
  backgroundImage?: string;
}

export type ProductSlides = ProductSlide[];

