/**
 * Reduced-motion smoke tests for the site-wide animation system.
 * Run with: npm run test:motion
 *
 * Asserts that hero content is visible without scroll, celestial float is disabled,
 * and data-motion-ready is set quickly under prefers-reduced-motion: reduce.
 */
import { test, expect } from '@playwright/test';

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'kundli-generate', path: '/services/kundli/generate' },
  { name: 'kundli-result', path: '/services/kundli/result/1' },
  { name: 'admin-users', path: '/admin/users' },
] as const;

test.describe('reduced motion smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  for (const route of ROUTES) {
    test(`${route.name} — content visible without scroll`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      const motionReady = await page.evaluate(() =>
        document.body.getAttribute('data-motion-ready') === 'true'
      );
      expect(motionReady).toBe(true);

      const heroVisible = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return false;
        const rect = main.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.height > 0;
      });
      expect(heroVisible).toBe(true);
    });

    test(`${route.name} — no infinite celestial float animations`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(200);

      const infiniteAnimations = await page.evaluate(() => {
        const celestial = document.querySelector('.celestial-header');
        if (!celestial) return 0;
        let count = 0;
        for (const el of celestial.querySelectorAll('*')) {
          const style = getComputedStyle(el);
          if (style.animationIterationCount === 'infinite') count++;
        }
        return count;
      });
      expect(infiniteAnimations).toBe(0);
    });
  }
});
