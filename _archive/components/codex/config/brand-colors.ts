/**
 * Brand Color Configuration
 * Maps each Codex brand to its specific color scheme
 */

export interface BrandColors {
  prefix: string;      // Color for first part of name (e.g., "Web3", "Codex")
  postfix: string;     // Color for second part of name (e.g., "Connected", "Hash")
  accent: string;      // Accent color for highlights
}

export const brandColors: Record<string, BrandColors> = {
  Web3Connected: {
    prefix: '#ddd902',           // White
    postfix: 'hsl(204, 100%, 36%)', // brand-codex orange
    accent: 'rgb(206, 250, 11)',
  },
  CodexHash: {
    prefix: '#ddd902',
    postfix: 'rgb(241, 93, 7)', // brand-codex orange
    accent: 'rgb(175, 71, 11)',
  },
  CodexTime: {
    prefix: '#ddd902',
    postfix: '#4c5b7c',          // brand-time blue
    accent: '#4c5b7c',
  },
  CodexIdentity: {
    prefix: '#ddd902',
    postfix: '#4f7096',          // brand-identity blue
    accent: '#4f7096',
  },
  CodexSecure: {
    prefix: '#ddd902',
    postfix: '#405168',          // brand-secure blue
    accent: '#405168',
  },
  CodexMind: {
    prefix: '#ddd902',
    postfix: '#b8860b',          // brand-mind gold
    accent: '#b8860b',
  },
  CodexAuth: {
    prefix: '#ddd902',
    postfix: '#a855f7',          // brand-auth purple
    accent: '#6366f1',           // indigo accent
  },
};

/**
 * Get brand colors for a specific brand
 * Returns Web3Connected colors as default
 */
export function getBrandColors(brandName: string): BrandColors {
  return brandColors[brandName] || brandColors.Web3Connected;
}
