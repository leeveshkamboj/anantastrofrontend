# Anantastro Design System — Stitch "High Energy Consumer"

**Source:** 7 mockup screenshots in `/stitch/`  
**Style name:** High Energy Consumer  
**Status:** Extracted specification — implementation reference  
**Related:** `../REDESIGN_DECISION.md` (V1 constraints may override mockup backgrounds)

---

## Screenshot Inventory

| Folder | Page | Mode |
|--------|------|------|
| `anantastro_high_energy_consumer_homepage_1` | Contact | Editorial |
| `anantastro_high_energy_consumer_homepage_2` | AI Astrologers | Editorial + Instrument |
| `anantastro_high_energy_consumer_homepage_3` | Kundli (service landing) | Editorial |
| `anantastro_high_energy_consumer_homepage_4` | Matchmaking (service landing) | Editorial |
| `anantastro_high_energy_consumer_homepage_5` | Horoscope | Editorial |
| `anantastro_high_energy_consumer_homepage_6` | Pricing | Instrument |
| `anantastro_high_energy_consumer_homepage_7` | About | Editorial |

---

## Design Language Summary

The High Energy Consumer system is a **bold, celestial-branded marketing aesthetic**:

- Alternating **gold/yellow** and **deep purple** full-width section bands
- **White and cream** cards floating on dark or colored backgrounds
- **Fraunces** serif for editorial headlines; **Geist** sans for all UI
- **Orange-to-gold gradient** primary buttons (pill shape)
- Celestial line-art illustrations (sun, moon, constellations, zodiac)
- Generous section padding with centered max-width containers
- Rounded cards (16–24px), pill buttons, stadium-shaped form inputs

---

# Color System

All colors sampled from mockups. Use semantic tokens in implementation — never raw hex in components.

## Core Palette

| Token | Hex | RGB (approx) | Usage |
|-------|-----|--------------|-------|
| `--color-gold` | `#F0C000` | 240, 192, 0 | Hero backgrounds, footer, zodiac icon rings |
| `--color-gold-deep` | `#E0B000` | 224, 176, 0 | Footer, statistics bar gradient start |
| `--color-gold-light` | `#F0F0E0` | 240, 240, 224 | Cream section backgrounds (FAQ, How it works) |
| `--color-purple` | `#1A0B2E` | 26, 11, 46 | Dark section backgrounds, icon circle fills |
| `--color-purple-deep` | `#100030` | 16, 0, 48 | Footer dark variant, cosmic bg base |
| `--color-purple-mid` | `#200040` | 32, 0, 64 | Card icon backgrounds, dashboard section |
| `--color-white` | `#FFFFFF` | 255, 255, 255 | Cards, form containers, inputs |
| `--color-cream` | `#FFF9E5` | 255, 249, 229 | Service page cards on dark bg |
| `--color-off-white` | `#FDF5E6` | 253, 245, 230 | Horoscope FAQ section |
| `--color-black` | `#1A1A18` | 26, 26, 24 | Primary text on light backgrounds |
| `--color-text-inverse` | `#FFFFFF` | 255, 255, 255 | Text on purple sections |

## Accent & Action

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-orange` | `#F58220` | Primary button gradient start, step badges, checkmarks |
| `--color-orange-deep` | `#F09010` | Button gradient mid-tone |
| `--color-amber` | `#FFC107` | Button gradient end, secondary buttons |
| `--color-gradient-cta` | `linear-gradient(90deg, #F58220, #FFC107)` | Primary CTAs, footer CTA bands |
| `--color-gradient-hero` | `linear-gradient(180deg, #F0C000, #E7A734)` | Pricing hero, CTA banners |
| `--color-gradient-stats` | `linear-gradient(90deg, #E0B000, #F0E0A0)` | Statistics/metrics bar |

## Semantic Mapping (for implementation)

Map stitch visuals to semantic tokens compatible with `REDESIGN_DECISION.md`:

| Stitch visual | Semantic token | Notes |
|---------------|----------------|-------|
| Gold section bg | `--color-background-subtle` or retired | V1: use accent only, not full-width bands |
| Purple section bg | `--color-secondary-muted` | V1: lighten to `#F1F3F6` or subtle tint |
| Orange gradient CTA | `--color-primary` + hover | Solid `#C17A3A` in V1, gradient optional |
| Cream cards | `--color-surface` / `--color-cream` | Keep for cards on light bg |
| Purple dashboard | `--color-secondary-muted` | Horoscope dashboard cards stay white on tinted bg |
| Gold icons | `--color-primary` | Accent only |

## Domain Rules

| Feature | Color rule |
|---------|------------|
| **Section bands** | Alternate gold → white/cream → purple → gold (mockup). V1: single light bg with subtle section dividers |
| **Cards** | Always white or cream — never gold or purple fills |
| **Buttons** | Orange-gold gradient (mockup) or solid primary (V1) |
| **Icons** | Gold line-art on light bg; gold on dark purple circles for zodiac |
| **Form inputs** | White bg, gold or light gray border |
| **Badges** | Orange pill ("Top Rated", "Most Popular") |
| **Tags** | Light gray bg, dark text, pill shape |
| **Checkmarks** | Orange/gold filled circle with white check |

---

# Typography

## Font Stack

| Role | Family | Mockup label | Implementation |
|------|--------|--------------|----------------|
| **Display** | Fraunces | Labeled "Fraunces" on horoscope hero | `next/font/google` — weights 600, 700 |
| **Body / UI** | Geist Sans | All nav, forms, cards, dashboards | Existing app font |
| **Mono** | Geist Mono | Coin prices, stats numbers | Wallet, pricing, admin |

## Display Scale (Fraunces)

Used for page heroes and major section titles.

| Token | Desktop | Mobile | Weight | Usage |
|-------|---------|--------|--------|-------|
| `display-hero` | 56–64px | 40px | 700 | "Your Kundli", "Matchmaking", "Coin packs" |
| `display-xl` | 48px | 36px | 600 | "We're Here to Guide You", "Our Cosmic Mission" |
| `display-lg` | 40px | 32px | 600 | Section titles on colored bands |
| `display-md` | 32px | 28px | 600 | Card titles in editorial sections |

**Traits:** Tight line-height (1.1–1.2). Some headlines use **arched/curved text** on Kundli and Matchmaking heroes — implement as SVG text path or skip for V1.

## Heading Scale (Geist Sans)

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `heading-xl` | 24px | 600 | "Horoscope Dashboard", "Featured Astrologers" |
| `heading-lg` | 20px | 600 | Form section titles, FAQ heading |
| `heading-md` | 16px | 600 | Card titles, accordion questions |
| `heading-sm` | 14px | 600 | Filter labels, sub-card headers |

## Body Scale (Geist Sans)

| Token | Size | Line-height | Usage |
|-------|------|-------------|-------|
| `body-lg` | 16px | 1.6 | Hero subtext, card descriptions, FAQ answers |
| `body-md` | 14px | 1.5 | Default UI, form labels, nav links |
| `body-sm` | 13px | 1.45 | Astrologer bios, tag text, metadata |

## Caption Scale

| Token | Size | Usage |
|-------|------|-------|
| `caption-md` | 12px | Coin rates ("10 coins/min"), footer legal |
| `caption-sm` | 11px | Chart axis, fine print |

## Typography Rules

1. Fraunces on hero H1 and major editorial section titles only
2. Geist Sans for nav, buttons, forms, cards, dashboards, FAQ
3. Navigation links: `body-md`, medium weight, title case
4. Active nav: underline in dark text (not gold fill)
5. Prices in pricing cards: Fraunces `display-md` or Geist bold — mockup uses serif for "₹100"

---

# Spacing System

Base unit: **4px**. Mockups use generous marketing spacing.

## Scale

