# Splitter

A headless, accessible splitter for resizable panel layouts with pointer, keyboard, and nesting support.

## Features

- **Percentage-based layout**
- **Horizontal or vertical orientation**
- **Pointer and keyboard resizing**
- **Nestable panels**
- **Controlled layout updates**
- **Disable all separators**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/splitter
```

```bash [pnpm]
pnpm add @ariaui-web/splitter
```

```bash [yarn]
yarn add @ariaui-web/splitter
```

:::

```ts
import { defineSplitterElements } from "@ariaui-web/splitter";

defineSplitterElements();
```

## Examples

### Default

<div class="ariaui-web-preview w-full px-4 py-6" data-component="splitter" data-example-variant="default">
  <div class="ariaui-web-splitter-shell h-[320px] w-full overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-sm backdrop-blur-xl">
    <aria-splitter default-layout="40,60" orientation="vertical" class="ariaui-web-splitter-root ariaui-web-splitter-vertical flex h-full w-full flex-row overflow-hidden" data-example-part="Root">
      <aria-splitter-panel class="ariaui-web-splitter-pane flex h-full items-center justify-center text-sm font-medium text-foreground" data-example-part="Panel"><span class="tracking-wide">One</span></aria-splitter-panel>
      <aria-splitter-separator aria-label="Resize panels one and two" class="ariaui-web-splitter-separator ariaui-web-splitter-separator-vertical group relative flex w-px flex-shrink-0 cursor-col-resize select-none items-center justify-center bg-border/40 data-[dragging]:bg-foreground" data-example-part="Separator">
        <span class="ariaui-web-splitter-hit-target ariaui-web-splitter-hit-target-vertical absolute inset-y-0 -left-3 -right-3 z-10"></span>
        <span class="ariaui-web-splitter-grip ariaui-web-splitter-grip-vertical absolute h-8 w-1 rounded-full bg-border/60 group-hover:bg-foreground/60 group-data-[dragging]:bg-foreground"></span>
      </aria-splitter-separator>
      <aria-splitter-panel class="ariaui-web-splitter-nested-panel" data-example-part="Panel">
        <aria-splitter default-layout="50,50" orientation="horizontal" class="ariaui-web-splitter-root ariaui-web-splitter-horizontal flex h-full w-full flex-col overflow-hidden" data-example-part="Root">
          <aria-splitter-panel class="ariaui-web-splitter-pane flex h-full items-center justify-center text-sm font-medium text-foreground" data-example-part="Panel"><span class="tracking-wide">Two</span></aria-splitter-panel>
          <aria-splitter-separator aria-label="Resize panels two and three" class="ariaui-web-splitter-separator ariaui-web-splitter-separator-horizontal group relative flex h-px flex-shrink-0 cursor-row-resize select-none items-center justify-center bg-border/40 data-[dragging]:bg-foreground" data-example-part="Separator">
            <span class="ariaui-web-splitter-hit-target ariaui-web-splitter-hit-target-horizontal absolute inset-x-0 -top-3 -bottom-3 z-10"></span>
            <span class="ariaui-web-splitter-grip ariaui-web-splitter-grip-horizontal absolute h-1 w-8 rounded-full bg-border/60 group-hover:bg-foreground/60 group-data-[dragging]:bg-foreground"></span>
          </aria-splitter-separator>
          <aria-splitter-panel class="ariaui-web-splitter-pane flex h-full items-center justify-center text-sm font-medium text-foreground" data-example-part="Panel"><span class="tracking-wide">Three</span></aria-splitter-panel>
        </aria-splitter>
      </aria-splitter-panel>
    </aria-splitter>
  </div>
</div>

```html
<div class="h-[320px] w-full overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-sm backdrop-blur-xl">
  <aria-splitter default-layout="40,60" orientation="vertical" class="flex h-full w-full flex-row overflow-hidden">
    <aria-splitter-panel class="flex h-full items-center justify-center text-sm font-medium text-foreground">
      <span class="tracking-wide">One</span>
    </aria-splitter-panel>
    <aria-splitter-separator aria-label="Resize panels one and two" class="group relative flex w-px flex-shrink-0 cursor-col-resize select-none items-center justify-center bg-border/40 data-[dragging]:bg-foreground">
      <span class="absolute inset-y-0 -left-3 -right-3 z-10"></span>
      <span class="absolute h-8 w-1 rounded-full bg-border/60 group-hover:bg-foreground/60 group-data-[dragging]:bg-foreground"></span>
    </aria-splitter-separator>
    <aria-splitter-panel>
      <aria-splitter default-layout="50,50" orientation="horizontal" class="flex h-full w-full flex-col overflow-hidden">
        <aria-splitter-panel class="flex h-full items-center justify-center text-sm font-medium text-foreground">
          <span class="tracking-wide">Two</span>
        </aria-splitter-panel>
        <aria-splitter-separator aria-label="Resize panels two and three" class="group relative flex h-px flex-shrink-0 cursor-row-resize select-none items-center justify-center bg-border/40 data-[dragging]:bg-foreground">
          <span class="absolute inset-x-0 -top-3 -bottom-3 z-10"></span>
          <span class="absolute h-1 w-8 rounded-full bg-border/60 group-hover:bg-foreground/60 group-data-[dragging]:bg-foreground"></span>
        </aria-splitter-separator>
        <aria-splitter-panel class="flex h-full items-center justify-center text-sm font-medium text-foreground">
          <span class="tracking-wide">Three</span>
        </aria-splitter-panel>
      </aria-splitter>
    </aria-splitter-panel>
  </aria-splitter>
