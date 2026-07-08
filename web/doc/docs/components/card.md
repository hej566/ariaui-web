# Card

`@ariaui-web/card` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/card
```

```bash [pnpm]
pnpm add @ariaui-web/card
```

```bash [yarn]
yarn add @ariaui-web/card
```

:::

## Register Elements

```ts
import { defineCardElements } from "@ariaui-web/card";

defineCardElements();
```

## Web Component Contract

`@ariaui-web/card` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="card">
  <aria-card class="ariaui-web-example" data-example-part="Root">Root</aria-card>
  <aria-card-content class="ariaui-web-example" data-example-part="Content">Content</aria-card-content>
  <aria-card-description class="ariaui-web-example" data-example-part="Description">Description</aria-card-description>
  <aria-card-footer class="ariaui-web-example" data-example-part="Footer">Footer</aria-card-footer>
</div>

### Markup

```html
<aria-card class="ariaui-web-example" data-example-part="Root">Root</aria-card>
  <aria-card-content class="ariaui-web-example" data-example-part="Content">Content</aria-card-content>
  <aria-card-description class="ariaui-web-example" data-example-part="Description">Description</aria-card-description>
  <aria-card-footer class="ariaui-web-example" data-example-part="Footer">Footer</aria-card-footer>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-card` | none |
| Content | `aria-card-content` | `region` |
| Description | `aria-card-description` | `note` |
| Footer | `aria-card-footer` | none |
| Header | `aria-card-header` | `heading` |
| Title | `aria-card-title` | `heading` |

### Usage

```ts
import { defineCardElements } from "@ariaui-web/card";

defineCardElements();
```

The package-level native contract lives in `packages/card/readme.md`.
