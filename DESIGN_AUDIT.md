# Anantastro Design Audit

**Generated:** June 13, 2026  
**Scope:** Frontend app (`/app`) and backend (`/backend`) for product/domain context  
**Stack:** Next.js 16 App Router · React 19 · shadcn/ui + Radix · Tailwind CSS v4 · Redux RTK Query · next-intl

---

# Product Structure

## Page Inventory

Anantastro is a Vedic astrology platform offering birth-chart generation (Kundli), horoscopes, matchmaking, AI astrologer chat, and a coin-based wallet. The frontend has **43 routes** plus a custom 404 view, all under `app/[locale]/`.

### Public — Marketing & Info

| Route | File |
|-------|------|
| `/` | `app/[locale]/page.tsx` |
| `/about/` | `app/[locale]/about/page.tsx` |
| `/contact/` | `app/[locale]/contact/page.tsx` |
| `/pricing/` | `app/[locale]/pricing/page.tsx` |
| `/astrologers/` | `app/[locale]/astrologers/page.tsx` |

### Auth

| Route | File |
|-------|------|
| `/auth/login/` | `app/[locale]/auth/login/page.tsx` |
| `/auth/register/` | `app/[locale]/auth/register/page.tsx` |
| `/auth/google/callback/` | `app/[locale]/auth/google/callback/page.tsx` |
| `/auth/verify-email/` | `app/[locale]/auth/verify-email/page.tsx` |
| `/auth/verify-email/success/` | `app/[locale]/auth/verify-email/success/page.tsx` |
| `/auth/verify-email/error/` | `app/[locale]/auth/verify-email/error/page.tsx` |

### User Account (authenticated)

| Route | File |
|-------|------|
| `/profile/` | `app/[locale]/profile/page.tsx` |
| `/reports/` | `app/[locale]/reports/page.tsx` |
| `/wallet/` | `app/[locale]/wallet/page.tsx` |
| `/conversations/` | `app/[locale]/conversations/page.tsx` |
| `/chat/[sessionId]/` | `app/[locale]/chat/[sessionId]/page.tsx` |

### Services — Kundli

| Route | File |
|-------|------|
| `/services/kundli/generate/` | `app/[locale]/services/kundli/generate/page.tsx` |
| `/services/kundli/result/[id]/` | `app/[locale]/services/kundli/result/[id]/page.tsx` |
| `/services/kundli/share/[token]/` | `app/[locale]/services/kundli/share/[token]/page.tsx` |

Shared result UI: `app/[locale]/services/kundli/result/KundliResultContent.tsx`

### Services — Horoscope

| Route | File |
|-------|------|
| `/services/horoscope/` | `app/[locale]/services/horoscope/page.tsx` |
| `/services/horoscope/result/[id]/` | `app/[locale]/services/horoscope/result/[id]/page.tsx` |
| `/services/horoscope/share/[token]/` | `app/[locale]/services/horoscope/share/[token]/page.tsx` |

### Services — Matchmaking

| Route | File |
|-------|------|
| `/services/matchmaking/` | `app/[locale]/services/matchmaking/page.tsx` |
| `/services/matchmaking/result/[id]/` | `app/[locale]/services/matchmaking/result/[id]/page.tsx` |
| `/services/matchmaking/share/[token]/` | `app/[locale]/services/matchmaking/share/[token]/page.tsx` |

### Astrologer Portal

| Route | File |
|-------|------|
| `/astrologer/` | `app/[locale]/astrologer/page.tsx` |
| `/astrologer/profile/` | `app/[locale]/astrologer/profile/page.tsx` |
| `/astrologer/services/` | `app/[locale]/astrologer/services/page.tsx` |
| `/astrologer/settings/` | `app/[locale]/astrologer/settings/page.tsx` |
| `/astrologer/register/` | `app/[locale]/astrologer/register/page.tsx` |
| `/astrologer/register/success/` | `app/[locale]/astrologer/register/success/page.tsx` |

### Admin Portal

| Route | File |
|-------|------|
| `/admin/` | `app/[locale]/admin/page.tsx` |
| `/admin/users/` | `app/[locale]/admin/users/page.tsx` |
| `/admin/users/[id]/` | `app/[locale]/admin/users/[id]/page.tsx` |
| `/admin/users/[id]/edit/` | `app/[locale]/admin/users/[id]/edit/page.tsx` |
| `/admin/astrologers/` | `app/[locale]/admin/astrologers/page.tsx` |
| `/admin/astrologers/[id]/` | `app/[locale]/admin/astrologers/[id]/page.tsx` |
| `/admin/astrologer-requests/` | `app/[locale]/admin/astrologer-requests/page.tsx` |
| `/admin/astrologer-requests/[id]/` | `app/[locale]/admin/astrologer-requests/[id]/page.tsx` |
| `/admin/ai-astrologers/` | `app/[locale]/admin/ai-astrologers/page.tsx` |
| `/admin/coins/` | `app/[locale]/admin/coins/page.tsx` |
| `/admin/coins/plans/` | `app/[locale]/admin/coins/plans/page.tsx` |
| `/admin/kundli-support/` | `app/[locale]/admin/kundli-support/page.tsx` |

