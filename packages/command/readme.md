# Command Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/command`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-command` | none |
| Content | `aria-command-content` | `listbox` |
| Empty | `aria-command-empty` | `presentation` |
| Group | `aria-command-group` | `group` |
| Input | `aria-command-input` | `combobox` |
| Label | `aria-command-label` | none |
| Loading | `aria-command-loading` | `progressbar` |
| Option | `aria-command-option` | `option` |
| Separator | `aria-command-separator` | `separator` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/command/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 29 of 29 documented sections are represented after native normalization.
- Requirement lines: 153

### Scope

- This document defines the current implementation contract for `@ariaui-web/command`.
- The package is a **headless** command palette / command menu primitive: a composable searchable list with combobox semantics on the filter field, keyboard navigation across options, and optional client-side filtering. It is modeled after palette-style UIs (similar in spirit to [cmdk](https://github.com/pacocoursey/cmdk)) while keeping behavior and markup explicit in this repo.
- Implementation in [`packages/command`](./src) is the source of truth.
- Each subcomponent sets `displayName` to **`Command.<Part>`** (for example `Root`, `Input`) so native Web Component DevTools matches the package name. If a part is rendered outside `Root`, context throws: **`<Part> must be used within Root`**.
- You may import as a namespace under any alias; examples below use **`Command`** to mirror DevTools.

### Primary References

- WAI-ARIA APG [Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (filter input + controlled list semantics)
- WAI-ARIA APG [Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) (option collection behaviors)

### Server rendering (SSR)

- All exported custom elements must be registered on the client. Use them inside a client-side custom element registration boundary in frameworks that split server and client (for example Next.js App Router).

### Mental Model

- **`Root`** owns **selected value**, **search string**, **filtering**, **active (highlighted) option**, item/group registration, and **global keyboard shortcuts** that apply while events bubble through the tree.
- **`Input`** is the **combobox** text field; typing updates the search string and drives which options stay mounted (unless you disable filtering).
- **`Content`** is the **listbox** container (`role="listbox"`); options render inside it.
- **`Option`** items register in DOM order, participate in filtering, expose `role="option"`, and invoke `onSelect` when activated.
- **Groups** optionally wrap options; each group hides itself when none of its child options match the filter (unless `forceMount` keeps children visible).
- No styling is imposed: consumers supply `className` and design tokens like other `@ariaui-web/*` packages.

### Part Model

- Table row: Part | Default element | Role / notes | Responsibility
- Table row: `Root` | `<div>` | Focusable wrapper `tabIndex={-1}`; hosts bubbled `onKeyDown` | State, filtering, navigation, visually hidden `<label>` for the input (`label` attributes/properties or `aria-label` on Root)
- Table row: `Input` | `<input>` | `role="combobox"` | Search value (controlled via Root or controlled `value` attributes/properties on Input)
- Table row: `Content` | `<div>` | `role="listbox"` | Options container; receives `aria-activedescendant`
- Table row: `Option` | `<div>` | `role="option"` | Selectable row; registers with Root
- Table row: `Group` | `<div>` | `role="group"` | Optional heading + `GroupContext` for nested options
- Table row: `Label` | `<div>` | none | Convenience label container with stable `id` (not wired to Root's hidden label unless you compose it yourself)
- Table row: `Separator` | `<div>` | `role="separator"` | Visual divider; omits while searching unless `alwaysRender`
- Table row: `Empty` | `<div>` | `role="presentation"` | Renders when there are registered items but zero visible after filter
- Table row: `Loading` | `<div>` | `role="progressbar"` | Static progress reporting surface; **not** connected to Root state

### Hooks / types

- **`useCommandState()`** - Read-only subset of state: `value`, `searchValue`, `activeId`-derived `activeValue`, `visibleCount`.
- **`CommandFilter`** - `(value, search, keywords?) => boolean | number` used by filtering (see Filtering).
- **`defaultCommandFilter`** - Re-exported default scoring function.
- The hook, filter, and type names use the **`Command*`** prefix so public API identifiers match the package name; **`displayName`** values also use **`Command.*`** (see Scope) so DevTools naming stays consistent with the package.

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Selected value (value)

- Controlled: `value` + `onValueChange`.
- Uncontrolled: `defaultValue` (defaults to `""`).
- Selecting an enabled option updates `value` and calls that option's `onSelect?(value)` if provided.

### Search value (searchValue)

- Controlled: `searchValue` + `onSearchValueChange` on **`Root`**.
- Uncontrolled: `defaultSearchValue` on Root (defaults to `""`).
- **`Input`** may also be controlled via its `value` attributes/properties; when set, Root's search state is synced from it on change.
- Changing the search string clears the **active** option id (`activeId`) until navigation selects one again.

### API Surface - Root

- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | - | Controlled selected command value
- Table row: `defaultValue` | `string` | `""` | Uncontrolled initial selection
- Table row: `onValueChange` | `(value: string) => void` | - | Called when selection changes
- Table row: `searchValue` | `string` | - | Controlled filter text
- Table row: `defaultSearchValue` | `string` | `""` | Uncontrolled initial filter text
- Table row: `onSearchValueChange` | `(value: string) => void` | - | Called when filter text changes
- Table row: `filter` | `CommandFilter` | `defaultCommandFilter` | Determines visibility / ordering score per option
- Table row: `shouldFilter` | `boolean` | `true` | When `false`, all registered options stay visible regardless of filter (you filter manually by mounting/unmounting or other means)
- Table row: `loop` | `boolean` | `false` | When true, ArrowUp/ArrowDown wraps from first <-> last visible enabled option
- Table row: `disablePointerSelection` | `boolean` | `false` | Suppresses pointer-hover updating the active option
- Table row: `label` | `string` | - | Text for visually hidden `<label htmlFor={inputId}>`; falls back to Root `aria-label` or `"Command"`
- Forwarded: all standard `<div>` attributes/properties. Root renders children inside a **`tabIndex={-1}`** div and composes **`onKeyDown`**: consumer `attributes/properties.onKeyDown` runs first, then internal navigation handlers.

### Input

- The exported typing omits `value` / `onChange` in favor of `onValueChange` plus an optional controlled `value` that mirrors Root search state.
- Forwarded: most native `<input>` attributes/properties. Defaults: `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`, `type="text"`.
- ARIA: `aria-autocomplete="list"`, `aria-controls={contentId}`, `aria-expanded={true}`, `aria-activedescendant={activeId}`, `aria-labelledby`, `id` from context.

### Content

- Table row: Prop | Type | Default | Description
- Table row: `label` | `string` | `"Suggestions"` | Exposed as `aria-label` on the listbox

### Option

- Table row: Prop | Type | Default | Description
- Table row: `value` | `string` | **required** | Stable identifier; becomes the Root `value` when selected
- Table row: `disabled` | `boolean` | `false` | Non-interactive option
- Table row: `keywords` | `string[]` | `[]` | Extra strings matched by default filter alongside `value`
- Table row: `forceMount` | `boolean` | from parent `Group` | When true, option stays mounted and visible regardless of filter
- Table row: `onSelect` | `(value: string) => void` | - | Invoked after `value` updates when this option is selected
- Data hooks: `data-value`, `data-selected`, `data-disabled`.

### Group

- Table row: Prop | Type | Default | Description
- Table row: `heading` | `Node | string` | - | When provided, establishes `aria-labelledby` on the group region
- Table row: `forceMount` | `boolean` | `false` | Forces child options to remain visible regardless of filtering
- Wrapped options register with `groupId`; the group's `hidden` attribute reflects whether any child matched the search (unless forced).

### Separator

- Table row: Prop | Type | Default | Description
- Table row: `alwaysRender` | `boolean` | `false` | When false, renders nothing while `searchValue` is non-empty

### Empty

- Renders **only when** there is at least one registered option overall (`totalCount > 0`) **and** zero visible options after filtering (`visibleCount === 0`). If there are no options at all, it does not render (so you typically pair with static copy or omit).

### Loading

- Table row: Prop | Type | Default | Description
- Table row: `label` | `string` | `"Loading..."` | `aria-label`
- Table row: `progress` | `number` | - | Optional `aria-valuenow` (min 0 max 100)

### Filtering

- When `shouldFilter` is **true**:
- **Empty search** shows all options (aside from `forceMount` / visibility rules unchanged for empty query).
- **`defaultCommandFilter`** lowercases search and matches if the joined string **`value + keywords`** contains the substring (case-insensitive, trimmed query).
- Custom **`filter`**: returning **falsy vs truthy vs number** participates via `getScore`; numeric scores extend the hook for future weighted sorts (current visibility uses `score > 0`).
- When `shouldFilter` is **false**:
- Options stay visible; implement your own narrowing (e.g. data fetching, manual lists).

### Accessibility Model

- **Hidden label**: Root outputs a visually hidden `<label>` associated with `Input`'s id for the combobox name.
- **Combobox/listbox linkage**: Input references listbox via `aria-controls`; listbox echoes `aria-activedescendant` for robustness across assistive setups.
- **Options**: `aria-selected` reflects active highlight; `aria-disabled` when disabled.

### Focus behavior

- **Input** retains focus during typing.
- Keyboard navigation updates **active** option id (`aria-activedescendant` on Input and Content points at the active option element's `id`).
- **Option** assigns `tabIndex={0}` only to the selected active option (`0` when active, `-1` otherwise; disabled uses `-1`).

### Pointer behavior

- Click selects if not disabled.
- Pointer move sets active option unless `disablePointerSelection` is true.

### Keyboard Support

- Handled on **`Root`** (bubbling from descendants such as **`Input`**):
- Table row: Key | Behavior
- Table row: `ArrowDown` | Move active option to next visible enabled option
- Table row: `ArrowUp` | Previous visible enabled option
- Table row: `Ctrl+N` / `Ctrl+J` | Next visible enabled option (same as ArrowDown; respects `loop`)
- Table row: `Ctrl+P` / `Ctrl+K` | Previous (same as ArrowUp; respects `loop`)
- Table row: `Home` | First visible enabled option
- Table row: `End` | Last visible enabled option
- Table row: `Enter` | If there is an active option id, selects it
- Composition (`isComposing` / IME) short-circuits handling so safe CJK/input method use.
- Default prevented **only** for keys Root handles explicitly.
- Active options scroll into view with `scrollIntoView({ block: "nearest" })` when the active option changes.

### Data and Reflection Summary

- **Option**
- `data-value`, `data-selected`, `data-disabled`
- **Separator**
- `role="separator"`; may unmount entirely while searching unless `alwaysRender`.

### Coverage Expectations

- Tests under `packages/command/__test__` should cover:
- Controlled and uncontrolled `value` and `searchValue`
- Filtering with default and custom `CommandFilter`; `shouldFilter={false}`
- Keyboard navigation (arrows, Ctrl+N/J/P/K, Home/End), `loop`
- Option selection (`Enter`, click), `disabled`, `keywords`
- Group visibility when children filter out / `forceMount`
- `Empty` and `Separator` search behavior
- `disablePointerSelection` gating hover activation
- Accessibility roles and axe-clean composed examples

### Usage

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Minimal palette

- Code line: import { defineCommandElements } from "@ariaui-web/command";
- Code line: export function Example() {
- Code line: return (
- Code line: <aria-command label="Command menu">
- Code line: <aria-command-input placeholder="Search commands" />
- Code line: <aria-command-content>
- Code line: <aria-command-empty>No results</aria-command-empty>
- Code line: <aria-command-group heading="Actions">
- Code line: <aria-command-option value="create">Create</aria-command-option>
- Code line: <aria-command-option value="delete" disabled>
- Code line: Delete
- Code line: </aria-command-option>
- Code line: </aria-command-group>
- Code line: </aria-command-content>
- Code line: </aria-command>

### Custom filter (substring on value only)

- Code line: import type { CommandFilter } from "@ariaui-web/command";
- Code line: import { defineCommandElements } from "@ariaui-web/command";
- Code line: const strictPrefixFilter: CommandFilter = (value, search) => {
- Code line: if (!search.trim()) return true;
- Code line: return value.toLowerCase().startsWith(search.trim().toLowerCase());
- Code line: <aria-command filter={strictPrefixFilter} label="Apps">
- Code line: <aria-command-input placeholder="Jump to..." />
- Code line: <aria-command-content>{/* options */}</aria-command-content>
- Code line: </aria-command>;

### Client-controlled list (shouldFilter={false})

- Code line: import * as native Web Component from "react";
- Code line: import { defineCommandElements } from "@ariaui-web/command";
- Code line: function RemoteSearch() {
- Code line: const [items, setItems] = custom element state<string[]>([]);
- Code line: // Populate 'items' from your API; omit options not returned.
- Code line: return (
- Code line: <aria-command shouldFilter={false}>
- Code line: <aria-command-input placeholder="Search..." />
- Code line: <aria-command-content>
- Code line: {items.map((id) => (
- Code line: <aria-command-option key={id} value={id} />
- Code line: </aria-command-content>
- Code line: </aria-command>

### Change Control

- Behavior or API changes must update, in order:
- This spec (`readme.md`)
- Tests in `packages/command/__test__`
- Implementation
- Documentation examples on `@ariaui-web/doc` when snippets are synced from this package's usage






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
