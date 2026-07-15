# Popover Source Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `@ariaui-web/popover` into a browser-native implementation of the sibling AriaUI Popover contract, then replace its placeholder documentation with source-structured live examples whose motion variant uses Framer Motion only in `web/doc`.

**Architecture:** Keep the public Root, Trigger, Content, Heading, Description, and Close custom elements. Split package behavior into DOM association, state synchronization, actions, focus, and positioning modules coordinated by `PopoverWebElement`; use the HTML Popover API as the top-layer path with a fixed-position fallback. Keep Framer Motion out of the package and import its DOM API only from a VitePress Popover example installer.

**Tech Stack:** TypeScript, browser Custom Elements, HTML Popover API, `@ariaui-web/position`, Vitest with jsdom, VitePress, Framer Motion 12.38, Playwright/browser visual QA, pnpm, graphify.

---

## File Map

- Create `packages/popover/__test__/popover.behavior.test.ts`: source-test-parity behavior coverage using real registered custom elements.
- Create `packages/popover/src/popover-dom.ts`: part lookup, native-composition hosts, ids, attribute parsing, and tabbable discovery.
- Create `packages/popover/src/popover-actions.ts`: cancelable state requests, trigger/close activation, outside dismissal, and Escape dismissal.
- Create `packages/popover/src/popover-focus.ts`: initial focus, loop/trap behavior, modal inert state, and cleanup.
- Create `packages/popover/src/popover-position.ts`: viewport positioning, collision flipping, arrow side reflection, and automatic updates.
- Create `packages/popover/src/popover-sync.ts`: default/open state, ARIA, labels, arrow lifecycle, top-layer/fallback visibility, and lifecycle coordination.
- Modify `packages/popover/src/popover-element.ts`: connect the focused modules to Custom Element lifecycle.
- Modify `packages/popover/src/component-spec.ts`: generated native role, requirement, and source-test parity contract.
- Modify `packages/popover/readme.md`: generated package contract synchronized with `componentSpec`.
- Modify `packages/popover/package.json`: add only `@ariaui-web/position` to runtime dependencies.
- Modify `packages/popover/__test__/component.spec.test.ts`: lock source-test parity and corrected roles.
- Modify `scripts/generate-from-ariaui.mjs`: make all Popover package/docs changes reproducible without overwriting hand-maintained runtime files.
- Modify `web/doc/docs/components/popover.md`: source-structured page, both complete examples, anatomy, API, keyboard, and accessibility.
- Create `web/doc/docs/.vitepress/theme/popover-examples.ts`: docs-only Framer Motion installer.
- Modify `web/doc/docs/.vitepress/theme/index.ts`: install Popover examples while preserving Pagination changes.
- Modify `web/doc/docs/.vitepress/theme/style.css`: token-backed Popover layout and states while preserving Pagination changes.
- Modify `web/doc/__test__/docs.test.ts`: page structure, markup, interaction, style, and dependency-boundary tests while preserving Pagination changes.
- Modify `web/doc/package.json` and `pnpm-lock.yaml`: add `framer-motion@^12.38.0` to docs only.

## Shared Workspace Guard

The following existing changes belong to another task and must never be reverted, overwritten, staged, or committed with Popover work:

```text
packages/pagination/readme.md
packages/pagination/src/component-spec.ts
packages/pagination/src/pagination-element.ts
packages/pagination/src/pagination-actions.ts
packages/pagination/src/pagination-items.ts
packages/pagination/src/pagination-sync.ts
web/doc/docs/components/pagination.md
web/doc/docs/.vitepress/theme/pagination-examples.ts
web/doc/docs/.vitepress/theme/index.ts
web/doc/docs/.vitepress/theme/style.css
web/doc/__test__/docs.test.ts
```

Before every commit, run `git diff --cached --name-only` and verify that only files named by that task are staged. Shared docs files must be edited with focused patches around their existing Pagination changes.

### Task 1: Correct the generated Popover contract

**Files:**
- Modify: `packages/popover/__test__/component.spec.test.ts`
- Modify: `packages/popover/src/component-spec.ts`
- Modify: `packages/popover/readme.md`
- Modify: `packages/popover/package.json`

- [ ] **Step 1: Add failing source-parity and role assertions**

Append this test to `packages/popover/__test__/component.spec.test.ts`:

```ts
it("records the source Popover test contract and native semantic roles", () => {
  expect(componentSpec.sourceTestParity.learningSources).toEqual([
    "../ariaui/packages/popover/__test__/popover.test.tsx",
  ]);
  expect(componentSpec.sourceTestParity.sourceTestCases).toBe(23);
  expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
    "controlled and uncontrolled open state",
    "viewport-aware floating placement and flipping",
    "default focus looping and optional modal focus trapping",
    "docs-only Framer Motion composition",
  ]));

  const parts = Object.fromEntries(componentSpec.parts.map((part) => [part.name, part]));
  expect(parts.Root?.defaultRole).toBeNull();
  expect(parts.Trigger?.defaultRole).toBe("button");
  expect(parts.Trigger?.defaultAttributes).toMatchObject({
    "aria-expanded": "false",
    "aria-haspopup": "dialog",
  });
  expect(parts.Content?.defaultRole).toBe("dialog");
  expect(parts.Heading?.defaultRole).toBe("heading");
  expect(parts.Heading?.defaultAttributes).toMatchObject({ "aria-level": "2" });
  expect(parts.Description?.defaultRole).toBeNull();
  expect(parts.Close?.defaultRole).toBe("button");
  expect(parts.Close?.defaultAttributes).not.toHaveProperty("aria-haspopup");
  expect(parts.Close?.defaultAttributes).not.toHaveProperty("aria-expanded");
});
```

- [ ] **Step 2: Run the focused spec test and verify RED**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/component.spec.test.ts
```

Expected: FAIL because `sourceTestParity` is absent, Content is `region`, Description is `note`, and Trigger currently reports `aria-haspopup="listbox"`.

- [ ] **Step 3: Apply the minimal generated contract correction**

Update the affected entries in `packages/popover/src/component-spec.ts` to this semantic shape and add the parity block after `learnedRequirements`:

```ts
{
  name: "Root",
  tagName: "aria-popover",
  defaultRole: null,
  defaultAttributes: {},
},
{
  name: "Close",
  tagName: "aria-popover-close",
  defaultRole: "button",
  defaultAttributes: {},
},
{
  name: "Content",
  tagName: "aria-popover-content",
  defaultRole: "dialog",
  defaultAttributes: {},
},
{
  name: "Description",
  tagName: "aria-popover-description",
  defaultRole: null,
  defaultAttributes: {},
},
{
  name: "Heading",
  tagName: "aria-popover-heading",
  defaultRole: "heading",
  defaultAttributes: { "aria-level": "2" },
},
{
  name: "Trigger",
  tagName: "aria-popover-trigger",
  defaultRole: "button",
  defaultAttributes: {
    "aria-expanded": "false",
    "aria-haspopup": "dialog",
  },
},
sourceTestParity: {
  learningSources: [
    "../ariaui/packages/popover/__test__/popover.test.tsx",
  ],
  sourceTestCases: 23,
  nativeRequirements: [
    "controlled and uncontrolled open state",
    "trigger click, Enter, and Space activation with disabled guards",
    "dialog ARIA state plus heading and description labelling",
    "outside mouse, Escape, and Close dismissal with focus restoration",
    "optional arrow and native-composition hosts",
    "viewport-aware floating placement and flipping",
    "default focus looping and optional modal focus trapping",
    "docs-only Framer Motion composition",
  ],
},
```

Regenerate the Parts and source-test-parity sections in `packages/popover/readme.md` from the same values. Add `"@ariaui-web/position": "workspace:*"` beside the existing utils dependency in `packages/popover/package.json`; do not add animation or framework dependencies.

- [ ] **Step 4: Run the focused spec test and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/component.spec.test.ts
```

Expected: PASS with both component-spec tests green.

- [ ] **Step 5: Commit only the contract slice**

```bash
git add packages/popover/__test__/component.spec.test.ts packages/popover/src/component-spec.ts packages/popover/readme.md packages/popover/package.json
git diff --cached --check
git diff --cached --name-only
git commit -m "test(popover): sync native source contract"
```

### Task 2: Implement native open state and ARIA synchronization

**Files:**
- Create: `packages/popover/__test__/popover.behavior.test.ts`
- Create: `packages/popover/src/popover-dom.ts`
- Create: `packages/popover/src/popover-sync.ts`
- Modify: `packages/popover/src/popover-element.ts`

- [ ] **Step 1: Write failing open-state and labelling tests**

Create `packages/popover/__test__/popover.behavior.test.ts` with this fixture and first test group:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { definePopoverElements } from "../src";

type RuntimePopoverElement = HTMLElement & {
  disabled: boolean;
  open: boolean;
  syncPopoverTreeFromRoot: () => void;
};

function fixture(rootAttributes = "") {
  definePopoverElements();
  const host = document.createElement("div");
  host.innerHTML = `
    <aria-popover ${rootAttributes}>
      <aria-popover-trigger>Dimensions</aria-popover-trigger>
      <aria-popover-content>
        <aria-popover-heading>Dimensions</aria-popover-heading>
        <aria-popover-description>Set the dimensions for the layer.</aria-popover-description>
        <input aria-label="Width" />
        <aria-popover-close aria-label="Close">Close</aria-popover-close>
      </aria-popover-content>
    </aria-popover>`;
  document.body.append(host);

  const root = host.querySelector("aria-popover") as RuntimePopoverElement;
  const trigger = host.querySelector("aria-popover-trigger") as RuntimePopoverElement;
  const content = host.querySelector("aria-popover-content") as RuntimePopoverElement;
  const heading = host.querySelector("aria-popover-heading") as RuntimePopoverElement;
  const description = host.querySelector("aria-popover-description") as RuntimePopoverElement;
  const close = host.querySelector("aria-popover-close") as RuntimePopoverElement;

  return { close, content, description, heading, host, root, trigger };
}

