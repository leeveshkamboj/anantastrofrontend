# Anantastro Implementation Plan — Stitch High Energy Consumer

**Source mockups:** `/stitch/` (7 screenshots)  
**Design spec:** `stitch/DESIGN_SYSTEM.md`  
**Product decisions:** `../REDESIGN_DECISION.md`  
**Status:** Planning — no code changes yet

---

## Objective

Implement the Stitch "High Energy Consumer" visual language across Anantastro marketing and consumer surfaces, adapted to V1 constraints:

- Light-first only (no dark mode)
- Gold as accent only (no full-width gold bands)
- Fraunces for editorial headings; Geist for UI
- Editorial mode: Homepage, About, Reports, Chat
- Instrument mode: Pricing, Wallet, Admin, Astrologer Dashboard

The stitch mockups cover **7 of 11** marketing/service landing pages. This plan maps each mockup to existing routes, defines new shared components, and sequences implementation in safe phases.

---

## Mockup → Route Mapping

| Stitch folder | Mockup page | App route | Current files | Mode |
|---------------|-------------|-----------|---------------|------|
| `_homepage_7` | About | `/about/` | `app/[locale]/about/page.tsx` | Editorial |
| `_homepage_1` | Contact | `/contact/` | `app/[locale]/contact/page.tsx` | Editorial |
| `_homepage_2` | AI Astrologers | `/astrologers/` | `app/[locale]/astrologers/page.tsx` | Editorial |
| `_homepage_3` | Kundli landing | `/services/kundli/generate/` | `components/kundli/generate/KundliGenerateHero.tsx` | Editorial |
| `_homepage_4` | Matchmaking landing | `/services/matchmaking/` | `app/[locale]/services/matchmaking/page.tsx` | Editorial |
| `_homepage_5` | Horoscope | `/services/horoscope/` | `app/[locale]/services/horoscope/page.tsx` | Editorial |
| `_homepage_6` | Pricing | `/pricing/` | `app/[locale]/pricing/page.tsx` | Instrument |
| — | Homepage | `/` | `app/[locale]/page.tsx` + `components/home/*` | Editorial |
| — | Reports | `/services/*/result/[id]/` | `KundliResultContent.tsx`, etc. | Editorial |
| — | Chat | `/chat/[sessionId]/` | `app/[locale]/chat/` | Editorial |
| — | Wallet | `/wallet/` | `app/[locale]/wallet/page.tsx` | Instrument |
| — | Admin | `/admin/*` | `app/[locale]/admin/` | Instrument |
| — | Astrologer | `/astrologer/*` | `app/[locale]/astrologer/` | Instrument |

---

## Gap Analysis: Mockups vs Current App

| Area | Stitch mockup | Current app | Action |
|------|---------------|-------------|--------|
| Section backgrounds | Gold/purple alternating bands | `#fcbb18` on ~40% of pages | Replace with light unified bg + subtle dividers |
| Typography | Fraunces + Geist labeled | System serif + Geist | Load Fraunces via `next/font` |
| Buttons | Orange-gold gradient pills | Solid orange, mixed styles | Unify to 3 variants in `button.tsx` |
| Cards | 3–5 white/cream variants | 5+ inconsistent patterns | Consolidate to `Card` variants |
| Nav | Transparent on hero, underline active | Gold-heavy navbar | Rebuild `Navbar.tsx` |
| Footer | Gold or dark, 4 columns | Gold band, placeholder contact | Rebuild `Footer.tsx` |
| Pricing | 2×2 cards on purple, glass hero | Purple/lavender unrelated palette | Full pricing page rebuild |
| Astrologers | Filter bar + 3/4 col grids | Basic listing | New filter + card components |
| Horoscope | Zodiac row + dashboard cards | Simpler layout | New zodiac selector + dashboard |
| Kundli landing | Dark cosmic + cream cards | Yellow hero + form card | Rebuild generate hero/sections |
| Forms | Stadium inputs, gold borders | Mixed native/shadcn | Standardize on shadcn `Input`/`Select` |
| Illustrations | Celestial SVG line art | Stock/placeholder images | Add `/public/illustrations/` assets |
| FAQ | 2-col accordion, multiple styles | Per-page ad hoc | Shared `FAQAccordion` component |
| Celestial bg | `CelestialBackground.tsx` exists | Partial use | Extend for service landings |

---

## Architecture

### Token Layer

