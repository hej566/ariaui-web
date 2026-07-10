export const componentSpec = {
  "kind": "utility",
  "name": "Position",
  "slug": "position",
  "packageName": "@ariaui-web/position",
  "description": "This document defines the current contract for `@ariaui-web/position`.",
  "parts": [],
  "requirementAttributes": [
    "open"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/position/readme.md",
    "coverage": {
      "sourceSections": 13,
      "coveredSections": 13,
      "requirements": 76
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/position`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Floating UI positioning concepts: https://floating-ui.com/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/position` is a low-level utility for computing floating element coordinates relative to a reference element."
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Exports",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { computePosition, autoUpdate, detectOverflow } from \"@ariaui-web/position\";"
        ]
      },
      {
        "title": "computePosition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Computes coordinates for positioning a floating element relative to a reference element.",
          "Code line: function computePosition(",
          "Code line: reference: Element | { getBoundingClientRect: () => DOMRect } | null,",
          "Code line: floating: Element,",
          "Code line: options?: Options,",
          "Code line: ): Return;",
          "Code line: type Options = {",
          "Code line: placement?:",
          "Table row: \"top\"",
          "Table row: \"top-start\"",
          "Table row: \"top-end\"",
          "Table row: \"bottom\"",
          "Table row: \"bottom-start\"",
          "Table row: \"bottom-end\"",
          "Table row: \"left\"",
          "Table row: \"left-start\"",
          "Table row: \"left-end\"",
          "Table row: \"right\"",
          "Table row: \"right-start\"",
          "Table row: \"right-end\"",
          "Table row: \"auto\"",
          "Table row: string;",
          "Code line: strategy?: \"absolute\" | \"fixed\";",
          "Code line: offset?:",
          "Table row: number",
          "Table row: { mainAxis?: number; crossAxis?: number; x?: number; y?: number };",
          "Code line: boundary?: Element | DOMRect | \"viewport\";",
          "Code line: type Return = {",
          "Code line: x: number;",
          "Code line: y: number;",
          "Code line: placement: string;",
          "Code line: strategy: string;",
          "Code line: rects: {",
          "Code line: reference: DOMRect;",
          "Code line: floating: DOMRect;"
        ]
      },
      {
        "title": "autoUpdate",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Automatically updates floating element position when layout changes occur.",
          "Code line: function autoUpdate(",
          "Code line: reference:",
          "Table row: Element",
          "Table row: { getBoundingClientRect: () => DOMRect; contextElement?: Element }",
          "Table row: null,",
          "Code line: floating: Element | null,",
          "Code line: update: () => void,",
          "Code line: hide: () => void,",
          "Code line: options?: { ancestorScroll?: boolean },",
          "Code line: ): (() => void) | undefined;",
          "Returns a cleanup function to remove all listeners.",
          "`autoUpdate` subscribes to `IntersectionObserver` (when available) so it can re-run `update` when the reference's visibility changes. It does **not** call `hide` when the reference leaves the viewport: floating content stays visible as long as the consumer keeps it mounted/open (hide/unmount remains the consumer's responsibility)."
        ]
      },
      {
        "title": "detectOverflow",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Detects how much an element overflows its boundary.",
          "Code line: function detectOverflow(",
          "Code line: element: Element,",
          "Code line: options?: { boundary?: DOMRect; padding?: number },",
          "Code line: ): {",
          "Code line: top: number;",
          "Code line: bottom: number;",
          "Code line: left: number;",
          "Code line: right: number;"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package does not own UI state. It computes coordinates from inputs supplied by consumers."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package does not add semantics itself. Accessibility remains the responsibility of consumers that use the resulting coordinates."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "positioning supports placement, strategy, offset, and boundary configuration",
          "overflow detection is exposed as a reusable utility",
          "automatic update helpers keep floating coordinates synchronized with layout changes",
          "coordinates are rounded to device pixel ratio for sub-pixel rendering accuracy",
          "flipping behavior automatically adjusts placement when floating element doesn't fit",
          "`boundary: 'viewport'` ignores overflow ancestors and checks placement against the visible viewport"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package does not reflect state through ARIA or `data-*` attributes."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "coordinate computation for supported placements",
          "offset handling",
          "overflow detection",
          "auto-update behavior during layout changes"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/position/__test__/position.test.ts",
      "../ariaui/packages/position/__test__/position.test.tsx",
      "../ariaui/web/doc/src/markdoc/partials/position/examples/default.md"
    ],
    "sourceTestCases": 63,
    "nativeRequirements": [
      "computePosition supports top, bottom, left, right, start/end alignments, numeric offsets, axis offsets, direct x/y offsets, absolute and fixed strategies, and virtual references",
      "computePosition flips to the opposite side when the floating element overflows the main axis, preserving symmetric direct x/y gaps when flipped",
      "detectOverflow measures overflow against clipping boundaries with optional padding",
      "DOM helpers expose window, document, DPR rounding, node guards, overflow ancestors, clipping rects, fit checks, and placement coordinate helpers",
      "autoUpdate watches scroll, resize, ResizeObserver, MutationObserver, and IntersectionObserver signals, schedules updates with requestAnimationFrame, and disconnects all observers on cleanup",
      "floating effects measure display:none elements without permanently changing display or visibility and write left, top, position, and data-side to the floating element",
      "pre-position helpers expose hidden-before-positioned visibility styles without requiring framework hooks",
      "docs examples include the source Position utility live example with Reference copy, Get Position trigger, and Floating element panel"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
