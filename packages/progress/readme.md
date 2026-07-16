# Progress Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/progress`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-progress` | `progressbar` |
| Indicator | `aria-progress-indicator` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/progress/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 13 of 13 documented sections are represented after native normalization.
- Requirement lines: 53

### Scope

- This document defines the current contract for `@ariaui-web/progress`.

### Primary References

- APG progressbar pattern: https://www.w3.org/WAI/ARIA/apg/patterns/progressbar/

### Mental Model

- `@ariaui-web/progress` is a composable progress indicator primitive with a root track and an indicator part that visually represents task completion or loading state.

### Part Model

- The package exports:
- `Root` - Container that establishes progress context
- `Indicator` - Visual indicator that reflects current progress

### API Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Code line: interface RootProps extends native element attributes/properties for "div" {
- Code line: children: Node | string;
- Code line: min?: number; // Default: 0
- Code line: max?: number; // Default: 100
- Code line: defaultValue?: number; // Default: 0
- Code line: onValueChange?: (value: number) => void;
- Code line: value?: number; // Controlled value
- Code line: valueText?: string; // Optional human-readable text

### Indicator

- Code line: interface IndicatorProps extends native element attributes/properties for "div" {
- Code line: // Inherits value, min, max from Root via context

### Usage

- Code line: import { defineProgressElements } from "@ariaui-web/progress";
- Code line: <aria-progress aria-label="Upload progress" value={75} max={100}>
- Code line: <aria-progress-indicator />
- Code line: </aria-progress>
- Code line: // Uncontrolled initial value
- Code line: <aria-progress aria-label="Upload progress" defaultValue={25}>
- Code line: // With custom range and text
- Code line: <aria-progress
- Code line: aria-label="Score"
- Code line: min={200}
- Code line: max={800}
- Code line: value={500}
- Code line: valueText="500 out of 800 points"
- Code line: >

### State Contract

- The root coordinates the current progress value reflected by the indicator through native Web Component Context.
- Use `defaultValue` for uncontrolled initial state, or `value` with `onValueChange`
- for controlled state.

### Accessibility Model

- The package exposes `role="progressbar"` semantics with:
- `aria-valuenow`: Current value
- `aria-valuemin`: Minimum value
- `aria-valuemax`: Maximum value
- `aria-valuetext`: Optional human-readable description
- **Note:** Current implementation uses `role="meter"` which should be corrected to `role="progressbar"` for proper progress indication semantics.

### Behavior Contract

- The root defines the progress container and establishes context
- The indicator reflects the current progress visually inside the root
- The indicator automatically calculates percentage based on `(value - min) / (max - min)`
- CSS custom property `--progress-value` is set on the indicator for styling

### Data and ARIA Reflection

- Root reflects `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- Both Root and Indicator expose `data-value`, `data-min`, `data-max` for styling hooks
- Indicator sets `--progress-value` CSS custom property with computed percentage

### Coverage Expectations

- Tests for this package should cover:
- root and indicator composition
- progressbar semantics (role, ARIA attributes)
- current-value reflection (data attributes, CSS custom properties)
- percentage calculation for various ranges
- context propagation from Root to Indicator

## Progress Source Test Parity

- Learned from: `../ariaui/packages/progress/__test__/progress.test.tsx`
- Learned from docs page: `../ariaui/web/doc/src/app/docs/components/progress/page.md`
- Learned from docs examples: `../ariaui/web/doc/src/markdoc/partials/progress/examples.md`
- Source test cases: 24
- Native adaptation: assertions use browser custom elements, string attributes, package-local state, DOM ancestry, and computed inline CSS variables instead of React context/props/refs.
- Native progress tests must cover:
- Root exposes `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and optional `aria-valuetext` while remaining non-interactive
- `default-value` initializes uncontrolled state once while `value` provides controlled-style updates
- Root and Indicator both reflect `data-value`, `data-min`, and `data-max` from package-local state
- standard, custom-range, minimum-boundary, and maximum-boundary percentages match the source behavior
- Indicator computes `--progress-value` and rendered width from the source percentage formula
- Indicator resolves state from the nearest Progress Root through DOM ancestry and throws the source-equivalent orphan error outside one
- authored classes, ids, styles, content, ARIA naming, and DOM events remain on the custom-element hosts
- docs examples include Uncontrolled and Controlled variants with source-equivalent classes and page structure





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- progress source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