```
app/globals.css
  └── CSS custom properties (semantic tokens from stitch/DESIGN_SYSTEM.md)
  └── shadcn variable mapping (:root only — no .dark for V1)
  └── @theme inline (Tailwind v4)

app/layout.tsx
  └── next/font: Fraunces (display), Geist Sans, Geist Mono
```

### Component Layer

```
components/
  layout/
    SiteNav.tsx          ← refactor from Navbar.tsx
    SiteFooter.tsx       ← refactor from Footer.tsx
    SectionBand.tsx      ← new: full-width section wrapper
    PageContainer.tsx    ← new: max-width + padding
  marketing/
    EditorialHero.tsx    ← new: split/centered/gradient variants
    ServiceTile.tsx      ← new
    StepCard.tsx         ← new
    StatsBar.tsx         ← new
    CTABanner.tsx        ← new
    FAQAccordion.tsx     ← new
  astrologers/
    AstrologerFilterBar.tsx
    AstrologerCard.tsx       ← featured variant
    AstrologerDirectoryCard.tsx
  horoscope/
    ZodiacIconRow.tsx
    HoroscopeDashboard.tsx
  pricing/
    PricingCard.tsx
    PricingHero.tsx
    GlassCard.tsx            ← optional V1
  forms/
    FormCard.tsx             ← white card form container
    StadiumInput.tsx         ← pill input wrapper (optional)
  ui/                        ← extend existing shadcn
    button.tsx               ← add gradient + pill variants
    card.tsx                 ← add cream + interactive variants
    badge.tsx                ← popular/top-rated variants
```

### Page Composition Pattern

Each marketing page becomes a composition of layout + marketing components:

```tsx
// Example: About page
<SectionBand variant="subtle">
  <EditorialHero variant="split" ... />
</SectionBand>
<SectionBand variant="default">
  <PageContainer>
    <ValuesGrid />  {/* 4-col StepCard or icon cards */}
  </PageContainer>
</SectionBand>
<SectionBand variant="muted">
  <TeamGrid />
</SectionBand>
<CTABanner />
```

No per-page ad hoc colors. All styling via tokens and shared components.

---

## Phase 0 — Foundation (Week 1)

**Goal:** Token layer and font loading. No visible page changes yet.

### Tasks

| # | Task | Files |
|---|------|-------|
| 0.1 | Add semantic color tokens from `stitch/DESIGN_SYSTEM.md` mapped to V1 light palette | `app/globals.css` |
| 0.2 | Map shadcn CSS variables to semantic tokens | `app/globals.css` |
| 0.3 | Load Fraunces via `next/font/google` (weights 600, 700) | `app/layout.tsx` |
| 0.4 | Add Tailwind `@theme` entries for display/heading/body scales | `app/globals.css` |
| 0.5 | Add `font-display` utility class for Fraunces | `app/globals.css` |
| 0.6 | Deprecate raw hex in globals (`#f37833`, `#fcbb18`, `#794235`) — comment with replacement tokens | `app/globals.css` |
| 0.7 | Extend `button.tsx` with `variant="gradient"` and `size="pill"` | `components/ui/button.tsx` |
| 0.8 | Extend `card.tsx` with `variant="cream"` and `variant="interactive"` | `components/ui/card.tsx` |
| 0.9 | Extend `badge.tsx` with `variant="popular"` | `components/ui/badge.tsx` |

### Acceptance

- [ ] Storybook or dev page showing all button/card/badge variants
- [ ] Fraunces renders on test heading
- [ ] Zero new raw hex in component files

---

## Phase 1 — Layout Shell (Week 1–2)

**Goal:** Unified nav and footer across all public pages.

### Tasks

| # | Task | Files | Mockup ref |
|---|------|-------|------------|
| 1.1 | Build `SectionBand` (variants: default, subtle, muted, accent-border) | `components/layout/SectionBand.tsx` | All |
| 1.2 | Build `PageContainer` (max-w-1120, responsive padding) | `components/layout/PageContainer.tsx` | All |
| 1.3 | Rebuild nav: transparent-on-hero, white-on-scroll, underline active | `components/Navbar.tsx` | All |
| 1.4 | Rebuild footer: light bg, 4 columns, real contact, working legal links | `components/Footer.tsx` | All |
| 1.5 | Update `ConditionalLayout.tsx` to use new shell | `components/ConditionalLayout.tsx` | — |
| 1.6 | Add scroll-based nav background via `useScroll` or CSS | `components/Navbar.tsx` | Pricing hero |

### Acceptance

