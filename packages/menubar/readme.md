# Menubar Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/menubar`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-menubar` | `menubar` |
| CheckboxItem | `aria-menubar-checkbox-item` | `menuitemcheckbox` |
| Content | `aria-menubar-content` | `menu` |
| Group | `aria-menubar-group` | `group` |
| Item | `aria-menubar-item` | `menuitem` |
| ItemIndicator | `aria-menubar-item-indicator` | none |
| Label | `aria-menubar-label` | none |
| Menu | `aria-menubar-menu` | none |
| RadioGroup | `aria-menubar-radio-group` | `group` |
| RadioItem | `aria-menubar-radio-item` | `menuitemradio` |
| Separator | `aria-menubar-separator` | `separator` |
| Sub | `aria-menubar-sub` | none |
| SubContent | `aria-menubar-sub-content` | `menu` |
| Submenu | `aria-menubar-submenu` | none |
| SubTrigger | `aria-menubar-sub-trigger` | `menuitem` |
| Trigger | `aria-menubar-trigger` | `menuitem` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/menubar/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 35 of 35 documented sections are represented after native normalization.
- Requirement lines: 210

### Scope

- Normative behavior/API contract for `@ariaui-web/menubar`.

### Primary References

- Radix Menubar: https://www.radix-ui.com/primitives/docs/components/menubar
- WAI-ARIA APG Menubar: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- When optional Radix and APG details differ, Radix-compatible behavior is normative.

### Mental Model

- `@ariaui-web/menubar` is a Radix-compatible menubar/menu primitive with top-level trigger navigation, popup content, submenu support, and checkable items.

### Part Model

- The package exports 15 compound parts:
- Table row: Part | Element | Role / Semantic | Description
- Table row: `Root` | `<div>` | `role="menubar"` | Top-level menubar container with keyboard navigation context
- Table row: `Menu` | `<div>` | none | Wrapper that provides per-menu context (open state, positioning, trigger ref)
- Table row: `Trigger` | `<button>` | `role="menuitem"` | Top-level menubar trigger; opens associated Content popup
- Table row: `Content` | `<ul>` | `role="menu"` | Popup menu panel; portalled to `document.body`
- Table row: `Item` | `<button>` | `role="menuitem"` | Standard menu item
- Table row: `CheckboxItem` | `<button>` | `role="menuitemcheckbox"` | Toggleable menu item with checked state
- Table row: `RadioGroup` | `<div>` | `role="group"` | Groups RadioItem elements with shared selection
- Table row: `RadioItem` | `<button>` | `role="menuitemradio"` | Single-select radio menu item within RadioGroup
- Table row: `ItemIndicator` | `<div>` | none | Conditionally rendered indicator; only renders children when parent is checked
- Table row: `Sub` | none (context) | - | Submenu state container (no DOM output)
- Table row: `SubTrigger` | `<button>` | `role="menuitem"` | Opens associated SubContent popup on hover/keyboard
- Table row: `SubContent` | `<ul>` | `role="menu"` | Submenu popup panel; portalled to `document.body`
- Table row: `Group` | `<div>` | `role="group"` | Groups related menu items
- Table row: `Label` | `<div>` | none | Non-interactive label within menu
- Table row: `Separator` | `<div>` | `role="separator"` | Visual divider between menu sections

### API Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | - | Controlled open menu value
- Table row: `defaultValue` | `string` | `""` | Initial open menu value (uncontrolled)
- Table row: `onValueChange` | `(value: string) => void` | - | Called when open menu changes
- Table row: `loop` | `boolean` | `false` | Wrap keyboard navigation between first/last trigger

### Menu

- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | - | Value identifier for this menu
- Table row: `onValueChange` | `(value: string) => void` | - | Called when menu value changes
- Table row: `offset` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Positioning offset for Content popup

### Trigger

- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | `""` | Value identifier for this trigger
- Table row: `native composition` | `boolean` | - | Render as child element via native composition host pattern
- Table row: `disabled` | `boolean` | - | Disable trigger interaction

### Content

- Table row: Prop | Type | Default | Description
- Table row: `native composition` | `boolean` | - | native composition host menu surface attributes/properties onto a single child element for custom hosts such as Framer Motion components
- Table row: `loop` | `boolean` | `false` | Wrap keyboard navigation between first/last item
- Table row: `onEntryFocus` | `(event: Event) => void` | - | Called when menu receives initial focus
- Table row: `onCloseAutoFocus` | `(event: Event) => void` | - | Called when focus returns after close
- Table row: `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Called on Escape key press
- Table row: `onPointerDownOutside` | `(event: MouseEvent \ | TouchEvent) => void` | - | Called on outside pointer down
- Table row: `onFocusOutside` | `(event: FocusEvent) => void` | - | Called when focus moves outside
- Table row: `onInteractOutside` | `(event: Event) => void` | - | Called on any outside interaction

### Item

- Table row: Prop | Type | Default | Description
- Table row: `textValue` | `string` | - | Override text for typeahead matching
- Table row: `onSelect` | `(event: Event) => void` | - | Called when item is selected
- Table row: `disabled` | `boolean` | - | Disable item interaction

### CheckboxItem

- Extends Item attributes/properties.
- Table row: Prop | Type | Default | Description
- Table row: `checked` | `boolean` | - | Controlled checked state
- Table row: `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled)
- Table row: `onCheckedChange` | `(checked: boolean) => void` | - | Called when checked state changes
- Table row: `showIndicator` | `boolean` | `true` | Whether to show the check indicator

### RadioGroup

- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | - | Controlled selected value
- Table row: `defaultValue` | `string` | - | Initial selected value (uncontrolled)
- Table row: `onValueChange` | `(value: string) => void` | - | Called when selection changes

### RadioItem

- Extends Item attributes/properties.
- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | **(required)** | Value identifier for this radio item
- Table row: `showIndicator` | `boolean` | `true` | Whether to show the radio indicator

### ItemIndicator

- No additional attributes/properties. Renders children only when the parent CheckboxItem or RadioItem is checked.

### Sub

- Table row: Prop | Type | Default | Description
- Table row: `offset` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Positioning offset (not currently applied to SubContent)
- Table row: `open` | `boolean` | - | Controlled open state
- Table row: `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled)
- Table row: `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes

### SubTrigger

- Table row: Prop | Type | Default | Description
- Table row: `disabled` | `boolean` | - | Disable subtrigger interaction
- Note: SubTrigger does NOT support `native composition` (unlike Trigger).

### SubContent

- Supports `native composition` plus the same lifecycle/dismissal attributes/properties as Content.
- Table row: Prop | Type | Default | Description
- Table row: `native composition` | `boolean` | - | native composition host submenu surface attributes/properties onto a single child element for custom hosts such as Framer Motion components
- Table row: `loop` | `boolean` | `false` | Wrap keyboard navigation between first/last submenu item
- `onEntryFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`.

### Group / Label / Separator

- Standard `native element attributes/properties for "div"` - no custom attributes/properties.

### Data and ARIA Reflection

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Structure, Roles, and ARIA

- `Root` renders `<div role="menubar">`.
- `Content`/`SubContent` render `<ul>` elements by default, or slot menu attributes/properties onto a child with `native composition`, with `role="menu"` and are popup containers portalled to `document.body`.
- Item roles:
- `Item` -> `role="menuitem"`
- `CheckboxItem` -> `role="menuitemcheckbox"`
- `RadioItem` -> `role="menuitemradio"`
- Trigger/SubTrigger ARIA:
- `aria-haspopup="menu"`
- `aria-expanded` reflects open state
- `aria-controls` set to content node ID **only when open** (absent when closed)
- Popup labeling:
- `aria-labelledby` references the trigger/subtrigger ID on `Content`/`SubContent`.
- Active descendant:
- `Content`/`SubContent` use `aria-activedescendant` to track the highlighted item.
- Disabled/checked semantics:
- `disabled`/`aria-disabled` where applicable
- `aria-checked` for checkbox/radio items.

