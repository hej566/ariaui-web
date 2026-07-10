export const componentSpec = {
  "kind": "component",
  "name": "Label",
  "slug": "label",
  "packageName": "@ariaui-web/label",
  "description": "This document defines the label contract for `@ariaui-web/label`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-label",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "for",
    "id"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/label/readme.md",
    "coverage": {
      "sourceSections": 12,
      "coveredSections": 12,
      "requirements": 40
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the label contract for `@ariaui-web/label`.",
          "It uses the Radix UI Label primitive as the structural reference:",
          "Radix Label: <https://www.radix-ui.com/primitives/docs/components/label>",
          "HTML `label` element: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label>",
          "The package is headless. It provides native label semantics, composition support, and double-click selection protection, but no visual styling."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A label names a control. Native labels can associate with controls by wrapping them or by using `htmlFor` to reference an input `id`.",
          "Use `Root` anywhere a native `label` element is appropriate."
        ]
      },
      {
        "title": "Public API",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "Associated type exports:",
          "`RootProps`",
          "No public hooks or styling helpers are exported."
        ]
      },
      {
        "title": "Root Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Type:",
          "Code line: interface RootProps extends native element attributes/properties for \"label\" {",
          "Code line: native composition?: boolean;",
          "Current behavior:",
          "renders a `label` by default",
          "renders its single child through `native composition host` when `native composition` is true",
          "forwards a ref to the rendered element",
          "passes through native label attributes/properties, including `htmlFor`, `className`, `id`, `style`, `data-*`, and event handlers",
          "calls the consumer `onMouseDown` handler before internal double-click handling",
          "prevents text selection when double-clicking the label surface",
          "does not prevent default when the pointer starts inside nested `button`, `input`, `select`, or `textarea` controls"
        ]
      },
      {
        "title": "Props",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "htmlFor",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Passes through to the native `label` element. Use this to associate a label with a control by `id`."
        ]
      },
      {
        "title": "native composition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current behavior:",
          "when omitted or `false`, `Root` renders a `label`",
          "when `true`, `Root` renders through `@ariaui-web/slot`",
          "slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` is based on the native `label` element. Browser label behavior applies when the label wraps a form control or references one with `htmlFor`.",
          "Custom controls should still be backed by native controls such as `button` or `input` when they need label behavior."
        ]
      },
      {
        "title": "Data Attributes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` does not add package-owned data attributes."
        ]
      },
      {
        "title": "Styling",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package does not apply layout, color, typography, spacing, or cursor styles.",
          "Consumers should style the label using normal element selectors or classes."
        ]
      },
      {
        "title": "SSR and Hydration",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` is deterministic during server rendering. It does not generate IDs, read layout, or attach effects.",
          "The package includes `\"use client\"` so it can be consumed consistently by native Web Component Server Component applications."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior changes must update:",
          "Unit tests in `packages/label/__test__`.",
          "This readme.",
          "Any docs examples or live sandbox wiring that import `@ariaui-web/label`, if added later."
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/label/__test__/label.test.tsx"
    ],
    "sourceTestCases": 10,
    "nativeRequirements": [
      "Root keeps native label semantics with no default role, focusability, ARIA state, or reflected state data attributes",
      "Root forwards for/htmlFor, id, data attributes, classes, inline styles, text content, and consumer DOM events",
      "Root activates associated controls through for/id and wrapped native controls",
      "Root calls consumer mousedown handlers while preventing double-click text selection on the label surface",
      "Root does not prevent default when double-click starts inside nested button, input, select, or textarea controls",
      "Root supports native-composition child hosts as the browser-native adaptation of source slot composition",
      "docs examples include default and wrapped-control variants with source-equivalent label, field, and input classes"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
