export const componentSpec = {
  "kind": "component",
  "name": "Skeleton",
  "slug": "skeleton",
  "packageName": "@ariaui-web/skeleton",
  "description": "`@ariaui-web/skeleton` is a headless loading placeholder primitive inspired by Radix Themes Skeleton. It provides loading-state semantics and size attributes/properties, but no visual styling.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-skeleton",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-hidden",
    "data-inline-skeleton",
    "data-state",
    "tabindex"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/skeleton/readme.md",
    "coverage": {
      "sourceSections": 7,
      "coveredSections": 7,
      "requirements": 33
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/skeleton` is a headless loading placeholder primitive inspired by Radix Themes Skeleton. It provides loading-state semantics and size attributes/properties, but no visual styling."
        ]
      },
      {
        "title": "Public API",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`RootProps`",
          "No aliases, hooks, context, or compound parts are exported."
        ]
      },
      {
        "title": "Root Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` renders loading placeholders while `loading` is true and returns children directly when `loading` is false.",
          "Code line: interface RootProps",
          "Code line: extends Omit<native element attributes/properties for \"span\", \"children\"> {",
          "Code line: children?: Node | string;",
          "Code line: loading?: boolean; // default: true",
          "Code line: width?: CSS properties[\"width\"];",
          "Code line: minWidth?: CSS properties[\"minWidth\"];",
          "Code line: maxWidth?: CSS properties[\"maxWidth\"];",
          "Code line: height?: CSS properties[\"height\"];",
          "Code line: minHeight?: CSS properties[\"minHeight\"];",
          "Code line: maxHeight?: CSS properties[\"maxHeight\"];"
        ]
      },
      {
        "title": "Loading behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`loading={true}` is the default.",
          "If `children` is a valid native Web Component element, that element is cloned and becomes the loading placeholder host.",
          "If `children` is text, missing, or otherwise not a valid element, the placeholder host is a `span`.",
          "The loading host receives `aria-hidden`, `inert`, `tabIndex={-1}`, and `data-state=\"loading\"`.",
          "Text and non-element placeholders also receive `data-inline-skeleton`.",
          "`loading={false}` returns children directly and does not add wrapper DOM."
        ]
      },
      {
        "title": "Styling Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package is intentionally unstyled. Consumers provide all placeholder visuals through `className`, `style`, or the size attributes/properties.",
          "Recommended examples:",
          "`className=\"h-4 w-48 animate-pulse rounded-md bg-muted\"`",
          "`width={192} height={16}`",
          "`className=\"animate-pulse rounded-md bg-muted text-transparent\"` when wrapping text."
        ]
      },
      {
        "title": "Accessibility Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Skeletons are visual loading affordances, not interactive widgets or progress announcements. The loading host is hidden from assistive technology and made inert so pending content cannot be focused or used.",
          "When `loading={false}`, final content is rendered directly and must carry its own roles, labels, and keyboard behavior."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "Unit tests in `packages/skeleton/__test__`.",
          "This spec.",
          "Documentation examples and API tables in `web/doc`."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
