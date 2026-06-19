# Anantastro Design System

**Version:** 1.0  
**Status:** Specification (implementation pending)  
**Derived from:** `DESIGN_AUDIT.md`  
**Default theme:** Dark mode first  
**Stack target:** Next.js · shadcn/ui · Tailwind CSS v4 · Radix · next-intl

---

## How to Read This Document

This system replaces the fragmented patterns identified in the audit — ad hoc hex values, per-feature color palettes, system serif without a loaded font, fixed desktop-only sidebars, and toast-only form errors. Every surface (marketing, services, reports, chat, wallet, admin, astrologer) shares one token layer, one component vocabulary, and one motion language.

**Reference synthesis:**

| Reference | What we take |
|-----------|-------------|
| **Linear** | Clarity, precise borders, restrained color, keyboard-first density |
| **Stripe** | Layout rhythm, payment trust patterns, structured data hierarchy |
| **Notion** | Readable prose, comfortable line-height, muted secondary text |
| **Headspace** | Warmth without kitsch — soft surfaces, rounded forms, calm pacing |
| **Co-Star** | Dark celestial minimalism, editorial display type, cosmic restraint |
| **AstroTalk** | Industry familiarity — report density, coin economy visibility, service cards |

---

# Brand Vision

## Design Principles

### 1. Clarity over decoration
Every element earns its place. Astrology content is inherently complex; the UI must simplify, never compete. Inspired by **Linear** — borders, spacing, and type do the work; gradients and illustrations are accents, not defaults.

### 2. Warm precision
Premium does not mean cold. Surfaces feel inviting (**Headspace**) while data feels exact (**Stripe**). Warm amber accents on cool cosmic backgrounds create trust without sterility.

### 3. Content is the interface
Reports, charts, and interpretations are the product. Layout defers to content (**Notion**). Marketing pages sell; service pages deliver; dashboards manage — but all use the same reading experience.

### 4. Dark is home
Dark mode is the default expression of the brand (**Co-Star**). Light mode is a deliberate alternate for bright environments, not an afterthought. Celestial identity lives naturally on deep surfaces.

### 5. Mobile-first, density-aware
Design for 375px first. Reports and admin tables use progressive disclosure and horizontal scroll containers — never shrink text below readable minimums. Density is a feature for power users on desktop, not a mobile sacrifice.

### 6. One system, every shell
Public marketing, user account, chat, admin, and astrologer portals share tokens and components. Role-specific layouts change structure, not visual language.

### 7. Accessible by default
WCAG 2.2 AA minimum. Focus states, contrast, and keyboard paths are designed in — not audited in later.

### 8. Payment-grade trust
Coin purchases and Razorpay flows use the same trust signals as **Stripe**: explicit pricing, secure iconography, confirmation states, and zero decorative noise near money.

---

## Emotional Goals

| Moment | User should feel |
|--------|------------------|
| Landing | Curious, welcomed — "this understands astrology and me" |
| Generating a report | Anticipation, confidence — "my data is handled carefully" |
| Reading a Kundli | Guided, not overwhelmed — "I can find what matters" |
| Chat with AI astrologer | Intimate, focused — "a private conversation, not a gimmick" |
| Buying coins | Safe, transparent — "I know exactly what I'm paying for" |
| Admin / astrologer work | Capable, efficient — "professional tooling, not a side project" |

---

## User Perception Goals

Users should perceive Anantastro as:

- **Authoritative** — rigorous Vedic calculations, serious report depth (AstroTalk parity, Co-Star editorial tone)
- **Modern** — contemporary SaaS polish, not temple-kitsch or clip-art zodiac
- **Human** — warm copy and surfaces, especially around birth data and personal readings
- **Trustworthy** — consistent branding, real legal pages, no placeholder contact info, secure payment patterns
- **Coherent** — the chat UI, wallet, and Kundli result feel like one product, not three apps stitched together

---

# Color System

All colors are defined as semantic tokens. **Never use raw hex in components** — always reference tokens. Legacy brand oranges (`#f37833`, `#fcbb18`, `#794235`) are refined into this palette, not copied verbatim.

## Token Architecture

```
background → surface → surface-raised → overlay
text-primary → text-secondary → text-tertiary → text-disabled
border-default → border-strong → border-subtle
primary → primary-hover → primary-muted
```

---

## Core Tokens

### Primary
Warm amber-gold. CTAs, active nav, coin accents, chart highlights.

| Token | Light | Dark |
|-------|-------|------|
| `--color-primary` | `#C17A3A` | `#E8A54B` |
| `--color-primary-hover` | `#A86832` | `#F0B85C` |
| `--color-primary-muted` | `#FDF6EE` | `#2A2218` |
| `--color-primary-foreground` | `#FFFFFF` | `#0D0F14` |

### Secondary
Cool cosmic slate. Secondary actions, sidebar backgrounds, chart grid lines.

