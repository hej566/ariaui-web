# Button Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/button`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-button` | `button` |
| Group | `aria-button-group` | `group` |
| Item | `aria-button-item` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/button/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 25 of 25 documented sections are represented after native normalization.
- Requirement lines: 204

### Scope

- This document defines the button contract for `@ariaui-web/button`.
- It uses:
- WAI-ARIA APG button guidance as the accessibility baseline
- Radix and shadcn button conventions as the higher-level structural reference
- This file also records where the current package implementation differs from that fuller model.

### Primary References

- APG button pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/button/>
- Radix UI Themes button docs: <https://www.radix-ui.com/themes/docs/components/button>
- shadcn/ui button docs: <https://ui.shadcn.com/docs/components/button>

### Mental Model

- A button is an action-triggering control.
- The fuller Radix/shadcn-style model typically includes:
- a root control and structural grouping primitives
- native button semantics by default
- support for link-like rendering where appropriate
- optional styling variants and sizes
- composition patterns for icons and loading states
- This package exposes a standalone root button, a group provider, and a grouped child primitive. It focuses on accessibility and `native composition` composition behavior, not styling systems.

### Public API

- The package exports:
- `Root`
- `Group`
- `Item`
- Associated type export:
- `RootTypes`
- `GroupProps`
- `ItemProps`
- No additional public hooks, variant helpers, or data-attribute abstractions are exported.
- The package may depend on shared internal helpers from `@ariaui-web/utils`.

### APG-Aligned Accessibility Model

- APG guidance for buttons establishes the core behavior:
- native `<button>` semantics are preferred when possible
- buttons activate with keyboard interaction
- `Enter` and `Space` should activate button-like controls
- disabled controls must not activate
- Implications for this package:
- native button rendering should preserve native semantics
- non-native button-like renderings must supply role and keyboard activation behavior
- disabled behavior must prevent activation for both native and non-native forms

### Radix/shadcn-Aligned Structural Model

- Radix and shadcn button APIs treat button as a single root control that can appear in several rendering contexts.
- Common expectations from that model:
- root-level composition
- native button default
- anchor usage when the control is really navigation
- style variants and size tokens in consumer-facing APIs
- This package only partially follows that model:
- it provides a composable `Root` with `native composition`
- it provides a context-backed `Group` container for related buttons
- it provides a grouped `Item` primitive for buttons rendered inside a group
- it supports anchor and custom-element rendering through `native composition`
- it does not provide built-in visual variants or size APIs

### Root Contract

