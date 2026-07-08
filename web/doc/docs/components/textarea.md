# Textarea

`@ariaui-web/textarea` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/textarea
```

```bash [pnpm]
pnpm add @ariaui-web/textarea
```

```bash [yarn]
yarn add @ariaui-web/textarea
```

:::

## Register Elements

```ts
import { defineTextareaElements } from "@ariaui-web/textarea";

defineTextareaElements();
```

## Web Component Contract

`@ariaui-web/textarea` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="textarea">
  <aria-textarea class="ariaui-web-example" data-example-part="Root">Root</aria-textarea>
</div>

### Markup

```html
<aria-textarea class="ariaui-web-example" data-example-part="Root">Root</aria-textarea>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-textarea` | none |

### Usage

```ts
import { defineTextareaElements } from "@ariaui-web/textarea";

defineTextareaElements();
```

The package-level native contract lives in `packages/textarea/readme.md`.
