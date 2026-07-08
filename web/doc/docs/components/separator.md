# Separator

`@ariaui-web/separator` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/separator
```

```bash [pnpm]
pnpm add @ariaui-web/separator
```

```bash [yarn]
yarn add @ariaui-web/separator
```

:::

## Register Elements

```ts
import { defineSeparatorElements } from "@ariaui-web/separator";

defineSeparatorElements();
```

## Web Component Contract

`@ariaui-web/separator` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="separator">
  <aria-separator class="ariaui-web-example" data-example-part="Root">Root</aria-separator>
</div>

### Markup

```html
<aria-separator class="ariaui-web-example" data-example-part="Root">Root</aria-separator>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-separator` | `separator` |

### Usage

```ts
import { defineSeparatorElements } from "@ariaui-web/separator";

defineSeparatorElements();
```

The package-level native contract lives in `packages/separator/readme.md`.
