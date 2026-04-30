"use client"

import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, Shield, Zap, Clock, Activity, Hash, Target, Cpu, ChevronDown, ChevronUp } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import TopBar from '@/components/common/TitleBar'

const AnalyticsPage = () => {
    const [expandedPanels, setExpandedPanels] = useState<{ [key: string]: boolean }>({
        'comparative': true,
        'physics': true
    })

    const togglePanel = (panelId: string) => {
        setExpandedPanels(prev => ({
            ...prev,
            [panelId]: !prev[panelId]
        }))
    }

    // Mock data for Algorithm Benchmarks
    const algorithmBenchmarks = [
        { algorithm: 'HarmonicHash', speed: 245, security: 98, efficiency: 92 },
        { algorithm: 'SHA-256', speed: 312, security: 75, efficiency: 85 },
        { algorithm: 'SHA-3', speed: 198, security: 80, efficiency: 78 },
        { algorithm: 'bcrypt', speed: 45, security: 85, efficiency: 65 },
        { algorithm: 'PBKDF2', speed: 78, security: 82, efficiency: 70 }
    ]

    // Mock data for Security Comparisons
    const securityComparisons = [
        { metric: 'Quantum Resistance', HarmonicHash: 95, Traditional: 15 },
        { metric: 'Collision Resistance', HarmonicHash: 98, Traditional: 88 },
        { metric: 'Preimage Resistance', HarmonicHash: 97, Traditional: 92 },
        { metric: 'Avalanche Effect', HarmonicHash: 99, Traditional: 94 },
        { metric: 'Entropy Quality', HarmonicHash: 96, Traditional: 85 }
    ]

    // Mock data for Performance Over Time
    const performanceOverTime = [
        { month: 'Jan', avgSpeed: 238, maxSpeed: 285, efficiency: 89 },
        { month: 'Feb', avgSpeed: 242, maxSpeed: 290, efficiency: 91 },
        { month: 'Mar', avgSpeed: 245, maxSpeed: 295, efficiency: 92 },
        { month: 'Apr', avgSpeed: 248, maxSpeed: 298, efficiency: 93 },
        { month: 'May', avgSpeed: 251, maxSpeed: 302, efficiency: 94 },
        { month: 'Jun', avgSpeed: 254, maxSpeed: 305, efficiency: 95 }
    ]

    // Mock data for Cost Efficiency
    const costEfficiency = [
        { category: 'Low Volume', HarmonicHash: 0.12, Traditional: 0.18 },
        { category: 'Medium Volume', HarmonicHash: 0.08, Traditional: 0.14 },
        { category: 'High Volume', HarmonicHash: 0.05, Traditional: 0.11 },
        { category: 'Enterprise', HarmonicHash: 0.03, Traditional: 0.09 }
    ]

    // Mock data for Harmonic Frequency Analysis
    const harmonicFrequencies = [
        { constant: 'Golden Ratio (φ)', frequency: 1618, usage: 45, efficiency: 98 },
        { constant: 'Euler\'s Number (e)', frequency: 2718, usage: 32, efficiency: 94 },
        { constant: 'Pi (π)', frequency: 3141, usage: 28, efficiency: 91 },
        { constant: 'Planck Constant', frequency: 6626, usage: 18, efficiency: 96 },
        { constant: 'Fine Structure', frequency: 137, usage: 15, efficiency: 89 }
    ]

    // Mock data for TIU Distribution
    const tiuDistribution = [
        { range: '0.600-0.610', count: 1250, percentage: 8.3 },
        { range: '0.610-0.618', count: 3890, percentage: 25.9 },
        { range: '0.618 (Golden)', count: 6720, percentage: 44.8 },
        { range: '0.618-0.625', count: 2340, percentage: 15.6 },
        { range: '0.625-0.650', count: 800, percentage: 5.4 }
    ]

    // Mock data for Inversion Pressure Metrics
    const inversionPressure = [
        { hour: '00:00', pressure: 1.23, stability: 98 },
        { hour: '04:00', pressure: 1.18, stability: 97 },
        { hour: '08:00', pressure: 1.35, stability: 95 },
        { hour: '12:00', pressure: 1.42, stability: 94 },
        { hour: '16:00', pressure: 1.38, stability: 96 },
        { hour: '20:00', pressure: 1.28, stability: 97 }
    ]

    // Mock data for Golden Ratio Utilization
    const goldenRatioUsage = [
        { name: 'Default TIU (0.618034)', value: 68.2, color: '#f59e0b' },
        { name: 'Custom TIU Values', value: 31.8, color: '#3b82f6' }
    ]

    return (
        <PageLayout>
            <div className="min-h-screen bg-slate-950">
                <TopBar
                    title="Analytics Dashboard"
                    description="Advanced analytics for CodexHash quantum-resistant hashing performance and security metrics"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Services', href: '/services' },
                        { label: 'Analytics', href: '/services/analytics' }
                    ]}
                />

                <div className="container mx-auto px-6 py-16">
                    {/* Comparative Analysis Panel */}
                    <section className="mb-16">
                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                            <div 
                                className="p-6 border-b border-slate-700 cursor-pointer flex items-center justify-between"
                                onClick={() => togglePanel('comparative')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/15 flex items-center justify-center">
                                        <BarChart className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">📋 Comparative Analysis</h2>
                                        <p className="text-slate-300">Performance benchmarks and security comparisons</p>
                                    </div>
                                </div>
                                {expandedPanels.comparative ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
                            </div>

                            {expandedPanels.comparative && (
                                <div className="p-6">
                                    {/* Algorithm Benchmarks */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-400" />
                                            Algorithm Benchmarks - HarmonicHash vs Traditional Algorithms
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={algorithmBenchmarks}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="algorithm" tick={{ fill: '#9ca3af' }} />
                                                    <YAxis tick={{ fill: '#9ca3af' }} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Bar dataKey="speed" fill="#3b82f6" name="Speed (ops/sec)" />
                                                    <Bar dataKey="security" fill="#10b981" name="Security Score" />
                                                    <Bar dataKey="efficiency" fill="#f59e0b" name="Efficiency %" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Security Comparisons */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-green-400" />
                                            Security Comparisons - Quantum Resistance vs Standard Hashing
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={securityComparisons} layout="horizontal">
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                                                    <YAxis dataKey="metric" type="category" tick={{ fill: '#9ca3af' }} width={120} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Bar dataKey="HarmonicHash" fill="#10b981" name="HarmonicHash" />
                                                    <Bar dataKey="Traditional" fill="#ef4444" name="Traditional" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Performance Over Time */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-purple-400" />
                                            Performance Over Time - Historical Performance Trends
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <AreaChart data={performanceOverTime}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                                                    <YAxis tick={{ fill: '#9ca3af' }} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Area type="monotone" dataKey="maxSpeed" fill="#8b5cf6" fillOpacity={0.3} stroke="#8b5cf6" name="Max Speed" />
                                                    <Area type="monotone" dataKey="avgSpeed" fill="#3b82f6" fillOpacity={0.6} stroke="#3b82f6" name="Avg Speed" />
                                                    <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} name="Efficiency %" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Cost Efficiency */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Cpu className="w-5 h-5 text-yellow-400" />
                                            Cost Efficiency - Performance per Computational Cost
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={costEfficiency}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="category" tick={{ fill: '#9ca3af' }} />
                                                    <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'Cost per Hash ($)', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Bar dataKey="HarmonicHash" fill="#10b981" name="HarmonicHash" />
                                                    <Bar dataKey="Traditional" fill="#ef4444" name="Traditional" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Physics-Based Metrics Panel */}
                    <section>
                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                            <div 
                                className="p-6 border-b border-slate-700 cursor-pointer flex items-center justify-between"
                                onClick={() => togglePanel('physics')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">🔬 Physics-Based Metrics</h2>
                                        <p className="text-slate-300">Quantum mechanics integration and harmonic analysis</p>
                                    </div>
                                </div>
                                {expandedPanels.physics ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
                            </div>

                            {expandedPanels.physics && (
                                <div className="p-6">
                                    {/* Harmonic Frequency Analysis */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Hash className="w-5 h-5 text-cyan-400" />
                                            Harmonic Frequency Analysis - Physics Constants Usage
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={harmonicFrequencies}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="constant" tick={{ fill: '#9ca3af' }} angle={-45} height={80} />
                                                    <YAxis tick={{ fill: '#9ca3af' }} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Bar dataKey="usage" fill="#06b6d4" name="Usage %" />
                                                    <Bar dataKey="efficiency" fill="#f59e0b" name="Efficiency %" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* TIU Distribution */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-indigo-400" />
                                            TIU Distribution - Time Integrity Unit Patterns
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={tiuDistribution}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="range" tick={{ fill: '#9ca3af' }} />
                                                    <YAxis tick={{ fill: '#9ca3af' }} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Bar dataKey="count" fill="#6366f1" name="Hash Count" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Inversion Pressure Metrics */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-red-400" />
                                            Inversion Pressure Metrics - Quantum Mechanics Integration
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={inversionPressure}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="hour" tick={{ fill: '#9ca3af' }} />
                                                    <YAxis tick={{ fill: '#9ca3af' }} />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1f2937', 
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }} 
                                                    />
                                                    <Line type="monotone" dataKey="pressure" stroke="#ef4444" strokeWidth={3} name="Inversion Pressure" />
                                                    <Line type="monotone" dataKey="stability" stroke="#10b981" strokeWidth={2} name="Stability %" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Golden Ratio Utilization */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-yellow-400" />
                                            Golden Ratio Utilization - Default TIU (0.618034) Usage
                                        </h3>
                                        <div className="bg-slate-800/50 rounded-lg p-6">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={goldenRatioUsage}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                            >
                                                                {goldenRatioUsage.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip 
                                                                contentStyle={{ 
                                                                    backgroundColor: '#1f2937', 
                                                                    border: '1px solid #374151',
                                                                    borderRadius: '8px'
                                                                }} 
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                            <h4 className="text-lg font-semibold text-yellow-400 mb-2">Golden Ratio Dominance</h4>
                                                            <p className="text-slate-300">68.2% of all hash operations use the default golden ratio TIU value (0.618034), demonstrating optimal physics-based entropy generation.</p>
                                                        </div>
                                                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                                            <h4 className="text-lg font-semibold text-blue-400 mb-2">Custom TIU Usage</h4>
                                                            <p className="text-slate-300">31.8% of operations use custom TIU values, allowing for specialized use cases while maintaining quantum resistance.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </PageLayout>
    )
}

export default AnalyticsPage
