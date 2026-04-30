import { DocumentSectionsPanel } from '@/components/codex/shared/panels/DocumentSectionsPanel';
import { termsSections, termsNavLinks } from '@/data/terms.data';

export const metadata = {
  title: 'Terms of Service | CodexAuth',
  description: 'Terms of service for using the CodexAuth API, SDKs, and developer tools.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <DocumentSectionsPanel
        eyebrow="Legal"
        title="Terms of Service"
        lastUpdated="April 2026"
        sections={termsSections}
        navLinks={termsNavLinks}
      />
    </main>
  );
}
