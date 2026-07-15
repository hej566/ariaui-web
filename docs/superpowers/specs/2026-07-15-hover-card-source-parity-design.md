# Hover Card Source Parity Design

## Goal

Refactor `@ariaui-web/hover-card` so its browser-native custom elements implement the current Hover Card specification and source test behaviors from the sibling AriaUI repository. Replace the placeholder documentation with a page whose structure, live-example content, visual treatment, and interactions match the related AriaUI page. The documentation-only Framer Motion example must use the actual Framer Motion library without adding Framer Motion to the Hover Card package.

## Source of Truth

The implementation is derived from the current files under `/home/neo/Projects/ariaui`:

- `packages/hover-card/readme.md`
- `packages/hover-card/__test__/hover-card.test.tsx`
- `packages/hover-card/__test__/index.test.tsx`
- `packages/hover-card/src/Root/`
- `packages/hover-card/src/Trigger/`
- `packages/hover-card/src/Content/`
- `packages/hover-card/src/hooks/useHoverCard.ts`
- `web/doc/src/app/docs/components/hover-card/page.md`
- `web/doc/src/markdoc/partials/hover-card/`
- `web/doc/src/components/hover-card/`

React-only concepts are translated into native custom-element contracts. Package names remain under the `@ariaui-web` scope, the `hover-card` package directory and documentation slug remain unchanged, and public parts stay separated as Root, Trigger, and Content.

## Chosen Approach

The Hover Card runtime remains framework-independent. It implements the AriaUI behavior directly with browser APIs and focused package-local modules. The documentation adds `framer-motion` only to `web/doc` and imports its DOM API only from the Framer Motion live-example installer.

This approach is preferred over a React island because it preserves the project's browser-native architecture and avoids adding React and ReactDOM to VitePress. It is preferred over an iframe because the example remains integrated with the same custom elements, theme tokens, layout, and visual verification surface as the default example.

## Package Contract

### Public parts

- `Root` coordinates open state, references, positioning options, and lifecycle.
- `Trigger` is a keyboard-focusable button-like custom element that opens the card on pointer hover and focus.
- `Content` is a tooltip surface shown in the browser top layer when supported and positioned relative to Trigger.

`componentSpec` and `readme.md` must reflect `Content` as `role="tooltip"`, not `role="region"`. The generated source-test parity metadata must cite both AriaUI package test files and describe the native cases implemented from them.

### Attributes, properties, and events

Root supports:

- `open` and the corresponding boolean property for current state.
- `default-open` for the uncontrolled initial state.
- `placement`, defaulting to `bottom`, including top, right, bottom, left, and start/end variants.
- `offset`, defaulting to `8` CSS pixels.
- A bubbling, cancelable `openchange` event with `{ open, source }` detail before an interaction mutates uncontrolled state.

Canceling `openchange` lets a consumer own the `open` property, which is the native equivalent of AriaUI's controlled `open` and `onOpenChange` pair. Directly setting the `open` property or attribute synchronizes the tree without dispatching another request event.

Content supports:

- `arrow` to render an internal arrow marker.
- `arrow-class` to assign consumer classes to that marker.
- Its own custom-element host as the browser-native composition surface; it does not depend on React's `asChild` or a framework slot.

### State and ARIA reflection

- Root, Trigger, and Content reflect `data-state="open"` or `data-state="closed"`.
- Trigger reflects `aria-expanded` and is associated with Content through stable generated identifiers.
- Content has `role="tooltip"`, is hidden while closed, and reflects final placement through `data-side` and `data-align`.
- Trigger keeps the package's existing native button-like keyboard activation and disabled guards.
- Trigger or Content connected without a Root reports the source-equivalent structural error.

## Runtime Architecture

The refactor keeps responsibilities in package-local modules:

- `hover-card-dom.ts` resolves Root, Trigger, and Content associations, assigns stable identifiers, parses placement and offset, and locates the internal arrow.
- `hover-card-actions.ts` requests state changes for pointer, focus, blur, and Escape interactions. Pointer leave uses a zero-delay guarded close so movement from Trigger into Content preserves the safe area without adding a visible delay.
- `hover-card-position.ts` calculates viewport-relative fixed coordinates, flips or shifts at viewport collisions, sets placement data attributes, places the arrow, and installs scroll, resize, and `ResizeObserver` updates while open.
- `hover-card-sync.ts` applies `default-open` once, synchronizes state and ARIA, shows or hides Content, and starts or stops positioning.
- `hover-card-element.ts` owns custom-element lifecycle, observed attributes, mutation observation, and event listener cleanup while delegating behavior to the focused modules.

Content uses the HTML Popover API with manual top-layer behavior where available. A hidden/fixed-position fallback provides the same contract in environments such as jsdom and browsers without the required popover methods. Content remains structurally associated with Root and is not moved into a React or framework portal.

## Behavioral Contract

