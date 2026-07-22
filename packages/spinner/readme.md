# Spinner Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/spinner`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-spinner` | status |

## Learned Native Requirements

- Learned from: `../ariaui/packages/spinner/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 18 of 18 documented sections are represented after native normalization.
- Requirement lines: 71

### Scope

- This document defines the loading indicator contract for `@ariaui-web/spinner`.
- It uses the shadcn/ui Spinner component as the structural reference:
- shadcn/ui Spinner: <https://ui.shadcn.com/docs/components/radix/spinner>
- ARIA live regions: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions>
- The package is headless. It provides accessible loading semantics, a minimal inline SVG fallback, and composition support, but no visual styling system.

### Mental Model

- A spinner communicates that work is in progress.
- Use `Root` when the loading state should be announced. Use `aria-hidden` when the spinner is decorative and nearby text already communicates the loading state.

### Public API

- The package exports:
- `Root`
- Associated type exports:
- `RootProps`
- No public hooks or styling helpers are exported.

### Root Contract

- Type:
- Code line: interface RootProps extends native element attributes/properties for "svg" {
- Code line: native composition?: boolean;
- Current behavior:
- renders an `svg` by default
- renders its single child through `native composition host` when `native composition` is true
- forwards a ref to the rendered element
- passes through native SVG attributes/properties, including `className`, `id`, `style`, `title`, `data-*`, and event handlers
- defaults to `role="status"` and `aria-label="Loading"`
- omits default status semantics when `aria-hidden` is true
- renders a built-in `currentColor` spinner glyph when no children are provided
- uses `1em` width and height by default

### Props

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### aria-label

- Default value:
- `"Loading"`
- Current behavior:
- gives the status a readable loading label
- can be overridden for contextual loading states, such as `"Saving"` or `"Loading messages"`

### aria-hidden

- Current behavior:
- when true, default `role` and `aria-label` are omitted
- use this when adjacent text already announces the loading state

### native composition

- Current behavior:
- when omitted or `false`, `Root` renders an `svg`
- when `true`, `Root` renders through `@ariaui-web/slot`
- slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract
- the built-in spinner glyph is not injected into slotted children

### Examples

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Basic

- Code line: import { defineSpinnerElements } from "@ariaui-web/spinner";
- Code line: export function Example() {
- Code line: return <aria-spinner />;

### Custom Label

- Code line: import { defineSpinnerElements } from "@ariaui-web/spinner";
- Code line: export function Example() {
- Code line: return <aria-spinner aria-label="Saving" />;

### Decorative

- Code line: import { defineSpinnerElements } from "@ariaui-web/spinner";
- Code line: export function Example() {
- Code line: return (
- Code line: <button>
- Code line: <aria-spinner aria-hidden />
- Code line: Saving
- Code line: </button>

### Custom SVG With native composition

- Code line: import { defineSpinnerElements } from "@ariaui-web/spinner";
- Code line: export function Example() {
- Code line: return (
- Code line: <aria-spinner native composition aria-label="Loading messages">
- Code line: <svg viewBox="0 0 24 24">
- Code line: <circle cx="12" cy="12" r="9" />
- Code line: </svg>
- Code line: </aria-spinner>

### Accessibility

- `Root` exposes `role="status"` by default so assistive technologies can announce loading state changes politely.
- Use a specific `aria-label` when multiple loading indicators can appear on the same screen. Use `aria-hidden` when the spinner is only visual decoration.

### Data Attributes

- `Root` does not add package-owned data attributes.

### Styling

- The package does not apply layout, color, typography, spacing, or cursor styles.
- The default SVG uses `currentColor`, so consumers can style color with normal CSS. Consumers should provide animation, sizing, and layout classes as needed when using custom slotted children.

### SSR and Hydration

- `Root` is deterministic during server rendering. It does not generate IDs, read layout, or attach effects.
- The package includes `"use client"` so it can be consumed consistently by native Web Component Server Component applications.

### Change Control

- Behavior changes must update:
- Unit tests in `packages/spinner/__test__`.
- This readme.
- Any docs examples or live sandbox wiring that import `@ariaui-web/spinner`, if added later.






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
