export const componentSpec = {
  "kind": "component",
  "name": "Tabs",
  "slug": "tabs",
  "packageName": "@ariaui-web/tabs",
  "description": "Normative behavior and API contract for `@ariaui-web/tabs`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-tabs",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-tabs-content",
      "defaultRole": null,
      "defaultAttributes": {
        "tabindex": "0"
      }
    },
    {
      "name": "List",
      "tagName": "aria-tabs-list",
      "defaultRole": "tablist",
      "defaultAttributes": {}
    },
    {
      "name": "Panel",
      "tagName": "aria-tabs-panel",
      "defaultRole": "tabpanel",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-tabs-trigger",
      "defaultRole": "tab",
      "defaultAttributes": {
        "aria-selected": "false"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-labelledby",
    "aria-selected",
    "id",
    "orientation",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/tabs/readme.md",
    "coverage": {
      "sourceSections": 13,
      "coveredSections": 13,
      "requirements": 85
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Normative behavior and API contract for `@ariaui-web/tabs`.",
          "This package follows the WAI-ARIA APG tabs pattern as the accessibility baseline and documents the current implementation shape exported by this package.",
          "Source references:",
          "APG tabs pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
          "This package currently exposes:",
          "`Root`",
          "`List`",
          "`Trigger`",
          "`Panel`",
          "`Content`"
        ]
      },
      {
        "title": "Structure and Roles",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` is structural state/context and does not itself define tab, tablist, or tabpanel semantics.",
          "`List` renders the tablist container with `role=\"tablist\"` and does not rewrite or clone its children.",
          "`Trigger` renders `role=\"tab\"` and:",
          "registers itself with `Root` context so trigger order is derived from the rendered trigger set",
          "sets a generated `id`",
          "sets `aria-controls` to the associated panel id",
          "sets `aria-selected`",
          "sets roving `tabIndex`",
          "`Panel` renders coordinated tabpanel containers for its ordered `Content` children and:",
          "applies `role=\"tabpanel\"` to each generated panel container",
          "sets each panel `id` to match its associated trigger's `aria-controls`",
          "sets each panel `aria-labelledby` to the associated trigger id",
          "hides inactive panels with the `hidden` attribute",
          "`Content` is a structural content slot and does not itself apply tabpanel semantics."
        ]
      },
      {
        "title": "Composition Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root`, `List`, `Trigger`, and `Content` support `native composition`.",
          "When `native composition` is true, the part slots its attributes/properties and ref onto a single child element through `@ariaui-web/slot`.",
          "Use `native composition` with Framer Motion elements such as `motion.div` or `motion.button` when the rendered element needs to own animation attributes/properties.",
          "`Panel` remains the public part that owns tabpanel semantics and still renders the coordinated tabpanel containers."
        ]
      },
      {
        "title": "Focus Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Roving focus is implemented across `Trigger` elements.",
          "The active trigger has `tabIndex=0`; inactive triggers have `tabIndex=-1`.",
          "Arrow-key focus movement also updates the active tab value.",
          "`Home` moves focus and selection to the first tab.",
          "`End` moves focus and selection to the last tab."
        ]
      },
      {
        "title": "Selection Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` supports uncontrolled and controlled selection.",
          "`defaultValue` sets the initial active tab when uncontrolled.",
          "`defaultValue` and `value` are string keys.",
          "Each `Trigger` and `Content` must receive a matching string `value`.",
          "`value` controls the active tab value when provided.",
          "`onValueChange` is called with the next active tab value when selection changes.",
          "Clicking a trigger updates the active tab value.",
          "Arrow-key, `Home`, and `End` navigation also update the active tab value."
        ]
      },
      {
        "title": "Keyboard Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`ArrowRight` moves to the next tab and wraps.",
          "`ArrowLeft` moves to the previous tab and wraps.",
          "`Home` moves to the first tab.",
          "`End` moves to the last tab.",
          "Current implementation notes:",
          "Keyboard handling is attached to `Trigger`.",
          "`Trigger` key handlers call `preventDefault()` and `stopPropagation()` for the supported navigation keys.",
          "Horizontal orientation uses `ArrowRight` and `ArrowLeft`; vertical orientation uses `ArrowDown` and `ArrowUp`."
        ]
      },
      {
        "title": "Pointer Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Clicking a `Trigger` activates its associated tab.",
          "Trigger click handling calls `preventDefault()` and `stopPropagation()` before updating the active value.",
          "No other pointer behaviors are implemented by the package."
        ]
      },
      {
        "title": "State and Data Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` coordinates:",
          "active string value",
          "generated `tabIds`",
          "generated `tabpanelIds`",
          "the ordered registered trigger element list used for focus movement and id coordination",
          "The active trigger must expose `aria-selected=\"true\"` and `tabIndex={0}`.",
          "Inactive triggers must expose `aria-selected=\"false\"` and `tabIndex={-1}`.",
          "Trigger and panel ids must remain coordinated through `aria-controls` and `aria-labelledby`.",
          "`Panel` keeps a generated tabpanel id available for each trigger.",
          "Only the active `Content` child is rendered inside its visible panel; inactive panels remain hidden."
        ]
      },
      {
        "title": "Consumer Handler Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Consumer attributes/properties are forwarded to the rendered elements.",
          "Internal click and keyboard behavior remain authoritative because `Trigger` installs its own handlers directly.",
          "The package does not currently document a prevent-default escape hatch for overriding internal selection or navigation behavior."
        ]
      },
      {
        "title": "APG Mapping Notes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG supplies the normative keyboard and ARIA semantics for tabs.",
          "This package currently uses automatic activation: moving focus with supported navigation keys also changes the active panel.",
          "`Panel` is the public part that owns tabpanel semantics; `Content` is only an ordered slot wrapper."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests in `packages/tabs/__test__` should cover at least:",
          "default active tab behavior from `defaultValue`",
          "click selection",
          "controlled active tab behavior from `value` and `onValueChange`",
          "`ArrowRight` and `ArrowLeft` navigation, including wrapping behavior",
          "`Home` and `End` navigation",
          "tab-to-panel association via `id`, `aria-controls`, and `aria-labelledby`",
          "selected-state reflection via `aria-selected` and `tabIndex`",
          "rendering only the active `Content` inside the visible panel while inactive panels remain hidden",
          "additive consumer trigger handler behavior",
          "dynamic tab-list reconciliation when the number of tabs changes",
          "`native composition` composition for `Root`, `List`, `Trigger`, and `Content`"
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec",
          "Tabs unit tests",
          "Docs/examples when tabs behavior is documented"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
