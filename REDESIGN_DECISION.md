# Anantastro Redesign Decision

**Status:** Final — approved for V1 implementation  
**Date:** June 2026  
**Chosen direction:** C (Hybrid), light-first  
**Supersedes:** `REDESIGN_DIRECTIONS.md` recommendation (dark-first variant)  
**Implements via:** `DESIGN_SYSTEM.md` (light token column only for V1)

---

## Decision Summary

Anantastro V1 will use a **hybrid layout system** on a **single light color palette**. Two layout modes — Editorial and Instrument — share one token layer, one component vocabulary, and one navigation shell. Gold is an **accent only**, never a background. Dark mode is **out of scope for V1**.

| Decision | Choice |
|----------|--------|
| Direction | **C — Hybrid** |
| Theme | **Light-first only** — no dark mode in V1 |
| Display type | **Fraunces** — marketing heroes, report headings |
| UI type | **Geist Sans** — nav, forms, tables, dashboards, body copy |
| Data type | **Geist Mono** — coins, degrees, IDs, timestamps |
| Gold usage | **Accent only** — CTAs, links, coin badges, active states |
| Color system | **One unified palette** across all shells and features |

---

## Why This Direction

The audits identified a product that feels like three apps stitched together: gold marketing, purple pricing, violet chat, blue admin charts. Direction C resolves this without sacrificing either brand warmth or operational clarity.

| User moment | Layout mode | User should feel |
|-------------|-------------|------------------|
| Discovering the product | Editorial | Welcomed, curious — "this understands astrology" |
| Reading a report | Editorial | Guided, not overwhelmed |
| Talking to an AI astrologer | Editorial | Focused, intimate |
| Buying coins | Instrument | Safe, transparent — "I know what I'm paying" |
| Managing the platform | Instrument | Capable, efficient |

**Light-first for V1** aligns with the Indian market's familiarity with bright AstroTalk-style UIs, simplifies WCAG contrast compliance, and matches shadcn/ui defaults — reducing implementation risk. Dark mode may be added post-V1 without changing the mode split.

---

## Layout Modes

Two modes. Same tokens. Different density and typography emphasis.

### Editorial Mode
*Contemplative surfaces. Content leads. Generous spacing.*

| Property | Value |
|----------|-------|
| Max width | 720px (prose) · 1120px (reports) |
| Section padding | 48–64px vertical |
| Card padding | 24px |
| Headlines | Fraunces (`display-*`) |
| Body | Geist Sans `body-lg` (16px / 1.6) |
| Data default | Collapsed — progressive disclosure |
| Footer | Minimal, on marketing pages only |

**Assigned pages:**

| Page | Route |
|------|-------|
| Homepage | `/` |
| About | `/about/` |
| Reports (all) | `/reports/` · `/services/kundli/result/[id]/` · `/services/horoscope/result/[id]/` · `/services/matchmaking/result/[id]/` · share variants |
| Chat | `/chat/[sessionId]/` |

### Instrument Mode
*Operational surfaces. Data leads. Compact spacing.*

| Property | Value |
|----------|-------|
| Max width | 1280px (app) · 1440px (admin) |
| Section padding | 24–32px vertical |
| Card padding | 16px |
| Headlines | Geist Sans `heading-xl` |
| Body | Geist Sans `body-md` (14px / 1.5) |
| Data default | Visible — tables and metrics above the fold |
| Footer | None |

**Assigned pages:**

| Page | Route |
|------|-------|
| Pricing | `/pricing/` |
| Wallet | `/wallet/` |
| Admin (all) | `/admin/` · `/admin/users/` · `/admin/astrologers/` · `/admin/requests/` · etc. |
| Astrologer Dashboard (all) | `/astrologer/` · `/astrologer/profile/` · `/astrologer/services/` · `/astrologer/settings/` |

### Unassigned Pages — Default Mode

Pages not listed above follow the nearest mode by function:

| Page | Mode | Rationale |
|------|------|-----------|
| Contact | Editorial | Marketing / trust |
| AI Astrologers listing | Editorial | Discovery |
| Auth (login, register, verify) | Instrument | Forms |
| Service generate (kundli, horoscope, matchmaking) | Instrument | Forms |
| Conversations list | Instrument | App utility |
| Profile | Instrument | Account settings |
| Astrologer register | Instrument | Application form |
| 404 | Editorial | Brand moment |

