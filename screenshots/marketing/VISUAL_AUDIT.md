# Anantastro Marketing Visual Audit

**Scope:** `screenshots/marketing/` — 21 screenshots across 11 page variants  
**Audited:** June 2026  
**Reference:** `DESIGN_SYSTEM.md`, `DESIGN_AUDIT.md`

---

## Screenshot Inventory

| File | Page | Viewport | Auth |
|------|------|----------|------|
| `home__guest__desktop.png` | Home | Desktop | Guest |
| `home__guest__mobile.png` | Home | Mobile | Guest |
| `home-services-dropdown__guest__desktop.png` | Home (Services open) | Desktop | Guest |
| `home-mobile-nav-drawer__guest__mobile.png` | Home (nav open) | Mobile | Guest |
| `home-below-fold__guest__desktop.png` | Home (scrolled) | Desktop | Guest |
| `home-below-fold__guest__mobile.png` | Home (scrolled) | Mobile | Guest |
| `about__guest__desktop.png` | About | Desktop | Guest |
| `about__guest__mobile.png` | About | Mobile | Guest |
| `contact__guest__desktop.png` | Contact | Desktop | Guest |
| `contact__guest__mobile.png` | Contact | Mobile | Guest |
| `pricing__guest__desktop.png` | Pricing | Desktop | Guest |
| `pricing__guest__mobile.png` | Pricing | Mobile | Guest |
| `astrologers__guest__desktop.png` | AI Astrologers | Desktop | Guest |
| `astrologers__guest__mobile.png` | AI Astrologers | Mobile | Guest |
| `astrologers-authed__user__desktop.png` | AI Astrologers | Desktop | User |
| `astrologers-authed__user__mobile.png` | AI Astrologers | Mobile | User |
| `not-found__guest__desktop.png` | 404 | Desktop | Guest |
| `not-found__guest__mobile.png` | 404 | Mobile | Guest |
| `account-deactivated__guest__desktop.png` | Home (deactivated param) | Desktop | Guest |
| `account-deactivated__guest__mobile.png` | Home (deactivated param) | Mobile | Guest |
| `footer__guest__desktop.png` | About (footer crop) | Desktop | Guest |

---

## Per-Screenshot Findings

### Home (`home__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | Hero competes with itself: headline, two CTAs, and a full kundli form all fight for primary attention. "GET KUNDLI — 20 COINS" introduces monetization with no prior explanation. |
| Visual hierarchy | Services dropdown (`home-services-dropdown`) overlaps the hero headline, obscuring the main value proposition. |
| Spacing | Alternating yellow/white/yellow sections create rhythm but produce excessive vertical scroll (~6 full sections before footer). |
| Spacing | "Personalized Reports" left column is dense; large illustration on the right leaves uneven whitespace. |
| Typography | Serif display on hero only; body uses sans. Coin CTA uses ALL CAPS while other buttons use title case. |
| Components | Four distinct card patterns on one page: Core Services (icon box + shadow), Reports grid (small white cards), How It Works (numbered circles), Trust (icon box, no shadow). |
| Components | Three button styles: solid orange, outlined orange, small arrow CTA ("View All Reports"). |
| Colors | Saturated `#fcbb18` yellow on hero, reports, trust, and footer — ~40% of page surface is identical gold. |
| Mobile | Form card overlaps hero; name field icon overlaps input border (`home-mobile-nav-drawer`). |
| Mobile | Language switcher dropdown floats awkwardly over header when nav is open. |
| Mobile | Page length extreme — hero + form + 4 service cards + 4 report cards + illustration + 4 steps + 3 trust cards + CTA + footer. |
| Accessibility | Outlined "Explore Services" button on yellow background has very low contrast. |
| Accessibility | Placeholder text in form fields may fail as sole label indicator. |

### About (`about__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | "Our Mission" three-paragraph block is dense on mobile; no pull quotes or visual breaks. |
| Visual hierarchy | Gradient placeholder image (star icon) reads as unfinished, not premium. |
| Spacing | Values cards (4-col desktop) are narrow with tight internal padding. |
| Spacing | Floating dark circular element overlaps mission text on mobile. |
| Typography | Hero uses serif; section headings switch to sans — acceptable but inconsistent with home. |
| Components | Three card families: Values (brown square icon), Team (large circular icon, identical for all 3), Why Choose (brown square, horizontal layout). |
| Components | CTA "Contact Us" button has near-invisible border on white — looks disabled. |
| Colors | Same yellow/white alternation as home; no visual differentiation between marketing pages. |
| Mobile | Team cards use dividers between items; Values cards do not — inconsistent list treatment. |
| Accessibility | Brown text on yellow in Values/Why Choose sections likely fails WCAG AA for body text. |