- Type:
- Code line: type RootTypes = Omit<
- Code line: native element attributes/properties for "button",
- Code line: "as" | "disabled"
- Code line: > & {
- Code line: native composition?: boolean;
- Code line: disabled?: boolean;
- Code line: type?: "button" | "submit" | "reset";
- Current behavior:
- `Root` renders a native `button` by default
- `Root` renders its single child through `native composition host` when `native composition` is true
- default rendering is a native `<button>`
- forwards a ref to the rendered element
- defaults native button `type` to `"button"`

### Native button behavior

- When `native composition` is omitted:
- renders a native `<button>`
- applies `type`
- applies `disabled` when `disabled` is true
- reflects `data-disabled=""` when disabled
- does not apply an explicit `role`
- does not apply custom `tabIndex`

### Native anchor behavior

- When `native composition` is true and the child is an `<a>` with `href`:
- renders a native `<a>`
- preserves link semantics
- does not add `role="button"`
- does not add `tabIndex`
- applies `aria-disabled="true"` when `disabled` is true
- reflects `data-disabled=""` when disabled
- prevents click activation in the internal click handler when disabled
- removes `href` when `disabled` is true so the element no longer exposes native link activation

### Non-native custom element behavior

- When `native composition` is true and the child is neither a native button nor a native link with `href`:
- renders the provided child element
- applies `role="button"`
- applies `tabIndex={0}` when not disabled
- wires keyboard activation behavior for `Enter` and `Space`
- applies `data-disabled=""` when disabled
- does not set `tabIndex` when disabled

### Group Contract

- Type:
- Code line: type GroupProps = native element attributes/properties for "div";
- Current behavior:
- `Group` renders a `div`
- defaults to `role="group"`
- forwards all other `div` attributes/properties
- spreads consumer attributes/properties after the default role, so callers may override `role`
- provides context for descendant `Item` registration
- does not clone child buttons
- does not provide built-in layout classes, seam/radius class injection, roving-focus, or pressed-state behavior

### Item Contract

- Type:
- Code line: type ItemProps = RootTypes;
- Current behavior:
- `Item` must be rendered within `Group`
- rendering `Item` outside `Group` throws a runtime error
- `Item` reuses the same `native composition` composition and disabled behavior as `Root`
- `Item` registers with the nearest `Group` and derives grouped position from the current ordered item list
- `Item` reflects grouped position via `data-position`
- Supported values:
- `data-position="only"`
- `data-position="first"`
- `data-position="middle"`
- `data-position="last"`
- The package does not provide built-in classes for these positions. Consumers style grouped seams and radii using the reflected data attributes.

### Event Contract

- The component composes internal and consumer behavior.

### onKeyDown

- Current behavior:
- consumer `onKeyDown` runs first
- if it calls `event.preventDefault()`, internal activation logic does not run
- for non-native interactive renderings, `Enter` triggers `click()` on keydown
- for non-native interactive renderings, `Space` prevents scroll on keydown and triggers `click()` on keyup
- for native button and native link renderings, keyboard behavior is left to the browser

### onClick

- Current behavior:
- if `disabled` is true, internal click handling prevents default and stops propagation
- when disabled, consumer `onClick` is not called
- when enabled, consumer `onClick` is called normally

### Disabled-State Contract

- Current behavior depends on the rendered element type.

### Native button

- uses the native `disabled` attribute
- reflects `data-disabled=""` when disabled
- native disabled behavior prevents activation and focus by default

### Anchor and custom elements

- uses `aria-disabled="true"` for non-native disabled semantics
- reflects `data-disabled=""` when disabled
- click activation is prevented internally
- keyboard activation logic does not run for disabled non-native controls
- disabled anchors remove `href` so they no longer expose native link activation

### Styling Contract

- This package is intentionally unstyled.
- Current behavior:
- no default classes
- no variants
- no size tokens
- no loading state API
- no icon slots
- no `data-state`
- no `data-variant`
- no `data-size`
- exposes `data-disabled` when disabled
- `Item` exposes `data-position` for grouped layout styling
- Consumers are responsible for:
- visual styling
- grouped layout styling
- grouped seam/radius styling using `data-position`
- icon layout
- variant systems
- loading indicators
- dark-mode treatment

### Keyboard Contract

- APG-aligned expectations:
- native buttons follow native browser behavior
- button-like custom elements should activate on `Enter` and `Space`
- Current implementation:
- native button: browser behavior
- native link: browser behavior
- custom non-native root: `Enter` calls `click()` on keydown
- custom non-native root: `Space` calls `click()` on keyup
- `Space` is prevented from scrolling the page on custom button-like elements

### Pointer Contract

- Current behavior:
- pointer activation is standard browser behavior when enabled
- disabled controls suppress activation in the internal click handler
- no pressed/toggled state is managed internally

### Data Attributes And State Reflection

- Unlike many Radix/shadcn-style button implementations, this package currently exposes:
- no `data-state`
- no `data-variant`
- no `data-size`
- `data-disabled` when disabled
- `Item` does expose `data-position` for grouped layout styling
- Any `data-*` attributes must be supplied by consumers.

### Current Package Differences From Fuller Radix/shadcn-style Model

- Compared with a fuller Radix/shadcn-style button abstraction, this package currently does not provide:
- visual variants such as `default`, `secondary`, `outline`, `ghost`, or `link`
- size variants such as `sm`, `lg`, or `icon`
- built-in icon slots
- built-in seam/radius class composition for groups
- loading or pending state APIs
- data attributes for styling state
- Notable implementation choices:
- composition is handled through `native composition`, not `as`
- grouping is exposed as a context-backed compound API through `Group` and `Item`
- disabled anchor handling uses `aria-disabled` plus event prevention
- disabled renderings expose `data-disabled`
- custom non-native elements receive manual role/tabIndex/keyboard activation support
- grouped position is exposed through `data-position`, not default classes

### Coverage Expectations

- Tests under `packages/button/__test__` currently cover:
- Rendering the button fixture.
- Basic accessibility via `axe`.
- Click and keydown handler behavior for the default native button case.
- Native button default `type="button"`.
- Native anchor rendering with `native composition` and `href`.
- Disabled native button behavior.
- Disabled button and anchor semantics, including `data-disabled`.
- `Group` default `role="group"` behavior.
- `Group` role override and attributes/properties forwarding.
- `Item` runtime error outside a group.
- `Item` position reflection for only/first/middle/last.
- `Item` preserves `Root` button, anchor, custom-element, and disabled semantics within a group.
- Build-time type coverage should also verify:
- valid native button attributes/properties such as `type`
- valid `native composition` anchor and custom child compositions
- rejected `as` usage with `@ts-expect-error`
- Additional aria-focused tests may cover related accessibility behavior separately.

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
