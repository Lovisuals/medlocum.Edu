# DESIGN.md — MedLocum Jobs E-Learning Design System

**Version:** 1.0.0
**Source:** Engineered from https://medlocumjobs.com/register (live capture, 2026-04-29)
**Authority:** This document governs all UI decisions for the Medical Locum Jobs E-Learning LMS platform. It is used alongside LMS_SKILL_UNIVERSAL.md. Any conflict between this file and LMS_SKILL_UNIVERSAL.md on visual matters: this file wins.

---

## 1. BRAND IDENTITY

**Platform Name:** MedLocum Academy
**Parent Brand:** MedLocum Jobs (medlocumjobs.com)
**Sector:** UK Healthcare Locum Workforce Training & Compliance
**Design Language:** Modern Health-Tech · High-Trust · Airy · Professional

**Positioning Statement:**
MedLocum Academy is the training and compliance backbone for healthcare professionals sourced through MedLocum Jobs. The LMS must feel like a natural extension of the MedLocum Jobs recruitment platform — sharing its visual confidence, clinical professionalism, and ease of use.

---

## 2. COLOUR SYSTEM

These are the exact production colour tokens derived from the MedLocum Jobs official site. Use these in every component, every page, every email template — without exception.

### 2.1 Primary Palette

| Token                  | Hex       | Usage                                              |
|------------------------|-----------|----------------------------------------------------|
| `--color-primary`      | `#2362EB` | Primary buttons, active nav, links, action icons   |
| `--color-primary-hover`| `#1E54D1` | Hover state for all primary buttons and links      |
| `--color-primary-light`| `#EFF6FF` | Hero backgrounds, active tab tints, card accents   |
| `--color-accent-green` | `#34D399` | Brand logo arc, success states, completion badges  |
| `--color-accent-gold`  | `#FBBF24` | Rating stars, achievement badges, alert highlights |

### 2.2 Neutral / Surface Palette

| Token                    | Hex       | Usage                                               |
|--------------------------|-----------|-----------------------------------------------------|
| `--color-background`     | `#FFFFFF` | Page background, card surfaces, input fields        |
| `--color-surface-subtle` | `#F9FAFB` | Sidebar background, alternate row tint              |
| `--color-border`         | `#D1D5DB` | Input borders, card dividers, secondary outlines    |
| `--color-border-focus`   | `#2362EB` | Focus ring on all interactive inputs                |

### 2.3 Typography Colour Palette

| Token                 | Hex       | Usage                                               |
|-----------------------|-----------|-----------------------------------------------------|
| `--color-text-heading`| `#111827` | H1, H2, H3, modal titles                           |
| `--color-text-body`   | `#374151` | Body copy, labels, form text                        |
| `--color-text-muted`  | `#6B7280` | Placeholder, captions, metadata, footer links       |
| `--color-text-inverse`| `#FFFFFF` | Text on primary-coloured surfaces                   |

### 2.4 Semantic Colour Palette (Status & Feedback)

| Token                   | Hex       | Usage                                              |
|-------------------------|-----------|----------------------------------------------------|
| `--color-success`       | `#34D399` | Passed assessments, completed courses              |
| `--color-success-bg`    | `#ECFDF5` | Success notification backgrounds                   |
| `--color-warning`       | `#FBBF24` | Due-soon badges, caution states                    |
| `--color-warning-bg`    | `#FFFBEB` | Warning notification backgrounds                   |
| `--color-danger`        | `#EF4444` | Overdue badges, failed states, destructive actions |
| `--color-danger-bg`     | `#FEF2F2` | Error notification backgrounds                     |
| `--color-info`          | `#2362EB` | Informational messages, tips                       |
| `--color-info-bg`       | `#EFF6FF` | Info notification backgrounds                      |

### 2.5 CSS Custom Properties (Root Declaration)

Every page must declare these at `:root`. Copy this block verbatim into `globals.css`:

```css
:root {
  --color-primary:        #2362EB;
  --color-primary-hover:  #1E54D1;
  --color-primary-light:  #EFF6FF;
  --color-accent-green:   #34D399;
  --color-accent-gold:    #FBBF24;
  --color-background:     #FFFFFF;
  --color-surface-subtle: #F9FAFB;
  --color-border:         #D1D5DB;
  --color-border-focus:   #2362EB;
  --color-text-heading:   #111827;
  --color-text-body:      #374151;
  --color-text-muted:     #6B7280;
  --color-text-inverse:   #FFFFFF;
  --color-success:        #34D399;
  --color-success-bg:     #ECFDF5;
  --color-warning:        #FBBF24;
  --color-warning-bg:     #FFFBEB;
  --color-danger:         #EF4444;
  --color-danger-bg:      #FEF2F2;
  --color-info:           #2362EB;
  --color-info-bg:        #EFF6FF;
  --radius-sm:            6px;
  --radius-md:            12px;
  --radius-lg:            24px;
  --radius-full:          9999px;
  --shadow-card:          0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06);
  --shadow-modal:         0 8px 32px rgba(0,0,0,0.14);
}
```

---

## 3. TYPOGRAPHY

### 3.1 Font Stack

**Primary Font:** Inter (Google Fonts)
**Fallback:** Plus Jakarta Sans → system-ui → sans-serif

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 3.2 Type Scale

| Role         | Size     | Weight | Line Height | Usage                          |
|--------------|----------|--------|-------------|--------------------------------|
| Display      | 2.5rem   | 800    | 1.1         | Hero headlines only            |
| Heading 1    | 2rem     | 700    | 1.2         | Page titles                    |
| Heading 2    | 1.5rem   | 700    | 1.25        | Section headers                |
| Heading 3    | 1.25rem  | 600    | 1.3         | Card titles, modal headers     |
| Body Large   | 1.125rem | 400    | 1.6         | Feature descriptions           |
| Body         | 1rem     | 400    | 1.6         | Default body text              |
| Body Small   | 0.875rem | 400    | 1.5         | Labels, captions, table cells  |
| Caption      | 0.75rem  | 500    | 1.4         | Metadata, timestamps, badges   |

---

## 4. SPACING SYSTEM

Based on a 4px grid. Use multiples of 4 for all margins, paddings, and gaps.

| Token     | Value  | Common Use                    |
|-----------|--------|-------------------------------|
| `space-1` | 4px    | Icon padding, micro gaps      |
| `space-2` | 8px    | Tight internal padding        |
| `space-3` | 12px   | Input padding, badge padding  |
| `space-4` | 16px   | Card padding (compact)        |
| `space-5` | 20px   | Section gap                   |
| `space-6` | 24px   | Card padding (standard)       |
| `space-8` | 32px   | Section padding               |
| `space-10`| 40px   | Hero padding                  |
| `space-12`| 48px   | Section vertical spacing      |
| `space-16`| 64px   | Page-level vertical rhythm    |

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 Buttons

**Signature shape:** Pill-shaped (`border-radius: var(--radius-full)`). This is a defining MedLocum visual identity element — all primary and secondary buttons MUST use fully rounded corners.

#### Primary Button
```
background: var(--color-primary)       #2362EB
color: var(--color-text-inverse)       #FFFFFF
border-radius: var(--radius-full)      9999px
padding: 10px 24px
font-weight: 600
font-size: 0.9rem
transition: background 150ms ease, transform 100ms ease
hover: background → #1E54D1; transform: translateY(-1px)
active: transform: translateY(0)
```

#### Secondary Button
```
background: transparent
color: var(--color-primary)            #2362EB
border: 1.5px solid var(--color-primary)
border-radius: var(--radius-full)      9999px
padding: 10px 24px
font-weight: 600
hover: background → var(--color-primary-light) #EFF6FF
```

#### Danger Button
```
background: var(--color-danger)        #EF4444
color: #FFFFFF
border-radius: var(--radius-full)      9999px
padding: 10px 24px
font-weight: 600
hover: background → #DC2626
```

### 5.2 Input Fields

**Signature shape:** Pill-shaped inputs (`border-radius: var(--radius-full)`). This mirrors the MedLocum Jobs search bar aesthetic exactly.

```
background: #FFFFFF
border: 1.5px solid var(--color-border)    #D1D5DB
border-radius: var(--radius-full)          9999px
padding: 12px 20px
font-size: 0.9rem
color: var(--color-text-body)
placeholder: var(--color-text-muted)
focus: border-color → var(--color-primary); box-shadow: 0 0 0 3px rgba(35,98,235,0.15)
```

### 5.3 Cards

```
background: #FFFFFF
border: 1px solid var(--color-border)
border-radius: var(--radius-md)        12px
box-shadow: var(--shadow-card)
padding: 24px
hover: box-shadow → 0 4px 20px rgba(0,0,0,0.1); translateY(-2px)
transition: all 200ms ease
```