async function flushMicrotasks() {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
}

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0));
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("@ariaui-web/popover native state", () => {
  it("starts closed and synchronizes direct and default open state", async () => {
    const closed = fixture();
    expect(closed.root.open).toBe(false);
    expect(closed.trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("false");
    expect(closed.trigger.hasAttribute("aria-controls")).toBe(false);
    expect(closed.content.hidden).toBe(true);

    closed.root.open = true;
    await flushMicrotasks();
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("true");
    expect(closed.trigger.getAttribute("aria-controls")).toBe(closed.content.id);
    expect(closed.content.hidden).toBe(false);
    expect(closed.content.getAttribute("role")).toBe("dialog");
    expect(closed.content.getAttribute("aria-modal")).toBe("false");

    closed.host.remove();
    const opened = fixture("default-open");
    await flushMicrotasks();
    expect(opened.root.open).toBe(true);
    expect(opened.content.hidden).toBe(false);
  });

  it("connects heading and description ids to Content", () => {
    const { content, description, heading, root } = fixture("open");
    expect(heading.id).not.toBe("");
    expect(description.id).not.toBe("");
    expect(content.getAttribute("aria-labelledby")).toBe(heading.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(root.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("data-state")).toBe("open");
  });

  it("updates labelling when Heading and Description descendants change", async () => {
    const { content, description, heading } = fixture("open");
    heading.remove();
    description.remove();
    await flushMicrotasks();
    expect(content.hasAttribute("aria-labelledby")).toBe(false);
    expect(content.hasAttribute("aria-describedby")).toBe(false);
    const replacement = document.createElement("aria-popover-heading");
    replacement.id = "replacement-heading";
    replacement.textContent = "Replacement";
    content.prepend(replacement);
    await flushMicrotasks();
    expect(content.getAttribute("aria-labelledby")).toBe("replacement-heading");
  });
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/popover.behavior.test.ts
```

Expected: FAIL because default state, Content visibility, Root-to-part synchronization, and labelling are not implemented.

- [ ] **Step 3: Create the DOM contract helpers**

Create `packages/popover/src/popover-dom.ts`:

```ts
export type PopoverRootElement = HTMLElement & {
  open: boolean;
  syncPopoverTreeFromRoot: () => void;
};

let popoverId = 0;

export function popoverPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function popoverRoot(element: Element) {
  return element.matches("aria-popover") ? element : element.closest("aria-popover");
}

export function popoverElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.closest("aria-popover") === root,
  );
}

export function popoverTrigger(root: Element) {
  return popoverElements(root, "aria-popover-trigger")[0] ?? null;
}

export function popoverContent(root: Element) {
  return popoverElements(root, "aria-popover-content")[0] ?? null;
}

export function popoverContentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) return content;
  return Array.from(content.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute("data-popover-arrow"),
  ) ?? content;
}

export function popoverHeadingHosts(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("aria-popover-heading"))
    .filter((heading) => heading.closest("aria-popover-content") === content)
    .map((heading) => heading.hasAttribute("native-composition") && heading.firstElementChild instanceof HTMLElement
      ? heading.firstElementChild
      : heading);
}

export function popoverDescriptionHosts(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("aria-popover-description"))
    .filter((description) => description.closest("aria-popover-content") === content)
    .map((description) => description.hasAttribute("native-composition") && description.firstElementChild instanceof HTMLElement
      ? description.firstElementChild
      : description);
}

export function ensurePopoverId(element: HTMLElement, part: string) {
  if (!element.id) element.id = `ariaui-popover-${part}-${++popoverId}`;
  return element.id;
}

export function booleanAttribute(element: Element, name: string, fallback: boolean) {
  const value = element.getAttribute(name);
  return value == null ? fallback : value !== "false";
}

export function popoverPlacement(root: Element) {
  return root.getAttribute("placement") ?? "bottom";
}

export function popoverOffset(root: Element) {
  const value = Number(root.getAttribute("offset") ?? "10");
  return Number.isFinite(value) ? value : 10;
}

export function popoverTabbables(container: Element) {
  return Array.from(container.querySelectorAll<HTMLElement>(
    "button, [href], input, select, textarea, aria-popover-close, [tabindex]:not([tabindex='-1'])",
  )).filter((element) => !element.hidden && !element.hasAttribute("disabled") && !("disabled" in element && Boolean((element as HTMLButtonElement).disabled)));
}
```

- [ ] **Step 4: Implement minimal state synchronization**

Create `packages/popover/src/popover-sync.ts`:

```ts
import {
  ensurePopoverId,
  popoverContent,
  popoverContentHost,
  popoverDescriptionHosts,
  popoverHeadingHosts,
  popoverRoot,
  popoverTrigger,
  type PopoverRootElement,
} from "./popover-dom";

type PopoverSyncState = {
  defaultOpenApplied: boolean;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, PopoverSyncState>();

function stateFor(root: HTMLElement) {
  const existing = states.get(root);
  if (existing) return existing;
  const state = { defaultOpenApplied: false, syncing: false };
  states.set(root, state);
  return state;
}

function setInert(element: HTMLElement, inert: boolean) {
  element.toggleAttribute("inert", inert);
  if ("inert" in element) element.inert = inert;
}

export function syncPopoverTreeAround(element: HTMLElement) {
  const root = popoverRoot(element);
  if (root instanceof HTMLElement) syncPopoverTreeFromRoot(root as PopoverRootElement);
}

export function syncPopoverTreeFromRoot(root: PopoverRootElement) {
  const syncState = stateFor(root);
  if (syncState.syncing) return;
  syncState.syncing = true;

  try {
    if (!syncState.defaultOpenApplied) {
      syncState.defaultOpenApplied = true;
      if (root.hasAttribute("default-open") && !root.hasAttribute("open")) root.setAttribute("open", "");
    }

    const open = root.hasAttribute("open");
    const state = open ? "open" : "closed";
    root.setAttribute("data-state", state);

    const trigger = popoverTrigger(root);
    const content = popoverContent(root);
    if (trigger) {
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("data-state", state);
    }
    if (!content) {
      trigger?.removeAttribute("aria-controls");
      return;
    }

    const host = popoverContentHost(content);
    ensurePopoverId(host, "content");
    if (trigger) {
      if (open) trigger.setAttribute("aria-controls", host.id);
      else trigger.removeAttribute("aria-controls");
    }

    const headingParts = Array.from(content.querySelectorAll<HTMLElement>("aria-popover-heading"))
      .filter((heading) => heading.closest("aria-popover-content") === content);
    const headings = popoverHeadingHosts(content);
    headingParts.forEach((part, index) => {
      const heading = headings[index] ?? part;
      ensurePopoverId(heading, "heading");
      if (heading !== part) {
        part.removeAttribute("role");
        part.removeAttribute("aria-level");
      } else {
        if (!heading.hasAttribute("role")) heading.setAttribute("role", "heading");
        if (!heading.hasAttribute("aria-level")) heading.setAttribute("aria-level", "2");
      }
    });

    const descriptions = popoverDescriptionHosts(content);
    descriptions.forEach((description) => ensurePopoverId(description, "description"));

    if (host !== content) {
      content.removeAttribute("role");
      content.removeAttribute("aria-modal");
      content.removeAttribute("aria-labelledby");
      content.removeAttribute("aria-describedby");
    }
    host.setAttribute("role", "dialog");
    host.setAttribute("aria-modal", String(root.hasAttribute("modal")));
    host.setAttribute("data-state", state);
    host.hidden = !open && !content.hasAttribute("force-mount");
    setInert(host, !open);
    if (open) host.removeAttribute("aria-hidden");
    else host.setAttribute("aria-hidden", "true");

    if (headings.length) host.setAttribute("aria-labelledby", headings.map((item) => item.id).join(" "));
    else host.removeAttribute("aria-labelledby");
    if (descriptions.length) host.setAttribute("aria-describedby", descriptions.map((item) => item.id).join(" "));
    else host.removeAttribute("aria-describedby");
  } finally {
    syncState.syncing = false;
  }
}

export function cleanupPopoverRoot(root: HTMLElement) {
  states.delete(root);
}
```

Replace `packages/popover/src/popover-element.ts` with:

```ts
import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { popoverRoot, type PopoverRootElement } from "./popover-dom";
import { cleanupPopoverRoot, syncPopoverTreeAround, syncPopoverTreeFromRoot } from "./popover-sync";

const rootObservers = new WeakMap<HTMLElement, MutationObserver>();

export class PopoverWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "arrow",
      "arrow-class",
      "default-open",
      "loop",
      "modal",
      "native-composition",
      "offset",
      "placement",
    ]));
  }

  syncPopoverTreeFromRoot = () => {
    const root = popoverRoot(this);
    if (root instanceof HTMLElement) syncPopoverTreeFromRoot(root as PopoverRootElement);
  };

  override connectedCallback() {
    super.connectedCallback();
    const constructor = this.constructor as typeof PopoverWebElement;
    if (constructor.partName !== "Root" || rootObservers.has(this)) return;
    const observer = new MutationObserver(() => syncPopoverTreeFromRoot(this as PopoverRootElement));
    observer.observe(this, {
      attributes: true,
      attributeFilter: ["id", "native-composition"],
      childList: true,
      subtree: true,
    });
    rootObservers.set(this, observer);
  }

  disconnectedCallback() {
    const constructor = this.constructor as typeof PopoverWebElement;
    if (constructor.partName !== "Root") return;
    rootObservers.get(this)?.disconnect();
    rootObservers.delete(this);
    cleanupPopoverRoot(this);
  }

  override afterAriaWebContractApplied() {
    syncPopoverTreeAround(this);
  }
}

