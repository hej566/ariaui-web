# Spinbutton

`@ariaui-web/spinbutton` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

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

## Register Elements

```ts
import { defineSpinbuttonElements } from "@ariaui-web/spinbutton";

defineSpinbuttonElements();
```

## Web Component Contract

`@ariaui-web/spinbutton` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="spinbutton">
  <aria-spinbutton class="ariaui-web-example" data-example-part="Root">Root</aria-spinbutton>
  <aria-spinbutton-decrement class="ariaui-web-example" data-example-part="Decrement">Decrement</aria-spinbutton-decrement>
  <aria-spinbutton-increment class="ariaui-web-example" data-example-part="Increment">Increment</aria-spinbutton-increment>
  <aria-spinbutton-input class="ariaui-web-example" data-example-part="Input">Input</aria-spinbutton-input>
</div>

### Markup

```html
<aria-spinbutton class="ariaui-web-example" data-example-part="Root">Root</aria-spinbutton>
  <aria-spinbutton-decrement class="ariaui-web-example" data-example-part="Decrement">Decrement</aria-spinbutton-decrement>
  <aria-spinbutton-increment class="ariaui-web-example" data-example-part="Increment">Increment</aria-spinbutton-increment>
  <aria-spinbutton-input class="ariaui-web-example" data-example-part="Input">Input</aria-spinbutton-input>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-spinbutton` | `spinbutton` |
| Decrement | `aria-spinbutton-decrement` | none |
| Increment | `aria-spinbutton-increment` | none |
| Input | `aria-spinbutton-input` | `textbox` |

### Usage

```ts
import { defineSpinbuttonElements } from "@ariaui-web/spinbutton";

defineSpinbuttonElements();
```

The package-level native contract lives in `packages/spinbutton/readme.md`.
