import React from 'react';
import type { SDKCard } from '@/components/codex/shared/panels/FeatureCardGrid';

export const codexHashSDKs: SDKCard[] = [
  {
    name: 'JavaScript SDK',
    language: 'JavaScript / TypeScript',
    icon: (
      <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.086.567.327.733.663.755-.506.755-.506 1.286-.846-.191-.3-.293-.436-.42-.565-.497-.544-1.165-.811-2.243-.779l-.553.074c-.535.135-1.046.404-1.342.812-.89 1.16-.629 3.185.429 4.019 1.047.82 2.584.943 2.772 1.672.184.684-.387 1.107-1.212 1.019-.587-.053-.916-.326-1.268-.838l-1.247.765c.229.467.451.701.761 1.003.943.853 3.333.93 3.76-.502.015-.053.085-.245.056-.666-.023-.333-.227-.695-.227-.695zM12.143 13.524v3.116c0 .638-.028 1.208-.047 1.387-.07.391-.316.473-.642.473-.346 0-.5-.237-.666-.549-.117-.215-.13-.246-.173-.399l-1.234.762c.195.49.45.895.738 1.14.668.564 1.566.577 2.231.261.577-.266.812-.671.949-1.28.072-.31.078-1.061.078-1.061l.007-4.849h-1.241z" />
      </svg>
    ),
    description: 'Full-featured SDK for Node.js and browser environments with TypeScript support.',
    version: '2.1.0',
    href: '/sdk',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    name: 'Python SDK',
    language: 'Python 3.8+',
    icon: (
      <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 11.936 3C7.362 3 7.647 4.983 7.647 4.983l.006 2.055h4.363v.617H5.92s-2.927-.332-2.927 4.282c0 4.614 2.554 4.45 2.554 4.45h1.524v-2.141s-.083-2.554 2.514-2.554zm-.202-5.42a.805.805 0 110-1.61.805.805 0 010 1.61z" />
        <path d="M18.452 7.532h-1.524v2.141s.083 2.554-2.514 2.554h-4.328s-2.432-.039-2.432 2.35v3.951s-.369 2.391 4.409 2.391c4.574 0 4.289-1.983 4.289-1.983l-.006-2.055h-4.363v-.617h6.097s2.927.332 2.927-4.282c0-4.614-2.555-4.45-2.555-4.45zm-4.025 10.869a.805.805 0 110 1.61.805.805 0 010-1.61z" />
      </svg>
    ),
    description: 'Native Python implementation with async support and type hints.',
    version: '2.0.3',
    href: '/sdk',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    name: 'Go SDK',
    language: 'Go 1.19+',
    icon: (
      <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 12.1c0-.3.2-.5.4-.6l2.6-1.5c.4-.2.8 0 .8.5v2.9c0 .5-.4.7-.8.5L2.4 12.7c-.2-.1-.4-.3-.4-.6zM10 8c0-.3.2-.5.4-.6l2.6-1.5c.4-.2.8 0 .8.5v2.9c0 .5-.4.7-.8.5L10.4 8.6c-.2-.1-.4-.3-.4-.6zm2 5c0-.3.2-.5.4-.6l2.6-1.5c.4-.2.8 0 .8.5v2.9c0 .5-.4.7-.8.5l-2.6-1.5c-.2-.1-.4-.3-.4-.6zm5-3c0-.3.2-.5.4-.6l2.6-1.5c.4-.2.8 0 .8.5v2.9c0 .5-.4.7-.8.5l-2.6-1.5c-.2-.1-.4-.3-.4-.6z" />
      </svg>
    ),
    description: 'High-performance Go module with zero external dependencies.',
    version: '1.9.0',
    href: '/sdk',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    name: 'Rust SDK',
    language: 'Rust 1.70+',
    icon: (
      <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
    description: 'Memory-safe implementation with zero-copy operations for maximum performance.',
    version: '1.5.2',
    href: '/sdk',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  {
    name: 'REST API',
    language: 'HTTP / JSON',
    icon: (
      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    description: 'Platform-agnostic REST API for any language or platform.',
    version: '2',
    href: '/api-explorer',
    badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  {
    name: 'CLI Tool',
    language: 'Command Line',
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    description: 'Command-line interface for scripting and CI/CD integration.',
    version: '2.0.1',
    href: '/sdk',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
];
