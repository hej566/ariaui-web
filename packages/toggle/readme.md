# Toggle Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/toggle`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-toggle` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/toggle/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 6 of 6 documented sections are represented after native normalization.
- Requirement lines: 30

### Scope

- This document defines the current contract for `@ariaui-web/toggle`.
- It implements the WAI-ARIA pressed button pattern for a standalone toggle button.
- Use `@ariaui-web/toggle-group` when a set of related toggles needs single or multiple
- selection, roving focus, or shared value state.

### Mental Model

- `@ariaui-web/toggle` is a headless pressed button primitive. It renders one native
- `<button type="button">`, supports controlled and uncontrolled pressed state, and
- reflects state through ARIA and data attributes.

### API Reference

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- **Props:**
- `pressed?: boolean` - controlled pressed state
- `defaultPressed?: boolean` - uncontrolled initial pressed state (default: `false`)
- `onPressedChange?: (pressed: boolean) => void` - callback fired with the next pressed state
- `disabled?: boolean` - disables the button
- All standard button attributes/properties except `defaultValue` and `onChange`
- **Behavior:**
- Uses `useControllableState` from `@ariaui-web/hooks`.
- Calls the consumer `onClick` first; if the event is prevented, pressed state is not changed.
- Does not toggle when disabled.
- Renders children directly inside the button.

### State and Accessibility

- `aria-pressed` is `true` or `false` based on pressed state.
- `data-state` is `"on"` or `"off"`.
- `data-disabled` is present when disabled.
- The rendered element is a native button, so Space and Enter activation follow browser defaults.

### Coverage Expectations

- Tests should cover:
- Controlled `pressed` state
- Uncontrolled `defaultPressed` state
- `onPressedChange` notification
- Disabled behavior
- ARIA and data attribute reflection
- No accessibility violations

## Toggle Source Test Parity

- Learning source: `../ariaui/packages/toggle/__test__/toggle.test.tsx`
- Source test cases: 5
- `defaultPressed` initializes uncontrolled pressed state and activation reports the next value.
- Controlled `pressed` state remains unchanged while `onPressedChange` receives the next value.
- Consumer click prevention and disabled state both suppress pressed-state changes.
- `aria-pressed`, `data-state`, `data-disabled`, and native button type reflect the effective state.
- The default toggle has no axe accessibility violations.
- Docs reproduce the upstream six Toggle variants and Tailwind class composition.






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
