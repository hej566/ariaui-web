# Upload

`@ariaui-web/upload` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/upload
```

```bash [pnpm]
pnpm add @ariaui-web/upload
```

```bash [yarn]
yarn add @ariaui-web/upload
```

:::

## Register Elements

```ts
import { defineUploadElements } from "@ariaui-web/upload";

defineUploadElements();
```

## Web Component Contract

`@ariaui-web/upload` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="upload">
  <aria-upload class="ariaui-web-example" data-example-part="Root">Root</aria-upload>
  <aria-upload-item class="ariaui-web-example" data-example-part="Item">Item</aria-upload-item>
  <aria-upload-list class="ariaui-web-example" data-example-part="List">List</aria-upload-list>
  <aria-upload-selector class="ariaui-web-example" data-example-part="Selector">Selector</aria-upload-selector>
</div>

### Markup

```html
<aria-upload class="ariaui-web-example" data-example-part="Root">Root</aria-upload>
  <aria-upload-item class="ariaui-web-example" data-example-part="Item">Item</aria-upload-item>
  <aria-upload-list class="ariaui-web-example" data-example-part="List">List</aria-upload-list>
  <aria-upload-selector class="ariaui-web-example" data-example-part="Selector">Selector</aria-upload-selector>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-upload` | none |
| Item | `aria-upload-item` | `listitem` |
| List | `aria-upload-list` | `list` |
| Selector | `aria-upload-selector` | none |

### Usage

```ts
import { defineUploadElements } from "@ariaui-web/upload";

defineUploadElements();
```

The package-level native contract lives in `packages/upload/readme.md`.
