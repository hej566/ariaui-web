# Carousel

`@ariaui-web/carousel` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/carousel
```

```bash [pnpm]
pnpm add @ariaui-web/carousel
```

```bash [yarn]
yarn add @ariaui-web/carousel
```

:::

## Register Elements

```ts
import { defineCarouselElements } from "@ariaui-web/carousel";

defineCarouselElements();
```

## Web Component Contract

`@ariaui-web/carousel` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="carousel">
  <aria-carousel class="ariaui-web-example" data-example-part="Root">Root</aria-carousel>
  <aria-carousel-container class="ariaui-web-example" data-example-part="Container">Container</aria-carousel-container>
  <aria-carousel-next-button class="ariaui-web-example" data-example-part="NextButton">NextButton</aria-carousel-next-button>
  <aria-carousel-previous-button class="ariaui-web-example" data-example-part="PreviousButton">PreviousButton</aria-carousel-previous-button>
</div>

### Markup

```html
<aria-carousel class="ariaui-web-example" data-example-part="Root">Root</aria-carousel>
  <aria-carousel-container class="ariaui-web-example" data-example-part="Container">Container</aria-carousel-container>
  <aria-carousel-next-button class="ariaui-web-example" data-example-part="NextButton">NextButton</aria-carousel-next-button>
  <aria-carousel-previous-button class="ariaui-web-example" data-example-part="PreviousButton">PreviousButton</aria-carousel-previous-button>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-carousel` | none |
| Container | `aria-carousel-container` | none |
| NextButton | `aria-carousel-next-button` | none |
| PreviousButton | `aria-carousel-previous-button` | none |
| Slide | `aria-carousel-slide` | none |
| Viewport | `aria-carousel-viewport` | `group` |

### Usage

```ts
import { defineCarouselElements } from "@ariaui-web/carousel";

defineCarouselElements();
```

The package-level native contract lives in `packages/carousel/readme.md`.
