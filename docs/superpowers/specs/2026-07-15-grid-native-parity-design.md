# Grid Native Parity Design

## Goal

Refactor `@ariaui-web/grid` so its browser-native contract, observable behavior, package tests, documentation structure, live examples, and visual presentation match the sibling `ariaui` Grid package.

The behavioral and documentation sources of truth are:

- `../ariaui/packages/grid/readme.md`
- `../ariaui/packages/grid/src/**`
- `../ariaui/packages/grid/__test__/grid.test.tsx`
- `../ariaui/web/doc/src/app/docs/components/grid/page.md`
- `../ariaui/web/doc/src/markdoc/partials/grid/**`
- `../ariaui/web/doc/src/components/grid/**`

React providers, hooks, refs, rerenders, and callbacks are not copied. Their observable results are translated into custom-element attributes, properties, DOM relationships, native composition, custom events, and browser-native unit tests.

## Current State

The generated Grid spec already records the sibling package README and its 29 source tests, and the native runtime covers the primary roles, roving focus, click selection, keyboard navigation, and group-selection shortcuts. The package's four broad behavior tests do not preserve the source suite's individual scenarios, so drift is difficult to identify.

The most important runtime mismatch is controlled selection. The current native implementation writes `value` during every interaction, including roots authored with `value`. The sibling package instead emits a proposed value and keeps the rendered selection controlled until the consumer supplies a new value.

The docs page follows the sibling section order and renders source-equivalent team-member tables, but its selection summary is static. The controlled example also lacks the host-side event wiring required to assign proposed values back to the Grid.

The primary worktree contains unrelated Pagination edits and untracked planning files. Grid generation and integration must preserve all user-owned changes outside the approved Grid scope.

## Scope

### In scope

- Keep `@ariaui-web/grid`, `packages/grid`, and `/components/grid` unchanged as package and route identities.
- Keep browser-native custom elements and separated Grid part modules.
- Update Grid-specific generator templates, spec metadata, runtime modules, tests, README output, docs markup, docs runtime wiring, and scoped styles.
- Port all 29 sibling Grid tests into individually named browser-native adaptations in the same category and order.
- Implement exact controlled and uncontrolled selection semantics.
- Implement native equivalents for source composition, explicit coordinates, forwarded interaction handlers, and resolved-coordinate notifications.
- Make the uncontrolled and controlled docs examples match the sibling examples in content, styling, state, selection summary, and interaction.
- Preserve the sibling page hierarchy inside the existing VitePress shell.
- Run package, docs, build, browser-interaction, responsive-layout, and visual verification.

### Out of scope

- Copying React implementation details into the native package.
- Changing the package catalog, package scope, package directory, or docs slug.
- Refactoring another component package or extracting a generic selection engine into `packages/utils`.
- Changing the sibling `ariaui` Grid package or docs.
- Redesigning the shared VitePress shell.
- Fixing the existing package-local TypeScript `rootDir` configuration failure unless the Grid refactor independently introduces a new type error.

## Chosen Approach

Use a generator-first, package-local Grid parity refactor. `scripts/generate-from-ariaui.mjs` remains the source of truth for the generated Grid spec, runtime, tests, README, docs page, Grid example installer, theme wiring, and scoped styles.

Generation runs in an isolated worktree based on the implementation commits. The generated diff is reviewed there first. Only approved Grid-related output is merged into the primary worktree, with shared docs files merged narrowly so the unrelated Pagination edits remain intact.

The runtime stays split by responsibility:

- `grid-dom.ts` owns Grid boundaries, part-host resolution, coordinates, and value serialization.
- `grid-sync.ts` owns controlled/uncontrolled state and state-to-DOM reflection.
- `grid-actions.ts` owns click and keyboard proposals.
- `grid-element.ts` owns lifecycle, observed attributes, native-composition host binding, and synchronization entry points.
- `grid-web-component.ts`, `define.ts`, and `src/parts/*` retain public construction and registration boundaries.

## Public Native Contract

The existing six parts remain public:

| Part | Custom element | Default semantics |
| --- | --- | --- |
| `Root` | `aria-grid` | `role="grid"` |
| `Head` | `aria-grid-head` | structural host |
| `Header` | `aria-grid-header` | `role="columnheader"` |
| `Body` | `aria-grid-body` | structural host |
| `Row` | `aria-grid-row` | `role="row"` |
| `Cell` | `aria-grid-cell` | `role="gridcell"` |