- [ ] Nav/footer identical on all marketing pages
- [ ] No gold background on nav or footer
- [ ] Active page shows underline
- [ ] Mobile nav drawer works (existing or new)

---

## Phase 2 — Shared Marketing Components (Week 2)

**Goal:** Reusable building blocks before page rewrites.

### Tasks

| # | Component | Priority | Mockup ref |
|---|-----------|----------|------------|
| 2.1 | `EditorialHero` (variants: split, centered, gradient) | P0 | 5, 6, 7 |
| 2.2 | `FAQAccordion` (variants: divided, card, two-column) | P0 | 1, 3, 4, 5, 6 |
| 2.3 | `StepCard` (numbered orange circle) | P0 | 3, 4 |
| 2.4 | `ServiceTile` (icon + title + description) | P1 | 3, 4 |
| 2.5 | `CTABanner` (gradient band + pill CTA) | P1 | 1, 4 |
| 2.6 | `StatsBar` (3 metrics, gold gradient bg → V1: subtle tint) | P2 | 7 |
| 2.7 | `FormCard` (white card form wrapper) | P0 | 1, 3, 4 |
| 2.8 | `ContactCard` (icon + title + detail) | P1 | 1 |
| 2.9 | Import celestial SVG illustrations | `public/illustrations/` | 2, 3, 5, 7 |

### Acceptance

- [ ] Component showcase page or Storybook with all variants
- [ ] FAQAccordion passes keyboard/a11y (aria-expanded)
- [ ] All components use semantic tokens only

---

## Phase 3 — Editorial Pages (Week 2–4)

Implement in order of mockup coverage and traffic priority.

### 3.1 Homepage `/`

| Section | Component | Replaces |
|---------|-----------|----------|
| Hero | `EditorialHero` centered + compact form | `HeroSection.tsx` |
| Services | `ServiceTile` 4-col | `FeaturesSection.tsx` |
| Reports | Simplified card grid | `AIReportsSection.tsx` |
| How it works | `StepCard` 3-col (reduce from 4) | `HowItWorksSection.tsx` |
| Trust/CTA | `CTABanner` or remove | `CTASection.tsx` |

**Delete/simplify:** `FeaturesGridSection.tsx` if redundant.

**Target:** <8 mobile viewport scrolls (per REDESIGN_DECISION).

### 3.2 About `/about/` — Mockup `_homepage_7`

| Section | Component |
|---------|-----------|
| Hero | `EditorialHero` split + portal illustration |
| Mission | `PageContainer` + prose |
| Values | 4-col icon cards (`StepCard` or icon card) |
| Story | Split layout + constellation illustration |
| Team | 3-col team cards |
| Why Choose | 4-col horizontal cards |
| CTA | `CTABanner` |

### 3.3 Contact `/contact/` — Mockup `_homepage_1`

| Section | Component |
|---------|-----------|
| Hero | `EditorialHero` simple centered |
| Contact cards | `ContactCard` 2×2 grid |
| Support row | `ContactCard` 4-col |
| Form | `FormCard` + shadcn form |
| FAQ | `FAQAccordion` card variant |
| CTA | `CTABanner` "Immediate Assistance" |

### 3.4 AI Astrologers `/astrologers/` — Mockup `_homepage_2`

| Section | Component |
|---------|-----------|
| Hero | `EditorialHero` split |
| Filters | `AstrologerFilterBar` (new) |
| Featured | `AstrologerCard` 3-col |
| Directory | `AstrologerDirectoryCard` 4-col |
| Why experts | `ServiceTile` 4-col |
| Footer | shared |

**New components:** `AstrologerFilterBar`, `AstrologerCard`, `AstrologerDirectoryCard`.

### 3.5 Kundli Generate `/services/kundli/generate/` — Mockup `_homepage_3`

| Section | Component |
|---------|-----------|
| Hero | `EditorialHero` centered + arched title |
| Background | `CelestialBackground` (lightened for V1) |
| How it works | `StepCard` 4-col |
| Education + Form | Split: prose left, `FormCard` right |
| What you get + FAQ | Split: feature list + `FAQAccordion` |

**Files:** `KundliGenerateHero.tsx` and related generate components.

### 3.6 Matchmaking `/services/matchmaking/` — Mockup `_homepage_4`

Same pattern as Kundli:
- Hero centered with circular emblem
- Gun Milan education section
- How it works 4-col
- Partner form
- What you get + FAQ

### 3.7 Horoscope `/services/horoscope/` — Mockup `_homepage_5`

