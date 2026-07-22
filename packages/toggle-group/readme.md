# ToggleGroup Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/toggle-group`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-toggle-group` | `group` |
| Item | `aria-toggle-group-item` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/toggle-group/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 16 of 16 documented sections are represented after native normalization.
- Requirement lines: 94

### Scope

- This document defines the current contract for `@ariaui-web/toggle-group`.
- It uses:
- WAI-ARIA APG button pattern as the accessibility baseline
- Radix UI ToggleGroup API as the ergonomic reference

### Primary References

- APG button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Radix UI ToggleGroup: https://www.radix-ui.com/primitives/docs/components/toggle-group

### Mental Model

- `@ariaui-web/toggle-group` is a grouped toggle primitive. A `Root` renders the group wrapper and provides mode, active-state context, item registration, and roving-focus state. Each `Item` self-registers with that root using an internal item id. Toggle state can be driven by item `value` strings through `value` / `defaultValue`, or by the legacy per-item `isActive` registration path.
- Two modes are supported:
- **single** - at most one item active at a time; activating one deactivates the rest.
- **multiple** (default) - each item toggles independently.

### Part Model

- Table row: Export | Element | Role
- Table row: `Root` | `<div>` | Provides `ToggleProvider` (ordered item records, mode) and `FocusProvider` (roving focused item id)
- Table row: `Item` | `<button>` | Self-registering toggle button with keyboard navigation and press handling

### API Reference

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- **Props:**
- `mode?: "single" | "multiple"` - active-state mode (default: `"multiple"`)
- `value?: string | string[] | null` - controlled active value. Use `string | null` in single mode and `string[]` in multiple mode.
- `defaultValue?: string | string[] | null` - uncontrolled initial active value. Use item `value` attributes/properties when using this API.
- `onValueChange?: (value: string | string[] | null) => void` - callback fired with the next active value.
- `onActiveChange?: (actives: boolean[]) => void` - callback fired after an item is toggled, receives the full boolean array
- `children: Node | string`
- All standard `HTMLDivElement` attributes/properties (className, style, etc.)
- **Behavior:**
- Wraps children in `ToggleProvider` -> `FocusProvider`.
- Uses `useControllableState` from `@ariaui-web/hooks` for controlled and uncontrolled value state.
- Renders a plain `<div>` and forwards div attributes/properties to that wrapper.
- Does not inspect or clone its children.

### Item

- **Props:**
- `disabled?: boolean` - disables the item (default: `false`)
- `isActive?: boolean` - initial active state, registered with the group on mount (default: `false`)
- `value?: string` - stable item value used by `Root` `value`, `defaultValue`, and `onValueChange`
- `index?: number` - legacy attributes/properties retained in the type surface but not used by the context-based implementation
- All standard `HTMLButtonElement` attributes/properties (className, style, onClick, etc.)
- **Behavior:**
- Renders a `<button>` with `disabled={disabled}`.
- Registers itself with the nearest `Root` via context, contributing `{ id, value, isActive, isDisabled }` to the ordered item list.
- Click toggles the item through the context `toggle(id)` function.
- Focus is managed by the `FocusProvider`: setting `focusedItemId` triggers a `useEffect` that calls `ref.current.focus()` on the matching item.
- `tabIndex` follows roving tabindex: `0` for the focused item (or the first focusable item when no item has focus), `-1` for all others and disabled items.

### State Contract

- **Toggle state**: an ordered `ToggleItemRecord[]` in `ToggleContext`, where each record contains `{ id, value, isActive, isDisabled }`.
- **Value state**: when `value`, `defaultValue`, or `onValueChange` is provided, active state is derived from item `value` strings and managed by `useControllableState`.
- **Legacy state**: when the value API is not used, active state continues to come from registered `isActive` item records.
- **Registration lifecycle**: `Item` registers on mount, unregisters on unmount, and syncs `isActive` / `disabled` attributes/properties changes back into the context record.
- **Focus state**: a single `focusedItemId: string | null` in `FocusContext`. Updated on click, focus, and keyboard navigation.
- **Mode**: `"single" | "multiple"` stored in `ToggleContext`.
- **Single value mode**: uses `string | null`; toggling the active item returns `null`.
- **Multiple value mode**: uses `string[]`; toggling adds or removes the clicked item value.
- `onActiveChange` remains available for legacy integrations and still reports a boolean array in item order.

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Roles and Attributes

