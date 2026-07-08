# Treegrid

`@ariaui-web/treegrid` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/treegrid
```

```bash [pnpm]
pnpm add @ariaui-web/treegrid
```

```bash [yarn]
yarn add @ariaui-web/treegrid
```

:::

## Register Elements

```ts
import { defineTreegridElements } from "@ariaui-web/treegrid";

defineTreegridElements();
```

## Web Component Contract

`@ariaui-web/treegrid` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="treegrid">
  <aria-treegrid class="ariaui-web-example" data-example-part="Root">Root</aria-treegrid>
  <aria-treegrid-body class="ariaui-web-example" data-example-part="Body">Body</aria-treegrid-body>
  <aria-treegrid-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-treegrid-cell>
  <aria-treegrid-column-header class="ariaui-web-example" data-example-part="ColumnHeader">ColumnHeader</aria-treegrid-column-header>
</div>

### Markup

```html
<aria-treegrid class="ariaui-web-example" data-example-part="Root">Root</aria-treegrid>
  <aria-treegrid-body class="ariaui-web-example" data-example-part="Body">Body</aria-treegrid-body>
  <aria-treegrid-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-treegrid-cell>
  <aria-treegrid-column-header class="ariaui-web-example" data-example-part="ColumnHeader">ColumnHeader</aria-treegrid-column-header>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-treegrid` | `treegrid` |
| Body | `aria-treegrid-body` | none |
| Cell | `aria-treegrid-cell` | none |
| ColumnHeader | `aria-treegrid-column-header` | `columnheader` |
| Group | `aria-treegrid-group` | `group` |
| Header | `aria-treegrid-header` | `heading` |
| Row | `aria-treegrid-row` | `row` |
| RowHeader | `aria-treegrid-row-header` | `rowheader` |

### Usage

```ts
import { defineTreegridElements } from "@ariaui-web/treegrid";

defineTreegridElements();
```

The package-level native contract lives in `packages/treegrid/readme.md`.
