import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono, Orbitron } from "next/font/google";
import { Providers } from "@/providers/Providers";
import CodexAuthDataLayer from "./CodexAuthDataLayer";
import { CodexSecureInit } from "@/lib/codexsecure";
import ZoneDevBar from "@/components/layout/ZoneDevBar";
import "./globals.css";

// ── App entry point — boot CodexSecure (zone structure + route loading) ───────
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

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      data-theme="dark" 
      style={{ colorScheme: "dark" }}
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="shortcut icon"
          href="/assets/images/logo/CodexAuth.png"
          type="image/x-icon"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body">
        <Providers>
          <ZoneDevBar />
          <CodexAuthDataLayer>
            {children}
          </CodexAuthDataLayer>
        </Providers>
      </body>
    </html>
  );
}
