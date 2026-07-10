# Grid Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/grid`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-grid` | `grid` |
| Body | `aria-grid-body` | none |
| Cell | `aria-grid-cell` | `gridcell` |
| Head | `aria-grid-head` | none |
| Header | `aria-grid-header` | `columnheader` |
| Row | `aria-grid-row` | `row` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/grid/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 18 of 18 documented sections are represented after native normalization.
- Requirement lines: 128

### Scope

- This document defines the current contract for `@ariaui-web/grid`.

### Primary References

- APG grid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- HTML table semantics: https://html.spec.whatwg.org/multipage/tables.html

### Mental Model

- `@ariaui-web/grid` is a structural primitive for building grid-like composites with shared semantics and part composition.

### Part Model

- The package exports:
- `Root` - Container with `role="grid"`
- `Head` - Header section container (optional, similar to `<thead>`)
- `Header` - Header cell with `role="columnheader"`
- `Body` - Body section container (optional, similar to `<tbody>`)
- `Row` - Row container with `role="row"`
- `Cell` - Data cell with `role="gridcell"`

### Props/API Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- `aria-label?: string` - Accessible name for the grid (required if no aria-labelledby)
- `aria-labelledby?: string` - ID of element that labels the grid
- `value?: string[]` - Controlled selected cell values
- `defaultValue?: string[]` - Initial selected cell values for uncontrolled grids
- `onValueChange?: (value: string[]) => void` - Called when click or keyboard selection changes the selected values
- Standard HTML attributes
- Ref forwarding to underlying element

### Row

- `native composition?: boolean` - slot row attributes/properties onto a single child element for custom hosts such as Framer Motion row components
- Standard HTML attributes
- Ref forwarding to underlying element

### Cell

- `native composition?: boolean` - slot cell attributes/properties, focus state, selection state, and handlers onto a single child element for custom hosts such as Framer Motion cell components
- `value?: string` - Selection value for the cell, falling back to its resolved `row:col` coordinate
- `onClick?: (event) => void` - Cell click handler
- Standard HTML attributes
- Ref forwarding to underlying element
- Automatically manages `tabindex`, `aria-selected`, `data-selected`

### Header

- Standard HTML attributes
- Ref forwarding to underlying element
- Does not receive focus or selection state

### Head / Body

- Standard HTML attributes
- Ref forwarding to underlying element

### Part Composition Rules

- Valid composition patterns:
- `Root` must be the top-level container
- `Row` must be a direct child of `Root`, `Head`, or `Body`
- `Cell` and `Header` must be direct children of `Row`
- `Head` and `Body` are optional structural containers within `Root`
- At most one `Head` and one `Body` should be used per `Root`
- Invalid composition (e.g., `Cell` outside `Row`) should throw an error in development
- Example structure:
- Code line: <aria-grid>
- Code line: <aria-grid-head>
- Code line: <aria-grid-row>
- Code line: <aria-grid-header>Column 1</aria-grid-header>
- Code line: <aria-grid-header>Column 2</aria-grid-header>
- Code line: </aria-grid-row>
- Code line: </aria-grid-head>
- Code line: <aria-grid-body>
- Code line: <aria-grid-cell>Data 1</aria-grid-cell>
- Code line: <aria-grid-cell>Data 2</aria-grid-cell>
- Code line: </aria-grid-body>
- Code line: </aria-grid>

### State Contract

- This package provides:
- Focus management with roving tabindex
- Controlled or uncontrolled cell selection state through `value`, `defaultValue`, and `onValueChange`
- Keyboard navigation state
- Higher-level packages (e.g., calendar, data table) are responsible for:
- Application-specific data and business logic
- Cell editing and validation
- Sorting, filtering, and data operations
- Custom cell rendering and interactions

### Accessibility Model

- This package provides baseline ARIA grid semantics and interactive behaviors:
- `Root`: `role="grid"`, requires accessible name via `aria-label` or `aria-labelledby`
- `Row`: `role="row"`
- `Cell`: `role="gridcell"`, `tabindex` (roving), `aria-selected` (when selected), focusable
- `Header`: `role="columnheader"`, not focusable by default (unless contains interactive controls)
- Keyboard navigation follows APG grid pattern:
- Arrow keys move focus between cells without changing selection (Cell only, not Header)
- Home/End move to first/last cell in row without changing selection
- Ctrl+Home/End move to first/last cell in grid without changing selection
- Tab moves focus into/out of grid
- Selection behaviors:
- Click selects a cell and emits that cell's value
- Enter or Space toggles selection for the focused cell
- Ctrl+A selects all cells
- Shift+Space toggles the current row in the current selection
- Ctrl+Space toggles the current column in the current selection
- Shift+Arrow toggles selection for the cell in the arrow direction
- Escape clears selection
- Higher-level packages may add:
- `aria-rowindex` and `aria-colindex` for large grids
- `aria-readonly` or `aria-disabled` for cell states
- Custom cell content and interactions
- Interactive controls within Header (e.g., sort buttons with their own focus management)

