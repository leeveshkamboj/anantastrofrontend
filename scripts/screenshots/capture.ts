import fs from 'node:fs';
import path from 'node:path';
import {
  chromium,
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  type Page,
} from 'playwright';
import { screenshotPath } from './env';
import { storageStatePath } from './auth';
import type {
  CaptureTask,
  CliOptions,
  PrepareContext,
  SeedEnv,
  StorageStateKey,
  ViewportName,
} from './types';

const VIEWPORTS: Record<ViewportName, BrowserContextOptions['viewport']> = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const BIRTH_DATA = {
  name: 'Priya Sharma',
  gender: 'Female',
  dateOfBirth: '1995-08-15',
  timeOfBirth: '14:30',
  placeOfBirth: 'Mumbai, Maharashtra, India',
};

export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.locator('[data-loading="true"]').first().waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  await page.getByText('Loading…', { exact: false }).first().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  // Wait for MotionProvider to signal mount animations are ready (see components/motion/MotionProvider.tsx)
  await page.locator('body[data-motion-ready="true"]').waitFor({ state: 'attached', timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(500);
}

export async function takeScreenshot(
  page: Page,
  outputFile: string,
  fullPage = true,
): Promise<void> {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  await waitForPageReady(page);
  await page.screenshot({ path: outputFile, fullPage, animations: 'disabled' });
}

export async function goto(page: Page, seed: SeedEnv, routePath: string): Promise<void> {
  const url = routePath.startsWith('http') ? routePath : new URL(routePath, seed.baseUrl).toString();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForPageReady(page);
}

/** Shared prepare helpers used by tasks */
export const prepare = {
  scrollBelowFold: async (page: Page) => {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(300);
  },

  scrollToFooter: async (page: Page) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
  },

  openServicesDropdown: async (page: Page) => {
    await page.getByRole('button', { name: 'Services' }).click();
    await page.waitForTimeout(300);
  },

  openMobileNav: async (page: Page) => {
    const menuButton = page.locator('nav .lg\\:hidden button').first();
    await menuButton.click();
    await page.waitForTimeout(300);
  },

  triggerLoginValidation: async (page: Page) => {
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await page.waitForTimeout(300);
  },

  triggerRegisterValidation: async (page: Page) => {
    await page.getByRole('button', { name: /register|sign up|create account/i }).click();
    await page.waitForTimeout(300);
  },

  clickProfileTab: (label: string | RegExp) => async (page: Page) => {
    await page.getByRole('button', { name: label }).click();
    await page.waitForTimeout(400);
  },

  clickKundliTab: (label: string) => async (page: Page) => {
    const nav = page.locator('nav[aria-label="Kundli sections"]');
    await nav.waitFor({ state: 'visible', timeout: 15_000 });

    // Clear sticky site header so the horizontal tab bar is clickable on mobile
    await page.evaluate(() => {
      const tabNav = document.querySelector('nav[aria-label="Kundli sections"]');
      if (tabNav) {
        const y = tabNav.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
      }
    });
    await page.waitForTimeout(200);

    // DOM click avoids overlapping tab buttons intercepting pointer events
    const clicked = await page.evaluate((tabLabel) => {
      const tabNav = document.querySelector('nav[aria-label="Kundli sections"]');
      if (!tabNav) return false;
      const buttons = Array.from(tabNav.querySelectorAll('button'));
      const match = buttons.find((b) => b.textContent?.trim() === tabLabel);
      if (!match) return false;
      match.scrollIntoView({ inline: 'center', block: 'nearest' });
      match.click();
      return true;
    }, label);

    if (!clicked) {
      const tab = nav.getByRole('button', { name: label, exact: true });
      await tab.scrollIntoViewIfNeeded();
      await tab.click({ force: true });
    }

    await page.waitForTimeout(500);
  },

  fillKundliGenerateForm: async (page: Page) => {
    const nameInput = page.locator('input[name="name"], #name').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(BIRTH_DATA.name);
    }
    const timeInput = page.locator('input[type="time"]').first();
    if (await timeInput.isVisible().catch(() => false)) {
      await timeInput.fill(BIRTH_DATA.timeOfBirth);
    }
    const placeInput = page.getByPlaceholder(/place|city|location/i).first();
    if (await placeInput.isVisible().catch(() => false)) {
      await placeInput.fill(BIRTH_DATA.placeOfBirth);
    }
    await page.waitForTimeout(300);
  },

  matchmakingGoToStep: (step: 1 | 2 | 3) => async (page: Page) => {
    if (step >= 2) {
      const next1 = page.getByRole('button', { name: /next|continue/i }).first();
      if (await next1.isVisible().catch(() => false)) {
        await next1.click();
        await page.waitForTimeout(400);
      }
    }
    if (step >= 3) {
      const next2 = page.getByRole('button', { name: /next|continue/i }).first();
      if (await next2.isVisible().catch(() => false)) {
        await next2.click();
        await page.waitForTimeout(400);
      }
    }
  },

  openAstrologersChatDialog: async (page: Page) => {
    await page.getByRole('button', { name: /start chat/i }).first().click();
    await page.waitForTimeout(500);
  },

  openAdminCreateAiModal: async (page: Page) => {
    await page.getByRole('button', { name: /create new/i }).click();
    await page.waitForTimeout(500);
  },

  astrologerRegisterGoToStep: (step: number) => async (page: Page) => {
    for (let i = 1; i < step; i++) {
      const next = page.getByRole('button', { name: /^next$/i }).first();
      if (await next.isEnabled().catch(() => false)) {
        await next.click();
        await page.waitForTimeout(400);
      }
    }
  },

  selectPricingPlan: async (page: Page) => {
    const planButton = page.getByRole('button', { name: /buy|purchase|select/i }).first();
    if (await planButton.isVisible().catch(() => false)) {
      await planButton.click();
      await page.waitForTimeout(400);
    }
  },
};

