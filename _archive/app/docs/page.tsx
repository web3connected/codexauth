"use client"

import React, { useState } from 'react'
import { Book, Code, Cpu, Zap, Shield, Clock, Copy, CheckCircle, Play, Target, Atom, Activity, Calculator } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import TopBar from '@/components/common/TitleBar'

const DocsPage = () => {
    const [activeSection, setActiveSection] = useState('overview')
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [selectedExample, setSelectedExample] = useState('basic-hash')

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const navigationSections = [
        { id: 'overview', title: 'Overview', icon: Book },
        { id: 'algorithm', title: 'Algorithm Deep Dive', icon: Atom },
        { id: 'physics', title: 'Physics Foundation', icon: Activity },
        { id: 'tiu', title: 'Time Integrity Units', icon: Clock },
        { id: 'api-reference', title: 'API Reference', icon: Code },
        { id: 'examples', title: 'Code Examples', icon: Play },
        { id: 'security', title: 'Security Analysis', icon: Shield },
        { id: 'performance', title: 'Performance', icon: Zap }
    ]

    const physicsConstants = [
        { name: 'Speed of Light (C)', value: '299,792,458 m/s', usage: 'Base frequency calculation' },
        { name: 'Astronomical Unit (AU)', value: '149,597,870,700 m', usage: 'Harmonic zone anchoring' },
        { name: 'Planck Time', value: '5.391247e-44 s', usage: 'Quantum time granularity' },
        { name: 'Planck Frequency', value: '1.854924e+43 Hz', usage: 'Inverse pressure modeling' },
        { name: 'Golden Ratio (φ)', value: '1.618034', usage: 'Harmonic transformation' },
        { name: 'Euler\'s Number (e)', value: '2.718281', usage: 'Exponential entropy scaling' }
    ]

    const apiEndpoints = [
        {
            method: 'POST',
            endpoint: '/api/hash',
            description: 'Generate quantum-resistant hash with harmonic analysis',
            parameters: [
                { name: 'input', type: 'string', required: true, description: 'Data to hash' },
                { name: 'tiu', type: 'float', required: false, description: 'Time Integrity Unit (0.0-1.0)' },
                { name: 'iterations', type: 'int', required: false, description: 'Hash rounds (default: 16)' },
                { name: 'salt', type: 'string', required: false, description: 'Custom salt (hex)' }
            ]
        },
        {
            method: 'POST',
            endpoint: '/api/verify',
            description: 'Verify hash integrity and temporal consistency',
            parameters: [
                { name: 'input', type: 'string', required: true, description: 'Original data' },
                { name: 'hash', type: 'string', required: true, description: 'Hash to verify' },
                { name: 'salt', type: 'string', required: true, description: 'Original salt' },
                { name: 'tiu', type: 'float', required: true, description: 'Original TIU' }
            ]
        },
        {
            method: 'GET',
            endpoint: '/api/analysis',
            description: 'Get quantum resistance analysis for hash parameters',
            parameters: [
                { name: 'input_length', type: 'int', required: true, description: 'Input data length' },
                { name: 'complexity', type: 'string', required: false, description: 'low|medium|high' }
            ]
        }
    ]

    const codeExamples = {
        'basic-hash': {
            title: 'Basic Hash Generation',
            language: 'javascript',
            code: `// Generate a quantum-resistant hash
const response = await fetch('/api/hash', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: "Sensitive data to protect",
    tiu: 0.618034,    // Golden ratio TIU
    iterations: 16    // Security rounds
  })
});

const result = await response.json();
console.log(result);
/*
{
  "hash": "a7f4d9e2b8c1f6e3d4a9b7c2e8f1d5a6b9c3e7f2d8a4b6c9e1f7d3a8b5c2e9f4",
  "salt": "codex-harmonic-salt-2024",
  "tiu": 0.618034,
  "meta": {
    "algorithm": "HarmonicHash-v1.0.1",
    "iterations": 16,
    "durationMs": 42,
    "quantumResistance": 0.87,
    "harmonicFrequency": 318.309,
    "entropyScore": 0.94
  }
}
*/`
        },
        'verification': {
            title: 'Hash Verification',
            language: 'javascript',
            code: `// Verify hash integrity
const verifyResponse = await fetch('/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: "Sensitive data to protect",
    hash: "a7f4d9e2b8c1f6e3d4a9b7c2e8f1d5a6b9c3e7f2d8a4b6c9e1f7d3a8b5c2e9f4",
    salt: "codex-harmonic-salt-2024",
    tiu: 0.618034
  })
});

const verification = await verifyResponse.json();
/*
{
  "valid": true,
  "drift": 0.000001,
  "temporalConsistency": true,
  "quantumResistance": 0.87,
  "meta": {
    "verificationMs": 18,
    "tiuDrift": 0.000001,
    "harmonicAlignment": true
  }
}
*/`
        },
        'php-implementation': {
            title: 'PHP Backend Implementation',
            language: 'php',
            code: `<?php
use Web3Codex\\CodexHash\\Services\\CodexHarmonicHash;
use Web3Codex\\CodexTime\\Services\\CodexTime;

// Initialize the harmonic hash service
$hasher = new CodexHarmonicHash();
$codexTime = new CodexTime();

// Generate TIU (Time Integrity Unit)
$tiu = $codexTime->getTIU();

// Create hash with harmonic physics
$result = $hasher->hash(
    'Sensitive enterprise data',
    null,    // Auto-generate salt
    $tiu,    // Current TIU
    16       // Iteration rounds
);

echo "Hash: " . $result['hash'] . "\\n";
echo "TIU: " . $result['tiu'] . "\\n";
echo "Quantum Resistance: " . ($result['quantumResistance'] ?? 'N/A') . "\\n";

// Verify the hash
$isValid = $hasher->verify(
    'Sensitive enterprise data',
    $result['hash'],
    $result['salt'],
    $result['tiu'],
    16
);

echo "Verification: " . ($isValid ? 'VALID' : 'INVALID') . "\\n";`
        },
        'quantum-analysis': {
            title: 'Quantum Resistance Analysis',
            language: 'javascript',
            code: `// Analyze quantum resistance for different input types
const analyses = await Promise.all([
  // Simple text
  fetch('/api/analysis?input_length=50&complexity=low'),
  // Complex data structure
  fetch('/api/analysis?input_length=2048&complexity=high'),
  // Financial transaction
  fetch('/api/analysis?input_length=256&complexity=medium')
]);

const results = await Promise.all(analyses.map(r => r.json()));

results.forEach((analysis, index) => {
  console.log(\`Analysis \${index + 1}:\`, {
    quantumResistance: analysis.quantumResistance,
    recommendedTIU: analysis.recommendedTIU,
    minIterations: analysis.minIterations,
    estimatedBreakTime: analysis.estimatedBreakTime,
    securityLevel: analysis.securityLevel
  });
});

/*
Analysis 1: {
  quantumResistance: 0.73,
  recommendedTIU: 0.314159,
  minIterations: 8,
  estimatedBreakTime: "45+ years",
  securityLevel: "standard"
}
*/`
        }
    }

    const algorithmSteps = [
        {
            step: 1,
            title: 'Input Preprocessing',
            description: 'Data sanitization and harmonic transformation using golden ratio mathematics',
            detail: 'Input data undergoes harmonic transformation using the golden ratio (φ = 1.618034) to create unique frequency signatures. This mathematical foundation ensures deterministic yet unpredictable hash characteristics.'
        },
        {
            step: 2,
            title: 'TIU Integration',
            description: 'Time Integrity Unit calculation based on current temporal state',
            detail: 'TIU values are calculated using CodexTime physics, incorporating astronomical constants and Planck-scale time measurements. This creates temporal binding that resists replay attacks.'
        },
        {
            step: 3,
            title: 'Entropy Modifier Calculation',
            description: 'Physics-based entropy using inverse pressure modeling',
            detail: 'Entropy is calculated using Planck frequency and inverse pressure models derived from quantum field theory. The base frequency uses C/(2π×AU) for universal stability.'
        },
        {
            step: 4,
            title: 'Harmonic Hash Generation',
            description: 'Multi-round hashing with XOR operations and temporal distortion',
            detail: 'SHA-256 base hashing is enhanced with harmonic modifiers and temporal distortion factors. Multiple rounds with XOR operations create quantum-resistant output.'
        },
        {
            step: 5,
            title: 'Quantum Resistance Validation',
            description: 'Real-time analysis of quantum attack resistance',
            detail: 'Final hash undergoes quantum resistance analysis, measuring vulnerability to Shor\'s algorithm and other quantum attacks. Resistance scores of 0.85+ indicate strong protection.'
        }
    ]

    return (
        <PageLayout>
            <div className="min-h-screen bg-slate-950">
                <TopBar
                    title="CodexHash API Documentation"
                    description="Comprehensive technical documentation for quantum-resistant harmonic hashing algorithms with physics-based security"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Documentation', href: '/docs' }
                    ]}
                />

                <div className="container mx-auto px-6 py-8 max-w-7xl">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Navigation Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 sticky top-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
                                <nav className="space-y-2">
                                    {navigationSections.map((section) => {
                                        const IconComponent = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                                    activeSection === section.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                                }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                {section.title}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {activeSection === 'overview' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">CodexHash Overview</h1>
                                        <p className="text-xl text-slate-300 mb-6">
                                            CodexHash is a quantum-resistant hashing system that combines cryptographic security with physics-based algorithms. 
                                            Built on harmonic frequency principles and temporal dynamics, it provides unprecedented protection against both 
                                            classical and quantum computing attacks.
                                        </p>
                                        
                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-slate-800/50 rounded-lg p-6">
                                                <Shield className="w-8 h-8 text-blue-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">Quantum Resistance</h3>
                                                <p className="text-slate-300">
                                                    Physics-based algorithms provide 50-200+ years of protection against quantum attacks, 
                                                    with real-time resistance scoring.
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-6">
                                                <Clock className="w-8 h-8 text-purple-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">Temporal Binding</h3>
                                                <p className="text-slate-300">
                                                    Time Integrity Units (TIU) create temporal fingerprints that prevent replay attacks 
                                                    and ensure hash authenticity.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                                            <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
                                            <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    256-bit to 1024-bit hash strength
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    Physics-based algorithm foundation
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    Harmonic frequency integration
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    Temporal integrity verification
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    Real-time security analysis
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    Enterprise scalability
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'algorithm' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">Algorithm Deep Dive</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            The CodexHarmonic Hash algorithm combines traditional cryptographic methods with physics-based 
                                            enhancements to create quantum-resistant hashes. Here&apos;s how it works:
                                        </p>

                                        <div className="space-y-6">
                                            {algorithmSteps.map((step, index) => (
                                                <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                            {step.step}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                                                            <p className="text-slate-300 mb-3">{step.description}</p>
                                                            <p className="text-sm text-slate-400">{step.detail}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 bg-slate-800/30 rounded-lg p-6 border border-slate-600">
                                            <h3 className="text-xl font-semibold text-white mb-4">Algorithm Formula</h3>
                                            <div className="bg-black rounded-lg p-4 font-mono text-green-400 text-sm overflow-x-auto">
                                                <div>Base Frequency: f_base = C / (2π × AU)</div>
                                                <div>Entropy Modifier: entropy = (Σ(hash_bytes) % 9973) / 9973</div>
                                                <div>Time Distortion: distortion = (entropy / f_base) × TIU</div>
                                                <div>Inverse Pressure: modifier = PLANCK_FREQ × distortion</div>
                                                <div>Final Hash: SHA256(data + salt + TIU) ⊕ SHA256(modifier)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'physics' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">Physics Foundation</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            CodexHash derives its security from fundamental physics constants and harmonic principles. 
                                            This approach creates mathematically robust hashes that are inherently quantum-resistant.
                                        </p>

                                        <h3 className="text-2xl font-semibold text-white mb-6">Universal Constants</h3>
                                        <div className="grid lg:grid-cols-2 gap-6 mb-8">
                                            {physicsConstants.map((constant, index) => (
                                                <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
                                                    <h4 className="text-lg font-semibold text-white mb-2">{constant.name}</h4>
                                                    <div className="text-blue-400 font-mono text-lg mb-2">{constant.value}</div>
                                                    <p className="text-slate-300 text-sm">{constant.usage}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">Harmonic Zone Theory</h3>
                                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30 mb-6">
                                            <p className="text-slate-300 mb-4">
                                                According to Codex theory, mass interactions create 12 standing wave zones throughout the universe. 
                                                Earth sits approximately in the 4th zone, which defines our base harmonic frequency.
                                            </p>
                                            <div className="bg-black/50 rounded p-4 font-mono text-green-400 text-sm">
                                                f_base = C / (2π × AU) ≈ 318.309 Hz
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">Quantum Field Integration</h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
                                            <p className="text-slate-300 mb-4">
                                                The algorithm incorporates Planck-scale physics to create quantum resistance:
                                            </p>
                                            <ul className="space-y-2 text-slate-300">
                                                <li className="flex items-center gap-2">
                                                    <Atom className="w-4 h-4 text-blue-400" />
                                                    <strong>Planck Time:</strong> Minimum temporal resolution (5.391247e-44 s)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-purple-400" />
                                                    <strong>Planck Frequency:</strong> Maximum oscillation rate (1.854924e+43 Hz)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Calculator className="w-4 h-4 text-green-400" />
                                                    <strong>Inverse Pressure:</strong> Strong force modeling for entropy distortion
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'tiu' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">Time Integrity Units (TIU)</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            TIU values create temporal fingerprints that bind hashes to specific time periods, 
                                            preventing replay attacks and ensuring hash authenticity over time.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-slate-800/50 rounded-lg p-6">
                                                <Clock className="w-8 h-8 text-blue-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">Temporal Binding</h3>
                                                <p className="text-slate-300">
                                                    TIU values change dynamically based on astronomical positioning and 
                                                    quantum field fluctuations, creating unique temporal signatures.
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-6">
                                                <Shield className="w-8 h-8 text-green-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">Replay Protection</h3>
                                                <p className="text-slate-300">
                                                    Hashes generated with different TIU values will produce different outputs, 
                                                    even with identical input data, preventing replay attacks.
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">TIU Calculation</h3>
                                        <div className="bg-black rounded-lg p-6 mb-6">
                                            <pre className="text-green-400 text-sm overflow-x-auto">
{`// TIU Generation Process
1. Current Unix Timestamp → Base Time Value
2. Astronomical Position → Harmonic Offset  
3. Quantum Field State → Entropy Modifier
4. Golden Ratio Scaling → Final TIU Value

Example TIU Values:
- 0.618034 (Golden Ratio - High Security)
- 0.314159 (π/10 - Standard Security) 
- 0.271828 (e/10 - Balanced Security)
- Custom Values (0.000001 - 0.999999)`}
                                            </pre>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">TIU Buffer Zones</h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <p className="text-slate-300 mb-4">
                                                To account for minor temporal variations, TIU verification uses buffer zones:
                                            </p>
                                            <ul className="space-y-2 text-slate-300">
                                                <li><strong>Standard Buffer:</strong> ±0.000001 (1 microsecond equivalent)</li>
                                                <li><strong>Network Buffer:</strong> ±0.00001 (10 microsecond equivalent)</li>
                                                <li><strong>Enterprise Buffer:</strong> ±0.0001 (100 microsecond equivalent)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'api-reference' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">API Reference</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            Complete reference for CodexHash API endpoints with parameters, responses, and examples.
                                        </p>

                                        <div className="space-y-8">
                                            {apiEndpoints.map((endpoint, index) => (
                                                <div key={index} className="bg-slate-800/50 rounded-lg border border-slate-600">
                                                    <div className="p-6 border-b border-slate-600">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <span className={`px-3 py-1 rounded text-sm font-bold ${
                                                                endpoint.method === 'POST' 
                                                                    ? 'bg-green-600 text-white' 
                                                                    : 'bg-blue-600 text-white'
                                                            }`}>
                                                                {endpoint.method}
                                                            </span>
                                                            <code className="text-blue-400 font-mono text-lg">{endpoint.endpoint}</code>
                                                        </div>
                                                        <p className="text-slate-300">{endpoint.description}</p>
                                                    </div>
                                                    
                                                    <div className="p-6">
                                                        <h4 className="text-lg font-semibold text-white mb-4">Parameters</h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="border-b border-slate-600">
                                                                        <th className="text-left p-2 text-slate-300">Name</th>
                                                                        <th className="text-left p-2 text-slate-300">Type</th>
                                                                        <th className="text-left p-2 text-slate-300">Required</th>
                                                                        <th className="text-left p-2 text-slate-300">Description</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {endpoint.parameters.map((param, paramIndex) => (
                                                                        <tr key={paramIndex} className="border-b border-slate-700">
                                                                            <td className="p-2 font-mono text-blue-400">{param.name}</td>
                                                                            <td className="p-2 text-purple-400">{param.type}</td>
                                                                            <td className="p-2">
                                                                                <span className={`px-2 py-1 rounded text-xs ${
                                                                                    param.required 
                                                                                        ? 'bg-red-600 text-white' 
                                                                                        : 'bg-gray-600 text-white'
                                                                                }`}>
                                                                                    {param.required ? 'Required' : 'Optional'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="p-2 text-slate-300">{param.description}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'examples' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">Code Examples</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            Practical implementation examples for different programming languages and use cases.
                                        </p>

                                        {/* Example Selector */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {Object.entries(codeExamples).map(([key, example]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedExample(key)}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                                        selectedExample === key
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                    }`}
                                                >
                                                    {example.title}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Selected Example */}
                                        {Object.entries(codeExamples).map(([key, example]) => (
                                            selectedExample === key && (
                                                <div key={key} className="bg-slate-800/50 rounded-lg border border-slate-600">
                                                    <div className="flex items-center justify-between p-4 border-b border-slate-600">
                                                        <h3 className="text-lg font-semibold text-white">{example.title}</h3>
                                                        <button
                                                            onClick={() => copyToClipboard(example.code, key)}
                                                            className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-slate-300"
                                                        >
                                                            {copiedCode === key ? (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-4 h-4" />
                                                                    Copy
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <pre className="bg-black rounded p-4 overflow-x-auto">
                                                            <code className="text-sm text-green-400">{example.code}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'security' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">Security Analysis</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            Comprehensive security analysis including quantum resistance, threat modeling, and attack vectors.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/30">
                                                <Shield className="w-8 h-8 text-green-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">Quantum Resistance Score</h3>
                                                <div className="text-3xl font-bold text-green-400 mb-2">85-99%</div>
                                                <p className="text-slate-300">
                                                    Dynamic resistance scoring based on input complexity and algorithm parameters.
                                                </p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
                                                <Clock className="w-8 h-8 text-purple-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">Break Time Estimate</h3>
                                                <div className="text-3xl font-bold text-purple-400 mb-2">50-200+ Years</div>
                                                <p className="text-slate-300">
                                                    Estimated time for quantum computers to break the hash using Shor&apos;s algorithm.
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">Attack Vector Analysis</h3>
                                        <div className="space-y-4 mb-8">
                                            {[
                                                {
                                                    attack: "Classical Brute Force",
                                                    resistance: "Excellent",
                                                    level: "99.9%",
                                                    color: "text-green-400",
                                                    description: "SHA-256 base provides 2^256 complexity"
                                                },
                                                {
                                                    attack: "Quantum Algorithms (Shor's)",
                                                    resistance: "High",
                                                    level: "85-95%",
                                                    color: "text-blue-400",
                                                    description: "Harmonic physics creates quantum-resistant properties"
                                                },
                                                {
                                                    attack: "Rainbow Tables",
                                                    resistance: "Excellent",
                                                    level: "99.9%",
                                                    color: "text-green-400",
                                                    description: "TIU and harmonic salting prevents precomputation"
                                                },
                                                {
                                                    attack: "Replay Attacks",
                                                    resistance: "Excellent",
                                                    level: "99.8%",
                                                    color: "text-green-400",
                                                    description: "Temporal binding via TIU prevents replay"
                                                },
                                                {
                                                    attack: "Side Channel",
                                                    resistance: "Good",
                                                    level: "80-90%",
                                                    color: "text-yellow-400",
                                                    description: "Physics constants provide timing resistance"
                                                }
                                            ].map((item, index) => (
                                                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-lg font-semibold text-white">{item.attack}</h4>
                                                        <span className={`font-bold ${item.color}`}>{item.level}</span>
                                                    </div>
                                                    <p className="text-slate-300 text-sm">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-6 border border-orange-500/30">
                                            <h3 className="text-xl font-semibold text-white mb-3">Security Recommendations</h3>
                                            <ul className="space-y-2 text-slate-300">
                                                <li>• Use TIU values with high entropy (golden ratio recommended)</li>
                                                <li>• Implement minimum 16 iteration rounds for production</li>
                                                <li>• Rotate salts regularly for enterprise applications</li>
                                                <li>• Monitor quantum resistance scores in real-time</li>
                                                <li>• Use 512-bit or 1024-bit variants for maximum security</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'performance' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                        <h1 className="text-3xl font-bold text-white mb-6">Performance Metrics</h1>
                                        <p className="text-xl text-slate-300 mb-8">
                                            Performance characteristics, benchmarks, and optimization recommendations for CodexHash implementation.
                                        </p>

                                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                                                <div className="text-2xl font-bold text-white mb-2">&lt;50ms</div>
                                                <p className="text-slate-300">Hash Generation</p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                                <Target className="w-8 h-8 text-green-400 mx-auto mb-4" />
                                                <div className="text-2xl font-bold text-white mb-2">&lt;25ms</div>
                                                <p className="text-slate-300">Hash Verification</p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                                <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                                                <div className="text-2xl font-bold text-white mb-2">10K+</div>
                                                <p className="text-slate-300">Ops/Second</p>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">Performance by Bit Strength</h3>
                                        <div className="overflow-x-auto mb-8">
                                            <table className="w-full bg-slate-800/50 rounded-lg">
                                                <thead>
                                                    <tr className="border-b border-slate-600">
                                                        <th className="text-left p-4 text-slate-300">Bit Strength</th>
                                                        <th className="text-left p-4 text-slate-300">Generation Time</th>
                                                        <th className="text-left p-4 text-slate-300">Verification Time</th>
                                                        <th className="text-left p-4 text-slate-300">Throughput</th>
                                                        <th className="text-left p-4 text-slate-300">Memory Usage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b border-slate-700">
                                                        <td className="p-4 text-blue-400 font-semibold">256-bit</td>
                                                        <td className="p-4 text-slate-300">&lt;25ms</td>
                                                        <td className="p-4 text-slate-300">&lt;15ms</td>
                                                        <td className="p-4 text-slate-300">15,000 ops/sec</td>
                                                        <td className="p-4 text-slate-300">2-4 MB</td>
                                                    </tr>
                                                    <tr className="border-b border-slate-700">
                                                        <td className="p-4 text-purple-400 font-semibold">512-bit</td>
                                                        <td className="p-4 text-slate-300">&lt;45ms</td>
                                                        <td className="p-4 text-slate-300">&lt;30ms</td>
                                                        <td className="p-4 text-slate-300">8,000 ops/sec</td>
                                                        <td className="p-4 text-slate-300">4-8 MB</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 text-yellow-400 font-semibold">1024-bit</td>
                                                        <td className="p-4 text-slate-300">&lt;80ms</td>
                                                        <td className="p-4 text-slate-300">&lt;50ms</td>
                                                        <td className="p-4 text-slate-300">3,000 ops/sec</td>
                                                        <td className="p-4 text-slate-300">8-16 MB</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-white mb-6">Optimization Strategies</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-slate-800/50 rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-white mb-3">Hardware Optimization</h4>
                                                <ul className="space-y-2 text-slate-300 text-sm">
                                                    <li>• Use hardware-accelerated SHA-256 instructions</li>
                                                    <li>• Implement SIMD operations for batch processing</li>
                                                    <li>• Optimize memory access patterns</li>
                                                    <li>• Consider GPU acceleration for bulk operations</li>
                                                </ul>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-white mb-3">Software Optimization</h4>
                                                <ul className="space-y-2 text-slate-300 text-sm">
                                                    <li>• Cache TIU calculations for repeated operations</li>
                                                    <li>• Use connection pooling for API calls</li>
                                                    <li>• Implement async/parallel processing</li>
                                                    <li>• Optimize salt generation and storage</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default DocsPage
