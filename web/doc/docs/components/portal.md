# Portal

`@ariaui-web/portal` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/portal
```

```bash [pnpm]
pnpm add @ariaui-web/portal
```

```bash [yarn]
yarn add @ariaui-web/portal
```

:::

## Register Elements

```ts
import { definePortalElements } from "@ariaui-web/portal";

definePortalElements();
```

## Web Component Contract

`@ariaui-web/portal` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="portal">
  <aria-portal class="ariaui-web-example" data-example-part="Root">Root</aria-portal>
</div>

### Markup

```html
<aria-portal class="ariaui-web-example" data-example-part="Root">Root</aria-portal>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-portal` | none |

### Usage

```ts
import { definePortalElements } from "@ariaui-web/portal";

definePortalElements();
```

The package-level native contract lives in `packages/portal/readme.md`.
