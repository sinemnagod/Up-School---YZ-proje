# GlowLogic Design System v2.0

> **This is a full replacement of v1.0.**
> The single source of truth for all visual and UI decisions across the GlowLogic web app.
> Apply these tokens, components, and rules consistently across every page — user and admin.

---

## CURSOR INSTRUCTIONS

This file replaces the previous design system entirely. When applying this to the codebase:

1. Open `client/src/index.css` — replace the entire `:root {}` block with the one in Section 12.
2. Open `client/tailwind.config.ts` — replace the entire `colors.gl` object and `fontFamily` block with the one in Section 13.
3. Find every reference to the old color tokens listed below and replace them:

| Old token | Old hex | New token | New hex |
|-----------|---------|-----------|---------|
| `--gl-forest` | `#5B7E3C` | `--gl-moss` | `#8A9860` |
| `--gl-sage` | `#A2CB8B` | `--gl-pollen` | `#C8A844` |
| `--gl-mist` | `#E8F5BD` | `--gl-softbloom` | `#ECC8D0` |
| `--gl-danger` | `#C44545` | `--gl-danger` | `#C85840` |
| `--gl-ink` | `#1A2414` | `--gl-ink` | `#3C1828` |
| `--gl-stone` | `#6B7A62` | `--gl-stone` | `#8A6570` |
| `--gl-pebble` | `#C8D4BC` | `--gl-pebble` | `#DCC0C8` |
| `--gl-snow` | `#F7FAF2` | `--gl-parchment` | `#F0E4D0` |
| `--gl-danger-light` | `#F9ECEC` | `--gl-danger-light` | `#FAEDEA` |
| `--gl-danger-mid` | `#E89090` | `--gl-danger-mid` | `#E4A090` |

4. Apply color rules per component as described in each section below.
5. Do not invent new color values. Every color used in the app must come from the palette defined in Section 2.

---

## Table of Contents

