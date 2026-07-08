# Toast

`@ariaui-web/toast` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/toast
```

```bash [pnpm]
pnpm add @ariaui-web/toast
```

```bash [yarn]
yarn add @ariaui-web/toast
```

:::

## Register Elements

```ts
import { defineToastElements } from "@ariaui-web/toast";

defineToastElements();
```

## Web Component Contract

`@ariaui-web/toast` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="toast">
  <aria-toast-close class="ariaui-web-example" data-example-part="Close">Close</aria-toast-close>
  <aria-toast-item class="ariaui-web-example" data-example-part="Item">Item</aria-toast-item>
  <aria-toast-list class="ariaui-web-example" data-example-part="List">List</aria-toast-list>
</div>

### Markup

```html
<aria-toast-close class="ariaui-web-example" data-example-part="Close">Close</aria-toast-close>
  <aria-toast-item class="ariaui-web-example" data-example-part="Item">Item</aria-toast-item>
  <aria-toast-list class="ariaui-web-example" data-example-part="List">List</aria-toast-list>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Close | `aria-toast-close` | `button` |
| Item | `aria-toast-item` | `listitem` |
| List | `aria-toast-list` | `list` |

### Usage

```ts
import { defineToastElements } from "@ariaui-web/toast";

defineToastElements();
```

The package-level native contract lives in `packages/toast/readme.md`.
