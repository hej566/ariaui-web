# HoverCard

`@ariaui-web/hover-card` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/hover-card
```

```bash [pnpm]
pnpm add @ariaui-web/hover-card
```

```bash [yarn]
yarn add @ariaui-web/hover-card
```

:::

## Register Elements

```ts
import { defineHoverCardElements } from "@ariaui-web/hover-card";

defineHoverCardElements();
```

## Web Component Contract

`@ariaui-web/hover-card` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="hover-card">
  <aria-hover-card class="ariaui-web-example" data-example-part="Root">Root</aria-hover-card>
  <aria-hover-card-content class="ariaui-web-example" data-example-part="Content">Content</aria-hover-card-content>
  <aria-hover-card-trigger class="ariaui-web-example" data-example-part="Trigger">Trigger</aria-hover-card-trigger>
</div>

### Markup

```html
<aria-hover-card class="ariaui-web-example" data-example-part="Root">Root</aria-hover-card>
  <aria-hover-card-content class="ariaui-web-example" data-example-part="Content">Content</aria-hover-card-content>
  <aria-hover-card-trigger class="ariaui-web-example" data-example-part="Trigger">Trigger</aria-hover-card-trigger>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-hover-card` | none |
| Content | `aria-hover-card-content` | `region` |
| Trigger | `aria-hover-card-trigger` | `button` |

### Usage

```ts
import { defineHoverCardElements } from "@ariaui-web/hover-card";

defineHoverCardElements();
```

The package-level native contract lives in `packages/hover-card/readme.md`.
