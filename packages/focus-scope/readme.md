# FocusScope Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/focus-scope`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| FocusScope | `aria-focus-scope` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/focus-scope/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 15 of 15 documented sections are represented after native normalization.
- Requirement lines: 53

### Scope

- This document defines the current contract for `@ariaui-web/focus-scope`.

### Primary References

- APG dialog and composite widget focus guidance: https://www.w3.org/WAI/ARIA/apg/

### Mental Model

- `@ariaui-web/focus-scope` is a focus-management utility for trapping, looping, and restoring focus within a DOM subtree.

### API Surface

- The package exports:
- `FocusScope`
- `useFocusScope`
- Current options:
- `loop?: boolean`
- `trapped?: boolean`
- `restoreFocus?: boolean`
- `initialFocus?: HTMLElement reference | (() => HTMLElement | null)`
- `onMountAutoFocus?: (event: Event) => void`
- `onUnmountAutoFocus?: (event: Event) => void`

### State Contract

- The hook tracks the active container element used for tabbable-candidate discovery.

### Accessibility Model

- This package supports accessible composite behavior by managing keyboard focus boundaries; it does not assign dialog or menu semantics itself.

### Tabbable Element Definition

- A tabbable element is one that:
- Has `tabindex >= 0` (explicitly or implicitly focusable)
- Is visible (not `display: none` or `visibility: hidden`)
- Is not disabled (`disabled` attribute or `aria-disabled="true"`)
- Is not inert (not within an `inert` subtree)
- Includes: `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<audio controls>`, `<video controls>`, elements with `tabindex >= 0`, and `contenteditable` elements
- Tabbable elements are discovered in DOM order, respecting explicit `tabindex` values when present.

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Initial Focus

- When `initialFocus` is provided, the scope attempts to focus that element first
- `initialFocus` must resolve to an element inside the scope that is connected, visible, and enabled
- `onMountAutoFocus` fires before the initial focus move; call `event.preventDefault()` to skip default autofocus
- When mounted, the scope attempts to focus the first tabbable element within the container
- If no tabbable elements exist, the container itself receives focus if it has `tabindex="-1"` or higher
- If the container is not focusable and has no tabbable children, no focus change occurs

### Trapped Mode

- When `trapped` is enabled, both `Tab` and `Shift+Tab` movement is kept within the container
- Attempting to tab beyond the last element moves focus to the first element
- Attempting to shift-tab before the first element moves focus to the last element
- External programmatic focus changes (e.g., `element.focus()`) are not prevented

### Loop Mode

- When `loop` is enabled without `trapped`, tabbing past the last element wraps to the first element within the scope
- Shift-tabbing before the first element wraps to the last element within the scope
- Focus can still leave the scope through external programmatic changes

### Trapped + Loop Interaction

- When both `trapped` and `loop` are enabled, `trapped` takes precedence and both behaviors produce the same result (focus wraps at boundaries)
- When `trapped` is true and `loop` is false, focus still wraps at boundaries (trapped implies looping)

### Focus Restoration

- When `restoreFocus` is enabled, focus returns to the previously focused element on unmount
- `onUnmountAutoFocus` fires before focus is restored; call `event.preventDefault()` to skip restoration
- If the restore target no longer exists in the DOM, is disabled, or is hidden, focus moves to `document.body`
- If no element was focused before mount, no restoration occurs

### Data and ARIA Reflection

- This package does not add custom ARIA or `data-*` state reflection by default.

### Coverage Expectations

- Tests for this package should cover:
- Initial focus placement on first tabbable element
- Initial focus fallback when no tabbable elements exist
- Trapped tab behavior (Tab and Shift+Tab)
- Looping tab behavior at boundaries
- Trapped + loop interaction (both enabled)
- Focus restoration on unmount
- Focus restoration fallback when target is invalid
- External programmatic focus changes are not prevented
- Tabbable element discovery (visible, enabled, correct order)






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
