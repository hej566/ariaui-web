# Kbd Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/kbd`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-kbd` | none |
| Group | `aria-kbd-group` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/kbd/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 12 of 12 documented sections are represented after native normalization.
- Requirement lines: 48

### Scope

- This document defines the keyboard key display contract for `@ariaui-web/kbd`.
- It uses the shadcn/ui Kbd component as the structural reference:
- shadcn/ui Kbd: <https://ui.shadcn.com/docs/components/radix/kbd>
- HTML `kbd` element: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd>
- The package is headless. It provides semantic keyboard input markup, grouping, and composition support, but no visual styling.

### Mental Model

- A keyboard key display shows textual user input from a keyboard, such as `Ctrl`, `Command`, `Enter`, or a shortcut sequence.
- Use `Root` for a single key label or key-like token. Use `Group` to group related key labels into a shortcut.

### Public API

- The package exports:
- `Root`
- `Group`
- Associated type exports:
- `RootProps`
- `GroupProps`
- No public hooks or styling helpers are exported.

### Root Contract

- Type:
- Code line: interface RootProps extends native element attributes/properties for "kbd" {
- Code line: native composition?: boolean;
- Current behavior:
- renders a `kbd` by default
- renders its single child through `native composition host` when `native composition` is true
- forwards a ref to the rendered element
- passes through native `kbd` attributes/properties, including `className`, `id`, `style`, `title`, `data-*`, and event handlers
- does not add roles, ARIA attributes, data attributes, or styling

### Group Contract

- Type:
- Code line: interface GroupProps extends native element attributes/properties for "span" {
- Code line: native composition?: boolean;
- Current behavior:
- renders a `span` by default
- renders its single child through `native composition host` when `native composition` is true
- forwards a ref to the rendered element
- passes through native `span` attributes/properties, including `className`, `id`, `style`, `aria-*`, `data-*`, and event handlers
- does not add roles, ARIA attributes, data attributes, or styling

### Props

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### native composition

- Current behavior:
- when omitted or `false`, `Root` renders `kbd` and `Group` renders `span`
- when `true`, the component renders through `@ariaui-web/slot`
- slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract

### Accessibility

- `Root` is based on the native `kbd` element. Browser keyboard-input semantics apply.
- `Group` intentionally renders a neutral `span`. Consumers may pass `aria-label` when a shortcut group needs a pronounceable label.

### Data Attributes

- `Root` and `Group` do not add package-owned data attributes.

### Styling

- The package does not apply layout, color, typography, spacing, borders, shadows, or cursor styles.
- Consumers should style keycaps and groups using normal element selectors or classes.

### SSR and Hydration

- `Root` and `Group` are deterministic during server rendering. They do not generate IDs, read layout, or attach effects.
- The package includes `"use client"` so it can be consumed consistently by native Web Component Server Component applications.

### Change Control

- Behavior changes must update:
- Unit tests in `packages/kbd/__test__`.
- This readme.
- Any docs examples or live sandbox wiring that import `@ariaui-web/kbd`, if added later.

## Kbd Source Test Parity

- Learned from: `../ariaui/packages/kbd/__test__/kbd.test.tsx`
- Source test cases: 10
- Native adaptation: assertions use browser-native custom elements, neutral display hosts, consumer-authored attributes/classes/styles, DOM events, and `native-composition` child hosts as the equivalent of source slot composition.
- Native kbd tests must cover:
- Root display semantics with no default role, focusability, ARIA state, or state data attributes
- native attribute/property passthrough for id, title, data attributes, class, style, and text content
- consumer DOM event handlers without disabled or button-like interaction guards
- Group remains a neutral shortcut grouping host with no default role and preserves `aria-label`
- native-composition child hosts as the browser-native adaptation of source slot composition
- docs examples include shortcut-group and inline variants with source-equivalent keycap, group, plus, and inline text classes





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- kbd source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
