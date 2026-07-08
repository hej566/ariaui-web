# Treegrid Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/treegrid`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-treegrid` | `treegrid` |
| Body | `aria-treegrid-body` | none |
| Cell | `aria-treegrid-cell` | none |
| ColumnHeader | `aria-treegrid-column-header` | `columnheader` |
| Group | `aria-treegrid-group` | `group` |
| Header | `aria-treegrid-header` | `heading` |
| Row | `aria-treegrid-row` | `row` |
| RowHeader | `aria-treegrid-row-header` | `rowheader` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/treegrid/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 24 of 24 documented sections are represented after native normalization.
- Requirement lines: 97

### Scope

- This document defines the current contract for `@ariaui-web/treegrid`.

### Primary References

- APG treegrid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/

### Mental Model

- `@ariaui-web/treegrid` combines hierarchical disclosure and grid-like cell composition into one structured primitive. Rows can own child groups of rows, forming a tree. Each row also participates in a column grid, so individual cells are addressable. Focus can be on a row or on a specific cell within a row - these are two distinct focus modes with different keyboard behavior.

### Part Model

- Table row: Part | Element | Role
- Table row: `Root` | `<div>` | `treegrid`
- Table row: `Header` | `<div>` | `rowgroup`
- Table row: `ColumnHeader` | `<div>` | `columnheader`
- Table row: `Body` | `<div>` | `rowgroup`
- Table row: `Row` | `<div>` | `row`
- Table row: `RowHeader` | `<div>` | `rowheader`
- Table row: `Cell` | `<div>` | `gridcell`
- Table row: `Group` | `<div>` by default, slotted child with `native composition` | `rowgroup`
- `Group` renders a rowgroup container by default. It wires child rows to their parent row by injecting internal attributes/properties (`_parentRowId`, `_depth`, `_isHidden`) via DOM child traversal traversal in `Body` and `Group`.
- Use `native composition` on `Group` when an animation layer needs collapsed rows to remain measurable. Slotted collapsed groups stay in the DOM without `hidden`; they receive `aria-hidden="true"`, `data-expanded="false"`, and `data-treegrid-collapsed-branch`. Their descendant rows also receive `aria-hidden="true"` and `data-treegrid-collapsed-row` so the visual layer can collapse them while accessibility and keyboard navigation still treat them as hidden.
- Table row: Group Prop | Type | Default | Description
- Table row: `native composition` | `boolean` | `false` | Slots rowgroup attributes/properties onto a single child element and keeps collapsed rows mounted for animation libraries. This is the preferred animation interop path.

### State Contract

- `Root` owns all shared state and distributes it through `TreegridContext`.

### Expansion state

- `expanded: string[]` / `defaultExpanded: string[]` - controlled/uncontrolled list of expanded row IDs
- `onExpandedChange: (expanded: string[]) => void` - called when any row is expanded or collapsed
- Rows without a following `Group` sibling are not expandable and never receive `aria-expanded`
- `Group native composition` keeps collapsed child rows mounted for animation layers

### Selection state

- `value: string | string[]` / `defaultValue` - controlled/uncontrolled selected row ID(s)
- `onValueChange` - called on selection change
- `multiSelect: boolean` - enables multi-row and cell-range selection

### Focus state (internal)

- Two focus modes exist and are tracked internally:
- **Row mode**: a row `<div>` holds focus; `focusedRow` is set, `focusMode === "row"`
- **Cell mode**: a rowheader or gridcell `<div>` holds focus; `focusedCell: { rowId, col }` is set, `focusMode === "cell"`
- Only one element is ever `tabIndex={0}` inside the grid at a time (roving tabindex). The focused element holds `tabIndex={0}`; all others hold `tabIndex={-1}`.

### Disabled state

- `disabled: boolean` on `Root` - suppresses all keyboard and mouse interaction
- `disabled: boolean` on individual `Row` - marks that row as non-interactive

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### ARIA attributes per part

- **`Root` (`<div role="treegrid">`)**
- `aria-multiselectable={true}` when `multiSelect` is enabled
- **`Row` (`<div role="row">`)**
- `aria-level={depth}` - 1-based nesting depth (1 for top-level rows)
- `aria-expanded={true|false}` - present only when the row has a child `Group`; absent on leaf rows
- `aria-selected={true|false}` - reflects selection state
- `aria-disabled={true}` - when the row or root is disabled
- **`RowHeader` (`<div role="rowheader">`)**
- `aria-selected` - reflects cell-level selection state
- `aria-expanded` must NOT be set here; `aria-expanded` belongs on the `row` element only
- **`Cell` (`<div role="gridcell">`)**
- **`ColumnHeader` (`<div role="columnheader">`)**
- `aria-sort="ascending"|"descending"` - when `sortable` and `sortDirection` are provided

### Data attributes (for styling hooks)

- Table row: Attribute | Set on | Values
- Table row: `data-row-id` | Row, RowHeader, Cell | row identifier string
- Table row: `data-expanded` | Row, RowHeader | `"open"` \ | `"closed"`
- Table row: `data-expanded` | Group | `"true"` \ | `"false"` when the group is owned by a parent row
- Table row: `data-selected` | Row, RowHeader, Cell | `"true"` (absent when false)
- Table row: `data-focused` | Row, RowHeader, Cell | `"true"` (absent when false)
- Table row: `data-treegrid-collapsed-row` | Row | present when an animation-mounted ancestor group is collapsed
- Table row: `data-treegrid-collapsed-branch` | Group | present when an animation-mounted group is collapsed

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Expand/collapse

