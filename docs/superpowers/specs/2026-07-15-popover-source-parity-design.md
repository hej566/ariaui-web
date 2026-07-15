# Popover Source Parity Design

## Goal

Refactor `@ariaui-web/popover` so its browser-native custom elements match the current Popover specification, source test intent, documentation structure, live examples, and visual behavior from the sibling `/home/neo/Projects/ariaui` package.

The package implementation must stay framework-free. In particular, `packages/popover` must not depend on Framer Motion, React, or ReactDOM. The documentation may use the existing `web/doc` Framer Motion dependency for the Framer Motion live example.

## Source Of Truth

Use these sibling AriaUI files as the contract:

- `packages/popover/readme.md`
- `packages/popover/__test__/popover.test.tsx`
- `packages/popover/src/Root/`
- `packages/popover/src/Trigger/`
- `packages/popover/src/Content/`
- `packages/popover/src/Heading/`
- `packages/popover/src/Description/`
- `packages/popover/src/Close/`
- `packages/popover/src/hooks/usePopover.ts`
- `web/doc/src/app/docs/components/popover/page.md`
- `web/doc/src/markdoc/partials/popover/`
- `web/doc/src/components/popover/`

React-only APIs are translated into native custom-element behavior. `asChild` maps to `native-composition`. The package remains `@ariaui-web/popover`, the `popover` directory and docs slug remain unchanged, and the public parts remain `Root`, `Trigger`, `Content`, `Heading`, `Description`, and `Close`.

## Chosen Approach

Implement Popover as a package-specific native behavior layer, following the local `dialog` and `hover-card` pattern. Do not push Popover behavior into `@ariaui-web/utils`, and do not create a React island for docs.

This is preferred because Popover needs real package behavior, not just corrected metadata or docs shims. It also keeps the work scoped to Popover instead of refactoring shared primitives such as Portal, Focus Scope, Arrow, Position, Dialog, or Hover Card.

## Package Architecture

Add focused Popover-local modules:

- `popover-dom.ts` resolves Root and associated parts, selects native-composition hosts, assigns stable ids, locates tabbable elements, and parses attributes.
- `popover-actions.ts` handles Trigger activation, Close activation, outside dismissal, Escape dismissal, cancelable open requests, and focus restoration.
- `popover-position.ts` positions Content relative to Trigger, applies viewport-aware side flipping, reflects `data-side`, updates arrow placement, and manages update listeners while open.
- `popover-focus.ts` moves initial focus, loops focus by default, traps focus when modal, supports `loop="false"`, and avoids unbounded frame scheduling.
- `popover-sync.ts` applies `default-open`, synchronizes state and ARIA, wires labels, manages optional arrow markup, and starts or stops focus and positioning lifecycles.
- `popover-element.ts` owns custom-element lifecycle, observed attributes, mutation observation, and listener cleanup while delegating behavior to the focused modules.

Use existing browser APIs and local utilities. The package may depend on existing `@ariaui-web` packages where needed, especially `@ariaui-web/position`, but it must not add framework or animation dependencies.

## Native Contract

Root supports:

- `open` and the boolean `open` property.
- `default-open` for uncontrolled initial state.
- `placement`, defaulting to `bottom`.
- `offset`, defaulting to the source-equivalent spacing.
- `modal`, defaulting to false.
- A bubbling, cancelable `openchange` event with `{ open, source }` detail.

Trigger supports:

- Button-like activation by click, `Enter`, and `Space`.
- Disabled guards.
- `aria-haspopup="dialog"`.
- `aria-expanded`, `aria-controls`, and `data-state` reflection.

Content supports:

- `role="dialog"` while active.
- `aria-modal`, `aria-labelledby`, `aria-describedby`, `data-state`, and `data-side`.
- `arrow` and `arrow-class`.
- `loop`, defaulting to true.
- `force-mount` when docs need an exit animation.
- `native-composition` so the first element child can become the semantic and positioned host.

Heading supports heading semantics with a default level of `2` when the custom-element host is the semantic host. Heading `native-composition` preserves an existing child id when present.

Description supplies accessible description text without an invented `note` role.

Close is a button-like part that requests closure and restores focus after a successful close. It does not expose popup or expansion attributes.

## Behavior Contract

The native Popover mirrors source behavior where it maps cleanly to custom elements:

