# Listbox

`@ariaui-web/listbox` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/listbox
```

```bash [pnpm]
pnpm add @ariaui-web/listbox
```

```bash [yarn]
yarn add @ariaui-web/listbox
```

:::

## Register Elements

```ts
import { defineListboxElements } from "@ariaui-web/listbox";

defineListboxElements();
```

## Web Component Contract

`@ariaui-web/listbox` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="listbox">
  <aria-listbox class="ariaui-web-example" data-example-part="Root">Root</aria-listbox>
  <aria-listbox-content class="ariaui-web-example" data-example-part="Content">Content</aria-listbox-content>
  <aria-listbox-group class="ariaui-web-example" data-example-part="Group">Group</aria-listbox-group>
  <aria-listbox-group-label class="ariaui-web-example" data-example-part="GroupLabel">GroupLabel</aria-listbox-group-label>
</div>

### Markup

```html
<aria-listbox class="ariaui-web-example" data-example-part="Root">Root</aria-listbox>
  <aria-listbox-content class="ariaui-web-example" data-example-part="Content">Content</aria-listbox-content>
  <aria-listbox-group class="ariaui-web-example" data-example-part="Group">Group</aria-listbox-group>
  <aria-listbox-group-label class="ariaui-web-example" data-example-part="GroupLabel">GroupLabel</aria-listbox-group-label>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-listbox` | `listbox` |
| Content | `aria-listbox-content` | `listbox` |
| Group | `aria-listbox-group` | `group` |
| GroupLabel | `aria-listbox-group-label` | none |
| Label | `aria-listbox-label` | `label` |
| Option | `aria-listbox-option` | `option` |
| Submenu | `aria-listbox-submenu` | none |
| Viewport | `aria-listbox-viewport` | `group` |

### Usage

```ts
import { defineListboxElements } from "@ariaui-web/listbox";

defineListboxElements();
```

The package-level native contract lives in `packages/listbox/readme.md`.
