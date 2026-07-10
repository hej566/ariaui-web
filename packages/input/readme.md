# Input Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/input`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-input` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/input/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 9 of 9 documented sections are represented after native normalization.
- Requirement lines: 54

### Scope

- This document defines the current contract for `@ariaui-web/input`.
- `@ariaui-web/input` is a thin controllable wrapper around the native HTML `<input>` element.

### Primary References

- HTML input specification: https://html.spec.whatwg.org/multipage/input.html
- native Web Component input docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input

### Mental Model

- This package keeps native input behavior intact while adding a small convenience contract:
- controllable and uncontrollable value support
- `onValueChange` as a string-first callback
- native `disabled` and `required` attributes
- ref forwarding to the actual `<input>` element
- It is not a styled field abstraction or a validation framework.

### API Surface

- The package exports one part:
- `Root`
- Current public shape:
- all native input attributes/properties except `onChange` are inherited from `native element attributes/properties for "input"`
- `onChange` remains supported explicitly as a composed event callback
- `value?: string`
- `defaultValue?: string` (defaults to empty string `""`)
- `onValueChange?: (value: string) => void`
- `disabled?: boolean`
- `required?: boolean`
- `type?: "text" | "email" | "password" | "tel" | "url" | "search"` (string-compatible input types, defaults to `"text"`)
- `ref` forwarded to the native `<input>` element

### State Contract

- `Root` supports both controlled and uncontrolled value state.
- Behavior:
- when a string `value` attributes/properties is provided, the component behaves as controlled
- when `value` is omitted or non-string, the component manages internal string state initialized from `defaultValue` (defaults to `""`)
- changes flow through `onValueChange` with the next string value
- native `onChange` is composed rather than replaced
- Note: This component only supports string-compatible input types. Non-string input types (checkbox, radio, file, number, date, color, etc.) are not supported.

### Accessibility Model

- `@ariaui-web/input` relies on native input semantics.
- It should preserve:
- the native input role for the chosen `type`
- label association through standard HTML mechanisms
- native disabled and required semantics
- native focus behavior

### Behavior Contract

- `Root` renders a native `<input>`
- `type` defaults to `"text"`
- `disabled` maps to the native `disabled` attribute
- `required` maps to the native `required` attribute
- `onChange` receives the native change event
- `onValueChange` receives the next string value from the event target
- both callbacks may fire for the same change event
- all additional native input attributes/properties are forwarded to the underlying element
- the forwarded ref points at the real `<input>` element

### Data and ARIA Reflection

- This package does not add custom ARIA or `data-*` state reflection by default.
- Consumers may pass native ARIA attributes through `Root` as normal input attributes/properties.

### Coverage Expectations

- Tests for this package should cover:
- controlled value behavior
- uncontrolled value behavior from `defaultValue`
- composed `onChange` and `onValueChange`
- native type defaulting and supported type passthrough
- `disabled` and `required` attribute mapping
- ref forwarding to the native input element
- baseline accessibility with a labeled usage example

## Input Source Test Parity

- Learned from: `../ariaui/packages/input/__test__/input.test.tsx`
- Source test cases: 8
- Native adaptation: assertions use a browser-native custom element host that owns a real `<input>`, light-DOM events, reflected host properties, and static docs markup instead of framework rendering helpers.
- Native input tests must cover:
- Root renders a real native `<input>` owned by the browser-native custom element host
- Root composes native `input` events with `valuechange` events that expose the next string value
- Root supports uncontrolled value state from `default-value` and controlled-style updates through the `value` property
- Root defaults `type` to `text` and forwards supported string input types
- disabled and required map to the owned native input while avoiding custom data or ARIA state reflection
- legacy `isDisabled` and `isRequired` attributes are filtered and never forwarded to the native input
- docs examples include basic-controlled, password, with-button, and file-native examples with source-equivalent labels and classes





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- input source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
