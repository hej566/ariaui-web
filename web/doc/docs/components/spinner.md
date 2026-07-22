# Spinner

An accessible loading status primitive with inline SVG and native composition support.

## Features

- **Accessible loading status**
- **Inline SVG fallback**
- **Current color styling**
- **Decorative mode**
- **Native composition**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/spinner
```

```bash [pnpm]
pnpm add @ariaui-web/spinner
```

```bash [yarn]
yarn add @ariaui-web/spinner
```

:::

```ts
import { defineSpinnerElements } from "@ariaui-web/spinner";

defineSpinnerElements();
```

## Examples

The examples use the same loading states, SVG artwork, and Tailwind CSS composition as the Aria UI Spinner page.

### Default

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="spinner" data-example-variant="default">
  <div class="ariaui-web-spinner-card flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 text-sm shadow-sm">
    <aria-spinner aria-label="Loading workspace" class="ariaui-web-spinner-root size-6 text-foreground" data-example-part="Root"></aria-spinner>
    <span class="ariaui-web-spinner-muted text-muted-foreground">Loading workspace</span>
  </div>
</div>

```html
<div class="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 text-sm shadow-sm">
  <aria-spinner aria-label="Loading workspace" class="size-6 text-foreground"></aria-spinner>
  <span class="text-muted-foreground">Loading workspace</span>
</div>
```

### Custom SVG

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="spinner" data-example-variant="custom-svg">
  <aria-spinner native-composition aria-label="Syncing workspace" class="ariaui-web-spinner-root size-6 text-foreground" data-example-part="Root">
    <svg class="ariaui-web-spinner-svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.2" stroke-width="2"></circle>
      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-linecap="round" stroke-width="2">
        <animateTransform attributeName="transform" dur="0.8s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform>
      </path>
    </svg>
  </aria-spinner>
</div>

```html
<aria-spinner native-composition aria-label="Syncing workspace" class="size-6 text-foreground">
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.2" stroke-width="2"></circle>
    <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-linecap="round" stroke-width="2">
      <animateTransform attributeName="transform" dur="0.8s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform>
    </path>
  </svg>
</aria-spinner>
```

### Heroicon

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="spinner" data-example-variant="heroicon">
  <div class="ariaui-web-spinner-card flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 text-sm shadow-sm">
    <aria-spinner native-composition aria-hidden="false" aria-label="Refreshing data" class="ariaui-web-spinner-root ariaui-web-spinner-spin size-6 animate-spin text-foreground" data-example-part="Root">
      <svg class="ariaui-web-spinner-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992V4.356M2.985 19.644v-4.992h4.992m0 0a8.25 8.25 0 0 0 13.038-3.306M2.985 12.654a8.25 8.25 0 0 1 13.038-3.306"></path>
      </svg>
    </aria-spinner>
    <span class="ariaui-web-spinner-muted text-muted-foreground">Refreshing data</span>
  </div>
</div>

```html
<div class="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 text-sm shadow-sm">
  <aria-spinner native-composition aria-hidden="false" aria-label="Refreshing data" class="size-6 animate-spin text-foreground">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992V4.356M2.985 19.644v-4.992h4.992m0 0a8.25 8.25 0 0 0 13.038-3.306M2.985 12.654a8.25 8.25 0 0 1 13.038-3.306"></path>
    </svg>
  </aria-spinner>
  <span class="text-muted-foreground">Refreshing data</span>
</div>
```

### Framer Motion

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="spinner" data-example-variant="framer-motion">
  <div class="ariaui-web-spinner-card flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 text-sm shadow-sm">
    <aria-spinner native-composition aria-label="Syncing metrics" class="ariaui-web-spinner-root size-7 text-foreground" data-example-part="Root">
      <svg class="ariaui-web-spinner-svg" data-spinner-motion viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.18" stroke-width="2"></circle>
        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
      </svg>
    </aria-spinner>
    <span class="ariaui-web-spinner-muted text-muted-foreground">Syncing metrics</span>
  </div>
</div>

```html
<div class="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 text-sm shadow-sm">
  <aria-spinner native-composition aria-label="Syncing metrics" class="size-7 text-foreground">
    <svg data-spinner-motion viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.18" stroke-width="2"></circle>
      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
    </svg>
  </aria-spinner>
  <span class="text-muted-foreground">Syncing metrics</span>
</div>
```

The Framer Motion example imports `animate` from `framer-motion/dom` in the documentation theme. The Spinner package has no Framer Motion dependency.

## Anatomy

```html
<aria-spinner></aria-spinner>
```

Use `native-composition` when a custom SVG should become the effective status host.

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `role` | `status` | Announces the loading state politely. Consumer-authored roles are preserved. |
| `aria-label` | `Loading` | Provides the status with an accessible name. |
| `aria-hidden` | unset | Removes default status semantics when set to `true`. |
| `native-composition` | `false` | Merges Spinner classes, styles, attributes, and semantics onto the first element child. |

Without authored children, Root renders a `currentColor` SVG spinner with a `0 0 24 24` view box and `1em` dimensions.

## Accessibility

`aria-spinner` exposes `role="status"` and `aria-label="Loading"` by default so loading state changes can be announced politely.

Use a specific `aria-label` such as `"Saving"` or `"Loading messages"` when a page can show more than one loading indicator. When nearby visible text already communicates the pending state, set `aria-hidden="true"` so the spinner is decorative.
