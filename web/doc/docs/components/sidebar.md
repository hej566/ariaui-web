# Sidebar

`@ariaui-web/sidebar` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/sidebar
```

```bash [pnpm]
pnpm add @ariaui-web/sidebar
```

```bash [yarn]
yarn add @ariaui-web/sidebar
```

:::

## Register Elements

```ts
import { defineSidebarElements } from "@ariaui-web/sidebar";

defineSidebarElements();
```

## Web Component Contract

`@ariaui-web/sidebar` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="sidebar">
  <aria-sidebar class="ariaui-web-example" data-example-part="Root">Root</aria-sidebar>
  <aria-sidebar-group class="ariaui-web-example" data-example-part="Group">Group</aria-sidebar-group>
  <aria-sidebar-inset class="ariaui-web-example" data-example-part="Inset">Inset</aria-sidebar-inset>
  <aria-sidebar-layout class="ariaui-web-example" data-example-part="Layout">Layout</aria-sidebar-layout>
</div>

### Markup

```html
<aria-sidebar class="ariaui-web-example" data-example-part="Root">Root</aria-sidebar>
  <aria-sidebar-group class="ariaui-web-example" data-example-part="Group">Group</aria-sidebar-group>
  <aria-sidebar-inset class="ariaui-web-example" data-example-part="Inset">Inset</aria-sidebar-inset>
  <aria-sidebar-layout class="ariaui-web-example" data-example-part="Layout">Layout</aria-sidebar-layout>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-sidebar` | none |
| Group | `aria-sidebar-group` | `group` |
| Inset | `aria-sidebar-inset` | none |
| Layout | `aria-sidebar-layout` | none |
| Menu | `aria-sidebar-menu` | none |
| Panel | `aria-sidebar-panel` | `tabpanel` |
| Rail | `aria-sidebar-rail` | none |
| Trigger | `aria-sidebar-trigger` | `button` |

### Usage

```ts
import { defineSidebarElements } from "@ariaui-web/sidebar";

defineSidebarElements();
```

The package-level native contract lives in `packages/sidebar/readme.md`.
