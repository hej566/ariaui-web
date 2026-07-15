# HoverCard Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/hover-card`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-hover-card` | none |
| Content | `aria-hover-card-content` | `tooltip` |
| Trigger | `aria-hover-card-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/hover-card/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 42

### Scope

- This document defines the current contract for `@ariaui-web/hover-card`.

### Primary References

- Radix hover card docs: https://www.radix-ui.com/primitives/docs/components/hover-card

### Mental Model

- `@ariaui-web/hover-card` is a positioned preview surface that opens from hover or focus on a reference trigger.

### Part Model

- The package exports:
- `Root` - coordinates open state, positioning, and timing
- `Trigger` - button element that opens the card on hover/focus
- `Content` - portalled floating surface with optional arrow

### State Contract

- The root coordinates controlled or uncontrolled open state, reference and floating elements, and current placement.

### Props Contract

- **Root:**
- `open` - controlled open state
- `defaultOpen` - uncontrolled initial open state
- `onOpenChange` - callback when open state changes
- `placement` - preferred placement relative to trigger (default: "bottom")
- `offset` - distance in pixels from trigger (default: 8)
- **Content:**
- `arrow` - whether to render positioning arrow (default: false)
- `arrowClassName` - className for arrow element
- `native composition` - slot content attributes/properties onto a single child element for custom hosts such as Framer Motion components

### Accessibility Model

- The content uses `role="tooltip"` to indicate a preview surface. The trigger is a button element for proper keyboard accessibility. Escape key closes the card. Consumers remain responsible for the semantic content inside the card.

### Behavior Contract

- hover on trigger opens the hover card
- leaving the trigger closes the hover card
- hovering over content keeps the card open (safe area)
- focus on trigger opens the hover card
- blur on trigger closes the hover card
- Escape key closes the hover card
- content is portalled and positioned relative to the trigger, rendering a `<div>` by default or slotting attributes/properties onto a child with `native composition`
- positioning updates automatically when trigger or content moves

### Positioning Contract

- The content is positioned using floating-ui with:
- collision detection and automatic placement adjustment
- configurable offset distance from trigger
- support for all standard placements (top, right, bottom, left, and variants)
- automatic repositioning on scroll/resize via autoUpdate

### Data and ARIA Reflection

- The content element receives `role="tooltip"` to indicate a preview surface. The trigger is a native button element for keyboard accessibility. Open state is managed internally and reflected through conditional rendering.

### Coverage Expectations

- Tests for this package should cover:
- hover-open behavior
- hover-close behavior (unhover trigger)
- focus-open behavior
- blur-close behavior
- Escape key closes the card
- content portal rendering, including `native composition` custom host composition
- positioning lifecycle and placement updates
- arrow rendering when enabled

## Hover Card Source Test Parity

- Learned from: `../ariaui/packages/hover-card/__test__/hover-card.test.tsx`
- Learned from: `../ariaui/packages/hover-card/__test__/index.test.tsx`
- Source cases represented: 17.
- Native attributes include `open`, `default-open`, `placement`, `offset`, `arrow`, `arrow-class`, `aria-expanded`, `role`, `data-state`, `data-side`, and `data-align`.
- Native coverage includes hover, pointer safe-area, focus, blur, Escape, controlled and default state, viewport positioning, automatic updates, optional arrow rendering, and source-structured documentation examples.





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- hover-card source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
