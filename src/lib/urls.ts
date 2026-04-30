/**
 * URL helpers — respects local dev vs production automatically.
 *
 * Dev   → NEXT_PUBLIC_WEB3CONNECTED_URL (e.g. http://localhost:3000)
 * Prod  → https://web3connected.com
 */

const web3ConnectedBase =
  process.env.NEXT_PUBLIC_WEB3CONNECTED_URL ?? "https://web3connected.com";

const siteBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://codexauth.io";

/**
 * Build a URL on web3connected.com (or local equivalent in dev).
 * @example url("/codexauth-gettingstarted")
 */
export function url(path: string): string {
  return `${web3ConnectedBase}${path}`;
}

/**
 * Build a URL on this site (codexauth.io / localhost:3003).
 * @example site("/docs/api-reference")
 */
export function site(path: string): string {
  return `${siteBase}${path}`;
}
