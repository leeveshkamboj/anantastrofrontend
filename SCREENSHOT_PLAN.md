# Anantastro Screenshot Plan

**Generated from:** `DESIGN_AUDIT.md`  
**Routes covered:** 43 pages + 404 + profile tab variants  
**Viewport targets:**

| Device | Width × Height | Playwright device |
|--------|----------------|-------------------|
| Desktop | 1440 × 900 | `{ width: 1440, height: 900 }` |
| Mobile | 390 × 844 | `iPhone 14` or `{ width: 390, height: 844 }` |

**Output naming convention:**

```
screenshots/{group}/{route-slug}__{auth-state}__{viewport}.png

Examples:
  screenshots/marketing/home__guest__desktop.png
  screenshots/kundli/result__user__mobile.png
  screenshots/profile/basic-info-tab__user__desktop.png
```

**Screenshot rules:**
- Wait for network idle + no skeleton loaders before capture
- Hide dev overlays / React error boundaries
- Scroll to top unless capturing below-fold section (note in filename suffix)
- Capture modals/drawers as separate shots with `-modal` or `-drawer` suffix
- Use locale `en` (default, no prefix) unless capturing i18n variant

---

## Seed Data Prerequisites

Create these fixtures in staging/dev **before** running the screenshot suite. Store IDs in `screenshots/.env.seed` for Playwright to read.

| Fixture key | Description | Used by |
|-------------|-------------|---------|
| `USER_EMAIL` | Verified end-user account | User, wallet, reports, services |
| `USER_PASSWORD` | Password for above | Auth storage state |
| `ADMIN_EMAIL` | Admin account | Admin routes |
| `ADMIN_PASSWORD` | Password for above | Auth storage state |
| `ASTROLOGER_EMAIL` | Approved, active astrologer | Astrologer dashboard routes |
| `ASTROLOGER_PASSWORD` | Password for above | Auth storage state |
| `PENDING_ASTROLOGER_EMAIL` | User with pending astrologer request | Astrologer register success context |
| `KUNDLI_RESULT_ID` | Completed kundli generation UUID | `/services/kundli/result/[id]/` |
| `KUNDLI_SHARE_TOKEN` | Public share token for above | `/services/kundli/share/[token]/` |
| `HOROSCOPE_RESULT_ID` | Completed horoscope report UUID | `/services/horoscope/result/[id]/` |
| `HOROSCOPE_SHARE_TOKEN` | Public share token for above | `/services/horoscope/share/[token]/` |
| `MATCHMAKING_RESULT_ID` | Completed matchmaking report UUID | `/services/matchmaking/result/[id]/` |
| `MATCHMAKING_SHARE_TOKEN` | Public share token for above | `/services/matchmaking/share/[token]/` |
| `CHAT_SESSION_ID` | Active chat session UUID with ≥3 messages | `/chat/[sessionId]/` |
| `ADMIN_USER_ID` | Non-admin user for detail/edit pages | `/admin/users/[id]/` |
| `ADMIN_ASTROLOGER_ID` | Approved astrologer profile ID | `/admin/astrologers/[id]/` |
| `ADMIN_REQUEST_ID` | Pending astrologer request ID | `/admin/astrologer-requests/[id]/` |
| `KUNDLI_PROFILE_ID` | Saved kundli birth profile | Profile kundli tab, chat start flow |
| `WALLET_BALANCE` | User with ≥100 coins + ≥5 transactions | Wallet page |
| `LOW_WALLET_USER` | User with <10 coins | Wallet low-balance banner (optional) |

**Suggested birth data for generation flows:**

```json
{
  "name": "Priya Sharma",
  "gender": "Female",
  "dateOfBirth": "1995-08-15",
  "timeOfBirth": "14:30",
  "placeOfBirth": "Mumbai, Maharashtra, India"
}
```

---

## 1. Marketing

