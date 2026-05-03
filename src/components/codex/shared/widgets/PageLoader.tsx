'use client'

import React from 'react'
import ApplicationLogo from './ApplicationLogo'

export interface PageLoaderProps {
  message?: string
  showLogo?: boolean
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...", 
  showLogo = true 
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo Section */}
        {showLogo && (
          <div className="animate-pulse">
            <ApplicationLogo logo="CodexHash" showIcon={true} />
          </div>
        )}

        {/* Loading Animation */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full"></div>
          </div>
          
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-white font-medium text-lg">{message}</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default PageLoader