### 5.4 Navigation Header

```
background: #FFFFFF
border-bottom: 1px solid var(--color-border)
height: 64px
padding: 0 24px
logo + platform name left-aligned
user avatar + notification bell right-aligned
```

### 5.5 Sidebar Navigation

```
background: var(--color-surface-subtle)    #F9FAFB
width: 260px (desktop) | 0 (mobile, hidden behind hamburger)
border-right: 1px solid var(--color-border)
Active item: background → var(--color-primary-light); color → var(--color-primary); border-left: 3px solid var(--color-primary)
Hover item: background → #F3F4F6
icon + label format, 14px font, 500 weight
```

### 5.6 Badges

```
Overdue:   background #FEF2F2, color #DC2626, border-radius: var(--radius-full)
Due Soon:  background #FFFBEB, color #D97706, border-radius: var(--radius-full)
Completed: background #ECFDF5, color #059669, border-radius: var(--radius-full)
In Progress: background #EFF6FF, color #2362EB, border-radius: var(--radius-full)
Default:   background #F3F4F6, color #374151, border-radius: var(--radius-full)
font-size: 0.7rem, font-weight: 600, padding: 3px 10px, text-transform: uppercase
```

### 5.7 Progress Bar

```
track: background #F3F4F6, border-radius: var(--radius-full), height: 8px
fill:  background linear-gradient(90deg, #2362EB, #34D399), border-radius: var(--radius-full)
transition: width 500ms ease
```

### 5.8 Tabs

```
Container: background var(--color-surface-subtle), border-radius: var(--radius-full), padding: 4px
Tab default: background transparent, color var(--color-text-muted), border-radius: var(--radius-full), padding: 8px 16px
Tab active:  background #FFFFFF, color var(--color-primary), box-shadow: var(--shadow-card)
Transition: 150ms ease
```

---

## 6. ICONOGRAPHY

**Icon Library:** Heroicons (outline style, 24px default, 20px compact)
**Fallback:** Lucide React

All icons rendered in colour inherit `currentColor` from their parent container. Never use filled variants except for active states.

---

## 7. MOTION & ANIMATION

**Philosophy:** Subtle, purposeful, fast. Never decorative-only. Motion guides attention.

| Interaction              | Duration | Easing          |
|--------------------------|----------|-----------------|
| Button hover/press       | 150ms    | ease            |
| Page transition (fade)   | 200ms    | ease-in-out     |
| Sidebar slide-in         | 280ms    | cubic-bezier(0.4,0,0.2,1) |
| Card hover lift          | 200ms    | ease            |
| Toast notification       | 300ms in, 200ms out | ease |
| Progress bar fill        | 500ms    | ease            |
| Modal open/close         | 200ms    | ease-out        |
| Skeleton loader pulse    | 1.5s     | ease-in-out loop|

---

## 8. HERO / LANDING SECTION

The MedLocum Jobs homepage uses a radial gradient hero background. Replicate this pattern on the LMS login/landing page.

```css
.hero-bg {
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(35,98,235,0.12) 0%, transparent 70%),
    #FFFFFF;
}
```

---

## 9. EMAIL TEMPLATE SYSTEM

All system-generated emails (assignment, overdue, completion, quiz result) use this structure:

```
Header:    background #2362EB, MedLocum Academy logo white, 72px height
Body:      background #F9FAFB outer, white card 600px max-width
           bold heading in #111827, body in #374151
CTA button: background #2362EB, white text, border-radius 9999px, padding 12px 28px
Footer:    muted grey #6B7280, unsubscribe, privacy policy links
```

---

## 10. MEDLOCUM ACADEMY — LMS COLOUR OVERRIDE TABLE

The LMS_SKILL_UNIVERSAL.md uses KTA (Kingsley Training Academy) colours: maroon #8B1A4A and teal #2A9DB5.

**For the MedLocum Academy deployment, apply these exact substitutions:**

| KTA Original (LMS_SKILL_UNIVERSAL.md) | MedLocum Academy Override |
|---------------------------------------|---------------------------|
| `#8B1A4A` (maroon primary)            | `#2362EB` (MedLocum blue) |
| `#2A9DB5` (teal action)               | `#34D399` (MedLocum green)|
| `#7A1540` (maroon hover)              | `#1E54D1` (blue hover)    |
| `#238A9F` (teal hover)                | `#10B981` (green hover)   |
| White backgrounds                     | `#FFFFFF` (unchanged)     |
| Dark text `#1a1a1a`                   | `#111827` (near-equivalent)|

