# Grid Native Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `@ariaui-web/grid` so its browser-native behavior, 29-case package test suite, documentation hierarchy, live examples, and rendered presentation match the sibling `ariaui` Grid package.

**Architecture:** Keep Grid behavior package-local and split across DOM discovery, state synchronization, actions, lifecycle, and separated part modules. Make `scripts/generate-from-ariaui.mjs` the durable source of every Grid-owned package/docs artifact while keeping materialized files runnable during each TDD cycle; prove template parity with an isolated final regeneration. Add a small VitePress-only installer that owns controlled-example feedback and selection-summary rendering without duplicating Grid behavior.

**Tech Stack:** TypeScript 7 RC, browser custom elements, Vitest + jsdom, esbuild, VitePress, pnpm workspaces, Playwright/browser visual testing.

---

## File Map

### Generator source of truth

- Modify: `scripts/generate-from-ariaui.mjs`
  - `sourceTestParityFor("grid")` metadata
  - `gridElementSource`, `gridDomSource`, `gridSyncSource`, and `gridActionsSource`
  - `componentTestSource` Grid test block
  - `specTestSource` Grid contract assertions
  - `gridSelectionPanelMarkup`, `gridTableMarkup`, and `gridExamplesSection`
  - new `docsGridExamplesScript`
  - `docsTheme`, `docsTests`, `docsStyle`, and `writeDocs`

### Materialized package files

- Modify: `packages/grid/src/component-spec.ts`
- Modify: `packages/grid/src/grid-dom.ts`
- Modify: `packages/grid/src/grid-sync.ts`
- Modify: `packages/grid/src/grid-actions.ts`
- Modify: `packages/grid/src/grid-element.ts`
- Modify: `packages/grid/__test__/component.spec.test.ts`
- Modify: `packages/grid/__test__/grid.test.ts`
- Modify: `packages/grid/readme.md`

### Materialized documentation files

- Modify: `web/doc/docs/components/grid.md`
- Create: `web/doc/docs/.vitepress/theme/grid-examples.ts`
- Modify carefully around existing Pagination work: `web/doc/docs/.vitepress/theme/index.ts`
- Modify carefully around existing Pagination work: `web/doc/docs/.vitepress/theme/style.css`
- Modify carefully around existing Pagination work: `web/doc/__test__/docs.test.ts`

### Planning and verification evidence

- Reference: `docs/superpowers/specs/2026-07-15-grid-native-parity-design.md`
- Reference: `../ariaui/packages/grid/__test__/grid.test.tsx`
- Reference: `../ariaui/packages/grid/src/**`
- Reference: `../ariaui/web/doc/src/components/grid/**`
- Reference: `../ariaui/web/doc/src/markdoc/partials/grid/**`

## Worktree Safety Rules

- Never run `node scripts/generate-from-ariaui.mjs` in the dirty primary worktree.
- Edit each generator template before or together with its materialized Grid file.
- Stage only Grid-owned files. For shared docs files, inspect hunks and preserve all Pagination changes.
- Final regeneration runs in `/home/neo/Projects/ariaui-web-grid-generate`, a detached worktree whose sibling source path still resolves to `/home/neo/Projects/ariaui`.
- `.superpowers/`, existing untracked plans, and Pagination files stay unstaged.

### Task 1: Lock the Generated Grid Contract

**Files:**

- Modify: `scripts/generate-from-ariaui.mjs` (`sourceTestParityFor`, `specTestSource`)
- Modify: `packages/grid/__test__/component.spec.test.ts`
- Modify: `packages/grid/src/component-spec.ts`
- Modify: `packages/grid/readme.md`

- [ ] **Step 1: Add failing contract assertions**

Add these assertions to the Grid branch of `specTestSource`, then materialize the same assertions in `packages/grid/__test__/component.spec.test.ts`:

```ts
expect(componentSpec.sourceTestParity.sourceTestCases).toBe(29);
expect(componentSpec.sourceTestParity.learningSources).toEqual([
  "../ariaui/packages/grid/__test__/grid.test.tsx",
]);
expect(componentSpec.requirementAttributes).toEqual(expect.arrayContaining([
  "native-composition",
  "row-index",
  "col-index",
  "default-value",
  "value",
]));
expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
  "value-controlled roots emit proposed value arrays without changing rendered selection until the host updates value",
  "row-index and col-index override DOM-resolved Cell coordinates and resolvedcoordinateschange reports effective coordinates",
  "Row and Cell adapt source asChild composition through native-composition child hosts",
]));
```

