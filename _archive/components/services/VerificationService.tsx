import React from 'react'
import PageLayout from '@/components/layout/PageLayout'

export default function VerificationService() {
  return (
    <PageLayout title="Verification Service" description="Verify data integrity with quantum-resistant hashing">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Verification</h2>
            <p className="text-slate-300 mb-6">
              Our verification service ensures data integrity using quantum-resistant hashing algorithms.
              Perfect for document verification, blockchain validation, and secure data transfer.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">✓ Instant Verification</h3>
                <p className="text-slate-400 text-sm">
                  Verify data integrity in milliseconds
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">✓ Quantum Safe</h3>
                <p className="text-slate-400 text-sm">
                  Future-proof against quantum attacks
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">✓ Timestamped</h3>
                <p className="text-slate-400 text-sm">
                  Every verification includes temporal context
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">✓ API Ready</h3>
                <p className="text-slate-400 text-sm">
                  Easy integration with REST and GraphQL APIs
                </p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <a 
              href="/#signup" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