- Closed by default; `default-open` initializes uncontrolled open state.
- If `open` is authored up front, interaction requests emit `openchange` but do not mutate state until the consumer changes `open`.
- Trigger toggles on click, `Enter`, and `Space`; disabled Trigger does nothing.
- Opening synchronizes Trigger and Content ARIA, positions Content, renders or reveals the effective Content host, and focuses the first tabbable descendant.
- Close closes unless its click is prevented, then restores focus to Trigger.
- Outside `mousedown` closes the Popover when the event is not prevented.
- `Escape` closes the Popover and restores focus to Trigger.
- Heading and Description receive stable ids and wire to Content through `aria-labelledby` and `aria-describedby`.
- `arrow` creates exactly one internal marker and `arrow-class` applies authored classes to it.
- Positioning uses viewport-aware placement, offset, resolved side reflection, and side flipping.
- Focus loops by default in modal and non-modal Content. `loop="false"` lets focus leave at the boundary.
- `modal` traps focus inside Content while open.
- Closing stops positioning, focus, document listeners, observers, and scheduled work.

## Documentation Design

Replace the generic Popover docs page with the source-equivalent page structure:

1. Features
2. Installation
3. Examples
4. Anatomy
5. API Reference
6. Keyboard
7. Accessibility

The default live example recreates the source Dimensions Popover:

- Adjustments icon and `Dimensions` Trigger.
- Heading and description.
- Width, maximum width, height, and maximum height fields with the same values.
- Arrow and close control.
- Matching width, spacing, typography, border, color, shadow, focus, and input layout.

The Framer Motion live example recreates the source Motion Popover:

- Bell icon and `Motion Popover` Trigger.
- `Release checks` heading.
- Design tokens, Keyboard paths, and Docs preview rows.
- Arrow and close control.
- Source-equivalent opacity, vertical offset, scale, duration, easing, and reduced-motion handling.

The docs examples are live browser-native custom elements, not static decorative markup. The docs may use Framer Motion in `web/doc`, but `packages/popover` must contain no Framer Motion import or dependency.

Styles stay scoped under `.ariaui-web-preview[data-component="popover"]`, use existing tokens or utility-style classes where practical, and avoid direct layout or sizing inline styles except for runtime-computed positioning.

## Testing Design

Use strict TDD. Add failing tests before implementation changes.

Package tests should cover:

- corrected component-spec roles and default attributes
- closed, `default-open`, uncontrolled, and controlled-style `openchange` behavior
- Trigger click and keyboard toggling
- disabled and prevented interaction guards
- Content dialog ARIA and labeling
- Heading/Description id wiring
- Close, outside click, and Escape dismissal
- initial focus, focus loop, disabled loop, modal trap, and focus restoration
- placement, offset, side flipping, and `data-side`
- optional arrow and `arrow-class`
- `native-composition` for Content and Heading
- cleanup of observers, listeners, and scheduled work

Docs tests should cover:

- page heading order matching the source AriaUI Popover page
- default and Framer Motion live examples
- matching preview and HTML snippet pairs
- scoped Popover styles
- basic live example interactivity in JSDOM where possible
- boundary checks proving Framer Motion is docs-only

## Generator Workflow

The repository instruction requires `node scripts/generate-from-ariaui.mjs` after source package or documentation additions. Because the current main worktree contains unrelated user-owned Pagination/docs changes and deleted superpowers files, generator review must be careful.

Use this safe workflow:

1. Keep Popover edits scoped and stage only Popover-related files.
2. Run the generator after Popover source/doc additions.
3. Review the generated diff before any hand edits resume.
4. Preserve unrelated user-owned Pagination/Listbox/docs changes.
5. If the generator would overwrite unrelated dirty work, use an isolated worktree to inspect the generator output and port back only intentional Popover/template changes.

## Verification

Completion requires fresh evidence from:

- focused Popover package tests
- focused docs tests
- Popover package type checking and build
- docs type checking and production build
- broader tests when focused checks are green
- browser visual testing on the VitePress Popover route

Browser verification must cover desktop and mobile viewports where practical, opening the default example, interacting with fields, closing through Close, outside click, and Escape, checking focus restoration, checking arrow/placement, and inspecting the Framer Motion entry and exit behavior.

Rendered visual testing is required. Source inspection alone is not sufficient.

## Scope Boundaries

- Do not add Framer Motion, React, ReactDOM, or framework-specific patterns to `@ariaui-web/popover`.
- Do not rename the package directory, package name, custom-element tags, public parts, or docs slug.
- Do not add public Portal or Arrow parts to Popover.
- Do not refactor Dialog, Hover Card, Position, Portal, Focus Scope, Arrow, or unrelated packages.
- Do not touch unrelated user-owned Pagination/Listbox/docs changes except where unavoidable for shared docs registration.