### Special Views

| Route | File | Notes |
|-------|------|-------|
| 404 | `app/[locale]/not-found.tsx` | Custom not-found page |

### Missing Pages (linked in nav but no route exists)

| Linked path | Referenced from |
|-------------|-----------------|
| `/services/ai-reports/` | Navbar, Footer, home `AIReportsSection`, 404 page |
| `/services/consultation/` | Footer |
| `/privacy/` | Footer |
| `/terms/` | Footer |
| `/refund/` | Footer |
| `/admin/astrologers/[id]/edit/` | Admin astrologers list (button navigates here) |

---

## Route Inventory

### Routing Infrastructure

| File | Purpose |
|------|---------|
| `i18n/routing.ts` | Locales: `en`, `hi`, `bn`, `ta`, `te`, `mr`, `gu`, `kn`, `ml`, `pa`, `or`, `as`, `ur`; default `en`; prefix `as-needed` |
| `i18n/navigation.ts` | Locale-aware `Link`, `useRouter`, `usePathname`, `redirect` |
| `middleware.ts` | next-intl locale detection only — **no auth** |
| `next.config.ts` | `trailingSlash: true`, standalone output |

### Layout Hierarchy

| Layout | File | Guard | Shell |
|--------|------|-------|-------|
| Root | `app/layout.tsx` | None | Passthrough |
| Locale | `app/[locale]/layout.tsx` | None | Redux, ProfileChecker, ConditionalLayout, Toaster |
| Auth | `app/[locale]/auth/layout.tsx` | `GuestRoute` | Redirects authenticated users |
| Admin | `app/[locale]/admin/layout.tsx` | `ProtectedRoute requireAdmin` | Fixed admin Sidebar |
| Astrologer | `app/[locale]/astrologer/layout.tsx` | `ProtectedRoute requireAstrologer` (except register) | Fixed astrologer Sidebar |

### Code Splitting

No explicit `dynamic()` or `React.lazy` usage. Next.js automatic per-route code splitting applies to each `page.tsx`.

### Auth Guard Matrix

| Route group | Guard | Redirect on failure |
|-------------|-------|---------------------|
| `/auth/*` | `GuestRoute` | Authenticated → `/admin` (admin) or `/` |
| `/admin/*` | `ProtectedRoute requireAdmin` | → `/auth/login` or `/` |
| `/astrologer/*` (dashboard) | `ProtectedRoute requireAstrologer` | → login, `/`, or `/?error=account_deactivated` |
| `/astrologer/register/*` | `ProtectedRoute` (auth only) | → `/auth/login` |
| `/profile`, `/reports`, `/wallet` | Page-level `useAuth` check | → `/auth/login` |
| `/wallet`, `/chat/*`, `/pricing` | Also set `?next=` return URL | Login (but **not consumed** — see UX Problems) |
| Service generate/result pages | Page-level auth check | → login |
| Share pages (`/services/*/share/[token]/`) | **None** — public token access | — |
| `/conversations/` | **No client guard** | Relies on API 401 |
| Marketing pages | Public | — |

---

## Navigation Map

### Three UI Shells

