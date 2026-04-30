"use client"

import React, { useState } from 'react'
import { Code, Terminal, Book, Github, Users, Rocket, Clock, Bell, Star, Download } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import TopBar from '@/components/common/TitleBar'

const DeveloperCenterPage = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript')

    const upcomingFeatures = [
        {
            category: 'SDKs & Libraries',
            icon: Code,
            color: 'text-blue-400',
            items: [
                'JavaScript/TypeScript SDK with full type definitions',
                'Python SDK with async/await support',
                'Go SDK for high-performance applications',
                'Rust SDK for system-level integration',
                'C++ SDK for embedded systems',
                'Java SDK for enterprise applications'
            ]
        },
        {
            category: 'Developer Tools',
            icon: Terminal,
            color: 'text-green-400',
            items: [
                'CLI tool for hash generation and testing',
                'VS Code extension with syntax highlighting',
                'Postman collection for API testing',
                'Docker containers for easy deployment',
                'Kubernetes helm charts',
                'CI/CD pipeline templates'
            ]
        },
        {
            category: 'Documentation & Guides',
            icon: Book,
            color: 'text-purple-400',
            items: [
                'Interactive API documentation',
                'Quick start tutorials for each language',
                'Advanced implementation guides',
                'Best practices and security guidelines',
                'Performance optimization tips',
                'Real-world use case examples'
            ]
        },
        {
            category: 'Community & Support',
            icon: Users,
            color: 'text-orange-400',
            items: [
                'Developer Discord community',
                'Stack Overflow integration',
                'GitHub discussions and issues',
                'Monthly developer webinars',
                'Code review and feedback sessions',
                'Hackathon and challenge events'
            ]
        }
    ]

    const codeExamples = {
        javascript: `// CodexHash JavaScript SDK (Coming Soon)

const hasher = new CodexHash({
  mode: 'quantum-resistant',
  securityLevel: 'enterprise'
});

// Generate quantum-resistant hash
const result = await hasher.generateHash('sensitive-data', {
  tiu: 0.618034, // Golden ratio TIU
  rounds: 16,    // Enterprise security
  salt: 'custom-salt'
});

console.log('Hash:', result.hash);
console.log('Quantum Resistance:', result.quantumResistance);`,

        python: `# CodexHash Python SDK (Coming Soon)
from codexhash import QuantumHasher

# Initialize with enterprise settings
hasher = QuantumHasher(
    mode='quantum_resistant',
    security_level='enterprise'
)

# Async hash generation
async def generate_secure_hash():
    result = await hasher.generate_hash(
        data='sensitive-data',
        tiu=0.618034,  # Golden ratio TIU
        rounds=16,     # Enterprise security
        salt='custom-salt'
    )
    
    print(f"Hash: {result.hash}")
    print(f"Quantum Resistance: {result.quantum_resistance}")`,

        go: `// CodexHash Go SDK (Coming Soon)
package main

import (
    "fmt"
    "github.com/web3connected/codexhash-go"
)

func main() {
    // Initialize quantum-resistant hasher
    hasher := codexhash.NewQuantumHasher(&codexhash.Config{
        Mode:          codexhash.QuantumResistant,
        SecurityLevel: codexhash.Enterprise,
    })
    
    // Generate secure hash
    result, err := hasher.GenerateHash(&codexhash.HashParams{
        Data:   "sensitive-data",
        TIU:    0.618034, // Golden ratio
        Rounds: 16,       // Enterprise security
        Salt:   "custom-salt",
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Printf("Hash: %s\\n", result.Hash)
    fmt.Printf("Quantum Resistance: %.2f\\n", result.QuantumResistance)
}`
    }

    return (
        <PageLayout>
            <div className="min-h-screen bg-slate-950">
                <TopBar
                    title="Developer Center"
                    description="Build quantum-resistant applications with CodexHash - comprehensive tools and resources coming soon"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Services', href: '/services' },
                        { label: 'Developer Center', href: '/services/developer' }
                    ]}
                />

                <div className="container mx-auto px-6 py-16 max-w-6xl">
                    {/* Coming Soon Hero Section */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-8 mb-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-blue-500/20 rounded-full p-4">
                                        <Rocket className="w-12 h-12 text-blue-400" />
                                    </div>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-4">Developer Center Coming Soon</h1>
                                <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
                                    We&apos;re building a comprehensive developer ecosystem with SDKs, tools, 
                                    documentation, and community resources to make quantum-resistant hashing 
                                    accessible to developers worldwide.
                                </p>
                                
                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-slate-900/50 rounded-lg p-6">
                                        <Bell className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
                                        <p className="text-slate-300 text-sm">
                                            Join our developer preview program for exclusive access to beta SDKs and tools.
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-6">
                                        <Code className="w-8 h-8 text-green-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Multi-Language Support</h3>
                                        <p className="text-slate-300 text-sm">
                                            SDKs for JavaScript, Python, Go, Rust, C++, and Java with consistent APIs.
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-6">
                                        <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Beta Launch</h3>
                                        <p className="text-slate-300 text-sm">
                                            Developer tools and SDKs will be available Q4 2025 with documentation.
                                        </p>
                                    </div>
                                </div>

                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors mr-4">
                                    Join Developer Preview
                                </button>
                                <button className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                                    View Roadmap
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Upcoming Features */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">What&apos;s Coming</h2>
                        <div className="grid lg:grid-cols-2 gap-8">
                            {upcomingFeatures.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <IconComponent className={`w-8 h-8 ${feature.color}`} />
                                            <h3 className="text-xl font-bold text-white">{feature.category}</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {feature.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-start gap-3 text-slate-300">
                                                    <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SDK Preview */}
                    <section className="mb-16">
                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                            <h2 className="text-3xl font-bold text-white mb-6 text-center">SDK Preview</h2>
                            <p className="text-slate-300 text-center mb-8">
                                Get a glimpse of our upcoming SDKs with consistent APIs across all supported languages.
                            </p>
                            
                            <div className="flex justify-center mb-6">
                                <div className="bg-slate-800 rounded-lg p-1 flex gap-1">
                                    {Object.keys(codeExamples).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setSelectedLanguage(lang)}
                                            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                                                selectedLanguage === lang
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                            }`}
                                        >
                                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-black rounded-lg p-6 overflow-x-auto">
                                <pre className="text-green-400 text-sm">
                                    <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]}</code>
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* Developer Resources Timeline */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Development Timeline</h2>
                        <div className="space-y-6">
                            {[
                                {
                                    phase: 'Q4 2025',
                                    title: 'Beta SDK Release',
                                    status: 'upcoming',
                                    items: [
                                        'JavaScript/TypeScript SDK',
                                        'Python SDK',
                                        'Basic CLI tools',
                                        'API documentation'
                                    ]
                                },
                                {
                                    phase: 'Q1 2026',
                                    title: 'Full Platform Launch',
                                    status: 'planned',
                                    items: [
                                        'All language SDKs',
                                        'Developer portal',
                                        'Community platform',
                                        'Enterprise tools'
                                    ]
                                },
                                {
                                    phase: 'Q2 2026',
                                    title: 'Advanced Features',
                                    status: 'planned',
                                    items: [
                                        'Visual development tools',
                                        'Advanced debugging',
                                        'Performance analytics',
                                        'Plugin ecosystem'
                                    ]
                                }
                            ].map((phase, index) => (
                                <div key={index} className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${
                                            phase.status === 'upcoming' 
                                                ? 'bg-blue-400' 
                                                : 'bg-slate-600'
                                        }`} />
                                        {index < 2 && <div className="w-0.5 h-16 bg-slate-600 mt-2" />}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    phase.status === 'upcoming'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                    {phase.phase}
                                                </span>
                                                <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {phase.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="flex items-center gap-3 text-slate-300">
                                                        <div className="w-2 h-2 bg-slate-500 rounded-full" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section>
                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30 p-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build with CodexHash?</h2>
                            <p className="text-xl text-slate-300 mb-6">
                                Join our growing community of developers building the future of quantum-resistant applications.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                    <Github className="w-5 h-5" />
                                    Star on GitHub
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Download Early Access
                                </button>
                                <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Join Community
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageLayout>
    )
}

export default DeveloperCenterPage
