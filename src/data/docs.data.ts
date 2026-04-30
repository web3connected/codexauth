// ---------------------------------------------------------------------------
// Docs page data — all typed arrays, no JSX
// ---------------------------------------------------------------------------

export interface DocNavItem {
  id: string;
  label: string;
  /** lucide-react icon name — rendered in the page */
  iconName: string;
}

export const docsNavItems: DocNavItem[] = [
  { id: 'overview',       label: 'Overview',          iconName: 'Book'    },
  { id: 'authentication', label: 'Authentication',    iconName: 'Lock'    },
  { id: 'sessions',       label: 'Sessions & Tokens', iconName: 'Clock'   },
  { id: 'zones',          label: 'Zone Enforcement',  iconName: 'Shield'  },
  { id: 'device-trust',   label: 'Device Trust',      iconName: 'Monitor' },
  { id: 'api-reference',  label: 'API Reference',     iconName: 'Code'    },
  { id: 'examples',       label: 'Code Examples',     iconName: 'Play'    },
];

// ---------------------------------------------------------------------------
// Auth Flow — step-by-step login chain
// ---------------------------------------------------------------------------
export interface ChainStep {
  step: number;
  title: string;
  formula?: string;
  description: string;
}

export const chainSteps: ChainStep[] = [
  {
    step: 1,
    title: 'Submit Credentials',
    description:
      'Client POSTs identifier + password to /api/auth/login. The identifier is normalized and the password is verified against the stored CodexHarmonicHash — no plain bcrypt.',
  },
  {
    step: 2,
    title: 'Zone & Device Evaluation',
    formula: 'zone = CodexSecure.evaluate(device_context, ip, user_flags)',
    description:
      'CodexSecure inspects the device fingerprint, IP reputation, and user flags to assign a zone level (Z1–Z12). Higher zones grant broader access.',
  },
  {
    step: 3,
    title: 'TIU Anchor Issued',
    formula: 'tiu = CodexTime.currentTIU()',
    description:
      'A Time Interval Unit is fetched from CodexTime and embedded in the JWT payload. This binds the token to a precise time window — tokens from expired windows are rejected without a DB lookup.',
  },
  {
    step: 4,
    title: 'JWT Signed & Returned',
    description:
      'A signed JWT is returned containing the zone claim, TIU anchor, user ID, and expiry. A refresh token is issued separately for silent renewal.',
  },
];

export interface ChainBreaker {
  cause: string;
  explanation: string;
}

export const chainBreakers: ChainBreaker[] = [
  { cause: 'Expired TIU window',     explanation: 'Token TIU is outside the valid time band — rejected without DB lookup'          },
  { cause: 'Zone claim mismatch',    explanation: 'Route requires Z5 but token carries Z2 — access denied by middleware'           },
  { cause: 'Device fingerprint drift', explanation: 'Device context changed since issuance — session flagged for re-evaluation'    },
  { cause: 'Revoked refresh token',  explanation: 'Refresh token found in revocation list — full re-login required'                },
  { cause: 'Credential hash tamper', explanation: 'Stored hash chain broken — account locked pending integrity check'              },
];

// ---------------------------------------------------------------------------
// Security Tiers (Zone levels) — shaped to match SecurityTierItem interface
// ---------------------------------------------------------------------------
export interface SecurityTier {
  name: string;
  badge: string;
  bits: number;
  bytes: number;
  hexChars: number;
  rounds: number;
  useCases: string[];
  example: string;
  highlight?: boolean;
}

export const securityTiers: SecurityTier[] = [
  {
    name: 'Public',
    badge: 'Z1–Z3',
    bits: 0,
    bytes: 0,
    hexChars: 0,
    rounds: 0,
    useCases: ['Public API reads', 'Marketing pages', 'Unverified registrations'],
    example: 'zone: "Z1" — read-only, no credential required',
  },
  {
    name: 'Authenticated',
    badge: 'Z4–Z7',
    bits: 256,
    bytes: 32,
    hexChars: 64,
    rounds: 8,
    useCases: ['Dashboard access', 'User profile management', 'Standard API calls', 'Web3 wallet actions'],
    example: 'zone: "Z4" — authenticated session, TIU-locked JWT',
    highlight: true,
  },
  {
    name: 'Elevated',
    badge: 'Z8–Z12',
    bits: 512,
    bytes: 64,
    hexChars: 128,
    rounds: 16,
    useCases: ['Admin panels', 'Billing changes', 'Security settings', 'Compliance-gated operations'],
    example: 'zone: "Z8" — MFA step-up required, device-pinned session',
  },
];

