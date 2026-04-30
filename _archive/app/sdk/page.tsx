'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Terminal, Copy, Check, Github, Book, Code, Cpu, Shield, Zap, Clock } from 'lucide-react'

type SDKType = 'rest-api' | 'javascript' | 'python' | 'go'

interface SDK {
  id: SDKType
  name: string
  icon: string
  version: string
  status: 'available' | 'coming-soon'
  description: string
  installCommand: string
  packageManager: string
  docsUrl: string
  githubUrl: string
  features: string[]
  quickStart: string
}

const sdks: SDK[] = [
  {
    id: 'rest-api',
    name: 'REST API',
    icon: '🌐',
    version: '1.0.0-beta',
    status: 'available',
    description: 'Direct HTTP access to the CodexHash API. Use with any language or tool that supports HTTP requests.',
    installCommand: '# No installation needed - use cURL, fetch, or any HTTP client',
    packageManager: 'HTTP/cURL',
    docsUrl: '/docs/api-reference',
    githubUrl: 'https://github.com/web3connected/codexhash-api',
    features: [
      'Language agnostic',
      'Direct API access',
      'Full feature support',
      'Hash creation & verification',
      'Chain integrity verification',
      'Metrics & analytics'
    ],
    quickStart: `# Create a new hash
curl -X POST https://codexhash.web3connected.com/api/hash/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "your-data-to-hash",
    "mode": "quick",
    "algo": "sha256"
  }'

# Response:
# {
#   "id": "a8d1ddee-79e9-4ca0-8156-ac0413d10583",
#   "created_at": "2026-03-13T12:00:00",
#   "payload_hash": "c9ababd6c6...",
#   "prev_event_hash": "b5a82e40...",
#   "event_hash": "9c22057440...",
#   "mode": "quick",
#   "algo": "sha256"
# }

# Verify hash integrity
curl -X POST https://codexhash.web3connected.com/api/hash/verify/{event_id}

# List hash events
curl https://codexhash.web3connected.com/api/hash/?limit=10

# Get specific hash event
curl https://codexhash.web3connected.com/api/hash/{event_id}`
  },
  {
    id: 'javascript',
    name: 'TypeScript / JavaScript',
    icon: '🟨',
    version: '1.0.0-beta',
    status: 'available',
    description: 'Official TypeScript SDK with full type definitions. Works with Node.js and browser environments.',
    installCommand: 'npm install @web3codex/universal',
    packageManager: 'npm / yarn / pnpm',
    docsUrl: '/docs/sdk/javascript',
    githubUrl: 'https://github.com/web3connected/codex-universal-sdk',
    features: [
      'Full TypeScript definitions',
      'Browser & Node.js support',
      'Axios-based HTTP client',
      'Auto-sync components',
      'React hooks included',
      'CodexAuth integration'
    ],
    quickStart: `import { CodexAPI } from '@web3codex/universal'

// Initialize the API client
const codex = new CodexAPI({
  baseURL: 'https://codexhash.web3connected.com'
})

// Create a hash
const result = await codex.hash.create({
  data: 'your-data-to-hash',
  mode: 'standard',  // 'quick' | 'standard' | 'secure'
  algo: 'sha256'
})

console.log('Hash ID:', result.id)
console.log('Event Hash:', result.event_hash)
console.log('Payload Hash:', result.payload_hash)

// Verify hash chain integrity
const verification = await codex.hash.verify(result.id)
console.log('Is Valid:', verification.is_valid)

// List recent hash events
const events = await codex.hash.list({ limit: 10 })
events.forEach(event => {
  console.log(\`[\${event.mode}] \${event.event_hash}\`)
})`
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    version: '-',
    status: 'coming-soon',
    description: 'Python SDK with async support and type hints. Currently in development.',
    installCommand: '# Coming Soon - Use REST API for now',
    packageManager: 'pip (planned)',
    docsUrl: '/docs/sdk/python',
    githubUrl: 'https://github.com/web3connected/codexhash-python',
    features: [
      'Full type hints (PEP 484)',
      'Async/await support',
      'Django & Flask integrations',
      'CLI tool included',
      'Context managers',
      'Coming Q2 2026'
    ],
    quickStart: `# Python SDK Coming Soon
# For now, use the REST API with requests:

import requests

API_URL = "https://codexhash.web3connected.com"

# Create a hash
response = requests.post(
    f"{API_URL}/api/hash/",
    json={
        "data": "your-data-to-hash",
        "mode": "quick",
        "algo": "sha256"
    }
)

result = response.json()
print(f"Hash ID: {result['id']}")
print(f"Event Hash: {result['event_hash']}")

# Verify hash integrity
verify_response = requests.post(
    f"{API_URL}/api/hash/verify/{result['id']}"
)
verification = verify_response.json()
print(f"Is Valid: {verification['is_valid']}")`
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🔵',
    version: '-',
    status: 'coming-soon',
    description: 'High-performance Go module with zero allocations in hot paths. Currently in development.',
    installCommand: '# Coming Soon - Use REST API for now',
    packageManager: 'go modules (planned)',
    docsUrl: '/docs/sdk/go',
    githubUrl: 'https://github.com/web3connected/codexhash-go',
    features: [
      'Zero-allocation hot paths',
      'Goroutine-safe',
      'Streaming API',
      'Context support',
      'Production ready',
      'Coming Q3 2026'
    ],
    quickStart: `// Go SDK Coming Soon
// For now, use the REST API:

package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

const apiURL = "https://codexhash.web3connected.com"

func main() {
    // Create a hash
    payload := map[string]string{
        "data": "your-data-to-hash",
        "mode": "quick",
        "algo": "sha256",
    }
    
    body, _ := json.Marshal(payload)
    resp, _ := http.Post(
        apiURL+"/api/hash/",
        "application/json",
        bytes.NewBuffer(body),
    )
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    fmt.Printf("Hash ID: %s\\n", result["id"])
    fmt.Printf("Event Hash: %s\\n", result["event_hash"])
}`
  }
]

