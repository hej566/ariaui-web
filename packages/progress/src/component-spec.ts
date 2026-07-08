export const componentSpec = {
  "kind": "component",
  "name": "Progress",
  "slug": "progress",
  "packageName": "@ariaui-web/progress",
  "description": "**Note:** Current implementation uses `role=\"meter\"` which should be corrected to `role=\"progressbar\"` for proper progress indication semantics.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-progress",
      "defaultRole": "progressbar",
      "defaultAttributes": {
        "aria-valuemax": "100",
        "aria-valuemin": "0",
        "aria-valuenow": "0"
      }
    },
    {
      "name": "Indicator",
      "tagName": "aria-progress-indicator",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-label",
    "aria-valuemax",
    "aria-valuemin",
    "aria-valuenow",
    "aria-valuetext",
    "data-max",
    "data-min",
    "data-value",
    "role",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/progress/readme.md",
    "coverage": {
      "sourceSections": 13,
      "coveredSections": 13,
      "requirements": 53
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/progress`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG progressbar pattern: https://www.w3.org/WAI/ARIA/apg/patterns/progressbar/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/progress` is a composable progress indicator primitive with a root track and an indicator part that visually represents task completion or loading state."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root` - Container that establishes progress context",
          "`Indicator` - Visual indicator that reflects current progress"
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
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface RootProps extends native element attributes/properties for \"div\" {",
          "Code line: children: Node | string;",
          "Code line: min?: number; // Default: 0",
          "Code line: max?: number; // Default: 100",
          "Code line: defaultValue?: number; // Default: 0",
          "Code line: onValueChange?: (value: number) => void;",
          "Code line: value?: number; // Controlled value",
          "Code line: valueText?: string; // Optional human-readable text"
        ]
      },
      {
        "title": "Indicator",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface IndicatorProps extends native element attributes/properties for \"div\" {",
          "Code line: // Inherits value, min, max from Root via context"
        ]
      },
      {
        "title": "Usage",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineProgressElements } from \"@ariaui-web/progress\";",
          "Code line: <aria-progress aria-label=\"Upload progress\" value={75} max={100}>",
          "Code line: <aria-progress-indicator />",
          "Code line: </aria-progress>",
          "Code line: // Uncontrolled initial value",
          "Code line: <aria-progress aria-label=\"Upload progress\" defaultValue={25}>",
          "Code line: // With custom range and text",
          "Code line: <aria-progress",
          "Code line: aria-label=\"Score\"",
          "Code line: min={200}",
          "Code line: max={800}",
          "Code line: value={500}",
          "Code line: valueText=\"500 out of 800 points\"",
          "Code line: >"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root coordinates the current progress value reflected by the indicator through native Web Component Context.",
          "Use `defaultValue` for uncontrolled initial state, or `value` with `onValueChange`",
          "for controlled state."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exposes `role=\"progressbar\"` semantics with:",
          "`aria-valuenow`: Current value",
          "`aria-valuemin`: Minimum value",
          "`aria-valuemax`: Maximum value",
          "`aria-valuetext`: Optional human-readable description",
          "**Note:** Current implementation uses `role=\"meter\"` which should be corrected to `role=\"progressbar\"` for proper progress indication semantics."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root defines the progress container and establishes context",
          "The indicator reflects the current progress visually inside the root",
          "The indicator automatically calculates percentage based on `(value - min) / (max - min)`",
          "CSS custom property `--progress-value` is set on the indicator for styling"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Root reflects `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`",
          "Both Root and Indicator expose `data-value`, `data-min`, `data-max` for styling hooks",
          "Indicator sets `--progress-value` CSS custom property with computed percentage"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "root and indicator composition",
          "progressbar semantics (role, ARIA attributes)",
          "current-value reflection (data attributes, CSS custom properties)",
          "percentage calculation for various ranges",
          "context propagation from Root to Indicator"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
