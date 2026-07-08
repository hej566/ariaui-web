# Table

`@ariaui-web/table` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/table
```

```bash [pnpm]
pnpm add @ariaui-web/table
```

```bash [yarn]
yarn add @ariaui-web/table
```

:::

## Register Elements

```ts
import { defineTableElements } from "@ariaui-web/table";

defineTableElements();
```

## Web Component Contract

`@ariaui-web/table` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="table">
  <aria-table class="ariaui-web-example" data-example-part="Root">Root</aria-table>
  <aria-table-body class="ariaui-web-example" data-example-part="Body">Body</aria-table-body>
  <aria-table-caption class="ariaui-web-example" data-example-part="Caption">Caption</aria-table-caption>
  <aria-table-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-table-cell>
</div>

### Markup

```html
<aria-table class="ariaui-web-example" data-example-part="Root">Root</aria-table>
  <aria-table-body class="ariaui-web-example" data-example-part="Body">Body</aria-table-body>
  <aria-table-caption class="ariaui-web-example" data-example-part="Caption">Caption</aria-table-caption>
  <aria-table-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-table-cell>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-table` | `table` |
| Body | `aria-table-body` | none |
| Caption | `aria-table-caption` | none |
| Cell | `aria-table-cell` | none |
| ColumnHeader | `aria-table-column-header` | `columnheader` |
| Footer | `aria-table-footer` | none |
| Header | `aria-table-header` | `heading` |
| Row | `aria-table-row` | `row` |
| RowHeader | `aria-table-row-header` | `rowheader` |

### Usage

```ts
import { defineTableElements } from "@ariaui-web/table";

defineTableElements();
```

The package-level native contract lives in `packages/table/readme.md`.
