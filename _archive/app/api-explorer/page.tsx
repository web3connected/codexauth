"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
}

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  params?: Param[];
  body?: Param[];
  response: string;
  group: string;
}

const BASE_URL = "https://codexhash.web3connected.com";

const endpoints: Endpoint[] = [
  // ── Root ─────────────────────────────────────────────────────────────
  {
    group: "Service",
    method: "GET",
    path: "/",
    description: "Service info and status.",
    response: `{ "service": "CodexHash API", "version": "1.0.0", "status": "operational", "timestamp": "..." }`,
  },
  {
    group: "Service",
    method: "GET",
    path: "/health",
    description: "Health check — reports database connectivity.",
    response: `{ "status": "healthy", "service": "codexhash-api", "timestamp": "...", "database": { "status": "healthy" } }`,
  },
  {
    group: "Service",
    method: "GET",
    path: "/api/metrics",
    description: "Endpoint hit metrics for this service.",
    params: [{ name: "hours", type: "int", required: false, description: "Lookback window in hours.", default: "24" }],
    response: `{ "hits": [...] }`,
  },
  {
    group: "Service",
    method: "GET",
    path: "/api/codexsecure/status",
    description: "CodexSecure SDK integration status for CodexHash.",
    response: `{ "service": "codexhash", "sdk": "codexsecure", "configured": true, "upstream_ok": true }`,
  },

  // ── Hash Events ──────────────────────────────────────────────────────
  {
    group: "Hash Events",
    method: "POST",
    path: "/api/hash/",
    description: "Create a new tamper-evident hash event. Chains to the previous event hash.",
    body: [
      { name: "data", type: "string", required: true, description: "Raw input data to hash." },
      { name: "mode", type: "string", required: false, description: "Hash mode.", default: "quick" },
      { name: "algo", type: "string", required: false, description: "Algorithm: sha256, sha512, harmonic.", default: "sha256" },
      { name: "context", type: "object", required: false, description: "Additional metadata." },
    ],
    response: `{ "id": "uuid", "created_at": "...", "payload_hash": "...", "prev_event_hash": "...", "event_hash": "...", "mode": "quick", "algo": "sha256", "context": null }`,
  },
  {
    group: "Hash Events",
    method: "GET",
    path: "/api/hash/",
    description: "List hash events with optional filtering.",
    params: [
      { name: "limit", type: "int", required: false, description: "Max results.", default: "50" },
      { name: "offset", type: "int", required: false, description: "Pagination offset.", default: "0" },
      { name: "mode", type: "string", required: false, description: "Filter by mode." },
      { name: "algo", type: "string", required: false, description: "Filter by algorithm." },
    ],
    response: `[{ "id": "...", "payload_hash": "...", "event_hash": "...", ... }]`,
  },
  {
    group: "Hash Events",
    method: "GET",
    path: "/api/hash/{event_id}",
    description: "Get a specific hash event by ID.",
    response: `{ "id": "uuid", "payload_hash": "...", "event_hash": "...", "mode": "quick", "algo": "sha256" }`,
  },
  {
    group: "Hash Events",
    method: "POST",
    path: "/api/hash/verify/{event_id}",
    description: "Verify the chain integrity of a specific hash event.",
    response: `{ "event_id": "...", "is_valid": true, "stored_hash": "...", "calculated_hash": "...", "message": "Hash chain is valid" }`,
  },
  {
    group: "Hash Events",
    method: "GET",
    path: "/api/hash/metrics/summary",
    description: "Aggregate metrics: total hashes, breakdown by mode and algorithm.",
    response: `{ "total_hashes": 1234, "hashes_by_mode": { "quick": 800 }, "hashes_by_algo": { "sha256": 700 }, "recent_hashes": 42 }`,
  },
  {
    group: "Hash Events",
    method: "GET",
    path: "/api/hash/tiu/current",
    description: "Return the current server-side Time Integrity Unit (TIU) from CodexTime.",
    response: `{ "tiu": 0.618034, "source": "codextime", "timestamp": "..." }`,
  },

  // ── CodexAuth Integration ────────────────────────────────────────────
  {
    group: "CodexAuth Integration",
    method: "POST",
    path: "/api/hash/generate",
    description: "Generate a CodexHarmonic hash for authentication (used by CodexAuth during registration / password change).",
    body: [
      { name: "secret", type: "string", required: true, description: "The secret/password to hash." },
      { name: "salt", type: "string", required: false, description: "Custom salt. Auto-generated if omitted." },
      { name: "tiu", type: "float", required: false, description: "Time Integrity Unit. Fetched from CodexTime if omitted." },
      { name: "rounds", type: "int", required: false, description: "Hash iterations.", default: "16" },
      { name: "email", type: "string", required: false, description: "Used to derive salt if salt not provided." },
      { name: "record_chain", type: "bool", required: false, description: "Persist to codex_hash_records chain.", default: "false" },
      { name: "chain_id", type: "string", required: false, description: "Logical chain identifier (required if record_chain=true)." },
      { name: "previous_hash", type: "string", required: false, description: "Expected previous hash for sequence validation." },
      { name: "hash_size", type: "int", required: false, description: "Stored hash size.", default: "1024" },
      { name: "payload_ref_type", type: "string", required: false, description: "Reference type (required if record_chain=true)." },
      { name: "payload_ref_id", type: "string", required: false, description: "Reference ID (required if record_chain=true)." },
      { name: "actor_id", type: "string", required: false, description: "Actor responsible for the event." },
      { name: "event_type", type: "string", required: false, description: "Event type (required if record_chain=true)." },
      { name: "context_json", type: "object", required: false, description: "Additional event metadata." },
      { name: "sequence_number", type: "int", required: false, description: "Expected next sequence number." },
      { name: "status", type: "string", required: false, description: "Lifecycle status.", default: "active" },
    ],
    response: `{ "hash": "...", "salt": "...", "tiu": 0.618034, "rounds": 16, "algorithm": "codex_harmonic", "chain_record": null }`,
  },
  {
    group: "CodexAuth Integration",
    method: "POST",
    path: "/api/hash/validate",
    description: "Validate a CodexHarmonic hash against a stored hash (used by CodexAuth during login).",
    body: [
      { name: "attempted", type: "string", required: true, description: "The secret/password being attempted." },
      { name: "storedHash", type: "string", required: true, description: "The hash stored during registration." },
      { name: "salt", type: "string", required: true, description: "The salt used during registration." },
      { name: "tiu", type: "float", required: true, description: "The TIU stored during registration." },
      { name: "rounds", type: "int", required: false, description: "Number of rounds used.", default: "16" },
      { name: "buffer", type: "float", required: false, description: "Allowed temporal buffer.", default: "0.000001" },
      { name: "chain_id", type: "string", required: false, description: "Optional chain identifier to scope verification." },
      { name: "verify_chain", type: "bool", required: false, description: "Validate stored chain linkage and update verified_at.", default: "false" },
    ],
    response: `{ "valid": true, "message": "Hash validated successfully", "chain_record": null }`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  POST: "bg-green-500/10 text-green-400 border border-green-500/20",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const fullUrl = `${BASE_URL}${endpoint.path}`;

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className={`text-xs font-bold px-2.5 py-1 rounded font-mono shrink-0 ${METHOD_COLORS[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <span className="font-mono text-sm text-white flex-1">{endpoint.path}</span>
        <span className="text-slate-400 text-sm hidden md:block flex-1">{endpoint.description}</span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-slate-700 px-5 py-5 space-y-5">
          <p className="text-slate-300 text-sm">{endpoint.description}</p>

          {/* Full URL */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Full URL</div>
            <div className="flex items-center gap-2 bg-black rounded-lg px-4 py-2.5 font-mono text-sm text-slate-300">
              <span className="flex-1 break-all">{fullUrl}</span>
              <CopyButton text={fullUrl} />
            </div>
          </div>

          {/* Query Params */}
          {endpoint.params && endpoint.params.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Query Parameters</div>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                {endpoint.params.map((p) => (
                  <div key={p.name} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-4 py-3 text-sm bg-slate-900/30">
                    <span className="font-mono text-hash-primary shrink-0 w-40">{p.name}</span>
                    <span className="text-slate-500 shrink-0 w-16">{p.type}</span>
                    <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded w-16 text-center ${p.required ? "bg-red-500/10 text-red-400" : "bg-slate-700 text-slate-400"}`}>
                      {p.required ? "required" : "optional"}
                    </span>
                    <span className="text-slate-400 flex-1">{p.description}{p.default && <span className="text-slate-600"> (default: {p.default})</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.body && endpoint.body.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Request Body (JSON)</div>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                {endpoint.body.map((p) => (
                  <div key={p.name} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-4 py-3 text-sm bg-slate-900/30">
                    <span className="font-mono text-hash-primary shrink-0 w-40">{p.name}</span>
                    <span className="text-slate-500 shrink-0 w-16">{p.type}</span>
                    <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded w-16 text-center ${p.required ? "bg-red-500/10 text-red-400" : "bg-slate-700 text-slate-400"}`}>
                      {p.required ? "required" : "optional"}
                    </span>
                    <span className="text-slate-400 flex-1">{p.description}{p.default && <span className="text-slate-600"> (default: {p.default})</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Example Response</div>
            <div className="relative bg-black rounded-lg p-4 group">
              <pre className="text-green-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">{endpoint.response}</pre>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={endpoint.response} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function APIExplorerPage() {
  const groups = [...new Set(endpoints.map((e) => e.group))];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-12">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">API Explorer</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-3">API Explorer</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            All endpoints for the CodexHash API. Base URL:{" "}
            <span className="font-mono text-hash-primary">{BASE_URL}</span>
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            <a
              href={`${BASE_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hash-primary hover:underline"
            >
              Swagger UI →
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`${BASE_URL}/redoc`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hash-primary hover:underline"
            >
              ReDoc →
            </a>
          </div>
        </div>
      </div>

      {/* Endpoint list */}
      <div className="container mx-auto px-6 py-12 max-w-5xl space-y-12">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-slate-800">{group}</h2>
            <div className="space-y-3">
              {endpoints.filter((e) => e.group === group).map((e, i) => (
                <EndpointCard key={i} endpoint={e} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
