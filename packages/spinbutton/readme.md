# Spinbutton Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/spinbutton`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-spinbutton` | `group` |
| Decrement | `aria-spinbutton-decrement` | `button` |
| Increment | `aria-spinbutton-increment` | `button` |
| Input | `aria-spinbutton-input` | `spinbutton` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/spinbutton/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 26 of 26 documented sections are represented after native normalization.
- Requirement lines: 205

### Scope

- This document defines the current contract for `@ariaui-web/spinbutton`.

### Primary References

- APG spinbutton pattern: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

### Mental Model

- `@ariaui-web/spinbutton` is a composable numeric input primitive with explicit increment and decrement controls. The component provides both button-based and keyboard-based value adjustment within defined boundaries.

### Part Model

- The package exports:
- `Root` - Container that manages numeric state and keyboard interactions
- `Input` - Display element with spinbutton ARIA semantics
- `Increment` - Button to increase value
- `Decrement` - Button to decrease value

### API Reference

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Container component that coordinates numeric value state and interactions.
- **Props:**
- `value?: number` - Controlled value
- `defaultValue?: number` - Initial value for uncontrolled mode (defaults to `min` if provided, otherwise `0`)
- `onValueChange?: (value: number) => void` - Callback fired when value changes
- `min?: number` - Minimum allowed value (default: `Number.MIN_SAFE_INTEGER` - **should be explicitly set**)
- `max?: number` - Maximum allowed value (default: `Number.MAX_SAFE_INTEGER` - **should be explicitly set**)
- `step?: number` - Increment/decrement step size (default: `1`)
- `disabled?: boolean` - Disables all interactions (default: `false`)
- `getValueText?: (value: number) => string` - Function to generate aria-valuetext
- Standard `HTMLDivElement` attributes/properties (className, style, etc.)
- **Behavior:**
- Supports both controlled and uncontrolled modes
- Renders with `role="group"`
- Handles keyboard interactions (ArrowUp/Down, Home/End, PageUp/Down)
- Clamps values to min/max boundaries
- Provides context to child components
- **Example:**
- Code line: <aria-spinbutton defaultValue={5} min={0} max={10} step={1}>
- Code line: <aria-spinbutton-decrement>-</aria-spinbutton-decrement>
- Code line: <aria-spinbutton-input />
- Code line: <aria-spinbutton-increment>+</aria-spinbutton-increment>
- Code line: </aria-spinbutton>

### Input

- Display element that shows the current value with spinbutton semantics.
- **Props:**
- `children?: Node | string` - Custom content (defaults to displaying the numeric value)
- Standard `HTMLDivElement` attributes/properties (className, style, etc.)
- **Behavior:**
- Renders as `<div>` with `role="spinbutton"`
- Displays current value by default
- Focusable (`tabIndex={0}`) when enabled
- Receives keyboard events from Root
- **ARIA Attributes:**
- `role="spinbutton"`
- `aria-valuenow` - Current numeric value
- `aria-valuemin` - Minimum value from context
- `aria-valuemax` - Maximum value from context
- `aria-valuetext` - Optional text representation via getValueText
- `aria-disabled` - Reflects disabled state
- `tabIndex` - `0` when enabled, `-1` when disabled
- **Example:**
- Code line: <aria-spinbutton-input className="text-center" />

### Increment

- Button to increase the value by the step amount.
- **Props:**
- Standard `HTMLButtonElement` attributes/properties (className, onClick, etc.)
- **Behavior:**
- Calls `increment()` on click
- Respects custom onClick handlers (checks `defaultPrevented`)
- Not focusable (`tabIndex={-1}`) - keyboard handled by Root
- Disabled when `disabled={true}`
- Type set to `"button"` to prevent form submission
- **Example:**
- Code line: <aria-spinbutton-increment aria-label="Increase value">
- Code line: <PlusIcon />
- Code line: </aria-spinbutton-increment>

### Decrement

- Button to decrease the value by the step amount.
- **Props:**
- Standard `HTMLButtonElement` attributes/properties (className, onClick, etc.)
- **Behavior:**
- Calls `decrement()` on click
- Respects custom onClick handlers (checks `defaultPrevented`)
- Not focusable (`tabIndex={-1}`) - keyboard handled by Root
- Disabled when `disabled={true}`
- Type set to `"button"` to prevent form submission
- **Example:**
- Code line: <aria-spinbutton-decrement aria-label="Decrease value">
- Code line: <MinusIcon />
- Code line: </aria-spinbutton-decrement>

### Keyboard Interaction

- All keyboard interactions follow the ARIA spinbutton pattern and are handled by the Root component.

### Standard Keys

- `ArrowUp` - Increase value by `step`
- `ArrowDown` - Decrease value by `step`
- `Home` - Set value to `min`
- `End` - Set value to `max`
- `PageUp` - Increase value by `step * 10` (large increment)
- `PageDown` - Decrease value by `step * 10` (large decrement)

### Constraints

- All changes clamped to `[min, max]` range
- Values cannot exceed boundaries
- All interactions respect disabled state
- Keyboard events call `preventDefault()` to avoid scrolling

### State Contract

