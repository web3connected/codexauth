/**
 * Global Services Configuration
 * 
 * This configuration file defines all available services in the CodexStack ecosystem.
 * Update this file to manage service URLs, icons, and descriptions globally.
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_SERVICES_CONFIG: Optional path to override this config
 * - Individual service URLs can be overridden with env vars like:
 *   - NEXT_PUBLIC_SERVICE_CODEX_TIME_URL
 *   - NEXT_PUBLIC_SERVICE_CODEX_MIND_URL
 *   etc.
 */

export interface ServiceLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
}

export const SERVICES_CONFIG: ServiceLink[] = [
  {
    id: 'web3connected',
    name: 'Web3Connected',
    url: process.env.NEXT_PUBLIC_SERVICE_WEB3CONNECTED_URL || 'http://localhost:3000',
    icon: '🌐',
    description: 'Main Platform & Gateway'
  },
  {
    id: 'codex-identity',
    name: 'CodexIdentity',
    url: process.env.NEXT_PUBLIC_SERVICE_CODEX_IDENTITY_URL || 'http://localhost:8083',
    icon: '🆔',
    description: 'Identity & Authentication'
  },
  {
    id: 'codex-hash',
    name: 'CodexHash',
    url: process.env.NEXT_PUBLIC_SERVICE_CODEX_HASH_URL || 'http://localhost:8087',
    icon: '🔐',
    description: 'Quantum Hashing'
  },
  {
    id: 'codex-auth',
    name: 'CodexAuth',
    url: process.env.NEXT_PUBLIC_SERVICE_CODEX_AUTH_URL || 'http://localhost:8089',
    icon: '🔑',
    description: 'Web3Codex Authentication'
  },
  {
    id: 'codex-secure',
    name: 'CodexSecure',
    url: process.env.NEXT_PUBLIC_SERVICE_CODEX_SECURE_URL || 'http://localhost:8081',
    icon: '🔒',
    description: 'Security & Privacy'
  },
  {
    id: 'codex-time',
    name: 'CodexTime',
    url: process.env.NEXT_PUBLIC_SERVICE_CODEX_TIME_URL || 'http://localhost:3921',
    icon: '⏰',
    description: 'Time & Scheduling'
  },
  {
    id: 'codex-mind',
    name: 'CodexMind',
    url: process.env.NEXT_PUBLIC_SERVICE_CODEX_MIND_URL || 'http://localhost:8501',
    icon: '🧠',
    description: 'AI & Analytics'
  },
  {
    id: 'chappie-wallet',
    name: 'ChappieWallet',
    url: process.env.NEXT_PUBLIC_SERVICE_CHAPPIE_WALLET_URL || 'http://localhost:8093',
    icon: '👛',
    description: 'Multi-chain Wallet & DeFi'
  },
];

/**
 * Get service configuration by ID
 * @param serviceId - The service ID
 * @returns ServiceLink config or undefined
 */
export const getService = (serviceId: string): ServiceLink | undefined => {
  return SERVICES_CONFIG.find(s => s.id === serviceId);
};

/**
 * Get all services except the current one
 * @param currentServiceId - The current service ID to exclude
 * @returns Array of ServiceLink configs
 */
export const getOtherServices = (currentServiceId?: string): ServiceLink[] => {
  if (!currentServiceId) return SERVICES_CONFIG;
  return SERVICES_CONFIG.filter(s => s.id !== currentServiceId);
};

/**
 * Get service URL by ID
 * @param serviceId - The service ID
 * @returns Service URL or undefined
 */
export const getServiceUrl = (serviceId: string): string | undefined => {
  return getService(serviceId)?.url;
};
