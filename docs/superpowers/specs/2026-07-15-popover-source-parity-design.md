# Popover Source Parity Design

## Goal

Refactor `@ariaui-web/popover` so its browser-native custom elements implement the current Popover specification and source test behaviors from the sibling AriaUI repository. Replace the placeholder documentation with a page whose structure, live-example content, visual treatment, and interactions match the related AriaUI page. The documentation-only Framer Motion example must use the actual Framer Motion library without adding Framer Motion, React, or ReactDOM to the Popover package.

## Source of Truth

The implementation is derived from the current files under `/home/neo/Projects/ariaui`:

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

React-only concepts are translated into native custom-element contracts. Package names remain under the `@ariaui-web` scope, the `popover` package directory and documentation slug remain unchanged, and public parts stay separated as Root, Trigger, Content, Heading, Description, and Close.

## Chosen Approach

The Popover runtime remains framework-independent. It implements the AriaUI behavior directly with browser APIs and focused package-local modules. The documentation adds the same `framer-motion` version used by the sibling AriaUI documentation only to `web/doc`, then imports its DOM animation API only from the Popover live-example installer.

This approach is preferred over a React island because the live preview can animate the real custom elements without adding React and ReactDOM to VitePress. It is preferred over a documentation behavior shim because the package itself must satisfy the source behavior contract. It is preferred over a monolithic element class because DOM association, state synchronization, actions, focus, positioning, and top-layer lifecycle can be tested and maintained independently.

## Package Contract

### Public parts

- `Root` coordinates open state, positioning options, modality, part registration, and lifecycle.
- `Trigger` is a keyboard-focusable button-like custom element that toggles Root.
- `Content` is the dialog-like floating surface, rendered in the browser top layer where supported and positioned relative to Trigger.
- `Heading` supplies Content's accessible label.
- `Description` supplies Content's accessible description.
- `Close` requests closure and returns focus to Trigger.

The generated generic roles are corrected to the source-equivalent contract:

- Trigger uses `role="button"` and `aria-haspopup="dialog"`.
- Content uses `role="dialog"`, not `role="region"`.
- Close uses `role="button"` without popup or expansion attributes.
- Heading uses heading semantics with a default level of 2 when the custom-element host is the semantic host.
- Description carries no invented `note` role.

`componentSpec` and `readme.md` must describe the native behavior and identify the source Popover tests used for parity.

### Attributes, properties, and events

Root supports:

- `open` and the corresponding boolean property for current state.
- `default-open` for the uncontrolled initial state.
- `placement`, defaulting to `bottom`, including top, right, bottom, left, and start/end variants.
- `offset`, defaulting to `10` CSS pixels to match the source hook.
- `modal`, defaulting to false.
- A bubbling, cancelable `openchange` event with `{ open, source }` detail before an interaction mutates state.

Canceling `openchange` leaves Root unchanged so a consumer can own the `open` property, which is the native equivalent of the source controlled `open` and `onOpenChange` pair. Directly setting the `open` property or attribute synchronizes the tree without dispatching another request event.

Content supports:

- `arrow` to render one internal arrow marker.
- `arrow-class` to assign consumer classes to that marker.
- `loop`, defaulting to true; `loop="false"` disables boundary wrapping.
- `force-mount` to keep the content host present for an exit animation while closed.
- `native-composition` to apply dialog, position, state, and focus attributes to the first element child instead of the Content wrapper.

Heading supports `native-composition`, preserving an existing child id when present and otherwise assigning a stable id to the semantic host.

### State and ARIA reflection

- Root, Trigger, and the effective Content host reflect `data-state="open"` or `data-state="closed"`.
- Trigger reflects `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` only while Content is open.
- The effective Content host reflects `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`, and resolved `data-side`.
- Closed content is hidden by default. Force-mounted closed content is `aria-hidden`, inert, and non-interactive while remaining available for a documentation exit animation.
- Heading and Description receive stable ids and Content references them while they are present.
- Disabled Trigger interaction is ignored.
- Prevented `openchange` or Close click requests do not mutate state.

## Runtime Architecture

The refactor keeps responsibilities in package-local modules:

