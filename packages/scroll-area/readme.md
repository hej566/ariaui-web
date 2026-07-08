# ScrollArea Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/scroll-area`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-scroll-area` | none |
| Corner | `aria-scroll-area-corner` | none |
| Scrollbar | `aria-scroll-area-scrollbar` | `scrollbar` |
| ScrollDownButton | `aria-scroll-area-scroll-down-button` | none |
| ScrollUpButton | `aria-scroll-area-scroll-up-button` | none |
| Thumb | `aria-scroll-area-thumb` | `presentation` |
| Viewport | `aria-scroll-area-viewport` | `group` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/scroll-area/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 87

### @ariaui-web/scroll-area

- Headless Web Component scroll area primitives aligned to the Radix UI Scroll Area anatomy while preserving native browser scrolling.

### Installation

- Code line: npm install @ariaui-web/scroll-area

### Reference

- This package is informed by Radix UI Scroll Area:
- https://www.radix-ui.com/primitives/docs/components/scroll-area

### Supported Public API

- Supported parts:
- `Root`
- `Viewport`
- `ScrollUpButton`
- `ScrollDownButton`
- `Scrollbar`
- `Thumb`
- `Corner`
- Supported `Root` attributes/properties:
- `type?: "auto" | "always" | "scroll" | "hover" | "never"`
- Supported `Viewport` attributes/properties:
- `native composition?: boolean` - slots viewport attributes/properties onto a single child element, such as `motion.div`, instead of rendering a `<div>`.
- `maxVisibleItems?: number` - caps vertical height to `(first direct child height) * maxVisibleItems` and scrolls overflowing content.
- `anchorSelected?: boolean` - centers the selected descendant (`aria-selected="true"` or `data-state="checked"`) in the viewport after layout.
- Supported functions:
- `anchorSelectedItem(viewport: HTMLElement | null): boolean` - centers the selected descendant in a viewport and returns whether a selected item was found.
- Supported `ScrollUpButton` and `ScrollDownButton` attributes/properties:
- `behavior?: ScrollBehavior` - scroll behavior passed to `Element.scrollBy`. Defaults to `"smooth"`.
- Supported `Scrollbar` attributes/properties:
- `orientation?: "vertical" | "horizontal"`
- `type="auto"`, `"always"`, `"scroll"`, and `"hover"` keep compatibility scrollbar parts mounted with `data-state="visible"`. Native browser scrollbars provide the actual scroll UI.
- `type="never"` fully unmounts the scrollbar and is an AriaUI extension for explicitly suppressing custom scrollbar parts.

### Basic Example

- Code line: import { defineScrollAreaElements } from "@ariaui-web/scroll-area";
- Code line: export function Example() {
- Code line: return (
- Code line: <aria-scroll-area className="relative h-72 w-48 overflow-hidden">
- Code line: <aria-scroll-area-viewport
- Code line: className="h-full w-full"
- Code line: style={{
- Code line: overflowX: "hidden",
- Code line: overflowY: "scroll",
- Code line: scrollbarColor:
- Code line: "color-mix(in oklab, var(--muted-foreground) 45%, transparent) transparent",
- Code line: scrollbarGutter: "stable",
- Code line: scrollbarWidth: "thin",
- Code line: >
- Code line: <div className="space-y-3 p-4">
- Code line: {Array.from({ length: 24 }, (_, index) => (
- Code line: <div key={index}>Item {index + 1}</div>
- Code line: </div>
- Code line: </aria-scroll-area-viewport>
- Code line: </aria-scroll-area>

### Scroll Buttons Example

- Code line: import { defineScrollAreaElements } from "@ariaui-web/scroll-area";
- Code line: export function Example() {
- Code line: return (
- Code line: <aria-scroll-area className="relative h-72 w-56 overflow-hidden">
- Code line: <aria-scroll-area-scroll-up-button>Scroll up</aria-scroll-area-scroll-up-button>
- Code line: <aria-scroll-area-viewport anchorSelected className="h-56 w-full">
- Code line: {Array.from({ length: 24 }, (_, index) => (
- Code line: <div key={index} aria-selected={index === 12}>
- Code line: Item {index + 1}
- Code line: </div>
- Code line: </aria-scroll-area-viewport>
- Code line: <aria-scroll-area-scroll-down-button>Scroll down</aria-scroll-area-scroll-down-button>
- Code line: </aria-scroll-area>

### Behavior

- `Root` renders a relative overflow-hidden shell and owns scroll area configuration.
- `Viewport` renders the scrollable element and uses native `overflow-x: auto` and `overflow-y: auto`. Use `native composition` to slot those viewport attributes/properties onto a Framer Motion element or another custom component.
- `Viewport` accepts `maxVisibleItems` to cap vertical height from the first direct child row height while preserving native scrolling.
- `Viewport` accepts `anchorSelected` to center a descendant with `aria-selected="true"` or `data-state="checked"` after layout.
- `anchorSelectedItem` is available for imperative anchoring when consumers need to run the same centering behavior manually.
- `ScrollUpButton` and `ScrollDownButton` scroll the registered viewport by two measured first-child rows, falling back to 32 pixels when no row can be measured.
- `Scrollbar` renders vertical by default and exposes `data-orientation` plus `data-state` for compatibility. It does not measure overflow or track viewport scroll position.
- `Thumb` exposes the current scrollbar `data-state` for compatibility. It does not size from content ratio and does not implement drag behavior.
- `Corner` renders the area where vertical and horizontal scrollbars meet.
- Horizontal scrolling is native browser behavior, including RTL behavior.
- `type="auto"` keeps compatibility scrollbar parts mounted with `data-state="visible"`.
- `type="never"` hides scrollbars by unmounting the compatibility scrollbar part.

### Data Attribute Contract

- Table row: Part | Attributes
- Table row: `Viewport` | `data-ariaui-scroll-area-viewport="true"`
- Table row: `ScrollUpButton` | `data-direction="up"`
- Table row: `ScrollDownButton` | `data-direction="down"`
- Table row: `Scrollbar` | `data-orientation="vertical" \ | "horizontal"`, `data-state="visible"`
- Table row: `Thumb` | `data-state="visible"`

### Accessibility Model

- The package does not add a role or keyboard model of its own. Scrolling remains native browser behavior, so consumers should add accessible names, landmarks, or labels only when the surrounding product UI requires them.

### Out Of Scope

- The current contract does not include:
- hover or scroll timers for automatic visibility changes
- CSS injection to hide native scrollbars
- custom scrollbar measurement or thumb dragging
- imperative viewport refs

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests in `packages/scroll-area/__test__`.
- Doc site examples when present.






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
