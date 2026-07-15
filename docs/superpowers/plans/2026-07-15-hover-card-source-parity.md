# Hover Card Source Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `@ariaui-web/hover-card` to match the current AriaUI Hover Card specification and tests, then reproduce the AriaUI documentation page with equivalent native live examples and a documentation-only Framer Motion example.

**Architecture:** Keep Root, Trigger, and Content as browser-native custom elements backed by focused DOM, action, synchronization, positioning, and lifecycle modules. Preserve those package-local modules through the repository generator, generate a source-structured VitePress page, and use `framer-motion/dom` only from a documentation example installer.

**Tech Stack:** TypeScript, Custom Elements, HTML Popover API, DOM geometry and observers, Vitest with jsdom, VitePress, pnpm, Framer Motion DOM API, browser visual testing.

---

## Worktree and file map

Execute this plan in a dedicated sibling worktree so the active Pagination changes in `/home/neo/Projects/ariaui-web` are not overwritten. Before Task 1, invoke `superpowers:using-git-worktrees`, then create the worktree from the commit containing this plan:

```bash
git worktree add /home/neo/Projects/ariaui-web-hover-card -b feat/hover-card-source-parity main
cd /home/neo/Projects/ariaui-web-hover-card
pnpm install --frozen-lockfile
git status --short
```

Expected: dependencies install successfully and the new worktree is clean. The sibling AriaUI source remains available at `/home/neo/Projects/ariaui`, which is also `../ariaui` from this worktree.

Files created or changed by this plan:

- `packages/hover-card/src/hover-card-dom.ts`: part lookup, root association, ids, placement parsing, arrow lookup.
- `packages/hover-card/src/hover-card-actions.ts`: cancelable state requests and pointer/focus/Escape behavior.
- `packages/hover-card/src/hover-card-position.ts`: viewport placement, collision adjustment, arrow placement, auto-update cleanup.
- `packages/hover-card/src/hover-card-sync.ts`: initial state, ARIA/data reflection, visibility/top-layer synchronization.
- `packages/hover-card/src/hover-card-element.ts`: lifecycle, observed attributes, event binding, mutation observation.
- `packages/hover-card/src/component-spec.ts`: generated source-test parity metadata and corrected native contract.
- `packages/hover-card/readme.md`: generated native requirements and source-test parity summary.
- `packages/hover-card/__test__/hover-card.test.ts`: source behavior parity tests.
- `packages/hover-card/__test__/component.spec.test.ts`: generated contract and package-local architecture assertions.
- `scripts/generate-from-ariaui.mjs`: Hover Card role/attributes/parity metadata, preservation hooks, page generation, theme installer generation, docs dependency.
- `web/doc/docs/components/hover-card.md`: source-equivalent page and live examples.
- `web/doc/docs/.vitepress/theme/hover-card-examples.ts`: documentation binding and Framer Motion DOM animation.
- `web/doc/docs/.vitepress/theme/index.ts`: installs Hover Card examples.
- `web/doc/docs/.vitepress/theme/style.css`: token-backed Hover Card example styles.
- `web/doc/__test__/docs.test.ts`: page structure, content, markup, and style assertions.
- `web/doc/__test__/hover-card-examples.test.ts`: default binding and Framer Motion behavior tests.
- `web/doc/package.json`: documentation-only `framer-motion` dependency.
- `pnpm-lock.yaml`: resolved documentation dependency.

Do not stage or edit Pagination files as part of any Hover Card commit.

### Task 1: Synchronize the generated Hover Card contract

**Files:**
- Modify: `packages/hover-card/__test__/component.spec.test.ts`
- Modify: `packages/hover-card/__test__/hover-card.test.ts`
- Modify: `packages/hover-card/src/component-spec.ts`
- Modify: `packages/hover-card/readme.md`
- Modify: `scripts/generate-from-ariaui.mjs`

- [ ] **Step 1: Add the failing source-parity contract assertion**

Append this test inside the existing `describe("@ariaui-web/hover-card readme", ...)` block:

```ts
it("tracks the current AriaUI Hover Card tests and native role adaptation", () => {
  const content = componentSpec.parts.find((part) => part.name === "Content");

  expect(content?.defaultRole).toBe("tooltip");
  expect(componentSpec.requirementAttributes).toEqual(expect.arrayContaining([
    "arrow",
    "arrow-class",
    "aria-expanded",
    "data-align",
    "data-side",
    "data-state",
    "default-open",
    "offset",
    "open",
    "placement",
    "role",
  ]));
  expect(componentSpec.sourceTestParity).toMatchObject({
    learningSources: [
      "../ariaui/packages/hover-card/__test__/hover-card.test.tsx",
      "../ariaui/packages/hover-card/__test__/index.test.tsx",
    ],
    sourceTestCases: 17,
  });
  expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
    "hover, pointer safe-area, focus, blur, and Escape open-state behavior",
    "controlled-style open and cancelable openchange behavior",
    "viewport-bound positioning, offset, placement reflection, and automatic updates",
    "optional arrow rendering and browser-native content composition",
    "docs examples and page structure match the source Aria UI Hover Card documentation",
  ]));
});
```

- [ ] **Step 2: Run the focused contract test and verify RED**

Run:

```bash
pnpm exec vitest run packages/hover-card/__test__/component.spec.test.ts
```

Expected: FAIL because Content is currently `region`, the explicit requirement attributes are absent, and `sourceTestParity` does not exist.

- [ ] **Step 3: Add the generator's Hover Card contract rules**

In `roleByPackagePart`, add:

```js
["hover-card:Content", "tooltip"],
```

In `buildRequirementAttributes`, before its return, add:

```js
if (packageName === "hover-card") {
  for (const attribute of [
    "arrow",
    "arrow-class",
    "aria-expanded",
    "data-align",
    "data-side",
    "data-state",
    "default-open",
    "offset",
    "placement",
  ]) {
    attributes.add(attribute);
  }
}
```

In `documentedRequirementAttributes()` inside `packages/hover-card/__test__/hover-card.test.ts`, add the same native-only attributes before returning:

```ts
for (const attribute of [
  "aria-expanded",
  "arrow",
  "arrow-class",
  "data-align",
  "data-side",
  "data-state",
  "default-open",
  "offset",
  "placement",
]) {
  attributes.add(attribute);
}
```

In `defaultAttributesForPart`, add:

```js
if (packageName === "hover-card" && part.name === "Trigger") {
  attributes["aria-expanded"] = "false";
}
```

Add this branch to `sourceTestParitySpec` before its final fallback:

```js
if (packageName === "hover-card") {
  return {
    learningSources: [
      "../ariaui/packages/hover-card/__test__/hover-card.test.tsx",
      "../ariaui/packages/hover-card/__test__/index.test.tsx",
    ],
    sourceTestCases: 17,
    nativeRequirements: [
      "hover, pointer safe-area, focus, blur, and Escape open-state behavior",
      "default-open initialization and direct open property reflection",
      "controlled-style open and cancelable openchange behavior",
      "trigger and content handler composition with orphan-part structure errors",
      "tooltip role, stable trigger/content association, and closed-state hiding",
      "viewport-bound positioning, offset, placement reflection, and automatic updates",
      "optional arrow rendering and browser-native content composition",
      "docs examples and page structure match the source Aria UI Hover Card documentation",
    ],
  };
}
```

- [ ] **Step 4: Apply the generated contract output without running the full generator in this worktree**

Update `packages/hover-card/src/component-spec.ts` to contain the generated role, attributes, and `sourceTestParity` values from Step 3. Update the Parts table in `packages/hover-card/readme.md` so Content is `tooltip`, add the explicit native attributes to its requirements, and add:

```md
### Source Test Parity

- Learned from `../ariaui/packages/hover-card/__test__/hover-card.test.tsx` and `../ariaui/packages/hover-card/__test__/index.test.tsx`.
- Source cases represented: 17.
- Native coverage includes hover, pointer safe-area, focus, blur, Escape, controlled and default state, viewport positioning, automatic updates, optional arrow rendering, and source-structured documentation examples.
```

Do not run the full generator yet; Task 5 audits regeneration in a disposable worktree.

- [ ] **Step 5: Run the contract test and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/hover-card/__test__/component.spec.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the contract synchronization**

```bash
git add scripts/generate-from-ariaui.mjs packages/hover-card/src/component-spec.ts packages/hover-card/readme.md packages/hover-card/__test__/component.spec.test.ts packages/hover-card/__test__/hover-card.test.ts
git commit -m "test(hover-card): sync source contract parity"
```

### Task 2: Implement initial and controlled open state

**Files:**
- Create: `packages/hover-card/src/hover-card-dom.ts`
- Create: `packages/hover-card/src/hover-card-sync.ts`
- Modify: `packages/hover-card/src/hover-card-element.ts`
- Modify: `packages/hover-card/__test__/hover-card.test.ts`

- [ ] **Step 1: Add failing state, association, and controlled-event tests**

Add this helper near the top of `hover-card.test.ts`:

```ts
function renderHoverCard(rootAttributes: Record<string, string> = {}) {
  defineHoverCardElements();
  const root = document.createElement("aria-hover-card") as RuntimeElement;
  const trigger = document.createElement("aria-hover-card-trigger") as RuntimeElement;
  const content = document.createElement("aria-hover-card-content") as RuntimeElement;

  for (const [name, value] of Object.entries(rootAttributes)) {
    root.setAttribute(name, value);
  }

  trigger.textContent = "Hover me";
  content.textContent = "Card content";
  root.append(trigger, content);
  document.body.append(root);
  return { root, trigger, content };
}
```

Append these tests:

```ts
it("starts closed and applies default-open once", () => {
  const closed = renderHoverCard();
  expect(closed.root.open).toBe(false);
  expect(closed.content.hidden).toBe(true);
  expect(closed.trigger.getAttribute("aria-expanded")).toBe("false");

  const opened = renderHoverCard({ "default-open": "" });
  expect(opened.root.open).toBe(true);
  expect(opened.content.hidden).toBe(false);
  expect(opened.trigger.getAttribute("aria-expanded")).toBe("true");

  opened.root.open = false;
  opened.root.setAttribute("data-test-mutation", "one");
  expect(opened.root.open).toBe(false);
});

it("lets consumers cancel openchange and own open state", () => {
  const { root, trigger, content } = renderHoverCard();
  const changes: boolean[] = [];

  root.addEventListener("openchange", (event) => {
    const change = event as CustomEvent<{ open: boolean; source: Element }>;
    changes.push(change.detail.open);
    expect(change.detail.source).toBe(trigger);
    event.preventDefault();
  });

  trigger.dispatchEvent(new MouseEvent("mouseenter"));
  expect(changes).toEqual([true]);
  expect(root.open).toBe(false);
  expect(content.hidden).toBe(true);

  root.open = true;
  expect(content.hidden).toBe(false);
});

it("associates Trigger and Content with stable ids and tooltip semantics", () => {
  const { trigger, content } = renderHoverCard();

  expect(trigger.id).not.toBe("");
  expect(content.id).not.toBe("");
  expect(trigger.getAttribute("aria-controls")).toBe(content.id);
  expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
  expect(content.getAttribute("role")).toBe("tooltip");
});

it("reports Trigger and Content connected outside Root", () => {
  defineHoverCardElements();
  const TriggerConstructor = customElements.get("aria-hover-card-trigger") as (typeof HTMLElement & { new(): HTMLElement & { connectedCallback(): void } });
  const orphan = new TriggerConstructor();

  expect(() => orphan.connectedCallback()).toThrow(
    "HoverCard components must be wrapped in <HoverCard.Root />",
  );
});
```

- [ ] **Step 2: Run the state tests and verify RED**

Run:

```bash
pnpm exec vitest run packages/hover-card/__test__/hover-card.test.ts -t "starts closed|cancel openchange|stable ids|connected outside"
```

Expected: FAIL because the generic elements do not coordinate Root state, visibility, ids, or controlled events.

- [ ] **Step 3: Create the DOM association module**

Create `hover-card-dom.ts` with:

```ts
export type HoverCardPlacement =
  | "top" | "top-start" | "top-end"
  | "right" | "right-start" | "right-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end";

const placements = new Set<HoverCardPlacement>([
  "top", "top-start", "top-end",
  "right", "right-start", "right-end",
  "bottom", "bottom-start", "bottom-end",
  "left", "left-start", "left-end",
]);

let hoverCardId = 0;

export function hoverCardPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function hoverCardRoot(element: Element) {
  return element.matches("aria-hover-card")
    ? element as HTMLElement
    : element.closest("aria-hover-card") as HTMLElement | null;
}

export function hoverCardTrigger(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-hover-card-trigger"))
    .find((element) => element.closest("aria-hover-card") === root) ?? null;
}

export function hoverCardContent(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-hover-card-content"))
    .find((element) => element.closest("aria-hover-card") === root) ?? null;
}

export function ensureHoverCardId(element: HTMLElement, suffix: "trigger" | "content") {
  if (!element.id) {
    hoverCardId += 1;
    element.id = `aria-hover-card-${hoverCardId}-${suffix}`;
  }
  return element.id;
}

export function hoverCardPlacement(root: Element): HoverCardPlacement {
  const value = root.getAttribute("placement") as HoverCardPlacement | null;
  return value && placements.has(value) ? value : "bottom";
}

export function hoverCardOffset(root: Element) {
  const value = Number(root.getAttribute("offset") ?? "8");
  return Number.isFinite(value) ? value : 8;
}

export function assertHoverCardStructure(element: HTMLElement) {
  const part = hoverCardPartName(element);
  if ((part === "Trigger" || part === "Content") && !hoverCardRoot(element)) {
    throw new Error("HoverCard components must be wrapped in <HoverCard.Root />");
  }
}
```

- [ ] **Step 4: Create minimal state synchronization**

Create `hover-card-sync.ts` with:

```ts
import {
  ensureHoverCardId,
  hoverCardContent,
  hoverCardPartName,
  hoverCardRoot,
  hoverCardTrigger,
} from "./hover-card-dom";

type SyncState = { defaultOpenApplied: boolean; observer: MutationObserver | null; syncing: boolean };
const states = new WeakMap<HTMLElement, SyncState>();

function state(root: HTMLElement) {
  let value = states.get(root);
  if (!value) {
    value = { defaultOpenApplied: false, observer: null, syncing: false };
    states.set(root, value);
  }
  return value;
}

function setState(element: HTMLElement, open: boolean) {
  element.setAttribute("data-state", open ? "open" : "closed");
}

export function syncHoverCardPart(element: HTMLElement) {
  const root = hoverCardRoot(element);
  if (root) syncHoverCardRoot(root);
}

export function observeHoverCardRoot(root: HTMLElement) {
  const value = state(root);
  if (value.observer || typeof MutationObserver === "undefined") return;
  value.observer = new MutationObserver(() => syncHoverCardRoot(root));
  value.observer.observe(root, { childList: true, subtree: true });
}

export function disconnectHoverCardRoot(root: HTMLElement) {
  state(root).observer?.disconnect();
  state(root).observer = null;
}

export function syncHoverCardRoot(root: HTMLElement) {
  const value = state(root);
  if (value.syncing) return;
  value.syncing = true;
  try {
    if (!value.defaultOpenApplied) {
      value.defaultOpenApplied = true;
      if (root.hasAttribute("default-open") && !root.hasAttribute("open")) root.setAttribute("open", "");
    }

    const open = root.hasAttribute("open");
    const trigger = hoverCardTrigger(root);
    const content = hoverCardContent(root);
    setState(root, open);

    if (trigger) {
      const triggerId = ensureHoverCardId(trigger, "trigger");
      trigger.setAttribute("aria-expanded", String(open));
      setState(trigger, open);
      if (content) {
        const contentId = ensureHoverCardId(content, "content");
        trigger.setAttribute("aria-controls", contentId);
        content.setAttribute("aria-labelledby", triggerId);
      }
    }

    if (content) {
      content.hidden = !open;
      content.setAttribute("role", content.getAttribute("role") ?? "tooltip");
      setState(content, open);
    }
  } finally {
    value.syncing = false;
  }
}

export function requestHoverCardOpen(root: HTMLElement, open: boolean, source: Element) {
  if (root.hasAttribute("open") === open) return false;
  const event = new CustomEvent("openchange", { bubbles: true, cancelable: true, detail: { open, source } });
  if (!root.dispatchEvent(event)) return false;
  root.toggleAttribute("open", open);
  syncHoverCardRoot(root);
  return true;
}

export function hoverCardObservedAttributes() {
  return ["default-open", "offset", "open", "placement"] as const;
}
```