- [ ] **Step 2: Run the focused contract test and verify RED**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/component.spec.test.ts
```

Expected: FAIL because the new requirement attributes and native requirements are absent.

- [ ] **Step 3: Update Grid source-parity metadata in the generator**

Keep `sourceTestCases: 29` and replace the Grid `nativeRequirements` array with this complete contract:

```js
nativeRequirements: [
  "Root exposes `role=\"grid\"`, coordinates descendant cells, and manages roving tabindex state",
  "Head and Body remain structural hosts while Row exposes `role=\"row\"`, Header exposes `role=\"columnheader\"`, and Cell exposes `role=\"gridcell\"`",
  "Row and Cell adapt source asChild composition through native-composition child hosts",
  "row-index and col-index override DOM-resolved Cell coordinates and resolvedcoordinateschange reports effective coordinates",
  "Cell values fall back to resolved `row:col` coordinates and reflect through `data-row`, `data-col`, and `data-value`",
  "default-value initializes uncontrolled selected cells and the initial roving tab stop",
  "value-controlled roots emit proposed value arrays without changing rendered selection until the host updates value",
  "click selects one uncontrolled Cell by value and dispatches a bubbling composed valuechange event with the proposed value array",
  "Arrow keys, Home, End, Ctrl+Home, and Ctrl+End move focus without changing selection",
  "Enter and Space toggle the focused cell while preserving other selected cells",
  "Ctrl+A selects every cell, Escape clears selection, Shift+Space toggles the row, Ctrl+Space toggles the column, and Shift+Arrow toggles the target cell",
  "docs examples include uncontrolled and controlled team-member grids with synchronized selected-values panels and source-equivalent styling",
],
```

Extend `buildRequirementAttributes` so the generated component spec includes Grid's native-only attribute adaptations:

```js
if (packageName === "grid") {
  for (const attribute of ["native-composition", "row-index", "col-index", "default-value", "value"]) {
    attributes.add(attribute);
  }
}
```

Extend the existing `additionalRequirementAttributes` branch in `componentTestSource` so the runtime test derives the same `attributes` set:

```js
const additionalRequirementAttributes = spec.slug === "accordion"
  ? '\n  for (const attribute of ["collapsible", "data-disabled", "data-state", "default-value", "force-mount", "type"]) {\n    attributes.add(attribute);\n  }\n'
  : spec.slug === "grid"
    ? '\n  for (const attribute of ["native-composition", "row-index", "col-index", "default-value", "value"]) {\n    attributes.add(attribute);\n  }\n'
    : "";
```

Apply the generated object changes to `packages/grid/src/component-spec.ts` and the generated parity prose to `packages/grid/readme.md`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/component.spec.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit the contract lock**

```bash
git add scripts/generate-from-ariaui.mjs \
  packages/grid/__test__/component.spec.test.ts \
  packages/grid/src/component-spec.ts \
  packages/grid/readme.md
git commit -m "test(grid): lock native parity contract"
```

### Task 2: Adapt Rendering, Native Composition, and Coordinates

**Files:**

- Modify: `scripts/generate-from-ariaui.mjs` (`componentTestSource`, `gridDomSource`, `gridElementSource`, `gridSyncSource`)
- Modify: `packages/grid/__test__/grid.test.ts`
- Modify: `packages/grid/src/grid-dom.ts`
- Modify: `packages/grid/src/grid-element.ts`
- Modify: `packages/grid/src/grid-sync.ts`

- [ ] **Step 1: Split the source rendering cases into three native tests**

Replace the aggregated role test with these individually named cases, preserving the sibling order:

```ts
it("renders with correct aria roles", () => {
  const { root, head, body, headRow, headerCells, rowElements, cells } = createGridFixture();

  expect(root.getAttribute("role")).toBe("grid");
  expect(head.hasAttribute("role")).toBe(false);
  expect(body.hasAttribute("role")).toBe(false);
  expect([headRow, ...rowElements].map((row) => row.getAttribute("role"))).toEqual([
    "row", "row", "row", "row",
  ]);
  expect(headerCells.map((header) => header.getAttribute("role"))).toEqual([
    "columnheader", "columnheader", "columnheader",
  ]);
  expect(cells.map((cell) => cell.getAttribute("role"))).toEqual(Array(9).fill("gridcell"));
});

it("slots row and cell props onto child elements with native-composition", () => {
  defineGridElements();
  const root = document.createElement("aria-grid") as RuntimeElement;
  const body = document.createElement("aria-grid-body") as RuntimeElement;
  const row = document.createElement("aria-grid-row") as RuntimeElement;
  const rowHost = document.createElement("div");
  const cell = document.createElement("aria-grid-cell") as RuntimeElement;
  const cellHost = document.createElement("button");
  const otherCell = document.createElement("aria-grid-cell") as RuntimeElement;
  let clickCount = 0;

  row.setAttribute("native-composition", "");
  row.className = "row-class";
  rowHost.className = "motion-row";
  cell.setAttribute("native-composition", "");
  cell.className = "cell-class";
  cellHost.className = "motion-cell";
  cellHost.textContent = "1-1";
  otherCell.textContent = "1-2";
  cellHost.addEventListener("click", () => { clickCount += 1; });
  cell.append(cellHost);
  rowHost.append(cell, otherCell);
  row.append(rowHost);
  body.append(row);
  root.append(body);
  document.body.append(root);

  expect(rowHost.getAttribute("role")).toBe("row");
  expect(rowHost.classList.contains("row-class")).toBe(true);
  expect(rowHost.classList.contains("motion-row")).toBe(true);
  expect(cellHost.getAttribute("role")).toBe("gridcell");
  expect(cellHost.getAttribute("data-row")).toBe("0");
  expect(cellHost.getAttribute("data-col")).toBe("0");
  expect(cellHost.classList.contains("cell-class")).toBe(true);
  expect(cellHost.classList.contains("motion-cell")).toBe(true);

  cellHost.click();
  dispatchGridKey(cellHost, "ArrowRight");
  expect(clickCount).toBe(1);
  expect(document.activeElement).toBe(otherCell);
});

