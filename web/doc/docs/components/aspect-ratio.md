# AspectRatio

`@ariaui-web/aspect-ratio` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/aspect-ratio
```

```bash [pnpm]
pnpm add @ariaui-web/aspect-ratio
```

```bash [yarn]
yarn add @ariaui-web/aspect-ratio
```

:::

## Register Elements

```ts
import { defineAspectRatioElements } from "@ariaui-web/aspect-ratio";

defineAspectRatioElements();
```

## Web Component Contract

`@ariaui-web/aspect-ratio` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="aspect-ratio">
  <aria-aspect-ratio class="ariaui-web-example" data-example-part="Root">Root</aria-aspect-ratio>
</div>

### Markup

```html
<aria-aspect-ratio class="ariaui-web-example" data-example-part="Root">Root</aria-aspect-ratio>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-aspect-ratio` | none |

### Usage

```ts
import { defineAspectRatioElements } from "@ariaui-web/aspect-ratio";

defineAspectRatioElements();
```

The package-level native contract lives in `packages/aspect-ratio/readme.md`.
