# Textarea Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/textarea`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-textarea` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/textarea/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 9 of 9 documented sections are represented after native normalization.
- Requirement lines: 27

### Scope

- This document defines the current contract for `@ariaui-web/textarea`.

### Primary References

- HTML textarea specification: https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element
- native Web Component textarea docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea

### Mental Model

- `@ariaui-web/textarea` is a thin wrapper around the native `<textarea>` element with string change handling via `onValueChange`.

### API Surface

- The package exports:
- `Root` - the textarea component (`displayName`: `"TextArea.Root"`)
- `RootTypes` - TypeScript interface for `Root` attributes/properties
- The component uses `"use client"` and `custom element host references`.
- Current public shape (`RootTypes extends ComponentPropsWithoutRef<"textarea">`):
- `value?: string`
- `defaultValue?: string`
- `onValueChange?: (value: string) => void`
- Native `disabled` and `required` are forwarded directly (no aliases)

### State Contract

- The current implementation forwards `value` directly and emits `onValueChange` from `onChange`.
- If the user also passes `onChange`, it is called alongside `onValueChange` within the same internal handler.

### Accessibility Model

- The package relies on native textarea semantics and standard HTML labelling.

### Behavior Contract

- `Root` renders a native `<textarea>` via `custom element host references`
- `disabled` and `required` are native attributes/properties forwarded directly
- `onValueChange` receives the next string value from the event target
- additional textarea attributes/properties are forwarded to the underlying element via `{...rest}`
- `ref` is forwarded to the underlying `<textarea>`

### Data and ARIA Reflection

- This package does not add custom state reflection by default.

### Coverage Expectations

- Tests for this package should cover:
- native textarea rendering (assert element is a `<textarea>`)
- native `disabled` and `required` attributes/properties forwarding
- value passthrough and change handling (`value`, `defaultValue`, `onValueChange`)
- ref forwarding and attributes/properties passthrough






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
