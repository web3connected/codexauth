import RegistrationForm from '@/components/forms/RegistrationForm'

/**
 * Register Page - CodexAuth System
 * Creates account with "secret" field (NOT password)
 * Generates codex hash with quantum-resistant hashing
 */
export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* Decorative blur elements */}
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute bottom-0 right-[-8%] w-[250px] h-[300px] bg-hash-secondary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute top-[20%] right-[10%] w-[200px] h-[250px] bg-hash-accent/20 rounded-full blur-[90px] z-[1]" />

      <div className="container mx-auto px-4 py-20 relative z-[2]">
        <div className="grid grid-cols-12 gap-6 items-center min-h-[calc(100vh-180px)]">
          {/* Registration Form */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Create Account
              </h2>

              {/* Form */}
              <RegistrationForm />

              {/* CodexAuth Badge */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-start gap-3 text-xs text-slate-500">
                  <svg
                    className="w-5 h-5 text-hash-primary flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-400">
                      Secured by CodexAuth
                    </p>
                    <p className="mt-1">
                      Your secret generates CodexHash with TIU temporal binding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="hidden lg:flex col-span-6 items-center justify-center">
            <div className="max-w-md space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                Developer Benefits
              </h3>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">SDK Access</h4>
                  <p className="text-sm text-slate-400">Full access to JavaScript, Python, Go, and Rust SDKs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">API Keys</h4>
                  <p className="text-sm text-slate-400">Generate and manage your API keys from the dashboard</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Usage Analytics</h4>
                  <p className="text-sm text-slate-400">Monitor your API usage and performance metrics</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Priority Support</h4>
                  <p className="text-sm text-slate-400">Access to developer community and support channels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
