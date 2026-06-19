#!/usr/bin/env node
/**
 * Anantastro screenshot generator
 *
 * Usage:
 *   npx tsx scripts/generate-screenshots.ts
 *   npx tsx scripts/generate-screenshots.ts --viewport=desktop
 *   npx tsx scripts/generate-screenshots.ts --priority=critical,important
 *   npx tsx scripts/generate-screenshots.ts --phase=1,2 --dry-run
 *   npx tsx scripts/generate-screenshots.ts --skip-storage
 *
 * Prerequisites:
 *   1. Frontend running (default http://localhost:3000)
 *   2. Backend running with seeded data
 *   3. screenshots/.env.seed filled (copy from .env.seed.example)
 */

import { createStorageStates } from './screenshots/auth';
import { runCaptureTasks } from './screenshots/capture';
import { ensureOutputDirs, loadSeedEnv, PATHS } from './screenshots/env';
import { CAPTURE_TASKS, ROUTE_GROUPS } from './screenshots/tasks';
import type { CliOptions, Priority, ViewportName } from './screenshots/types';

function parseArgs(argv: string[]): CliOptions {
  const get = (prefix: string): string | undefined =>
    argv.find((a) => a.startsWith(`${prefix}=`))?.split('=').slice(1).join('=');

  const viewportArg = get('--viewport') ?? 'both';
  const viewports: ViewportName[] =
    viewportArg === 'both'
      ? ['desktop', 'mobile']
      : viewportArg === 'desktop' || viewportArg === 'mobile'
        ? [viewportArg]
        : (() => {
            throw new Error('--viewport must be desktop, mobile, or both');
          })();

  const priorityArg = get('--priority') ?? 'critical,important,optional';
  const priorities = priorityArg.split(',').map((p) => p.trim()) as Priority[];
  const valid: Priority[] = ['critical', 'important', 'optional'];
  for (const p of priorities) {
    if (!valid.includes(p)) {
      throw new Error(`Invalid priority "${p}". Use critical, important, optional`);
    }
  }

  const phaseArg = get('--phase');
  const phases = phaseArg
    ? phaseArg.split(',').map((p) => parseInt(p.trim(), 10))
    : null;

  const slugArg = get('--slug');
  const slugs = slugArg ? slugArg.split(',').map((s) => s.trim()).filter(Boolean) : null;

  const includeOptional =
    !argv.includes('--exclude-optional') &&
    (priorities.includes('optional') || argv.includes('--include-optional'));

  const dryRun = argv.includes('--dry-run');

  return { viewports, priorities, phases, slugs, includeOptional, dryRun };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const skipStorage = process.argv.includes('--skip-storage');
  const seed = loadSeedEnv();

  console.log('Anantastro Screenshot Generator');
  console.log('────────────────────────────────');
  console.log(`Base URL:    ${seed.baseUrl}`);
  console.log(`Viewports:   ${options.viewports.join(', ')}`);
  console.log(`Priorities:  ${options.priorities.join(', ')}`);
  if (options.phases) console.log(`Phases:      ${options.phases.join(', ')}`);
  if (options.slugs) console.log(`Slugs:       ${options.slugs.join(', ')}`);
  if (options.dryRun) console.log('Mode:        dry-run');
  console.log('');

  ensureOutputDirs([...ROUTE_GROUPS]);

  if (!skipStorage && !options.dryRun) {
    console.log('Phase 0 — Creating storage states…');
    await createStorageStates(seed);
    console.log('');
  } else if (skipStorage) {
    console.log('Skipping storage state creation (--skip-storage)\n');
  }

  const taskCount = CAPTURE_TASKS.filter((t) => {
    if (options.slugs && !options.slugs.includes(t.slug)) return false;
    if (options.phases && !options.phases.includes(t.phase)) return false;
    if (!options.priorities.includes(t.priority)) return false;
    if (t.priority === 'optional' && !options.includeOptional) return false;
    return true;
  }).length;

  const multiplier = options.viewports.length;
  console.log(`Capturing ~${taskCount * multiplier} screenshots → ${PATHS.outputDir}/\n`);

  const result = await runCaptureTasks(seed, CAPTURE_TASKS, options);

  console.log('');
  console.log('Done');
  console.log(`  Captured: ${result.captured}`);
  console.log(`  Skipped:  ${result.skipped}`);
  console.log(`  Failed:   ${result.failed}`);

  if (result.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
