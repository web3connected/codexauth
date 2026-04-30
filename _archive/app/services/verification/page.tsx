import PageLayout from '@/components/layout/PageLayout'
import VerificationService from '@/components/services/VerificationService'

export default function VerificationPage() {
  return (
    <PageLayout>
      <VerificationService />
    </PageLayout>
  )
}

export const metadata = {
  title: 'Hash Verification Service - CodexHash',
  description: 'Verify quantum-resistant hashes with CodexHash verification service. Test hash integrity and quantum resistance levels.',
}