| Token | Light | Dark |
|-------|-------|------|
| `--color-secondary` | `#4A5568` | `#8B9AB5` |
| `--color-secondary-hover` | `#374151` | `#A3B1C9` |
| `--color-secondary-muted` | `#F1F3F6` | `#1A1F2B` |
| `--color-secondary-foreground` | `#FFFFFF` | `#0D0F14` |

### Accent
Subtle celestial violet. Chat presence, AI astrologer badges, spiritual emphasis — used sparingly.

| Token | Light | Dark |
|-------|-------|------|
| `--color-accent` | `#6B5B95` | `#9B8EC4` |
| `--color-accent-hover` | `#574A7A` | `#B0A5D4` |
| `--color-accent-muted` | `#F3F0F8` | `#1E1A2E` |
| `--color-accent-foreground` | `#FFFFFF` | `#0D0F14` |

### Success

| Token | Light | Dark |
|-------|-------|------|
| `--color-success` | `#1A7F4B` | `#3DDB84` |
| `--color-success-muted` | `#EDF7F1` | `#0F2319` |
| `--color-success-foreground` | `#FFFFFF` | `#0D0F14` |

### Warning

| Token | Light | Dark |
|-------|-------|------|
| `--color-warning` | `#B45309` | `#F59E0B` |
| `--color-warning-muted` | `#FEF7EC` | `#2A1F0A` |
| `--color-warning-foreground` | `#FFFFFF` | `#0D0F14` |

### Error

| Token | Light | Dark |
|-------|-------|------|
| `--color-error` | `#C42B2B` | `#F87171` |
| `--color-error-muted` | `#FEF2F2` | `#2A1414` |
| `--color-error-foreground` | `#FFFFFF` | `#0D0F14` |

### Background
Page-level canvas.

| Token | Light | Dark |
|-------|-------|------|
| `--color-background` | `#FAFAF8` | `#0D0F14` |
| `--color-background-subtle` | `#F4F3F0` | `#12151C` |

### Surface
Cards, panels, sidebars, inputs.

| Token | Light | Dark |
|-------|-------|------|
| `--color-surface` | `#FFFFFF` | `#161A22` |
| `--color-surface-raised` | `#FFFFFF` | `#1C2129` |
| `--color-surface-sunken` | `#F4F3F0` | `#12151C` |
| `--color-surface-overlay` | `rgba(255,255,255,0.92)` | `rgba(22,26,34,0.92)` |

### Border

| Token | Light | Dark |
|-------|-------|------|
| `--color-border` | `#E5E2DC` | `#2A2F3A` |
| `--color-border-strong` | `#D4D0C8` | `#3A4150` |
| `--color-border-subtle` | `#F0EDE8` | `#1E232D` |
| `--color-border-focus` | `var(--color-primary)` | `var(--color-primary)` |

### Text

| Token | Light | Dark |
|-------|-------|------|
| `--color-text-primary` | `#1A1A18` | `#F0EDE8` |
| `--color-text-secondary` | `#5C5A55` | `#9B97A0` |
| `--color-text-tertiary` | `#8A8780` | `#6B6770` |
| `--color-text-disabled` | `#B5B2AC` | `#4A4750` |
| `--color-text-inverse` | `#FAFAF8` | `#0D0F14` |
| `--color-text-link` | `#C17A3A` | `#E8A54B` |
| `--color-text-link-hover` | `#A86832` | `#F0B85C` |

---

## Domain-Specific Color Rules

### Coins & payments
Always pair coin amounts with `--color-primary`. Payment cards use `--color-surface-raised` on `--color-background` — never gradient backgrounds. Razorpay/checkout modals: white or dark surface only, lock icon + explicit total.

### Reports & charts
- Chart lines: `--color-primary` (main), `--color-secondary` (grid), `--color-accent` (highlight)
- Planet glyphs: use semantic planet palette (defined in component layer), never random Tailwind colors
- Table zebra: `--color-surface` / `--color-surface-sunken` — no colored row backgrounds unless status-coded

### Chat
- User bubbles: `--color-surface-raised` with `--color-border`
- AI bubbles: `--color-accent-muted` border, not full violet gradient fills
- Active session: `--color-primary-muted` left border accent

### Status badges
Map to semantic tokens only: success (approved), warning (pending), error (rejected/deactivated), secondary (draft/inactive).

---

## shadcn CSS Variable Mapping

Map shadcn primitives to semantic tokens in `globals.css`:

```css
:root {
  --background: /* --color-background as HSL */;
  --foreground: /* --color-text-primary as HSL */;
  --primary: /* --color-primary as HSL */;
  --muted: /* --color-surface-sunken as HSL */;
  --border: /* --color-border as HSL */;
  --ring: /* --color-primary as HSL */;
  --destructive: /* --color-error as HSL */;
}

.dark { /* dark token values */ }
```

**Theme default:** `<html class="dark">` with `next-themes` for user override.

---

# Typography

## Font Stack

