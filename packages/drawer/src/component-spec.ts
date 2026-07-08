export const componentSpec = {
  "kind": "component",
  "name": "Drawer",
  "slug": "drawer",
  "packageName": "@ariaui-web/drawer",
  "description": "This document defines the current contract for `@ariaui-web/drawer`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-drawer",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Action",
      "tagName": "aria-drawer-action",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "true"
      }
    },
    {
      "name": "Cancel",
      "tagName": "aria-drawer-cancel",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "true"
      }
    },
    {
      "name": "Close",
      "tagName": "aria-drawer-close",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "true"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-drawer-content",
      "defaultRole": "region",
      "defaultAttributes": {}
    },
    {
      "name": "Description",
      "tagName": "aria-drawer-description",
      "defaultRole": "note",
      "defaultAttributes": {}
    },
    {
      "name": "Footer",
      "tagName": "aria-drawer-footer",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Header",
      "tagName": "aria-drawer-header",
      "defaultRole": "heading",
      "defaultAttributes": {}
    },
    {
      "name": "Overlay",
      "tagName": "aria-drawer-overlay",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Portal",
      "tagName": "aria-drawer-portal",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Title",
      "tagName": "aria-drawer-title",
      "defaultRole": "heading",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-drawer-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "listbox"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-describedby",
    "aria-expanded",
    "aria-haspopup",
    "aria-labelledby",
    "aria-modal",
    "data-drawer-content",
    "data-side",
    "data-state",
    "id",
    "open",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/drawer/readme.md",
    "coverage": {
      "sourceSections": 27,
      "coveredSections": 27,
      "requirements": 140
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/drawer`.",
          "It uses:",
          "WAI-ARIA Dialog (Modal) pattern as the accessibility baseline",
          "shadcn/ui Drawer (Vaul) as the compositional API model",
          "`@ariaui-web/dialog` as reference for focus management and ARIA wiring conventions",
          "This package is the slide-out drawer composition layer. It is not a generic dialog - it is a directional panel that slides in from an edge of the viewport."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
          "shadcn/ui Drawer: https://ui.shadcn.com/docs/components/drawer",
          "Vaul: https://github.com/emilkowalski/vaul",
          "`packages/dialog/readme.md`"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/drawer` is a composable primitive for presenting a slide-out panel anchored to an edge of the viewport. It shares the same dialog accessibility model as `@ariaui-web/dialog` - modal focus trap, `role=\"dialog\"`, `aria-modal`, label wiring - but adds directional slide-in/out positioning and a structural part hierarchy (header, footer, close) suited to side and bottom panels.",
          "Ownership:",
          "`drawer` owns open state, focus management, body scroll lock, portal rendering, and dialog ARIA semantics",
          "directional positioning and animation are applied to `Content` via the `side` attributes/properties"
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports a composable part structure:",
          "`Root`",
          "`Trigger`",
          "`Portal`",
          "`Overlay`",
          "`Content`",
          "`Header`",
          "`Title`",
          "`Description`",
          "`Footer`",
          "`Close`"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Open State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package supports controlled and uncontrolled open state.",
          "Current public shape:",
          "`open?: boolean`",
          "`defaultOpen?: boolean`",
          "`onOpenChange?: (open: boolean) => void`",
          "Behavior:",
          "`Root` is the source of truth for drawer visibility",
          "`Trigger` opens the drawer",
          "`Close` and `Overlay` click close the drawer",
          "`Escape` closes the drawer unless `onEscapeKeyDown` calls `event.preventDefault()`",
          "overlay click closes the drawer unless `onInteractOutside` calls `event.preventDefault()`",
          "closing restores focus to the trigger by default"
        ]
      },
      {
        "title": "Side State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package supports a `side` attributes/properties on `Content`:",
          "`side?: \"top\" | \"right\" | \"bottom\" | \"left\"` - defaults to `\"bottom\"`",
          "Side controls which edge the panel is displayed from. Positioning and animation reflect the resolved side."
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
          "Responsibilities:",
          "own drawer open/closed state (controlled/uncontrolled)",
          "provide context to all descendant parts",
          "generate unique IDs for title and description accessibility wiring"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "open the drawer on click",
          "expose drawer-expanded state via ARIA attributes",
          "act as the focus restoration target when the drawer closes"
        ]
      },
      {
        "title": "Portal",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "portal the overlay and content to `document.body` by default",
          "accept an optional `container` attributes/properties to render into a custom element"
        ]
      },
      {
        "title": "Overlay",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the background backdrop behind the drawer content as a `<div>` by default, or slot the overlay attributes/properties onto a single child element when `native composition` is set",
          "support Framer Motion and other custom overlay hosts through `native composition` while preserving overlay click dismissal",
          "close the drawer on click (unless `onInteractOutside` prevents it)",
          "only render when the drawer is open"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "render the drawer panel as a `<div>` by default, or slot the panel attributes/properties onto a single child element when `native composition` is set",
          "support Framer Motion and other custom hosts through `native composition` while preserving dialog ARIA semantics",
          "trap focus within the panel using FocusScope",
          "handle `Escape` dismissal",
          "restore focus on close",
          "lock body scroll while open",
          "prevent scroll outside the content area (wheel, touch, keyboard)",
          "display from the edge specified by the `side` attributes/properties",
          "only render when the drawer is open"
        ]
      },
      {
        "title": "Header",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "provide a layout container for the drawer title and description",
          "renders a `<div>`"
        ]
      },
      {
        "title": "Title",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "provide the accessible title for the drawer",
          "its `id` is auto-generated and wired to `Content`'s `aria-labelledby`",
          "renders an `<h2>`"
        ]
      },
      {
        "title": "Description",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "provide the accessible description for the drawer",
          "its `id` is auto-generated and wired to `Content`'s `aria-describedby`",
          "renders a `<p>`"
        ]
      },
      {
        "title": "Footer",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "provide a layout container for drawer actions (e.g. confirm/cancel buttons)",
          "renders a `<div>`"
        ]
      },
      {
        "title": "Close",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "close the drawer on click",
          "renders a `<button>` with `type=\"button\"`"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "APG alignment",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package satisfies the WAI-ARIA dialog modal expectations by default:",
          "`Trigger` exposes `aria-haspopup=\"dialog\"` and `aria-expanded`",
          "`Content` exposes `role=\"dialog\"` and `aria-modal=\"true\"`",
          "`Content` is labelled by `Title` via `aria-labelledby`",
          "`Content` is described by `Description` via `aria-describedby`",
          "focus moves into `Content` when the drawer opens",
          "`Escape` closes the drawer",
          "focus returns to `Trigger` when the drawer closes"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Dismissal paths",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Close` click closes the drawer",
          "`Overlay` click closes the drawer (preventable via `onInteractOutside`)",
          "`Escape` keydown closes the drawer (preventable via `onEscapeKeyDown`)",
          "all dismissal paths call `onOpenChange(false)`"
        ]
      },
      {
        "title": "Focus management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "focus moves to the first focusable element in `Content` on open",
          "`Tab` and `Shift+Tab` cycle focus only within `Content`",
          "focus returns to `Trigger` on close"
        ]
      },
      {
        "title": "Scroll lock",
        "sourceHeadingLevel": 3,
        "requirements": [
          "body and document scroll are locked while the drawer is open",
          "wheel, touch, and keyboard scroll events outside `Content` are prevented",
          "scroll is restored when the drawer closes"
        ]
      },
      {
        "title": "Portal and layering",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Portal` renders overlay and content into `document.body` by default",
          "a custom `container` attributes/properties on `Portal` redirects rendering"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Part | Attribute | Value",
          "Table row: `Trigger` | `aria-haspopup` | `\"dialog\"`",
          "Table row: `Trigger` | `aria-expanded` | `true \\ | false`",
          "Table row: `Trigger` | `aria-controls` | id of `Content`",
          "Table row: `Trigger` | `data-state` | `\"open\" \\ | \"closed\"`",
          "Table row: `Content` | `role` | `\"dialog\"`",
          "Table row: `Content` | `aria-modal` | `\"true\"`",
          "Table row: `Content` | `aria-labelledby` | id of `Title`",
          "Table row: `Content` | `aria-describedby` | id of `Description`",
          "Table row: `Content` | `data-side` | `\"top\" \\ | \"right\" \\ | \"bottom\" \\ | \"left\"`",
          "Table row: `Content` | `data-drawer-content` | present on the actual content host, including when `native composition` is used",
          "Table row: `Title` | `id` | auto-generated, referenced by `Content`",
          "Table row: `Description` | `id` | auto-generated, referenced by `Content`"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/drawer/__test__` should cover:",
          "controlled and uncontrolled open-state behavior",
          "`Trigger` opens the drawer",
          "`Close` closes the drawer",
          "`Overlay` click closes the drawer",
          "`onInteractOutside` prevents overlay-click dismissal",
          "`Escape` closes the drawer",
          "`onEscapeKeyDown` prevents escape dismissal",
          "focus moves into `Content` on open",
          "focus trap - Tab and Shift+Tab cycle within `Content`",
          "focus restoration to `Trigger` on close",
          "body scroll locked while open; restored on close",
          "dialog ARIA semantics on `Content`",
          "`aria-labelledby` / `aria-describedby` wired to `Title` / `Description` ids",
          "`Trigger` ARIA state reflection (`aria-expanded`, `data-state`)",
          "portal renders into `document.body` by default",
          "`side` attributes/properties changes display side on `Content`",
          "`Content native composition` slots drawer attributes/properties onto a custom host for animation composition",
          "`Overlay native composition` slots overlay attributes/properties onto a custom host for animation composition",
          "axe passes in all valid configurations"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
