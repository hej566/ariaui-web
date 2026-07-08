# Tokens Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/tokens`
- Kind: `utility`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/tokens/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 73 of 73 documented sections are represented after native normalization.
- Requirement lines: 464

### @ariaui-web/tokens

- This README is the authoritative contract for the **tokens package**: architecture, naming conventions, CSS generation, and contribution workflows.

### Overview

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Scope

- **Package**: `packages/tokens` -> published as `@ariaui-web/tokens`
- **Exports**: `primitives`, `base`, `light`, `dark`, `generateCSS()`
- **Build artifact**: `dist/tokens.css` - ready-to-import stylesheet for Tailwind v4 + global CSS variables
- **Design source**: Token categories are aligned with the shadcndesign Variables docs: <https://www.shadcndesign.com/docs/variables>. The source model uses Tailwind CSS, Theme, Mode, and Pro Custom variable collections.

### Design Philosophy

- **Two-tier system**: Primitives (OKLCH color scales) -> Semantics (contextual aliases)
- **Mode-aware**: Light/dark theme support with automatic context switching
- **Auto-generated CSS**: TypeScript -> CSS with programmatic `@theme` generation for Tailwind v4
- **Zero runtime**: All tokens compile to CSS custom properties
- **Figma-to-code parity**: Figma variables use fixed values and hex-compatible color data where Figma requires it; this package stores code-facing color primitives as Tailwind v4 OKLCH channels and emits CSS variables for Tailwind utilities.

### WCAG 2.2 alignment

- Semantic values in `semantic.ts` are chosen so that **common documented pairings** meet:
- **1.4.3 Contrast (Minimum)** - e.g. primary text on `primary`, status foreground values on status fills, placeholder text on pale neutrals, normal body text on `background`.
- **1.4.11 Non-text Contrast** - default **border** neutrals vs adjacent **page/surface** backgrounds in light and dark (borders use lighter steps on dark near-black surfaces).
- Primitives are still **compositional**: new `className` combinations (e.g. arbitrary surfaces) should be checked in design review or with a contrast tool. Figma variables should mirror semantic names; see `.cursor/rules/figma-design-system-integration.mdc` for MCP workflow.

### ShadcnDesign Variable Alignment

- The shadcndesign Variables docs describe the Figma kit as a variables-first system for **color modes, spacing, radius, and widths**. The kit mirrors shadcn/ui and Tailwind CSS v4 by separating primitive utility values from theme-aware semantic values.

### Source Collections

