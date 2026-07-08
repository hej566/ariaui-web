# Disclosure

`@ariaui-web/disclosure` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/disclosure
```

```bash [pnpm]
pnpm add @ariaui-web/disclosure
```

```bash [yarn]
yarn add @ariaui-web/disclosure
```

:::

## Register Elements

```ts
import { defineDisclosureElements } from "@ariaui-web/disclosure";

defineDisclosureElements();
```

## Web Component Contract

`@ariaui-web/disclosure` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="disclosure">
  <aria-disclosure class="ariaui-web-example" data-example-part="Root">Root</aria-disclosure>
  <aria-disclosure-content class="ariaui-web-example" data-example-part="Content">Content</aria-disclosure-content>
  <aria-disclosure-trigger class="ariaui-web-example" data-example-part="Trigger">Trigger</aria-disclosure-trigger>
</div>

### Markup

```html
<aria-disclosure class="ariaui-web-example" data-example-part="Root">Root</aria-disclosure>
  <aria-disclosure-content class="ariaui-web-example" data-example-part="Content">Content</aria-disclosure-content>
  <aria-disclosure-trigger class="ariaui-web-example" data-example-part="Trigger">Trigger</aria-disclosure-trigger>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-disclosure` | none |
| Content | `aria-disclosure-content` | `region` |
| Trigger | `aria-disclosure-trigger` | `button` |

### Usage

```ts
import { defineDisclosureElements } from "@ariaui-web/disclosure";

defineDisclosureElements();
```

The package-level native contract lives in `packages/disclosure/readme.md`.
