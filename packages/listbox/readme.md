# Listbox Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/listbox`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-listbox` | `listbox` |
| Content | `aria-listbox-content` | `listbox` |
| Group | `aria-listbox-group` | `group` |
| GroupLabel | `aria-listbox-group-label` | none |
| Label | `aria-listbox-label` | `label` |
| Option | `aria-listbox-option` | `option` |
| Submenu | `aria-listbox-submenu` | none |
| Viewport | `aria-listbox-viewport` | `group` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/listbox/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 117

### Scope

- This document defines the current contract for `@ariaui-web/listbox`.

### Primary References

- APG listbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

### Mental Model

- `@ariaui-web/listbox` is a primitive for rendering selectable option collections with shared listbox state.

### Part Model

- The package exports:
- `Root` - state container and context provider
- `Label` - accessible label for the listbox
- `Content` - container with `role="listbox"` and listbox keyboard behavior
- `Viewport` - optional inner wrapper that caps visible height and uses **native** overflow scrolling for long lists
- `Option` - selectable item with role="option"
- `Group` - grouping container with role="group"
- `GroupLabel` - label for option groups
- `Listbox.Sub` - submenu container
- `Listbox.SubTrigger` - trigger to open submenu
- `Listbox.SubContent` - submenu content surface

### State Contract

- The root coordinates shared listbox selection and active-option behavior.

### Props Contract

- **Root:**
- `value?: string | string[]` - controlled selection value
- `defaultValue?: string | string[]` - uncontrolled initial selection
- `onValueChange?: (value: string | string[]) => void` - selection change callback
- `selectionMode?: "single" | "multiple"` - selection mode (default: "single")
- **Label:**
- All standard HTML attributes/properties
- **Content:**
- All standard div attributes/properties (className, style, etc.)
- **Viewport:**
- `maxVisibleItems: number` - number of option **rows** to show before vertical scrolling; `max-height` is computed as `(height of first registered option) x maxVisibleItems`
- All standard div attributes/properties
- **Composition:** must be a descendant of `Content` (same content context as options). Typical structure: `Content` -> `Viewport` -> `Option` nodes (and optional `Group` / `GroupLabel` as needed).
- **Measurement:** row height is derived from the first option in DOM order after registration; uniform row height is assumed. If options differ in height, sizing may be approximate.
- **Option:**
- `value: string` - unique option value (required)
- `disabled?: boolean` - disables selection
- **Group:**
- **GroupLabel:**
- **Sub:**
- **SubTrigger:**
- **SubContent:**

### Accessibility Model

- The package should satisfy listbox and option semantics appropriate for selectable option collections.

### Keyboard Support

- **Navigation:**
- `ArrowDown` - Move focus to next option (wraps to first)
- `ArrowUp` - Move focus to previous option (wraps to last)
- `Home` - Move focus to first option
- `End` - Move focus to last option
- **Selection:**
- `Enter` - Select focused option
- `Space` - Select focused option (toggle in multi-select mode)
- **Submenus:**
- `ArrowRight` - Open submenu and focus first item
- `ArrowLeft` - Close submenu and return focus to trigger
- `Escape` - Close submenu and return focus to trigger
- **Typeahead:**
- Type character(s) to jump to matching option (case-insensitive)

### Behavior Contract

- **Selection:**
- Single-select mode: clicking/selecting an option replaces current selection
- Multi-select mode: Space toggles selection, Enter adds to selection
- Disabled options can receive focus but cannot be selected
- **State Management:**
- Controlled mode: parent manages value via value attributes/properties
- Uncontrolled mode: component manages internal state via defaultValue
- **Focus Management:**
- Listbox container is focusable (tabindex="0")
- Options receive focus during keyboard navigation
- aria-activedescendant tracks focused option
- Focus wraps around at boundaries
- **Viewport (scroll region):**
- When `Viewport` is used, it applies `max-height` and `overflow-y: auto` so overflow is scrolled with the **browser's native scrollbar**
- The element with `role="listbox"` remains `Content`; the viewport is a non-roled wrapper inside it
- **Submenus:**
- Hover over SubTrigger opens submenu
- ArrowRight on SubTrigger opens submenu and focuses first item
- Selecting option in submenu closes submenu and returns focus to trigger
- ArrowLeft or Escape closes submenu
- **Grouping:**
- Groups provide semantic structure with role="group"
- GroupLabels associate with groups via aria-labelledby
- **Typeahead:**
- Character input jumps to matching option
- Rapid typing accumulates characters (500ms timeout)
- Case-insensitive matching

### Data and ARIA Reflection

- **Viewport:**
- `data-listbox-viewport=""` on the viewport element (styling / testing hook)
- No ARIA role on the viewport (listbox role stays on `Content`)
- **Listbox (Content):**
- `role="listbox"`
- `tabindex="0"` for keyboard focus
- `aria-labelledby` references Label component
- `aria-multiselectable="true"` in multi-select mode
- `aria-multiselectable="false"` in single-select mode
- `aria-activedescendant` references focused option
- **Options:**
- `role="option"`
- `aria-selected="true|false"` reflects selection state
- `aria-disabled="true"` on disabled options
- `data-active="true|false"` reflects hover/focus state
- **Groups:**
- `role="group"`
- `aria-labelledby` references GroupLabel
- **Submenus:**
- SubContent visibility controlled by open state
- Focus management between trigger and content

### Coverage Expectations

- Tests for this package should cover:
- Basic rendering of listbox, options, and labels
- Single-select mode selection behavior
- Multi-select mode selection and toggle behavior
- Keyboard navigation (ArrowUp/Down, Home/End, wrapping)
- Keyboard selection (Enter, Space)
- Typeahead search (single char, multi-char, case-insensitive)
- Disabled options (focusable but not selectable)
- Groups and GroupLabels with proper ARIA structure
- Submenu opening/closing (click, hover, keyboard)
- Submenu keyboard navigation (ArrowRight/Left, Escape)
- Focus management and aria-activedescendant
- Hover highlighting with data-active attribute
- Controlled and uncontrolled modes
- ARIA attributes (roles, aria-selected, aria-multiselectable, aria-disabled)
- Accessibility compliance (jest-axe)
- Optional `Viewport` max-height behavior (`maxVisibleItems`) and native overflow scrolling






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