- [ ] **Step 5: Wire lifecycle into the element class**

Replace the empty `HoverCardWebElement` with:

```ts
export class HoverCardWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, ...hoverCardObservedAttributes()]));
  }

  override connectedCallback() {
    super.connectedCallback();
    assertHoverCardStructure(this);
    if (hoverCardPartName(this) === "Root") observeHoverCardRoot(this);
    syncHoverCardPart(this);
  }

  disconnectedCallback() {
    if (hoverCardPartName(this) === "Root") disconnectHoverCardRoot(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, nextValue: string | null) {
    super.attributeChangedCallback(name, oldValue, nextValue);
    if (oldValue !== nextValue) syncHoverCardPart(this);
  }

  override afterAriaWebContractApplied() {
    syncHoverCardPart(this);
  }
}
```

Add imports for `assertHoverCardStructure`, `hoverCardPartName`, `disconnectHoverCardRoot`, `hoverCardObservedAttributes`, `observeHoverCardRoot`, and `syncHoverCardPart` from the new modules. Keep `createHoverCardWebComponent` unchanged below the class.

- [ ] **Step 6: Run focused and package tests and verify GREEN**

```bash
pnpm exec vitest run packages/hover-card/__test__/hover-card.test.ts -t "starts closed|cancel openchange|stable ids|connected outside"
pnpm --filter @ariaui-web/hover-card test
```

Expected: both commands PASS.

- [ ] **Step 7: Commit state behavior**

```bash
git add packages/hover-card/src/hover-card-dom.ts packages/hover-card/src/hover-card-sync.ts packages/hover-card/src/hover-card-element.ts packages/hover-card/__test__/hover-card.test.ts
git commit -m "feat(hover-card): add native open state"
```

### Task 3: Add hover, safe-area, focus, blur, and Escape behavior

**Files:**
- Create: `packages/hover-card/src/hover-card-actions.ts`
- Modify: `packages/hover-card/src/hover-card-element.ts`
- Modify: `packages/hover-card/src/hover-card-sync.ts`
- Modify: `packages/hover-card/__test__/hover-card.test.ts`

- [ ] **Step 1: Add failing interaction tests adapted from AriaUI**

Append:

```ts
it("opens and closes from Trigger pointer hover", async () => {
  const { root, trigger, content } = renderHoverCard();
  trigger.dispatchEvent(new MouseEvent("mouseenter"));
  expect(root.open).toBe(true);
  expect(content.hidden).toBe(false);

  trigger.dispatchEvent(new MouseEvent("mouseleave"));
  await Promise.resolve();
  expect(root.open).toBe(false);
  expect(content.hidden).toBe(true);
});

it("keeps the safe area open while the pointer moves into Content", async () => {
  const { root, trigger, content } = renderHoverCard();
  trigger.dispatchEvent(new MouseEvent("mouseenter"));
  trigger.dispatchEvent(new MouseEvent("mouseleave"));
  content.dispatchEvent(new MouseEvent("mouseenter"));
  await Promise.resolve();
  expect(root.open).toBe(true);

  content.dispatchEvent(new MouseEvent("mouseleave"));
  await Promise.resolve();
  expect(root.open).toBe(false);
});

it("opens on focus, closes on blur, and closes on Escape", async () => {
  const { root, trigger, content } = renderHoverCard();
  trigger.dispatchEvent(new FocusEvent("focus"));
  expect(root.open).toBe(true);

  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  expect(root.open).toBe(false);

  trigger.dispatchEvent(new FocusEvent("focus"));
  trigger.dispatchEvent(new FocusEvent("blur"));
  await Promise.resolve();
  expect(root.open).toBe(false);
  expect(content.hidden).toBe(true);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run packages/hover-card/__test__/hover-card.test.ts -t "pointer hover|safe area|opens on focus"
```

Expected: FAIL because no Hover Card interaction listeners exist.

- [ ] **Step 3: Implement the interaction state machine**

Create `hover-card-actions.ts`:

```ts
import { hoverCardPartName, hoverCardRoot } from "./hover-card-dom";
import { requestHoverCardOpen } from "./hover-card-sync";

type ActionState = {
  pointerOverTrigger: boolean;
  pointerOverContent: boolean;
  focusWithin: boolean;
  closeVersion: number;
};

const states = new WeakMap<HTMLElement, ActionState>();

function state(root: HTMLElement) {
  let value = states.get(root);
  if (!value) {
    value = { pointerOverTrigger: false, pointerOverContent: false, focusWithin: false, closeVersion: 0 };
    states.set(root, value);
  }
  return value;
}

function guardedClose(root: HTMLElement, source: Element) {
  const value = state(root);
  const version = ++value.closeVersion;
  queueMicrotask(() => {
    if (version !== value.closeVersion || value.pointerOverTrigger || value.pointerOverContent || value.focusWithin) return;
    requestHoverCardOpen(root, false, source);
  });
}

export function handleHoverCardMouseEnter(element: HTMLElement) {
  const root = hoverCardRoot(element);
  if (!root) return;
  const value = state(root);
  if (hoverCardPartName(element) === "Trigger") value.pointerOverTrigger = true;
  if (hoverCardPartName(element) === "Content") value.pointerOverContent = true;
  value.closeVersion += 1;
  requestHoverCardOpen(root, true, element);
}

export function handleHoverCardMouseLeave(element: HTMLElement) {
  const root = hoverCardRoot(element);
  if (!root) return;
  const value = state(root);
  if (hoverCardPartName(element) === "Trigger") value.pointerOverTrigger = false;
  if (hoverCardPartName(element) === "Content") value.pointerOverContent = false;
  guardedClose(root, element);
}

export function handleHoverCardFocus(element: HTMLElement) {
  if (hoverCardPartName(element) !== "Trigger") return;
  const root = hoverCardRoot(element);
  if (!root) return;
  const value = state(root);
  value.focusWithin = true;
  value.closeVersion += 1;
  requestHoverCardOpen(root, true, element);
}

export function handleHoverCardBlur(element: HTMLElement) {
  if (hoverCardPartName(element) !== "Trigger") return;
  const root = hoverCardRoot(element);
  if (!root) return;
  state(root).focusWithin = false;
  guardedClose(root, element);
}

export function handleHoverCardKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  const root = hoverCardRoot(element);
  if (!root || !root.hasAttribute("open")) return;
  event.preventDefault();
  requestHoverCardOpen(root, false, element);
}
```

- [ ] **Step 4: Bind and clean interaction listeners**

