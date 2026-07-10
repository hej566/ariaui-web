# Button

A button is an action-triggering control.

## Features

- **Native button behavior**
- **Link composition**
- **Disabled guards**
- **Grouped items**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/button
```

```bash [pnpm]
pnpm add @ariaui-web/button
```

```bash [yarn]
yarn add @ariaui-web/button
```

:::

### Register Elements

```ts
import { defineButtonElements } from "@ariaui-web/button";

defineButtonElements();
```

## Examples

The live examples below are native custom element entries for the `button` page.

### Primary

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="primary">
  <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">Button</aria-button>
</div>

```html
<aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">Button</aria-button>
```

### Secondary

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="secondary">
  <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 border border-border bg-secondary px-4 py-2 text-sm text-foreground shadow-sm hover:bg-secondary-hover ariaui-web-button-secondary ariaui-web-button-default" data-example-part="Root">Secondary</aria-button>
</div>

```html
<aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 border border-border bg-secondary px-4 py-2 text-sm text-foreground shadow-sm hover:bg-secondary-hover ariaui-web-button-secondary ariaui-web-button-default" data-example-part="Root">Secondary</aria-button>
```

### Destructive

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="destructive">
  <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-destructive dark:bg-destructive/60 px-4 py-2 text-sm text-destructive-foreground shadow-sm hover:bg-destructive-hover ariaui-web-button-destructive ariaui-web-button-default" data-example-part="Root">Destructive</aria-button>
</div>

```html
<aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-destructive dark:bg-destructive/60 px-4 py-2 text-sm text-destructive-foreground shadow-sm hover:bg-destructive-hover ariaui-web-button-destructive ariaui-web-button-default" data-example-part="Root">Destructive</aria-button>
```

### Outline

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="outline">
  <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted ariaui-web-button-outline ariaui-web-button-default" data-example-part="Root">Outline</aria-button>
</div>

```html
<aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted ariaui-web-button-outline ariaui-web-button-default" data-example-part="Root">Outline</aria-button>
```

### Ghost

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="ghost">
  <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 px-4 py-2 text-sm text-foreground hover:bg-muted ariaui-web-button-ghost ariaui-web-button-default" data-example-part="Root">Ghost</aria-button>
</div>

```html
<aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 px-4 py-2 text-sm text-foreground hover:bg-muted ariaui-web-button-ghost ariaui-web-button-default" data-example-part="Root">Ghost</aria-button>
```

### Link

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="link">
  <aria-button as="a" href="#" class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 px-4 py-2 text-sm text-brand underline-offset-4 hover:underline ariaui-web-button-link ariaui-web-button-default" data-example-part="Root">Link</aria-button>
</div>

```html
<aria-button as="a" href="#" class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 px-4 py-2 text-sm text-brand underline-offset-4 hover:underline ariaui-web-button-link ariaui-web-button-default" data-example-part="Root">Link</aria-button>
```

### With icon

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="with-icon">
  <div class="flex flex-wrap gap-4 ariaui-web-button-row">
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">
      <svg aria-hidden="true" data-icon="PaperAirplaneIcon" class="mr-2 h-4 w-4 ariaui-web-button-icon-left" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"></path></svg>
      Send
    </aria-button>
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted ariaui-web-button-outline ariaui-web-button-default" data-example-part="Root">
      Learn more
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="ml-2 h-4 w-4 ariaui-web-button-icon-right" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"></path></svg>
    </aria-button>
  </div>
</div>

```html
<div class="flex flex-wrap gap-4 ariaui-web-button-row">
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">
      <svg aria-hidden="true" data-icon="PaperAirplaneIcon" class="mr-2 h-4 w-4 ariaui-web-button-icon-left" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"></path></svg>
      Send
    </aria-button>
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-muted ariaui-web-button-outline ariaui-web-button-default" data-example-part="Root">
      Learn more
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="ml-2 h-4 w-4 ariaui-web-button-icon-right" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"></path></svg>
    </aria-button>
  </div>
```

### Loading

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="loading">
  <aria-button disabled class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">
    <svg aria-hidden="true" data-icon="ArrowPathIcon" class="mr-2 h-4 w-4 animate-spin ariaui-web-button-icon-left ariaui-web-button-spin" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"></path></svg>
    Please wait
  </aria-button>
</div>

```html
<aria-button disabled class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">
    <svg aria-hidden="true" data-icon="ArrowPathIcon" class="mr-2 h-4 w-4 animate-spin ariaui-web-button-icon-left ariaui-web-button-spin" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"></path></svg>
    Please wait
  </aria-button>
```

### Sizes

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="button" data-example-variant="sizes">
  <div class="flex flex-wrap gap-4 ariaui-web-button-row">
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-8 rounded-md px-3 text-xs bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-small" data-example-part="Root">Small</aria-button>
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 rounded-md px-4 py-2 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">Default</aria-button>
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-10 rounded-md px-8 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-large" data-example-part="Root">Large</aria-button>
  </div>
</div>

```html
<div class="flex flex-wrap gap-4 ariaui-web-button-row">
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-8 rounded-md px-3 text-xs bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-small" data-example-part="Root">Small</aria-button>
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-9 rounded-md px-4 py-2 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-default" data-example-part="Root">Default</aria-button>
    <aria-button class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 ariaui-web-button-root h-10 rounded-md px-8 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover ariaui-web-button-primary ariaui-web-button-large" data-example-part="Root">Large</aria-button>
  </div>
```

## Anatomy

```html
<aria-button>Button</aria-button>

<aria-button as="a" href="#">Link</aria-button>

<aria-button-group data-example-part="Group">
  <aria-button-item data-example-part="Item">First</aria-button-item>
  <aria-button-item data-example-part="Item">Second</aria-button-item>
</aria-button-group>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-button` | `button` |
| Group | `aria-button-group` | `group` |
| Item | `aria-button-item` | `button` |

## API Reference

The package-level native contract lives in `packages/button/readme.md`.

### Root

- Element: `aria-button`
- Defaults to `role="button"`, `tabindex="0"`, and `type="button"` on the native custom element host.
- Supports `type="button"`, `type="submit"`, and `type="reset"` without overwriting authored values.
- Supports `as="a"` with `href` as the native link-composition equivalent by applying `role="link"`.
- Disabled link-mode buttons remove `href`, expose `aria-disabled="true"`, and suppress activation.

### Group

- Element: `aria-button-group`
- Defaults to `role="group"` while preserving consumer role overrides.
- Observes descendant `aria-button-item` elements and updates their positions from current DOM order.

### Item

- Element: `aria-button-item`
- Reuses the Root button semantics.
- Reflects `data-position="only"`, `first`, `middle`, or `last` when rendered in the nearest Group.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus to the next enabled button or link button. |
| `Shift+Tab` | Moves focus to the previous enabled button or link button. |
| `Enter` | Activates the focused button or link button. |
| `Space` | Prevents page scrolling on keydown and activates focused button hosts on keyup. |

## Accessibility

Use buttons for actions and links for navigation. The `as="a"` and `href` form is intended for navigation-style controls and keeps link semantics until disabled.

Disabled buttons expose `data-disabled`, suppress pointer and keyboard activation, and are removed from sequential focus on the custom element host. For loading states, keep the visible label present and add a decorative SVG with `aria-hidden="true"`.

Group related controls with `aria-button-group` and provide an accessible name, such as `aria-label`, when the group needs one.