- `popover-dom.ts` resolves Root and its associated parts, selects native-composition hosts, assigns stable ids, locates tabbable elements, and parses boolean and numeric attributes.
- `popover-actions.ts` handles Trigger and Close activation, outside mouse dismissal, Escape dismissal, cancelable state requests, and focus restoration.
- `popover-focus.ts` schedules initial focus, loops focus when enabled, traps focus in modal mode, observes late-added focus targets without scheduling an unbounded frame loop, and releases modal effects on close.
- `popover-position.ts` uses `@ariaui-web/position` to calculate viewport-relative coordinates, flip at viewport collisions, expose the resolved side, update the arrow, and install scroll, resize, and observer updates while open.
- `popover-sync.ts` applies `default-open` once, synchronizes state and ARIA, creates or removes the optional arrow, shows or hides the effective Content host, and starts or stops focus and positioning lifecycles.
- `popover-element.ts` owns custom-element lifecycle, observed attributes, mutation observation, and listener cleanup while delegating behavior to the focused modules.

Content uses the HTML Popover API in manual mode where available. This gives the native surface portal-equivalent top-layer rendering without moving authored nodes away from Root. A hidden, fixed-position fallback provides the same observable contract in jsdom and browsers without the required popover methods. The package depends on `@ariaui-web/position` for positioning but does not depend on any framework or animation library.

When `native-composition` is present, the first element child becomes the semantic, positioned, top-layer, and animated host. Content remains the stable custom-element coordinator, and Trigger's `aria-controls` references the effective host.

## Behavioral Contract

1. Content is closed initially unless Root has `default-open` or an explicit open state.
2. Trigger click, Enter, or Space requests the inverse open state; disabled Trigger does nothing.
3. Opening synchronizes Trigger and Content ARIA, enters the top layer or fallback surface, positions Content, and focuses the first tabbable descendant.
4. Clicking outside Trigger and Content requests close.
5. Escape requests close and returns focus to Trigger.
6. Close requests close after consumer click handlers run, does nothing when the click was prevented, and returns focus to Trigger after successful closure.
7. Heading and Description ids remain connected to Content as descendants are added, removed, or composed.
8. `arrow` creates exactly one marker, and the marker tracks the resolved placement side.
9. Positioning uses the viewport boundary, flips when the requested side overflows, and does not flip merely because an authored ancestor clips overflow.
10. Focus loops by default in modal and non-modal Content; `loop="false"` lets focus leave at a boundary.
11. Modal Content traps stray focus and marks the rest of the relevant document surface inert until close.
12. Preventing `openchange` leaves state unchanged so controlled consumers can apply the requested state themselves.
13. Closing stops positioning, focus, and document-level listeners without leaving scheduled work behind.

## Documentation Design

The target page at `web/doc/docs/components/popover.md` follows the AriaUI page order:

1. Popover title and source-equivalent description
2. Features
3. Installation and element registration
4. Examples
   - Popover
   - Framer Motion
5. Anatomy
6. API Reference
7. Keyboard
8. Accessibility

The default example recreates the source Dimensions popover:

- Adjustments icon and `Dimensions` Trigger.
- Heading and description.
- Width, maximum width, height, and maximum height fields with the same values.
- Arrow and close control.
- The same content width, spacing, typography, borders, colors, shadows, and token-backed interaction states.

The Framer Motion example recreates the source Motion Popover:

- Bell icon and `Motion Popover` Trigger.
- `Release checks` heading and source description adapted to a native custom-element host.
- Design tokens, Keyboard paths, and Docs preview status rows.
- Arrow and close control.
- The source opacity, vertical offset, scale, duration, and easing behavior.

The markup retains source-equivalent Tailwind utility classes where the VitePress pipeline supports them. Focused theme CSS handles custom-element display, top-layer positioning, and runtime-only states through existing theme variables and semantic tokens. Layout and sizing are not expressed with direct inline styles when utilities or token-backed classes can express them; runtime-computed top/left coordinates are the necessary exception.

The live examples are installed from `web/doc/docs/.vitepress/theme/popover-examples.ts`. That module binds only previews inside `.ariaui-web-preview[data-component="popover"]`, avoids duplicate bindings across VitePress client navigation, and delegates component behavior to `@ariaui-web/popover` rather than reimplementing it.

### Framer Motion boundary

- `framer-motion` is a dependency of `web/doc` only, using the sibling AriaUI documentation version `^12.38.0`.
- `packages/popover/package.json` and all files under `packages/popover/src` contain no Framer Motion, Motion, React, or ReactDOM dependency or import.
- Only the Popover documentation installer imports the DOM `animate` API from the installed `framer-motion` package entry supported by version 12.38.0.
- The motion Content uses `force-mount` so exit animation can complete before the closed host becomes visually dormant.
- Entry animates opacity `0` to `1`, vertical offset `8` to `0`, and scale `0.96` to `1`.
- Exit reverses those values, uses `0.18` seconds with `easeOut`, and disables pointer interaction while closed.
- Reduced-motion users receive an opacity-only or immediate final state without spatial movement.

