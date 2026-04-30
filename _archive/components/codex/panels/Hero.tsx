"use client";

import React from "react";
import Image from "next/image";

/**
 * HeroData - Data structure for Hero component
 */
export interface HeroData {
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  };
  badge?: {
    icon: string;
    text: string;
  };
  heading: {
    line1: string;
    line2: string; // This will be gradient styled
  };
  subheading: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary?: {
      text: string;
      href: string;
    };
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  gradient?: {
    from: string;
    via: string;
    to: string;
  };
  badgeGradient?: string;
  textGradient?: string;
  buttonGradient?: string;
}

/**
 * Hero - Universal hero section component
 * 
 * Reusable hero component that accepts data configuration.
 * Structure is fixed, content is customizable per service.
 */
interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const {
    logo,
    badge,
    heading,
    subheading,
    cta,
    stats,
    gradient = { from: "slate-900", via: "purple-900", to: "slate-900" },
    badgeGradient = "purple",
    textGradient = "from-purple-400 to-pink-400",
    buttonGradient = "from-purple-600 to-pink-600",
  } = data;

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-${badgeGradient}-600/20 via-slate-900/50 to-slate-900`}
      ></div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          {logo && (
            <div className="mb-8 flex justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 200}
                height={logo.height || 200}
                className={logo.className || "w-auto h-32 lg:h-40"}
                priority
              />
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-${badgeGradient}-500/10 border border-${badgeGradient}-500/30 rounded-full mb-8`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className={`text-${badgeGradient}-300 font-medium`}>
                {badge.text}
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {heading.line1}
            <span
              className={`block bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}
            >
              {heading.line2}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {subheading}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={cta.primary.href}
              className={`px-8 py-4 bg-gradient-to-r ${buttonGradient} text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-${badgeGradient}-500/50 transition-all duration-300 transform hover:scale-105`}
            >
              {cta.primary.text}
            </a>
            {cta.secondary && (
              <a
                href={cta.secondary.href}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                {cta.secondary.text}
              </a>
            )}
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div
              className={`grid grid-cols-${stats.length} gap-8 mt-20 max-w-2xl mx-auto`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`text-3xl lg:text-4xl font-bold text-${badgeGradient}-400 mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
