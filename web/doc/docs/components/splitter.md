# Splitter

`@ariaui-web/splitter` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/splitter
```

```bash [pnpm]
pnpm add @ariaui-web/splitter
```

```bash [yarn]
yarn add @ariaui-web/splitter
```

:::

## Register Elements

```ts
import { defineSplitterElements } from "@ariaui-web/splitter";

defineSplitterElements();
```

## Web Component Contract

`@ariaui-web/splitter` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="splitter">
  <aria-splitter class="ariaui-web-example" data-example-part="Root">Root</aria-splitter>
  <aria-splitter-panel class="ariaui-web-example" data-example-part="Panel">Panel</aria-splitter-panel>
  <aria-splitter-separator class="ariaui-web-example" data-example-part="Separator">Separator</aria-splitter-separator>
</div>

### Markup

```html
<aria-splitter class="ariaui-web-example" data-example-part="Root">Root</aria-splitter>
  <aria-splitter-panel class="ariaui-web-example" data-example-part="Panel">Panel</aria-splitter-panel>
  <aria-splitter-separator class="ariaui-web-example" data-example-part="Separator">Separator</aria-splitter-separator>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-splitter` | none |
| Panel | `aria-splitter-panel` | `tabpanel` |
| Separator | `aria-splitter-separator` | `separator` |

### Usage

```ts
import { defineSplitterElements } from "@ariaui-web/splitter";

defineSplitterElements();
```

The package-level native contract lives in `packages/splitter/readme.md`.