### Contact (`contact__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | Hero + form + 4 contact cards + live chat banner + FAQ + footer — too many sections for a contact page. |
| Visual hierarchy | FAQ section uses another full-width yellow band, adding a third yellow block. |
| Spacing | Large gap between contact form area and FAQ section. |
| Typography | "Contact Us" hero uses serif; form section headings use sans. |
| Components | "Send Message" (solid orange) vs "Start Live Chat" (ghost/outline) — different weights for similar actions. |
| Components | Contact info cards duplicate footer contact data. |
| Colors | Yellow hero + yellow FAQ + yellow footer = three yellow bands on one page. |
| Mobile | Email input has icon overlapping left border (same bug as home form). |
| Mobile | Footer links left-aligned with ~50% empty space on right. |
| Accessibility | Light gray placeholder text on white inputs likely fails contrast. |
| Accessibility | "Start Live Chat" links to a feature that may not exist (no live chat in product). |

### Pricing (`pricing__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | Strong hero with coin icon and trust badges — best-structured marketing page. |
| Visual hierarchy | "Best value" card correctly emphasized with purple border. |
| Spacing | Desktop grid is 3+1 layout — fourth card alone on row two leaves large empty area. |
| Typography | Serif "Coin packs" headline matches home; body is clean sans. |
| Components | First card named "Starter"; others named by coin amount — naming inconsistency. |
| Components | Purple/lavender theme completely breaks from gold brand palette used on every other marketing page. |
| Colors | **Critical palette split:** white/lavender/purple body vs gold footer — feels like two different products stitched together. |
| Colors | Orange "Sign in to buy" buttons are the only element connecting to brand orange. |
| Mobile | Floating dark icon overlaps ₹100 price on first card (dev overlay artifact). |
| Accessibility | Purple text on lavender backgrounds in coin breakdown boxes may fail contrast. |
| Accessibility | "≈ ₹0.71 per coin" text is very small. |

### Astrologers (`astrologers__*`, `astrologers-authed__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | Hero is clear; cards are well-structured with avatar, status, tags, price, CTA. |
| Visual hierarchy | Authed view adds coin balance (631) in nav — good. No visual change to page content when logged in. |
| Spacing | Desktop 3-column grid leaves orphan card in row 3 (1 of 3 slots filled). |
| Spacing | Mobile cards are very tall (~400px each) — 7 cards = extreme scroll. |
| Typography | Specialty tags use underlined text on mobile, resembling links rather than labels. |
| Components | Online CTA (bright orange) vs offline CTA (desaturated peach) — offline state has poor affordance. |
| Components | "Consultation Price" label vs "X coins/min" — good pattern. Coin icon is consistent. |
| Colors | Card header uses cream gradient; tags use light orange — subtle but adds another tone. |
| Mobile | Status dots (green/red) are very small (~8px) — hard to distinguish for color-blind users. |
| Accessibility | **Critical:** "Currently Offline" button uses white text on light peach — fails WCAG contrast. |
| Accessibility | Status conveyed by color only (green/red dot) without text label. |

### 404 (`not-found__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | N/A — page does not render. |
| Components | Shows Next.js runtime error overlay: "Missing `<html>` and `<body>` tags in the root layout." |
| Colors | N/A |
| Mobile | Same runtime error on mobile. |
| Accessibility | Complete failure — no accessible content. |

**Note:** The 404 screenshot captured a dev-time Next.js error, not the custom `not-found.tsx` UI. The actual 404 page may render correctly in production; this screenshot documents a broken capture state.

### Account Deactivated (`account-deactivated__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | Renders full homepage with no visible deactivated-account banner or alert. |
| Components | Query param `?error=account_deactivated` has no UI response — user sees normal home. |
| Colors | Identical to home page. |
| Accessibility | Error state is invisible — fails to communicate account status to users. |

### Footer (`footer__*`)