| Token | Value | Tailwind |
|-------|-------|----------|
| `space-1` | 4px | `1` |
| `space-2` | 8px | `2` |
| `space-3` | 12px | `3` |
| `space-4` | 16px | `4` |
| `space-6` | 24px | `6` |
| `space-8` | 32px | `8` |
| `space-10` | 40px | `10` |
| `space-12` | 48px | `12` |
| `space-16` | 64px | `16` |
| `space-20` | 80px | `20` |
| `space-24` | 96px | `24` |

## Context Rules (from mockups)

| Context | Padding |
|---------|---------|
| Section vertical (marketing) | 64–96px (`space-16` to `space-24`) |
| Hero vertical | 80–120px |
| Card internal | 24–40px (`space-6` to `space-10`) |
| Between cards in grid | 16–24px |
| Form field gap | 16px |
| Nav height | ~64px |
| Footer padding | 48px vertical |
| FAQ item padding | 16px vertical |
| Filter bar (astrologers) | 16px internal, floats with 24px margin from hero |

## Layout Widths

| Container | Max-width |
|-----------|-----------|
| Prose / hero text | 640px |
| Standard content | 1120px |
| Wide grid (astrologer directory) | 1280px |
| Full bleed | 100% (section backgrounds) |

## Grid Patterns

| Pattern | Columns | Gap | Used on |
|---------|---------|-----|---------|
| Service tiles | 4 | 24px | How it works, Why experts |
| Astrologer featured | 3 | 24px | Featured astrologers |
| Astrologer directory | 4 | 20px | Main directory |
| Contact cards | 2×2 | 24px | Contact methods |
| Support cards | 4 | 16px | Secondary contact row |
| FAQ | 2 | 32px | All FAQ sections |
| Footer | 3–4 | 48px | Quick links, contact |
| Pricing plans | 2×2 → 4 | 24px | Coin packs |
| Zodiac icons | 10 | 16px | Horoscope selector |

---

# Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Tags, small badges |
| `radius-md` | 12px | Standard cards, FAQ items |
| `radius-lg` | 16px | Feature cards, form containers |
| `radius-xl` | 24px | Large editorial cards, pricing cards |
| `radius-full` | 9999px | Pill buttons, zodiac circles, avatar rings |

---

# Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 4px 24px rgba(26, 11, 46, 0.08)` | White cards on purple bg |
| `shadow-card-hover` | `0 8px 32px rgba(26, 11, 46, 0.12)` | Interactive cards |
| `shadow-glow` | `0 0 0 2px #F0C000, 0 4px 24px rgba(240, 192, 0, 0.2)` | "Most Popular" pricing card |
| `shadow-nav` | `0 1px 0 rgba(0,0,0,0.06)` | Nav on transparent/hero bg |

Mockups use subtle drop shadows on cards over dark backgrounds. V1 may prefer border-only per `REDESIGN_DECISION.md`.

---

# Card Styles

Five card variants appear across mockups. Consolidate to **3 implementation variants**.

## 1. Standard Card

```
Background: #FFFFFF
Border: none (shadow only) or 1px #E5E2DC
Radius: 16px (radius-lg)
Padding: 24–32px
Shadow: shadow-card
```

**Used on:** Contact cards, FAQ accordions, How it works steps, astrologer directory cards, pricing cards.

## 2. Cream Editorial Card

```
Background: #FFF9E5 or #FDF5E6
Border: none
Radius: 16–24px
Padding: 32–40px
Shadow: none or subtle
```

**Used on:** Kundli service sections, horoscope FAQ area, form containers on dark bg.

## 3. Gradient Feature Card

```
Background: linear-gradient(180deg, #F58220, #FFC107)
Border: none
Radius: 16px
Padding: 24px
Text: #1A1A18 (dark on gradient)
```

**Used on:** "What you get" sections (Kundli, Matchmaking). V1: consider primary-muted bg instead of full gradient.

