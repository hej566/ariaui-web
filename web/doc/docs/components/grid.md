# Grid

A headless, accessible grid primitive with roving tabindex, cell selection, and full keyboard navigation following the WAI-ARIA Grid pattern.

## Features

- Full keyboard navigation
- Roving tabindex focus management
- Cell, row, column, and multi-cell selection
- Semantic ARIA roles
- Structural validation
- Foundation for calendars and data tables

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/grid
```

```bash [pnpm]
pnpm add @ariaui-web/grid
```

```bash [yarn]
yarn add @ariaui-web/grid
```

:::

### Register Elements

```ts
import { defineGridElements } from "@ariaui-web/grid";

defineGridElements();
```

## Examples

The live examples below are native custom element entries for the `grid` page, matching the source Aria UI examples.

### Uncontrolled

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="grid" data-example-variant="uncontrolled">
  <div class="flex w-full max-w-md flex-col gap-3">
    <aria-grid aria-label="Team members" class="w-full max-w-md rounded-xl border border-border/20 bg-background/90 text-left shadow-lg backdrop-blur-xl" data-example-part="Root" default-value="jane:role">
      <aria-grid-head data-example-part="Head">
        <aria-grid-row class="border-b border-border-secondary bg-muted/50" data-example-part="Row">
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Name</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Role</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Status</aria-grid-header>
        </aria-grid-row>
      </aria-grid-head>
      <aria-grid-body data-example-part="Body">
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="john:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">John Doe</aria-grid-cell>
          <aria-grid-cell value="john:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Admin</aria-grid-cell>
          <aria-grid-cell value="john:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="jane:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Jane Smith</aria-grid-cell>
          <aria-grid-cell value="jane:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Member</aria-grid-cell>
          <aria-grid-cell value="jane:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30" data-example-part="Row">
          <aria-grid-cell value="bob:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Bob Jones</aria-grid-cell>
          <aria-grid-cell value="bob:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Viewer</aria-grid-cell>
          <aria-grid-cell value="bob:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Inactive</aria-grid-cell>
        </aria-grid-row>
      </aria-grid-body>
    </aria-grid>
    <div class="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border/20 bg-muted/30 px-3 py-2 text-xs text-muted-foreground" data-grid-selected-values>
    <span class="font-medium text-foreground">Selected values</span>
    <span class="rounded-md bg-accent px-2 py-1 font-medium text-foreground">jane:role</span>
  </div>
  </div>
</div>

```html
<div class="flex w-full max-w-md flex-col gap-3">
    <aria-grid aria-label="Team members" class="w-full max-w-md rounded-xl border border-border/20 bg-background/90 text-left shadow-lg backdrop-blur-xl" data-example-part="Root" default-value="jane:role">
      <aria-grid-head data-example-part="Head">
        <aria-grid-row class="border-b border-border-secondary bg-muted/50" data-example-part="Row">
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Name</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Role</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Status</aria-grid-header>
        </aria-grid-row>
      </aria-grid-head>
      <aria-grid-body data-example-part="Body">
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="john:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">John Doe</aria-grid-cell>
          <aria-grid-cell value="john:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Admin</aria-grid-cell>
          <aria-grid-cell value="john:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="jane:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Jane Smith</aria-grid-cell>
          <aria-grid-cell value="jane:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Member</aria-grid-cell>
          <aria-grid-cell value="jane:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30" data-example-part="Row">
          <aria-grid-cell value="bob:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Bob Jones</aria-grid-cell>
          <aria-grid-cell value="bob:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Viewer</aria-grid-cell>
          <aria-grid-cell value="bob:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Inactive</aria-grid-cell>
        </aria-grid-row>
      </aria-grid-body>
    </aria-grid>
    <div class="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border/20 bg-muted/30 px-3 py-2 text-xs text-muted-foreground" data-grid-selected-values>
    <span class="font-medium text-foreground">Selected values</span>
    <span class="rounded-md bg-accent px-2 py-1 font-medium text-foreground">jane:role</span>
  </div>
  </div>
