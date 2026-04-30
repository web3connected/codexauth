import type { QuickStartLanguage, InstallCommand } from '@/components/codex/shared/panels/CodeBlockQuickStart';

export const quickStartLanguages: QuickStartLanguage[] = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
];

export const quickStartCodeExamples: Record<string, string> = {
  javascript: `import { CodexAuthClient } from '@web3connected/codexauth-sdk';

const auth = new CodexAuthClient({
  apiUrl: 'https://codexauth.web3connected.com/api',
  appId: 'YOUR_APP_ID',
});

// Login and receive a time-locked JWT
const session = await auth.login({
  identifier: 'user@example.com',
  password: 'secret',
});

console.log(session.token);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Call a protected API endpoint
const profile = await auth.get('/users/me', session.token);
console.log(profile.data);`,

  typescript: `import { CodexAuthClient, AuthSession } from '@web3connected/codexauth-sdk';

const auth = new CodexAuthClient({
  apiUrl: 'https://codexauth.web3connected.com/api',
  appId: process.env.CODEXAUTH_APP_ID!,
});

// Login — returns a zone-aware, TIU time-locked session
const session: AuthSession = await auth.login({
  identifier: 'user@example.com',
  password: 'secret',
});

// Verify the token server-side
const claims = await auth.verify(session.token);
console.log(claims.zone);   // e.g. "Z3"
console.log(claims.userId); // "usr_a7b3c9d2e4f5"

// Refresh before the TIU window expires
const refreshed = await auth.refresh(session.refreshToken);`,
};

export const quickStartInstallCommands: InstallCommand[] = [
  { manager: 'npm', command: 'npm install @web3connected/codexauth-sdk' },
  { manager: 'yarn', command: 'yarn add @web3connected/codexauth-sdk' },
  { manager: 'pnpm', command: 'pnpm add @web3connected/codexauth-sdk' },
];
