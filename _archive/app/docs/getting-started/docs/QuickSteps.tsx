import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ACCOUNTS_URL = process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? '/register'

const steps = [
  {
    number: 1,
    title: 'Create an Account',
    description: 'Sign up for a free developer account to get access to the CodexHash API.',
    link: ACCOUNTS_URL,
    linkText: 'Create Account',
  },
  {
    number: 2,
    title: 'Get API Access',
    description: 'Access the REST API directly or use the official TypeScript SDK.',
    link: '/sdk',
    linkText: 'View SDK & API',
  },
  {
    number: 3,
    title: 'Make Your First Request',
    description: 'Create your first hash event using the API.',
    link: '#first-hash',
    linkText: 'See Example',
  },
  {
    number: 4,
    title: 'Verify & Build',
    description: 'Verify hash chain integrity and integrate into your application.',
    link: '/docs/api-reference',
    linkText: 'API Reference',
  },
]

export default function QuickSteps() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6">Quick Start Steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 relative group hover:border-hash-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-hash-primary/20 border border-hash-primary/30 flex items-center justify-center text-hash-primary font-bold mb-4">
              {step.number}
            </div>
            <h3 className="font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{step.description}</p>
            <Link
              href={step.link}
              target={step.link.startsWith('http') ? '_blank' : undefined}
              rel={step.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1 text-sm text-hash-primary hover:underline"
            >
              {step.linkText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
