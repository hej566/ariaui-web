# Progress

`@ariaui-web/progress` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/progress
```

```bash [pnpm]
pnpm add @ariaui-web/progress
```

```bash [yarn]
yarn add @ariaui-web/progress
```

:::

## Register Elements

```ts
import { defineProgressElements } from "@ariaui-web/progress";

defineProgressElements();
```

## Web Component Contract

`@ariaui-web/progress` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="progress">
  <aria-progress class="ariaui-web-example" data-example-part="Root">Root</aria-progress>
  <aria-progress-indicator class="ariaui-web-example" data-example-part="Indicator">Indicator</aria-progress-indicator>
</div>

### Markup

```html
<aria-progress class="ariaui-web-example" data-example-part="Root">Root</aria-progress>
  <aria-progress-indicator class="ariaui-web-example" data-example-part="Indicator">Indicator</aria-progress-indicator>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-progress` | `progressbar` |
| Indicator | `aria-progress-indicator` | `presentation` |

### Usage

```ts
import { defineProgressElements } from "@ariaui-web/progress";

defineProgressElements();
```

The package-level native contract lives in `packages/progress/readme.md`.
