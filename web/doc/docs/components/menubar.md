# Menubar

`@ariaui-web/menubar` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/menubar
```

```bash [pnpm]
pnpm add @ariaui-web/menubar
```

```bash [yarn]
yarn add @ariaui-web/menubar
```

:::

## Register Elements

```ts
import { defineMenubarElements } from "@ariaui-web/menubar";

defineMenubarElements();
```

## Web Component Contract

`@ariaui-web/menubar` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="menubar">
  <aria-menubar class="ariaui-web-example" data-example-part="Root">Root</aria-menubar>
  <aria-menubar-checkbox-item class="ariaui-web-example" data-example-part="CheckboxItem">CheckboxItem</aria-menubar-checkbox-item>
  <aria-menubar-content class="ariaui-web-example" data-example-part="Content">Content</aria-menubar-content>
  <aria-menubar-group class="ariaui-web-example" data-example-part="Group">Group</aria-menubar-group>
</div>

### Markup

```html
<aria-menubar class="ariaui-web-example" data-example-part="Root">Root</aria-menubar>
  <aria-menubar-checkbox-item class="ariaui-web-example" data-example-part="CheckboxItem">CheckboxItem</aria-menubar-checkbox-item>
  <aria-menubar-content class="ariaui-web-example" data-example-part="Content">Content</aria-menubar-content>
  <aria-menubar-group class="ariaui-web-example" data-example-part="Group">Group</aria-menubar-group>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-menubar` | `menubar` |
| CheckboxItem | `aria-menubar-checkbox-item` | `menuitemcheckbox` |
| Content | `aria-menubar-content` | `menu` |
| Group | `aria-menubar-group` | `group` |
| Item | `aria-menubar-item` | `menuitem` |
| ItemIndicator | `aria-menubar-item-indicator` | `presentation` |
| Label | `aria-menubar-label` | `label` |
| Menu | `aria-menubar-menu` | none |
| RadioGroup | `aria-menubar-radio-group` | `radiogroup` |
| RadioItem | `aria-menubar-radio-item` | `menuitemradio` |
| Separator | `aria-menubar-separator` | `separator` |
| Sub | `aria-menubar-sub` | none |
| SubContent | `aria-menubar-sub-content` | none |
| Submenu | `aria-menubar-submenu` | none |
| SubTrigger | `aria-menubar-sub-trigger` | `button` |
| Trigger | `aria-menubar-trigger` | `button` |

### Usage

```ts
import { defineMenubarElements } from "@ariaui-web/menubar";

defineMenubarElements();
```

The package-level native contract lives in `packages/menubar/readme.md`.
