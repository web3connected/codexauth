'use client';

import React, { ReactNode } from 'react';
import { GlobalWrapper } from '@/components/codex/shared/GlobalWrapper';
import CodexAuthHeader from '@/components/layout/CodexAuthHeader';
import CodexAuthFooter from '@/components/layout/CodexAuthFooter';

interface CodexAuthDataLayerProps {
  children: ReactNode;
}

const CodexAuthDataLayer: React.FC<CodexAuthDataLayerProps> = ({ children }) => {
  return (
    <GlobalWrapper
      header={<CodexAuthHeader />}
      footer={<CodexAuthFooter />}
    >
      {children}
    </GlobalWrapper>
  );
};

export default CodexAuthDataLayer;
