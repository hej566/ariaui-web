# Toggle Group

Grouped toggle primitives with single and multiple selection state.

## Features

- **Single or multiple group modes**
- **Controlled or uncontrolled state**
- **Roving tabindex**
- **Wrap-around arrow navigation**
- **`data-active` state**
- **Headless primitives**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/toggle-group
```

```bash [pnpm]
pnpm add @ariaui-web/toggle-group
```

```bash [yarn]
yarn add @ariaui-web/toggle-group
```

:::

```ts
import { defineToggleGroupElements } from "@ariaui-web/toggle-group";

defineToggleGroupElements();
```

## Examples

The examples use the same segmented states, Lucide icon artwork, and Tailwind CSS composition as the Aria UI Toggle Group page.

### Group outline

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-outline">
  <aria-toggle-group mode="multiple" class="ariaui-web-toggle-group-root inline-flex items-center" data-example-part="Root">
    <aria-toggle-group-item value="bold" is-active aria-label="Toggle bold" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-outline group relative inline-flex h-9 w-9 items-center justify-center gap-2 rounded-none border border-input bg-background px-2 text-foreground shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground focus-visible:z-10 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12h8a4 4 0 0 1 0 8H6Z"></path><path d="M6 4h7a4 4 0 0 1 0 8H6Z"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="italic" aria-label="Toggle italic" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-outline group relative inline-flex h-9 w-9 items-center justify-center gap-2 rounded-none border border-input bg-background px-2 text-foreground shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground focus-visible:z-10 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="underline" aria-label="Toggle underline" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-outline group relative inline-flex h-9 w-9 items-center justify-center gap-2 rounded-none border border-input bg-background px-2 text-foreground shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground focus-visible:z-10 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><path d="M4 20h16"></path></svg></aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="multiple" class="inline-flex items-center">
  <aria-toggle-group-item value="bold" is-active aria-label="Toggle bold" class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0">...</aria-toggle-group-item>
  <aria-toggle-group-item value="italic" aria-label="Toggle italic" class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0">...</aria-toggle-group-item>
  <aria-toggle-group-item value="underline" aria-label="Toggle underline" class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0">...</aria-toggle-group-item>
</aria-toggle-group>
```

### Group default

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-default">
  <aria-toggle-group mode="multiple" class="ariaui-web-toggle-group-root inline-flex items-center" data-example-part="Root">
    <aria-toggle-group-item value="bold" is-active aria-label="Toggle bold" class="ariaui-web-toggle-group-item group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 text-foreground enabled:hover:bg-accent data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12h8a4 4 0 0 1 0 8H6Z"></path><path d="M6 4h7a4 4 0 0 1 0 8H6Z"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="italic" aria-label="Toggle italic" class="ariaui-web-toggle-group-item group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 text-foreground enabled:hover:bg-accent data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="underline" aria-label="Toggle underline" class="ariaui-web-toggle-group-item group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 text-foreground enabled:hover:bg-accent data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><path d="M4 20h16"></path></svg></aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="multiple" class="inline-flex items-center">
  <aria-toggle-group-item value="bold" is-active aria-label="Toggle bold" class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="italic" aria-label="Toggle italic" class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="underline" aria-label="Toggle underline" class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
</aria-toggle-group>
```

### Group small

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-small">
  <aria-toggle-group mode="multiple" class="ariaui-web-toggle-group-root inline-flex items-center" data-example-part="Root">
    <aria-toggle-group-item value="bold" is-active aria-label="Toggle bold" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-small group relative inline-flex h-8 w-8 items-center justify-center rounded-none border border-transparent bg-transparent px-1.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 12h8a4 4 0 0 1 0 8H6Z"></path><path d="M6 4h7a4 4 0 0 1 0 8H6Z"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="italic" aria-label="Toggle italic" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-small group relative inline-flex h-8 w-8 items-center justify-center rounded-none border border-transparent bg-transparent px-1.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="underline" aria-label="Toggle underline" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-small group relative inline-flex h-8 w-8 items-center justify-center rounded-none border border-transparent bg-transparent px-1.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><path d="M4 20h16"></path></svg></aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="multiple" class="inline-flex items-center">
  <aria-toggle-group-item value="bold" is-active class="group relative inline-flex h-8 w-8 items-center justify-center rounded-none border border-transparent bg-transparent px-1.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="italic" class="group relative inline-flex h-8 w-8 items-center justify-center rounded-none border border-transparent bg-transparent px-1.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="underline" class="group relative inline-flex h-8 w-8 items-center justify-center rounded-none border border-transparent bg-transparent px-1.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
</aria-toggle-group>
```

