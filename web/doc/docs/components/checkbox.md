# Checkbox

`@ariaui-web/checkbox` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/checkbox
```

```bash [pnpm]
pnpm add @ariaui-web/checkbox
```

```bash [yarn]
yarn add @ariaui-web/checkbox
```

:::

## Register Elements

```ts
import { defineCheckboxElements } from "@ariaui-web/checkbox";

defineCheckboxElements();
```

## Web Component Contract

`@ariaui-web/checkbox` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="checkbox">
  <aria-checkbox class="ariaui-web-example" data-example-part="Root">Root</aria-checkbox>
  <aria-checkbox-group class="ariaui-web-example" data-example-part="Group">Group</aria-checkbox-group>
  <aria-checkbox-indicator class="ariaui-web-example" data-example-part="Indicator">Indicator</aria-checkbox-indicator>
  <aria-checkbox-item class="ariaui-web-example" data-example-part="Item">Item</aria-checkbox-item>
</div>

### Markup

```html
<aria-checkbox class="ariaui-web-example" data-example-part="Root">Root</aria-checkbox>
  <aria-checkbox-group class="ariaui-web-example" data-example-part="Group">Group</aria-checkbox-group>
  <aria-checkbox-indicator class="ariaui-web-example" data-example-part="Indicator">Indicator</aria-checkbox-indicator>
  <aria-checkbox-item class="ariaui-web-example" data-example-part="Item">Item</aria-checkbox-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-checkbox` | `checkbox` |
| Group | `aria-checkbox-group` | `group` |
| Indicator | `aria-checkbox-indicator` | `presentation` |
| Item | `aria-checkbox-item` | `checkbox` |

### Usage

```ts
import { defineCheckboxElements } from "@ariaui-web/checkbox";

defineCheckboxElements();
```

The package-level native contract lives in `packages/checkbox/readme.md`.