## 4. Dashboard Card (Horoscope)

```
Background: #FFFFFF
Radius: 16px
Padding: 20px
Header: icon + title + chevron (collapse)
Body: sub-sections with category icons (Love, Career, Wellness)
```

**Sub-sections:** Icon (colored) + bold label + body text. Collapsible accordion behavior.

## 5. Glass Card (Pricing hero)

```
Background: rgba(255, 255, 255, 0.25)
Backdrop-filter: blur(12px)
Border: 1px rgba(255, 255, 255, 0.4)
Radius: 16px
Padding: 24px
```

**Used on:** "What you can unlock" box on pricing hero. Optional for V1.

## Card Content Patterns

| Pattern | Structure |
|---------|-----------|
| **Icon card** | Centered gold line icon → Fraunces/Geist title → body text |
| **Astrologer card** | Badge → portrait (arched/circle) → name → bio → tags → CTA |
| **Directory card** | Avatar → name → role → tags → rating → price → button |
| **Step card** | Orange numbered circle → title → description |
| **Stat card** | Large bold number → label (statistics bar) |
| **FAQ card** | Question + chevron; expanded shows answer |

---

# Button Styles

## Primary CTA (Gradient Pill)

```
Background: linear-gradient(90deg, #F58220, #FFC107)
Color: #1A1A18
Font: Geist Sans 600, 14–16px
Height: 48–56px
Padding: 0 32px
Radius: radius-full (pill)
Border: none
Hover: slight scale(1.02) or darken gradient
```

**Labels seen:** "Learn more", "Get Full Personalized Report", "Start Consultation", "Send Message", "Get your Kundli"

## Secondary CTA (Outline Pill)

```
Background: #FFFFFF
Color: #1A1A18
Border: 2px solid #1A1A18
Height: 48px
Radius: radius-full
```

**Labels seen:** "Contact Us" (About page)

## Solid Orange Button (Pricing)

```
Background: #F58220 (solid, no gradient)
Color: #FFFFFF or #1A1A18
Radius: 12px (less pill, more rounded rect)
Height: 44px
Width: full-width in pricing cards
```

## Text / Ghost Button

```
Background: transparent
Color: #1A1A18
Underline on hover
```

**Used on:** "View All", footer links

## Icon Button

```
Size: 40×40px
Shape: circle
Background: transparent or white
Icon: profile avatar, language chevron
```

## Button Rules

| Rule | Detail |
|------|--------|
| One primary per viewport section | Mockups generally respect this |
| Pill shape on marketing | `radius-full` |
| Rounded rect in cards | `radius-md` for in-card CTAs |
| No ALL CAPS | Title case throughout mockups |
| Disabled | 50% opacity, no pointer |

---

# Form Styles

## Input Fields

```
Background: #FFFFFF
Border: 1px solid #F0C000 (gold) or #E5E2DC
Radius: radius-full (stadium/pill) for single-line; radius-lg for textarea
Height: 48px
Padding: 0 20px
Font: Geist Sans 14px
Placeholder: #8A8780
Focus: border #F58220, outline ring
```

## Select / Dropdown

Same as input. Chevron icon right-aligned. Filter bar uses 4 inline dropdowns in a white floating bar.

## Textarea

```
Min-height: 120px
Radius: radius-lg (not pill)
```

## Form Container

White card with `radius-xl`, 32px padding, shadow. Used for contact form, kundli form, matchmaking partner forms.

## Labels

Above field, `body-md` 600 weight, 8px gap to input.

---

# Reusable Components

## Navigation (`SiteNav`)

| Property | Spec |
|----------|------|
| Height | 64px |
| Background | Transparent on hero; white on scroll (Contact) |
| Logo | "AnantAstro" wordmark, Geist bold, left |
| Links | Services, Astrologers, Become an Astrologer, Pricing, About, Contact |
| Utilities | Language dropdown, profile avatar circle |
| Active state | Underline on current page |
| Mobile | Hamburger → full-screen or drawer (not in mockups) |

