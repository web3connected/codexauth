'use client';

import React, { useState } from 'react';
import { Book, Code, Shield, Clock, Lock, Play } from 'lucide-react';
import { DocsSidebarLayout } from '@/components/codex/shared/panels/DocsSidebarLayout';
import { FeatureOverviewPanel } from '@/components/codex/shared/panels/FeatureOverviewPanel';
import { HashChainingPanel } from '@/components/codex/shared/panels/HashChainingPanel';
import { ConceptCardsWithCodePanel } from '@/components/codex/shared/panels/ConceptCardsWithCodePanel';
import { SecurityTiersPanel } from '@/components/codex/shared/panels/SecurityTiersPanel';
import { ReplayPreventionPanel } from '@/components/codex/shared/panels/ReplayPreventionPanel';
import { ForkDetectionPanel } from '@/components/codex/shared/panels/ForkDetectionPanel';
import { ApiEndpointTablePanel } from '@/components/codex/shared/panels/ApiEndpointTablePanel';
import { TabbedCodeViewer } from '@/components/codex/shared/panels/TabbedCodeViewer';
import type { DocNavItem } from '@/components/codex/shared/panels/DocsSidebarLayout';
import {
  docsNavItems,
  chainSteps,
  chainBreakers,
  securityTiers,
  contextInputs,
  forkMethods,
  forkRecoveryOptions,
  apiEndpoints,
  codeExamples,
} from '@/data/docs.data';

// Map iconName strings → lucide components
const iconMap: Record<string, React.ReactNode> = {
  Book:    <Book    className="w-4 h-4" />,
  Link:    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  Clock:   <Clock   className="w-4 h-4" />,
  Shield:  <Shield  className="w-4 h-4" />,
  Lock:    <Lock    className="w-4 h-4" />,
  GitFork: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 8v2a4 4 0 004 4h4a4 4 0 004-4V8M6 8v2c0 2.21 1.79 4 4 4" /></svg>,
  Code:    <Code    className="w-4 h-4" />,
  Play:    <Play    className="w-4 h-4" />,
};

