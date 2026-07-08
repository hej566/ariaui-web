# Radio

`@ariaui-web/radio` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/radio
```

```bash [pnpm]
pnpm add @ariaui-web/radio
```

```bash [yarn]
yarn add @ariaui-web/radio
```

:::

## Register Elements

```ts
import { defineRadioElements } from "@ariaui-web/radio";

defineRadioElements();
```

## Web Component Contract

`@ariaui-web/radio` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="radio">
  <aria-radio class="ariaui-web-example" data-example-part="Root">Root</aria-radio>
  <aria-radio-indicator class="ariaui-web-example" data-example-part="Indicator">Indicator</aria-radio-indicator>
  <aria-radio-item class="ariaui-web-example" data-example-part="Item">Item</aria-radio-item>
</div>

### Markup

```html
<aria-radio class="ariaui-web-example" data-example-part="Root">Root</aria-radio>
  <aria-radio-indicator class="ariaui-web-example" data-example-part="Indicator">Indicator</aria-radio-indicator>
  <aria-radio-item class="ariaui-web-example" data-example-part="Item">Item</aria-radio-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-radio` | `radiogroup` |
| Indicator | `aria-radio-indicator` | `presentation` |
| Item | `aria-radio-item` | `radio` |

### Usage

```ts
import { defineRadioElements } from "@ariaui-web/radio";

defineRadioElements();
```

The package-level native contract lives in `packages/radio/readme.md`.
