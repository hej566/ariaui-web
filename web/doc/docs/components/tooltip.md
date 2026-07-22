# Tooltip

A positioned descriptive surface shown on hover or focus. The trigger keeps focus and the tooltip is exposed through `aria-describedby`.

## Features

- **Hover and focus open**
- **Delayed close with hover bridge**
- **Escape to dismiss**
- **Portalled tooltip content**
- **Placement-aware state hooks**
- **Optional arrow**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/tooltip
```

```bash [pnpm]
pnpm add @ariaui-web/tooltip
```

```bash [yarn]
yarn add @ariaui-web/tooltip
```

:::

```ts
import { defineTooltipElements } from "@ariaui-web/tooltip";

defineTooltipElements();
```

## Examples

The examples use the same component states, Tailwind composition, and interaction patterns as the Aria UI Tooltip page.

### Uncontrolled

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="tooltip" data-example-variant="uncontrolled">
  <aria-tooltip placement="top" offset="8" data-example-part="Root">
    <aria-tooltip-trigger class="ariaui-web-tooltip-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-secondary disabled:bg-muted disabled:text-muted-foreground" data-example-part="Trigger">Hover me</aria-tooltip-trigger>
    <aria-tooltip-content arrow class="ariaui-web-tooltip-content z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md" data-example-part="Content">This is a tooltip</aria-tooltip-content>
  </aria-tooltip>
</div>

```html
<aria-tooltip placement="top" offset="8">
  <aria-tooltip-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Hover me</aria-tooltip-trigger>
  <aria-tooltip-content arrow class="z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md">This is a tooltip</aria-tooltip-content>
</aria-tooltip>
```

### Controlled

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="tooltip" data-example-variant="controlled">
  <aria-tooltip placement="bottom" offset="8" data-example-part="Root">
    <aria-tooltip-trigger class="ariaui-web-tooltip-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-secondary disabled:bg-muted disabled:text-muted-foreground" data-example-part="Trigger">Controlled Tooltip</aria-tooltip-trigger>
    <aria-tooltip-content arrow class="ariaui-web-tooltip-content z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md" data-example-part="Content">Tooltip is Open</aria-tooltip-content>
  </aria-tooltip>
</div>

```html
<aria-tooltip placement="bottom" offset="8">
  <aria-tooltip-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Controlled Tooltip</aria-tooltip-trigger>
  <aria-tooltip-content arrow class="z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md">Tooltip is Open</aria-tooltip-content>
</aria-tooltip>
```

### Framer Motion

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="tooltip" data-example-variant="framer-motion">
  <aria-tooltip placement="top" offset="8" data-example-part="Root">
    <aria-tooltip-trigger class="ariaui-web-tooltip-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-secondary disabled:bg-muted disabled:text-muted-foreground" data-example-part="Trigger">Motion Tooltip</aria-tooltip-trigger>
    <aria-tooltip-content arrow native-composition data-example-part="Content"><div class="ariaui-web-tooltip-content z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md">Animated with Framer Motion</div></aria-tooltip-content>
  </aria-tooltip>
</div>

```html
<aria-tooltip placement="top" offset="8">
  <aria-tooltip-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Motion Tooltip</aria-tooltip-trigger>
  <aria-tooltip-content arrow native-composition>
    <div class="z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md">Animated with Framer Motion</div>
  </aria-tooltip-content>
</aria-tooltip>
```

## Anatomy

```html
<aria-tooltip>
  <aria-tooltip-trigger>Trigger</aria-tooltip-trigger>
  <aria-tooltip-content>Content</aria-tooltip-content>
</aria-tooltip>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `open` | `false` | Controls whether the tooltip is open. |
| `default-open` / `defaultOpen` | `false` | Sets the initial uncontrolled state. |
| `placement` | `top` | Requests the preferred side and alignment. |
| `offset` | `5` | Sets the distance from the trigger in pixels. |
| `onOpenChange` | `null` | Receives requested open-state changes. |

### Trigger

| Attribute | Default | Description |
| --- | --- | --- |
| `hover` | `true` | Set to `false` to disable hover opening. |
| `focus` | `true` | Set to `false` to disable focus opening. |
| `native-composition` | `false` | Uses the first child as the interactive trigger. |

### Content

| Attribute | Default | Description |
| --- | --- | --- |
| `arrow` | `false` | Renders a placement-aware arrow. |
| `arrow-class` | unset | Adds classes to the generated arrow. |
| `native-composition` | `false` | Uses the first child as the positioned tooltip. |

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>Tab</kbd> | Focuses the trigger and opens the tooltip. |
| <kbd>Shift+Tab</kbd> | Moves focus normally; blur closes the tooltip. |
| <kbd>Escape</kbd> | Closes the tooltip without moving focus. |

## Accessibility

Tooltip follows the WAI-ARIA APG Tooltip pattern. Content receives `role="tooltip"` and an ID referenced by the trigger through `aria-describedby` while open. Focus stays on the trigger and tooltip content never enters the tab order.

Keep tooltip content short and non-interactive. Use Popover or Hover Card when users must interact with the surface, and do not place essential information only in a tooltip.
