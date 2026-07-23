# Treeview Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/treeview`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-treeview` | `tree` |
| CheckboxItem | `aria-treeview-checkbox-item` | `treeitem` |
| Group | `aria-treeview-group` | `group` |
| Item | `aria-treeview-item` | `treeitem` |
| Toggle | `aria-treeview-toggle` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/treeview/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 20 of 20 documented sections are represented after native normalization.
- Requirement lines: 94

### Scope

- This document defines the current contract for `@ariaui-web/treeview`.

### Primary References

- APG treeview pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

### Mental Model

- `@ariaui-web/treeview` is a hierarchical collection primitive for expandable item groups. Each item is a node in a tree; items with children can be expanded or collapsed. Focus is managed via a roving tabindex across visible items.

### Part Model

- Table row: Part | Element | Role
- Table row: `Root` | `<div>` | `tree`
- Table row: `Item` | `<div>` | `treeitem`
- Table row: `CheckboxItem` | `<div>` | `treeitem`
- Table row: `Toggle` | `<span>` | none
- Table row: `Group` | `<div>` by default, slotted child with `native composition` | `group`

### State Contract

- `Root` owns all shared state and distributes it through `TreeviewContext`.

### Expansion state

- `expanded: string[]` / `defaultExpanded: string[]` - controlled/uncontrolled list of expanded item IDs
- `onExpandedChange: (expanded: string[]) => void` - called when any item is expanded or collapsed
- Items without children are leaf nodes and never receive `aria-expanded`
- Items with children receive `aria-expanded="true"` when expanded, `aria-expanded="false"` when collapsed

### Selection state

- `value: string | string[]` / `defaultValue` - controlled/uncontrolled selected item ID(s)
- `onValueChange` - called on selection change
- `multiSelect: boolean` - enables multi-item selection; reflected as `aria-multiselectable="true"` on the root; omitted when false
- In a parent `Item`, `Toggle` toggles expansion on pointer click. Clicking the rest of the row toggles selection without expanding or collapsing.
- `CheckboxItem` derives its checked state from the same selection state. Parent `CheckboxItem` nodes compute their state from descendant `CheckboxItem` values: all descendants checked means checked, some descendants checked means mixed, and no descendants checked means unchecked.
- After any `CheckboxItem` toggle, checked branch values are recomputed up the ancestor chain: fully checked branches include the parent value, and partial or unchecked branches remove it.
- In a parent `CheckboxItem`, `Toggle` toggles expansion on pointer click. Clicking the rest of the row toggles checked state without expanding or collapsing.

### Focus state (internal)

- A single item holds `tabIndex={0}` at any time (roving tabindex); all others are `tabIndex={-1}`
- `focusedId` tracks which item has roving focus; initialized to the first visible item on first interaction
- Moving focus updates `tabIndex` only. It does not update `data-selected`, `data-state`, or `data-active`; only explicit selection interactions update selection state

### ARIA Attribute Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Table row: Attribute | Value
- Table row: `role` | `tree`
- Table row: `aria-multiselectable` | `"true"` when `multiSelect`; omitted otherwise

### Item

- Table row: Attribute | Value
- Table row: `role` | `treeitem`
- Table row: `aria-selected` | `"true"` / `"false"`
- Table row: `aria-expanded` | `"true"` / `"false"` when item has children; omitted on leaf nodes
- Table row: `aria-disabled` | `"true"` when disabled; omitted otherwise
- Table row: `aria-level` | integer depth (1 at root, incremented per nested `Group`)
- Table row: `tabIndex` | `0` when focused; `-1` otherwise

### CheckboxItem

- Table row: Attribute | Value
- Table row: `role` | `treeitem`
- Table row: `aria-checked` | `"true"` when checked or when all descendant `CheckboxItem` nodes are checked, `"mixed"` when some descendants are checked, `"false"` otherwise
- Table row: `aria-selected` | `"true"` / `"false"`
- Table row: `aria-expanded` | `"true"` / `"false"` when item has children; omitted on leaf nodes
- Table row: `aria-disabled` | `"true"` when disabled; omitted otherwise
- Table row: `aria-level` | integer depth (1 at root, incremented per nested `Group`)
- Table row: `tabIndex` | `0` when focused; `-1` otherwise
- Table row: `data-state` | `"checked"` / `"unchecked"` / `"indeterminate"`

### Toggle

- Table row: Attribute | Value
- Table row: `data-state` | `"open"` / `"closed"` when the owning item has children
- Table row: `data-expanded` | `"true"` / `"false"` when the owning item has children
- Table row: `data-disabled` | present when the owning item is disabled

### Group

