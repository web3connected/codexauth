import React from 'react'

interface TitleBarProps {
  title: string
  subtitle?: string
  description?: string
  breadcrumbs?: { label: string; href: string }[]
  className?: string
}

export default function TitleBar({ title, subtitle, description, breadcrumbs, className = '' }: TitleBarProps) {
  return (
    <div className={`bg-gradient-to-r from-purple-900/50 to-slate-900/50 border-b border-purple-500/20 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <a href={crumb.href} className="hover:text-purple-300 transition-colors">
                  {crumb.label}
                </a>
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-slate-300">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-lg text-slate-300 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