export function createPopoverWebComponent(part: WebComponentPartSpec): typeof PopoverWebElement {
  return class extends PopoverWebElement {
    static override packageSlug = "popover";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/popover.behavior.test.ts packages/popover/__test__/popover.test.ts
```

Expected: PASS for the new state tests and existing generated contract tests.

- [ ] **Step 6: Commit the state slice**

```bash
git add packages/popover/__test__/popover.behavior.test.ts packages/popover/src/popover-dom.ts packages/popover/src/popover-sync.ts packages/popover/src/popover-element.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat(popover): synchronize native open state"
```

### Task 3: Implement activation and dismissal actions

**Files:**
- Modify: `packages/popover/__test__/popover.behavior.test.ts`
- Create: `packages/popover/src/popover-actions.ts`
- Modify: `packages/popover/src/popover-element.ts`
- Modify: `packages/popover/src/popover-sync.ts`

- [ ] **Step 1: Add failing interaction tests**

Add tests that perform these exact assertions:

```ts
it("toggles from Trigger click, Enter, and Space and ignores disabled Trigger", async () => {
  const { root, trigger } = fixture();
  trigger.click();
  await flushMicrotasks();
  expect(root.open).toBe(true);
  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  await flushMicrotasks();
  expect(root.open).toBe(false);
  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
  trigger.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));
  await flushMicrotasks();
  expect(root.open).toBe(true);
  trigger.disabled = true;
  trigger.click();
  await flushMicrotasks();
  expect(root.open).toBe(true);
});

it("supports canceled controlled requests", async () => {
  const { root, trigger } = fixture();
  const changes: boolean[] = [];
  root.addEventListener("openchange", (event) => {
    const change = event as CustomEvent<{ open: boolean; source: Element }>;
    changes.push(change.detail.open);
    expect(change.detail.source).toBe(trigger);
    event.preventDefault();
  });
  trigger.click();
  await flushMicrotasks();
  expect(changes).toEqual([true]);
  expect(root.open).toBe(false);
});

it("closes from Close, outside mousedown, and Escape while restoring Trigger focus", async () => {
  const { close, content, root, trigger } = fixture("open");
  close.click();
  await flushMicrotasks();
  expect(root.open).toBe(false);
  expect(document.activeElement).toBe(trigger);
  root.open = true;
  document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  await flushMicrotasks();
  expect(root.open).toBe(false);
  root.open = true;
  content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
  await flushMicrotasks();
  expect(root.open).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

it("respects a prevented Close click", async () => {
  const { close, root } = fixture("open");
  close.addEventListener("click", (event) => event.preventDefault());
  close.click();
  await flushMicrotasks();
  expect(root.open).toBe(true);
});

it("leaves orphan parts inert instead of throwing", async () => {
  definePopoverElements();
  document.body.innerHTML = "<aria-popover-trigger>Orphan trigger</aria-popover-trigger><aria-popover-content>Orphan content</aria-popover-content><aria-popover-close>Orphan close</aria-popover-close>";
  const trigger = document.querySelector<HTMLElement>("aria-popover-trigger")!;
  const close = document.querySelector<HTMLElement>("aria-popover-close")!;
  expect(() => trigger.click()).not.toThrow();
  expect(() => close.click()).not.toThrow();
  await flushMicrotasks();
  expect(document.querySelector("aria-popover")).toBeNull();
});
```

- [ ] **Step 2: Run the interaction tests and verify RED**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/popover.behavior.test.ts -t "toggles|controlled|closes|prevented"
```

Expected: FAIL because state requests and document dismissal listeners do not exist.

- [ ] **Step 3: Implement actions**

Create `packages/popover/src/popover-actions.ts`:

```ts
import {
  popoverContent,
  popoverContentHost,
  popoverPartName,
  popoverRoot,
  popoverTrigger,
  type PopoverRootElement,
} from "./popover-dom";

const dismissalCleanups = new WeakMap<HTMLElement, () => void>();

export function requestPopoverOpen(
  root: PopoverRootElement,
  open: boolean,
  source: Element,
  restoreFocus = false,
) {
  if (root.open === open) return true;
  const event = new CustomEvent("openchange", {
    bubbles: true,
    cancelable: true,
    detail: { open, source },
  });
  if (!root.dispatchEvent(event)) return false;
  root.open = open;
  if (!open && restoreFocus) {
    queueMicrotask(() => popoverTrigger(root)?.focus({ preventScroll: true }));
  }
  return true;
}

export function handlePopoverClick(element: HTMLElement, event: Event) {
  const part = popoverPartName(element);
  if (part !== "Trigger" && part !== "Close") return;
  queueMicrotask(() => {
    if (event.defaultPrevented || element.hasAttribute("disabled")) return;
    const root = popoverRoot(element);
    if (!(root instanceof HTMLElement) || typeof (root as PopoverRootElement).syncPopoverTreeFromRoot !== "function") return;
    requestPopoverOpen(
      root as PopoverRootElement,
      part === "Trigger" ? !root.hasAttribute("open") : false,
      element,
      part === "Close",
    );
  });
}

export function installPopoverDismissal(root: PopoverRootElement) {
  if (dismissalCleanups.has(root)) return;
  const doc = root.ownerDocument;
  const onMouseDown = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    const target = event.target;
    const trigger = popoverTrigger(root);
    const content = popoverContent(root);
    const host = content ? popoverContentHost(content) : null;
    if (target instanceof Node && (trigger?.contains(target) || host?.contains(target))) return;
    requestPopoverOpen(root, false, root);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.key !== "Escape") return;
    event.preventDefault();
    requestPopoverOpen(root, false, popoverContentHost(popoverContent(root) ?? root), true);
  };
  doc.addEventListener("mousedown", onMouseDown);
  doc.addEventListener("keydown", onKeyDown);
  dismissalCleanups.set(root, () => {
    doc.removeEventListener("mousedown", onMouseDown);
    doc.removeEventListener("keydown", onKeyDown);
  });
}

export function removePopoverDismissal(root: HTMLElement) {
  dismissalCleanups.get(root)?.();
  dismissalCleanups.delete(root);
}
```

In `packages/popover/src/popover-element.ts`, add this import and class field; inherited button keyboard handling remains responsible for converting Enter and Space into click:

```ts
import { handlePopoverClick } from "./popover-actions";

override handleAriaWebClick = (event: Event) => {
  handlePopoverClick(this, event);
};
```

In `packages/popover/src/popover-sync.ts`, import `installPopoverDismissal` and `removePopoverDismissal`. Immediately before the no-Content return, call `removePopoverDismissal(root)`. After Content labelling is synchronized, add:

```ts
if (open) installPopoverDismissal(root);
else removePopoverDismissal(root);
```

Replace `cleanupPopoverRoot` with:

```ts
export function cleanupPopoverRoot(root: HTMLElement) {
  removePopoverDismissal(root);
  states.delete(root);
}
```

- [ ] **Step 4: Run interaction tests and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/popover.behavior.test.ts
```

Expected: all state and action tests PASS.

- [ ] **Step 5: Commit the action slice**

```bash
git add packages/popover/__test__/popover.behavior.test.ts packages/popover/src/popover-actions.ts packages/popover/src/popover-element.ts packages/popover/src/popover-sync.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat(popover): add native dismissal actions"
```

### Task 4: Add top-layer positioning, flipping, composition, and arrow behavior

**Files:**
- Modify: `packages/popover/__test__/popover.behavior.test.ts`
- Create: `packages/popover/src/popover-position.ts`
- Modify: `packages/popover/src/popover-sync.ts`

- [ ] **Step 1: Add failing surface and geometry tests**

Add tests for:

```ts
it("uses the effective native-composition host and preserves its heading id", () => {
  definePopoverElements();
  document.body.innerHTML = `<aria-popover open>
    <aria-popover-trigger>Open</aria-popover-trigger>
    <aria-popover-content native-composition>
      <section data-testid="host">
        <aria-popover-heading native-composition><h3 id="existing-heading">Settings</h3></aria-popover-heading>
        <button>Inside</button>
      </section>
    </aria-popover-content>
  </aria-popover>`;
  const trigger = document.querySelector("aria-popover-trigger")!;
  const host = document.querySelector<HTMLElement>("[data-testid='host']")!;
  expect(host.getAttribute("role")).toBe("dialog");
  expect(host.getAttribute("aria-labelledby")).toBe("existing-heading");
  expect(trigger.getAttribute("aria-controls")).toBe(host.id);
});

it("renders exactly one arrow and resolves a viewport flip", () => {
  const { content, root, trigger } = fixture("open placement=bottom offset=8");
  content.setAttribute("arrow", "");
  vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 590, 40, 20));
  vi.spyOn(content, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 180, 120));
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 800 });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 640 });
  root.syncPopoverTreeFromRoot();
  expect(content.querySelectorAll("[data-popover-arrow]")).toHaveLength(1);
  expect(content.dataset.side).toBe("top");
  expect(content.style.position).toBe("fixed");
  expect(content.style.top).toBe("462px");
  expect(content.style.left).toBe("30px");
});

it("uses the Popover API when available and hidden fallback otherwise", () => {
  const { content, root } = fixture();
  const showPopover = vi.fn();
  const hidePopover = vi.fn();
  Object.defineProperties(content, { showPopover: { configurable: true, value: showPopover }, hidePopover: { configurable: true, value: hidePopover } });
  root.open = true;
  expect(showPopover).toHaveBeenCalledOnce();
  root.open = false;
  expect(hidePopover).toHaveBeenCalledOnce();
  expect(content.hidden).toBe(true);
});

it("keeps force-mounted Content inert, removes an omitted arrow, and ignores clipped ancestors", () => {
  const { content, host: clippingHost, root, trigger } = fixture("open placement=bottom offset=8");
  clippingHost.style.overflow = "hidden";
  vi.spyOn(clippingHost, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 160, 80));
  vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 100, 40, 20));
  vi.spyOn(content, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 180, 120));
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 800 });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 640 });
  content.setAttribute("arrow", "");
  root.syncPopoverTreeFromRoot();
  expect(content.dataset.side).toBe("bottom");
  expect(content.style.top).toBe("128px");
  expect(content.querySelectorAll("[data-popover-arrow]")).toHaveLength(1);
  content.removeAttribute("arrow");
  expect(content.querySelectorAll("[data-popover-arrow]")).toHaveLength(0);
  content.setAttribute("force-mount", "");
  root.open = false;
  expect(content.hidden).toBe(false);
  expect(content.getAttribute("aria-hidden")).toBe("true");
  expect(content.hasAttribute("inert")).toBe(true);
});

it("cleans up automatic position listeners when closed", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const { root } = fixture();
  root.open = true;
  root.open = false;
  expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
});
```

- [ ] **Step 2: Run geometry tests and verify RED**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/popover.behavior.test.ts -t "composition|arrow|Popover API"
```

