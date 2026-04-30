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
  { id: 'overview',        label: 'Overview',              iconName: 'Book'     },
  { id: 'chaining',        label: 'Hash Chaining',         iconName: 'Link'     },
  { id: 'tiu',             label: 'Time-Bound Hashing',    iconName: 'Clock'    },
  { id: 'security-tiers',  label: 'Security Tiers',        iconName: 'Shield'   },
  { id: 'replay',          label: 'Replay Prevention',     iconName: 'Lock'     },
  { id: 'fork-detection',  label: 'Fork Detection',        iconName: 'GitFork'  },
  { id: 'api-reference',   label: 'API Reference',         iconName: 'Code'     },
  { id: 'examples',        label: 'Code Examples',         iconName: 'Play'     },
];

// ---------------------------------------------------------------------------
// Hash Chaining — chain event steps
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
    title: 'First Event',
    formula: 'event_hash₁ = SHA256(payload_hash₁ + "" + context)',
    description: 'The first event has no predecessor. prev_event_hash is empty string.',
  },
  {
    step: 2,
    title: 'Subsequent Events',
    formula: 'event_hash₂ = SHA256(payload_hash₂ + event_hash₁ + context)',
    description: 'Every new event embeds the previous event\'s hash in its own computation.',
  },
  {
    step: 3,
    title: 'Tamper Detection',
    description: 'Altering any event recomputes that event\'s hash — which no longer matches the next event\'s stored prev_event_hash. The chain breaks immediately and detectably.',
  },
  {
    step: 4,
    title: 'Chain Verification',
    formula: 'verify: recompute event_hashₙ and compare to stored value',
    description: 'Verification re-runs each computation in sequence. Any mismatch pinpoints the exact tampered event.',
  },
];

export interface ChainBreaker {
  cause: string;
  explanation: string;
}

export const chainBreakers: ChainBreaker[] = [
  { cause: 'Data alteration',      explanation: 'Payload hash changes → event hash changes → next link breaks' },
  { cause: 'Event insertion',      explanation: 'New event shifts all subsequent prev_event_hash pointers'     },
  { cause: 'Event reordering',     explanation: 'Order reversal produces wrong prev_event_hash chain'         },
  { cause: 'Time anchor reuse',    explanation: 'Replayed TIU value detected by temporal sequence check'      },
  { cause: 'Domain context swap',  explanation: 'Different context tag produces different hash value'         },
];

// ---------------------------------------------------------------------------
// Security Tiers
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
    name: 'Commercial',
    badge: 'Standard',
    bits: 256,
    bytes: 32,
    hexChars: 64,
    rounds: 8,
    useCases: ['Consumer apps', 'Performance-critical systems', 'General data integrity', 'Session tokens'],
    example: '7bfad6a04c0c37a2d8717354ccf907c54ccca38df49b1e247c58b254a19466c9',
  },
  {
    name: 'Enterprise',
    badge: 'Compliance-Grade',
    bits: 512,
    bytes: 64,
    hexChars: 128,
    rounds: 16,
    useCases: ['SOC2 compliance', 'HIPAA data', 'GDPR environments', 'Financial audit trails'],
    example: 'ab569798d160ef6bcdc9d6ddc17277884af96a27bdbcedc9d7c541c948271bfe5acd6116c260e60876f15281258958d7a...',
    highlight: true,
  },
  {
    name: 'Government',
    badge: 'Defense-Grade',
    bits: 1024,
    bytes: 128,
    hexChars: 256,
    rounds: 24,
    useCases: ['Critical infrastructure', 'Defense applications', 'National security systems', 'Harmonic Lock enabled'],
    example: 'c492634b839a5120b1b7e21b210e81842253ece51f5e7d8a4fdc9ac0b708e8f0f5ab23c5d870aba6567f...',
  },
];

// ---------------------------------------------------------------------------
// Replay prevention — domain context inputs
// ---------------------------------------------------------------------------
export interface ContextInput {
  field: string;
  required: boolean;
  example: string;
  purpose: string;
}

