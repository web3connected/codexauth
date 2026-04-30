"use client";

import Link from "next/link";
import { ExternalLink, Github, Terminal, Copy, Check, Package, BookOpen, Zap, Shield } from "lucide-react";
import { useState } from "react";

const installSteps = [
  {
    step: "1",
    title: "Install the SDK",
    code: "npm install @web3codex/codexhash-sdk",
    alt: "# or with yarn\nyarn add @web3codex/codexhash-sdk\n\n# or with pnpm\npnpm add @web3codex/codexhash-sdk",
  },
  {
    step: "2",
    title: "Import and initialize",
    code: `import { CodexHash } from '@web3codex/codexhash-sdk';

const client = new CodexHash({
  apiKey: 'your-api-key',
});`,
  },
  {
    step: "3",
    title: "Generate your first hash",
    code: `const result = await client.hash('Hello, Quantum World!');

console.log(result.hash);
// => ch_abc123...`,
  },
  {
    step: "4",
    title: "Verify a hash",
    code: `const verified = await client.verify({
  data: 'Hello, Quantum World!',
  hash: result.hash,
});

console.log(verified.valid); // => true`,
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-black rounded-lg p-4 group">
      <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">{code}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function JavaScriptSDKPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-14">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">JavaScript SDK</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-xl">
                  JS
                </div>
                <span className="text-sm font-medium px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400">
                  Available
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                JavaScript / TypeScript SDK
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Quantum-resistant hashing for Node.js, browser, and edge runtimes. Full TypeScript support included.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://github.com/web3codex/codexhash-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 text-white hover:border-slate-400 transition-colors font-medium"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
              <Link
                href="/docs/getting-started"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-hash-primary text-white hover:bg-hash-primary/90 transition-colors font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Full Docs
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-10 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-slate-300">@web3codex/codexhash-sdk</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-500" />
              Node.js 18+ · Browser · Edge
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              TypeScript-first
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-14 max-w-4xl">
        {/* Getting Started */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-hash-primary" />
            Getting Started
          </h2>

          <div className="space-y-8">
            {installSteps.map((step) => (
              <div key={step.step} className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-hash-primary/10 border border-hash-primary/30 flex items-center justify-center text-hash-primary font-bold text-sm">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-3">{step.title}</h3>
                  <CodeBlock code={step.code} />
                  {step.alt && (
                    <details className="mt-2">
                      <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">Other package managers</summary>
                      <div className="mt-2">
                        <CodeBlock code={step.alt} />
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="grid md:grid-cols-2 gap-4">
          <a
            href="https://github.com/web3codex/codexhash-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/50 transition-colors group"
          >
            <Github className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
            <div>
              <div className="text-white font-semibold group-hover:text-hash-primary transition-colors flex items-center gap-1">
                GitHub Repository <ExternalLink className="w-3 h-3" />
              </div>
              <div className="text-sm text-slate-500">Source code, issues & contributions</div>
            </div>
          </a>

          <Link
            href="/docs/api-reference"
            className="flex items-center gap-4 p-5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/50 transition-colors group"
          >
            <BookOpen className="w-8 h-8 text-slate-400 group-hover:text-hash-primary transition-colors" />
            <div>
              <div className="text-white font-semibold group-hover:text-hash-primary transition-colors">API Reference</div>
              <div className="text-sm text-slate-500">Full method and type documentation</div>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