### Behavior Contract

- Grid parts compose a consistent grid/table-like structure with proper ARIA semantics
- Parts render appropriate ARIA roles automatically
- `Row` and `Cell` render `<tr>` and `<td>` by default, or slot attributes/properties onto a child with `native composition`
- Invalid composition throws errors in development mode
- Parts forward refs to their underlying DOM elements
- Parts accept standard HTML attributes and merge them with grid semantics
- Keyboard navigation follows APG grid pattern (Arrow keys, Home, End, Ctrl+Home, Ctrl+End)
- Focus management uses roving tabindex (focused cell has tabindex="0", others have tabindex="-1")
- Selection supports single-cell, row, column, and multi-cell selection
- Selection can be uncontrolled with `defaultValue` or controlled with `value` and `onValueChange`
- Selection values use `Cell value` and fall back to each cell's resolved `row:col` coordinate
- Selection state is reflected via `aria-selected` and `data-selected` attributes

### Error Handling

- `Cell` or `Header` used outside `Row` throws error in development
- `Row` used outside `Root`, `Head`, or `Body` throws error in development
- Multiple `Head` or `Body` within same `Root` logs warning in development
- `Root` without accessible name logs warning in development

### Edge Cases

- Empty grid (no rows): Root renders with role="grid" but no focusable cells
- Single cell grid: Cell receives initial focus, arrow keys have no effect
- Grid with only headers: Headers are not focusable, Tab moves through grid without stopping
- Disabled cells: Not yet supported in base package (consumers must implement)

### Data and ARIA Reflection

- `Root` renders with `role="grid"`
- `Row` renders with `role="row"`
- `Cell` renders with `role="gridcell"` and manages `tabindex` for focus
- `Cell` reflects its resolved selection value with `data-value`
- `Header` renders with `role="columnheader"`
- `Head` and `Body` are structural containers without specific roles
- Selected cells have `aria-selected="true"` and `data-selected="true"`
- Focused cell has `tabindex="0"`, all others have `tabindex="-1"`
- Initial focus (when grid is first focused) defaults to the first focusable cell

### Coverage Expectations

- Tests for this package should cover:
- **Structure and Composition:**
- Each part renders with correct ARIA role
- Valid composition patterns (Root > Row > Cell)
- Invalid composition throws errors (Cell outside Row)
- Multiple Head/Body logs warning
- Ref forwarding works for all parts
- Custom HTML attributes are preserved, including `native composition` custom host composition for Row and Cell
- Head and Body containers render correctly
- Header cells have columnheader role and are not focusable
- **Focus Management:** 9. Initial focus defaults to first cell when grid receives focus 10. Arrow key navigation moves focus between cells (not headers) 11. Home/End navigation within rows 12. Ctrl+Home/End navigation to grid boundaries 13. Roving tabindex updates on focus changes (focused=0, others=-1) 14. Tab key moves focus out of grid
- **Selection:** 15. Cell selection on click 16. Enter and Space toggle selection for the focused cell 17. Ctrl+A selects all cells 18. Shift+Space toggles row cells in the current selection 19. Ctrl+Space toggles column cells in the current selection 20. Shift+Arrow toggles selection for the cell in the arrow direction 21. Escape clears selection 22. aria-selected and data-selected attributes update correctly 23. `value`, `defaultValue`, and `onValueChange` coordinate controlled and uncontrolled selected value arrays 24. Cell `value` is used for selection, with coordinate fallback when omitted
- **Edge Cases:** 25. Empty grid renders without errors 26. Single cell grid handles focus correctly 27. Grid with only headers (no focusable cells)
- **Accessibility:** 28. Root without accessible name logs warning 29. Integration with higher-level packages (calendar example)

## Grid Source Test Parity

- Learned from: `../ariaui/packages/grid/__test__/grid.test.tsx`
- Source test cases: 29
- Native adaptation: assertions use browser-native custom element hosts, reflected attributes/properties, DOM focus, keyboard events, `valuechange` events, and static docs markup instead of framework rendering helpers.
- Native grid tests must cover:
- Root exposes `role="grid"`, coordinates descendant cells, and manages roving tabindex state
- Head and Body remain structural hosts while Row exposes `role="row"`, Header exposes `role="columnheader"`, and Cell exposes `role="gridcell"`
- Cell values fall back to resolved `row:col` coordinates and reflect through `data-row`, `data-col`, and `data-value`
- `default-value` initializes selected cells and the initial roving tab stop
- click selects one cell by value and dispatches `valuechange` with the selected value array
- Arrow keys, Home, End, Ctrl+Home, and Ctrl+End move focus without changing selection
- Enter and Space toggle the focused cell while preserving other selected cells
- Ctrl+A selects every cell, Escape clears selection, Shift+Space toggles the row, Ctrl+Space toggles the column, and Shift+Arrow toggles the target cell
- docs examples include uncontrolled and controlled team-member grids with source-equivalent table, selected values panel, and grid styling classes





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- grid source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
