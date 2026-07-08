# Label

`@ariaui-web/label` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/label
```

```bash [pnpm]
pnpm add @ariaui-web/label
```

```bash [yarn]
yarn add @ariaui-web/label
```

:::

## Register Elements

```ts
import { defineLabelElements } from "@ariaui-web/label";

defineLabelElements();
```

## Web Component Contract

`@ariaui-web/label` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="label">
  <aria-label class="ariaui-web-example" data-example-part="Root">Root</aria-label>
</div>

### Markup

```html
<aria-label class="ariaui-web-example" data-example-part="Root">Root</aria-label>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-label` | none |

### Usage

```ts
import { defineLabelElements } from "@ariaui-web/label";

defineLabelElements();
```

The package-level native contract lives in `packages/label/readme.md`.