| Role | Family | Fallback | Source |
|------|--------|----------|--------|
| **Display** | **Fraunces** | Georgia, serif | `next/font/google` — editorial, celestial headlines |
| **Body** | **Geist Sans** | system-ui, sans-serif | Existing — UI and prose |
| **Mono** | **Geist Mono** | ui-monospace, monospace | Data tables, coordinates, admin IDs |

**Rules:**
- Display font: marketing heroes, report titles, section headings on landing pages only
- Body font: everything else — nav, forms, tables, chat, dashboards
- Mono: timestamps, UUIDs, planetary degrees, API debug fields
- **Never** use system serif. **Never** mix a third font family.

---

## Display Scale
For hero headlines and major marketing moments. Fraunces, tight tracking.

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `display-2xl` | 48px / 3rem | 1.1 | 600 | -0.02em |
| `display-xl` | 40px / 2.5rem | 1.15 | 600 | -0.02em |
| `display-lg` | 32px / 2rem | 1.2 | 600 | -0.01em |

Mobile: `display-2xl` → 36px, `display-xl` → 32px, `display-lg` → 28px.

---

## Heading Scale
Geist Sans. Page titles, card headers, section labels.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `heading-xl` | 24px / 1.5rem | 1.3 | 600 | Page title (one per page) |
| `heading-lg` | 20px / 1.25rem | 1.35 | 600 | Section title, modal title |
| `heading-md` | 16px / 1rem | 1.4 | 600 | Card title, tab label |
| `heading-sm` | 14px / 0.875rem | 1.4 | 600 | Table group header, sidebar section |

**Accessibility:** Every page has exactly one `h1` using `heading-xl`. Card titles use `heading-md` on a semantic `h2`/`h3` — never a `<div>`.

---

## Body Scale
Geist Sans. All reading and UI text.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `body-lg` | 16px / 1rem | 1.6 | 400 | Marketing prose, AI interpretation text |
| `body-md` | 14px / 0.875rem | 1.5 | 400 | Default UI text, form labels |
| `body-sm` | 13px / 0.8125rem | 1.45 | 400 | Table cells, secondary descriptions |

Report interpretation blocks use `body-lg` with `max-width: 68ch` for Notion-grade readability.

---

## Caption Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `caption-md` | 12px / 0.75rem | 1.4 | 500 | Timestamps, metadata, badge text |
| `caption-sm` | 11px / 0.6875rem | 1.35 | 500 | Chart axis labels, fine print, legal |

**Minimum mobile text:** 13px (`body-sm`) for readable content. Captions never carry essential instructions alone.

---

# Spacing System

Base unit: **4px**. All spacing must use these tokens — no arbitrary values like `p-[13px]`.

| Token | Value | Tailwind |
|-------|-------|----------|
| `space-1` | 4px | `1` |
| `space-2` | 8px | `2` |
| `space-3` | 12px | `3` |
| `space-4` | 16px | `4` |
| `space-6` | 24px | `6` |
| `space-8` | 32px | `8` |
| `space-12` | 48px | `12` |
| `space-16` | 64px | `16` |
| `space-24` | 96px | `24` |

## Usage Rules

| Context | Token |
|---------|-------|
| Icon-to-label gap | `space-2` (8px) |
| Form field internal padding | `space-3` vertical, `space-4` horizontal |
| Between form fields | `space-4` (16px) |
| Card internal padding (mobile) | `space-4` (16px) |
| Card internal padding (desktop) | `space-6` (24px) |
| Between cards in a list | `space-4` mobile, `space-6` desktop |
| Section vertical padding (mobile) | `space-12` (48px) |
| Section vertical padding (desktop) | `space-16` (64px) |
| Page top padding below nav | `space-6` mobile, `space-8` desktop |
| Marketing hero vertical padding | `space-16` mobile, `space-24` desktop |
| Dashboard page header → content | `space-6` (24px) |
| Table cell padding | `space-3` vertical, `space-4` horizontal |
| Inline badge padding | `space-1` vertical, `space-2` horizontal |

**Compact mode (reports/admin tables):** reduce cell padding to `space-2` × `space-3` — never below.

---

# Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Badges, chips, small buttons, tags |
| `radius-md` | 10px | Inputs, buttons, dropdown items |
| `radius-lg` | 14px | Cards, panels, chat bubbles |
| `radius-xl` | 20px | Modals, drawers, hero cards, report summary panels |

**Rules:**
- Buttons and inputs always share `radius-md` on the same form
- Nested elements: child radius ≤ parent radius − 4px
- Charts and data tables: `radius-sm` on container only, not per-cell
- No `rounded-full` except avatars, coin icons, and status dots

---

# Shadows