---

## Typography

### Font Roles

| Role | Family | Where |
|------|--------|-------|
| **Display** | Fraunces 600 | Homepage hero, About hero, report H1, report summary headline |
| **Heading** | Geist Sans 600 | Section titles, card headers, page titles (instrument mode) |
| **Body** | Geist Sans 400 | All UI text, form labels, interpretation prose |
| **Mono** | Geist Mono | Coin amounts, planetary degrees, wallet balances, admin IDs |

### Rules

1. **Fraunces** appears on marketing heroes and report H1 only — never on buttons, tables, nav, or admin.
2. **Geist Sans** is the default for everything else.
3. Report interpretation blocks use `body-lg` with `max-width: 68ch`.
4. Coin amounts always render in Geist Mono.
5. No system serif. No third font family.
6. Every page has exactly one semantic `h1`.

### Scale Reference

| Token | Size | Usage |
|-------|------|-------|
| `display-2xl` | 48px (36px mobile) | Homepage hero |
| `display-xl` | 40px (32px mobile) | About hero, report title |
| `display-lg` | 32px (28px mobile) | Report summary insight |
| `heading-xl` | 24px | Instrument page titles |
| `heading-lg` | 20px | Section titles |
| `heading-md` | 16px | Card titles |
| `body-lg` | 16px / 1.6 | Editorial prose, interpretations |
| `body-md` | 14px / 1.5 | Default UI text |
| `body-sm` | 13px | Table cells, secondary text |
| `caption-md` | 12px | Timestamps, metadata |

---

## Color System

**One palette. Light only. Semantic tokens everywhere.**

Legacy values (`#fcbb18`, `#f37833`, `#794235`) are retired. No raw hex in components.

### V1 Tokens (Light)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#FAFAF8` | Page canvas — all pages |
| `--color-background-subtle` | `#F4F3F0` | Alternating sections (subtle, not gold) |
| `--color-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--color-surface-raised` | `#FFFFFF` | Modals, dropdowns |
| `--color-surface-sunken` | `#F4F3F0` | Input backgrounds, table zebra |
| `--color-primary` | `#C17A3A` | CTAs, links, coin accents, active tabs |
| `--color-primary-hover` | `#A86832` | Button hover |
| `--color-primary-muted` | `#FDF6EE` | Selected nav, "best value" highlight bg |
| `--color-primary-foreground` | `#FFFFFF` | Text on primary buttons |
| `--color-secondary` | `#4A5568` | Secondary actions, chart grid |
| `--color-secondary-muted` | `#F1F3F6` | Sidebar backgrounds |
| `--color-accent` | `#6B5B95` | AI/chat presence only |
| `--color-accent-muted` | `#F3F0F8` | AI bubble border bg |
| `--color-border` | `#E5E2DC` | All dividers |
| `--color-border-strong` | `#D4D0C8` | Card hover, focus |
| `--color-text-primary` | `#1A1A18` | Headlines, body |
| `--color-text-secondary` | `#5C5A55` | Descriptions |
| `--color-text-tertiary` | `#8A8780` | Metadata, axis labels |
| `--color-text-link` | `#C17A3A` | Links |
| `--color-success` | `#1A7F4B` | Approved, credit |
| `--color-warning` | `#B45309` | Pending, low balance |
| `--color-error` | `#C42B2B` | Rejected, debit, errors |

### Gold / Primary Rules

| Rule | Detail |
|------|--------|
| **Accent only** | Primary (`#C17A3A`) on buttons, links, coin badges, active nav underline, chart highlights |
| **No gold backgrounds** | No full-width gold bands, no `#fcbb18` hero sections, no gold footers |
| **≤10% per viewport** | Primary color covers at most ~10% of any screen |
| **No gradients** | No gold-to-orange gradients on heroes, wallet cards, or chat |
| **Muted for selection** | `--color-primary-muted` (`#FDF6EE`) for selected/highlighted states — not saturated gold |
| **Charts** | Primary + secondary only — no blue/green recharts defaults |

### Per-Feature Color Rules