Public shell (Navbar + Footer). No authentication required unless noted.

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/` | None | **Critical** | Full page (hero + below fold as 2 shots) | Hero + hamburger menu open (2 shots) | Guest | None; hero form empty |
| `/about/` | None | Important | Full page | Full page | Guest | None |
| `/contact/` | None | Important | Full page | Full page | Guest | None |
| `/pricing/` | None | **Critical** | Coin plans grid | Stacked plan cards | Guest | Public coin plans from API seeded |
| `/pricing/` | `user` | Important | Plans + purchase CTA visible | Same | Authenticated user | User with ≥50 coins in nav pill |
| `/astrologers/` | None | **Critical** | AI astrologer catalog | Catalog + profile dialog open (2 shots) | Guest | ≥4 AI astrologers seeded with avatars |
| `/astrologers/` | `user` | Important | Catalog with coin balance in nav | Start-chat dialog with kundli picker | Authenticated user | User with ≥1 kundli profile + ≥20 coins |
| `/not-found` (404) | None | Optional | Custom 404 page | Same | Guest | Navigate to `/does-not-exist/` |

**Extra marketing shots (same routes, not separate pages):**

| Capture | Route | Priority | Auth | Notes |
|---------|-------|----------|------|-------|
| Services dropdown open | `/` | Important | Guest | Desktop only |
| Mobile nav drawer open | `/` | Important | Guest | Mobile only |
| Footer | any marketing page | Optional | Guest | Desktop scroll-to-footer |

---

## 2. Authentication

Auth layout (`GuestRoute` — redirect if already logged in). Capture as guest unless testing post-login redirect.

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/auth/login/` | None | **Critical** | Empty form | Empty form | Guest | Valid credentials ready (not pre-filled) |
| `/auth/login/` | None | Important | Form with validation errors | Same | Guest | Submit empty form to trigger errors |
| `/auth/register/` | None | **Critical** | Empty form | Empty form | Guest | None |
| `/auth/register/` | None | Important | Form with validation errors | Same | Guest | Submit invalid email |
| `/auth/verify-email/` | None | Optional | Loading/verifying state | Same | Guest | Valid one-time verify token (consumes token — run last in auth group) |
| `/auth/verify-email/success/` | None | Important | Success state | Same | Guest | Direct navigation (static page) |
| `/auth/verify-email/error/` | None | Important | Error state | Same | Guest | Direct navigation or expired token |
| `/auth/google/callback/` | None | Optional | Processing spinner | Same | Guest | Mock `?token=` param with valid JWT (intercept route) |

**Notes:**
- Do **not** screenshot login/register while authenticated (GuestRoute redirects away)
- Email-not-verified error state on login: use unverified local account → Important, Optional priority

---

## 3. User Dashboard

Authenticated `user` role. Public shell.

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/profile/` — Basic Info tab | `user` | **Critical** | Tab active, form filled | Sidebar collapsed to top tabs | Authenticated user | Profile with name, phone, DOB populated |
| `/profile/` — Kundli Profile tab | `user` | **Critical** | ≥2 saved profiles listed | Same | Authenticated user | ≥2 kundli profiles (self + family member) |
| `/profile/` — Password tab | `user` | Important | Change password form | Same | Authenticated user | Local-auth user (not Google-only) |
| `/profile/` — Password tab | `user` | Optional | Set-password form | Same | Authenticated user | Google OAuth user without password |

---

## 4. Kundli

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/services/kundli/generate/` | `user` | **Critical** | Empty form | Empty form | Authenticated user | User with ≥10 coins; service cost visible |
| `/services/kundli/generate/` | `user` | Important | Form filled, pre-submit | Same | Authenticated user | Sample birth data filled in |
| `/services/kundli/generate/` | None | Important | Redirect to login | Same | Guest | None (capture login redirect or login page with return intent) |
| `/services/kundli/result/{KUNDLI_RESULT_ID}/` | `user` | **Critical** | Summary tab | Summary tab + tab bar scroll | Authenticated user | Completed kundli with chart + AI interpretation |
| `/services/kundli/result/{KUNDLI_RESULT_ID}/` | `user` | **Critical** | Dasha tab | Dasha tab | Authenticated user | Same kundli with dasha data |
| `/services/kundli/result/{KUNDLI_RESULT_ID}/` | `user` | Important | Ashtakvarga tab | Ashtakvarga table scroll | Authenticated user | Same kundli with ashtakvarga matrix |
| `/services/kundli/result/{KUNDLI_RESULT_ID}/` | `user` | Important | Chart view (North Indian) | Chart centered | Authenticated user | Same kundli |
| `/services/kundli/share/{KUNDLI_SHARE_TOKEN}/` | None | **Critical** | Full shared result | Summary + share bar | Guest (no auth) | Valid share token; completed kundli |

**Extra kundli shots:**

| Capture | Priority | Auth | Notes |
|---------|----------|------|-------|
| Insufficient coins → pricing redirect | Important | User with 0 coins | Optional modal if implemented |
| Social share buttons visible | Important | Any on result/share | Desktop |
| AI translate bar open | Optional | User on result page | Desktop |

---

