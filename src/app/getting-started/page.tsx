'use client';

import React from 'react';
import { Zap, Shield, Globe } from 'lucide-react';
import { HeroBgImagePanel } from '@/components/codex/shared/panels/HeroBgImagePanel';
import { ThreePanelCardDesign } from '@/components/codex/shared/panels/ThreePanelCardDesign';
import { NumberedStepsPanel } from '@/components/codex/shared/panels/NumberedStepsPanel';
import { CodeBlockQuickStart } from '@/components/codex/shared/panels/CodeBlockQuickStart';
import { CenteredCtaPanel } from '@/components/codex/shared/panels/CenteredCtaPanel';
import type { PanelCard } from '@/components/codex/shared/panels/ThreePanelCardDesign';
import {
  gettingStartedHero,
  gettingStartedFeatureCards,
  gettingStartedSteps,
  gettingStartedLanguages,
  gettingStartedCodeExamples,
  gettingStartedInstallCommands,
  gettingStartedCtaButtons,
} from '@/data/getting-started.data';

// Map icon name strings → React nodes (keeps data file JSX-free)
const iconMap: Record<string, React.ReactNode> = {
  Zap:    <Zap    className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Globe:  <Globe  className="w-6 h-6" />,
};

const featureCards = gettingStartedFeatureCards.map((card) => ({
  icon:        iconMap[card.iconName],
  title:       card.title,
  tagline:     card.tagline,
  description: card.description,
  stat:        card.stat,
  statLabel:   card.statLabel,
})) as [PanelCard, PanelCard, PanelCard];

export default function GettingStartedPage() {
  return (
    <>
      <HeroBgImagePanel
        badge={gettingStartedHero.badge}
        eyebrow={gettingStartedHero.eyebrow}
        title={gettingStartedHero.title}
        titleHighlight={gettingStartedHero.titleHighlight}
        subtitle={gettingStartedHero.subtitle}
        backgroundImageSrc={gettingStartedHero.backgroundImageSrc}
      />

      <ThreePanelCardDesign cards={featureCards} />

      <section className="py-20 lg:py-28 bg-auth-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <NumberedStepsPanel
              title="Installation &amp; Setup"
              subtitle="Five steps from zero to a verified hash in production."
              steps={gettingStartedSteps}
            />
          </div>
        </div>
      </section>

      <CodeBlockQuickStart
        title="Quick Start"
        subtitle="Copy, paste, and ship — your first quantum-resistant hash in seconds."
        languages={gettingStartedLanguages}
        codeExamples={gettingStartedCodeExamples}
        installCommands={gettingStartedInstallCommands}
      />

      <CenteredCtaPanel
        eyebrow="What&apos;s next?"
        title="Ready to go deeper?"
        subtitle="Explore the full API reference, SDK guides, and live code examples in the documentation."
        buttons={gettingStartedCtaButtons}
      />
    </>
  );
}