it("uses explicit cell coordinates and forwards interaction handlers", () => {
  defineGridElements();
  const root = document.createElement("aria-grid") as RuntimeElement;
  const body = document.createElement("aria-grid-body") as RuntimeElement;
  const row = document.createElement("aria-grid-row") as RuntimeElement;
  const cell = document.createElement("aria-grid-cell") as RuntimeElement;
  const events: string[] = [];
  let coordinates: unknown;

  cell.id = "custom-cell";
  cell.setAttribute("row-index", "3");
  cell.setAttribute("col-index", "4");
  cell.textContent = "Explicit";
  cell.addEventListener("resolvedcoordinateschange", (event) => {
    coordinates = (event as CustomEvent).detail;
  });
  for (const type of ["focus", "click", "keydown"]) {
    cell.addEventListener(type, () => events.push(type));
  }
  row.append(cell);
  body.append(row);
  root.append(body);
  document.body.append(root);

  cell.click();
  dispatchGridKey(cell, "ArrowRight");

  expect(cell.id).toBe("custom-cell");
  expect(cell.getAttribute("data-row")).toBe("3");
  expect(cell.getAttribute("data-col")).toBe("4");
  expect(coordinates).toEqual({ rowIndex: 3, colIndex: 4 });
  expect(events).toEqual(expect.arrayContaining(["focus", "click", "keydown"]));
});
```

Materialize the same test source in `componentTestSource`.

- [ ] **Step 2: Run the rendering tests and verify RED**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/grid.test.ts -t "native-composition|explicit cell coordinates"
```

Expected: FAIL because Grid does not resolve native-composition hosts, observe explicit indexes, or emit resolved coordinates.

- [ ] **Step 3: Implement effective hosts and explicit coordinates**

Add these exports to both `gridDomSource` and `packages/grid/src/grid-dom.ts`:

```ts
const composedClasses = new WeakMap<Element, Set<string>>();

export function gridPartHost(element: HTMLElement) {
  if (!element.hasAttribute("native-composition")) {
    return element;
  }
  return Array.from(element.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? element;
}

export function syncGridComposedHost(element: HTMLElement) {
  const host = gridPartHost(element);
  if (host === element) {
    return host;
  }

  const previous = composedClasses.get(element) ?? new Set<string>();
  for (const className of previous) {
    host.classList.remove(className);
  }
  const next = new Set(Array.from(element.classList));
  host.classList.add(...next);
  composedClasses.set(element, next);

  for (const attribute of Array.from(element.attributes)) {
    if (["class", "native-composition", "data-ariaui-web", "data-package", "data-part", "part"].includes(attribute.name)) {
      continue;
    }
    host.setAttribute(attribute.name, attribute.value);
  }
  if (element.getAttribute("style")) {
    host.setAttribute("style", element.getAttribute("style") ?? "");
  }

  for (const name of [
    "role",
    "tabindex",
    "aria-selected",
    "data-selected",
    "data-focused",
    "data-row",
    "data-col",
    "data-value",
  ]) {
    element.removeAttribute(name);
  }
  return host;
}

function explicitCoordinate(cell: HTMLElement, name: "row-index" | "col-index") {
  const value = Number(cell.getAttribute(name));
  return Number.isInteger(value) && value >= 0 ? value : null;
}
```

Update `gridCellCoordinates` so each axis uses its explicit override independently:

```ts
const rowOverride = explicitCoordinate(cell, "row-index");
const colOverride = explicitCoordinate(cell, "col-index");
// Resolve DOM row/column as today, then return:
return {
  row: rowOverride ?? resolvedRow,
  col: colOverride ?? resolvedCol,
};
```

Make row/header/cell query helpers return effective composed hosts and exclude duplicate wrapper/child matches by identity. Keep ownership based on the nearest `aria-grid` wrapper.

Apply Grid-owned role, tabindex, coordinate, focus, and selection attributes only to the effective host. A `native-composition` wrapper retains its package metadata and authored API attributes but must not remain a second semantic Row or Cell.

- [ ] **Step 4: Observe composition and coordinate attributes**

Add to `GridElement` in both the generator and materialized file:

```ts
static override get observedAttributes() {
  return Array.from(new Set([
    ...super.observedAttributes,
    "native-composition",
    "row-index",
    "col-index",
  ]));
}
```

Use `focusin` for composed Cell focus and delegated bubbling click/keydown events. Rebind only when the effective host changes.

Track the last coordinates in `grid-sync.ts`:

```ts
const gridCellCoordinatesState = new WeakMap<HTMLElement, string>();

function reportGridCellCoordinates(cell: HTMLElement, row: number, col: number) {
  const key = row + ":" + col;
  if (gridCellCoordinatesState.get(cell) === key) return;
  gridCellCoordinatesState.set(cell, key);
  cell.dispatchEvent(new CustomEvent("resolvedcoordinateschange", {
    bubbles: true,
    composed: true,
    detail: { rowIndex: row, colIndex: col },
  }));
}
```

