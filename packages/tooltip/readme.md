# Tooltip Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/tooltip`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-tooltip` | none |
| Content | `aria-tooltip-content` | `region` |
| Trigger | `aria-tooltip-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/tooltip/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 9 of 9 documented sections are represented after native normalization.
- Requirement lines: 31

### Scope

- This document defines the current contract for `@ariaui-web/tooltip`.

### Primary References

- APG tooltip pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- Radix tooltip docs: https://www.radix-ui.com/primitives/docs/components/tooltip

### Mental Model

- `@ariaui-web/tooltip` is a positioned descriptive surface shown from a trigger on hover or focus.

### Part Model

- The package exports tooltip parts through the package entrypoint, centered around:
- `Root`
- `Trigger`
- `Content`

### State Contract

- The root coordinates controlled or uncontrolled open state, placement state, and reference/floating elements.

### Accessibility Model

- Tooltip content has `role="tooltip"`
- Trigger references tooltip via `aria-describedby` (only when open)
- Tooltip content does **not** receive focus - focus stays on the triggering element
- The trigger renders a `<button>` by default and supports polymorphic composition via `native composition`

### Behavior Contract

- **Hover open**: mouse-entering the trigger opens the tooltip immediately
- **Focus open**: focusing the trigger opens the tooltip
- **Hover persistence**: tooltip stays open while the pointer moves from the trigger to the portaled content (via `relatedTarget` checks); leaving both closes immediately
- **Blur dismissal**: if opened via focus, dismissed on blur
- **Escape dismissal**: pressing `Escape` while the trigger has focus immediately closes the tooltip
- Content is portalled and positioned relative to the trigger
- Optional arrow rendering is supported by the tooltip content implementation

### Data and ARIA Reflection

- Tooltip semantics and trigger association should be reflected across the trigger and content parts.

### Coverage Expectations

- Tests for this package should cover:
- hover-open behavior
- focus-open behavior
- `Escape` dismissal
- blur dismissal
- trigger-to-tooltip association (`aria-describedby`)
- positioning lifecycle and optional arrow behavior
- hover persistence over tooltip content
- polymorphic trigger composition via `native composition`
- tooltip content is not focusable






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
