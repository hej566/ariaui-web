# Datepicker

A composable date picker with masked input, popup calendar, and support for single, range, and dual-range selection.

## Features

- Input with masked entry
- Popup calendar
- Single, range, and dual-range modes
- Controlled or uncontrolled attributes
- Focus restoration on close
- Headless styling with browser-native custom elements

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

### Register Elements

```ts
import { defineDatepickerElements } from "@ariaui-web/datepicker";

defineDatepickerElements();
```

## Examples

### Single

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="datepicker" data-example-variant="single">
  <aria-datepicker class="relative" data-example-part="Root" mode="single" input-mask="mdy" default-value="2025-01-20" default-visible-month="2025-01-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Date of birth</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Date input" placeholder="Select date"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open date picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content class="origin-top">
      <aria-datepicker-calendar>
        <aria-calendar class="w-[248px] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <aria-calendar-header class="relative flex h-8 items-center justify-center px-8">
            <aria-calendar-header-previous aria-label="Previous month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg></aria-calendar-header-previous>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground"><aria-calendar-header-month></aria-calendar-header-month> <aria-calendar-header-year></aria-calendar-header-year></span>
            <aria-calendar-header-next aria-label="Next month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></aria-calendar-header-next>
          </aria-calendar-header>
          <aria-calendar-body></aria-calendar-body>
        </aria-calendar>
      </aria-datepicker-calendar>
    </aria-datepicker-content>
  </aria-datepicker>
</div>

```html
<aria-datepicker class="relative" data-example-part="Root" mode="single" input-mask="mdy" default-value="2025-01-20" default-visible-month="2025-01-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Date of birth</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Date input" placeholder="Select date"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open date picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content class="origin-top">
      <aria-datepicker-calendar>
        <aria-calendar class="w-[248px] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <aria-calendar-header class="relative flex h-8 items-center justify-center px-8">
            <aria-calendar-header-previous aria-label="Previous month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg></aria-calendar-header-previous>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground"><aria-calendar-header-month></aria-calendar-header-month> <aria-calendar-header-year></aria-calendar-header-year></span>
            <aria-calendar-header-next aria-label="Next month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></aria-calendar-header-next>
          </aria-calendar-header>
          <aria-calendar-body></aria-calendar-body>
        </aria-calendar>
      </aria-datepicker-calendar>
    </aria-datepicker-content>
  </aria-datepicker>
```

### Range

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="datepicker" data-example-variant="range">
  <aria-datepicker class="relative" data-example-part="Root" mode="range" input-mask="iso" default-value="2025-01-12,2025-01-18" default-visible-month="2025-01-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Trip dates</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Date range input" placeholder="Select date"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open date range picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content class="origin-top">
      <aria-datepicker-calendar>
        <aria-calendar class="w-[248px] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <aria-calendar-header class="relative flex h-8 items-center justify-center px-8">
            <aria-calendar-header-previous aria-label="Previous month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg></aria-calendar-header-previous>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground"><aria-calendar-header-month></aria-calendar-header-month> <aria-calendar-header-year></aria-calendar-header-year></span>
            <aria-calendar-header-next aria-label="Next month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></aria-calendar-header-next>
          </aria-calendar-header>
          <aria-calendar-body></aria-calendar-body>
        </aria-calendar>
      </aria-datepicker-calendar>
    </aria-datepicker-content>
  </aria-datepicker>
</div>

```html
<aria-datepicker class="relative" data-example-part="Root" mode="range" input-mask="iso" default-value="2025-01-12,2025-01-18" default-visible-month="2025-01-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Trip dates</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Date range input" placeholder="Select date"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open date range picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content class="origin-top">
      <aria-datepicker-calendar>
        <aria-calendar class="w-[248px] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <aria-calendar-header class="relative flex h-8 items-center justify-center px-8">
            <aria-calendar-header-previous aria-label="Previous month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg></aria-calendar-header-previous>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground"><aria-calendar-header-month></aria-calendar-header-month> <aria-calendar-header-year></aria-calendar-header-year></span>
            <aria-calendar-header-next aria-label="Next month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></aria-calendar-header-next>
          </aria-calendar-header>
          <aria-calendar-body></aria-calendar-body>
        </aria-calendar>
      </aria-datepicker-calendar>
    </aria-datepicker-content>
  </aria-datepicker>
```

### Dual Range

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="datepicker" data-example-variant="dual-range">
  <aria-datepicker class="relative" data-example-part="Root" mode="dual-range" input-mask="mdy" default-value="2025-01-12,2025-02-08" default-visible-month="2025-01-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Stay dates</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Dual-range date input" placeholder="MM/DD/YYYY - MM/DD/YYYY"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open dual range picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content class="origin-top">
      <aria-datepicker-calendar>
        <aria-calendar class="w-fit rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <aria-calendar-body></aria-calendar-body>
        </aria-calendar>
      </aria-datepicker-calendar>
    </aria-datepicker-content>
  </aria-datepicker>
</div>

```html
<aria-datepicker class="relative" data-example-part="Root" mode="dual-range" input-mask="mdy" default-value="2025-01-12,2025-02-08" default-visible-month="2025-01-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Stay dates</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Dual-range date input" placeholder="MM/DD/YYYY - MM/DD/YYYY"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open dual range picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content class="origin-top">
      <aria-datepicker-calendar>
        <aria-calendar class="w-fit rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <aria-calendar-body></aria-calendar-body>
        </aria-calendar>
      </aria-datepicker-calendar>
    </aria-datepicker-content>
  </aria-datepicker>
```

