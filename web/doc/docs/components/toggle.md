# Toggle

`@ariaui-web/toggle` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/toggle
```

```bash [pnpm]
pnpm add @ariaui-web/toggle
```

```bash [yarn]
yarn add @ariaui-web/toggle
```

:::

## Register Elements

```ts
import { defineToggleElements } from "@ariaui-web/toggle";

defineToggleElements();
```

## Web Component Contract

`@ariaui-web/toggle` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="toggle">
  <aria-toggle class="ariaui-web-example" data-example-part="Root">Root</aria-toggle>
</div>

### Markup

```html
<aria-toggle class="ariaui-web-example" data-example-part="Root">Root</aria-toggle>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-toggle` | `button` |

### Usage

```ts
import { defineToggleElements } from "@ariaui-web/toggle";

defineToggleElements();
```

The package-level native contract lives in `packages/toggle/readme.md`.
