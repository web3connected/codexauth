import React from 'react'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {(title || description) && (
        <div className="container mx-auto px-4 py-12">
          {title && (
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-xl text-slate-300 max-w-3xl">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
