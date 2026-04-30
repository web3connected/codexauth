'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Copy, Check, ExternalLink } from 'lucide-react'

const BASE_URL = 'https://codexhash.web3connected.com'

type Method = 'GET' | 'POST'

interface Param {
  name: string
  type: string
  required: boolean
  location: 'body' | 'query' | 'path'
  description: string
  default?: string
}

interface Endpoint {
  id: string
  method: Method
  path: string
  title: string
  description: string
  params?: Param[]
  requestExample?: string
  responseExample: string
  responseBadge?: string
  tag?: string
}

const endpoints: Endpoint[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    title: 'Health Check',
    tag: 'Status',
    description: 'Check service health and database connectivity. Use this to confirm the API is reachable before sending requests.',
    responseExample: `{
  "status": "healthy",
  "service": "codexhash-api",
  "database": {
    "status": "healthy",
    "version": "PostgreSQL 16.13"
  }
}`,
  },
  {
    id: 'tiu-current',
    method: 'GET',
    path: '/api/hash/tiu/current',
    title: 'Current TIU',
    tag: 'Status',
    description: 'Returns the server-side Time Integrity Unit (TIU) sourced from CodexTime. TIU is the temporal anchor used during hash generation — it makes each hash time-bound and replay-resistant.',
    responseExample: `{
  "tiu": 1779670800.847293,
  "source": "codextime",
  "timestamp": 1779670800.847293,
  "stratum": 1
}`,
    responseBadge: '200 OK',
  },
  {
    id: 'hash-create',
    method: 'POST',
    path: '/api/hash/',
    title: 'Create Hash Event',
    tag: 'Hash Tracking',
    description: 'Create a new tamper-evident hash event. Each event is chained to the previous one via prev_event_hash. Supports sha256, sha512, or the proprietary harmonic algorithm.',
    params: [
      { name: 'data', type: 'string', required: true, location: 'body', description: 'Raw input data to hash.' },
      { name: 'mode', type: 'string', required: false, location: 'body', description: '"quick" or "codex".', default: 'quick' },
      { name: 'algo', type: 'string', required: false, location: 'body', description: '"sha256" | "sha512" | "harmonic".', default: 'sha256' },
      { name: 'context', type: 'object', required: false, location: 'body', description: 'Optional metadata stored alongside the event.' },
    ],
    requestExample: `{
  "data": "my-document-v1",
  "mode": "quick",
  "algo": "harmonic"
}`,
    responseExample: `{
  "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
  "created_at": "2026-04-25T14:32:00",
  "payload_hash": "c9ababd6c6298e6b61b10f694bfb5a039a4b46de5c9f6e53a31c0390bb962092",
  "prev_event_hash": "b5a82e40abea0ee1389006dfbf92a6ba7b2d8a901af44279a3f46285832e283b",
  "event_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "tiu": 1779670800.847293,
  "mode": "quick",
  "algo": "harmonic",
  "context": null
}`,
    responseBadge: '200 OK',
  },
  {
    id: 'hash-list',
    method: 'GET',
    path: '/api/hash/',
    title: 'List Hash Events',
    tag: 'Hash Tracking',
    description: 'Retrieve a paginated list of hash events ordered newest first. Filter by mode or algorithm.',
    params: [
      { name: 'limit', type: 'integer', required: false, location: 'query', description: 'Max events to return.', default: '50' },
      { name: 'offset', type: 'integer', required: false, location: 'query', description: 'Pagination offset.', default: '0' },
      { name: 'mode', type: 'string', required: false, location: 'query', description: 'Filter by hash mode.' },
      { name: 'algo', type: 'string', required: false, location: 'query', description: 'Filter by algorithm.' },
    ],
    responseExample: `[
  {
    "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
    "created_at": "2026-04-25T14:32:00",
    "payload_hash": "c9ababd6...",
    "prev_event_hash": "b5a82e40...",
    "event_hash": "9c220574...",
    "tiu": 1779670800.847293,
    "mode": "quick",
    "algo": "harmonic",
    "context": null
  }
]`,
    responseBadge: '200 OK',
  },
  {
    id: 'hash-get',
    method: 'GET',
    path: '/api/hash/{event_id}',
    title: 'Get Hash Event',
    tag: 'Hash Tracking',
    description: 'Retrieve a specific hash event by UUID.',
    params: [
      { name: 'event_id', type: 'string (UUID)', required: true, location: 'path', description: 'Unique identifier of the hash event.' },
    ],
    responseExample: `{
  "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
  "created_at": "2026-04-25T14:32:00",
  "payload_hash": "c9ababd6c6298e6b61b10f694bfb5a039a4b46de5c9f6e53a31c0390bb962092",
  "prev_event_hash": "b5a82e40abea0ee1389006dfbf92a6ba7b2d8a901af44279a3f46285832e283b",
  "event_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "tiu": 1779670800.847293,
  "mode": "quick",
  "algo": "harmonic",
  "context": null
}`,
    responseBadge: '200 OK',
  },
  {
    id: 'hash-verify',
    method: 'POST',
    path: '/api/hash/verify/{event_id}',
    title: 'Verify Hash Chain',
    tag: 'Hash Tracking',
    description: 'Verify integrity by recomputing the event_hash from payload_hash + prev_event_hash + context and comparing to stored value. A mismatch indicates tampering.',
    params: [
      { name: 'event_id', type: 'string (UUID)', required: true, location: 'path', description: 'UUID of the hash event to verify.' },
    ],
    responseExample: `{
  "event_id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
  "is_valid": true,
  "stored_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "calculated_hash": "9c2205744080d30faa3da1a6ee4820dd31d345c64231db781fd138329837848a",
  "message": "Hash chain is valid"
}`,
    responseBadge: '200 OK',
  },
  {
    id: 'metrics',
    method: 'GET',
    path: '/api/hash/metrics/summary',
    title: 'Metrics Summary',
    tag: 'Hash Tracking',
    description: 'Aggregate metrics: total events, recent activity (last 24h), and breakdown by mode and algorithm.',
    responseExample: `{
  "total_hashes": 1234,
  "hashes_by_mode": { "quick": 900, "codex": 334 },
  "hashes_by_algo": { "sha256": 800, "sha512": 100, "harmonic": 334 },
  "recent_hashes": 56,
  "first_hash_date": "2026-01-01T00:00:00",
  "last_hash_date": "2026-04-24T14:30:00"
}`,
    responseBadge: '200 OK',
  },
  {
    id: 'generate',
    method: 'POST',
    path: '/api/hash/generate',
    title: 'Generate Harmonic Hash',
    tag: 'CodexAuth Integration',
    description: 'Generate a CodexHarmonicHash for authentication. Used by CodexAuth (PHP) during registration and password changes. Applies HMAC-SHA3-512 with 16 rounds of iterative entropy mixing anchored to the current TIU.',
    params: [
      { name: 'secret', type: 'string', required: true, location: 'body', description: 'The secret or password to hash.' },
      { name: 'salt', type: 'string', required: false, location: 'body', description: 'User-specific salt. Auto-generated if omitted.' },
      { name: 'tiu', type: 'float', required: false, location: 'body', description: 'Time Integrity Unit from CodexTime. Fetched automatically if omitted.' },
      { name: 'rounds', type: 'integer', required: false, location: 'body', description: 'Number of hashing iterations.', default: '16' },
      { name: 'email', type: 'string', required: false, location: 'body', description: 'User email for deterministic salt generation (if salt not provided).' },
      { name: 'record_chain', type: 'boolean', required: false, location: 'body', description: 'Persist this hash into codex_hash_records for chain tracking.', default: 'false' },
      { name: 'chain_id', type: 'string', required: false, location: 'body', description: 'Logical chain identifier (required if record_chain is true).' },
    ],
    requestExample: `{
  "secret": "user-password",
  "email": "user@example.com",
  "rounds": 16
}`,
    responseExample: `{
  "hash": "a7f3c9d2e4b5...",
  "salt": "3f9a2b4c1d8e",
  "tiu": 1779670800.847293,
  "rounds": 16,
  "algorithm": "sha3_512",
  "chain_record": null
}`,
    responseBadge: '200 OK',
  },
  {
    id: 'validate',
    method: 'POST',
    path: '/api/hash/validate',
    title: 'Validate Harmonic Hash',
    tag: 'CodexAuth Integration',
    description: 'Validate an attempted secret against a stored CodexHarmonicHash. Used by CodexAuth during login. The buffer parameter allows for slight temporal drift between registration and login TIU.',
    params: [
      { name: 'attempted', type: 'string', required: true, location: 'body', description: 'The secret/password being attempted.' },
      { name: 'storedHash', type: 'string', required: true, location: 'body', description: 'The hash stored at registration.' },
      { name: 'salt', type: 'string', required: true, location: 'body', description: 'The salt used at registration.' },
      { name: 'tiu', type: 'float', required: true, location: 'body', description: 'The TIU stored at registration time.' },
      { name: 'rounds', type: 'integer', required: false, location: 'body', description: 'Rounds used during registration.', default: '16' },
      { name: 'buffer', type: 'float', required: false, location: 'body', description: 'Allowed temporal drift from stored TIU.', default: '0.000001' },
      { name: 'verify_chain', type: 'boolean', required: false, location: 'body', description: 'Validate chain linkage and update verified_at.', default: 'false' },
    ],
    requestExample: `{
  "attempted": "user-password",
  "storedHash": "a7f3c9d2e4b5...",
  "salt": "3f9a2b4c1d8e",
  "tiu": 0.847293,
  "rounds": 16
}`,
    responseExample: `{
  "valid": true,
  "message": "Hash validation successful",
  "chain_record": null
}`,
    responseBadge: '200 OK',
  },
]

