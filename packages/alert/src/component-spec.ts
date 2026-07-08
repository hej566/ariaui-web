export const componentSpec = {
  "kind": "component",
  "name": "Alert",
  "slug": "alert",
  "packageName": "@ariaui-web/alert",
  "description": "Browser-native Web Component package.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-alert",
      "defaultRole": "alert",
      "defaultAttributes": {}
    },
    {
      "name": "Action",
      "tagName": "aria-alert-action",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Cancel",
      "tagName": "aria-alert-cancel",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "Close",
      "tagName": "aria-alert-close",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "Description",
      "tagName": "aria-alert-description",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Title",
      "tagName": "aria-alert-title",
      "defaultRole": "heading",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-describedby",
    "aria-hidden",
    "aria-labelledby",
    "aria-level",
    "data-alert-action",
    "data-alert-cancel",
    "data-alert-close",
    "data-dismissible",
    "data-state",
    "default-open",
    "disabled",
    "dismissible",
    "native-composition",
    "open",
    "role",
    "tabindex"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/alert/readme.md",
    "coverage": {
      "sourceSections": 10,
      "coveredSections": 10,
      "requirements": 41
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/alert`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG alert pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/alert` is a non-modal alert container for important inline status or messaging content."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`Title`",
          "`Description`",
          "`Action`",
          "`Close`",
          "`Cancel`"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package manages open/closed state for dismissible alerts.",
          "Native custom elements use `default-open` for the uncontrolled initial open state."
        ]
      },
      {
        "title": "Props",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `open` | `boolean` | - | Controlled open state",
          "Table row: `defaultOpen` | `boolean` | `true` | Initial open state (uncontrolled)",
          "Table row: `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes",
          "Table row: `dismissible` | `boolean` | `false` | Enable `Close` and `Cancel` parts to dismiss the alert",
          "Table row: `role` | `native Web Component.AriaRole` | `\"alert\"` | Live region role for the root surface"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root alert surface defaults to `role=\"alert\"` for immediate screen reader announcement. Use a less interruptive live region role such as `status` for non-critical or interactive inline messages. Title and Description are auto-linked via `aria-labelledby` and `aria-describedby`."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Root, Title, Description, and Action parts compose a structured alert surface",
          "Close and Cancel components dismiss the alert only when Root is `dismissible`",
          "Controlled alerts call `onOpenChange(false)` without mutating the rendered state",
          "`native-composition` slots alert metadata onto a single child host for Root, Title, Description, Action, Close, and Cancel."
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Element | Attribute | Value",
          "Table row: Root | `role` | Defaults to `\"alert\"`",
          "Table row: Root | `aria-labelledby` | Auto-generated ID referencing Title",
          "Table row: Root | `aria-describedby` | Auto-generated ID referencing Description",
          "Table row: Close | `data-alert-close` | `\"\"`",
          "Table row: Cancel | `data-alert-cancel` | `\"\"`",
          "Table row: Root | `aria-hidden` | `\"false\"` when open and `\"true\"` when closed",
          "Table row: Root | `data-state` | `\"open\"` or `\"closed\"`",
          "Table row: Root | `data-dismissible` | Present when `dismissible` is true",
          "Table row: Title | `aria-level` | Defaults to `\"5\"` when the title keeps `role=\"heading\"`",
          "Table row: Action | `data-alert-action` | `\"\"`",
          "Table row: Close and Cancel | `tabindex` | `\"0\"` when enabled and `\"-1\"` when disabled"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "Alert part composition",
          "Alert semantics on the root",
          "Title and Description labelling structure",
          "Open/closed state management",
          "Close and Cancel dismissal behavior"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/alert/__test__/alert.test.tsx",
      "../ariaui/packages/alert/__test__/accessibility.test.tsx"
    ],
    "sourceTestCases": 19,
    "nativeRequirements": [
      "root alert semantics and custom `status` live-region role override",
      "title and description ARIA linkage with generated unique ids",
      "action content metadata and non-interactive action host behavior",
      "`defaultOpen` native equivalent through `default-open`",
      "dismissible close and cancel behavior",
      "prevented close and cancel click guards",
      "controlled-style `open` and `openchange` behavior",
      "native composition equivalents for root, title, description, action, close, and cancel hosts"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