- Table row: shadcndesign collection | Source purpose | `@ariaui-web/tokens` mapping
- Table row: **Tailwind CSS** | Utility-like variables for spacing, width, min/max width, height, breakpoints, border radius, border width, opacity, line height, and Tailwind color palettes. | Color primitives live in `src/primitives.ts`; implemented utility tokens live in `light` as pass-through keys such as `border-radius-*`, `border-width-*`, `opacity-*`, `max-width-*`, `container-*`, and text line-height keys.
- Table row: **Theme** | Editable design-system variables: shadcn/ui colors and radius, Tailwind theme variables, typography, font weights, shadows, blur, and container values. | `light` is the package's editable source for shared, theme-agnostic dimensions and effect layer colors. `css.ts` forwards pass-through values into `@theme` and defines composites for shadows and focus rings.
- Table row: **Mode** | Light/dark shadcn/ui variables used directly in components. | Color semantics are split between `light` and `dark`; `.dark` emits only mode-specific color overrides. Use `background`, `foreground`, `card`, `primary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, charts, and sidebar tokens directly in UI classes.
- Table row: **Custom** (Pro) | Pro Blocks variables for heading styles, section spacing, layout, and responsive modes. | Implemented as section, heading, paragraph, description, label, and container tokens where they are part of the docs UI contract. Keep project-only Pro Block additions local unless multiple packages need them.

### Implementation Notes

- Figma variable names may use slash-qualified paths such as `base/background`, `colors/primary-light`, or `border-radius/rounded-lg`. CSS custom properties in this package use hyphenated keys because `/` is not valid in the local token key contract.
- Figma cannot fully express Tailwind's runtime math model, so utility values that need code parity should be stored as explicit CSS-ready values (`rem`, `px`, `%`) in `semantic.ts`.
- Figma currently does not expose OKLCH as a native variable color space. Keep OKLCH as the code source of truth in `primitives.ts`; Figma syncs can use equivalent resolved color values.
- Mode variables should be preferred in component styling. Tailwind CSS and Theme variables are implementation details unless a component truly needs a primitive utility value.

### Architecture

- Code line: +-------------------------------------------------------------+
- Code line: | Design Source (shadcndesign Variables) |
- Code line: | Tailwind CSS, Theme, Mode, Custom collections |
- Code line: +--------------------+----------------------------------------+
- Code line: |
- Code line: v
- Code line: | primitives.ts |
- Code line: | * Tailwind v4 color scales (zinc, neutral, violet, red, ...)|
- Code line: | * OKLCH channels: "L% C H" (no wrapper) |
- Code line: | * Base colors: white, black |
- Code line: | semantic.ts |
- Code line: | * light: Record<string, string> (full token set) |
- Code line: | * dark: Record<string, string> (color overrides only) |
- Code line: | * Flat shadcn-style keys: background, foreground, primary... |
- Code line: | * Modifiers: -foreground, -hover |
- Code line: | css.ts -> generateCSS() |
- Code line: | * Combines primitives + semantics |
- Code line: | * Auto-generates @theme color mappings |
- Code line: | * Explicit composites (shadows, focus rings) |
- Code line: | dist/tokens.css |
- Code line: | * :root { resolved light semantics + shared utility tokens }|
- Code line: | * .dark { dark semantic overrides } |
- Code line: | * @theme { Tailwind v4 mappings } |

### Module Map

- Table row: File | Exports | Purpose
- Table row: `src/primitives.ts` | `primitives`, `base` | OKLCH channel strings for all color scales (50-950) + white/black
- Table row: `src/semantic.ts` | `light`, `dark` | Semantic token maps referencing primitives; keys become CSS `--{key}`
- Table row: `src/css.ts` | `generateCSS()` | Builds complete CSS with `:root`, `.dark`, `@theme` blocks
- Table row: `scripts/write-css.ts` | - | Build script that writes `dist/tokens.css`
- Table row: `index.ts` | All public exports | No CSS side effects; consumers choose import path

### Primitive Layer

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Format

- Primitives store **bare OKLCH channels** as strings:
- Code line: primitives.zinc[500] = "55.2% 0.014 286"
- Code line: // ^^^^ ^^^^^ ^^^
- Code line: // L% C H
- **Critical**: Lightness **must include `%`**. Without it, browsers treat `L` as absolute (0-1), breaking colors.

### Usage in CSS Generation

- `semantic.ts` references primitives with Tailwind-style names:
- Code line: "foreground": "var(--color-neutral-950)"
- `generateCSS()` resolves those references into concrete `oklch(...)` values in `dist/tokens.css`. Primitive `--color-*` variables are intentionally **not** emitted by this package so Tailwind v4's built-in color variables remain untouched.

### Available Scales

- 27 primitive scales (each with steps 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950):
- **Neutral grays**: `zinc`, `neutral`, `slate`, `gray`, `stone`, `taupe`, `mauve`, `mist`, `olive`
- **Brand**: `brand` (alias of `violet`), `violet`, `purple`, `fuchsia`, `pink`, `rose`
- **Accent colors**: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`
- **Base colors**: `white: "100% 0 0"`, `black: "0% 0 0"`

### Source

- Primitives are sourced from the **Tailwind CSS v4** OKLCH palette.

### Semantic Layer

- Semantic tokens provide **contextual meaning** on top of primitives. They reference primitives via CSS variables.

### Structure