```
┌─────────────────────────────────────────────────────────────┐
│  PUBLIC SHELL (ConditionalLayout)                           │
│  Navbar (sticky) → main content → Footer                    │
│  Hidden for: /admin/*, /astrologer/* (except register)      │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────────────────────────────────────┐
│ ADMIN        │  Main content (ml-64, px-8 py-6)             │
│ Sidebar      │                                              │
│ (fixed 256px)│                                              │
└──────────────┴──────────────────────────────────────────────┘

┌──────────────┬──────────────────────────────────────────────┐
│ ASTROLOGER   │  Main content (ml-64, px-8 py-6)             │
│ Sidebar      │                                              │
│ (fixed 256px)│                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Public Navbar (`components/Navbar.tsx`)

**Desktop primary nav:**
- **Services** (dropdown)
  - Kundli → `/services/kundli/generate/`
  - Horoscope → `/services/horoscope/`
  - Matchmaking → `/services/matchmaking/`
  - AI Reports → `/services/ai-reports/` ⚠ missing
- Astrologers → `/astrologers/`
- Become Astrologer → `/astrologer/register/` (hidden if user is astrologer)
- Pricing → `/pricing/`
- About → `/about/`
- Contact → `/contact/`

**Authenticated extras:** CoinNavPill, LanguageSwitcher

**User dropdown (role-aware):**
- **Admin:** Admin Panel → `/admin/`, Logout
- **Non-admin:** Profile, My Reports, Wallet, Conversations, Logout
- **Guest:** Login, Register

Mobile: hamburger `DropdownMenu` mirrors desktop links (breakpoint `lg`).

### Footer (`components/Footer.tsx`)

- **Services:** kundli, horoscope, matchmaking, ai-reports ⚠, live consultation ⚠
- **Quick links:** astrologers, pricing, profile, about, contact
- **Legal:** privacy ⚠, terms ⚠, refund ⚠
- **Contact:** placeholder phone/address (`+1 (555) 123-4567`, `123 Astrology Street`)

### Admin Sidebar (`components/admin/Sidebar.tsx`)

Dashboard · Users · Astrologers · Astrologer Requests · AI Chat Astrologers · Coins overview · Coin packs · Kundli Support · Logout

### Astrologer Sidebar (`components/astrologer/Sidebar.tsx`)

Dashboard · My Profile · Services & Pricing · Settings · Notifications badge · Logout

### Profile Settings (in-page tabs, not routes)

`/profile/` uses `SettingsSidebar`: Basic Info | Kundli Profile | Password

### Language Switcher

`components/LanguageSwitcher.tsx` — shows **en** and **hi** only (`selectorLocales`), though 13 locales are configured in routing.

---

## User Roles

### Frontend Roles (Redux / API)

| Role | Value | Default |
|------|-------|---------|
| End user | `user` | Yes |
| Platform admin | `admin` | |
| Human astrologer | `astrologer` | |

**Source:** `store/api/authApi.ts`, `store/slices/authSlice.ts`  
**Selectors:** `selectIsAdmin`, `selectIsAstrologer`, `selectUserRole`

### Backend Authorization

| Guard | Behavior |
|-------|----------|
| `JwtAuthGuard` | Standard JWT auth |
| `AdminGuard` | Requires `role === 'admin'` from JWT payload |
| `AstrologerGuard` | Re-fetches user from DB; requires `role === 'astrologer'` |

No fine-grained permissions matrix — access is coarse role-based only.

### Role → Post-Login Destination

| Role | Redirect |
|------|----------|
| `admin` | `/admin/` |
| Others + pending kundli form data in Redux | `/services/kundli/generate/` |
| Default | `/` |

### Two "Astrologer" Concepts

1. **AI Astrologers** — catalog personas for chat (`GET /chat/astrologers`); shown on `/astrologers/`
2. **Human Astrologers** — onboarding via `/astrologer/register/`; admin approval workflow; **no public consumer listing API yet** (backend has `isVisible` on profiles but no browse endpoint)

---

## User Journeys

### A. Registration & Onboarding (Primary Conversion Funnel)

```
Home (Hero kundli form)
  ├─ Guest → stores birth data in Redux → /auth/register/
  └─ Authenticated → /services/kundli/generate/

Register
  ├─ Email verification required → stay on register, check email
  ├─ Immediate token + kundli data → /services/kundli/generate/
  └─ Immediate token, no kundli data → /

Verify email (/auth/verify-email/?token=...) → / or error page
```

**Key files:** `components/home/HeroSection.tsx`, `store/slices/kundliFormSlice.ts`

### B. Login (Email + Google OAuth)

```
/auth/login/
  ├─ Admin → /admin/
  ├─ Pending kundli form in Redux → /services/kundli/generate/
  └─ Default → /

Google OAuth → /auth/google/callback/ → same role-based logic
```

Local users blocked until email verified (`403 EMAIL_NOT_VERIFIED`). Google users skip verification.

### C. Core Service Flows (Coin-Gated)

All require auth. Insufficient coins → redirect to `/pricing/`.

| Service | Generate | Result | Public Share |
|---------|----------|--------|--------------|
| Kundli | `/services/kundli/generate/` | `/services/kundli/result/[id]/` | `/services/kundli/share/[token]/` |
| Horoscope | `/services/horoscope/` | `/services/horoscope/result/[id]/` | `/services/horoscope/share/[token]/` |
| Matchmaking | `/services/matchmaking/` | `/services/matchmaking/result/[id]/` | `/services/matchmaking/share/[token]/` |

Report history aggregated at `/reports/`.

**Default coin costs (backend):** kundli 10 · matchmaking 15 · horoscope 10 · chat minute 5

### D. AI Chat with Astrologers

```
/astrologers/ (browse AI personas)
  ├─ Start chat (authed) → select kundli profile → /chat/[sessionId]/
  └─ Not authed → /auth/login?next=/astrologers