Shadows are subtle in dark mode (rely on border + surface-raised); more pronounced in light mode.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `shadow-card` | `0 1px 3px rgba(26,26,24,0.06), 0 1px 2px rgba(26,26,24,0.04)` | `0 0 0 1px var(--color-border)` | Cards, report panels |
| `shadow-dropdown` | `0 4px 16px rgba(26,26,24,0.10), 0 2px 4px rgba(26,26,24,0.06)` | `0 8px 24px rgba(0,0,0,0.40), 0 0 0 1px var(--color-border)` | Dropdowns, popovers, select menus |
| `shadow-modal` | `0 16px 48px rgba(26,26,24,0.16), 0 4px 12px rgba(26,26,24,0.08)` | `0 24px 64px rgba(0,0,0,0.50), 0 0 0 1px var(--color-border-strong)` | Dialogs, coin purchase modal |
| `shadow-elevated` | `0 8px 24px rgba(26,26,24,0.12)` | `0 0 0 1px var(--color-border-strong), 0 4px 12px rgba(0,0,0,0.30)` | FAB, sticky report toolbar, mobile drawer |

**Rules:**
- Never stack shadow + heavy gradient on the same element
- Payment modals use `shadow-modal` only — no glow effects
- Navbar: border-bottom only, no shadow (Linear-style)

---

# Layout System

## Breakpoints

Mobile-first. Default styles target `< 640px`.

| Name | Min width | Intent |
|------|-----------|--------|
| `base` | 0 | Mobile (design here first) |
| `sm` | 640px | Large phone / small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop — sidebar layouts activate |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1440px | Max content width cap |

---

## Containers

| Token | Max Width | Horizontal Padding | Usage |
|-------|-----------|-------------------|-------|
| `container-marketing` | 1200px | `space-4` → `space-8` at `md` | Home, about, pricing, service landing |
| `container-content` | 768px | `space-4` | Auth, legal, narrow reading pages |
| `container-service` | 960px | `space-4` → `space-6` at `md` | Generate forms, horoscope, matchmaking |
| `container-report` | 1120px | `space-4` → `space-6` at `md` | Kundli/horoscope/matchmaking results |
| `container-dashboard` | 1280px | `space-4` → `space-8` at `lg` | User profile, reports list, wallet |
| `container-chat` | 800px | `space-4` | Chat thread (messages centered) |
| `container-admin` | 1440px | `space-6` → `space-8` at `lg` | Admin and astrologer main content |

All containers: `margin-inline: auto`, `width: 100%`.

---

## Content Widths

| Content type | Max readable width | Notes |
|--------------|-------------------|-------|
| AI interpretation prose | 68ch | Notion-style reading column |
| Form column | 480px | Single-column forms centered in container |
| Report summary card | 100% of `container-report` | Full width on mobile |
| Data table | 100% with horizontal scroll | `overflow-x: auto` on wrapper |
| Chart (North Indian) | 320px mobile, 400px desktop | Centered, never stretched |

---

## Dashboard Widths

| Layout | Mobile (< lg) | Desktop (≥ lg) |
|--------|---------------|----------------|
| Sidebar width | — (drawer) | 256px fixed |
| Sidebar collapsed | — | 64px icon-only (admin/astrologer optional) |
| Main content offset | 0 | 256px (or 64px collapsed) |
| Top bar height | 56px | 56px |

**Critical fix from audit:** Replace unconditional `ml-64` with drawer pattern below `lg`.

---

## Mobile Layouts

### Public pages
```
┌─────────────────────────┐
│ Navbar (56px, sticky)   │
├─────────────────────────┤
│ Main content            │
│ padding: space-4        │
├─────────────────────────┤
│ Footer                  │
└─────────────────────────┘
```

### Dashboard pages (mobile)
```
┌─────────────────────────┐
│ Top bar: menu + title   │
│         + actions       │
├─────────────────────────┤
│ Main content (full)     │
│                         │
│                         │
├─────────────────────────┤
│ Bottom tab bar (user)   │  ← optional for user dashboard
└─────────────────────────┘

Drawer (overlay): nav items from sidebar
```

### Report pages (mobile)
```
┌─────────────────────────┐
│ Sticky report header    │
│ (title + share + tabs)  │
├─────────────────────────┤
│ Summary card            │
├─────────────────────────┤
│ Tab content             │
│ (scrollable tables)     │
└─────────────────────────┘
```

Progressive disclosure: show summary + top 3 insights first; "View full chart" expands.

---

# Navigation System

## Navbar (Public)

| Property | Value |
|----------|-------|
| Height | 56px |
| Background | `--color-surface-overlay` with `backdrop-blur: 12px` |
| Border | `1px solid var(--color-border)` bottom |
| Position | `sticky top-0 z-50` |
| Logo | 32px mark + wordmark in `heading-sm` weight 600 |

**Desktop (≥ lg):** inline nav links, Services dropdown, coin pill, language switcher, user avatar menu.  
**Mobile (< lg):** logo + coin pill + hamburger. Menu opens **mobile drawer** (not dropdown).

**Nav items (ordered):**
1. Services (dropdown)
2. AI Astrologers (`/astrologers/`)
3. Pricing
4. About
5. Contact
6. [Auth actions in user menu]

Remove links to unbuilt routes. Add items only when pages exist.

---

## Sidebar (Admin & Astrologer)