async function createContext(
  browser: Browser,
  seed: SeedEnv,
  viewport: ViewportName,
  storageKey: StorageStateKey,
): Promise<BrowserContext> {
  const stateFile = storageStatePath(storageKey);
  const options: BrowserContextOptions = {
    viewport: VIEWPORTS[viewport],
    deviceScaleFactor: viewport === 'mobile' ? 2 : 1,
    isMobile: viewport === 'mobile',
    hasTouch: viewport === 'mobile',
    locale: 'en-US',
    reducedMotion: 'reduce',
  };

  if (stateFile && fs.existsSync(stateFile)) {
    options.storageState = stateFile;
  }

  return browser.newContext(options);
}

function taskMatchesFilters(task: CaptureTask, options: CliOptions): boolean {
  if (options.slugs && !options.slugs.includes(task.slug)) return false;
  if (task.viewport && !options.viewports.includes(task.viewport)) return false;
  if (options.phases && !options.phases.includes(task.phase)) return false;
  if (!options.priorities.includes(task.priority)) return false;
  if (task.priority === 'optional' && !options.includeOptional) return false;
  return true;
}

export async function runCaptureTasks(
  seed: SeedEnv,
  tasks: CaptureTask[],
  options: CliOptions,
): Promise<{ captured: number; skipped: number; failed: number }> {
  const filtered = tasks
    .filter((t) => taskMatchesFilters(t, options))
    .sort((a, b) => a.order - b.order);

  if (options.dryRun) {
    let captured = 0;
    let skipped = 0;
    for (const task of filtered) {
      for (const viewport of options.viewports) {
        if (task.viewport && task.viewport !== viewport) continue;
        if (task.skip?.(seed)) {
          skipped++;
          continue;
        }
        const outputFile = screenshotPath(task.group, task.slug, task.authState, viewport);
        console.log(`[dry-run ${task.order}] ${viewport} ${task.path(seed)} → ${path.basename(outputFile)}`);
        captured++;
      }
    }
    return { captured, skipped, failed: 0 };
  }

  const browser = await chromium.launch({ headless: true });
  let captured = 0;
  let skipped = 0;
  let failed = 0;

  let currentStorage: StorageStateKey | null = null;
  let currentViewport: ViewportName | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    for (const task of filtered) {
      for (const viewport of options.viewports) {
        if (task.viewport && task.viewport !== viewport) continue;

        if (task.skip?.(seed)) {
          skipped++;
          continue;
        }

        const outputFile = screenshotPath(task.group, task.slug, task.authState, viewport);
        const routePath = task.path(seed);

        const needsNewContext =
          !context ||
          currentStorage !== task.storageState ||
          currentViewport !== viewport;

        if (needsNewContext) {
          await context?.close();
          context = await createContext(browser, seed, viewport, task.storageState);
          page = await context.newPage();
          currentStorage = task.storageState;
          currentViewport = viewport;
        }

        if (!page) throw new Error('Page not initialized');

        try {
          console.log(`[${task.order}] ${viewport} ${routePath} → ${path.basename(outputFile)}`);

          await goto(page, seed, routePath);

          if (task.prepare) {
            const ctx: PrepareContext = {
              seed,
              viewport,
              isMobile: viewport === 'mobile',
            };
            await task.prepare(page, ctx);
          }

          await takeScreenshot(page, outputFile);
          captured++;
        } catch (error) {
          failed++;
          console.error(`  ✗ Failed: ${(error as Error).message}`);
        }
      }
    }
  } finally {
    await context?.close();
    await browser.close();
  }

  return { captured, skipped, failed };
}
