# Progress Native Parity Design

## Goal

Refactor `@ariaui-web/progress` so its browser-native custom elements implement the current Progress specification and user-visible behaviors from the sibling AriaUI repository. Replace the placeholder documentation with a page whose content structure, live-example styling, and controlled behavior match the related AriaUI page. Implement the package and documentation changes through strict test-driven development and verify the rendered examples visually.

## Source of Truth

The implementation is derived from the current files under `/home/neo/Projects/ariaui`:

- `packages/progress/readme.md`
- `packages/progress/__test__/progress.test.tsx`
- `packages/progress/src/Root/index.tsx`
- `packages/progress/src/Root/context.tsx`
- `packages/progress/src/Indicator/index.tsx`
- `web/doc/src/app/docs/components/progress/page.md`
- `web/doc/src/markdoc/partials/progress/`
- `web/doc/src/components/progress/ProgressDemo.tsx`
- `web/doc/src/components/progress/ProgressExample.tsx`
- `web/doc/src/components/progress/ProgressApiTable.tsx`

React-only mechanisms are translated into native custom-element contracts. Package names remain under the `@ariaui-web` scope, the `progress` package directory and documentation slug remain unchanged, and Root and Indicator remain separated public parts.

## Chosen Approach

Progress parity is generator-backed. `scripts/generate-from-ariaui.mjs` gains Progress-specific source-test parity metadata and package/runtime generation support so future generation preserves the native behavior. The generated package outputs, package tests, and documentation remain aligned with that generator contract.

This approach is preferred over hand-editing generated outputs because target-only changes could be erased by a later generator run. It is preferred over adding Progress logic to `AriaWebElement` because Progress state, range calculation, and Root/Indicator coordination are package-specific and must not affect unrelated packages.

The current worktree contains unrelated pagination and documentation changes. Generator verification therefore runs in a temporary copy with the sibling AriaUI source made available at the path expected by the generator. Only reviewed Progress and generator changes are synchronized into the active workspace.

## Package Contract

### Public parts

- `Root` is `aria-progress`, owns progress range and value state, and defaults to `role="progressbar"`.
- `Indicator` is `aria-progress-indicator`, inherits state from its nearest Root, and has no default role, matching the source's neutral visual `div`.

The package keeps `readme.md`, package-level unit tests, `componentSpec`, element registration helpers, part constructors, and creation helpers. Internal coordination helpers are not public exports.

### Attributes and properties

Root supports the native equivalents of the AriaUI props:

- `min`, defaulting to `0`.
- `max`, defaulting to `100`.
- `value` for controlled-style current value updates.
- `default-value`, exposed through `defaultValue`, for one-time uncontrolled initialization when `value` is absent.
- `value-text`, exposed through `valueText`, for an assistive human-readable value.

The custom-element `value` API follows the repository's reflected-attribute convention. Numeric calculations parse the reflected value while the host remains compatible with browser string attributes. Setting the `value` attribute or property resynchronizes the progress tree immediately.

Progress has no user interaction that changes its own value. Programmatic `value` updates therefore do not dispatch a synthetic `valuechange` event. This matches the source behavior: controlled example buttons own the state and pass the next value into Progress.

### Uncontrolled and controlled-style state

- If `value` is present, its parsed value is the current value.
- Otherwise, Root samples `default-value` once, defaulting to `0`.
- Changing `default-value` after initialization does not reset the uncontrolled value.
- Adding or updating `value` switches the rendered state to that controlled value.
- Removing `value` retains the last synchronized current value rather than reapplying `default-value`.

This contract preserves the source behaviors without importing a framework state helper.

### ARIA and data reflection

Root synchronizes:

- `aria-valuenow` from the current value.
- `aria-valuemin` from `min`.
- `aria-valuemax` from `max`.
- `aria-valuetext` from `value-text` when present and removes it when absent.
- `data-value`, `data-min`, and `data-max` from the same state.

Indicator synchronizes `data-value`, `data-min`, and `data-max`. It computes the source formula exactly:

```text
((value - min) / (max - min)) * 100
```

The implementation does not introduce undocumented value clamping or alternative range normalization. Indicator writes the resulting percentage to `--progress-value` and sets `width: var(--progress-value)`, matching the source component's rendered behavior.

Authored classes, ids, data attributes, content, inline styles, ARIA naming, and DOM event listeners remain on the custom-element hosts. Package-owned progress properties are merged without replacing unrelated authored values.