Call it after reflecting `data-row` and `data-col`.

- [ ] **Step 5: Run the rendering tests and full Grid suite**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/grid.test.ts -t "renders with correct|native-composition|explicit cell coordinates"
pnpm --filter @ariaui-web/grid test
```

Expected: focused 3 tests pass; all Grid tests pass.

- [ ] **Step 6: Commit the rendering adaptation**

```bash
git add scripts/generate-from-ariaui.mjs \
  packages/grid/__test__/grid.test.ts \
  packages/grid/src/grid-dom.ts \
  packages/grid/src/grid-element.ts \
  packages/grid/src/grid-sync.ts
git commit -m "feat(grid): adapt native composition and coordinates"
```

### Task 3: Implement Exact Controlled and Uncontrolled Selection

**Files:**

- Modify: `scripts/generate-from-ariaui.mjs` (`componentTestSource`, `gridSyncSource`, `gridActionsSource`, `gridElementSource`)
- Modify: `packages/grid/__test__/grid.test.ts`
- Modify: `packages/grid/src/grid-sync.ts`
- Modify: `packages/grid/src/grid-actions.ts`
- Modify: `packages/grid/src/grid-element.ts`

- [ ] **Step 1: Add the source controlled-state test**

Add this individually named native adaptation in source-suite order:

```ts
it("keeps selection controlled by value until the value attribute changes", () => {
  const { root, cells } = createGridFixture({ value: "member:name", compact: true });
  const changes: string[][] = [];
  root.addEventListener("valuechange", (event) => {
    changes.push((event as CustomEvent<{ value: string[] }>).detail.value);
  });

  cells[1].click();

  expect(changes.at(-1)).toEqual(["member:role"]);
  expect(root.value).toBe("member:name");
  expect(cells[0].getAttribute("data-selected")).toBe("true");
  expect(cells[1].hasAttribute("data-selected")).toBe(false);

  root.value = "member:role";

  expect(cells[0].hasAttribute("data-selected")).toBe(false);
  expect(cells[1].getAttribute("data-selected")).toBe("true");
});
```

Extend `createGridFixture` with a two-cell `compact` fixture matching the source names/values.

- [ ] **Step 2: Verify RED**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/grid.test.ts -t "keeps selection controlled"
```

Expected: FAIL because clicking mutates `root.value` and rendered selection immediately.

- [ ] **Step 3: Replace implicit value ownership with explicit state**

Use this state shape in generator and materialized `grid-sync.ts`:

```ts
type GridSyncState = {
  activeCellId: string | null;
  controlled: boolean;
  initialized: boolean;
  internalValues: string[];
  reflectingValue: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};
```

Initialize and update ownership with these functions:

```ts
function initializeGridValues(root: Element, state: GridSyncState) {
  if (state.initialized) return;
  state.controlled = root.hasAttribute("value");
  state.internalValues = gridValuesFromAttribute(
    state.controlled ? root.getAttribute("value") : root.getAttribute("default-value"),
  );
  state.initialized = true;
  if (!state.controlled) {
    reflectUncontrolledGridValue(root, state);
  }
}

export function noteGridRootValueAttribute(root: Element, value: string | null) {
  const state = gridState(root);
  if (state.reflectingValue) return;
  state.controlled = value !== null;
  state.initialized = true;
  if (!state.controlled) {
    state.internalValues = gridValuesFromAttribute(root.getAttribute("default-value"));
  }
}

export function currentGridValues(root: Element) {
  const state = gridState(root);
  initializeGridValues(root, state);
  return state.controlled
    ? gridValuesFromAttribute(root.getAttribute("value"))
    : [...state.internalValues];
}

function reflectUncontrolledGridValue(root: Element, state: GridSyncState) {
  state.reflectingValue = true;
  try {
    writeGridRootValue(root, state.internalValues);
  } finally {
    state.reflectingValue = false;
  }
}
```

In `GridElement.attributeChangedCallback`, call `noteGridRootValueAttribute(this, newValue)` before `super.attributeChangedCallback` when the part is Root and `name === "value"`.

- [ ] **Step 4: Make actions propose before committing**

Replace `setGridValues` with this package-local request path:

```ts
export function requestGridValues(root: Element, values: readonly string[]) {
  const nextValues = uniqueGridValues(values);
  const state = gridState(root);
  initializeGridValues(root, state);

  if (!state.controlled) {
    state.internalValues = nextValues;
    reflectUncontrolledGridValue(root, state);
    syncGridTreeFromRoot(root);
  }

  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    composed: true,
    detail: { value: [...nextValues], values: [...nextValues] },
  }));
}
```

Export a read helper for actions and replace every action write with `requestGridValues`. Toggle, row, column, select-all, Escape, Enter, Space, Shift+Arrow, and click must calculate from `currentGridValues(root)`.

- [ ] **Step 5: Verify controlled RED becomes GREEN without regressing uncontrolled state**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/grid.test.ts -t "controlled|defaultValue|clicked cell|Enter|Space"
pnpm --filter @ariaui-web/grid test
```

Expected: controlled and uncontrolled tests pass; the event is bubbling and composed.

- [ ] **Step 6: Commit state ownership**

```bash
git add scripts/generate-from-ariaui.mjs \
  packages/grid/__test__/grid.test.ts \
  packages/grid/src/grid-sync.ts \
  packages/grid/src/grid-actions.ts \
  packages/grid/src/grid-element.ts
