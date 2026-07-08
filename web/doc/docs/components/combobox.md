# Combobox

`@ariaui-web/combobox` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/combobox
```

```bash [pnpm]
pnpm add @ariaui-web/combobox
```

```bash [yarn]
yarn add @ariaui-web/combobox
```

:::

## Register Elements

```ts
import { defineComboboxElements } from "@ariaui-web/combobox";

defineComboboxElements();
```

## Web Component Contract

`@ariaui-web/combobox` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="combobox">
  <aria-combobox class="ariaui-web-example" data-example-part="Root">Root</aria-combobox>
  <aria-combobox-button class="ariaui-web-example" data-example-part="Button">Button</aria-combobox-button>
  <aria-combobox-content class="ariaui-web-example" data-example-part="Content">Content</aria-combobox-content>
  <aria-combobox-group class="ariaui-web-example" data-example-part="Group">Group</aria-combobox-group>
</div>

### Markup

```html
<aria-combobox class="ariaui-web-example" data-example-part="Root">Root</aria-combobox>
  <aria-combobox-button class="ariaui-web-example" data-example-part="Button">Button</aria-combobox-button>
  <aria-combobox-content class="ariaui-web-example" data-example-part="Content">Content</aria-combobox-content>
  <aria-combobox-group class="ariaui-web-example" data-example-part="Group">Group</aria-combobox-group>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-combobox` | `combobox` |
| Button | `aria-combobox-button` | `button` |
| Content | `aria-combobox-content` | `listbox` |
| Group | `aria-combobox-group` | `group` |
| Input | `aria-combobox-input` | `textbox` |
| Label | `aria-combobox-label` | `label` |
| Option | `aria-combobox-option` | `option` |
| Tag | `aria-combobox-tag` | none |
| TagGroup | `aria-combobox-tag-group` | none |
| Trigger | `aria-combobox-trigger` | `button` |

### Usage

```ts
import { defineComboboxElements } from "@ariaui-web/combobox";

defineComboboxElements();
```

The package-level native contract lives in `packages/combobox/readme.md`.
