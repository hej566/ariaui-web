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
- The browser-native component host owns and proxies a real `<textarea>` control.
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

- `Root` owns a native `<textarea>` in light DOM
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

## Textarea Source Test Parity

- Learned from: `../ariaui/packages/textarea/__test__/textarea.test.tsx`
- Source test cases: 12
- Native adaptation: assertions use a browser-native custom element host that owns a real `<textarea>`, light-DOM native events, proxied host properties, and static documentation markup instead of framework rendering helpers.
- Native textarea tests must cover:
- Root owns a real native `<textarea>` with browser textbox semantics
- Root emits `valuechange` for each native input and preserves native input listener ordering
- Root supports initial values from `default-value` and external updates through `value`
- disabled and required map directly to the owned native textarea
- consumer IDs, ARIA attributes, placeholders, and additional textarea attributes forward to the native control
- focus and selection APIs delegate to the owned native textarea
- a visibly labelled Textarea usage has no baseline accessibility violations
- docs examples include uncontrolled, controlled, and disabled variants with source-equivalent content and classes






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