git commit -m "fix(grid): match controlled selection semantics"
```

### Task 4: Mirror All 29 Source Tests Individually

**Files:**

- Modify: `scripts/generate-from-ariaui.mjs` (`componentTestSource`)
- Modify: `packages/grid/__test__/grid.test.ts`

- [ ] **Step 1: Replace the remaining aggregated Grid cases with the exact source inventory**

Keep the following test names and order. Each test uses custom-element fixtures and the adaptations defined in Tasks 2-3:

```text
rendering
  renders with correct aria roles
  slots row and cell props onto child elements with native-composition
  uses explicit cell coordinates and forwards interaction handlers
accessibility
  passes native accessibility contract checks
keyboard navigation
  moves focus with arrow keys
  uses roving tabindex on focused cell
  uses the default selected cell as the initial roving tab stop
  adds focused state only to the current roving cell
selection
  uses defaultValue for uncontrolled selected cells
  selects a clicked cell by value and emits valuechange
  keeps selected cells selected when focus moves
  toggles the focused cell with Enter
  toggles the focused cell with Space
  keeps selection controlled by value until the value attribute changes
  emits value arrays for multi-cell keyboard selection
  falls back to coordinate values when Cell value is omitted
  Ctrl+A selects all cells
  Shift+Space selects the row
  Shift+Space adds the row to the current selection
  Shift+Space deselects an already selected row
  Ctrl+Space selects the column
  Ctrl+Space adds the column to the current selection
  Ctrl+Space deselects an already selected column
  Shift+Arrow selects an unselected target cell
  Shift+Arrow deselects an already selected target cell
  Escape deselects all cells
  uses coordinate fallback values for unmanaged gridcells
  uses native coordinate defaults when value is omitted
  ignores keyboard navigation for cells outside a row
```

Use these exact native assertions per source category:

- roles and accessibility: Root/Row/Header/Cell roles, Root accessible name, Header no `tabindex`, one `tabindex="0"`
- focus: `document.activeElement`, `data-focused`, and selection unchanged during pure navigation
- selection: `valuechange.detail.value`, `aria-selected`, `data-selected`, and array ordering
- uncontrolled: root reflected value and updated cells
- controlled: unchanged cells until external value assignment
- unmanaged cells: authored `[role="gridcell"][data-row][data-col]` contributes its coordinate fallback
- loose cell: dispatching ArrowRight outside a Row does not throw or prevent the event

- [ ] **Step 2: Run the 29-case parity section**

Run:

```bash
pnpm exec vitest run packages/grid/__test__/grid.test.ts
```

Expected: the 29 source-mirrored cases and generic package cases pass. The output must show 39 tests in `grid.test.ts` if the 10 generic cases remain unchanged.

- [ ] **Step 3: Confirm test names exist one-to-one**

Run:

```bash
grep -Ec '^[[:space:]]*it\(' ../ariaui/packages/grid/__test__/grid.test.tsx
rg -c '^[[:space:]]*it\(' packages/grid/__test__/grid.test.ts
```

Expected: source prints `29`; native count includes `29` source cases plus the unchanged generic cases. Confirm the generated Grid parity block contains exactly the 29 listed names.

- [ ] **Step 4: Commit the test mirror**

```bash
git add scripts/generate-from-ariaui.mjs packages/grid/__test__/grid.test.ts
git commit -m "test(grid): mirror source behavior cases"
```

### Task 5: Drive Live Example State from a VitePress Installer

**Files:**

- Modify: `scripts/generate-from-ariaui.mjs` (`docsTests`, new `docsGridExamplesScript`, `writeDocs`, `docsTheme`, Grid markup functions)
- Modify: `web/doc/__test__/docs.test.ts`
- Create: `web/doc/docs/.vitepress/theme/grid-examples.ts`
- Modify: `web/doc/docs/.vitepress/theme/index.ts`
- Modify: `web/doc/docs/components/grid.md`

- [ ] **Step 1: Add failing docs installer tests**

Import the installer in the generator's `docsTests` output and the materialized docs test:

```ts
import { installGridExamples, syncGridExamples } from "../docs/.vitepress/theme/grid-examples";
```

Add these focused tests:

```ts
it("updates the uncontrolled Grid selected-values summary", () => {
  defineGridElements();
  const previews = gridExamplePreviews(readDoc("components/grid.md"));
  document.body.innerHTML = previews.find((preview) => preview.variant === "uncontrolled")?.markup ?? "";
  installGridExamples(document);

  const root = document.querySelector("aria-grid") as RuntimeGridElement;
  const summary = document.querySelector("[data-grid-selection-summary]") as HTMLElement;
  const cell = Array.from(root.querySelectorAll("aria-grid-cell"))[5] as RuntimeGridElement;

  cell.click();

  expect(root.value).toBe("jane:status");
  expect(summary.textContent).toContain("jane:status");
  expect(summary.textContent).not.toContain("jane:role");
});

