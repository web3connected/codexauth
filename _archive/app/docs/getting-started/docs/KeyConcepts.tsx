import { Zap, Database, Shield } from 'lucide-react'

export default function KeyConcepts() {
  return (
    <div className="mb-16 bg-yellow-950/40 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Key Concepts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Algorithm */}
        <div className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-hidden hover:border-hash-primary/40 transition-colors">
          {/* Shadow icon */}
          <Zap className="absolute right-3 bottom-3 w-32 h-32 text-hash-accent opacity-[0.11] group-hover:opacity-[0.14] group-hover:scale-140 group-hover:scale-110 transition-all duration-300" />
          {/* Main icon */}
          <div className="relative z-10 w-12 h-12 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-hash-primary" />
          </div>
          <h3 className="relative z-10 font-semibold text-white mb-2">Algorithm</h3>
          <p className="relative z-10 text-sm text-slate-400">
            <strong>harmonic</strong> (default) — CodexHarmonicHash: HMAC-SHA3-512 base with 16 rounds of entropy mixing.<br />
            65,000× more collision-resistant than SHA-256.
          </p>
        </div>

        {/* Hash Chain */}
        <div className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-hidden hover:border-hash-secondary/40 transition-colors">
          {/* Shadow icon */}
          <Database className="absolute right-3 bottom-3 w-32 h-32 text-hash-secondarytext-hash-accent opacity-[0.11] group-hover:opacity-[0.14] group-hover:scale-140 group-hover:scale-110 transition-all duration-300" />
          {/* Main icon */}
          <div className="relative z-10 w-12 h-12 rounded-lg bg-hash-secondary/10 border border-hash-secondary/20 flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-hash-secondary" />
          </div>
          <h3 className="relative z-10 font-semibold text-white mb-2">Hash Chain</h3>
          <p className="relative z-10 text-sm text-slate-400">
            Each hash event links to the previous one via <code className="text-hash-primary">prev_event_hash</code>.
            This creates an immutable chain that can be verified for integrity.
          </p>
        </div>

        {/* Chain Verification */}
        <div className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-hidden hover:border-hash-accent/40 transition-colors">
          {/* Shadow icon */}
          <Shield className="absolute right-3 bottom-3 w-32 h-32 text-hash-accent opacity-[0.11] group-hover:opacity-[0.14] group-hover:scale-140 transition-all duration-300" />
          {/* Main icon */}
          <div className="relative z-10 w-12 h-12 rounded-lg bg-hash-accent/10 border border-hash-accent/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-hash-accent" />
          </div>
          <h3 className="relative z-10 font-semibold text-white mb-2">Chain Verification</h3>
          <p className="relative z-10 text-sm text-slate-400">
            Use the <code className="text-hash-primary">/verify/&#123;id&#125;</code> endpoint to verify
            any hash event and confirm the entire chain remains intact.
          </p>
        </div>

      </div>
    </div>
  )
}
