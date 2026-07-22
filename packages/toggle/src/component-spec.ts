export const componentSpec = {
  "kind": "component",
  "name": "Toggle",
  "slug": "toggle",
  "packageName": "@ariaui-web/toggle",
  "description": "It implements the WAI-ARIA pressed button pattern for a standalone toggle button. Use `@ariaui-web/toggle-group` when a set of related toggles needs single or multiple selection, roving focus, or shared value state.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-toggle",
      "defaultRole": "button",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-pressed",
    "data-disabled",
    "data-state",
    "disabled",
    "pressed",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/toggle/readme.md",
    "coverage": {
      "sourceSections": 6,
      "coveredSections": 6,
      "requirements": 30
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/toggle`.",
          "It implements the WAI-ARIA pressed button pattern for a standalone toggle button.",
          "Use `@ariaui-web/toggle-group` when a set of related toggles needs single or multiple",
          "selection, roving focus, or shared value state."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/toggle` is a headless pressed button primitive. It renders one native",
          "`<button type=\"button\">`, supports controlled and uncontrolled pressed state, and",
          "reflects state through ARIA and data attributes."
        ]
      },
      {
        "title": "API Reference",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Props:**",
          "`pressed?: boolean` - controlled pressed state",
          "`defaultPressed?: boolean` - uncontrolled initial pressed state (default: `false`)",
          "`onPressedChange?: (pressed: boolean) => void` - callback fired with the next pressed state",
          "`disabled?: boolean` - disables the button",
          "All standard button attributes/properties except `defaultValue` and `onChange`",
          "**Behavior:**",
          "Uses `useControllableState` from `@ariaui-web/hooks`.",
          "Calls the consumer `onClick` first; if the event is prevented, pressed state is not changed.",
          "Does not toggle when disabled.",
          "Renders children directly inside the button."
        ]
      },
      {
        "title": "State and Accessibility",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`aria-pressed` is `true` or `false` based on pressed state.",
          "`data-state` is `\"on\"` or `\"off\"`.",
          "`data-disabled` is present when disabled.",
          "The rendered element is a native button, so Space and Enter activation follow browser defaults."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests should cover:",
          "Controlled `pressed` state",
          "Uncontrolled `defaultPressed` state",
          "`onPressedChange` notification",
          "Disabled behavior",
          "ARIA and data attribute reflection",
          "No accessibility violations"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/toggle/__test__/toggle.test.tsx"
    ],
    "sourceTestCases": 5,
    "nativeRequirements": [
      "defaultPressed initializes uncontrolled pressed state and activation reports the next value",
      "controlled pressed state remains unchanged while onPressedChange receives the next value",
      "consumer click prevention and disabled state both suppress pressed-state changes",
      "aria-pressed, data-state, data-disabled, and native button type reflect the effective state",
      "the default toggle has no axe accessibility violations",
      "docs reproduce the upstream six Toggle variants and Tailwind class composition"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
