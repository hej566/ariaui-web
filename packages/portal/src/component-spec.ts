export const componentSpec = {
  "kind": "component",
  "name": "Portal",
  "slug": "portal",
  "packageName": "@ariaui-web/portal",
  "description": "`@ariaui-web/portal` is a small utility that renders children outside the local DOM hierarchy while preserving DOM context.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-portal",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/portal/readme.md",
    "coverage": {
      "sourceSections": 11,
      "coveredSections": 11,
      "requirements": 30
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/portal`.",
          "`@ariaui-web/portal` is a small utility that renders children outside the local DOM hierarchy while preserving DOM context."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "native Web Component `createPortal`: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild",
          "Radix Portal utility: https://www.radix-ui.com/primitives/docs/utilities/portal"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package is intentionally narrow.",
          "It exists so other packages can portal floating or modal content to `document.body` without reimplementing SSR guards or repeating `native DOM portal insertion` inline."
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports a single named export:",
          "`Root` (used as `Root` when imported as `import * as Portal`)"
        ]
      },
      {
        "title": "Props",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface PortalRootProps {",
          "Code line: children?: Node | string;"
        ]
      },
      {
        "title": "Usage",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { definePortalElements } from \"@ariaui-web/portal\";",
          "Code line: <aria-portal>",
          "Code line: <div>Content rendered to document.body</div>",
          "Code line: </aria-portal>",
          "The current implementation does not support a `container` attributes/properties. All content is portaled to `document.body`."
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package owns no interactive state."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/portal` does not add ARIA semantics itself.",
          "Accessibility responsibilities remain with the calling package, such as:",
          "dialog semantics for modal content",
          "listbox semantics for floating option menus",
          "focus management and dismissal behavior"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "In the browser, `Root` renders children into `document.body`.",
          "On the server, or when `document` is unavailable, `Root` returns the children inline.",
          "DOM context is preserved across the portal boundary.",
          "The package does not create wrappers or additional semantics around the children it renders."
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
          "body-based portal rendering in the browser",
          "SSR or `document`-missing fallback rendering",
          "DOM context preservation across the portal boundary"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/portal/__test__/portal.test.tsx"
    ],
    "sourceTestCases": 3,
    "nativeRequirements": [
      "Root renders child nodes into document.body when connected in the browser",
      "Root keeps children inline before connection as the native SSR fallback equivalent",
      "Root preserves child node identity and DOM event listeners across the portal boundary",
      "Root preserves portalled children when its connected custom element host is reparented",
      "Root does not create wrapper semantics, default roles, focusability, keyboard behavior, ARIA state, or reflected state data attributes",
      "Root removes owned portalled nodes when the host disconnects"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
