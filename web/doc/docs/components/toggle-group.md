# ToggleGroup

`@ariaui-web/toggle-group` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/toggle-group
```

```bash [pnpm]
pnpm add @ariaui-web/toggle-group
```

```bash [yarn]
yarn add @ariaui-web/toggle-group
```

:::

## Register Elements

```ts
import { defineToggleGroupElements } from "@ariaui-web/toggle-group";

defineToggleGroupElements();
```

## Web Component Contract

`@ariaui-web/toggle-group` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="toggle-group">
  <aria-toggle-group class="ariaui-web-example" data-example-part="Root">Root</aria-toggle-group>
  <aria-toggle-group-item class="ariaui-web-example" data-example-part="Item">Item</aria-toggle-group-item>
</div>

### Markup

```html
<aria-toggle-group class="ariaui-web-example" data-example-part="Root">Root</aria-toggle-group>
  <aria-toggle-group-item class="ariaui-web-example" data-example-part="Item">Item</aria-toggle-group-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-toggle-group` | `group` |
| Item | `aria-toggle-group-item` | `button` |

### Usage

```ts
import { defineToggleGroupElements } from "@ariaui-web/toggle-group";

defineToggleGroupElements();
```

The package-level native contract lives in `packages/toggle-group/readme.md`.
