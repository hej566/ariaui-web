# Popover

`@ariaui-web/popover` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/popover
```

```bash [pnpm]
pnpm add @ariaui-web/popover
```

```bash [yarn]
yarn add @ariaui-web/popover
```

:::

## Register Elements

```ts
import { definePopoverElements } from "@ariaui-web/popover";

definePopoverElements();
```

## Web Component Contract

`@ariaui-web/popover` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="popover">
  <aria-popover class="ariaui-web-example" data-example-part="Root">Root</aria-popover>
  <aria-popover-close class="ariaui-web-example" data-example-part="Close">Close</aria-popover-close>
  <aria-popover-content class="ariaui-web-example" data-example-part="Content">Content</aria-popover-content>
  <aria-popover-description class="ariaui-web-example" data-example-part="Description">Description</aria-popover-description>
</div>

### Markup

```html
<aria-popover class="ariaui-web-example" data-example-part="Root">Root</aria-popover>
  <aria-popover-close class="ariaui-web-example" data-example-part="Close">Close</aria-popover-close>
  <aria-popover-content class="ariaui-web-example" data-example-part="Content">Content</aria-popover-content>
  <aria-popover-description class="ariaui-web-example" data-example-part="Description">Description</aria-popover-description>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-popover` | none |
| Close | `aria-popover-close` | `button` |
| Content | `aria-popover-content` | `region` |
| Description | `aria-popover-description` | `note` |
| Heading | `aria-popover-heading` | none |
| Trigger | `aria-popover-trigger` | `button` |

### Usage

```ts
import { definePopoverElements } from "@ariaui-web/popover";

definePopoverElements();
```

The package-level native contract lives in `packages/popover/readme.md`.
