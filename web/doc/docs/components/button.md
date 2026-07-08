# Button

`@ariaui-web/button` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/button
```

```bash [pnpm]
pnpm add @ariaui-web/button
```

```bash [yarn]
yarn add @ariaui-web/button
```

:::

## Register Elements

```ts
import { defineButtonElements } from "@ariaui-web/button";

defineButtonElements();
```

## Web Component Contract

`@ariaui-web/button` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="button">
  <aria-button class="ariaui-web-example" data-example-part="Root">Root</aria-button>
  <aria-button-group class="ariaui-web-example" data-example-part="Group">Group</aria-button-group>
  <aria-button-item class="ariaui-web-example" data-example-part="Item">Item</aria-button-item>
</div>

### Markup

```html
<aria-button class="ariaui-web-example" data-example-part="Root">Root</aria-button>
  <aria-button-group class="ariaui-web-example" data-example-part="Group">Group</aria-button-group>
  <aria-button-item class="ariaui-web-example" data-example-part="Item">Item</aria-button-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-button` | `button` |
| Group | `aria-button-group` | `group` |
| Item | `aria-button-item` | `button` |

### Usage

```ts
import { defineButtonElements } from "@ariaui-web/button";

defineButtonElements();
```

The package-level native contract lives in `packages/button/readme.md`.
