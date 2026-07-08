# Tabs

`@ariaui-web/tabs` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/tabs
```

```bash [pnpm]
pnpm add @ariaui-web/tabs
```

```bash [yarn]
yarn add @ariaui-web/tabs
```

:::

## Register Elements

```ts
import { defineTabsElements } from "@ariaui-web/tabs";

defineTabsElements();
```

## Web Component Contract

`@ariaui-web/tabs` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="tabs">
  <aria-tabs class="ariaui-web-example" data-example-part="Root">Root</aria-tabs>
  <aria-tabs-content class="ariaui-web-example" data-example-part="Content">Content</aria-tabs-content>
  <aria-tabs-list class="ariaui-web-example" data-example-part="List">List</aria-tabs-list>
  <aria-tabs-panel class="ariaui-web-example" data-example-part="Panel">Panel</aria-tabs-panel>
</div>

### Markup

```html
<aria-tabs class="ariaui-web-example" data-example-part="Root">Root</aria-tabs>
  <aria-tabs-content class="ariaui-web-example" data-example-part="Content">Content</aria-tabs-content>
  <aria-tabs-list class="ariaui-web-example" data-example-part="List">List</aria-tabs-list>
  <aria-tabs-panel class="ariaui-web-example" data-example-part="Panel">Panel</aria-tabs-panel>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-tabs` | none |
| Content | `aria-tabs-content` | none |
| List | `aria-tabs-list` | `tablist` |
| Panel | `aria-tabs-panel` | `tabpanel` |
| Trigger | `aria-tabs-trigger` | `tab` |

### Usage

```ts
import { defineTabsElements } from "@ariaui-web/tabs";

defineTabsElements();
```

The package-level native contract lives in `packages/tabs/readme.md`.