- The Root component manages:
- `value: number` - Current numeric value
- `min: number` - Minimum boundary
- `max: number` - Maximum boundary
- `step: number` - Increment/decrement amount
- `disabled: boolean` - Global disabled state
- `increment: () => void` - Increase value function
- `decrement: () => void` - Decrease value function
- `setValue: (value: number) => void` - Direct value setter
- `getValueText?: (value: number) => string` - Optional text formatter
- State updates trigger re-renders of Input and buttons.

### Accessibility Model

- The implementation satisfies ARIA spinbutton requirements:
- **Role and Properties:**
- Input has `role="spinbutton"`
- Proper `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Optional `aria-valuetext` for formatted values
- `aria-disabled` reflects state
- **Keyboard Support:**
- Full arrow key navigation
- Home/End for min/max
- PageUp/PageDown for large steps
- All keys respect disabled state
- **Focus Management:**
- Input is focusable (`tabIndex="0"`)
- Buttons not in tab order (`tabIndex="-1"`)
- Disabled input not focusable (`tabIndex="-1"`)
- **Screen Reader Support:**
- Value changes announced via `aria-valuenow`
- Custom text via `aria-valuetext` and getValueText
- Buttons should have `aria-label` for clarity

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Value Management

- Supports controlled mode (value + onValueChange)
- Supports uncontrolled mode (defaultValue)
- Uses `useControllableState` for flexible state management
- Default value falls back to `min` if provided, otherwise `0`

### Increment/Decrement Logic

- Increment: `Math.min(value + step, max)`
- Decrement: `Math.max(value - step, min)`
- Values always clamped to boundaries
- No-op when disabled

### Large Steps (PageUp/PageDown)

- Uses `step * 10` for large adjustments
- Still respects min/max boundaries
- Multiplier is hardcoded (not configurable)

### Button Behavior

- Buttons have `tabIndex={-1}` (not in tab order)
- Keyboard handled by Root, not buttons
- Buttons respect `preventDefault()` from custom handlers
- Type set to `"button"` to prevent form submission

### Disabled State

- When `disabled={true}`:
- All keyboard interactions ignored
- All button clicks ignored
- Input not focusable
- `aria-disabled="true"` set
- Buttons have `disabled` attribute

### Edge Cases

- **Boundary Conditions:**
- Values clamped to `[min, max]`
- Increment at max is no-op
- Decrement at min is no-op
- **Default Values:**
- No defaultValue: uses `min` if provided, else `0`
- Min defaults to `Number.MIN_SAFE_INTEGER`
- Max defaults to `Number.MAX_SAFE_INTEGER`
- **Step Precision:**
- No special handling for decimal steps
- Floating-point arithmetic may cause precision issues
- Values not rounded or normalized
- **Context Errors:**
- Input/Increment/Decrement outside Root throws error
- Error message: "useSpinbuttonContext must be used within a Root"

### Data and ARIA Reflection

- All state reflected through:
- ARIA attributes on Input
- Disabled state on buttons
- Context for component coordination
- Callback for external state sync

### Coverage Expectations

- Tests must cover:
- **Composition:**
- Root, Input, Increment, Decrement rendering
- Context error handling
- **Value Adjustment:**
- Button clicks (increment/decrement)
- Keyboard interactions (all keys)
- Boundary clamping
- Custom step values
- **Accessibility:**
- All ARIA attributes present and correct
- Values update on interaction
- Focus management
- Disabled state handling
- **State Modes:**
- Controlled mode (value + onValueChange)
- Uncontrolled mode (defaultValue)
- Default value fallback logic
- **Edge Cases:**
- Min/max boundaries
- Decimal steps
- Negative numbers
- Zero values
- Large numbers
- **Advanced Features:**
- getValueText and aria-valuetext
- PageUp/PageDown large steps
- Custom onClick handlers with preventDefault

### Known Limitations

- No editable input support (display-only)
- PageUp/PageDown multiplier not configurable (hardcoded 10x)
- No decimal step precision handling
- No validation state support (aria-invalid)
- No readonly state support
- Extreme min/max defaults may cause ARIA issues (see below)
- getValueText not memoized (causes unnecessary re-renders)

### Accessibility Requirements

- **IMPORTANT:** Consumers MUST provide the following for full accessibility compliance:
- **Accessible Name (Required):** Input must have an accessible name via `aria-label` or `aria-labelledby`
- Code line: <aria-spinbutton-input aria-label="Quantity" />
- **Button Labels (Required):** Increment/Decrement buttons should have `aria-label` for clarity
- Code line: <aria-spinbutton-increment aria-label="Increase value">+</aria-spinbutton-increment>
- Code line: <aria-spinbutton-decrement aria-label="Decrease value">-</aria-spinbutton-decrement>
- **Future Enhancement:** `aria-controls` linking buttons to Input ID (not currently implemented)

### Min/Max Default Considerations

- The default values `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER` produce ARIA attributes like `aria-valuemin="-9007199254740991"` which are not meaningful to screen reader users.
- **Recommendation:** Always provide explicit `min` and `max` values:
- Code line: <aria-spinbutton min={0} max={100} defaultValue={50}>






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
