# Progress

A headless, accessible progressbar with ARIA state and a CSS-variable-driven indicator.

## Features

- **Accessible progress semantics**
- **Human-readable value text**
- **CSS variable driven indicator**
- **Stateful data attributes**
- **Fully composable**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/progress
```

```bash [pnpm]
pnpm add @ariaui-web/progress
```

```bash [yarn]
yarn add @ariaui-web/progress
```

:::

### Register Elements

```ts
import { defineProgressElements } from "@ariaui-web/progress";

defineProgressElements();
```

## Examples

The examples use the same content and interaction patterns as the source Aria UI Progress page with browser-native custom elements.

### Uncontrolled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="progress" data-example-variant="uncontrolled">
<div class="ariaui-web-progress-stage w-full max-w-sm space-y-3">
  <div class="ariaui-web-progress-label-row flex items-center justify-between text-sm text-foreground">
    <span>Storage space</span>
    <span class="ariaui-web-progress-value font-medium text-muted-foreground">64%</span>
  </div>
  <aria-progress data-example-part="Root" aria-label="Storage space" default-value="64" value-text="64% complete" class="ariaui-web-progress-track relative h-2 w-full overflow-hidden rounded-full bg-muted">
    <aria-progress-indicator data-example-part="Indicator" class="ariaui-web-progress-indicator h-full bg-foreground"></aria-progress-indicator>
  </aria-progress>
</div>
</div>

```html
<div class="ariaui-web-progress-stage w-full max-w-sm space-y-3">
  <div class="ariaui-web-progress-label-row flex items-center justify-between text-sm text-foreground">
    <span>Storage space</span>
    <span class="ariaui-web-progress-value font-medium text-muted-foreground">64%</span>
  </div>
  <aria-progress data-example-part="Root" aria-label="Storage space" default-value="64" value-text="64% complete" class="ariaui-web-progress-track relative h-2 w-full overflow-hidden rounded-full bg-muted">
    <aria-progress-indicator data-example-part="Indicator" class="ariaui-web-progress-indicator h-full bg-foreground"></aria-progress-indicator>
  </aria-progress>
</div>
```

### Controlled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="progress" data-example-variant="controlled">
<div class="ariaui-web-progress-stage w-full max-w-sm space-y-3" data-progress-example="controlled">
  <div class="ariaui-web-progress-label-row flex items-center justify-between text-sm text-foreground">
    <span>Upload progress</span>
    <span class="ariaui-web-progress-value font-medium text-muted-foreground" data-progress-value>35%</span>
  </div>
  <aria-progress data-example-part="Root" aria-label="Upload progress" value="35" value-text="35% complete" class="ariaui-web-progress-track relative h-2 w-full overflow-hidden rounded-full bg-muted">
    <aria-progress-indicator data-example-part="Indicator" class="ariaui-web-progress-indicator h-full bg-foreground"></aria-progress-indicator>
  </aria-progress>
  <div class="ariaui-web-progress-controls flex items-center gap-2">
    <aria-button type="button" data-progress-action="decrease" class="ariaui-web-progress-button inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted">Decrease</aria-button>
    <aria-button type="button" data-progress-action="increase" class="ariaui-web-progress-button inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted">Increase</aria-button>
  </div>
</div>
</div>

```html
<div class="ariaui-web-progress-stage w-full max-w-sm space-y-3" data-progress-example="controlled">
  <div class="ariaui-web-progress-label-row flex items-center justify-between text-sm text-foreground">
    <span>Upload progress</span>
    <span class="ariaui-web-progress-value font-medium text-muted-foreground" data-progress-value>35%</span>
  </div>
  <aria-progress data-example-part="Root" aria-label="Upload progress" value="35" value-text="35% complete" class="ariaui-web-progress-track relative h-2 w-full overflow-hidden rounded-full bg-muted">
    <aria-progress-indicator data-example-part="Indicator" class="ariaui-web-progress-indicator h-full bg-foreground"></aria-progress-indicator>
  </aria-progress>
  <div class="ariaui-web-progress-controls flex items-center gap-2">
    <aria-button type="button" data-progress-action="decrease" class="ariaui-web-progress-button inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted">Decrease</aria-button>
    <aria-button type="button" data-progress-action="increase" class="ariaui-web-progress-button inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted">Increase</aria-button>
  </div>
</div>
```

## Anatomy

```html
<aria-progress>
  <aria-progress-indicator></aria-progress-indicator>
</aria-progress>
```

## API Reference

### Root

| API | Type | Description |
| --- | --- | --- |
| Default role | `progressbar` | Exposes progress semantics on the custom element host. |
| `value` | `number` | Controlled current progress value. |
| `default-value` | `number` | Initial uncontrolled progress value. |
| `min` | `number` | Minimum range value. Defaults to `0`. |
| `max` | `number` | Maximum range value. Defaults to `100`. |
| `value-text` | `string` | Optional human-readable value text mapped to `aria-valuetext`. |

### Indicator

| API | Type | Description |
| --- | --- | --- |
| `--progress-value` | CSS percentage | Computed percentage inherited from the nearest Root. |
| `width` | `var(--progress-value)` | Inline width synchronized from Root state. |

## Accessibility

Progress follows the [WAI-ARIA Meter/Progressbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/):

- `Root` renders with `role="progressbar"` and publishes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` from the `value`, `min`, and `max` attributes.
- Provide `value-text` when the raw number is not meaningful on its own, for example `"Step 3 of 5"` or `"45 seconds remaining"`. This maps to `aria-valuetext`.
- Pair the progressbar with a visible label and associate it via `aria-labelledby`, or use `aria-label` when the label lives outside the document flow.
- Indeterminate progress is outside the native Progress contract. Omit `aria-valuenow` yourself and style the Indicator with your own animation when the value is unknown.
- The component is non-interactive and does not receive focus, matching the ARIA specification.
