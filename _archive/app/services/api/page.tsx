"use client"

import React, { useState } from 'react'
import { Copy, Check, Play, Hash, Shield, Zap, Database } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import TopBar from '@/components/common/TitleBar'

interface TestResult {
    status?: number
    data?: unknown
    error?: string
}

const APIDocumentationPage = () => {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
    const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({})

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedStates({ ...copiedStates, [id]: true })
            setTimeout(() => {
                setCopiedStates({ ...copiedStates, [id]: false })
            }, 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const testEndpoint = async (endpointId: string, method: string, url: string, body?: Record<string, unknown>) => {
        try {
            const response = await fetch(url, {
                method,
                headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
                body: body ? JSON.stringify(body) : undefined
            })
            const result = await response.json()
            setTestResults({ ...testResults, [endpointId]: { status: response.status, data: result } })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            setTestResults({ ...testResults, [endpointId]: { error: errorMessage } })
        }
    }

    const endpoints = [
        {
            id: 'hash-post',
            method: 'POST',
            path: '/api/hash',
            title: 'Generate Harmonic Hash',
            description: 'Generate a quantum-resistant hash using HarmonicHash algorithm with physics-based constants.',
            icon: Hash,
            parameters: [
                { name: 'input', type: 'string', required: true, description: 'The string to hash (max 1MB)' },
                { name: 'salt', type: 'string', required: false, description: 'Optional salt value for enhanced security' },
                { name: 'tiu', type: 'number', required: false, description: 'Time distortion units (default: 0.618034 - golden ratio)' },
                { name: 'iterations', type: 'number', required: false, description: 'Hash iterations (1-32, default: 16)' }
            ],
            example: {
                input: "Hello, Quantum World!",
                salt: "mysalt123",
                tiu: 0.618034,
                iterations: 16
            },
            response: {
                hash: "a1b2c3d4e5f6...",
                salt: "mysalt123",
                tiu: 0.618034,
                meta: {
                    algo: "HarmonicHash-v1.0",
                    iterations: 16,
                    durationMs: 45,
                    inputSize: 21,
                    quantumResistance: 256
                }
            }
        },
        {
            id: 'hash-get',
            method: 'GET',
            path: '/api/hash',
            title: 'Get Service Information',
            description: 'Retrieve information about the HarmonicHash API service, available endpoints, and parameters.',
            icon: Database,
            parameters: [],
            example: null,
            response: {
                service: "HarmonicHash API",
                version: "1.0.0",
                description: "Quantum-resistant hashing using physics-based constants and harmonic frequencies",
                endpoints: {
                    "POST /api/hash": "Generate harmonic hash",
                    "GET /api/hash": "Get service information"
                }
            }
        }
    ]

    const CodeBlock = ({ code, language = 'json', id }: { code: string, language?: string, id: string }) => (
        <div className="relative bg-slate-900/80 rounded-lg p-4 border border-slate-700">
            <button
                onClick={() => copyToClipboard(code, id)}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
            >
                {copiedStates[id] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="text-sm overflow-x-auto">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    )

    return (
        <PageLayout>
            <div className="min-h-screen bg-slate-950">
                <TopBar
                    title="API Documentation"
                    description="Complete reference for the CodexHash quantum-resistant hashing API"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Services', href: '/services' },
                        { label: 'API Documentation', href: '/services/api' }
                    ]}
                />

                <div className="container mx-auto px-6 py-16">
                {/* Quick Start Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6">Quick Start</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Base URL</h3>
                            <CodeBlock code="https://codexhash.io" language="text" id="base-url" />
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Content Type</h3>
                            <CodeBlock code="application/json" language="text" id="content-type" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8">API Features</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <Shield className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Quantum Resistant</h3>
                            <p className="text-slate-300">Post-quantum cryptographic security using harmonic frequencies.</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">High Performance</h3>
                            <p className="text-slate-300">Optimized algorithms for speed and efficiency.</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <Database className="w-8 h-8 text-green-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Physics-Based</h3>
                            <p className="text-slate-300">Built on fundamental physics constants and harmonic principles.</p>
                        </div>
                    </div>
                </section>

                {/* Endpoints Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8">API Endpoints</h2>
                    <div className="space-y-12">
                        {endpoints.map((endpoint) => {
                            const IconComponent = endpoint.icon
                            return (
                                <div key={endpoint.id} className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                                    {/* Endpoint Header */}
                                    <div className="p-6 border-b border-slate-700">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                                                <IconComponent className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    endpoint.method === 'POST' 
                                                        ? 'bg-blue-500/15 text-blue-400' 
                                                        : 'bg-green-500/15 text-green-400'
                                                }`}>
                                                    {endpoint.method}
                                                </span>
                                                <code className="text-lg font-mono text-white">{endpoint.path}</code>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{endpoint.title}</h3>
                                        <p className="text-slate-300">{endpoint.description}</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Parameters */}
                                        {endpoint.parameters.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-lg font-semibold text-white mb-4">Parameters</h4>
                                                <div className="space-y-3">
                                                    {endpoint.parameters.map((param) => (
                                                        <div key={param.name} className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <code className="text-blue-400 font-mono">{param.name}</code>
                                                                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                                                                    {param.type}
                                                                </span>
                                                                {param.required && (
                                                                    <span className="text-xs text-red-400 bg-red-500/15 px-2 py-1 rounded">
                                                                        required
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-300 text-sm">{param.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Example Request */}
                                        {endpoint.example && (
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-white">Example Request</h4>
                                                    <button
                                                        onClick={() => testEndpoint(
                                                            endpoint.id, 
                                                            endpoint.method, 
                                                            `/api/hash`, 
                                                            endpoint.example
                                                        )}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        Test
                                                    </button>
                                                </div>
                                                <CodeBlock
                                                    code={JSON.stringify(endpoint.example, null, 2)}
                                                    id={`${endpoint.id}-request`}
                                                />
                                            </div>
                                        )}

                                        {/* Example Response */}
                                        <div className="mb-8">
                                            <h4 className="text-lg font-semibold text-white mb-4">Example Response</h4>
                                            <CodeBlock
                                                code={JSON.stringify(endpoint.response, null, 2)}
                                                id={`${endpoint.id}-response`}
                                            />
                                        </div>

                                        {/* Test Results */}
                                        {testResults[endpoint.id] && (
                                            <div className="mb-4">
                                                <h4 className="text-lg font-semibold text-white mb-4">Test Result</h4>
                                                <div className={`p-4 rounded-lg border ${
                                                    testResults[endpoint.id].error 
                                                        ? 'bg-red-500/10 border-red-500/30' 
                                                        : 'bg-green-500/10 border-green-500/30'
                                                }`}>
                                                    <CodeBlock
                                                        code={JSON.stringify(testResults[endpoint.id], null, 2)}
                                                        id={`${endpoint.id}-test-result`}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* cURL Example */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">cURL Example</h4>
                                            <CodeBlock
                                                code={endpoint.method === 'POST' 
                                                    ? `curl -X POST https://codexhash.io${endpoint.path} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.example, null, 2)}'`
                                                    : `curl -X GET https://codexhash.io${endpoint.path}`
                                                }
                                                language="bash"
                                                id={`${endpoint.id}-curl`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Error Codes Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8">Error Codes</h2>
                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="text-left p-4 text-white font-semibold">Status Code</th>
                                    <th className="text-left p-4 text-white font-semibold">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr>
                                    <td className="p-4 text-green-400 font-mono">200</td>
                                    <td className="p-4 text-slate-300">OK - Request successful</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-yellow-400 font-mono">400</td>
                                    <td className="p-4 text-slate-300">Bad Request - Invalid input parameters</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-orange-400 font-mono">413</td>
                                    <td className="p-4 text-slate-300">Payload Too Large - Input exceeds 1MB limit</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-red-400 font-mono">500</td>
                                    <td className="p-4 text-slate-300">Internal Server Error - Server processing error</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SDK Section */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-8">SDK & Libraries</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">JavaScript/TypeScript SDK</h3>
                            <CodeBlock 
                                code="npm install @web3connected/codexhash" 
                                language="bash" 
                                id="npm-install" 
                            />
                            <div className="mt-4">
                                <CodeBlock 
                                    code={`import { HarmonicHash } from '@web3connected/codexhash'

const hasher = new HarmonicHash()
const result = hasher.hash('Hello World')`}
                                    language="typescript"
                                    id="sdk-example"
                                />
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Direct API Usage</h3>
                            <p className="text-slate-300 mb-4">
                                Use the REST API directly from any programming language or environment.
                            </p>
                            <CodeBlock 
                                code={`fetch('https://codexhash.io/api/hash', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'Hello World' })
})`}
                                language="javascript"
                                id="direct-api"
                            />
                        </div>
                    </div>
                </section>
                </div>
            </div>
        </PageLayout>
    )
}

export default APIDocumentationPage
