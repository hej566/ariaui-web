# Radio Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/radio`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-radio` | `radiogroup` |
| Item | `aria-radio-item` | `radio` |
| Indicator | `aria-radio-indicator` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/radio/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 70

### Scope

- This document defines the current contract for `@ariaui-web/radio`.

### Primary References

- APG radio group pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Radix radio group docs: https://www.radix-ui.com/primitives/docs/components/radio-group

### Mental Model

- `@ariaui-web/radio` is a button-based radio group with roving focus.
- The package owns:
- group selection state
- keyboard movement between items
- checked-state reflection
- optional hidden form input emission when an item is named
- It does not render native visible radio inputs.

### Part Model

- The package exports:
- `Root`
- `Item`
- `Indicator`

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- `Root` supports controlled and uncontrolled selection state.
- Current public shape:
- `value?: string`
- `defaultValue?: string`
- `onValueChange?: (value: string) => void`
- `disabled?: boolean`
- normal `div` attributes/properties
- Behavior:
- when `value` is provided, selection is controlled
- when `value` is omitted, selection is initialized from `defaultValue`
- `disabled` applies group-wide disabled state
- roving tabindex state is coordinated at the root

### Item

- Current public shape:
- `value: string`
- `disabled?: boolean`
- `name?: string`
- `required?: boolean`
- normal button attributes/properties except `value`
- Behavior:
- item disabled state is the union of group disabled state and item disabled state
- clicking an enabled item selects it
- the selected item receives focus after click
- when `name` is provided, the item emits a hidden input for form submission

### Accessibility Model

- The package should satisfy the core APG radio expectations:
- `Root` renders `role="radiogroup"`
- `Item` renders `role="radio"`
- checked state is reflected through `aria-checked`
- disabled state is reflected through `aria-disabled`
- only one item is tabbable at a time through roving tabindex
- arrow keys move focus and selection through the group
- The current implementation also reflects:
- `aria-activedescendant` on the group when a selected item id is known

### Behavior Contract

- `ArrowRight` and `ArrowDown` move to the next enabled item and select it
- `ArrowLeft` and `ArrowUp` move to the previous enabled item and select it
- `Space` selects the focused item
- `Item` exposes `data-state="checked" | "unchecked"`
- `Item` exposes `data-disabled` when disabled
- `Indicator` mirrors the item's checked and disabled state through `data-state` and `data-disabled`
- hidden form input emission is tied to the individual item `name` attributes/properties, not to the root

### Data and ARIA Reflection

- Minimum expected reflection:
- `role="radiogroup"` on the root
- `role="radio"` on each item
- `aria-checked` on each item
- `aria-disabled` on disabled items
- `aria-activedescendant` on the root when applicable
- `data-state` on items and indicators
- `data-disabled` on disabled items and indicators

### Coverage Expectations

- Tests for this package should cover:
- controlled and uncontrolled selection behavior
- single checked item semantics
- roving tabindex behavior
- arrow-key selection and focus movement
- group and item disabled state
- hidden input emission from named items
- `data-state` and ARIA reflection on items and indicators

## Radio Source Test Parity

- Learned from: `../ariaui/packages/radio/__test__/radio.test.tsx`
- Learned from docs page: `../ariaui/web/doc/src/app/docs/components/radio/page.md`
- Learned from docs examples: `../ariaui/web/doc/src/markdoc/partials/radio/examples.md`
- Source test cases: 43
- Native adaptation: controlled state uses the `value` attribute, uncontrolled state uses `default-value`, and `onValueChange` maps to a bubbling `valuechange` event.
- Native Radio tests must cover:
- Root and Item expose radiogroup and radio semantics with generated item ids and aria-activedescendant reflection
- value and default-value provide controlled and uncontrolled selection through bubbling valuechange events
- Arrow keys move focus and selection with wrapping and disabled-item skipping while Space and Enter select the focused Item
- group and item disabled state propagate to Item and Indicator data and ARIA reflection
- only the checked named Item emits a hidden input with value and required state
- labels associated with Radio Item custom elements activate the item
- docs examples include Uncontrolled, Controlled, and Radio Cards variants with source-equivalent classes and page structure

## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- radio source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