## 5. Horoscope

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/services/horoscope/` | `user` | **Critical** | Period + detail level selectors | Form stacked | Authenticated user | User with ≥10 coins; kundli profile linked |
| `/services/horoscope/` | None | Important | Login redirect | Same | Guest | None |
| `/services/horoscope/result/{HOROSCOPE_RESULT_ID}/` | `user` | **Critical** | Full result (daily/weekly) | Full result | Authenticated user | Completed horoscope with interpretation |
| `/services/horoscope/result/{HOROSCOPE_RESULT_ID}/` | `user` | Important | Detailed level variant | Same | Authenticated user | Horoscope generated with `detailLevel: detailed` |
| `/services/horoscope/share/{HOROSCOPE_SHARE_TOKEN}/` | None | Important | Shared result | Same | Guest | Valid share token |

---

## 6. Matchmaking

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/services/matchmaking/` | `user` | **Critical** | Step 1 (partner 1 form) | Step 1 | Authenticated user | User with ≥15 coins |
| `/services/matchmaking/` | `user` | Important | Step 2 (partner 2 form) | Step 2 | Authenticated user | Both partners partially filled |
| `/services/matchmaking/` | `user` | Important | Step 3 (review) | Step 3 | Authenticated user | Both partners complete |
| `/services/matchmaking/result/{MATCHMAKING_RESULT_ID}/` | `user` | **Critical** | Gun Milan score + summary | Same | Authenticated user | Completed matchmaking with scores |
| `/services/matchmaking/share/{MATCHMAKING_SHARE_TOKEN}/` | None | Important | Shared result | Same | Guest | Valid share token |

---

## 7. Chat

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/conversations/` | `user` | **Critical** | Session list (≥2 sessions) | Card list | Authenticated user | ≥2 chat sessions with messages |
| `/conversations/` | `user` | Important | Empty state | Same | Authenticated user | New user with zero sessions |
| `/chat/{CHAT_SESSION_ID}/` | `user` | **Critical** | Active thread (≥5 messages) | Thread + input bar | Authenticated user | Active session; AI + user messages |
| `/chat/{CHAT_SESSION_ID}/` | `user` | Important | Low coins warning | Same | Authenticated user | Session with wallet balance < 5 coins/min rate |
| `/astrologers/` — start chat dialog | `user` | Important | Kundli profile picker modal | Full-screen dialog | Authenticated user | See Marketing astrologers authed variant |

**Notes:**
- Chat requires WebSocket connection — ensure backend realtime running
- Capture typing indicator separately if possible (Optional)

---

## 8. Wallet

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/wallet/` | `user` | **Critical** | Balance + transaction history | Balance header + tx list | Authenticated user | ≥100 coins, ≥8 transactions (credit + debit) |
| `/wallet/` | `user` | Important | Low balance state | Same | Authenticated user | `LOW_WALLET_USER` with <10 coins |
| `/pricing/` | `user` | **Critical** | Purchase flow (plan selected) | Plan card selected | Authenticated user | Coin plans; do not complete Razorpay |
| `/pricing/` | `user` | Optional | Razorpay checkout modal | Same | Authenticated user | Mock Razorpay iframe if test mode available |

---

## 9. Reports

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/reports/` | `user` | **Critical** | Mixed report list (all 3 types) | Card list | Authenticated user | ≥1 kundli + ≥1 horoscope + ≥1 matchmaking completed |
| `/reports/` | `user` | Important | Empty state | Same | Authenticated user | New user with zero reports |
| `/reports/` | `user` | Important | Filter by type (kundli only) | Same | Authenticated user | Multiple reports; apply type filter if UI exists |

---

## 10. Admin

Admin layout (sidebar). Requires `admin` role.

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/admin/` | `admin` | **Critical** | Dashboard + stat cards + charts | Sidebar drawer open + dashboard | Authenticated admin | Seeded stats (users, astrologers, requests) |
| `/admin/users/` | `admin` | **Critical** | User table (≥10 rows) | Row cards or horizontal scroll | Authenticated admin | Users in all 3 roles visible |
| `/admin/users/{ADMIN_USER_ID}/` | `admin` | Important | User detail view | Same | Authenticated admin | Regular user with profile data |
| `/admin/users/{ADMIN_USER_ID}/edit/` | `admin` | Important | Edit form | Same | Authenticated admin | Same user |
| `/admin/astrologers/` | `admin` | **Critical** | Astrologer table | Same | Authenticated admin | ≥5 approved astrologer profiles |
| `/admin/astrologers/{ADMIN_ASTROLOGER_ID}/` | `admin` | Important | Astrologer detail | Same | Authenticated admin | Profile with services/pricing |
| `/admin/astrologer-requests/` | `admin` | **Critical** | Requests table (pending + rejected) | Same | Authenticated admin | ≥3 requests in mixed statuses |
| `/admin/astrologer-requests/{ADMIN_REQUEST_ID}/` | `admin` | Important | Request detail + KYC refs | Same | Authenticated admin | Pending request with uploaded docs |
| `/admin/ai-astrologers/` | `admin` | **Critical** | AI astrologer list | Same | Authenticated admin | ≥4 AI personas |
| `/admin/ai-astrologers/` | `admin` | Important | Create/edit modal open | Same | Authenticated admin | Desktop: modal overlay shot |
| `/admin/coins/` | `admin` | **Critical** | Coins overview + service costs | Same | Authenticated admin | Seeded coin settings |
| `/admin/coins/plans/` | `admin` | Important | Coin pack management | Same | Authenticated admin | ≥3 coin plans |
| `/admin/kundli-support/` | `admin` | Important | Debug/support tooling | Same | Authenticated admin | Sample kundli generation metadata |