```

### Controlled

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="grid" data-example-variant="controlled">
  <div class="flex w-full max-w-md flex-col gap-3">
    <aria-grid aria-label="Team members" class="w-full max-w-md rounded-xl border border-border/20 bg-background/90 text-left shadow-lg backdrop-blur-xl" data-example-part="Root" value="bob:status">
      <aria-grid-head data-example-part="Head">
        <aria-grid-row class="border-b border-border-secondary bg-muted/50" data-example-part="Row">
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Name</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Role</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Status</aria-grid-header>
        </aria-grid-row>
      </aria-grid-head>
      <aria-grid-body data-example-part="Body">
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="john:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">John Doe</aria-grid-cell>
          <aria-grid-cell value="john:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Admin</aria-grid-cell>
          <aria-grid-cell value="john:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="jane:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Jane Smith</aria-grid-cell>
          <aria-grid-cell value="jane:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Member</aria-grid-cell>
          <aria-grid-cell value="jane:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30" data-example-part="Row">
          <aria-grid-cell value="bob:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Bob Jones</aria-grid-cell>
          <aria-grid-cell value="bob:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Viewer</aria-grid-cell>
          <aria-grid-cell value="bob:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Inactive</aria-grid-cell>
        </aria-grid-row>
      </aria-grid-body>
    </aria-grid>
    <div class="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border/20 bg-muted/30 px-3 py-2 text-xs text-muted-foreground" data-grid-selected-values>
    <span class="font-medium text-foreground">Selected values</span>
    <span class="rounded-md bg-accent px-2 py-1 font-medium text-foreground">bob:status</span>
  </div>
  </div>
</div>

```html
<div class="flex w-full max-w-md flex-col gap-3">
    <aria-grid aria-label="Team members" class="w-full max-w-md rounded-xl border border-border/20 bg-background/90 text-left shadow-lg backdrop-blur-xl" data-example-part="Root" value="bob:status">
      <aria-grid-head data-example-part="Head">
        <aria-grid-row class="border-b border-border-secondary bg-muted/50" data-example-part="Row">
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Name</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Role</aria-grid-header>
          <aria-grid-header class="p-3 text-sm font-medium text-muted-foreground" data-example-part="Header">Status</aria-grid-header>
        </aria-grid-row>
      </aria-grid-head>
      <aria-grid-body data-example-part="Body">
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="john:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">John Doe</aria-grid-cell>
          <aria-grid-cell value="john:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Admin</aria-grid-cell>
          <aria-grid-cell value="john:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30 border-b border-border-secondary" data-example-part="Row">
          <aria-grid-cell value="jane:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Jane Smith</aria-grid-cell>
          <aria-grid-cell value="jane:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Member</aria-grid-cell>
          <aria-grid-cell value="jane:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Active</aria-grid-cell>
        </aria-grid-row>
        <aria-grid-row class="hover:bg-muted/30" data-example-part="Row">
          <aria-grid-cell value="bob:name" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Bob Jones</aria-grid-cell>
          <aria-grid-cell value="bob:role" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Viewer</aria-grid-cell>
          <aria-grid-cell value="bob:status" class="p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]" data-example-part="Cell">Inactive</aria-grid-cell>
        </aria-grid-row>
      </aria-grid-body>
    </aria-grid>
    <div class="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border/20 bg-muted/30 px-3 py-2 text-xs text-muted-foreground" data-grid-selected-values>
    <span class="font-medium text-foreground">Selected values</span>
    <span class="rounded-md bg-accent px-2 py-1 font-medium text-foreground">bob:status</span>
  </div>
  </div>
```

## Anatomy

```html
<aria-grid aria-label="Team members">
  <aria-grid-head>
    <aria-grid-row>
      <aria-grid-header>Name</aria-grid-header>
      <aria-grid-header>Role</aria-grid-header>
    </aria-grid-row>
  </aria-grid-head>
  <aria-grid-body>
    <aria-grid-row>
      <aria-grid-cell value="jane:name">Jane Smith</aria-grid-cell>
      <aria-grid-cell value="jane:role">Member</aria-grid-cell>
    </aria-grid-row>
  </aria-grid-body>
</aria-grid>
```

## API Reference

### Root

- Element: `aria-grid`
- Role: `grid`
- Accepts `aria-label` or `aria-labelledby` for the accessible name.
- `value` is a comma-separated selected cell value list for controlled-style state.
- `default-value` initializes uncontrolled selected cell values.
- Dispatches `valuechange` with `detail.value` as a string array.

### Head

- Element: `aria-grid-head`
- Optional structural header section.

### Header

- Element: `aria-grid-header`
- Role: `columnheader`
- Not focusable by default.

### Body

- Element: `aria-grid-body`
- Optional structural body section.

### Row

- Element: `aria-grid-row`
- Role: `row`

### Cell

- Element: `aria-grid-cell`
- Role: `gridcell`
- `value` sets the selection value and falls back to the resolved `row:col` coordinate.
- Reflects `data-row`, `data-col`, `data-value`, roving `tabindex`, `data-focused`, `aria-selected`, and `data-selected`.

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-grid` | `grid` |
| Body | `aria-grid-body` | none |
| Cell | `aria-grid-cell` | `gridcell` |
| Head | `aria-grid-head` | none |
| Header | `aria-grid-header` | `columnheader` |
| Row | `aria-grid-row` | `row` |

## Keyboard

| Key | Action |
| --- | --- |
| ArrowRight | Move focus to the next cell in the current row without changing selection. |
| ArrowLeft | Move focus to the previous cell in the current row without changing selection. |
| ArrowDown | Move focus to the cell below in the same column without changing selection. |
| ArrowUp | Move focus to the cell above in the same column without changing selection. |
| Home | Move focus to the first cell in the current row without changing selection. |
| End | Move focus to the last cell in the current row without changing selection. |
| Ctrl+Home | Move focus to the first cell in the grid without changing selection. |
| Ctrl+End | Move focus to the last cell in the grid without changing selection. |
| Tab | Move focus out of the grid to the next focusable element. |
| Enter | Toggle selection for the focused cell. |
| Space | Toggle selection for the focused cell. |
| Ctrl+A | Select all cells in the grid. |
| Shift+Space | Toggle the current row in the current selection. |
| Ctrl+Space | Toggle the current column in the current selection. |
| Shift+Arrow | Toggle selection for the cell in the arrow direction. |
| Escape | Clear the current selection. |

## Accessibility

The Grid component implements the [WAI-ARIA Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/):

- `Root` renders as `role="grid"` and requires an accessible name via `aria-label` or `aria-labelledby`.
- `Row` renders as `role="row"`.
- `Cell` renders as `role="gridcell"` with roving `tabindex` for focus management and `aria-selected` for selection state.
- `Header` renders as `role="columnheader"` and is not focusable by default.
- Arrow key navigation moves focus between cells; Home/End navigate within rows; Ctrl+Home/End navigate to grid boundaries.
- Selection supports single-cell click, row (Shift+Space), column (Ctrl+Space), multi-cell (Shift+Arrow), and select-all (Ctrl+A).
- Escape clears the current selection.
