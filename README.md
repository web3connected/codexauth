# � CodexHash

A quantum-resistant hashing system with SaaS capabilities and comprehensive documentation platform.

## ✨ Features

- ⚡ **Next.js 15.4.6** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🛡️ **Quantum-Resistant Hashing** - Advanced cryptographic security
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication Ready** - Secure auth components and routes
- 💼 **Dashboard Components** - Hash management interface
- 🌐 **API Integration** - RESTful hashing services
- 📚 **Comprehensive Documentation** - Examples and tutorials
- 🛠️ **Development Tools** - ESLint, TypeScript, etc.

## 🏗️ Project Structure

```
src/
├── 📁 app/                     # Next.js App Router
├── 🎨 components/              # Reusable React components
├── 📚 lib/                     # Utilities, hooks, types
├── 💅 styles/                  # Stylesheets and themes
├── 🖼️ assets/                  # Images, icons, fonts
├── 💾 data/                    # Mock data and API config
├── 🏪 store/                   # State management
├── 🔗 context/                 # React Context providers
└── 🔌 providers/               # App providers
```

See [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) for detailed structure information.

# CodexHash - Quantum-Resistant Hashing System

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

CodexHash is a revolutionary quantum-resistant hashing system that combines physics-based constants with harmonic frequencies to create cryptographically secure hashes. Built with Next.js 15 and integrated with the `@web3connected/codexhash` NPM package, it provides both a comprehensive web application and API for quantum-resistant hashing operations.

## ✨ Features

### 🔐 Quantum-Resistant Security
- **HarmonicHash Algorithm**: Physics-based hashing using speed of light (299,792,458 m/s), Planck frequency, and golden ratio
- **Quantum Resistance Analysis**: Real-time security assessment (30-99% quantum resistance)
- **TIU (Time Distortion Units)**: Advanced temporal dynamics for enhanced security

### 💼 Business Applications
- **Dynamic Pricing Engine**: Secure pricing calculations with quantum resistance
- **Industry Multipliers**: Finance (1.5x), Healthcare (1.4x), Technology (1.2x)
- **Regional Adjustments**: US, EU, Asia, Latin America pricing variations
- **Contract Discounts**: Up to 25% for long-term commitments

### 🌐 Web Application
- **Responsive Design**: Modern UI with Tailwind CSS and dark/light themes
- **Real-time Calculations**: Live pricing and hash generation
- **API Integration**: RESTful endpoints for hash operations
- **Educational Content**: Comprehensive quantum hashing documentation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **Package**: @web3connected/codexhash (Physics-based hashing)
- **Testing**: Jest with 17/17 tests passing
- **Build**: Production-ready with optimized bundles

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/web3connected/codexhash.git
cd codexhash

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### POST /api/hash
Generate quantum-resistant hash with harmonic frequency analysis.

```javascript
const response = await fetch('/api/hash', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: "Hello CodexHash!",
    tiu: 0.618034,        // Golden ratio (optional)
    iterations: 16        // Hash iterations (optional)
  })
});

const data = await response.json();
console.log(data);
// {
//   "hash": "harmonically_generated_hash",
//   "salt": "cryptographic_salt",
//   "tiu": 0.618034,
//   "meta": {
//     "algo": "HarmonicHash-v1.0",
//     "iterations": 16,
//     "durationMs": 45,
//     "inputSize": 17,
//     "quantumResistance": 0.85
//   }
// }
```

### GET /api/hash
Get API information and available parameters.

## 🏗️ Project Structure

```
codexhash/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/hash/          # API endpoints
│   │   ├── pricing/           # Dynamic pricing demo
│   │   ├── services/          # Service documentation
│   │   └── test-api/          # API testing interface
│   ├── components/            # React components
│   │   ├── codexhash/        # Hash-specific components
│   │   ├── navigation/       # Navigation components
│   │   └── ui/               # UI components
│   └── lib/                   # Utilities and types
├── public/                    # Static assets
├── docs/                      # Documentation
├── scripts/                   # Helper scripts (organized by category)
│   ├── deployment/           # Deployment scripts
│   ├── testing/              # Testing utilities
│   └── management/           # Service management
└── config/                    # Configuration files
```

