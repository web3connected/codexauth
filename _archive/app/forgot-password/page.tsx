'use client';

import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-6xl mb-6">🔑</div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Coming Soon
          </h1>
          
          <p className="text-slate-300 mb-8">
            Password reset functionality will be available at launch. 
            Join our pre-launch to get early access!
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/#signup')}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              Join Pre-Launch
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
