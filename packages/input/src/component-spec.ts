export const componentSpec = {
  "kind": "component",
  "name": "Input",
  "slug": "input",
  "packageName": "@ariaui-web/input",
  "description": "`@ariaui-web/input` is a thin controllable wrapper around the native HTML `<input>` element.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-input",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "disabled",
    "required",
    "role",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/input/readme.md",
    "coverage": {
      "sourceSections": 9,
      "coveredSections": 9,
      "requirements": 54
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/input`.",
          "`@ariaui-web/input` is a thin controllable wrapper around the native HTML `<input>` element."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "HTML input specification: https://html.spec.whatwg.org/multipage/input.html",
          "native Web Component input docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package keeps native input behavior intact while adding a small convenience contract:",
          "controllable and uncontrollable value support",
          "`onValueChange` as a string-first callback",
          "native `disabled` and `required` attributes",
          "ref forwarding to the actual `<input>` element",
          "It is not a styled field abstraction or a validation framework."
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports one part:",
          "`Root`",
          "Current public shape:",
          "all native input attributes/properties except `onChange` are inherited from `native element attributes/properties for \"input\"`",
          "`onChange` remains supported explicitly as a composed event callback",
          "`value?: string`",
          "`defaultValue?: string` (defaults to empty string `\"\"`)",
          "`onValueChange?: (value: string) => void`",
          "`disabled?: boolean`",
          "`required?: boolean`",
          "`type?: \"text\" | \"email\" | \"password\" | \"tel\" | \"url\" | \"search\"` (string-compatible input types, defaults to `\"text\"`)",
          "`ref` forwarded to the native `<input>` element"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` supports both controlled and uncontrolled value state.",
          "Behavior:",
          "when a string `value` attributes/properties is provided, the component behaves as controlled",
          "when `value` is omitted or non-string, the component manages internal string state initialized from `defaultValue` (defaults to `\"\"`)",
          "changes flow through `onValueChange` with the next string value",
          "native `onChange` is composed rather than replaced",
          "Note: This component only supports string-compatible input types. Non-string input types (checkbox, radio, file, number, date, color, etc.) are not supported."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/input` relies on native input semantics.",
          "It should preserve:",
          "the native input role for the chosen `type`",
          "label association through standard HTML mechanisms",
          "native disabled and required semantics",
          "native focus behavior"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` renders a native `<input>`",
          "`type` defaults to `\"text\"`",
          "`disabled` maps to the native `disabled` attribute",
          "`required` maps to the native `required` attribute",
          "`onChange` receives the native change event",
          "`onValueChange` receives the next string value from the event target",
          "both callbacks may fire for the same change event",
          "all additional native input attributes/properties are forwarded to the underlying element",
          "the forwarded ref points at the real `<input>` element"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package does not add custom ARIA or `data-*` state reflection by default.",
          "Consumers may pass native ARIA attributes through `Root` as normal input attributes/properties."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "controlled value behavior",
          "uncontrolled value behavior from `defaultValue`",
          "composed `onChange` and `onValueChange`",
          "native type defaulting and supported type passthrough",
          "`disabled` and `required` attribute mapping",
          "ref forwarding to the native input element",
          "baseline accessibility with a labeled usage example"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
