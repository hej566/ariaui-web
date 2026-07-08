# Skeleton

`@ariaui-web/skeleton` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/skeleton
```

```bash [pnpm]
pnpm add @ariaui-web/skeleton
```

```bash [yarn]
yarn add @ariaui-web/skeleton
```

:::

## Register Elements

```ts
import { defineSkeletonElements } from "@ariaui-web/skeleton";

defineSkeletonElements();
```

## Web Component Contract

`@ariaui-web/skeleton` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="skeleton">
  <aria-skeleton class="ariaui-web-example" data-example-part="Root">Root</aria-skeleton>
</div>

### Markup

```html
<aria-skeleton class="ariaui-web-example" data-example-part="Root">Root</aria-skeleton>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-skeleton` | none |

### Usage

```ts
import { defineSkeletonElements } from "@ariaui-web/skeleton";

defineSkeletonElements();
```

The package-level native contract lives in `packages/skeleton/readme.md`.