| Feature | Rule |
|---------|------|
| **Coins & payments** | Primary for amounts; white surface cards; Razorpay lock icon + explicit total |
| **Reports** | Surface cards with border; table zebra surface/sunken; no colored row backgrounds |
| **Chat** | User bubbles: `surface` + border. AI bubbles: `accent-muted` left border — no violet gradients |
| **Admin charts** | Brand palette (primary, secondary) — not default recharts colors |
| **Status badges** | Semantic tokens only: success, warning, error, secondary |

### Retired Palettes

These are explicitly banned in V1:

| Retired | Was used on | Replacement |
|---------|-------------|-------------|
| `#fcbb18` gold backgrounds | Homepage, About, Contact, footer | `--color-background` / `--color-background-subtle` |
| Purple/lavender pricing | `/pricing/` | Unified light tokens |
| Violet chat gradients | `/chat/` | `--color-accent-muted` border accent |
| Blue/green admin charts | `/admin/` | `--color-primary` + `--color-secondary` |
| Brown `#794235` icons | About, Contact cards | `--color-secondary` or monochrome icons |

---

## Components

One component vocabulary across both modes. Mode changes padding and density, not component identity.

### Card Variants (2 only)

| Variant | Spec | Mode |
|---------|------|------|
| **Default** | `surface` + `border` + `radius-lg` | Both |
| **Interactive** | Default + `hover:border-strong` + cursor | Both |

No shadow cards. No gradient cards. No per-page card inventions.

### Button Variants (3 only)

| Variant | Spec |
|---------|------|
| **Primary** | `primary` bg, `primary-foreground` text, 40px height (48px in editorial heroes) |
| **Secondary** | `surface` bg, `border`, `text-primary` |
| **Ghost** | No bg, `text-secondary`, hover `surface-sunken` |

### Forms

- shadcn/ui inputs and Select everywhere — no native `<select>`
- react-hook-form + zod validation
- Inline field errors — no toast-only validation
- Labels above fields

### Navigation

| Element | Spec |
|---------|------|
| Top nav | 56px, `surface` + `border-b`, sticky |
| Coin pill | Persistent when authenticated — mono amount in `primary` |
| Admin/Astrologer sidebar | 256px desktop, drawer `< lg` breakpoint |
| Breadcrumbs | Required on all pages except homepage |
| Active nav | `primary` underline or `primary-muted` bg — not gold fill |

### Tables

- Instrument mode default UI pattern
- 40px row height, sticky headers, horizontal scroll on mobile
- Zebra: `surface` / `surface-sunken`
- Geist Mono for numeric columns

---

## Surface Specifications

### Homepage (Editorial)

- Fraunces hero headline, single primary CTA
- Compact quick-start form (not a competing hero card)
- 4 service tiles with visible coin costs
- Social proof strip: Razorpay · report count · languages
- 3-step "How it works" (not 4)
- Footer: white/subtle bg, real contact info, working legal links
- **No** gold sections, **no** illustrations, **no** duplicate CTAs
- Target: **<8 mobile viewport scrolls**

### About (Editorial)

- Fraunces hero, prose sections at 68ch
- Values/team cards: default card variant, no brown icon boxes
- Same footer as homepage

### Reports (Editorial)

- Sticky header: breadcrumb · title · share · translate
- Summary card: Fraunces `display-lg` for key insight
- Underline tabs, horizontally scrollable on mobile
- Data sections collapsed by default (progressive disclosure)
- Interpretation: `body-lg` prose, 68ch max-width
- Share bar: sticky bottom on mobile

### Chat (Editorial)

- Full viewport height, no global footer
- Centered thread, max 720px
- AI bubbles: `accent-muted` left border (2px) — no violet fill
- User bubbles: `surface` + `border`, right-aligned
- Header: astrologer name · rate · timer · balance (compact)
- Input: fixed bottom, 48px min height

### Pricing (Instrument)

- Geist `heading-xl` page title + one-line explainer
- 2×2 plan grid with comparison table
- "Best value": `primary` border + `primary-muted` bg
- Razorpay trust row: lock icon + "Secured by Razorpay"
- Coin explainer above plans
- Guest: "Sign in to purchase" with return URL
- Authenticated: inline Razorpay modal

### Wallet (Instrument)

- Balance card: mono `display-lg` for coin count, `primary` left-border accent
- Full-width transaction table, sortable, paginated
- Purchase via modal (not redirect to pricing)
- Low balance: inline `warning` alert
- **No** purple gradient card

