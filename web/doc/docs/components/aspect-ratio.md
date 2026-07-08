# Aspect Ratio

Displays content within a desired width-to-height ratio.

## Features

- **Any ratio**
- **Any content**
- **No layout shift**
- **Style passthrough**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/aspect-ratio
```

```bash [pnpm]
pnpm add @ariaui-web/aspect-ratio
```

```bash [yarn]
yarn add @ariaui-web/aspect-ratio
```

:::

### Register Elements

```ts
import { defineAspectRatioElements } from "@ariaui-web/aspect-ratio";

defineAspectRatioElements();
```

## Examples

The live examples below are native custom element entries for the `aspect-ratio` page.

### 16 : 9

<div class="ariaui-web-preview flex w-full justify-center bg-background p-12" data-component="aspect-ratio" data-example-variant="widescreen">
  <div class="ariaui-web-aspect-ratio-frame">
    <aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="16 / 9">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 16:9 frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 16:9 frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
  </div>
</div>

```html
<aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="16 / 9">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 16:9 frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 16:9 frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
```

### 21 : 9

<div class="ariaui-web-preview flex w-full justify-center bg-background p-12" data-component="aspect-ratio" data-example-variant="cinematic">
  <div class="ariaui-web-aspect-ratio-frame">
    <aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="21 / 9">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 21:9 cinematic frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 21:9 cinematic frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
  </div>
</div>

```html
<aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="21 / 9">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 21:9 cinematic frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 21:9 cinematic frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
```

### 4 : 3

<div class="ariaui-web-preview flex w-full justify-center bg-background p-12" data-component="aspect-ratio" data-example-variant="classic">
  <div class="ariaui-web-aspect-ratio-frame">
    <aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="4 / 3">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 4:3 frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 4:3 frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
  </div>
</div>

```html
<aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="4 / 3">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 4:3 frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 4:3 frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
```

### 1 : 1

<div class="ariaui-web-preview flex w-full justify-center bg-background p-12" data-component="aspect-ratio" data-example-variant="square">
  <div class="ariaui-web-aspect-ratio-frame">
    <aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="1">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in a square frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in a square frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
  </div>
</div>

```html
<aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="1">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in a square frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in a square frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
```

### 9 : 16

<div class="ariaui-web-preview flex w-full justify-center bg-background p-12" data-component="aspect-ratio" data-example-variant="portrait">
  <div class="ariaui-web-aspect-ratio-frame">
    <aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="9 / 16">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 9:16 portrait frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 9:16 portrait frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
  </div>
</div>

```html
<aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="9 / 16">
    <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient in 9:16 portrait frame" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="Colorful abstract gradient in 9:16 portrait frame" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>
```

## Anatomy

```html
<aria-aspect-ratio ratio="16 / 9">
  <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient">
</aria-aspect-ratio>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-aspect-ratio` | none |

## API Reference

The package-level native contract lives in `packages/aspect-ratio/readme.md`.

### Root

- Element: `aria-aspect-ratio`
- Supports `ratio` as a positive number, slash value such as `16 / 9`, colon value such as `16:9`, or decimal string.
- Falls back to `1` for missing, invalid, zero, negative, or non-finite ratios.
- Applies a private ratio shell with an absolutely positioned fill layer so children keep the requested width-to-height ratio.
- Supports `native-composition` to use the first child element as the fill host while preserving the ratio shell.
- Does not add a default ARIA role, focus behavior, keyboard behavior, `data-state`, `data-ratio`, or `data-slot`.

## Accessibility

Aspect Ratio is a layout primitive and does not add roles or keyboard behavior by default.

Use semantic children inside `aria-aspect-ratio`, such as descriptive `alt` text for images or labelled interactive content when the child itself is interactive.