### Root state

- `default-value` initializes uncontrolled selection once.
- `value` supplies controlled selection when authored by the consumer.
- Values use the repository's comma-separated native attribute convention.
- `valuechange` bubbles and is composed. `event.detail.value` and `event.detail.values` are the same deduplicated string array.
- Controlled interactions emit the proposed next array without changing `value`, `aria-selected`, or `data-selected`.
- An external `value` update applies controlled selection and resynchronizes the cells.
- Uncontrolled interactions update package-owned selection, reflect the current native value, synchronize the cells, and emit the resulting array.

Package-local state that must distinguish consumer-authored updates from internal reflection uses a `WeakMap` record. Internal reflection is marked explicitly so it does not accidentally switch an uncontrolled root into controlled mode.

### Cell coordinates and events

- DOM order resolves the default zero-based row and column.
- `row-index` and `col-index` are the browser-native equivalents of source `rowIndex` and `colIndex` props and override the corresponding resolved coordinate independently.
- Cells reflect coordinates through `data-row` and `data-col`.
- An authored `value` wins; otherwise selection falls back to the resolved `row:col` value.
- A `resolvedcoordinateschange` event reports `{ rowIndex, colIndex }` when a Cell's effective coordinates change.
- Consumer click, focus, and keydown listeners continue receiving the original DOM events after Grid behavior runs.

### Native composition

`native-composition` is the browser-native equivalent of source `asChild` for Row and Cell. The first child element becomes the effective semantic and interactive host while preserving the consumer's classes, styles, attributes, content, and listeners.

Grid DOM queries resolve composed hosts without counting both a wrapper and its child. Cell click, focus, and keyboard behavior is attached to the effective host, and nested Grid roots remain isolated from their ancestors.

## State and Interaction Flow

1. Root connection determines whether the initial mode is controlled or uncontrolled and seeds the effective values from `value` or `default-value`.
2. Tree synchronization finds only rows, headers, and cells owned by that Root, resolves composed hosts and coordinates, and reflects roles, IDs, `data-value`, selection, focus, and roving `tabindex`.
3. A click or selection key calculates a proposed array without writing state first.
4. In controlled mode, Grid dispatches `valuechange` and leaves rendered selection unchanged.
5. In uncontrolled mode, Grid stores and reflects the proposed values, resynchronizes, and dispatches `valuechange`.
6. An external controlled `value` update replaces the effective values and resynchronizes.
7. Arrow keys, Home, End, Ctrl+Home, and Ctrl+End move the active cell without changing selection.
8. Enter and Space toggle the focused cell; Ctrl+A, Escape, Shift+Space, Ctrl+Space, and Shift+Arrow retain the sibling package's array ordering and group-toggle rules.

Empty grids, header-only grids, single-cell grids, cells outside rows, ragged rows, and navigation at a boundary remain safe no-ops. Nested grids do not leak cells, rows, focus, or selection into parent Grid state.

## Test Design

The generated package suite retains generic spec, export, custom-element registration, and runtime metadata tests. The Grid behavior section changes from four aggregated tests to 29 individually named browser-native adaptations matching the sibling suite's category, order, and intent.

### Native adaptation rules

- React render queries become direct custom-element fixtures and DOM assertions.
- `asChild` becomes `native-composition` with effective child hosts.
- callback forwarding becomes DOM event listeners and custom event assertions.
- `rowIndex`, `colIndex`, and `onResolvedCoordinatesChange` become `row-index`, `col-index`, and `resolvedcoordinateschange`.
- controlled React rerender becomes an external `value` attribute or property update.
- hook-only unmanaged cells become consumer-authored `[role="gridcell"]` hosts.
- the accessibility case verifies the rendered native roles, focusability, selected state, and accessible-name fixture without importing React test utilities.

### Source-mirrored groups

1. Three rendering and composition cases.
2. One accessibility case.
3. Four keyboard and roving-focus cases.
4. Twenty-one selection, controlled-state, coordinate fallback, unmanaged-host, and loose-cell cases.

Every production behavior follows RED, verify RED, GREEN, verify GREEN, and REFACTOR. A test must fail for the expected missing or incorrect Grid behavior before its generator/runtime change is written.

The generated spec and README continue recording `sourceTestCases: 29`, the exact learning source, and the native adaptation contract. Docs tests assert the page, installer, interaction, and style output separately from package behavior tests.

## Documentation Design

The native page keeps `/components/grid` and follows the sibling order:

1. Grid title and description
2. Features
3. Installation and custom-element registration
4. Examples
5. Anatomy
6. API Reference
7. Keyboard
8. Accessibility

The existing VitePress navigation, header, sidebar, typography shell, and theme controls remain native to this documentation site.

### Live examples

The page contains two examples in sibling order:

1. Uncontrolled, initialized with `default-value="jane:role"`
2. Controlled, initialized with `value="bob:status"`

Both examples use the sibling team-member data, labels, cell values, semantic class tokens, table presentation, focused and selected states, and “Selected values” panel. Stable data markers identify the summary container and generated value chips without coupling behavior to visible text.

A generated `grid-examples.ts` installer:

- scans only `.ariaui-web-preview[data-component="grid"]`
- binds each preview once and remains safe across VitePress client navigation
- reads `valuechange` arrays defensively
- updates both selection summaries, rendering `None` for an empty array
- assigns the proposed value back to the controlled root before updating its summary
- lets the uncontrolled Grid runtime own its state
- observes route content additions and resynchronizes newly rendered previews

Malformed events or missing preview elements are ignored without throwing.

### Styling

Grid example styles remain scoped under `.ariaui-web-preview[data-component="grid"]` and translate the sibling semantic Tailwind classes to VitePress token-backed CSS. Production examples do not use direct inline layout or sizing styles when scoped classes can express the same behavior.

Desktop and mobile layouts preserve the source table width, selection panel wrapping, selected background, focused outline, row hover state, header treatment, radius, border, shadow, and readable overflow behavior.

## Generated and Shared Files

Expected Grid-owned changes include:

- `scripts/generate-from-ariaui.mjs`
- `packages/grid/src/component-spec.ts`
- `packages/grid/src/grid-dom.ts`
- `packages/grid/src/grid-sync.ts`
- `packages/grid/src/grid-actions.ts`
- `packages/grid/src/grid-element.ts`
- `packages/grid/__test__/grid.test.ts`
- `packages/grid/__test__/component.spec.test.ts`
- `packages/grid/readme.md`
- `web/doc/docs/components/grid.md`
- `web/doc/docs/.vitepress/theme/grid-examples.ts`

Shared generated files are merged narrowly:

- `web/doc/__test__/docs.test.ts`
- `web/doc/docs/.vitepress/theme/index.ts`
- `web/doc/docs/.vitepress/theme/style.css`

The generator may reveal additional Grid-owned output. Those changes are accepted only when the isolated diff proves they derive from the approved Grid contract. Unrelated generated churn is discarded.

## Verification

Verification runs in increasing scope:

1. Each focused failing Grid test during its TDD cycle.
2. Complete `@ariaui-web/grid` package tests.
3. Focused Grid documentation tests.
4. Grid package build.
5. VitePress documentation build.
6. Broader repository tests when focused checks are green.
7. Isolated generator rerun and diff review.
8. Rendered browser comparison between the sibling AriaUI Grid page and the native Grid page.

Browser and visual verification cover desktop and mobile viewports and record the following states:

- source and native page heading order
- uncontrolled initial `jane:role` selection and summary
- controlled initial `bob:status` selection and summary
- click selection
- Arrow-key focus without selection changes
- Enter and Space toggling
- controlled proposal before and after docs host assignment
- selected and focused visual states
- empty-selection `None` summary
- responsive wrapping and horizontal overflow
- console errors and accessible roles/names

The existing `@ariaui-web/grid` package-local lint command currently fails because its TypeScript `rootDir` excludes workspace-linked `packages/utils` sources. Completion does not claim that baseline failure is fixed. Grid-specific type safety is instead checked through successful package build and any broader repository typecheck that is valid in the current workspace.

## Completion Criteria

The work is complete when:

- the component spec, README, runtime, tests, and public exports agree
- all 29 sibling Grid cases have individually named passing native adaptations
- controlled and uncontrolled selection match the approved state contract
- native composition, explicit coordinates, coordinate notifications, keyboard navigation, focus, and selection pass package tests
- the docs page matches the sibling hierarchy
- both live examples match sibling content, styling, and function
- selection summaries update correctly and controlled docs wiring assigns proposals back to `value`
- Grid package tests/build and focused docs tests/build pass
- desktop and mobile visual verification passes without unexpected console errors or horizontal overflow
- isolated generation has been reviewed and only approved Grid-related changes are integrated
- unrelated Pagination and user-owned worktree changes remain intact
