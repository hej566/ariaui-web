# AspectRatio Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/aspect-ratio`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-aspect-ratio` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/aspect-ratio/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 13 of 13 documented sections are represented after native normalization.
- Requirement lines: 56

### Scope

- This document describes the current behavior of `@ariaui-web/aspect-ratio`, with API design informed by:
- Radix UI AspectRatio primitive: https://www.radix-ui.com/primitives/docs/components/aspect-ratio
- HTML/CSS intrinsic sizing patterns
- There is no dedicated WAI-ARIA APG pattern for aspect ratio. This spec records the package's layout contract and the accessibility constraints that follow from wrapping media content.

### Mental Model

- `@ariaui-web/aspect-ratio` is a pure layout primitive. It constrains a content container to a given width-to-height ratio. The outer element uses the padding-bottom trick to establish the intrinsic ratio; an absolutely-positioned inner element fills the space so children render at full dimensions.
- It is:
- a layout utility only
- unstyled and headless
- compatible with any child content (images, video, iframes, maps, etc.)
- It is not:
- interactive
- a semantic container
- responsible for the accessibility of its children

### Part Model

- Table row: Part | Element | Role | Notes
- Table row: _(wrapper)_ | `<div>` | - | Private sizing shell; sets `paddingBottom` to enforce ratio
- Table row: `Root` | `<div>` or custom element via `native composition` | - | Public fill layer; receives attributes/properties and forwarded ref

### Public API

- The package exports:
- `Root` (`forwardRef` HTMLDivElement)
- `resolveAspectRatio` - pure helper that normalizes the `ratio` attributes/properties (exported for tests and advanced use)
- Associated type export:
- `RootTypes`

### Root Contract

- `Root` renders a private wrapper `<div>` with inline `position: relative`, `width: 100%`, and a computed `paddingBottom` that enforces the ratio. Public attributes/properties and the forwarded `ref` are applied to the absolutely-positioned fill element inside that wrapper.
- Type:
- Code line: interface RootTypes extends native element attributes/properties for "div" {
- Code line: ratio?: number | string; // default: 1
- Code line: native composition?: boolean; // default: false

### Props

- Table row: Prop | Type | Default | Description
- Table row: `ratio` | `number \ | string` | `1` | Width/height (width per unit height). See **Ratio strings** below. Non-finite or <=0 numbers, and unparseable strings, resolve to **1** (square).
- Table row: `native composition` | `boolean` | `false` | native composition host the fill element attributes/properties onto a single child element while preserving the private ratio wrapper.
- Table row: `style` | `CSS properties` | - | Applied to the public fill element. Structural fill styles (`position: absolute`, `inset: 0`) win on duplicate keys.
- Table row: `...rest` | `native element attributes/properties for "div"` | - | All standard div attributes/properties forwarded to the public fill element.

### Ratio strings

- After `trim()`, strings are parsed in order:
- **`w / h`** - slash form, optional spaces (e.g. `"16 / 9"`, `"16/9"`). Both parts must be positive finite numbers and `h > 0`.
- **`w : h`** - colon form (e.g. `"16:9"`, `"4 : 3"`).
- **Single decimal** - entire string matches one positive number (e.g. `"1.777"`, `"2"`).
- Anything else (including `"16:9 extra"`, `"foo"`, `"16/9/2"`) resolves to ratio **1**.

### resolveAspectRatio

- `resolveAspectRatio(ratio)` returns the same normalized positive finite number used internally. Useful in unit tests or when mirroring layout math outside the component.

### Ratio to paddingBottom formula

- Code line: paddingBottom = (1 / ratio) * 100 + "%"
- Examples:
- `ratio={16/9}` -> `paddingBottom: 56.25%`
- `ratio={4/3}` -> `paddingBottom: 75%`
- `ratio={1}` -> `paddingBottom: 100%`

### Accessibility Model

- This component has no ARIA role, keyboard behavior, or focus management of its own. All accessibility responsibility lies with the content placed inside it:
- `<img>` children must have a descriptive `alt` attribute.
- `<video>` children should carry `title` or `aria-label`.
- `<iframe>` children should carry `title`.
- The outer and inner `<div>` elements have no semantic role and are transparent to assistive technology.

### Data Attribute Contract

- No built-in data attributes are applied:
- no `data-state`
- no `data-ratio`
- no `data-slot`

### SSR Constraints

- The entry file is marked `"use client"` per repo convention. The component has no browser-only APIs and renders deterministically - it is safe for SSR when that convention is lifted.

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests in `packages/aspect-ratio/__test__`.
- Doc site examples when present.

## Aspect Ratio Source Test Parity

- Learned from: `../ariaui/packages/aspect-ratio/__test__/aspect-ratio.test.tsx`
- Source test cases: 27
- Native adaptation: assertions use browser-native custom elements, inline ratio-shell styles, DOM child movement, and native media markup instead of framework rendering helpers.
- Native aspect-ratio tests must cover:
- `resolveAspectRatio` normalizes undefined, numeric, slash, colon, decimal, and invalid ratios
- Root constrains children with a private ratio shell and absolutely positioned fill layer
- consumer styles cannot override structural ratio shell or fill positioning
- native composition uses the first child element as the fill host while preserving the ratio shell
- Root has no default ARIA role, keyboard behavior, focus management, `data-state`, `data-ratio`, or `data-slot`
- media examples keep descriptive image alt text





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- aspect-ratio source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
