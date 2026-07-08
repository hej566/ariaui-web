export const componentSpec = {
  "kind": "component",
  "name": "Card",
  "slug": "card",
  "packageName": "@ariaui-web/card",
  "description": "Browser-native Web Component package.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-card",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-card-content",
      "defaultRole": "region",
      "defaultAttributes": {}
    },
    {
      "name": "Description",
      "tagName": "aria-card-description",
      "defaultRole": "note",
      "defaultAttributes": {}
    },
    {
      "name": "Footer",
      "tagName": "aria-card-footer",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Header",
      "tagName": "aria-card-header",
      "defaultRole": "heading",
      "defaultAttributes": {}
    },
    {
      "name": "Title",
      "tagName": "aria-card-title",
      "defaultRole": "heading",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/card/readme.md",
    "coverage": {
      "sourceSections": 9,
      "coveredSections": 9,
      "requirements": 18
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/card`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "HTML sectioning and grouping content: https://html.spec.whatwg.org/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/card` is a content container primitive for grouping related UI into a consistent part structure."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`Header`",
          "`Title`",
          "`Description`",
          "`Content`",
          "`Footer`"
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
          "Accessibility depends on the semantics consumers choose for the content placed inside the card."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "card parts provide structural composition for common container layouts",
          "the package does not impose interaction semantics by itself"
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
          "structural composition of card parts",
          "ref and attributes/properties passthrough for each exported part"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
