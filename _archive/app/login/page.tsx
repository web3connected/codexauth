import LoginForm from '@/components/forms/LoginForm'

/**
 * Login Page - CodexAuth System
 * Uses "secret" field (NOT password) for authentication
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* Decorative blur elements */}
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute bottom-0 right-[-8%] w-[250px] h-[300px] bg-hash-secondary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute top-[20%] right-[10%] w-[200px] h-[250px] bg-hash-accent/20 rounded-full blur-[90px] z-[1]" />

      <div className="container mx-auto px-4 py-20 relative z-[2]">
        <div className="grid grid-cols-12 gap-6 items-center min-h-[calc(100vh-180px)]">
          {/* Login Form */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Welcome Back
              </h2>

              {/* Form */}
              <LoginForm />

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
                      Your secret is protected with CodexHash quantum-resistant hashing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Illustration/Info */}
          <div className="hidden lg:flex col-span-6 items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-hash-primary/20 to-hash-secondary/20 flex items-center justify-center border border-hash-primary/30">
                  <svg className="w-16 h-16 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Quantum-Resistant Security
              </h3>
              <p className="text-slate-400">
                CodexHash uses advanced harmonic hashing with temporal intravel units (TIU) 
                to protect your credentials against current and future computing threats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