- Code line: export const light: Record<string, string> = {
- Code line: "background": "var(--color-white)",
- Code line: "foreground": "var(--color-neutral-950)",
- Code line: "primary": "var(--color-neutral-900)",
- Code line: "primary-foreground": "var(--color-white)",
- Code line: "border": "var(--color-neutral-200)",
- Code line: "brand": "var(--color-neutral-900)",
- Code line: // ...
- Code line: export const dark: Record<string, string> = {
- Code line: "background": "var(--color-neutral-950)", // Override
- Code line: "foreground": "var(--color-neutral-50)", // Override
- Code line: // Only color-related overrides; no radius/spacing

### Semantic Token Pattern

- Tokens use a **flat shadcn-style vocabulary**. There are no category prefixes in the token key - the CSS variable name IS the token name:
- Code line: {intent}[-{modifier}]
- **Core surfaces**: `background` | `foreground` | `card` | `popover` | `overlay`
- **Interactive**: `primary` | `secondary` | `muted` | `accent`
- **Brand/Status**: `brand` | `destructive` | `warning` | `success`
- **Modifiers**: `-foreground` | `-hover`
- **Strokes**: `border` | `border-secondary` | `border-brand` | `input` | `ring`
- **Icons**: `icon` | `icon-secondary` | `icon-tertiary` | `icon-brand` | `icon-{status}`
- **Text helpers**: `placeholder`
- **shadcn extensions**: `chart-1` through `chart-5`, `sidebar-*`
- **Examples:**
- `background` - Page background
- `primary` - Solid dark button background
- `primary-foreground` - Text on primary button
- `muted-foreground` - Secondary/tertiary text
- `chart-1` - Data visualization color
- `sidebar-accent` - Sidebar hover/selected item background
- `icon-tertiary` - Tertiary icon / chevron color

### Shared Tokens (Non-Color)

- These exist **only in `light`** (not overridden in `dark`):
- **Layout widths**: `container-3xs` through `container-7xl`, `container-padding-x`, `max-width-*`
- **Radius**: `border-radius-none`, `border-radius-xs`, ..., `border-radius-full`
- **Border widths**: `border-width`, `border-width-0`, `border-width-2`, `border-width-4`, `border-width-8`
- **Opacity**: `opacity-0` through `opacity-100`
- **Effects**: `shadow-*-depth-*`, `blur-*`
- **Typography utilities**: `font-weight-*`, `heading-*`, `paragraph-*`, `description-*`, `label-*`
- **SVG utilities**: `stroke-width-*`
- **Section layout**: `section-padding-y`, `section-gap-*`
- **Focus ring dimensions**: `ring-width`, `ring-offset`
- These are **theme-agnostic** and go into `:root` only.

### Text Style Tokens

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Local Text Styles

- The package no longer exports a separate `typeScale` module. Text styles live in `semantic.ts` as CSS custom properties so they can be forwarded into Tailwind v4's `@theme` block alongside the rest of the token contract.
- Code line: "heading-xl-font-size": "3rem",
- Code line: "heading-xl-line-height": "3rem",
- Code line: "heading-xl-font-weight": "900",
- Code line: "heading-xl-letter-spacing": "-0.02em",
- Code line: "paragraph-font-size": "1rem",
- Code line: "paragraph-line-height": "1.5rem",
- Code line: "paragraph-font-weight": "400",
- **Characteristics**:
- Text tokens are CSS-ready values (`rem`, numeric font weights, `em` letter spacing)
- Heading, paragraph, description, and label tokens map to the shadcndesign Custom collection intent
- Line-height values are explicit because Figma variables do not support Tailwind's calculated leading model

### CSS Generation

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Output Structure

- Code line: :root {
- Code line: /* Semantic aliases - light mode */
- Code line: --background: oklch(100% 0 0 / 1);
- Code line: --foreground: oklch(14.5% 0 0 / 1);
- Code line: --border-radius-md: 6px;
- Code line: --container-7xl: 80rem;
- Code line: /* ... all light/shared tokens */
- Code line: .dark {
- Code line: /* Semantic aliases - dark mode overrides */
- Code line: --background: oklch(14.5% 0 0 / 1);
- Code line: --foreground: oklch(98.5% 0 0 / 1);
- Code line: /* ... only theme-variant tokens */
- Code line: @theme {
- Code line: /* Tailwind v4 theme mappings */
- Code line: --color-background: var(--background);
- Code line: --color-foreground: var(--foreground);
- Code line: --color-border: var(--border);
- Code line: --border-radius-md: var(--border-radius-md);
- Code line: --container-7xl: var(--container-7xl);
- Code line: /* Composites */
- Code line: --shadow-lg: 0px 12px 16px -4px var(--shadow-lg-depth-1), ...;
- Code line: --focus-ring: 0 0 0 var(--ring-offset) var(--background), ...;
- Code line: /* Text style passthrough */
- Code line: --heading-xl-font-size: var(--heading-xl-font-size);
- Code line: --paragraph-line-height: var(--paragraph-line-height);
- Code line: /* ... */

### Auto-Generated vs Manual

- **Auto-Generated** (from semantic keys):
- **Color tokens** (all flat named tokens except non-color categories) -> `@theme` as `--color-{key}: var(--{key})`
- **Pass-through tokens** (`container-*`, `border-radius-*`, `border-width*`, `opacity-*`, `font-weight-*`, `stroke-width-*`, `max-width-*`, `blur-*`, `section-*`, `heading-*`, `paragraph-*`, `description-*`, `label-*`) -> `@theme` as-is via `var(--{key})`
- **Manual** (explicit data in `css.ts`):
- **Shadow composites** - Multi-layer box-shadow values (geometry cannot be auto-derived)
- **Focus ring composites** - Double-ring box-shadow templates

### @theme Naming Convention

- All color tokens map to `--color-{key}` in `@theme`:
- Code line: /* :root semantic variable */
- Code line: --background: oklch(100% 0 0 / 1);
- Code line: /* @theme mapping - enables bg-background, text-background, border-background */
- Code line: --color-background: var(--background);
- Non-color tokens are excluded from `--color-*` mapping:
- `border-radius-*` -> `--border-radius-*` (dimension utilities)
- `shadow-*-depth-*` -> consumed only in `SHADOW_COMPOSITES`
- `container-*`, `paragraph-*`, `heading-*`, `section-*`, and other pass-through prefixes -> passthrough `@theme`
- `ring-width`, `ring-offset`, `focus-ring-color` -> used in composites

### Token Categories

- Table row: Category | Pattern | Example | Mode Variants? | Notes
- Table row: **Surfaces** | `background` \ | `card` \ | `popover` | `background` | Yes | Page and component surface colors
- Table row: **Text** | `foreground` \ | `muted-foreground` | `muted-foreground` | Yes | Body text, captions, labels
- Table row: **Interactive** | `primary` \ | `secondary` \ | `muted` \ | `accent` | `primary` | Yes | Button and interactive element colors
- Table row: **Brand/Status** | `brand` \ | `destructive` \ | `warning` \ | `success` | `destructive` | Yes | Brand and feedback colors
- Table row: **Charts** | `chart-{1..5}` | `chart-1` | Yes | Data visualization colors from the shadcn/ui base set
- Table row: **Sidebar** | `sidebar-*` | `sidebar-accent` | Yes | Sidebar component color set
- Table row: **Icons** | `icon` \ | `icon-*` | `icon-tertiary` | Yes | Icons, decorative elements
- Table row: **Borders** | `border` \ | `border-*` \ | `input` \ | `ring` | `border` | Yes | Dividers, outlines, form strokes
- Table row: **Focus Rings** | `focus-ring-*-color` | `focus-ring-color` | Yes | Base colors only; composites live in `@theme`
- Table row: **Shadows** | `shadow-*-depth-*` | `shadow-lg-depth-2` | Yes | Layer colors; geometry lives in `css.ts` composites
- Table row: **Radius** | `border-radius-*` | `border-radius-md` | No | Border radius values
- Table row: **Border Width** | `border-width*` | `border-width-2` | No | Border thickness values
- Table row: **Opacity** | `opacity-*` | `opacity-70` | No | Percent values for Tailwind opacity modifiers
- Table row: **Container/Width** | `container-*` \ | `max-width-*` | `container-7xl` | No | Content width constraints
- Table row: **Effects** | `blur-*` | `blur-lg` | No | Filter blur utilities
- Table row: **Typography** | `font-weight-*` \ | `heading-*` \ | `paragraph-*` | `heading-xl-font-size` | No | Text style variables
- Table row: **Section Layout** | `section-*` | `section-gap-lg` | No | Pro Blocks-style layout spacing

### Naming Conventions

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### State Modifiers

- Interactive tokens use modifiers to represent different interaction states:
- Table row: Modifier | Use Case | Example
- Table row: (none) | Base/resting state | `background`
- Table row: `-foreground` | Text/icon on this surface | `primary-foreground`
- Table row: `-hover` | Pointer hover | `primary-hover`

### Intent Patterns

- **Core surfaces** (neutral palette):
- `background` - Main page background
- `card` - Card / elevated surface
- `popover` - Floating panels
- `muted` - Muted / low-emphasis backgrounds
- `accent` - Hover overlay backgrounds
- **Interactive**:
- `primary` - High-emphasis CTA (dark button)
- `secondary` - Secondary button / surface
- `brand` - Brand identity (call-to-action, links)
- `destructive` - Destructive actions, validation errors
- `warning` - Caution, non-blocking alerts
- `success` - Confirmation, success states

### Utility Token Naming

- Utility-like tokens keep their Tailwind concept in the key so the Figma source and generated utility are easy to connect:
- `border-radius-lg` mirrors `border-radius/rounded-lg` in Figma and can be used with local utilities or arbitrary values such as `rounded-[var(--border-radius-lg)]`.
- `max-width-3xl` mirrors `max-width/max-w-3xl`.
- `opacity-70` mirrors `opacity/opacity-70` and is stored as `70%` for Tailwind v4 opacity modifiers.
- `heading-xl-*` and `section-*` mirror the shadcndesign Pro Custom collection for Pro Blocks-style content layouts.

### Shadow Depth Layers

- Shadow tokens use `-depth-N` suffix for multi-layer composites:
- Code line: /* Semantic layer colors */
- Code line: --shadow-lg-depth-1: oklch(var(--color-black) / 0.078); /* Outermost */
- Code line: --shadow-lg-depth-2: oklch(var(--color-black) / 0.031); /* Middle */
- Code line: --shadow-lg-depth-3: oklch(var(--color-black) / 0.039); /* Innermost */
- Code line: /* @theme composite */
- Code line: --shadow-lg:
- Code line: 0px 12px 16px -4px var(--shadow-lg-depth-1),
- Code line: 0px 4px 6px -2px var(--shadow-lg-depth-2),
- Code line: 0px 2px 2px -1px var(--shadow-lg-depth-3);

### Development Workflow

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Adding New Tokens

- The local Aria UI package docs include this h3 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### 1. **Simple color/layout tokens**

- Edit `src/semantic.ts`:
- Code line: export const light: Record<string, string> = {
- Code line: // ... existing tokens ...
- Code line: // Add new token
- Code line: "info": "var(--color-blue-50)",
- Code line: "info-foreground": "var(--color-blue-600)",
- Code line: "border-info": "var(--color-blue-600)",
- Code line: export const dark: Record<string, string> = {
- Code line: // ... existing overrides ...
- Code line: // Add dark override
- Code line: "info": "var(--color-blue-950)",
- Code line: "info-foreground": "var(--color-blue-200)",
- yes **Auto-generated**: `@theme` entries are created automatically as `--color-{key}` for all color tokens.

### 2. **Composite tokens** (shadows, focus rings)

- Edit `src/css.ts`:
- Code line: const SHADOW_COMPOSITES: Record<string, string> = {
- Code line: // ... existing shadows ...
- Code line: // Add new shadow size
- Code line: "4xl": "0px 40px 80px -16px var(--shadow-4xl-depth-1), ...",
- Then add corresponding layer colors in `semantic.ts`:
- Code line: "shadow-4xl-depth-1": "oklch(var(--color-black) / 0.15)",

### 3. **New primitive scale**

- Edit `src/primitives.ts`:
- Code line: export const primitives = {
- Code line: // ... existing scales ...
- Code line: // Add new scale
- Code line: teal: {
- Code line: 50: "98.4% 0.014 181",
- Code line: 100: "95.3% 0.05 181",
- Code line: // ... 200-950

### Testing

- The local Aria UI package docs include this h3 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Unit tests (validate token structure)

- pnpm --filter=@ariaui-web/tokens test

### Watch mode

- pnpm --filter=@ariaui-web/tokens test:watch
- Code line: **Key test suites**:
- Code line: - 'semantic.test.ts' - Validates token presence, structure, referencing rules
- Code line: - 'css.test.ts' - Validates CSS generation, '@theme' mappings, composite definitions

### Building

- The local Aria UI package docs include this h3 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Build TypeScript + generate CSS

- pnpm --filter=@ariaui-web/tokens build
- Code line: **Artifacts**:
- Code line: - 'dist/index.js', 'dist/index.cjs', 'dist/index.d.ts' - TypeScript exports
- Code line: - 'dist/tokens.css' - **Committed artifact** (must rebuild before PRs)

### Releasing

- The local Aria UI package docs include this h3 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### 1. Create changeset

- pnpm changeset

### 2. Version packages (updates package.json + CHANGELOG.md)

- pnpm version-packages

### 3. Publish to npm

- pnpm release

### Consumer Guide

- The usage model follows the shadcndesign Variables docs: use **Tailwind CSS** variables for utility parity, **Theme** variables for customization, **Mode** variables directly in UI, and **Custom** variables for Pro Blocks-style layout and text presets.

### Installation

- Code line: npm install @ariaui-web/tokens

### Usage: Import CSS

- Code line: /* In your global CSS (e.g., app/globals.css) */
- Code line: @import "@ariaui-web/tokens/dist/tokens.css";
- This gives you:
- All CSS custom properties in `:root` and `.dark`
- Tailwind v4 `@theme` mappings
- Mode-aware semantic utility classes such as `bg-background`, `text-foreground`, `border-border`, and `ring-ring`
- Shared layout, radius, effect, opacity, and text-style variables
- No JavaScript runtime

### Usage: Tailwind CSS Collection

- Use Tailwind-style utilities when the Figma variable comes from the shadcndesign **Tailwind CSS** collection. These variables describe dimensions, spacing, border properties, opacity, line-height, and primitive colors.
- Table row: Figma variable group | Code usage
- Table row: `spacing/4` | `p-4`, `m-4`, `gap-4`
- Table row: `width/w-32` | `w-32`
- Table row: `min-width/min-w-3xs` | `min-w-3xs`
- Table row: `max-width/max-w-3xl` | `max-w-3xl`
- Table row: `height/h-3` | `h-3`
- Table row: `breakpoint/sm` | `sm:*` responsive variants
- Table row: `border-radius/rounded-lg` | `rounded-lg`, or `rounded-[var(--border-radius-lg)]` when reading the package token directly
- Table row: `border-width/border-2` | `border-2`
- Table row: `opacity/opacity-70` | `opacity-70`
- Table row: `line-height/leading-6` | `leading-6`
- Table row: `tailwind-colors/blue/500` | `text-blue-500`, `bg-blue-500`, or a semantic token if the color has product meaning
- Prefer semantic tokens over primitive Tailwind colors once a value has UI meaning.

### Usage: Theme Collection

- The shadcndesign **Theme** collection is where design-system values are edited. In this package, those values live in `src/semantic.ts` and are emitted through `tokens.css`.
- Use Theme-level values when you are:
- changing shadcn/ui color references used by Mode tokens
- defining or adjusting text styles
- defining effect styles such as shadows, focus rings, and blur
- changing radius, container, font weight, or shared layout values
- For package changes, edit `src/semantic.ts` and rebuild:
- Code line: pnpm --filter=@ariaui-web/tokens build
- For app-level customization, override generated CSS variables after importing `tokens.css` (see [Overriding Tokens](#overriding-tokens)).

### Usage: Mode Collection

- Use Mode-facing semantic tokens directly in UI. These map to shadcn/ui light/dark variables and switch through the `.dark` selector.
- Code line: <div className="bg-background text-foreground">
- Code line: <div className="rounded-[var(--border-radius-md)] border border-border bg-card p-4 shadow-sm">
- Code line: <p className="text-foreground">Heading</p>
- Code line: <p className="text-muted-foreground">Secondary text</p>
- Code line: <button className="bg-primary text-primary-foreground hover:bg-primary-hover">
- Code line: Action
- Code line: </button>
- Code line: <span className="bg-muted/90 text-muted-foreground">Muted</span>
- Code line: </div>
- Table row: Mode token | Use
- Table row: `background`, `foreground` | Main application canvas and text
- Table row: `card`, `card-foreground` | Card surfaces and content
- Table row: `popover`, `popover-foreground` | Dropdowns, menus, popovers
- Table row: `primary`, `primary-foreground` | Primary actions and text/icons on them
- Table row: `secondary`, `secondary-foreground` | Lower-emphasis actions
- Table row: `muted`, `muted-foreground` | Subdued surfaces and captions
- Table row: `accent`, `accent-foreground` | Active, hover, or focused items
- Table row: `destructive`, `destructive-foreground` | Error and deletion actions
- Table row: `border`, `input`, `ring` | Default borders, form borders, and focus indicators
- Table row: `chart-1` through `chart-5` | Data visualization colors
- Table row: `sidebar-*` | Sidebar surfaces, text, active items, borders, and focus rings
- For alpha fills and strokes, use Tailwind slash opacity with Mode tokens, for example `bg-muted/90`, `border-destructive/40`, or `ring-ring/50`.

### Usage: Custom Collection

- The shadcndesign Pro **Custom** collection covers reusable heading, section, spacing, and layout variables. This package exposes the implemented subset as CSS custom properties:
- Code line: .landing-section {
- Code line: padding-block: var(--section-padding-y);
- Code line: .landing-heading {
- Code line: font-size: var(--heading-xl-font-size);
- Code line: line-height: var(--heading-xl-line-height);
- Code line: font-weight: var(--heading-xl-font-weight);
- Code line: letter-spacing: var(--heading-xl-letter-spacing);
- Common Custom-style tokens include:
- `container-padding-x`
- `section-padding-y`
- `section-gap-xl`, `section-gap-lg`, `section-gap-md`, `section-gap-sm`
- `heading-xl-*`, `heading-lg-*`, `heading-md-*`, `heading-sm-*`
- `paragraph-*`, `description-*`, `label-*`

### Usage: Import TypeScript

- Code line: import { light, dark, primitives, generateCSS } from "@ariaui-web/tokens";
- Code line: // Access token values programmatically
- Code line: console.log(light["background"]); // "var(--color-white)"
- Code line: console.log(dark["background"]); // "var(--color-neutral-950)"
- Code line: console.log(primitives.zinc[500]); // "55.2% 0.014 286"
- Code line: // Generate CSS at build time
- Code line: const css = generateCSS();

### Overriding Tokens

- **Critical**: Overrides **must go outside `@layer`** blocks to win over `tokens.css`.
- yes **Correct**:
- Code line: /* globals.css */
- Code line: @import "@ariaui-web/tokens/dist/tokens.css";
- Code line: /* Override a Mode token globally */
- Code line: :root {
- Code line: --primary: oklch(45% 0.18 260 / 1);
- Code line: --primary-hover: oklch(39% 0.18 260 / 1);
- Code line: --primary-foreground: oklch(100% 0 0 / 1);
- Code line: .dark {
- Code line: --primary: oklch(72% 0.14 260 / 1);
- Code line: --primary-hover: oklch(78% 0.13 260 / 1);
- Code line: @layer base {
- Code line: /* Style rules here (not token overrides!) */
- Code line: body {
- Code line: font-family: system-ui;
- no **Wrong** (will not apply):
- Code line: --primary: oklch(45% 0.18 260 / 1); /* LOSES to tokens.css */
- **Why?** `tokens.css` is unlayered. CSS layers have **lower specificity** than unlayered styles, so layered overrides are ignored.

### Overriding Composites

- Code line: :root {
- Code line: /* Change focus ring style */
- Code line: --focus-ring: 0 0 0 4px oklch(var(--focus-ring-color) / 0.3);
- Code line: /* Adjust shadow depth */
- Code line: --shadow-lg: 0px 16px 24px -6px var(--shadow-lg-depth-1);

### Troubleshooting

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Colors look wrong / white / black

- **Cause**: Lightness value missing `%` in primitives.
- Code line: // no WRONG
- Code line: zinc: { 500: "55.2 0.014 286" } // Browser treats 55.2 as absolute (clamps to 1 = white)
- Code line: // yes CORRECT
- Code line: zinc: { 500: "55.2% 0.014 286" }
- **Fix**: Always include `%` on the `L` channel.

### Token overrides not applying

- **Cause**: Overrides inside `@layer` block.
- **Fix**: Move token overrides outside `@layer` (see [Consumer Guide](#overriding-tokens)).

### Missing @theme entry for new token

- **Cause**: Token key not recognized as a color token, or not in `PASSTHROUGH_PREFIXES`.
- **Fix**:
- For color tokens: Ensure the key doesn't match any non-color exclusion pattern in `css.ts` (border radius, spacing, shadow-depth, ring)
- For pass-through tokens: Add prefix to `PASSTHROUGH_PREFIXES` in `css.ts`
- For composites: Add explicit entry to `SHADOW_COMPOSITES` or update `FOCUS_RING_TEMPLATE`

### Dark mode not applying

- **Causes**:
- Missing `.dark` class on root element
- Token exists in `light` but not in `dark` (no override = inherits light value)
- **Fixes**:
- Ensure dark mode class is applied: `<html class="dark">`
- Add dark override in `semantic.ts` if color should change

### Build fails after editing tokens

- **Common errors**:
- **TypeScript errors**: Run `pnpm --filter=@ariaui-web/tokens build` to see full error
- **Test failures**: Run `pnpm --filter=@ariaui-web/tokens test` to validate structure
- **Forgot to rebuild CSS**: Always run build after editing TypeScript files

### Performance: Too many CSS variables

- **Not a problem**: Modern browsers handle thousands of CSS custom properties efficiently. The current token set (~400 variables) has negligible performance impact.

### Best Practices

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### DO yes

- **Use semantic tokens** in component styles (not primitives directly)
- **Reference primitives via `var()`** in semantic tokens
- **Include `%` on lightness** in primitive OKLCH values
- **Test after changes**: Run tests and rebuild CSS before committing
- **Commit `dist/tokens.css`**: It's a build artifact but must be in version control
- **Document breaking changes** in Changesets entries
- **Follow the naming pattern**: `{intent}[-{modifier}]` (flat shadcn-style vocabulary)

### DON'T no

- **Don't use raw hex/rgb values** in `semantic.ts`
- **Don't duplicate shared tokens** (radius, spacing) in `dark` map
- **Don't override tokens inside `@layer` blocks**
- **Don't forget the `%` on lightness** in OKLCH values
- **Don't manually edit `dist/tokens.css`** (it's auto-generated)
- **Don't skip tests** when adding/changing tokens
- **Don't create arbitrary token names** - follow the established naming patterns

### Appendix

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Complete Primitive Scale List

- Neutrals: `zinc`, `neutral`, `slate`, `gray`, `stone`, `taupe`, `mauve`, `mist`, `olive` (9)
- Brand/Purple: `brand`, `violet`, `purple`, `fuchsia`, `pink`, `rose` (6)
- Warm: `red`, `orange`, `amber`, `yellow` (4)
- Cool: `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo` (8)
- **Total**: 27 scales, plus `base.white` and `base.black`

### Semantic Token Count

- **Light**: ~200 tokens (full set)
- **Dark**: ~150 tokens (color overrides only)
- **Total CSS variables**: ~400 (resolved semantic values + shared utility tokens + composites)

### Version History

- Table row: Version | Date | Changes
- Table row: v0.1.0 | - | Initial release with two-tier system
- Table row: v0.2.0 | - | Major design token update
- Table row: v0.2.1 | - | Update padding tokens
- Table row: v0.2.2 | - | Fix token naming conventions
- Table row: v0.3.0 | 2026-04-11 | Flat shadcn-style token vocabulary; simplified `--color-*` @theme mapping

### Related Documentation

- **Source Reference**: <https://www.shadcndesign.com/docs/variables> - variable collection model and Figma limitations
- **Consumer Guide**: `docs/design-tokens-guide.md` - project-level usage and overrides
- **Tests**: `__test__/` - validation rules and examples
- **Last Updated**: 2026-05-07
- **Maintainer**: Aria UI Team

### Migration: v0.2 -> v0.3

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Class Name Changes

- Table row: Old Tailwind class | New Tailwind class
- Table row: `bg-primary-default` | `bg-background`
- Table row: `bg-primary-default/90` | `bg-background/90`
- Table row: `text-primary-default` | `text-foreground`
- Table row: `text-secondary-default` | `text-muted-foreground`
- Table row: `text-tertiary-default` | `text-muted-foreground`
- Table row: `text-fg-tertiary-default` | `text-icon-tertiary`
- Table row: `text-fg-secondary-default` | `text-icon-secondary`
- Table row: `text-fg-primary-default` | `text-icon`
- Table row: `bg-secondary-default` | `bg-secondary`
- Table row: `hover:bg-secondary-hover` | `hover:bg-accent-hover`
- Table row: `bg-tertiary-default` | `bg-muted`
- Table row: `border-primary-default` | `border-border`
- Table row: `border-secondary-default` | `border-border-secondary`
- Table row: `bg-brand-solid-default` | `bg-brand`
- Table row: `hover:bg-brand-solid-hover` | `hover:bg-brand-hover`
- Table row: `bg-primary-solid` | `bg-primary`
- Table row: `text-brand-secondary-default` | `text-brand`
- Table row: `bg-warning-secondary-default` | `bg-warning`

### CSS Variable Changes

- All semantic tokens now use flat names. The `--bg-`, `--text-`, `--fg-`, and `--border-` prefix families from v0.2 are replaced:
- Table row: Old CSS variable | New CSS variable
- Table row: `--bg-primary-default` | `--background`
- Table row: `--bg-secondary-default` | `--secondary`
- Table row: `--bg-tertiary-default` | `--muted`
- Table row: `--bg-primary-solid` | `--primary`
- Table row: `--bg-brand-solid-default` | `--brand`
- Table row: `--bg-warning-secondary-default` | `--warning`
- Table row: `--text-primary-default` | `--foreground`
- Table row: `--text-secondary-default` | `--muted-foreground`
- Table row: `--text-tertiary-default` | `--muted-foreground`
- Table row: `--text-brand-secondary-default` | `--brand`
- Table row: `--text-warning-primary-default` | `--warning-foreground`
- Table row: `--fg-primary-default` | `--icon`
- Table row: `--fg-secondary-default` | `--icon-secondary`
- Table row: `--fg-tertiary-default` | `--icon-tertiary`
- Table row: `--border-primary-default` | `--border`
- Table row: `--border-secondary-default` | `--border-secondary`
- Table row: `--bg-secondary-hover` | `--accent-hover`






## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