**Admin mobile notes:** All admin pages need drawer-open shot on mobile (sidebar is fixed 256px desktop-only today).

---

## 11. Astrologer

Astrologer layout (sidebar) except register routes which use public shell.

| Route | Role | Priority | Desktop | Mobile | Auth state | Sample data needed |
|-------|------|----------|---------|--------|------------|-------------------|
| `/astrologer/` | `astrologer` | **Critical** | Dashboard home | Drawer open | Authenticated astrologer | Approved, active profile |
| `/astrologer/profile/` | `astrologer` | **Critical** | Profile form filled | Same | Authenticated astrologer | Complete bio, expertise, languages |
| `/astrologer/services/` | `astrologer` | **Critical** | Service pricing table | Same | Authenticated astrologer | All 4 service types with prices |
| `/astrologer/settings/` | `astrologer` | Important | Settings form | Same | Authenticated astrologer | Notification prefs populated |
| `/astrologer/register/` | `user` | **Critical** | Step 1 of wizard | Step 1 | Authenticated user (non-astrologer) | User without pending request |
| `/astrologer/register/` | `user` | Important | Mid-wizard (step 3–4) | Same | Authenticated user | Partial form data |
| `/astrologer/register/success/` | `user` | Important | Success confirmation | Same | Authenticated user | User who just submitted request |

**Notes:**
- `/astrologer/register/` uses public shell (Navbar visible) — capture both shell types
- Deactivated astrologer redirect (`/?error=account_deactivated`) — Optional shot

---

## Summary Counts

| Group | Routes | Extra variants | Total shots (×2 viewports) |
|-------|--------|----------------|---------------------------|
| Marketing | 6 | +5 UI states | ~22 |
| Authentication | 6 | +2 error states | ~16 |
| User Dashboard | 1 (3 tabs) | +1 Google password | ~8 |
| Kundli | 3 | +4 tabs/states | ~18 |
| Horoscope | 3 | +1 detailed | ~10 |
| Matchmaking | 3 | +2 steps | ~12 |
| Chat | 2 | +3 states | ~10 |
| Wallet | 2 | +2 states | ~8 |
| Reports | 1 | +2 states | ~6 |
| Admin | 12 | +1 modal | ~28 |
| Astrologer | 6 | +1 mid-wizard | ~16 |
| **Total** | | | **~150 screenshots** |

---

# Playwright Execution Order

Optimized to **minimize logins**, **reuse storage state**, **respect GuestRoute constraints**, and **avoid token consumption conflicts**.

## Setup (once)

```typescript
// playwright.config.ts recommended
baseURL: 'http://localhost:3000'
projects: [
  { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  { name: 'mobile', use: { ...devices['iPhone 14'] } },
]
```

```bash
# Seed staging DB + write screenshots/.env.seed with fixture IDs
npm run db:seed:screenshots   # (create this script)
```

---

## Phase 0 — Storage state preparation

| Step | Action | Output |
|------|--------|--------|
| 0.1 | Login as `USER_EMAIL` via API, save state | `storage/user.json` |
| 0.2 | Login as `ADMIN_EMAIL` via API, save state | `storage/admin.json` |
| 0.3 | Login as `ASTROLOGER_EMAIL` via API, save state | `storage/astrologer.json` |
| 0.4 | Login as `LOW_WALLET_USER` via API, save state | `storage/low-wallet.json` |
| 0.5 | Login as empty-reports user via API, save state | `storage/new-user.json` |
| 0.6 | Login as Google-only user via API, save state | `storage/google-user.json` |

