# Portal Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/portal`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-portal` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/portal/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 30

### Scope

- This document defines the current contract for `@ariaui-web/portal`.
- `@ariaui-web/portal` is a small utility that renders children outside the local DOM hierarchy while preserving DOM context.

### Primary References

- native Web Component `createPortal`: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
- Radix Portal utility: https://www.radix-ui.com/primitives/docs/utilities/portal

### Mental Model

- This package is intentionally narrow.
- It exists so other packages can portal floating or modal content to `document.body` without reimplementing SSR guards or repeating `native DOM portal insertion` inline.

### API Surface

- The package exports a single named export:
- `Root` (used as `Root` when imported as `import * as Portal`)

### Props

- Code line: interface PortalRootProps {
- Code line: children?: Node | string;

### Usage

- Code line: import { definePortalElements } from "@ariaui-web/portal";
- Code line: <aria-portal>
- Code line: <div>Content rendered to document.body</div>
- Code line: </aria-portal>
- The current implementation does not support a `container` attributes/properties. All content is portaled to `document.body`.

### State Contract

- This package owns no interactive state.

### Accessibility Model

- `@ariaui-web/portal` does not add ARIA semantics itself.
- Accessibility responsibilities remain with the calling package, such as:
- dialog semantics for modal content
- listbox semantics for floating option menus
- focus management and dismissal behavior

### Behavior Contract

- In the browser, `Root` renders children into `document.body`.
- On the server, or when `document` is unavailable, `Root` returns the children inline.
- DOM context is preserved across the portal boundary.
- The package does not create wrappers or additional semantics around the children it renders.

### Data and ARIA Reflection

- This package does not reflect state through ARIA or `data-*` attributes.

### Coverage Expectations

- Tests for this package should cover:
- body-based portal rendering in the browser
- SSR or `document`-missing fallback rendering
- DOM context preservation across the portal boundary

## Portal Source Test Parity

- Learned from: `../ariaui/packages/portal/__test__/portal.test.tsx`
- Source test cases: 3
- Native adaptation: assertions use browser-native custom elements, node movement into `document.body`, inline pre-connection markup, and DOM node identity instead of framework portals.
- Native portal tests must cover:
- Root renders child nodes into document.body when connected in the browser
- Root keeps children inline before connection as the native SSR fallback equivalent
- Root preserves child node identity and DOM event listeners across the portal boundary
- Root preserves portalled children when its connected custom element host is reparented
- Root does not create wrapper semantics, default roles, focusability, keyboard behavior, ARIA state, or reflected state data attributes
- Root removes owned portalled nodes when the host disconnects





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- portal source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
