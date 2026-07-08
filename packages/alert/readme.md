# Alert Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/alert`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-alert` | `alert` |
| Action | `aria-alert-action` | none |
| Cancel | `aria-alert-cancel` | `button` |
| Close | `aria-alert-close` | `button` |
| Description | `aria-alert-description` | none |
| Title | `aria-alert-title` | `heading` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/alert/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 10 of 10 documented sections are represented after native normalization.
- Requirement lines: 41

### Scope

- This document defines the current contract for `@ariaui-web/alert`.

### Primary References

- APG alert pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

### Mental Model

- `@ariaui-web/alert` is a non-modal alert container for important inline status or messaging content.

### Part Model

- The package exports:
- `Root`
- `Title`
- `Description`
- `Action`
- `Close`
- `Cancel`

### State Contract

- This package manages open/closed state for dismissible alerts.
- Native custom elements use `default-open` for the uncontrolled initial open state.

### Props

- Table row: Prop | Type | Default | Description
- Table row: `open` | `boolean` | - | Controlled open state
- Table row: `defaultOpen` | `boolean` | `true` | Initial open state (uncontrolled)
- Table row: `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes
- Table row: `dismissible` | `boolean` | `false` | Enable `Close` and `Cancel` parts to dismiss the alert
- Table row: `role` | `native Web Component.AriaRole` | `"alert"` | Live region role for the root surface

### Accessibility Model

- The root alert surface defaults to `role="alert"` for immediate screen reader announcement. Use a less interruptive live region role such as `status` for non-critical or interactive inline messages. Title and Description are auto-linked via `aria-labelledby` and `aria-describedby`.

### Behavior Contract

- Root, Title, Description, and Action parts compose a structured alert surface
- Close and Cancel components dismiss the alert only when Root is `dismissible`
- Controlled alerts call `onOpenChange(false)` without mutating the rendered state
- `native-composition` slots alert metadata onto a single child host for Root, Title, Description, Action, Close, and Cancel.

### Data and ARIA Reflection

- Table row: Element | Attribute | Value
- Table row: Root | `role` | Defaults to `"alert"`
- Table row: Root | `aria-labelledby` | Auto-generated ID referencing Title
- Table row: Root | `aria-describedby` | Auto-generated ID referencing Description
- Table row: Close | `data-alert-close` | `""`
- Table row: Cancel | `data-alert-cancel` | `""`
- Table row: Root | `aria-hidden` | `"false"` when open and `"true"` when closed
- Table row: Root | `data-state` | `"open"` or `"closed"`
- Table row: Root | `data-dismissible` | Present when `dismissible` is true
- Table row: Title | `aria-level` | Defaults to `"5"` when the title keeps `role="heading"`
- Table row: Action | `data-alert-action` | `""`
- Table row: Close and Cancel | `tabindex` | `"0"` when enabled and `"-1"` when disabled

### Coverage Expectations

- Tests for this package should cover:
- Alert part composition
- Alert semantics on the root
- Title and Description labelling structure
- Open/closed state management
- Close and Cancel dismissal behavior


## Alert Source Test Parity

- Learned from: `../ariaui/packages/alert/__test__/alert.test.tsx`
- Learned from accessibility: `../ariaui/packages/alert/__test__/accessibility.test.tsx`
- Source test cases: 19
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, `openchange` events, hidden state, and custom-element host metadata instead of framework rendering helpers.
- Native alert tests must cover:
- root alert semantics and custom `status` live-region role override
- title and description ARIA linkage with generated unique ids
- action content metadata and non-interactive action host behavior
- `defaultOpen` native equivalent through `default-open`
- dismissible close and cancel behavior
- prevented close and cancel click guards
- controlled-style `open` and `openchange` behavior
- native composition equivalents for root, title, description, action, close, and cancel hosts




## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- alert source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
