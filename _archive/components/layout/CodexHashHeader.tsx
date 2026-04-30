"use client";

import React from "react";
import Link from "next/link";
import { GlobalHeader } from "../codex/panels";
import { ApplicationLogo, Navigation, DateGreeter, HeaderActions } from "../codex/widgets";

/**
 * CodexHashHeader - Two-tier header following Web3Connected design system
 * 
 * Structure:
 * - Top Bar (40px): DateGreeter on left, GitHub/Get Started on right
 * - Bottom Bar (100px): CodexHash logo on left, Navigation on right
 */
export default function CodexHashHeader() {
  // Dev Portal navigation items
  const navLinks = [
    { label: "Home", href: "/" },
    { 
      label: "Documentation", 
      href: "/docs",
      icon: "book",
      children: [
        { label: "Getting Started", href: "/docs/getting-started" },
        { label: "API Reference", href: "/docs/api-reference" },
        { label: "Examples", href: "/docs/examples" },
      ]
    },
    { 
      label: "SDKs", 
      href: "/sdks/javascript",
      icon: "code",
      children: [
        { label: "JavaScript / TypeScript", href: "/sdks/javascript" },
      ]
    },
    { label: "API Explorer", href: "/api-explorer", icon: "terminal" },
    { label: "Harmonic Hashing", href: "/harmonic", icon: "atom" },
  ];

  return (
    <GlobalHeader
      // Top bar widgets
      topWidget1={<DateGreeter />}
      topWidget2={null}
      topWidget3={<HeaderActions />}
      topWidget4={null}
      // Bottom bar widgets
      bottomWidget1={<ApplicationLogo logo="CodexHash" showIcon={true} size="md" />}
      bottomWidget2={<Navigation items={navLinks} orientation="horizontal" theme="dark" />}
    />
  );
}