/conversations/ — session list
/wallet/ — coin balance (real-time via WebSocket)
/pricing/ — buy coin packs (Razorpay)
```

Per-minute billing debits coins during active chat sessions.

### E. Become a Human Astrologer

```
Navbar "Become Astrologer" → /astrologer/register/ (multi-step wizard, ~1000 lines)
  → /astrologer/register/success/
Admin reviews at /admin/astrologer-requests/
  → Approve → user role becomes astrologer → /astrologer/ dashboard
```

### F. Admin Operations

Entry: user menu → Admin Panel (admin role only)

User CRUD · Astrologer management · AI astrologer config · Coin plans & costs · Kundli debug/support tooling · Impersonation (`login-as`)

### G. Profile & Settings

`/profile/` — tabbed settings (Basic Info, Kundli birth profiles, Password). No separate routes per tab.

---

# Component Inventory

## Shared Components

### shadcn/ui Primitives (`components/ui/`)

| Component | File | Notes |
|-----------|------|-------|
| Button | `button.tsx` | CVA variants: default, destructive, outline, secondary, ghost, link |
| Input | `input.tsx` | h-9, `aria-invalid` styling |
| Textarea | `textarea.tsx` | min-h-16 |
| Label | `label.tsx` | Radix Label |
| Select | `select.tsx` | Radix Select |
| Switch | `switch.tsx` | Radix Switch |
| Card | `card.tsx` | rounded-xl; Header/Title/Description/Content/Footer |
| Dialog | `dialog.tsx` | Radix Dialog |
| Dropdown Menu | `dropdown-menu.tsx` | Radix |
| Navigation Menu | `navigation-menu.tsx` | Used in Navbar |
| Popover | `popover.tsx` | Radix |
| Calendar | `calendar.tsx` | react-day-picker wrapper |
| Date Picker | `date-picker.tsx` | Popover + DayPicker |
| Table | `table.tsx` | Table/Header/Body/Row/Head/Cell |
| Badge | `badge.tsx` | default/secondary/destructive/outline |
| Alert | `alert.tsx` | `role="alert"` |
| Separator | `separator.tsx` | Radix |
| Sonner | `sonner.tsx` | Toast notifications |

### App-Level Shared

| Component | File |
|-----------|------|
| Navbar | `components/Navbar.tsx` |
| Footer | `components/Footer.tsx` |
| Header (legacy, unused) | `components/Header.tsx` |
| CelestialBackground | `components/CelestialBackground.tsx` |
| ConditionalLayout | `components/ConditionalLayout.tsx` |
| LanguageSwitcher | `components/LanguageSwitcher.tsx` |
| ProfileChecker | `components/ProfileChecker.tsx` |

### Coins

| Component | File |
|-----------|------|
| CoinNavPill | `components/coins/CoinNavPill.tsx` |
| CoinGlyph | `components/coins/CoinGlyph.tsx` |
| ServiceCostBanner | `components/coins/ServiceCostBanner.tsx` |

### Auth

| Component | File |
|-----------|------|
| GuestRoute | `components/auth/GuestRoute.tsx` |
| ProtectedRoute | `components/admin/ProtectedRoute.tsx` |

**Icons:** lucide-react (primary), react-icons (sparse — zodiac icons in Hero)

---

## Feature-Specific Components

### Home / Marketing (`components/home/`)

HeroSection · FeaturesSection · FeaturesGridSection · HowItWorksSection · AIReportsSection · CTASection

### Kundli (`components/kundli/`)

**Charts:** NorthIndianDiamondChart · AstroChartRadix · KundliChart  
**Result tabs:** KundliDashboardTab · KundliDashaTab · KundliAshtakvargaTab · YogHighlightStrip  
**Icons:** PlanetIcon · ZodiacIcon  
**Forms:** BirthGenderSelect · generate/BirthDetailsForm · generate/GetKundliSection  
**Landing blocks:** KundliGenerateHero · WhatIsKundli · HowItWorks · WhyDetailsMatter · WhatYouGet · KundliFaq · KundliFinalCta

### Matchmaking (`components/matchmaking/`)

MatchmakingFormSection · MatchmakingResult · MatchmakingPartnerKundlis · MatchmakingHero · WhatIsGunMilan · MatchmakingHowItWorks · MatchmakingWhyDetailsMatter · MatchmakingWhatYouGet · MatchmakingFaq · MatchmakingFinalCta

### Settings (`components/settings/`)

SettingsSidebar · BasicInfoTab · KundliProfileTab · ManagePasswordTab

### Reports (`components/reports/`)

SocialShareButtons · WhatsAppIcon · AiTranslateBar

### Admin / Astrologer Dashboards

`components/admin/Sidebar.tsx` · `components/astrologer/Sidebar.tsx`

### Page-Level Feature Content (not extracted)

- `app/[locale]/services/kundli/result/KundliResultContent.tsx` — large kundli result UI
- Horoscope, chat, wallet, pricing, reports pages contain substantial inline UI

---

## Layout Components

| Layout | File | Structure |
|--------|------|-----------|
| Root | `app/layout.tsx` | Passthrough |
| Locale shell | `app/[locale]/layout.tsx` | `<html lang>`, Geist fonts, Redux, ProfileChecker, ConditionalLayout, Toaster |
| Public shell | `ConditionalLayout.tsx` | Navbar + `<main>` + Footer |
| Admin dashboard | `admin/layout.tsx` | Fixed Sidebar (w-64) + scrollable main (ml-64) |
| Astrologer dashboard | `astrologer/layout.tsx` | Same pattern; register bypasses shell |
| Auth | `auth/layout.tsx` | GuestRoute wrapper only |

**Container widths:** `max-w-7xl` (marketing) · `max-w-6xl` (profile) · `max-w-5xl` (chat, conversations)

---

## Forms

### Validation Patterns

| Pattern | Where | Libraries |
|---------|-------|-----------|
| react-hook-form + zod | Auth login/register | `@hookform/resolvers/zod`, inline Zod schemas with i18n |
| Controlled useState + manual validation | Settings tabs, kundli/matchmaking flows | Toast errors, no schema lib |
| Multi-step wizard | MatchmakingFormSection, astrologer register | Step validators from parent page |

### Reusable Form Blocks

- `BirthDetailsForm` — name, gender, DOB (DatePicker), time, place autocomplete
- `BirthGenderSelect` — native `<select>` (inconsistent with shadcn Select elsewhere)
- `DatePicker` — `yyyy-MM-dd` string API
- shadcn Input, Label, Textarea, Select, Switch, Button

### Error Display Conventions

- Auth: `formState.errors` + `aria-invalid` on inputs
- Most other forms: toast-only errors (no inline field messages)

---

## Tables

### shadcn Table (Admin CRUD)

- `admin/users/page.tsx`
- `admin/astrologers/page.tsx`
- `admin/astrologer-requests/page.tsx`

Uses `components/ui/table.tsx` — no TanStack Table or data-table abstraction.

### Custom HTML Tables (Domain Data)

- `KundliAshtakvargaTab.tsx` — 12-house score matrix, sticky first column, horizontal scroll
- `KundliResultContent.tsx` — planet positions, KP, cusps
- `reports/page.tsx` — definition lists with `sr-only` labels

---

## Charts

| Type | Location | Library / Technique |
|------|----------|---------------------|
| Admin dashboard bar charts | `admin/page.tsx` | **recharts** — BarChart, ResponsiveContainer (h=300) |
| Western radix chart | `kundli/AstroChartRadix.tsx` | **@astrodraw/astrochart** (dynamic require) |
| North Indian diamond chart | `kundli/NorthIndianDiamondChart.tsx` | Custom SVG (350×350) |
| Ashtakvarga scores | `kundli/KundliAshtakvargaTab.tsx` | HTML table, not chart library |

**recharts palette:** `#3b82f6` (users), `#10b981` (astrologers), `#8884d8` (requests) — generic blues/greens, not brand-aligned.

