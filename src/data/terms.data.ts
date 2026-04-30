import type { DocSection, DocNavLink } from '@/components/codex/shared/panels/DocumentSectionsPanel';

export const termsSections: DocSection[] = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using CodexAuth services, APIs, or SDKs (collectively, "the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
  },
  {
    title: '2. Description of Service',
    body: 'CodexAuth provides cryptographic hashing infrastructure including the CodexHarmonicHash algorithm, REST APIs, and developer SDKs. The Service is provided for lawful development and integration purposes only.',
  },
  {
    title: '3. API Usage',
    body: 'You may use the CodexAuth API for legitimate application development. Automated abuse, intentional flooding, reverse engineering of the hashing algorithm, or attempts to circumvent rate limits are prohibited. We reserve the right to suspend access for violations without notice.',
  },
  {
    title: '4. Developer Responsibilities',
    body: 'You are responsible for securing your API keys and credentials. Do not expose keys in public repositories or client-side code. You are solely responsible for any data you submit to the Service and for ensuring your use complies with applicable laws.',
  },
  {
    title: '5. Intellectual Property',
    body: 'CodexAuth, CodexHarmonicHash, and associated brand assets are owned by Web3Codex. SDKs distributed under open-source licenses retain those licenses. Nothing in these terms grants you rights to the CodexAuth brand or proprietary algorithms beyond what is explicitly licensed.',
  },
  {
    title: '6. Disclaimer of Warranties',
    body: 'The Service is provided "as is" without warranties of any kind. We do not warrant uninterrupted availability, error-free operation, or fitness for a particular purpose. Use of the Service is at your own risk.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'To the maximum extent permitted by law, Web3Codex shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including data loss or security incidents resulting from your own key management failures.',
  },
  {
    title: '8. Changes to Terms',
    body: 'We may update these terms at any time. Continued use of the Service after changes constitutes acceptance. Material changes will be communicated via the developer changelog or email if you are a registered user.',
  },
  {
    title: '9. Governing Law',
    body: 'These terms are governed by the laws of the jurisdiction in which Web3Codex operates. Any disputes shall be resolved in the competent courts of that jurisdiction.',
  },
  {
    title: '10. Contact',
    body: 'For questions about these terms, contact us at legal@web3connected.com.',
  },
];

export const termsNavLinks: DocNavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: '← Back to Home', href: '/' },
];
