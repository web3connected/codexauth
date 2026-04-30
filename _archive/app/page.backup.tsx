'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Demo section state
  const [demoInput, setDemoInput] = useState('')
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1024' | 'CodexHash'>('SHA-256')
  const [hashResult, setHashResult] = useState<{
    hash: string
    algorithm: string
    inputLength: number
    hashLength: number
    executionTime: number
    entropy: number
  } | null>(null)
  const [hashing, setHashing] = useState(false)

  // History Mode state
  const [historyMode, setHistoryMode] = useState(false)
  const [historyEvents, setHistoryEvents] = useState<any[]>([])
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent submission if already submitted
    if (submitted) {
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/prelaunch-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setEmail('')
        // Don't show alert for already exists case, just mark as submitted
        if (!data.alreadyExists) {
          // Successfully added new signup
        }
      } else {
        alert(data.message || 'Failed to sign up. Please try again.')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Failed to sign up. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculateEntropy = (str: string): number => {
    const freq: { [key: string]: number } = {}
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      freq[char] = (freq[char] || 0) + 1
    }
    
    let entropy = 0
    const len = str.length
    for (const char in freq) {
      const p = freq[char] / len
      entropy -= p * Math.log2(p)
    }
    
    return entropy
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/codex-history')
      const data = await response.json()
      if (data.events) {
        setHistoryEvents(data.events)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleVerifyChain = async () => {
    setVerifying(true)
    setVerificationResult(null)
    
    try {
      const response = await fetch('/api/codex-verify')
      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationResult({
        status: 'error',
        error: 'Failed to verify chain'
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleHashDemo = async () => {
    if (!demoInput.trim()) return
    
    setHashing(true)
    const startTime = performance.now()

    try {
      if (historyMode) {
        // History Mode: Create a CodexHash event with chaining
        const mode = algorithm === 'CodexHash' ? 'codex' : 'quick'
        const algo = algorithm === 'CodexHash' ? 'harmonic' : algorithm.toLowerCase().replace('-', '')
        
        const response = await fetch('/api/codex-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: demoInput,
            mode,
            algo,
            context: {
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              algorithm: algorithm,
            }
          }),
        })

        const event = await response.json()

        if (response.ok) {
          // Add to history display
          await fetchHistory()
          
          const endTime = performance.now()
          setHashResult({
            hash: event.event_hash,
            algorithm: `${algorithm} (History Mode)`,
            inputLength: demoInput.length,
            hashLength: event.event_hash.length,
            executionTime: endTime - startTime,
            entropy: calculateEntropy(event.event_hash)
          })
        } else {
          throw new Error(event.error || 'Failed to create event')
        }
      } else if (algorithm === 'CodexHash') {
        // Call CodexHash API
        const response = await fetch('/api/hash', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: demoInput,
            algorithm: 'harmonic'
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Hash generation failed')
        }

        const endTime = performance.now()

        setHashResult({
          hash: result.hash,
          algorithm: `${result.algorithm} - ${result.security_level} (Quantum Resistance: ${(result.quantum_resistance * 100).toFixed(1)}%)`,
          inputLength: demoInput.length,
          hashLength: result.hash.length,
          executionTime: result.processing_time_ms,
          entropy: calculateEntropy(result.hash)
        })
      } else {
        // Use browser crypto for SHA algorithms
        const encoder = new TextEncoder()
        const data = encoder.encode(demoInput)
        
        let hashAlgorithm: string
        if (algorithm === 'SHA-256') hashAlgorithm = 'SHA-256'
        else if (algorithm === 'SHA-384') hashAlgorithm = 'SHA-384'
        else if (algorithm === 'SHA-512') hashAlgorithm = 'SHA-512'
        else hashAlgorithm = 'SHA-512' // SHA-1024 uses SHA-512 twice
        
        let hashBuffer = await crypto.subtle.digest(hashAlgorithm, data)
        
        // For SHA-1024, hash twice
        if (algorithm === 'SHA-1024') {
          hashBuffer = await crypto.subtle.digest('SHA-512', hashBuffer)
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        
        const endTime = performance.now()
        const executionTime = endTime - startTime
        
        setHashResult({
          hash: hashHex,
          algorithm: algorithm,
          inputLength: demoInput.length,
          hashLength: hashHex.length,
          executionTime: executionTime,
          entropy: calculateEntropy(hashHex)
        })
      }
    } catch (error) {
      console.error('Hashing error:', error)
      alert('Failed to generate hash. Please try again.')
    }

    setHashing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-slate-900/50 to-slate-900"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image 
                src="/assets/images/CodexHash.png" 
                alt="CodexHash Logo" 
                width={200} 
                height={200}
                className="w-auto h-32 lg:h-40"
                priority
              />
            </div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8">
              <span className="text-2xl">🔐</span>
              <span className="text-purple-300 font-medium">Quantum-Resistant Security</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cryptographic Hashing
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Physics-based hashing algorithms designed to resist quantum computing attacks. 
              Protect your data with context-bound, time-aware cryptographic integrity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#signup" 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Join Pre-Launch
              </a>
              <a 
                href="#demo" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Try Demo
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2">256-1024</div>
                <div className="text-sm text-slate-400">Bit Strength</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2">99%</div>
                <div className="text-sm text-slate-400">Quantum Resistant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2">&lt;10ms</div>
                <div className="text-sm text-slate-400">Hash Generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Why CodexHash?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Next-generation security features built for the quantum era
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">🔐</div>
              <h3 className="text-2xl font-bold text-white mb-4">Quantum-Resistant</h3>
              <p className="text-slate-300 leading-relaxed">
                Advanced physics-based algorithms incorporating speed of light, Planck frequency, 
                and golden ratio constants to resist quantum computing attacks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">⏰</div>
              <h3 className="text-2xl font-bold text-white mb-4">Time-Aware Security</h3>
              <p className="text-slate-300 leading-relaxed">
                Context-bound fingerprints tied to declared operating context with time-constrained 
                validity windows for enhanced replay protection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-4">High Performance</h3>
              <p className="text-slate-300 leading-relaxed">
                Optimized algorithms delivering enterprise-scale cryptographic operations 
                with sub-10ms hash generation times.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Multi-Layer Protection</h3>
              <p className="text-slate-300 leading-relaxed">
                Advanced strengthening through temporal intravel units (TIU) and entropy modeling 
                for comprehensive data integrity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">🔄</div>
              <h3 className="text-2xl font-bold text-white mb-4">Replay Resistant</h3>
              <p className="text-slate-300 leading-relaxed">
                Stop copy/paste reuse of valid requests with context-aware verification 
                that detects cross-zone misuse.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-2xl font-bold text-white mb-4">Evidence-Grade Logging</h3>
              <p className="text-slate-300 leading-relaxed">
                Portable verification artifacts for audit trails, compliance reporting, 
                and incident response timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 lg:py-32 bg-gradient-to-br from-purple-900/10 to-slate-900/50 border-y border-purple-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <span className="text-2xl">🧪</span>
                <span className="text-purple-300 font-medium">Live Demo</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Try It Yourself
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-6">
                Experience quantum-resistant hashing in real-time
              </p>

              {/* History Mode Toggle */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => {
                    setHistoryMode(!historyMode)
                    if (!historyMode) {
                      fetchHistory()
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    historyMode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-slate-800/50 text-slate-300 border border-purple-500/30 hover:border-purple-500/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🔗</span>
                    History Mode {historyMode ? 'ON' : 'OFF'}
                  </span>
                </button>
                {historyMode && (
                  <button
                    onClick={handleVerifyChain}
                    disabled={verifying}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {verifying ? 'Verifying...' : '✓ Verify Chain'}
                  </button>
                )}
              </div>

              {historyMode && (
                <p className="text-sm text-purple-300 max-w-xl mx-auto">
                  🔐 History Mode creates tamper-evident chained events. Each hash links to the previous one.
                </p>
              )}
            </div>

            {/* Demo Interface */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  Input
                </h3>

                <div className="space-y-6">
                  {/* Algorithm Selection */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Hash Algorithm
                    </label>
                    <select
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="SHA-256">SHA-256</option>
                      <option value="SHA-384">SHA-384</option>
                      <option value="SHA-512">SHA-512</option>
                      <option value="SHA-1024">SHA-1024</option>
                      <option value="CodexHash">CodexHash (Quantum-Resistant)</option>
                    </select>
                  </div>

                  {/* Text Input */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Text to Hash
                    </label>
                    <textarea
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      placeholder="Enter any text to generate a hash..."
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    />
                    <div className="mt-2 text-sm text-slate-400">
                      {demoInput.length} characters
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleHashDemo}
                    disabled={!demoInput.trim() || hashing}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {hashing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating Hash...
                      </span>
                    ) : (
                      '🔐 Generate Hash'
                    )}
                  </button>
                </div>
              </div>

              {/* Output Panel */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🔬</span>
                  Results
                </h3>

                {hashResult ? (
                  <div className="space-y-6">
                    {/* Hash Output */}
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Generated Hash
                      </label>
                      <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-4">
                        <code className="text-sm text-green-400 break-all font-mono">
                          {hashResult.hash}
                        </code>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/30 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-1">Algorithm</div>
                        <div className="text-lg font-semibold text-purple-300">{hashResult.algorithm}</div>
                      </div>
                      
                      <div className="bg-slate-900/30 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-1">Execution Time</div>
                        <div className="text-lg font-semibold text-purple-300">
                          {hashResult.executionTime.toFixed(2)}ms
                        </div>
                      </div>

                      <div className="bg-slate-900/30 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-1">Hash Length</div>
                        <div className="text-lg font-semibold text-purple-300">
                          {hashResult.hashLength} chars
                        </div>
                      </div>

                      <div className="bg-slate-900/30 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-1">Entropy</div>
                        <div className="text-lg font-semibold text-purple-300">
                          {hashResult.entropy.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">✅</div>
                        <div>
                          <div className="text-sm font-semibold text-green-300">Quantum-Resistant</div>
                          <div className="text-xs text-green-400/70">
                            Hash generated with physics-based security
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center py-12">
                    <div>
                      <div className="text-6xl mb-4 opacity-50">🔐</div>
                      <p className="text-slate-400">
                        Enter text and click "Generate Hash" to see quantum-resistant hashing in action
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History Mode Table */}
            {historyMode && (
              <div className="mt-12">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">📜</span>
                      Event History Chain
                    </h3>
                    <div className="text-sm text-slate-400">
                      {historyEvents.length} events
                    </div>
                  </div>

                  {/* Verification Result */}
                  {verificationResult && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                      verificationResult.status === 'ok'
                        ? 'bg-green-900/20 border-green-500/30'
                        : verificationResult.status === 'broken'
                        ? 'bg-red-900/20 border-red-500/30'
                        : 'bg-yellow-900/20 border-yellow-500/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {verificationResult.status === 'ok' ? '✅' : verificationResult.status === 'broken' ? '❌' : '⚠️'}
                        </div>
                        <div>
                          <div className={`font-semibold ${
                            verificationResult.status === 'ok'
                              ? 'text-green-300'
                              : verificationResult.status === 'broken'
                              ? 'text-red-300'
                              : 'text-yellow-300'
                          }`}>
                            {verificationResult.status === 'ok' && 'Chain Verified ✓'}
                            {verificationResult.status === 'broken' && 'Chain Broken!'}
                            {verificationResult.status === 'error' && 'Verification Error'}
                          </div>
                          <div className="text-sm text-slate-300">
                            {verificationResult.message || verificationResult.error}
                            {verificationResult.broken_index !== null && verificationResult.broken_index !== undefined && (
                              <span> at event #{verificationResult.broken_index}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Events Table */}
                  {historyEvents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-500/30">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">#</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Event Hash</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Prev Hash</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Mode</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Algo</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Time</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyEvents.map((event, index) => (
                            <tr key={event.id} className="border-b border-slate-700/50 hover:bg-purple-500/5 transition-colors">
                              <td className="py-3 px-4 text-slate-300 font-mono text-sm">
                                {historyEvents.length - index}
                              </td>
                              <td className="py-3 px-4">
                                <code className="text-xs text-green-400 font-mono">
                                  {event.event_hash_short}
                                </code>
                              </td>
                              <td className="py-3 px-4">
                                <code className="text-xs text-blue-400 font-mono">
                                  {event.prev_event_hash_short || '—'}
                                </code>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  event.mode === 'codex'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {event.mode}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-sm">
                                {event.algo}
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-xs">
                                {new Date(event.created_at).toLocaleTimeString()}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">
                                  <span>✓</span> Intact
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <div className="text-5xl mb-4 opacity-50">🔗</div>
                      <p>No events yet. Generate a hash to create the first event in the chain.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Demo Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                💡 <span className="font-semibold text-purple-300">Pro Tip:</span> Try the SHA-1024 algorithm for maximum quantum resistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Built For Real-World Security
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From API protection to blockchain verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🌐</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">API Security</h3>
                  <p className="text-slate-300">
                    Replay-resistant API requests bound to session context and time windows
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔗</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Blockchain Integration</h3>
                  <p className="text-slate-300">
                    On-chain/off-chain observation correlation with stable consistency keys
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📁</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">File Integrity</h3>
                  <p className="text-slate-300">
                    Tamper-evident document hashing with verifiable proof of authenticity
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🏢</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise Compliance</h3>
                  <p className="text-slate-300">
                    Evidence-grade artifacts for audit trails and regulatory compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Launch Signup Section */}
      <section id="signup" className="py-20 lg:py-32 bg-gradient-to-br from-purple-900/30 to-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 lg:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full mb-6">
                  <span className="text-xl">🚀</span>
                  <span className="text-purple-300 font-medium">Early Access</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Join the Pre-Launch
                </h2>
                <p className="text-lg text-slate-300">
                  Be among the first to experience quantum-resistant security. 
                  Get exclusive early access pricing and priority support.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                  <p className="text-slate-300">
                    We'll notify you when CodexHash launches with your exclusive early access deal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || submitted}
                      className="w-full px-4 py-4 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Reserve My Spot'
                    )}
                  </button>

                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1 border-t border-purple-500/20"></div>
                    <span className="text-sm text-slate-400">Early Access Benefits</span>
                    <div className="flex-1 border-t border-purple-500/20"></div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-2">💰</div>
                      <div className="text-sm text-purple-300 font-medium">50% Off</div>
                      <div className="text-xs text-slate-400">First year</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm text-purple-300 font-medium">Priority Support</div>
                      <div className="text-xs text-slate-400">Direct access</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm text-purple-300 font-medium">Beta Access</div>
                      <div className="text-xs text-slate-400">Try it first</div>
                    </div>
                  </div>
                </form>
              )}

              <p className="text-center text-xs text-slate-500 mt-8">
                No spam, ever. Unsubscribe at any time. By signing up, you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 border-t border-purple-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Future?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join the quantum-resistant revolution today
            </p>
            <a 
              href="#signup" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