---

# Current Design Analysis

## Typography

| Token | Value | Source |
|-------|-------|--------|
| Sans (body) | **Geist Sans** via `--font-geist-sans` | `app/[locale]/layout.tsx` (next/font) |
| Mono | **Geist Mono** via `--font-geist-mono` | Same |
| Body fallback | `Arial, Helvetica, sans-serif` | `globals.css` |
| Display / brand | `font-serif font-bold` on headings | Hero, Footer, brand name — **system serif, not loaded** |
| Base body | `antialiased` on `<body>` | layout |

**Text scale (ad hoc, not tokenized):**

| Context | Classes |
|---------|---------|
| Hero headlines | `text-4xl md:text-5xl lg:text-6xl` |
| Section titles | `text-3xl md:text-4xl` |
| Admin page titles | `text-3xl font-bold` |
| UI controls | `text-sm` (buttons, inputs) |

**Issue:** Mixing Geist Sans body with system serif display creates an unintentional dual-font system without a loaded display face.

---

## Spacing

No dedicated spacing token file. Conventions emerge from repeated Tailwind usage:

| Pattern | Values |
|---------|--------|
| Section vertical padding | `py-16 md:py-20` or `py-20` |
| Section horizontal padding | `px-4 md:px-8` |
| Container max width | `max-w-7xl` · `max-w-6xl` · `max-w-5xl` |
| Grid gaps | `gap-4`, `gap-6`, `gap-8` |
| Card padding | `px-6 py-6` (Card default), `p-4 md:p-6` (overrides) |
| Admin/astrologer main | `px-8 py-6` |
| Border radius | `--radius: 0.5rem` → `rounded-md` / `rounded-lg` / `rounded-xl` |

