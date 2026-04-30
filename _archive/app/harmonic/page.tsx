"use client";

import Link from "next/link";
import { Atom, Clock, Shield, Zap, GitBranch, Activity, Calculator, Waves } from "lucide-react";

const physicsConstants = [
  { symbol: "c", name: "Speed of Light", value: "299,792,458 m/s", role: "Base frequency calculation" },
  { symbol: "AU", name: "Astronomical Unit", value: "149,597,870,700 m", role: "Harmonic zone anchoring" },
  { symbol: "tₚ", name: "Planck Time", value: "5.391 × 10⁻⁴⁴ s", role: "Quantum time granularity" },
  { symbol: "fₚ", name: "Planck Frequency", value: "1.855 × 10⁴³ Hz", role: "Inverse pressure modelling" },
  { symbol: "φ", name: "Golden Ratio", value: "1.618033988…", role: "Harmonic transformation" },
  { symbol: "e", name: "Euler's Number", value: "2.718281828…", role: "Exponential entropy scaling" },
];

const steps = [
  {
    icon: Waves,
    title: "1. Harmonic Frequency Derivation",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    description:
      "The input string is transformed into a harmonic frequency using the speed of light (c) and the Astronomical Unit (AU). This grounds the hash in physical constants — not arbitrary mathematical operations.",
    formula: "f = (c / AU) × input_entropy",
  },
  {
    icon: Clock,
    title: "2. Time Integrity Unit (TIU) Binding",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    description:
      "A TIU (Time Integrity Unit) — a floating-point value between 0 and 1 derived from the current time — is embedded into every hash. This creates a temporal fingerprint that makes replay attacks computationally infeasible.",
    formula: "tiu = (unix_ms × φ) mod 1",
  },
  {
    icon: Calculator,
    title: "3. Iterative Harmonic Rounds",
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    description:
      "Each iteration applies a non-linear harmonic transformation using the Golden Ratio (φ) and Euler's number (e). More rounds = exponentially more entropy. Default is 16 rounds; military-grade uses 64–128.",
    formula: "H(n) = φ × e^H(n−1) × sin(f × tiu × n)",
  },
  {
    icon: GitBranch,
    title: "4. Tamper-Evident Chaining",
    color: "text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    description:
      "Each hash event is linked to the previous event hash, forming a cryptographic chain. Modifying any past record invalidates all subsequent hashes — making the entire history tamper-evident.",
    formula: "event_hash = SHA256(payload_hash + prev_event_hash + context)",
  },
  {
    icon: Shield,
    title: "5. Quantum Resistance",
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    description:
      "Classical quantum attacks (Grover's algorithm) reduce security by √n. Because CodexHarmonic operates in continuous harmonic space anchored to physical constants, it resists both Grover and Shor attacks. Estimated protection: 50–200+ years.",
    formula: "Q_resistance = 1 − (1 / (rounds × φ × entropy))",
  },
];

const comparisons = [
  { feature: "Physics-based constants", codex: true, sha256: false, bcrypt: false },
  { feature: "Temporal binding (TIU)", codex: true, sha256: false, bcrypt: false },
  { feature: "Quantum-resistant design", codex: true, sha256: false, bcrypt: false },
  { feature: "Tamper-evident chaining", codex: true, sha256: false, bcrypt: false },
  { feature: "Variable harmonic rounds", codex: true, sha256: false, bcrypt: true },
  { feature: "Configurable security tier", codex: true, sha256: false, bcrypt: true },
  { feature: "Entropy scoring", codex: true, sha256: false, bcrypt: false },
];

function Check() {
  return <span className="text-green-400 font-bold">✓</span>;
}
function Cross() {
  return <span className="text-slate-600">✗</span>;
}

