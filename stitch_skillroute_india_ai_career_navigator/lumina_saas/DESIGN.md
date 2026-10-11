---
name: Lumina SaaS
colors:
  surface: '#fbf8ff'
  surface-dim: '#d9d9e8'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ededfc'
  surface-container-high: '#e7e7f6'
  surface-container-highest: '#e1e1f1'
  on-surface: '#191b26'
  on-surface-variant: '#424654'
  inverse-surface: '#2e303b'
  inverse-on-surface: '#f0efff'
  outline: '#737786'
  outline-variant: '#c2c6d7'
  surface-tint: '#0056d0'
  primary: '#0055ce'
  on-primary: '#ffffff'
  primary-container: '#2f6fed'
  on-primary-container: '#ffffff'
  inverse-primary: '#b1c5ff'
  secondary: '#5a45cb'
  on-secondary: '#ffffff'
  secondary-container: '#7360e5'
  on-secondary-container: '#fffbff'
  tertiary: '#a5381d'
  on-tertiary: '#ffffff'
  tertiary-container: '#c65033'
  on-tertiary-container: '#fffeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a0'
  secondary-fixed: '#e5deff'
  secondary-fixed-dim: '#c8bfff'
  on-secondary-fixed: '#190064'
  on-secondary-fixed-variant: '#442bb5'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a2'
  on-tertiary-fixed: '#3c0700'
  on-tertiary-fixed-variant: '#862208'
  background: '#fbf8ff'
  on-background: '#191b26'
  surface-variant: '#e1e1f1'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.75rem
  space-2xl: 2.5rem
---

## Brand & Style
This design system embodies a modern, collaborative productivity workspace aesthetic. It marries the structured efficiency of developer tools with the inviting, vibrant approachability of contemporary project management platforms.

The visual direction centers on **Modern Soft-Minimalism**:
- **Clarity & Airiness:** Crisp white modular cards float weightlessly above a soft, cool lavender-tinted gray canvas.
- **Intentional Chromatics:** Functional neutral backgrounds paired with playful, pastel-tinted status tags and electric primary actions create rapid visual scanning without sensory fatigue.
- **Micro-tactility:** Generously radiused containers, ambient atmospheric drop shadows tinted with purple undertones, and pill-shaped interactive components establish an organized, delightful environment.
- **Emotional Resonance:** Focused, calm, capable, and optimistic. The workspace feels like an organized desk bathed in natural light.

## Colors
The color architecture utilizes a cool lavender-slate foundation, balanced with vivid chromatic accents for statuses, progress metrics, and call-to-actions.

### Canvas & Surfaces
- **Canvas Base:** `#F4F5FB` (a luminous, soft cool purple-gray creating separation without harsh contrast).
- **Surface Layer 1 (Cards & Modals):** `#FFFFFF` (pure crisp white with diffuse ambient shadow).
- **Surface Layer 2 (Muted Insets & Hover States):** `#EBEDF8` (subtle container fill for input fields, tab bars, and inactive pills).

### Primary & Brand Accents
- **Primary Action:** `#2F6FED` (high-clarity cobalt blue for primary CTA buttons, focused outlines, and active navigation indicators).
- **Secondary Accent:** `#7B68EE` (medium slate purple used for creative tags, timeline bars, and soft active container states).
- **Tertiary Accent:** `#FF7A59` (warm coral/tangerine for urgent status badges, priority markers, and milestone highlights).

### Semantic & Status Palette
- **Success / Completed:** `#10B981` (soft emerald base), accompanied by surface tint `#ECFDF5`.
- **In-Progress / Warning:** `#F59E0B` (warm amber), with surface tint `#FFFBEB`.
- **Review / Custom Status:** `#06B6D4` (vivid sky cyan), with surface tint `#ECFEFF`.

### Neutrals & Typography
- **Heading & High-Emphasis Body:** `#1E202B` (deep ink slate, avoiding harsh `#000000`).
- **Secondary Subtitles & Body:** `#6E7191` (balanced slate gray providing legible contrast).
- **Tertiary & Border Lines:** `#E2E4F0` (ultra-soft borders for table rows, dividers, and card outlines).

## Typography
Plus Jakarta Sans serves as the singular typographic foundation across headlines, body copy, and UI metadata. Its geometric construction, generous x-height, and subtly sculpted aperture curves align seamlessly with rounded interfaces and high-density SaaS dashboards.

### Hierarchy & Treatment
- **Display & Section Titles:** Emphasize bold weights (`700`) with subtle negative letter tracking (`-0.01em` to `-0.02em`) to maintain tightness in expansive dashboard views.
- **Data & Metric Numerals:** Metric cards display bold, large numeric values (`headline-xl`) paired with subdued uppercase or small sentence-case labels directly below or above.
- **Body & Tabular Data:** Medium density (`13px`-`14px`) set at regular (`400`) and medium (`500`) weights ensures high legibility across task lists and tables.
- **Tags & Statuses:** Micro-labels (`11px`) set in semi-bold (`600`) ensure clarity even against pastel badge backgrounds.

## Layout & Spacing
The layout follows a modular multi-pane dashboard architecture, consisting of a fixed or collapsible sidebar (width: `240px`), an optional sub-navigation rail, and an expansive 12-column grid content area.