1. Content is closed initially unless Root has `default-open` or an explicit open state.
2. Pointer enter on Trigger requests open.
3. Pointer leave from Trigger requests close unless the pointer enters Content during the guarded transition.
4. Pointer enter on Content keeps the card open; pointer leave requests close.
5. Focus on Trigger requests open.
6. Blur requests close only when focus leaves the Hover Card relationship.
7. Escape requests close while the card is open.
8. Preventing `openchange` leaves Root state unchanged so controlled consumers can apply state themselves.
9. Opening starts viewport-aware positioning and automatic updates; closing removes those observers and listeners.
10. `arrow` creates one arrow marker and updates its side with the resolved placement.

## Documentation Design

The target page at `web/doc/docs/components/hover-card.md` follows the AriaUI page order:

1. Hover Card title and source-equivalent description
2. Features
3. Installation and element registration
4. Examples
   - Hover Card
   - Framer Motion
5. Anatomy
6. API Reference
7. Keyboard
8. Accessibility

Both previews use the source example's `@nextjs` trigger, avatar presentation, title, description, calendar icon, and "Joined December 2024" metadata. The markup retains source-equivalent utility class names where meaningful, while VitePress theme CSS translates them through existing theme variables and package tokens rather than inline layout styles.

The live examples are installed from a focused `hover-card-examples.ts` VitePress theme module. That module binds only examples inside `.ariaui-web-preview[data-component="hover-card"]` and cleans up or avoids duplicate bindings across client navigation.

### Framer Motion boundary

- `framer-motion` is a dependency of `web/doc` only.
- `packages/hover-card/package.json` and all files under `packages/hover-card/src` contain no Framer Motion dependency or import.
- Only the preview marked as the Framer Motion variant imports `animate` from `framer-motion/dom`.
- Entry animation matches the AriaUI example: opacity `0` to `1`, vertical offset `8` to `0`, and scale `0.96` to `1`.
- Exit reverses those values, uses the source duration of `0.18` seconds and `easeOut`, disables pointer interaction while exiting, and removes Root's open state after animation completion.
- Reduced-motion users receive the final state without spatial animation.

## TDD Strategy

Implementation follows strict red-green-refactor cycles. Package behavior is not added before a focused failing test demonstrates the missing contract.

### Package test sequence

1. Add source-test parity metadata and spec-role expectations; run the Hover Card tests and confirm failure against the generic generated spec.
2. Add initial, default, uncontrolled, and canceled controlled open-state tests; confirm failure before state synchronization is implemented.
3. Add hover, pointer safe-area, focus, blur, Escape, and orphan-part tests individually; confirm each expected failure before its minimal behavior.
4. Add role, identifiers, state reflection, hidden/top-layer, placement, offset, collision, automatic update, and arrow tests; confirm each expected failure before its implementation.
5. Refactor into the focused modules only after all related behavior is green.

The tests adapt AriaUI's user-visible cases to custom elements and real DOM events. Mocks are limited to unavoidable geometry and observer boundaries for positioning; state and interaction behavior exercise the actual custom elements.

### Documentation test sequence

1. Add failing assertions for source page headings, order, example content, native markup, and source-equivalent classes.
2. Add failing installer tests for default interaction and the Framer Motion variant, including the `framer-motion/dom` boundary.
3. Implement the page, theme installer, theme styles, and documentation-only dependency until the focused docs tests pass.

The generator must be updated so Hover Card spec, test-parity metadata, runtime module generation, and documentation assertions survive future regeneration. Because the active worktree may contain unrelated generated edits, generator output is reviewed in an isolated clean worktree against the same sibling AriaUI source before only the intentional Hover Card and generator changes are brought into the active workspace.

## Verification

Completion requires fresh evidence from:

- Focused Hover Card unit and component-spec tests.
- Focused documentation tests.
- Hover Card package type checking and build.
- Documentation type checking and production build.
- The relevant broader test suite when focused checks are green.
- Interactive browser checks for pointer hover, Trigger-to-Content movement, focus/blur, Escape, default example behavior, Framer Motion entry and exit, placement, and scroll/resize repositioning.
- Visual comparison of AriaUI and ariaui-web Hover Card pages at matching desktop and mobile viewports, including open default and Framer Motion examples and both supported color schemes where practical.

Rendered visual testing is required; source inspection alone is not sufficient. Screenshots must be inspected for section order, preview dimensions, typography, spacing, borders, colors, avatar and icon treatment, floating placement, clipping, and animation start/end states.

## Scope Boundaries

- Do not add Framer Motion, React, or ReactDOM to `@ariaui-web/hover-card`.
- Do not rename the package directory, package, custom-element tags, or documentation slug.
- Do not refactor Tooltip, Popover, Position, or unrelated packages.
- Do not overwrite or fold unrelated worktree changes into Hover Card commits.
- Keep `packages/hover-card/readme.md` and package-level tests as required project artifacts.

## Success Criteria

The work is complete when the Hover Card custom elements satisfy the native adaptation of the current AriaUI specification and tests, both live examples match the AriaUI page's content, style, and function, the Framer Motion example uses the real library only in documentation, the page structure matches AriaUI, all relevant automated checks pass, and browser visual testing confirms the rendered result.
