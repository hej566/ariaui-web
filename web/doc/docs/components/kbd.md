# Kbd

`@ariaui-web/kbd` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/kbd
```

```bash [pnpm]
pnpm add @ariaui-web/kbd
```

```bash [yarn]
yarn add @ariaui-web/kbd
```

:::

## Register Elements

```ts
import { defineKbdElements } from "@ariaui-web/kbd";

defineKbdElements();
```

## Web Component Contract

`@ariaui-web/kbd` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="kbd">
  <aria-kbd class="ariaui-web-example" data-example-part="Root">Root</aria-kbd>
  <aria-kbd-group class="ariaui-web-example" data-example-part="Group">Group</aria-kbd-group>
</div>

### Markup

```html
<aria-kbd class="ariaui-web-example" data-example-part="Root">Root</aria-kbd>
  <aria-kbd-group class="ariaui-web-example" data-example-part="Group">Group</aria-kbd-group>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-kbd` | none |
| Group | `aria-kbd-group` | `group` |

### Usage

```ts
import { defineKbdElements } from "@ariaui-web/kbd";

defineKbdElements();
```

The package-level native contract lives in `packages/kbd/readme.md`.