- Table row: Attribute | Value
- Table row: `role` | `group`
- Table row: `data-expanded` | `"true"` / `"false"` when the group is animation-mounted with `native composition` or legacy `forceMount` under an owning item
- Table row: `data-treeview-collapsed-branch` | present when an animation-mounted group is collapsed
- Table row: `aria-hidden` | `"true"` when an animation-mounted group is collapsed
- Table row: Prop | Type | Default | Description
- Table row: `native composition` | `boolean` | `false` | Slots group attributes/properties onto a single child element and keeps the group outside the default hidden wrapper so animation libraries can measure and animate collapsed content. This is the preferred animation interop path.
- Table row: `forceMount` | `boolean` | `false` | Keeps the default `<div role="group">` mounted outside the hidden wrapper for compatibility with earlier animation usage. Prefer `native composition` for new animated groups.

### Keyboard Interaction Contract

- All keyboard handling is on the `Root` element.
- Table row: Key | Behavior
- Table row: `ArrowDown` | Moves focus to the next visible item
- Table row: `ArrowUp` | Moves focus to the previous visible item
- Table row: `ArrowRight` | On collapsed item with children: expands it. On expanded item or leaf: no-op
- Table row: `ArrowLeft` | On expanded item: collapses it. On collapsed/leaf item: moves focus to parent item. At root level: no-op
- Table row: `Home` | Moves focus to the first visible item in the tree
- Table row: `End` | Moves focus to the last visible item in the tree
- Table row: `Enter` | In single-select mode, expands/collapses parent items without selecting them and toggles leaf selection. In multi-select mode, adds the focused item to the selection
- Table row: `Space` | In single-select mode, expands/collapses parent items without selecting them and toggles leaf selection. In multi-select mode, toggles the focused item; `Shift+Space` extends the range
- Table row: `Enter` / `Space` on `CheckboxItem` | Toggles checked state without expanding or collapsing. On parent checkbox items, toggles all descendant checkbox items with it
- Table row: Pointer click on `Toggle` inside `Item` or `CheckboxItem` | Toggles expansion without changing selection or checked state
- Table row: `Ctrl+A` | Selects all visible items (multi-select only)
- Table row: Printable char | Typeahead: moves focus to the next item whose label starts with the typed character; buffer clears after 500 ms

### Visibility Invariant

- Items inside a collapsed `Group` are not visible and must be skipped by keyboard navigation
- Default groups are rendered inside the owning item hidden branch wrapper while collapsed
- Animation-mounted groups created with `native composition` or legacy `forceMount` stay mounted and use `data-treeview-collapsed-branch` so keyboard navigation still skips collapsed descendants while CSS or animation libraries control visual collapse

### Disabled Behavior

- When `disabled` is set on `Root`, all keyboard and pointer interaction is suppressed
- When `disabled` is set on an individual `Item`, that item cannot be focused, selected, or expanded via interaction

### Controlled / Uncontrolled

- `expanded` + `onExpandedChange` - controlled expansion
- `defaultExpanded` - uncontrolled expansion initial state
- `value` + `onValueChange` - controlled selection
- `defaultValue` - uncontrolled selection initial state
- Mixing controlled and uncontrolled attributes/properties for the same state slice is not supported

### Known Issues / Limitations

- `aria-setsize` and `aria-posinset` are not currently computed; AT users will not know item count within a group
- Typeahead traverses currently visible items only and does not discover collapsed descendants

### Coverage Expectations

- Tests for this package should cover:
- **Structure**: `Root`, `Item`, `Group` render with correct roles and ARIA attributes; `aria-level` is correct at each nesting depth
- **Expansion**: expand and collapse via `Toggle`, `ArrowRight`/`ArrowLeft`, and single-select parent activation; `aria-expanded` absent on leaf items
- **Keyboard navigation**: ArrowDown/Up traverse visible items; ArrowRight expands collapsed parents without moving focus; ArrowLeft collapses then moves to parent; Home/End jump to boundaries
- **Selection - single**: Space/Enter toggles leaf item selection; parent activation toggles expansion without selection; navigation does not select
- **Selection - multi**: `multiSelect` enables multiple selected items; `Ctrl+A` selects all
- **Checkbox item**: `CheckboxItem` exposes `aria-checked`, `data-state`, and toggles checked state through root selection
- **Typeahead**: printable key moves focus to matching item; buffer clears after 500 ms
- **Visibility invariant**: collapsed group hides descendants from navigation
- **Animation-mounted groups**: `native composition` slots group attributes onto the animation element, keeps collapsed descendants mounted, and still removes them from keyboard navigation; legacy `forceMount` keeps the same collapsed branch attributes
- **Disabled**: all interaction is suppressed when `disabled` is set on Root or Item
- **Controlled/uncontrolled**: `expanded`/`onExpandedChange` and `value`/`onValueChange` behave correctly






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
