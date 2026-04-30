import React from 'react'
import PageLayout from '@/components/layout/PageLayout'

export default function TechnicalDetails() {
  return (
    <PageLayout title="Technical Details" description="Deep dive into CodexHash's quantum-resistant algorithms">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Algorithm Overview</h2>
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
              <p className="text-slate-300 leading-relaxed mb-4">
                CodexHash implements physics-based hashing algorithms that are designed to resist attacks from both classical and quantum computers. Our approach combines:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Context-bound hashing with temporal integrity units (TIU)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Multi-dimensional entropy sources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Adaptive difficulty scaling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>256-1024 bit output lengths</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Security Properties</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Collision Resistance</h3>
                <p className="text-slate-300 text-sm">
                  Computationally infeasible to find two inputs that produce the same hash output, even with quantum computers.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Preimage Resistance</h3>
                <p className="text-slate-300 text-sm">
                  Given a hash output, it's impossible to determine the original input, providing strong one-way security.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Temporal Binding</h3>
                <p className="text-slate-300 text-sm">
                  Hashes are bound to specific time contexts, making replay attacks detectable.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Quantum Hardness</h3>
                <p className="text-slate-300 text-sm">
                  Algorithms resistant to Grover's and Shor's algorithms, maintaining security in the quantum era.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Performance</h2>
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">&lt;10ms</div>
                  <div className="text-sm text-slate-400">Hash Generation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">256-1024</div>
                  <div className="text-sm text-slate-400">Bit Strength</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">99%+</div>
                  <div className="text-sm text-slate-400">Quantum Resistant</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
