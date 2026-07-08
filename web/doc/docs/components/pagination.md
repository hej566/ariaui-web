# Pagination

`@ariaui-web/pagination` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/pagination
```

```bash [pnpm]
pnpm add @ariaui-web/pagination
```

```bash [yarn]
yarn add @ariaui-web/pagination
```

:::

## Register Elements

```ts
import { definePaginationElements } from "@ariaui-web/pagination";

definePaginationElements();
```

## Web Component Contract

`@ariaui-web/pagination` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="pagination">
  <aria-pagination class="ariaui-web-example" data-example-part="Root">Root</aria-pagination>
  <aria-pagination-content class="ariaui-web-example" data-example-part="Content">Content</aria-pagination-content>
  <aria-pagination-ellipsis class="ariaui-web-example" data-example-part="Ellipsis">Ellipsis</aria-pagination-ellipsis>
  <aria-pagination-item class="ariaui-web-example" data-example-part="Item">Item</aria-pagination-item>
</div>

### Markup

```html
<aria-pagination class="ariaui-web-example" data-example-part="Root">Root</aria-pagination>
  <aria-pagination-content class="ariaui-web-example" data-example-part="Content">Content</aria-pagination-content>
  <aria-pagination-ellipsis class="ariaui-web-example" data-example-part="Ellipsis">Ellipsis</aria-pagination-ellipsis>
  <aria-pagination-item class="ariaui-web-example" data-example-part="Item">Item</aria-pagination-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-pagination` | none |
| Content | `aria-pagination-content` | `region` |
| Ellipsis | `aria-pagination-ellipsis` | none |
| Item | `aria-pagination-item` | `listitem` |
| Link | `aria-pagination-link` | `link` |
| Next | `aria-pagination-next` | none |
| Pages | `aria-pagination-pages` | none |
| Previous | `aria-pagination-previous` | none |

### Usage

```ts
import { definePaginationElements } from "@ariaui-web/pagination";

definePaginationElements();
```

The package-level native contract lives in `packages/pagination/readme.md`.
