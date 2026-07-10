# Position Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/position`
- Kind: `utility`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/position/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 13 of 13 documented sections are represented after native normalization.
- Requirement lines: 76

### Scope

- This document defines the current contract for `@ariaui-web/position`.

### Primary References

- Floating UI positioning concepts: https://floating-ui.com/

### Mental Model

- `@ariaui-web/position` is a low-level utility for computing floating element coordinates relative to a reference element.

### API Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Exports

- Code line: import { computePosition, autoUpdate, detectOverflow } from "@ariaui-web/position";

### computePosition

- Computes coordinates for positioning a floating element relative to a reference element.
- Code line: function computePosition(
- Code line: reference: Element | { getBoundingClientRect: () => DOMRect } | null,
- Code line: floating: Element,
- Code line: options?: Options,
- Code line: ): Return;
- Code line: type Options = {
- Code line: placement?:
- Table row: "top"
- Table row: "top-start"
- Table row: "top-end"
- Table row: "bottom"
- Table row: "bottom-start"
- Table row: "bottom-end"
- Table row: "left"
- Table row: "left-start"
- Table row: "left-end"
- Table row: "right"
- Table row: "right-start"
- Table row: "right-end"
- Table row: "auto"
- Table row: string;
- Code line: strategy?: "absolute" | "fixed";
- Code line: offset?:
- Table row: number
- Table row: { mainAxis?: number; crossAxis?: number; x?: number; y?: number };
- Code line: boundary?: Element | DOMRect | "viewport";
- Code line: type Return = {
- Code line: x: number;
- Code line: y: number;
- Code line: placement: string;
- Code line: strategy: string;
- Code line: rects: {
- Code line: reference: DOMRect;
- Code line: floating: DOMRect;

### autoUpdate

- Automatically updates floating element position when layout changes occur.
- Code line: function autoUpdate(
- Code line: reference:
- Table row: Element
- Table row: { getBoundingClientRect: () => DOMRect; contextElement?: Element }
- Table row: null,
- Code line: floating: Element | null,
- Code line: update: () => void,
- Code line: hide: () => void,
- Code line: options?: { ancestorScroll?: boolean },
- Code line: ): (() => void) | undefined;
- Returns a cleanup function to remove all listeners.
- `autoUpdate` subscribes to `IntersectionObserver` (when available) so it can re-run `update` when the reference's visibility changes. It does **not** call `hide` when the reference leaves the viewport: floating content stays visible as long as the consumer keeps it mounted/open (hide/unmount remains the consumer's responsibility).

### detectOverflow

- Detects how much an element overflows its boundary.
- Code line: function detectOverflow(
- Code line: element: Element,
- Code line: options?: { boundary?: DOMRect; padding?: number },
- Code line: ): {
- Code line: top: number;
- Code line: bottom: number;
- Code line: left: number;
- Code line: right: number;

### State Contract

- This package does not own UI state. It computes coordinates from inputs supplied by consumers.

### Accessibility Model

- This package does not add semantics itself. Accessibility remains the responsibility of consumers that use the resulting coordinates.

### Behavior Contract

- positioning supports placement, strategy, offset, and boundary configuration
- overflow detection is exposed as a reusable utility
- automatic update helpers keep floating coordinates synchronized with layout changes
- coordinates are rounded to device pixel ratio for sub-pixel rendering accuracy
- flipping behavior automatically adjusts placement when floating element doesn't fit
- `boundary: 'viewport'` ignores overflow ancestors and checks placement against the visible viewport

### Data and ARIA Reflection

- This package does not reflect state through ARIA or `data-*` attributes.

### Coverage Expectations

- Tests for this package should cover:
- coordinate computation for supported placements
- offset handling
- overflow detection
- auto-update behavior during layout changes

## Position Source Test Parity

- Learned from: `../ariaui/packages/position/__test__/position.test.ts`
- Learned from hook integration: `../ariaui/packages/position/__test__/position.test.tsx`
- Learned from docs: `../ariaui/web/doc/src/markdoc/partials/position/examples/default.md`
- Source test cases: 63
- Native adaptation: assertions use browser-native utility calls, DOM observers, inline style effects, and static docs markup instead of framework hooks.
- Native position tests must cover:
- computePosition supports top, bottom, left, right, start/end alignments, numeric offsets, axis offsets, direct x/y offsets, absolute and fixed strategies, and virtual references
- computePosition flips to the opposite side when the floating element overflows the main axis, preserving symmetric direct x/y gaps when flipped
- detectOverflow measures overflow against clipping boundaries with optional padding
- DOM helpers expose window, document, DPR rounding, node guards, overflow ancestors, clipping rects, fit checks, and placement coordinate helpers
- autoUpdate watches scroll, resize, ResizeObserver, MutationObserver, and IntersectionObserver signals, schedules updates with requestAnimationFrame, and disconnects all observers on cleanup
- floating effects measure display:none elements without permanently changing display or visibility and write left, top, position, and data-side to the floating element
- pre-position helpers expose hidden-before-positioned visibility styles without requiring framework hooks
- docs examples include the source Position utility live example with Reference copy, Get Position trigger, and Floating element panel





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- position source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
