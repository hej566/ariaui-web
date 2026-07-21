# Separator

A semantic or decorative divider for separating content.

## Features

- **Semantic or decorative**
- **Horizontal and vertical orientation**
- **`data-orientation` styling hooks**
- **`native-composition` child composition**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/separator
```

```bash [pnpm]
pnpm add @ariaui-web/separator
```

```bash [yarn]
yarn add @ariaui-web/separator
```

:::

```ts
import { defineSeparatorElements } from "@ariaui-web/separator";

defineSeparatorElements();
```

## Examples

### Horizontal

<div class="ariaui-web-preview flex w-full justify-center px-6 py-6" data-component="separator" data-example-variant="horizontal">
  <div class="ariaui-web-separator-horizontal-card w-full max-w-sm rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
    <div>
      <h4 class="ariaui-web-separator-title font-medium text-foreground">Account</h4>
      <p class="ariaui-web-separator-description mt-1 text-muted-foreground">Manage profile settings.</p>
    </div>
    <aria-separator class="ariaui-web-separator-horizontal my-4 h-px w-full bg-border" data-example-part="Root"></aria-separator>
    <div>
      <h4 class="ariaui-web-separator-title font-medium text-foreground">Security</h4>
      <p class="ariaui-web-separator-description mt-1 text-muted-foreground">Update passwords and sessions.</p>
    </div>
  </div>
</div>

```html
<div class="ariaui-web-separator-horizontal-card w-full max-w-sm rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
  <div>
    <h4 class="ariaui-web-separator-title font-medium text-foreground">Account</h4>
    <p class="ariaui-web-separator-description mt-1 text-muted-foreground">Manage profile settings.</p>
  </div>
  <aria-separator class="ariaui-web-separator-horizontal my-4 h-px w-full bg-border" data-example-part="Root"></aria-separator>
  <div>
    <h4 class="ariaui-web-separator-title font-medium text-foreground">Security</h4>
    <p class="ariaui-web-separator-description mt-1 text-muted-foreground">Update passwords and sessions.</p>
  </div>
</div>
```

### Vertical

<div class="ariaui-web-preview flex w-full justify-center px-6 py-6" data-component="separator" data-example-variant="vertical">
  <div class="ariaui-web-separator-vertical-card flex h-12 items-center gap-4 rounded-lg border border-border bg-card px-4 text-sm shadow-sm">
    <span class="ariaui-web-separator-strong font-medium text-foreground">Docs</span>
    <aria-separator orientation="vertical" class="ariaui-web-separator-vertical h-6 w-px bg-border" data-example-part="Root"></aria-separator>
    <span class="ariaui-web-separator-muted text-muted-foreground">Components</span>
    <aria-separator orientation="vertical" decorative class="ariaui-web-separator-vertical h-6 w-px bg-border" data-example-part="Root"></aria-separator>
    <span class="ariaui-web-separator-muted text-muted-foreground">API</span>
  </div>
</div>

```html
<div class="ariaui-web-separator-vertical-card flex h-12 items-center gap-4 rounded-lg border border-border bg-card px-4 text-sm shadow-sm">
  <span class="ariaui-web-separator-strong font-medium text-foreground">Docs</span>
  <aria-separator orientation="vertical" class="ariaui-web-separator-vertical h-6 w-px bg-border" data-example-part="Root"></aria-separator>
  <span class="ariaui-web-separator-muted text-muted-foreground">Components</span>
  <aria-separator orientation="vertical" decorative class="ariaui-web-separator-vertical h-6 w-px bg-border" data-example-part="Root"></aria-separator>
  <span class="ariaui-web-separator-muted text-muted-foreground">API</span>
</div>
```

## Anatomy

```html
<aria-separator></aria-separator>
```

Use `native-composition` to apply Separator attributes and semantics to a first child host:

```html
<aria-separator native-composition>
  <hr>
</aria-separator>
```

## API Reference

### Root

| Attribute | Default | Description |
| --- | --- | --- |
| `orientation` | `horizontal` | Sets `horizontal` or `vertical` orientation. Invalid values fall back to `horizontal`. |
| `decorative` | `false` | Uses `role="none"` and removes separator orientation semantics. |
| `native-composition` | `false` | Applies merged classes, styles, attributes, and semantics to the first child element. |
| `data-orientation` | `horizontal` | Reflected effective orientation for styling. |

## Accessibility

`aria-separator` renders `role="separator"` by default. Horizontal separators use the ARIA default orientation, while vertical separators expose `aria-orientation="vertical"`.

Use semantic separators when the divider communicates document or interface structure. Use `decorative` when the line is only visual decoration; decorative separators render with `role="none"`.

> If a separator only supports spacing, borders, or visual grouping that nearby text already communicates, set `decorative` so it does not add extra structure to the accessibility tree.