| Property | Value |
|----------|-------|
| Width | 256px (desktop), 100% in drawer (mobile) |
| Background | `--color-surface` |
| Border | `1px solid var(--color-border)` right |
| Active item | `--color-primary-muted` background, `--color-primary` left border 3px |
| Item height | 40px |
| Item padding | `space-3` × `space-4` |
| Section labels | `caption-md`, `--color-text-tertiary`, uppercase, `space-2` bottom margin |

**Desktop:** fixed sidebar, main content offset.  
**Mobile:** hidden by default; hamburger in top bar opens drawer with `shadow-elevated`.

Admin and astrologer sidebars share one `DashboardSidebar` component with different `items` config.

---

## Mobile Drawer

| Property | Value |
|----------|-------|
| Width | `min(320px, 85vw)` |
| Background | `--color-surface-raised` |
| Overlay | `rgba(0,0,0,0.60)` dark / `rgba(26,26,24,0.40)` light |
| Animation | slide-in 200ms ease-out |
| Close | swipe-left, overlay tap, Escape, close button |
| Focus trap | required (Radix Dialog or Sheet) |

Used for: mobile nav, mobile sidebar, filter panels on report tables.

---

## Breadcrumbs

| Property | Value |
|----------|-------|
| Style | `body-sm`, `--color-text-secondary` |
| Separator | `/` or chevron, `--color-text-tertiary` |
| Current page | `--color-text-primary`, not linked |
| Max depth | 4 levels; collapse middle with `…` on mobile |

**Required on:** admin detail pages, report results, settings tabs, service generate → result flow.

Example: `Services / Kundli / Result / #{id}`

---

# Component Standards

All components extend shadcn/ui primitives. Variants via CVA. Every component supports dark mode via CSS variables.

---

## Buttons

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| `primary` | `--color-primary` | `--color-primary-foreground` | none | One primary CTA per viewport section |
| `secondary` | `--color-surface-raised` | `--color-text-primary` | `--color-border` | Secondary actions |
| `ghost` | transparent | `--color-text-secondary` | none | Tertiary, toolbar actions |
| `destructive` | `--color-error` | white | none | Delete, reject, deactivate |
| `link` | transparent | `--color-text-link` | none | Inline text actions |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | `space-2` × `space-3` | `body-sm` |
| `md` | 40px | `space-3` × `space-4` | `body-md` |
| `lg` | 48px | `space-3` × `space-6` | `body-md` |

**Rules:**
- One `primary` button per card or modal footer
- Loading state: spinner replaces label, width preserved (`aria-busy="true"`)
- Icon buttons: `aria-label` required, min 40×40px touch target
- Disabled: `--color-text-disabled`, no pointer events, `aria-disabled="true"`

---

## Inputs

| Property | Value |
|----------|-------|
| Height | 40px (md), 48px (lg for hero forms) |
| Background | `--color-surface-sunken` |
| Border | `1px solid var(--color-border)` |
| Radius | `radius-md` |
| Font | `body-md` |
| Padding | `space-3` × `space-4` |
| Placeholder | `--color-text-tertiary` |
| Focus | `border-color: var(--color-border-focus)`, `ring: 2px var(--color-primary-muted)` |

**Error state:** border `--color-error`, helper text `caption-md` in `--color-error` below field. Always pair with `aria-invalid="true"` and `aria-describedby`.

**Never:** native `<select>` for styled forms — use shadcn Select everywhere including `BirthGenderSelect`.

---

## Selects

Same dimensions as inputs. Dropdown uses `shadow-dropdown`. Max height 280px, scroll overflow. Selected item: `--color-primary-muted` background.

For long lists (timezone, language): include search filter above 10 items.

---

## Cards

| Variant | Background | Border | Shadow | Padding |
|---------|------------|--------|--------|---------|
| `default` | `--color-surface` | `1px solid var(--color-border)` | `shadow-card` | `space-6` |
| `raised` | `--color-surface-raised` | `1px solid var(--color-border)` | `shadow-card` | `space-6` |
| `interactive` | `--color-surface` | `1px solid var(--color-border)` | `shadow-card` | `space-6` |
| `flat` | `--color-surface-sunken` | none | none | `space-4` |

Interactive cards: hover `border-color: var(--color-border-strong)`, `transition: 150ms`. Cursor pointer only when clickable.

**Report cards:** use `flat` for nested data sections; `default` for top-level summary.

---

## Tables

### Standard table (admin)
- Header: `caption-md` uppercase, `--color-text-tertiary`, `--color-surface-sunken` background
- Row height: 48px (compact: 40px)
- Row hover: `--color-surface-sunken`
- Borders: horizontal only (`border-bottom: 1px solid var(--color-border-subtle)`)
- Mobile: card-list transformation below `md` — each row becomes a stacked card

### Data-dense table (reports — ashtakvarga, planetary positions)
- Font: `body-sm` (13px) with `mono` for degrees
- Sticky first column on horizontal scroll
- Zebra: alternate `--color-surface` / `--color-surface-sunken`
- Header row sticky on vertical scroll
- Min column width: 64px; overflow wrapper with scroll hint gradient

---

## Badges