| Issue type | Finding |
|------------|---------|
| Visual hierarchy | Footer is visually heavy — same gold as hero competes rather than recedes. |
| Spacing | Four columns on desktop are well-structured; mobile stacks with excessive vertical height. |
| Typography | Link text and copyright are very small (~12px). |
| Components | Social icons lack `aria-label` (icon-only links). |
| Colors | Brown `#794235` text on gold `#fcbb18` — borderline contrast for small text. |
| Accessibility | Placeholder contact: `+1 (555) 123-4567`, `123 Astrology Street, Mystic City` — undermines trust. |
| Accessibility | Legal links (Privacy, Terms, Refund) point to pages that do not exist. |

---

## Findings by Severity

### Critical

| # | Finding | Screenshots affected |
|---|---------|---------------------|
| C1 | **Pricing page uses entirely different color system** (lavender/purple) vs gold brand on all other marketing pages. Breaks product coherence and premium positioning. | `pricing__*` |
| C2 | **404 page captured as Next.js runtime error** — no user-facing 404 UI visible. Users hitting bad URLs see a developer error overlay. | `not-found__*` |
| C3 | **Account deactivated state has no visible UI** — `?error=account_deactivated` renders identical homepage with no banner, toast, or alert. | `account-deactivated__*` |
| C4 | **"Currently Offline" astrologer CTA fails contrast** — white text on light peach background is unreadable and fails WCAG AA. | `astrologers__*` |
| C5 | **Footer contains placeholder contact information** — fake phone, fake address displayed in production UI. Destroys trust for a payment platform. | All pages (footer) |
| C6 | **Footer links to non-existent pages** — Privacy, Terms, Refund, AI Reports, Live Consultation all 404. Legal links on a coin-purchase site are a compliance risk. | All pages (footer) |
| C7 | **Services dropdown overlaps hero headline** on desktop — primary value proposition is obscured when menu is open. | `home-services-dropdown__*` |

### Medium

| # | Finding | Screenshots affected |
|---|---------|---------------------|
| M1 | **Four+ card component variants on homepage** — icon boxes, numbered circles, small report cards, trust cards all use different structures for similar content. | `home__*` |
| M2 | **Gold yellow dominates ~40% of every page** — hero, alternating sections, and footer all use identical saturated `#fcbb18`, creating visual fatigue and cheapening premium positioning. | `home__*`, `about__*`, `contact__*`, `astrologers__*` |
| M3 | **Pricing grid 3+1 layout** leaves orphan card and large empty area on desktop. | `pricing__guest__desktop` |
| M4 | **Mobile homepage scroll depth is extreme** — 15+ viewport-heights before footer. Users never see footer content without heavy scrolling. | `home__guest__mobile` |
| M5 | **Mobile astrologer cards are excessively tall** — 7 cards stacked vertically creates 20+ screen scrolls. | `astrologers__guest__mobile` |
| M6 | **Form input icon overlap bug** — user/avatar icon overlaps name/email field left border on mobile forms. | `home-mobile-nav-drawer`, `contact__guest__mobile` |
| M7 | **Outlined CTA buttons on yellow backgrounds** have very low contrast ("Explore Services", "All Other Services", "View Pricing"). | `home__*`, `about__*` |
| M8 | **Inconsistent button naming** — "Get Started Free" vs "GET KUNDLI — 20 COINS" vs "Get One Chart Free" vs "Sign in to buy" — no unified CTA vocabulary. | `home__*`, `about__*`, `pricing__*` |
| M9 | **About page mission placeholder image** — gradient box with star icon reads as unfinished wireframe, not premium brand asset. | `about__*` |
| M10 | **Contact page duplicates footer contact info** in both contact cards and footer — redundant content. | `contact__*` |
| M11 | **Astrologer grid orphan card** — 7 astrologers in 3-column grid leaves row 3 with one card and empty space. | `astrologers__guest__desktop` |
| M12 | **Brown-on-yellow text contrast** in Values, Why Choose, and footer sections likely fails WCAG AA for body-sized text. | `about__*`, all footers |
| M13 | **"Live Consultation" linked in footer and nav** but no page exists — broken promise on every page. | All pages |
| M14 | **Coin economy unexplained on homepage** — "20 COINS" on hero CTA with no context about what coins are or how to get them. | `home__*` |

### Minor