Expected: FAIL because effective hosts, arrow creation, top-layer methods, and positioning do not run.

- [ ] **Step 3: Implement positioning**

Create `packages/popover/src/popover-position.ts`:

```ts
import { autoUpdate, computePosition } from "@ariaui-web/position";
import { popoverContent, popoverContentHost, popoverOffset, popoverPlacement, popoverTrigger } from "./popover-dom";

const cleanups = new WeakMap<HTMLElement, () => void>();

export function updatePopoverPosition(root: HTMLElement) {
  const trigger = popoverTrigger(root);
  const content = popoverContent(root);
  if (!trigger || !content || !root.hasAttribute("open")) return;
  const host = popoverContentHost(content);
  const result = computePosition(trigger, host, {
    boundary: "viewport",
    offset: popoverOffset(root),
    placement: popoverPlacement(root),
    strategy: "fixed",
  });
  if (host.style.position !== "fixed") host.style.position = "fixed";
  const left = `${result.x}px`;
  const top = `${result.y}px`;
  const side = result.placement.split("-")[0] ?? "bottom";
  const align = result.placement.split("-")[1] ?? "center";
  if (host.style.left !== left) host.style.left = left;
  if (host.style.top !== top) host.style.top = top;
  if (host.dataset.side !== side) host.dataset.side = side;
  if (host.dataset.align !== align) host.dataset.align = align;
  const arrow = host.querySelector<HTMLElement>("[data-popover-arrow]");
  if (arrow?.dataset.side !== side) arrow?.setAttribute("data-side", side);
}

export function startPopoverPositioning(root: HTMLElement) {
  if (cleanups.has(root)) {
    updatePopoverPosition(root);
    return;
  }
  const trigger = popoverTrigger(root);
  const content = popoverContent(root);
  if (!trigger || !content) return;
  const host = popoverContentHost(content);
  const update = () => updatePopoverPosition(root);
  update();
  cleanups.set(root, autoUpdate(trigger, host, update, () => {}, { ancestorScroll: true }) ?? (() => {}));
}

export function stopPopoverPositioning(root: HTMLElement) {
  cleanups.get(root)?.();
  cleanups.delete(root);
}
```

In `popover-sync.ts`, import `startPopoverPositioning` and `stopPopoverPositioning`, then add these helpers:

```ts
function syncPopoverArrow(content: HTMLElement, host: HTMLElement) {
  const existing = host.querySelector<HTMLElement>(":scope > [data-popover-arrow]");
  if (!content.hasAttribute("arrow")) {
    existing?.remove();
    return;
  }
  const arrow = existing ?? document.createElement("span");
  arrow.setAttribute("data-popover-arrow", "");
  arrow.setAttribute("aria-hidden", "true");
  arrow.className = content.getAttribute("arrow-class") ?? "";
  if (!existing) arrow.innerHTML = '<svg viewBox="0 0 10 5"><path d="M0 5 5 0l5 5Z"></path></svg>';
  if (!existing) host.prepend(arrow);
}

function showPopoverHost(host: HTMLElement) {
  host.hidden = false;
  if (host.getAttribute("popover") !== "manual") host.setAttribute("popover", "manual");
  const show = (host as HTMLElement & { showPopover?: () => void }).showPopover;
  if (typeof show === "function") {
    try { show.call(host); } catch { /* already open or unsupported state */ }
  }
}

function hidePopoverHost(content: HTMLElement, host: HTMLElement, force = false) {
  if (content.hasAttribute("force-mount") && !force) {
    host.hidden = false;
    return;
  }
  const hide = (host as HTMLElement & { hidePopover?: () => void }).hidePopover;
  if (typeof hide === "function") {
    try { hide.call(host); } catch { /* already closed or unsupported state */ }
  }
  host.hidden = !content.hasAttribute("force-mount");
}
```

In `syncPopoverTreeFromRoot`, immediately after `const host = popoverContentHost(content);`, call:

```ts
syncPopoverArrow(content, host);
```

After dismissal and labelling synchronization, add the exact lifecycle branch:

```ts
if (open) {
  showPopoverHost(host);
  startPopoverPositioning(root);
} else {
  stopPopoverPositioning(root);
  hidePopoverHost(content, host);
}
```

Immediately before the no-Content return, add `stopPopoverPositioning(root)`. Replace `cleanupPopoverRoot` with:

```ts
export function cleanupPopoverRoot(root: HTMLElement) {
  removePopoverDismissal(root);
  stopPopoverPositioning(root);
  const content = popoverContent(root);
  if (content) hidePopoverHost(content, popoverContentHost(content), true);
  states.delete(root);
}
```

- [ ] **Step 4: Run Popover tests and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/popover/__test__
```

Expected: all component-spec, generated, interaction, composition, arrow, surface, and positioning tests PASS.

- [ ] **Step 5: Commit the surface slice**

```bash
git add packages/popover/__test__/popover.behavior.test.ts packages/popover/src/popover-position.ts packages/popover/src/popover-sync.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat(popover): position native floating content"
```

### Task 5: Implement source-equivalent focus behavior

**Files:**
- Modify: `packages/popover/__test__/popover.behavior.test.ts`
- Create: `packages/popover/src/popover-focus.ts`
- Modify: `packages/popover/src/popover-sync.ts`

- [ ] **Step 1: Add failing focus tests**

Add one test per source behavior:

```ts
it("focuses the first tabbable element after opening", async () => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { callback(0); return 1; });
  const { root, trigger } = fixture();
  trigger.click();
  await flushMicrotasks();
  expect(document.activeElement).toBe(root.querySelector("input"));
});

