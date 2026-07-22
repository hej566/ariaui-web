# Toggle

A standalone pressed button primitive with controlled and uncontrolled state.

## Features

- **Standalone pressed button**
- **Controlled or uncontrolled state**
- **`aria-pressed` reflection**
- **`data-state` state**
- **Headless primitives**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/toggle
```

```bash [pnpm]
pnpm add @ariaui-web/toggle
```

```bash [yarn]
yarn add @ariaui-web/toggle
```

:::

```ts
import { defineToggleElements } from "@ariaui-web/toggle";

defineToggleElements();
```

## Examples

The examples use the same states, Lucide icon artwork, and Tailwind CSS composition as the Aria UI Toggle page.

### Default

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle" data-example-variant="default">
  <aria-toggle aria-label="Toggle bold" data-example-part="Root" class="ariaui-web-toggle-button group inline-flex size-9 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    <svg class="ariaui-web-toggle-icon size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground group-disabled:text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12h8a4 4 0 0 1 0 8H6Z"></path><path d="M6 4h7a4 4 0 0 1 0 8H6Z"></path></svg>
  </aria-toggle>
</div>

```html
<aria-toggle aria-label="Toggle bold" class="group inline-flex size-9 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
  <svg class="size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground group-disabled:text-muted-foreground/50" aria-hidden="true"><!-- Bold --></svg>
</aria-toggle>
```

### Outline

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle" data-example-variant="outline">
  <aria-toggle aria-label="Toggle italic" data-example-part="Root" class="ariaui-web-toggle-button ariaui-web-toggle-outline group inline-flex size-9 items-center justify-center gap-2 rounded-md border border-input bg-background text-foreground shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    <svg class="ariaui-web-toggle-icon size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg>
  </aria-toggle>
</div>

```html
<aria-toggle aria-label="Toggle italic" class="group inline-flex size-9 items-center justify-center gap-2 rounded-md border border-input bg-background text-foreground shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
  <svg class="size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" aria-hidden="true"><!-- Italic --></svg>
</aria-toggle>
```

### With text

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle" data-example-variant="with-text">
  <aria-toggle aria-label="Toggle italic with text" data-example-part="Root" class="ariaui-web-toggle-button ariaui-web-toggle-with-text group inline-flex h-9 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-2 text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    <svg class="ariaui-web-toggle-icon size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg>
    <span>Italic</span>
  </aria-toggle>
</div>

```html
<aria-toggle aria-label="Toggle italic with text" class="group inline-flex h-9 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-2 text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
  <svg class="size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" aria-hidden="true"><!-- Italic --></svg>
  Italic
</aria-toggle>
```

### Small

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle" data-example-variant="small">
  <aria-toggle aria-label="Toggle italic small" data-example-part="Root" class="ariaui-web-toggle-button ariaui-web-toggle-small group inline-flex size-8 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-1.5 text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    <svg class="ariaui-web-toggle-icon size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg>
  </aria-toggle>
</div>

```html
<aria-toggle aria-label="Toggle italic small" class="group inline-flex size-8 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-1.5 text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
  <svg class="size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" aria-hidden="true"><!-- Italic --></svg>
</aria-toggle>
```

### Large

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle" data-example-variant="large">
  <aria-toggle aria-label="Toggle italic large" data-example-part="Root" class="ariaui-web-toggle-button ariaui-web-toggle-large group inline-flex size-10 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-2.5 text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    <svg class="ariaui-web-toggle-icon size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg>
  </aria-toggle>
</div>

```html
<aria-toggle aria-label="Toggle italic large" class="group inline-flex size-10 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-2.5 text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
  <svg class="size-4 shrink-0 text-icon group-hover:text-accent-foreground group-data-[state=on]:text-accent-foreground" aria-hidden="true"><!-- Italic --></svg>
</aria-toggle>
```

### Disabled

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle" data-example-variant="disabled">
  <aria-toggle disabled aria-label="Toggle underline disabled" data-example-part="Root" class="ariaui-web-toggle-button group inline-flex size-9 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    <svg class="ariaui-web-toggle-icon size-4 shrink-0 text-icon group-data-[state=on]:text-accent-foreground group-disabled:text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><path d="M4 20h16"></path></svg>
  </aria-toggle>
</div>

```html
<aria-toggle disabled aria-label="Toggle underline disabled" class="group inline-flex size-9 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
  <svg class="size-4 shrink-0 text-icon group-data-[state=on]:text-accent-foreground group-disabled:text-muted-foreground/50" aria-hidden="true"><!-- Underline --></svg>
</aria-toggle>
```

## Anatomy

```html
<aria-toggle aria-label="Toggle bold">
  <svg aria-hidden="true"><!-- icon --></svg>
</aria-toggle>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `pressed` | unset | Controls the pressed state. Property updates use controlled behavior. |
| `default-pressed` / `defaultPressed` | `false` | Sets the initial uncontrolled pressed state. |
| `onPressedChange` | `null` | Receives the next pressed state after activation. |
| `disabled` | `false` | Disables the native button. |
| `aria-pressed` | `false` | Reflected on the effective native button. |
| `data-state` | `off` | Becomes `on` while pressed. |

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Toggles the pressed state. |
| <kbd>Enter</kbd> | Toggles the pressed state. |

## Accessibility

`aria-toggle` renders a native button with `aria-pressed`, so assistive technologies can announce its on/off state. Give icon-only toggles an accessible label.

Use Toggle Group when related toggles need shared single or multiple selection state.
