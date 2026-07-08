# Datepicker

`@ariaui-web/datepicker` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/datepicker
```

```bash [pnpm]
pnpm add @ariaui-web/datepicker
```

```bash [yarn]
yarn add @ariaui-web/datepicker
```

:::

## Register Elements

```ts
import { defineDatepickerElements } from "@ariaui-web/datepicker";

defineDatepickerElements();
```

## Web Component Contract

`@ariaui-web/datepicker` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="datepicker">
  <aria-datepicker class="ariaui-web-example" data-example-part="Root">Root</aria-datepicker>
  <aria-datepicker-calendar class="ariaui-web-example" data-example-part="Calendar">Calendar</aria-datepicker-calendar>
  <aria-datepicker-content class="ariaui-web-example" data-example-part="Content">Content</aria-datepicker-content>
  <aria-datepicker-input class="ariaui-web-example" data-example-part="Input">Input</aria-datepicker-input>
</div>

### Markup

```html
<aria-datepicker class="ariaui-web-example" data-example-part="Root">Root</aria-datepicker>
  <aria-datepicker-calendar class="ariaui-web-example" data-example-part="Calendar">Calendar</aria-datepicker-calendar>
  <aria-datepicker-content class="ariaui-web-example" data-example-part="Content">Content</aria-datepicker-content>
  <aria-datepicker-input class="ariaui-web-example" data-example-part="Input">Input</aria-datepicker-input>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-datepicker` | none |
| Calendar | `aria-datepicker-calendar` | none |
| Content | `aria-datepicker-content` | `region` |
| Input | `aria-datepicker-input` | `textbox` |
| Label | `aria-datepicker-label` | `label` |
| Trigger | `aria-datepicker-trigger` | `button` |

### Usage

```ts
import { defineDatepickerElements } from "@ariaui-web/datepicker";

defineDatepickerElements();
```

The package-level native contract lives in `packages/datepicker/readme.md`.
