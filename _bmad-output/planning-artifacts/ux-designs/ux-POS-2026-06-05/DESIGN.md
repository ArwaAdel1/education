---
title: Teacher AI Academy — Design
status: draft
created: 2026-06-05
updated: 2026-06-05
sources:
  - prd.md
  - architecture.md
tokens:
  colors:
    primary: "#1A103D"
    secondary: "#37306B"
    accent: "#00C9DB"
    success: "#7C3AED"
    danger: "#EF4444"
    warning: "#F59E0B"
    background: "#F4F3FB"
    surface: "#FFFFFF"
    textPrimary: "#1A103D"
    textSecondary: "#6B7280"
    textOnPrimary: "#FFFFFF"
    textOnAccent: "#1A103D"
  typography:
    fontFamily: "'Cairo', sans-serif"
    weights:
      regular: 400
      medium: 500
      semibold: 600
      bold: 700
      extrabold: 800
    sizes:
      h1: "28px"
      h2: "22px"
      h3: "18px"
      body: "14px"
      small: "12px"
      caption: "11px"
  rounded:
    sm: "6px"
    md: "10px"
    lg: "14px"
    xl: "20px"
    full: "9999px"
  spacing:
    xs: "4px"
    sm: "8px"
    md: "16px"
    lg: "24px"
    xl: "32px"
    xxl: "48px"
  components:
    button:
      borderRadius: "12px"
      paddingY: "10px"
      paddingX: "28px"
      fontWeight: 600
    card:
      borderRadius: "14px"
      padding: "16px"
      shadow: "0 2px 12px rgba(0,0,0,0.06)"
    input:
      borderRadius: "10px"
      height: "48px"
      borderColor: "#D1D5DB"
      focusBorderColor: "#00C9DB"
    badge:
      borderRadius: "20px"
      paddingX: "12px"
      paddingY: "3px"
      fontSize: "11px"
      fontWeight: 600
---

# Teacher AI Academy — DESIGN.md

## Brand & Style

**Personality:** Modern, confident, distinctive. Academic but not traditional — stands out from the sea of blue edtech platforms with a bold purple identity and vibrant cyan accents.

**Target feel:** Trustworthy and focused, but not boring or corporate. A 16-year-old student should feel like this platform is *for them* — modern, clean, and serious about helping them succeed.

**Tone:** Warm and supportive in student-facing copy. Professional and efficient in teacher-facing copy. Arabic-first with English as a seamless toggle.

---

## Colors

### Token Reference

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#1A103D` | Primary backgrounds, headers, nav bars, primary text |
| `secondary` | `#37306B` | Secondary surfaces, hover states, sub-headers |
| `accent` | `#00C9DB` | CTAs, links, active states, progress fills |
| `success` | `#7C3AED` | Success badges, completed states, unlocked indicators |
| `danger` | `#EF4444` | Errors, important warnings, delete actions |
| `warning` | `#F59E0B` | Warnings, pending states, in-progress indicators |
| `background` | `#F4F3FB` | Page backgrounds, section dividers |
| `surface` | `#FFFFFF` | Cards, modals, content areas |
| `textPrimary` | `#1A103D` | Body text, headings |
| `textSecondary` | `#6B7280` | Secondary text, captions, placeholders |
| `textOnPrimary` | `#FFFFFF` | Text on primary-colored backgrounds |
| `textOnAccent` | `#1A103D` | Text on accent-colored backgrounds |

### Color Application Rules

- **Primary purple** is the dominant color — used for the main nav bar, primary buttons (ghost variant), and key headers
- **Cyan accent** is the energy color — used for the primary CTA button, links, progress bars, and interactive elements
- **Purple gradient** (`#7C3AED`) is used for success states, premium badges, and unlocked content indicators
- **Background** is a very light purple-gray (`#F4F3FB`) — softer than pure white, gives the platform a distinctive feel
- **Surfaces** (cards, modals) are pure white for contrast and readability

