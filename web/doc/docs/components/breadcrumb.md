# Breadcrumb

`@ariaui-web/breadcrumb` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/breadcrumb
```

```bash [pnpm]
pnpm add @ariaui-web/breadcrumb
```

```bash [yarn]
yarn add @ariaui-web/breadcrumb
```

:::

## Register Elements

```ts
import { defineBreadcrumbElements } from "@ariaui-web/breadcrumb";

defineBreadcrumbElements();
```

## Web Component Contract

`@ariaui-web/breadcrumb` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="breadcrumb">
  <aria-breadcrumb class="ariaui-web-example" data-example-part="Root">Root</aria-breadcrumb>
  <aria-breadcrumb-ellipsis class="ariaui-web-example" data-example-part="Ellipsis">Ellipsis</aria-breadcrumb-ellipsis>
  <aria-breadcrumb-item class="ariaui-web-example" data-example-part="Item">Item</aria-breadcrumb-item>
  <aria-breadcrumb-link class="ariaui-web-example" data-example-part="Link">Link</aria-breadcrumb-link>
</div>

### Markup

```html
<aria-breadcrumb class="ariaui-web-example" data-example-part="Root">Root</aria-breadcrumb>
  <aria-breadcrumb-ellipsis class="ariaui-web-example" data-example-part="Ellipsis">Ellipsis</aria-breadcrumb-ellipsis>
  <aria-breadcrumb-item class="ariaui-web-example" data-example-part="Item">Item</aria-breadcrumb-item>
  <aria-breadcrumb-link class="ariaui-web-example" data-example-part="Link">Link</aria-breadcrumb-link>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-breadcrumb` | none |
| Ellipsis | `aria-breadcrumb-ellipsis` | none |
| Item | `aria-breadcrumb-item` | `listitem` |
| Link | `aria-breadcrumb-link` | `link` |
| List | `aria-breadcrumb-list` | `list` |
| Page | `aria-breadcrumb-page` | none |
| Separator | `aria-breadcrumb-separator` | `separator` |

### Usage

```ts
import { defineBreadcrumbElements } from "@ariaui-web/breadcrumb";

defineBreadcrumbElements();
```

The package-level native contract lives in `packages/breadcrumb/readme.md`.