Grid breakpoints: `grid-cols-1` → `sm:grid-cols-2` → `md:grid-cols-2/3` → `lg:grid-cols-3/4`

---

## Colors

### Brand Palette (`globals.css`)

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#f37833` | CTAs, active nav, accents |
| Primary light | `#fcbb18` | Header/footer/hero backgrounds |
| Primary dark / cream | `#794235` | Text on gold backgrounds, borders |
| Hover (inline) | `#d6682a` | Hero/CTA hover — not a token |
| WhatsApp | `#25D366` | Share buttons |

### shadcn HSL Variables

| Variable | HSL | Approx |
|----------|-----|--------|
| `--primary` | `20 85% 55%` | Orange (~brand) |
| `--background` | `0 0% 100%` | White |
| `--foreground` | `0 0% 3.9%` | Near black |
| `--muted` | `0 0% 96.1%` | Light gray |
| `--muted-foreground` | `0 0% 45.1%` | Mid gray |
| `--destructive` | `0 84.2% 60.2%` | Red |
| `--ring` | `20 85% 55%` | Focus ring = primary |

### Dark Mode

`.dark { ... }` variables defined in `globals.css`, but **no ThemeProvider** mounted — dark tokens exist in UI primitives and Sonner but app-wide dark mode is inactive.

### Color System Fragmentation

Three parallel systems coexist:
1. shadcn HSL CSS variables (`hsl(var(--primary))`)
2. Tailwind `@theme` hex tokens (`--color-primary: #f37833`)
3. Ad hoc Tailwind utility colors (`gray-50`, `amber-50`, `violet-600`, `emerald-600`, `rose-50`)

Feature pages diverge visually — e.g. conversations uses violet/fuchsia gradients while the rest of the app uses gold/orange.

---

## Responsiveness

**Breakpoints:** Tailwind defaults (sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536). No custom config.

| Pattern | Behavior |
|---------|----------|
| Navbar | Full nav hidden below `lg`; hamburger menu |
| Language label | Hidden below `sm` |
| Coin pill | `hidden sm:inline-flex` in navbar |
| Section CTAs | `flex-col` → `sm:flex-row` |
| Matchmaking form | Stacked → `lg:grid-cols-[1fr_auto_1fr]` |
| Chat messages | `max-w-[90%]` → `sm:max-w-[86%]` |
| Admin/astrologer sidebars | **Fixed 256px, no mobile collapse** — content area uses `ml-64` unconditionally |

**Critical gap:** Dashboard layouts assume desktop width. On mobile/tablet, fixed sidebars consume ~40% of viewport with no drawer or collapse pattern.

---

## Accessibility

### Strengths

- Radix primitives (Dialog, Select, Dropdown, NavigationMenu, Switch, Label) provide focus trapping and keyboard navigation
- `html lang={locale}` from next-intl
- `focus-visible:ring-[3px]` on Button, Input, Textarea, Select
- `aria-invalid` styling on form controls
- `sr-only` on Dialog close button, reports definition terms
- `aria-label` on LanguageSwitcher, kundli tab nav, YogHighlightStrip
- `role="alert"` on Alert component
- Semantic `<nav>`, `<main>`, `<footer>`, `<aside>` in key layouts

### Gaps

| Issue | Location |
|-------|----------|
| Mobile menu button lacks `aria-label` | `Navbar.tsx` |
| `CardTitle` renders `<div>`, not heading | `ui/card.tsx` — heading hierarchy often manual |
| Footer social links — icons only, no `aria-label` | `Footer.tsx` |
| `BirthGenderSelect` uses native `<select>` while other fields use Radix | Inconsistent assistive tech behavior |
| Dark mode tokens unused at app level | Incomplete theme support |
| Decorative icons lack `aria-hidden` in places | Various |
| Admin tables — no sort/filter ARIA patterns | Admin pages |
| Placeholder contact info in footer | Misleading for screen reader users |
| Gold-on-brown contrast in footer/header | May fail WCAG AA for small text |

---

# UX Problems

## Navigation Issues

1. **Six+ dead-end links** — Navbar, Footer, home, and 404 page link to routes that don't exist (`/services/ai-reports/`, `/services/consultation/`, `/privacy/`, `/terms/`, `/refund/`, `/admin/astrologers/[id]/edit/`).

2. **`?next=` redirect param ignored** — Wallet, chat, pricing, and astrologers pages set `?next=` on login redirect, but the login page never reads it. Users are sent to role-based defaults instead of their intended destination.

3. **Inconsistent auth guards** — `/conversations/` has no client-side redirect (unlike profile/reports/wallet). Unauthenticated users see a loading/empty state rather than being guided to login.