</div>
```

## Anatomy

```html
<aria-splitter default-layout="40,60" orientation="vertical">
  <aria-splitter-panel></aria-splitter-panel>
  <aria-splitter-separator aria-label="Resize panels"></aria-splitter-separator>
  <aria-splitter-panel></aria-splitter-panel>
</aria-splitter>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `default-layout` / `defaultLayout` | required | Initial panel percentages as a comma-separated attribute or number array property. |
| `orientation` | `vertical` | `vertical` creates side-by-side panels; `horizontal` creates stacked panels. |
| `disabled` / `isDisabled` | `false` | Disables pointer and keyboard resizing for every owned Separator. |
| `layout` | initial layout | Gets or sets the current percentage array. Values are rounded to two decimals. |
| `layoutchange` | - | Bubbled `CustomEvent` with `{ layout: number[] }` whenever interaction changes the layout. |

### Panel

| Attribute / property | Default | Description |
| --- | --- | --- |
| `default-size` | unset | Reserved initial-size hint; an owned Panel uses Root's `default-layout`. |
| Inline size | Root layout | Uses width for vertical layouts and height for horizontal layouts. |

### Separator

| Attribute | Default | Description |
| --- | --- | --- |
| `index` | DOM order | Selects the leading panel controlled by this handle. |
| `aria-label` | unset | Describes which panels the separator resizes. |
| `aria-valuenow` | leading panel size | Live rounded percentage for the controlled panel. |
| `aria-valuemin` / `aria-valuemax` | `0` / `100` | Published splitter range. |
| `data-dragging` | unset | Present during active pointer resizing. |

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>Tab</kbd> | Move focus to the next Separator. |
| <kbd>ArrowLeft</kbd> | In vertical orientation, decrease the leading panel by 5%. |
| <kbd>ArrowRight</kbd> | In vertical orientation, increase the leading panel by 5%. |
| <kbd>ArrowUp</kbd> | In horizontal orientation, decrease the leading panel by 5%. |
| <kbd>ArrowDown</kbd> | In horizontal orientation, increase the leading panel by 5%. |
| <kbd>Home</kbd> | Collapse the leading panel to 0%. |
| <kbd>End</kbd> | Expand the leading panel to all available adjacent space. |
| <kbd>Enter</kbd> | Toggle collapse and restore the previous size. |

## Accessibility

Splitter follows the [WAI-ARIA Window Splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/):

- Root uses `role="group"` so panels and separators are announced as one resizable unit.
- Separator uses `role="separator"` with `aria-orientation`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Separators use `tabindex="0"`; disabled separators use `tabindex="-1"` and `aria-disabled="true"`.
- Give every Separator a specific `aria-label` describing the panels it resizes.
- Arrow key direction follows orientation. Home, End, and Enter provide boundary and collapse controls.
