# Slot

`@ariaui-web/slot` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/slot
```

```bash [pnpm]
pnpm add @ariaui-web/slot
```

```bash [yarn]
yarn add @ariaui-web/slot
```

:::

## Register Elements

```ts
import { defineSlotElements } from "@ariaui-web/slot";

defineSlotElements();
```

## Web Component Contract

`@ariaui-web/slot` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="slot">
  <aria-slot-slot class="ariaui-web-example" data-example-part="Slot">Slot</aria-slot-slot>
</div>

### Markup

```html
<aria-slot-slot class="ariaui-web-example" data-example-part="Slot">Slot</aria-slot-slot>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Slot | `aria-slot-slot` | none |

### Usage

```ts
import { defineSlotElements } from "@ariaui-web/slot";

defineSlotElements();
```

The package-level native contract lives in `packages/slot/readme.md`.
