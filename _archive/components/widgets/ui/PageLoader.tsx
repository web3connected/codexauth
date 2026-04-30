'use client'

export interface PageLoaderProps {
  message?: string
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        <div className="text-2xl font-bold text-white">CodexHash</div>
        <p className="text-sm text-slate-300">{message}</p>
      </div>
    </div>
  )
}