it("feeds controlled Grid proposals back through value", () => {
  defineGridElements();
  const previews = gridExamplePreviews(readDoc("components/grid.md"));
  document.body.innerHTML = previews.find((preview) => preview.variant === "controlled")?.markup ?? "";
  installGridExamples(document);

  const root = document.querySelector("aria-grid") as RuntimeGridElement;
  const summary = document.querySelector("[data-grid-selection-summary]") as HTMLElement;
  const cell = Array.from(root.querySelectorAll("aria-grid-cell"))[4] as RuntimeGridElement;

  cell.click();

  expect(root.value).toBe("jane:role");
  expect(cell.getAttribute("data-selected")).toBe("true");
  expect(summary.textContent).toContain("jane:role");
  expect(summary.textContent).not.toContain("bob:status");
});

it("renders None when Grid selection is cleared", () => {
  defineGridElements();
  document.body.innerHTML = gridExamplePreviews(readDoc("components/grid.md"))[0]?.markup ?? "";
  installGridExamples(document);
  const root = document.querySelector("aria-grid") as RuntimeGridElement;
  const active = root.querySelector('[tabindex="0"]') as HTMLElement;

  active.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));

  expect(document.querySelector("[data-grid-selection-summary]")?.textContent).toContain("None");
});
```

- [ ] **Step 2: Verify docs RED**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Grid selected-values|controlled Grid|Grid selection is cleared"
```

Expected: FAIL because the module and stable summary markers do not exist.

- [ ] **Step 3: Add stable generated markup markers**

Generate this summary shape:

```html
<div class="..." data-grid-selection-summary>
  <span class="font-medium text-foreground">Selected values</span>
  <span class="..." data-grid-selection-value>jane:role</span>
</div>
```

Add `data-grid-controlled` only to the controlled `<aria-grid>`.

- [ ] **Step 4: Generate and materialize the installer**

Add `docsGridExamplesScript()` returning this complete module, and write it from `writeDocs`:

```ts
const GRID_BOUND = "ariauiWebGridBound";
const observedGridRoots = new WeakSet<ParentNode>();

type GridValueChangeEvent = CustomEvent<{ value?: unknown; values?: unknown }>;

function gridEventValues(event: Event) {
  const detail = (event as GridValueChangeEvent).detail;
  const candidate = Array.isArray(detail?.value) ? detail.value : detail?.values;
  return Array.isArray(candidate)
    ? Array.from(new Set(candidate.filter((value): value is string => typeof value === "string" && value.length > 0)))
    : null;
}

function renderGridSummary(preview: Element, values: readonly string[]) {
  const summary = preview.querySelector<HTMLElement>("[data-grid-selection-summary]");
  if (!summary) return;
  summary.querySelectorAll("[data-grid-selection-value]").forEach((element) => element.remove());

  const chipClass = summary.getAttribute("data-grid-selection-value-class")
    ?? "rounded-md bg-accent px-2 py-1 font-medium text-foreground";
  for (const value of values.length > 0 ? values : ["None"]) {
    const chip = preview.ownerDocument.createElement("span");
    chip.className = chipClass;
    chip.dataset.gridSelectionValue = "";
    chip.textContent = value;
    summary.append(chip);
  }
}

function bindGridPreview(preview: HTMLElement) {
  if (preview.dataset[GRID_BOUND] === "true") return;
  const root = preview.querySelector<HTMLElement>("aria-grid");
  if (!root) return;

  root.addEventListener("valuechange", (event) => {
    const values = gridEventValues(event);
    if (!values) return;
    if (root.hasAttribute("data-grid-controlled")) {
      root.setAttribute("value", values.join(","));
    }
    renderGridSummary(preview, values);
  });
  preview.dataset[GRID_BOUND] = "true";
}

export function syncGridExamples(root: ParentNode = document) {
  for (const preview of Array.from(root.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="grid"]'))) {
    bindGridPreview(preview);
  }
}

function observeGridExamples(root: ParentNode) {
  if (observedGridRoots.has(root) || typeof MutationObserver === "undefined") return;
  const target = root instanceof Document ? root.documentElement : root;
  if (!(target instanceof Node)) return;
  const observer = new MutationObserver(() => syncGridExamples(root));
  observer.observe(target, { childList: true, subtree: true });
  observedGridRoots.add(root);
}

export function installGridExamples(root: ParentNode = document) {
  syncGridExamples(root);
  observeGridExamples(root);
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(() => syncGridExamples(root));
  }
}
```

Generate and narrowly merge into theme index:

```ts
import { installGridExamples } from "./grid-examples";
// inside browser enhanceApp, after defineGridElements():
installGridExamples();
```

Do not remove the existing Pagination installer import or call.

- [ ] **Step 5: Run docs interaction tests and verify GREEN**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "grid"
```

Expected: all focused Grid docs tests pass, including the three new summary tests.

- [ ] **Step 6: Commit Grid-owned docs runtime files; leave overlapping shared hunks isolated if needed**

```bash
git add scripts/generate-from-ariaui.mjs \
  web/doc/docs/.vitepress/theme/grid-examples.ts \
  web/doc/docs/components/grid.md
git add -p web/doc/__test__/docs.test.ts \
  web/doc/docs/.vitepress/theme/index.ts
