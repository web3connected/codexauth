'use client'

import React, { useState } from 'react'

type Language = 'javascript' | 'python' | 'go' | 'rust'

const codeExamples: Record<Language, string> = {
  javascript: `import { CodexAuth } from '@web3connected/codexauth-starter-kit';

const hasher = new CodexAuth({
  algorithm: 'harmonic',
  securityLevel: 'quantum-resistant'
});

// Generate a quantum-resistant hash
const result = await hasher.hash('Your data here');
console.log(result.hash);
// Output: "ch_a7b3c9d2e4f5..."`,

  python: `from codexauth import CodexAuth

hasher = CodexAuth(
    algorithm="harmonic",
    security_level="quantum-resistant"
)

# Generate a quantum-resistant hash
result = hasher.hash("Your data here")
print(result.hash)
# Output: "ch_a7b3c9d2e4f5..."`,

  go: `package main

import "github.com/web3connected/codexauth-go"

func main() {
    hasher := codexauth.New(codexauth.Options{
        Algorithm:     "harmonic",
        SecurityLevel: "quantum-resistant",
    })

    // Generate a quantum-resistant hash
    result, _ := hasher.Hash("Your data here")
    fmt.Println(result.Hash)
    // Output: "ch_a7b3c9d2e4f5..."
}`,

  rust: `use codexauth::CodexAuth;

fn main() {
    let hasher = CodexAuth::new()
        .algorithm("harmonic")
        .security_level("quantum-resistant")
        .build();

    // Generate a quantum-resistant hash
    let result = hasher.hash("Your data here").unwrap();
    println!("{}", result.hash);
    // Output: "ch_a7b3c9d2e4f5..."
}`
}

const languageLabels: Record<Language, { name: string; icon: string }> = {
  javascript: { name: 'JavaScript', icon: 'JS' },
  python: { name: 'Python', icon: 'PY' },
  go: { name: 'Go', icon: 'GO' },
  rust: { name: 'Rust', icon: 'RS' }
}

/**
 * QuickStartPanel - Interactive code examples for quick start
 */
export default function QuickStartPanel() {
  const [selectedLang, setSelectedLang] = useState<Language>('javascript')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExamples[selectedLang])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quick Start
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get up and running in minutes with our easy-to-use SDKs
            </p>
          </div>

          {/* Code Block */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
            {/* Language Tabs */}
            <div className="flex items-center gap-1 px-4 pt-4 border-b border-white/10 bg-[#161b22]">
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    selectedLang === lang
                      ? 'bg-[#0d1117] text-auth-primary border-t border-x border-white/10 -mb-px'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {languageLabels[lang].name}
                </button>
              ))}
              
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="ml-auto px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed font-mono">
                <code className="text-slate-300">
                  {codeExamples[selectedLang]}
                </code>
              </pre>
            </div>
          </div>

          {/* Install Commands */}
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InstallCommand
              language="npm"
              command="npm install @web3connected/codexauth-starter-kit"
            />
            <InstallCommand
              language="pip"
              command="pip install codexauth"
            />
            <InstallCommand
              language="go"
              command="go get github.com/web3connected/codexauth-go"
            />
            <InstallCommand
              language="cargo"
              command="cargo add codexauth"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InstallCommand({ language, command }: { language: string; command: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 group">
      <span className="text-xs text-auth-primary font-semibold uppercase">{language}</span>
      <code className="text-xs text-slate-400 truncate flex-1">{command}</code>
      <button
        onClick={handleCopy}
        className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