| # | Finding | Screenshots affected |
|---|---------|---------------------|
| m1 | **Serif/sans split** — display serif on heroes only; all else sans. Acceptable but feels dated without a loaded premium serif (system serif fallback). | All pages |
| m2 | **Pricing card naming inconsistency** — "Starter" vs "250 Coins" vs "300 Coins" vs "500 Coins". | `pricing__*` |
| m3 | **Team section uses identical circular icon** for all three team categories — reduces visual differentiation. | `about__*` |
| m4 | **Mobile specialty tags appear as underlined links** on astrologer cards — confusing affordance. | `astrologers__guest__mobile` |
| m5 | **Language switcher positioning** awkward when mobile nav is open — floats over header area. | `home-mobile-nav-drawer` |
| m6 | **Social media icons in footer** lack text labels or `aria-label` attributes. | All footers |
| m7 | **"How It Works" uses numbered orange circles** while all other sections use brown square icons — third icon treatment. | `home__*` |
| m8 | **Contact CTA button border nearly invisible** on About page — appears disabled. | `about__*` |
| m9 | **Copyright year inconsistency** — footer shows both © 2024, © 2025, and © 2026 across different screenshots. | Various footers |
| m10 | **Floating dev overlay artifacts** visible in screenshots (red "1 Issue" pill, dark "N" circle) — not product UI but appears in captures. | `home-below-fold`, `about__mobile`, `pricing__mobile` |
| m11 | **Astrologer page title "Connect With Astrologers"** doesn't clarify these are AI astrologers, not human astrologers. | `astrologers__*` |
| m12 | **No active state on nav** — "About" and "Contact" pages don't highlight current page in navigation. | `about__*`, `contact__*` |
| m13 | **Mobile footer links left-aligned** with large empty right margin — unbalanced layout. | All mobile footers |
| m14 | **Trust badge row on pricing** ("Razorpay checkout", "Wallet & receipts") uses different icon styles (green check vs purple calendar). | `pricing__*` |

---

## Cross-Cutting Patterns

### Color System Fragmentation

```
Homepage/About/Contact/Astrologers:  Gold #fcbb18 + Orange #f37833 + Brown #794235
Pricing page:                      Lavender + Purple + Orange buttons only
Footer (all pages):                Gold #fcbb18 (same as hero — no hierarchy)
```

The pricing page looks like a different product. This is the single largest brand coherence failure in the marketing shell.

### Card Component Proliferation

The homepage alone uses **5 distinct card patterns**:

1. Core Services — white card, brown square icon, shadow
2. Reports grid — small white card, brown square icon, no shadow
3. How It Works — numbered orange circle, no card container
4. Trust/features — white card, brown square icon, no shadow
5. Hero form — white card, no icon, form fields

A design system should reduce this to **2 variants**: `card-default` and `card-interactive`.

### Mobile Scroll Depth

| Page | Estimated mobile viewport heights |
|------|----------------------------------|
| Home | ~15–18 |
| About | ~12–14 |
| Contact | ~14–16 |
| Astrologers | ~20+ |
| Pricing | ~8–10 |

Astrologers and Home are the worst offenders. Consider progressive disclosure, collapsible sections, or horizontal scroll carousels.

### Footer as Trust Liability

Every marketing page shares a footer that:
- Uses fake contact information
- Links to 5+ pages that don't exist
- Occupies 3–4 mobile viewport heights
- Uses the same saturated gold as the hero (no visual de-emphasis)

For a platform that sells coin packs via Razorpay, this is a conversion and compliance risk.

---

## Top 20 Redesign Opportunities (Ranked by Impact)