---

## Typography

- **Font:** Cairo (Google Fonts) — excellent Arabic legibility, modern geometric style
- **Fallback:** `sans-serif`

### Type Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| H1 | 28px | Extra Bold (800) | Page titles, landing hero |
| H2 | 22px | Bold (700) | Section headers |
| H3 | 18px | Semi Bold (600) | Card titles, dialog headers |
| Body | 14px | Regular (400) | Primary reading text |
| Small | 12px | Medium (500) | Metadata, timestamps |
| Caption | 11px | Regular (400) | Badges, legal text |

### Typography Rules

- Headings use `semibold` or heavier weights for impact
- Body text uses `regular` (400) weight for readability
- Links and interactive text use the accent cyan color
- Line height: 1.6 for body text, 1.3 for headings
- RTL (Arabic) is the default; LTR (English) is toggled at the page level

---

## Layout & Spacing

- **Mobile-first** for student-facing screens (single column, full-width)
- **Desktop-first** for teacher-facing screens (sidebar + main panel)
- **Breakpoints:**
  - Mobile: 0–480px
  - Tablet: 481–768px
  - Desktop: 769px+
- **Max content width:** 480px (mobile), 720px (tablet), 1200px (desktop)
- **Cards** use 16px padding with 14px border radius
- **Section spacing:** 32px vertical between key sections

---

## Elevation & Depth

| Level | Shadow | Usage |
|---|---|---|
| 0 | None | Page background |
| 1 | `0 1px 3px rgba(0,0,0,0.06)` | Cards on light background |
| 2 | `0 4px 12px rgba(0,0,0,0.08)` | Elevated cards, dropdowns |
| 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals, dialogs |

---

## Shapes

- **Buttons:** 12px border radius
- **Cards:** 14px border radius
- **Input fields:** 10px border radius
- **Badges / Chips:** 20px border radius (pill shape)
- **Avatars:** Full round (circular)
- **Modals:** 20px border radius (top), or 14px (all corners)

---

## Components

### Primary Button
- Background: `accent` (#00C9DB)
- Text color: `textOnAccent` (#1A103D)
- Border radius: 12px
- Padding: 10px 28px
- Font weight: 600 (Semi Bold)
- Hover: 5% darker (programmatic)

### Secondary Button (Outline)
- Background: transparent
- Border: 2px solid `primary` (#1A103D)
- Text color: `primary` (#1A103D)
- Border radius: 12px

### Ghost Button
- Background: `primary` (#1A103D)
- Text color: `textOnPrimary` (#FFFFFF)
- Border radius: 12px

### Card
- Background: `surface` (#FFFFFF)
- Border radius: 14px
- Padding: 16px
- Shadow: Level 1

### Input Field
- Border radius: 10px
- Height: 48px
- Border: 1.5px solid `#D1D5DB`
- Focus: 2px solid `accent` (#00C9DB)
- Padding: 0 16px

### Badge
- Border radius: 20px (pill)
- Padding: 3px 12px
- Font size: 11px
- Font weight: 600

### Progress Bar
- Height: 6px
- Border radius: 3px
- Background: `#E0E0E0`
- Fill color: `accent` (#00C9DB) or `success` (#7C3AED)

### Tab Bar
- Active tab: underline or filled pill in `primary` (#1A103D)
- Inactive tab: `textSecondary` (#6B7280)
- Smooth transition on switch

---

## Do's and Don'ts

- **Do** use the purple + cyan palette consistently — it's the brand's differentiator
- **Do** keep surfaces clean with plenty of white space
- **Do** use Cairo at heavier weights for Arabic headings (the font carries visual weight beautifully in bold)
- **Don't** use pure black for text — always use `textPrimary` (#1A103D) or `textSecondary` (#6B7280)
- **Don't** overuse the accent cyan — it's for primary CTAs and interactive elements only, not decorative
- **Don't** mix the purple gradient with the primary purple on the same surface (choose one depth)