### Composition errors

Indicator requires a nearest `aria-progress` ancestor, matching AriaUI's context requirement. An orphan Indicator does not invent default progress state or a percentage. The internal `syncProgressPart(indicator)` boundary throws `Error("Progress parts must be used within Progress.Root")`; when connection invokes that boundary, the browser reports the same custom-element reaction error. Package tests call the internal boundary directly for a deterministic assertion without exporting it from the package entry point.

## Runtime Architecture

Responsibilities remain in focused package-local modules:

- `progress-state.ts` parses reflected numeric values, owns one-time default state, and resolves the current Root snapshot.
- `progress-sync.ts` finds Root/Indicator relationships, applies ARIA and data reflection, calculates the indicator percentage, and reports orphan composition.
- `progress-element.ts` owns observed attributes, custom-element lifecycle, Root subtree observation, and synchronization cleanup while delegating state calculations to the focused modules.
- `parts/Root.ts` and `parts/Indicator.ts` keep the separated public constructors tied to their `componentSpec` entries.

Root observes its relevant attributes and descendant composition. Attribute or property updates schedule a synchronous tree update, while descendant insertion or removal is handled through a Root-owned `MutationObserver`. Disconnecting Root stops its observer and removes package-owned runtime state so detached trees do not retain active observers.

The generator must emit or preserve these package-local files and must not move Progress-specific behavior into `packages/utils`.

## Source Test Parity

`componentSpec.sourceTestParity` cites `../ariaui/packages/progress/__test__/progress.test.tsx`, records 24 source cases, and summarizes the native requirements:

1. Root and Indicator stay as the only public component parts and internal context helpers remain private.
2. Root exposes progressbar semantics and Indicator remains a descendant visual part with no injected role.
3. Both parts preserve authored attributes, classes, styles, content, and events.
4. Root reflects current, minimum, maximum, and optional human-readable ARIA values.
5. Defaults are `min=0`, `max=100`, and `value=0`.
6. `default-value` initializes uncontrolled state once.
7. `value` updates controlled-style state and all derived reflection.
8. Both parts expose source-equivalent data attributes.
9. Indicator calculates standard, custom-range, minimum-boundary, and maximum-boundary percentages.
10. Indicator inherits Root state and rejects orphan composition.
11. Public helpers return actual registered custom-element instances, which is the native equivalent of source ref forwarding.
12. Labelled progressbars expose a valid accessible progressbar contract.
13. Documentation contains the source Uncontrolled and Controlled examples with equivalent structure, styling, and behavior.

React-specific assertions about JSX host tag names, React ref objects, prop-to-DOM filtering terminology, and `jest-axe` integration are not copied literally. Their user-visible outcomes are covered through actual custom elements, DOM attributes, accessible-name assertions, and browser verification.

## Documentation Design

The target page at `web/doc/docs/components/progress.md` follows the AriaUI content order:

1. Progress title and source-equivalent description
2. Features
3. Installation and element registration
4. Examples
   - Uncontrolled
   - Controlled
5. Anatomy
6. API Reference
7. Accessibility

The Features list preserves the source concepts: accessible progress semantics, human-readable value text, CSS-variable-driven Indicator, stateful data attributes, and composability.

### Uncontrolled example

The Uncontrolled preview displays:

- The label `Storage space`.
- A visible value of `64%`.
- `aria-progress` with `default-value="64"` and `value-text="64% complete"`.
- A full-width muted track and foreground Indicator using the same source utility classes and token-backed target equivalents.

### Controlled example

The Controlled preview starts at `35%` and displays:

- The label `Upload progress`.
- A visible current percentage.
- `aria-progress` with controlled-style `value` and matching `value-text`.
- Decrease and Increase `aria-button` controls with the source example's outline-button styling.
- Ten-point updates clamped to the inclusive 0–100 range.

A focused `web/doc/docs/.vitepress/theme/progress-examples.ts` installer binds only `.ariaui-web-preview[data-component="progress"]` controlled examples. It avoids duplicate listeners across VitePress client navigation. Each button update changes Root's `value`, the visible percentage, and `value-text`; package synchronization updates Indicator data and width.

Each live preview is paired with an HTML code block containing the corresponding native markup. Layout and sizing use existing utility classes or focused token-backed theme classes rather than direct example style attributes. The package-owned Indicator custom property and width remain runtime state, not example layout styling.