| Rank | Opportunity | Impact | Effort | Screenshots |
|------|-------------|--------|--------|-------------|
| 1 | **Unify color system across all marketing pages** — bring pricing page into gold/dark palette; eliminate lavender/purple divergence | Critical — brand coherence | Medium | `pricing__*`, all |
| 2 | **Replace saturated gold sections with dark/neutral backgrounds** — use gold as accent only (CTAs, borders, icons), not 40% of page surface. Adopt `DESIGN_SYSTEM.md` dark-first tokens | Critical — premium positioning | High | `home__*`, `about__*`, `contact__*` |
| 3 | **Fix footer: real contact info, working legal links, subdued background** — separate footer visually from hero; use `--color-surface-sunken` not hero gold | Critical — trust & compliance | Medium | All footers |
| 4 | **Consolidate to 2 card components** — `card-default` (icon + title + description) and `card-interactive` (clickable, hover state). Replace 5 homepage card patterns | High — visual coherence | Medium | `home__*`, `about__*` |
| 5 | **Redesign hero section** — single clear CTA, move form below fold or into modal, explain coin economy before showing price | High — conversion | Medium | `home__*` |
| 6 | **Fix astrologer offline button contrast** — use `text-secondary` on `surface-sunken` with "Offline" text label, not color-only state | High — accessibility | Low | `astrologers__*` |
| 7 | **Implement account-deactivated banner** — sticky alert bar on homepage when `?error=account_deactivated` is present | High — user trust | Low | `account-deactivated__*` |
| 8 | **Fix 404 page** — ensure custom `not-found.tsx` renders in all environments; friendly illustration + navigation links | High — first impression | Low | `not-found__*` |
| 9 | **Reduce mobile scroll depth** — collapse "How It Works" and "Trust" into horizontal carousels; compress footer on mobile | High — mobile UX | Medium | `home__guest__mobile`, `astrologers__guest__mobile` |
| 10 | **Standardize CTA vocabulary** — one primary ("Get started"), one secondary ("View pricing"), one service ("Generate kundli — 10 coins"). Remove ALL CAPS | High — clarity | Low | All pages |
| 11 | **Fix pricing grid layout** — 2×2 or 4-column grid, not 3+1 orphan. Highlight "Best value" with scale, not just border | Medium — layout | Low | `pricing__*` |
| 12 | **Add active nav state** — highlight current page in navbar; breadcrumb on inner pages | Medium — wayfinding | Low | `about__*`, `contact__*`, `pricing__*` |
| 13 | **Fix form input icon overlap** on mobile — position icon inside padding, not on border | Medium — polish | Low | `home-mobile-nav-drawer`, `contact__guest__mobile` |
| 14 | **Rename astrologers page** — "AI Astrologers" or "Chat with AI Astrologers" to distinguish from human astrologer marketplace | Medium — clarity | Low | `astrologers__*` |
| 15 | **Replace about page placeholder image** — use real photography or custom illustration matching brand | Medium — credibility | Medium | `about__*` |
| 16 | **Add status text to astrologer cards** — "Online" / "Offline" text label beside dot, not color alone | Medium — accessibility | Low | `astrologers__*` |
| 17 | **Reduce contact page sections** — merge FAQ into accordion below form; remove duplicate contact cards | Medium — focus | Medium | `contact__*` |
| 18 | **Fix services dropdown z-index/position** — dropdown should not overlap hero headline | Medium — navigation | Low | `home-services-dropdown__*` |
| 19 | **Load premium display font** (Fraunces per DESIGN_SYSTEM.md) — replace system serif fallback on all marketing heroes | Medium — typography | Low | All heroes |
| 20 | **Add coin explainer strip** on homepage — "1 coin ≈ ₹1 · Use for kundli, horoscope, chat" between hero and services | Medium — conversion | Low | `home__*` |

---

## Recommended Implementation Order

```
Phase 1 — Trust fixes (1–2 days)
  ├── #3  Footer: real contact, legal pages, subdued bg
  ├── #6  Offline button contrast
  ├── #7  Account deactivated banner
  └── #8  404 page fix

Phase 2 — Brand unification (3–5 days)
  ├── #1  Pricing page color alignment
  ├── #2  Reduce gold surface area
  ├── #4  Card component consolidation
  └── #19 Display font

Phase 3 — Conversion optimization (3–5 days)
  ├── #5  Hero redesign
  ├── #10 CTA vocabulary
  ├── #20 Coin explainer
  └── #11 Pricing grid

Phase 4 — Mobile & accessibility (2–3 days)
  ├── #9  Mobile scroll reduction
  ├── #13 Form icon fix
  ├── #16 Status text labels
  └── #12 Active nav state
```

---

## Metrics to Track Post-Redesign

| Metric | Current state | Target |
|--------|---------------|--------|
| WCAG AA contrast failures (marketing) | ~8–10 instances | 0 |
| Distinct card patterns (homepage) | 5 | 2 |
| Color palettes (marketing) | 2 (gold + purple) | 1 |
| Mobile homepage scroll depth | ~15–18 viewports | <8 |
| Broken footer links | 5+ | 0 |
| Placeholder content in production | 3 items (phone, address, legal) | 0 |

---

*This audit covers marketing screenshots only. Separate audits are recommended for authenticated surfaces (kundli results, wallet, chat, admin, astrologer dashboards).*
