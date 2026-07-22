# Treegrid

A hierarchical grid primitive combining tree disclosure with grid cell navigation. It supports row and cell focus modes, selection, and keyboard-driven expansion.

## Features

- **Tree grid**
- **Row and cell focus modes**
- **Single and multi-selection**
- **Controlled and uncontrolled state**
- **Typeahead navigation**
- **State attributes for styling**
- **Leaf row semantics**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/treegrid
```

```bash [pnpm]
pnpm add @ariaui-web/treegrid
```

```bash [yarn]
yarn add @ariaui-web/treegrid
```

:::

```ts
import { defineTreegridElements } from "@ariaui-web/treegrid";

defineTreegridElements();
```

## Examples

### File Tree

<div class="ariaui-web-preview flex w-full justify-center overflow-x-auto py-6" data-component="treegrid" data-example-variant="file-tree">
  <aria-treegrid aria-label="Project files" class="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm [--treegrid-columns:minmax(14rem,1fr)_minmax(7rem,9rem)_minmax(6rem,7rem)]" data-example-part="Root">
    <aria-treegrid-header data-example-part="Header"><div role="row" class="grid [grid-template-columns:var(--treegrid-columns)]"><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground" data-example-part="ColumnHeader">Name</aria-treegrid-column-header><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground" data-example-part="ColumnHeader">Type</aria-treegrid-column-header><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground" data-example-part="ColumnHeader">Size</aria-treegrid-column-header></div></aria-treegrid-header>
    <aria-treegrid-body data-example-part="Body">
      <aria-treegrid-row value="src" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="RowHeader"><span class="ariaui-treegrid-label"><svg class="ariaui-treegrid-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"></path></svg><span class="ariaui-treegrid-folder" aria-hidden="true"></span><span>src</span></span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">folder</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">--</aria-treegrid-cell></aria-treegrid-row>
      <aria-treegrid-group data-example-part="Group"><aria-treegrid-row value="index" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="RowHeader"><span class="ariaui-treegrid-label indent-1"><span class="ariaui-treegrid-file" aria-hidden="true"></span>index.tsx</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">TypeScript</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">1.2 KB</aria-treegrid-cell></aria-treegrid-row><aria-treegrid-row value="app" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="RowHeader"><span class="ariaui-treegrid-label indent-1"><svg class="ariaui-treegrid-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"></path></svg><span class="ariaui-treegrid-folder" aria-hidden="true"></span>app</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">folder</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">--</aria-treegrid-cell></aria-treegrid-row><aria-treegrid-group data-example-part="Group"><aria-treegrid-row value="layout" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="RowHeader"><span class="ariaui-treegrid-label indent-2"><span class="ariaui-treegrid-file" aria-hidden="true"></span>layout.tsx</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">TypeScript</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">2.4 KB</aria-treegrid-cell></aria-treegrid-row></aria-treegrid-group></aria-treegrid-group>
      <aria-treegrid-row value="package" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="RowHeader"><span class="ariaui-treegrid-label"><span class="ariaui-treegrid-file" aria-hidden="true"></span>package.json</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">JSON</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">2.1 KB</aria-treegrid-cell></aria-treegrid-row>
      <aria-treegrid-row value="readme" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="RowHeader"><span class="ariaui-treegrid-label"><span class="ariaui-treegrid-file" aria-hidden="true"></span>README.md</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">Markdown</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground" data-example-part="Cell">4.5 KB</aria-treegrid-cell></aria-treegrid-row>
    </aria-treegrid-body>
  </aria-treegrid>
</div>

```html
<aria-treegrid aria-label="Project files">
  <aria-treegrid-header><!-- Name, Type, Size headers --></aria-treegrid-header>
  <aria-treegrid-body>
    <aria-treegrid-row value="src"><aria-treegrid-row-header>src</aria-treegrid-row-header></aria-treegrid-row>
    <aria-treegrid-group><!-- Nested source files --></aria-treegrid-group>
  </aria-treegrid-body>
