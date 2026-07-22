# Spinbutton

A headless, accessible spinbutton with keyboard support, configurable step, and bounded increment and decrement controls.

## Features

- **Keyboard support**
- **Controlled or uncontrolled state**
- **Bounded min and max**
- **Configurable step**
- **Headless composition**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/spinbutton
```

```bash [pnpm]
pnpm add @ariaui-web/spinbutton
```

```bash [yarn]
yarn add @ariaui-web/spinbutton
```

:::

```ts
import { defineSpinbuttonElements } from "@ariaui-web/spinbutton";

defineSpinbuttonElements();
```

## Examples

### Default

<div class="ariaui-web-preview" data-component="spinbutton" data-example-variant="default">
  <aria-spinbutton class="ariaui-web-spinbutton-root" default-value="10" min="0" max="100" aria-label="Quantity" data-example-part="Root">
    <aria-spinbutton-decrement class="ariaui-web-spinbutton-control" aria-label="Decrease" data-example-part="Decrement"><span aria-hidden="true">−</span><span class="sr-only">Decrease</span></aria-spinbutton-decrement>
    <aria-spinbutton-input class="ariaui-web-spinbutton-input" aria-label="Quantity" data-example-part="Input"></aria-spinbutton-input>
    <aria-spinbutton-increment class="ariaui-web-spinbutton-control" aria-label="Increase" data-example-part="Increment"><span aria-hidden="true">+</span><span class="sr-only">Increase</span></aria-spinbutton-increment>
  </aria-spinbutton>
</div>

```html
<aria-spinbutton default-value="10" min="0" max="100" aria-label="Quantity" class="flex items-center gap-2">
  <aria-spinbutton-decrement aria-label="Decrease" class="flex h-9 w-9 items-center justify-center rounded-md border border-border/20 bg-background/90 text-foreground shadow-sm backdrop-blur-xl hover:bg-accent disabled:pointer-events-none disabled:opacity-50">
    <span aria-hidden="true">−</span>
    <span class="sr-only">Decrease</span>
  </aria-spinbutton-decrement>
  <aria-spinbutton-input aria-label="Quantity" class="flex h-9 w-16 items-center justify-center rounded-md border border-border/20 bg-background/90 text-center text-sm font-medium text-foreground backdrop-blur-xl"></aria-spinbutton-input>
  <aria-spinbutton-increment aria-label="Increase" class="flex h-9 w-9 items-center justify-center rounded-md border border-border/20 bg-background/90 text-foreground shadow-sm backdrop-blur-xl hover:bg-accent disabled:pointer-events-none disabled:opacity-50">
    <span aria-hidden="true">+</span>
    <span class="sr-only">Increase</span>
  </aria-spinbutton-increment>
</aria-spinbutton>
```

## Anatomy

```html
<aria-spinbutton>
  <aria-spinbutton-decrement></aria-spinbutton-decrement>
  <aria-spinbutton-input></aria-spinbutton-input>
  <aria-spinbutton-increment></aria-spinbutton-increment>
</aria-spinbutton>
```

## API Reference

### Root

Spinbutton container. Manages the current value, keyboard shortcuts, and child state.

| Attribute / event | Default | Description |
| --- | --- | --- |
| `value` | - | Controlled current value. Listen for `valuechange` and write the next value back. |
| `default-value` | `min` or `0` | Initial value for uncontrolled usage. |
| `min` | `Number.MIN_SAFE_INTEGER` | Lower bound. Home moves to this value. |
| `max` | `Number.MAX_SAFE_INTEGER` | Upper bound. End moves to this value. |
| `step` | `1` | Arrow and control increment. Page keys use ten times this value. |
| `disabled` | `false` | Disables Input, Increment, and Decrement. |
| `value-text-prefix` | - | Prefix for generated `aria-valuetext`. |
| `value-text-suffix` | - | Suffix for generated `aria-valuetext`. |
| `valuechange` | - | Bubbling event with `event.detail.value`. |
| `role` | `group` | Groups the input and controls. |

### Input

Displays the current value and exposes complete spinbutton semantics.

| Attribute | Description |
| --- | --- |
| `role` | `spinbutton` |
| `aria-valuenow` | Current numeric value. |
| `aria-valuemin` | Minimum value. |
| `aria-valuemax` | Maximum value. |
| `aria-valuetext` | Optional formatted value. |
| `aria-disabled` | `true` when disabled. |

### Increment

Button that increases the value by `step`. It is removed from the tab order and disabled at the maximum.

### Decrement

Button that decreases the value by `step`. It is removed from the tab order and disabled at the minimum.

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>Arrow Up</kbd> | Increase by `step`. |
| <kbd>Arrow Down</kbd> | Decrease by `step`. |
| <kbd>Page Up</kbd> | Increase by `step × 10`. |
| <kbd>Page Down</kbd> | Decrease by `step × 10`. |
| <kbd>Home</kbd> | Move to `min`. |
| <kbd>End</kbd> | Move to `max`. |
| <kbd>Tab</kbd> | Move focus into or out of Input. |

## Accessibility

Spinbutton follows the WAI-ARIA spinbutton pattern. Root uses `role="group"`; Input is the only tab stop and exposes `role="spinbutton"`, its current value, bounds, and optional value text. Increment and Decrement use button semantics, carry accessible labels, and leave the tab sequence. When Root is disabled, all parts become non-interactive and Input is removed from the tab order.
