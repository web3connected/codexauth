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
  // centered (hero), diagonal (angled image), grid (content + stats), overlay (full-image with overlayed content)
  layout?: 'split-right' | 'split-left' | 'centered' | 'diagonal' | 'grid' | 'overlay';
  // optional extension fields
  codeSnippet?: string;
  stats?: { label: string; value: string }[];
}

export type ProductSlides = ProductSlide[];
