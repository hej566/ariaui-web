# Badge Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/badge`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-badge` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/badge/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 16 of 16 documented sections are represented after native normalization.
- Requirement lines: 96

### Scope

- This document describes the current behavior of `@ariaui-web/badge` as implemented in this package, with accessibility guidance informed by:
- WAI-ARIA APG patterns index and naming guidance
- Radix UI's public badge guidance
- There is no dedicated APG badge pattern. This spec therefore records the package's actual contract and the accessibility constraints that follow from using a badge as static, inline content.

### External Reference Mapping

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### APG

- APG does not define a standalone badge pattern.
- Generic badge content should not be given widget-like keyboard or focus behavior unless it actually acts like an interactive control.
- Accessible naming should be used only when the badge needs a specific programmatic label; otherwise plain text content is usually sufficient.

### Radix UI

- Radix does not provide a badge primitive with interaction semantics comparable to menu, tabs, or dialog primitives.
- The official Radix badge guidance treats badge content as a presentational inline label, typically rendered as a non-interactive text container.
- This package follows that direction by exposing a single unstyled root part with no built-in behavior.

### Mental Model

- `@ariaui-web/badge` is a minimal wrapper primitive for rendering badge-like content.
- It is:
- non-interactive by default
- unstyled by default
- layout-agnostic
- semantics-light unless the consumer adds semantics explicitly
- It is not:
- a button
- a toggle
- a status/live-region primitive
- a dismissible chip primitive

### Public API

- The package exports:
- `Root`
- Associated type export:
- `RootTypes`
- No additional parts, hooks, context, data attributes, or state helpers are exported.

### Root Contract

- `Root` renders a plain `div`.
- Type:
- Code line: type RootTypes = native element attributes/properties for "div";
- Implementation:
- Code line: export function Root(attributes/properties: RootTypes) {
- Code line: return <div {...attributes/properties} />;

### Default behavior

- renders a `div`
- forwards all attributes/properties directly to that `div`
- applies no default role
- applies no default ARIA attributes
- applies no default classes, styles, or data attributes
- renders children exactly as provided

### Consumer override behavior

- Because attributes/properties are forwarded directly:
- `className`, `style`, `id`, `title`, `data-*`, `aria-*`, and event handlers are passed through unchanged
- consumers may make the badge interactive by passing interactive attributes/properties, but that behavior is consumer-owned and not normalized by the package
- consumers may assign roles manually, though the package does not recommend widget roles for static badge content

### Accessibility Contract

- The current package provides no built-in accessibility semantics beyond rendering standard DOM content.
- Current implications:
- a plain text badge is exposed as ordinary text inside a `div`
- there is no default accessible name separate from the badge text itself
- there is no default keyboard interaction
- there is no default focusability
- there is no live-region behavior
- Recommended usage based on APG guidance:
- use badge text content directly when the badge is just a visual label such as "Beta", "New", or "Paid"
- do not add ARIA roles unless the badge actually represents a distinct semantic concept that requires one
- do not make the badge keyboard-focusable unless it truly behaves as an interactive element
- if a badge contains an actual interactive control, that control must carry its own semantics
- Non-goals of the current implementation:
- announcing status changes
- representing selection state
- managing pressed/checked/expanded state
- exposing dismiss/remove affordances

### Styling Contract

- This package is intentionally unstyled.
- Current behavior:
- no default size, shape, padding, colors, borders, or typography
- no inline styles
- no CSS classes
- no variant system
- Consumers are responsible for all visual styling, including whether the badge should appear inline, inline-flex, block, rounded, outlined, or themed.

### Interaction Contract

- The package has no internal interaction model.
- Current behavior:
- no keyboard handling
- no pointer handling
- no controlled or uncontrolled state
- no focus management
- no dismissal behavior
- If a consumer adds click handlers or embeds buttons/icons, those interactions are entirely consumer-defined and outside this package's contract.

### Data Attribute Contract

- The package exposes no built-in data attributes:
- no `data-state`
- no `data-disabled`
- no `data-variant`
- no `data-slot`
- Any data attributes on the rendered element come directly from consumer attributes/properties.

### SSR And Runtime Constraints

- The entry file is marked `"use client"`, but the current component itself has no browser-only logic.
- Current implications:
- the package is intended for client-side native Web Component usage within this repo's conventions
- `Root` does not depend on DOM measurement, effects, or browser APIs
- rendering is effectively deterministic because the component is just a attributes/properties-forwarding wrapper

### Coverage Expectations

- Tests under `packages/badge/__test__` currently cover:
- Rendering the badge test fixture.
- Basic accessibility via `axe`.
- A consumer-supplied labeled control nested inside the badge fixture.
- Important gap:
- the current tests do not yet verify the actual root contract directly, such as plain attributes/properties forwarding, absence of default ARIA, or absence of built-in interaction semantics.

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests for this package.
- Docs examples and visual interaction tests when present.






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