| Variant | Background | Text |
|---------|------------|------|
| `default` | `--color-surface-sunken` | `--color-text-secondary` |
| `primary` | `--color-primary-muted` | `--color-primary` |
| `success` | `--color-success-muted` | `--color-success` |
| `warning` | `--color-warning-muted` | `--color-warning` |
| `error` | `--color-error-muted` | `--color-error` |
| `accent` | `--color-accent-muted` | `--color-accent` |

Height: 24px. Padding: `space-1` × `space-2`. Radius: `radius-sm`. Font: `caption-md`.

---

## Tabs

| Property | Value |
|----------|-------|
| Height | 40px |
| Style | underline (not pill) for report tabs; pill for settings |
| Active | `--color-primary` bottom border 2px (underline) or `--color-primary-muted` fill (pill) |
| Inactive | `--color-text-secondary` |
| Mobile report tabs | horizontal scroll, `scrollbar-hide`, snap |

Kundli result tabs: underline style. Profile settings: pill style. Max 7 tabs visible; overflow in "More" dropdown.

---

## Modals

| Size | Max Width | Usage |
|------|-----------|-------|
| `sm` | 400px | Confirmations, coin purchase |
| `md` | 560px | Profile picker, filters |
| `lg` | 720px | Kundli profile creation |
| `full` | 100% mobile, 90vw desktop | Complex multi-step |

- Overlay: `rgba(0,0,0,0.60)` with `backdrop-blur: 4px`
- Shadow: `shadow-modal`
- Radius: `radius-xl`
- Header: `heading-lg` + optional `body-sm` description
- Footer: right-aligned buttons, `space-3` gap
- Close: X button with `aria-label="Close"`, Escape to dismiss
- Focus trap required; return focus on close

**Payment modals:** always `sm` or `md`, never full-screen. Show itemized total, coin count, and Razorpay branding area.

---

## Alerts

| Variant | Icon | Usage |
|---------|------|-------|
| `info` | Info circle | Neutral notices |
| `success` | Check circle | Verification, payment success |
| `warning` | Alert triangle | Low coins, pending review |
| `error` | X circle | Failures, deactivated account |

Background: `{variant}-muted`. Border: `1px solid` at 20% variant opacity. Padding: `space-4`. Role: `role="alert"` for errors; `role="status"` for info/success.

---

## Empty States

```
┌─────────────────────────────┐
│         [illustration]      │  ← 64px icon or subtle line art
│         Heading (md)        │
│    body-sm description      │
│      [primary action]       │
└─────────────────────────────┘
```

- Vertical padding: `space-12`
- Icon: `--color-text-tertiary`, 48px
- No Lottie animations — static SVG only
- Always offer one action ("Generate your first Kundli", "Browse AI astrologers")

---

## Loading States

| Context | Pattern |
|---------|---------|
| Page | Skeleton blocks matching layout shape |
| Button | Inline spinner, label hidden, width locked |
| Table | 5 skeleton rows |
| Chart | Pulsing `radius-lg` rectangle at chart aspect ratio |
| Chat message | Three-dot typing indicator in `--color-accent-muted` bubble |

**Never** show bare "Loading..." text without skeleton structure. Use `aria-live="polite"` on loading regions.

---

# Dashboard Standards

All dashboards share: top bar (56px), optional sidebar/drawer, `container-dashboard`, breadcrumb, page title, action slot.

---

## User Dashboard

**Surfaces:** Profile, Reports, Wallet, Conversations

| Element | Standard |
|---------|----------|
| Layout | No sidebar on mobile; optional bottom tab nav with 4 items |
| Page header | `heading-xl` title + `body-sm` subtitle + right action button |
| Profile tabs | Pill tabs (Settings pattern), horizontal scroll on mobile |
| Reports list | Card list mobile; table desktop. Filter by type (kundli/horoscope/matchmaking) |
| Quick actions | "Generate Kundli", "Start chat" in header action slot |

---

## Wallet

| Element | Standard |
|---------|----------|
| Balance display | Large `display-lg` mono number + coin glyph + `caption-md` "coins" |
| Primary action | "Buy coins" `primary` button |
| Transaction list | Compact table, mono timestamps, color-coded credit/debit (success/error) |
| Low balance banner | `warning` alert sticky above content when balance < service cost |
| Real-time update | Animate balance change with 300ms number tick; `aria-live="polite"` |

Payment flow: inline modal, not page redirect. Show plan cards in `interactive` card grid (1 col mobile, 3 col desktop).

---

## Reports

| Element | Standard |
|---------|----------|
| List page | Filter chips (type, date) + search + sort |
| Report card | Type badge, date `caption-md`, name `heading-sm`, chevron |
| Result page | Sticky header: breadcrumb + title + share + translate |
| Tab bar | Underline tabs, horizontally scrollable on mobile |
| Summary section | `display-lg` score or rashi + `body-lg` interpretation excerpt |
| Data sections | `flat` cards with compact tables |
| Charts | Centered, max 400px, `radius-lg` border container |
| Share bar | Fixed bottom on mobile, inline on desktop |

