# Label Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/label`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-label` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/label/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 12 of 12 documented sections are represented after native normalization.
- Requirement lines: 40

### Scope

- This document defines the label contract for `@ariaui-web/label`.
- It uses the Radix UI Label primitive as the structural reference:
- Radix Label: <https://www.radix-ui.com/primitives/docs/components/label>
- HTML `label` element: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label>
- The package is headless. It provides native label semantics, composition support, and double-click selection protection, but no visual styling.

### Mental Model

- A label names a control. Native labels can associate with controls by wrapping them or by using `htmlFor` to reference an input `id`.
- Use `Root` anywhere a native `label` element is appropriate.

### Public API

- The package exports:
- `Root`
- Associated type exports:
- `RootProps`
- No public hooks or styling helpers are exported.

### Root Contract

- Type:
- Code line: interface RootProps extends native element attributes/properties for "label" {
- Code line: native composition?: boolean;
- Current behavior:
- renders a `label` by default
- renders its single child through `native composition host` when `native composition` is true
- forwards a ref to the rendered element
- passes through native label attributes/properties, including `htmlFor`, `className`, `id`, `style`, `data-*`, and event handlers
- calls the consumer `onMouseDown` handler before internal double-click handling
- prevents text selection when double-clicking the label surface
- does not prevent default when the pointer starts inside nested `button`, `input`, `select`, or `textarea` controls

### Props

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### htmlFor

- Passes through to the native `label` element. Use this to associate a label with a control by `id`.

### native composition

- Current behavior:
- when omitted or `false`, `Root` renders a `label`
- when `true`, `Root` renders through `@ariaui-web/slot`
- slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract

### Accessibility

- `Root` is based on the native `label` element. Browser label behavior applies when the label wraps a form control or references one with `htmlFor`.
- Custom controls should still be backed by native controls such as `button` or `input` when they need label behavior.

### Data Attributes

- `Root` does not add package-owned data attributes.

### Styling

- The package does not apply layout, color, typography, spacing, or cursor styles.
- Consumers should style the label using normal element selectors or classes.

### SSR and Hydration

- `Root` is deterministic during server rendering. It does not generate IDs, read layout, or attach effects.
- The package includes `"use client"` so it can be consumed consistently by native Web Component Server Component applications.

### Change Control

- Behavior changes must update:
- Unit tests in `packages/label/__test__`.
- This readme.
- Any docs examples or live sandbox wiring that import `@ariaui-web/label`, if added later.

## Label Source Test Parity

- Learned from: `../ariaui/packages/label/__test__/label.test.tsx`
- Source test cases: 10
- Native adaptation: assertions use browser-native custom elements, `for`/id association, wrapped native controls, DOM events, double-click selection protection, and `native-composition` child hosts as the equivalent of source slot composition.
- Native label tests must cover:
- Root keeps native label semantics with no default role, focusability, ARIA state, or reflected state data attributes
- native attribute/property passthrough for for/htmlFor, id, data attributes, class, style, and text content
- Root activates associated controls through for/id and wrapped native controls
- consumer mousedown handlers plus double-click selection protection on the label surface
- no double-click preventDefault when the pointer starts inside nested button, input, select, or textarea controls
- native-composition child hosts as the browser-native adaptation of source slot composition
- docs examples include default and wrapped-control variants with source-equivalent label, field, and input classes





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- label source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
