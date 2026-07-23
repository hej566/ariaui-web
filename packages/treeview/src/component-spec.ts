export const componentSpec = {
  "kind": "component",
  "name": "Treeview",
  "slug": "treeview",
  "packageName": "@ariaui-web/treeview",
  "description": "This document defines the current contract for `@ariaui-web/treeview`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-treeview",
      "defaultRole": "tree",
      "defaultAttributes": {}
    },
    {
      "name": "CheckboxItem",
      "tagName": "aria-treeview-checkbox-item",
      "defaultRole": "treeitem",
      "defaultAttributes": {
        "aria-selected": "false"
      }
    },
    {
      "name": "Group",
      "tagName": "aria-treeview-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Item",
      "tagName": "aria-treeview-item",
      "defaultRole": "treeitem",
      "defaultAttributes": {
        "aria-selected": "false"
      }
    },
    {
      "name": "Toggle",
      "tagName": "aria-treeview-toggle",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-checked",
    "aria-disabled",
    "aria-expanded",
    "aria-hidden",
    "aria-level",
    "aria-multiselectable",
    "aria-posinset",
    "aria-selected",
    "aria-setsize",
    "checked",
    "data-active",
    "data-disabled",
    "data-expanded",
    "data-selected",
    "data-state",
    "data-treeview-collapsed-branch",
    "disabled",
    "open",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/treeview/readme.md",
    "coverage": {
      "sourceSections": 20,
      "coveredSections": 20,
      "requirements": 94
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/treeview`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG treeview pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/treeview` is a hierarchical collection primitive for expandable item groups. Each item is a node in a tree; items with children can be expanded or collapsed. Focus is managed via a roving tabindex across visible items."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Part | Element | Role",
          "Table row: `Root` | `<div>` | `tree`",
          "Table row: `Item` | `<div>` | `treeitem`",
          "Table row: `CheckboxItem` | `<div>` | `treeitem`",
          "Table row: `Toggle` | `<span>` | none",
          "Table row: `Group` | `<div>` by default, slotted child with `native composition` | `group`"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` owns all shared state and distributes it through `TreeviewContext`."
        ]
      },
      {
        "title": "Expansion state",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`expanded: string[]` / `defaultExpanded: string[]` - controlled/uncontrolled list of expanded item IDs",
          "`onExpandedChange: (expanded: string[]) => void` - called when any item is expanded or collapsed",
          "Items without children are leaf nodes and never receive `aria-expanded`",
          "Items with children receive `aria-expanded=\"true\"` when expanded, `aria-expanded=\"false\"` when collapsed"
        ]
      },
      {
        "title": "Selection state",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`value: string | string[]` / `defaultValue` - controlled/uncontrolled selected item ID(s)",
          "`onValueChange` - called on selection change",
          "`multiSelect: boolean` - enables multi-item selection; reflected as `aria-multiselectable=\"true\"` on the root; omitted when false",
          "In a parent `Item`, `Toggle` toggles expansion on pointer click. Clicking the rest of the row toggles selection without expanding or collapsing.",
          "`CheckboxItem` derives its checked state from the same selection state. Parent `CheckboxItem` nodes compute their state from descendant `CheckboxItem` values: all descendants checked means checked, some descendants checked means mixed, and no descendants checked means unchecked.",
          "After any `CheckboxItem` toggle, checked branch values are recomputed up the ancestor chain: fully checked branches include the parent value, and partial or unchecked branches remove it.",
          "In a parent `CheckboxItem`, `Toggle` toggles expansion on pointer click. Clicking the rest of the row toggles checked state without expanding or collapsing."
        ]
      },
      {
        "title": "Focus state (internal)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "A single item holds `tabIndex={0}` at any time (roving tabindex); all others are `tabIndex={-1}`",
          "`focusedId` tracks which item has roving focus; initialized to the first visible item on first interaction",
          "Moving focus updates `tabIndex` only. It does not update `data-selected`, `data-state`, or `data-active`; only explicit selection interactions update selection state"
        ]
      },
      {
        "title": "ARIA Attribute Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `role` | `tree`",
          "Table row: `aria-multiselectable` | `\"true\"` when `multiSelect`; omitted otherwise"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `role` | `treeitem`",
          "Table row: `aria-selected` | `\"true\"` / `\"false\"`",
          "Table row: `aria-expanded` | `\"true\"` / `\"false\"` when item has children; omitted on leaf nodes",
          "Table row: `aria-disabled` | `\"true\"` when disabled; omitted otherwise",
          "Table row: `aria-level` | integer depth (1 at root, incremented per nested `Group`)",
          "Table row: `tabIndex` | `0` when focused; `-1` otherwise"
        ]
      },
      {
        "title": "CheckboxItem",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `role` | `treeitem`",
          "Table row: `aria-checked` | `\"true\"` when checked or when all descendant `CheckboxItem` nodes are checked, `\"mixed\"` when some descendants are checked, `\"false\"` otherwise",
          "Table row: `aria-selected` | `\"true\"` / `\"false\"`",
          "Table row: `aria-expanded` | `\"true\"` / `\"false\"` when item has children; omitted on leaf nodes",
          "Table row: `aria-disabled` | `\"true\"` when disabled; omitted otherwise",
          "Table row: `aria-level` | integer depth (1 at root, incremented per nested `Group`)",
          "Table row: `tabIndex` | `0` when focused; `-1` otherwise",
          "Table row: `data-state` | `\"checked\"` / `\"unchecked\"` / `\"indeterminate\"`"
        ]
      },
      {
        "title": "Toggle",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `data-state` | `\"open\"` / `\"closed\"` when the owning item has children",
          "Table row: `data-expanded` | `\"true\"` / `\"false\"` when the owning item has children",
          "Table row: `data-disabled` | present when the owning item is disabled"
        ]
      },
      {
        "title": "Group",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `role` | `group`",
          "Table row: `data-expanded` | `\"true\"` / `\"false\"` when the group is animation-mounted with `native composition` or legacy `forceMount` under an owning item",
          "Table row: `data-treeview-collapsed-branch` | present when an animation-mounted group is collapsed",
          "Table row: `aria-hidden` | `\"true\"` when an animation-mounted group is collapsed",
          "Table row: Prop | Type | Default | Description",
          "Table row: `native composition` | `boolean` | `false` | Slots group attributes/properties onto a single child element and keeps the group outside the default hidden wrapper so animation libraries can measure and animate collapsed content. This is the preferred animation interop path.",
          "Table row: `forceMount` | `boolean` | `false` | Keeps the default `<div role=\"group\">` mounted outside the hidden wrapper for compatibility with earlier animation usage. Prefer `native composition` for new animated groups."
        ]
      },
      {
        "title": "Keyboard Interaction Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "All keyboard handling is on the `Root` element.",
          "Table row: Key | Behavior",
          "Table row: `ArrowDown` | Moves focus to the next visible item",
          "Table row: `ArrowUp` | Moves focus to the previous visible item",
          "Table row: `ArrowRight` | On collapsed item with children: expands it. On expanded item or leaf: no-op",
          "Table row: `ArrowLeft` | On expanded item: collapses it. On collapsed/leaf item: moves focus to parent item. At root level: no-op",
          "Table row: `Home` | Moves focus to the first visible item in the tree",
          "Table row: `End` | Moves focus to the last visible item in the tree",
          "Table row: `Enter` | In single-select mode, expands/collapses parent items without selecting them and toggles leaf selection. In multi-select mode, adds the focused item to the selection",
          "Table row: `Space` | In single-select mode, expands/collapses parent items without selecting them and toggles leaf selection. In multi-select mode, toggles the focused item; `Shift+Space` extends the range",
          "Table row: `Enter` / `Space` on `CheckboxItem` | Toggles checked state without expanding or collapsing. On parent checkbox items, toggles all descendant checkbox items with it",
          "Table row: Pointer click on `Toggle` inside `Item` or `CheckboxItem` | Toggles expansion without changing selection or checked state",
          "Table row: `Ctrl+A` | Selects all visible items (multi-select only)",
          "Table row: Printable char | Typeahead: moves focus to the next item whose label starts with the typed character; buffer clears after 500 ms"
        ]
      },
      {
        "title": "Visibility Invariant",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Items inside a collapsed `Group` are not visible and must be skipped by keyboard navigation",
          "Default groups are rendered inside the owning item hidden branch wrapper while collapsed",
          "Animation-mounted groups created with `native composition` or legacy `forceMount` stay mounted and use `data-treeview-collapsed-branch` so keyboard navigation still skips collapsed descendants while CSS or animation libraries control visual collapse"
        ]
      },
      {
        "title": "Disabled Behavior",
        "sourceHeadingLevel": 2,
        "requirements": [
          "When `disabled` is set on `Root`, all keyboard and pointer interaction is suppressed",
          "When `disabled` is set on an individual `Item`, that item cannot be focused, selected, or expanded via interaction"
        ]
      },
      {
        "title": "Controlled / Uncontrolled",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`expanded` + `onExpandedChange` - controlled expansion",
          "`defaultExpanded` - uncontrolled expansion initial state",
          "`value` + `onValueChange` - controlled selection",
          "`defaultValue` - uncontrolled selection initial state",
          "Mixing controlled and uncontrolled attributes/properties for the same state slice is not supported"
        ]
      },
      {
        "title": "Known Issues / Limitations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`aria-setsize` and `aria-posinset` are not currently computed; AT users will not know item count within a group",
          "Typeahead traverses currently visible items only and does not discover collapsed descendants"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "**Structure**: `Root`, `Item`, `Group` render with correct roles and ARIA attributes; `aria-level` is correct at each nesting depth",
          "**Expansion**: expand and collapse via `Toggle`, `ArrowRight`/`ArrowLeft`, and single-select parent activation; `aria-expanded` absent on leaf items",
          "**Keyboard navigation**: ArrowDown/Up traverse visible items; ArrowRight expands collapsed parents without moving focus; ArrowLeft collapses then moves to parent; Home/End jump to boundaries",
          "**Selection - single**: Space/Enter toggles leaf item selection; parent activation toggles expansion without selection; navigation does not select",
          "**Selection - multi**: `multiSelect` enables multiple selected items; `Ctrl+A` selects all",
          "**Checkbox item**: `CheckboxItem` exposes `aria-checked`, `data-state`, and toggles checked state through root selection",
          "**Typeahead**: printable key moves focus to matching item; buffer clears after 500 ms",
          "**Visibility invariant**: collapsed group hides descendants from navigation",
          "**Animation-mounted groups**: `native composition` slots group attributes onto the animation element, keeps collapsed descendants mounted, and still removes them from keyboard navigation; legacy `forceMount` keeps the same collapsed branch attributes",
          "**Disabled**: all interaction is suppressed when `disabled` is set on Root or Item",
          "**Controlled/uncontrolled**: `expanded`/`onExpandedChange` and `value`/`onValueChange` behave correctly"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/treeview/__test__/edge_cases.test.tsx",
      "../ariaui/packages/treeview/__test__/enter_toggle.test.tsx",
      "../ariaui/packages/treeview/__test__/expand_trigger.test.tsx",
      "../ariaui/packages/treeview/__test__/interaction_refinements.test.tsx",
      "../ariaui/packages/treeview/__test__/keyboard_interactions.test.tsx",
      "../ariaui/packages/treeview/__test__/keyboard_nav.test.tsx",
      "../ariaui/packages/treeview/__test__/more_edge_cases.test.tsx",
      "../ariaui/packages/treeview/__test__/multiselect.test.tsx",
      "../ariaui/packages/treeview/__test__/performance.test.tsx",
      "../ariaui/packages/treeview/__test__/shift_click_expansion.test.tsx",
      "../ariaui/packages/treeview/__test__/store.test.tsx",
      "../ariaui/packages/treeview/__test__/treeview.test.tsx"
    ],
    "sourceTestCases": 88,
    "nativeRequirements": [
      "Root, Item, CheckboxItem, Group, and Toggle expose source-equivalent tree semantics, hierarchy, expansion, selection, and state attributes",
      "roving focus traverses visible enabled items without changing selection and supports arrows, boundaries, sibling expansion, and buffered typeahead",
      "single selection reserves parent activation for expansion while multi-selection supports additive, range, and select-all interaction",
      "checkbox branches derive checked and indeterminate state recursively and update descendant and ancestor values",
      "controlled and uncontrolled expanded and selected values emit cancelable change events and preserve mounted collapsed branches",
      "docs provide the source Base, Advanced multi-select, Advanced controlled, and Framer Motion examples with equivalent page structure and styling"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
