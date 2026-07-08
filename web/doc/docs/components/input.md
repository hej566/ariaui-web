# Input

`@ariaui-web/input` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/input
```

```bash [pnpm]
pnpm add @ariaui-web/input
```

```bash [yarn]
yarn add @ariaui-web/input
```

:::

## Register Elements

```ts
import { defineInputElements } from "@ariaui-web/input";

defineInputElements();
```

## Web Component Contract

`@ariaui-web/input` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="input">
  <aria-input class="ariaui-web-example" data-example-part="Root">Root</aria-input>
</div>

### Markup

```html
<aria-input class="ariaui-web-example" data-example-part="Root">Root</aria-input>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-input` | none |

### Usage

```ts
import { defineInputElements } from "@ariaui-web/input";

defineInputElements();
```

The package-level native contract lives in `packages/input/readme.md`.