const navItems: DocNavItem[] = docsNavItems.map((item) => ({
  id:    item.id,
  label: item.label,
  icon:  iconMap[item.iconName] ?? null,
}));

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <>
      {/* Docs hero banner — matches site-wide theme pattern */}
      <div className="bg-auth-bg border-b border-slate-800">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-auth-primary bg-auth-primary/10 border border-auth-primary/20 rounded-full px-3 py-1 mb-4">
            Documentation
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
            CodexAuth{' '}
            <span className="bg-gradient-to-r from-auth-primary to-auth-secondary bg-clip-text text-transparent">
              Technical Docs
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Tamper-evident hashing, TIU time binding, security tiers, fork detection, and the full API reference — everything you need to build with CodexAuth.
          </p>
        </div>
      </div>

      <DocsSidebarLayout
      sidebarTitle="Documentation"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'overview' && (
        <FeatureOverviewPanel
          title="CodexAuth Overview"
          description="CodexAuth is a tamper-evident hashing and event chaining service. It answers one question: 'Is this the same thing? Was it changed?' — with mathematical certainty across time. It is not a blockchain. No consensus, no tokens, no wallets. Pure cryptographic binding."
          statCards={[
            {
              icon: <Shield className="w-8 h-8 text-auth-primary" />,
              title: 'Tamper-Evident Chaining',
              description: 'Each hash event links to the previous via event_hash = SHA256(payload + prev_hash + context). Altering any event breaks all subsequent hashes — instantly detectable.',
            },
            {
              icon: <Clock className="w-8 h-8 text-auth-secondary" />,
              title: 'Time-Bound Hashing',
              description: 'Every hash embeds a TIU (Time Integrity Unit) anchor via CodexTime. Backdating and replay attacks are mathematically impossible.',
            },
          ]}
          checklistTitle="Core Capabilities"
          checklistItems={[
            'Hash chaining — tamper-evident event chains',
            'TIU time binding — replay & backdating prevention',
            'Three security tiers: 256 / 512 / 1024-bit',
            'Fork detection — split chain identification',
            'Portable Verified Timeline Exports',
            'Integrates with CodexAuth & CodexSecure',
          ]}
        />
      )}

      {activeSection === 'chaining' && (
        <HashChainingPanel
          title="Hash Chaining"
          subtitle="The core feature that makes CodexAuth tamper-evident — not just a hash, an unbreakable sequence."
          description="Each hash event links to the previous one by embedding the prior event's hash into the next computation. Any alteration anywhere in the chain produces a detectable mismatch — no blockchain required."
          chainFormula="event_hash = SHA256(payload_hash + prev_event_hash + context)"
          chainSteps={chainSteps}
          chainBreakers={chainBreakers}
        />
      )}

      {activeSection === 'tiu' && (
        <ConceptCardsWithCodePanel
          title="Time-Bound Hashing"
          subtitle="Every hash embeds a TIU (Time Integrity Unit) from CodexTime. A TIU is not a timestamp — it is a harmonic float (0–10) derived from physical constants. Because TIU is part of the cryptographic input, events cannot be silently reordered, backdated, or replayed."
          conceptCards={[
            {
              icon: <Clock className="w-8 h-8 text-auth-secondary" />,
              title: 'What Is a TIU?',
              description: 'A TIU is a float between 0 and 10, computed from harmonic physics (speed of light, Planck time, golden ratio oscillation). It changes with time, but it is not a Unix timestamp. CodexTime generates it; you embed it in the hash.',
            },
            {
              icon: <Shield className="w-8 h-8 text-auth-primary" />,
              title: 'Temporal Chain Ordering',
              description: 'Each event records its TIU. If a later event shows TIU₂ ≤ TIU₁, the chain is suspicious — indicating reordering, insertion, or a time-reversal attack. Changing TIU changes the hash entirely.',
            },
          ]}
          codeBlockContent={`from services import CodexTimeService

codex_time = CodexTimeService()
tiu = codex_time.current_tiu()

hash_result = codex_hash.generate_hash(
    data    = "Invoice #1042 — Alice approved $500",
    tiu     = tiu,
    salt    = "random_salt",
    rounds  = 16
)

# Verifying chain order integrity
for i in range(1, len(chain)):
    if chain[i].tiu <= chain[i - 1].tiu:
        raise ChainOrderError("Time did not advance — possible reordering or insertion")`}
          bulletTitle="TIU Properties"
          bulletItems={[
            { icon: <span className="w-2 h-2 rounded-full bg-auth-primary inline-block" />,   label: 'Type',     value: 'Harmonic float derived from physical constants (C, Planck time, φ)'  },
            { icon: <span className="w-2 h-2 rounded-full bg-auth-secondary inline-block" />, label: 'Range',    value: '0.0 – 10.0'                                                           },
            { icon: <span className="w-2 h-2 rounded-full bg-auth-accent inline-block" />,    label: 'Fallback', value: 'Fractional part of system time if CodexTime is unavailable'           },
          ]}
        />
      )}

      {activeSection === 'security-tiers' && (
        <SecurityTiersPanel
          title="Security Tiers"
          subtitle="Three mathematically verified output lengths with domain separation. Tiers cannot be cross-validated."
          tiers={securityTiers}
        />
      )}

      {activeSection === 'replay' && (
        <ReplayPreventionPanel
          title="Replay Attack Prevention"
          subtitle="CodexAuth detects replay attacks when you include the right context fields in hash input. Here's exactly how."
          contextInputs={contextInputs}
        />
      )}

      {activeSection === 'fork-detection' && (
        <ForkDetectionPanel
          title="Fork Detection"
          subtitle="Detect when a chain splits into two valid but conflicting histories. CodexAuth identifies forks — your policy resolves them."
          forkMethods={forkMethods}
          recoveryOptions={forkRecoveryOptions}
        />
      )}

      {activeSection === 'api-reference' && (
        <ApiEndpointTablePanel
          title="API Reference"
          subtitle="Live endpoints — Base URL: https://codexauth.io/api"
          endpoints={apiEndpoints}
        />
      )}

      {activeSection === 'examples' && (
        <TabbedCodeViewer
          title="Code Examples"
          subtitle="Working examples across cURL, JavaScript, and PHP."
          examples={codeExamples}
        />
      )}
    </DocsSidebarLayout>
    </>
  );
}