High information density rules:
- Default to collapsed sections; expand on tap
- Show data table + chart side-by-side only at `xl` breakpoint
- Planet positions: always tabular, never card-per-planet on desktop

---

## Chat

| Element | Standard |
|---------|----------|
| Layout | Full-height minus nav. Message area scrolls, input fixed bottom |
| Session list | Conversations page uses card list with avatar, name, last message, timestamp |
| Message bubbles | User: right-aligned `surface-raised`. AI: left-aligned, `accent-muted` border |
| Input bar | 48px min height, send button `primary` icon, coin-per-minute badge visible |
| Active indicator | `caption-md` "Session active · X coins/min" in top bar |
| Low coins | `warning` alert + inline "Add coins" link — not redirect |

Remove violet gradient backgrounds from current implementation. Chat aesthetic comes from typography and spacing, not color fills.

---

## Admin Dashboard

| Element | Standard |
|---------|----------|
| Sidebar | `DashboardSidebar` with grouped sections: People, Services, Finance, Tools |
| Dashboard home | Stat cards (4-col desktop, 2-col mobile) + charts using brand palette |
| Charts | recharts with `--color-primary`, `--color-accent`, `--color-secondary` only |
| Tables | Standard admin table + row actions in `ghost` icon buttons |
| Detail pages | Breadcrumb + header + tabbed sections |
| Destructive actions | `destructive` button + confirmation modal |
| Impersonation | Sticky `warning` banner at top: "Viewing as {user}" + Exit button |

Admin is English-only by default. i18n optional later.

---

## Astrologer Dashboard

| Element | Standard |
|---------|----------|
| Sidebar | Same component as admin, different items |
| Dashboard home | Status card (profile approval state), earnings summary, notifications |
| Profile | Multi-section form, same input standards |
| Services & pricing | Table of service types with approval badges |
| Registration wizard | Step indicator (numbered, 40px circles), `space-8` between steps, progress saved |

---

# Animation Guidelines

Motion is functional, not decorative. Respect `prefers-reduced-motion`.

---

## Micro Interactions

| Interaction | Duration | Easing | Properties |
|-------------|----------|--------|------------|
| Button hover | 150ms | ease-out | background-color, border-color |
| Button press | 100ms | ease-in | scale(0.98) |
| Input focus | 150ms | ease-out | border-color, box-shadow |
| Toggle/switch | 200ms | ease-in-out | transform |
| Checkbox | 150ms | ease-out | background, checkmark opacity |
| Coin balance update | 300ms | ease-out | number crossfade |
| Toast enter | 200ms | ease-out | translateY + opacity |
| Toast exit | 150ms | ease-in | opacity |

---

## Hover States

- **Cards (interactive):** border darkens, no lift/shadow change
- **Table rows:** background → `--color-surface-sunken`
- **Nav items:** text → `--color-text-primary`, no underline animation
- **Links:** color → `--color-text-link-hover`, underline on hover only for inline prose links
- **Icons:** color shift only, no bounce or rotation

**Never:** scale transforms on cards, glow effects, parallax on data pages.

---

## Page Transitions

| Transition | Pattern |
|------------|---------|
| Route change | None (instant). Next.js default. |
| Modal open | overlay fade 150ms + content scale(0.98→1) 200ms |
| Modal close | reverse 150ms |
| Drawer open | slide 200ms ease-out |
| Tab switch | content fade 100ms (no slide between report tabs) |
| Skeleton → content | crossfade 200ms |

---

# Accessibility Standards

**Target:** WCAG 2.2 Level AA across all surfaces.

---

## Contrast

| Pair | Minimum ratio |
|------|---------------|
| `text-primary` on `background` | 4.5:1 |
| `text-secondary` on `background` | 4.5:1 |
| `text-primary` on `surface` | 4.5:1 |
| `primary-foreground` on `primary` | 4.5:1 |
| `caption` text on any surface | 4.5:1 |
| UI components (borders, icons) | 3:1 against adjacent colors |

Validate both light and dark modes. The warm primary on dark backgrounds must use `#E8A54B` (not legacy `#f37833`) to pass.

---

## Focus States

```
outline: 2px solid var(--color-primary);
outline-offset: 2px;
```

- All interactive elements must show visible focus on keyboard navigation
- Never `outline: none` without a replacement ring
- Focus trap in modals and drawers
- Skip-to-content link as first focusable element in layout

---

## Keyboard Navigation

| Context | Keys |
|---------|------|
| Global | `Tab` / `Shift+Tab` traverse, `Escape` closes overlays |
| Nav | `Arrow keys` in menubar and tabs |
| Dropdowns | `Arrow up/down` select, `Enter` confirm, `Escape` close |
| Tables | `Arrow keys` navigate cells in report tables (optional enhancement) |
| Modals | Focus trapped, `Escape` closes |
| Chat | `Enter` send, `Shift+Enter` newline |

All actions reachable by mouse must be reachable by keyboard. No hover-only controls.