// ---------------------------------------------------------------------------
// Context inputs — what goes into each JWT
// ---------------------------------------------------------------------------
export interface ContextInput {
  field: string;
  required: boolean;
  example: string;
  purpose: string;
}

export const contextInputs: ContextInput[] = [
  { field: 'sub',         required: true,  example: '"usr_a7b3c9d2e4f5"',       purpose: 'User identifier'                            },
  { field: 'zone',        required: true,  example: '"Z4"',                     purpose: 'Zone claim from CodexSecure evaluation'      },
  { field: 'tiu',         required: true,  example: '0.618034',                 purpose: 'TIU anchor — valid only within time window'  },
  { field: 'device_hash', required: false, example: '"b5a82e40abea..."',        purpose: 'Device fingerprint for trust validation'     },
  { field: 'exp',         required: true,  example: '1798761600',               purpose: 'Standard JWT expiry (Unix timestamp)'        },
];

// ---------------------------------------------------------------------------
// Device trust — evaluation methods
// ---------------------------------------------------------------------------
export interface ForkMethod {
  name: string;
  description: string;
  code: string;
}

export const forkMethods: ForkMethod[] = [
  {
    name: 'Fingerprint Check',
    description: 'Compare current device fingerprint against the hash stored at login time. Any drift triggers re-evaluation.',
    code: `const current = await DeviceTrust.fingerprint(req);
const stored = session.device_hash;

if (!DeviceTrust.matches(current, stored)) {
  // Re-evaluate zone — may downgrade trust
  session.zone = await CodexSecure.reEvaluate(current);
}`,
  },
  {
    name: 'IP Reputation Check',
    description: 'Cross-reference client IP against the CodexSecure reputation feed. High-risk IPs are downgraded to Z1.',
    code: `const rep = await CodexSecure.ipReputation(req.ip);

if (rep.risk === 'high') {
  throw new UnauthorizedError('IP blocked by zone policy');
}

// Adjust zone ceiling based on reputation score
const maxZone = rep.zoneAllowance; // e.g. "Z6"`,
  },
];

export interface RecoveryOption {
  strategy: string;
  when: string;
  action: string;
}

export const forkRecoveryOptions: RecoveryOption[] = [
  { strategy: 'Re-login',         when: 'TIU expired or zone downgraded',    action: 'Prompt user to authenticate again; issue fresh session'   },
  { strategy: 'Silent Refresh',   when: 'Token near expiry, device unchanged', action: 'Use refresh token to issue new JWT without re-login'    },
  { strategy: 'Step-up Auth',     when: 'Operation requires higher zone',    action: 'Challenge user (MFA) to elevate zone mid-session'        },
  { strategy: 'Account Lock',     when: 'Credential hash chain broken',      action: 'Lock account; alert security team for integrity review'   },
];

