export const componentSpec = {
  "kind": "component",
  "name": "Textarea",
  "slug": "textarea",
  "packageName": "@ariaui-web/textarea",
  "description": "The component uses `\"use client\"` and `custom element host references`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-textarea",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "disabled",
    "required",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/textarea/readme.md",
    "coverage": {
      "sourceSections": 9,
      "coveredSections": 9,
      "requirements": 27
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/textarea`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "HTML textarea specification: https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element",
          "native Web Component textarea docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/textarea` is a thin wrapper around the native `<textarea>` element with string change handling via `onValueChange`."
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root` - the textarea component (`displayName`: `\"TextArea.Root\"`)",
          "`RootTypes` - TypeScript interface for `Root` attributes/properties",
          "The component uses `\"use client\"` and `custom element host references`.",
          "Current public shape (`RootTypes extends ComponentPropsWithoutRef<\"textarea\">`):",
          "`value?: string`",
          "`defaultValue?: string`",
          "`onValueChange?: (value: string) => void`",
          "Native `disabled` and `required` are forwarded directly (no aliases)"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The current implementation forwards `value` directly and emits `onValueChange` from `onChange`.",
          "If the user also passes `onChange`, it is called alongside `onValueChange` within the same internal handler."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package relies on native textarea semantics and standard HTML labelling."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` renders a native `<textarea>` via `custom element host references`",
          "`disabled` and `required` are native attributes/properties forwarded directly",
          "`onValueChange` receives the next string value from the event target",
          "additional textarea attributes/properties are forwarded to the underlying element via `{...rest}`",
          "`ref` is forwarded to the underlying `<textarea>`"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package does not add custom state reflection by default."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "native textarea rendering (assert element is a `<textarea>`)",
          "native `disabled` and `required` attributes/properties forwarding",
          "value passthrough and change handling (`value`, `defaultValue`, `onValueChange`)",
          "ref forwarding and attributes/properties passthrough"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
