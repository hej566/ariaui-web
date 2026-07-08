# Select

`@ariaui-web/select` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/select
```

```bash [pnpm]
pnpm add @ariaui-web/select
```

```bash [yarn]
yarn add @ariaui-web/select
```

:::

## Register Elements

```ts
import { defineSelectElements } from "@ariaui-web/select";

defineSelectElements();
```

## Web Component Contract

`@ariaui-web/select` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="select">
  <aria-select class="ariaui-web-example" data-example-part="Root">Root</aria-select>
  <aria-select-content class="ariaui-web-example" data-example-part="Content">Content</aria-select-content>
  <aria-select-dropdown-indicator class="ariaui-web-example" data-example-part="DropdownIndicator">DropdownIndicator</aria-select-dropdown-indicator>
  <aria-select-group class="ariaui-web-example" data-example-part="Group">Group</aria-select-group>
</div>

### Markup

```html
<aria-select class="ariaui-web-example" data-example-part="Root">Root</aria-select>
  <aria-select-content class="ariaui-web-example" data-example-part="Content">Content</aria-select-content>
  <aria-select-dropdown-indicator class="ariaui-web-example" data-example-part="DropdownIndicator">DropdownIndicator</aria-select-dropdown-indicator>
  <aria-select-group class="ariaui-web-example" data-example-part="Group">Group</aria-select-group>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-select` | none |
| Content | `aria-select-content` | `listbox` |
| DropdownIndicator | `aria-select-dropdown-indicator` | none |
| Group | `aria-select-group` | `group` |
| GroupLabel | `aria-select-group-label` | none |
| Label | `aria-select-label` | `label` |
| Option | `aria-select-option` | `option` |
| Sub | `aria-select-sub` | none |
| SubContent | `aria-select-sub-content` | none |
| SubTrigger | `aria-select-sub-trigger` | `button` |
| Tag | `aria-select-tag` | none |
| TagGroup | `aria-select-tag-group` | none |
| Trigger | `aria-select-trigger` | `button` |

### Usage

```ts
import { defineSelectElements } from "@ariaui-web/select";

defineSelectElements();
```

The package-level native contract lives in `packages/select/readme.md`.
