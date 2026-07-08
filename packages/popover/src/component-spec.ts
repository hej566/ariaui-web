export const componentSpec = {
  "kind": "component",
  "name": "Popover",
  "slug": "popover",
  "packageName": "@ariaui-web/popover",
  "description": "It behaves like a lightweight floating dialog surface rather than a menu.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-popover",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Close",
      "tagName": "aria-popover-close",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "true"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-popover-content",
      "defaultRole": "region",
      "defaultAttributes": {}
    },
    {
      "name": "Description",
      "tagName": "aria-popover-description",
      "defaultRole": "note",
      "defaultAttributes": {}
    },
    {
      "name": "Heading",
      "tagName": "aria-popover-heading",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-popover-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-expanded",
    "aria-haspopup",
    "aria-modal",
    "data-state",
    "disabled",
    "open",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/popover/readme.md",
    "coverage": {
      "sourceSections": 12,
      "coveredSections": 12,
      "requirements": 74
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/popover`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Radix popover docs: https://www.radix-ui.com/primitives/docs/components/popover",
          "APG dialog pattern for labelled floating surfaces: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/popover` is a positioned floating surface built around:",
          "root open state",
          "a reference trigger",
          "a portalled content surface",
          "optional modal focus trapping",
          "optional arrow rendering",
          "It behaves like a lightweight floating dialog surface rather than a menu."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`Trigger`",
          "`Content`",
          "`Heading`",
          "`Description`",
          "`Close`"
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
          "Current public shape:",
          "`open?: boolean`",
          "`defaultOpen?: boolean`",
          "`onOpenChange?: (open: boolean) => void`",
          "`placement?: Placement`",
          "`offset?: number`",
          "`modal?: boolean`",
          "Behavior:",
          "open state may be controlled or uncontrolled",
          "the root tracks the reference element, floating element, and current placement",
          "`modal` controls whether content focus is trapped",
          "content focus loops by default, and can be disabled with `Content loop={false}`"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "toggle open state",
          "register the reference element",
          "expose popover-expanded state and dialog intent through ARIA"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the portalled floating surface while open",
          "position relative to the trigger",
          "expose dialog semantics and optional arrow rendering",
          "wrap children in `FocusScope`",
          "optionally loop focus through children with the `loop` attributes/properties",
          "optionally slot content attributes/properties onto a child host with the `native composition` attributes/properties"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The current implementation reflects a dialog-like floating surface:",
          "trigger exposes `aria-haspopup=\"dialog\"`",
          "trigger reflects `aria-expanded`",
          "content renders `role=\"dialog\"`",
          "heading and description ids are wired into content labelling",
          "`modal` controls focus trapping behavior"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Trigger` toggles open state on click and on `Enter` / `Space`",
          "`Content` returns `null` while closed",
          "content is portalled through `@ariaui-web/portal`",
          "content is positioned through `@ariaui-web/position`",
          "outside mouse interaction closes the popover",
          "`Escape` closes the popover",
          "`Close` closes the popover directly",
          "`Close` returns focus to the trigger after closing",
          "optional arrow rendering is controlled by the `arrow` attributes/properties on content",
          "focus looping is controlled by the `loop` attributes/properties on content, defaulting to `true`",
          "`native composition` slots content attributes/properties onto a single child element while preserving focus scope and optional arrow rendering"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Minimum expected reflection:",
          "`aria-haspopup=\"dialog\"` on the trigger",
          "`aria-expanded` on the trigger",
          "`aria-controls` on the trigger while open",
          "`role=\"dialog\"` on content",
          "`aria-modal` on content when modal mode is active",
          "`data-state=\"open\" | \"closed\"` on the trigger"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "controlled and uncontrolled open behavior",
          "trigger toggling through click and keyboard",
          "content portal rendering and positioning lifecycle",
          "outside-click dismissal",
          "`Escape` dismissal",
          "heading and description labelling",
          "modal versus non-modal focus-scope behavior",
          "optional arrow rendering"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
