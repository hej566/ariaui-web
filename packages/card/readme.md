# Card Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/card`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-card` | none |
| Content | `aria-card-content` | none |
| Description | `aria-card-description` | none |
| Footer | `aria-card-footer` | none |
| Header | `aria-card-header` | none |
| Title | `aria-card-title` | `heading` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/card/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 9 of 9 documented sections are represented after native normalization.
- Requirement lines: 19

### Scope

- This document defines the current contract for `@ariaui-web/card`.

### Primary References

- HTML sectioning and grouping content: https://html.spec.whatwg.org/

### Mental Model

- `@ariaui-web/card` is a content container primitive for grouping related UI into a consistent part structure.

### Part Model

- The package exports:
- `Root`
- `Header`
- `Title`
- `Description`
- `Content`
- `Footer`

### State Contract

- This package owns no interactive state.

### Accessibility Model

- Accessibility depends on the semantics consumers choose for the content placed inside the card.
- `Title` defaults to `aria-level="3"` while preserving `role="heading"`.

### Behavior Contract

- card parts provide structural composition for common container layouts
- the package does not impose interaction semantics by itself

### Data and ARIA Reflection

- This package does not add custom state reflection by default.

### Coverage Expectations

- Tests for this package should cover:
- structural composition of card parts
- ref and attributes/properties passthrough for each exported part

## Card Source Test Parity

- Learned from: `../ariaui/packages/card/__test__/card.test.tsx`
- Learned from docs page: `../ariaui/web/doc/src/app/docs/components/card/page.md`
- Source test cases: 5
- Native adaptation: assertions use browser-native custom element hosts, source-equivalent heading semantics, DOM attributes/events, and static docs markup instead of framework rendering helpers.
- Native card tests must cover:
- Root, Header, Content, and Footer stay neutral structural hosts with no default role, focusability, ARIA state, or reflected state data attributes
- Description stays a neutral text host with no default role while preserving authored attributes and content
- Title exposes source-equivalent h3 heading semantics through role="heading" and aria-level="3" on the native custom element host
- all card parts forward authored classes, ids, styles, data attributes, text content, children, and DOM events
- docs examples include account-form, basic layout, login, meeting-notes, and with-image variants with source-equivalent card classes





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- card source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
