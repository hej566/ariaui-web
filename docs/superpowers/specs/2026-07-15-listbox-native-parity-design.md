# Listbox Native Parity Design

## Goal

Refactor `@ariaui-web/listbox` from its generic generated shell into a dedicated browser-native Listbox implementation whose observable behavior, accessibility contract, test coverage, documentation structure, live examples, and visual presentation match the sibling `ariaui` Listbox package.

The source of truth is the behavior exposed by:

- `../ariaui/packages/listbox/readme.md`
- `../ariaui/packages/listbox/src/**`
- `../ariaui/packages/listbox/__test__/listbox.test.tsx`
- `../ariaui/web/doc/src/app/docs/components/listbox/page.md`
- `../ariaui/web/doc/src/markdoc/partials/listbox/**`
- `../ariaui/web/doc/src/components/listbox/**`

React providers, hooks, refs, and render behavior are not copied. Their observable results are translated into custom-element attributes, properties, DOM relationships, delegated events, lifecycle cleanup, and native tests.

## Current State

The native package currently exposes only generic `AriaWebElement` behavior. Its component spec collapses the source submenu API into one `Submenu` part, assigns listbox semantics to both `Root` and `Content`, gives `Viewport` a role, and does not implement selection, navigation, typeahead, grouping, viewport measurement, or submenu behavior.

The current docs page is a generated part preview rather than the source page's feature, installation, example, anatomy, API, keyboard, and accessibility structure.

The shared worktree contains user-owned changes outside Listbox. The Listbox work must preserve those edits, including overlapping additions in shared docs tests and theme files.

## Scope

### In scope

- Correct the Listbox component spec and public part exports.
- Implement the source package's observable Listbox behavior with browser-native custom elements.
- Port the source test scenarios into native DOM tests using TDD.
- Keep the package `readme.md` aligned with the native contract.
- Replace the generic docs page with the source-equivalent page hierarchy.
- Add four functional live examples with source-equivalent content and presentation.
- Add docs regression and interaction tests.
- Run package, docs, build, accessibility, browser, and visual verification.

### Out of scope

- Copying React providers or hooks into the native package.
- Refactoring `@ariaui-web/select` or extracting a shared engine from it.
- Changing the package name, package directory, or `/components/listbox` documentation slug.
- Changing the sibling `ariaui` source package.
- Changing the package catalog or rerunning the generator for a catalog update.
- Unrelated changes to shared utilities or other packages.

## Chosen Approach

Use a dedicated, package-local Listbox runtime, following the repository's established behavior-port pattern. This avoids coupling Listbox to Select and keeps Listbox-specific DOM boundaries, selection rules, submenu behavior, and cleanup independently testable.

The implementation remains browser-native and preserves separated part modules. Listbox-specific behavior must not be moved into `packages/utils`.

## Public Part Model

The package exposes ten parts:

| Part | Custom element | Default semantics |
| --- | --- | --- |
| `Root` | `aria-listbox` | neutral state owner |
| `Label` | `aria-listbox-label` | neutral label host with generated or authored ID |
| `Content` | `aria-listbox-content` | `role="listbox"`, `tabindex="0"` |
| `Viewport` | `aria-listbox-viewport` | neutral native scroll wrapper |
| `Option` | `aria-listbox-option` | `role="option"` |
| `Group` | `aria-listbox-group` | `role="group"` |
| `GroupLabel` | `aria-listbox-group-label` | neutral label host with generated or authored ID |
| `Sub` | `aria-listbox-sub` | neutral submenu state owner |
| `SubTrigger` | `aria-listbox-sub-trigger` | `role="option"`, `aria-haspopup="listbox"` |
| `SubContent` | `aria-listbox-sub-content` | `role="listbox"`, `tabindex="0"` |

`Root` must not receive listbox semantics. `Content` is the primary listbox. `Viewport` must not receive an ARIA role. The generated `Submenu` part and tag are replaced by the source-equivalent `Sub`, `SubTrigger`, and `SubContent` parts.

`componentSpec.sourceTestParity` records `../ariaui/packages/listbox/__test__/listbox.test.tsx` as the behavioral source, records its 50 test cases, and includes the source Listbox page, partials, and example modules as documentation-parity sources.

## Runtime Architecture

### `listbox-dom.ts`

Owns DOM boundary queries and serialization helpers:

- find the nearest Listbox root, content, submenu, and owning menu
- query only options and submenu triggers owned by a specific menu
- prevent nested listboxes or nested submenu content from leaking items into a parent menu
- parse and serialize root values using the repository's comma-separated attribute convention
- resolve single versus multiple selection mode
- resolve authored option values with a text fallback
- preserve authored IDs and generate missing stable IDs
- identify root-disabled, option-disabled, and submenu-disabled states

### `listbox-sync.ts`

Owns state-to-DOM reflection:

- initialize `default-value` without repeatedly overwriting later changes
- reflect selection to `value`, `aria-selected`, and state data attributes
- connect Label to Content through `aria-labelledby`
- connect GroupLabel to Group through `aria-labelledby`
- reflect `aria-multiselectable`
- track the active item and mirror its ID through `aria-activedescendant`
- reflect option and subtrigger active, disabled, expanded, and selected state
- keep open submenu content hidden until its Sub is open
- measure the first registered option for Viewport sizing
- clear stale active descendants, generated state, and submenu state when nodes are removed
- resynchronize around attribute and subtree mutations without crossing nested Listbox boundaries

Package-local state that cannot be expressed as authored attributes uses `WeakMap` storage so disconnected roots can be collected.

### `listbox-actions.ts`

Owns delegated interaction behavior:

- single selection replacement
- multiple selection toggling
- bubbling, composed `valuechange` events
- ArrowDown, ArrowUp, Home, End, and wrapping navigation
- Enter and Space selection
- 500 ms accumulated, case-insensitive, prefix typeahead
- hover activation without moving DOM focus
- click and keyboard disabled-option guards
- submenu click, hover, Enter, Space, and ArrowRight opening
- ArrowLeft and Escape submenu closing with trigger focus restoration
- single-select submenu selection closing and focus restoration
- dismissal when another parent option becomes active
- outside-pointer dismissal for open submenus

Document listeners and typeahead timers are registered only while needed and removed on disconnect.

### `listbox-position.ts`

Owns submenu geometry using the native positioning package:

- right-start placement relative to SubTrigger
- flip to left-start when the right side overflows
- x/y offsets supplied by Sub
- `data-side` reflection
- hidden pre-position state to avoid an initial misplaced flash
- recalculation while open when trigger/content geometry, document scroll, or viewport size changes

The native Sub API accepts `offset-x` and `offset-y` attributes and an `offset` object property. The docs examples use `offset-y="-5"` to match the sibling example.

### `listbox-element.ts` and part modules

`ListboxWebElement` wires lifecycle, observed attributes, delegated click/keyboard/mouse behavior, mutation observation, and tree synchronization. Each public part remains in its own `src/parts/<Part>.ts` module and receives its spec metadata through a package-local constructor path.

## Native State and Events

### Root

- `selection-mode="single|multiple"`; default is `single`
- `default-value`; used only for initial uncontrolled state
- `value`; current serialized selection
- `value` property follows the existing native package string convention
- `valuechange` event has `detail.value` as a string in single mode and a string array in multiple mode

The event bubbles and is composed. It fires only when the effective selection changes.

### Content and active item

Content exposes `role="listbox"`, `tabindex="0"`, `aria-labelledby`, `aria-multiselectable`, and `aria-activedescendant`.

Keyboard navigation moves DOM focus to the active option or SubTrigger because that is the behavior asserted by the sibling package tests. Content simultaneously tracks the active item's ID through `aria-activedescendant`. Hover updates active state without moving DOM focus.

### Options

Options expose:

- a required authored `value` with text-content fallback for resilience
- `role="option"`
- `aria-selected="true|false"`
- `aria-disabled="true"` and disabled data state when disabled
- `data-active="true|false"`
- `data-state="checked|unchecked"`

Disabled options remain reachable during arrow-key navigation, matching the source tests, but neither click nor keyboard activation may select them.

### Groups

Group receives `role="group"` and a stable ID. GroupLabel receives a stable ID. Group's `aria-labelledby` references its GroupLabel. Authored IDs are not replaced.

### Viewport

Viewport exposes `data-listbox-viewport=""`. A valid positive `max-visible-items` value constrains the viewport to:

`first owned option row height * max-visible-items`

and enables native vertical overflow. Invalid values, missing rows, or zero-height rows leave it unconstrained. Row-size changes while connected trigger recalculation.

### Submenus

Sub owns open state and offsets. SubTrigger participates in its parent Content's item order and exposes `role="option"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-disabled`, `data-active`, and a stable ID. SubContent exposes listbox semantics and is labelled by its trigger.

Single-selection inside SubContent closes the submenu and restores focus to SubTrigger. Multiple-selection remains open so additional values can be toggled. ArrowLeft and Escape close only the current submenu level.

## Invalid Composition and Edge Cases

Framework provider errors are translated into safe native composition guards:

- Viewport outside Content remains unconstrained and does not claim a role.
- SubTrigger without both an owning Content and Sub remains inert.
- SubContent without an owning Sub remains hidden and inert.
- Empty menus ignore navigation and selection keys without throwing.
- Removed active items clear `aria-activedescendant` and active state.
- Nested Listbox roots and nested submenu menus never contribute items to an ancestor menu.
- Disconnecting a root or submenu removes observers, document listeners, resize listeners, and timers.

The native runtime must not throw asynchronously from a custom-element lifecycle callback for invalid consumer markup.

## Documentation Design

The native page retains `/components/listbox` and follows the sibling page order:

1. Listbox title and description
2. Features
3. Installation
4. Examples
5. Anatomy
6. API Reference
7. Keyboard
8. Accessibility

