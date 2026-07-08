# Tooltip

`@ariaui-web/tooltip` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/tooltip
```

```bash [pnpm]
pnpm add @ariaui-web/tooltip
```

```bash [yarn]
yarn add @ariaui-web/tooltip
```

:::

## Register Elements

```ts
import { defineTooltipElements } from "@ariaui-web/tooltip";

defineTooltipElements();
```

## Web Component Contract

`@ariaui-web/tooltip` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="tooltip">
  <aria-tooltip class="ariaui-web-example" data-example-part="Root">Root</aria-tooltip>
  <aria-tooltip-content class="ariaui-web-example" data-example-part="Content">Content</aria-tooltip-content>
  <aria-tooltip-trigger class="ariaui-web-example" data-example-part="Trigger">Trigger</aria-tooltip-trigger>
</div>

### Markup

```html
<aria-tooltip class="ariaui-web-example" data-example-part="Root">Root</aria-tooltip>
  <aria-tooltip-content class="ariaui-web-example" data-example-part="Content">Content</aria-tooltip-content>
  <aria-tooltip-trigger class="ariaui-web-example" data-example-part="Trigger">Trigger</aria-tooltip-trigger>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-tooltip` | none |
| Content | `aria-tooltip-content` | `region` |
| Trigger | `aria-tooltip-trigger` | `button` |

### Usage

```ts
import { defineTooltipElements } from "@ariaui-web/tooltip";

defineTooltipElements();
```

The package-level native contract lives in `packages/tooltip/readme.md`.
