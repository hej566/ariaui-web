# Treeview

`@ariaui-web/treeview` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/treeview
```

```bash [pnpm]
pnpm add @ariaui-web/treeview
```

```bash [yarn]
yarn add @ariaui-web/treeview
```

:::

## Register Elements

```ts
import { defineTreeviewElements } from "@ariaui-web/treeview";

defineTreeviewElements();
```

## Web Component Contract

`@ariaui-web/treeview` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="treeview">
  <aria-treeview class="ariaui-web-example" data-example-part="Root">Root</aria-treeview>
  <aria-treeview-checkbox-item class="ariaui-web-example" data-example-part="CheckboxItem">CheckboxItem</aria-treeview-checkbox-item>
  <aria-treeview-group class="ariaui-web-example" data-example-part="Group">Group</aria-treeview-group>
  <aria-treeview-item class="ariaui-web-example" data-example-part="Item">Item</aria-treeview-item>
</div>

### Markup

```html
<aria-treeview class="ariaui-web-example" data-example-part="Root">Root</aria-treeview>
  <aria-treeview-checkbox-item class="ariaui-web-example" data-example-part="CheckboxItem">CheckboxItem</aria-treeview-checkbox-item>
  <aria-treeview-group class="ariaui-web-example" data-example-part="Group">Group</aria-treeview-group>
  <aria-treeview-item class="ariaui-web-example" data-example-part="Item">Item</aria-treeview-item>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-treeview` | `tree` |
| CheckboxItem | `aria-treeview-checkbox-item` | `menuitemcheckbox` |
| Group | `aria-treeview-group` | `group` |
| Item | `aria-treeview-item` | `listitem` |
| Toggle | `aria-treeview-toggle` | `button` |

### Usage

```ts
import { defineTreeviewElements } from "@ariaui-web/treeview";

defineTreeviewElements();
```

The package-level native contract lives in `packages/treeview/readme.md`.
