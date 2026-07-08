# Arrow Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/arrow`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-arrow` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/arrow/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 12 of 12 documented sections are represented after native normalization.
- Requirement lines: 107

### Scope

- This document describes the current behavior of `@ariaui-web/arrow` as implemented in this package.
- Primary references:
- Floating UI placement terminology
- Radix UI arrow primitive conventions
- This package is a presentational primitive. There is no direct APG pattern for an arrow element, so this spec records the implemented package contract rather than a normative accessibility pattern.

### Mental Model

- `@ariaui-web/arrow` renders a small CSS triangle that visually connects a floating surface to its reference element.
- The package is intentionally narrow in scope:
- it does not position the floating surface itself
- it does not measure collisions or offsets
- it does not manage ARIA, focus, or interactions
- it only derives arrow orientation and edge positioning from a placement string

### Public API

- The package currently exposes:
- `Root`
- `getSide`
- `isVerticalSide`
- `Placement` type
- `Side` type
- No additional subparts or aliases are defined.

### Root Contract

- `Root` renders a single `div`.
- Props:
- `placement: Placement | string` is required
- `width?: number` defaults to `10`
- `height?: number` defaults to `5`
- `floatingDiv?: HTMLDivElement | null` optionally provides the element whose computed `background-color` should be used for the arrow fill
- all other `div` attributes/properties are forwarded to the rendered element
- Observable behavior:
- the rendered element is absolutely positioned
- `pointer-events` is always set to `none`
- arrow geometry is built with transparent CSS borders plus one colored border
- `className`, `style`, `data-*`, and other standard `div` attributes/properties are forwarded
- consumer `style` is merged after internal style and can override internal declarations if needed

### Placement Contract

- `placement` may be one of the exported `Placement` union values:
- `top`
- `top-start`
- `top-end`
- `bottom`
- `bottom-start`
- `bottom-end`
- `left`
- `left-start`
- `left-end`
- `right`
- `right-start`
- `right-end`
- The current implementation also accepts any string and derives the side by splitting on `-` and taking the first segment.
- Implications of the current implementation:
- alignment suffixes such as `-start` and `-end` do not change arrow alignment
- `"top-start"` and `"top-end"` render identically to `"top"`
- invalid strings are not runtime-validated
- unknown side values fall through to the `"right"` positioning branch because the implementation treats any non-top/non-bottom/non-left value as the final case

### Geometry And Positioning

- The arrow uses the derived side to determine both triangle orientation and placement relative to the floating surface.
- For vertical sides:
- `top` and `bottom` use `border-left` and `border-right` with transparent halves based on `width / 2`
- `top` uses `border-top: {height}px solid {color}`
- `bottom` uses `border-bottom: {height}px solid {color}`
- For horizontal sides:
- `left` and `right` use `border-top` and `border-bottom` with transparent halves based on `width / 2`
- `left` uses `border-left: {height}px solid {color}`
- `right` uses `border-right: {height}px solid {color}`
- Positioning rules:
- `top` places the arrow below the floating surface with `bottom: -{height}px`, `left: 50%`, and `translateX(-50%)`
- `bottom` places the arrow above the floating surface with `top: -{height}px`, `left: 50%`, and `translateX(-50%)`
- `left` places the arrow to the right of the floating surface with `right: -{width}px`, `top: 50%`, and `translateY(-50%)`
- `right` places the arrow to the left of the floating surface with `left: -{width}px`, `top: 50%`, and `translateY(-50%)`

### Color Contract

- Color resolution works as follows:
- if `floatingDiv` is provided, the arrow reads `window.getComputedStyle(floatingDiv).backgroundColor`
- otherwise the colored border uses `currentColor`
- Current limitations:
- color inheritance only reads `background-color`
- it does not read gradients, border colors, or CSS custom properties directly
- because color is read during render, this package is client-only

### Utility Contract

- `getSide(placement)`:
- accepts `Placement | string`
- returns the substring before the first `-` cast as `Side`
- `isVerticalSide(side)`:
- returns `true` for `top` and `bottom`
- returns `false` for `left` and `right`

### Accessibility Contract

- This package has no built-in accessibility semantics beyond what consumers pass through.
- Current behavior:
- no ARIA role is applied by default
- no keyboard behavior is implemented
- no focus management is implemented
- the arrow is effectively non-interactive because `pointer-events: none` is always applied
- Consumers are responsible for ensuring the surrounding floating UI has the correct semantics.

### SSR And Runtime Constraints

- The module is marked `"use client"`.
- Current implications:
- `Root` reads from `window.getComputedStyle` during render when `floatingDiv` is provided
- the package is intended for client-rendered usage
- there is no SSR-specific fallback beyond the default `currentColor` branch when `floatingDiv` is omitted

### Coverage Expectations

- Tests under `packages/arrow/__test__` currently cover:
- Rendering a single arrow element.
- Side extraction from simple placements.
- Side extraction from alignment-qualified placements.
- `Placement` union compatibility in utility tests.
- `isVerticalSide` behavior for vertical and horizontal sides.
- Edge positioning for `top`, `bottom`, `left`, and `right`.
- Forwarding of `className`.
- Merging of inline `style`.
- Not currently covered:
- default `width` and `height`
- `floatingDiv` color inheritance
- invalid placement strings
- exact border geometry values

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
