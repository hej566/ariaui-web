export const componentSpec = {
  "kind": "component",
  "name": "Table",
  "slug": "table",
  "packageName": "@ariaui-web/table",
  "description": "This package follows the native HTML table model as the semantic baseline and provides minimally styled structural parts for composition.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-table",
      "defaultRole": "table",
      "defaultAttributes": {}
    },
    {
      "name": "Body",
      "tagName": "aria-table-body",
      "defaultRole": "rowgroup",
      "defaultAttributes": {}
    },
    {
      "name": "Caption",
      "tagName": "aria-table-caption",
      "defaultRole": "caption",
      "defaultAttributes": {}
    },
    {
      "name": "Cell",
      "tagName": "aria-table-cell",
      "defaultRole": "cell",
      "defaultAttributes": {}
    },
    {
      "name": "ColumnHeader",
      "tagName": "aria-table-column-header",
      "defaultRole": "columnheader",
      "defaultAttributes": {}
    },
    {
      "name": "Footer",
      "tagName": "aria-table-footer",
      "defaultRole": "rowgroup",
      "defaultAttributes": {}
    },
    {
      "name": "Header",
      "tagName": "aria-table-header",
      "defaultRole": "rowgroup",
      "defaultAttributes": {}
    },
    {
      "name": "Row",
      "tagName": "aria-table-row",
      "defaultRole": "row",
      "defaultAttributes": {}
    },
    {
      "name": "RowHeader",
      "tagName": "aria-table-row-header",
      "defaultRole": "rowheader",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-colcount",
    "aria-rowcount",
    "aria-selected",
    "aria-sort",
    "id",
    "open",
    "required",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/table/readme.md",
    "coverage": {
      "sourceSections": 12,
      "coveredSections": 12,
      "requirements": 61
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Normative behavior and API contract for `@ariaui-web/table`.",
          "This package follows the native HTML table model as the semantic baseline and provides minimally styled structural parts for composition.",
          "Source references:",
          "HTML table model: https://html.spec.whatwg.org/multipage/tables.html",
          "WAI-ARIA `table` role reference (informative): https://www.w3.org/WAI/ARIA/apg/patterns/table/",
          "This package currently exposes:",
          "`Root`",
          "`Header`",
          "`Body`",
          "`Row`",
          "`Cell`",
          "`ColumnHeader`",
          "`RowHeader`",
          "`Caption`"
        ]
      },
      {
        "title": "Structure and Roles",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` renders a scroll wrapper (`div`) and an inner native `<table>` element.",
          "`Header` renders native `<thead>`.",
          "`Body` renders native `<tbody>`.",
          "`Row` renders native `<tr>`.",
          "`Cell` renders native `<td>`.",
          "`ColumnHeader` renders native `<th>` for column header semantics.",
          "`RowHeader` renders native `<th>` with default `scope=\"row\"`.",
          "`Caption` renders native `<caption>`.",
          "Native table semantics come from the rendered HTML elements; this package does not replace the native model with composite ARIA roles."
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package is structural and presentation-oriented.",
          "It does not own sorting, filtering, pagination, selection, expansion, or row action state.",
          "It does not provide internal open/closed or active-item state."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "All parts forward refs to their native HTML element.",
          "All parts accept and spread native element attributes/properties.",
          "All parts pass consumer `className` through to their native HTML element unchanged.",
          "`Root` always wraps the table in an overflow container for horizontal scrolling.",
          "`RowHeader` defaults `scope` to `\"row\"` unless overridden by the consumer.",
          "Higher-level behavior (sorting toggles, selection controls, row click actions, etc.) is consumer-owned."
        ]
      },
      {
        "title": "Styling Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package is intentionally minimally styled.",
          "`Root` applies inline overflow-wrapper layout styles to its internal wrapper `div`.",
          "Public table parts otherwise leave visual styling to consumers.",
          "Consumer `style` and `className` are passed through to the rendered HTML element unchanged."
        ]
      },
      {
        "title": "Keyboard Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "No custom keyboard interaction is implemented by this package.",
          "Keyboard behavior is native browser behavior for semantic table elements.",
          "Any enhanced keyboard UX beyond native behavior is consumer-owned."
        ]
      },
      {
        "title": "Pointer Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "No custom pointer event logic is implemented by this package.",
          "Click handling and row-level interactions are consumer-owned."
        ]
      },
      {
        "title": "State and Data Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Native element semantics must remain intact when composing parts (`table`, `thead`, `tbody`, `tr`, `th`, `td`, `caption`).",
          "This package does not set `aria-sort`, `aria-selected`, `aria-rowcount`, `aria-colcount`, or similar stateful ARIA attributes.",
          "Consumers implementing interactive table patterns are responsible for adding and synchronizing required ARIA/data attributes."
        ]
      },
      {
        "title": "Consumer Handler Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Consumer event handlers are authoritative for interaction behavior.",
          "Because this package does not implement internal interaction state, there are no internal state handlers to override."
        ]
      },
      {
        "title": "HTML and ARIA Mapping Notes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "HTML table semantics are the normative baseline for this package.",
          "ARIA table/grid patterns are only relevant when consumers layer additional interactive behaviors.",
          "If consumers implement rich interactions resembling a grid, consumers must provide the required ARIA semantics and keyboard handling."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests in `packages/table/__test__` should cover at least:",
          "Exported-part composition for all public parts (`Root`, `Header`, `Body`, `Row`, `Cell`, `ColumnHeader`, `RowHeader`, `Caption`).",
          "Native semantic roles from composed structure (`table`, `columnheader`, `rowheader`, `cell`, and caption text).",
          "`RowHeader` default `scope=\"row\"` and explicit override behavior.",
          "Ref forwarding for each exported part.",
          "Consumer attributes/properties spreading onto each part (for example `id`, `data-*`, event handlers).",
          "`Root` wrapper presence and table rendering inside the overflow container.",
          "Consumer `className` and `style` pass-through behavior for rendered table parts."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec",
          "Table unit tests",
          "Docs/examples when table behavior or composition guidance is documented"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