const errorCodes = [
  { code: '400', label: 'Bad Request', description: 'Invalid or missing request body fields.' },
  { code: '404', label: 'Not Found', description: 'The requested event_id does not exist.' },
  { code: '422', label: 'Validation Error', description: 'Schema mismatch or chain validation failure — check the detail field.' },
  { code: '500', label: 'Internal Server Error', description: 'Unexpected server error.' },
  { code: '503', label: 'Service Unavailable', description: 'Database or CodexTime dependency is down.' },
]

const methodColors: Record<Method, string> = {
  GET: 'bg-hash-secondary/15 text-hash-secondary border-hash-secondary/30',
  POST: 'bg-hash-primary/15 text-hash-primary border-hash-primary/30',
}

const locationColors: Record<string, string> = {
  body: 'text-hash-accent',
  query: 'text-hash-secondary',
  path: 'text-purple-400',
}

const tags = ['Status', 'Hash Tracking', 'CodexAuth Integration']

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />}
    </button>
  )
}

function MethodBadge({ method }: { method: Method }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded border text-xs font-mono font-bold ${methodColors[method]}`}>
      {method}
    </span>
  )
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [tab, setTab] = useState<'request' | 'response'>(ep.requestExample ? 'request' : 'response')
  const curlExample = ep.requestExample
    ? `curl -X POST ${BASE_URL}${ep.path.replace('{event_id}', '<event_id>')} \\\n  -H "Content-Type: application/json" \\\n  -d '${ep.requestExample}'`
    : `curl "${BASE_URL}${ep.path.replace('{event_id}', '<event_id>')}"`

  return (
    <div id={ep.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden scroll-mt-24">
      <div className="px-6 py-5 border-b border-slate-700/50 flex flex-wrap items-center gap-3">
        <MethodBadge method={ep.method} />
        <code className="text-slate-200 font-mono text-sm">{ep.path}</code>
      </div>
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-white mb-2">{ep.title}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{ep.description}</p>
        {ep.params && ep.params.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Parameters</h4>
            <div className="border border-slate-700/50 rounded-xl overflow-hidden divide-y divide-slate-700/50">
              {ep.params.map(p => (
                <div key={p.name} className="px-4 py-3 flex flex-wrap items-start gap-x-4 gap-y-1">
                  <code className="text-hash-primary font-mono text-sm w-36 shrink-0">{p.name}</code>
                  <div className="flex flex-wrap items-center gap-2 text-xs w-52 shrink-0">
                    <span className={`font-mono ${locationColors[p.location]}`}>{p.location}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{p.type}</span>
                    {p.required
                      ? <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs">required</span>
                      : p.default && <span className="text-slate-600 text-xs">default: {p.default}</span>
                    }
                  </div>
                  <span className="text-slate-400 text-sm flex-1">{p.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="flex gap-2 mb-3">
            {ep.requestExample && (
              <button onClick={() => setTab('request')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'request' ? 'bg-hash-primary/20 text-hash-primary border border-hash-primary/40' : 'bg-slate-700/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'}`}>
                Request
              </button>
            )}
            <button onClick={() => setTab('response')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'response' ? 'bg-hash-primary/20 text-hash-primary border border-hash-primary/40' : 'bg-slate-700/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'}`}>
              Response {ep.responseBadge && <span className="ml-1.5 text-hash-secondary">{ep.responseBadge}</span>}
            </button>
          </div>
          <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/40 bg-slate-900/40">
              <span className="text-xs font-mono text-slate-500">{tab === 'request' ? 'cURL' : 'JSON Response'}</span>
              <CopyButton text={tab === 'request' ? curlExample : ep.responseExample} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed max-h-80">
              <code className="text-slate-300 whitespace-pre">{tab === 'request' ? curlExample : ep.responseExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ApiReferencePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden lg:block absolute top-[30%] right-[-8%] w-[250px] h-[300px] bg-hash-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/docs" className="hover:text-hash-primary transition-colors">Docs</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-hash-primary">API Reference</span>
        </nav>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            API <span className="text-hash-primary">Reference</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mb-6">
            REST API for quantum-resistant hashing and tamper-evident event chaining. All endpoints return JSON.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg">
              <span className="text-xs text-slate-500 font-mono">Base URL</span>
              <code className="text-hash-primary font-mono text-sm">{BASE_URL}</code>
              <CopyButton text={BASE_URL} />
            </div>
            <a href={`${BASE_URL}/health`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-400 hover:text-hash-primary hover:border-hash-primary/40 transition-colors text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hash-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-hash-primary" />
              </span>
              Live Status
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-60 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {tags.map(tag => (
                <div key={tag}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-3">{tag}</p>
                  {endpoints.filter(ep => ep.tag === tag).map(ep => (
                    <a key={ep.id} href={`#${ep.id}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white transition-colors text-sm">
                      <span className={`text-xs font-mono font-bold shrink-0 ${ep.method === 'GET' ? 'text-hash-secondary' : 'text-hash-primary'}`}>{ep.method}</span>
                      <span className="font-mono text-xs truncate">{ep.path}</span>
                    </a>
                  ))}
                </div>
              ))}
              <div className="border-t border-slate-700/50 pt-4">
                <a href="#errors" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white transition-colors text-sm">Error Codes</a>
              </div>
            </div>
          </aside>
          <div className="flex-1 space-y-6">
            {tags.map(tag => (
              <div key={tag}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-base font-semibold text-slate-300 whitespace-nowrap">{tag}</h2>
                  <div className="flex-1 border-t border-slate-700/50" />
                </div>
                <div className="space-y-6">
                  {endpoints.filter(ep => ep.tag === tag).map(ep => <EndpointCard key={ep.id} ep={ep} />)}
                </div>
              </div>
            ))}
            <div id="errors" className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden scroll-mt-24">
              <div className="px-6 py-5 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">Error Codes</h3>
                <p className="text-slate-400 text-sm mt-1">All endpoints use standard HTTP status codes with a <code className="text-hash-primary font-mono">detail</code> field:</p>
                <div className="mt-3 bg-slate-900/60 rounded-xl border border-slate-700/50 px-4 py-3">
                  <code className="text-sm font-mono text-slate-300">{`{ "detail": "Error message description" }`}</code>
                </div>
              </div>
              <div className="divide-y divide-slate-700/50">
                {errorCodes.map(e => (
                  <div key={e.code} className="px-6 py-4 flex items-start gap-4">
                    <span className={`font-mono font-bold text-sm shrink-0 w-12 ${e.code.startsWith('5') ? 'text-red-400' : e.code.startsWith('4') ? 'text-hash-accent' : 'text-hash-primary'}`}>{e.code}</span>
                    <span className="text-white text-sm font-medium w-44 shrink-0">{e.label}</span>
                    <span className="text-slate-400 text-sm">{e.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-hash-primary/20 to-hash-secondary/20 border border-hash-primary/30 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">Related</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/docs/getting-started" className="group flex flex-col gap-1 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/10">
                  <div className="font-semibold text-white group-hover:text-hash-primary transition-colors text-sm">Getting Started</div>
                  <div className="text-xs text-slate-400">Your first hash in minutes</div>
                </Link>
                <Link href="/examples" className="group flex flex-col gap-1 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/10">
                  <div className="font-semibold text-white group-hover:text-hash-primary transition-colors text-sm">Live Examples</div>
                  <div className="text-xs text-slate-400">Interactive demo</div>
                </Link>
                <Link href="/technical-details" className="group flex flex-col gap-1 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/10">
                  <div className="font-semibold text-white group-hover:text-hash-primary transition-colors text-sm">Cryptographic Spec</div>
                  <div className="text-xs text-slate-400">Algorithm internals</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