- Clicking a `RowHeader` that `_hasChildren` toggles expansion via `onExpand`
- `Enter` on a focused row or cell whose row has children toggles expansion
- When a group is collapsed, the group is hidden unless `native composition` is enabled
- When a group is collapsed with `native composition`, descendant rows stay measurable and receive hidden-state attributes instead of `display: none`

### Keyboard interactions

- All interactions are no-ops when `disabled` is true.

### Arrow keys

- Table row: Key | Row focus mode | Cell focus mode
- Table row: `ArrowRight` | If collapsed and has children -> expand. Otherwise -> move focus to first cell (enter cell mode) | Move focus to next cell in row. At last cell -> no-op
- Table row: `ArrowLeft` | If expanded and has children -> collapse. If collapsed or no children -> no-op and keep focus on the current row | At col > 0 -> move to previous cell. At col 0 -> move focus to the row (enter row mode)
- Table row: `ArrowDown` | Move focus to next visible row | Move focus to same column in next visible row
- Table row: `ArrowUp` | Move focus to previous visible row | Move focus to same column in previous visible row

### Home / End

- Table row: Key | Row focus mode | Cell focus mode
- Table row: `Home` | Move focus to first row | Move focus to first cell in current row
- Table row: `End` | Move focus to last row | Move focus to last cell in current row
- Table row: `Ctrl+Home` | Move focus to first row | Move focus to the same column in the first row, falling back to column 0 when the row has fewer cells
- Table row: `Ctrl+End` | Move focus to last row | Move focus to the same column in the last row, clamping to the last available cell

### Page keys

- `PageDown` / `PageUp` move focus by a fixed page size (currently 5 rows) in the appropriate direction, staying in the same focus mode and preserving column when in cell mode.

### Selection keys

- Table row: Key | Behavior
- Table row: `Space` | Toggle selection of focused row or cell
- Table row: `Shift+Space` | Extend selection range to focused row or cell
- Table row: `Ctrl+Space` (row mode) | Select entire row
- Table row: `Ctrl+Space` (cell mode) | Select entire column
- Table row: `Ctrl+A` | Select all rows and cells
- Table row: `Shift+ArrowDown/Up` | Extend row or cell selection to next/previous
- Table row: `Shift+ArrowLeft/Right` | Extend cell selection left or right

### Typeahead

- Printable character keys (no modifier) search visible rows by the text content of the first cell. Matching wraps around. A 500 ms idle threshold resets the accumulated search buffer on the next printable key.

### Visibility invariant

- A row is visible if and only if all of its ancestors are expanded. `getVisibleRows` must compute visibility transitively - a row whose parent is visible but whose grandparent is collapsed must still be excluded.

### Tab key

- After interaction, the focused row or cell holds the active roving tab stop with `tabIndex={0}` and inactive rows and cells use `tabIndex={-1}`. The root itself renders with `tabIndex={-1}` and moves focus to the first row cell when focused programmatically.

### Current Limitations

- The following behaviors are not implemented in the current package:
- **Ancestor navigation from collapsed or leaf rows** - `ArrowLeft` in row focus mode collapses expanded parent rows, but does not move focus to the parent when the row is already collapsed or has no children.
- **Focus restoration on collapse** - collapsing a row does not actively move focus away from a focused descendant.
- **Registered row and column counts** - `rowCount` and `colCount` in context are placeholders and are not computed from the rendered grid.

### Coverage Expectations

- Tests must cover:
- **Composition**: Root, Header, Body, Row, RowHeader, Cell, ColumnHeader render with correct roles and ARIA attributes
- **Hierarchy**: `Group` children receive correct `aria-level`, `data-expanded`, and visibility state at each nesting depth
- **Expansion**: expand and collapse via click, `Enter`, and `ArrowRight`/`ArrowLeft`; `aria-expanded` absent on leaf rows
- **Keyboard navigation - row mode**: ArrowDown/Up, ArrowRight (expand then enter cell mode), ArrowLeft (collapse expanded row only), Home, End, Ctrl+Home, Ctrl+End, PageDown, PageUp
- **Keyboard navigation - cell mode**: ArrowRight/Left within row, ArrowDown/Up across rows, ArrowLeft at col 0 returns to row mode, Home/End in row, Ctrl+Home/End preserving the current column with fallback/clamping
- **Selection - single**: Space selects row; second Space deselects; ArrowDown/Up moves without selecting
- **Selection - multi**: Shift+Space extends range; Ctrl+Space selects row or column; Ctrl+A selects all
- **Typeahead**: printable key moves focus to matching row; buffer clears after 500 ms
- **Visibility invariant**: collapsed group hides all descendants transitively; keyboard navigation skips hidden rows
- **Animation-mounted groups**: `native composition` slots rowgroup attributes onto the animation element, keeps collapsed descendants mounted, and still removes them from keyboard navigation
- **Disabled**: all interaction is suppressed when `disabled` is set on Root or Row
- **Controlled/uncontrolled**: `expanded`/`onExpandedChange` and `value`/`onValueChange` behave correctly; uncontrolled `defaultExpanded`/`defaultValue` initialize state without re-control






## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
