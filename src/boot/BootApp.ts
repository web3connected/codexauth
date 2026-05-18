import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono, Orbitron } from "next/font/google";
import { CodexSecureInit } from "@/lib/codexsecure";

export const BootApp = {
  loadDefaultAssets: () => {
    // Boot CodexSecure (zone structure + route loading)
    CodexSecureInit({ debug: process.env.NODE_ENV === 'development' });

    // Font configurations
    const inter = Inter({
      subsets: ["latin"],
      variable: "--font-inter",
      display: "swap",
    });

    const poppins = Poppins({
      subsets: ["latin"],
      weight: ["300", "400", "500", "600", "700"],
      variable: "--font-poppins",
      display: "swap",
    });

    const jetbrainsMono = JetBrains_Mono({
      subsets: ["latin"],
      variable: "--font-jetbrains",
      display: "swap",
    });

    const orbitron = Orbitron({
      subsets: ["latin"],
      weight: ["400", "500", "600", "700", "900"],
      variable: "--font-orbitron",
      display: "swap",
    });

    return { inter, poppins, jetbrainsMono, orbitron };
  },

  metadata: {
    title: "CodexAuth - Zone-Aware Authentication System",
    description:
      "Developer portal for CodexAuth - zone-aware authentication, JWT token management, and Web3 identity integration.",
    keywords: "authentication, zone security, JWT, web3, identity, SDK, API, CodexAuth",
    icons: {
      icon: "/assets/images/logo/CodexAuth.png",
    },
    openGraph: {
      title: "CodexAuth Developer Portal",
      description: "Zone-aware authentication SDKs for secure applications",
      type: "website",
      locale: "en_US",
    },
  } as Metadata,
};
