# Checkbox Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/checkbox`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-checkbox` | `checkbox` |
| Group | `aria-checkbox-group` | `group` |
| Indicator | `aria-checkbox-indicator` | `presentation` |
| Item | `aria-checkbox-item` | `checkbox` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/checkbox/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 30 of 30 documented sections are represented after native normalization.
- Requirement lines: 193

### Scope

- This document defines the intended contract for `@ariaui-web/checkbox`.
- It uses:
- WAI-ARIA APG checkbox pattern as the accessibility baseline
- Radix UI Checkbox API as the ergonomic reference
- Native HTML checkbox behavior as the functional model
- This package provides a headless, accessible checkbox component with support for controlled/uncontrolled modes, indeterminate state, form integration, and multi-select group composition.

### Primary References

- APG checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- APG checkbox group: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/
- Radix UI Checkbox: https://www.radix-ui.com/primitives/docs/components/checkbox
- HTML checkbox spec: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)

### Mental Model

- `@ariaui-web/checkbox` is a composable primitive for creating accessible checkboxes that can be checked, unchecked, or indeterminate. `Group` composes multiple items into a managed multi-select group.
- Key principles:
- Headless architecture: behavior and accessibility without imposed styling
- Radix-compatible API: familiar attributes/properties and patterns
- APG-compliant: proper ARIA roles and keyboard support
- Form-ready: integrates with native form submission
- Indeterminate support: three-state checkbox capability
- Group composition: optional multi-select group with context-based state sync

### Part Model

- The package exposes a composable part structure:
- `Root` - Interactive checkbox button with state management
- `Indicator` - Visual indicator that shows checked/indeterminate state
- `Item` - Alias of `Root`; use inside `Group` for semantic clarity
- `Group` - Multi-select group that owns `string[]` state and syncs it across child items

### Checked State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Controlled and Uncontrolled Modes

- The package supports both controlled and uncontrolled checked state.
- Public API:
- `checked?: boolean` - Controlled checked state
- `defaultChecked?: boolean` - Initial checked state for uncontrolled mode (default: `false`)
- `onCheckedChange?: (checked: boolean) => void` - Callback when checked state changes
- Behavior:
- When `checked` is provided, component is controlled
- When only `defaultChecked` is provided, component is uncontrolled
- `onCheckedChange` fires on every state change
- Clicking toggles between checked and unchecked
- When indeterminate, clicking sets to checked
- When inside a `Group`:
- The item's `checked`, `defaultChecked`, and `onCheckedChange` attributes/properties are superseded by group state
- `checked` is derived from `groupValue.includes(item.value)`
- Click calls the group's `onItemChange` instead of local state

### Indeterminate State Contract

- Public API:
- `indeterminate?: boolean` - Whether checkbox is in indeterminate state (default: `false`)
- Behavior:
- Indeterminate is a visual-only state, not a true third value
- When indeterminate is true, `aria-checked="mixed"`
- Clicking an indeterminate checkbox sets it to checked (not unchecked)
- Indeterminate state is independent of checked state
- Common use case: parent checkbox when some (but not all) children are checked
- When inside a `Group`, indeterminate passes through unchanged - the group does not own it