export const contextInputs: ContextInput[] = [
  { field: 'event_data',     required: true,  example: '"Alice approves $100"',      purpose: 'The payload being hashed'              },
  { field: 'tiu',            required: true,  example: '0.618034',                   purpose: 'Time anchor — changes per time window'  },
  { field: 'prev_event_hash',required: true,  example: '"b5a82e40abea..."',           purpose: 'Cryptographic link to previous event'   },
  { field: 'domain_context', required: true,  example: '"CONTEXT|transfer|USD|"',    purpose: 'Scopes hash to specific operation type'  },
  { field: 'actor_identity', required: false, example: '"user_alice|session_xyz"',   purpose: 'Ties hash to specific actor (optional)'  },
];

// ---------------------------------------------------------------------------
// Fork detection — detection methods
// ---------------------------------------------------------------------------
export interface ForkMethod {
  name: string;
  description: string;
  code: string;
}

export const forkMethods: ForkMethod[] = [
  {
    name: 'Compare Hash Sequences',
    description: 'Walk both chains in parallel and find the first position where hashes diverge.',
    code: `def detect_fork(chain_a, chain_b):
    for i in range(min(len(chain_a), len(chain_b))):
        if chain_a[i].event_hash != chain_b[i].event_hash:
            return i  # Fork point index
    return None  # No fork`,
  },
  {
    name: 'Temporal Anomaly Check',
    description: 'Any event with a TIU ≤ its predecessor indicates a time reversal — possible fork boundary.',
    code: `for i, event in enumerate(chain[1:], 1):
    if event.tiu <= chain[i-1].tiu:
        print(f"Time anomaly at position {i}")
        # Potential fork boundary`,
  },
];

export interface RecoveryOption {
  strategy: string;
  when: string;
  action: string;
}

export const forkRecoveryOptions: RecoveryOption[] = [
  { strategy: 'Accept Main',   when: 'Clear authority exists',         action: 'Discard the fork branch; re-hash from the split point'    },
  { strategy: 'Merge Events',  when: 'Both branches contain real data', action: 'Deterministic merge by timestamp; rebuild chain after'    },
  { strategy: 'Archive Fork',  when: 'Audit trail required',           action: 'Store fork branch as evidence; continue main chain'       },
  { strategy: 'Root Cause',    when: 'Always',                         action: 'Investigate the write conflict that produced the fork'     },
];