The generic `Register Elements` and `Web Component Contract` sections are folded into installation, anatomy, and API content rather than appearing as the primary page structure.

### Live examples

The page contains four source-equivalent live custom-element examples in this order:

1. Basic
2. Max visible items
3. Single selection with submenu
4. Multiple selection with submenu

Each preview has an adjacent HTML fence whose normalized markup matches the live preview. Examples use source-equivalent labels and values: Fruits, More, Vegetables, Apple, Banana, Orange, Carrot, and Potato.

Check icons are inline accessible-hidden SVGs. Scoped CSS shows or hides them from the package-owned `aria-selected` state. Selection, viewport measurement, submenu interaction, and submenu positioning remain entirely package-owned; the docs layer does not duplicate component behavior.

### Styling

Styles live in the VitePress theme stylesheet and are scoped under:

`.ariaui-web-preview[data-component="listbox"]`

The page translates the sibling Tailwind classes into token-backed CSS using the native docs token variables for border, popover background/foreground, muted text, accent hover/active state, brand selection state, radius, and shadow.

The examples do not use authored inline layout or sizing styles when a scoped class can express the same result. Viewport `max-height` remains a runtime-computed inline style because measurement is part of the component contract.

## TDD Strategy

No production behavior is added before a failing test demonstrates it. Each behavior group follows RED, verify RED, GREEN, verify GREEN, and REFACTOR while staying green.

### Package parity groups

1. Part names, custom-element tags, roles, default attributes, exports, and spec metadata.
2. Basic rendering, label wiring, Content semantics, and source-equivalent public entry helpers.
3. Single and multiple selection, default values, external value changes, event payloads, and no-op changes.
4. Arrow navigation, Home/End, wrapping, DOM focus, and `aria-activedescendant` clearing.
5. Enter/Space selection, typeahead, case handling, accumulation timeout, and hover activation.
6. Disabled option focusability and click/keyboard selection guards.
7. Group/GroupLabel relationships and nested Listbox boundary isolation.
8. Viewport measurement, invalid values, zero-height rows, native overflow, and resize recalculation.
9. Submenu hover/click opening, dismissal, ArrowRight/Left/Escape, selection closing, focus restoration, and nested menu ownership.
10. Submenu offsets, right-start placement, left flipping, visibility, and `data-side`.
11. Mutation resynchronization and disconnect cleanup.
12. `axe-core` accessibility fixtures for basic, selected, disabled, grouped, and multiple-selection listboxes.

React-only hook-render-count and provider implementation tests are replaced by observable DOM assertions: unchanged inactive options retain their state, invalid compositions stay inert, and nested boundaries do not leak behavior.

### Documentation test groups

1. Source-equivalent section and example heading order.
2. Four live preview variants with the expected custom-element anatomy and source text.
3. Preview and HTML-fence markup equality.
4. Scoped Listbox styles and package registration in the VitePress theme.
5. Basic single selection and selected-check synchronization.
6. Viewport measurement and native scrolling.
7. Single submenu hover, click, keyboard, selection, closing, and focus behavior.
8. Multiple selection across parent and submenu options.
9. No horizontal overflow and no Listbox-specific styles or behavior leaking outside the Listbox docs page.

## Verification

Run verification in increasing scope:

1. Focused Listbox unit tests after each TDD cycle.
2. Complete `@ariaui-web/listbox` tests.
3. Focused documentation tests.
4. Complete repository tests.
5. TypeScript linting.
6. Listbox package build.
7. VitePress documentation build.
8. Rendered browser comparison between the sibling Aria UI page and native page.

Visual verification covers desktop and mobile viewports and records screenshots for:

- Basic default and selected states
- Max visible items before and after scrolling
- Single submenu closed, hover-open, keyboard-open, and selected states
- Multiple selection with values selected in both parent and submenu content
- keyboard focus and active styling
- submenu right-side and flipped-left placement where geometry permits

Every visual change is rendered and checked. Final browser QA also checks console errors, keyboard behavior, horizontal overflow, heading order, and accessible roles/names.

## Generator Boundary

The sibling package catalog and source documentation files are not being added or renamed, so the generator precondition in `AGENTS.md` is not triggered by this refactor. The implementation must not run `node scripts/generate-from-ariaui.mjs` after hand-authored parity work because the current generator resets non-preserved package and docs enhancements. If the sibling Listbox package or documentation catalog changes during implementation, stop, run the generator before hand edits as instructed, and review its complete diff before continuing.

## Completion Criteria

The work is complete when:

- all ten native Listbox parts are exported and registered under `@ariaui-web/listbox`
- the runtime passes the source-equivalent native behavior and accessibility tests
- `readme.md`, `componentSpec`, implementation, and exports agree
- the docs page matches the sibling page structure
- all four live examples match the sibling content, styling, and behavior
- targeted and full tests, linting, package build, and docs build pass
- desktop and mobile visual verification passes without console errors or horizontal overflow
- existing user-owned changes outside Listbox remain intact
