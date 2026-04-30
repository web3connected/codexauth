"use client"

import React from 'react'
import { Clock, HeadphonesIcon, MessageCircle, Book, Phone, Mail, Users, Shield } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import TopBar from '@/components/common/TitleBar'

const SupportPage = () => {
    const supportChannels = [
        {
            icon: MessageCircle,
            title: 'Live Chat Support',
            description: '24/7 real-time assistance for technical issues and implementation guidance',
            availability: 'Coming Q4 2025',
            color: 'text-blue-400'
        },
        {
            icon: HeadphonesIcon,
            title: 'Priority Phone Support',
            description: 'Direct phone access to our quantum cryptography experts for enterprise clients',
            availability: 'Enterprise Preview',
            color: 'text-green-400'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Comprehensive technical support via email with detailed response documentation',
            availability: 'Beta Access Soon',
            color: 'text-yellow-400'
        },
        {
            icon: Book,
            title: 'Knowledge Base',
            description: 'Extensive documentation, tutorials, and troubleshooting guides',
            availability: 'In Development',
            color: 'text-purple-400'
        },
        {
            icon: Users,
            title: 'Community Forum',
            description: 'Developer community for sharing implementations and best practices',
            availability: 'Q1 2026',
            color: 'text-orange-400'
        },
        {
            icon: Shield,
            title: 'Security Consultation',
            description: 'Expert security audits and implementation reviews for critical applications',
            availability: 'Enterprise Only',
            color: 'text-red-400'
        }
    ]

    const supportTiers = [
        {
            name: 'Community',
            description: 'Basic support for developers and researchers',
            features: [
                'Community forum access',
                'Documentation and tutorials',
                'Email support (48-72h response)',
                'Basic implementation guidance'
            ],
            availability: 'Free tier launching Q4 2025'
        },
        {
            name: 'Professional',
            description: 'Enhanced support for production applications',
            features: [
                'Priority email support (12-24h response)',
                'Live chat during business hours',
                'Implementation consultation',
                'Performance optimization guidance'
            ],
            availability: 'Paid tier launching Q1 2026'
        },
        {
            name: 'Enterprise',
            description: 'Premium support for mission-critical systems',
            features: [
                'Dedicated support engineer',
                '24/7 phone and chat support',
                'Security consultation and audits',
                'Custom implementation assistance',
                'SLA guarantees'
            ],
            availability: 'Available for beta customers'
        }
    ]

    return (
        <PageLayout>
            <div className="min-h-screen bg-slate-950">
                <TopBar
                    title="CodexHash Support"
                    description="Comprehensive support services for quantum-resistant cryptographic implementations"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Support', href: '/support' }
                    ]}
                />

                <div className="container mx-auto px-6 py-16 max-w-6xl">
                    {/* Coming Soon Banner */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-8 mb-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-blue-500/20 rounded-full p-4">
                                        <Clock className="w-12 h-12 text-blue-400" />
                                    </div>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-4">Support Services Coming Soon</h1>
                                <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
                                    We&apos;re building a comprehensive support ecosystem to help you implement 
                                    quantum-resistant security solutions with confidence and expert guidance.
                                </p>
                                
                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-slate-900/50 rounded-lg p-6">
                                        <HeadphonesIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
                                        <p className="text-slate-300 text-sm">
                                            Direct access to quantum cryptography experts and security consultants.
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-6">
                                        <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-white mb-2">24/7 Availability</h3>
                                        <p className="text-slate-300 text-sm">
                                            Round-the-clock support for mission-critical security implementations.
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-6">
                                        <Shield className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Security First</h3>
                                        <p className="text-slate-300 text-sm">
                                            Specialized support for high-security environments and compliance requirements.
                                        </p>
                                    </div>
                                </div>

                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                                    Join Support Beta Program
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Support Channels Preview */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Support Channels in Development</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {supportChannels.map((channel, index) => {
                                const IconComponent = channel.icon;
                                return (
                                    <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-slate-800/50 rounded-lg p-3 mr-4">
                                                <IconComponent className={`w-6 h-6 ${channel.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{channel.title}</h3>
                                                <span className={`text-sm ${channel.color} font-medium`}>
                                                    {channel.availability}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {channel.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Support Tiers */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Support Tier Preview</h2>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {supportTiers.map((tier, index) => (
                                <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                    <p className="text-slate-300 mb-6">{tier.description}</p>
                                    
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                                        <ul className="space-y-2">
                                            {tier.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-2 text-slate-300 text-sm">
                                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-blue-400 font-semibold text-sm">{tier.availability}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Current Contact Information */}
                    <section className="mb-16">
                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
                            <h2 className="text-3xl font-bold text-white mb-6 text-center">Early Access Contact</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Enterprise Inquiries</h3>
                                    <p className="text-slate-300 mb-4">
                                        For enterprise implementations, security consultations, and custom deployment assistance.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-blue-400" />
                                            <span className="text-slate-300">enterprise@codexhash.io</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-green-400" />
                                            <span className="text-slate-300">+1 (555) 123-HASH</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Developer Support</h3>
                                    <p className="text-slate-300 mb-4">
                                        Technical questions, implementation guidance, and SDK support for developers.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-purple-400" />
                                            <span className="text-slate-300">developers@codexhash.io</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Book className="w-5 h-5 text-yellow-400" />
                                            <span className="text-slate-300">GitHub Issues & Discussions</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Support Timeline */}
                    <section>
                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30 p-8">
                            <h2 className="text-3xl font-bold text-white mb-6 text-center">Support Rollout Timeline</h2>
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-blue-400 font-bold">Q4</span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">2025</h3>
                                    <p className="text-slate-300 text-sm">Knowledge Base & Community Forum Launch</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-green-400 font-bold">Q1</span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">2026</h3>
                                    <p className="text-slate-300 text-sm">Email & Chat Support Beta</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-yellow-400 font-bold">Q2</span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">2026</h3>
                                    <p className="text-slate-300 text-sm">24/7 Phone Support for Enterprise</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-purple-400 font-bold">Q3</span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">2026</h3>
                                    <p className="text-slate-300 text-sm">Full Support Ecosystem Launch</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageLayout>
    )
}

export default SupportPage
