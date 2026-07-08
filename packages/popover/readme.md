# Popover Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/popover`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-popover` | none |
| Close | `aria-popover-close` | `button` |
| Content | `aria-popover-content` | `region` |
| Description | `aria-popover-description` | `note` |
| Heading | `aria-popover-heading` | none |
| Trigger | `aria-popover-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/popover/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 12 of 12 documented sections are represented after native normalization.
- Requirement lines: 74

### Scope

- This document defines the current contract for `@ariaui-web/popover`.

### Primary References

- Radix popover docs: https://www.radix-ui.com/primitives/docs/components/popover
- APG dialog pattern for labelled floating surfaces: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

### Mental Model

- `@ariaui-web/popover` is a positioned floating surface built around:
- root open state
- a reference trigger
- a portalled content surface
- optional modal focus trapping
- optional arrow rendering
- It behaves like a lightweight floating dialog surface rather than a menu.

### Part Model

- The package exports:
- `Root`
- `Trigger`
- `Content`
- `Heading`
- `Description`
- `Close`

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Current public shape:
- `open?: boolean`
- `defaultOpen?: boolean`
- `onOpenChange?: (open: boolean) => void`
- `placement?: Placement`
- `offset?: number`
- `modal?: boolean`
- Behavior:
- open state may be controlled or uncontrolled
- the root tracks the reference element, floating element, and current placement
- `modal` controls whether content focus is trapped
- content focus loops by default, and can be disabled with `Content loop={false}`

### Trigger

- Responsibilities:
- toggle open state
- register the reference element
- expose popover-expanded state and dialog intent through ARIA

### Content

- Responsibilities:
- render the portalled floating surface while open
- position relative to the trigger
- expose dialog semantics and optional arrow rendering
- wrap children in `FocusScope`
- optionally loop focus through children with the `loop` attributes/properties
- optionally slot content attributes/properties onto a child host with the `native composition` attributes/properties

### Accessibility Model

- The current implementation reflects a dialog-like floating surface:
- trigger exposes `aria-haspopup="dialog"`
- trigger reflects `aria-expanded`
- content renders `role="dialog"`
- heading and description ids are wired into content labelling
- `modal` controls focus trapping behavior

### Behavior Contract

- `Trigger` toggles open state on click and on `Enter` / `Space`
- `Content` returns `null` while closed
- content is portalled through `@ariaui-web/portal`
- content is positioned through `@ariaui-web/position`
- outside mouse interaction closes the popover
- `Escape` closes the popover
- `Close` closes the popover directly
- `Close` returns focus to the trigger after closing
- optional arrow rendering is controlled by the `arrow` attributes/properties on content
- focus looping is controlled by the `loop` attributes/properties on content, defaulting to `true`
- `native composition` slots content attributes/properties onto a single child element while preserving focus scope and optional arrow rendering

### Data and ARIA Reflection

- Minimum expected reflection:
- `aria-haspopup="dialog"` on the trigger
- `aria-expanded` on the trigger
- `aria-controls` on the trigger while open
- `role="dialog"` on content
- `aria-modal` on content when modal mode is active
- `data-state="open" | "closed"` on the trigger

### Coverage Expectations

- Tests for this package should cover:
- controlled and uncontrolled open behavior
- trigger toggling through click and keyboard
- content portal rendering and positioning lifecycle
- outside-click dismissal
- `Escape` dismissal
- heading and description labelling
- modal versus non-modal focus-scope behavior
- optional arrow rendering






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
