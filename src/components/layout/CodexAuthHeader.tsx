'use client';

import React from 'react';
import GlobalHeader from '@/components/codex/shared/Header/GlobalHeader';
import ApplicationLogo from '@/components/codex/shared/widgets/ApplicationLogo';
import DateGreeterWidget from '@/components/codex/shared/widgets/DateGreeterWidget';
import HeaderActions from '@/components/codex/shared/widgets/HeaderActions';
import ServicesDropdown from '@/components/codex/shared/widgets/ServicesDropdown';

const CodexAuthNav: React.FC = () => (
  <nav className="flex items-center gap-6">
    <a href="/" className="text-sm text-white/70 hover:text-white transition-colors">Home</a>
    <a href="/getting-started" className="text-sm text-white/70 hover:text-white transition-colors">Getting Started</a>
    <ServicesDropdown currentService="codex-auth" />
  </nav>
);

export default function CodexAuthHeader() {
  return (
    <GlobalHeader
      topbarWidgets={[
        {
          slot: 'widget_01',
          name: 'DateGreeter',
          component: DateGreeterWidget,
        },
        {
          slot: 'widget_03',
          name: 'HeaderActions',
          component: HeaderActions,
          props: {
            githubUrl: 'https://github.com/web3codex/codexauth',
            getStartedUrl: 'https://web3connected.com/getting-started/codexauth',
          },
        },
      ]}
      logoWidget={{
        name: 'ApplicationLogo',
        component: ApplicationLogo,
        props: { logo: 'CodexAuth', showIcon: true },
      }}
      navWidget={{
        name: 'CodexAuthNav',
        component: CodexAuthNav,
      }}
    />
  );
}
