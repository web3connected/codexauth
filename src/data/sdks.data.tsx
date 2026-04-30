import React from 'react';
import type { SDKCard } from '@/components/codex/shared/panels/FeatureCardGrid';

export const codexHashSDKs: SDKCard[] = [
  {
    name: 'JavaScript / TypeScript SDK',
    language: 'JavaScript / TypeScript',
    icon: (
      <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.086.567.327.733.663.755-.506.755-.506 1.286-.846-.191-.3-.293-.436-.42-.565-.497-.544-1.165-.811-2.243-.779l-.553.074c-.535.135-1.046.404-1.342.812-.89 1.16-.629 3.185.429 4.019 1.047.82 2.584.943 2.772 1.672.184.684-.387 1.107-1.212 1.019-.587-.053-.916-.326-1.268-.838l-1.247.765c.229.467.451.701.761 1.003.943.853 3.333.93 3.76-.502.015-.053.085-.245.056-.666-.023-.333-.227-.695-.227-.695zM12.143 13.524v3.116c0 .638-.028 1.208-.047 1.387-.07.391-.316.473-.642.473-.346 0-.5-.237-.666-.549-.117-.215-.13-.246-.173-.399l-1.234.762c.195.49.45.895.738 1.14.668.564 1.566.577 2.231.261.577-.266.812-.671.949-1.28.072-.31.078-1.061.078-1.061l.007-4.849h-1.241z" />
      </svg>
    ),
    description:
      'Official SDK for Node.js and browser. Full TypeScript types, login, token refresh, zone checks, and protected API helpers.',
    version: '1.0.0',
    href: '/sdk',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    name: 'REST API',
    language: 'HTTP / JSON',
    icon: (
      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    description:
      'Language-agnostic HTTP API at codexauth.web3connected.com/api. Authenticate from any stack, framework, or platform.',
    version: 'v1',
    href: '/docs',
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
    description:
      'CLI for scripting auth flows, token introspection, and CI/CD integration. Available via npm or as a standalone binary.',
    version: '1.0.0',
    href: '/sdk',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
];