Add private bound handlers and a `#hoverCardEventsBound` guard to `HoverCardWebElement`. Bind `mouseenter`, `mouseleave`, `focus`, `blur`, and `keydown` once in `connectedCallback`, using the exported action functions. Remove them in `disconnectedCallback`. The exact bindings are:

```ts
readonly #hoverCardMouseEnter = () => handleHoverCardMouseEnter(this);
readonly #hoverCardMouseLeave = () => handleHoverCardMouseLeave(this);
readonly #hoverCardFocus = () => handleHoverCardFocus(this);
readonly #hoverCardBlur = () => handleHoverCardBlur(this);
readonly #hoverCardKeyDown = (event: KeyboardEvent) => handleHoverCardKeyDown(this, event);

#bindHoverCardEvents() {
  if (this.#hoverCardEventsBound) return;
  this.addEventListener("mouseenter", this.#hoverCardMouseEnter);
  this.addEventListener("mouseleave", this.#hoverCardMouseLeave);
  this.addEventListener("focus", this.#hoverCardFocus);
  this.addEventListener("blur", this.#hoverCardBlur);
  this.addEventListener("keydown", this.#hoverCardKeyDown);
  this.#hoverCardEventsBound = true;
}
```

On disconnect, remove the same five listeners and reset the guard.

- [ ] **Step 5: Verify GREEN and regressions**

```bash
pnpm exec vitest run packages/hover-card/__test__/hover-card.test.ts -t "pointer hover|safe area|opens on focus"
pnpm --filter @ariaui-web/hover-card test
```

Expected: PASS with no warnings.

- [ ] **Step 6: Commit interactions**

```bash
git add packages/hover-card/src/hover-card-actions.ts packages/hover-card/src/hover-card-element.ts packages/hover-card/src/hover-card-sync.ts packages/hover-card/__test__/hover-card.test.ts
git commit -m "feat(hover-card): match source interactions"
```

### Task 4: Add top-layer positioning, automatic updates, and arrow rendering

**Files:**
- Create: `packages/hover-card/src/hover-card-position.ts`
- Modify: `packages/hover-card/src/hover-card-sync.ts`
- Modify: `packages/hover-card/src/hover-card-element.ts`
- Modify: `packages/hover-card/__test__/hover-card.test.ts`

- [ ] **Step 1: Add failing viewport positioning and arrow tests**

Append tests that install deterministic geometry:

```ts
it("positions against the viewport rather than a clipped parent", () => {
  const { root, trigger, content } = renderHoverCard();
  root.setAttribute("placement", "bottom");
  root.setAttribute("offset", "8");
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1000 });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 1000 });
  trigger.getBoundingClientRect = () => new DOMRect(100, 100, 120, 32);
  content.getBoundingClientRect = () => new DOMRect(0, 0, 220, 160);

  root.open = true;

  expect(content.style.position).toBe("fixed");
  expect(content.style.left).toBe("50px");
  expect(content.style.top).toBe("140px");
  expect(content.dataset.side).toBe("bottom");
  expect(content.dataset.align).toBe("center");
});

it("flips at viewport collisions and renders one optional arrow", () => {
  const { root, trigger, content } = renderHoverCard();
  root.setAttribute("placement", "bottom-start");
  content.setAttribute("arrow", "");
  content.setAttribute("arrow-class", "test-arrow");
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 320 });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 240 });
  trigger.getBoundingClientRect = () => new DOMRect(16, 210, 80, 24);
  content.getBoundingClientRect = () => new DOMRect(0, 0, 180, 100);

  root.open = true;

  expect(content.dataset.side).toBe("top");
  expect(content.dataset.align).toBe("start");
  expect(content.querySelectorAll("[data-hover-card-arrow]")).toHaveLength(1);
  expect(content.querySelector("[data-hover-card-arrow]")?.classList.contains("test-arrow")).toBe(true);
});

it("repositions while open when the document scrolls", () => {
  const { root, trigger, content } = renderHoverCard();
  let triggerLeft = 100;
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1000 });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 1000 });
  trigger.getBoundingClientRect = () => new DOMRect(triggerLeft, 100, 120, 32);
  content.getBoundingClientRect = () => new DOMRect(0, 0, 220, 160);

  root.open = true;
  expect(content.style.left).toBe("50px");

  triggerLeft = 200;
  document.dispatchEvent(new Event("scroll"));
  expect(content.style.left).toBe("150px");
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run packages/hover-card/__test__/hover-card.test.ts -t "positions against|flips at|repositions while"
```

Expected: FAIL because Content has no fixed coordinates, placement reflection, collision logic, or arrow.

- [ ] **Step 3: Implement placement calculation and auto-update**

Create `hover-card-position.ts` with these public functions and types:

```ts
import { hoverCardContent, hoverCardOffset, hoverCardPlacement, hoverCardTrigger, type HoverCardPlacement } from "./hover-card-dom";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type AutoState = { cleanup: (() => void) | null };
const autoStates = new WeakMap<HTMLElement, AutoState>();

function splitPlacement(value: HoverCardPlacement): [Side, Align] {
  const [side, align = "center"] = value.split("-") as [Side, Align?];
  return [side, align];
}

function opposite(side: Side): Side {
  return { top: "bottom", right: "left", bottom: "top", left: "right" }[side] as Side;
}

function coordinates(side: Side, align: Align, reference: DOMRect, floating: DOMRect, offset: number) {
  let x = reference.left + (reference.width - floating.width) / 2;
  let y = reference.top + (reference.height - floating.height) / 2;
  if (side === "top") y = reference.top - floating.height - offset;
  if (side === "bottom") y = reference.bottom + offset;
  if (side === "left") x = reference.left - floating.width - offset;
  if (side === "right") x = reference.right + offset;
  if ((side === "top" || side === "bottom") && align === "start") x = reference.left;
  if ((side === "top" || side === "bottom") && align === "end") x = reference.right - floating.width;
  if ((side === "left" || side === "right") && align === "start") y = reference.top;
  if ((side === "left" || side === "right") && align === "end") y = reference.bottom - floating.height;
  return { x, y };
}

function mainAxisOverflow(side: Side, point: { x: number; y: number }, rect: DOMRect, width: number, height: number) {
  if (side === "top") return point.y < 0;
  if (side === "bottom") return point.y + rect.height > height;
  if (side === "left") return point.x < 0;
  return point.x + rect.width > width;
}

export function positionHoverCard(root: HTMLElement) {
  const trigger = hoverCardTrigger(root);
  const content = hoverCardContent(root);
  if (!trigger || !content || !root.hasAttribute("open")) return;
  const reference = trigger.getBoundingClientRect();
  const floating = content.getBoundingClientRect();
  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;
  const [, align] = splitPlacement(hoverCardPlacement(root));
  let [side] = splitPlacement(hoverCardPlacement(root));
  let point = coordinates(side, align, reference, floating, hoverCardOffset(root));
  if (mainAxisOverflow(side, point, floating, width, height)) {
    side = opposite(side);
    point = coordinates(side, align, reference, floating, hoverCardOffset(root));
  }
  point.x = Math.min(Math.max(0, point.x), Math.max(0, width - floating.width));
  point.y = Math.min(Math.max(0, point.y), Math.max(0, height - floating.height));
  content.style.position = "fixed";
  content.style.left = `${Math.round(point.x)}px`;
  content.style.top = `${Math.round(point.y)}px`;
  content.dataset.side = side;
  content.dataset.align = align;
}

export function startHoverCardAutoUpdate(root: HTMLElement) {
  stopHoverCardAutoUpdate(root);
  const update = () => positionHoverCard(root);
  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
  const trigger = hoverCardTrigger(root);
  const content = hoverCardContent(root);
  if (trigger) observer?.observe(trigger);
  if (content) observer?.observe(content);
  window.addEventListener("resize", update);
  document.addEventListener("scroll", update, true);
  autoStates.set(root, {
    cleanup: () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    },
  });
  update();
}

export function stopHoverCardAutoUpdate(root: HTMLElement) {
  autoStates.get(root)?.cleanup?.();
  autoStates.delete(root);
}
```