export default function SDKPage() {
  const [selectedSDK, setSelectedSDK] = useState<SDK>(sdks[0])
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const copyToClipboard = (text: string, type: 'command' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'command') {
      setCopiedCommand(true)
      setTimeout(() => setCopiedCommand(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* Decorative blur elements */}
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute top-[30%] right-[-8%] w-[250px] h-[300px] bg-hash-secondary/30 rounded-full blur-[100px] z-[1]" />

      <div className="container mx-auto px-4 py-12 relative z-[2]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CodexHash <span className="text-hash-primary">SDKs & API</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Access CodexHash via REST API or official SDKs. Choose your integration method.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {sdks.map((sdk) => (
            <button
              key={sdk.id}
              onClick={() => setSelectedSDK(sdk)}
              className={`relative flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${
                selectedSDK.id === sdk.id
                  ? 'bg-hash-primary/20 border-hash-primary/50 text-white'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span className="text-2xl">{sdk.icon}</span>
              <div className="text-left">
                <p className="font-semibold">{sdk.name}</p>
                <p className="text-xs opacity-70">
                  {sdk.status === 'coming-soon' ? (
                    <span className="text-yellow-400">Coming Soon</span>
                  ) : (
                    `v${sdk.version}`
                  )}
                </p>
              </div>
              {sdk.status === 'coming-soon' && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Selected SDK Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info & Install */}
          <div className="space-y-6">
            {/* Description Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selectedSDK.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSDK.name}</h2>
                  <p className="text-sm text-hash-primary">
                    {selectedSDK.status === 'coming-soon' ? (
                      <span className="text-yellow-400">In Development</span>
                    ) : (
                      `v${selectedSDK.version}`
                    )}
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">{selectedSDK.description}</p>
            </div>

            {/* Install Command */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-hash-primary" />
                  {selectedSDK.status === 'coming-soon' ? 'Status' : 'Installation'}
                </h3>
                <span className="text-xs text-slate-500">{selectedSDK.packageManager}</span>
              </div>
              <div className="relative">
                <pre className="bg-slate-900/80 rounded-lg p-4 overflow-x-auto">
                  <code className={`text-sm font-mono ${selectedSDK.status === 'coming-soon' ? 'text-yellow-400' : 'text-hash-primary'}`}>
                    {selectedSDK.installCommand}
                  </code>
                </pre>
                {selectedSDK.status === 'available' && (
                  <button
                    onClick={() => copyToClipboard(selectedSDK.installCommand, 'command')}
                    className="absolute top-3 right-3 p-2 bg-slate-700/50 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copiedCommand ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-hash-primary" />
                Features
              </h3>
              <ul className="space-y-2">
                {selectedSDK.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-400">
                    {feature.includes('Coming') ? (
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              <Link
                href={selectedSDK.docsUrl}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-hash-primary/20 hover:bg-hash-primary/30 border border-hash-primary/50 rounded-lg text-hash-primary transition-colors"
              >
                <Book className="w-4 h-4" />
                Documentation
              </Link>
              <a
                href={selectedSDK.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Right Column - Quick Start Code */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden h-full">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-700/50">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-hash-primary" />
                  {selectedSDK.status === 'coming-soon' ? 'Example (Using REST API)' : 'Quick Start'}
                </h3>
                <button
                  onClick={() => copyToClipboard(selectedSDK.quickStart, 'code')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded text-sm transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-400">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-6 overflow-x-auto h-[calc(100%-52px)]">
                <code className="text-sm font-mono text-slate-300 whitespace-pre">{selectedSDK.quickStart}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* API Modes Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Hash <span className="text-hash-primary">Modes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Quick Mode</h3>
              <p className="text-sm text-slate-400">
                Fast hashing for high-throughput scenarios. Optimized for speed with standard security.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-hash-primary" />
              </div>
              <h3 className="font-semibold text-white mb-2">Standard Mode</h3>
              <p className="text-sm text-slate-400">
                Balanced hashing with enhanced security. Recommended for most use cases.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-hash-accent/10 border border-hash-accent/20 flex items-center justify-center">
                <Cpu className="w-7 h-7 text-hash-accent" />
              </div>
              <h3 className="font-semibold text-white mb-2">Secure Mode</h3>
              <p className="text-sm text-slate-400">
                Maximum security with additional entropy rounds. For sensitive data and critical applications.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-hash-primary/20 to-hash-secondary/20 border border-hash-primary/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Try the REST API directly or install the TypeScript SDK to start integrating CodexHash.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs/api-reference"
                className="px-8 py-3 bg-hash-primary hover:bg-hash-primary/80 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                API Reference
              </Link>
              <Link
                href="/docs/getting-started"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                Getting Started Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