// ---------------------------------------------------------------------------
// API endpoints (codexauth.web3connected.com/api)
// ---------------------------------------------------------------------------
export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  parameters: ApiParam[];
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'POST',
    endpoint: '/api/auth/login',
    description: 'Authenticate a user. Returns a zone-aware, TIU time-locked JWT and a refresh token.',
    parameters: [
      { name: 'identifier', type: 'string', required: true,  description: 'Email address or username'                       },
      { name: 'password',   type: 'string', required: true,  description: 'User password (verified via CodexHarmonicHash)'  },
      { name: 'device',     type: 'object', required: false, description: 'Device context for zone evaluation'              },
    ],
  },
  {
    method: 'POST',
    endpoint: '/api/auth/logout',
    description: 'Revoke the current session. Adds the refresh token to the revocation list.',
    parameters: [
      { name: 'refresh_token', type: 'string', required: true, description: 'Refresh token to revoke' },
    ],
  },
  {
    method: 'POST',
    endpoint: '/api/auth/refresh',
    description: 'Exchange a valid refresh token for a new JWT. Validates TIU window and device context.',
    parameters: [
      { name: 'refresh_token', type: 'string', required: true,  description: 'Refresh token issued at login'  },
      { name: 'device',        type: 'object', required: false, description: 'Updated device context'          },
    ],
  },
  {
    method: 'POST',
    endpoint: '/api/auth/verify',
    description: 'Verify a JWT. Checks signature, TIU window, zone claim, and revocation status.',
    parameters: [
      { name: 'token', type: 'string', required: true, description: 'JWT to verify' },
    ],
  },
  {
    method: 'POST',
    endpoint: '/api/auth/register',
    description: 'Register a new user account. Password is hashed with CodexHarmonicHash before storage.',
    parameters: [
      { name: 'identifier', type: 'string', required: true,  description: 'Email or username'   },
      { name: 'password',   type: 'string', required: true,  description: 'Password to hash'    },
      { name: 'metadata',   type: 'object', required: false, description: 'Additional user info' },
    ],
  },
  {
    method: 'GET',
    endpoint: '/health',
    description: 'Service health check including database and CodexTime connectivity.',
    parameters: [],
  },
];

// ---------------------------------------------------------------------------
// Code examples
// ---------------------------------------------------------------------------
export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
}

export const codeExamples: CodeExample[] = [
  {
    id: 'login',
    title: 'Login',
    language: 'bash',
    code: `# Authenticate and receive a TIU time-locked JWT
curl -X POST https://codexauth.web3connected.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "identifier": "user@example.com",
    "password": "secret",
    "device": { "fingerprint": "abc123", "user_agent": "..." }
  }'

# Response:
# {
#   "token": "eyJhbGci...",
#   "refresh_token": "rt_a7b3c9...",
#   "zone": "Z4",
#   "expires_in": 3600
# }`,
  },
  {
    id: 'verify',
    title: 'Verify Token',
    language: 'bash',
    code: `# Verify a JWT server-side
curl -X POST https://codexauth.web3connected.com/api/auth/verify \\
  -H "Content-Type: application/json" \\
  -d '{ "token": "eyJhbGci..." }'

# Valid response:
# { "valid": true, "zone": "Z4", "sub": "usr_a7b3c9", "tiu_ok": true }

# Invalid (expired TIU):
# { "valid": false, "reason": "tiu_expired" }`,
  },
  {
    id: 'js-login',
    title: 'JavaScript — Login Flow',
    language: 'javascript',
    code: `import { CodexAuthClient } from '@web3connected/codexauth-sdk';

const auth = new CodexAuthClient({
  apiUrl: 'https://codexauth.web3connected.com/api',
  appId: process.env.CODEXAUTH_APP_ID,
});

// Login
const session = await auth.login({
  identifier: 'user@example.com',
  password: 'secret',
});

console.log(session.zone);  // "Z4"
console.log(session.token); // "eyJhbGci..."

// Call a protected endpoint using the token
const data = await auth.get('/users/me', session.token);`,
  },
  {
    id: 'js-verify',
    title: 'JavaScript — Server-side Verification',
    language: 'javascript',
    code: `import { CodexAuthClient } from '@web3connected/codexauth-sdk';

const auth = new CodexAuthClient({
  apiUrl: 'https://codexauth.web3connected.com/api',
  appId: process.env.CODEXAUTH_APP_ID,
});

// Middleware: verify token on every protected request
export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  const claims = await auth.verify(token);
  if (!claims.valid) return res.status(401).json({ error: claims.reason });

  // Enforce zone policy
  if (parseInt(claims.zone.slice(1)) < 4) {
    return res.status(403).json({ error: 'Insufficient zone' });
  }

  req.user = claims;
  next();
}`,
  },
];
