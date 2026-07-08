# Splitter Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/splitter`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-splitter` | none |
| Panel | `aria-splitter-panel` | `tabpanel` |
| Separator | `aria-splitter-separator` | `separator` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/splitter/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 26 of 26 documented sections are represented after native normalization.
- Requirement lines: 186

### Scope

- This document defines the current contract for `@ariaui-web/splitter`.

### Primary References

- APG window splitter pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

### Mental Model

- `@ariaui-web/splitter` is a resizable panel primitive composed from a root, one or more panels, and separator handles. Panels are sized using percentage-based layouts, making the component responsive by default.

### Part Model

- The package exports:
- `Root` - Container that manages layout state and provides context
- `Panel` - Resizable content regions
- `Separator` - Interactive resize handles between panels

### API Reference

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Container component that coordinates panel layout state.
- **Props:**
- `orientation?: "horizontal" | "vertical"` - Layout direction (default: `"vertical"`)
- `defaultLayout: number[]` - Initial panel sizes as percentages (required, should sum to 100 for predictable behavior)
- `onLayoutChange?: (layout: number[]) => void` - Callback fired when layout changes
- `isDisabled?: boolean` - Disables all resize interactions (default: `false`)
- `children?: Node | string` - Panel and Separator components
- `className?: string` - CSS class for the root container
- **Behavior:**
- Throws error if `defaultLayout` is not provided or empty
- Does not validate that layout sums to 100% - developer responsibility
- Rounds all percentage values to 2 decimal places
- Renders children with `role="group"`
- Provides context to Panel and Separator components without cloning or reshaping children
- **Example:**
- Code line: <aria-splitter defaultLayout={[30, 70]} orientation="vertical">
- Code line: <aria-splitter-panel>Left content</aria-splitter-panel>
- Code line: <aria-splitter-separator />
- Code line: <aria-splitter-panel>Right content</aria-splitter-panel>
- Code line: </aria-splitter>

### Panel

