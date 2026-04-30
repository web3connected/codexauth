import Link from 'next/link'
import { Book, Code, Key } from 'lucide-react'

export default function NextStepsSection() {
  return (
    <div className="bg-gradient-to-r from-hash-primary/20 to-hash-secondary/20 border border-hash-primary/30 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-4">Next Steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/docs" className="group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Book className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-hash-primary transition-colors">Full Documentation</h3>
              <p className="text-sm text-slate-400">Explore the complete API reference</p>
            </div>
          </div>
        </Link>

        <Link href="/sdk" className="group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-hash-primary transition-colors">SDK Downloads</h3>
              <p className="text-sm text-slate-400">Get SDKs for all platforms</p>
            </div>
          </div>
        </Link>

        <Link href="/api-keys" className="group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-hash-primary transition-colors">API Keys</h3>
              <p className="text-sm text-slate-400">Create and manage your keys</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
