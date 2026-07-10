# Position

A low-level utility for computing floating element coordinates.

## Features

- **Pure utility**
- **Auto-flip**
- **Boundary detection**
- **Auto-update**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/position
```

```bash [pnpm]
pnpm add @ariaui-web/position
```

```bash [yarn]
yarn add @ariaui-web/position
```

:::

## Examples

Source Position utility example.

### Position

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-8" data-component="position" data-example-variant="default">
  <div class="relative flex w-full max-w-sm justify-between rounded-xl border border-border bg-background p-6 shadow-md ariaui-web-position-card">
    <div class="space-y-1 ariaui-web-position-copy">
      <p class="text-sm font-medium text-foreground">Reference</p>
      <p class="text-xs text-muted-foreground">Click button to compute position</p>
    </div>
    <button
      type="button"
      id="position-ref-btn"
      class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-secondary px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover ariaui-web-position-trigger"
    >
      Get Position
    </button>
    <div
      id="position-floating"
      class="absolute z-50 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg ariaui-web-position-floating"
      style="top: 0; left: 50%; transform: translateX(-50%);"
    >
      Floating element
    </div>
  </div>
</div>

```html
<div class="relative flex w-full max-w-sm justify-between rounded-xl border border-border bg-background p-6 shadow-md ariaui-web-position-card">
    <div class="space-y-1 ariaui-web-position-copy">
      <p class="text-sm font-medium text-foreground">Reference</p>
      <p class="text-xs text-muted-foreground">Click button to compute position</p>
    </div>
    <button
      type="button"
      id="position-ref-btn"
      class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-secondary px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover ariaui-web-position-trigger"
    >
      Get Position
    </button>
    <div
      id="position-floating"
      class="absolute z-50 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg ariaui-web-position-floating"
      style="top: 0; left: 50%; transform: translateX(-50%);"
    >
      Floating element
    </div>
  </div>
```

```ts
import { computePosition } from "@ariaui-web/position";

const reference = document.querySelector("#position-ref-btn");
const floating = document.querySelector("#position-floating");

if (reference instanceof HTMLElement && floating instanceof HTMLElement) {
  const result = computePosition(reference, floating, {
    placement: "bottom",
    offset: 8,
  });

  floating.style.left = String(result.x) + "px";
  floating.style.top = String(result.y) + "px";
}
```

## API Reference

### computePosition

Computes floating element coordinates relative to a reference.

```ts
computePosition(reference, floating, options?)
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| placement | `string` | `"bottom"` | Preferred placement such as top, bottom, left, right, and start or end alignments. |
| strategy | `"absolute" \| "fixed"` | `"absolute"` | CSS positioning strategy. |
| offset | `number \| { mainAxis?: number; crossAxis?: number; x?: number; y?: number }` | `0` | Distance between reference and floating. |
| boundary | `Element \| DOMRect \| "viewport"` | viewport | Custom clipping boundary. |

### autoUpdate

Keeps floating element synchronized with layout changes.

```ts
autoUpdate(reference, floating, update, hide, options?)
```

Returns a cleanup function. It does not hide the floating element when the reference scrolls out of view; visibility is controlled by the consuming component's open state.

### detectOverflow

Measures how much an element overflows its boundary.

```ts
detectOverflow(element, options?)
```