</aria-treegrid>
```

### Multi-select Tasks

<div class="ariaui-web-preview flex w-full justify-center overflow-x-auto py-6" data-component="treegrid" data-example-variant="multi-select-tasks">
  <aria-treegrid aria-label="Project tasks" multi-select class="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm [--treegrid-columns:minmax(14rem,1fr)_minmax(7rem,9rem)_minmax(9rem,1fr)]" data-example-part="Root">
    <aria-treegrid-header data-example-part="Header"><div role="row" class="grid [grid-template-columns:var(--treegrid-columns)]"><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Task</aria-treegrid-column-header><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority</aria-treegrid-column-header><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</aria-treegrid-column-header></div></aria-treegrid-header>
    <aria-treegrid-body data-example-part="Body">
      <aria-treegrid-row value="phoenix" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label"><svg class="ariaui-treegrid-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"></path></svg><strong>Project Phoenix</strong></span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-badge priority-high">High</span></aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-status">In Progress</span></aria-treegrid-cell></aria-treegrid-row>
      <aria-treegrid-group><aria-treegrid-row value="schema" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-1">Database Schema</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-badge">Medium</span></aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">Done</aria-treegrid-cell></aria-treegrid-row><aria-treegrid-row value="api" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-1">API Documentation</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-badge outline">Low</span></aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">To Do</aria-treegrid-cell></aria-treegrid-row></aria-treegrid-group>
      <aria-treegrid-row value="audit" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent data-[selected=true]:hover:bg-accent-hover" data-example-part="Row"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label"><svg class="ariaui-treegrid-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"></path></svg><strong>Security Audit</strong></span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-badge outline">Routine</span></aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><em>Paused</em></aria-treegrid-cell></aria-treegrid-row>
      <aria-treegrid-group><aria-treegrid-row value="access" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-1">Access Review</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-badge">Medium</span></aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">Scheduled</aria-treegrid-cell></aria-treegrid-row></aria-treegrid-group>
    </aria-treegrid-body>
  </aria-treegrid>
</div>

```html
<aria-treegrid aria-label="Project tasks" multi-select>
  <aria-treegrid-header><!-- Task, Priority, Status headers --></aria-treegrid-header>
  <aria-treegrid-body><!-- Expandable task rows and groups --></aria-treegrid-body>
</aria-treegrid>
```

### Framer Motion

<div class="ariaui-web-preview flex w-full justify-center overflow-x-auto py-6" data-component="treegrid" data-example-variant="framer-motion">
  <aria-treegrid aria-label="Animated project files" default-expanded="src,components" class="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm [--treegrid-columns:minmax(14rem,1fr)_minmax(7rem,9rem)_minmax(6rem,7rem)]" data-example-part="Root">
    <aria-treegrid-header data-example-part="Header"><div role="row" class="grid [grid-template-columns:var(--treegrid-columns)]"><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</aria-treegrid-column-header><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Type</aria-treegrid-column-header><aria-treegrid-column-header class="flex h-10 items-center border-b border-border-secondary bg-muted px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Size</aria-treegrid-column-header></div></aria-treegrid-header>
    <aria-treegrid-body data-example-part="Body">
      <aria-treegrid-row value="src" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label"><svg class="ariaui-treegrid-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"></path></svg><span class="ariaui-treegrid-folder" aria-hidden="true"></span>src</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">folder</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">3 items</aria-treegrid-cell></aria-treegrid-row>
      <aria-treegrid-group native-composition data-example-part="Group"><div class="overflow-hidden" data-treegrid-motion-group><aria-treegrid-row value="components" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover data-[selected=true]:bg-accent"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-1"><svg class="ariaui-treegrid-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"></path></svg><span class="ariaui-treegrid-folder" aria-hidden="true"></span>components</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">folder</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">2 items</aria-treegrid-cell></aria-treegrid-row><aria-treegrid-group native-composition><div class="overflow-hidden" data-treegrid-motion-group><aria-treegrid-row value="button" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-2"><span class="ariaui-treegrid-file" aria-hidden="true"></span>Button.tsx</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">TypeScript</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">4.8 KB</aria-treegrid-cell></aria-treegrid-row><aria-treegrid-row value="card" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-2"><span class="ariaui-treegrid-file" aria-hidden="true"></span>Card.tsx</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">TypeScript</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">3.1 KB</aria-treegrid-cell></aria-treegrid-row></div></aria-treegrid-group><aria-treegrid-row value="utils" class="group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover"><aria-treegrid-row-header class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground"><span class="ariaui-treegrid-label indent-1"><span class="ariaui-treegrid-file" aria-hidden="true"></span>utils.ts</span></aria-treegrid-row-header><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">TypeScript</aria-treegrid-cell><aria-treegrid-cell class="flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground">1.6 KB</aria-treegrid-cell></aria-treegrid-row></div></aria-treegrid-group>
    </aria-treegrid-body>
  </aria-treegrid>
</div>

```html
<aria-treegrid default-expanded="src,components">
  <aria-treegrid-row value="src">...</aria-treegrid-row>
  <aria-treegrid-group native-composition>
    <div data-treegrid-motion-group class="overflow-hidden">...</div>
  </aria-treegrid-group>