export default function HarmonicPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-hash-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-6 py-20 relative">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Harmonic Hashing</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center">
                <Atom className="w-6 h-6 text-hash-primary" />
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-hash-primary/10 border border-hash-primary/20 text-hash-primary">
                The Technology
              </span>
            </div>

            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Harmonic &amp; Quantum<br />
              <span className="text-hash-primary">Hashing Explained</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              CodexHash does not use arbitrary mathematical transforms. Every hash is derived
              from <strong className="text-white">universal physical constants</strong> — the speed of light,
              the Astronomical Unit, Planck time — combined with a temporal fingerprint that makes
              every hash unique to the moment it was created.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-5xl space-y-20">

        {/* What is Harmonic Hashing */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">What is Harmonic Hashing?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <Waves className="w-8 h-8 text-hash-primary mb-4" />
              <h3 className="text-white font-semibold text-lg mb-3">Physics-Grounded Transforms</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Traditional hashing (SHA-256, bcrypt) uses purely mathematical bit operations.
                CodexHarmonic maps input data to a <em>harmonic frequency domain</em> anchored to
                real-world physical constants. The result is a hash space that cannot be brute-forced
                without simulating the physics itself.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <Activity className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-3">Time as a Security Layer</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The Time Integrity Unit (TIU) embeds the exact moment of creation into the hash.
                Even if an attacker obtains the input and algorithm, they cannot reproduce the hash
                without knowing the precise TIU — which changes continuously and is stored
                separately from the hash itself.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-slate-400 mb-10">Five stages transform raw input into a quantum-resistant hash.</p>
          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className={`border ${step.border} ${step.bg} rounded-xl p-6`}>
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.description}</p>
                      <div className="bg-black/50 rounded-lg px-4 py-2.5">
                        <code className={`font-mono text-sm ${step.color}`}>{step.formula}</code>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Physics Constants */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-2">Physics Constants Used</h2>
          <p className="text-slate-400 mb-8">These immutable universal constants form the foundation of every CodexHash.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {physicsConstants.map((c) => (
              <div key={c.symbol} className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-hash-primary font-mono">{c.symbol}</span>
                  <span className="text-white font-medium text-sm">{c.name}</span>
                </div>
                <div className="font-mono text-xs text-slate-300 mb-2">{c.value}</div>
                <div className="text-xs text-slate-500">{c.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Tiers */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-2">Security Tiers</h2>
          <p className="text-slate-400 mb-8">Choose the number of harmonic rounds based on your security requirements.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { tier: "Basic", rounds: 4, label: "Dev / Testing", color: "border-slate-600", protection: "~50 years" },
              { tier: "Standard", rounds: 8, label: "Consumer Apps", color: "border-blue-500/40", protection: "~80 years" },
              { tier: "Enterprise", rounds: 16, label: "Business (Default)", color: "border-purple-500/40", protection: "~120 years" },
              { tier: "Military", rounds: "64–128", label: "Critical Infrastructure", color: "border-red-500/40", protection: "200+ years" },
            ].map((t) => (
              <div key={t.tier} className={`border ${t.color} bg-slate-900/50 rounded-xl p-5 text-center`}>
                <div className="text-white font-bold text-lg mb-1">{t.tier}</div>
                <div className="text-hash-primary font-mono text-2xl font-bold mb-2">{t.rounds}</div>
                <div className="text-xs text-slate-500 mb-1">rounds</div>
                <div className="text-slate-400 text-xs mb-3">{t.label}</div>
                <div className="text-xs text-green-400 font-medium">{t.protection} quantum protection</div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">CodexHarmonic vs Traditional Algorithms</h2>
          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-slate-300">
              <div className="col-span-1">Feature</div>
              <div className="text-center text-hash-primary">CodexHarmonic</div>
              <div className="text-center">SHA-256</div>
              <div className="text-center">bcrypt</div>
            </div>
            {comparisons.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 px-6 py-3.5 text-sm ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                <div className="text-slate-300 col-span-1">{row.feature}</div>
                <div className="text-center">{row.codex ? <Check /> : <Cross />}</div>
                <div className="text-center">{row.sha256 ? <Check /> : <Cross />}</div>
                <div className="text-center">{row.bcrypt ? <Check /> : <Cross />}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-r from-hash-primary/10 via-purple-500/10 to-hash-primary/10 border border-hash-primary/20 rounded-2xl p-10 text-center">
            <Zap className="w-10 h-10 text-hash-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Ready to use it?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Start hashing with physics-backed quantum resistance in minutes using the JavaScript SDK or the REST API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sdks/javascript"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-hash-primary text-white font-semibold hover:bg-hash-primary/90 transition-colors"
              >
                JavaScript SDK
              </Link>
              <Link
                href="/api-explorer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-600 text-white font-medium hover:border-slate-400 transition-colors"
              >
                API Explorer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
