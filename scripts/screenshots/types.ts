export type RouteGroup =
  | 'marketing'
  | 'authentication'
  | 'user-dashboard'
  | 'kundli'
  | 'horoscope'
  | 'matchmaking'
  | 'chat'
  | 'wallet'
  | 'reports'
  | 'admin'
  | 'astrologer';

export type AuthState =
  | 'guest'
  | 'user'
  | 'admin'
  | 'astrologer'
  | 'low-wallet'
  | 'new-user'
  | 'google-user'
  | 'applicant';

export type Priority = 'critical' | 'important' | 'optional';

export type ViewportName = 'desktop' | 'mobile';

export type StorageStateKey =
  | 'guest'
  | 'user'
  | 'admin'
  | 'astrologer'
  | 'low-wallet'
  | 'new-user'
  | 'google-user'
  | 'applicant';

export interface SeedEnv {
  baseUrl: string;
  apiBaseUrl: string;
  userEmail: string;
  userPassword: string;
  adminEmail: string;
  adminPassword: string;
  astrologerEmail: string;
  astrologerPassword: string;
  applicantEmail: string;
  applicantPassword: string;
  lowWalletEmail: string;
  lowWalletPassword: string;
  newUserEmail: string;
  newUserPassword: string;
  googleUserEmail: string;
  googleUserPassword: string;
  kundliResultId: string;
  kundliShareToken: string;
  horoscopeResultId: string;
  horoscopeShareToken: string;
  horoscopeDetailedResultId: string;
  matchmakingResultId: string;
  matchmakingShareToken: string;
  chatSessionId: string;
  lowBalanceChatSessionId: string;
  adminUserId: string;
  adminAstrologerId: string;
  adminRequestId: string;
  verifyEmailToken: string;
  mockOAuthToken: string;
}

export interface CaptureTask {
  order: number;
  phase: number;
  group: RouteGroup;
  slug: string;
  authState: AuthState;
  storageState: StorageStateKey;
  priority: Priority;
  /** Desktop-only or mobile-only captures */
  viewport?: ViewportName;
  path: (seed: SeedEnv) => string;
  prepare?: PrepareFn;
  skip?: (seed: SeedEnv) => boolean;
}

export type PrepareContext = {
  seed: SeedEnv;
  viewport: ViewportName;
  isMobile: boolean;
};

export type PrepareFn = (
  page: import('playwright').Page,
  ctx: PrepareContext,
) => Promise<void>;

export interface CliOptions {
  viewports: ViewportName[];
  priorities: Priority[];
  phases: number[] | null;
  slugs: string[] | null;
  includeOptional: boolean;
  dryRun: boolean;
}
