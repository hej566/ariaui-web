export const componentSpec = {
  "kind": "component",
  "name": "Kbd",
  "slug": "kbd",
  "packageName": "@ariaui-web/kbd",
  "description": "This document defines the keyboard key display contract for `@ariaui-web/kbd`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-kbd",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Group",
      "tagName": "aria-kbd-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-label",
    "id"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/kbd/readme.md",
    "coverage": {
      "sourceSections": 12,
      "coveredSections": 12,
      "requirements": 48
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the keyboard key display contract for `@ariaui-web/kbd`.",
          "It uses the shadcn/ui Kbd component as the structural reference:",
          "shadcn/ui Kbd: <https://ui.shadcn.com/docs/components/radix/kbd>",
          "HTML `kbd` element: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd>",
          "The package is headless. It provides semantic keyboard input markup, grouping, and composition support, but no visual styling."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A keyboard key display shows textual user input from a keyboard, such as `Ctrl`, `Command`, `Enter`, or a shortcut sequence.",
          "Use `Root` for a single key label or key-like token. Use `Group` to group related key labels into a shortcut."
        ]
      },
      {
        "title": "Public API",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`Group`",
          "Associated type exports:",
          "`RootProps`",
          "`GroupProps`",
          "No public hooks or styling helpers are exported."
        ]
      },
      {
        "title": "Root Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Type:",
          "Code line: interface RootProps extends native element attributes/properties for \"kbd\" {",
          "Code line: native composition?: boolean;",
          "Current behavior:",
          "renders a `kbd` by default",
          "renders its single child through `native composition host` when `native composition` is true",
          "forwards a ref to the rendered element",
          "passes through native `kbd` attributes/properties, including `className`, `id`, `style`, `title`, `data-*`, and event handlers",
          "does not add roles, ARIA attributes, data attributes, or styling"
        ]
      },
      {
        "title": "Group Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Type:",
          "Code line: interface GroupProps extends native element attributes/properties for \"span\" {",
          "Code line: native composition?: boolean;",
          "Current behavior:",
          "renders a `span` by default",
          "renders its single child through `native composition host` when `native composition` is true",
          "forwards a ref to the rendered element",
          "passes through native `span` attributes/properties, including `className`, `id`, `style`, `aria-*`, `data-*`, and event handlers",
          "does not add roles, ARIA attributes, data attributes, or styling"
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
        "title": "native composition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current behavior:",
          "when omitted or `false`, `Root` renders `kbd` and `Group` renders `span`",
          "when `true`, the component renders through `@ariaui-web/slot`",
          "slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` is based on the native `kbd` element. Browser keyboard-input semantics apply.",
          "`Group` intentionally renders a neutral `span`. Consumers may pass `aria-label` when a shortcut group needs a pronounceable label."
        ]
      },
      {
        "title": "Data Attributes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` and `Group` do not add package-owned data attributes."
        ]
      },
      {
        "title": "Styling",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package does not apply layout, color, typography, spacing, borders, shadows, or cursor styles.",
          "Consumers should style keycaps and groups using normal element selectors or classes."
        ]
      },
      {
        "title": "SSR and Hydration",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` and `Group` are deterministic during server rendering. They do not generate IDs, read layout, or attach effects.",
          "The package includes `\"use client\"` so it can be consumed consistently by native Web Component Server Component applications."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior changes must update:",
          "Unit tests in `packages/kbd/__test__`.",
          "This readme.",
          "Any docs examples or live sandbox wiring that import `@ariaui-web/kbd`, if added later."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
