export const componentSpec = {
  "kind": "component",
  "name": "Radio",
  "slug": "radio",
  "packageName": "@ariaui-web/radio",
  "description": "An accessible radio group with controlled or uncontrolled selection, roving focus, disabled state, and native form integration.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-radio",
      "defaultRole": "radiogroup",
      "defaultAttributes": {}
    },
    {
      "name": "Item",
      "tagName": "aria-radio-item",
      "defaultRole": "radio",
      "defaultAttributes": {}
    },
    {
      "name": "Indicator",
      "tagName": "aria-radio-indicator",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-activedescendant",
    "aria-checked",
    "aria-disabled",
    "checked",
    "data-disabled",
    "data-state",
    "disabled",
    "id",
    "required",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/radio/readme.md",
    "coverage": {
      "sourceSections": 11,
      "coveredSections": 11,
      "requirements": 70
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/radio`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG radio group pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
          "Radix radio group docs: https://www.radix-ui.com/primitives/docs/components/radio-group"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/radio` is a button-based radio group with roving focus.",
          "The package owns:",
          "group selection state",
          "keyboard movement between items",
          "checked-state reflection",
          "optional hidden form input emission when an item is named",
          "It does not render native visible radio inputs."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`Item`",
          "`Indicator`"
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
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` supports controlled and uncontrolled selection state.",
          "Current public shape:",
          "`value?: string`",
          "`defaultValue?: string`",
          "`onValueChange?: (value: string) => void`",
          "`disabled?: boolean`",
          "normal `div` attributes/properties",
          "Behavior:",
          "when `value` is provided, selection is controlled",
          "when `value` is omitted, selection is initialized from `defaultValue`",
          "`disabled` applies group-wide disabled state",
          "roving tabindex state is coordinated at the root"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current public shape:",
          "`value: string`",
          "`disabled?: boolean`",
          "`name?: string`",
          "`required?: boolean`",
          "normal button attributes/properties except `value`",
          "Behavior:",
          "item disabled state is the union of group disabled state and item disabled state",
          "clicking an enabled item selects it",
          "the selected item receives focus after click",
          "when `name` is provided, the item emits a hidden input for form submission"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package should satisfy the core APG radio expectations:",
          "`Root` renders `role=\"radiogroup\"`",
          "`Item` renders `role=\"radio\"`",
          "checked state is reflected through `aria-checked`",
          "disabled state is reflected through `aria-disabled`",
          "only one item is tabbable at a time through roving tabindex",
          "arrow keys move focus and selection through the group",
          "The current implementation also reflects:",
          "`aria-activedescendant` on the group when a selected item id is known"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`ArrowRight` and `ArrowDown` move to the next enabled item and select it",
          "`ArrowLeft` and `ArrowUp` move to the previous enabled item and select it",
          "`Space` selects the focused item",
          "`Item` exposes `data-state=\"checked\" | \"unchecked\"`",
          "`Item` exposes `data-disabled` when disabled",
          "`Indicator` mirrors the item's checked and disabled state through `data-state` and `data-disabled`",
          "hidden form input emission is tied to the individual item `name` attributes/properties, not to the root"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Minimum expected reflection:",
          "`role=\"radiogroup\"` on the root",
          "`role=\"radio\"` on each item",
          "`aria-checked` on each item",
          "`aria-disabled` on disabled items",
          "`aria-activedescendant` on the root when applicable",
          "`data-state` on items and indicators",
          "`data-disabled` on disabled items and indicators"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "controlled and uncontrolled selection behavior",
          "single checked item semantics",
          "roving tabindex behavior",
          "arrow-key selection and focus movement",
          "group and item disabled state",
          "hidden input emission from named items",
          "`data-state` and ARIA reflection on items and indicators"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/radio/__test__/radio.test.tsx",
      "../ariaui/web/doc/src/app/docs/components/radio/page.md",
      "../ariaui/web/doc/src/markdoc/partials/radio/examples.md"
    ],
    "sourceTestCases": 43,
    "nativeRequirements": [
      "Root and Item expose radiogroup and radio semantics with generated item ids and aria-activedescendant reflection",
      "value and default-value provide controlled and uncontrolled selection through bubbling valuechange events",
      "Arrow keys move focus and selection with wrapping and disabled-item skipping while Space and Enter select the focused Item",
      "group and item disabled state propagate to Item and Indicator data and ARIA reflection",
      "only the checked named Item emits a hidden input with value and required state",
      "docs examples include Uncontrolled, Controlled, and Radio Cards variants with source-equivalent classes and page structure"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
