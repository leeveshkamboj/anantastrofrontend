/**
 * Application configuration
 * Centralized configuration for API URLs and other environment variables
 */

export const config = {
  /**
   * Backend API base URL (without trailing slash)
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  /**
   * Backend API base URL with /api prefix
   */
  apiBaseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`,
} as const;