| Section | Component |
|---------|-----------|
| Hero | `EditorialHero` split |
| Zodiac | `ZodiacIconRow` (new) |
| Dashboard | `HoroscopeDashboard` (new) |
| How it works + FAQ | cream section |
| CTA | gradient pill button |

**New components:** `ZodiacIconRow`, `HoroscopeDashboard`.

### Phase 3 Acceptance

- [ ] All 7 mockup pages have visual parity (adapted for light-first)
- [ ] No `#fcbb18` background sections
- [ ] Fraunces on all hero H1s
- [ ] Shared FAQ component on all pages that have FAQ
- [ ] Screenshots match stitch layout within 80% fidelity

---

## Phase 4 — Instrument Pages (Week 4–5)

### 4.1 Pricing `/pricing/` — Mockup `_homepage_6`

| Section | Component |
|---------|-----------|
| Hero | `PricingHero` with gradient (or light hero + celestial art) |
| Unlock info | `GlassCard` or standard card |
| Plans | `PricingCard` 2×2 grid |
| FAQ | `FAQAccordion` divided 2-col |
| Footer | shared |

**Key changes:**
- Remove purple/lavender palette
- "Most Popular" badge + gold border glow on highlight card
- Inline Razorpay for authenticated users
- Coin explainer above grid

**Files:** `app/[locale]/pricing/page.tsx`, new `components/pricing/*`.

### 4.2 Wallet `/wallet/`

Not in stitch mockups — implement per `REDESIGN_DECISION.md` instrument mode:
- Balance card with mono coin count, primary left-border accent
- Transaction table (shadcn Table)
- Purchase modal (reuse `PricingCard`)

### 4.3 Admin `/admin/*` + Astrologer `/astrologer/*`

Not in stitch mockups — implement per `REDESIGN_DECISION.md`:
- Unified `DashboardSidebar` with mobile drawer
- Brand-colored charts (primary/secondary, not blue/green)
- Instrument density (16px card padding, 40px table rows)

### Phase 4 Acceptance

- [ ] Pricing page matches stitch `_homepage_6` layout
- [ ] Wallet and admin use same tokens as marketing
- [ ] No per-feature color palettes remain

---

## Phase 5 — Editorial App Surfaces (Week 5–6)

### 5.1 Reports

Apply editorial mode to result pages:
- Sticky header with breadcrumb, share, translate
- Fraunces `display-lg` on summary insight
- Underline tabs, collapsible data sections
- `body-lg` prose at 68ch for interpretations

**Files:** `KundliResultContent.tsx`, horoscope/matchmaking result pages.

### 5.2 Chat

- Remove violet gradients
- AI bubbles: `accent-muted` left border
- Full-height layout, no footer
- Compact header with rate + balance

**Files:** `app/[locale]/chat/[sessionId]/page.tsx`, chat components.

### Phase 5 Acceptance

- [ ] Reports and chat feel cohesive with marketing pages
- [ ] No violet chat gradients

---

## Phase 6 — Polish & QA (Week 6)

| # | Task |
|---|------|
| 6.1 | Run screenshot script — compare to stitch mockups |
| 6.2 | WCAG contrast audit on all pages |
| 6.3 | Mobile pass: all grids collapse, sidebars drawer, tabs scroll |
| 6.4 | i18n: verify Fraunces doesn't break Hindi/Gujarati headings |
| 6.5 | Performance: font subsetting, illustration lazy load |
| 6.6 | Remove dead home components (`FeaturesGridSection`, etc.) |
| 6.7 | Update `DESIGN_AUDIT.md` checklist in `REDESIGN_DECISION.md` |

---

## Component Build Order (Dependency Graph)

```
Phase 0: globals.css, fonts, button/card/badge variants
    │
Phase 1: SectionBand, PageContainer, Navbar, Footer
    │
Phase 2: EditorialHero, FAQAccordion, StepCard, FormCard
    │         ├── ServiceTile, CTABanner, ContactCard
    │         └── Illustrations (parallel)
    │
Phase 3: Pages (can parallelize after Phase 2)
    │     ├── Homepage, About, Contact
    │     ├── Astrologers (+ FilterBar, AstrologerCard)
    │     ├── Kundli, Matchmaking
    │     └── Horoscope (+ ZodiacIconRow, HoroscopeDashboard)
    │
Phase 4: Pricing (+ PricingCard, PricingHero)
    │     ├── Wallet
    │     └── Admin / Astrologer dashboards
    │
Phase 5: Reports, Chat
    │
Phase 6: QA
```

