'use client';

import React, { ReactNode } from 'react';

/**
 * GlobalWrapper Props
 * 
 * Base layout wrapper used across all Codex services.
 * Metadata (title, description) is handled by layout.tsx — not here.
 * Each service passes its own header and footer as props.
 */
export interface GlobalWrapperProps {
  /** Header component to render (e.g., CodexHashHeader) */
  header?: ReactNode;
  /** Footer component to render (e.g., CodexHashFooter) */
  footer?: ReactNode;
  /** Page content */
  children: ReactNode;
  /** Main content className */
  mainClassName?: string;
  /** Container className (wrapper div) */
  className?: string;
  /** Whether to include default background styling */
  withBackground?: boolean;
}

/**
 * GlobalWrapper - Base Layout Component
 * 
 * Provides consistent page structure across all Codex services:
 * - Head (title, meta)
 * - Header (service-specific)
 * - Main content area
 * - Footer (service-specific)
 * 
 * Usage:
 * ```tsx
 * // In CodexHashDataLayer.tsx
 * import { GlobalWrapper } from '@/components/codex/GlobalWrapper';
 * import CodexHashHeader from '@/components/codex/codexhash/CodexHashHeader';
 * import CodexHashFooter from '@/components/codex/codexhash/CodexHashFooter';
 * 
 * export function CodexHashDataLayer({ children }) {
 *   return (
 *     <GlobalWrapper
 *       header={<CodexHashHeader />}
 *       footer={<CodexHashFooter />}
 *     >
 *       {children}
 *     </GlobalWrapper>
 *   );
 * }
 * ```
 */
export const GlobalWrapper: React.FC<GlobalWrapperProps> = ({
  header,
  footer,
  children,
  mainClassName = '',
  className = '',
  withBackground = true,
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${withBackground ? 'bg-gray-900' : ''} ${className}`}>
      {/* Header Section */}
      {header}

      {/* Main Content Area */}
      <main className={`flex-grow ${mainClassName}`}>
        {children}
      </main>

      {/* Footer Section */}
      {footer}
    </div>
  );
};

export default GlobalWrapper;