it("loops focus by default and allows escape when loop is false", () => {
  const { close, content } = fixture("open");
  const input = content.querySelector("input")!;
  close.focus();
  const looped = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
  content.dispatchEvent(looped);
  expect(looped.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(input);
  input.focus();
  const reverse = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
  content.dispatchEvent(reverse);
  expect(reverse.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(close);
  content.setAttribute("loop", "false");
  close.focus();
  const escaped = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
  content.dispatchEvent(escaped);
  expect(escaped.defaultPrevented).toBe(false);
});

it("traps focus in modal mode and releases inert siblings on close", () => {
  const outside = document.createElement("button");
  document.body.append(outside);
  const { content, root } = fixture("open modal");
  root.syncPopoverTreeFromRoot();
  expect(outside.inert || outside.hasAttribute("inert")).toBe(true);
  outside.focus();
  outside.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  expect(document.activeElement).toBe(content.querySelector("input"));
  root.removeAttribute("modal");
  expect(outside.hasAttribute("inert")).toBe(false);
  outside.focus();
  outside.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  expect(document.activeElement).toBe(outside);
  root.open = false;
  expect(outside.hasAttribute("inert")).toBe(false);
});

it("focuses one late-added target without scheduling another frame", async () => {
  const request = vi.fn((callback: FrameRequestCallback) => { callback(0); return 1; });
  vi.stubGlobal("requestAnimationFrame", request);
  definePopoverElements();
  document.body.innerHTML = "<aria-popover open><aria-popover-trigger>Open</aria-popover-trigger><aria-popover-content></aria-popover-content></aria-popover>";
  const content = document.querySelector("aria-popover-content")!;
  const button = document.createElement("button");
  content.append(button);
  await flushMicrotasks();
  expect(document.activeElement).toBe(button);
  expect(request).toHaveBeenCalledTimes(1);
});

it("does not schedule an unbounded focus frame when no target exists", () => {
  const request = vi.fn((callback: FrameRequestCallback) => { callback(0); return 1; });
  vi.stubGlobal("requestAnimationFrame", request);
  definePopoverElements();
  document.body.innerHTML = "<aria-popover open><aria-popover-trigger>Open</aria-popover-trigger><aria-popover-content></aria-popover-content></aria-popover>";
  expect(request).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run focus tests and verify RED**

Run:

```bash
pnpm exec vitest run packages/popover/__test__/popover.behavior.test.ts -t "focuses|loops|traps|unbounded"
```

Expected: FAIL because focus scheduling, looping, modal trapping, and inert cleanup are absent.

- [ ] **Step 3: Implement focus lifecycle**

Create `packages/popover/src/popover-focus.ts`:

```ts
import {
  booleanAttribute,
  popoverContent,
  popoverContentHost,
  popoverTabbables,
} from "./popover-dom";

const focusSessions = new WeakMap<HTMLElement, { cleanup: () => void; modal: boolean }>();

function modalInertTargets(root: HTMLElement) {
  const targets = new Set<HTMLElement>();
  let current: HTMLElement | null = root;
  while (current?.parentElement) {
    for (const sibling of Array.from(current.parentElement.children)) {
      if (sibling !== current && sibling instanceof HTMLElement) targets.add(sibling);
    }
    if (current.parentElement === root.ownerDocument.body) break;
    current = current.parentElement;
  }
  return Array.from(targets);
}

export function startPopoverFocus(root: HTMLElement) {
  const modal = root.hasAttribute("modal");
  const existing = focusSessions.get(root);
  if (existing?.modal === modal) return;
  existing?.cleanup();
  focusSessions.delete(root);
  const content = popoverContent(root);
  if (!content) return;
  const host = popoverContentHost(content);
  const doc = root.ownerDocument;
  let active = true;
  let frame = 0;
  let observer: MutationObserver | null = null;
  const inertState = new Map<HTMLElement, { attribute: boolean; value: boolean }>();
  const hadTabIndex = host.hasAttribute("tabindex");
  const previousTabIndex = host.getAttribute("tabindex");

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || !booleanAttribute(content, "loop", true)) return;
    const tabbables = popoverTabbables(host);
    const first = tabbables[0];
    const last = tabbables.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };
  host.addEventListener("keydown", onKeyDown);

  const onFocusIn = (event: FocusEvent) => {
    const target = event.target;
    if (target instanceof Node && (target === host || host.contains(target))) return;
    const destination = popoverTabbables(host)[0] ?? host;
    if (destination === host && !host.hasAttribute("tabindex")) host.tabIndex = -1;
    destination.focus({ preventScroll: true });
  };

  if (modal) {
    for (const element of modalInertTargets(root)) {
      inertState.set(element, { attribute: element.hasAttribute("inert"), value: element.inert });
      element.inert = true;
      element.setAttribute("inert", "");
    }
    doc.addEventListener("focusin", onFocusIn);
  }

  const requestFrame = globalThis.requestAnimationFrame ?? ((callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0));
    return 0;
  });
  const cancelFrame = globalThis.cancelAnimationFrame ?? (() => {});
  frame = requestFrame(() => {
    frame = 0;
    if (!active) return;
    const first = popoverTabbables(host)[0];
    if (first) {
      first.focus({ preventScroll: true });
      return;
    }
    observer = new MutationObserver(() => {
      const late = popoverTabbables(host)[0];
      if (!late) return;
      late.focus({ preventScroll: true });
      observer?.disconnect();
      observer = null;
    });
    observer.observe(host, { childList: true, subtree: true });
  });

  const cleanup = () => {
    active = false;
    if (frame) cancelFrame(frame);
    observer?.disconnect();
    host.removeEventListener("keydown", onKeyDown);
    doc.removeEventListener("focusin", onFocusIn);
    for (const [element, previous] of inertState) {
      element.inert = previous.value;
      element.toggleAttribute("inert", previous.attribute);
    }
    if (!hadTabIndex) host.removeAttribute("tabindex");
    else if (previousTabIndex != null) host.setAttribute("tabindex", previousTabIndex);
  };
  focusSessions.set(root, { cleanup, modal });
}

export function stopPopoverFocus(root: HTMLElement) {
  focusSessions.get(root)?.cleanup();
  focusSessions.delete(root);
}
```

In `popover-sync.ts`, import `startPopoverFocus` and `stopPopoverFocus`. Immediately before the no-Content return, call `stopPopoverFocus(root)`. Extend the open/closed lifecycle branch to this exact form:

```ts
if (open) {
  showPopoverHost(host);
  startPopoverPositioning(root);
  startPopoverFocus(root);
} else {
  stopPopoverFocus(root);
  stopPopoverPositioning(root);
  hidePopoverHost(content, host);
}
```

Because `startPopoverFocus` reuses an existing session when `modal` is unchanged, mutation synchronization cannot restart its frame; changing `modal` intentionally replaces the session so the trap and inert state stay correct. Add `stopPopoverFocus(root)` to `cleanupPopoverRoot` before positioning cleanup.

- [ ] **Step 4: Run all package tests, lint, and build**

Run:

```bash
pnpm --filter @ariaui-web/popover test
pnpm --filter @ariaui-web/popover lint
pnpm --filter @ariaui-web/position build
pnpm --filter @ariaui-web/popover build
```

Expected: all commands exit 0 with no Popover test failures or TypeScript errors.

- [ ] **Step 5: Commit the focus slice**

```bash
git add packages/popover/__test__/popover.behavior.test.ts packages/popover/src/popover-focus.ts packages/popover/src/popover-sync.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat(popover): manage floating focus lifecycle"
```

### Task 6: Make Popover generation reproducible

**Files:**
- Modify: `scripts/generate-from-ariaui.mjs`

- [ ] **Step 1: Prove the current generator destroys the Popover-specific work**

Create a temporary clean worktree at the current Popover commit, run the unmodified generator there, and assert that a required Popover runtime file still exists:

```bash
git worktree add /home/neo/Projects/ariaui-web-popover-generator HEAD
ln -s /home/neo/Projects/ariaui-web/node_modules /home/neo/Projects/ariaui-web-popover-generator/node_modules
node /home/neo/Projects/ariaui-web-popover-generator/scripts/generate-from-ariaui.mjs
test -f /home/neo/Projects/ariaui-web-popover-generator/packages/popover/src/popover-actions.ts
```

Expected: the `test -f` command exits 1 because regeneration loses the manual Popover runtime. Confirm the generated spec also lost the corrected semantics with these read-only checks:

```bash
rg -n '"defaultRole": "region"|"aria-haspopup": "listbox"' /home/neo/Projects/ariaui-web-popover-generator/packages/popover/src/component-spec.ts
rg -n 'sourceTestParity' /home/neo/Projects/ariaui-web-popover-generator/packages/popover/src/component-spec.ts
git worktree remove --force /home/neo/Projects/ariaui-web-popover-generator
```

Expected: the first command finds the stale generic values; the second exits 1; the final command removes the deliberately damaged temporary worktree. Do not run the generator in the dirty primary workspace.

- [ ] **Step 2: Add exact Popover generator branches**

In `scripts/generate-from-ariaui.mjs`:

```js
// roleByPackagePart
["popover:Root", null],
["popover:Content", "dialog"],
["popover:Description", null],
["popover:Heading", "heading"],

// defaultPopupKind
if (packageName === "popover") return "dialog";

// defaultAttributesForPart
if (packageName === "popover") {
  if (part.name === "Heading") attributes["aria-level"] = "2";
  if (part.name === "Trigger") {
    attributes["aria-expanded"] = "false";
    attributes["aria-haspopup"] = "dialog";
  }
  if (part.name === "Close") {
    delete attributes["aria-expanded"];
    delete attributes["aria-haspopup"];
  }
}
```

Add the exact `sourceTestParity` object from Task 1 for `packageName === "popover"`. In `packageJson`, add `@ariaui-web/position` only when `name === "popover"`. Preserve these Popover files before package reset and restore them afterward:

```js
const popoverFiles = [
  "src/popover-actions.ts",
  "src/popover-dom.ts",
  "src/popover-element.ts",
  "src/popover-focus.ts",
  "src/popover-position.ts",
  "src/popover-sync.ts",
  "__test__/popover.behavior.test.ts",
  "__test__/popover.test.ts",
];
```

Add `preservedGeneratedPackageSources.popover`, restore these paths in `writeComponentPackage`, and use the preserved Popover element/test instead of generic templates. Add `docs/components/popover.md`, `docs/.vitepress/theme/index.ts`, `docs/.vitepress/theme/popover-examples.ts`, and `__test__/popover-examples.test.ts` to `preservedDocsSources`; write each preserved file back when present. This preserves the user's Pagination theme wiring too. Extend the fallback `docsTheme` template with the Popover installer import/call for clean generation, and extend `docsPackageJson` with `framer-motion: "^12.38.0"`.

In the generated component-spec test template, add this `spec.slug === "popover"` branch so future generation verifies the exact contract:

```ts
if (spec.slug === "popover") {
  expect(componentSpec.parts.find((part) => part.name === "Content")?.defaultRole).toBe("dialog");
  expect(componentSpec.parts.find((part) => part.name === "Description")?.defaultRole).toBeNull();
  expect(componentSpec.parts.find((part) => part.name === "Heading")?.defaultAttributes).toMatchObject({ "aria-level": "2" });
  expect(componentSpec.parts.find((part) => part.name === "Trigger")?.defaultAttributes).toMatchObject({ "aria-haspopup": "dialog" });
  expect(componentSpec.sourceTestParity.sourceTestCases).toBe(23);
}
```

- [ ] **Step 3: Re-run generation in the clean worktree and review**

Copy the updated generator file into `/home/neo/Projects/ariaui-web-popover-generator`, then run it from that worktree:

```bash
git worktree add /home/neo/Projects/ariaui-web-popover-generator HEAD
ln -s /home/neo/Projects/ariaui-web/node_modules /home/neo/Projects/ariaui-web-popover-generator/node_modules
cp scripts/generate-from-ariaui.mjs /home/neo/Projects/ariaui-web-popover-generator/scripts/generate-from-ariaui.mjs
node /home/neo/Projects/ariaui-web-popover-generator/scripts/generate-from-ariaui.mjs
git -C /home/neo/Projects/ariaui-web-popover-generator status --short
git -C /home/neo/Projects/ariaui-web-popover-generator diff -- packages/popover web/doc/docs/components/popover.md web/doc/docs/.vitepress/theme/popover-examples.ts web/doc/package.json
git -C /home/neo/Projects/ariaui-web-popover-generator diff --exit-code HEAD -- packages/popover
pnpm --dir /home/neo/Projects/ariaui-web-popover-generator --filter @ariaui-web/popover test
```

Expected: generation exits 0; the Popover package is byte-for-byte unchanged; runtime/test files survive; generated roles, parity metadata, dependency, and readme remain correct; package tests pass. Review the complete temporary-worktree diff before continuing.

- [ ] **Step 4: Commit the generator slice and remove the temporary worktree**

In the primary workspace:

```bash
git add scripts/generate-from-ariaui.mjs
git diff --cached --check
git diff --cached --name-only
git commit -m "build(popover): preserve source parity generation"
git worktree remove --force /home/neo/Projects/ariaui-web-popover-generator
```

### Task 7: Replace the placeholder docs with source page structure and examples

**Files:**
- Modify: `web/doc/__test__/docs.test.ts`
- Modify: `web/doc/docs/components/popover.md`
- Modify: `web/doc/docs/.vitepress/theme/style.css`

- [ ] **Step 1: Add failing page-structure and example assertions**

Add this helper beside the existing component preview helpers in `web/doc/__test__/docs.test.ts`:

```ts
function popoverExamplePreviews(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="popover" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);
    previews.push({
      className: match[1],
      variant: match[2],
      markup: normalizeExampleMarkup(doc.slice(start, end === -1 ? undefined : end)),
    });
  }
  return previews;
}
```

Then add:

```ts
it("keeps the Popover docs structured like the source Aria UI page", () => {
  const doc = readDoc("components/popover.md");
  expect(doc).toContain("A headless, accessible popover with smart positioning, optional arrow, and optional modal focus trap.");
  expectHeadingsInOrder(doc, [
    "## Features",
    "## Installation",
    "## Examples",
    "## Anatomy",
    "## API Reference",
    "## Keyboard",
    "## Accessibility",
  ]);
  expectHeadingsInOrder(doc, ["### Popover", "### Framer Motion"]);
  expect(doc).not.toMatch(/^## Web Component Contract$/m);
  expect(doc).toContain('import { definePopoverElements } from "@ariaui-web/popover";');
});

it("renders both source Popover examples as live custom-element previews", () => {
  const previews = popoverExamplePreviews(readDoc("components/popover.md"));
  expect(previews.map((preview) => preview.variant)).toEqual(["default", "framer-motion"]);
  expect(previews[0]?.markup).toContain("Dimensions");
  expect(previews[0]?.markup).toContain("Set the dimensions for the layer.");
  expect(previews[0]?.markup).toContain('value="100%"');
  expect(previews[0]?.markup).toContain('value="300px"');
  expect(previews[0]?.markup).toContain('value="25px"');
  expect(previews[0]?.markup).toContain('value="none"');
  expect(previews[1]?.markup).toContain("Motion Popover");
  expect(previews[1]?.markup).toContain("Release checks");
  expect(previews[1]?.markup).toContain("Design tokens");
  expect(previews[1]?.markup).toContain("Keyboard paths");
  expect(previews[1]?.markup).toContain("Docs preview");
  expect(previews[1]?.markup).toContain("force-mount");
  const style = readDoc(".vitepress/theme/style.css");
  expect(style).toContain('--ariaui-web-popover-background: var(--vp-c-bg)');
  expect(style).toContain(".ariaui-web-popover-content { position: fixed;");
  expect(style).toContain(".ariaui-web-popover-motion-content { width: 18rem;");
});
```

- [ ] **Step 2: Run focused docs tests and verify RED**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Popover docs|source Popover examples"
```

Expected: FAIL because the current page has generic contract headings and no complete live examples.

- [ ] **Step 3: Write the source-ordered Popover page**

Replace `web/doc/docs/components/popover.md`. Begin with this exact source-ordered content:

````markdown
---
title: Popover
description: A headless, accessible popover with smart positioning, optional arrow, and optional modal focus trap.
---

# Popover

A headless, accessible popover with smart positioning, optional arrow, and optional modal focus trap.

## Features

- **Controlled or uncontrolled**
- **Modal or non-modal**
- **Flexible placement**
- **Optional arrow**
- **Automatic focus management**
- **Escape and outside-click dismissal**
- **Top-layer rendering**
- **Accessible labelling**

## Installation

```bash
pnpm add @ariaui-web/popover
```

Register the Popover custom elements once in your browser entry point:

```ts
import { definePopoverElements } from "@ariaui-web/popover";

definePopoverElements();
```

## Examples

### Popover
````

Continue with these exact live-preview roots:

```html
<div class="ariaui-web-preview" data-component="popover" data-example-variant="default">
  <aria-popover class="ariaui-web-popover-example" placement="bottom" offset="8">
    <aria-popover-trigger class="ariaui-web-popover-trigger" aria-label="Update dimensions">
      <svg class="ariaui-web-popover-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
      Dimensions
    </aria-popover-trigger>
    <aria-popover-content class="ariaui-web-popover-content" arrow arrow-class="ariaui-web-popover-arrow">
      <div class="ariaui-web-popover-stack">
        <div class="ariaui-web-popover-header">
          <aria-popover-heading class="ariaui-web-popover-heading">Dimensions</aria-popover-heading>
          <aria-popover-description class="ariaui-web-popover-description">Set the dimensions for the layer.</aria-popover-description>
        </div>
        <div class="ariaui-web-popover-form-grid">
          <div class="ariaui-web-popover-field-row">
            <label for="popover-width">Width</label>
            <input id="popover-width" class="ariaui-web-popover-field" value="100%" />
          </div>
          <div class="ariaui-web-popover-field-row">
            <label for="popover-max-width">Max. width</label>
            <input id="popover-max-width" class="ariaui-web-popover-field" value="300px" />
          </div>
          <div class="ariaui-web-popover-field-row">
            <label for="popover-height">Height</label>
            <input id="popover-height" class="ariaui-web-popover-field" value="25px" />
          </div>
          <div class="ariaui-web-popover-field-row">
            <label for="popover-max-height">Max. height</label>
            <input id="popover-max-height" class="ariaui-web-popover-field" value="none" />
          </div>
        </div>
      </div>
      <aria-popover-close class="ariaui-web-popover-close" aria-label="Close">
        <svg class="ariaui-web-popover-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </aria-popover-close>
    </aria-popover-content>
  </aria-popover>
</div>

<div class="ariaui-web-preview" data-component="popover" data-example-variant="framer-motion">
  <aria-popover class="ariaui-web-popover-example" placement="bottom" offset="10">
    <aria-popover-trigger class="ariaui-web-popover-trigger" aria-label="Open motion popover">
      <svg class="ariaui-web-popover-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
      </svg>
      Motion Popover
    </aria-popover-trigger>
    <aria-popover-content class="ariaui-web-popover-content ariaui-web-popover-motion-content" arrow force-mount arrow-class="ariaui-web-popover-arrow">
      <div class="ariaui-web-popover-motion-stack">
        <div class="ariaui-web-popover-motion-header">
          <span class="ariaui-web-popover-motion-icon-shell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>
          </span>
          <div class="ariaui-web-popover-header">
            <aria-popover-heading class="ariaui-web-popover-heading">Release checks</aria-popover-heading>
            <aria-popover-description class="ariaui-web-popover-description">Animated content is slotted onto a native custom-element host.</aria-popover-description>
          </div>
        </div>
        <div class="ariaui-web-popover-motion-list">
          <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Design tokens</div>
          <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Keyboard paths</div>
          <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Docs preview</div>
        </div>
      </div>
      <aria-popover-close class="ariaui-web-popover-close" aria-label="Close">
        <svg class="ariaui-web-popover-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </aria-popover-close>
    </aria-popover-content>
  </aria-popover>
</div>
```

Immediately after each preview closing `</div>`, add an `html` code fence containing that preview's complete inner `<aria-popover>...</aria-popover>` block byte-for-byte. Put `### Framer Motion` immediately before the second preview. After the second example's code fence, append this exact remainder:

````markdown
## Anatomy

```html
<aria-popover placement="bottom" offset="10">
  <aria-popover-trigger>Open popover</aria-popover-trigger>
  <aria-popover-content arrow>
    <aria-popover-heading>Popover heading</aria-popover-heading>
    <aria-popover-description>Popover description</aria-popover-description>
    <aria-popover-close aria-label="Close">Close</aria-popover-close>
  </aria-popover-content>
</aria-popover>
```

## API Reference

| Part | Native attributes and events | Default | Purpose |
| --- | --- | --- | --- |
| `Root` | `open`, `default-open`, `modal`, `placement`, `offset`, cancelable `openchange` | closed, non-modal, `bottom`, `10` | Owns state, placement, and modality. |
| `Trigger` | `disabled`; reflects `aria-haspopup`, `aria-expanded`, `aria-controls`, `data-state` | enabled | Toggles the floating dialog. |
| `Content` | `arrow`, `arrow-class`, `loop`, `force-mount`, `native-composition`; reflects dialog and placement ARIA/data | no arrow, loop enabled | Hosts, positions, labels, and scopes the floating panel. |
| `Heading` | `native-composition`; reflects `role="heading"` and `aria-level="2"` when it is the semantic host | wrapper host | Labels Content through `aria-labelledby`. |
| `Description` | stable generated or authored `id` | wrapper host | Describes Content through `aria-describedby`. |
| `Close` | `disabled` and a cancelable `click` | enabled | Requests closure and restores Trigger focus. |

`openchange` bubbles with `event.detail.open` and `event.detail.source`. Prevent the event to keep state controlled, then set `root.open` yourself when the requested state is accepted.

## Keyboard

| Keys | Action |
| --- | --- |
| <kbd>Enter</kbd> or <kbd>Space</kbd> | When focus is on Trigger, opens the popover and moves focus to the first focusable element in Content. |
| <kbd>Tab</kbd> | Moves focus to the next focusable element. Focus wraps when `loop` is enabled. |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | Moves focus to the previous focusable element. Focus wraps when `loop` is enabled. |
| <kbd>Escape</kbd> | Closes the popover and returns focus to Trigger. |

## Accessibility

Popover follows the [WAI-ARIA Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) with a non-modal mode for lightweight surfaces:

- Trigger exposes `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` pointing at Content while open.
- Content uses `role="dialog"`, reflects `aria-modal` from the `modal` attribute, and exposes `data-side` for styling.
- Heading registers its id through `aria-labelledby`; Description registers through `aria-describedby`.
- With `modal`, focus is trapped in Content and the rest of the page is made inert until closure.
- Without `modal`, focus moves into Content on open and can leave when `loop="false"`.
- Escape and Close return focus to Trigger; outside mouse interaction dismisses the popover.
- The HTML Popover API renders Content in the top layer where supported, avoiding ancestor clipping; the fallback uses fixed viewport positioning.
````

- [ ] **Step 4: Add token-backed Popover styles**

Append a Popover-scoped section to `web/doc/docs/.vitepress/theme/style.css` without altering Pagination selectors. It must define:

```css
.ariaui-web-preview[data-component="popover"] { --ariaui-web-popover-background: var(--vp-c-bg); --ariaui-web-popover-surface: var(--vp-c-bg); --ariaui-web-popover-border: var(--vp-c-divider); --ariaui-web-popover-muted: var(--vp-c-bg-soft); --ariaui-web-popover-muted-foreground: var(--vp-c-text-2); --ariaui-web-popover-foreground: var(--vp-c-text-1); --ariaui-web-popover-accent: color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg-soft)); --ariaui-web-popover-ring: var(--vp-c-brand-1); box-sizing: border-box; display: flex; min-height: 16rem; width: 100%; align-items: flex-start; justify-content: center; overflow: visible; padding: 3rem 1.5rem 8rem; background: var(--ariaui-web-popover-background); }
.ariaui-web-preview[data-component="popover"] * { box-sizing: border-box; }
.ariaui-web-popover-example { display: inline-block; }
.ariaui-web-popover-trigger { display: inline-flex; height: 2.25rem; align-items: center; justify-content: center; gap: 0.5rem; border: 1px solid var(--ariaui-web-popover-border); border-radius: 0.375rem; background: var(--ariaui-web-popover-background); padding: 0 1rem; color: var(--ariaui-web-popover-foreground); font: inherit; font-size: 0.875rem; font-weight: 500; cursor: pointer; }
.ariaui-web-popover-trigger:hover { background: var(--ariaui-web-popover-accent); }
.ariaui-web-popover-trigger:focus-visible, .ariaui-web-popover-close:focus-visible, .ariaui-web-popover-field:focus-visible { outline: 2px solid var(--ariaui-web-popover-ring); outline-offset: 2px; }
.ariaui-web-popover-trigger-icon, .ariaui-web-popover-close-icon { width: 1rem; height: 1rem; color: var(--ariaui-web-popover-muted-foreground); }
.ariaui-web-popover-content { position: fixed; z-index: 50; width: 20rem; max-width: calc(100vw - 2rem); border: 1px solid var(--ariaui-web-popover-border); border-radius: 0.375rem; background: var(--ariaui-web-popover-surface); padding: 1rem; color: var(--ariaui-web-popover-foreground); box-shadow: 0 12px 30px color-mix(in srgb, #000 18%, transparent); }
.ariaui-web-popover-stack { display: grid; gap: 1rem; }
.ariaui-web-popover-header { display: grid; gap: 0.25rem; }
.ariaui-web-popover-heading { color: var(--ariaui-web-popover-foreground); font-size: 0.875rem; font-weight: 600; line-height: 1; }
.ariaui-web-popover-description { color: var(--ariaui-web-popover-muted-foreground); font-size: 0.875rem; }
.ariaui-web-popover-form-grid { display: grid; gap: 0.5rem; }
.ariaui-web-popover-motion-content { width: 18rem; transform-origin: var(--ariaui-web-popover-transform-origin, center top); will-change: opacity, transform; }
.ariaui-web-popover-motion-content[aria-hidden="true"] { pointer-events: none; }
.ariaui-web-popover-field-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 1rem; }
.ariaui-web-popover-field-row label { font-size: 0.875rem; font-weight: 500; line-height: 1; }
.ariaui-web-popover-field { grid-column: span 2 / span 2; height: 2rem; width: 100%; border: 1px solid var(--ariaui-web-popover-border); border-radius: 0.375rem; background: var(--ariaui-web-popover-background); padding: 0 0.75rem; color: var(--ariaui-web-popover-foreground); font: inherit; font-size: 0.875rem; }
.ariaui-web-popover-close { position: absolute; top: 0.75rem; right: 0.75rem; display: inline-flex; height: 1.5rem; width: 1.5rem; align-items: center; justify-content: center; border: 0; border-radius: 0.125rem; background: transparent; color: var(--ariaui-web-popover-muted-foreground); opacity: 0.8; cursor: pointer; }
.ariaui-web-popover-close:hover { opacity: 1; }
.ariaui-web-popover-arrow { position: absolute; color: var(--ariaui-web-popover-surface); }
.ariaui-web-popover-arrow svg { display: block; width: 0.75rem; height: 0.375rem; fill: currentColor; stroke: var(--ariaui-web-popover-border); }
.ariaui-web-popover-content[data-side="bottom"] > [data-popover-arrow] { top: -0.375rem; left: 50%; transform: translateX(-50%); }
.ariaui-web-popover-content[data-side="top"] > [data-popover-arrow] { bottom: -0.375rem; left: 50%; transform: translateX(-50%) rotate(180deg); }
.ariaui-web-popover-content[data-side="right"] > [data-popover-arrow] { top: 50%; left: -0.5625rem; transform: translateY(-50%) rotate(-90deg); }
.ariaui-web-popover-content[data-side="left"] > [data-popover-arrow] { top: 50%; right: -0.5625rem; transform: translateY(-50%) rotate(90deg); }
.ariaui-web-popover-motion-stack { display: grid; gap: 0.75rem; }
.ariaui-web-popover-motion-header { display: flex; align-items: flex-start; gap: 0.75rem; padding-right: 2rem; }
.ariaui-web-popover-motion-icon-shell { display: flex; width: 2rem; height: 2rem; flex: 0 0 auto; align-items: center; justify-content: center; margin-top: 0.125rem; border: 1px solid var(--ariaui-web-popover-border); border-radius: 0.375rem; background: var(--ariaui-web-popover-accent); color: var(--ariaui-web-popover-muted-foreground); }
.ariaui-web-popover-motion-icon-shell svg, .ariaui-web-popover-motion-item svg { width: 1rem; height: 1rem; }
.ariaui-web-popover-motion-list { display: grid; gap: 0.5rem; }
.ariaui-web-popover-motion-item { display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--ariaui-web-popover-border); border-radius: 0.375rem; background: var(--ariaui-web-popover-background); padding: 0.5rem 0.75rem; color: var(--ariaui-web-popover-foreground); font-size: 0.875rem; }
.ariaui-web-popover-motion-item svg { color: var(--vp-c-green-1, #16a34a); }
```

- [ ] **Step 5: Run docs structure tests and verify GREEN**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Popover"
```

Expected: source structure, both preview variants, content, values, and style assertions PASS.

- [ ] **Step 6: Commit the page slice without staging Pagination work**

```bash
git add web/doc/docs/components/popover.md
git add -p web/doc/docs/.vitepress/theme/style.css
git add -p web/doc/__test__/docs.test.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "docs(popover): match source page and examples"
```

### Task 8: Use real Framer Motion only in documentation

**Files:**
- Modify: `web/doc/package.json`
- Modify: `pnpm-lock.yaml`
- Create: `web/doc/docs/.vitepress/theme/popover-examples.ts`
- Create: `web/doc/__test__/popover-examples.test.ts`
- Modify: `web/doc/docs/.vitepress/theme/index.ts`
- Modify: `web/doc/__test__/docs.test.ts`

- [ ] **Step 1: Add failing dependency-boundary and installer tests**

Add:

```ts
it("keeps Framer Motion inside Popover documentation", () => {
  const docsPackage = JSON.parse(readDoc("../package.json")) as { dependencies?: Record<string, string> };
  const popoverPackage = JSON.parse(readFileSync(join(process.cwd(), "packages/popover/package.json"), "utf8")) as { dependencies?: Record<string, string> };
  const popoverSource = ["popover-actions.ts", "popover-dom.ts", "popover-element.ts", "popover-focus.ts", "popover-position.ts", "popover-sync.ts"]
    .map((file) => readFileSync(join(process.cwd(), "packages/popover/src", file), "utf8"))
    .join("\n");
  const installer = readDoc(".vitepress/theme/popover-examples.ts");
  const theme = readDoc(".vitepress/theme/index.ts");
  expect(docsPackage.dependencies?.["framer-motion"]).toBe("^12.38.0");
  expect(popoverPackage.dependencies?.["framer-motion"]).toBeUndefined();
  expect(popoverPackage.dependencies?.react).toBeUndefined();
  expect(popoverSource).not.toMatch(/framer-motion|react-dom|from ["']react["']/);
  expect(installer).toContain('from "framer-motion/dom"');
  expect(installer).toContain("animate(");
  expect(installer).toContain("prefers-reduced-motion: reduce");
  expect(theme).toContain('import { installPopoverExamples } from "./popover-examples";');
  expect(theme).toContain("installPopoverExamples();");
});
```

Create `web/doc/__test__/popover-examples.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { definePopoverElements } from "@ariaui-web/popover";
import { afterEach, describe, expect, it, vi } from "vitest";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn(() => ({})) }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

import { installPopoverExamples } from "../docs/.vitepress/theme/popover-examples";

type RuntimePopoverElement = HTMLElement & { open: boolean };

function popoverPreviews() {
  const doc = readFileSync(join(process.cwd(), "web/doc/docs/components/popover.md"), "utf8");
  const previews: Array<{ className: string; variant: string; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="popover" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);
    previews.push({ className: match[1] ?? "", variant: match[2] ?? "", markup: doc.slice(start, end).trim() });
  }
  return previews;
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  animateMock.mockClear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("Popover live examples", () => {
  it("opens, edits, dismisses, restores focus, and animates with the source values", async () => {
    definePopoverElements();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: false })),
    });
    document.body.innerHTML = popoverPreviews()
      .map((preview) => `<div class="${preview.className}" data-component="popover" data-example-variant="${preview.variant}">\n${preview.markup}\n</div>`)
      .join("\n");
    installPopoverExamples(document);

    const roots = Array.from(document.querySelectorAll("aria-popover")) as RuntimePopoverElement[];
    expect(roots).toHaveLength(2);

    const defaultRoot = roots[0]!;
    const defaultTrigger = defaultRoot.querySelector<HTMLElement>("aria-popover-trigger")!;
    const defaultContent = defaultRoot.querySelector<HTMLElement>("aria-popover-content")!;
    defaultTrigger.click();
    await flush();
    expect(defaultRoot.open).toBe(true);
    expect(defaultTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(defaultContent.getAttribute("role")).toBe("dialog");
    const width = defaultContent.querySelector<HTMLInputElement>("#popover-width")!;
    expect(document.activeElement).toBe(width);
    width.value = "80%";
    expect(width.value).toBe("80%");
    defaultContent.querySelector<HTMLElement>("aria-popover-close")!.click();
    await flush();
    expect(defaultRoot.open).toBe(false);
    expect(document.activeElement).toBe(defaultTrigger);

    defaultTrigger.click();
    await flush();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();
    expect(defaultRoot.open).toBe(false);

    defaultTrigger.click();
    await flush();
    defaultContent.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await flush();
    expect(defaultRoot.open).toBe(false);
    expect(document.activeElement).toBe(defaultTrigger);

    const motionRoot = roots[1]!;
    const motionTrigger = motionRoot.querySelector<HTMLElement>("aria-popover-trigger")!;
    const motionContent = motionRoot.querySelector<HTMLElement>("aria-popover-content")!;
    motionTrigger.click();
    await flush();
    expect(motionRoot.open).toBe(true);
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
      { duration: 0.18, ease: "easeOut" },
    );
    motionContent.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await flush();
    expect(motionRoot.open).toBe(false);
    expect(motionContent.hidden).toBe(false);
    expect(motionContent.getAttribute("aria-hidden")).toBe("true");
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [1, 0], y: [0, 8], scale: [1, 0.96] },
      { duration: 0.18, ease: "easeOut" },
    );

    animateMock.mockClear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    });
    motionTrigger.click();
    await flush();
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [0, 1] },
      { duration: 0, ease: "easeOut" },
    );
  });
});
```

- [ ] **Step 2: Run the boundary test and verify RED**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Framer Motion inside Popover"
pnpm exec vitest run web/doc/__test__/popover-examples.test.ts
```

