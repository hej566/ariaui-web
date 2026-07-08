# ScrollArea

`@ariaui-web/scroll-area` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/scroll-area
```

```bash [pnpm]
pnpm add @ariaui-web/scroll-area
```

```bash [yarn]
yarn add @ariaui-web/scroll-area
```

:::

## Register Elements

```ts
import { defineScrollAreaElements } from "@ariaui-web/scroll-area";

defineScrollAreaElements();
```

## Web Component Contract

`@ariaui-web/scroll-area` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="scroll-area">
  <aria-scroll-area class="ariaui-web-example" data-example-part="Root">Root</aria-scroll-area>
  <aria-scroll-area-corner class="ariaui-web-example" data-example-part="Corner">Corner</aria-scroll-area-corner>
  <aria-scroll-area-scrollbar class="ariaui-web-example" data-example-part="Scrollbar">Scrollbar</aria-scroll-area-scrollbar>
  <aria-scroll-area-scroll-down-button class="ariaui-web-example" data-example-part="ScrollDownButton">ScrollDownButton</aria-scroll-area-scroll-down-button>
</div>

### Markup

```html
<aria-scroll-area class="ariaui-web-example" data-example-part="Root">Root</aria-scroll-area>
  <aria-scroll-area-corner class="ariaui-web-example" data-example-part="Corner">Corner</aria-scroll-area-corner>
  <aria-scroll-area-scrollbar class="ariaui-web-example" data-example-part="Scrollbar">Scrollbar</aria-scroll-area-scrollbar>
  <aria-scroll-area-scroll-down-button class="ariaui-web-example" data-example-part="ScrollDownButton">ScrollDownButton</aria-scroll-area-scroll-down-button>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-scroll-area` | none |
| Corner | `aria-scroll-area-corner` | none |
| Scrollbar | `aria-scroll-area-scrollbar` | `scrollbar` |
| ScrollDownButton | `aria-scroll-area-scroll-down-button` | none |
| ScrollUpButton | `aria-scroll-area-scroll-up-button` | none |
| Thumb | `aria-scroll-area-thumb` | `presentation` |
| Viewport | `aria-scroll-area-viewport` | `group` |

### Usage

```ts
import { defineScrollAreaElements } from "@ariaui-web/scroll-area";

defineScrollAreaElements();
```

The package-level native contract lives in `packages/scroll-area/readme.md`.
