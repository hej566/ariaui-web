# Select Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/select`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-select` | none |
| Content | `aria-select-content` | `listbox` |
| DropdownIndicator | `aria-select-dropdown-indicator` | none |
| Group | `aria-select-group` | `group` |
| GroupLabel | `aria-select-group-label` | none |
| Label | `aria-select-label` | `label` |
| Option | `aria-select-option` | `option` |
| Sub | `aria-select-sub` | none |
| SubContent | `aria-select-sub-content` | `listbox` |
| SubTrigger | `aria-select-sub-trigger` | `option` |
| Tag | `aria-select-tag` | none |
| TagGroup | `aria-select-tag-group` | none |
| Trigger | `aria-select-trigger` | `combobox` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/select/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 24 of 24 documented sections are represented after native normalization.
- Requirement lines: 250

### Scope

- This document defines the current contract for `@ariaui-web/select`.

### Primary References

- APG listbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- Radix Select docs: https://www.radix-ui.com/primitives/docs/components/select
- shadcn/ui Select docs: https://ui.shadcn.com/docs/components/select

### Mental Model

- `@ariaui-web/select` is a composite select primitive built around a trigger plus a portalled listbox surface.
- The package owns:
- open state
- single or multiple selection state
- trigger-to-listbox wiring
- positioned floating content (via `@ariaui-web/portal`)
- active option tracking and keyboard navigation
- nested submenu support through sub parts
- **Note:** Consumers render the visible selected value inside the trigger themselves; the package does not export a dedicated `Select.Value` part.

### Part Model

- The package exports compound parts plus type exports:
- `Root` - Container that manages state via context
- `Trigger` - Button (or native composition host child via `native composition`) that opens/closes the listbox
- `DropdownIndicator` - Trailing region inside the trigger reserved for glyph width measurements (pairs with TagGroup overflow)
- `TagGroup` - Row that can collapse tags with an overflow callback (multi-select triggers)
- `Tag` - Wrapper for tags rendered inside `TagGroup`
- `Content` - Portalled listbox surface (or native composition host child via `native composition`)
- `Label` - Label for the select (renders `<label>`)
- `Option` - Individual selectable option (renders `<div>`, or native composition host child via `native composition`)
- `Group` - Groups related options (renders `<div role="group">`)
- `GroupLabel` - Label for a group (renders `<div>`)
- `Sub` - Nested submenu state container (renders no DOM)
- `SubTrigger` - Trigger for opening submenu (renders `<div>`)
- `SubContent` - Submenu content surface (portalled, or native composition host child via `native composition`)
- Type exports: `RootProps`, `TriggerProps`, `DropdownIndicatorProps`, `TagGroupProps`, `TagProps`, `ContentProps`, `OptionProps`, `SubProps`, `SubTriggerProps`, `SubContentProps`, `SelectClassNamePart`, `SelectClassNames`