Expected: both commands FAIL because the docs dependency and installer do not exist yet.

- [ ] **Step 3: Install Framer Motion in docs only**

Run:

```bash
pnpm --filter @ariaui-web/doc add framer-motion@^12.38.0
```

Verify `web/doc/package.json` contains the dependency and `packages/popover/package.json` is unchanged except for `@ariaui-web/position`.

- [ ] **Step 4: Create the Popover example installer**

Create `web/doc/docs/.vitepress/theme/popover-examples.ts`:

```ts
import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();
const boundRoots = new WeakSet<HTMLElement>();

type OpenChangeEvent = CustomEvent<{ open: boolean }>;

function motionRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="popover"][data-example-variant="framer-motion"] aria-popover',
  ));
}

function animateMotionPopover(root: HTMLElement, open: boolean) {
  const content = root.querySelector<HTMLElement>("aria-popover-content");
  if (!content) return;
  const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  content.style.pointerEvents = open ? "" : "none";
  if (reduced) content.style.transform = "";
  const keyframes = reduced
    ? { opacity: open ? [0, 1] : [1, 0] }
    : {
        opacity: open ? [0, 1] : [1, 0],
        y: open ? [8, 0] : [0, 8],
        scale: open ? [0.96, 1] : [1, 0.96],
      };
  void animate(content, keyframes, { duration: reduced ? 0 : 0.18, ease: "easeOut" });
}

export function syncPopoverExamples(doc: Document = document) {
  for (const root of motionRoots(doc)) {
    if (boundRoots.has(root)) continue;
    boundRoots.add(root);
    root.addEventListener("openchange", (event) => {
      const open = (event as OpenChangeEvent).detail.open;
      queueMicrotask(() => animateMotionPopover(root, open));
    });
    const initiallyOpen = root.hasAttribute("open");
    if (initiallyOpen) animateMotionPopover(root, true);
    else {
      const content = root.querySelector<HTMLElement>("aria-popover-content");
      if (content) {
        const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        content.style.opacity = "0";
        content.style.transform = reduced ? "" : "translateY(8px) scale(0.96)";
        content.style.pointerEvents = "none";
      }
    }
  }
}

export function installPopoverExamples(doc: Document = document) {
  syncPopoverExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  new MutationObserver(() => syncPopoverExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
```