### Framer Motion

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="datepicker" data-example-variant="framer-motion">
  <aria-datepicker class="relative" data-datepicker-motion="" data-example-part="Root" mode="single" input-mask="mdy" default-value="2025-03-15" default-visible-month="2025-03-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Launch date</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Motion date input" placeholder="Select date"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open motion date picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content native-composition>
      <div class="origin-top" data-framer-motion-content="">
        <aria-datepicker-calendar>
          <aria-calendar class="w-[248px] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
            <aria-calendar-header class="relative flex h-8 items-center justify-center px-8">
              <aria-calendar-header-previous aria-label="Previous month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg></aria-calendar-header-previous>
              <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground"><aria-calendar-header-month></aria-calendar-header-month> <aria-calendar-header-year></aria-calendar-header-year></span>
              <aria-calendar-header-next aria-label="Next month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></aria-calendar-header-next>
            </aria-calendar-header>
            <aria-calendar-body></aria-calendar-body>
          </aria-calendar>
        </aria-datepicker-calendar>
      </div>
    </aria-datepicker-content>
  </aria-datepicker>
</div>

```html
<aria-datepicker class="relative" data-datepicker-motion="" data-example-part="Root" mode="single" input-mask="mdy" default-value="2025-03-15" default-visible-month="2025-03-01">
    <aria-datepicker-label class="mb-3 block text-sm font-medium leading-5 text-foreground" data-example-part="Label">Launch date</aria-datepicker-label>
    <div class="relative flex h-9 w-full items-center ariaui-web-datepicker-field-row">
      <aria-datepicker-input class="flex h-9 w-[248px] rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-5 text-foreground shadow-xs hover:border-border placeholder:text-muted-foreground" data-example-part="Input" aria-label="Motion date input" placeholder="Select date"></aria-datepicker-input>
      <aria-datepicker-trigger class="group absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center" data-example-part="Trigger" aria-label="Open motion date picker">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-datepicker-trigger>
    </div>
    <aria-datepicker-content native-composition>
      <div class="origin-top" data-framer-motion-content="">
        <aria-datepicker-calendar>
          <aria-calendar class="w-[248px] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md">
            <aria-calendar-header class="relative flex h-8 items-center justify-center px-8">
              <aria-calendar-header-previous aria-label="Previous month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg></aria-calendar-header-previous>
              <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground"><aria-calendar-header-month></aria-calendar-header-month> <aria-calendar-header-year></aria-calendar-header-year></span>
              <aria-calendar-header-next aria-label="Next month"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></aria-calendar-header-next>
            </aria-calendar-header>
            <aria-calendar-body></aria-calendar-body>
          </aria-calendar>
        </aria-datepicker-calendar>
      </div>
    </aria-datepicker-content>
  </aria-datepicker>
```

## Anatomy

```html
<aria-datepicker>
  <aria-datepicker-label></aria-datepicker-label>
  <aria-datepicker-input></aria-datepicker-input>
  <aria-datepicker-trigger></aria-datepicker-trigger>
  <aria-datepicker-content>
    <aria-datepicker-calendar>
      <aria-calendar></aria-calendar>
    </aria-datepicker-calendar>
  </aria-datepicker-content>
</aria-datepicker>
```

## API Reference

| Part | Custom element | Role |
| --- | --- | --- |
| Root | `aria-datepicker` | none |
| Label | `aria-datepicker-label` | `label` |
| Trigger | `aria-datepicker-trigger` | `button` |
| Input | `aria-datepicker-input` | `textbox` |
| Content | `aria-datepicker-content` | `dialog` |
| Calendar | `aria-datepicker-calendar` | none |
| CalendarHeader | `aria-datepicker-calendar-header` | none |
| CalendarPrevious | `aria-datepicker-calendar-previous` | `button` |
| CalendarMonth | `aria-datepicker-calendar-month` | none |
| CalendarMonthSelect | `aria-datepicker-calendar-month-select` | `button` |
| CalendarYear | `aria-datepicker-calendar-year` | none |
| CalendarYearSelect | `aria-datepicker-calendar-year-select` | `button` |
| CalendarNext | `aria-datepicker-calendar-next` | `button` |
| CalendarBody | `aria-datepicker-calendar-body` | `grid` |

| Root attribute | Values |
| --- | --- |
| `mode` | `single`, `range`, `dual-range` |
| `default-value` / `value` | ISO dates, comma-separated for ranges |
| `default-visible-month` / `visible-month` | ISO date |
| `default-open` / `open` | Boolean attribute |
| `input-mask` | `mdy`, `iso`, `custom` |
| `mask-delimiter` | Text between range dates, default ` - ` |

## Keyboard Interactions

| Key | Interaction |
| --- | --- |
| `Enter` on input | Commit typed text |
| `ArrowDown` on input | Open the popup calendar |
| `Enter` or `Space` on trigger | Toggle the popup calendar |
| `Escape` | Close the popup and restore focus to the input |
| Arrow keys in calendar | Move through the calendar grid |
| `Enter` or `Space` on a date | Select that date |

## Accessibility

- The trigger and input expose `aria-haspopup="dialog"`.
- The trigger reflects `aria-expanded`.
- Content exposes dialog semantics and is labelled by the datepicker label.
- The embedded calendar owns grid roles, selected date state, disabled outside-month dates, range markers, and date-grid keyboard movement.
