# Grid

`@ariaui-web/grid` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/grid
```

```bash [pnpm]
pnpm add @ariaui-web/grid
```

```bash [yarn]
yarn add @ariaui-web/grid
```

:::

## Register Elements

```ts
import { defineGridElements } from "@ariaui-web/grid";

defineGridElements();
```

## Web Component Contract

`@ariaui-web/grid` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="grid">
  <aria-grid class="ariaui-web-example" data-example-part="Root">Root</aria-grid>
  <aria-grid-body class="ariaui-web-example" data-example-part="Body">Body</aria-grid-body>
  <aria-grid-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-grid-cell>
  <aria-grid-head class="ariaui-web-example" data-example-part="Head">Head</aria-grid-head>
</div>

### Markup

```html
<aria-grid class="ariaui-web-example" data-example-part="Root">Root</aria-grid>
  <aria-grid-body class="ariaui-web-example" data-example-part="Body">Body</aria-grid-body>
  <aria-grid-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-grid-cell>
  <aria-grid-head class="ariaui-web-example" data-example-part="Head">Head</aria-grid-head>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-grid` | `grid` |
| Body | `aria-grid-body` | none |
| Cell | `aria-grid-cell` | none |
| Head | `aria-grid-head` | none |
| Header | `aria-grid-header` | `heading` |
| Row | `aria-grid-row` | `row` |

### Usage

```ts
import { defineGridElements } from "@ariaui-web/grid";

defineGridElements();
```

The package-level native contract lives in `packages/grid/readme.md`.