- [ ] **Step 4: Add top-layer and arrow synchronization**

Extend `syncHoverCardRoot` so open Content gets `popover="manual"`, is shown through `showPopover()` inside a guarded `try`, and starts auto-update. Closed Content stops auto-update, calls `hidePopover()` inside a guarded `try`, and sets `hidden = true`. Use feature detection:

```ts
const popoverContent = content as HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
```

Add an `ensureHoverCardArrow(content)` helper to `hover-card-sync.ts`:

```ts
function ensureHoverCardArrow(content: HTMLElement) {
  let arrow = content.querySelector<HTMLElement>("[data-hover-card-arrow]");
  if (!content.hasAttribute("arrow")) {
    arrow?.remove();
    return;
  }
  if (!arrow) {
    arrow = document.createElement("span");
    arrow.setAttribute("data-hover-card-arrow", "");
    arrow.setAttribute("aria-hidden", "true");
    content.prepend(arrow);
  }
  arrow.className = content.getAttribute("arrow-class") ?? "";
}
```

Observe `arrow` and `arrow-class` in `hoverCardObservedAttributes`, call the helper during Content synchronization, and stop auto-update from `disconnectHoverCardRoot`.

- [ ] **Step 5: Verify GREEN and package build**

```bash
pnpm exec vitest run packages/hover-card/__test__/hover-card.test.ts -t "positions against|flips at|repositions while"
pnpm --filter @ariaui-web/hover-card test
pnpm --filter @ariaui-web/hover-card lint
pnpm --filter @ariaui-web/hover-card build
```

Expected: all commands PASS.

- [ ] **Step 6: Commit positioning and arrow support**

```bash
git add packages/hover-card/src/hover-card-position.ts packages/hover-card/src/hover-card-sync.ts packages/hover-card/src/hover-card-element.ts packages/hover-card/__test__/hover-card.test.ts
git commit -m "feat(hover-card): add viewport positioning"
```

### Task 5: Make runtime changes survive regeneration

**Files:**
- Modify: `scripts/generate-from-ariaui.mjs`
- Modify: `packages/hover-card/__test__/component.spec.test.ts`

- [ ] **Step 1: Add a failing generator-survival assertion**

Append to `component.spec.test.ts`:

```ts
it("keeps Hover Card behavior in preserved package-local modules", () => {
  const generator = readFileSync(join(process.cwd(), "scripts", "generate-from-ariaui.mjs"), "utf8");

  for (const file of [
    "src/hover-card-actions.ts",
    "src/hover-card-dom.ts",
    "src/hover-card-element.ts",
    "src/hover-card-position.ts",
    "src/hover-card-sync.ts",
    "__test__/hover-card.test.ts",
  ]) {
    expect(generator).toContain(`\"${file}\"`);
  }
  expect(generator).toContain("preservedGeneratedPackageSources.hoverCard");
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run packages/hover-card/__test__/component.spec.test.ts -t "preserved package-local"
```

Expected: FAIL because the generator only preserves Select package-local behavior.

- [ ] **Step 3: Preserve Hover Card runtime and tests in the generator**

In `main`, add a `hoverCard` entry beside `select`:

```js
hoverCard: preserveGeneratedSources(join(targetPackages, "hover-card"), [
  "src/hover-card-actions.ts",
  "src/hover-card-dom.ts",
  "src/hover-card-element.ts",
  "src/hover-card-position.ts",
  "src/hover-card-sync.ts",
  "__test__/hover-card.test.ts",
]),
```

At the top of `writeComponentPackage`, resolve:

```js
const preservedHoverCardSources = spec.slug === "hover-card"
  ? preservedGeneratedPackageSources.hoverCard ?? {}
  : {};
```

Change the element write to:

```js
write(
  join(packageRoot, "src", `${spec.slug}-element.ts`),
  preservedSelectSources["src/select-element.ts"]
    ?? preservedHoverCardSources["src/hover-card-element.ts"]
    ?? componentElementSource(spec),
);
```

After the Select block, add:

```js
if (spec.slug === "hover-card") {
  for (const filePath of [
    "src/hover-card-actions.ts",
    "src/hover-card-dom.ts",
    "src/hover-card-position.ts",
    "src/hover-card-sync.ts",
  ]) {
    const source = preservedHoverCardSources[filePath];
    if (source) write(join(packageRoot, filePath), source);
  }
}
```

Change the runtime test write to prefer:

```js
preservedSelectSources[`__test__/${name}.test.ts`]
  ?? preservedHoverCardSources[`__test__/${name}.test.ts`]
  ?? componentTestSource(spec)
```

- [ ] **Step 4: Verify the generator assertion GREEN**

```bash
pnpm exec vitest run packages/hover-card/__test__/component.spec.test.ts -t "preserved package-local"
```

Expected: PASS.

- [ ] **Step 5: Audit a full generator run in a disposable sibling worktree**

```bash
git add scripts/generate-from-ariaui.mjs packages/hover-card/__test__/component.spec.test.ts
git commit -m "build(hover-card): preserve native runtime generation"
git worktree add /home/neo/Projects/ariaui-web-hover-card-generator --detach HEAD
cd /home/neo/Projects/ariaui-web-hover-card-generator
node scripts/generate-from-ariaui.mjs
git diff -- packages/hover-card
pnpm install --offline --frozen-lockfile
pnpm exec vitest run packages/hover-card/__test__
```

Expected: the generator completes, the Hover Card diff contains no loss of the package-local runtime/tests, and the focused tests PASS. Review the full `git status --short` output to confirm unrelated generator drift is confined to this disposable worktree.

- [ ] **Step 6: Remove the disposable audit worktree and return to the feature worktree**

```bash
cd /home/neo/Projects/ariaui-web-hover-card
git worktree remove --force /home/neo/Projects/ariaui-web-hover-card-generator
```

Expected: the audit worktree is removed; the feature worktree remains clean after the Task 5 commit.

### Task 6: Replace the placeholder docs with the AriaUI page structure and examples

**Files:**
- Modify: `scripts/generate-from-ariaui.mjs`
- Modify: `web/doc/docs/components/hover-card.md`
- Modify: `web/doc/docs/.vitepress/theme/style.css`
- Modify: `web/doc/__test__/docs.test.ts`

- [ ] **Step 1: Add failing page structure and example assertions**

Add to `docs.test.ts`:

```ts
it("keeps the Hover Card docs structured like the source AriaUI page", () => {
  const doc = readDoc("components/hover-card.md");
  expect(doc).toContain("# Hover Card");
  expect(doc).toContain("A headless, accessible hover card for showing rich preview content when a trigger is hovered or focused.");
  expectHeadingsInOrder(doc, [
    "## Features",
    "## Installation",
    "## Examples",
    "## Anatomy",
    "## API Reference",
    "## Keyboard",
    "## Accessibility",
  ]);
  expectHeadingsInOrder(doc, ["### Hover Card", "### Framer Motion"]);
  expect(doc).toContain("@nextjs");
  expect(doc).toContain("The React Framework - created and maintained by @vercel.");
  expect(doc).toContain("Joined December 2024");
  expect(doc).toContain("<aria-hover-card");
  expect(doc).toContain("<aria-hover-card-trigger");
  expect(doc).toContain("<aria-hover-card-content");
  expect(doc).toContain("<aria-avatar");
  expect(doc).not.toContain('data-example-part="Root">Root</aria-hover-card>');
});

