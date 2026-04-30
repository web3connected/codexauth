import { DocumentSectionsPanel } from '@/components/codex/shared/panels/DocumentSectionsPanel';
import { privacySections, privacyNavLinks } from '@/data/privacy.data';

export const metadata = {
  title: 'Privacy Policy | CodexAuth',
  description: 'How CodexAuth collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <DocumentSectionsPanel
        eyebrow="Legal"
        title="Privacy Policy"
        lastUpdated="April 2026"
        sections={privacySections}
        navLinks={privacyNavLinks}
      />
    </main>
  );
}
