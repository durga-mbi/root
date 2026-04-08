/**
 * Token Blocklist — in-memory deny-list for invalidated JWT access tokens.
 *
 * When a user logs out, their current access token is added here.
 * The middleware checks this list before trusting any token.
 *
 * Since access tokens expire in 15 minutes, we auto-clear entries after expiry
 * so the Set never grows unbounded.
 */

const blockedTokens = new Set<string>();

/**
 * Add a token to the blocklist.
 * @param token   Raw JWT string
 * @param ttlMs   Time-to-live in milliseconds (should match token expiry)
 */
export function blockToken(token: string, ttlMs = 15 * 60 * 1000): void {
  blockedTokens.add(token);
  // Auto-remove after expiry — no need to keep it forever
  setTimeout(() => {
    blockedTokens.delete(token);
  }, ttlMs);
}

/**
 * Check whether a token has been blocked (i.e., user has logged out).
 */
export function isTokenBlocked(token: string): boolean {
  return blockedTokens.has(token);
}