---

## Phase 1 — Guest / public (no auth)

Run with **no storage state**. Fast, no session conflicts.

```
ORDER  ROUTE                                              GROUP        PRIORITY
─────  ─────────────────────────────────────────────────  ───────────  ────────
  1    /                                                   marketing    critical
  2    /  [desktop: services dropdown open]               marketing    important
  3    /  [mobile: hamburger menu open]                    marketing    important
  4    /about/                                             marketing    important
  5    /contact/                                           marketing    important
  6    /pricing/                                           marketing    critical
  7    /astrologers/                                       marketing    critical
  8    /services/kundli/share/{KUNDLI_SHARE_TOKEN}/        kundli       critical
  9    /services/horoscope/share/{HOROSCOPE_SHARE_TOKEN}/  horoscope    important
 10    /services/matchmaking/share/{MATCHMAKING_SHARE_TOKEN}/ matchmaking important
 11    /does-not-exist/                                    marketing    optional
 12    /auth/login/                                        auth         critical
 13    /auth/login/  [validation errors]                   auth         important
 14    /auth/register/                                     auth         critical
 15    /auth/register/  [validation errors]                auth         important
 16    /auth/verify-email/success/                         auth         important
 17    /auth/verify-email/error/                           auth         important
 18    /services/kundli/generate/  [guest→login redirect]  kundli       important
 19    /services/horoscope/  [guest→login redirect]        horoscope    important
 20    /services/matchmaking/  [guest→login redirect]      matchmaking  important
```

---

## Phase 2 — User session (`storage/user.json`)

Login once; stay authenticated for all user routes.

```
ORDER  ROUTE / ACTION                                     GROUP          PRIORITY
─────  ─────────────────────────────────────────────────  ─────────────  ────────
 21    /astrologers/  [authed + coin pill]                marketing      important
 22    /astrologers/  [start-chat dialog open]             chat           important
 23    /pricing/  [authed]                                wallet         important
 24    /profile/  tab=basic                                user-dashboard critical
 25    /profile/  tab=kundli                               user-dashboard critical
 26    /profile/  tab=password                             user-dashboard important
 27    /reports/  [populated]                              reports        critical
 28    /wallet/  [full balance + transactions]             wallet         critical
 29    /conversations/  [≥2 sessions]                     chat           critical
 30    /chat/{CHAT_SESSION_ID}/                            chat           critical
 31    /services/kundli/generate/  [empty]                kundli         critical
 32    /services/kundli/generate/  [filled]                kundli         important
 33    /services/kundli/result/{KUNDLI_RESULT_ID}/  tab=summary          kundli         critical
 34    /services/kundli/result/{KUNDLI_RESULT_ID}/  tab=dasha             kundli         critical
 35    /services/kundli/result/{KUNDLI_RESULT_ID}/  tab=ashtakvarga       kundli         important
 36    /services/kundli/result/{KUNDLI_RESULT_ID}/  tab=chart             kundli         important
 37    /services/horoscope/                                horoscope      critical
 38    /services/horoscope/result/{HOROSCOPE_RESULT_ID}/   horoscope      critical
 39    /services/matchmaking/  step=1                      matchmaking    critical
 40    /services/matchmaking/  step=2                      matchmaking    important
 41    /services/matchmaking/  step=3                      matchmaking    important
 42    /services/matchmaking/result/{MATCHMAKING_RESULT_ID}/ matchmaking  critical
```

---

## Phase 3 — Alternate user states (swap storage state)

Each sub-phase switches storage state only for routes that need a different user.

### 3a — `storage/new-user.json`

```
 43    /reports/  [empty state]                           reports        important
 44    /conversations/  [empty state]                     chat           important
```

### 3b — `storage/low-wallet.json`

```
 45    /wallet/  [low balance]                           wallet         important
 46    /chat/{LOW_BALANCE_SESSION_ID}/  [low coins warn] chat           important
```

### 3c — `storage/google-user.json`

```
 47    /profile/  tab=password  [set-password view]      user-dashboard optional
```

### 3d — Fresh non-astrologer user (for register wizard)

Use a dedicated `storage/applicant.json` user with no astrologer request.

