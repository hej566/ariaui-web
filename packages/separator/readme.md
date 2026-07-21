# Separator Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/separator`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-separator` | `separator` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/separator/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 13 of 13 documented sections are represented after native normalization.
- Requirement lines: 61

### Scope

- This document defines the separator contract for `@ariaui-web/separator`.
- It uses the Radix UI Separator primitive as the structural reference:
- Radix Separator: <https://www.radix-ui.com/primitives/docs/components/separator>
- ARIA `separator` role: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role>
- The package is headless. It provides semantics, orientation state, and composition support, but no visual styling.

### Mental Model

- A separator divides adjacent content. It can either be semantic content structure or a purely visual divider.
- Use a semantic separator when the divider helps communicate page structure. Use a decorative separator when the divider is only a visual boundary between items.

### Public API

- The package exports:
- `Root`
- Associated type exports:
- `RootProps`
- `Orientation`
- No public hooks or styling helpers are exported.

### Root Contract

- Type:
- Code line: type Orientation = "horizontal" | "vertical";
- Code line: interface RootProps extends native element attributes/properties for "div" {
- Code line: native composition?: boolean;
- Code line: decorative?: boolean;
- Code line: orientation?: Orientation;
- Current behavior:
- renders a `div` by default
- renders its single child through `native composition host` when `native composition` is true
- forwards a ref to the rendered element
- defaults `orientation` to `"horizontal"`
- falls back to `"horizontal"` if an invalid runtime orientation value is received
- reflects orientation with `data-orientation`
- spreads consumer attributes/properties after default semantic attributes/properties, so explicit consumer attributes/properties can override them

### Props

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### orientation

- Supported values:
- `"horizontal"`
- `"vertical"`
- Default value:
- Current behavior:
- `data-orientation="horizontal"` for horizontal separators
- `data-orientation="vertical"` for vertical separators
- semantic vertical separators also receive `aria-orientation="vertical"`
- horizontal semantic separators omit `aria-orientation` because horizontal is the ARIA default

### decorative

- Current behavior:
- omitted or `false` renders a semantic separator with `role="separator"`
- `true` renders a decorative element with `role="none"`
- decorative separators omit `aria-orientation`
- decorative separators still reflect `data-orientation` for styling

### native composition

- Current behavior:
- when omitted or `false`, `Root` renders a `div`
- when `true`, `Root` renders through `@ariaui-web/slot`
- slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract

### Accessibility

- Semantic separators expose `role="separator"`.
- Vertical semantic separators expose `aria-orientation="vertical"`. Horizontal semantic separators omit `aria-orientation` because assistive technologies treat horizontal as the default orientation.
- Decorative separators expose `role="none"` so they do not add structure to the accessibility tree.

### Data Attributes

- `Root` reflects:
- `data-orientation="horizontal"`
- `data-orientation="vertical"`
- No state, disabled, or value attributes are exposed.

### Styling

- The package does not apply layout, color, border, size, or spacing styles.
- Consumers should style the separator using normal element selectors, classes, or `data-orientation`.

### SSR and Hydration

- `Root` is deterministic during server rendering. It does not generate IDs, read layout, or attach effects.
- The package includes `"use client"` so it can be consumed consistently by native Web Component Server Component applications.

### Change Control

- Behavior changes must update:
- Unit tests in `packages/separator/__test__`.
- This readme.
- Any docs examples or live sandbox wiring that import `@ariaui-web/separator`, if added later.






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

## Separator Source Test Parity

- Learning sources: `../ariaui/packages/separator/__test__/separator.test.tsx`, `../ariaui/web/doc/src/app/docs/components/separator/page.md`, and `../ariaui/web/doc/src/components/separator/SeparatorDemo.tsx`
- Source test cases: 8
- Native adaptation: `aria-separator` preserves semantic and decorative separator behavior, normalizes orientation, and maps source child composition to `native-composition`.
- Documentation parity: Horizontal and Vertical examples retain the source Tailwind class composition and page structure.
