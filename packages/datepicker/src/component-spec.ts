export const componentSpec = {
  "kind": "component",
  "name": "Datepicker",
  "slug": "datepicker",
  "packageName": "@ariaui-web/datepicker",
  "description": "This document defines the current contract for `@ariaui-web/datepicker`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-datepicker",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Label",
      "tagName": "aria-datepicker-label",
      "defaultRole": "label",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-datepicker-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "dialog"
      }
    },
    {
      "name": "Input",
      "tagName": "aria-datepicker-input",
      "defaultRole": "textbox",
      "defaultAttributes": {
        "aria-haspopup": "dialog"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-datepicker-content",
      "defaultRole": "dialog",
      "defaultAttributes": {}
    },
    {
      "name": "Calendar",
      "tagName": "aria-datepicker-calendar",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "CalendarHeader",
      "tagName": "aria-datepicker-calendar-header",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "CalendarPrevious",
      "tagName": "aria-datepicker-calendar-previous",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false"
      }
    },
    {
      "name": "CalendarMonth",
      "tagName": "aria-datepicker-calendar-month",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "CalendarMonthSelect",
      "tagName": "aria-datepicker-calendar-month-select",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    },
    {
      "name": "CalendarYear",
      "tagName": "aria-datepicker-calendar-year",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "CalendarYearSelect",
      "tagName": "aria-datepicker-calendar-year-select",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    },
    {
      "name": "CalendarNext",
      "tagName": "aria-datepicker-calendar-next",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false"
      }
    },
    {
      "name": "CalendarBody",
      "tagName": "aria-datepicker-calendar-body",
      "defaultRole": "grid",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-expanded",
    "aria-haspopup",
    "aria-selected",
    "data-state",
    "disabled",
    "id",
    "open",
    "role",
    "selected",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/datepicker/readme.md",
    "coverage": {
      "sourceSections": 32,
      "coveredSections": 32,
      "requirements": 186
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/datepicker`.",
          "It uses:",
          "WAI-ARIA APG date picker dialog guidance as the accessibility baseline",
          "`@ariaui-web/calendar` as the date-grid and date-selection foundation",
          "`@ariaui` portal, positioning, and focus patterns for trigger/content pairing",
          "shadcn/ui as ergonomic UX guidance only, not as the public API model",
          "This package is the date-picker composition layer. It is not the calendar engine itself."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG date picker dialog example: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
          "APG date picker pattern: https://www.w3.org/WAI/ARIA/apg/patterns/datepicker/",
          "`packages/calendar/readme.md`",
          "shadcn/ui calendar docs: https://ui.shadcn.com/docs/components/calendar"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/datepicker` is a composable primitive for choosing one date or a date range through an input/trigger paired with a popup calendar surface.",
          "Ownership is split deliberately:",
          "`datepicker` owns picker open state, input/trigger coordination, formatted value reflection, popup focus behavior, and date-picker pattern semantics",
          "`calendar` owns visible month generation, date-grid keyboard movement, and single/range/dual-range date selection semantics",
          "This package should make the common date-picker pattern easy to compose without forcing consumers to wire `input`, `portal`, `position`, `focus-scope`, and `calendar` manually each time."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports a composable part structure:",
          "`Root`",
          "`Label`",
          "`Trigger`",
          "`Input`",
          "`Content`",
          "`Calendar`",
          "`Datepicker.CalendarHeader`",
          "`Datepicker.CalendarPrevious`",
          "`Datepicker.CalendarMonth`",
          "`Datepicker.CalendarMonthSelect`",
          "`Datepicker.CalendarYear`",
          "`Datepicker.CalendarYearSelect`",
          "`Datepicker.CalendarNext`",
          "`Datepicker.CalendarBody`",
          "The split `Calendar*` parts are thin wrappers around corresponding `@ariaui-web/calendar` parts and stay bound to the shared `Root` state."
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
        "title": "Open State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package supports controlled and uncontrolled open state.",
          "Current public shape:",
          "`open?: boolean`",
          "`defaultOpen?: boolean`",
          "`onOpenChange?: (open: boolean) => void`",
          "Behavior:",
          "`Root` is the source of truth for picker visibility",
          "`Trigger` toggles the picker",
          "`Escape` closes the picker",
          "outside pointer interaction closes the picker",
          "closing restores focus to the trigger by default"
        ]
      },
      {
        "title": "Value State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package supports controlled and uncontrolled value state.",
          "Current public shape:",
          "`mode?: \"single\" | \"range\" | \"dual-range\"`",
          "`value?: Date | { start?: Date; end?: Date }`",
          "`defaultValue?: Date | { start?: Date; end?: Date }`",
          "`onValueChange?: (value: Date | { start?: Date; end?: Date } | undefined) => void`",
          "Behavior by mode:",
          "in `single`, the public value is one selected `Date` or `undefined`",
          "in `range`, the public value is `{ start?: Date; end?: Date }`",
          "in `dual-range`, the public value matches the `range` value shape"
        ]
      },
      {
        "title": "Visible Month State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package supports controlled and uncontrolled visible month state.",
          "Current public shape:",
          "`visibleMonth?: Date`",
          "`defaultVisibleMonth?: Date`",
          "`onVisibleMonthChange?: (month: Date) => void`",
          "Behavior:",
          "`Root` owns the leading visible month for the embedded calendar",
          "in `dual-range`, the leading visible month controls the first pane and the second pane derives as the next month"
        ]
      },
      {
        "title": "Part Contracts",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "own shared datepicker state",
          "coordinate controlled and uncontrolled open, value, and month state",
          "provide refs and ids needed by descendants",
          "coordinate input parsing, formatting, and optional masking"
        ]
      },
      {
        "title": "Label",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "provide the visible and accessible label for the picker",
          "register the label id with shared root state for content labelling"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "open and close the picker",
          "expose picker-expanded state",
          "act as the fallback positioning reference when the input ref is unavailable"
        ]
      },
      {
        "title": "Input",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "reflect the current formatted value",
          "support editable entry for single, range, and dual-range values",
          "commit typed values on `Enter` and `blur`",
          "stay synchronized with shared root value state",
          "Input masking contract:",
          "`inputMask` is optional and enables one active preset at a time",
          "built-in presets are `mdy` (`MM/DD/YYYY`) and `iso` (`YYYY-MM-DD`)",
          "`range` and `dual-range` use one input with two masked dates separated by `-` by default",
          "built-in masks edit as fixed digit slots rather than reflowing text",
          "typed digits overwrite the current digit slot in place",
          "built-in `Backspace` and `Delete` clear digit slots in place without removing separators",
          "consumers may override typing behavior with `maskInput`",
          "`parseInput` and `formatInput` remain the commit/display hooks for value conversion"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the floating picker surface",
          "render a `<div>` by default, or slot the content attributes/properties onto a single child element when `native composition` is set",
          "support Framer Motion and other custom hosts through `native composition` while preserving dialog semantics and positioning attributes/properties",
          "compose portal, positioning, and focus management",
          "expose dialog-style semantics for the picker surface",
          "move focus into the picker on open and restore it on close"
        ]
      },
      {
        "title": "Calendar",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "compose `@ariaui-web/calendar` using the shared datepicker mode, value, and visible month",
          "normalize calendar callbacks into the public datepicker value shape",
          "keep shared root state synchronized with the embedded calendar"
        ]
      },
      {
        "title": "Datepicker.CalendarHeader",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "compose the embedded calendar header as part of the datepicker surface"
        ]
      },
      {
        "title": "Datepicker.CalendarPrevious",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "move the visible month backward through shared month state"
        ]
      },
      {
        "title": "Datepicker.CalendarMonth",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the visible month label"
        ]
      },
      {
        "title": "Datepicker.CalendarMonthSelect",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render a datepicker-owned month selector for the visible month",
          "keep selector open state coordinated with `Root`",
          "close the selector before the datepicker content when both need to dismiss"
        ]
      },
      {
        "title": "Datepicker.CalendarYear",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the visible year label"
        ]
      },
      {
        "title": "Datepicker.CalendarYearSelect",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render a datepicker-owned year selector for the visible year",
          "keep selector open state coordinated with `Root`",
          "close the selector before the datepicker content when both need to dismiss"
        ]
      },
      {
        "title": "Datepicker.CalendarNext",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "move the visible month forward through shared month state"
        ]
      },
      {
        "title": "Datepicker.CalendarBody",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the embedded calendar body",
          "in `dual-range`, render the shared two-pane body through the calendar package"
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
        "title": "APG alignment target",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package should satisfy the APG date picker dialog expectations by default:",
          "the trigger/input surface exposes `aria-haspopup=\"dialog\"`",
          "the trigger reflects expanded/open state with `aria-expanded`",
          "the popup surface exposes dialog semantics",
          "the popup is labelled by the shared picker label source",
          "focus moves into the popup when it opens",
          "`Escape` closes the popup",
          "focus returns to the trigger when the popup closes"
        ]
      },
      {
        "title": "Delegated keyboard model",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Date-grid keyboard behavior is delegated to `@ariaui-web/calendar`.",
          "This package should not redefine:",
          "day-to-day arrow navigation",
          "week jumps",
          "month/year keyboard jumps inside the grid",
          "range endpoint and in-range cell semantics"
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
        "title": "Selection and Close Behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "in `single`, selecting one date commits the new value and closes the picker by default",
          "in `range`, selecting the first endpoint updates the value to a partial range and keeps the picker open",
          "in `range`, selecting the second endpoint commits the full range and closes the picker by default",
          "in `dual-range`, the picker renders a shared two-pane range calendar through one root",
          "in `dual-range`, the picker keeps the popup open after the first endpoint and closes after the second endpoint commits the range by default",
          "when `Datepicker.CalendarMonthSelect` or `Datepicker.CalendarYearSelect` is open, outside click, trigger close, `Escape`, or date selection closes the selector first and then closes the datepicker content on the next frame",
          "clicking a month or year option inside its portaled selector updates the visible month/year without closing the datepicker content"
        ]
      },
      {
        "title": "Popup and Layering",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Content` behaves like a positioned popup surface:",
          "it portals to `document.body`",
          "it positions from the input element when available, with trigger fallback",
          "it can slot dialog, positioning, and focus attributes/properties onto a custom host with `native composition`",
          "it mounts hidden before its computed position is applied",
          "it uses `z-index: 9999` by default",
          "it remains visually above surrounding content"
        ]
      },
      {
        "title": "Input Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "mouse clicks on the input focus the field and do not toggle the popup by themselves",
          "the trigger remains the explicit popup toggle control",
          "editable input parsing does not commit invalid or partial text",
          "empty committed input clears the selected value"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Minimum expected reflection:",
          "`aria-expanded` on the trigger surface",
          "`aria-haspopup=\"dialog\"` on the trigger and input surfaces",
          "dialog role and label linkage on content",
          "`data-state=\"open\" | \"closed\"` on the trigger",
          "The embedded calendar remains responsible for date-cell state reflection such as:",
          "`aria-selected`",
          "disabled state",
          "selected state",
          "outside-month state",
          "range markers and inclusive in-range state"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/datepicker/__test__` should cover:",
          "controlled and uncontrolled open-state behavior",
          "controlled and uncontrolled value behavior",
          "controlled and uncontrolled visible month behavior",
          "trigger open and close behavior",
          "`Escape` dismissal",
          "focus movement into content on open",
          "focus restoration on close",
          "single selection commit and default close behavior",
          "range selection partial and final commit behavior",
          "dual-range shared two-pane behavior",
          "dialog semantics and label wiring",
          "editable input commit behavior for valid and invalid text",
          "built-in `mdy` and `iso` mask behavior",
          "in-place caret preservation for built-in masks",
          "selection restoration guards for unsupported input types",
          "content positioning from input with trigger fallback",
          "hidden-before-positioned popup rendering and default layering",
          "Content `native composition` slot attributes/properties onto custom hosts for Framer Motion composition",
          "datepicker-owned month/year selectors close before the datepicker content across outside click, trigger close, `Escape`, and date selection"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