This override table applies universally. Every reference to `#8B1A4A` in any generated component must read `#2362EB`. Every reference to `#2A9DB5` must read `#34D399`.

---

## 11. RESPONSIVE BREAKPOINTS

| Breakpoint | Min Width | Behaviour                                           |
|------------|-----------|-----------------------------------------------------|
| Mobile     | 0px       | Single column, hamburger nav, pill buttons full-width|
| Tablet     | 768px     | Two-column grid, sidebar available                  |
| Desktop    | 1024px    | Three-column grid, persistent sidebar               |
| Wide       | 1280px    | Four-column course grid, max-width 1280px container |

---

## 12. LOGO USAGE

**MedLocum Jobs Logo:** Three-element mark — primary blue `#2362EB` wordmark, green `#34D399` arc accent, black `#000000` dot.

**MedLocum Academy Variant:** Append "Academy" in `#374151` at 70% font-weight of the primary wordmark.

**Minimum clear space:** Equal to the height of the letter "M" in the logo on all sides.
**Minimum size:** 120px wide on screen, 30mm in print.
**Do not:** Rotate, recolour, stretch, apply effects, or place on busy backgrounds.

---

## 13. ACCESSIBILITY REQUIREMENTS

- **Colour contrast minimum:** 4.5:1 for body text, 3:1 for large text and UI components (WCAG 2.1 AA)
- `#2362EB` on `#FFFFFF`: ratio 5.04:1 ✓ Passes AA
- `#374151` on `#FFFFFF`: ratio 7.84:1 ✓ Passes AAA
- `#6B7280` on `#FFFFFF`: ratio 4.62:1 ✓ Passes AA
- All interactive elements must have visible focus rings (3px, `rgba(35,98,235,0.35)`)
- All images require `alt` text
- Icon-only buttons require `aria-label`
- Form inputs require associated `<label>` elements

---

## 14. COURSE CATEGORY COLOUR ASSIGNMENTS

Each training category is assigned a unique accent colour for badges, category labels, and section headers. These augment (never replace) the primary palette.

| Category                          | Accent Hex | Usage               |
|-----------------------------------|------------|---------------------|
| Clinical Compliance               | `#2362EB`  | Primary blue        |
| Safeguarding                      | `#F59E0B`  | Amber               |
| Infection Prevention & Control    | `#34D399`  | Brand green         |
| Mental Health & Wellbeing         | `#8B5CF6`  | Purple              |
| Moving & Handling                 | `#F97316`  | Orange              |
| Medication Management             | `#EF4444`  | Red                 |
| Communication & People Skills     | `#06B6D4`  | Cyan                |
| Leadership & Management           | `#1E40AF`  | Deep blue           |
| Fire Safety                       | `#DC2626`  | Fire red            |
| Data Protection & GDPR            | `#4B5563`  | Slate               |
| General Induction                 | `#10B981`  | Emerald             |

---

## 15. PLATFORM NAME AND COPY VOICE

**Platform Name:** MedLocum Academy
**Tagline:** "Your compliance. Your career. Fully online."
**Voice:** Professional, clear, warm, efficient. Never bureaucratic. Never condescending.

**Replace all KTA-specific copy from LMS_SKILL_UNIVERSAL.md:**

| KTA Copy                                     | MedLocum Academy Copy                              |
|----------------------------------------------|----------------------------------------------------|
| "Kingsley Training Academy"                  | "MedLocum Academy"                                 |
| "academy.kingsleyhealthcare.co.uk"           | "academy.medlocumjobs.com"                         |
| "training.academy@kingsleyhealthcare.co.uk"  | "academy@medlocumjobs.com"                         |
| "Kingsley Healthcare Group"                  | "MedLocum Jobs Ltd"                                |
| "@kingsleyhealthcare.co.uk" SSO domain       | "@medlocumjobs.com" SSO domain                     |
| "K swoosh" logo mark                         | MedLocum tri-element logo (blue + green arc)       |

---

*End of DESIGN.md — v1.0.0*
*Use alongside: LMS_SKILL_UNIVERSAL.md*
*All LMS-generated files must comply with both documents simultaneously.*
