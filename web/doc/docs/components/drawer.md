# Drawer

`@ariaui-web/drawer` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/drawer
```

```bash [pnpm]
pnpm add @ariaui-web/drawer
```

```bash [yarn]
yarn add @ariaui-web/drawer
```

:::

## Register Elements

```ts
import { defineDrawerElements } from "@ariaui-web/drawer";

defineDrawerElements();
```

## Web Component Contract

`@ariaui-web/drawer` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="drawer">
  <aria-drawer class="ariaui-web-example" data-example-part="Root">Root</aria-drawer>
  <aria-drawer-action class="ariaui-web-example" data-example-part="Action">Action</aria-drawer-action>
  <aria-drawer-cancel class="ariaui-web-example" data-example-part="Cancel">Cancel</aria-drawer-cancel>
  <aria-drawer-close class="ariaui-web-example" data-example-part="Close">Close</aria-drawer-close>
</div>

### Markup

```html
<aria-drawer class="ariaui-web-example" data-example-part="Root">Root</aria-drawer>
  <aria-drawer-action class="ariaui-web-example" data-example-part="Action">Action</aria-drawer-action>
  <aria-drawer-cancel class="ariaui-web-example" data-example-part="Cancel">Cancel</aria-drawer-cancel>
  <aria-drawer-close class="ariaui-web-example" data-example-part="Close">Close</aria-drawer-close>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-drawer` | none |
| Action | `aria-drawer-action` | `button` |
| Cancel | `aria-drawer-cancel` | `button` |
| Close | `aria-drawer-close` | `button` |
| Content | `aria-drawer-content` | `region` |
| Description | `aria-drawer-description` | `note` |
| Footer | `aria-drawer-footer` | none |
| Header | `aria-drawer-header` | `heading` |
| Overlay | `aria-drawer-overlay` | `presentation` |
| Portal | `aria-drawer-portal` | none |
| Title | `aria-drawer-title` | `heading` |
| Trigger | `aria-drawer-trigger` | `button` |

### Usage

```ts
import { defineDrawerElements } from "@ariaui-web/drawer";

defineDrawerElements();
```

The package-level native contract lives in `packages/drawer/readme.md`.
