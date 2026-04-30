'use client'

import React from 'react'
import Link from 'next/link'

interface SDK {
  name: string
  language: string
  icon: React.ReactNode
  description: string
  version: string
  href: string
  badgeColor: string
}

const sdks: SDK[] = [
  {
    name: 'JavaScript SDK',
    language: 'JavaScript / TypeScript',
    icon: <JavaScriptIcon />,
    description: 'Full-featured SDK for Node.js and browser environments with TypeScript support.',
    version: '2.1.0',
    href: '/sdks/javascript',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  },
  {
    name: 'Python SDK',
    language: 'Python 3.8+',
    icon: <PythonIcon />,
    description: 'Native Python implementation with async support and type hints.',
    version: '2.0.3',
    href: '/sdks/python',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    name: 'Go SDK',
    language: 'Go 1.19+',
    icon: <GoIcon />,
    description: 'High-performance Go module with zero external dependencies.',
    version: '1.9.0',
    href: '/sdks/go',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  {
    name: 'Rust SDK',
    language: 'Rust 1.70+',
    icon: <RustIcon />,
    description: 'Memory-safe implementation with zero-copy operations for maximum performance.',
    version: '1.5.2',
    href: '/sdks/rust',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  },
  {
    name: 'REST API',
    language: 'HTTP / JSON',
    icon: <ApiIcon />,
    description: 'Platform-agnostic REST API for any language or platform.',
    version: 'v2',
    href: '/docs/api',
    badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20'
  },
  {
    name: 'CLI Tool',
    language: 'Command Line',
    icon: <CliIcon />,
    description: 'Command-line interface for scripting and CI/CD integration.',
    version: '2.0.1',
    href: '/sdks/cli',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
]

/**
 * SDKsOverviewPanel - Grid of available SDKs with quick links
 */
export default function SDKsOverviewPanel() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-hash-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            SDKs & Tools
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Official libraries for every major platform and language
          </p>
        </div>

        {/* SDK Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sdks.map((sdk) => (
            <SDKCard key={sdk.name} sdk={sdk} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/sdks"
            className="inline-flex items-center gap-2 text-hash-primary hover:text-hash-primary/80 font-medium transition-colors"
          >
            View all SDKs & Documentation
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function SDKCard({ sdk }: { sdk: SDK }) {
  return (
    <Link
      href={sdk.href}
      className="group block p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-hash-primary/30 hover:scale-[1.02]"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-hash-primary/20 transition-colors">
          {sdk.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-hash-primary transition-colors">
            {sdk.name}
          </h3>
          <p className="text-sm text-slate-500">{sdk.language}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {sdk.description}
      </p>

      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${sdk.badgeColor}`}>
          v{sdk.version}
        </span>
        <span className="text-sm text-slate-500 group-hover:text-hash-primary transition-colors flex items-center gap-1">
          Learn more
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

// Icon Components
function JavaScriptIcon() {
  return (
    <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.086.567.327.733.663.755-.506.755-.506 1.286-.846-.191-.3-.293-.436-.42-.565-.497-.544-1.165-.811-2.243-.779l-.553.074c-.535.135-1.046.404-1.342.812-.89 1.16-.629 3.185.429 4.019 1.047.82 2.584.943 2.772 1.672.184.684-.387 1.107-1.212 1.019-.587-.053-.916-.326-1.268-.838l-1.247.765c.229.467.451.701.761 1.003.943.853 3.333.93 3.76-.502.015-.053.085-.245.056-.666-.023-.333-.227-.695-.227-.695zM12.143 13.524v3.116c0 .638-.028 1.208-.047 1.387-.07.391-.316.473-.642.473-.346 0-.5-.237-.666-.549-.117-.215-.13-.246-.173-.399l-1.234.762c.195.49.45.895.738 1.14.668.564 1.566.577 2.231.261.577-.266.812-.671.949-1.28.072-.31.078-1.061.078-1.061l.007-4.849h-1.241z"/>
    </svg>
  )
}

function PythonIcon() {
  return (
    <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 11.936 3C7.362 3 7.647 4.983 7.647 4.983l.006 2.055h4.363v.617H5.92s-2.927-.332-2.927 4.282c0 4.614 2.554 4.45 2.554 4.45h1.524v-2.141s-.083-2.554 2.514-2.554zm-.202-5.42a.805.805 0 110-1.61.805.805 0 010 1.61z"/>
      <path d="M18.452 7.532h-1.524v2.141s.083 2.554-2.514 2.554h-4.328s-2.432-.039-2.432 2.35v3.951s-.369 2.391 4.409 2.391c4.574 0 4.289-1.983 4.289-1.983l-.006-2.055h-4.363v-.617h6.097s2.927.332 2.927-4.282c0-4.614-2.555-4.45-2.555-4.45zm-4.025 10.869a.805.805 0 110 1.61.805.805 0 010-1.61z"/>
    </svg>
  )
}

function GoIcon() {
  return (
    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.811 10.715l-.047-.028-.015-.047c-.003-.01 0-.023.013-.039l.028-.043.042-.056c.014-.019.03-.04.047-.063l.116-.147.045-.055c.03-.037.047-.046.054-.046h.034l.063.015.045.013.054.02c.026.01.06.022.102.037l.143.055.043.018.025.014.035.025c.02.015.036.032.046.053l.012.029c.003.014.003.03 0 .049l-.006.039-.015.065-.043.138-.116.365-.047.145-.024.068-.012.032-.009.028-.014.056-.028.133c-.01.048-.022.1-.036.158l-.02.094-.012.055-.015.073-.019.104-.012.084a.82.82 0 00-.012.132l-.003.102.003.062.012.071.012.05.033.088.015.03.012.015.006.009.042.06c.014.02.037.048.07.083l.09.095.032.03.075.06c.023.018.045.033.066.044l.025.012c.01.003.015.003.015-.001l.003-.023-.003-.052-.015-.12-.012-.124-.01-.132-.012-.223-.004-.102.01-.186.015-.18.025-.156.044-.222.072-.295.054-.162.062-.156.055-.12.082-.141.056-.078.045-.052.034-.034.038-.03.097-.054.15-.06.078-.024.05-.01.064-.009.037.003.032.006.033.012.153.072.15.087.14.102.066.058.203.206.18.222.135.21.107.196.045.101.043.113.04.13.023.111.012.091-.003.158-.022.16-.033.12-.09.253-.108.239-.076.134-.14.222-.097.132-.04.05c-.02.024-.04.047-.064.07l-.072.07-.15.125-.188.132-.192.117-.042.022-.02.01-.035.015-.158.06-.164.05-.05.012-.066.013h-.137l-.045-.006-.042-.009-.07-.022-.136-.055-.238-.117-.094-.055-.083-.06-.066-.055-.1-.097-.095-.113-.088-.126-.042-.068-.035-.067-.03-.07-.026-.074-.023-.082-.019-.093-.015-.104-.012-.116a1.786 1.786 0 01-.012-.254l.012-.186.026-.205.046-.214.075-.258.075-.201.091-.196.13-.238.082-.124.082-.112.138-.158.048-.045.05-.042.106-.076.202-.115zm14.466 0l-.047-.028-.015-.047a.06.06 0 01.013-.039l.028-.043.042-.056.047-.063.117-.147.044-.055c.03-.037.047-.046.055-.046h.033l.063.015.046.013.053.02.102.037.143.055.043.018.026.014.034.025a.17.17 0 01.046.053l.013.029a.12.12 0 010 .049l-.007.039-.015.065-.043.138-.116.365-.046.145-.025.068-.012.032-.009.028-.014.056-.028.133a3.52 3.52 0 00-.036.158l-.019.094-.012.055-.016.073-.018.104-.012.084a.82.82 0 00-.012.132l-.003.102.003.062.012.071.012.05.033.088.015.03.012.015.006.009.042.06c.014.02.037.048.07.083l.09.095.032.03.075.06c.023.018.044.033.065.044l.026.012c.01.003.015.003.015-.001l.003-.023-.003-.052-.015-.12-.012-.124-.009-.132-.012-.223-.004-.102.01-.186.015-.18.025-.156.044-.222.072-.295.053-.162.063-.156.054-.12.082-.141.056-.078.046-.052.033-.034.038-.03.097-.054.15-.06.078-.024.05-.01.064-.009.037.003.032.006.033.012.153.072.15.087.14.102.067.058.202.206.18.222.135.21.107.196.046.101.042.113.04.13.024.111.012.091-.003.158-.022.16-.034.12-.089.253-.108.239-.076.134-.14.222-.097.132-.04.05a.742.742 0 01-.064.07l-.072.07-.15.125-.188.132-.192.117-.042.022-.02.01-.035.015-.158.06-.164.05-.05.012-.066.013h-.137l-.046-.006-.041-.009-.07-.022-.137-.055-.238-.117-.093-.055-.084-.06-.065-.055-.1-.097-.096-.113-.088-.126-.041-.068-.035-.067-.03-.07-.026-.074-.024-.082-.018-.093-.015-.104-.012-.116a1.786 1.786 0 01-.013-.254l.013-.186.025-.205.046-.214.076-.258.075-.201.09-.196.131-.238.082-.124.082-.112.138-.158.047-.045.05-.042.107-.076.202-.115zM7.916 6.802l-.098.099-.058.066-.052.068-.04.063-.046.085-.04.09-.026.068-.034.13-.012.078-.006.071v.09l.01.089.018.091.026.087.033.08.04.075.026.041.055.075.067.078.079.076.09.072.1.065.11.056.06.025.122.042.13.036.138.03.097.015.15.016.093.006.098.003.206-.003.196-.016.186-.028.176-.04.166-.054.108-.044.095-.046.084-.049.148-.102.1-.084.04-.04.077-.085.043-.055.074-.112.061-.115.024-.06.04-.116.037-.139.024-.128.015-.128.01-.139.003-.114-.006-.12-.012-.105-.016-.083-.034-.114-.038-.094-.041-.08-.036-.058-.046-.063-.061-.072-.037-.038a1.737 1.737 0 00-.288-.225l-.105-.063-.108-.054-.111-.046-.114-.038-.116-.03-.12-.023-.12-.016-.125-.01-.064-.003h-.127l-.135.006-.136.012-.135.02-.135.026-.116.03-.127.046-.119.052-.055.03-.101.062-.092.066-.042.033-.08.072-.07.071-.032.037-.06.076z"/>
    </svg>
  )
}

function RustIcon() {
  return (
    <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.8344 11.4941l-1.1884-.4858a10.729 10.729 0 00-.0746-.2923l.9532-.7743a.3654.3654 0 00-.0062-.5667l-1.0574-.8432a10.846 10.846 0 00-.1463-.2755l.6966-1.0143a.3654.3654 0 00-.1644-.536l-1.1823-.512a10.771 10.771 0 00-.2085-.2499l.414-1.1926a.3654.3654 0 00-.3131-.4813l-1.2568-.1658a10.815 10.815 0 00-.2616-.2154l.1158-1.2994a.3654.3654 0 00-.4441-.4038l-1.2748.1867a10.74 10.74 0 00-.3031-.1713l-.1853-1.3314a.3654.3654 0 00-.5558-.2945l-1.205.5379a10.763 10.763 0 00-.334-.1199l-.4835-1.2857a.3654.3654 0 00-.6404-.1646l-1.0674.8537a10.792 10.792 0 00-.3539-.0581l-.7683-1.164a.3654.3654 0 00-.6913-.0266l-.8656 1.1184a10.819 10.819 0 00-.3593.0246l-1.0267-.9668a.3654.3654 0 00-.7012.1153l-.6168 1.3175a10.76 10.76 0 00-.3443.1028l-1.2434-.7068a.3654.3654 0 00-.6646.2584l-.3325 1.44a10.791 10.791 0 00-.3116.1775l-1.4145-.3956a.3654.3654 0 00-.5822.3868l-.0317 1.4815a10.796 10.796 0 00-.262.2452l-1.5287-.0687a.3654.3654 0 00-.4553.4943l.2706 1.447a10.764 10.764 0 00-.198.3009l-1.5804.2578a.3654.3654 0 00-.2956.5827l.5626 1.3326a10.82 10.82 0 00-.122.3413l-1.5624.5756a.3654.3654 0 00-.1159.6437l.8314 1.1454a10.77 10.77 0 00-.0397.3587l-1.4756.877a.3654.3654 0 00.064.6709l1.0608.8846a10.789 10.789 0 00.043.3591l-1.3264 1.1542a.3654.3654 0 00.24.6599l1.2372.5573a10.8 10.8 0 00.1257.3445l-1.1178 1.3975a.3654.3654 0 00.4057.6132l1.3541.1936a10.772 10.772 0 00.2029.3131l-.8576 1.5992a.3654.3654 0 00.5549.5261l1.4089-.1854a10.783 10.783 0 00.2725.267l-.5599 1.7469a.3654.3654 0 00.6726.3841l1.3951-.5553a10.768 10.768 0 00.3299.2068l-.2378 1.832a.3654.3654 0 00.7533.1919l1.3096-.8996a10.811 10.811 0 00.3736.1326l.0913 1.8488a.3654.3654 0 00.7931-.0271l1.1558-1.2058a10.83 10.83 0 00.4011.0473l.4173 1.7964a.3654.3654 0 00.7903-.2457l.9413-1.4648a10.792 10.792 0 00.4096-.0422l.7304 1.676a.3654.3654 0 00.7457-.4553l.6698-1.6704a10.768 10.768 0 00.3972-.1283l1.0205 1.4896a.3654.3654 0 00.6618-.6533l.3512-1.8115a10.793 10.793 0 00.363-.208l1.277 1.2466a.3654.3654 0 00.5416-.8296l.0024-1.8768a10.783 10.783 0 00.309-.2808l1.4912.9497a.3654.3654 0 00.3882-.9759l-.3592-1.8573a10.79 10.79 0 00.2376-.343l1.6552.6077a.3654.3654 0 00.2078-1.0856l-.7159-1.7536a10.794 10.794 0 00.1511-.3909l1.7607.2293a.3654.3654 0 00.014-1.1538l-1.0536-1.5692a10.78 10.78 0 00.054-.4181l1.8005-.1608a.3654.3654 0 00-.1826-1.1684zm-6.595 4.5155c-1.4133 2.5014-4.5966 3.394-7.1074 1.9937-2.511-1.4003-3.4043-4.5788-1.9948-7.08 1.4095-2.5014 4.5898-3.3943 7.1006-1.9938 2.511 1.4002 3.4092 4.5787 2.0016 7.08z"/>
    </svg>
  )
}

function ApiIcon() {
  return (
    <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function CliIcon() {
  return (
    <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