4. **Three disconnected shells** — Public, admin, and astrologer UIs share no navigation bridge. An astrologer who is also a user must use the user dropdown or manually navigate; no unified account hub.

5. **"Astrologers" naming confusion** — `/astrologers/` shows AI chat personas, while "Become Astrologer" leads to human astrologer registration. Users may expect human astrologers on the astrologers page.

6. **Language switcher vs configured locales** — 13 locales configured in routing, but only en/hi shown in the switcher. Users of other Indian languages have no UI entry point.

7. **Profile link in footer for guests** — Footer links to `/profile/` without auth check; guests hit a redirect loop or login page unexpectedly.

## Visual Hierarchy Issues

1. **Dual visual languages** — Marketing pages use gold/celestial theme (`#fcbb18` backgrounds, serif headings). Chat/conversations use violet/fuchsia/indigo gradients. Admin uses neutral gray + recharts blues. No unified visual system across feature areas.

2. **Competing CTAs on home** — Hero embeds a full kundli form; below it are additional feature sections and CTAs. Primary action (generate kundli) competes with secondary paths.

3. **Coin cost visibility inconsistent** — Hero shows coin cost via `CoinGlyph`; some service pages use `ServiceCostBanner`; others mention cost only after auth failure or at checkout.

4. **Admin dashboard charts use off-brand colors** — recharts defaults (`#3b82f6`, `#10b981`) don't match the orange/gold brand palette.

5. **CardTitle as div** — Semantic heading levels are applied inconsistently; some pages use CardTitle where an h2/h3 would improve document outline.

6. **Placeholder content in production UI** — Footer phone number, address, and social links point to generic placeholders.

## Friction Points

1. **Email verification gate** — Local registration requires email verification before login. Users who miss the email have limited in-app guidance (resend exists but flow is easy to abandon).

2. **Kundli profile required for chat** — Starting a chat requires selecting or creating a kundli profile via a dialog. Multi-step friction before first message.

3. **Coin purchase interrupt** — Insufficient coins redirect to `/pricing/` mid-flow. No inline "buy coins" modal; user loses service page context.

4. **Multi-step forms without progress persistence** — Astrologer registration wizard (~1000 lines) and matchmaking 3-step form don't persist progress across sessions or page refresh.

5. **Birth data re-entry** — Hero captures birth data in Redux for guests, but if Redux state is lost (refresh, new tab), data must be re-entered.

6. **Share → convert gap** — Public share pages show results but have no clear CTA to generate your own kundli or sign up.

7. **Client-side auth flash** — All route protection is client-side. Protected pages briefly render loading states or flash content before redirect.

8. **Admin impersonation discoverability** — "Login as user" exists in admin but has no visual indicator when impersonating; easy to forget you're in another user's context.

## Inconsistent Patterns

| Area | Inconsistency |
|------|---------------|
| Forms | Auth uses zod + react-hook-form; settings/kundli use manual validation + toast |
| Select inputs | shadcn Select vs native `<select>` in BirthGenderSelect |
| Error feedback | Inline field errors (auth) vs toast-only (everywhere else) |
| Page headers | Marketing uses celestial-header gradient; services use white cards; admin uses plain text h1 |
| Loading states | Mix of skeleton-less text ("Loading..."), spinner-less waits, and Card wrappers |
| Tables | shadcn Table in admin vs raw HTML tables in kundli results |
| Auth redirect | Some pages use `router.push`, others `router.replace`; some set `?next=`, others don't |
| Brand naming | "AnantAstro" (admin sidebar) vs nav translation key "brand" vs domain anantastro.com |
| Logout | Admin sidebar calls API logout; Navbar uses useAuth hook — same outcome but different code paths |
| i18n coverage | Nav/footer translated; admin sidebar hardcoded English |

---

# Redesign Opportunities

## Quick Wins

1. **Fix or remove dead links** — Either create stub pages for ai-reports, consultation, and legal pages, or remove links until ready. Highest-impact trust fix.

2. **Implement `?next=` on login** — Read search param and redirect after successful auth. Four pages already set it; login page is the only missing piece.

3. **Add auth guard to `/conversations/`** — Match profile/reports/wallet pattern for consistent behavior.

4. **Accessibility pass on Navbar and Footer** — Add `aria-label` to mobile menu button and social icon links; fix footer placeholder contact info.

5. **Unify admin chart colors** — Replace recharts defaults with brand palette (`#f37833`, `#fcbb18`, `#794235`).

6. **Expand or document language switcher** — Either expose all 13 locales or add "coming soon" for the rest; avoid silent partial support.

7. **Remove dead code** — `components/Header.tsx` is unused (Navbar replaced it).

8. **Consistent logout** — Single logout utility used by Navbar, admin sidebar, and astrologer sidebar.