1. [Fonts](#1-fonts)
2. [Color Palette](#2-color-palette)
3. [Spacing Scale](#3-spacing-scale)
4. [Typography Scale](#4-typography-scale)
5. [Border Radius](#5-border-radius)
6. [Buttons](#6-buttons)
7. [Form Inputs](#7-form-inputs)
8. [Badges & Pills](#8-badges--pills)
9. [Cards](#9-cards)
10. [Navigation & Footer](#10-navigation--footer)
11. [GlowLogic-Specific Components](#11-glowlogic-specific-components)
12. [CSS Variables (Root)](#12-css-variables-root)
13. [Tailwind Config](#13-tailwind-config)
14. [Global CSS Setup](#14-global-css-setup)

---

## 1. Fonts

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | Cormorant Garamond | 300, 400, 600 | Hero text, page titles, product names, streak numbers, logo |
| Body / UI | DM Sans | 300, 400, 500 | All interface text, labels, buttons, inputs, captions |

### Import (add to `client/index.html` inside `<head>`)

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### Font Stack Variables

```css
--ff-display: 'Cormorant Garamond', serif;
--ff-body:    'DM Sans', sans-serif;
```

### Design Intent

Cormorant Garamond brings the editorial, botanical quality of the painting into the interface — soft, organic, refined. DM Sans keeps all UI text clean and highly readable. The tension between the two fonts is the personality of the brand.

---

## 2. Color Palette

> Palette derived from a botanical painting. Every color name refers to something visible in that painting.

### Core Brand Palette

| Name | Hex | CSS Variable | Role |
|------|-----|-------------|------|
| Nightbloom | `#3C1828` | `--gl-nightbloom` | Footer background. App logo. Streak card background. Darkest text anchor. |
| Plum Rose | `#7A3548` | `--gl-plum` | Header / top-bar background. Primary dark surface. |
| Wild Rose | `#A85068` | `--gl-wildrose` | Active nav item indicator. Hover state on links. Progress bar fill. Section accent borders. |
| Dusty Petal | `#CC8898` | `--gl-dustypetal` | All dividers, card borders, input borders, horizontal rules. |
| Blush | `#E0AABA` | `--gl-blush` | Streak card accent text. Light tint on interactive states. Badge borders. |
| Soft Bloom | `#ECC8D0` | `--gl-softbloom` | Card and surface background. Replaces white on most cards. |
| Petal Mist | `#F5E8E4` | `--gl-petalmist` | Lightest surface. Input background. Admin table row alt bg. |
| Parchment | `#F0E4D0` | `--gl-parchment` | Page background. The warm cream of the painting's base. |

### Button Accent Colors

| Name | Hex | CSS Variable | Role |
|------|-----|-------------|------|
| Moss | `#8A9860` | `--gl-moss` | Primary button — Save, Check In, Publish, Confirm. Also: safe/ok ingredient badge, success states. |
| Pollen | `#C8A844` | `--gl-pollen` | Secondary button — Add Product, Explore, Filter. Also: warning states, overload badge. |
| Lavender Mist | `#B8A8C4` | `--gl-lavender` | Ghost / cancel button. Neutral tags. Inactive step indicators. |
| Coral Flame | `#C85840` | `--gl-danger` | Danger only — trigger ingredient hits, HIGH IRRITATION alerts, form errors, destructive actions. Never decorative. |

### Extended / Derived Tokens

| Name | Hex | CSS Variable | Role |
|------|-----|-------------|------|
| Ink | `#3C1828` | `--gl-ink` | Primary text color on light backgrounds. Same as Nightbloom. |
| Stone | `#8A6570` | `--gl-stone` | Secondary / muted text. Captions, placeholders, timestamps. |
| Pebble | `#DCC0C8` | `--gl-pebble` | Default border color. Dividers. Track backgrounds. Lighter than Dusty Petal. |
| White | `#FFFFFF` | `--gl-white` | Pure white — used only inside admin forms and data tables where density requires maximum contrast. |
| Danger Light | `#FAEDEA` | `--gl-danger-light` | Background fill for danger alerts and input error states. |
| Danger Mid | `#E4A090` | `--gl-danger-mid` | Border for danger alert cards. |

### Semantic Status Colors

| State | Background | Border | Text | Notes |
|-------|-----------|--------|------|-------|
| Success | `#E2EDD6` | `#8A9860` (Moss) | `#3D5030` | Derived from Moss |
| Warning | `#F5EDD4` | `#C8A844` (Pollen) | `#6B540A` | Derived from Pollen |
| Danger | `#FAEDEA` | `#C85840` (Coral Flame) | `#8A2810` | Derived from Coral Flame |
| Info | `#EDE0EC` | `#B8A8C4` (Lavender) | `#5A4868` | Derived from Lavender |

### Color Rules (enforce these throughout the codebase)

- **Parchment** is the only page background color. Never use white as a page background.
- **Soft Bloom** is the standard card surface. Use Petal Mist for nested surfaces inside cards (e.g. input fields inside a card).
- **Nightbloom** anchors the footer and the streak card. Use it for the logo in all contexts.
- **Plum Rose** is the header. Do not use it inside the content area.
- **Wild Rose** is always in motion — hover states, active indicators, progress fills. Never use it as a static background.
- **Dusty Petal** is for all lines — borders, dividers, input borders, table rules. No gray borders anywhere.
- **Coral Flame** means something is wrong. Never use it decoratively.
- **Moss** means confirm or safe. Buttons, success badges, ok ingredient states.
- **Pollen** means secondary action or caution. Buttons, warning badges.
- **Lavender Mist** means neutral or inactive. Ghost buttons, cancel, neutral tags.
- Text on Nightbloom/Plum Rose backgrounds: use Petal Mist (`#F5E8E4`), not white.
- Text on Soft Bloom/Blush backgrounds: use Ink (`#3C1828`), not black.
- Text on Moss backgrounds: use `#FFFFFF` (white) for sufficient contrast.
- Text on Pollen backgrounds: use Nightbloom (`#3C1828`) for sufficient contrast.
- Text on Lavender Mist backgrounds: use Nightbloom (`#3C1828`).

---

## 3. Spacing Scale

All spacing is based on a 4px base unit. No changes from v1.0.

| Token | Value | Tailwind | Usage |
|-------|-------|---------|-------|
| `space-1` | 4px | `p-1` / `m-1` | Micro gaps, icon padding |
| `space-2` | 8px | `p-2` / `m-2` | Internal component padding (pill, badge) |
| `space-3` | 12px | `p-3` / `m-3` | Component internal gaps |
| `space-4` | 16px | `p-4` / `m-4` | Standard card padding |
| `space-6` | 24px | `p-6` / `m-6` | Between form fields, between sections |
| `space-8` | 32px | `p-8` / `m-8` | Section vertical rhythm |
| `space-12` | 48px | `p-12` / `m-12` | Large section gaps |
| `space-16` | 64px | `p-16` / `m-16` | Page-level vertical breathing room |
| `space-20` | 80px | `p-20` / `m-20` | Hero section padding |

---

## 4. Typography Scale

No changes from v1.0 except color references updated to new tokens.

### Display (Cormorant Garamond)

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display XL | 48px | 300 | 1.1 | Hero headlines, empty state titles |
| Display LG | 32px | 400 | 1.2 | Page titles |
| Display MD | 22px | 400 | 1.3 | Section headings |
| Display SM | 18px | 400 | 1.3 | Product card names, modal titles |

### UI (DM Sans)

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Heading | 16px | 500 | 1.4 | Card headings, alert titles |
| Body | 14px | 400 | 1.6 | Main body copy, descriptions |
| Caption | 12px | 400 | 1.5 | Secondary info, timestamps, counts |
| Overline | 10px | 500 | 1 | Section labels (ALL CAPS, letter-spacing: 0.1em) |

### CSS Classes (add to `global.css`)

```css
.t-display-xl {
  font-family: var(--ff-display);
  font-size: 48px;
  font-weight: 300;
  line-height: 1.1;
  color: var(--gl-ink);
  letter-spacing: -0.01em;
}
.t-display-lg {
  font-family: var(--ff-display);
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--gl-ink);
}
.t-display-md {
  font-family: var(--ff-display);
  font-size: 22px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--gl-ink);
}
.t-heading {
  font-family: var(--ff-body);
  font-size: 16px;
  font-weight: 500;
  color: var(--gl-ink);
}
.t-body {
  font-family: var(--ff-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--gl-ink);
  line-height: 1.6;
}
.t-caption {
  font-family: var(--ff-body);
  font-size: 12px;
  font-weight: 400;
  color: var(--gl-stone);
}
.t-overline {
  font-family: var(--ff-body);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gl-stone);
}
```

---

## 5. Border Radius

No changes from v1.0.

| Name | Value | Usage |
|------|-------|-------|
| `radius-sm` | 6px | Small buttons, small badges |
| `radius-md` | 8px | Inputs, standard buttons, sidebar items |
| `radius-lg` | 10px | Conflict alert cards |
| `radius-xl` | 14px | Cards, product cards, nav bars, streak card |
| `radius-pill` | 20px | Pills, compatibility badges, ingredient badges |
| `radius-full` | 9999px | Avatars, toggle thumbs |

---

## 6. Buttons

### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `#8A9860` (Moss) | `#FFFFFF` | None | Save Routine, Check In, Publish, Confirm — anything that completes an action |
| Secondary | `#C8A844` (Pollen) | `#3C1828` (Nightbloom) | None | Add Product, Explore, Filter — initiating or discovering |
| Ghost | `#B8A8C4` (Lavender) | `#3C1828` (Nightbloom) | None | Cancel, Dismiss, Go Back — neutral low-priority |
| Outline | Transparent | `#7A3548` (Plum Rose) | 1px `#7A3548` | View Details, Learn More — secondary in context of a Primary |
| Danger | `#C85840` (Coral Flame) | `#FFFFFF` | None | Remove, Delete, Override — destructive only |

### Sizes

| Size | Padding | Font Size | Border Radius |
|------|---------|-----------|---------------|
| Default | 10px 20px | 13px | 8px |
| Small | 6px 14px | 12px | 6px |

### CSS

```css
.btn {
  font-family: var(--ff-body);
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 20px;
  letter-spacing: 0.01em;
  transition: opacity 0.15s, transform 0.1s;
}
.btn:hover  { opacity: 0.88; }
.btn:active { transform: scale(0.98); }

.btn-primary  { background: var(--gl-moss);     color: #fff; }
.btn-secondary{ background: var(--gl-pollen);   color: var(--gl-nightbloom); }
.btn-ghost    { background: var(--gl-lavender);  color: var(--gl-nightbloom); }
.btn-outline  { background: transparent; color: var(--gl-plum); border: 1px solid var(--gl-plum); }
.btn-danger   { background: var(--gl-danger);   color: #fff; }
.btn-sm       { padding: 6px 14px; font-size: 12px; border-radius: 6px; }
```

### Tailwind Examples

```tsx
// Primary — save / confirm
<button className="bg-gl-moss text-white text-[13px] font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all">
  Save Routine
</button>

// Secondary — add / explore
<button className="bg-gl-pollen text-gl-nightbloom text-[13px] font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all">
  Add Product
</button>

// Ghost — cancel / dismiss
<button className="bg-gl-lavender text-gl-nightbloom text-[13px] font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all">
  Cancel
</button>

// Danger — destructive
<button className="bg-gl-danger text-white text-[13px] font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all">
  Remove
</button>
```

---

## 7. Form Inputs

### Text Input

```css
.field-input {
  font-family: var(--ff-body);
  font-size: 13px;
  padding: 9px 12px;
  border: 1px solid var(--gl-pebble);
  border-radius: 8px;
  background: var(--gl-petalmist);
  color: var(--gl-ink);
  outline: none;
  width: 100%;
  transition: border-color 0.15s;
}
.field-input:focus       { border-color: var(--gl-wildrose); }
.field-input::placeholder{ color: var(--gl-stone); }
```

### States

| State | Border | Background | Notes |
|-------|--------|-----------|-------|
| Default | `--gl-pebble` (`#DCC0C8`) | `--gl-petalmist` | |
| Focus | `--gl-wildrose` (`#A85068`) | `--gl-petalmist` | |
| Error | `--gl-danger` (`#C85840`) | `--gl-danger-light` | Show error message below |
| Disabled | `--gl-pebble` | `--gl-softbloom` | Reduce opacity to 0.6 |

### Toggle

```css
.toggle-track          { background: var(--gl-moss); }      /* ON */
.toggle-track.off      { background: var(--gl-pebble); }    /* OFF */
.toggle-thumb          { background: var(--gl-petalmist); } /* thumb color */
```

---

## 8. Badges & Pills

### Category / General Pills

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `#7A3548` (Plum Rose) | `#F5E8E4` (Petal Mist) | None | Active category, selected filter |
| Light | `#ECC8D0` (Soft Bloom) | `#7A3548` (Plum Rose) | 0.5px `#CC8898` | Default category pill, skin type |
| Neutral | `#F0E4D0` (Parchment) | `#8A6570` (Stone) | 0.5px `#DCC0C8` | Unselected / inactive tags |
| Danger | `#FAEDEA` | `#C85840` (Coral Flame) | 0.5px `#E4A090` | Error tag, trigger flag label |
| Warning | `#F5EDD4` | `#6B540A` | 0.5px `#C8A844` | Caution tag, overload |
| Info | `#EDE0EC` | `#5A4868` | 0.5px `#B8A8C4` | Neutral informational |

```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}
.pill-primary { background: var(--gl-plum);      color: var(--gl-petalmist); }
.pill-light   { background: var(--gl-softbloom); color: var(--gl-plum); border: 0.5px solid var(--gl-dustypetal); }
.pill-neutral { background: var(--gl-parchment); color: var(--gl-stone); border: 0.5px solid var(--gl-pebble); }
.pill-danger  { background: var(--gl-danger-light); color: var(--gl-danger); border: 0.5px solid var(--gl-danger-mid); }
.pill-warning { background: #F5EDD4; color: #6B540A; border: 0.5px solid var(--gl-pollen); }
.pill-info    { background: #EDE0EC; color: #5A4868; border: 0.5px solid var(--gl-lavender); }
```

### Compatibility Score Badge

Shown on every product card and product detail page header. Three tiers:

| Score | Background | Text | Border | Label |
|-------|-----------|------|--------|-------|
| 80–100 | `#E2EDD6` | `#3D5030` | 0.5px `#8A9860` (Moss) | Great match |
| 50–79 | `#F5EDD4` | `#6B540A` | 0.5px `#C8A844` (Pollen) | Use with caution |
| 0–49 | `#FAEDEA` | `#8A2810` | 0.5px `#E4A090` | Poor match |

### Ingredient Badges

Shown on product detail page in INCI list order. Four states:

| State | Background | Text | Extra | Condition |
|-------|-----------|------|-------|-----------|
| OK | `#ECC8D0` (Soft Bloom) | `#7A3548` (Plum Rose) | — | No flags |
| Trigger | `#FAEDEA` | `#8A2810` | `text-decoration: line-through` | In user's blacklist |
| Irritant | `#F5EDD4` | `#6B540A` | — | `irritation_potential = HIGH` |
| Comedogenic | `#EDE0EC` | `#5A4868` | — | `comedogenic_rating >= 3` |

```css
.ing-badge           { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 5px; font-size: 12px; font-weight: 400; }
.ing-ok              { background: var(--gl-softbloom); color: var(--gl-plum); }
.ing-trigger         { background: var(--gl-danger-light); color: #8A2810; text-decoration: line-through; }
.ing-irritant        { background: #F5EDD4; color: #6B540A; }
.ing-comedogenic     { background: #EDE0EC; color: #5A4868; }
```

---

## 9. Cards

### Base Card

```css
.card {
  background: var(--gl-softbloom);
  border: 0.5px solid var(--gl-dustypetal);
  border-radius: 14px;
  padding: 1.25rem;
}
```

### Product Card

Structure:
1. Image area — 120px tall, Soft Bloom → Blush toned background
2. Brand name — Overline style, Stone color
3. Product name — Display SM (Cormorant Garamond 18px), Ink color
4. Category pill — Light pill variant
5. Footer row — Compatibility badge + ingredient count in Caption style

### Streak Card

Background: Nightbloom (`#3C1828`). The darkest color in the palette.

| Element | Color |
|---------|-------|
| Background | `--gl-nightbloom` (`#3C1828`) |
| Slot label (overline) | `--gl-blush` (`#E0AABA`) |
| Streak number | `--gl-petalmist` (`#F5E8E4`) |
| "days in a row" caption | `--gl-dustypetal` (`#CC8898`) |
| Progress bar track | White at 15% opacity |
| Progress bar fill | `--gl-wildrose` (`#A85068`) |
| Milestone labels | `--gl-blush` (`#E0AABA`) |
| Check-in button | Moss (`#8A9860`) background, white text |

### Admin Stat Card

Background: Petal Mist (`#F5E8E4`). No border.

| Element | Color |
|---------|-------|
| Background | `--gl-petalmist` |
| Label | `--gl-stone` |
| Number | `--gl-plum` (`#7A3548`) for standard stats |
| Number (danger stat) | `--gl-danger` (`#C85840`) with `--gl-danger-light` background |

Use in 2×2 grid in the admin overview panel.

### Conflict Alert Card

Left border accent (3px), no border on other sides.

| Type | Background | Left Border | Title Color | Body Color |
|------|-----------|-------------|-------------|-----------|
| DANGER | `#FAEDEA` | `#C85840` (Coral Flame) | `#8A2810` | `#A04030` |
| WARNING | `#F5EDD4` | `#C8A844` (Pollen) | `#6B540A` | `#7A5A10` |

Structure:
1. Alert title (Heading — 13px / 500)
2. Explanation text (Body — 12px)
3. Action buttons — Dismiss (Ghost) + Override if `safe_to_override = true` (Outline Danger)

---

## 10. Navigation & Footer

### Top Bar (User App)

| Element | Value |
|---------|-------|
| Background | `--gl-plum` (`#7A3548`) |
| Height | 52px |
| Logo | Cormorant Garamond 22px / weight 400 / `--gl-petalmist` color |
| Nav items (default) | DM Sans 13px / `--gl-blush` (`#E0AABA`) |
| Nav item (active) | `--gl-petalmist` color + 2px bottom border in `--gl-wildrose` |
| Avatar circle | 30px / `--gl-softbloom` background / `--gl-dustypetal` border / `--gl-plum` initials |

### Admin Sidebar

| Element | Value |
|---------|-------|
| Background | `--gl-softbloom` (`#ECC8D0`) |
| Border | 0.5px `--gl-dustypetal`, border-radius 14px |
| Logo | Cormorant Garamond 20px / weight 400 / `--gl-nightbloom` |
| Item default | `--gl-stone` text / `--gl-pebble` icon |
| Item active | `--gl-petalmist` background / `--gl-plum` text / `--gl-wildrose` icon |
| Item hover | `--gl-petalmist` background |

### Footer

| Element | Value |
|---------|-------|
| Background | `--gl-nightbloom` (`#3C1828`) |
| Logo | Cormorant Garamond / `--gl-petalmist` color |
| Body text | `--gl-blush` (`#E0AABA`) |
| Links | `--gl-dustypetal` (`#CC8898`), hover: `--gl-petalmist` |
| Divider lines | `--gl-plum` (`#7A3548`) at 0.5px — dark enough to read on Nightbloom |
| Copyright line | `--gl-stone` (`#8A6570`) |

---

## 11. GlowLogic-Specific Components

### IngredientBadge

Used on the product detail page in INCI list order. Refer to the four badge states in Section 8. On hover, show a tooltip with:
- INCI name + common name
- Function tags (pill-neutral style)
- Comedogenic rating (0–5)
- Irritation potential

Badge state priority: Trigger > Irritant > Comedogenic > OK. If an ingredient is both a trigger and high-irritation, show Trigger state.

### ConflictAlert

Rendered after `PUT /routine` or on `GET /routine/conflicts`. DANGER alerts render above WARNING alerts. Always dismissible via Ghost button. If `safe_to_override = false`, render only "Understood" — no override button.

### CompatibilityBadge

Calculated client-side via `compatibilityScore.ts`. Three tiers as defined in Section 8. Displayed on:
- Product grid cards (compact — score number only)
- Product detail page header (full label version)
- Routine slot cards (compact, next to product name)

### StreakCard

Background: Nightbloom. One card per slot (AM / PM). Progress bar fill uses Wild Rose. Check-in button uses Moss (Primary).

Progress bar fill percentage:
```
fill % = (currentStreak / nextMilestone) * 100
```
Next milestone = smallest value in `[3, 7, 15, 30, 50, 75, 100]` greater than `currentStreak`.

### CheckInButton

| State | Style | Label |
|-------|-------|-------|
| Default | Primary (Moss) | "Check In AM" |
| Done today | Ghost (Lavender), disabled | "Done for today" |
| Loading | Disabled, show spinner | — |

### OverloadWarning

Warning banner below both routine columns. Uses Warning semantic colors (Pollen-tinted, not Coral Flame). Renders only when `detectOverload()` returns 1+ results.

---

## 12. CSS Variables (Root)

Replace the entire `:root {}` block in `client/src/index.css` with this:

```css
:root {
  /* ── Core brand ── */
  --gl-nightbloom:  #3C1828;
  --gl-plum:        #7A3548;
  --gl-wildrose:    #A85068;
  --gl-dustypetal:  #CC8898;
  --gl-blush:       #E0AABA;
  --gl-softbloom:   #ECC8D0;
  --gl-petalmist:   #F5E8E4;
  --gl-parchment:   #F0E4D0;

  /* ── Button accents ── */
  --gl-moss:        #8A9860;
  --gl-pollen:      #C8A844;
  --gl-lavender:    #B8A8C4;
  --gl-danger:      #C85840;

  /* ── Extended / derived ── */
  --gl-ink:         #3C1828;
  --gl-stone:       #8A6570;
  --gl-pebble:      #DCC0C8;
  --gl-white:       #FFFFFF;
  --gl-danger-light:#FAEDEA;
  --gl-danger-mid:  #E4A090;

  /* ── Typography ── */
  --ff-display: 'Cormorant Garamond', serif;
  --ff-body:    'DM Sans', sans-serif;

  /* ── Border radius ── */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   10px;
  --radius-xl:   14px;
  --radius-pill: 20px;
  --radius-full: 9999px;

  /* ── Spacing ── */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

---

## 13. Tailwind Config

Replace the full `client/tailwind.config.ts` with this:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gl: {
          /* Core brand */
          nightbloom:  '#3C1828',
          plum:        '#7A3548',
          wildrose:    '#A85068',
          dustypetal:  '#CC8898',
          blush:       '#E0AABA',
          softbloom:   '#ECC8D0',
          petalmist:   '#F5E8E4',
          parchment:   '#F0E4D0',
          /* Button accents */
          moss:        '#8A9860',
          pollen:      '#C8A844',
          lavender:    '#B8A8C4',
          danger:      '#C85840',
          /* Extended */
          ink:         '#3C1828',
          stone:       '#8A6570',
          pebble:      '#DCC0C8',
          white:       '#FFFFFF',
          'danger-light': '#FAEDEA',
          'danger-mid':   '#E4A090',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '1.1', fontWeight: '300' }],
        'display-lg': ['32px', { lineHeight: '1.2', fontWeight: '400' }],
        'display-md': ['22px', { lineHeight: '1.3', fontWeight: '400' }],
        'display-sm': ['18px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      borderRadius: {
        sm:   '6px',
        md:   '8px',
        lg:   '10px',
        xl:   '14px',
        pill: '20px',
      },
    },
  },
  plugins: [],
}

export default config
```

### Tailwind Usage Examples

```tsx
/* Page background */
<main className="bg-gl-parchment min-h-screen" />

/* Header */
<header className="bg-gl-plum h-[52px]" />

/* Footer */
<footer className="bg-gl-nightbloom" />

/* Standard card */
<div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-5" />

/* Streak card */
<div className="bg-gl-nightbloom rounded-xl p-5" />

/* Logo (all contexts) */
<span className="font-display text-[22px] font-light text-gl-petalmist" />

/* Primary button */
<button className="bg-gl-moss text-white font-medium text-[13px] px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all" />

/* Secondary button */
<button className="bg-gl-pollen text-gl-nightbloom font-medium text-[13px] px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all" />

/* Ghost button */
<button className="bg-gl-lavender text-gl-nightbloom font-medium text-[13px] px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all" />

/* Active nav item */
<span className="text-gl-petalmist border-b-2 border-gl-wildrose" />

/* Ingredient badge — ok */
<span className="bg-gl-softbloom text-gl-plum text-[12px] px-2.5 py-0.5 rounded" />

/* Ingredient badge — trigger */
<span className="bg-gl-danger-light text-[#8A2810] text-[12px] px-2.5 py-0.5 rounded line-through" />
```

---

## 14. Global CSS Setup

Replace `client/src/index.css` entirely with this:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --gl-nightbloom:  #3C1828;
  --gl-plum:        #7A3548;
  --gl-wildrose:    #A85068;
  --gl-dustypetal:  #CC8898;
  --gl-blush:       #E0AABA;
  --gl-softbloom:   #ECC8D0;
  --gl-petalmist:   #F5E8E4;
  --gl-parchment:   #F0E4D0;
  --gl-moss:        #8A9860;
  --gl-pollen:      #C8A844;
  --gl-lavender:    #B8A8C4;
  --gl-danger:      #C85840;
  --gl-ink:         #3C1828;
  --gl-stone:       #8A6570;
  --gl-pebble:      #DCC0C8;
  --gl-white:       #FFFFFF;
  --gl-danger-light:#FAEDEA;
  --gl-danger-mid:  #E4A090;
  --ff-display: 'Cormorant Garamond', serif;
  --ff-body:    'DM Sans', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--ff-body);
  background-color: var(--gl-parchment);
  color: var(--gl-ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar */
::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: var(--gl-parchment); }
::-webkit-scrollbar-thumb { background: var(--gl-dustypetal); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--gl-wildrose); }

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--gl-wildrose);
  outline-offset: 2px;
}
```

---

*GlowLogic Design System v2.0 — Bloom Palette — Internal Reference*
