# InputOtp Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/input-otp`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-input-otp` | none |
| Group | `aria-input-otp-group` | `group` |
| InputOTP | `aria-input-otp-input-otp` | none |
| InputOTPGroup | `aria-input-otp-input-otpgroup` | none |
| InputOTPSeparator | `aria-input-otp-input-otpseparator` | none |
| InputOTPSlot | `aria-input-otp-input-otpslot` | none |
| Separator | `aria-input-otp-separator` | `separator` |
| Slot | `aria-input-otp-slot` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/input-otp/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 49

### Scope

- This document defines the current contract for `@ariaui-web/input-otp`.

### Primary References

- shadcn input-otp docs: https://ui.shadcn.com/docs/components/input-otp

### Mental Model

- `@ariaui-web/input-otp` is a one-time-code entry primitive that uses one visually hidden text input plus visible slot components.

### Part Model

- The package exports:
- `InputOTP.Root` - container with hidden input and context provider
- `InputOTP.Group` - visual grouping container for slots
- `InputOTP.native composition host` - individual character display slot
- `InputOTP.Separator` - visual separator between slot groups

### State Contract

- The root coordinates shared OTP value, focus state, slot registration, and current focused slot index.

### Props Contract

- **Root:**
- `value?: string` - controlled value
- `defaultValue?: string` - uncontrolled initial value (defaults to empty string)
- `onChange?: (value: string) => void` - callback when value changes
- `maxLength: number` - maximum number of characters (required)
- `disabled?: boolean` - disables the input
- `autoFocus?: boolean` - auto-focuses the input on mount
- `onComplete?: (value: string) => void` - callback when value reaches maxLength
- All standard div attributes/properties (className, onClick, etc.)
- **Group:**
- All standard div attributes/properties (className, children, etc.)
- **native composition host:**
- `index?: number` - optional explicit slot index (auto-calculated if omitted)
- `native composition?: boolean` - slot state, value, caret, className, and data attributes onto a single child element for custom hosts such as Framer Motion components
- All standard div attributes/properties (className, etc.)
- **Separator:**

### Accessibility Model

- The implementation relies on one native text input for actual text entry while visible slots mirror the current value and focus position.
- The hidden input uses:
- `inputMode="numeric"` for mobile keyboard optimization
- `pattern="[0-9]*"` to indicate numeric-only input
- `autoComplete="one-time-code"` for browser autofill integration
- Note: This component is designed for numeric OTP codes only.

### Behavior Contract

- the hidden input owns real text entry
- visible slots reflect individual characters and focused-position state
- values are clipped to `maxLength`
- `onComplete` fires when the entered value reaches `maxLength`
- clicking the visible shell focuses the hidden input
- pressing Backspace deletes the focused value; from the next empty slot, it focuses the previous filled slot and deletes it in the same key press
- slots auto-register and sort themselves by DOM position

### Styling Contract

- Consumers own visual layout and styling through `className`. The root keeps only functional inline positioning for the hidden native input overlay.

### Data and ARIA Reflection

- Native input semantics come from the hidden input; slot-level focus and value reflection are driven from shared context.

### Coverage Expectations

- Tests for this package should cover:
- value entry and clipping to maxLength
- focus mirroring into visible slots
- slot registration and rendering
- completion callback behavior
- disabled attributes/properties prevents input
- autoFocus attributes/properties focuses on mount
- controlled and uncontrolled modes
- Backspace focuses and deletes the previous filled slot in one key press






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