9. **Add `/reports/` to Services dropdown** — Reports exist but aren't in the Services nav; users discover them only via user menu.

10. **Inline coin purchase CTA** — When coin balance is insufficient, show modal with pricing snippet instead of full-page redirect.

## Medium Improvements

1. **Design token consolidation** — Single source of truth for colors, spacing, and typography. Replace ad hoc hex/Tailwind colors with semantic tokens (`--color-surface`, `--color-accent`, `--text-display`).

2. **Load a display font** — Replace system serif with a loaded typeface (e.g. Playfair Display, Cormorant) for brand headings to complete the celestial identity.

3. **Responsive dashboard layouts** — Collapsible sidebar drawer for admin/astrologer on mobile; hamburger + overlay pattern matching public Navbar.

4. **Unified form pattern** — Standardize on react-hook-form + zod across all forms with shared field components and inline error display.

5. **Shared page header component** — Consistent title, breadcrumb, and action slot for service pages, account pages, and dashboards.

6. **Service landing page template** — Kundli, horoscope, and matchmaking already share a pattern (Hero → WhatIs → HowItWorks → WhyDetails → WhatYouGet → FAQ → FinalCta). Extract into a reusable layout to reduce duplication and ensure visual consistency.

7. **Share page conversion funnel** — Add sticky CTA bar on public share pages: "Generate your own Kundli" with signup/login.

8. **Progress persistence** — Save wizard state (astrologer register, matchmaking) to localStorage or server draft.

9. **Coin balance prominence** — Persistent coin indicator across service flows (not just navbar); show cost before form submission, not after.

10. **Admin i18n** — Translate admin sidebar and table headers; or explicitly scope admin as English-only and document the decision.

11. **Human vs AI astrologer clarity** — Rename `/astrologers/` to `/ai-astrologers/` or add tabbed UI distinguishing AI chat from human consultation (when built).

12. **Impersonation banner** — Visible top bar when admin is logged in as another user, with "Exit impersonation" action.

## Major Redesign Opportunities

1. **Unified design system** — Formalize the celestial/gold brand across all surfaces. Eliminate violet chat theme, generic admin grays, and competing gradients. Create a Figma/token spec with light (and optionally dark) modes.

2. **Information architecture overhaul** — Restructure navigation around user intent:
   - **Discover** (home, about, pricing)
   - **Services** (kundli, horoscope, matchmaking, reports)
   - **Consult** (AI chat, future human astrologers)
   - **Account** (profile, wallet, conversations, reports)

   Single account hub instead of scattered user-menu items.

3. **Server-side auth middleware** — Move route protection to Next.js middleware for instant redirects, SEO-safe gated pages, and elimination of auth flash.

4. **Human astrologer marketplace** — Backend has profiles with `isVisible` but no public listing. Design browse → book → consult flow; this is a net-new product surface requiring UX research.

5. **AI Reports hub** — Multiple report types (kundli, horoscope, matchmaking) exist but `/services/ai-reports/` and `/reports/` overlap conceptually. Consolidate into a unified reports dashboard with filtering, search, and re-share actions.

6. **Live consultation flow** — Footer links to `/services/consultation/` which doesn't exist. Requires real-time scheduling, payment, and astrologer availability UI — major feature design.

7. **Legal & trust pages** — Privacy, terms, and refund policies are linked but missing. Essential for coin purchases and astrologer KYC; design trustworthy legal page templates matching brand.

8. **Onboarding redesign** — Replace fragmented register → verify → kundli → service flow with a guided onboarding wizard: account → birth details → first free/paid report → explore services.

9. **Mobile-first service results** — Kundli result page (`KundliResultContent.tsx`) is dense with tabs, tables, and charts. Redesign for progressive disclosure on mobile: summary first, details on tap.

10. **Component library documentation** — Storybook or similar for the 79 components across ui/, kundli/, matchmaking/, etc. Enables consistent usage and faster feature development.

---

## Appendix: Key File Index

| Area | Path |
|------|------|
| Global styles / tokens | `app/globals.css` |
| shadcn config | `components.json` |
| Font setup | `app/[locale]/layout.tsx` |
| Routing / i18n | `i18n/routing.ts`, `i18n/navigation.ts` |
| Auth state | `store/slices/authSlice.ts`, `store/hooks/useAuth.ts` |
| Route guards | `components/admin/ProtectedRoute.tsx`, `components/auth/GuestRoute.tsx` |
| Public shell | `components/ConditionalLayout.tsx` |
| All shared UI | `components/ui/` |
| Backend roles | `backend/src/users/entities/user.entity.ts` |
| Backend auth | `backend/src/auth/auth.service.ts` |
| Coin pricing | `backend/src/coins/coins.service.ts` |
