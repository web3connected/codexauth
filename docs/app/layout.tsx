import type { Metadata } from "next";
import { BootApp } from "@/boot/BootApp";
import { Providers } from "@/providers/Providers";
import CodexAuthDataLayer from "./CodexAuthDataLayer";
import ZoneDevBar from "@/components/layout/ZoneDevBar";
import "./globals.css";

// Boot app and load default assets (fonts, CodexSecure, etc.)
const { inter, poppins, jetbrainsMono, orbitron } = BootApp.loadDefaultAssets();

export const metadata: Metadata = BootApp.metadata;

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

declare module '*.css';
