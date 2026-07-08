# Arrow

`@ariaui-web/arrow` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/arrow
```

```bash [pnpm]
pnpm add @ariaui-web/arrow
```

```bash [yarn]
yarn add @ariaui-web/arrow
```

:::

## Register Elements

```ts
import { defineArrowElements } from "@ariaui-web/arrow";

defineArrowElements();
```

## Web Component Contract

`@ariaui-web/arrow` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="arrow">
  <aria-arrow class="ariaui-web-example" data-example-part="Root">Root</aria-arrow>
</div>

### Markup

```html
<aria-arrow class="ariaui-web-example" data-example-part="Root">Root</aria-arrow>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-arrow` | none |

### Usage

```ts
import { defineArrowElements } from "@ariaui-web/arrow";

defineArrowElements();
```

The package-level native contract lives in `packages/arrow/readme.md`.