### Required Data Attributes

- `Root`:
- `data-orientation="horizontal"`
- `Trigger`:
- `data-state="open|closed"`
- `data-highlighted` (empty string) when highlighted
- `data-disabled` (empty string) when disabled
- `data-menubar-value` - resolved value identifying this trigger
- `SubTrigger`:
- `Content`/`SubContent`:
- `data-state="open"` (only rendered when open)
- `data-side` - placement side (`"bottom"` for Content, `"right"` for SubContent)
- `data-align` - placement alignment (`"start"` default)
- `Item`/`CheckboxItem`/`RadioItem`:
- `data-text-value` - typeahead override text (on underlying `<button>`)
- Checkable items:
- `data-state="checked|unchecked"` on checkbox/radio items
- `aria-checked="true|false"`

### Positioning

- `Content` default placement: `"bottom-start"` relative to trigger.
- `SubContent` default placement: `"right-start"` with hardcoded offset `{ x: 2, y: -4 }`.
- Both Content and SubContent are portalled to `document.body` via `@ariaui-web/portal`.

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Keyboard Contract

- The local Aria UI package docs include this h3 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Menubar level

- `Tab`/`Shift+Tab` enter/exit the menubar composite.
- If a trigger is focused and its menu is open:
- `Tab` moves focus to the next trigger, closes current menu, opens next trigger menu.
- `Shift+Tab` moves focus to the previous trigger, closes current menu, opens previous trigger menu.
- `ArrowRight`/`ArrowLeft` move across top-level triggers.
- In RTL (`dir="rtl"`), next/previous direction is mirrored.
- `Home`/`End` move to first/last trigger.
- Trigger typeahead focuses matching trigger labels.
- Menubar typeahead accepts any printable single character, not only letters/digits.

### Open menu/submenu level

- `ArrowDown`/`ArrowUp` move through enabled items.
- `Enter`/`Space` activate item behavior.
- `Escape` closes current menu chain and restores focus appropriately.
- Direction-aware submenu keys:
- open submenu with logical forward arrow (e.g. `ArrowRight` in LTR).
- close submenu with logical backward arrow (e.g. `ArrowLeft` in LTR) and restore parent subtrigger focus.
- If focus is on an item without submenu in `Content`, logical lateral arrow switches top-level menu context and keeps focus on the target trigger (menu opens, first item is **not** auto-focused).
- If focus is on an item in `SubContent`, logical lateral forward arrow switches to the **next** top-level trigger and keeps focus on that trigger.
- If `SubContent` is already open and focus is on `SubTrigger`, pressing logical forward arrow moves focus to first enabled item in `SubContent`.
- `Home`/`End` move to first/last item in current menu.
- Item typeahead matches labels and supports `textValue` override.
- Typeahead behavior details:
- Uses a short rolling buffer window for multi-character matching.
- Exact match is prioritized when present.
- Repeated single-character input cycles through items/triggers sharing that prefix.
- Printable punctuation keys participate in matching when item/trigger text starts with that character.

### Looping

- Looping is attributes/properties-driven (not always on):
- `Root.loop` controls trigger wrap.
- `Content.loop` controls menu item wrap.
- `SubContent.loop` controls submenu item wrap.
- Current package defaults: `Root.loop=false`, `Content.loop=false`, `SubContent.loop=false`.

### Pointer/Mouse Contract