</aria-treegrid>
```

## Anatomy

```html
<aria-treegrid>
  <aria-treegrid-header><div role="row"><aria-treegrid-column-header /></div></aria-treegrid-header>
  <aria-treegrid-body>
    <aria-treegrid-row><aria-treegrid-row-header /><aria-treegrid-cell /></aria-treegrid-row>
    <aria-treegrid-group />
  </aria-treegrid-body>
</aria-treegrid>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `expanded` | unset | Comma-separated controlled expanded row IDs. |
| `default-expanded` / `defaultExpanded` | empty | Initial uncontrolled expanded row IDs. |
| `value` | unset | Controlled selected row ID or comma-separated IDs. |
| `default-value` / `defaultValue` | empty | Initial uncontrolled selection. |
| `multi-select` / `multiSelect` | `false` | Enables multi-row and cell-range selection. |
| `disabled` | `false` | Suppresses keyboard and pointer interaction. |
| `onExpandedChange` | `null` | Receives requested expanded row IDs. |
| `onValueChange` | `null` | Receives requested selected row IDs. |

### Row And Cells

Rows expose `aria-level`, `aria-expanded`, `aria-selected`, `data-row-id`, `data-parent-row-id`, and focus state. Row headers and cells expose resolved row and column metadata with roving `tabindex`.

### Group

`native-composition` forwards rowgroup semantics to the first child and keeps collapsed descendants mounted with `aria-hidden` and `data-treegrid-collapsed-*` markers for animation libraries.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| <kbd>ArrowRight</kbd> | Expands a collapsed row or enters and advances cell mode. |
| <kbd>ArrowLeft</kbd> | Collapses a row, moves to its parent, or returns to row mode. |
| <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> | Moves through visible rows while preserving the column. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Moves to the first or last row or cell. |
| <kbd>Ctrl+Home</kbd> / <kbd>Ctrl+End</kbd> | Moves to the first or last visible row. |
| <kbd>PageUp</kbd> / <kbd>PageDown</kbd> | Moves five visible rows. |
| <kbd>Space</kbd> | Selects the focused row or cell. |
| <kbd>Ctrl+Space</kbd> | Selects a row or column. |
| <kbd>Ctrl+A</kbd> | Selects all rows and cells in multi-select mode. |
| Printable characters | Moves to the next visible row whose label matches. |

## Accessibility

Treegrid follows the [WAI-ARIA APG Treegrid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/). Rows expose their nesting level, expandable rows alone expose `aria-expanded`, and only the active row or cell participates in the roving tab stop.

Provide `aria-label` or `aria-labelledby` on the root. Keep column headers descriptive, and use `disabled` for read-only or loading states rather than visually hiding the control.
