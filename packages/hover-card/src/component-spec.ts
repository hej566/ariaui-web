export const componentSpec = {
  "kind": "component",
  "name": "HoverCard",
  "slug": "hover-card",
  "packageName": "@ariaui-web/hover-card",
  "description": "**Content:** - `arrow` - whether to render positioning arrow (default: false) - `arrowClassName` - className for arrow element - `native composition` - slot content attributes/properties onto a single child element for custom hosts such as Framer",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-hover-card",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-hover-card-content",
      "defaultRole": "tooltip",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-hover-card-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false"
      }
    }
  ],
  "requirementAttributes": [
    "aria-expanded",
    "arrow",
    "arrow-class",
    "data-align",
    "data-side",
    "data-state",
    "default-open",
    "offset",
    "open",
    "placement",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/hover-card/readme.md",
    "coverage": {
      "sourceSections": 11,
      "coveredSections": 11,
      "requirements": 42
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/hover-card`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Radix hover card docs: https://www.radix-ui.com/primitives/docs/components/hover-card"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/hover-card` is a positioned preview surface that opens from hover or focus on a reference trigger."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root` - coordinates open state, positioning, and timing",
          "`Trigger` - button element that opens the card on hover/focus",
          "`Content` - portalled floating surface with optional arrow"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root coordinates controlled or uncontrolled open state, reference and floating elements, and current placement."
        ]
      },
      {
        "title": "Props Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Root:**",
          "`open` - controlled open state",
          "`defaultOpen` - uncontrolled initial open state",
          "`onOpenChange` - callback when open state changes",
          "`placement` - preferred placement relative to trigger (default: \"bottom\")",
          "`offset` - distance in pixels from trigger (default: 8)",
          "**Content:**",
          "`arrow` - whether to render positioning arrow (default: false)",
          "`arrowClassName` - className for arrow element",
          "`native composition` - slot content attributes/properties onto a single child element for custom hosts such as Framer Motion components"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The content uses `role=\"tooltip\"` to indicate a preview surface. The trigger is a button element for proper keyboard accessibility. Escape key closes the card. Consumers remain responsible for the semantic content inside the card."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "hover on trigger opens the hover card",
          "leaving the trigger closes the hover card",
          "hovering over content keeps the card open (safe area)",
          "focus on trigger opens the hover card",
          "blur on trigger closes the hover card",
          "Escape key closes the hover card",
          "content is portalled and positioned relative to the trigger, rendering a `<div>` by default or slotting attributes/properties onto a child with `native composition`",
          "positioning updates automatically when trigger or content moves"
        ]
      },
      {
        "title": "Positioning Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The content is positioned using floating-ui with:",
          "collision detection and automatic placement adjustment",
          "configurable offset distance from trigger",
          "support for all standard placements (top, right, bottom, left, and variants)",
          "automatic repositioning on scroll/resize via autoUpdate"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The content element receives `role=\"tooltip\"` to indicate a preview surface. The trigger is a native button element for keyboard accessibility. Open state is managed internally and reflected through conditional rendering."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "hover-open behavior",
          "hover-close behavior (unhover trigger)",
          "focus-open behavior",
          "blur-close behavior",
          "Escape key closes the card",
          "content portal rendering, including `native composition` custom host composition",
          "positioning lifecycle and placement updates",
          "arrow rendering when enabled"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/hover-card/__test__/hover-card.test.tsx",
      "../ariaui/packages/hover-card/__test__/index.test.tsx"
    ],
    "sourceTestCases": 17,
    "nativeRequirements": [
      "hover, pointer safe-area, focus, blur, and Escape open-state behavior",
      "default-open initialization and direct open property reflection",
      "controlled-style open and cancelable openchange behavior",
      "trigger and content handler composition with orphan-part structure errors",
      "tooltip role, stable trigger/content association, and closed-state hiding",
      "viewport-bound positioning, offset, placement reflection, and automatic updates",
      "optional arrow rendering and browser-native content composition",
      "docs examples and page structure match the source Aria UI Hover Card documentation"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