- Trigger click opens its menu.
- Activating another trigger switches open menu context.
- Subtrigger pointer interaction opens submenu.
- Outside pointer interaction closes relevant menu chain.
- Disabled trigger/subtrigger/items are pointer non-interactive.
- Item pointer activation:
- `Item`: calls `onSelect`, then closes.
- `CheckboxItem`: calls `onCheckedChange` before close.
- `RadioItem`: calls `RadioGroup.onValueChange` before close.
- Consumer-observable state callbacks must occur before close/unmount effects hide menu.
- Checkbox/radio state remains correct across close/reopen.
- Hover behavior:
- Hovering trigger or subtrigger may open/switch menu context and update highlighted state, but does not move DOM focus.
- Hovering enabled item in `Content`/`SubContent` updates highlighted state, but does not move DOM focus.
- Hovering a sibling trigger while another element is focused may switch open menu context, but focus stays where it was.
- Pointer hover and keyboard focus are independent; keyboard remains the authority for DOM focus movement.
- Pointer click focus behavior:
- Clicking a trigger may move DOM focus to that trigger.
- Clicking a subtrigger may move DOM focus to that subtrigger while opening its submenu.
- Sibling-hover submenu close:
- If submenu is open and focus/hover moves to sibling non-subtrigger item in same parent menu, open submenu closes.
- Pointer-open keyboard coherence:
- Menu opened via pointer + `ArrowDown` focuses first enabled item.
- Menu opened via pointer + `ArrowUp` focuses last enabled item.

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Controlled/Uncontrolled API Contract

- Root selection: `value`, `defaultValue`, `onValueChange`.
- Sub open control target: `open`, `defaultOpen`, `onOpenChange`.
- Checkbox: `checked`, `defaultChecked`, `onCheckedChange`.
- RadioGroup: `value`, `defaultValue`, `onValueChange`.
- Item selection: `onSelect`.
- Search matching: `textValue`.
- Directionality: `dir` at root level.

### Consumer Event Handlers

- Consumer event handlers are composed with internal behavior; they do not replace core menubar behavior.
- Applies to trigger/subtrigger/content keyboard and pointer handlers.
- Consumer handlers run in addition to internal handlers and may observe final state changes.

### Dismissal/Focus Hooks

- Hooks apply to `Content`/`SubContent` (not `Root`):
- `onCloseAutoFocus`
- `onEscapeKeyDown`
- `onPointerDownOutside`
- `onFocusOutside`
- `onInteractOutside`
- `onEntryFocus`
- If provided, a hook should fire at its corresponding lifecycle/event boundary.

### APG Mapping Notes (Informative)

- APG menubar keyboard model is covered by the directional/open/close rules above.
- APG optional behavior is configuration-driven in this package.
- Wrap behavior is `loop`-driven.
- Horizontal arrow semantics are direction-aware (`dir`), not hardcoded LTR.

### Coverage Expectations

- Tests live in:
- `packages/menubar/__test__` (unit behavior/API)
- Expected coverage includes:
- Roles/ARIA: menubar role, menu role, menuitem/menuitemcheckbox/menuitemradio roles, aria-haspopup, aria-expanded, aria-controls (conditional), aria-checked, aria-labelledby, aria-activedescendant.
- Data attributes: data-state, data-highlighted, data-disabled, data-orientation, data-side, data-align, data-menubar-value, data-text-value.
- Rendering: Content/SubContent as default `<ul>` elements or `native composition` slotted hosts, Content/SubContent portalled to `document.body`, Separator/Group/Label element types and roles.
- Trigger navigation + RTL directionality.
- Item navigation/activation + submenu open/close focus restoration.
- Loop matrix for `Root.loop`, `Content.loop`, `SubContent.loop` true/false.
- Typeahead regression coverage for printable punctuation and buffered matching.
- Pointer interactions including non-focus-stealing hover, click-focus behavior, and sibling-hover submenu close.
- Controlled/uncontrolled APIs.
- Trigger, Content, and SubContent `native composition` support via native composition host pattern.
- ItemIndicator conditional rendering based on checked state.






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