- Each `Item` renders `<button>` which gives it an implicit `role="button"`.
- Active state is exposed via `data-active={true|false}` on each button.
- Disabled items use the HTML `disabled` attribute, which removes them from the tab order and prevents interaction.

### Keyboard Interactions

- Table row: Key | Behavior
- Table row: ArrowRight | Move focus to next enabled item (wraps to first)
- Table row: ArrowDown | Move focus to next enabled item (wraps to first)
- Table row: ArrowLeft | Move focus to previous enabled item (wraps to last)
- Table row: ArrowUp | Move focus to previous enabled item (wraps to last)
- Table row: Home | Move focus to first enabled item
- Table row: End | Move focus to last enabled item
- Table row: Enter | Activate / toggle the focused item (via `ref.current.click()`)
- Table row: Tab | Move focus out of the group to the next focusable element
- Table row: Shift+Tab | Move focus out of the group to the previous focusable element

### Behavior Contract

- In **single** mode, toggling an item deactivates all other items then flips the target.
- In **multiple** mode, toggling an item only flips that item.
- In value-controlled mode, `data-active` reflects the controlled `value` attributes/properties until the parent updates it.
- In value-uncontrolled mode, `defaultValue` seeds the active items and subsequent interaction updates internal state.
- Focus navigation wraps circularly and skips disabled items.
- `onValueChange` is called after each click with the next value shape for the current mode.
- `onActiveChange` is called after each click with the projected next boolean array.

### Data and ARIA Reflection

- Current reflection on each `Item`:
- `data-active` - `true` or `false` (string)
- `disabled` - HTML attribute when `disabled` is `true`
- `aria-label` - hardcoded to `"toggle-item-${index}"`
- `tabIndex` - `0` for the roving-focus target, `-1` for all others

### Composition Rules

- `Item` must be rendered somewhere under `Root`, but it does not need to be a direct child.
- One `Root` owns one registration and roving-focus scope.

### Known Issues

- **`aria-pressed` not used** - items expose active state via `data-active` instead of the standard `aria-pressed` attribute. Screen readers cannot detect the pressed state.
- **Generated fallback label** - each item renders a fallback `aria-label="toggle-item-${index}"` when consumers do not provide their own label.
- **`Space` key broken** - the keyboard handler uses `case "Enter" || "Space"` which is a JS expression that always evaluates to `"Enter"`. The Space key never matches.
- **No `role="group"`** - `Root` renders a plain `<div>` without `role="group"` or `aria-label`, so assistive technology has no group landmark.
- **Legacy `index` attributes/properties still exposed in types** - the public `ItemTypes` surface still includes `index?: number`, but the context-based implementation no longer consumes it.

### Coverage Expectations

- Tests should cover:
- Single-mode active-state behavior (one active at a time)
- Multiple-mode active-state behavior (independent toggles)
- Context registration for wrapped or nested items
- Disabled-item skipping during keyboard navigation
- Arrow, Home, and End key navigation with wrapping
- `aria-pressed` reflection (currently missing - requires fix)
- `onActiveChange` callback values
- `data-active` reflection
- Tab and Shift+Tab exit the group
- Click toggles the item
- No accessibility violations (axe)
- Controlled and uncontrolled value state in single and multiple modes

## Toggle Group Source Test Parity

- Learning sources: `../ariaui/packages/toggle-group/__test__/toggle.test.tsx`, `../ariaui/packages/toggle-group/__test__/context.test.tsx`
- Source test cases: 22
- Single and multiple modes project active state in item order.
- Controlled and uncontrolled value state support string, array, and null shapes.
- Nested items register dynamically and removed items are ignored.
- Roving focus wraps and skips disabled items for Arrow, Home, and End keys.
- Enter and Space activate the focused native button while Tab leaves the group.
- Items reflect `data-active`, `data-state`, `aria-pressed`, `disabled`, and fallback labels.
- Root exposes `role="group"` and default markup has no axe accessibility violations.
- Docs reproduce all seven upstream Toggle Group variants and Tailwind composition.






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
