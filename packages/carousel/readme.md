# Carousel Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/carousel`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-carousel` | none |
| Container | `aria-carousel-container` | none |
| NextButton | `aria-carousel-next-button` | none |
| PreviousButton | `aria-carousel-previous-button` | none |
| Slide | `aria-carousel-slide` | none |
| Viewport | `aria-carousel-viewport` | `group` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/carousel/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 39 of 39 documented sections are represented after native normalization.
- Requirement lines: 215

### @ariaui-web/carousel

- Headless Web Component carousel primitives aligned to the basic WAI-ARIA APG carousel pattern.

### Installation

- Code line: npm install @ariaui-web/carousel

### Supported Public API

- Supported parts:
- `Root`
- `Viewport`
- `Container`
- `Slide`
- `PreviousButton`
- `NextButton`
- `Carousel.useCarouselContext`
- Supported `Root` attributes/properties:
- `loop?: boolean`
- `orientation?: "horizontal" | "vertical"`
- `slidesPerView?: number`
- `defaultIndex?: number`
- `index?: number`
- `onIndexChange?: (index: number) => void`

### Basic Example

- Code line: import { defineCarouselElements } from "@ariaui-web/carousel";
- Code line: export function Example() {
- Code line: return (
- Code line: <aria-carousel aria-label="Featured articles" defaultIndex={0}>
- Code line: <div className="flex items-center justify-between gap-3">
- Code line: <aria-carousel-previous-button>Previous</aria-carousel-previous-button>
- Code line: <aria-carousel-next-button>Next</aria-carousel-next-button>
- Code line: </div>
- Code line: <aria-carousel-viewport>
- Code line: <aria-carousel-container>
- Code line: <aria-carousel-slide>Slide 1</aria-carousel-slide>
- Code line: <aria-carousel-slide>Slide 2</aria-carousel-slide>
- Code line: <aria-carousel-slide>Slide 3</aria-carousel-slide>
- Code line: <aria-carousel-slide>Slide 4</aria-carousel-slide>
- Code line: </aria-carousel-container>
- Code line: </aria-carousel-viewport>
- Code line: </aria-carousel>

### Notes

- `Root` renders `role="region"` with `aria-roledescription="carousel"` by default.
- `Viewport` uses `aria-live="polite"` for the manual carousel contract.
- Canonical slides expose `role="group"` and `aria-roledescription="slide"` with positional labels like `"1 of 4"`.
- `orientation` switches the track measurement and translation axis.
- `slidesPerView` affects finite boundary math for multi-slide layouts and the number of boundary clones used for loop positioning.
- `loop` enables infinite wraparound by rendering private, aria-hidden boundary clones while keeping public selection canonical and moving one canonical slide per navigation activation.

### Out Of Scope

- The current contract does not include:
- autoplay / auto-rotation
- dot or tabbed slide pickers
- plugin APIs
- events or progress queries
- imperative hook or instance APIs

### Carousel Normative Spec

- The local Aria UI package docs include this h1 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### 1. Status And Authority

- This document is the maintainer-facing normative contract for `@ariaui-web/carousel`.
- It defines the supported public surface and the observable invariants that refactors MUST preserve. If implementation, tests, README content, docs examples, or historical design documents disagree with this file, this file is authoritative.
- Historical design and plan documents under `docs/plans/` are non-authoritative once implementation lands. They may explain intent, but they do not define the supported contract.
- Primary external reference:
- APG carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

### 2. Supported Public Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### 2.1 Exported Parts

- The supported public exports are:
- `Root`
- `Viewport`
- `Container`
- `Slide`
- `PreviousButton`
- `NextButton`
- `Carousel.useCarouselContext`
- No other component, hook, context value, helper, or instance API is part of the supported public contract unless added to this document.

### 2.2 Context Hook

- `Carousel.useCarouselContext` is exported for custom carousel parts rendered beneath `Root`.
- The hook MUST:
- throw when used outside `Root`
- expose the current canonical `selectedIndex`
- expose navigation helpers compatible with `PreviousButton` and `NextButton`
- The hook's internal registration, measurement, clone, and transition fields are implementation details unless this document explicitly promotes them.

### 2.3 Supported Root Props

- `Root` supports the following carousel-specific attributes/properties:
- `loop?: boolean`
- `orientation?: "horizontal" | "vertical"`
- `slidesPerView?: number`
- `defaultIndex?: number`
- `index?: number`
- `onIndexChange?: (index: number) => void`
- All other attributes/properties accepted by `Root` are passthrough DOM attributes/properties for the rendered root element and do not imply additional carousel features.

### 2.4 Unsupported Public Surface

- This package does not currently define or guarantee public support for:
- autoplay / auto-rotation
- dot controls or tabbed pickers
- drag gestures as public API
- events beyond `onIndexChange`
- progress or in-view queries
- breakpoints
- plugins
- imperative instance APIs
- custom keyboard navigation beyond native button behavior
- If such behavior exists internally, it remains implementation detail unless added here.

### 3. Root Invariants

- `Root` is the owner of carousel semantics and canonical selection state.

### 3.1 Accessibility Semantics

- By default, `Root` MUST render:
- `role="region"`
- `aria-roledescription="carousel"`
- The root MUST have an accessible name supplied by the consumer, such as via `aria-label` or `aria-labelledby`.
- If the root element accepts DOM role override through attributes/properties passthrough, that override is supported only as normal host-element behavior. It does not expand the carousel contract beyond the semantics defined here.

### 3.2 Selection Ownership

- `Root` MUST own the selected canonical slide index.
- Selection MUST follow these rules:
- exactly one canonical slide is selected at a time when at least one canonical slide exists
- `defaultIndex` initializes uncontrolled selection
- `index` and `onIndexChange` provide controlled selection
- public selection MUST always refer to canonical slides

### 4. Viewport Invariants

- `Viewport` is the clipping region for the track.
- For the supported manual carousel pattern, `Viewport` MUST render:
- `aria-live="polite"`
- `aria-atomic="false"`

### 5. Container Invariants

- `Container` is the track element that positions slides.
- The container MUST:
- render canonical slides in the order supplied by the consumer
- apply the internal positioning required to present the selected canonical slide
- support finite track positioning by default
- support clone-based boundary positioning when `loop` is enabled
- The container's internal transform strategy, transition strategy, bootstrap phases, and measurement approach are not public API unless explicitly defined in this document.

### 6. Slide Invariants

- `Slide` defines the public slide identity model.
- Canonical slides MUST:
- render `role="group"`
- render `aria-roledescription="slide"`
- expose a default positional accessible name in the form `"{n} of {total}"` when index and total are known
- expose `data-active="true"` only for the selected canonical slide
- Canonical slide identity is the only public slide identity recognized by this package.
- The package MUST preserve the following invariant:
- public slide counts, labels, active state, and selection semantics MUST be computed from canonical slides only

### 7. Navigation Button Invariants

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### 7.1 Element Semantics

- `PreviousButton` and `NextButton` MUST render native `button` elements.
- They MUST default to:
- `type="button"`

### 7.2 Navigation Semantics

- `PreviousButton` MUST attempt to move selection to the previous canonical slide.
- `NextButton` MUST attempt to move selection to the next canonical slide.
- These components MUST operate on canonical selection only.

### 7.3 Disabled State

- `PreviousButton` MUST be disabled at the lower finite boundary.
- `NextButton` MUST be disabled at the upper finite boundary.
- When `loop` is enabled and more than one slide exists, both navigation buttons MUST remain enabled so activation can wrap to the opposite edge.
- If the consumer explicitly passes `disabled`, the explicit attributes/properties MAY override computed availability. If this override behavior is retained, it MUST remain consistent across both button components.

### 7.4 Focus Behavior

- Button activation MUST NOT forcibly move focus onto the selected slide.
- The supported keyboard contract is native button keyboard behavior only.

### 8. Selection Model

- The public selection model is canonical-index based.

### 8.1 Canonical Index Rules

- The package MUST preserve the following rules:
- public selection APIs refer to canonical indices
- `onIndexChange` receives canonical indices only
- public active-state semantics MUST remain attached to canonical slides only

### 8.2 Controlled And Uncontrolled Behavior

- For uncontrolled usage:
- `defaultIndex` initializes selection once
- For controlled usage:
- `index` is the source of truth
- `onIndexChange` communicates requested canonical selection changes
- Refactors MUST preserve the semantic distinction between controlled and uncontrolled modes.

### 9. SSR And Hydration Invariants

- The package MUST produce a valid canonical carousel structure during server render.
- server render MUST preserve canonical slide identity and canonical carousel semantics
- server render MUST NOT require client measurement in order to expose correct public accessibility semantics

### 10. slidesPerView Semantics

- `slidesPerView` is a supported input to the finite layout model.
- This attributes/properties influences how many canonical slides are considered visible when finite boundary math and loop clone counts are computed.
- in finite mode, `slidesPerView` MAY affect the last valid selected start position
- in loop mode, `slidesPerView` MAY affect how many boundary clones are rendered for positioning
- loop navigation MUST still move one canonical slide per activation
- `slidesPerView` MUST NOT change the meaning of canonical selection

### 11. Orientation Semantics

- `orientation` is a supported input to the track measurement and translation model.
- `orientation` defaults to `"horizontal"`
- `orientation="horizontal"` MUST measure slide offsets on the x axis and expose `data-axis="x"`
- `orientation="vertical"` MUST measure slide offsets on the y axis and expose `data-axis="y"`
- `orientation` MUST NOT change the meaning of canonical selection or slide labels
- button semantics remain previous and next; consumers may label or style controls as left/right or up/down

### 12. Keyboard And Focus Rules

- The supported APG target is the basic manual carousel variant.
- This package guarantees:
- navigation buttons participate in normal tab order
- button activation works with native keyboard button behavior
- slides do not become tabbable solely for carousel navigation
- no custom arrow-key navigation contract is defined
- Any additional keyboard affordance remains out of scope unless explicitly specified here.

### 13. Non-Guarantees And Implementation Freedom

- The following are not currently guaranteed and MAY change without being considered a public API break, provided all normative sections above remain true:
- internal DOM shape beyond the documented public parts
- internal measurement algorithm
- internal transform values or timing details
- internal axis, alignment, or direction abstractions
- internal context structure
- internal helper functions and hooks
- Maintainers should avoid promoting implementation detail into public contract accidentally through docs or tests.

### 14. Change Procedure

- Any public behavior or API change affecting this package MUST update, in this order:
- this spec file
- contract tests
- implementation
- package README and docs examples
- If a behavior is tested but not specified, maintainers MUST decide whether:
- to promote it into this document as supported contract, or
- to relax the test because it is implementation detail
- Tests MUST NOT silently define contract in areas this document intentionally leaves unspecified.

### 15. Testing Guidance

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### 15.1 Contract Tests

- Contract tests live in `__test__/carousel.contract.test.tsx`. They verify the supported public surface and the observable invariants in this spec. They SHOULD cover:
- exported public parts
- supported root attributes/properties and selection behavior
- root, viewport, and slide accessibility semantics
- previous/next button behavior at finite boundaries and loop wraparound
- canonical slide identity and public slide counts
- horizontal and vertical orientation semantics
- public context hook behavior
- SSR and hydration outcomes that are explicitly required by this spec
- Contract tests MUST assert outcomes, not internal mechanisms.

### 15.2 Internal Regression Tests

- Internal regression tests live in `__test__/carousel.internal.test.tsx`. They MAY cover private implementation details when they protect against known regressions, but they are not authoritative for public API shape.
- These tests SHOULD be isolated from contract tests and clearly treated as implementation-detail coverage.

### 15.3 Avoid Accidental Contract Expansion

- Tests MUST NOT silently promote implementation detail into public contract.
- In particular, contract tests SHOULD avoid depending on:
- exact transform values unless transform math is explicitly specified in this document
- private hooks or private context values
- internal attributes or markers that are not part of the supported public surface
- If a test depends on one of the above, maintainers MUST decide whether:
- the behavior is intended public contract and should be added to this spec, or
- the test should be relaxed, moved, or removed because it covers implementation detail only

### 15.4 Accessibility Assertions

- Accessibility tests SHOULD prefer asserting externally observable outcomes over exact implementation technique.
- Preferred assertions:
- public slides are discoverable with the expected roles and labels
- sequential focus behavior matches the normative contract
- Less preferred assertions, unless intentionally contractual:
- exact hidden attributes on private DOM nodes

### 15.5 Spec First

- When behavior changes, maintainers MUST update artifacts in this order:
- this spec
- contract tests
- implementation
- README and docs examples
- If a test and this document disagree, this document is the source of truth.






## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
