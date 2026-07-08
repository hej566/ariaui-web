# ContextMenu

`@ariaui-web/context-menu` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/context-menu
```

```bash [pnpm]
pnpm add @ariaui-web/context-menu
```

```bash [yarn]
yarn add @ariaui-web/context-menu
```

:::

## Register Elements

```ts
import { defineContextMenuElements } from "@ariaui-web/context-menu";

defineContextMenuElements();
```

## Web Component Contract

`@ariaui-web/context-menu` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="context-menu">
  <aria-context-menu class="ariaui-web-example" data-example-part="Root">Root</aria-context-menu>
  <aria-context-menu-content class="ariaui-web-example" data-example-part="Content">Content</aria-context-menu-content>
  <aria-context-menu-group class="ariaui-web-example" data-example-part="Group">Group</aria-context-menu-group>
  <aria-context-menu-item class="ariaui-web-example" data-example-part="Item">Item</aria-context-menu-item>
</div>

### Markup

```html
<aria-context-menu class="ariaui-web-example" data-example-part="Root">Root</aria-context-menu>
  <aria-context-menu-content class="ariaui-web-example" data-example-part="Content">Content</aria-context-menu-content>
  <aria-context-menu-group class="ariaui-web-example" data-example-part="Group">Group</aria-context-menu-group>
  <aria-context-menu-item class="ariaui-web-example" data-example-part="Item">Item</aria-context-menu-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-context-menu` | none |
| Content | `aria-context-menu-content` | `menu` |
| Group | `aria-context-menu-group` | `group` |
| Item | `aria-context-menu-item` | `menuitem` |
| Label | `aria-context-menu-label` | `label` |
| Separator | `aria-context-menu-separator` | `separator` |
| Submenu | `aria-context-menu-submenu` | none |

### Usage

```ts
import { defineContextMenuElements } from "@ariaui-web/context-menu";

defineContextMenuElements();
```

The package-level native contract lives in `packages/context-menu/readme.md`.