### Group large

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-large">
  <aria-toggle-group mode="multiple" class="ariaui-web-toggle-group-root inline-flex items-center" data-example-part="Root">
    <aria-toggle-group-item value="bold" is-active aria-label="Toggle bold" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-large group relative inline-flex h-10 w-10 items-center justify-center rounded-none border border-transparent bg-transparent px-2.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 12h8a4 4 0 0 1 0 8H6Z"></path><path d="M6 4h7a4 4 0 0 1 0 8H6Z"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="italic" aria-label="Toggle italic" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-large group relative inline-flex h-10 w-10 items-center justify-center rounded-none border border-transparent bg-transparent px-2.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="underline" aria-label="Toggle underline" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-large group relative inline-flex h-10 w-10 items-center justify-center rounded-none border border-transparent bg-transparent px-2.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 text-icon group-data-[active=true]:text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><path d="M4 20h16"></path></svg></aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="multiple" class="inline-flex items-center">
  <aria-toggle-group-item value="bold" is-active class="group relative inline-flex h-10 w-10 items-center justify-center rounded-none border border-transparent bg-transparent px-2.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="italic" class="group relative inline-flex h-10 w-10 items-center justify-center rounded-none border border-transparent bg-transparent px-2.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="underline" class="group relative inline-flex h-10 w-10 items-center justify-center rounded-none border border-transparent bg-transparent px-2.5 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
</aria-toggle-group>
```

### Group disabled

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-disabled">
  <aria-toggle-group mode="multiple" class="ariaui-web-toggle-group-root inline-flex items-center" data-example-part="Root">
    <aria-toggle-group-item value="bold" disabled aria-label="Toggle bold" class="ariaui-web-toggle-group-item group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 disabled:pointer-events-none disabled:bg-muted/50 disabled:text-muted-foreground/50 first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 group-disabled:text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 12h8a4 4 0 0 1 0 8H6Z"></path><path d="M6 4h7a4 4 0 0 1 0 8H6Z"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="italic" disabled aria-label="Toggle italic" class="ariaui-web-toggle-group-item group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 disabled:pointer-events-none disabled:bg-muted/50 disabled:text-muted-foreground/50 first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 group-disabled:text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 4h-9"></path><path d="M14 20H5"></path><path d="M15 4 9 20"></path></svg></aria-toggle-group-item>
    <aria-toggle-group-item value="underline" disabled aria-label="Toggle underline" class="ariaui-web-toggle-group-item group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 disabled:pointer-events-none disabled:bg-muted/50 disabled:text-muted-foreground/50 first:rounded-l-md last:rounded-r-md" data-example-part="Item"><svg class="ariaui-web-toggle-group-icon size-4 shrink-0 group-disabled:text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><path d="M4 20h16"></path></svg></aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="multiple" class="inline-flex items-center">
  <aria-toggle-group-item value="bold" disabled class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 disabled:pointer-events-none disabled:bg-muted/50 disabled:text-muted-foreground/50 first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="italic" disabled class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 disabled:pointer-events-none disabled:bg-muted/50 disabled:text-muted-foreground/50 first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
  <aria-toggle-group-item value="underline" disabled class="group relative inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent bg-transparent px-2 disabled:pointer-events-none disabled:bg-muted/50 disabled:text-muted-foreground/50 first:rounded-l-md last:rounded-r-md">...</aria-toggle-group-item>
</aria-toggle-group>
```

