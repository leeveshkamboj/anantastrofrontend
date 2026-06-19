import fs from 'node:fs';
import path from 'node:path';
import type { SeedEnv } from './types';

const ROOT = path.resolve(__dirname, '../..');

function readSeedFile(): Record<string, string> {
  const seedPath = path.join(ROOT, 'screenshots', '.env.seed');
  if (!fs.existsSync(seedPath)) {
    throw new Error(
      `Missing ${seedPath}. Copy screenshots/.env.seed.example and fill in fixture values.`,
    );
  }

  const lines = fs.readFileSync(seedPath, 'utf8').split('\n');
  const env: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

function required(raw: Record<string, string>, key: string): string {
  const value = raw[key]?.trim();
  if (!value) {
    throw new Error(`screenshots/.env.seed: missing required key "${key}"`);
  }
  return value;
}

function optional(raw: Record<string, string>, key: string, fallback = ''): string {
  return raw[key]?.trim() || fallback;
}

export function loadSeedEnv(): SeedEnv {
  const raw = readSeedFile();
  const apiUrl = optional(raw, 'API_BASE_URL', optional(raw, 'NEXT_PUBLIC_API_URL', 'http://localhost:4000'));
  const apiBaseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/api`;

  return {
    baseUrl: optional(raw, 'BASE_URL', 'http://localhost:3000'),
    apiBaseUrl,
    userEmail: required(raw, 'USER_EMAIL'),
    userPassword: required(raw, 'USER_PASSWORD'),
    adminEmail: required(raw, 'ADMIN_EMAIL'),
    adminPassword: required(raw, 'ADMIN_PASSWORD'),
    astrologerEmail: required(raw, 'ASTROLOGER_EMAIL'),
    astrologerPassword: required(raw, 'ASTROLOGER_PASSWORD'),
    applicantEmail: required(raw, 'APPLICANT_EMAIL'),
    applicantPassword: required(raw, 'APPLICANT_PASSWORD'),
    lowWalletEmail: required(raw, 'LOW_WALLET_EMAIL'),
    lowWalletPassword: required(raw, 'LOW_WALLET_PASSWORD'),
    newUserEmail: required(raw, 'NEW_USER_EMAIL'),
    newUserPassword: required(raw, 'NEW_USER_PASSWORD'),
    googleUserEmail: optional(raw, 'GOOGLE_USER_EMAIL'),
    googleUserPassword: optional(raw, 'GOOGLE_USER_PASSWORD'),
    kundliResultId: required(raw, 'KUNDLI_RESULT_ID'),
    kundliShareToken: required(raw, 'KUNDLI_SHARE_TOKEN'),
    horoscopeResultId: required(raw, 'HOROSCOPE_RESULT_ID'),
    horoscopeShareToken: required(raw, 'HOROSCOPE_SHARE_TOKEN'),
    horoscopeDetailedResultId: optional(raw, 'HOROSCOPE_DETAILED_RESULT_ID'),
    matchmakingResultId: required(raw, 'MATCHMAKING_RESULT_ID'),
    matchmakingShareToken: required(raw, 'MATCHMAKING_SHARE_TOKEN'),
    chatSessionId: required(raw, 'CHAT_SESSION_ID'),
    lowBalanceChatSessionId: optional(raw, 'LOW_BALANCE_CHAT_SESSION_ID'),
    adminUserId: required(raw, 'ADMIN_USER_ID'),
    adminAstrologerId: required(raw, 'ADMIN_ASTROLOGER_ID'),
    adminRequestId: required(raw, 'ADMIN_REQUEST_ID'),
    verifyEmailToken: optional(raw, 'FRESH_VERIFY_TOKEN'),
    mockOAuthToken: optional(raw, 'MOCK_OAUTH_JWT'),
  };
}

export const PATHS = {
  root: ROOT,
  outputDir: path.join(ROOT, 'screenshots'),
  storageDir: path.join(ROOT, 'storage'),
  seedExample: path.join(ROOT, 'screenshots', '.env.seed.example'),
} as const;

export function ensureOutputDirs(groups: string[]): void {
  fs.mkdirSync(PATHS.outputDir, { recursive: true });
  fs.mkdirSync(PATHS.storageDir, { recursive: true });
  for (const group of groups) {
    fs.mkdirSync(path.join(PATHS.outputDir, group), { recursive: true });
  }
}

export function screenshotPath(
  group: string,
  slug: string,
  authState: string,
  viewport: string,
): string {
  return path.join(PATHS.outputDir, group, `${slug}__${authState}__${viewport}.png`);
}
