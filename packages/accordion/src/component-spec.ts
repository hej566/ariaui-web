export const componentSpec = {
  "kind": "component",
  "name": "Accordion",
  "slug": "accordion",
  "packageName": "@ariaui-web/accordion",
  "description": "This document defines the normative behavior for `@ariaui-web/accordion` using the WAI-ARIA Authoring Practices accordion pattern as the primary rule set.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-accordion",
      "defaultRole": null,
      "defaultAttributes": {
        "dir": "ltr",
        "orientation": "vertical"
      }
    },
    {
      "name": "Button",
      "tagName": "aria-accordion-button",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-accordion-content",
      "defaultRole": "region",
      "defaultAttributes": {}
    },
    {
      "name": "Header",
      "tagName": "aria-accordion-header",
      "defaultRole": "heading",
      "defaultAttributes": {
        "aria-level": "3"
      }
    },
    {
      "name": "Item",
      "tagName": "aria-accordion-item",
      "defaultRole": "listitem",
      "defaultAttributes": {}
    },
    {
      "name": "Panel",
      "tagName": "aria-accordion-panel",
      "defaultRole": "region",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-accordion-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-disabled",
    "aria-expanded",
    "aria-labelledby",
    "aria-level",
    "data-orientation",
    "dir",
    "disabled",
    "id",
    "open",
    "orientation",
    "required",
    "role",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/accordion/readme.md",
    "coverage": {
      "sourceSections": 21,
      "coveredSections": 21,
      "requirements": 150
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the normative behavior for `@ariaui-web/accordion` using the WAI-ARIA Authoring Practices accordion pattern as the primary rule set."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "WAI-ARIA APG Accordion: [https://www.w3.org/WAI/ARIA/apg/patterns/accordion/](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)",
          "APG rules are normative."
        ]
      },
      {
        "title": "Server rendering (SSR)",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Custom elements must be registered on the client. Use them from a **client-side custom element registration** in frameworks with server-rendered HTML (e.g. Next.js App Router), or wrap usage in your own client boundary.",
          "Server-rendered HTML is supported: state derived from `defaultValue` / controlled `value` matches the first client render for the same attributes/properties, so hydration stays consistent. Browser-only APIs run inside effects or event handlers, not during render."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/accordion` is an APG-aligned disclosure composite with root-managed single or multiple item state."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package public parts map to the APG model as follows:",
          "`Root`: accordion container and shared state owner.",
          "`Item`: one accordion section.",
          "`Header`: the APG heading wrapper.",
          "`Trigger`: the APG header button.",
          "`Content`: the controlled panel region.",
          "`Button`: alias of `Trigger`.",
          "`Panel`: alias of `Content`.",
          "`Accordion.useAccordionItemContext`: hook to read the enclosing item's state (`value`, `disabled`, `isOpen`, `triggerId`, `contentId`, `toggle`) from descendants of `Item`. Also exported as `Accordion.useItemContext` for compatibility."
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
        "title": "Required Structure",
        "sourceHeadingLevel": 3,
        "requirements": [
          "An accordion is composed of repeated sections:",
          "A heading element.",
          "A single `button` inside that heading.",
          "An associated content panel controlled by that button.",
          "Normative requirements:",
          "Each accordion item has exactly one header button.",
          "The header button is the only interactive accordion control inside the heading.",
          "The heading contains only the accordion trigger for that item.",
          "The controlled panel is associated to the trigger through ARIA linkage."
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
        "title": "Root Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` provides shared accordion state and renders a container element.",
          "Required API:",
          "`type: \"single\" | \"multiple\"`",
          "Supported state models:",
          "controlled: `value`, `onValueChange`",
          "uncontrolled: `defaultValue`",
          "Root behavior:",
          "`type=\"single\"` allows at most one item open at a time",
          "`type=\"multiple\"` allows more than one item open",
          "in `single` mode, `collapsible` defaults to `false`",
          "in `single` mode, `collapsible={true}` allows the open item to close",
          "in `multiple` mode, `collapsible` is invalid",
          "Root state attributes/properties:",
          "`disabled?: boolean` defaults to `false`",
          "`orientation?: \"vertical\" | \"horizontal\"` defaults to `\"vertical\"`",
          "`dir?: \"ltr\" | \"rtl\"` defaults to `\"ltr\"`",
          "`native composition?: boolean` defaults to `false`",
          "Root DOM attributes (on the outer container `<div>`):",
          "`data-orientation` matches `orientation` (for styling hooks).",
          "`dir` matches the `dir` attributes/properties so bidirectional text, `:dir()` / logical CSS, and inherited direction stay aligned with horizontal roving-focus key mapping.",
          "when `native composition` is true, root DOM attributes/properties and ref are merged onto the immediate child element instead of rendering the default `<div>`",
          "Type-level contract:",
          "`single` accepts `value/defaultValue: string`",
          "`multiple` accepts `value/defaultValue: string[]`",
          "`collapsible` is only valid for `single`"
        ]
      },
      {
        "title": "Item Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Item` represents one accordion section.",
          "Required API:",
          "`value: string`",
          "Optional API:",
          "`disabled?: boolean`",
          "`native composition?: boolean`",
          "Item behavior:",
          "item open state is keyed by `value`, not render index",
          "duplicate `value` registration is invalid and throws",
          "root-level disabled state disables every item",
          "item-level disabled state disables that item only",
          "when `native composition` is true, item DOM attributes/properties and ref are merged onto the immediate child element instead of rendering the default `<div>`"
        ]
      },
      {
        "title": "Header Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Header` represents the APG heading wrapper for the trigger.",
          "Normative requirements:",
          "`Header` renders a semantic heading element, or a custom element with equivalent heading semantics",
          "the heading contains the trigger button for that item",
          "the heading should not contain other persistent content outside the trigger",
          "Default behavior:",
          "default rendered tag is `h3`",
          "`native composition` merges heading attributes/properties onto the immediate child element when a different heading host is needed",
          "If a custom element is used:",
          "it must expose equivalent heading semantics",
          "if it is not a native heading, it must provide `role=\"heading\"` and a valid `aria-level`"
        ]
      },
      {
        "title": "Trigger Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Trigger` is the accordion header button.",
          "Normative requirements:",
          "renders a `button`",
          "controls exactly one content panel",
          "exposes `aria-expanded`",
          "exposes `aria-controls`",
          "receives focus during keyboard navigation",
          "Disabled semantics:",
          "disabled items are not interactive",
          "in a non-collapsible single accordion, if an item is open and cannot be collapsed, its trigger exposes `aria-disabled=\"true\"`"
        ]
      },
      {
        "title": "Content Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Content` is the controlled accordion panel.",
          "Normative requirements when mounted:",
          "the panel has an `id`",
          "the panel is labelled by its trigger via `aria-labelledby`",
          "the panel may expose `role=\"region\"` when appropriate",
          "Mounting behavior:",
          "closed content may be unmounted by default",
          "`forceMount` keeps closed content mounted for animation workflows",
          "`native composition` may merge panel attributes/properties onto a custom host element for composition with animation libraries such as Framer Motion"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Required trigger semantics:",
          "`aria-expanded=\"true|false\"`",
          "`aria-controls=\"<panel-id>\"`",
          "Required panel semantics:",
          "`id=\"<panel-id>\"`",
          "`aria-labelledby=\"<trigger-id>\"`",
          "Optional but supported semantics:",
          "`role=\"region\"` on panel",
          "Heading semantics:",
          "native headings are preferred",
          "custom heading wrappers must provide explicit heading semantics"
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
        "title": "Keyboard Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Minimum APG behavior:",
          "`Enter` toggles the focused trigger",
          "`Space` toggles the focused trigger",
          "Optional APG behaviors adopted by this package:",
          "`ArrowDown` moves focus to the next enabled trigger in vertical orientation",
          "`ArrowUp` moves focus to the previous enabled trigger in vertical orientation",
          "`Home` moves focus to the first enabled trigger",
          "`End` moves focus to the last enabled trigger",
          "Vertical orientation (default): `ArrowDown` / `ArrowUp` follow DOM order only; they are **not** swapped when `dir=\"rtl\"`.",
          "Horizontal orientation (`orientation=\"horizontal\"`): roving focus uses **ArrowLeft** / **ArrowRight**, mapped from logical \"previous/next trigger along the list\" using `dir`:",
          "`dir=\"ltr\"`: `ArrowRight` -> next trigger, `ArrowLeft` -> previous (wraps; disabled triggers skipped).",
          "`dir=\"rtl\"`: the same logical motion uses the opposite physical arrows so \"forward\" matches right-to-left reading direction.",
          "Shared rules:",
          "navigation wraps at the ends of the trigger list",
          "disabled items are skipped by roving focus"
        ]
      },
      {
        "title": "Pointer Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "clicking an enabled trigger toggles its panel according to the current state model",
          "clicking a disabled trigger has no effect"
        ]
      },
      {
        "title": "SSR Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "server rendering must reflect `defaultValue`",
          "open panels render as open on the server",
          "closed panels may be omitted",
          "trigger/panel ARIA linkage must be stable across server render and hydration",
          "the root container includes `dir` (default `ltr` or the value you pass) in server markup"
        ]
      },
      {
        "title": "Composition Rules",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Item` components may be nested below wrapper elements inside `Root`; they are not required to be direct children",
          "`Button` and `Panel` must remain behaviorally identical to `Trigger` and `Content`",
          "`useAccordionItemContext` is valid only within an `Item` subtree (also available as `useItemContext`)"
        ]
      },
      {
        "title": "APG Deviations And Extensions",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package aligns with the APG rules above, with explicit extensions:",
          "**Horizontal roving focus** with `**dir`-aware arrow mapping** (`orientation=\"horizontal\"`), beyond the APG minimum.",
          "**Explicit HTML `dir`** on the root container, matching the `dir` attributes/properties, so layout and keyboard behavior stay consistent."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests should cover:",
          "Heading/button/panel ARIA linkage.",
          "Single and multiple state models.",
          "Non-collapsible single default behavior.",
          "Collapsible single behavior when explicitly enabled.",
          "Disabled item semantics.",
          "APG keyboard toggle behavior.",
          "Adopted optional keyboard navigation behavior.",
          "SSR open-state correctness.",
          "Alias parity.",
          "Duplicate value rejection.",
          "Type-level API discrimination.",
          "Custom heading semantics and current deviation coverage until implementation is aligned.",
          "Root `dir` / `data-orientation` attributes and SSR `dir` output.",
          "Horizontal roving focus for both `dir=\"ltr\"` and `dir=\"rtl\"`.",
          "`Root` and `Item` composition with `native composition`.",
          "`Content forceMount` closed-state rendering, SSR behavior, render-attributes/properties state, and content size CSS variables."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