it("keeps Hover Card examples source-styled and token backed", () => {
  const doc = readDoc("components/hover-card.md");
  const style = readDoc(".vitepress/theme/style.css");
  expect(doc.match(/data-component="hover-card"/g)).toHaveLength(2);
  expect(doc).toContain('data-example-variant="default"');
  expect(doc).toContain('data-example-variant="framer-motion"');
  expect(doc).toContain("w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md");
  expect(style).toContain('.ariaui-web-preview[data-component="hover-card"]');
  expect(style).toContain("var(--vp-c-bg)");
  expect(style).toContain("var(--vp-c-divider)");
  expect(style).toContain("var(--vp-c-text-1)");
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Hover Card docs|Hover Card examples"
```

Expected: FAIL against the generic Web Component Contract placeholder page.

- [ ] **Step 3: Add source-equivalent markup generators**

In `scripts/generate-from-ariaui.mjs`, add constants for the trigger, content, avatar, fallback, icon, and layout classes, then add:

```js
function hoverCardExampleMarkup(motion = false) {
  const calendarIcon = `<svg aria-hidden="true" class="size-4 shrink-0 text-muted-foreground ariaui-web-hover-card-calendar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A2.25 2.25 0 0 1 20.25 7.5v11.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 6 5.25Z"></path></svg>`;
  return `<aria-hover-card${motion ? ' data-hover-card-motion=""' : ""}>
    <aria-hover-card-trigger class="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-brand ariaui-web-hover-card-trigger">@nextjs</aria-hover-card-trigger>
    <aria-hover-card-content class="z-50 w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md ariaui-web-hover-card-content">
      <div class="flex gap-4 ariaui-web-hover-card-layout">
        <aria-avatar class="size-12 shrink-0 overflow-hidden rounded-full bg-muted ariaui-web-hover-card-avatar">
          <aria-avatar-image src="https://www.figma.com/api/mcp/asset/985bb6f4-c0df-4534-b789-c0d135a0fc51" alt=""></aria-avatar-image>
          <aria-avatar-fallback class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">NX</aria-avatar-fallback>
        </aria-avatar>
        <div class="flex min-w-0 flex-1 flex-col gap-1 ariaui-web-hover-card-copy">
          <h4 class="text-sm font-semibold text-popover-foreground">@nextjs</h4>
          <p class="text-sm leading-5 text-popover-foreground">The React Framework - created and maintained by @vercel.</p>
          <div class="flex items-center gap-2 pt-2 ariaui-web-hover-card-meta">${calendarIcon}<span class="text-xs text-muted-foreground">Joined December 2024</span></div>
        </div>
      </div>
    </aria-hover-card-content>
  </aria-hover-card>`;
}

function hoverCardExampleSection(title, variant, motion = false) {
  const markup = hoverCardExampleMarkup(motion);
  return `### ${title}

<div class="ariaui-web-preview flex min-h-[260px] w-full items-center justify-center px-6 py-10" data-component="hover-card" data-example-variant="${variant}">
  ${markup}
</div>

\`\`\`html
${markup}
\`\`\``;
}
```

- [ ] **Step 4: Add the complete Hover Card page generator**

Add this complete generator:

```js
function hoverCardComponentDocPage(spec) {
  return `# Hover Card

A headless, accessible hover card for showing rich preview content when a trigger is hovered or focused.

## Features

- Opens on pointer hover and keyboard focus of the trigger.
- Closes on pointer leave, blur, or \`Escape\`.
- Content uses the browser top layer and viewport-aware collision placement.
- Configurable placement, offset, and optional arrow pointer.
- Supports uncontrolled state, \`default-open\`, and cancelable \`openchange\` control.
- Works with arbitrary preview content.

${nativeInstallationSection(spec)}

## Examples

The live examples below use the browser-native \`@ariaui-web/hover-card\` elements while matching the source AriaUI examples.

${hoverCardExampleSection("Hover Card", "default")}

${hoverCardExampleSection("Framer Motion", "framer-motion", true)}

## Anatomy

\`\`\`html
<aria-hover-card>
  <aria-hover-card-trigger>@nextjs</aria-hover-card-trigger>
  <aria-hover-card-content>Preview content</aria-hover-card-content>
</aria-hover-card>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}

## API Reference

The package-level native contract lives in \`packages/hover-card/readme.md\`.

### Root

- Element: \`aria-hover-card\`.
- \`open\`: current boolean open state.
- \`default-open\`: uncontrolled initial open state.
- \`placement\`: preferred top, right, bottom, left, or start/end placement; defaults to \`bottom\`.
- \`offset\`: trigger-to-content distance in CSS pixels; defaults to \`8\`.
- \`openchange\`: bubbling, cancelable request event with \`{ open, source }\` detail.

### Trigger

- Element: \`aria-hover-card-trigger\`.
- Opens on pointer hover and focus.
- Reflects \`aria-expanded\` and is associated with Content.

### Content

- Element: \`aria-hover-card-content\`.
- Uses \`role="tooltip"\`, browser top-layer behavior, and viewport-aware fixed positioning.
- \`arrow\`: renders the optional arrow marker.
- \`arrow-class\`: applies classes to the arrow marker.
- Reflects resolved placement through \`data-side\` and \`data-align\`.

## Keyboard

| Key | Action |
| --- | --- |
| \`Tab\` | Move focus to Trigger and open the Hover Card. |
| \`Shift + Tab\` | Move focus away and close the Hover Card. |
| \`Escape\` | Close the open Hover Card. |

## Accessibility

Hover Card complements but does not replace primary navigation or required information. Preview content must remain available through another route.

- Trigger exposes browser-native button-like semantics and keyboard focus parity.
- Content uses \`role="tooltip"\` and stable Trigger association.
- Pointer users can move from Trigger into Content without losing the preview.
- Do not put required interactive controls inside Content; use Popover or Dialog for keyboard-reachable controls.
`;
}
```

Add this branch before the generic fallback in `componentDocPage`:

```js
if (spec.slug === "hover-card") {
  return hoverCardComponentDocPage(spec);
}
```

Write the exact returned Markdown into `web/doc/docs/components/hover-card.md` without invoking the full generator in the feature worktree.

- [ ] **Step 5: Add token-backed VitePress styles**

Append these scoped rules to `style.css`, expanding the utility translation only inside Hover Card previews:

```css
.ariaui-web-preview[data-component="hover-card"] {
  min-height: 260px;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.ariaui-web-preview[data-component="hover-card"] .ariaui-web-hover-card-trigger {
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--vp-c-text-1);
  padding: 0.5rem 0.75rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: default;
}

.ariaui-web-preview[data-component="hover-card"] .ariaui-web-hover-card-content {
  z-index: 50;
  width: 20rem;
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 1rem;
  font-size: 0.875rem;
  box-shadow: var(--vp-shadow-3);
}

.ariaui-web-hover-card-layout { display: flex; gap: 1rem; }
.ariaui-web-hover-card-avatar { position: relative; display: block; width: 3rem; height: 3rem; flex: none; border-radius: 9999px; overflow: hidden; }
.ariaui-web-hover-card-copy { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 0.25rem; }
.ariaui-web-hover-card-copy h4, .ariaui-web-hover-card-copy p { margin: 0; color: var(--vp-c-text-1); }
.ariaui-web-hover-card-meta { display: flex; align-items: center; gap: 0.5rem; padding-top: 0.5rem; color: var(--vp-c-text-2); }
.ariaui-web-hover-card-calendar { width: 1rem; height: 1rem; flex: none; }
```

- [ ] **Step 6: Verify GREEN and commit the static page**

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Hover Card docs|Hover Card examples"
pnpm --dir web/doc lint
git add scripts/generate-from-ariaui.mjs web/doc/docs/components/hover-card.md web/doc/docs/.vitepress/theme/style.css web/doc/__test__/docs.test.ts
git commit -m "docs(hover-card): match source page structure"
```

Expected: tests and lint PASS; commit contains no Pagination files.

### Task 7: Add documentation-only Framer Motion behavior

**Files:**
- Create: `web/doc/docs/.vitepress/theme/hover-card-examples.ts`
- Create: `web/doc/__test__/hover-card-examples.test.ts`
- Modify: `web/doc/docs/.vitepress/theme/index.ts`
- Modify: `web/doc/package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `scripts/generate-from-ariaui.mjs`

- [ ] **Step 1: Add a failing dependency-boundary test**

Create `hover-card-examples.test.ts` with:

```ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (...segments: string[]) => readFileSync(join(root, ...segments), "utf8");

describe("Hover Card docs examples", () => {
  it("keeps Framer Motion in docs and out of the package", () => {
    const docsPackage = JSON.parse(read("web", "doc", "package.json"));
    const hoverPackage = JSON.parse(read("packages", "hover-card", "package.json"));
    const installerPath = join(root, "web", "doc", "docs", ".vitepress", "theme", "hover-card-examples.ts");

    expect(docsPackage.dependencies["framer-motion"]).toBe("^12.38.0");
    expect(hoverPackage.dependencies?.["framer-motion"]).toBeUndefined();
    expect(existsSync(installerPath)).toBe(true);
    expect(readFileSync(installerPath, "utf8")).toContain('from "framer-motion/dom"');
    expect(read("packages", "hover-card", "src", "hover-card-element.ts")).not.toContain("framer-motion");
  });
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run web/doc/__test__/hover-card-examples.test.ts
```

Expected: FAIL because docs have no Framer Motion dependency or installer.

- [ ] **Step 3: Add the docs-only dependency and generator package rule**

Add to `docsPackageJson(packageNames)`:

```js
"framer-motion": "^12.38.0",
```

Add the same entry under `dependencies` in `web/doc/package.json`, then update the lockfile:

```bash
pnpm install --lockfile-only
```

Expected: `pnpm-lock.yaml` resolves Framer Motion and its DOM packages; `packages/hover-card/package.json` remains unchanged.

- [ ] **Step 4: Create the Framer Motion DOM installer**

Create `hover-card-examples.ts`:

```ts
import { animate } from "framer-motion/dom";

type HoverCardRoot = HTMLElement & { open: boolean };
type OpenChangeEvent = CustomEvent<{ open: boolean; source: Element }>;
const installedDocuments = new WeakSet<Document>();

function reducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function bindMotionRoot(root: HoverCardRoot) {
  if (root.dataset.hoverCardMotionBound === "true") return;
  root.dataset.hoverCardMotionBound = "true";
  root.addEventListener("openchange", (event) => {
    const change = event as OpenChangeEvent;
    const content = root.querySelector<HTMLElement>("aria-hover-card-content");
    if (!content) return;
    event.preventDefault();

    if (change.detail.open) {
      root.open = true;
      content.style.pointerEvents = "";
      if (reducedMotion()) return;
      animate(content, { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] }, { duration: 0.18, ease: "easeOut" });
      return;
    }

    content.style.pointerEvents = "none";
    if (reducedMotion()) {
      root.open = false;
      return;
    }
    void animate(content, { opacity: [1, 0], y: [0, 8], scale: [1, 0.96] }, { duration: 0.18, ease: "easeOut" })
      .then(() => {
        root.open = false;
        content.style.pointerEvents = "";
      });
  });
}

function bindExamples(doc: Document) {
  for (const root of doc.querySelectorAll<HoverCardRoot>('[data-component="hover-card"][data-example-variant="framer-motion"] aria-hover-card[data-hover-card-motion]')) {
    bindMotionRoot(root);
  }
}

export function installHoverCardExamples(doc: Document = document) {
  bindExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  const observer = new MutationObserver(() => bindExamples(doc));
  observer.observe(doc.documentElement, { childList: true, subtree: true });
}
```

- [ ] **Step 5: Preserve and install the theme module through generation**

Add these two paths to the `preserveGeneratedSources(docsRoot, [...])` list in `writeDocs`:

```js
"docs/.vitepress/theme/hover-card-examples.ts",
"__test__/hover-card-examples.test.ts",
```

Immediately after `resetDir(docsRoot)`, require the canonical sources to exist:

```js
const hoverCardExamplesSource = preservedDocsSources["docs/.vitepress/theme/hover-card-examples.ts"];
const hoverCardExamplesTestSource = preservedDocsSources["__test__/hover-card-examples.test.ts"];
if (!hoverCardExamplesSource || !hoverCardExamplesTestSource) {
  throw new Error("Hover Card docs examples and tests must exist before regeneration.");
}
```

Write them after the reset:

```js
write(join(docsRoot, "docs", ".vitepress", "theme", "hover-card-examples.ts"), hoverCardExamplesSource);
write(join(docsRoot, "__test__", "hover-card-examples.test.ts"), hoverCardExamplesTestSource);
```

Update `docsTheme` and the real `theme/index.ts` with:

```ts
import { installHoverCardExamples } from "./hover-card-examples";
```

and call:

```ts
installHoverCardExamples();
```

after custom-element definitions. This follows the repository's existing preservation pattern for complex browser example modules while keeping the generated theme entry point deterministic.

- [ ] **Step 6: Verify the dependency boundary GREEN**

```bash
pnpm exec vitest run web/doc/__test__/hover-card-examples.test.ts -t "keeps Framer Motion"
```

Expected: PASS.

- [ ] **Step 7: Add a failing motion interaction test**

At the top of `hover-card-examples.test.ts`, add:

```ts
import { afterEach, vi } from "vitest";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));
```

Import `defineHoverCardElements` and `installHoverCardExamples`, then append:

```ts
it("uses Framer Motion for controlled entry and exit", async () => {
  animateMock.mockReturnValue({ then: (resolve: () => void) => Promise.resolve().then(resolve) });
  defineHoverCardElements();
  document.body.innerHTML = `<div data-component="hover-card" data-example-variant="framer-motion">
    <aria-hover-card data-hover-card-motion>
      <aria-hover-card-trigger>Hover me</aria-hover-card-trigger>
      <aria-hover-card-content>Card content</aria-hover-card-content>
    </aria-hover-card>
  </div>`;
  installHoverCardExamples(document);
  const root = document.querySelector("aria-hover-card") as HTMLElement & { open: boolean };
  const trigger = document.querySelector("aria-hover-card-trigger") as HTMLElement;
  const content = document.querySelector("aria-hover-card-content") as HTMLElement;

  trigger.dispatchEvent(new MouseEvent("mouseenter"));
  expect(root.open).toBe(true);
  expect(animateMock).toHaveBeenLastCalledWith(
    content,
    { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
    { duration: 0.18, ease: "easeOut" },
  );

  trigger.dispatchEvent(new MouseEvent("mouseleave"));
  await Promise.resolve();
  await Promise.resolve();
  expect(animateMock).toHaveBeenLastCalledWith(
    content,
    { opacity: [1, 0], y: [0, 8], scale: [1, 0.96] },
    { duration: 0.18, ease: "easeOut" },
  );
  expect(root.open).toBe(false);
});
```

Reset `document.body`, mocks, and the `matchMedia` stub in `afterEach`.

- [ ] **Step 8: Run the motion test and fix only implementation defects**

```bash
pnpm exec vitest run web/doc/__test__/hover-card-examples.test.ts -t "controlled entry and exit"
```

Expected: PASS after the installer from Step 4 is wired. If the first run exposes a timing mismatch, adjust the installer promise handling rather than weakening the state or animation assertions.

- [ ] **Step 9: Commit the documentation-only motion example**

```bash
git add scripts/generate-from-ariaui.mjs web/doc/package.json pnpm-lock.yaml web/doc/docs/.vitepress/theme/hover-card-examples.ts web/doc/docs/.vitepress/theme/index.ts web/doc/__test__/hover-card-examples.test.ts
git commit -m "docs(hover-card): add Framer Motion example"
```

### Task 8: Run automated verification and source-drift audit

**Files:**
- Verify: all Hover Card and docs files from Tasks 1-7

- [ ] **Step 1: Confirm Framer Motion remains documentation-only**

```bash
git grep -n "framer-motion" -- packages/hover-card web/doc/package.json web/doc/docs/.vitepress/theme/hover-card-examples.ts
```

Expected: matches only in `web/doc/package.json` and the Hover Card docs installer; no match under `packages/hover-card`.

- [ ] **Step 2: Run focused tests**

```bash
pnpm --filter @ariaui-web/hover-card test
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Hover Card"
pnpm exec vitest run web/doc/__test__/hover-card-examples.test.ts
```

Expected: PASS.

- [ ] **Step 3: Run type checks and builds**

```bash
pnpm --filter @ariaui-web/hover-card lint
pnpm --filter @ariaui-web/hover-card build
pnpm --dir web/doc lint
pnpm --dir web/doc build
```

Expected: PASS with no TypeScript or VitePress errors.

- [ ] **Step 4: Run the broader repository tests**

```bash
pnpm test
```

Expected: PASS. Any failure outside Hover Card must be compared with the clean main baseline before being attributed to this branch.

- [ ] **Step 5: Check formatting, diff scope, and source drift**

```bash
pnpm exec prettier --check packages/hover-card scripts/generate-from-ariaui.mjs web/doc/docs/components/hover-card.md web/doc/docs/.vitepress/theme/hover-card-examples.ts web/doc/__test__/hover-card-examples.test.ts
git diff --check main...HEAD
git diff --name-only main...HEAD
git -C /home/neo/Projects/ariaui status --short -- packages/hover-card web/doc/src/app/docs/components/hover-card web/doc/src/components/hover-card web/doc/src/markdoc/partials/hover-card
```

Expected: formatting and whitespace checks PASS; changed paths are limited to this plan, Hover Card, generator, docs theme/tests, and dependency lockfile; the source-path status command is empty. Re-read the AriaUI source files listed in the design spec and compare `git -C /home/neo/Projects/ariaui rev-parse HEAD` with design-time source commit `f82e6ceb` before confirming no newer source change invalidates the implemented parity.

- [ ] **Step 6: Re-audit complete package and docs regeneration**

```bash
git worktree add /home/neo/Projects/ariaui-web-hover-card-final-generator --detach HEAD
cd /home/neo/Projects/ariaui-web-hover-card-final-generator
node scripts/generate-from-ariaui.mjs
git diff -- packages/hover-card web/doc/docs/components/hover-card.md web/doc/docs/.vitepress/theme/hover-card-examples.ts web/doc/docs/.vitepress/theme/index.ts web/doc/package.json
pnpm install --offline --frozen-lockfile
pnpm exec vitest run packages/hover-card/__test__ web/doc/__test__/docs.test.ts web/doc/__test__/hover-card-examples.test.ts
cd /home/neo/Projects/ariaui-web-hover-card
git worktree remove --force /home/neo/Projects/ariaui-web-hover-card-final-generator
```

Expected: generation does not remove or regress Hover Card runtime, page, theme installer, dependency boundary, or tests; the focused generated checks PASS; the disposable worktree is removed.

### Task 9: Launch browser and visual verification

**Files:**
- Verify: `web/doc/docs/components/hover-card.md`
- Verify: `web/doc/docs/.vitepress/theme/style.css`
- Verify: `web/doc/docs/.vitepress/theme/hover-card-examples.ts`

- [ ] **Step 1: Invoke the browser visual-testing skill and start both docs servers**

Invoke `browse` or `playwright-visual-testing` before browser actions. Start ariaui-web:

```bash
pnpm --dir web/doc dev --host 127.0.0.1 --port 4173
```

Start AriaUI in a second terminal:

```bash
pnpm --dir /home/neo/Projects/ariaui/web/doc dev --hostname 127.0.0.1 --port 4174
```

Expected routes:

- `http://127.0.0.1:4173/components/hover-card`
- `http://127.0.0.1:4174/docs/components/hover-card`

- [ ] **Step 2: Verify page structure and default interaction at desktop width**

At `1440x1000`, capture full-page screenshots of both routes. On ariaui-web, hover `@nextjs`, move the pointer into Content, move out, focus the trigger with Tab, and press Escape.

Expected:

- Sections occur in the same order as AriaUI.
- The two previews have matching minimum height and centered trigger.
- Content matches the source width, spacing, border, radius, background, shadow, typography, avatar, icon, and metadata.
- Trigger-to-Content pointer movement does not close the card.
- Tab opens and Escape closes the card.
- Content is not clipped by the preview or page container.

- [ ] **Step 3: Verify the Framer Motion variant**

Record or capture the motion variant before hover, shortly after pointer enter, at its open state, shortly after pointer leave, and after exit completion.

Expected: opacity, `8px` vertical movement, and `0.96` scale animate over `0.18s` with ease-out; Content remains mounted and non-interactive through exit, then closes. The default example has no Framer Motion animation listener.

- [ ] **Step 4: Verify mobile, dark mode, and scroll repositioning**

Repeat at `390x844`, then in dark mode. Open a card, scroll the page while it remains open, and capture the result.

Expected: no horizontal overflow, card remains within the viewport, token-backed colors match each theme, placement updates during scroll, and avatar/icon/text remain aligned.

- [ ] **Step 5: Record visual evidence and commit deterministic corrections**

If browser verification reveals a deterministic source-parity defect, first add a focused DOM/style assertion that fails for that defect, then make the smallest scoped package or Hover Card CSS correction and rerun the affected automated and browser checks. Commit verified corrections with:

```bash
git add packages/hover-card web/doc/docs/components/hover-card.md web/doc/docs/.vitepress/theme/hover-card-examples.ts web/doc/docs/.vitepress/theme/style.css web/doc/__test__
git commit -m "fix(hover-card-docs): align visual parity"
```

If no correction is needed, do not create an empty commit.

### Task 10: Final verification and branch handoff

**Files:**
- Verify: complete feature branch diff

- [ ] **Step 1: Invoke verification-before-completion and rerun final commands**

Invoke `superpowers:verification-before-completion`, then run:

```bash
pnpm --filter @ariaui-web/hover-card test
pnpm --filter @ariaui-web/hover-card lint
pnpm --filter @ariaui-web/hover-card build
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Hover Card"
pnpm exec vitest run web/doc/__test__/hover-card-examples.test.ts
pnpm --dir web/doc lint
pnpm --dir web/doc build
git diff --check main...HEAD
git status --short
```

Expected: every command PASS and the feature worktree is clean.

- [ ] **Step 2: Review the final branch diff**

Invoke `superpowers:requesting-code-review`, inspect `git diff --stat main...HEAD` and `git diff main...HEAD`, and resolve every correctness, accessibility, dependency-boundary, generator-survival, or visual-parity finding before handoff.

- [ ] **Step 3: Integrate without overwriting the active Pagination work**

Invoke `superpowers:finishing-a-development-branch`. Recheck `/home/neo/Projects/ariaui-web` before choosing merge or cherry-pick. If its Pagination changes are still uncommitted and overlap `web/doc/__test__/docs.test.ts`, `theme/index.ts`, or `style.css`, leave the completed Hover Card branch and worktree intact and report the exact integration blocker instead of overwriting those files.

Expected: the Hover Card branch is complete and reviewable, with a safe integration choice based on the then-current shared worktree state.
