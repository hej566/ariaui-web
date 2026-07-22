export const componentSpec = {
  "kind": "component",
  "name": "Spinner",
  "slug": "spinner",
  "packageName": "@ariaui-web/spinner",
  "description": "This document defines the loading indicator contract for `@ariaui-web/spinner`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-spinner",
      "defaultRole": "status",
      "defaultAttributes": {
        "aria-label": "Loading"
      }
    }
  ],
  "requirementAttributes": [
    "aria-hidden",
    "aria-label",
    "id",
    "role",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/spinner/readme.md",
    "coverage": {
      "sourceSections": 18,
      "coveredSections": 18,
      "requirements": 71
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the loading indicator contract for `@ariaui-web/spinner`.",
          "It uses the shadcn/ui Spinner component as the structural reference:",
          "shadcn/ui Spinner: <https://ui.shadcn.com/docs/components/radix/spinner>",
          "ARIA live regions: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions>",
          "The package is headless. It provides accessible loading semantics, a minimal inline SVG fallback, and composition support, but no visual styling system."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A spinner communicates that work is in progress.",
          "Use `Root` when the loading state should be announced. Use `aria-hidden` when the spinner is decorative and nearby text already communicates the loading state."
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
          "Code line: interface RootProps extends native element attributes/properties for \"svg\" {",
          "Code line: native composition?: boolean;",
          "Current behavior:",
          "renders an `svg` by default",
          "renders its single child through `native composition host` when `native composition` is true",
          "forwards a ref to the rendered element",
          "passes through native SVG attributes/properties, including `className`, `id`, `style`, `title`, `data-*`, and event handlers",
          "defaults to `role=\"status\"` and `aria-label=\"Loading\"`",
          "omits default status semantics when `aria-hidden` is true",
          "renders a built-in `currentColor` spinner glyph when no children are provided",
          "uses `1em` width and height by default"
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
        "title": "aria-label",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Default value:",
          "`\"Loading\"`",
          "Current behavior:",
          "gives the status a readable loading label",
          "can be overridden for contextual loading states, such as `\"Saving\"` or `\"Loading messages\"`"
        ]
      },
      {
        "title": "aria-hidden",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current behavior:",
          "when true, default `role` and `aria-label` are omitted",
          "use this when adjacent text already announces the loading state"
        ]
      },
      {
        "title": "native composition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current behavior:",
          "when omitted or `false`, `Root` renders an `svg`",
          "when `true`, `Root` renders through `@ariaui-web/slot`",
          "slot rendering merges class names, styles, event handlers, and refs according to the shared `native composition host` contract",
          "the built-in spinner glyph is not injected into slotted children"
        ]
      },
      {
        "title": "Examples",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Basic",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineSpinnerElements } from \"@ariaui-web/spinner\";",
          "Code line: export function Example() {",
          "Code line: return <aria-spinner />;"
        ]
      },
      {
        "title": "Custom Label",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineSpinnerElements } from \"@ariaui-web/spinner\";",
          "Code line: export function Example() {",
          "Code line: return <aria-spinner aria-label=\"Saving\" />;"
        ]
      },
      {
        "title": "Decorative",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineSpinnerElements } from \"@ariaui-web/spinner\";",
          "Code line: export function Example() {",
          "Code line: return (",
          "Code line: <button>",
          "Code line: <aria-spinner aria-hidden />",
          "Code line: Saving",
          "Code line: </button>"
        ]
      },
      {
        "title": "Custom SVG With native composition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineSpinnerElements } from \"@ariaui-web/spinner\";",
          "Code line: export function Example() {",
          "Code line: return (",
          "Code line: <aria-spinner native composition aria-label=\"Loading messages\">",
          "Code line: <svg viewBox=\"0 0 24 24\">",
          "Code line: <circle cx=\"12\" cy=\"12\" r=\"9\" />",
          "Code line: </svg>",
          "Code line: </aria-spinner>"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` exposes `role=\"status\"` by default so assistive technologies can announce loading state changes politely.",
          "Use a specific `aria-label` when multiple loading indicators can appear on the same screen. Use `aria-hidden` when the spinner is only visual decoration."
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
          "The default SVG uses `currentColor`, so consumers can style color with normal CSS. Consumers should provide animation, sizing, and layout classes as needed when using custom slotted children."
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
          "Unit tests in `packages/spinner/__test__`.",
          "This readme.",
          "Any docs examples or live sandbox wiring that import `@ariaui-web/spinner`, if added later."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
