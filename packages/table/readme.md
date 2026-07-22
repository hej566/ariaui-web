# Table Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/table`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

Autonomous custom elements cannot render as native `table`, `thead`, `tbody`, `tr`, `th`, or `td` tags. The browser-native adaptation therefore keeps each part as a separated custom element and applies the equivalent table semantic role. `aria-table` also serves as the required horizontal overflow container. The package remains structural and does not add selection, sorting, pointer, or keyboard state.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-table` | `table` |
| Body | `aria-table-body` | `rowgroup` |
| Caption | `aria-table-caption` | `caption` |
| Cell | `aria-table-cell` | `cell` |
| ColumnHeader | `aria-table-column-header` | `columnheader` |
| Footer | `aria-table-footer` | `rowgroup` |
| Header | `aria-table-header` | `rowgroup` |
| Row | `aria-table-row` | `row` |
| RowHeader | `aria-table-row-header` | `rowheader` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/table/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 12 of 12 documented sections are represented after native normalization.
- Requirement lines: 61

### Scope

- Normative behavior and API contract for `@ariaui-web/table`.
- This package follows the native HTML table model as the semantic baseline and provides minimally styled structural parts for composition.
- Source references:
- HTML table model: https://html.spec.whatwg.org/multipage/tables.html
- WAI-ARIA `table` role reference (informative): https://www.w3.org/WAI/ARIA/apg/patterns/table/
- This package currently exposes:
- `Root`
- `Header`
- `Body`
- `Row`
- `Cell`
- `ColumnHeader`
- `RowHeader`
- `Caption`

### Structure and Roles

- `Root` renders a scroll wrapper (`div`) and an inner native `<table>` element.
- `Header` renders native `<thead>`.
- `Body` renders native `<tbody>`.
- `Row` renders native `<tr>`.
- `Cell` renders native `<td>`.
- `ColumnHeader` renders native `<th>` for column header semantics.
- `RowHeader` renders native `<th>` with default `scope="row"`.
- `Caption` renders native `<caption>`.
- Native table semantics come from the rendered HTML elements; this package does not replace the native model with composite ARIA roles.

### State Contract

- This package is structural and presentation-oriented.
- It does not own sorting, filtering, pagination, selection, expansion, or row action state.
- It does not provide internal open/closed or active-item state.

### Behavior Contract

- All parts forward refs to their native HTML element.
- All parts accept and spread native element attributes/properties.
- All parts pass consumer `className` through to their native HTML element unchanged.
- `Root` always wraps the table in an overflow container for horizontal scrolling.
- `RowHeader` defaults `scope` to `"row"` unless overridden by the consumer.
- Higher-level behavior (sorting toggles, selection controls, row click actions, etc.) is consumer-owned.

### Styling Contract

- The package is intentionally minimally styled.
- `Root` applies inline overflow-wrapper layout styles to its internal wrapper `div`.
- Public table parts otherwise leave visual styling to consumers.
- Consumer `style` and `className` are passed through to the rendered HTML element unchanged.

### Keyboard Contract

- No custom keyboard interaction is implemented by this package.
- Keyboard behavior is native browser behavior for semantic table elements.
- Any enhanced keyboard UX beyond native behavior is consumer-owned.

### Pointer Contract

- No custom pointer event logic is implemented by this package.
- Click handling and row-level interactions are consumer-owned.

### State and Data Expectations

- Native element semantics must remain intact when composing parts (`table`, `thead`, `tbody`, `tr`, `th`, `td`, `caption`).
- This package does not set `aria-sort`, `aria-selected`, `aria-rowcount`, `aria-colcount`, or similar stateful ARIA attributes.
- Consumers implementing interactive table patterns are responsible for adding and synchronizing required ARIA/data attributes.

### Consumer Handler Contract

- Consumer event handlers are authoritative for interaction behavior.
- Because this package does not implement internal interaction state, there are no internal state handlers to override.

### HTML and ARIA Mapping Notes

- HTML table semantics are the normative baseline for this package.
- ARIA table/grid patterns are only relevant when consumers layer additional interactive behaviors.
- If consumers implement rich interactions resembling a grid, consumers must provide the required ARIA semantics and keyboard handling.

### Coverage Expectations

- Tests in `packages/table/__test__` should cover at least:
- Exported-part composition for all public parts (`Root`, `Header`, `Body`, `Row`, `Cell`, `ColumnHeader`, `RowHeader`, `Caption`).
- Native semantic roles from composed structure (`table`, `columnheader`, `rowheader`, `cell`, and caption text).
- `RowHeader` default `scope="row"` and explicit override behavior.
- Ref forwarding for each exported part.
- Consumer attributes/properties spreading onto each part (for example `id`, `data-*`, event handlers).
- `Root` wrapper presence and table rendering inside the overflow container.
- Consumer `className` and `style` pass-through behavior for rendered table parts.

### Change Control

- Behavior or API changes must update, in order:
- This spec
- Table unit tests
- Docs/examples when table behavior or composition guidance is documented






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
