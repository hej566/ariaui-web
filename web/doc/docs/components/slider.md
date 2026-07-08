# Slider

`@ariaui-web/slider` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/slider
```

```bash [pnpm]
pnpm add @ariaui-web/slider
```

```bash [yarn]
yarn add @ariaui-web/slider
```

:::

## Register Elements

```ts
import { defineSliderElements } from "@ariaui-web/slider";

defineSliderElements();
```

## Web Component Contract

`@ariaui-web/slider` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="slider">
  <aria-slider class="ariaui-web-example" data-example-part="Root">Root</aria-slider>
  <aria-slider-range class="ariaui-web-example" data-example-part="Range">Range</aria-slider-range>
  <aria-slider-thumb class="ariaui-web-example" data-example-part="Thumb">Thumb</aria-slider-thumb>
  <aria-slider-track class="ariaui-web-example" data-example-part="Track">Track</aria-slider-track>
</div>

### Markup

```html
<aria-slider class="ariaui-web-example" data-example-part="Root">Root</aria-slider>
  <aria-slider-range class="ariaui-web-example" data-example-part="Range">Range</aria-slider-range>
  <aria-slider-thumb class="ariaui-web-example" data-example-part="Thumb">Thumb</aria-slider-thumb>
  <aria-slider-track class="ariaui-web-example" data-example-part="Track">Track</aria-slider-track>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-slider` | `group` |
| Range | `aria-slider-range` | `presentation` |
| Thumb | `aria-slider-thumb` | `presentation` |
| Track | `aria-slider-track` | `presentation` |

### Usage

```ts
import { defineSliderElements } from "@ariaui-web/slider";

defineSliderElements();
```

The package-level native contract lives in `packages/slider/readme.md`.
