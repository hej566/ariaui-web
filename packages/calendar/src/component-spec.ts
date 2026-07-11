export const componentSpec = {
  "kind": "component",
  "name": "Calendar",
  "slug": "calendar",
  "packageName": "@ariaui-web/calendar",
  "description": "It uses: 1. WAI-ARIA APG calendar/date-picker grid guidance as the accessibility baseline 2. `@ariaui-web/grid` as the structural and semantic foundation 3. shadcn/ui calendar as the higher-level reference for date-selection",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-calendar",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Header",
      "tagName": "aria-calendar-header",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "HeaderPrevious",
      "tagName": "aria-calendar-header-previous",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "HeaderMonth",
      "tagName": "aria-calendar-header-month",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "HeaderYear",
      "tagName": "aria-calendar-header-year",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "HeaderNext",
      "tagName": "aria-calendar-header-next",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "Body",
      "tagName": "aria-calendar-body",
      "defaultRole": "grid",
      "defaultAttributes": {}
    },
    {
      "name": "Head",
      "tagName": "aria-calendar-head",
      "defaultRole": "rowgroup",
      "defaultAttributes": {}
    },
    {
      "name": "Row",
      "tagName": "aria-calendar-row",
      "defaultRole": "row",
      "defaultAttributes": {}
    },
    {
      "name": "DayHeader",
      "tagName": "aria-calendar-day-header",
      "defaultRole": "columnheader",
      "defaultAttributes": {}
    },
    {
      "name": "Rows",
      "tagName": "aria-calendar-rows",
      "defaultRole": "rowgroup",
      "defaultAttributes": {}
    },
    {
      "name": "Cell",
      "tagName": "aria-calendar-cell",
      "defaultRole": "gridcell",
      "defaultAttributes": {}
    },
    {
      "name": "MonthSelect",
      "tagName": "aria-calendar-month-select",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "YearSelect",
      "tagName": "aria-calendar-year-select",
      "defaultRole": "button",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-disabled",
    "aria-selected",
    "data-attribute",
    "data-in-range",
    "data-outside-month",
    "data-range-end",
    "data-range-start",
    "data-selected",
    "data-slot",
    "data-today",
    "data-week-end",
    "data-week-start",
    "disabled",
    "role",
    "selected",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/calendar/readme.md",
    "coverage": {
      "sourceSections": 26,
      "coveredSections": 26,
      "requirements": 207
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the intended grid-backed contract for `@ariaui-web/calendar`.",
          "It uses:",
          "WAI-ARIA APG calendar/date-picker grid guidance as the accessibility baseline",
          "`@ariaui-web/grid` as the structural and semantic foundation",
          "shadcn/ui calendar as the higher-level reference for date-selection behavior",
          "Radix only as general composition guidance",
          "This spec intentionally replaces the old render-attributes/properties-heavy calendar model.",
          "`Cell` reflects `aria-disabled`, `aria-selected`, `data-selected`, `data-today`, `data-outside-month`, `data-week-start`, `data-week-end`, `data-range-start`, `data-range-end`, and `data-in-range`.",
          "Calendar parts expose `data-slot` names for Root, Header, HeaderPrevious, HeaderMonth, HeaderYear, HeaderNext, Body, Head, Row, DayHeader, Rows, Cell, MonthSelect, and YearSelect."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG date picker dialog example: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
          "`@ariaui-web/grid` entrypoint: `packages/grid/index.tsx`",
          "shadcn/ui calendar docs: https://ui.shadcn.com/docs/components/calendar",
          "Radix UI Themes components index: https://www.radix-ui.com/themes/docs/components"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/calendar` is a date-selection layer built on top of `@ariaui-web/grid`.",
          "Ownership is split deliberately:",
          "`grid` owns table/grid structure, `role=\"grid\"`, `role=\"gridcell\"`, and baseline grid navigation behavior",
          "`calendar` owns month generation, weekday labeling, visible outside-month days, single/range/dual-range date selection, disabled/marked date state, and calendar-specific month/year movement",
          "This package is not a dialog/date-input primitive. It is a calendar-grid primitive for composing date selection UIs."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports a grid-shaped calendar composition model:",
          "`Root`",
          "`Header`",
          "`Body`",
          "`Row`",
          "`Cell`",
          "Calendar may also export associated types for those parts.",
          "The previous public shape is intentionally retired:",
          "`Calendar.Days`",
          "`Calendar.Day`",
          "`Calendar.Dates`",
          "`Calendar.DateCell`",
          "render-attributes/properties month matrix injection through `Header` and `Dates`"
        ]
      },
      {
        "title": "Root Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` owns calendar state and configuration.",
          "Normative responsibilities:",
          "initialize the current visible month view",
          "optionally support a controlled visible month through `visibleMonth` and `onVisibleMonthChange`",
          "support `single`, `range`, and `dual-range` selection modes",
          "optionally support controlled selection through `selectedDates`",
          "expose selection changes through calendar-specific callbacks",
          "provide calendar state to descendants",
          "compose `grid` internally instead of reimplementing grid structure",
          "Current public direction:",
          "`mode` should be constrained to `\"single\" | \"range\" | \"dual-range\"`",
          "`defaultDates` initializes selection state",
          "`selectedDates` controls the selected calendar value when provided",
          "`onValueChange` emits selected dates",
          "`visibleMonth` controls the currently displayed month when provided",
          "`onVisibleMonthChange` emits month changes from header controls and keyboard month/year jumps",
          "controlled `selectedDates` and `visibleMonth` should be sufficient to coordinate multiple synchronized calendar views in consumer code, such as a dual-month range picker",
          "consumer API should not require manual date-matrix render attributes/properties for standard usage",
          "in `dual-range`, one shared `Root` owns the normalized range across both panes",
          "in `dual-range`, `visibleMonth` controls only the leading pane month and the trailing pane derives as the following month",
          "in `dual-range`, one `Body` remains the public entry point and renders both panes automatically"
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
        "title": "Header",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Calendar-specific part.",
          "Responsibilities:",
          "render the current month/year label",
          "provide previous/next month navigation controls",
          "act as the layout container for composed header subparts",
          "in dual-range mode, support pane-local navigation against the shared leading visible month while preserving consecutive months",
          "`Header` remains calendar-owned because grid does not know anything about month state or date navigation.",
          "Composed header contract:",
          "when `children` is omitted, `Header` renders the built-in previous button, month/year label, and next button",
          "when `children` is provided, `Header` renders only those children",
          "the outer wrapper still accepts normal `div` attributes/properties such as `className`"
        ]
      },
      {
        "title": "HeaderPrevious",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Calendar-specific navigation part.",
          "Responsibilities:",
          "render a previous-month button",
          "decrement `visibleMonth` through shared calendar context",
          "preserve compatibility with controlled `visibleMonth` by routing changes through the shared month setter"
        ]
      },
      {
        "title": "HeaderMonth",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Calendar-specific label part.",
          "Responsibilities:",
          "render the current visible month label from shared calendar context"
        ]
      },
      {
        "title": "HeaderYear",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Calendar-specific label part.",
          "Responsibilities:",
          "render the current visible year label from shared calendar context"
        ]
      },
      {
        "title": "HeaderNext",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Calendar-specific navigation part.",
          "Responsibilities:",
          "render a next-month button",
          "increment `visibleMonth` through shared calendar context",
          "preserve compatibility with controlled `visibleMonth` by routing changes through the shared month setter"
        ]
      },
      {
        "title": "Body",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Grid-backed structural part.",
          "Responsibilities:",
          "compose `Grid.Root` and/or `Grid.Body` semantics directly",
          "own the calendar grid container",
          "render a fixed six-week visible month grid with outside-month spillover days",
          "ensure APG-style calendar grid semantics are present by construction rather than by consumer convention",
          "in `dual-range` mode, render both month panes automatically from a single `Body`",
          "in `dual-range` mode, include one header and one grid per pane",
          "Dual-range body contract:",
          "pane one renders the leading `visibleMonth`",
          "pane two renders `addMonths(visibleMonth, 1)`",
          "each pane keeps its own month/year label",
          "pane one renders the shared previous control",
          "pane two renders the shared next control",
          "a single `Body` remains the public API entry point even though it renders two panes internally",
          "consumers should not need to compose or synchronize two separate roots or bodies for standard dual-range usage"
        ]
      },
      {
        "title": "Row",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Grid-backed structural part.",
          "Responsibilities:",
          "compose `Grid.Row`",
          "represent either a weekday header row or a week-of-dates row depending on usage"
        ]
      },
      {
        "title": "Cell",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Calendar-specific wrapper over `Grid.Cell`.",
          "Responsibilities:",
          "render an individual date cell",
          "carry date metadata and selection flags",
          "expose disabled, marked, selected, range-start, range-end, and in-range state",
          "treat `selected` as the package-wide selected-date highlight hook in every mode",
          "treat `in-range` as inclusive of the selected range endpoints, while still exposing `range-start` and `range-end` as separate endpoint markers",
          "preserve true grid-cell semantics through the shared grid primitive",
          "provide an internal content wrapper as a styling surface for advanced visual treatments such as range endpoint pills, without changing the public API",
          "expose stable `data-slot` hooks on the outer cell and inner content wrapper so consumers can implement shadcn-style visuals without DOM post-processing",
          "Unlike the old `DateCell`, the new `Cell` owns its semantics directly rather than relying on a consumer-supplied child with `role=\"button\"`."
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
          "The grid-backed redesign should satisfy the core APG calendar-grid expectations by default:",
          "grid semantics come from the shared grid primitive",
          "only one date cell is in the tab sequence at a time",
          "`Right Arrow` moves focus to the next day. If that crosses the end of a displayed week, focus lands on the first day of the next week. If the focused date is the last day of the visible month, focus moves to the first day of the next month and the visible month updates",
          "`Left Arrow` moves focus to the previous day. If that crosses the start of a displayed week, focus lands on the last day of the previous week. If the focused date is the first day of the visible month, focus moves to the last day of the previous month and the visible month updates",
          "`Down Arrow` moves focus to the same day of the next week",
          "`Up Arrow` moves focus to the same day of the previous week",
          "`Home` and `End` move to the start and end of the current week",
          "`Page Up` and `Page Down` move by month and restore focus to the same day number in the target month",
          "if the target month does not contain that day number, focus moves to the last day of the target month",
          "`Shift + Page Up` and `Shift + Page Down` apply the same focus rule across years",
          "selected state is exposed through ARIA and synchronized data attributes",
          "in `dual-range`, month changes caused by cross-boundary focus movement update the shared leading visible month while preserving the consecutive two-pane window"
        ]
      },
      {
        "title": "Calendar-specific additions",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Because this package is date-aware, it must also ensure:",
          "disabled dates cannot be activated",
          "today/current-date state can be visually reflected",
          "range state can be reflected consistently across contiguous dates",
          "outside-month spillover dates remain visible as muted calendar days",
          "externally controlled visible-month state stays synchronized with header buttons and keyboard month/year navigation"
        ]
      },
      {
        "title": "Grid Integration Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/calendar` must use `@ariaui-web/grid` directly rather than duplicating its semantics.",
          "Required integration rules:",
          "`Body` must not render a plain `table` without grid semantics",
          "`Cell` must not reimplement generic gridcell semantics already provided by `Grid.Cell`",
          "generic row/cell focus behavior should come from `grid`",
          "calendar should layer only date-specific behavior on top",
          "Allowed calendar-specific overrides:",
          "month/year jumps",
          "date selection activation",
          "date metadata/state reflection",
          "range preview and range commit behavior"
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
        "title": "Single mode",
        "sourceHeadingLevel": 3,
        "requirements": [
          "exactly one selected date",
          "activating a date updates the selected date",
          "the callback shape should reflect calendar selection clearly"
        ]
      },
      {
        "title": "Range mode",
        "sourceHeadingLevel": 3,
        "requirements": [
          "two endpoints define the range",
          "after the first activation, the pending start date is still selected and should remain highlightable through `data-selected`",
          "interim hover/focus preview may extend the visible range before final selection",
          "committing a new start date after a complete range begins a fresh range",
          "when range state is controlled externally, multiple synchronized calendar views should be able to behave like one shared range picker",
          "range endpoints should remain normalized as `[start, end]` regardless of which month pane emitted the selection change",
          "`in-range` includes both endpoints as well as interior dates in the committed range",
          "`range-start` and `range-end` remain separate endpoint-specific markers for targeted styling and semantics"
        ]
      },
      {
        "title": "Dual-range mode",
        "sourceHeadingLevel": 3,
        "requirements": [
          "one root renders a shared two-pane range picker",
          "the panes always represent consecutive months",
          "the first pane uses the leading visible month and the second pane uses the following month",
          "one `Body` renders both panes automatically",
          "after the first activation, the pending start date is still selected and should remain highlightable through `data-selected`",
          "each pane has its own current month/year label",
          "the previous control on the first pane shifts the leading month backward by one",
          "the next control on the second pane shifts the leading month forward by one",
          "pane one does not render a next control and pane two does not render a previous control",
          "controls that would collapse both panes onto the same month must be blocked or normalized so the panes remain consecutive",
          "date selection behaves like range mode but spans both panes automatically",
          "emitted values remain normalized as `[start, end]`",
          "`selectedDates` controls the shared dual-range value when provided",
          "`visibleMonth` controls only the leading pane month when provided",
          "endpoint cells in the shared range also expose `in-range`, in addition to their start/end marker",
          "consumers should not need to compose two roots or two bodies to get the standard dual-range behavior",
          "The redesign should keep range support, but the public composition should no longer depend on `where=\"from\"` and `where=\"to\"` render-attributes/properties plumbing from the old implementation."
        ]
      },
      {
        "title": "State Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The redesign should expose state through both ARIA and data attributes where appropriate.",
          "Minimum expected reflection:",
          "`aria-selected`",
          "disabled semantics",
          "selected state, including a pending single endpoint in range-capable modes",
          "today/current-date state",
          "outside-month state",
          "range start",
          "range end",
          "inclusive in-range state, including both range endpoints and interior dates",
          "stable `data-slot` hooks for header, body, row, cell, and inner cell content",
          "Custom `data-*` attributes may still be used for styling hooks, but they must not replace necessary ARIA state."
        ]
      },
      {
        "title": "Current Differences From shadcn",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Even after the redesign, this package is still not intended to become a shadcn `react-day-picker` wrapper.",
          "It may still differ by:",
          "exposing low-level parts instead of a single styled component",
          "using `grid` as its semantic foundation",
          "omitting high-level DayPicker configuration APIs such as locale, caption layout, formatter injection, and time-zone support unless explicitly implemented later"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/calendar/__test__/calendar.test.tsx` should validate at minimum:",
          "Grid-backed root/body/cell semantics, including a fixed visible month grid with outside-month days.",
          "Calendar header navigation behavior, including composed custom header parts.",
          "Single-date selection behavior.",
          "Range selection behavior.",
          "Disabled date handling.",
          "APG-style keyboard navigation including day/week movement.",
          "Month navigation via `PageUp` / `PageDown`, including same-day focus restoration and end-of-month fallback.",
          "Year navigation via `Shift + PageUp` / `Shift + PageDown`, including same-day focus restoration and end-of-month fallback.",
          "ARIA and data-attribute synchronization for selection state, including inner-wrapper styling hooks.",
          "Controlled visible-month behavior via `visibleMonth` and `onVisibleMonthChange`.",
          "Controlled range selection behavior via `selectedDates`, including synchronized multi-pane composition.",
          "Dual-range mode automatic two-pane rendering from a single `Body`.",
          "Dual-range pane navigation behavior, including the consecutive-month invariant.",
          "Dual-range controlled `visibleMonth` and `selectedDates` behavior through one shared root and one shared body."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec file.",
          "Unit tests for this package.",
          "Docs examples and visual interaction tests when present."
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/calendar/__test__/calendar.test.tsx",
      "../ariaui/web/doc/src/app/docs/components/calendar/page.md",
      "../ariaui/web/doc/src/markdoc/partials/calendar/examples.md"
    ],
    "sourceTestCases": 28,
    "nativeRequirements": [
      "Root owns single, range, and dual-range date selection state with default dates, selected dates, visible month, valuechange, and visiblemonthchange behavior",
      "Header, HeaderPrevious, HeaderMonth, HeaderYear, and HeaderNext expose source-equivalent month navigation and labelling",
      "Body renders a six-week grid-backed month view with weekday headers, outside-month spillover days, and dual-range consecutive panes",
      "Head, Rows, DayHeader, Row, and Cell provide namespaced manual-grid composition without requiring consumers to import grid directly",
      "Cell exposes role=\"gridcell\", date metadata, aria-selected, aria-disabled, data-selected, data-today, data-outside-month, data-week-start, data-week-end, data-range-start, data-range-end, and data-in-range",
      "Cell keyboard interaction supports arrows, Home, End, PageUp, PageDown, Shift+PageUp, Shift+PageDown, Enter, and Space using APG calendar-grid focus rules",
      "MonthSelect and YearSelect update the visible month through calendar-owned selector controls",
      "docs examples include Single, Range, Manual Grid, Dual Range, and Month/Year Selector variants with source-equivalent calendar page structure"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
