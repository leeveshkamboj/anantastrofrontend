import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts/screenshots',
  testMatch: '*.spec.ts',
  use: {
    baseURL: process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000',
    viewport: { width: 1440, height: 900 },
  },
  webServer: process.env.SCREENSHOT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
