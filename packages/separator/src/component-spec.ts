export const componentSpec = {
  "kind": "component",
  "name": "Separator",
  "slug": "separator",
  "packageName": "@ariaui-web/separator",
  "description": "This document defines the separator contract for `@ariaui-web/separator`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-separator",
      "defaultRole": "separator",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-orientation",
    "data-orientation",
    "disabled",
    "orientation",
    "role",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/separator/readme.md",
    "coverage": {
      "sourceSections": 13,
      "coveredSections": 13,
      "requirements": 61
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the separator contract for `@ariaui-web/separator`.",
          "It uses the Radix UI Separator primitive as the structural reference:",
          "Radix Separator: <https://www.radix-ui.com/primitives/docs/components/separator>",
          "ARIA `separator` role: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role>",
          "The package is headless. It provides semantics, orientation state, and composition support, but no visual styling."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A separator divides adjacent content. It can either be semantic content structure or a purely visual divider.",
          "Use a semantic separator when the divider helps communicate page structure. Use a decorative separator when the divider is only a visual boundary between items."
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
          "`Orientation`",
          "No public hooks or styling helpers are exported."
        ]
      },
      {
        "title": "Root Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Type:",
          "Code line: type Orientation = \"horizontal\" | \"vertical\";",
          "Code line: interface RootProps extends native element attributes/properties for \"div\" {",
          "Code line: native composition?: boolean;",
          "Code line: decorative?: boolean;",
          "Code line: orientation?: Orientation;",
          "Current behavior:",
          "renders a `div` by default",
          "renders its single child through `native composition host` when `native composition` is true",
          "forwards a ref to the rendered element",
          "defaults `orientation` to `\"horizontal\"`",
          "falls back to `\"horizontal\"` if an invalid runtime orientation value is received",
          "reflects orientation with `data-orientation`",
          "spreads consumer attributes/properties after default semantic attributes/properties, so explicit consumer attributes/properties can override them"
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
        "title": "orientation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Supported values:",
          "`\"horizontal\"`",
          "`\"vertical\"`",
          "Default value:",
          "Current behavior:",
          "`data-orientation=\"horizontal\"` for horizontal separators",
          "`data-orientation=\"vertical\"` for vertical separators",
          "semantic vertical separators also receive `aria-orientation=\"vertical\"`",
          "horizontal semantic separators omit `aria-orientation` because horizontal is the ARIA default"
        ]
      },
      {
        "title": "decorative",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current behavior:",
          "omitted or `false` renders a semantic separator with `role=\"separator\"`",
          "`true` renders a decorative element with `role=\"none\"`",
          "decorative separators omit `aria-orientation`",
          "decorative separators still reflect `data-orientation` for styling"
        ]
      },
      {
        "title": "native composition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current behavior:",
          "when omitted or `false`, `Root` renders a `div`",
          "when `true`, `Root` renders through `@ariaui-web/slot`",
          "slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Semantic separators expose `role=\"separator\"`.",
          "Vertical semantic separators expose `aria-orientation=\"vertical\"`. Horizontal semantic separators omit `aria-orientation` because assistive technologies treat horizontal as the default orientation.",
          "Decorative separators expose `role=\"none\"` so they do not add structure to the accessibility tree."
        ]
      },
      {
        "title": "Data Attributes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` reflects:",
          "`data-orientation=\"horizontal\"`",
          "`data-orientation=\"vertical\"`",
          "No state, disabled, or value attributes are exposed."
        ]
      },
      {
        "title": "Styling",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package does not apply layout, color, border, size, or spacing styles.",
          "Consumers should style the separator using normal element selectors, classes, or `data-orientation`."
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
          "Unit tests in `packages/separator/__test__`.",
          "This readme.",
          "Any docs examples or live sandbox wiring that import `@ariaui-web/separator`, if added later."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