Use the verified `framer-motion/dom` export from version 12.38.0; do not import `motion/react` or any React entry point.

Patch `web/doc/docs/.vitepress/theme/index.ts` to import and call `installPopoverExamples()` immediately beside the existing Pagination installer, preserving all Pagination lines.

- [ ] **Step 5: Run docs tests, type checking, and build**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "Popover"
pnpm exec vitest run web/doc/__test__/popover-examples.test.ts
pnpm --filter @ariaui-web/doc lint
pnpm --filter @ariaui-web/doc build
```

Expected: all commands exit 0; VitePress bundles the real Framer Motion import.

- [ ] **Step 6: Commit docs-only motion integration**

```bash
git add web/doc/package.json pnpm-lock.yaml web/doc/docs/.vitepress/theme/popover-examples.ts web/doc/__test__/popover-examples.test.ts
git add -p web/doc/docs/.vitepress/theme/index.ts
git add -p web/doc/__test__/docs.test.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "docs(popover): animate example with Framer Motion"
```

### Task 9: Re-run generation after the source and documentation additions

**Files:**
- Verify only; the generator must leave every Popover path byte-for-byte unchanged.

- [ ] **Step 1: Create a fresh clean generator-review worktree**

The Task 6 worktree was removed before the docs tasks. Recreate it at the current commit:

```bash
git worktree add /home/neo/Projects/ariaui-web-popover-generator HEAD
```

Expected: the command exits 0 and the new worktree contains all committed package, docs, test, dependency, and generator changes without the primary workspace's Pagination edits.

- [ ] **Step 2: Run the required generator and inspect all output**

```bash
node /home/neo/Projects/ariaui-web-popover-generator/scripts/generate-from-ariaui.mjs
git -C /home/neo/Projects/ariaui-web-popover-generator status --short
git -C /home/neo/Projects/ariaui-web-popover-generator diff --stat
git -C /home/neo/Projects/ariaui-web-popover-generator diff
```

Expected: generation exits 0. Read the complete status and diff; no Popover runtime, tests, page, installer, package dependency, theme wiring, or source-parity metadata may be deleted or rewritten.

- [ ] **Step 3: Prove every Popover-owned generated path is idempotent**

```bash
git -C /home/neo/Projects/ariaui-web-popover-generator diff --exit-code HEAD -- packages/popover web/doc/docs/components/popover.md web/doc/docs/.vitepress/theme/popover-examples.ts web/doc/docs/.vitepress/theme/index.ts web/doc/docs/.vitepress/theme/style.css web/doc/__test__/docs.test.ts web/doc/__test__/popover-examples.test.ts web/doc/package.json
rg -n '"framer-motion": "\^12\.38\.0"' /home/neo/Projects/ariaui-web-popover-generator/web/doc/package.json
! rg -n "framer-motion|react-dom|from [\"']react[\"']" /home/neo/Projects/ariaui-web-popover-generator/packages/popover
```

Expected: the scoped `git diff --exit-code` returns 0, the docs manifest contains the exact dependency, and the negative package scan returns 0 because it finds nothing.

- [ ] **Step 4: Remove the review worktree and run focused plus broader verification**

```bash
git worktree remove --force /home/neo/Projects/ariaui-web-popover-generator
pnpm --filter @ariaui-web/popover test
pnpm --filter @ariaui-web/popover lint
pnpm --filter @ariaui-web/popover build
pnpm exec vitest run web/doc/__test__/docs.test.ts web/doc/__test__/popover-examples.test.ts
pnpm --filter @ariaui-web/doc lint
pnpm --filter @ariaui-web/doc build
pnpm test
```

Expected: worktree removal and every test, lint, and build command exit 0 with no failures.

- [ ] **Step 5: Confirm no generator follow-up commit is needed**

```bash
git status --short
```

Expected: the primary workspace shows the user's pre-existing Pagination changes and no new uncommitted Popover diff. Do not create a commit because the idempotence check proved the generator made no Popover diff.

### Task 10: Run browser visual comparison and final repository verification

**Files:**
- Modify only if a failing visual or interaction check produces a focused Popover fix.

- [ ] **Step 1: Start both documentation sites**

Run ariaui-web VitePress:

```bash
pnpm --dir web/doc dev --hostname 127.0.0.1 --port 4173
```

Run sibling AriaUI docs in another session:

```bash
pnpm --dir web/doc dev --hostname 127.0.0.1 --port 4174
```

Use working directories `/home/neo/Projects/ariaui-web` and `/home/neo/Projects/ariaui` respectively. Wait for both routes to return HTTP 200:

```text
http://127.0.0.1:4173/components/popover
http://127.0.0.1:4174/docs/components/popover
```

- [ ] **Step 2: Run desktop browser interaction and screenshot checks**

At 1440x1000 on both pages:

1. Confirm headings appear in identical order.
2. Open the Dimensions example by click and by Space.
3. Verify the panel is centered beneath Trigger, the arrow points at Trigger, and viewport scrolling does not detach the panel.
4. Focus and edit all four fields.
5. Verify Close, outside mouse, and Escape dismiss and restore Trigger focus.
6. Open Motion Popover and capture initial, open, and exit frames.
7. Confirm the motion panel contains the same icon, heading, description, and three status rows.
8. Save screenshots for the closed page, open default example, and open motion example from both sites.

Expected: no console errors; no clipped panel; no horizontal page overflow; matching content, spacing, typography, borders, colors, shadows, and control sizes.

- [ ] **Step 3: Run mobile, dark-mode, focus, and reduced-motion checks**

At 390x844:

1. Repeat default and motion open/close flows.
2. Confirm the 20rem/18rem panels fit within viewport padding and flip when needed.
3. Confirm visible focus rings for Trigger, every field, and Close.
4. Repeat one open screenshot in dark mode.
5. Emulate `prefers-reduced-motion: reduce`; verify the motion example uses opacity-only or immediate state and remains functional.

Expected: no horizontal overflow, offscreen content, hidden focus, or spatial reduced-motion animation.

- [ ] **Step 4: Apply TDD to every browser-discovered defect**

For each defect, first add the smallest failing package or docs test, run it to confirm the expected failure, apply the focused Popover fix, rerun the focused test, and repeat the affected browser check. Do not change Pagination files beyond preserving their existing content.

- [ ] **Step 5: Refresh graph and run final evidence commands**

Run:

```bash
graphify update .
pnpm --filter @ariaui-web/popover test
pnpm --filter @ariaui-web/popover lint
pnpm --filter @ariaui-web/popover build
pnpm exec vitest run web/doc/__test__/docs.test.ts web/doc/__test__/popover-examples.test.ts
pnpm --filter @ariaui-web/doc lint
pnpm --filter @ariaui-web/doc build
git diff --check
git status --short
```

Expected: graph refresh exits 0; all tests, lint checks, and builds exit 0; `git diff --check` reports no whitespace errors; status shows only intentional Popover changes plus the pre-existing Pagination work.

- [ ] **Step 6: Commit only final Popover fixes, if present**

```bash
git diff --name-only -- packages/popover scripts/generate-from-ariaui.mjs web/doc/docs/components/popover.md web/doc/docs/.vitepress/theme/popover-examples.ts web/doc/package.json pnpm-lock.yaml
git add packages/popover scripts/generate-from-ariaui.mjs web/doc/docs/components/popover.md web/doc/docs/.vitepress/theme/popover-examples.ts web/doc/package.json pnpm-lock.yaml
git add -p web/doc/docs/.vitepress/theme/index.ts
git add -p web/doc/docs/.vitepress/theme/style.css
git add -p web/doc/__test__/docs.test.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "fix(popover): resolve visual parity findings"
```

Skip this commit when browser QA requires no code change. Inspect every interactive hunk in the three shared docs files and answer `n` to Pagination hunks; never stage the user's Pagination work as part of this commit.
