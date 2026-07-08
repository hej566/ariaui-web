export const componentSpec = {
  "kind": "component",
  "name": "Carousel",
  "slug": "carousel",
  "packageName": "@ariaui-web/carousel",
  "description": "Headless Web Component carousel primitives aligned to the basic WAI-ARIA APG carousel pattern.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-carousel",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Container",
      "tagName": "aria-carousel-container",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "NextButton",
      "tagName": "aria-carousel-next-button",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "PreviousButton",
      "tagName": "aria-carousel-previous-button",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Slide",
      "tagName": "aria-carousel-slide",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Viewport",
      "tagName": "aria-carousel-viewport",
      "defaultRole": "group",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-atomic",
    "aria-hidden",
    "aria-label",
    "aria-labelledby",
    "aria-live",
    "aria-roledescription",
    "data-active",
    "data-axis",
    "disabled",
    "orientation",
    "required",
    "role",
    "selected",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/carousel/readme.md",
    "coverage": {
      "sourceSections": 39,
      "coveredSections": 39,
      "requirements": 215
    },
    "sections": [
      {
        "title": "@ariaui-web/carousel",
        "sourceHeadingLevel": 1,
        "requirements": [
          "Headless Web Component carousel primitives aligned to the basic WAI-ARIA APG carousel pattern."
        ]
      },
      {
        "title": "Installation",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Code line: npm install @ariaui-web/carousel"
        ]
      },
      {
        "title": "Supported Public API",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Supported parts:",
          "`Root`",
          "`Viewport`",
          "`Container`",
          "`Slide`",
          "`PreviousButton`",
          "`NextButton`",
          "`Carousel.useCarouselContext`",
          "Supported `Root` attributes/properties:",
          "`loop?: boolean`",
          "`orientation?: \"horizontal\" | \"vertical\"`",
          "`slidesPerView?: number`",
          "`defaultIndex?: number`",
          "`index?: number`",
          "`onIndexChange?: (index: number) => void`"
        ]
      },
      {
        "title": "Basic Example",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Code line: import { defineCarouselElements } from \"@ariaui-web/carousel\";",
          "Code line: export function Example() {",
          "Code line: return (",
          "Code line: <aria-carousel aria-label=\"Featured articles\" defaultIndex={0}>",
          "Code line: <div className=\"flex items-center justify-between gap-3\">",
          "Code line: <aria-carousel-previous-button>Previous</aria-carousel-previous-button>",
          "Code line: <aria-carousel-next-button>Next</aria-carousel-next-button>",
          "Code line: </div>",
          "Code line: <aria-carousel-viewport>",
          "Code line: <aria-carousel-container>",
          "Code line: <aria-carousel-slide>Slide 1</aria-carousel-slide>",
          "Code line: <aria-carousel-slide>Slide 2</aria-carousel-slide>",
          "Code line: <aria-carousel-slide>Slide 3</aria-carousel-slide>",
          "Code line: <aria-carousel-slide>Slide 4</aria-carousel-slide>",
          "Code line: </aria-carousel-container>",
          "Code line: </aria-carousel-viewport>",
          "Code line: </aria-carousel>"
        ]
      },
      {
        "title": "Notes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` renders `role=\"region\"` with `aria-roledescription=\"carousel\"` by default.",
          "`Viewport` uses `aria-live=\"polite\"` for the manual carousel contract.",
          "Canonical slides expose `role=\"group\"` and `aria-roledescription=\"slide\"` with positional labels like `\"1 of 4\"`.",
          "`orientation` switches the track measurement and translation axis.",
          "`slidesPerView` affects finite boundary math for multi-slide layouts and the number of boundary clones used for loop positioning.",
          "`loop` enables infinite wraparound by rendering private, aria-hidden boundary clones while keeping public selection canonical and moving one canonical slide per navigation activation."
        ]
      },
      {
        "title": "Out Of Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The current contract does not include:",
          "autoplay / auto-rotation",
          "dot or tabbed slide pickers",
          "plugin APIs",
          "events or progress queries",
          "imperative hook or instance APIs"
        ]
      },
      {
        "title": "Carousel Normative Spec",
        "sourceHeadingLevel": 1,
        "requirements": [
          "The local Aria UI package docs include this h1 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "1. Status And Authority",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document is the maintainer-facing normative contract for `@ariaui-web/carousel`.",
          "It defines the supported public surface and the observable invariants that refactors MUST preserve. If implementation, tests, README content, docs examples, or historical design documents disagree with this file, this file is authoritative.",
          "Historical design and plan documents under `docs/plans/` are non-authoritative once implementation lands. They may explain intent, but they do not define the supported contract.",
          "Primary external reference:",
          "APG carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
        ]
      },
      {
        "title": "2. Supported Public Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "2.1 Exported Parts",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The supported public exports are:",
          "`Root`",
          "`Viewport`",
          "`Container`",
          "`Slide`",
          "`PreviousButton`",
          "`NextButton`",
          "`Carousel.useCarouselContext`",
          "No other component, hook, context value, helper, or instance API is part of the supported public contract unless added to this document."
        ]
      },
      {
        "title": "2.2 Context Hook",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Carousel.useCarouselContext` is exported for custom carousel parts rendered beneath `Root`.",
          "The hook MUST:",
          "throw when used outside `Root`",
          "expose the current canonical `selectedIndex`",
          "expose navigation helpers compatible with `PreviousButton` and `NextButton`",
          "The hook's internal registration, measurement, clone, and transition fields are implementation details unless this document explicitly promotes them."
        ]
      },
      {
        "title": "2.3 Supported Root Props",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` supports the following carousel-specific attributes/properties:",
          "`loop?: boolean`",
          "`orientation?: \"horizontal\" | \"vertical\"`",
          "`slidesPerView?: number`",
          "`defaultIndex?: number`",
          "`index?: number`",
          "`onIndexChange?: (index: number) => void`",
          "All other attributes/properties accepted by `Root` are passthrough DOM attributes/properties for the rendered root element and do not imply additional carousel features."
        ]
      },
      {
        "title": "2.4 Unsupported Public Surface",
        "sourceHeadingLevel": 3,
        "requirements": [
          "This package does not currently define or guarantee public support for:",
          "autoplay / auto-rotation",
          "dot controls or tabbed pickers",
          "drag gestures as public API",
          "events beyond `onIndexChange`",
          "progress or in-view queries",
          "breakpoints",
          "plugins",
          "imperative instance APIs",
          "custom keyboard navigation beyond native button behavior",
          "If such behavior exists internally, it remains implementation detail unless added here."
        ]
      },
      {
        "title": "3. Root Invariants",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` is the owner of carousel semantics and canonical selection state."
        ]
      },
      {
        "title": "3.1 Accessibility Semantics",
        "sourceHeadingLevel": 3,
        "requirements": [
          "By default, `Root` MUST render:",
          "`role=\"region\"`",
          "`aria-roledescription=\"carousel\"`",
          "The root MUST have an accessible name supplied by the consumer, such as via `aria-label` or `aria-labelledby`.",
          "If the root element accepts DOM role override through attributes/properties passthrough, that override is supported only as normal host-element behavior. It does not expand the carousel contract beyond the semantics defined here."
        ]
      },
      {
        "title": "3.2 Selection Ownership",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` MUST own the selected canonical slide index.",
          "Selection MUST follow these rules:",
          "exactly one canonical slide is selected at a time when at least one canonical slide exists",
          "`defaultIndex` initializes uncontrolled selection",
          "`index` and `onIndexChange` provide controlled selection",
          "public selection MUST always refer to canonical slides"
        ]
      },
      {
        "title": "4. Viewport Invariants",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Viewport` is the clipping region for the track.",
          "For the supported manual carousel pattern, `Viewport` MUST render:",
          "`aria-live=\"polite\"`",
          "`aria-atomic=\"false\"`"
        ]
      },
      {
        "title": "5. Container Invariants",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Container` is the track element that positions slides.",
          "The container MUST:",
          "render canonical slides in the order supplied by the consumer",
          "apply the internal positioning required to present the selected canonical slide",
          "support finite track positioning by default",
          "support clone-based boundary positioning when `loop` is enabled",
          "The container's internal transform strategy, transition strategy, bootstrap phases, and measurement approach are not public API unless explicitly defined in this document."
        ]
      },
      {
        "title": "6. Slide Invariants",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Slide` defines the public slide identity model.",
          "Canonical slides MUST:",
          "render `role=\"group\"`",
          "render `aria-roledescription=\"slide\"`",
          "expose a default positional accessible name in the form `\"{n} of {total}\"` when index and total are known",
          "expose `data-active=\"true\"` only for the selected canonical slide",
          "Canonical slide identity is the only public slide identity recognized by this package.",
          "The package MUST preserve the following invariant:",
          "public slide counts, labels, active state, and selection semantics MUST be computed from canonical slides only"
        ]
      },
      {
        "title": "7. Navigation Button Invariants",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "7.1 Element Semantics",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`PreviousButton` and `NextButton` MUST render native `button` elements.",
          "They MUST default to:",
          "`type=\"button\"`"
        ]
      },
      {
        "title": "7.2 Navigation Semantics",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`PreviousButton` MUST attempt to move selection to the previous canonical slide.",
          "`NextButton` MUST attempt to move selection to the next canonical slide.",
          "These components MUST operate on canonical selection only."
        ]
      },
      {
        "title": "7.3 Disabled State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`PreviousButton` MUST be disabled at the lower finite boundary.",
          "`NextButton` MUST be disabled at the upper finite boundary.",
          "When `loop` is enabled and more than one slide exists, both navigation buttons MUST remain enabled so activation can wrap to the opposite edge.",
          "If the consumer explicitly passes `disabled`, the explicit attributes/properties MAY override computed availability. If this override behavior is retained, it MUST remain consistent across both button components."
        ]
      },
      {
        "title": "7.4 Focus Behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Button activation MUST NOT forcibly move focus onto the selected slide.",
          "The supported keyboard contract is native button keyboard behavior only."
        ]
      },
      {
        "title": "8. Selection Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The public selection model is canonical-index based."
        ]
      },
      {
        "title": "8.1 Canonical Index Rules",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package MUST preserve the following rules:",
          "public selection APIs refer to canonical indices",
          "`onIndexChange` receives canonical indices only",
          "public active-state semantics MUST remain attached to canonical slides only"
        ]
      },
      {
        "title": "8.2 Controlled And Uncontrolled Behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "For uncontrolled usage:",
          "`defaultIndex` initializes selection once",
          "For controlled usage:",
          "`index` is the source of truth",
          "`onIndexChange` communicates requested canonical selection changes",
          "Refactors MUST preserve the semantic distinction between controlled and uncontrolled modes."
        ]
      },
      {
        "title": "9. SSR And Hydration Invariants",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package MUST produce a valid canonical carousel structure during server render.",
          "server render MUST preserve canonical slide identity and canonical carousel semantics",
          "server render MUST NOT require client measurement in order to expose correct public accessibility semantics"
        ]
      },
      {
        "title": "10. slidesPerView Semantics",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`slidesPerView` is a supported input to the finite layout model.",
          "This attributes/properties influences how many canonical slides are considered visible when finite boundary math and loop clone counts are computed.",
          "in finite mode, `slidesPerView` MAY affect the last valid selected start position",
          "in loop mode, `slidesPerView` MAY affect how many boundary clones are rendered for positioning",
          "loop navigation MUST still move one canonical slide per activation",
          "`slidesPerView` MUST NOT change the meaning of canonical selection"
        ]
      },
      {
        "title": "11. Orientation Semantics",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`orientation` is a supported input to the track measurement and translation model.",
          "`orientation` defaults to `\"horizontal\"`",
          "`orientation=\"horizontal\"` MUST measure slide offsets on the x axis and expose `data-axis=\"x\"`",
          "`orientation=\"vertical\"` MUST measure slide offsets on the y axis and expose `data-axis=\"y\"`",
          "`orientation` MUST NOT change the meaning of canonical selection or slide labels",
          "button semantics remain previous and next; consumers may label or style controls as left/right or up/down"
        ]
      },
      {
        "title": "12. Keyboard And Focus Rules",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The supported APG target is the basic manual carousel variant.",
          "This package guarantees:",
          "navigation buttons participate in normal tab order",
          "button activation works with native keyboard button behavior",
          "slides do not become tabbable solely for carousel navigation",
          "no custom arrow-key navigation contract is defined",
          "Any additional keyboard affordance remains out of scope unless explicitly specified here."
        ]
      },
      {
        "title": "13. Non-Guarantees And Implementation Freedom",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The following are not currently guaranteed and MAY change without being considered a public API break, provided all normative sections above remain true:",
          "internal DOM shape beyond the documented public parts",
          "internal measurement algorithm",
          "internal transform values or timing details",
          "internal axis, alignment, or direction abstractions",
          "internal context structure",
          "internal helper functions and hooks",
          "Maintainers should avoid promoting implementation detail into public contract accidentally through docs or tests."
        ]
      },
      {
        "title": "14. Change Procedure",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Any public behavior or API change affecting this package MUST update, in this order:",
          "this spec file",
          "contract tests",
          "implementation",
          "package README and docs examples",
          "If a behavior is tested but not specified, maintainers MUST decide whether:",
          "to promote it into this document as supported contract, or",
          "to relax the test because it is implementation detail",
          "Tests MUST NOT silently define contract in areas this document intentionally leaves unspecified."
        ]
      },
      {
        "title": "15. Testing Guidance",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "15.1 Contract Tests",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Contract tests live in `__test__/carousel.contract.test.tsx`. They verify the supported public surface and the observable invariants in this spec. They SHOULD cover:",
          "exported public parts",
          "supported root attributes/properties and selection behavior",
          "root, viewport, and slide accessibility semantics",
          "previous/next button behavior at finite boundaries and loop wraparound",
          "canonical slide identity and public slide counts",
          "horizontal and vertical orientation semantics",
          "public context hook behavior",
          "SSR and hydration outcomes that are explicitly required by this spec",
          "Contract tests MUST assert outcomes, not internal mechanisms."
        ]
      },
      {
        "title": "15.2 Internal Regression Tests",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Internal regression tests live in `__test__/carousel.internal.test.tsx`. They MAY cover private implementation details when they protect against known regressions, but they are not authoritative for public API shape.",
          "These tests SHOULD be isolated from contract tests and clearly treated as implementation-detail coverage."
        ]
      },
      {
        "title": "15.3 Avoid Accidental Contract Expansion",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Tests MUST NOT silently promote implementation detail into public contract.",
          "In particular, contract tests SHOULD avoid depending on:",
          "exact transform values unless transform math is explicitly specified in this document",
          "private hooks or private context values",
          "internal attributes or markers that are not part of the supported public surface",
          "If a test depends on one of the above, maintainers MUST decide whether:",
          "the behavior is intended public contract and should be added to this spec, or",
          "the test should be relaxed, moved, or removed because it covers implementation detail only"
        ]
      },
      {
        "title": "15.4 Accessibility Assertions",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Accessibility tests SHOULD prefer asserting externally observable outcomes over exact implementation technique.",
          "Preferred assertions:",
          "public slides are discoverable with the expected roles and labels",
          "sequential focus behavior matches the normative contract",
          "Less preferred assertions, unless intentionally contractual:",
          "exact hidden attributes on private DOM nodes"
        ]
      },
      {
        "title": "15.5 Spec First",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When behavior changes, maintainers MUST update artifacts in this order:",
          "this spec",
          "contract tests",
          "implementation",
          "README and docs examples",
          "If a test and this document disagree, this document is the source of truth."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
