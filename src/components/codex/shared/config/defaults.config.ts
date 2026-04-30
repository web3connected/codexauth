/**
 * Default configuration values for components
 * Prevents component crashes when data is unavailable
 */

export const DEFAULT_AUTH_CONTEXT = {
  isAuthenticated: false,
  user: null,
  login: undefined,
  logout: undefined,
};

export const DEFAULT_SERVICE = 'web3connected';

export const DEFAULT_NAVIGATION_ITEMS = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Platform', href: '/platform', icon: '🚀' },
  { label: 'Documentation', href: '/docs', icon: '📚' },
  { label: 'Pricing', href: '/pricing', icon: '💰' },
  { label: 'About', href: '/about', icon: 'ℹ️' },
  { label: 'Contact', href: '/contact', icon: '📞' },
];

export const DEFAULT_LOGIN_ROUTES = {
  'codex-identity': '/login',
  'default': '/enhanced-login',
};

export const DEFAULT_REGISTER_ROUTES = {
  'codex-identity': '/register',
  'default': '/enhanced-register',
};

export const COMPONENT_WARNINGS = {
  NO_ROUTER: 'Component: Router not available, navigation disabled',
  NO_LOGIN_HANDLER: 'Component: No login handler or router available',
  NO_REGISTER_HANDLER: 'Component: No router available for registration',
};