---

## V1 Adaptations (Mockup → Shipped)

These mockup patterns are **intentionally changed** per `REDESIGN_DECISION.md`:

| Mockup | Shipped V1 |
|--------|------------|
| Full-width gold hero/footer backgrounds | Light `--color-background` with gold accents on icons/buttons only |
| Full-width purple section backgrounds | `--color-background-subtle` (#F4F3F0) or white with border dividers |
| Dark cosmic Kundli/horoscope body | Light bg + `CelestialBackground` at low opacity |
| Orange gradient buttons | Solid `--color-primary` (#C17A3A) acceptable; gradient optional |
| Gold footer | Light footer matching nav |
| Glass card on pricing | Optional — standard white card acceptable |
| Arched/curved headline text | Skip V1 — use straight Fraunces |

Document each adaptation in PR descriptions so reviewers know mockup fidelity targets.

---

## Asset Requirements

| Asset | Format | Used on | Priority |
|-------|--------|---------|----------|
| Portal illustration | SVG | About hero | P1 |
| Sun/moon celestial diagram | SVG | Horoscope, Astrologers hero | P0 |
| Constellation line art | SVG | Kundli, Matchmaking, Pricing hero bg | P0 |
| Zodiac icons (12) | SVG | Horoscope selector | P0 |
| Contact icons (mail, phone, clock, pin) | SVG | Contact cards | P1 |
| Category icons (love, career, wellness) | SVG | Horoscope dashboard | P1 |
| Team avatars | SVG or PNG | About team section | P2 |
| Razorpay logo | SVG | Pricing trust row | P0 |

Place in `public/illustrations/`. Prefer inline SVG React components for themeable stroke colors.

---

## Testing Strategy

| Type | Approach |
|------|----------|
| Visual regression | Re-run `npm run screenshots` — compare marketing group to stitch mockups |
| Component | Storybook stories for each new marketing component |
| a11y | axe-core on all redesigned pages; focus on gold→light contrast |
| Responsive | 375px, 768px, 1280px viewports per mockup |
| i18n | `next-intl` — verify layout doesn't break with longer strings |

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Fraunces doesn't render Indic scripts | Use Geist for non-Latin headings; Fraunces for EN only |
| Gradient buttons fail contrast | Fall back to solid primary per REDESIGN_DECISION |
| Astrologer filter bar needs API changes | Ship static UI first; wire filters in follow-up |
| Horoscope dashboard needs live data | Mock data in component; wire API separately |
| Scope creep on illustrations | Ship with placeholder SVGs; polish in Phase 6 |
| Two DESIGN_SYSTEM.md files confuse team | `stitch/DESIGN_SYSTEM.md` = mockup extract; root `DESIGN_SYSTEM.md` = canonical spec — merge after V1 |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Mockup fidelity (marketing pages) | ≥80% layout match on desktop |
| Gold background sections | 0 |
| Distinct card patterns per page | ≤2 |
| Raw hex in components | 0 |
| Mobile sidebar broken | 0 |
| WCAG AA contrast failures | 0 on redesigned pages |
| Homepage mobile scroll depth | <8 viewports |

---

## File Change Summary (Estimated)

| Area | New files | Modified files |
|------|-----------|----------------|
| Tokens / fonts | 0 | `globals.css`, `layout.tsx` |
| Layout | 4 | `Navbar.tsx`, `Footer.tsx`, `ConditionalLayout.tsx` |
| Marketing components | ~15 | — |
| Page files | 0 | ~12 `page.tsx` files |
| UI primitives | 0 | `button.tsx`, `card.tsx`, `badge.tsx` |
| Illustrations | ~10 SVG | — |
| **Total** | **~29 new** | **~17 modified** |

---

## Document References

| Document | Role |
|----------|------|
| `stitch/DESIGN_SYSTEM.md` | Visual spec extracted from mockups |
| `stitch/IMPLEMENTATION_PLAN.md` | This file — build sequence |
| `../REDESIGN_DECISION.md` | Final product decisions (overrides mockup backgrounds) |
| `../DESIGN_AUDIT.md` | Problem evidence |
| `screenshots/marketing/VISUAL_AUDIT.md` | Before-state screenshots |
| `SCREENSHOT_PLAN.md` | Regression screenshot coverage |

---

*No code has been modified. This plan is ready for Phase 0 kickoff.*
