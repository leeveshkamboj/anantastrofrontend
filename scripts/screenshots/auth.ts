import fs from 'node:fs';
import path from 'node:path';
import type { BrowserContextOptions } from 'playwright';
import { PATHS } from './env';
import type { SeedEnv, StorageStateKey } from './types';

class SkipStorageState extends Error {
  constructor(key: string) {
    super(`Skipping storage state: ${key}`);
    this.name = 'SkipStorageState';
  }
}

interface LoginResponse {
  isSuccess?: boolean;
  access_token?: string;
  data?: {
    access_token?: string;
    user?: { id: number; email: string; name: string; role: string };
  };
}

function extractAccessToken(data: LoginResponse): string | undefined {
  return data.data?.access_token ?? data.access_token;
}

async function loginViaApi(
  seed: SeedEnv,
  email: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${seed.apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed for ${email} (${res.status}): ${body}`);
  }

  const data = (await res.json()) as LoginResponse;
  const token = extractAccessToken(data);
  if (!token) {
    throw new Error(
      `Login response for ${email} missing access_token: ${JSON.stringify(data)}`,
    );
  }
  return token;
}

function buildStorageState(origin: string, token: string) {
  return {
    cookies: [] as BrowserContextOptions['cookies'],
    origins: [
      {
        origin,
        localStorage: [{ name: 'token', value: token }],
      },
    ],
  };
}

const STORAGE_ACCOUNTS: Record<
  Exclude<StorageStateKey, 'guest'>,
  (seed: SeedEnv) => { email: string; password: string }
> = {
  user: (seed) => ({ email: seed.userEmail, password: seed.userPassword }),
  admin: (seed) => ({ email: seed.adminEmail, password: seed.adminPassword }),
  astrologer: (seed) => ({
    email: seed.astrologerEmail,
    password: seed.astrologerPassword,
  }),
  'low-wallet': (seed) => ({
    email: seed.lowWalletEmail,
    password: seed.lowWalletPassword,
  }),
  'new-user': (seed) => ({
    email: seed.newUserEmail,
    password: seed.newUserPassword,
  }),
  'google-user': (seed) => {
    if (!seed.googleUserEmail || !seed.googleUserPassword) {
      throw new SkipStorageState('google-user');
    }
    return {
      email: seed.googleUserEmail,
      password: seed.googleUserPassword,
    };
  },
  applicant: (seed) => ({
    email: seed.applicantEmail,
    password: seed.applicantPassword,
  }),
};

export async function createStorageStates(seed: SeedEnv): Promise<void> {
  fs.mkdirSync(PATHS.storageDir, { recursive: true });

  for (const [key, getCreds] of Object.entries(STORAGE_ACCOUNTS) as [
    Exclude<StorageStateKey, 'guest'>,
    (seed: SeedEnv) => { email: string; password: string },
  ][]) {
    try {
      const { email, password } = getCreds(seed);
      const token = await loginViaApi(seed, email, password);
      const filePath = path.join(PATHS.storageDir, `${key}.json`);
      fs.writeFileSync(
        filePath,
        JSON.stringify(buildStorageState(seed.baseUrl, token), null, 2),
        'utf8',
      );
      console.log(`  ✓ storage/${key}.json`);
    } catch (error) {
      if (error instanceof SkipStorageState) {
        console.log(`  − storage/${key}.json (${error.message})`);
        continue;
      }
      throw error;
    }
  }
}

export function storageStatePath(key: StorageStateKey): string | undefined {
  if (key === 'guest') return undefined;
  return path.join(PATHS.storageDir, `${key}.json`);
}