git commit -m "feat(grid-docs): synchronize live example state"
```

During `git add -p`, stage only Grid hunks and answer `n` for Pagination hunks.

### Task 6: Lock Page Structure and Source-Equivalent Styling

**Files:**

- Modify: `scripts/generate-from-ariaui.mjs` (`gridComponentDocPage`, `gridExamplesSection`, `docsStyle`, `docsTests`)
- Modify: `web/doc/docs/components/grid.md`
- Modify carefully: `web/doc/docs/.vitepress/theme/style.css`
- Modify carefully: `web/doc/__test__/docs.test.ts`

- [ ] **Step 1: Strengthen source page and style assertions**

Keep the exact heading order assertion:

```ts
expectHeadingsInOrder(doc, [
  "## Features",
  "## Installation",
  "## Examples",
  "## Anatomy",
  "## API Reference",
  "## Keyboard",
  "## Accessibility",
]);
expectHeadingsInOrder(doc, ["### Uncontrolled", "### Controlled"]);
```

Add exact style-contract assertions:

```ts
expect(style).toContain('.ariaui-web-preview[data-component="grid"]');
expect(style).toContain('[data-example-part="Root"]');
expect(style).toContain('[data-example-part="Cell"][data-selected="true"]');
expect(style).toContain('[data-example-part="Cell"][data-focused="true"]');
expect(style).toContain("max-width: min(100%, 28rem);");
expect(style).toContain("flex-wrap: wrap;");
expect(style).toContain("outline: 2px solid var(--vp-c-brand-1);");
expect(doc).not.toMatch(/style="[^"]*(?:width|height|display|padding|margin)/);
```

- [ ] **Step 2: Run the focused structure/style test**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "grid docs structured|grid live example styles"
```

Expected: PASS if the existing generated style already matches; any new stable-marker or responsive assertion that fails becomes the RED target for this task.

- [ ] **Step 3: Update generator CSS and materialized CSS only where an assertion or visual comparison requires it**

Retain token-backed rules under the Grid preview scope. Do not introduce direct production `style` attributes. Ensure these effective rules remain:

```css
.ariaui-web-preview[data-component="grid"] {
  display: flex;
  width: 100%;
  max-width: 100%;
  justify-content: center;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1.5rem 1rem;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="grid"] [data-example-part="Root"] {
  display: table;
  width: 100%;
  max-width: min(100%, 28rem);
  min-width: 0;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.ariaui-web-preview[data-component="grid"] [data-example-part="Cell"][data-selected="true"] {
  background: color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
}

.ariaui-web-preview[data-component="grid"] [data-example-part="Cell"][data-focused="true"] {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--vp-c-brand-1);
}
```

- [ ] **Step 4: Run focused docs tests**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "grid"
```

Expected: all Grid docs tests pass.

- [ ] **Step 5: Commit only Grid style/test hunks**

```bash
git add scripts/generate-from-ariaui.mjs web/doc/docs/components/grid.md
git add -p web/doc/docs/.vitepress/theme/style.css web/doc/__test__/docs.test.ts
git commit -m "docs(grid): match source page and example styling"
```

### Task 7: Prove Generator Parity in an Isolated Worktree

**Files:**

- Verify: every file listed in the File Map
- Preserve: all unrelated primary-worktree changes

- [ ] **Step 1: Create the detached generator worktree**

Run from the primary worktree:

```bash
git worktree add --detach /home/neo/Projects/ariaui-web-grid-generate HEAD
pnpm --dir /home/neo/Projects/ariaui-web-grid-generate install --frozen-lockfile
```

Expected: worktree created at current HEAD; install completes without changing the lockfile.

- [ ] **Step 2: Run the required generator outside the dirty worktree**

```bash
node /home/neo/Projects/ariaui-web-grid-generate/scripts/generate-from-ariaui.mjs
```

Expected: generation completes and reads sibling source from `/home/neo/Projects/ariaui`.

- [ ] **Step 3: Review all generated changes**

Run:

```bash
git -C /home/neo/Projects/ariaui-web-grid-generate status --short
git -C /home/neo/Projects/ariaui-web-grid-generate diff -- \
  packages/grid \
  web/doc/docs/components/grid.md \
  web/doc/docs/.vitepress/theme/grid-examples.ts \
  web/doc/docs/.vitepress/theme/index.ts \
  web/doc/docs/.vitepress/theme/style.css \
  web/doc/__test__/docs.test.ts
