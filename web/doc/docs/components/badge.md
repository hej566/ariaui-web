# Badge

`@ariaui-web/badge` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/badge
```

```bash [pnpm]
pnpm add @ariaui-web/badge
```

```bash [yarn]
yarn add @ariaui-web/badge
```

:::

## Register Elements

```ts
import { defineBadgeElements } from "@ariaui-web/badge";

defineBadgeElements();
```

## Web Component Contract

`@ariaui-web/badge` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="badge">
  <aria-badge class="ariaui-web-example" data-example-part="Root">Root</aria-badge>
</div>

### Markup

```html
<aria-badge class="ariaui-web-example" data-example-part="Root">Root</aria-badge>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-badge` | none |

### Usage

```ts
import { defineBadgeElements } from "@ariaui-web/badge";

defineBadgeElements();
```

The package-level native contract lives in `packages/badge/readme.md`.