```
 48    /astrologer/register/  step=1                      astrologer     critical
 49    /astrologer/register/  step=3                      astrologer     important
 50    /astrologer/register/success/                       astrologer     important
```

---

## Phase 4 — Admin session (`storage/admin.json`)

```
ORDER  ROUTE                                              GROUP   PRIORITY
─────  ─────────────────────────────────────────────────  ──────  ────────
 51    /admin/                                             admin   critical
 52    /admin/users/                                       admin   critical
 53    /admin/users/{ADMIN_USER_ID}/                       admin   important
 54    /admin/users/{ADMIN_USER_ID}/edit/                  admin   important
 55    /admin/astrologers/                                 admin   critical
 56    /admin/astrologers/{ADMIN_ASTROLOGER_ID}/           admin   important
 57    /admin/astrologer-requests/                         admin   critical
 58    /admin/astrologer-requests/{ADMIN_REQUEST_ID}/      admin   important
 59    /admin/ai-astrologers/                              admin   critical
 60    /admin/ai-astrologers/  [create modal open]         admin   important
 61    /admin/coins/                                       admin   critical
 62    /admin/coins/plans/                                 admin   important
 63    /admin/kundli-support/                              admin   important
```

**Mobile admin:** Re-run steps 51–63 with mobile project, opening sidebar drawer before each capture.

---

## Phase 5 — Astrologer session (`storage/astrologer.json`)

```
ORDER  ROUTE                                              GROUP      PRIORITY
─────  ─────────────────────────────────────────────────  ─────────  ────────
 64    /astrologer/                                        astrologer critical
 65    /astrologer/profile/                                astrologer critical
 66    /astrologer/services/                               astrologer critical
 67    /astrologer/settings/                               astrologer important
```

---

## Phase 6 — Optional / destructive (run last)

These consume tokens, trigger redirects, or need mocks.

```
ORDER  ROUTE / ACTION                                     GROUP   PRIORITY
─────  ─────────────────────────────────────────────────  ──────  ────────
 68    /auth/verify-email/?token={FRESH_VERIFY_TOKEN}     auth    optional
 69    /auth/google/callback/?token={MOCK_JWT}            auth    optional
 70    /pricing/  [Razorpay modal mock]                   wallet  optional
 71    /services/horoscope/result/{DETAILED_ID}/          horoscope optional
 72    /?error=account_deactivated  [deactivated astro]    astrologer optional
```

---

## Playwright Script Skeleton

```typescript
// tests/screenshots/capture.spec.ts
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: 'screenshots/.env.seed' });

const SEED = {
  kundliResultId: process.env.KUNDLI_RESULT_ID!,
  kundliShareToken: process.env.KUNDLI_SHARE_TOKEN!,
  // ... etc
};

async function snap(page, path: string) {
  await page.waitForLoadState('networkidle');
  await page.locator('[data-loading="true"]').waitFor({ state: 'hidden' }).catch(() => {});
  await expect(page).toHaveScreenshot(path, { fullPage: true });
}

test.describe('Phase 1 — Guest', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('01 home', async ({ page }) => {
    await page.goto('/');
    await snap(page, 'marketing/home__guest.png');
  });

  // ... follow execution order
});

test.describe('Phase 2 — User', () => {
  test.use({ storageState: 'storage/user.json' });

  test('31 kundli generate', async ({ page }) => {
    await page.goto('/services/kundli/generate/');
    await snap(page, 'kundli/generate-empty__user.png');
  });
});
```

---

## Execution Checklist

- [ ] Backend running with seeded data (`localhost:3001` or configured API URL)
- [ ] Frontend running (`localhost:3000`)
- [ ] WebSocket/realtime enabled for wallet + chat shots
- [ ] `screenshots/.env.seed` populated with all fixture IDs
- [ ] Storage state files generated (Phase 0)
- [ ] Run desktop project: `npx playwright test tests/screenshots --project=desktop`
- [ ] Run mobile project: `npx playwright test tests/screenshots --project=mobile`
- [ ] Review diff against baseline if using `--update-snapshots`
- [ ] Verify no placeholder footer content visible (note in audit for future fix)

---

## Routes Excluded (not built)

Do **not** screenshot — these return 404 today:

| Route | Reason |
|-------|--------|
| `/services/ai-reports/` | No page exists |
| `/services/consultation/` | No page exists |
| `/privacy/` | No page exists |
| `/terms/` | No page exists |
| `/refund/` | No page exists |
| `/admin/astrologers/[id]/edit/` | No page exists (button links here) |

Add to this plan when pages are implemented.
