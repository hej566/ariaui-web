export const componentSpec = {
  "kind": "component",
  "name": "Combobox",
  "slug": "combobox",
  "packageName": "@ariaui-web/combobox",
  "description": "Implementation is the source of truth. This package is a composable searchable selection primitive with: - a trigger wrapper that owns the combobox ARIA contract - a text input that drives filtering - a popup listbox ren",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-combobox",
      "defaultRole": "combobox",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    },
    {
      "name": "Button",
      "tagName": "aria-combobox-button",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-combobox-content",
      "defaultRole": "listbox",
      "defaultAttributes": {
        "aria-multiselectable": "false",
        "tabindex": "0"
      }
    },
    {
      "name": "Group",
      "tagName": "aria-combobox-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Input",
      "tagName": "aria-combobox-input",
      "defaultRole": "textbox",
      "defaultAttributes": {}
    },
    {
      "name": "Label",
      "tagName": "aria-combobox-label",
      "defaultRole": "label",
      "defaultAttributes": {}
    },
    {
      "name": "Option",
      "tagName": "aria-combobox-option",
      "defaultRole": "option",
      "defaultAttributes": {
        "aria-selected": "false"
      }
    },
    {
      "name": "Tag",
      "tagName": "aria-combobox-tag",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "TagGroup",
      "tagName": "aria-combobox-tag-group",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-combobox-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    }
  ],
  "requirementAttributes": [
    "aria-activedescendant",
    "aria-autocomplete",
    "aria-controls",
    "aria-disabled",
    "aria-expanded",
    "aria-haspopup",
    "aria-label",
    "aria-labelledby",
    "aria-multiselectable",
    "aria-selected",
    "checked",
    "data-active",
    "data-disabled",
    "data-state",
    "data-value",
    "disabled",
    "id",
    "open",
    "required",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/combobox/readme.md",
    "coverage": {
      "sourceSections": 41,
      "coveredSections": 41,
      "requirements": 247
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current implementation contract for `@ariaui-web/combobox`.",
          "Implementation is the source of truth. This package is a composable searchable selection primitive with:",
          "a trigger wrapper that owns the combobox ARIA contract",
          "a text input that drives filtering",
          "a popup listbox rendered through `@ariaui-web/portal`",
          "single-select and multi-select modes",
          "It is informed by:",
          "WAI-ARIA APG combobox guidance",
          "Radix-style composable part structure",
          "shadcn/ui-style trigger plus popup composition"
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/combobox` combines a text input with a popup listbox. Users type to filter visible options, navigate the filtered list with keyboard, and commit a value by clicking or pressing `Enter`.",
          "The current implementation is trigger-owned rather than input-owned:",
          "`Trigger` carries `role=\"combobox\"` and the open-state ARIA attributes",
          "`Input` is the filter textbox and receives `aria-activedescendant`",
          "`Content` is the popup listbox"
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Part | Element | Role / Semantic | Description",
          "Table row: `Root` | `<div>` | none | Owns selected value, input text, open state, positioning references, and disabled state",
          "Table row: `Trigger` | `<div>` | `role=\"combobox\"` | Wrapper for input and button; registers positioning anchor and exposes combobox ARIA",
          "Table row: `Input` | `<input>` | native textbox | Controlled filter input; opens listbox on typing or mouse down; forwards navigation keys to popup",
          "Table row: `Button` | `<button>` | none | Optional toggle button (`tabIndex={-1}`); opens/closes popup and returns focus to input",
          "Table row: `Content` | `<ul>` | `role=\"listbox\"` | Popup listbox rendered in portal; owns item registration, navigation, and fallback rendering",
          "Table row: `Group` | `<div>` | `role=\"group\"` | Groups related options; hides itself when none of its options are visible",
          "Table row: `Label` | `<div>` | none | Label element for a group; supplies the group's `aria-labelledby` target via auto-generated ID",
          "Table row: `Option` | `<li>` | `role=\"option\"` | Selectable listbox option; filters itself from view based on current input value",
          "Table row: `TagGroup` | `<div>` | none | Optional overflow-aware container for selected-value tags",
          "Table row: `Tag` | `<div>` | none | Passive visual tag item registered with TagGroup for overflow measurement"
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string \\ | string[]` | - | Controlled selected value",
          "Table row: `defaultValue` | `string \\ | string[]` | `\"\"` (single) / `[]` (multiple) | Initial selected value (uncontrolled)",
          "Table row: `onValueChange` | `(value: string \\ | string[]) => void` | - | Called when selection changes",
          "Table row: `inputValue` | `string` | - | Controlled filter text",
          "Table row: `defaultInputValue` | `string` | `\"\"` | Initial filter text (uncontrolled)",
          "Table row: `onInputValueChange` | `(value: string) => void` | - | Called when filter text changes",
          "Table row: `selectionMode` | `\"single\" \\ | \"multiple\"` | `\"single\"` | Selection mode",
          "Table row: `offset` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Positioning offset for popup placement",
          "Table row: `open` | `boolean` | - | Controlled open state",
          "Table row: `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled)",
          "Table row: `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes",
          "Table row: `disabled` | `boolean` | - | Disables input, button, and option interaction"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"div\"`. No custom attributes/properties."
        ]
      },
      {
        "title": "Input",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"input\"`. Consumer `onChange`, `onKeyDown`, `onFocus`, `onMouseDown` handlers are composed with internal handlers."
        ]
      },
      {
        "title": "Button",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"button\"`. Rendered with `tabIndex={-1}` and `type=\"button\"`."
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `fallback` | `Node | string` | `<div>No items found</div>` | Rendered when no options match the filter",
          "Table row: `native composition` | `boolean` | `false` | native composition host listbox attributes/properties onto a child element for custom hosts such as Framer Motion components"
        ]
      },
      {
        "title": "Group",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"div\"`. Auto-hides via `display: none` when all child options are filtered out."
        ]
      },
      {
        "title": "Label",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"div\"`. Uses auto-generated ID from parent Group unless explicit `id` attributes/properties is provided."
        ]
      },
      {
        "title": "Option",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string` | **(required)** | Value identifier for this option",
          "Table row: `disabled` | `boolean` | - | Disable this option"
        ]
      },
      {
        "title": "TagGroup",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `renderOverflow` | `(hiddenCount: number) => Node | string` | - | Custom overflow indicator; defaults to `+{count}` text"
        ]
      },
      {
        "title": "Tag",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"div\"`. Registers with TagGroup for overflow measurement on mount."
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Value State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` supports controlled and uncontrolled selected value state.",
          "Single-select:",
          "`value?: string`",
          "`defaultValue?: string`",
          "`onValueChange?: (value: string | string[]) => void`",
          "Multi-select:",
          "`value?: string[]`",
          "`defaultValue?: string[]`",
          "Selection mode:",
          "`selectionMode?: \"single\" | \"multiple\"`",
          "default: `\"single\"`"
        ]
      },
      {
        "title": "Input State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The filter text is independently controllable from the selected value:",
          "`inputValue?: string`",
          "`defaultInputValue?: string`",
          "`onInputValueChange?: (value: string) => void`",
          "Input value is provided through a separate `InputValueContext` (not part of `RootContext`).",
          "Current implementation details:",
          "input text drives filtering",
          "typing opens the popup if it is closed",
          "clearing the input shows all options",
          "selecting an option clears the input text in both single-select and multi-select flows",
          "single-select does not sync the selected label back into the input"
        ]
      },
      {
        "title": "Open State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`open?: boolean`",
          "`defaultOpen?: boolean`",
          "`onOpenChange?: (open: boolean) => void`"
        ]
      },
      {
        "title": "Other Root Props",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`offset?: { x: number; y: number }`",
          "Passed to the positioning hook for popup placement adjustment.",
          "`disabled?: boolean`",
          "Disables input, button, and option interaction."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Roles and Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current ARIA reflection is:",
          "`Trigger`",
          "`role=\"combobox\"`",
          "`aria-haspopup=\"listbox\"`",
          "`aria-expanded` (reflects open state)",
          "`aria-controls` references listbox ID **only when open** (absent when closed)",
          "`aria-disabled` (reflects disabled state)",
          "`Input`",
          "native textbox semantics",
          "`aria-autocomplete=\"list\"`",
          "`aria-activedescendant` is set dynamically to the active option ID",
          "`Content`",
          "`role=\"listbox\"`",
          "`id` (auto-generated `nodeId`)",
          "`aria-labelledby` (references `labelId`)",
          "`aria-multiselectable` (true when `selectionMode=\"multiple\"`)",
          "`aria-activedescendant` is also mirrored here dynamically",
          "`tabIndex={0}`",
          "`Button`",
          "`tabIndex={-1}`",
          "`type=\"button\"`",
          "`Option`",
          "`role=\"option\"`",
          "`aria-selected` (reflects selection state)",
          "`tabIndex` - `0` when active, `-1` otherwise; `-1` when disabled",
          "`Group`",
          "`role=\"group\"`",
          "`aria-labelledby` (references Label's ID)",
          "`Label`",
          "`id` (auto-generated from Group's `labelId`, or explicit `id` attributes/properties)"
        ]
      },
      {
        "title": "Focus Model",
        "sourceHeadingLevel": 3,
        "requirements": [
          "DOM focus stays on the input during keyboard navigation",
          "active option is tracked via `aria-activedescendant` (set on both `Input` and `Content`)",
          "opening through the button schedules focus back to the input via `requestAnimationFrame`",
          "closing the popup does not move focus elsewhere explicitly; the input typically remains focused"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Filtering",
        "sourceHeadingLevel": 3,
        "requirements": [
          "filtering is prefix-based using `value.toLowerCase().startsWith(inputValue.toLowerCase())`",
          "matching is case-insensitive",
          "empty input shows all options",
          "non-matching options stay mounted with `display: none`",
          "`Content` renders its fallback when no visible options remain",
          "groups hide themselves when none of their child options are visible"
        ]
      },
      {
        "title": "Opening and Closing",
        "sourceHeadingLevel": 3,
        "requirements": [
          "input typing opens the popup",
          "input mouse down opens the popup if it is closed",
          "input focus alone does not open the popup",
          "button mouse down toggles the popup",
          "`ArrowDown` and `ArrowUp` from the input open the popup if it is closed",
          "`Escape` closes the popup from either the input or popup navigation handler",
          "outside mouse down closes the popup (via `useClickOutside` on Root)",
          "single-select option selection closes the popup",
          "multi-select option selection keeps the popup open",
          "there is no dedicated `Tab` close handler in the current implementation"
        ]
      },
      {
        "title": "Selection",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Single-select:",
          "selecting an option updates `value`",
          "selecting a different option replaces the previous value",
          "selecting the currently selected option leaves value unchanged",
          "after selection, the input text is cleared",
          "after selection, the popup closes",
          "Multi-select:",
          "selecting an option toggles membership in the string array",
          "the popup remains open",
          "pressing `Backspace` in an empty input removes the last selected item",
          "built-in tag parts do not provide remove buttons",
          "Single-select Backspace:",
          "pressing `Backspace` in an empty input clears the selected value to `\"\"`",
          "pressing `Backspace` when input has text performs normal text deletion"
        ]
      },
      {
        "title": "Navigation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`ArrowDown` and `ArrowUp` move the active option",
          "navigation is cyclic (wraps around)",
          "disabled options are skipped",
          "`Home` moves to the first enabled option",
          "`End` moves to the last enabled option",
          "`Enter` selects the active option",
          "mouse enter highlights an option",
          "mouse leave clears active state for the hovered option",
          "active options are scrolled into view through the shared item-focus utilities"
        ]
      },
      {
        "title": "Focus Intent",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Content uses a focus intent system to determine initial active item on open:",
          "`'first'` - focus first enabled option (ArrowDown from closed)",
          "`'last'` - focus last enabled option (ArrowUp from closed)",
          "`'selected'` - focus first selected option, fallback to first (used by subtrigger ArrowRight)",
          "`'selected-last'` - focus last selected option, fallback to last (used by subtrigger)"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Data Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Option` reflects:",
          "`data-value` - the option's value string",
          "`data-active` - `true`/`false` reflecting active (highlighted) state",
          "`data-state=\"checked\" | \"unchecked\"` - reflects selection state",
          "`data-disabled` - empty string when disabled, absent otherwise",
          "The package does not currently expose `data-state=\"open\" | \"closed\"` on `Root`, `Trigger`, or `Content`."
        ]
      },
      {
        "title": "Structural Reflection",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Content` is rendered as `<ul>` by default through `Portal.Root` to `document.body`; `native composition` slots listbox attributes/properties onto a child element",
          "`Option` is rendered as `<li>`",
          "`Trigger` is the positioning anchor (`<div>` element)",
          "`Content` uses the root-generated `nodeId` for listbox identity",
          "`Label` uses the group-generated `labelId` unless an explicit `id` attributes/properties is passed",
          "`Group` auto-hides via `display: none` when all child options are filtered out"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/combobox/__test__` should cover:"
        ]
      },
      {
        "title": "Core Functionality",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Controlled and uncontrolled selected value state",
          "Controlled and uncontrolled input value state",
          "Controlled and uncontrolled open state",
          "Filtering updates visible options",
          "Single-select closes on selection and clears input text",
          "Multi-select keeps the popup open and clears input text",
          "Disabled state prevents interaction"
        ]
      },
      {
        "title": "Keyboard and Mouse Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Button mouse down toggles the popup",
          "Input mouse down opens the popup",
          "Input focus alone does not open the popup",
          "`ArrowDown` and `ArrowUp` open and navigate",
          "`Home` and `End` jump to first and last enabled options",
          "`Enter` selects the active option",
          "`Escape` closes the popup",
          "Outside click closes the popup",
          "Backspace removal behavior for empty multi-select input",
          "Single-select Backspace clearing when input is empty"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Trigger exposes combobox ARIA attributes (`role`, `aria-haspopup`, `aria-expanded`, `aria-controls`)",
          "Content exposes listbox ARIA attributes (`role`, `id`, `aria-labelledby`, `aria-multiselectable`)",
          "Input receives `aria-autocomplete=\"list\"` and `aria-activedescendant`",
          "Content also receives `aria-activedescendant`",
          "Options reflect selected and disabled state (`aria-selected`, `aria-disabled`)",
          "Groups expose `role=\"group\"` and `aria-labelledby`",
          "Label provides `aria-labelledby` target via ID",
          "Button has `tabIndex={-1}` and `type=\"button\"`",
          "No accessibility violations in the composed example"
        ]
      },
      {
        "title": "Data Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Option exposes `data-value`, `data-active`, `data-state`, `data-disabled`"
        ]
      },
      {
        "title": "Structure and Rendering",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Content` renders as `<ul>` by default through the portal to `document.body`",
          "`Option` renders as `<li>`",
          "`Root` renders as `<div>`",
          "`Trigger` renders as `<div>` with `role=\"combobox\"`",
          "`Button` renders as `<button>`",
          "Fallback renders when no options are visible",
          "Group hides when all child options are filtered out",
          "Tag overflow rendering works for `TagGroup`",
          "`Content` slots listbox attributes/properties onto a child element with `native composition`"
        ]
      },
      {
        "title": "Usage Notes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Basic Single-Select",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineComboboxElements } from \"@ariaui-web/combobox\";",
          "Code line: function BasicCombobox() {",
          "Code line: const [value, setValue] = custom element state(\"\");",
          "Code line: return (",
          "Code line: <aria-combobox value={value} onValueChange={setValue}>",
          "Code line: <aria-combobox-trigger>",
          "Code line: <aria-combobox-input placeholder=\"Select fruit...\" />",
          "Code line: <aria-combobox-button aria-label=\"Open\">v</aria-combobox-button>",
          "Code line: </aria-combobox-trigger>",
          "Code line: <aria-combobox-content fallback={<div>No items</div>}>",
          "Code line: <aria-combobox-option value=\"Apple\">Apple</aria-combobox-option>",
          "Code line: <aria-combobox-option value=\"Banana\">Banana</aria-combobox-option>",
          "Code line: </aria-combobox-content>",
          "Code line: </aria-combobox>"
        ]
      },
      {
        "title": "Multi-Select With Tags",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: function MultiSelectCombobox() {",
          "Code line: const [values, setValues] = custom element state<string[]>([]);",
          "Code line: return (",
          "Code line: <aria-combobox value={values} onValueChange={setValues} selectionMode=\"multiple\">",
          "Code line: <aria-combobox-trigger>",
          "Code line: <aria-combobox-tag-group>",
          "Code line: {values.map((value) => (",
          "Code line: <aria-combobox-tag key={value}>{value}</aria-combobox-tag>",
          "Code line: </aria-combobox-tag-group>",
          "Code line: <aria-combobox-input placeholder=\"Select frameworks...\" />",
          "Code line: <aria-combobox-button aria-label=\"Open\">v</aria-combobox-button>",
          "Code line: </aria-combobox-trigger>",
          "Code line: <aria-combobox-content>",
          "Code line: <aria-combobox-option value=\"native Web Component\">native Web Component</aria-combobox-option>",
          "Code line: <aria-combobox-option value=\"Vue\">Vue</aria-combobox-option>",
          "Code line: </aria-combobox-content>",
          "Code line: </aria-combobox>"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
