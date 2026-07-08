# Spinner

`@ariaui-web/spinner` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/spinner
```

```bash [pnpm]
pnpm add @ariaui-web/spinner
```

```bash [yarn]
yarn add @ariaui-web/spinner
```

:::

## Register Elements

```ts
import { defineSpinnerElements } from "@ariaui-web/spinner";

defineSpinnerElements();
```

## Web Component Contract

`@ariaui-web/spinner` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="spinner">
  <aria-spinner class="ariaui-web-example" data-example-part="Root">Root</aria-spinner>
</div>

### Markup

```html
<aria-spinner class="ariaui-web-example" data-example-part="Root">Root</aria-spinner>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-spinner` | none |

### Usage

```ts
import { defineSpinnerElements } from "@ariaui-web/spinner";

defineSpinnerElements();
```

The package-level native contract lives in `packages/spinner/readme.md`.
