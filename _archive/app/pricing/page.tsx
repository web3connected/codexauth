import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TopBar from '@/components/common/TitleBar';
import { Clock, Bell, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-slate-950">
        <TopBar
          title="CodexHash Pricing"
          description="Quantum-resistant hashing solutions for every scale"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Pricing', href: '/pricing' }
          ]}
        />

        {/* Coming Soon Banner */}
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500/20 rounded-full p-4">
                  <Clock className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Pricing Plans Coming Soon</h1>
              <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
                We&apos;re finalizing our quantum-resistant pricing tiers to ensure optimal value for 
                enterprises, developers, and organizations requiring advanced cryptographic security.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <Bell className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
                  <p className="text-slate-300 text-sm">
                    Join our waitlist for exclusive early access to pricing plans and special launch discounts.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Enterprise Ready</h3>
                  <p className="text-slate-300 text-sm">
                    Scalable solutions from startups to Fortune 500 companies with flexible pricing models.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Launch Timeline</h3>
                  <p className="text-slate-300 text-sm">
                    Pricing plans will be available Q4 2025 with beta access starting soon.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">What to Expect</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-2 text-slate-300">
                    <li>• Developer-friendly API pricing</li>
                    <li>• Volume-based enterprise discounts</li>
                    <li>• Quantum resistance tiers (256-bit to 1024-bit)</li>
                    <li>• Industry-specific security packages</li>
                  </ul>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Pay-per-hash and subscription models</li>
                    <li>• Free tier for developers and researchers</li>
                    <li>• Custom enterprise solutions</li>
                    <li>• 24/7 support for critical applications</li>
                  </ul>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Join Waitlist for Early Access
              </button>
            </div>
          </div>         
        </div>
      </div>
    </PageLayout>
  );
}