## 🔧 Scripts & Automation

The project includes organized helper scripts in the `/scripts/` directory:

### Development Scripts
```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Testing Scripts
```bash
npm run test            # Run all tests
npm run test:quick      # Quick benchmark tests
npm run test:full       # Full test suite
npm run status          # Check service status
```

### Deployment Scripts
```bash
npm run deploy:simple   # Simple deployment
npm run deploy:prod     # Production deployment
```

### Service Management
```bash
npm run start:services  # Start CodexHash services
npm run stop:services   # Stop CodexHash services
```

See [scripts/README.md](./scripts/README.md) for detailed documentation of all available scripts.

## 🔬 Core Technologies

### HarmonicHash Algorithm
- **Physics Constants**: Speed of light, Astronomical Unit, Planck frequency
- **Sacred Geometry**: Golden ratio (φ = 1.618034), Fibonacci sequences
- **Universal Laws**: Inversion law, temporal dynamics, harmonic frequencies

### Quantum Resistance
- **Security Analysis**: Multi-layered quantum resistance calculations
- **Threat Assessment**: Real-time evaluation against quantum computing attacks
- **Adaptive Security**: Dynamic resistance scaling based on input complexity

## 💡 Use Cases

### 🏦 Financial Services
- Secure transaction hashing with quantum resistance
- Dynamic pricing for financial products
- Regulatory compliance with advanced cryptography

### 🏥 Healthcare
- Patient data protection with quantum-resistant hashing
- Secure medical record management
- HIPAA-compliant cryptographic operations

### 🎮 Gaming & Entertainment
- Secure user authentication
- In-game asset protection
- Anti-cheat mechanisms

### 🏢 Enterprise Solutions
- Document integrity verification
- Secure API authentication
- Data loss prevention

## 📊 Performance Metrics

- **Hash Generation**: ~540ms average response time
- **Build Time**: ~2000ms for production build
- **Test Coverage**: 17/17 tests passing
- **Bundle Size**: Optimized for web performance
- **Quantum Resistance**: 30-99% security rating

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testNamePattern="HarmonicHash"
```

## 📖 Documentation

### 📚 Project Documentation
- **[Complete Documentation](./docs/)** - Comprehensive project documentation
- **[Project Blueprint](./docs/CODEXHASH_BLUEPRINT.md)** - Architecture and design
- **[Setup Guides](./docs/setup/)** - Installation and configuration
- **[Deployment Docs](./docs/deployment/)** - Production deployment guides
- **[Testing Framework](./docs/TEST_FRAMEWORK_README.md)** - Testing setup and usage

### 🌐 Live Documentation
- [Harmonic Hashing Guide](http://localhost:3000/learn/harmonic-hashing)
- [Quantum Hash Service](http://localhost:3000/services/quantum-hash)
- [Pricing Tiers Demo](http://localhost:3000/pricing)
- [API Testing Interface](http://localhost:3000/test-api)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Physics-based cryptography research
- Quantum computing resistance methodologies
- Sacred geometry and mathematical constants
- Next.js and React communities

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Visit the documentation at `http://localhost:3000`
- Check the API testing interface at `http://localhost:3000/test-api`

---

**CodexHash** - Securing the future with quantum-resistant cryptography 🔐✨

## 🎨 Design System

### Animations
The template includes the complete Web3 Codex animation library:

```css
/* Example usage */
.animate-fade-in      /* Fade in animation */
.animate-slide-right  /* Slide from right */
.animate-glow         /* Glow effect */
.hover-lift           /* Lift on hover */
```

### Theme Colors
```css
--color-brand-codex: #af470b
--color-primary: #3b82f6
--color-secondary: #64748b
--gradient-brand: linear-gradient(...)
```

### Component Classes
```css
.dashboard-tile       /* Dashboard tile styling */
.status-badge         /* Status indicators */
.btn-primary          /* Primary button */
```

**Built with ❤️ by the Web3 Codex Team** 🚀