The Anatomy, API Reference, and Accessibility sections document the two parts, reflected attributes/properties, default state, optional human-readable text, non-interactive behavior, and the requirement for an accessible name.

## TDD Strategy

Implementation follows strict red-green-refactor cycles. No Progress production behavior is added before a focused test demonstrates the missing contract and fails for the expected reason.

### Generator and contract sequence

1. Add failing assertions for Progress source-test parity metadata, the 24-case count, package-local runtime modules, and source page requirements.
2. Run the focused component-spec tests and confirm they fail against the generic generated contract.
3. Add the minimum generator metadata and generated spec/readme output required to pass.
4. Rerun the focused tests before refactoring generator code.

### Package behavior sequence

1. Add failing tests for Root/Indicator composition, public surface, and passthrough.
2. Add failing tests for default Root ARIA and data reflection, then implement minimal Root synchronization.
3. Add failing tests for `default-value` initialization and ignored later default updates, then implement one-time state.
4. Add failing tests for controlled-style `value` updates, then implement reflected updates.
5. Add failing tests for optional `value-text` addition and removal.
6. Add failing tests for Indicator inheritance and standard percentage calculation, then implement Root-to-Indicator synchronization.
7. Add failing custom-range and boundary percentage cases, then implement the source formula without clamping.
8. Add the failing orphan Indicator case, then implement the composition error boundary.
9. Refactor into the focused state and synchronization modules only after the related tests are green.

Each red run must fail as an assertion because behavior is absent, not because of a syntax, import, or environment error. Each green run must include the focused Progress suite and preserve the existing generic contract tests.

### Documentation sequence

1. Add failing assertions for the source description, heading order, feature list, example headings, native markup, source-equivalent classes, Anatomy, API, and Accessibility content.
2. Add failing assertions that preview markup and its paired HTML source remain aligned.
3. Add failing installer tests for Decrease, Increase, clamping, visible percentage, `value-text`, and duplicate binding guards.
4. Implement the page, installer, registration, and focused theme styles until the documentation tests pass.

## Visual and Functional Verification

Rendered verification is required after the package and documentation checks are green. Source inspection alone is insufficient.

Run the sibling AriaUI docs and ariaui-web VitePress docs simultaneously at separate local ports. Use matching desktop and mobile viewports to:

- Capture cropped screenshots of the source and target Uncontrolled examples.
- Capture cropped screenshots of the source and target Controlled examples.
- Compare label/value alignment, preview width, track height, rounding, colors, spacing, button sizing, borders, and typography.
- Activate Decrease and Increase in the target page and verify the visible percentage, Root ARIA/data state, Indicator data state, computed custom property, and rendered fill width.
- Exercise the 0 and 100 boundaries.
- Check for page overflow, missing content, custom-element registration errors, and console exceptions.

The two sites use different documentation shells, so whole-page pixel equality is not a requirement. Heading-order tests verify page structure, while cropped example screenshots and computed styles verify the shared example design. Desktop and mobile screenshots must be inspected rather than merely captured.

## Verification Commands and Evidence

Completion requires fresh evidence from:

- Focused Progress unit and component-spec tests.
- Focused documentation tests.
- Progress package type checking and build.
- Documentation type checking and production build.
- The relevant broader test suite after focused checks are green.
- A temporary-copy generator run followed by a reviewed diff limited to intended Progress outputs.
- Interactive and visual browser checks at desktop and mobile widths.

Exact commands are defined in the implementation plan after the repository's current package and docs scripts are rechecked.

## Scope Boundaries

- Do not add React, ReactDOM, or framework-specific state helpers to `@ariaui-web/progress`.
- Do not add progress-specific behavior to shared utilities.
- Do not rename the package directory, package, custom-element tags, parts, or documentation slug.
- Do not add interactive controls to the Progress component itself; controls belong to the documentation's controlled example.
- Do not introduce undocumented value clamping or indeterminate behavior.
- Do not modify or include unrelated pagination and documentation work in Progress commits.
- Keep `packages/progress/readme.md` and package-level unit tests as required project artifacts.

## Success Criteria

The work is complete when `@ariaui-web/progress` satisfies the behavior-level native adaptation of the current AriaUI Progress specification and 24 source tests; generator metadata and outputs preserve that contract; the documentation page matches the source page's structure; both live examples match the source content, style, and function; all relevant automated checks pass; and inspected desktop and mobile browser testing confirms the rendered result and controlled behavior.