### Group fill outline

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-fill-outline">
  <aria-toggle-group mode="single" default-value="all" class="ariaui-web-toggle-group-root ariaui-web-toggle-group-fill inline-flex w-full max-w-xs items-center" data-example-part="Root">
    <aria-toggle-group-item value="all" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-outline ariaui-web-toggle-group-fill-item group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0" data-example-part="Item">All</aria-toggle-group-item>
    <aria-toggle-group-item value="missed" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-outline ariaui-web-toggle-group-fill-item group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0" data-example-part="Item">Missed</aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="single" default-value="all" class="inline-flex w-full max-w-xs items-center">
  <aria-toggle-group-item value="all" class="group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0">All</aria-toggle-group-item>
  <aria-toggle-group-item value="missed" class="group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-input bg-background px-2 shadow-xs data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:border-l-0">Missed</aria-toggle-group-item>
</aria-toggle-group>
```

### Group fill default

<div class="ariaui-web-preview min-h-80 items-center rounded-xl border border-border bg-background bg-none px-4 py-16 sm:px-4" data-component="toggle-group" data-example-variant="group-fill-default">
  <aria-toggle-group mode="single" default-value="all" class="ariaui-web-toggle-group-root ariaui-web-toggle-group-fill inline-flex w-full max-w-xs items-center" data-example-part="Root">
    <aria-toggle-group-item value="all" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-fill-item group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item">All</aria-toggle-group-item>
    <aria-toggle-group-item value="missed" class="ariaui-web-toggle-group-item ariaui-web-toggle-group-fill-item group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md" data-example-part="Item">Missed</aria-toggle-group-item>
  </aria-toggle-group>
</div>

```html
<aria-toggle-group mode="single" default-value="all" class="inline-flex w-full max-w-xs items-center">
  <aria-toggle-group-item value="all" class="group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">All</aria-toggle-group-item>
  <aria-toggle-group-item value="missed" class="group relative inline-flex h-9 flex-1 items-center justify-center rounded-none border border-transparent bg-transparent px-2 data-[active=true]:bg-accent first:rounded-l-md last:rounded-r-md">Missed</aria-toggle-group-item>
</aria-toggle-group>
```

## Anatomy

```html
<aria-toggle-group mode="multiple">
  <aria-toggle-group-item value="bold">Bold</aria-toggle-group-item>
</aria-toggle-group>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `mode` | `multiple` | Uses `single` or `multiple` active-state behavior. |
| `value` | unset | Controls the active item value or values. |
| `default-value` / `defaultValue` | unset | Seeds uncontrolled value state. |
| `onValueChange` | `null` | Receives the next string, string array, or null value. |
| `onActiveChange` | `null` | Receives active booleans in item order. |

### Item

| Attribute / property | Default | Description |
| --- | --- | --- |
| `value` | generated | Stable value used by Root value state. |
| `is-active` / `isActive` | `false` | Initial legacy active state. |
| `disabled` | `false` | Disables and removes the native button from roving focus. |
| `aria-pressed` | `false` | Reflects the effective active state on the native button. |

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>ArrowRight</kbd> / <kbd>ArrowDown</kbd> | Moves focus to the next enabled item. |
| <kbd>ArrowLeft</kbd> / <kbd>ArrowUp</kbd> | Moves focus to the previous enabled item. |
| <kbd>Home</kbd> | Moves focus to the first enabled item. |
| <kbd>End</kbd> | Moves focus to the last enabled item. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Toggles the focused item. |
| <kbd>Tab</kbd> | Leaves the group. |

## Accessibility

Toggle Group uses one roving tab stop. Arrow navigation wraps and skips disabled items, Root exposes `role="group"`, and each native item button reflects its pressed state with `aria-pressed`.

Use Toggle for one independent pressed button and Toggle Group when related controls share single or multiple selection state.