---

## Additional Requirements

- `html lang` set per locale (existing)
- All images: meaningful `alt` or `alt=""` + `aria-hidden` if decorative
- Form errors: `aria-invalid` + `aria-describedby` pointing to error message id
- Loading regions: `aria-busy="true"` during fetch
- Live regions: coin balance, chat messages, toast notifications
- Color never sole indicator of state — always pair with icon or text label
- Touch targets: minimum 44×44px on mobile
- Support 200% browser zoom without horizontal scroll on content pages

---

# Design Anti-Patterns

**Never introduce these.** They are explicit rejections of the current audit findings.

### Visual

| Anti-pattern | Why |
|--------------|-----|
| Gold gradient page backgrounds (`#fcbb18` headers/footers) | Cheapens premium feel; use `--color-background` + subtle accents |
| Per-feature color palettes (violet chat, blue admin charts) | Breaks coherence |
| System serif or unspecified `font-serif` | Use Fraunces display or Geist Sans only |
| Raw hex / Tailwind color classes (`bg-violet-600`, `text-amber-50`) | Use semantic tokens only |
| Gradient text on headings | Illegible, dated |
| Drop shadows on navbar | Use border only (Linear pattern) |
| Decorative zodiac clip-art | Use line icons or typography |
| Lottie/confetti on payment success | Undermines trust; use calm success alert |
| Placeholder contact info in production | Destroys credibility |

### Layout

| Anti-pattern | Why |
|--------------|-----|
| Fixed `ml-64` sidebar without mobile drawer | Breaks mobile (audit finding) |
| Three incompatible layout shells with different spacing | Use shared dashboard layout |
| Full-width interpretation text without `max-width: 68ch` | Unreadable on wide screens |
| Planet-per-card layout on desktop | Wastes space; use tables |
| Horizontal scroll without sticky column or scroll hint | Users miss data |

### Interaction

| Anti-pattern | Why |
|--------------|-----|
| Toast-only form validation | Use inline field errors (audit finding) |
| Native `<select>` in styled forms | Inconsistent with shadcn Select |
| `?next=` redirect set but not consumed | Breaks user flow |
| Page redirect to buy coins mid-flow | Use inline purchase modal |
| Auth-gated pages without client redirect | Show login prompt, not empty state |
| Hover-only actions in tables | Fails keyboard and touch access |
| Links to routes that don't exist | 404 destroys trust |

### Content & Trust

| Anti-pattern | Why |
|--------------|-----|
| "AI Reports" nav item without a page | Remove until built |
| Mixing AI astrologers and human astrologers under one label | Confuses users |
| Coin costs hidden until error | Show cost before form submit |
| Missing legal pages linked from footer | Required for payments |
| Admin impersonation without visible banner | Security and UX risk |

### Technical

| Anti-pattern | Why |
|--------------|-----|
| `CardTitle` as `<div>` | Breaks heading hierarchy |
| `outline: none` on focus | Fails WCAG |
| Dark mode as unmounted afterthought | Dark is default in this system |
| Three parallel color systems (HSL + hex + Tailwind) | Single token layer only |
| Animation ignoring `prefers-reduced-motion` | Accessibility violation |

---

# Implementation Checklist

When implementing this system, work in this order:

1. **Tokens** — `globals.css` semantic variables, dark default, shadcn mapping
2. **Fonts** — Load Fraunces + Geist, remove system serif
3. **ThemeProvider** — `next-themes`, default `dark`
4. **Layout primitives** — `DashboardLayout` with responsive drawer
5. **Component migration** — buttons, inputs, cards (shadcn overrides)
6. **Navigation** — unified navbar, dashboard sidebar, remove dead links
7. **Report pages** — highest-density templates first (Kundli result)
8. **Payment flow** — wallet + pricing modal
9. **Admin/astrologer** — sidebar unification, chart colors
10. **Accessibility audit** — contrast check both modes, keyboard pass

---

# Token Quick Reference

```css
/* Implement in globals.css — dark mode values shown */

--color-primary:            #E8A54B;
--color-primary-hover:      #F0B85C;
--color-primary-muted:      #2A2218;
--color-secondary:          #8B9AB5;
--color-accent:             #9B8EC4;
--color-success:            #3DDB84;
--color-warning:            #F59E0B;
--color-error:              #F87171;
--color-background:         #0D0F14;
--color-surface:            #161A22;
--color-surface-raised:     #1C2129;
--color-border:             #2A2F3A;
--color-text-primary:       #F0EDE8;
--color-text-secondary:     #9B97A0;
--color-text-tertiary:      #6B6770;

--radius-sm:  6px;
--radius-md:  10px;
--radius-lg:  14px;
--radius-xl:  20px;

--font-display: 'Fraunces', Georgia, serif;
--font-body:    'Geist Sans', system-ui, sans-serif;
--font-mono:    'Geist Mono', ui-monospace, monospace;
```

---

*This document is the single source of truth for Anantastro's visual and interaction design. Deviations require explicit documentation in pull requests.*
