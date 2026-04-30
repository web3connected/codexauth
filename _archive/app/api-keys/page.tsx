'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Key, Plus, Copy, Check, Trash2, Eye, EyeOff, AlertTriangle, Shield, Clock } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  createdAt: Date
  lastUsed: Date | null
  permissions: string[]
  status: 'active' | 'revoked'
}

// Mock data for demonstration
const mockApiKeys: ApiKey[] = []

export default function ApiKeysPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isLoading, isAuthenticated, router])

  if (isLoading || !mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-hash-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const createApiKey = () => {
    if (!newKeyName.trim()) return

    // Generate mock API key
    const keyPrefix = 'chash_'
    const keyBody = Array.from({ length: 32 }, () => 
      'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
    ).join('')
    const fullKey = keyPrefix + keyBody

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: fullKey,
      prefix: keyPrefix + keyBody.substring(0, 8) + '...',
      createdAt: new Date(),
      lastUsed: null,
      permissions: ['hash:create', 'hash:verify'],
      status: 'active'
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeySecret(fullKey)
    setNewKeyName('')
  }

  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== keyId))
  }

  const revokeApiKey = (keyId: string) => {
    setApiKeys(apiKeys.map(k => 
      k.id === keyId ? { ...k, status: 'revoked' as const } : k
    ))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* Decorative blur elements */}
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute top-[20%] right-[-8%] w-[250px] h-[300px] bg-hash-secondary/30 rounded-full blur-[100px] z-[1]" />

      <div className="container mx-auto px-4 py-12 relative z-[2]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
            <p className="text-slate-400">Manage your CodexHash API keys</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-hash-primary hover:bg-hash-primary/80 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Key
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-semibold">Keep your API keys secure</p>
              <p className="text-sm text-yellow-500/80">
                Never share your API keys publicly or expose them in client-side code. Use environment variables to store keys securely.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        {apiKeys.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center">
              <Key className="w-8 h-8 text-hash-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No API keys yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first API key to start using the CodexHash API in your applications.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-hash-primary hover:bg-hash-primary/80 text-white font-semibold rounded-lg transition-colors"
            >
              Create Your First Key
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className={`bg-slate-800/50 backdrop-blur-xl border rounded-xl p-6 ${
                  apiKey.status === 'revoked' ? 'border-red-500/30 opacity-60' : 'border-slate-700/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      apiKey.status === 'revoked' 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-hash-primary/10 border border-hash-primary/20'
                    }`}>
                      <Key className={`w-6 h-6 ${apiKey.status === 'revoked' ? 'text-red-500' : 'text-hash-primary'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{apiKey.name}</h3>
                        {apiKey.status === 'revoked' && (
                          <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">Revoked</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono text-slate-400">
                          {showKey === apiKey.id ? apiKey.key : apiKey.prefix}
                        </code>
                        <button
                          onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                        >
                          {showKey === apiKey.id ? (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                        >
                          {copiedKey === apiKey.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created {apiKey.createdAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {apiKey.permissions.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apiKey.status === 'active' && (
                      <button
                        onClick={() => revokeApiKey(apiKey.id)}
                        className="px-4 py-2 text-sm bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 rounded-lg transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                    <button
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-sm text-slate-500 mb-2">Total Keys</h3>
            <p className="text-3xl font-bold text-white">{apiKeys.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-sm text-slate-500 mb-2">Active Keys</h3>
            <p className="text-3xl font-bold text-green-400">
              {apiKeys.filter(k => k.status === 'active').length}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-sm text-slate-500 mb-2">API Calls (30d)</h3>
            <p className="text-3xl font-bold text-hash-primary">0</p>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            {newKeySecret ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">API Key Created!</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Make sure to copy your API key now. You won&apos;t be able to see it again.
                  </p>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-hash-primary break-all">{newKeySecret}</code>
                    <button
                      onClick={() => copyToClipboard(newKeySecret, 'new')}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors flex-shrink-0"
                    >
                      {copiedKey === 'new' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewKeySecret(null)
                  }}
                  className="w-full px-4 py-3 bg-hash-primary hover:bg-hash-primary/80 text-white font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-6">Create New API Key</h2>
                
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-hash-primary"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Give your key a descriptive name to identify it later.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createApiKey}
                    disabled={!newKeyName.trim()}
                    className="flex-1 px-4 py-3 bg-hash-primary hover:bg-hash-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    Create Key
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