- Resizable content container.
- **Props:**
- `defaultSize?: number` - Initial size percentage (unused - Root's defaultLayout takes precedence)
- Standard `HTMLDivElement` attributes/properties (className, style, etc.)
- **Behavior:**
- Registers with Root context on mount
- Unregisters on unmount
- Applies size from layout state as `width` (vertical) or `height` (horizontal)
- Uses `flex-basis` for sizing with `flexGrow: 0, flexShrink: 0`
- Applies smooth transitions (200ms ease-out) except during drag
- Sets `overflow: hidden` by default
- **Example:**
- Code line: <aria-splitter-panel id="sidebar" className="bg-gray-100">
- Code line: <nav>Navigation</nav>
- Code line: </aria-splitter-panel>

### Separator

- Interactive resize handle between panels.
- **Props:**
- `aria-label?: string` - Accessible label for the separator
- `index?: number` - Panel index this separator controls (auto-detected from context registration if omitted)
- Standard `HTMLDivElement` attributes/properties (className, style, etc.)
- **Behavior:**
- Registers with Root context on mount
- Unregisters on unmount
- Auto-detects index from context registration order if not provided
- Resizes the panel at `index` (the "primary" panel) and `index + 1` (the "secondary" panel)
- Supports keyboard and pointer interactions
- Maintains collapse state for Enter key toggle
- **ARIA Attributes:**
- `role="separator"`
- `aria-valuenow` - Current size of primary panel (rounded percentage)
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-orientation` - Matches splitter orientation
- `aria-disabled` - Reflects disabled state
- `tabIndex` - `0` when enabled, `-1` when disabled
- **Data Attributes:**
- `data-orientation` - `"horizontal"` or `"vertical"`
- `data-disabled` - Present when disabled
- `data-dragging` - Present during pointer drag
- **Example:**
- Code line: <aria-splitter-separator aria-label="Resize sidebar" />

### Keyboard Interaction

- All keyboard interactions follow the ARIA window splitter pattern.

### Arrow Keys (5% step)

- **Vertical orientation:**
- `ArrowLeft` - Decrease primary panel size (move separator left)
- `ArrowRight` - Increase primary panel size (move separator right)
- `ArrowUp/ArrowDown` - Ignored
- **Horizontal orientation:**
- `ArrowUp` - Decrease primary panel size (move separator up)
- `ArrowDown` - Increase primary panel size (move separator down)
- `ArrowLeft/ArrowRight` - Ignored

### Special Keys

- `Enter` - Toggle collapse/restore of primary panel
- First press: Collapse to 0%, store previous size
- Second press: Restore to previous size
- `Home` - Collapse primary panel to 0% (give all space to secondary)
- `End` - Expand primary panel to 100% (collapse secondary to 0%)

### Constraints

- Panels cannot go below 0%
- Panels cannot exceed available space
- Resizing one separator only affects its two adjacent panels
- All interactions respect `isDisabled` state

### Pointer Interaction

- `pointerdown` on separator initiates drag
- During drag:
- Cursor changes to `col-resize` (vertical) or `row-resize` (horizontal)
- `user-select: none` applied to body
- Continuous resize as pointer moves
- Panel transitions disabled for smooth dragging
- `pointerup` or `pointercancel` ends drag
- Cursor and user-select restored on drag end

### State Contract

- The Root component manages:
- `layout: number[]` - Current panel sizes as percentages
- Registered panel and separator elements, sorted by DOM order
- `isDragging: boolean` - Active drag state
- `isDisabled: boolean` - Global disabled state
- State updates trigger re-renders of all panels and separators.

### Accessibility Model

- The implementation satisfies ARIA window splitter requirements:
- **Role and Properties:**
- Separator has `role="separator"`
- Proper `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Correct `aria-orientation`
- `aria-disabled` reflects state
- **Keyboard Support:**
- Full arrow key navigation
- Enter for collapse/restore
- Home/End for min/max positions
- All keys respect orientation
- **Focus Management:**
- Separators are focusable (`tabIndex="0"`)
- Disabled separators not focusable (`tabIndex="-1"`)
- **Screen Reader Support:**
- Custom `aria-label` supported
- Value changes announced via `aria-valuenow`

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Panel Sizing

- Panels use percentage-based sizing (0-100%)
- Sizes rounded to 2 decimal places to prevent floating-point errors
- Layout is responsive - percentages adapt to container size

### Resize Logic

- Resizing affects exactly two adjacent panels
- Delta clamped to prevent negative sizes
- Zero-delta changes ignored (no-op)
- Layout callback fired on every change

### Multi-Panel Layouts

- Supports 2+ panels with N-1 separators
- Each separator independently controls its adjacent pair
- Third panel unaffected when resizing first separator

### Nested Splitters

- Splitters can be nested (e.g., vertical inside horizontal)
- Each Root maintains independent context
- No cross-contamination between nested instances

### Disabled State

- When `isDisabled={true}`:
- All keyboard interactions ignored
- Pointer interactions ignored
- Separators not focusable
- `aria-disabled="true"` set

### Edge Cases

- **Boundary Conditions:**
- Panels can collapse to 0%
- Panels can expand to 100%
- Further resize attempts at boundaries are no-ops
- **Invalid Index:**
- Separator with invalid index performs no action
- Auto-detection falls back to -1 if no previous sibling
- **Context Errors:**
- Panel/Separator outside Root throws error
- Error message: "Splitter components must be used within Root"
- **Layout Normalization:**
- Input percentages rounded to 2 decimals
- No automatic normalization if sum != 100%

### Data and ARIA Reflection

- All interactive state reflected through:
- ARIA attributes on separator
- Data attributes for styling hooks
- Layout state in context
- Callback for external state sync

### Coverage Expectations

- Tests must cover:
- **Composition:**
- Root, Panel, Separator rendering
- Multiple panels (2, 3+)
- Nested splitters
- **Resize Behavior:**
- Keyboard resize (all keys)
- Pointer drag resize
- Boundary clamping
- Adjacent panel updates only
- **Accessibility:**
- All ARIA attributes present and correct
- Values update on resize
- Focus management
- Disabled state handling
- **Edge Cases:**
- 0% and 100% boundaries
- Invalid indices
- Context errors
- Rapid interactions
- **States:**
- Disabled mode
- Controlled mode (onLayoutChange)
- Drag state (data-dragging)

### Known Limitations

- No layout validation (values not required to sum to 100% - behavior undefined when sum != 100%)
- Transition duration not configurable (hardcoded 200ms)
- No pointer capture used (relies on window events - may cause issues with fast drags)

### Future Enhancements

- **Min/max size constraints per panel** - Prevent panels from collapsing to unusable dimensions
- **aria-controls linking separator to panel IDs** - Improve screen reader announcements
- **Configurable keyboard step size** - Currently hardcoded to 5%
- **Pointer capture for drag operations** - Use `setPointerCapture()` for more robust dragging






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