// ---------------------------------------------------------------------------
// API endpoints (real endpoints from CODEXHASH_API_REFERENCE.md)
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
    endpoint: '/api/hash/',
    description: 'Create a new hash event with tamper-evident chaining. Returns the event_hash linked to the previous event.',
    parameters: [
      { name: 'data',    type: 'string', required: true,  description: 'Raw input data to hash'                         },
      { name: 'mode',    type: 'string', required: false, description: '"quick" | "standard" | "secure" (default: quick)'},
      { name: 'algo',    type: 'string', required: false, description: '"sha256" | "sha512" | "harmonic"'               },
      { name: 'context', type: 'object', required: false, description: 'Additional metadata embedded in the chain hash' },
    ],
  },
  {
    method: 'GET',
    endpoint: '/api/hash/',
    description: 'List hash events (chain history) with optional filters.',
    parameters: [
      { name: 'limit',  type: 'int',    required: false, description: 'Max events to return (default: 50)' },
      { name: 'offset', type: 'int',    required: false, description: 'Pagination offset (default: 0)'     },
      { name: 'mode',   type: 'string', required: false, description: 'Filter by mode'                     },
      { name: 'algo',   type: 'string', required: false, description: 'Filter by algorithm'                },
    ],
  },
  {
    method: 'POST',
    endpoint: '/api/hash/verify',
    description: 'Verify chain integrity — recomputes event hashes and detects any tampered link.',
    parameters: [
      { name: 'event_id',        type: 'string',  required: false, description: 'Specific event ID to verify (or verify full chain)'  },
      { name: 'recompute_chain', type: 'boolean', required: false, description: 'Walk full chain if true (default: false)'             },
    ],
  },
  {
    method: 'GET',
    endpoint: '/api/hash/metrics',
    description: 'Usage statistics broken down by mode and algorithm.',
    parameters: [
      { name: 'from', type: 'string', required: false, description: 'ISO 8601 start date filter' },
      { name: 'to',   type: 'string', required: false, description: 'ISO 8601 end date filter'   },
    ],
  },
  {
    method: 'POST',
    endpoint: '/api/hash/generate',
    description: 'Generate a standalone CodexHarmonicHash (used internally by CodexAuth for password hashing).',
    parameters: [
      { name: 'data',    type: 'string', required: true,  description: 'Data to hash'                                    },
      { name: 'tier',    type: 'string', required: false, description: '"commercial" | "enterprise" | "government"'       },
      { name: 'tiu',     type: 'float',  required: false, description: 'Time Integrity Unit (0.0–1.0)'                    },
      { name: 'rounds',  type: 'int',    required: false, description: 'Mixing rounds (8 commercial, 16 ent, 24 govt)'    },
    ],
  },
  {
    method: 'GET',
    endpoint: '/health',
    description: 'Service health check including database connectivity.',
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
    id: 'create-event',
    title: 'Create Hash Event',
    language: 'bash',
    code: `# Create a tamper-evident hash event (chains to previous automatically)
curl -X POST https://codexauth.io/api/hash/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "Invoice #1042 — Alice approved $500 transfer",
    "mode": "secure",
    "algo": "harmonic",
    "context": { "actor": "alice", "operation": "transfer" }
  }'

# Response:
# {
#   "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
#   "payload_hash": "c9ababd6...",
#   "prev_event_hash": "b5a82e40...",
#   "event_hash": "9c220574...",
#   "mode": "secure",
#   "algo": "harmonic",
#   "created_at": "2026-04-26T10:14:22"
# }`,
  },
  {
    id: 'verify-chain',
    title: 'Verify Chain Integrity',
    language: 'bash',
    code: `# Verify full chain — recomputes all event hashes in sequence
curl -X POST https://codexauth.io/api/hash/verify \\
  -H "Content-Type: application/json" \\
  -d '{ "recompute_chain": true }'

# Response when chain is intact:
# { "valid": true, "events_checked": 142, "broken_at": null }

# Response when tamper detected:
# {
#   "valid": false,
#   "events_checked": 142,
#   "broken_at": {
#     "position": 87,
#     "event_id": "f3c9...",
#     "expected_hash": "a7f4d9...",
#     "stored_hash": "bb2c11..."
#   }
# }`,
  },
  {
    id: 'js-chaining',
    title: 'JavaScript — Chain Events',
    language: 'javascript',
    code: `import { CodexAuthClient } from '@web3codex/codexauth-sdk';

const client = new CodexAuthClient({ baseUrl: 'https://codexauth.io' });

// Create first event
const event1 = await client.createEvent({
  data: 'Contract signed by Alice',
  mode: 'secure',
  context: { actor: 'alice', doc: 'contract-v2' }
});
// event1.prev_event_hash === null (genesis)
// event1.event_hash === "7bfad6a0..."

// Create chained event (automatically uses event1.event_hash as prev)
const event2 = await client.createEvent({
  data: 'Contract counter-signed by Bob',
  mode: 'secure',
  context: { actor: 'bob', doc: 'contract-v2' }
});
// event2.prev_event_hash === event1.event_hash ✅ chain linked`,
  },
  {
    id: 'php-generate',
    title: 'PHP — Generate HarmonicHash',
    language: 'php',
    code: `<?php
use Web3Codex\\CodexAuth\\Services\\CodexHarmonicHash;
use Web3Codex\\CodexTime\\Services\\CodexTime;

$hasher    = new CodexHarmonicHash();
$codexTime = new CodexTime();
$tiu       = $codexTime->getTIU();  // temporal anchor

// Enterprise tier (512-bit, 16 rounds)
$result = $hasher->hash(
    data:   'Sensitive user record',
    tier:   'enterprise',
    tiu:    $tiu,
    rounds: 16
);

// $result['hash']  — 128 hex chars (512-bit)
// $result['salt']  — generated salt
// $result['tiu']   — embedded time anchor

$valid = $hasher->verify(
    data:  'Sensitive user record',
    hash:  $result['hash'],
    salt:  $result['salt'],
    tiu:   $result['tiu'],
    rounds: 16
);
var_dump($valid); // bool(true)`,
  },
];

// ---------------------------------------------------------------------------
