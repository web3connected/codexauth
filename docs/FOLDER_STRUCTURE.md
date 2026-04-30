# Web3 Codex Template - Folder Structure

This is the standardized folder structure for all Web3 Codex projects.

## 📁 Root Structure

```
web3-codex-template/
├── 📁 src/                     # Source code
├── 📁 public/                  # Static assets
├── 📁 docs/                    # Documentation
├── 📁 scripts/                 # Build & deployment scripts
├── 📁 config/                  # Configuration files
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
├── 📄 next.config.ts
└── 📄 README.md
```

## 📁 src/ Directory

### 🎨 Components (`src/components/`)
```
components/
├── ui/                         # Reusable UI components
│   ├── Button/
│   ├── Card/
│   ├── Modal/
│   ├── Input/
│   └── ...
├── layout/                     # Layout components
│   ├── Header/
│   ├── Footer/
│   ├── Sidebar/
│   └── Navigation/
├── forms/                      # Form components
│   ├── ContactForm/
│   ├── LoginForm/
│   └── ...
├── navigation/                 # Navigation components
│   ├── MainNav/
│   ├── BreadCrumb/
│   └── ...
├── common/                     # Common components
│   ├── Loading/
│   ├── ErrorBoundary/
│   └── ...
├── auth/                       # Authentication components
├── dashboard/                  # Dashboard components
├── profile/                    # Profile components
├── settings/                   # Settings components
├── analytics/                  # Analytics components
├── web3/                       # Web3 specific components
├── blockchain/                 # Blockchain components
└── crypto/                     # Crypto components
```

### 🏗️ App Router (`src/app/`)
```
app/
├── layout.tsx                  # Root layout
├── page.tsx                    # Home page
├── globals.css                 # Global styles
├── favicon.ico
├── dashboard/                  # Dashboard routes
│   ├── layout.tsx
│   ├── page.tsx
│   ├── analytics/
│   ├── overview/
│   └── projects/
├── auth/                       # Authentication routes
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── profile/                    # Profile routes
├── settings/                   # Settings routes
├── docs/                       # Documentation routes
└── api/                        # API routes
```

### 📚 Libraries (`src/lib/`)
```
lib/
├── utils/                      # Utility functions
│   ├── cn.ts                   # Class name utilities
│   ├── format.ts               # Formatting functions
│   ├── validation.ts           # Validation helpers
│   └── ...
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   ├── useWeb3.ts
│   └── ...
├── types/                      # TypeScript type definitions
│   ├── auth.ts
│   ├── user.ts
│   ├── api.ts
│   └── ...
└── constants/                  # Application constants
    ├── routes.ts
    ├── api.ts
    └── ...
```

### 🎨 Styles (`src/styles/`)
```
styles/
├── components/                 # Component-specific styles
│   ├── button.css
│   ├── card.css
│   └── ...
├── themes/                     # Theme definitions
│   ├── dark.css
│   ├── light.css
│   └── ...
└── animations/                 # Animation definitions
    ├── animations.css          # Web3 Codex animations
    ├── transitions.css
    └── ...
```

### 🖼️ Assets (`src/assets/`)
```
assets/
├── images/                     # Image files
│   ├── logos/
│   ├── backgrounds/
│   └── ...
├── icons/                      # Icon files
│   ├── svg/
│   └── ...
└── fonts/                      # Font files
    ├── inter/
    └── ...
```

### 💾 Data (`src/data/`)
```
data/
├── mock/                       # Mock data for development
│   ├── users.ts
│   ├── projects.ts
│   └── ...
└── api/                        # API configuration
    ├── client.ts
    ├── endpoints.ts
    └── ...
```

### 🏪 State Management (`src/store/`)
```
store/
├── slices/                     # Redux slices or Zustand stores
│   ├── authSlice.ts
│   ├── userSlice.ts
│   └── ...
├── providers/                  # State providers
└── index.ts                    # Store configuration
```

### 🔗 Context (`src/context/`)
```
context/
├── AuthContext.tsx
├── ThemeContext.tsx
├── Web3Context.tsx
└── ...
```

### 🔌 Providers (`src/providers/`)
```
providers/
├── AuthProvider.tsx
├── ThemeProvider.tsx
├── Web3Provider.tsx
└── ...
```

## 📁 Root Level Directories

### 📚 Documentation (`docs/`)
```
docs/
├── setup/                      # Setup guides
│   ├── installation.md
│   ├── development.md
│   └── ...
├── components/                 # Component documentation
│   ├── ui-components.md
│   ├── layout-components.md
│   └── ...
├── deployment/                 # Deployment guides
│   ├── vercel.md
│   ├── netlify.md
│   └── ...
└── api/                        # API documentation
    ├── authentication.md
    ├── endpoints.md
    └── ...
```

### 🛠️ Scripts (`scripts/`)
```
scripts/
├── build/                      # Build scripts
│   ├── build-prod.sh
│   ├── build-dev.sh
│   └── ...
├── deploy/                     # Deployment scripts
│   ├── deploy-staging.sh
│   ├── deploy-prod.sh
│   └── ...
└── utils/                      # Utility scripts
    ├── generate-types.sh
    ├── optimize-images.sh
    └── ...
```

### ⚙️ Configuration (`config/`)
```
config/
├── environments/               # Environment configurations
│   ├── development.ts
│   ├── staging.ts
│   ├── production.ts
│   └── ...
└── features/                   # Feature flags
    ├── flags.ts
    └── ...
```

## 🎯 Naming Conventions

### Files
- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`, `useLocalStorage.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (`User.ts`, `ApiResponse.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`, `ROUTES.ts`)

### Directories
- **kebab-case**: For multi-word directories (`forgot-password/`, `user-profile/`)
- **camelCase**: For single concept directories (`components/`, `utils/`)

## 🚀 Quick Start

1. **Navigate to template**:
   ```bash
   cd /home/web3codex/projects/GlobalAssets/template/web3-codex-template
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

## 📝 Notes

- This structure follows Next.js 13+ App Router conventions
- All components should be TypeScript with proper type definitions
- Styles use Tailwind CSS with custom Web3 Codex animations
- State management can use Context API, Redux Toolkit, or Zustand
- API routes follow RESTful conventions
- Documentation is written in Markdown

---

**Web3 Codex Template v1.0** - Ready for Web3 dApp development! 🚀
