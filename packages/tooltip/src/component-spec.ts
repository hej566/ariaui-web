export const componentSpec = {
  "kind": "component",
  "name": "Tooltip",
  "slug": "tooltip",
  "packageName": "@ariaui-web/tooltip",
  "description": "Browser-native Web Component package.",
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/tooltip/__test__/tooltip.test.tsx"
    ],
    "sourceTestCases": 44,
    "nativeRequirements": [
      "hover, focus, blur, Escape, and hover-bridge behavior",
      "controlled and uncontrolled open state with openchange callbacks",
      "portalled viewport positioning flips before content becomes visible",
      "trigger association, tooltip semantics, and non-focusable content",
      "optional arrows and disabled interaction guards",
      "native-composition trigger and content hosts preserve polymorphic behavior",
      "docs reproduce Uncontrolled, Controlled, and Framer Motion examples"
    ]
  },
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-tooltip",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-tooltip-content",
      "defaultRole": "tooltip",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-tooltip-trigger",
      "defaultRole": "button",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-describedby",
    "open",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/tooltip/readme.md",
    "coverage": {
      "sourceSections": 9,
      "coveredSections": 9,
      "requirements": 31
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/tooltip`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG tooltip pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/",
          "Radix tooltip docs: https://www.radix-ui.com/primitives/docs/components/tooltip"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/tooltip` is a positioned descriptive surface shown from a trigger on hover or focus."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports tooltip parts through the package entrypoint, centered around:",
          "`Root`",
          "`Trigger`",
          "`Content`"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root coordinates controlled or uncontrolled open state, placement state, and reference/floating elements."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tooltip content has `role=\"tooltip\"`",
          "Trigger references tooltip via `aria-describedby` (only when open)",
          "Tooltip content does **not** receive focus - focus stays on the triggering element",
          "The trigger renders a `<button>` by default and supports polymorphic composition via `native composition`"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Hover open**: mouse-entering the trigger opens the tooltip immediately",
          "**Focus open**: focusing the trigger opens the tooltip",
          "**Hover persistence**: tooltip stays open while the pointer moves from the trigger to the portaled content (via `relatedTarget` checks); leaving both closes immediately",
          "**Blur dismissal**: if opened via focus, dismissed on blur",
          "**Escape dismissal**: pressing `Escape` while the trigger has focus immediately closes the tooltip",
          "Content is portalled and positioned relative to the trigger",
          "Optional arrow rendering is supported by the tooltip content implementation"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tooltip semantics and trigger association should be reflected across the trigger and content parts."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "hover-open behavior",
          "focus-open behavior",
          "`Escape` dismissal",
          "blur dismissal",
          "trigger-to-tooltip association (`aria-describedby`)",
          "positioning lifecycle and optional arrow behavior",
          "hover persistence over tooltip content",
          "polymorphic trigger composition via `native composition`",
          "tooltip content is not focusable"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
