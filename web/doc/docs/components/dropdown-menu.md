# DropdownMenu

`@ariaui-web/dropdown-menu` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/dropdown-menu
```

```bash [pnpm]
pnpm add @ariaui-web/dropdown-menu
```

```bash [yarn]
yarn add @ariaui-web/dropdown-menu
```

:::

## Register Elements

```ts
import { defineDropdownMenuElements } from "@ariaui-web/dropdown-menu";

defineDropdownMenuElements();
```

## Web Component Contract

`@ariaui-web/dropdown-menu` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="dropdown-menu">
  <aria-dropdown-menu class="ariaui-web-example" data-example-part="Root">Root</aria-dropdown-menu>
  <aria-dropdown-menu-checkbox-item class="ariaui-web-example" data-example-part="CheckboxItem">CheckboxItem</aria-dropdown-menu-checkbox-item>
  <aria-dropdown-menu-content class="ariaui-web-example" data-example-part="Content">Content</aria-dropdown-menu-content>
  <aria-dropdown-menu-group class="ariaui-web-example" data-example-part="Group">Group</aria-dropdown-menu-group>
</div>

### Markup

```html
<aria-dropdown-menu class="ariaui-web-example" data-example-part="Root">Root</aria-dropdown-menu>
  <aria-dropdown-menu-checkbox-item class="ariaui-web-example" data-example-part="CheckboxItem">CheckboxItem</aria-dropdown-menu-checkbox-item>
  <aria-dropdown-menu-content class="ariaui-web-example" data-example-part="Content">Content</aria-dropdown-menu-content>
  <aria-dropdown-menu-group class="ariaui-web-example" data-example-part="Group">Group</aria-dropdown-menu-group>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-dropdown-menu` | none |
| CheckboxItem | `aria-dropdown-menu-checkbox-item` | `menuitemcheckbox` |
| Content | `aria-dropdown-menu-content` | `menu` |
| Group | `aria-dropdown-menu-group` | `group` |
| Item | `aria-dropdown-menu-item` | `menuitem` |
| Label | `aria-dropdown-menu-label` | `label` |
| RadioGroup | `aria-dropdown-menu-radio-group` | `radiogroup` |
| RadioItem | `aria-dropdown-menu-radio-item` | `menuitemradio` |
| Separator | `aria-dropdown-menu-separator` | `separator` |
| Sub | `aria-dropdown-menu-sub` | none |
| Trigger | `aria-dropdown-menu-trigger` | `button` |

### Usage

```ts
import { defineDropdownMenuElements } from "@ariaui-web/dropdown-menu";

defineDropdownMenuElements();
```

The package-level native contract lives in `packages/dropdown-menu/readme.md`.
