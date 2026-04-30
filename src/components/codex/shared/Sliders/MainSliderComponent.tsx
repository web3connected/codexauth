'use client';

import React from 'react';
import ProductSlider from './ProductSlider';
import { ProductSlide } from './types';

interface MainSliderComponentProps {
  /** Array of slide data objects — import from ./slides and pick what you need */
  slides: ProductSlide[];
  height?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
}

/**
 * MainSliderComponent
 *
 * The top-of-page slider used across Codex service portals.
 * Slides are defined as individual data files in ./slides/ and composed here.
 *
 * Usage:
 * ```tsx
 * import MainSliderComponent from '@/components/codex/shared/Sliders/MainSliderComponent';
 * import { HeroSlide, HarmonicSlide, ApiSlide } from '@/components/codex/shared/Sliders/slides';
 *
 * <MainSliderComponent slides={[HeroSlide, HarmonicSlide, ApiSlide]} />
 * ```
 */
const MainSliderComponent: React.FC<MainSliderComponentProps> = ({
  slides,
  height = '520px',
  autoplay = true,
  autoplayDelay = 6000,
  showNavigation = true,
  showPagination = true,
}) => {
  return (
    <section className="w-full overflow-hidden">
      <ProductSlider
        slides={slides}
        height={height}
        autoplay={autoplay}
        autoplayDelay={autoplayDelay}
        showNavigation={showNavigation}
        showPagination={showPagination}
      />
    </section>
  );
};

export default MainSliderComponent;
