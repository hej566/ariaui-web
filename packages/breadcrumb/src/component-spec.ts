export const componentSpec = {
  "kind": "component",
  "name": "Breadcrumb",
  "slug": "breadcrumb",
  "packageName": "@ariaui-web/breadcrumb",
  "description": "It uses: 1. WAI-ARIA APG breadcrumb guidance as the accessibility baseline 2. shadcn/ui breadcrumb composition as the higher-level structural reference",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-breadcrumb",
      "defaultRole": "navigation",
      "defaultAttributes": {
        "aria-label": "breadcrumb"
      }
    },
    {
      "name": "List",
      "tagName": "aria-breadcrumb-list",
      "defaultRole": "list",
      "defaultAttributes": {}
    },
    {
      "name": "Item",
      "tagName": "aria-breadcrumb-item",
      "defaultRole": "listitem",
      "defaultAttributes": {}
    },
    {
      "name": "Link",
      "tagName": "aria-breadcrumb-link",
      "defaultRole": "link",
      "defaultAttributes": {}
    },
    {
      "name": "Page",
      "tagName": "aria-breadcrumb-page",
      "defaultRole": "link",
      "defaultAttributes": {
        "aria-current": "page",
        "aria-disabled": "true"
      }
    },
    {
      "name": "Separator",
      "tagName": "aria-breadcrumb-separator",
      "defaultRole": "presentation",
      "defaultAttributes": {
        "aria-hidden": "true"
      }
    },
    {
      "name": "Ellipsis",
      "tagName": "aria-breadcrumb-ellipsis",
      "defaultRole": "presentation",
      "defaultAttributes": {
        "aria-hidden": "true"
      }
    }
  ],
  "requirementAttributes": [
    "aria-current",
    "aria-disabled",
    "aria-hidden",
    "aria-label",
    "disabled",
    "required",
    "role",
    "tabindex"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/breadcrumb/readme.md",
    "coverage": {
      "sourceSections": 20,
      "coveredSections": 20,
      "requirements": 177
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the breadcrumb contract for `@ariaui-web/breadcrumb`.",
          "It uses:",
          "WAI-ARIA APG breadcrumb guidance as the accessibility baseline",
          "shadcn/ui breadcrumb composition as the higher-level structural reference",
          "This file also records where the current package implementation differs from that fuller model."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG breadcrumb pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
          "shadcn/ui breadcrumb docs: https://ui.shadcn.com/docs/components/breadcrumb",
          "Note:",
          "Radix does not provide a dedicated breadcrumb primitive comparable to dialog, tabs, or dropdown-menu primitives, so it is not the primary source for this package."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A breadcrumb represents the hierarchical path to the current page.",
          "The intended composed structure is:",
          "a labeled navigation landmark",
          "an ordered list of breadcrumb items",
          "links for navigable ancestors",
          "a current-page representation for the final item",
          "optional separators between items",
          "optional ellipsis treatment for collapsed paths",
          "This package exposes all of those pieces as separate parts."
        ]
      },
      {
        "title": "Public API",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`Root`",
          "`List`",
          "`Item`",
          "`Link`",
          "`Page`",
          "`Separator`",
          "`Ellipsis`",
          "Associated type exports:",
          "`RootProps`",
          "`ListProps`",
          "`ItemProps`",
          "`LinkProps`",
          "`PageProps`",
          "`SeparatorProps`",
          "`EllipsisProps`"
        ]
      },
      {
        "title": "APG-Aligned Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG guidance for breadcrumbs is intentionally light:",
          "the breadcrumb trail is contained in a navigation landmark",
          "that landmark is labeled",
          "the current page is identified with `aria-current=\"page\"` when appropriate",
          "no special keyboard interaction is required beyond standard link navigation",
          "Implications for this package:",
          "`Root` should represent the breadcrumb landmark",
          "`List` and `Item` should provide semantic list structure",
          "ancestor items should typically render links",
          "the terminal item should indicate the current page",
          "separators should be hidden from assistive technology"
        ]
      },
      {
        "title": "shadcn-Aligned Structural Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "shadcn's breadcrumb examples establish a practical composition model:",
          "`Root` wraps the breadcrumb in a `nav`",
          "`List` is the ordered list container",
          "`Item` is the list item",
          "`Link` is the navigable ancestor",
          "`Page` is the current page label",
          "`Separator` is decorative only",
          "`Ellipsis` represents collapsed hidden path segments",
          "This package follows that same part breakdown."
        ]
      },
      {
        "title": "Part Contracts",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: type RootProps = native element attributes/properties for \"nav\";",
          "Current behavior:",
          "renders a `nav`",
          "applies `aria-label=\"breadcrumb\"` by default",
          "spreads consumer attributes/properties after the default label",
          "forwards a ref to the `nav`",
          "Implications:",
          "consumers may override `aria-label`",
          "consumers may pass `className`, `style`, `data-*`, and other `nav` attributes/properties directly"
        ]
      },
      {
        "title": "List",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: type ListProps = native element attributes/properties for \"ol\";",
          "Current behavior:",
          "renders an `ol`",
          "forwards all attributes/properties directly",
          "forwards ref to the `ol`"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: type ItemProps = native element attributes/properties for \"li\";",
          "Current behavior:",
          "renders an `li`",
          "forwards all attributes/properties directly",
          "forwards ref to the `li`"
        ]
      },
      {
        "title": "Link",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: type LinkProps = native element attributes/properties for \"a\";",
          "Current behavior:",
          "renders an `a`",
          "forwards all attributes/properties directly",
          "forwards ref to the anchor",
          "Expected usage:",
          "use for ancestor pages in the breadcrumb trail",
          "consumers are responsible for supplying `href`"
        ]
      },
      {
        "title": "Page",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: type PageProps = native element attributes/properties for \"span\";",
          "Current behavior:",
          "renders a `span`",
          "applies:",
          "`role=\"link\"`",
          "`aria-disabled=\"true\"`",
          "`aria-current=\"page\"`",
          "spreads consumer attributes/properties after those defaults",
          "forwards ref to the `span`",
          "APG note:",
          "APG requires identifying the current page, but does not require it to behave like a disabled link.",
          "Current implementation difference:",
          "this package represents the current page as a `span` with link-like semantics, not as plain text or an anchor."
        ]
      },
      {
        "title": "Separator",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: interface SeparatorProps extends native element attributes/properties for \"li\" {",
          "Code line: children?: Node | string;",
          "Current behavior:",
          "renders an `li`",
          "applies:",
          "`role=\"presentation\"`",
          "`aria-hidden=\"true\"`",
          "renders custom `children` when provided",
          "otherwise renders a default chevron icon",
          "forwards ref to the `li`",
          "Expected usage:",
          "place between breadcrumb items",
          "keep decorative only"
        ]
      },
      {
        "title": "Ellipsis",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Type:",
          "Code line: type EllipsisProps = native element attributes/properties for \"span\";",
          "Current behavior:",
          "renders a `span`",
          "applies:",
          "`role=\"presentation\"`",
          "`aria-hidden=\"true\"`",
          "renders a default ellipsis icon",
          "also renders a visually hidden `\"More\"` label inside the same span",
          "forwards ref to the `span`",
          "Current implementation caveat:",
          "because the outer span is `aria-hidden=\"true\"`, the inner `\"More\"` text is also hidden from assistive technology in practice"
        ]
      },
      {
        "title": "Keyboard Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG does not define special breadcrumb keyboard behavior.",
          "Current contract:",
          "no roving tabindex",
          "no arrow key navigation",
          "no typeahead",
          "normal browser link navigation only",
          "Implications:",
          "`Tab` and `Shift+Tab` move through focusable breadcrumb links according to normal document order",
          "non-link parts are not made focusable by the package"
        ]
      },
      {
        "title": "Pointer Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package has no internal pointer behavior.",
          "Current contract:",
          "`Link` behaves like a normal anchor",
          "`Page`, `Separator`, and `Ellipsis` are non-interactive by default",
          "any click handling beyond native anchor behavior is consumer-defined"
        ]
      },
      {
        "title": "Styling Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package is intentionally unstyled.",
          "Current behavior:",
          "no default classes",
          "no layout classes",
          "no spacing between items",
          "no default typography tokens",
          "default icons are provided only for `Separator` and `Ellipsis`",
          "Consumers are responsible for:",
          "layout direction",
          "spacing",
          "colors",
          "icon sizing",
          "overflow/collapsing presentation"
        ]
      },
      {
        "title": "Current Package Differences From Fuller shadcn-style Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Compared with a fuller shadcn-style breadcrumb abstraction, this package currently does not provide:",
          "built-in collapsed breadcrumb logic",
          "built-in responsive truncation or overflow management",
          "predefined styling tokens or variants",
          "a dedicated router-link integration abstraction",
          "Notable implementation choices:",
          "`Page` uses a `span` with `role=\"link\"` and `aria-disabled=\"true\"`",
          "`Separator` is a real `li` with presentation semantics",
          "`Ellipsis` is decorative and currently hidden from assistive technology as a whole"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/breadcrumb/__test__` currently cover:",
          "Rendering the breadcrumb fixture.",
          "Basic accessibility via `axe`.",
          "`Root` rendering as a labeled breadcrumb `nav`.",
          "`List` rendering as an ordered list.",
          "Ancestor links rendering as anchors with `href`.",
          "`Page` carrying `aria-current=\"page\"` and `aria-disabled=\"true\"`.",
          "Separators rendering hidden from assistive technology.",
          "`Item` list structure.",
          "Custom separator content.",
          "Ellipsis rendering hidden from assistive technology."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec file.",
          "Unit tests for this package.",
          "Docs examples and visual interaction tests when present."
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/breadcrumb/__test__/breadcrumb.test.tsx"
    ],
    "sourceTestCases": 10,
    "nativeRequirements": [
      "Root defaults to a navigation landmark with `aria-label=\"breadcrumb\"` while allowing consumer label overrides",
      "List and Item expose ordered-list and list-item semantics on native custom element hosts",
      "Link exposes link semantics and forwards link attributes such as `href` and `title`",
      "Page exposes `role=\"link\"`, `aria-disabled=\"true\"`, and `aria-current=\"page\"` current-page semantics",
      "Separator defaults to `role=\"presentation\"`, `aria-hidden=\"true\"`, and a chevron SVG when no custom content is provided",
      "Ellipsis defaults to `role=\"presentation\"`, `aria-hidden=\"true\"`, an ellipsis SVG, and hidden `More` text",
      "Separator and Ellipsis render source-equivalent default SVG content while staying hidden from assistive technology",
      "docs examples include default, collapsed, and custom-separator breadcrumb trails"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