## Footer (`SiteFooter`)

| Property | Spec |
|----------|------|
| Background | Gold `#F0C000` or dark purple (varies by page) |
| Columns | Logo + social · Quick Links · Legal · Contact |
| Social icons | Black circles with white icons |
| Contact row | Phone, email, web icons + text |
| Bottom bar | Copyright left, attribution right |

## Hero (`EditorialHero`)

| Variant | Structure |
|---------|-----------|
| **Split** | Fraunces headline left + celestial illustration right (Horoscope, Astrologers) |
| **Centered** | Arched title + illustration below (Kundli, Matchmaking) |
| **Simple** | Centered headline + subtext (About, Contact) |
| **Gradient** | Fraunces title + glass info card (Pricing) |

## Section Band (`SectionBand`)

```
Full-width background (gold, purple, cream, or white)
Inner container max-w-1120 mx-auto
Vertical padding space-16 to space-24
Optional: background illustration (constellation line art at low opacity)
```

## Service Tile (`ServiceTile`)

4-column grid item: gold line icon → title → short description. No card border — icons float on section bg.

## Step Card (`StepCard`)

Orange numbered circle (1–4) → title → description. White card with shadow.

## Astrologer Card (`AstrologerCard`)

| Element | Spec |
|---------|------|
| Badge | Orange pill "Top Rated" (featured only) |
| Portrait | Arched top or circle, ~120px |
| Name | Geist 600 16px |
| Bio | body-sm, 2–3 lines |
| Tags | Pill chips, light bg |
| Rating | Star icons + number |
| Price | "10 coins/min" caption |
| CTA | Orange gradient or solid button |

## Filter Bar (`AstrologerFilterBar`)

White floating bar, 4 dropdowns (Language, Expertise, Rating, Availability), shadow, radius-lg. Sits below hero, overlapping transition to purple section.

## Zodiac Selector (`ZodiacIconRow`)

10 circular icons, dark purple bg, gold line-art zodiac symbol, label below. Horizontally scrollable on mobile.

## Horoscope Dashboard (`HoroscopeDashboard`)

Dark purple section containing:
- Daily card (expanded): Love / Career / Wellness sub-sections
- Weekly / Monthly cards (collapsed, chevron right)
- Timeline: horizontal nodes with moon phase icons

## FAQ Accordion (`FAQAccordion`)

| Variant | Spec |
|---------|------|
| **Divided** | Horizontal rules between items, +/chevron right (Pricing) |
| **Card** | Each item in white rounded card (Contact, Kundli) |
| **Two-column** | Grid 2 cols on desktop, 1 on mobile |

## Pricing Card (`PricingCard`)

```
White card, radius-xl, shadow
Title: "Starter" / "300 Coins"
Price: Fraunces large "₹100"
Feature list: gold checkmarks
CTA: solid orange button full-width
Highlight: "Most Popular" badge + gold glow border
```

## Contact Card (`ContactCard`)

White card, centered gold line icon, bold title, subtext (email, phone, hours, address).

## Statistics Bar (`StatsBar`)

Horizontal gold gradient band, 3 metrics: large bold number + label.

## CTA Banner (`CTABanner`)

Full-width gold-to-orange gradient, centered headline + pill button. "Immediate Assistance" pattern on Contact.

## Badge (`Badge`)

| Variant | Spec |
|---------|------|
| Popular | Orange bg, white text, pill |
| Top Rated | Same |
| Tag | Gray bg `#F4F3F0`, dark text, pill, 12px |

## Coin Display (`CoinPrice`)

Geist Mono or bold sans. Format: "10 coins", "10 coins/min", "₹100". Orange or dark text.

---

# Layout Patterns

## Page Shell (Marketing)

