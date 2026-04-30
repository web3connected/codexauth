'use client'

import { useState } from 'react'
import { Check, Copy, Terminal, Code } from 'lucide-react'

type Language = 'curl' | 'javascript' | 'python'

const codeExamples = {
  curl: {
    install: '# No installation required - use cURL or any HTTP client',
    code: `# Create a quantum-resistant hash
curl -X POST https://codexhash.web3connected.com/api/hash/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "Hello, World!",
    "algo": "harmonic"
  }'

# Response:
# {
#   "success": true,
#   "hash": "a7b3c9d2e4f5...",
#   "algo": "harmonic",
#   "quantum_resistance": 65000,
#   "processing_time_ms": 12
# }

# Verify hash chain integrity
curl -X POST https://codexhash.web3connected.com/api/hash/verify/{event_id}

# List hash events
curl https://codexhash.web3connected.com/api/hash/?limit=10`
  },
  javascript: {
    install: '# REST API — no package required',
    code: `const API_URL = 'https://codexhash.web3connected.com'

// Create a quantum-resistant hash
const response = await fetch(\`\${API_URL}/api/hash/\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: 'Hello, World!',
    algo: 'harmonic'
  })
})

const result = await response.json()
console.log('Hash:', result.hash)
console.log('Quantum Resistance:', result.quantum_resistance)
console.log('Processing Time:', result.processing_time_ms, 'ms')

// Verify hash chain integrity
const verifyResponse = await fetch(
  \`\${API_URL}/api/hash/verify/\${result.id}\`,
  { method: 'POST' }
)
const verification = await verifyResponse.json()
console.log('Is Valid:', verification.is_valid)`
  },
  python: {
    install: '# Python — use REST API with requests',
    code: `import requests

API_URL = "https://codexhash.web3connected.com"

# Create a quantum-resistant hash
response = requests.post(
    f"{API_URL}/api/hash/",
    json={
        "data": "Hello, World!",
        "algo": "harmonic"
    }
)

result = response.json()
print(f"Hash: {result['hash']}")
print(f"Quantum Resistance: {result['quantum_resistance']}")
print(f"Processing Time: {result['processing_time_ms']}ms")

# Verify hash chain integrity
verify_response = requests.post(
    f"{API_URL}/api/hash/verify/{result['id']}"
)
verification = verify_response.json()
print(f"Is Valid: {verification['is_valid']}")`
  }
}

export default function InstallationDocs() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('curl')
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const copyToClipboard = (text: string, type: 'install' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'install') {
      setCopiedInstall(true)
      setTimeout(() => setCopiedInstall(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <div id="first-hash" className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6">Your First Hash</h2>

      {/* Language Tabs */}
      <div className="flex gap-2 mb-4">
        {(['curl', 'javascript', 'python'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLanguage === lang
                ? 'bg-hash-primary/20 text-hash-primary border border-hash-primary/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {lang === 'javascript' ? 'TypeScript / JS' : lang === 'python' ? 'Python' : 'cURL / REST'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Install Command */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Installation
            </span>
            <button
              onClick={() => copyToClipboard(codeExamples[selectedLanguage].install, 'install')}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            >
              {copiedInstall ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono text-hash-primary">{codeExamples[selectedLanguage].install}</code>
          </pre>
        </div>

        {/* Code Example */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Example Code
            </span>
            <button
              onClick={() => copyToClipboard(codeExamples[selectedLanguage].code, 'code')}
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
          <pre className="p-4 overflow-x-auto max-h-[400px]">
            <code className="text-sm font-mono text-slate-300 whitespace-pre">{codeExamples[selectedLanguage].code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}