### Grid & Breakpoints
- **Desktop (1280px+):** Outer margins of `2rem` (`32px`), column gutter of `1.5rem` (`24px`). Dashboard widgets snap to 3, 4, 6, 8, or 12 column cards.
- **Tablet (768px - 1279px):** Sidebar collapses into an icon rail or off-canvas drawer. Outer margins reduce to `1.5rem` (`24px`), column gutter to `1.25rem` (`20px`). 
- **Mobile (< 768px):** Single-column stacked flow with outer margins of `1rem` (`16px`). Dashboard cards stretch full-width, scrollable horizontal rails for metric overviews and status chips.

### Vertical Rhythm & Card Gaps
- Content within cards uses `space-md` (`16px`) to `space-lg` (`20px`) inner padding.
- Gaps between modular widget panels consistently maintain `1.25rem` to `1.5rem` to preserve the floating, airy aesthetic.

## Elevation & Depth
Elevation in this design system avoids harsh drop shadows in favor of diffused, atmospheric, color-tinted ambient glows that ground white surfaces cleanly over the lavender canvas.

### Elevation Levels
- **Level 0 (Flat Canvas):** `#F4F5FB` flat background canvas.
- **Level 1 (Floating Dashboard Cards):** `box-shadow: 0 4px 20px -2px rgba(90, 80, 140, 0.06), 0 1px 3px 0 rgba(90, 80, 140, 0.04)`. Accompanied by a microscopic hairline border: `1px solid rgba(226, 228, 240, 0.7)`.
- **Level 2 (Dropdowns, Popovers, & Hovered Cards):** `box-shadow: 0 12px 28px -4px rgba(90, 80, 140, 0.12), 0 4px 8px -2px rgba(90, 80, 140, 0.04)`.
- **Level 3 (Modals & Command Palettes):** `box-shadow: 0 24px 48px -8px rgba(70, 60, 120, 0.18), 0 8px 16px -4px rgba(90, 80, 140, 0.08)`. Backdrops feature a translucent glass blur: `backdrop-filter: blur(8px); background-color: rgba(30, 32, 43, 0.25)`.

## Shapes
The shape language uses expansive, comforting rounded geometry that reinforces an accessible, modern collaborative workspace.

- **Primary Cards & Large Panels:** Radius of `16px` to `20px` (`rounded-2xl`), giving modules a soft, floating cushion appearance.
- **Buttons & Standard Controls:** Continuous organic curves (`8px` to `12px` for standard controls; fully rounded `9999px` pills for primary call-to-actions, action pills, and status chips).
- **Input Fields & Search Bars:** `12px` (`rounded-xl`) or fully circular pill inputs (`rounded-full`) for top navigation search bars.
- **Icons & Avatar Circles:** Embedded within circular badge backgrounds (`rounded-full`) tinted with soft category colors.

## Components

### Buttons
- **Primary Action Pill:** Solid `#2F6FED` background, white label, full pill radius (`rounded-full`), `px-6 py-2.5`, subtle shadow `0 4px 14px rgba(47, 111, 237, 0.35)`. Hover transition shifts to `#2458C7` with a slight `translate-y(-1px)`.
- **Secondary / Ghost Button:** Transparent background, `#1E202B` text, `px-4 py-2`, `rounded-xl`. On hover: `#EBEDF8` fill.
- **Icon Action Buttons:** `36px x 36px` circular white pills with subtle gray borders and centered SVG icons.

### Status Chips & Pills
- Status tags are pill-shaped (`rounded-full`), compact (`px-3 py-1`), typography `label-sm`.
- **In-Progress:** Background `#FFF4ED`, text `#FF7A59`.
- **Complete:** Background `#ECFDF5`, text `#10B981`.
- **Review / Custom:** Background `#EEF2FF`, text `#2F6FED` or `#7B68EE`.

### Cards & Panels
- Background: Pure White (`#FFFFFF`).
- Border: `1px solid rgba(226, 228, 240, 0.7)`.
- Corner Radius: `18px`.
- Padding: `20px` to `24px`.
- Layout: Header with title, trailing action button or segmented pill, clear divider-free body content, and optional bottom summary metrics.

### Lists & Task Rows
- Individual list items sit inside subtle hover-reactive rows (`rounded-xl`), padding `10px 14px`.
- Inactive state: Transparent background.
- Hover state: Fills with `#F4F5FB` to indicate interactivity without visual clutter.
- Structure: Leading drag handle / checkbox, status pill, task title (`body-md` in `#1E202B`), assignee avatar stack, progress indicator, and trailing date.

### Checkboxes & Radio Controls
- **Checkbox:** `18px x 18px` square with `5px` corner radius. Border: `1.5px solid #CCD0E4`. Checked state: `#10B981` or `#2F6FED` solid fill with crisp white checkmark SVG.
- **Radio:** `18px x 18px` circle with matching border. Selected state: Filled center dot with `#2F6FED`.

### Input & Search Fields
- Integrated search bar inside the top navigation: `#FFFFFF` or `#EBEDF8` fill, `rounded-full`, height `40px`, padding `0 18px`, leading search icon in `#6E7191`.
- Focus ring: `2px solid #2F6FED` with soft offset blur, no harsh default browser outlines.

### Sidebar Navigation
- Vertical sidebar container with `#FFFFFF` or translucent `#F4F5FB` background.
- Active navigation item: Full pill container (`rounded-xl` or `rounded-full`), `#EBEDF8` background with dark text `#1E202B`, paired with a high-contrast icon badge.
- Inactive items: `#6E7191` text with subtle hover transition to `#1E202B`.