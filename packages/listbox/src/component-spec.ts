export const componentSpec = {
  "kind": "component",
  "name": "Listbox",
  "slug": "listbox",
  "packageName": "@ariaui-web/listbox",
  "description": "**Label:** - All standard HTML attributes/properties",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-listbox",
      "defaultRole": "listbox",
      "defaultAttributes": {
        "aria-multiselectable": "false",
        "tabindex": "0"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-listbox-content",
      "defaultRole": "listbox",
      "defaultAttributes": {
        "aria-multiselectable": "false",
        "tabindex": "0"
      }
    },
    {
      "name": "Group",
      "tagName": "aria-listbox-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "GroupLabel",
      "tagName": "aria-listbox-group-label",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Label",
      "tagName": "aria-listbox-label",
      "defaultRole": "label",
      "defaultAttributes": {}
    },
    {
      "name": "Option",
      "tagName": "aria-listbox-option",
      "defaultRole": "option",
      "defaultAttributes": {
        "aria-selected": "false"
      }
    },
    {
      "name": "Submenu",
      "tagName": "aria-listbox-submenu",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Viewport",
      "tagName": "aria-listbox-viewport",
      "defaultRole": "group",
      "defaultAttributes": {
        "tabindex": "0"
      }
    }
  ],
  "requirementAttributes": [
    "aria-activedescendant",
    "aria-disabled",
    "aria-labelledby",
    "aria-multiselectable",
    "aria-selected",
    "data-active",
    "data-listbox-viewport",
    "disabled",
    "open",
    "required",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/listbox/readme.md",
    "coverage": {
      "sourceSections": 11,
      "coveredSections": 11,
      "requirements": 117
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/listbox`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG listbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/listbox` is a primitive for rendering selectable option collections with shared listbox state."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root` - state container and context provider",
          "`Label` - accessible label for the listbox",
          "`Content` - container with `role=\"listbox\"` and listbox keyboard behavior",
          "`Viewport` - optional inner wrapper that caps visible height and uses **native** overflow scrolling for long lists",
          "`Option` - selectable item with role=\"option\"",
          "`Group` - grouping container with role=\"group\"",
          "`GroupLabel` - label for option groups",
          "`Listbox.Sub` - submenu container",
          "`Listbox.SubTrigger` - trigger to open submenu",
          "`Listbox.SubContent` - submenu content surface"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root coordinates shared listbox selection and active-option behavior."
        ]
      },
      {
        "title": "Props Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Root:**",
          "`value?: string | string[]` - controlled selection value",
          "`defaultValue?: string | string[]` - uncontrolled initial selection",
          "`onValueChange?: (value: string | string[]) => void` - selection change callback",
          "`selectionMode?: \"single\" | \"multiple\"` - selection mode (default: \"single\")",
          "**Label:**",
          "All standard HTML attributes/properties",
          "**Content:**",
          "All standard div attributes/properties (className, style, etc.)",
          "**Viewport:**",
          "`maxVisibleItems: number` - number of option **rows** to show before vertical scrolling; `max-height` is computed as `(height of first registered option) x maxVisibleItems`",
          "All standard div attributes/properties",
          "**Composition:** must be a descendant of `Content` (same content context as options). Typical structure: `Content` -> `Viewport` -> `Option` nodes (and optional `Group` / `GroupLabel` as needed).",
          "**Measurement:** row height is derived from the first option in DOM order after registration; uniform row height is assumed. If options differ in height, sizing may be approximate.",
          "**Option:**",
          "`value: string` - unique option value (required)",
          "`disabled?: boolean` - disables selection",
          "**Group:**",
          "**GroupLabel:**",
          "**Sub:**",
          "**SubTrigger:**",
          "**SubContent:**"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package should satisfy listbox and option semantics appropriate for selectable option collections."
        ]
      },
      {
        "title": "Keyboard Support",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Navigation:**",
          "`ArrowDown` - Move focus to next option (wraps to first)",
          "`ArrowUp` - Move focus to previous option (wraps to last)",
          "`Home` - Move focus to first option",
          "`End` - Move focus to last option",
          "**Selection:**",
          "`Enter` - Select focused option",
          "`Space` - Select focused option (toggle in multi-select mode)",
          "**Submenus:**",
          "`ArrowRight` - Open submenu and focus first item",
          "`ArrowLeft` - Close submenu and return focus to trigger",
          "`Escape` - Close submenu and return focus to trigger",
          "**Typeahead:**",
          "Type character(s) to jump to matching option (case-insensitive)"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Selection:**",
          "Single-select mode: clicking/selecting an option replaces current selection",
          "Multi-select mode: Space toggles selection, Enter adds to selection",
          "Disabled options can receive focus but cannot be selected",
          "**State Management:**",
          "Controlled mode: parent manages value via value attributes/properties",
          "Uncontrolled mode: component manages internal state via defaultValue",
          "**Focus Management:**",
          "Listbox container is focusable (tabindex=\"0\")",
          "Options receive focus during keyboard navigation",
          "aria-activedescendant tracks focused option",
          "Focus wraps around at boundaries",
          "**Viewport (scroll region):**",
          "When `Viewport` is used, it applies `max-height` and `overflow-y: auto` so overflow is scrolled with the **browser's native scrollbar**",
          "The element with `role=\"listbox\"` remains `Content`; the viewport is a non-roled wrapper inside it",
          "**Submenus:**",
          "Hover over SubTrigger opens submenu",
          "ArrowRight on SubTrigger opens submenu and focuses first item",
          "Selecting option in submenu closes submenu and returns focus to trigger",
          "ArrowLeft or Escape closes submenu",
          "**Grouping:**",
          "Groups provide semantic structure with role=\"group\"",
          "GroupLabels associate with groups via aria-labelledby",
          "**Typeahead:**",
          "Character input jumps to matching option",
          "Rapid typing accumulates characters (500ms timeout)",
          "Case-insensitive matching"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Viewport:**",
          "`data-listbox-viewport=\"\"` on the viewport element (styling / testing hook)",
          "No ARIA role on the viewport (listbox role stays on `Content`)",
          "**Listbox (Content):**",
          "`role=\"listbox\"`",
          "`tabindex=\"0\"` for keyboard focus",
          "`aria-labelledby` references Label component",
          "`aria-multiselectable=\"true\"` in multi-select mode",
          "`aria-multiselectable=\"false\"` in single-select mode",
          "`aria-activedescendant` references focused option",
          "**Options:**",
          "`role=\"option\"`",
          "`aria-selected=\"true|false\"` reflects selection state",
          "`aria-disabled=\"true\"` on disabled options",
          "`data-active=\"true|false\"` reflects hover/focus state",
          "**Groups:**",
          "`role=\"group\"`",
          "`aria-labelledby` references GroupLabel",
          "**Submenus:**",
          "SubContent visibility controlled by open state",
          "Focus management between trigger and content"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "Basic rendering of listbox, options, and labels",
          "Single-select mode selection behavior",
          "Multi-select mode selection and toggle behavior",
          "Keyboard navigation (ArrowUp/Down, Home/End, wrapping)",
          "Keyboard selection (Enter, Space)",
          "Typeahead search (single char, multi-char, case-insensitive)",
          "Disabled options (focusable but not selectable)",
          "Groups and GroupLabels with proper ARIA structure",
          "Submenu opening/closing (click, hover, keyboard)",
          "Submenu keyboard navigation (ArrowRight/Left, Escape)",
          "Focus management and aria-activedescendant",
          "Hover highlighting with data-active attribute",
          "Controlled and uncontrolled modes",
          "ARIA attributes (roles, aria-selected, aria-multiselectable, aria-disabled)",
          "Accessibility compliance (jest-axe)",
          "Optional `Viewport` max-height behavior (`maxVisibleItems`) and native overflow scrolling"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
