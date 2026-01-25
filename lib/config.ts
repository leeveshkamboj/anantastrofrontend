/**
 * Application configuration
 * Centralized configuration for API URLs and other environment variables
 */

// If NEXT_PUBLIC_API_URL is empty or not set, use relative URLs (same domain)
// This works when frontend and backend are served from the same domain via nginx
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const isRelative = !apiUrl || apiUrl.startsWith('/');

export const config = {
  /**
   * Backend API base URL (without trailing slash)
   * If empty, uses relative URLs (same domain)
   */
  apiUrl: isRelative ? '' : apiUrl.replace(/\/$/, ''),
  
  /**
   * Backend API base URL with /api prefix
   * Uses relative /api if NEXT_PUBLIC_API_URL is empty
   */
  apiBaseUrl: isRelative ? '/api' : `${apiUrl.replace(/\/$/, '')}/api`,
} as const;