## TDD Strategy

Implementation follows strict red-green-refactor cycles. Package behavior is not added before a focused failing test demonstrates the missing contract.

### Package test sequence

1. Add source-test parity metadata and corrected role expectations; run the Popover tests and confirm failure against the generic generated spec.
2. Add initial, default, uncontrolled, direct-property, and canceled controlled open-state tests; confirm failure before state synchronization is implemented.
3. Add Trigger click, Enter, Space, disabled, Close, prevented Close, outside mouse, and Escape tests individually; confirm each expected failure before its minimal behavior.
4. Add Trigger/Content ARIA, Heading/Description labelling, native-composition, arrow, and force-mount tests; confirm each expected failure before implementation.
5. Add top-layer/fallback rendering, placement, offset, viewport flipping, clipped-parent, automatic update, and cleanup tests; confirm each expected failure before positioning implementation.
6. Add initial focus, late focus target, default loop, disabled loop, modal trap, focus restoration, and bounded scheduling tests; confirm each expected failure before focus implementation.
7. Refactor into the focused modules only after all related behavior is green.

The tests adapt every meaningful AriaUI user-visible case to custom elements and real DOM events. Mocks are limited to unavoidable geometry, top-layer methods, animation frames, and observer boundaries. State and interaction behavior exercise the actual registered elements.

### Documentation test sequence

1. Add failing assertions for source page headings, order, example content, native markup, source-equivalent classes, and package registration guidance.
2. Add failing live-preview tests for both examples, including opening, field focus, closing, outside dismissal, Escape, ARIA, and focus restoration.
3. Add failing Framer Motion boundary tests proving that the dependency and import exist only in `web/doc`, that the motion example uses `force-mount`, and that entry/exit calls use the source values.
4. Implement the page, theme installer, theme styles, and documentation-only dependency until the focused docs tests pass.

## Generator Workflow

After source-module or documentation additions, run `node scripts/generate-from-ariaui.mjs` as required by the repository instructions and review every generated change before hand editing resumes. The active workspace already contains unrelated pagination changes, including generated surfaces, so the generator review must not overwrite or absorb them.

The safe workflow is:

1. Commit only intentional Popover TDD increments.
2. Create a temporary clean worktree at the Popover commit.
3. Run the generator there against the same sibling AriaUI source.
4. Review the complete generator diff.
5. Bring back only intentional Popover or generator-template changes, applying them around the user's existing pagination edits.
6. Remove the temporary worktree after verification.

## Verification

Completion requires fresh evidence from:

- Focused Popover unit and component-spec tests.
- Focused documentation structure, markup, installer, and Framer Motion boundary tests.
- Popover package type checking and build.
- Documentation type checking and production build.
- The relevant broader test suite when focused checks are green.
- Interactive browser checks for click and keyboard open, first focus, field interaction, Close, outside mouse, Escape, loop behavior, modal behavior, arrow placement, and resize/scroll repositioning.
- Visual comparison of AriaUI and ariaui-web Popover pages at matching desktop and mobile viewports, including the open default and Framer Motion examples and both supported color schemes where practical.
- Inspection of Framer Motion entry and exit frames, plus reduced-motion behavior.

Rendered visual testing is required; source inspection alone is not sufficient. Screenshots must be inspected for section order, preview dimensions, typography, spacing, borders, colors, icons, input layout, arrow treatment, floating placement, clipping, focus indicators, and animation start/end states.

Run `graphify update .` after code changes if the repository graph is present and expected by the active checkout.

## Scope Boundaries

- Do not add Framer Motion, Motion, React, or ReactDOM to `@ariaui-web/popover`.
- Do not rename the package directory, package, custom-element tags, public parts, or documentation slug.
- Do not add a public Portal or Arrow part that the source Popover package does not expose.
- Do not refactor Dialog, Hover Card, Position, Portal, Focus Scope, Arrow, or unrelated packages.
- Do not overwrite, revert, stage, or commit unrelated pagination worktree changes.
- Keep `packages/popover/readme.md` and package-level unit tests as required project artifacts.

## Success Criteria

The work is complete when the Popover custom elements satisfy the native adaptation of the current AriaUI specification and meaningful source tests, both live examples match the AriaUI page's content, style, and function, the Framer Motion example uses the real library only in documentation, the page structure matches AriaUI, all relevant automated checks pass, and browser visual testing confirms the rendered result.
