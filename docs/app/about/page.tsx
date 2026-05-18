import { HeroBgImagePanel } from '@/components/codex/shared/panels/HeroBgImagePanel';
import { SplitTextStatsPanel } from '@/components/codex/shared/panels/SplitTextStatsPanel';
import { BgOverlayCardGridPanel } from '@/components/codex/shared/panels/BgOverlayCardGridPanel';
import { SplitTextFactsPanel } from '@/components/codex/shared/panels/SplitTextFactsPanel';
import { VerticalTimelinePanel } from '@/components/codex/shared/panels/VerticalTimelinePanel';
import { CenteredCtaPanel } from '@/components/codex/shared/panels/CenteredCtaPanel';
import {
  aboutMissionParagraphs,
  aboutMissionHighlight,
  aboutStatCards,
  aboutPrinciples,
  aboutNamingParagraphs,
  aboutNamingFacts,
  aboutTimeline,
  aboutCtaButtons,
} from '@/data/about.data';

export const metadata = {
  title: 'About | CodexAuth',
  description: 'Web3Codex builds cryptographic infrastructure on the mathematical constants that govern the physical world — bridging timeless principles with modern security.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <HeroBgImagePanel
        badge="Web3Codex"
        eyebrow="About the platform"
        title="Built on what"
        titleHighlight="was always true."
        subtitle="Technology does not have to start from zero. The constants that governed the physical world before computers existed still govern it now. We build with them."
        backgroundImageSrc="/assets/images/blue-data-stream-abstract-background-future-technology-innovation-concept-389117198.webp"
      />
      <SplitTextStatsPanel
        eyebrow="What we make"
        title="Cryptographic infrastructure"
        paragraphs={aboutMissionParagraphs}
        highlight={aboutMissionHighlight}
        statCards={aboutStatCards}
      />
      <BgOverlayCardGridPanel
        eyebrow="The foundations"
        title="Four constants. One algorithm."
        subtitle="Each one existed long before we wrote a line of code."
        cards={aboutPrinciples}
        backgroundImageSrc="/assets/images/abstract-design-shape-pattern-background-vibrant-blue-texture-and-geometric-mosaic_9969503.webp"
      />
      <SplitTextFactsPanel
        eyebrow="The name"
        title="Why Codex"
        paragraphs={aboutNamingParagraphs}
        factCards={aboutNamingFacts}
      />
      <VerticalTimelinePanel
        eyebrow="A long thread"
        title="From ancient ratio to modern hash"
        items={aboutTimeline}
      />
      <CenteredCtaPanel
        eyebrow="Start building"
        title="The constants have been there the whole time."
        subtitle="The API is new."
        buttons={aboutCtaButtons}
      />
    </main>
  );
}
