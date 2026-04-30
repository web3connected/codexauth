import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
        'xxl': '1400px',
        '3xl': '1600px',
        '4xl': '1800px',
      },
      fontFamily: {
        'brand': ['Orbitron', 'Courier New', 'monospace'],
        'heading': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'business': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Site Theme Colors (from Indiz) Template
        'g900': '#000F09',
        'g700': '#1C2924', 
        'g600': '#2E3A35',
        'g500': '#3B4642',
        'g400': '#4A5550',
        'g300': '#2DF4A1',
        'g80': '#949A98',
        'g50': '#BFC3C2',
        'g40': '#DEE0DF',
        'g20': '#F5F5F5',
        
        // Web3 Codex Brand Colors
        'primary-theme': '#1c2430',
        'secondary-theme': '#1146a3',
        'trinary': '#d9e631',
        'background': '#0a0f1c',
        'foreground': '#f7fafc',
        
        // CodexAuth specific colors
        'auth-primary': '#2563EB',
        'auth-secondary': '#2DF4A1',
        'auth-accent': '#818CF8',
        'auth-bg': '#050B18',
        'auth-border': 'rgba(37, 99, 235, 0.2)',
        
        // Brand Identity Colors
        'brand-codex': 'rgb(175, 71, 11)',
        'brand-hash': '#2DF4A1',
        
        // Surface colors
        'surface': '#1E293B',
        'surface-light': '#334155',
        
        // Web3 Brand Colors (legacy)
        'web3-primary': '#0e4774ff',
        'web3-secondary': '#282a35ff',
        'web3-accent': '#FF6B35',
        
        // Semantic Colors
        'success': '#059669',
        'warning': '#d97706',
        'error': '#dc2626',
        'info': '#2563eb',
        
        // Background Overlays
        'bg1': 'rgba(255, 255, 255, 0.04)',
        'bg2': 'rgba(255, 255, 255, 0.08)',
        'bg3': 'rgba(255, 255, 255, 0.16)',
        'bg4': 'rgba(255, 255, 255, 0.02)',
        'bg5': 'rgba(255, 255, 255, 0.12)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1c2430, #1146a3)',
        'gradient-auth': 'linear-gradient(135deg, #2563EB, #818CF8)',
        'gradient-glass': 'linear-gradient(135deg, rgba(28, 36, 48, 0.95), rgba(17, 70, 163, 0.95))',
      },
      padding: {
        '15': '60px',
        '25': '100px', 
        '30': '120px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(45, 244, 161, 0.1)',
        'glow-lg': '0 0 30px rgba(45, 244, 161, 0.2)',
        'glow-xl': '0 0 40px rgba(45, 244, 161, 0.3)',
        'hash-glow': '0 0 20px rgba(45, 244, 161, 0.3)',
        'hash-glow-lg': '0 0 30px rgba(45, 244, 161, 0.4)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'hash-pulse': 'hashPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(45, 244, 161, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(45, 244, 161, 0.5)' },
        },
        hashPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45, 244, 161, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(45, 244, 161, 0.6)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

export default config