### Admin (Instrument)

- Unified `DashboardSidebar` — drawer on mobile
- 4 stat cards + brand-colored charts
- Tables as primary UI for users, astrologers, requests
- No fake trend percentages
- Impersonation banner when active

### Astrologer Dashboard (Instrument)

- Same sidebar component and tokens as admin
- Service management, profile, settings in instrument density
- Same chart and table patterns as admin

---

## Anti-Patterns (V1)

These are **explicitly rejected** based on audit findings:

| Anti-pattern | Status |
|--------------|--------|
| Full-width gold/yellow section backgrounds | **Remove** |
| `#fcbb18` as a surface color | **Remove** |
| Per-feature color palettes (purple pricing, violet chat) | **Remove** |
| 5+ card patterns on a single page | **Unify to 2** |
| Toast-only form validation | **Replace with inline errors** |
| Fixed desktop-only sidebars | **Replace with drawer < lg** |
| Native `<select>` mixed with shadcn Select | **shadcn only** |
| System serif without loaded font | **Replace with Fraunces** |
| Placeholder footer contact info | **Replace with real data** |
| Dead legal links | **Ship pages or remove links** |
| Decorative gradients on wallet/chat | **Remove** |
| Dark mode toggle | **Not in V1** |

---

## Implementation Scope

### V1 Includes

- Light token layer in `globals.css` (shadcn variable mapping)
- Fraunces + Geist font loading via `next/font`
- Unified Navbar + DashboardSidebar
- Editorial mode: Homepage, About, Reports, Chat
- Instrument mode: Pricing, Wallet, Admin, Astrologer Dashboard
- 2 card variants, 3 button variants, 1 form pattern
- Mobile drawer sidebars
- Footer fix (real contact, legal pages)
- Brand-colored admin charts

### V1 Excludes

- Dark mode / theme toggle
- Light/dark token switching
- Command palette (admin)
- WebSocket real-time wallet balance (stretch)
- Pages not in current route inventory

### Implementation Order

```
Phase 1 — Foundation
  Light tokens → globals.css + shadcn mapping
  Font loading (Fraunces, Geist Sans, Geist Mono)
  Unified Navbar, DashboardSidebar, Footer
  Button + Card + Form primitives

Phase 2 — Editorial surfaces
  Homepage, About
  Report result pages (progressive disclosure)
  Chat restyle

Phase 3 — Instrument surfaces
  Pricing (unified palette)
  Wallet (Stripe layout + purchase modal)
  Admin + Astrologer dashboard

Phase 4 — Remaining pages
  Contact, Auth, Service generate, Profile, Conversations
  404, Astrologers listing
  Active nav states, breadcrumbs, empty states
```

---

## Document Hierarchy

| Document | Role |
|----------|------|
| **`REDESIGN_DECISION.md`** (this file) | **Final authority** — what we are building |
| `DESIGN_SYSTEM.md` | Implementation spec — use **light column only** for V1; ignore dark mode sections |
| `REDESIGN_DIRECTIONS.md` | Historical — options explored; Direction C chosen with light-first refinement |
| `DESIGN_AUDIT.md` | Evidence base — problems this decision solves |
| `screenshots/marketing/VISUAL_AUDIT.md` | Visual evidence — before state |

When `DESIGN_SYSTEM.md` conflicts with this document, **this document wins** for V1 scope decisions (theme, mode assignments, gold rules).

---

## Sign-Off Criteria

V1 redesign is complete when:

- [ ] Zero pages use `#fcbb18`, `#f37833`, or `#794235`
- [ ] Zero full-width gold background sections
- [ ] All pages use semantic tokens — no raw hex in components
- [ ] Fraunces on marketing/report H1 only; Geist everywhere else
- [ ] Editorial pages use progressive disclosure on report data
- [ ] Instrument pages show data above the fold
- [ ] Chat uses accent border, not violet gradient
- [ ] Pricing, wallet, admin share the same light palette
- [ ] Admin/astrologer sidebars work on mobile (drawer)
- [ ] Footer has real contact info and working legal links
- [ ] No dark mode toggle visible in UI

---

*This is the final design direction for Anantastro V1.*
