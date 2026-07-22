# Tabs Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/tabs`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-tabs` | none |
| Content | `aria-tabs-content` | none |
| List | `aria-tabs-list` | `tablist` |
| Panel | `aria-tabs-panel` | none |
| Trigger | `aria-tabs-trigger` | `tab` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/tabs/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 13 of 13 documented sections are represented after native normalization.
- Requirement lines: 85

### Scope

- Normative behavior and API contract for `@ariaui-web/tabs`.
- This package follows the WAI-ARIA APG tabs pattern as the accessibility baseline and documents the current implementation shape exported by this package.
- Source references:
- APG tabs pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- This package currently exposes:
- `Root`
- `List`
- `Trigger`
- `Panel`
- `Content`

### Structure and Roles

- `Root` is structural state/context and does not itself define tab, tablist, or tabpanel semantics.
- `List` renders the tablist container with `role="tablist"` and does not rewrite or clone its children.
- `Trigger` renders `role="tab"` and:
- registers itself with `Root` context so trigger order is derived from the rendered trigger set
- sets a generated `id`
- sets `aria-controls` to the associated panel id
- sets `aria-selected`
- sets roving `tabIndex`
- `Panel` coordinates tabpanel semantics for its ordered `Content` children and:
- applies `role="tabpanel"` to each Content element or its native-composition child
- sets each panel `id` to match its associated trigger's `aria-controls`
- sets each panel `aria-labelledby` to the associated trigger id
- hides inactive panels with the `hidden` attribute
- `Content` is the native tabpanel host and receives its coordinated semantics from `Panel`.

### Composition Contract

- `Root`, `List`, `Trigger`, and `Content` support `native composition`.
- When `native composition` is true, the part slots its attributes/properties and ref onto a single child element through `@ariaui-web/slot`.
- Use `native composition` with Framer Motion elements such as `motion.div` or `motion.button` when the rendered element needs to own animation attributes/properties.
- `Panel` remains the public part that owns and coordinates tabpanel semantics.

### Focus Model

- Roving focus is implemented across `Trigger` elements.
- The active trigger has `tabIndex=0`; inactive triggers have `tabIndex=-1`.
- Arrow-key focus movement also updates the active tab value.
- `Home` moves focus and selection to the first tab.
- `End` moves focus and selection to the last tab.

### Selection Contract

- `Root` supports uncontrolled and controlled selection.
- `defaultValue` sets the initial active tab when uncontrolled.
- `defaultValue` and `value` are string keys.
- Each `Trigger` and `Content` must receive a matching string `value`.
- `value` controls the active tab value when provided.
- `onValueChange` is called with the next active tab value when selection changes.
- Clicking a trigger updates the active tab value.
- Arrow-key, `Home`, and `End` navigation also update the active tab value.

### Keyboard Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Trigger

- `ArrowRight` moves to the next tab and wraps.
- `ArrowLeft` moves to the previous tab and wraps.
- `Home` moves to the first tab.
- `End` moves to the last tab.
- Current implementation notes:
- Keyboard handling is attached to `Trigger`.
- `Trigger` key handlers call `preventDefault()` and `stopPropagation()` for the supported navigation keys.
- Horizontal orientation uses `ArrowRight` and `ArrowLeft`; vertical orientation uses `ArrowDown` and `ArrowUp`.

### Pointer Contract

- Clicking a `Trigger` activates its associated tab.
- Trigger click handling calls `preventDefault()` and `stopPropagation()` before updating the active value.
- No other pointer behaviors are implemented by the package.

### State and Data Expectations

- `Root` coordinates:
- active string value
- generated `tabIds`
- generated `tabpanelIds`
- the ordered registered trigger element list used for focus movement and id coordination
- The active trigger must expose `aria-selected="true"` and `tabIndex={0}`.
- Inactive triggers must expose `aria-selected="false"` and `tabIndex={-1}`.
- Trigger and panel ids must remain coordinated through `aria-controls` and `aria-labelledby`.
- `Panel` keeps a generated tabpanel id available for each trigger.
- Only the active `Content` is visible; inactive Content elements remain hidden.

### Consumer Handler Contract

- Consumer attributes/properties are forwarded to the rendered elements.
- Internal click and keyboard behavior remain authoritative because `Trigger` installs its own handlers directly.
- The package does not currently document a prevent-default escape hatch for overriding internal selection or navigation behavior.

### APG Mapping Notes

- APG supplies the normative keyboard and ARIA semantics for tabs.
- This package currently uses automatic activation: moving focus with supported navigation keys also changes the active panel.
- `Panel` is the public part that owns tabpanel coordination; each `Content` is its native tabpanel host.

### Coverage Expectations

- Tests in `packages/tabs/__test__` should cover at least:
- default active tab behavior from `defaultValue`
- click selection
- controlled active tab behavior from `value` and `onValueChange`
- `ArrowRight` and `ArrowLeft` navigation, including wrapping behavior
- `Home` and `End` navigation
- tab-to-panel association via `id`, `aria-controls`, and `aria-labelledby`
- selected-state reflection via `aria-selected` and `tabIndex`
- rendering only the active `Content` inside the visible panel while inactive panels remain hidden
- additive consumer trigger handler behavior
- dynamic tab-list reconciliation when the number of tabs changes
- `native composition` composition for `Root`, `List`, `Trigger`, and `Content`

### Change Control

- Behavior or API changes must update, in order:
- This spec
- Tabs unit tests
- Docs/examples when tabs behavior is documented






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