```

Expected: no diff for Grid-owned package/docs files. Shared generated files may differ only where the clean detached worktree lacks unrelated uncommitted Pagination edits; there must be no missing Grid hunk.

- [ ] **Step 4: Run tests in the generated worktree**

```bash
pnpm --dir /home/neo/Projects/ariaui-web-grid-generate --filter @ariaui-web/grid test
pnpm --dir /home/neo/Projects/ariaui-web-grid-generate exec vitest run web/doc/__test__/docs.test.ts -t "grid"
```

Expected: Grid package suite and focused docs tests pass from freshly generated files.

- [ ] **Step 5: Remove the isolated worktree**

```bash
git worktree remove /home/neo/Projects/ariaui-web-grid-generate
```

Expected: worktree removed; primary dirty Pagination work remains unchanged.

### Task 8: Run Package, Docs, and Repository Verification

**Files:**

- Verify: `packages/grid/**`
- Verify: `web/doc/**` Grid surfaces

- [ ] **Step 1: Run package tests and build**

```bash
pnpm --filter @ariaui-web/grid test
pnpm --filter @ariaui-web/grid build
```

Expected: both commands exit 0 with no warnings introduced by Grid.

- [ ] **Step 2: Run focused and full docs tests**

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "grid"
pnpm --dir web/doc test
```

Expected: focused Grid tests and complete docs tests pass.

- [ ] **Step 3: Build VitePress docs**

```bash
pnpm --dir web/doc build
```

Expected: VitePress production build exits 0.

- [ ] **Step 4: Run the repository suite**

```bash
pnpm test
```

Expected: repository tests pass. If an unrelated dirty Pagination test fails, record the exact pre-existing failure and prove the Grid-focused suites remain green before changing anything outside Grid.

- [ ] **Step 5: Record the known lint baseline without expanding scope**

```bash
pnpm --filter @ariaui-web/grid lint
```

Expected baseline: TS6059 errors because linked `packages/utils/src/*` files are outside `packages/grid`'s configured `rootDir`. Do not claim lint success or edit shared tsconfig solely for this task.

### Task 9: Run Interactive and Visual Browser Verification

**Files:**

- Verify rendered source: `/home/neo/Projects/ariaui/web/doc`
- Verify rendered target: `/home/neo/Projects/ariaui-web/web/doc`

- [ ] **Step 1: Start both documentation servers**

Source:

```bash
pnpm --dir /home/neo/Projects/ariaui/web/doc dev --hostname 127.0.0.1 --port 4174
```

Target:

```bash
pnpm --dir /home/neo/Projects/ariaui-web/web/doc dev --host 127.0.0.1 --port 4173
```

Expected routes:

- Source: `http://127.0.0.1:4174/docs/components/grid`
- Target: `http://127.0.0.1:4173/components/grid`

- [ ] **Step 2: Capture desktop source and target screenshots**

Use the browser visual-testing skill at 1440×1000. Capture full-page and example-focused screenshots for both routes.

Expected: identical content hierarchy; source-equivalent table, selection panel, spacing, colors, borders, shadow, selected state, and focus outline inside each site's docs shell.

- [ ] **Step 3: Verify uncontrolled interaction states**

On the target uncontrolled preview:

1. Confirm `jane:role` is selected and shown in the summary.
2. Click `jane:status`; confirm cell and summary become `jane:status`.
3. Press ArrowLeft; confirm focus moves without changing selection.
4. Press Enter; confirm both `jane:status` and `jane:role` are selected and summarized.
5. Press Escape; confirm all selection clears and the summary reads `None`.

- [ ] **Step 4: Verify controlled interaction states**

On the target controlled preview:

1. Confirm `bob:status` initial state.
2. Click `jane:role`.
3. Confirm the Grid first emits its proposal, the docs installer writes `value="jane:role"`, rendered selection updates, and summary becomes `jane:role`.
4. Confirm no duplicate chips or duplicate event handling after client-side navigation away and back.

- [ ] **Step 5: Capture mobile screenshots and overflow checks**

Repeat at 390×844. In browser evaluation, assert:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Expected: true on source and target. The selection chips wrap, tables remain readable, and no page-level horizontal overflow appears.

- [ ] **Step 6: Check accessibility and console output**

Confirm:

- one accessible Grid name per preview
- Row, Header, and Cell roles
- exactly one roving `tabindex="0"` Cell per Grid
- focused outline visible during keyboard navigation
- no unexpected browser console errors or warnings

- [ ] **Step 7: Save verification evidence and stop both servers**

Record screenshot paths and interaction outcomes in the execution handoff. Stop the dev-server sessions cleanly.

### Task 10: Final Diff and Completion Review

**Files:**

- Review: all Grid and shared docs files changed by Tasks 1-9

- [ ] **Step 1: Review scoped diff and worktree preservation**

```bash
git status --short
git diff --stat HEAD~5..HEAD
git diff -- packages/grid scripts/generate-from-ariaui.mjs web/doc/docs/components/grid.md web/doc/docs/.vitepress/theme/grid-examples.ts
git diff -- web/doc/__test__/docs.test.ts web/doc/docs/.vitepress/theme/index.ts web/doc/docs/.vitepress/theme/style.css
```

Expected: Grid changes match the design; Pagination changes remain present and are not accidentally included in Grid-only commits.

- [ ] **Step 2: Run final completion commands once more**

```bash
pnpm --filter @ariaui-web/grid test
pnpm --filter @ariaui-web/grid build
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "grid"
pnpm --dir web/doc build
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit any final Grid-only cleanup**

If review requires a Grid-only cleanup, stage only its files and commit:

```bash
git commit -m "fix(grid): finalize native source parity"
```

Do not create an empty commit.

- [ ] **Step 4: Prepare the handoff**

Report:

- controlled/uncontrolled state outcome
- 29-case source mirror outcome
- package/docs/build commands and results
- known unchanged TS6059 lint baseline
- desktop/mobile screenshot paths and interaction results
- generator parity result
- confirmation that unrelated Pagination changes were preserved
