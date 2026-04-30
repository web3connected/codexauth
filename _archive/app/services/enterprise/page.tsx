"use client"

import React, { useState } from 'react'
import { Shield, Zap, Lock, Users, Award, CheckCircle, ArrowRight, Building, Globe, Cpu, Database, Clock, AlertTriangle } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import TopBar from '@/components/common/TitleBar'

const EnterprisePage = () => {
    const [selectedTier, setSelectedTier] = useState('enterprise-pro')

    const hashingTiers = [
        {
            id: 'standard',
            name: 'Standard Enterprise',
            bitStrength: '256-bit',
            description: 'Professional-grade quantum-resistant hashing',
            price: 'Custom Pricing',
            color: 'blue',
            features: [
                '256-bit quantum-resistant algorithms',
                'TIU optimization (0.618034 golden ratio)',
                'Enterprise SLA (99.9% uptime)',
                'Dedicated support team',
                'API rate limits: 10,000 ops/min',
                'Advanced analytics dashboard',
                'Webhook integrations',
                'Multi-region deployment',
                'Compliance certifications'
            ],
            useCases: ['Financial services', 'Healthcare systems', 'Government applications', 'E-commerce platforms']
        },
        {
            id: 'enterprise-pro',
            name: 'Enterprise Pro',
            bitStrength: '512-bit',
            description: 'Maximum security for critical infrastructure',
            price: 'Custom Pricing',
            color: 'purple',
            features: [
                '512-bit quantum-resistant algorithms',
                'Enhanced TIU configurations',
                'Enterprise SLA (99.95% uptime)',
                'Priority 24/7 support',
                'API rate limits: 50,000 ops/min',
                'Real-time security monitoring',
                'Custom integration support',
                'Private cloud deployment',
                'Advanced compliance suite',
                'Dedicated account manager'
            ],
            useCases: ['Military & defense', 'Critical infrastructure', 'Blockchain networks', 'High-frequency trading']
        },
        {
            id: 'quantum-max',
            name: 'Quantum Max',
            bitStrength: '1024-bit',
            description: 'Ultimate quantum protection for the most sensitive data',
            price: 'Premium Pricing',
            color: 'gold',
            features: [
                '1024-bit quantum-resistant algorithms',
                'Custom TIU physics constants',
                'Enterprise SLA (99.99% uptime)',
                'White-glove support',
                'API rate limits: Unlimited',
                'Real-time threat detection',
                'Custom algorithm development',
                'Air-gapped deployment options',
                'Zero-knowledge architecture',
                'Regulatory audit support',
                'Custom hardware integration'
            ],
            useCases: ['National security', 'Central banking', 'Quantum computing research', 'Space missions']
        }
    ]

    const enterpriseBenefits = [
        {
            icon: Shield,
            title: 'Quantum-Proof Security',
            description: 'Future-proof your data against quantum computing attacks with our physics-based hashing algorithms.',
            color: 'text-blue-400'
        },
        {
            icon: Zap,
            title: 'High-Performance Processing',
            description: 'Enterprise-grade infrastructure with optimized algorithms delivering consistent sub-100ms response times.',
            color: 'text-yellow-400'
        },
        {
            icon: Globe,
            title: 'Global Scale',
            description: 'Multi-region deployment with auto-scaling capabilities to handle enterprise workloads worldwide.',
            color: 'text-green-400'
        },
        {
            icon: Lock,
            title: 'Compliance Ready',
            description: 'SOC 2, FIPS 140-2, and custom compliance certifications for regulatory requirements.',
            color: 'text-purple-400'
        },
        {
            icon: Users,
            title: 'Dedicated Support',
            description: 'Enterprise support team with SLA guarantees and dedicated account management.',
            color: 'text-cyan-400'
        },
        {
            icon: Award,
            title: 'Custom Solutions',
            description: 'Tailored implementations with custom algorithms and integration support.',
            color: 'text-orange-400'
        }
    ]

    const complianceStandards = [
        { name: 'SOC 2 Type II', description: 'Security and availability controls' },
        { name: 'FIPS 140-2', description: 'Cryptographic module standards' },
        { name: 'ISO 27001', description: 'Information security management' },
        { name: 'GDPR', description: 'Data protection regulation' },
        { name: 'HIPAA', description: 'Healthcare data protection' },
        { name: 'PCI DSS', description: 'Payment card data security' }
    ]

    const performanceMetrics = [
        { metric: 'Hash Generation', standard: '< 50ms', pro: '< 25ms', quantumMax: '< 10ms' },
        { metric: 'Throughput', standard: '10K ops/min', pro: '50K ops/min', quantumMax: 'Unlimited' },
        { metric: 'Uptime SLA', standard: '99.9%', pro: '99.95%', quantumMax: '99.99%' },
        { metric: 'Support Response', standard: '< 4 hours', pro: '< 2 hours', quantumMax: '< 30 minutes' },
        { metric: 'Data Centers', standard: '5 regions', pro: '12 regions', quantumMax: 'Custom' },
        { metric: 'Quantum Resistance', standard: '50+ years', pro: '100+ years', quantumMax: '200+ years' }
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'border-blue-500/30 bg-blue-500/10',
            purple: 'border-purple-500/30 bg-purple-500/10',
            gold: 'border-yellow-500/30 bg-yellow-500/10'
        }
        return colors[color] || colors.blue
    }

    const getButtonClasses = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-600 hover:bg-blue-700',
            purple: 'bg-purple-600 hover:bg-purple-700',
            gold: 'bg-yellow-600 hover:bg-yellow-700'
        }
        return colors[color] || colors.blue
    }

    return (
        <PageLayout>
            <div className="min-h-screen bg-slate-950">
                <TopBar
                    title="Enterprise Solutions"
                    description="Military-grade quantum-resistant hashing for enterprise infrastructure with 256-bit to 1024-bit security levels"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Services', href: '/services' },
                        { label: 'Enterprise', href: '/services/enterprise' }
                    ]}
                />

                <div className="container mx-auto px-6 py-16">
                    {/* Enterprise Benefits Section */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Why Choose CodexHash Enterprise</h2>
                        <p className="text-xl text-slate-300 text-center mb-12 max-w-4xl mx-auto">
                            Protect your most critical data with quantum-resistant hashing technology built on physics-based algorithms and harmonic principles.
                        </p>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {enterpriseBenefits.map((benefit, index) => (
                                <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                                    <benefit.icon className={`w-12 h-12 ${benefit.color} mb-4`} />
                                    <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                                    <p className="text-slate-300">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Hashing Tiers Section */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Enterprise Hashing Tiers</h2>
                        <p className="text-xl text-slate-300 text-center mb-12">
                            Choose the right level of quantum protection for your organization
                        </p>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {hashingTiers.map((tier) => (
                                <div 
                                    key={tier.id} 
                                    className={`relative rounded-lg p-8 border-2 transition-all cursor-pointer ${
                                        selectedTier === tier.id 
                                            ? getColorClasses(tier.color) 
                                            : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                                    }`}
                                    onClick={() => setSelectedTier(tier.id)}
                                >
                                    {tier.id === 'quantum-max' && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                                                🏆 PREMIUM
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                        <div className="text-4xl font-bold text-white mb-2">{tier.bitStrength}</div>
                                        <p className="text-slate-300 mb-4">{tier.description}</p>
                                        <div className="text-xl font-semibold text-blue-400">{tier.price}</div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {tier.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                                <span className="text-slate-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-white mb-3">Ideal for:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {tier.useCases.map((useCase, index) => (
                                                <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
                                                    {useCase}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className={`w-full ${getButtonClasses(tier.color)} text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}>
                                        Contact Sales
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Performance Comparison */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Performance Comparison</h2>
                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="text-left p-4 text-white font-semibold">Metric</th>
                                        <th className="text-center p-4 text-white font-semibold">Standard (256-bit)</th>
                                        <th className="text-center p-4 text-white font-semibold">Pro (512-bit)</th>
                                        <th className="text-center p-4 text-white font-semibold">Quantum Max (1024-bit)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {performanceMetrics.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-800/30">
                                            <td className="p-4 text-slate-300 font-medium">{row.metric}</td>
                                            <td className="p-4 text-center text-slate-300">{row.standard}</td>
                                            <td className="p-4 text-center text-slate-300">{row.pro}</td>
                                            <td className="p-4 text-center text-yellow-400 font-semibold">{row.quantumMax}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Technical Architecture */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Enterprise Architecture</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                                <Cpu className="w-10 h-10 text-blue-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Physics-Based Algorithms</h3>
                                <p className="text-slate-300">Harmonic frequencies using golden ratio (φ), Euler&apos;s number (e), and quantum constants</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                                <Database className="w-10 h-10 text-green-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Multi-Layer Security</h3>
                                <p className="text-slate-300">SHAKE256, BLAKE2b, and iterative strengthening with custom TIU values</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                                <Clock className="w-10 h-10 text-purple-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Time Integrity Units</h3>
                                <p className="text-slate-300">Temporal synchronization with entropy generation and inversion pressure modeling</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                                <AlertTriangle className="w-10 h-10 text-orange-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Quantum Resistance</h3>
                                <p className="text-slate-300">Protection against current and future quantum computing attack vectors</p>
                            </div>
                        </div>
                    </section>

                    {/* Compliance & Certifications */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Compliance & Certifications</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {complianceStandards.map((standard, index) => (
                                <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 text-center">
                                    <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">{standard.name}</h3>
                                    <p className="text-slate-300">{standard.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="text-center">
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-12 border border-blue-500/30">
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Enterprise?</h2>
                            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                                Join leading organizations already protecting their critical data with CodexHash quantum-resistant technology. 
                                Get started with a custom enterprise solution today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Schedule Enterprise Demo
                                </button>
                                <button className="bg-slate-700 hover:bg-slate-600 text-white py-4 px-8 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Contact Sales Team
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageLayout>
    )
}

export default EnterprisePage