### API Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Renders a `<div>` wrapper and provides state context. Manages open state, selection, and focus intent.
- Code line: interface RootProps extends native element attributes/properties for "div" {
- Code line: children: Node | string;
- Code line: value?: string | string[];
- Code line: defaultValue?: string | string[];
- Code line: onValueChange?: (value: string | string[]) => void;
- Code line: selectionMode?: "single" | "multiple"; // Default: "single"
- Code line: open?: boolean;
- Code line: defaultOpen?: boolean;
- Code line: onOpenChange?: (open: boolean) => void;
- Code line: offset?: { x: number; y: number }; // Default: { x: 0, y: 0 }
- Code line: disabled?: boolean;
- Code line: classNames?: SelectClassNames;
- `classNames` distributes class names to parts: `{ trigger, content, item, label, subTrigger, subContent }`.

### Trigger

- Renders a `<button type="button">`. Supports `native composition` for custom trigger elements via `native composition host`.
- Code line: interface TriggerProps extends native element attributes/properties for "button" {
- Code line: native composition?: boolean;
- ARIA attributes set automatically:
- `role="combobox"`
- `aria-haspopup="listbox"`
- `aria-expanded` - reflects open state
- `aria-controls` - references the listbox id when open; omitted when closed
- `aria-labelledby` - references `Label`'s id
- `id` - auto-generated, used by Content's `aria-labelledby` fallback
- **No `data-state` attribute.** Consumers should use `aria-expanded` for open/closed styling.
- Keyboard behavior:
- `ArrowDown` - opens listbox, sets focus intent to selected item (falls back to first)
- `ArrowUp` - opens listbox, sets focus intent to selected item (falls back to last)
- `Enter` / `Space` - opens listbox, sets focus intent to selected item
- `Escape` - closes listbox if open
- Click - toggles open state without moving focus into the listbox
- When the trigger is disabled (via own `disabled` attributes/properties or Root's `disabled`), all event handlers are suppressed.

### Content

- Portalled via `@ariaui-web/portal`. Renders a `<div>` with listbox semantics by default, or slots those listbox attributes/properties onto a single child when `native composition` is set. Only mounts while open.
- Code line: interface ContentProps extends native element attributes/properties for "div" {
- Code line: children: Node | string;
- Code line: native composition?: boolean;
- ARIA attributes set automatically:
- `role="listbox"`
- `id` - auto-generated, referenced by trigger's `aria-controls`
- `aria-labelledby` - references `Label`'s id
- `aria-multiselectable` - `true` when `selectionMode="multiple"`, `false` otherwise
- `aria-activedescendant` - tracks the currently focused option's id
- `tabIndex={0}`
- Keyboard behavior (handled on the Content element):
- `ArrowDown` - move focus to next option (wraps to first)
- `ArrowUp` - move focus to previous option (wraps to last)
- `Home` - move focus to first option
- `End` - move focus to last option
- `Enter` / `Space` - select the focused option; in single mode closes the entire select and returns focus to trigger
- `Escape` - closes the entire select (including any open submenus) and returns focus to trigger
- `ArrowLeft` - when inside a SubContent, closes the sub and returns focus to the SubTrigger
- Single printable character - typeahead: focuses next option whose text starts with the character (case-insensitive, wrapping, 500ms buffer timeout)
- Mouse behavior:
- Click on an option - selects it; in single mode closes the select
- Click on a disabled option - ignored
- Hover over an option - focuses and activates it
- Click outside - closes the select; if the click target is not focusable, focus returns to trigger

### Label

- Renders a `<label>` element. Its `id` is auto-generated and wired to the trigger via `aria-labelledby` and to the listbox via `aria-labelledby`.
- Code line: type LabelProps = native element attributes/properties for "label";

### Option

- Renders a `<div>` with option semantics by default, or slots those option attributes/properties onto a single child when `native composition` is set.
- Code line: interface OptionProps extends native element attributes/properties for "div" {
- Code line: value: string; // Required - used for selection tracking
- Code line: children: Node | string;
- Code line: disabled?: boolean;
- Code line: native composition?: boolean;
- ARIA and data attributes set automatically:
- `role="option"`
- `aria-selected` - `true` when selected, `false` otherwise
- `aria-disabled` - reflects `disabled` attributes/properties
- `data-value` - the option's `value` string
- `data-active` - `true` when this option is the active (focused) item
- `data-state` - `"checked"` when selected, `"unchecked"` otherwise
- `data-disabled` - present (empty string) when disabled, omitted otherwise
- `tabIndex` - `0` when active, `-1` otherwise; `-1` when disabled
- `id` - auto-generated
- Disabled options receive focus during keyboard navigation but cannot be selected via click.

### Group

- Renders a `<div>` with `role="group"` and `aria-labelledby` pointing to the GroupLabel.
- Code line: interface GroupProps extends native element attributes/properties for "div" {
- Code line: children: Node | string;

### GroupLabel

- Renders a `<div>`. Its `id` is auto-generated and wired to the parent Group via `aria-labelledby`.
- Code line: type GroupLabelProps = native element attributes/properties for "div";

### Sub

- State container for a nested submenu. **Renders no DOM element.** Manages its own open state and focus intent, or accepts controlled open state.
- Code line: interface SubProps {
- Code line: children: Node | string;
- Code line: offset?: { x: number; y: number }; // Default: { x: 0, y: 0 } - currently unused by SubContent
- Code line: open?: boolean;
- Code line: defaultOpen?: boolean;
- Code line: onOpenChange?: (open: boolean) => void;

### SubTrigger

- Renders a `<div>` that acts as both an option in the parent listbox and a trigger for its submenu.
- Code line: interface SubTriggerProps extends native element attributes/properties for "div" {
- Code line: children: Node | string;
- Code line: disabled?: boolean;
- ARIA and data attributes set automatically:
- `role="option"`
- `aria-selected` - always `false` (sub-triggers are not selectable)
- `aria-haspopup="listbox"`
- `aria-expanded` - reflects the sub's open state
- `aria-disabled` - reflects `disabled` attributes/properties
- `data-active` - `true` when this item is the active (focused) item
- `tabIndex` - `0` when active, `-1` otherwise; `-1` when disabled
- `id` - auto-generated
- Keyboard behavior:
- `ArrowRight` - opens the sub and moves focus to the first option inside SubContent
- `Enter` / `Space` - opens the sub and moves focus to the first option inside SubContent
- `ArrowLeft` - closes the sub if open
- Mouse behavior:
- `mouseenter` - focuses and activates the SubTrigger, opens the sub
- `click` - focuses and activates the SubTrigger, opens the sub
- When the SubTrigger loses active status (via `useDismiss`), the sub closes automatically.

### SubContent

- Portalled via `@ariaui-web/portal`. Renders a `<div>` with listbox semantics by default, or slots those listbox attributes/properties onto a single child when `native composition` is set. Only mounts while the parent Sub is open. Positioned to `"right-start"` relative to the SubTrigger.
- Code line: interface SubContentProps extends native element attributes/properties for "div" {
- Code line: children: Node | string;
- Code line: native composition?: boolean;
- ARIA attributes:
- `role="listbox"`
- `aria-labelledby` - references SubTrigger's id
- `aria-multiselectable` - reflects Root's selection mode
- `aria-activedescendant` - tracks the focused option
- `tabIndex={0}`
- Keyboard and mouse behavior mirrors Content, with the addition that `ArrowLeft` closes the sub and returns focus to the SubTrigger.

### Usage Examples

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Basic Single Select

- Code line: import { defineSelectElements } from "@ariaui-web/select";
- Code line: <aria-select value={value} onValueChange={setValue}>
- Code line: <aria-select-trigger>
- Code line: {value || "Select an option..."}
- Code line: </aria-select-trigger>
- Code line: <aria-select-content>
- Code line: <aria-select-option value="apple">Apple</aria-select-option>
- Code line: <aria-select-option value="banana">Banana</aria-select-option>
- Code line: <aria-select-option value="orange">Orange</aria-select-option>
- Code line: </aria-select-content>
- Code line: </aria-select>

### Multiple Selection

- Code line: <aria-select
- Code line: selectionMode="multiple"
- Code line: value={values}
- Code line: onValueChange={setValues}
- Code line: >
- Code line: <aria-select-trigger>
- Code line: {values.length > 0 ? '${values.length} selected' : "Select..."}
- Code line: </aria-select-trigger>
- Code line: <aria-select-content>
- Code line: <aria-select-option value="red">Red</aria-select-option>
- Code line: <aria-select-option value="green">Green</aria-select-option>
- Code line: <aria-select-option value="blue">Blue</aria-select-option>
- Code line: </aria-select-content>
- Code line: </aria-select>

### With Groups

- Code line: <aria-select value={value} onValueChange={setValue}>
- Code line: <aria-select-trigger>{value || "Select..."}</aria-select-trigger>
- Code line: <aria-select-content>
- Code line: <aria-select-group>
- Code line: <aria-select-group-label>Fruits</aria-select-group-label>
- Code line: <aria-select-option value="apple">Apple</aria-select-option>
- Code line: <aria-select-option value="banana">Banana</aria-select-option>
- Code line: </aria-select-group>
- Code line: <aria-select-group-label>Vegetables</aria-select-group-label>
- Code line: <aria-select-option value="carrot">Carrot</aria-select-option>
- Code line: <aria-select-option value="broccoli">Broccoli</aria-select-option>
- Code line: </aria-select-content>
- Code line: </aria-select>

### With Submenu

- Code line: <aria-select>
- Code line: <aria-select-trigger>Choose...</aria-select-trigger>
- Code line: <aria-select-content>
- Code line: <aria-select-option value="apple">Apple</aria-select-option>
- Code line: <aria-select-sub>
- Code line: <aria-select-sub-trigger>More Fruits</aria-select-sub-trigger>
- Code line: <aria-select-sub-content>
- Code line: <aria-select-option value="orange">Orange</aria-select-option>
- Code line: <aria-select-option value="grape">Grape</aria-select-option>
- Code line: </aria-select-sub-content>
- Code line: </aria-select-sub>
- Code line: </aria-select-content>
- Code line: </aria-select>

### Accessibility Model

- The current implementation follows a trigger-plus-listbox model:
- the trigger renders `role="combobox"`
- the trigger exposes `aria-haspopup="listbox"`
- the trigger reflects `aria-expanded`
- the trigger references the listbox via `aria-controls` (only when open)
- the trigger receives `aria-labelledby` referencing `Label`'s id
- content renders `role="listbox"` with `aria-multiselectable`, `aria-labelledby`, and `aria-activedescendant`
- options render `role="option"` with `aria-selected` and `aria-disabled`
- groups render `role="group"` with `aria-labelledby` pointing to their GroupLabel
- sub-triggers render `role="option"` with `aria-haspopup="listbox"` and `aria-expanded`
- This package is listbox-backed rather than a native `<select>` replacement.

### Behavior Contract

- `Trigger` toggles open state through shared root state
- `Content` only mounts while open (conditional rendering, not CSS hide)
- content is portalled through `@ariaui-web/portal`
- root-managed click-outside behavior closes the content; focus returns to trigger if the click target is not focusable
- clicking the trigger toggles open without moving focus into the listbox; keyboard open (ArrowDown/Enter/Space) sets a focus intent that moves focus to the selected or first option
- single selection emits a string value and closes the select
- multiple selection emits a string array and keeps the select open
- the package supports nested submenus through `Sub`, `SubTrigger`, and `SubContent`
- `Escape` from any depth closes the entire select and returns focus to the root trigger
- `ArrowLeft` from a SubContent closes only that sub level
- typeahead search (case-insensitive, 500ms buffer) operates within each listbox independently
- the package does not export a standalone `Value` part; consumers render selected text inside Trigger themselves

### Data and ARIA Reflection

- Minimum expected reflection:
- `aria-haspopup="listbox"` on the trigger
- `aria-expanded` on the trigger
- `aria-controls` from trigger to open listbox (omitted when closed)
- `aria-labelledby` on the trigger (from Label)
- trigger `role="combobox"`
- `role="listbox"` on content with `aria-multiselectable`, `aria-labelledby`, `aria-activedescendant`
- `role="option"` on options with `aria-selected`, `aria-disabled`
- `data-value`, `data-active`, `data-state` ("checked"/"unchecked"), `data-disabled` on options
- `role="group"` with `aria-labelledby` on groups
- `role="option"` with `aria-haspopup="listbox"` and `aria-expanded` on sub-triggers

### Coverage Expectations

- Tests for this package should cover:
- controlled and uncontrolled selection behavior
- controlled and uncontrolled open behavior (including `onOpenChange`)
- single and multiple selection modes
- trigger ARIA reflection and open-state toggling
- content rendering, portal behavior, and outside-dismiss behavior
- keyboard navigation and active option movement (ArrowDown/Up, Home/End, Enter/Space, Escape)
- option selected and disabled semantics (including data attributes)
- submenu composition behavior (SubTrigger, SubContent, ArrowRight/Left)
- typeahead navigation (single char, accumulation, case insensitivity)
- focus management (click keeps focus on trigger; keyboard open moves focus to selected/first/last)
- root disabled state
- label association with trigger
- classNames distribution to parts
- mouse interactions (hover activation, click selection, hover sub-trigger open/close)






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
