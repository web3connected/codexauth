import React from 'react'

export default function MainQuantumHashingContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Quantum-Resistant Hashing</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">Overview</h3>
            <p className="text-slate-300 leading-relaxed">
              CodexHash provides quantum-resistant hashing algorithms designed to protect your data 
              against future quantum computing attacks. Our implementation uses advanced cryptographic 
              techniques to ensure long-term security.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">Features</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>256-1024 bit hash outputs for maximum security</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Quantum-resistant algorithms based on physics principles</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Context-bound hashing with time-awareness</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>High-performance implementation with &lt;10ms generation time</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">Use Cases</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Data Integrity</h4>
                <p className="text-slate-300 text-sm">
                  Verify data hasn't been tampered with using quantum-safe hashes
                </p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Digital Signatures</h4>
                <p className="text-slate-300 text-sm">
                  Create secure digital signatures resistant to quantum attacks
                </p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Blockchain</h4>
                <p className="text-slate-300 text-sm">
                  Build quantum-resistant blockchain applications
                </p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Password Hashing</h4>
                <p className="text-slate-300 text-sm">
                  Store passwords with future-proof cryptographic security
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