### Part Contracts

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Responsibilities:
- Render interactive button with checkbox role
- Own checked and indeterminate state (standalone) or derive checked from group context
- Coordinate controlled and uncontrolled modes
- Handle click interactions
- Provide hidden input for form integration
- Expose state via context to Indicator
- Props:
- Code line: interface RootProps extends Omit<ComponentPropsWithoutRef<"button">, "onChange"> {
- Code line: checked?: boolean;
- Code line: defaultChecked?: boolean;
- Code line: onCheckedChange?: (checked: boolean) => void;
- Code line: indeterminate?: boolean;
- Code line: name?: string;
- Code line: value?: string; // group identifier when inside Group; form value otherwise
- Code line: required?: boolean;
- Code line: disabled?: boolean;
- Code line: children?: Node | string;
- ARIA and data attributes:
- `role="checkbox"`
- `aria-checked="true" | "false" | "mixed"`
- `aria-disabled="true"` when disabled (own or group-level)
- `data-state="checked" | "unchecked" | "indeterminate"`
- `data-disabled` when disabled
- Group-aware behavior:
- Detects `Group` via optional context hook - never throws when used standalone
- When grouped and `value` is provided: derived checked state, click routed to group
- When grouped but `value` is absent: falls back to standalone behavior silently
- Effective `disabled` = `group.disabled || item.disabled`
- Effective `name` = `item.name ?? group.name`
- Effective `required` = `item.required ?? group.required`

### Item

- `Item` is a re-export alias of `Root`. It is behaviorally identical. The alias exists for semantic clarity inside `Group`:
- Code line: <aria-checkbox-group value={selected} onValueChange={setSelected}>
- Code line: <aria-checkbox-item value="a" />
- Code line: <aria-checkbox-item value="b" />
- Code line: </aria-checkbox-group>
- The `value` attributes/properties is required for group participation. Without it, the item falls back to standalone behavior.

### Indicator

- Responsibilities:
- Render visual indicator for checked/indeterminate state
- Conditionally render based on state
- Provide styling hook via data attributes
- Props:
- Code line: interface IndicatorProps extends ComponentPropsWithoutRef<"span"> {
- Code line: forceMount?: boolean;
- Behavior:
- Renders only when checked or indeterminate (unless `forceMount`)
- Exposes `data-state="checked" | "unchecked" | "indeterminate"` for styling
- Typically contains a checkmark or minus icon

### Group

- Responsibilities:
- Own multi-select `string[]` state (controlled or uncontrolled)
- Provide stable context to child items via `CheckboxGroupContext`
- Propagate group-level `disabled`, `name`, and `required` to items
- Props:
- Code line: interface GroupProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
- Code line: value?: string[];
- Code line: defaultValue?: string[];
- Code line: onValueChange?: (value: string[]) => void;
- Code line: disabled?: boolean;
- Code line: name?: string;
- Code line: required?: boolean;
- Code line: children?: Node | string;
- Context shape provided to items:
- Code line: interface CheckboxGroupContextValue {
- Code line: groupValue: string[]; // reactive - items derive checked from this
- Code line: onItemChange: (itemValue: string, checked: boolean) => void; // stable via ref sync
- Code line: groupDisabled: boolean;
- Code line: groupName: string | undefined;
- Code line: groupRequired: boolean | undefined;
- Behavior:
- Renders `<div role="group">`
- `data-disabled` present when disabled
- `onItemChange` is stable - uses a ref to read current value, preventing unnecessary re-renders
- Clicking a checked item removes its value; clicking unchecked appends it
- No item registration - items self-identify via their `value` attributes/properties

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### APG Alignment Target

- The package should satisfy APG checkbox pattern expectations:
- Interactive element has `role="checkbox"`
- Checked state communicated via `aria-checked`
- Indeterminate state uses `aria-checked="mixed"`
- Disabled state uses `aria-disabled="true"`
- Keyboard accessible (Space to toggle)
- Focusable via Tab key
- Associated label via `aria-label`, `aria-labelledby`, or wrapping label
- Group container uses `role="group"` with `aria-label` or `aria-labelledby`

### Keyboard Navigation

- Required keyboard support per APG:
- **On checkbox:**
- `Space` - Toggle checked state
- `Tab` - Move focus to next focusable element
- `Shift+Tab` - Move focus to previous focusable element
- **Not supported (intentionally):**
- Arrow keys do not navigate between checkboxes (no roving tabindex in Group)

### Form Integration

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Hidden Input Pattern

- When `name` is provided (directly or inherited from Group), Root renders a hidden input:
- Code line: <input type="hidden" name="interests" value="react" />
- Behavior:
- Hidden input syncs with checked state
- When `value` attributes/properties is set, that string is used as the submission value
- When `value` is absent, defaults to `"true"` (checked) or `"false"` (unchecked)
- Inside a Group, `value` is always the item identifier string, so the submission value equals the identifier
- Supports `required` attribute for validation
- Item-level `name` / `required` overrides group-level

### Coverage Expectations

- Tests under `packages/checkbox/__test__` should cover:

### Core Functionality

- Controlled and uncontrolled checked state behavior
- Toggle on click
- `onCheckedChange` callback fires with correct value
- `defaultChecked` sets initial state
- Disabled state prevents interaction

### Indeterminate State

- Indeterminate renders with `aria-checked="mixed"`
- Clicking indeterminate checkbox sets to checked
- Indicator shows correct state for indeterminate

### Form Integration

- Hidden input renders when `name` provided
- Hidden input value syncs with checked state
- `required` attribute works for validation

### Accessibility

- Proper ARIA role and attributes
- Keyboard navigation (Space toggles)
- Focus management
- No accessibility violations (axe)

### Edge Cases

- Ref forwarding to Root
- Ref forwarding to Indicator
- Additional attributes/properties spread correctly
- Indicator with `forceMount` always renders

### CheckboxGroup - Controlled

- Items matching `value[]` are checked; non-matching are unchecked
- Clicking unchecked item calls `onValueChange` with value appended
- Clicking checked item calls `onValueChange` with value removed

### CheckboxGroup - Uncontrolled

- `defaultValue` pre-checks the matching items
- Clicking items updates internal state

### CheckboxGroup - Disabled

- Group `disabled` propagates `data-disabled` and `aria-disabled` to all items
- Clicking a group-disabled item does not fire `onValueChange`
- Item-level `disabled` disables one item; siblings remain interactive

### CheckboxGroup - Form Integration

- Group `name` propagates to all hidden inputs
- Item-level `name` overrides group name
- Hidden input `value` equals the item `value` string
- Group `required` propagates to hidden inputs

### CheckboxGroup - Edge Cases

- Indeterminate passthrough: `aria-checked="mixed"` inside group
- Value-less item inside group falls back to standalone without throwing
- Ref forwarding to group `<div>`
- `Item` alias behaves identically to `Root`

### CheckboxGroup - Accessibility

- `role="group"` on container
- No accessibility violations (axe) with `aria-label`

### Change Control

- Behavior or API changes must update, in order:
- This spec file
- Unit tests for this package
- Implementation
- Docs examples and visual/docs tests that consume the package

## Checkbox Source Test Parity

- Learned from: `../ariaui/packages/checkbox/__test__/checkbox.test.tsx`
- Learned from docs page: `../ariaui/web/doc/src/app/docs/components/checkbox/page.md`
- Learned from docs examples: `../ariaui/web/doc/src/markdoc/partials/checkbox/examples.md`
- Source test cases: 42
- Native adaptation: assertions use browser-native custom element hosts, reflected `checked` and `indeterminate` state, `checkedchange` and `valuechange` events, hidden form inputs, and static docs markup instead of framework rendering helpers.
- Native checkbox tests must cover:
- Root and Item expose source-equivalent checkbox button semantics, checkedchange events, indeterminate state, disabled guards, and hidden input form sync
- Indicator reflects owner state, stays hidden while unchecked, and supports force-mount for persistent DOM rendering
- Group owns source-equivalent string array value state through value/default-value attributes, valuechange events, and item checked-state derivation
- Group disabled, name, and required state propagate to child items while item disabled and item name override group-level behavior
- Value-less items inside a Group fall back to standalone checkbox behavior without throwing
- labels associated with checkbox custom elements activate the source-equivalent button host
- docs examples include Basic, With description, Disabled, Group, and Box group variants with source-equivalent checkbox classes and page structure





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- checkbox source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
