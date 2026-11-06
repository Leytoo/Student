export type UserRole = 'STUDENT' | 'REGISTRAR' | 'SAO' | 'LIBRARIAN' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  exp?: number;
}

export const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Universal safe JWT payload decoder (works in browser, node, and Next.js edge runtime).
 */
export function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    // Check expiration if present
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded as AuthUser;
  } catch (error) {
    return null;
  }
}

/**
 * Sets the auth token into document.cookie and localStorage (client-side only).
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;

  // Set cookie with 7 days expiration, accessible by Next.js middleware
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax; ${
    window.location.protocol === 'https:' ? 'Secure;' : ''
  }`;
  localStorage.setItem(AUTH_COOKIE_NAME, token);
}

/**
 * Retrieves the stored auth token from document.cookie or localStorage.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // First check document cookie
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + AUTH_COOKIE_NAME + '=([^;]*)'));
  if (match && match[2]) {
    return decodeURIComponent(match[2]);
  }

  // Fallback to localStorage
  return localStorage.getItem(AUTH_COOKIE_NAME);
}

/**
 * Clears auth credentials from both cookie and localStorage.
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  localStorage.removeItem(AUTH_COOKIE_NAME);
}

/**
 * Returns default dashboard route for a given user role.
 */
export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'STUDENT':
      return '/student';
    case 'REGISTRAR':
      return '/registrar';
    case 'SAO':
      return '/sao';
    case 'LIBRARIAN':
      return '/librarian';
    case 'ADMIN':
      return '/admin';
    default:
      return '/login';
  }
}

