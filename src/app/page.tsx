import DevPortalHero from '@/components/panels/devportal/DevPortalHero';
import { ThreePanelCardDesign } from '@/components/codex/shared/panels/ThreePanelCardDesign';
import { CodeBlockQuickStart } from '@/components/codex/shared/panels/CodeBlockQuickStart';
import { FeatureCardGrid } from '@/components/codex/shared/panels/FeatureCardGrid';
import { HighlightGrid } from '@/components/codex/shared/panels/HighlightGrid';
import { TierComparisonGrid } from '@/components/codex/shared/panels/TierComparisonGrid';
import { CommunityLinksPanel } from '@/components/codex/shared/panels/CommunityLinksPanel';
import { codexHashConceptCards } from '@/data/conceptCards.data';
import { quickStartLanguages, quickStartCodeExamples, quickStartInstallCommands } from '@/data/quickStart.data';
import { codexHashSDKs } from '@/data/sdks.data';
import { codexHashHighlights } from '@/data/highlights.data';
import { codexHashTiers } from '@/data/tiers.data';
import { codexHashCommunityLinks, codexHashCtaButtons } from '@/data/community.data';

export default function Home() {
  return (
    <main className="min-h-screen">
      <DevPortalHero />
      <ThreePanelCardDesign
        cards={codexHashConceptCards}
        backgroundImageSrc="/assets/images/abstract-design-shape-pattern-background-vibrant-blue-texture-and-geometric-mosaic_9969503.webp"
      />
      <CodeBlockQuickStart
        title="Quick Start"
        subtitle="Get up and running in minutes with our easy-to-use SDKs"
        languages={quickStartLanguages}
        codeExamples={quickStartCodeExamples}
        installCommands={quickStartInstallCommands}
      />
      <FeatureCardGrid
        sdks={codexHashSDKs}
        viewAllHref="/sdk"
      />
      <HighlightGrid
        title="Why CodexAuth?"
        subtitle="Enterprise-grade quantum-resistant hashing built for the future"
        cards={codexHashHighlights}
      />
      <TierComparisonGrid
        title="Three Security Tiers"
        subtitle="Choose the output strength that matches your compliance requirements. All tiers run the same CodexHarmonicHash core."
        footnote="All tiers are quantum-resistant and include TIU time-binding and hash chaining."
        tiers={codexHashTiers}
      />
      <CommunityLinksPanel
        title="Join Our Community"
        subtitle="Get help, share ideas, and stay updated with the latest developments"
        links={codexHashCommunityLinks}
        backgroundImageSrc="/images/GDGmap.png"
        ctaTitle="Ready to get started?"
        ctaSubtitle="Create your free developer account and start building with quantum-resistant hashing today."
        ctaButtons={codexHashCtaButtons}
      />
    </main>
  );
}
