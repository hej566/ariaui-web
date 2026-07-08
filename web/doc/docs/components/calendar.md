# Calendar

`@ariaui-web/calendar` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/calendar
```

```bash [pnpm]
pnpm add @ariaui-web/calendar
```

```bash [yarn]
yarn add @ariaui-web/calendar
```

:::

## Register Elements

```ts
import { defineCalendarElements } from "@ariaui-web/calendar";

defineCalendarElements();
```

## Web Component Contract

`@ariaui-web/calendar` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="calendar">
  <aria-calendar class="ariaui-web-example" data-example-part="Root">Root</aria-calendar>
  <aria-calendar-body class="ariaui-web-example" data-example-part="Body">Body</aria-calendar-body>
  <aria-calendar-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-calendar-cell>
  <aria-calendar-header class="ariaui-web-example" data-example-part="Header">Header</aria-calendar-header>
</div>

### Markup

```html
<aria-calendar class="ariaui-web-example" data-example-part="Root">Root</aria-calendar>
  <aria-calendar-body class="ariaui-web-example" data-example-part="Body">Body</aria-calendar-body>
  <aria-calendar-cell class="ariaui-web-example" data-example-part="Cell">Cell</aria-calendar-cell>
  <aria-calendar-header class="ariaui-web-example" data-example-part="Header">Header</aria-calendar-header>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-calendar` | none |
| Body | `aria-calendar-body` | none |
| Cell | `aria-calendar-cell` | none |
| Header | `aria-calendar-header` | `heading` |
| Row | `aria-calendar-row` | `row` |
| Select | `aria-calendar-select` | none |

### Usage

```ts
import { defineCalendarElements } from "@ariaui-web/calendar";

defineCalendarElements();
```

The package-level native contract lives in `packages/calendar/readme.md`.