```
┌─────────────────────────────────────────────┐
│ SiteNav (transparent or white)             │
├─────────────────────────────────────────────┤
│ Hero Section (gold or split)               │
├─────────────────────────────────────────────┤
│ Content Section (white or cream)           │  ← repeats
├─────────────────────────────────────────────┤
│ Content Section (purple dark)              │  ← repeats
├─────────────────────────────────────────────┤
│ CTA Banner (gradient)                      │  ← optional
├─────────────────────────────────────────────┤
│ SiteFooter (gold or dark)                  │
└─────────────────────────────────────────────┘
```

## Astrologers Page

```
Hero (gold) + FilterBar (floating white)
→ Featured 3-col (purple bg)
→ Directory 4-col (purple bg)
→ Why Experts 4-col (purple bg)
→ Footer (gold)
```

## Service Landing (Kundli / Matchmaking)

```
Nav (gold) + Hero (dark cosmic bg with stars)
→ How it works 4-col (cream cards on dark)
→ Split: education left + form right
→ Split: what you get (gradient) + FAQ
→ Footer (gold)
```

## Horoscope Page

```
Hero (gold) + illustration
→ Zodiac icon row
→ Dashboard (purple) with cards
→ How it works + FAQ (cream)
→ CTA + Footer (gold)
```

## Pricing Page

```
Hero gradient + glass info card
→ 2×2 pricing grid (purple bg)
→ FAQ 2-col (cream)
→ Footer (gold)
```

## About Page

```
Hero (gold) + portal illustration
→ Mission (purple) + values 4-col
→ Story (gold) + illustration
→ Team 3-col (purple)
→ Why Choose (gold) + CTA
→ Footer (dark purple)
```

---

# Iconography & Illustration

| Type | Style | Usage |
|------|-------|-------|
| **Celestial line art** | Thin gold/purple strokes | Hero backgrounds, decorative |
| **UI icons** | Line icons, 24px | Contact, filters, footer |
| **Category icons** | Filled color (purple, orange) | Love, Career, Wellness |
| **Zodiac** | Gold line on purple circle | Horoscope selector |
| **Checkmarks** | Orange circle + white check | Feature lists, pricing |
| **Step numbers** | Orange circle + white number | How it works |

Illustrations are **decorative accents** — never replace functional UI. Implement as SVG assets in `/public/illustrations/`.

---

# Motion (inferred)

| Interaction | Behavior |
|-------------|----------|
| Accordion expand | 200ms ease height + chevron rotate |
| Card hover | shadow-card-hover, 150ms |
| Button hover | scale 1.02 or gradient darken, 150ms |
| Filter dropdown | Radix popover, 150ms fade |
| Page sections | Optional fade-in on scroll (low priority) |

---

# Accessibility Notes

| Issue in mockups | V1 fix |
|------------------|--------|
| Brown/black text on gold sections | Ensure 4.5:1 contrast; use dark text `#1A1A18` only on light cream, not saturated gold |
| Gold section bands | Replace with light bg per REDESIGN_DECISION |
| Placeholder-only labels | Add visible labels above inputs |
| FAQ +/chevron | Use `<button>` with `aria-expanded` |

---

# V1 Alignment with REDESIGN_DECISION.md

The stitch mockups are the **visual north star** for typography, components, and layout patterns. These elements from `REDESIGN_DECISION.md` **override** mockup backgrounds for V1:

| Mockup pattern | V1 decision |
|----------------|-------------|
| Full-width gold section backgrounds | **Remove** — gold accent only |
| Full-width purple section backgrounds | **Lighten** — use `--color-background-subtle` or white |
| Orange gradient buttons | **Optional** — solid `--color-primary` acceptable |
| Dark cosmic service pages | **Lighten** — white/cream with celestial accents |
| Gold footer | **Subtle** — white or `--color-background-subtle` footer |

Typography (Fraunces + Geist), card shapes, component patterns, and grid layouts from this document **carry forward** unchanged.

---

*Extracted from 7 stitch mockups. Do not use raw hex in components — map to semantic tokens at implementation time.*
