# Command Native Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `@ariaui-web/command` into a browser-native command palette primitive whose package contract, runtime behavior, docs page, and live examples match the source AriaUI Command package.

**Architecture:** Keep common element reflection in `@ariaui-web/utils`, but move Command-specific behavior into package-local modules. `CommandWebElement` delegates to `command-sync` for DOM/state reflection and `command-actions` for input, pointer, and keyboard behavior. Docs use native custom element markup and VitePress-scoped CSS; a small `command-examples.ts` installer only mirrors controlled-example display state.

**Tech Stack:** TypeScript, browser-native custom elements, Vitest with jsdom, VitePress docs, generated package/docs artifacts from `scripts/generate-from-ariaui.mjs`, Playwright/browser visual verification.

---

## Working Context

- Worktree: `/home/neo/Projects/ariaui-web/.worktrees/command-native-parity`
- Approved spec: `docs/superpowers/specs/2026-07-15-command-native-parity-design.md`
- Source package: `/home/neo/Projects/ariaui/packages/command`
- Source docs page: `/home/neo/Projects/ariaui/web/doc/src/app/docs/components/command/page.md`
- Baseline command tests: `pnpm --filter @ariaui-web/command test -- --run` passes 12/12 before this plan starts.
- Do not edit unrelated Pagination files or the dirty main checkout.
- After source package or docs additions, run `node scripts/generate-from-ariaui.mjs` and review generated changes before manual edits.

## File Structure

### Package Runtime

- Modify `packages/command/src/command-element.ts`
  - Keeps the element class and delegates lifecycle/attribute/action hooks to package-local modules.
- Create `packages/command/src/command-types.ts`
  - Shared Command state, item, group, filter, and event callback types.
- Create `packages/command/src/command-filter.ts`
  - `defaultCommandFilter`, `getCommandScore`, and `isCommandItemVisible`.
- Create `packages/command/src/command-dom.ts`
  - DOM queries, id helpers, boolean helpers, value/search helpers, and input text helpers.
- Create `packages/command/src/command-sync.ts`
  - Root sync state, registration, ARIA/data reflection, filtering, active option, group/empty/separator/loading visibility.
- Create `packages/command/src/command-actions.ts`
  - Input, click, pointer, and keydown handling plus value/search/select event dispatch.
- Modify `packages/command/src/index.ts`
  - Exports native `CommandFilter` and `defaultCommandFilter`.

### Generated Contract

- Modify `scripts/generate-from-ariaui.mjs`
  - Teach generated Command metadata/docs tests about Command-specific roles, default attributes, source parity, and docs examples.
- Modify generated `packages/command/src/component-spec.ts`
  - Produced by the generator.
- Modify generated `packages/command/readme.md`
  - Produced by the generator.

### Tests

- Modify `packages/command/__test__/command.test.ts`
  - Adds source-parity runtime tests using custom elements directly.
- Modify `packages/command/__test__/component.spec.test.ts`
  - Locks Command readme/spec/runtime local-module expectations.
- Modify `web/doc/__test__/docs.test.ts`
  - Locks Command page structure, live examples, CSS, and optional installer wiring.

### Docs

- Modify `web/doc/docs/components/command.md`
  - Source-equivalent page structure and native examples.
- Modify `web/doc/docs/.vitepress/theme/style.css`
  - Scoped Command example styles.
- Modify `web/doc/docs/.vitepress/theme/index.ts`
  - Import/install `command-examples.ts` only if Task 5 adds that helper.
- Create `web/doc/docs/.vitepress/theme/command-examples.ts`
  - Syncs controlled example selected-value display if needed by docs markup.

## Task 1: Generated Command Contract Parity

**Files:**
- Modify: `packages/command/__test__/component.spec.test.ts`
- Modify: `web/doc/__test__/docs.test.ts`
- Modify: `scripts/generate-from-ariaui.mjs`
- Generated: `packages/command/src/component-spec.ts`
- Generated: `packages/command/readme.md`

- [ ] **Step 1: Write failing package contract tests**

Append these Command-specific assertions to `packages/command/__test__/component.spec.test.ts` inside the existing `describe("@ariaui-web/command readme", () => { ... })` block:

```ts
  it("declares command source-parity roles and native state attributes", () => {
    const parts = Object.fromEntries(componentSpec.parts.map((part) => [part.name, part]));

    expect(parts.Root?.defaultRole).toBeNull();
    expect(parts.Root?.defaultAttributes).toMatchObject({ tabindex: "-1" });
    expect(parts.Input?.defaultRole).toBe("combobox");
    expect(parts.Input?.defaultAttributes).toMatchObject({
      "aria-autocomplete": "list",
      "aria-expanded": "true",
      tabindex: "0",
    });
    expect(parts.Content?.defaultRole).toBe("listbox");
    expect(parts.Content?.defaultAttributes).toMatchObject({ tabindex: "-1" });
    expect(parts.Empty?.defaultRole).toBe("presentation");
    expect(parts.Loading?.defaultRole).toBe("progressbar");
    expect(parts.Option?.defaultRole).toBe("option");
    expect(parts.Separator?.defaultRole).toBe("separator");

    expect(componentSpec.requirementAttributes).toEqual(expect.arrayContaining([
      "aria-activedescendant",
      "aria-autocomplete",
      "aria-controls",
      "aria-expanded",
      "aria-selected",
      "data-disabled",
      "data-selected",
      "data-value",
      "default-search-value",
      "disable-pointer-selection",
      "force-mount",
      "search-value",
      "should-filter",
    ]));
  });

  it("documents source test parity for native command behavior", () => {
    const parity = componentSpec.sourceTestParity;

    expect(parity).toMatchObject({
      sourcePackage: "../ariaui/packages/command",
    });
    expect(parity.sourceFiles).toEqual(expect.arrayContaining([
      "../ariaui/packages/command/__test__/command.test.tsx",
      "../ariaui/packages/command/readme.md",
      "../ariaui/web/doc/src/components/command/CommandExample.tsx",
      "../ariaui/web/doc/src/markdoc/partials/command/examples.md",
    ]));
    expect(parity.nativeRequirements).toEqual(expect.arrayContaining([
      "command root owns selected value, search value, active option, filtering, registration, and keyboard shortcuts",
      "command input exposes combobox semantics and syncs native search value",
      "command options filter by value and keywords and expose data-selected, data-disabled, and data-value",
      "docs page uses source-equivalent Features, Installation, Examples, Anatomy, API Reference, Keyboard Interactions, and Accessibility structure",
    ]));
  });
```

- [ ] **Step 2: Write failing docs contract tests**

In `web/doc/__test__/docs.test.ts`, add a Command-specific docs test near the other source-parity docs tests:

```ts
  it("keeps the Command docs page aligned with the source command page structure", () => {
    const doc = readDoc("components/command.md");
    const headings = Array.from(doc.matchAll(/^## (.+)$/gm)).map((match) => match[1]);

    expect(headings).toEqual([
      "Features",
      "Installation",
      "Examples",
      "Anatomy",
      "API Reference",
      "Keyboard Interactions",
      "Accessibility",
    ]);
    expect(doc).toContain('data-component="command"');
    expect(doc).toContain('data-example-variant="default"');
    expect(doc).toContain('data-example-variant="controlled"');
    expect(doc).toContain("<aria-command");
    expect(doc).toContain("<aria-command-input");
    expect(doc).toContain("<aria-command-option");
    expect(doc).not.toContain("Web Component Contract");
    expect(doc).not.toContain('data-example-part="Root">Root</aria-command>');
  });
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/component.spec.test.ts
pnpm --dir web/doc exec vitest run __test__/docs.test.ts --run
```

Expected: the package test fails because `sourceTestParity` and Command-specific roles/default attributes are missing or wrong; the docs test fails because `command.md` still has the generic generated page.

- [ ] **Step 4: Update generator metadata**

In `scripts/generate-from-ariaui.mjs`, add Command-specific role/default handling where package/part roles are defined:

```js
const defaultAttributesByPackagePart = new Map([
  ["command:Root", { tabindex: "-1" }],
  ["command:Input", {
    "aria-autocomplete": "list",
    "aria-expanded": "true",
    tabindex: "0",
  }],
  ["command:Content", { tabindex: "-1" }],
  ["command:Option", { "aria-selected": "false", tabindex: "-1" }],
  ["command:Loading", {
    "aria-valuemin": "0",
    "aria-valuemax": "100",
  }],
]);
```

If `defaultAttributesByPackagePart` already exists, merge these entries into it instead of creating a duplicate map.

Add these role overrides to `roleByPackagePart`:

```js
["command:Root", null],
["command:Input", "combobox"],
["command:Content", "listbox"],
["command:Empty", "presentation"],
["command:Group", "group"],
["command:Label", null],
["command:Loading", "progressbar"],
["command:Option", "option"],
["command:Separator", "separator"],
```

Add Command-specific source parity metadata in the same structure used by Card, Carousel, Checkbox, Grid, and Calendar:

```js
command: {
  sourcePackage: "../ariaui/packages/command",
  sourceFiles: [
    "../ariaui/packages/command/__test__/command.test.tsx",
    "../ariaui/packages/command/readme.md",
    "../ariaui/web/doc/src/components/command/CommandExample.tsx",
    "../ariaui/web/doc/src/markdoc/partials/command/examples.md",
  ],
  nativeRequirements: [
    "command root owns selected value, search value, active option, filtering, registration, and keyboard shortcuts",
    "command input exposes combobox semantics and syncs native search value",
    "command options filter by value and keywords and expose data-selected, data-disabled, and data-value",
    "docs page uses source-equivalent Features, Installation, Examples, Anatomy, API Reference, Keyboard Interactions, and Accessibility structure",
  ],
}
```

- [ ] **Step 5: Regenerate and inspect**

Run:

```bash
node scripts/generate-from-ariaui.mjs
git diff -- packages/command/src/component-spec.ts packages/command/readme.md scripts/generate-from-ariaui.mjs web/doc/__test__/docs.test.ts
```

Expected: generated Command spec/readme now include Command-specific roles/default attributes and source parity metadata. If generator rewrites unrelated files, review them and keep only expected generated changes.

- [ ] **Step 6: Run GREEN checks**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/component.spec.test.ts
pnpm --dir web/doc exec vitest run __test__/docs.test.ts --run
```

Expected: package contract test passes; docs test may still fail only on the actual `command.md` page structure until Task 5. Record that expected docs failure in the handoff.

- [ ] **Step 7: Commit Task 1**

Commit only Task 1 files:

```bash
git add scripts/generate-from-ariaui.mjs packages/command/src/component-spec.ts packages/command/readme.md packages/command/__test__/component.spec.test.ts web/doc/__test__/docs.test.ts
git commit -m "test(command): lock native source parity contract"
```

## Task 2: Command State, Input, and Filtering Foundation

**Files:**
- Modify: `packages/command/__test__/command.test.ts`
- Modify: `packages/command/src/command-element.ts`
- Modify: `packages/command/src/index.ts`
- Create: `packages/command/src/command-types.ts`
- Create: `packages/command/src/command-filter.ts`
- Create: `packages/command/src/command-dom.ts`
- Create: `packages/command/src/command-sync.ts`

- [ ] **Step 1: Write failing tests for native anatomy and state separation**

Append this test block to `packages/command/__test__/command.test.ts`:

```ts
type CommandRootElement = HTMLElement & {
  value: string;
  searchValue: string;
  filter?: (value: string, search: string, keywords?: string[]) => boolean | number;
  syncCommandTreeFromRoot?: () => void;
};

function setupBasicCommand() {
  defineCommandElements();
  document.body.innerHTML = `
    <aria-command label="Command menu">
      <aria-command-input placeholder="Search commands"></aria-command-input>
      <aria-command-content>
        <aria-command-empty>No commands found.</aria-command-empty>
        <aria-command-group heading="Fruits">
          <aria-command-option value="Apple">Apple</aria-command-option>
          <aria-command-option value="Banana" keywords="yellow,fruit">Banana</aria-command-option>
          <aria-command-option value="Cherry">Cherry</aria-command-option>
        </aria-command-group>
      </aria-command-content>
    </aria-command>
  `;

  return {
    root: document.querySelector("aria-command") as CommandRootElement,
    input: document.querySelector("aria-command-input") as HTMLElement & { value: string },
    content: document.querySelector("aria-command-content") as HTMLElement,
    options: Array.from(document.querySelectorAll("aria-command-option")) as HTMLElement[],
    empty: document.querySelector("aria-command-empty") as HTMLElement,
    group: document.querySelector("aria-command-group") as HTMLElement,
  };
}

describe("@ariaui-web/command source parity", () => {
  it("renders combobox/listbox anatomy and keeps selected value separate from search value", () => {
    const { root, input, content, options, empty, group } = setupBasicCommand();

    expect(root.getAttribute("tabindex")).toBe("-1");
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(content.id);
    expect(input.getAttribute("contenteditable")).toBe("plaintext-only");
    expect(content.getAttribute("role")).toBe("listbox");
    expect(content.getAttribute("aria-label")).toBe("Suggestions");
    expect(group.getAttribute("role")).toBe("group");
    expect(empty.hidden).toBe(true);

    root.value = "Apple";
    input.textContent = "ban";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "n" }));

    expect(root.value).toBe("Apple");
    expect(root.searchValue).toBe("ban");
    expect(input.value).toBe("ban");
    expect(options.map((option) => [option.textContent?.trim(), option.hidden])).toEqual([
      ["Apple", true],
      ["Banana", false],
      ["Cherry", true],
    ]);
  });

  it("supports default values, controlled search attributes, custom filters, and keywords", () => {
    defineCommandElements();
    document.body.innerHTML = `
      <aria-command default-value="Cherry" default-search-value="fruit">
        <aria-command-input placeholder="Search commands"></aria-command-input>
        <aria-command-content>
          <aria-command-option value="Apple">Apple</aria-command-option>
          <aria-command-option value="Banana" keywords="yellow,fruit">Banana</aria-command-option>
          <aria-command-option value="Cherry">Cherry</aria-command-option>
        </aria-command-content>
      </aria-command>
    `;

    const root = document.querySelector("aria-command") as CommandRootElement;
    const input = document.querySelector("aria-command-input") as HTMLElement & { value: string };
    const options = Array.from(document.querySelectorAll("aria-command-option")) as HTMLElement[];
    const filterCalls: Array<[string, string, string[]]> = [];

    root.filter = (value, search, keywords = []) => {
      filterCalls.push([value, search, keywords]);
      return [value, ...keywords].join(" ").toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
    };
    root.syncCommandTreeFromRoot?.();

    expect(root.value).toBe("Cherry");
    expect(root.searchValue).toBe("fruit");
    expect(input.value).toBe("fruit");
    expect(options.find((option) => option.getAttribute("value") === "Banana")?.hidden).toBe(false);
    expect(filterCalls).toContainEqual(["Banana", "fruit", ["yellow", "fruit"]]);

    root.setAttribute("should-filter", "false");
    root.searchValue = "zzz";
    expect(options.every((option) => option.hidden === false)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/command.test.ts
```

Expected: tests fail because `searchValue`, contenteditable input sync, filtering, hidden empty state, and custom filter support do not exist yet.

- [ ] **Step 3: Add shared Command types**

Create `packages/command/src/command-types.ts`:

```ts
export type CommandFilter = (
  value: string,
  search: string,
  keywords?: string[],
) => boolean | number;

export type CommandItemRecord = {
  disabled: boolean;
  element: HTMLElement;
  forceMount: boolean;
  groupId: string | null;
  id: string;
  keywords: string[];
  onSelect?: (value: string) => void;
  value: string;
};

export type CommandGroupRecord = {
  element: HTMLElement;
  forceMount: boolean;
  headingId: string | null;
  id: string;
};

export type CommandRootState = {
  activeId: string | null;
  defaultSearchValueApplied: boolean;
  defaultValueApplied: boolean;
  groups: Map<string, CommandGroupRecord>;
  items: Map<string, CommandItemRecord>;
  labelId: string | null;
  syncing: boolean;
};

export type CommandRootElement = HTMLElement & {
  filter?: CommandFilter;
  onSearchValueChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  searchValue: string;
  value: string;
};

export type CommandOptionElement = HTMLElement & {
  onSelect?: (value: string) => void;
};
```

- [ ] **Step 4: Add filter helpers**

Create `packages/command/src/command-filter.ts`:

```ts
import type { CommandFilter, CommandItemRecord } from "./command-types";

export const defaultCommandFilter: CommandFilter = (value, search, keywords = []) => {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) {
    return 1;
  }

  return [value, ...keywords].join(" ").toLowerCase().includes(normalizedSearch) ? 1 : 0;
};

export function getCommandScore(filter: CommandFilter, item: CommandItemRecord, search: string) {
  const result = filter(item.value, search, item.keywords);
  return typeof result === "number" ? result : result ? 1 : 0;
}

export function isCommandItemVisible(
  item: CommandItemRecord,
  searchValue: string,
  shouldFilter: boolean,
  filter: CommandFilter,
) {
  if (item.forceMount) {
    return true;
  }

  if (!shouldFilter || !searchValue) {
    return true;
  }

  return getCommandScore(filter, item, searchValue) > 0;
}
```

- [ ] **Step 5: Add DOM helpers**

Create `packages/command/src/command-dom.ts` with these exports:

```ts
let commandId = 0;

export function commandPartName(element: Element) {
  return element.getAttribute("data-part") ?? "";
}

export function commandRoot(element: Element | null) {
  return element?.closest("aria-command") ?? null;
}

export function commandInput(root: Element) {
  return root.querySelector<HTMLElement>(":scope > aria-command-input, aria-command-input");
}

export function commandContent(root: Element) {
  return root.querySelector<HTMLElement>(":scope > aria-command-content, aria-command-content");
}

export function commandOptions(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-option"));
}

export function commandGroups(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-group"));
}

export function commandEmptyElements(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-empty"));
}

export function commandSeparators(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-separator"));
}

export function commandLoadingElements(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-loading"));
}

export function ensureCommandId(element: HTMLElement, prefix: string) {
  if (!element.id) {
    commandId += 1;
    element.id = `aria-command-${prefix}-${commandId}`;
  }

  return element.id;
}

export function hasCommandBoolean(element: Element, kebab: string, camel = kebab.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())) {
  const kebabValue = element.getAttribute(kebab);
  const camelValue = element.getAttribute(camel);
  return element.hasAttribute(kebab) && kebabValue !== "false" || element.hasAttribute(camel) && camelValue !== "false";
}

export function setCommandBoolean(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export function commandValue(element: Element) {
  return element.getAttribute("value") ?? "";
}

export function commandSearchValue(root: Element) {
  return root.getAttribute("search-value") ?? root.getAttribute("searchValue") ?? "";
}

export function writeCommandSearchValue(root: Element, input: HTMLElement | null, value: string) {
  if (value) {
    root.setAttribute("search-value", value);
  } else {
    root.removeAttribute("search-value");
  }

  if (input) {
    writeCommandInputValue(input, value);
  }
}

export function commandInputValue(input: HTMLElement | null) {
  if (!input) {
    return "";
  }

  const nativeInput = input.querySelector("input");
  if (nativeInput instanceof HTMLInputElement) {
    return nativeInput.value;
  }

  if (input.isContentEditable || input.getAttribute("contenteditable")) {
    return input.textContent ?? "";
  }

  return input.getAttribute("value") ?? "";
}

export function writeCommandInputValue(input: HTMLElement, value: string) {
  const nativeInput = input.querySelector("input");
  if (nativeInput instanceof HTMLInputElement && nativeInput.value !== value) {
    nativeInput.value = value;
  }

  if (!(nativeInput instanceof HTMLInputElement) && (input.isContentEditable || input.getAttribute("contenteditable"))) {
    if (input.textContent !== value) {
      input.textContent = value;
    }
  }

  if (value) {
    input.setAttribute("value", value);
  } else {
    input.removeAttribute("value");
  }
}

export function commandOptionValue(option: HTMLElement) {
  return option.getAttribute("value") ?? option.dataset.value ?? option.textContent?.trim() ?? "";
}

export function commandOptionKeywords(option: HTMLElement) {
  const propertyValue = (option as HTMLElement & { keywords?: unknown }).keywords;
  if (Array.isArray(propertyValue)) {
    return propertyValue.map(String);
  }

  return (option.getAttribute("keywords") ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}
```

- [ ] **Step 6: Add sync foundation**

Create `packages/command/src/command-sync.ts` with root state, default value application, input/content sync, item registration, and filtering. Include these exported functions exactly:

```ts
import { defaultCommandFilter, isCommandItemVisible } from "./command-filter";
import {
  commandContent,
  commandEmptyElements,
  commandGroups,
  commandInput,
  commandLoadingElements,
  commandOptionKeywords,
  commandOptions,
  commandOptionValue,
  commandRoot,
  commandSearchValue,
  commandSeparators,
  commandValue,
  ensureCommandId,
  hasCommandBoolean,
  writeCommandInputValue,
  writeCommandSearchValue,
} from "./command-dom";
import type { CommandFilter, CommandGroupRecord, CommandItemRecord, CommandRootElement, CommandRootState } from "./command-types";

const commandStates = new WeakMap<HTMLElement, CommandRootState>();

export function commandState(root: HTMLElement) {
  let state = commandStates.get(root);
  if (!state) {
    state = {
      activeId: null,
      defaultSearchValueApplied: false,
      defaultValueApplied: false,
      groups: new Map<string, CommandGroupRecord>(),
      items: new Map<string, CommandItemRecord>(),
      labelId: null,
      syncing: false,
    };
    commandStates.set(root, state);
  }
  return state;
}

export function commandFilter(root: HTMLElement): CommandFilter {
  return (root as CommandRootElement).filter ?? defaultCommandFilter;
}

export function syncCommandTreeAround(element: HTMLElement) {
  const root = element.matches("aria-command") ? element : commandRoot(element);
  if (root instanceof HTMLElement) {
    syncCommandTreeFromRoot(root);
    return;
  }

  syncCommandStandalonePart(element);
}

export function syncCommandTreeFromRoot(root: HTMLElement) {
  const state = commandState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    const input = commandInput(root);
    const content = commandContent(root);
    applyCommandDefaults(root, input, state);
    syncCommandLabel(root, input, state);
    syncCommandInput(root, input, content, state);
    syncCommandContent(content, state);
    syncCommandItems(root, state);
    syncCommandGroups(root, state);
    syncCommandEmpty(root, state);
    syncCommandSeparators(root);
    syncCommandLoading(root);
  } finally {
    state.syncing = false;
  }
}

export function syncCommandStandalonePart(element: HTMLElement) {
  const part = element.getAttribute("data-part");
  if (part === "Input") {
    element.setAttribute("role", "combobox");
    element.setAttribute("aria-autocomplete", "list");
    element.setAttribute("aria-expanded", "true");
    if (!element.querySelector("input") && !element.hasAttribute("contenteditable")) {
      element.setAttribute("contenteditable", "plaintext-only");
    }
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
  }

  if (part === "Content") {
    element.setAttribute("role", "listbox");
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1");
    }
  }

  if (part === "Option") {
    syncCommandOptionElement(element, null, false);
  }
}
```

Implement the private helpers named above in the same file. Keep the helpers small and deterministic:

- `applyCommandDefaults(root, input, state)` applies `default-value` and `default-search-value` once.
- `syncCommandLabel(root, input, state)` creates one hidden `<label data-command-hidden-label>` and points input `aria-labelledby` at it.
- `syncCommandInput(root, input, content, state)` sets combobox ARIA, contenteditable, `tabindex`, and input text.
- `syncCommandItems(root, state)` rebuilds `state.items` from current DOM options, computes visibility, and reflects option attributes.
- `syncCommandGroups(root, state)` hides groups with zero visible children unless forced.
- `syncCommandEmpty(root, state)` hides empty parts unless total items are greater than zero and visible items are zero.
- `syncCommandSeparators(root)` hides separators while search is non-empty unless `always-render` or `alwaysRender` is present.
- `syncCommandLoading(root)` reflects progressbar label and progress.

- [ ] **Step 7: Wire element lifecycle and exports**

Modify `packages/command/src/command-element.ts`:

```ts
import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { syncCommandTreeAround, syncCommandTreeFromRoot } from "./command-sync";

export class CommandWebElement extends AriaWebElement {
  static override packageSlug = "command";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "always-render",
      "alwaysRender",
      "aria-label",
      "default-search-value",
      "defaultSearchValue",
      "disable-pointer-selection",
      "disablePointerSelection",
      "heading",
      "keywords",
      "label",
      "progress",
      "search-value",
      "searchValue",
      "should-filter",
      "shouldFilter",
    ]));
  }

  get searchValue() {
    return this.getAttribute("search-value") ?? this.getAttribute("searchValue") ?? "";
  }

  set searchValue(value: string) {
    if (value == null || value === "") {
      this.removeAttribute("search-value");
    } else {
      this.setAttribute("search-value", String(value));
    }
  }

  override afterAriaWebContractApplied() {
    syncCommandTreeAround(this);
  }

  syncCommandTreeFromRoot?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    if ((this.constructor as typeof CommandWebElement).partName === "Root") {
      this.syncCommandTreeFromRoot = () => syncCommandTreeFromRoot(this);
    }
  }

  disconnectedCallback() {
    if ((this.constructor as typeof CommandWebElement).partName === "Root") {
      delete this.syncCommandTreeFromRoot;
    }
  }
}

export function createCommandWebComponent(part: WebComponentPartSpec): typeof CommandWebElement {
  return class extends CommandWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
```

Modify `packages/command/src/index.ts`:

```ts
export { defaultCommandFilter } from "./command-filter";
export type { CommandFilter } from "./command-types";
```

Keep the existing exports intact.

- [ ] **Step 8: Run GREEN checks**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/command.test.ts
```

Expected: the new anatomy/state/filter tests pass, and existing Command tests remain green.

- [ ] **Step 9: Commit Task 2**

Commit only Task 2 files:

```bash
git add packages/command/__test__/command.test.ts packages/command/src/command-element.ts packages/command/src/index.ts packages/command/src/command-types.ts packages/command/src/command-filter.ts packages/command/src/command-dom.ts packages/command/src/command-sync.ts
git commit -m "feat(command): add native state and filtering"
```

## Task 3: Selection, Events, Pointer, and Keyboard Interaction

**Files:**
- Modify: `packages/command/__test__/command.test.ts`
- Modify: `packages/command/src/command-element.ts`
- Modify: `packages/command/src/command-actions.ts`
- Modify: `packages/command/src/command-sync.ts`

- [ ] **Step 1: Write failing interaction tests**

Append these tests to the `@ariaui-web/command source parity` describe block:

```ts
  it("selects with Enter, click, and option onSelect while dispatching native events", () => {
    const { root, input, options } = setupBasicCommand();
    const values: string[] = [];
    const searches: string[] = [];
    const selected: string[] = [];

    root.onValueChange = (value) => values.push(value);
    root.onSearchValueChange = (value) => searches.push(value);
    (options[1] as HTMLElement & { onSelect?: (value: string) => void }).onSelect = (value) => selected.push(value);
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent).detail.value));
    root.addEventListener("searchvaluechange", (event) => searches.push((event as CustomEvent).detail.value));
    root.addEventListener("commandselect", (event) => selected.push((event as CustomEvent).detail.value));

    input.textContent = "ban";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "n" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));

    expect(root.value).toBe("Banana");
    expect(values).toEqual(["Banana", "Banana"]);
    expect(searches).toEqual(["ban", "ban"]);
    expect(selected).toEqual(["Banana", "Banana"]);

    options[0].click();
    expect(root.value).toBe("Apple");
  });

  it("navigates visible enabled options with arrows, Home, End, vim keys, and loop", () => {
    const { root, input, options } = setupBasicCommand();
    options[1].setAttribute("disabled", "");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(options[0].getAttribute("aria-selected")).toBe("true");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(options[2].getAttribute("aria-selected")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    expect(options[0].getAttribute("aria-selected")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    expect(options[2].getAttribute("aria-selected")).toBe("true");

    root.setAttribute("loop", "");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "j", ctrlKey: true, bubbles: true, cancelable: true }));
    expect(options[0].getAttribute("aria-selected")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true }));
    expect(options[2].getAttribute("aria-selected")).toBe("true");
  });

  it("honors disabled, prevented events, pointer gating, and composition guards", () => {
    const { root, input, options } = setupBasicCommand();
    const values: string[] = [];
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent).detail.value));

    options[0].addEventListener("click", (event) => event.preventDefault());
    options[0].click();
    expect(values).toEqual([]);

    options[1].setAttribute("disabled", "");
    options[1].click();
    expect(values).toEqual([]);

    root.setAttribute("disable-pointer-selection", "");
    options[2].dispatchEvent(new MouseEvent("pointermove", { bubbles: true }));
    expect(options[2].getAttribute("aria-selected")).toBe("false");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", keyCode: 229, bubbles: true, cancelable: true }));
    expect(options.every((option) => option.getAttribute("aria-selected") === "false")).toBe(true);
  });
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/command.test.ts
```

Expected: tests fail because event dispatch, pointer activation, keyboard movement, and `onSelect` are not implemented.

- [ ] **Step 3: Add action handlers**

Create `packages/command/src/command-actions.ts`:

```ts
import {
  commandContent,
  commandInput,
  commandInputValue,
  commandOptionValue,
  commandRoot,
  commandSearchValue,
  hasCommandBoolean,
  writeCommandSearchValue,
} from "./command-dom";
import { commandState, syncCommandTreeFromRoot } from "./command-sync";
import type { CommandOptionElement, CommandRootElement } from "./command-types";

function enabledVisibleItems(root: HTMLElement) {
  return Array.from(commandState(root).items.values()).filter(
    (item) => !item.disabled && !item.element.hidden,
  );
}

function dispatchSearchValueChange(root: HTMLElement, value: string) {
  (root as CommandRootElement).onSearchValueChange?.(value);
  root.dispatchEvent(new CustomEvent("searchvaluechange", {
    bubbles: true,
    detail: { value },
  }));
}

function dispatchValueChange(root: HTMLElement, value: string) {
  (root as CommandRootElement).onValueChange?.(value);
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: { value },
  }));
}

function dispatchCommandSelect(root: HTMLElement, option: HTMLElement, value: string) {
  (option as CommandOptionElement).onSelect?.(value);
  root.dispatchEvent(new CustomEvent("commandselect", {
    bubbles: true,
    detail: { option, value },
  }));
}

export function setCommandActiveOption(root: HTMLElement, option: HTMLElement | null) {
  const state = commandState(root);
  state.activeId = option?.id ?? null;
  syncCommandTreeFromRoot(root);
  option?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
}

export function selectCommandOption(option: HTMLElement) {
  const root = commandRoot(option);
  if (!(root instanceof HTMLElement) || option.hasAttribute("disabled") || option.getAttribute("aria-disabled") === "true") {
    return false;
  }

  const value = commandOptionValue(option);
  const previous = root.getAttribute("value") ?? "";
  if (value) {
    root.setAttribute("value", value);
  } else {
    root.removeAttribute("value");
  }
  setCommandActiveOption(root, option);
  dispatchCommandSelect(root, option, value);
  if (previous !== value) {
    dispatchValueChange(root, value);
  }
  return true;
}

export function handleCommandInput(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || element.getAttribute("data-part") !== "Input") {
    return;
  }

  const root = commandRoot(element);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const value = commandInputValue(element);
  const state = commandState(root);
  state.activeId = null;
  writeCommandSearchValue(root, element, value);
  syncCommandTreeFromRoot(root);
  dispatchSearchValueChange(root, value);
}

export function handleCommandClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || element.getAttribute("data-part") !== "Option") {
    return;
  }

  if (!selectCommandOption(element)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

export function handleCommandPointerMove(element: HTMLElement, event: PointerEvent) {
  if (event.defaultPrevented || element.getAttribute("data-part") !== "Option") {
    return;
  }

  const root = commandRoot(element);
  if (!(root instanceof HTMLElement) || hasCommandBoolean(root, "disable-pointer-selection")) {
    return;
  }

  if (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
    return;
  }

  setCommandActiveOption(root, element);
}

export function moveCommandActive(root: HTMLElement, change: 1 | -1) {
  const items = enabledVisibleItems(root);
  if (items.length === 0) {
    return;
  }

  const state = commandState(root);
  const currentIndex = state.activeId ? items.findIndex((item) => item.id === state.activeId) : -1;
  const loop = hasCommandBoolean(root, "loop");
  let nextIndex: number | undefined;

  if (currentIndex === -1) {
    nextIndex = change === 1 ? 0 : loop ? items.length - 1 : undefined;
  } else {
    const candidate = currentIndex + change;
    if (candidate >= 0 && candidate < items.length) {
      nextIndex = candidate;
    } else if (loop) {
      nextIndex = candidate < 0 ? items.length - 1 : 0;
    }
  }

  if (nextIndex !== undefined) {
    setCommandActiveOption(root, items[nextIndex]?.element ?? null);
  }
}

export function setCommandActiveToIndex(root: HTMLElement, index: number) {
  const item = enabledVisibleItems(root)[index];
  if (item) {
    setCommandActiveOption(root, item.element);
  }
}

export function handleCommandKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229) {
    return;
  }

  const root = element.matches("aria-command") ? element : commandRoot(element);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  if (event.key === "ArrowDown" || event.ctrlKey && (event.key === "n" || event.key === "j")) {
    event.preventDefault();
    moveCommandActive(root, 1);
    return;
  }

  if (event.key === "ArrowUp" || event.ctrlKey && (event.key === "p" || event.key === "k")) {
    event.preventDefault();
    moveCommandActive(root, -1);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    setCommandActiveToIndex(root, 0);
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    setCommandActiveToIndex(root, enabledVisibleItems(root).length - 1);
    return;
  }

  if (event.key === "Enter") {
    const active = commandState(root).activeId;
    const option = active ? root.ownerDocument.getElementById(active) : null;
    if (option instanceof HTMLElement) {
      event.preventDefault();
      selectCommandOption(option);
    }
  }
}
```

- [ ] **Step 4: Wire actions in element class**

Modify `packages/command/src/command-element.ts` to import and call action handlers:

```ts
import {
  handleCommandClick,
  handleCommandInput,
  handleCommandKeyDown,
  handleCommandPointerMove,
} from "./command-actions";
```

In `connectedCallback`, add input and pointer listeners:

```ts
this.addEventListener("input", this.#handleCommandInput);
this.addEventListener("pointermove", this.#handleCommandPointerMove);
```

In `disconnectedCallback`, remove them:

```ts
this.removeEventListener("input", this.#handleCommandInput);
this.removeEventListener("pointermove", this.#handleCommandPointerMove);
```

Override handlers:

```ts
override handleAriaWebClick = (event: Event) => {
  handleCommandClick(this, event);
};

override handleAriaWebKeyDown = (event: KeyboardEvent) => {
  handleCommandKeyDown(this, event);
};

#handleCommandInput = (event: Event) => {
  handleCommandInput(this, event);
};

#handleCommandPointerMove = (event: PointerEvent) => {
  handleCommandPointerMove(this, event);
};
```

- [ ] **Step 5: Adjust sync for active option reflection**

In `packages/command/src/command-sync.ts`, ensure active state drives both input/content ARIA and option state:

```ts
const selected = state.activeId === option.id;
option.setAttribute("aria-selected", String(selected));
option.setAttribute("data-selected", String(selected));
option.setAttribute("tabindex", disabled ? "-1" : selected ? "0" : "-1");
```

When the active id no longer points to a visible enabled option, clear it:

```ts
if (state.activeId) {
  const active = state.items.get(state.activeId);
  if (!active || active.disabled || active.element.hidden) {
    state.activeId = null;
  }
}
```

- [ ] **Step 6: Run GREEN checks**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/command.test.ts
```

Expected: interaction tests and previous Task 2 tests pass.

- [ ] **Step 7: Commit Task 3**

Commit only Task 3 files:

```bash
git add packages/command/__test__/command.test.ts packages/command/src/command-element.ts packages/command/src/command-actions.ts packages/command/src/command-sync.ts
git commit -m "feat(command): add native command interactions"
```

## Task 4: Structural State Coverage and Full Package Verification

**Files:**
- Modify: `packages/command/__test__/command.test.ts`
- Modify: `packages/command/src/command-sync.ts`
- Modify: `packages/command/src/command-dom.ts`

- [ ] **Step 1: Write failing structural tests**

Append these tests:

```ts
  it("hides groups and separators while preserving forced content", () => {
    defineCommandElements();
    document.body.innerHTML = `
      <aria-command>
        <aria-command-input></aria-command-input>
        <aria-command-content>
          <aria-command-group heading="Actions" data-testid="actions">
            <aria-command-option value="Apple">Apple</aria-command-option>
          </aria-command-group>
          <aria-command-separator data-testid="separator"></aria-command-separator>
          <aria-command-separator always-render data-testid="forced-separator"></aria-command-separator>
          <aria-command-group heading="Forced" force-mount data-testid="forced">
            <aria-command-option value="Hidden" force-mount>Hidden</aria-command-option>
          </aria-command-group>
        </aria-command-content>
      </aria-command>
    `;

    const root = document.querySelector("aria-command") as HTMLElement & { searchValue: string };
    const actions = document.querySelector('[data-testid="actions"]') as HTMLElement;
    const separator = document.querySelector('[data-testid="separator"]') as HTMLElement;
    const forcedSeparator = document.querySelector('[data-testid="forced-separator"]') as HTMLElement;
    const forced = document.querySelector('[data-testid="forced"]') as HTMLElement;

    root.searchValue = "zzz";

    expect(actions.hidden).toBe(true);
    expect(separator.hidden).toBe(true);
    expect(forcedSeparator.hidden).toBe(false);
    expect(forced.hidden).toBe(false);
  });

  it("syncs Empty and Loading native presentation states", () => {
    defineCommandElements();
    document.body.innerHTML = `
      <aria-command>
        <aria-command-input></aria-command-input>
        <aria-command-content>
          <aria-command-empty>No commands found.</aria-command-empty>
          <aria-command-loading label="Loading commands" progress="42">Loading</aria-command-loading>
          <aria-command-option value="Apple">Apple</aria-command-option>
        </aria-command-content>
      </aria-command>
    `;

    const root = document.querySelector("aria-command") as HTMLElement & { searchValue: string };
    const empty = document.querySelector("aria-command-empty") as HTMLElement;
    const loading = document.querySelector("aria-command-loading") as HTMLElement;

    expect(empty.hidden).toBe(true);
    root.searchValue = "zzz";
    expect(empty.hidden).toBe(false);
    expect(empty.getAttribute("role")).toBe("presentation");

    expect(loading.getAttribute("role")).toBe("progressbar");
    expect(loading.getAttribute("aria-label")).toBe("Loading commands");
    expect(loading.getAttribute("aria-valuemin")).toBe("0");
    expect(loading.getAttribute("aria-valuemax")).toBe("100");
    expect(loading.getAttribute("aria-valuenow")).toBe("42");
  });
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run packages/command/__test__/command.test.ts
```

Expected: failures identify missing or partial group, separator, empty, or loading sync.

- [ ] **Step 3: Complete structural sync**

In `packages/command/src/command-sync.ts`, complete these helper behaviors:

```ts
function syncCommandGroups(root: HTMLElement, state: CommandRootState) {
  for (const group of commandGroups(root)) {
    const id = ensureCommandId(group, "group");
    const forceMount = hasCommandBoolean(group, "force-mount");
    const headingElement = group.querySelector<HTMLElement>("aria-command-label, [data-command-group-heading]");
    const heading = group.getAttribute("heading");

    if (headingElement) {
      group.setAttribute("aria-labelledby", ensureCommandId(headingElement, "label"));
    } else if (heading) {
      let generated = group.querySelector<HTMLElement>("[data-command-generated-heading]");
      if (!generated) {
        generated = group.ownerDocument.createElement("span");
        generated.dataset.commandGeneratedHeading = "true";
        generated.hidden = true;
        group.prepend(generated);
      }
      generated.textContent = heading;
      group.setAttribute("aria-labelledby", ensureCommandId(generated, "label"));
    } else {
      group.removeAttribute("aria-labelledby");
    }

    const childItems = Array.from(state.items.values()).filter((item) => item.groupId === id);
    group.hidden = !forceMount && childItems.length > 0 && childItems.every((item) => item.element.hidden);
  }
}

function syncCommandEmpty(root: HTMLElement, state: CommandRootState) {
  const totalCount = state.items.size;
  const visibleCount = Array.from(state.items.values()).filter((item) => !item.element.hidden).length;
  for (const empty of commandEmptyElements(root)) {
    empty.setAttribute("role", "presentation");
    empty.hidden = !(totalCount > 0 && visibleCount === 0);
  }
}

function syncCommandSeparators(root: HTMLElement) {
  const searching = commandSearchValue(root).length > 0;
  for (const separator of commandSeparators(root)) {
    separator.setAttribute("role", "separator");
    separator.hidden = searching && !hasCommandBoolean(separator, "always-render");
  }
}

function syncCommandLoading(root: HTMLElement) {
  for (const loading of commandLoadingElements(root)) {
    loading.setAttribute("role", "progressbar");
    loading.setAttribute("aria-valuemin", "0");
    loading.setAttribute("aria-valuemax", "100");
    loading.setAttribute("aria-label", loading.getAttribute("label") ?? loading.getAttribute("aria-label") ?? "Loading...");
    const progress = loading.getAttribute("progress");
    if (progress == null || progress === "") {
      loading.removeAttribute("aria-valuenow");
    } else {
      loading.setAttribute("aria-valuenow", progress);
    }
  }
}
```

Make sure `syncCommandItems` assigns `groupId` from the closest `aria-command-group` id and applies parent group `force-mount` to options without an explicit `force-mount`.

- [ ] **Step 4: Run full Command package checks**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run
pnpm exec tsc --noEmit -p packages/command/tsconfig.json --rootDir .
node --check scripts/generate-from-ariaui.mjs
node scripts/generate-from-ariaui.mjs
git diff --check
```

Expected: Command tests pass. TypeScript should pass from workspace root with `--rootDir .`. Generator run should be stable except for expected Command artifacts already in the branch.

- [ ] **Step 5: Commit Task 4**

Commit only Task 4 files and any generated Command drift from the generator run:

```bash
git add packages/command/__test__/command.test.ts packages/command/src/command-sync.ts packages/command/src/command-dom.ts packages/command/src/component-spec.ts packages/command/readme.md
git commit -m "feat(command): sync native structural states"
```

## Task 5: Source-Equivalent Command Docs and Live Examples

**Files:**
- Modify: `web/doc/__test__/docs.test.ts`
- Modify: `web/doc/docs/components/command.md`
- Modify: `web/doc/docs/.vitepress/theme/style.css`
- Modify: `web/doc/docs/.vitepress/theme/index.ts`
- Create: `web/doc/docs/.vitepress/theme/command-examples.ts`
- Modify: `scripts/generate-from-ariaui.mjs`

- [ ] **Step 1: Write failing docs example/style tests**

In `web/doc/__test__/docs.test.ts`, add:

```ts
  it("keeps generated Command live examples behaviorally rendered", () => {
    const doc = readDoc("components/command.md");
    const style = readDoc(".vitepress/theme/style.css");
    const theme = readDoc(".vitepress/theme/index.ts");

    expect(doc).toContain('class="ariaui-web-command-root"');
    expect(doc).toContain('class="ariaui-web-command-trigger"');
    expect(doc).toContain('class="ariaui-web-command-input"');
    expect(doc).toContain('class="ariaui-web-command-content"');
    expect(doc).toContain('class="ariaui-web-command-option"');
    expect(doc).toContain("Quick Actions");
    expect(doc).toContain("Views");
    expect(doc).toContain("No commands found.");
    expect(doc).toContain('data-command-selected-value');
    expect(style).toContain('.ariaui-web-preview[data-component="command"]');
    expect(style).toContain(".ariaui-web-command-root");
    expect(style).toContain(".ariaui-web-command-option[aria-selected=\"true\"]");
    expect(theme).toContain('import { installCommandExamples } from "./command-examples";');
    expect(theme).toContain("installCommandExamples();");
  });
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm --dir web/doc exec vitest run __test__/docs.test.ts --run
```

Expected: tests fail because the Command page is generic and no Command docs installer or scoped styles exist.

- [ ] **Step 3: Update generator for Command docs page**

In `scripts/generate-from-ariaui.mjs`, add a Command-specific `componentDocPage` branch, following the local patterns used by Grid, Calendar, Select, and Hover Card. The generated `web/doc/docs/components/command.md` must contain these sections in order:

```md
## Features

- Searchable command palette with combobox input semantics.
- DOM-order option registration with keyboard navigation.
- Grouped options, empty state, loading state, and separators.
- Controlled selected value and search value through native attributes, properties, and events.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/command
```

```bash [pnpm]
pnpm add @ariaui-web/command
```

```bash [yarn]
yarn add @ariaui-web/command
```

:::

```ts
import { defineCommandElements } from "@ariaui-web/command";

defineCommandElements();
```
```

Add generated examples with variants `default` and `controlled`. Use native custom element markup, not React.

- [ ] **Step 4: Add docs helper installer**

Create `web/doc/docs/.vitepress/theme/command-examples.ts`:

```ts
const installedCommandExampleDocuments = new WeakSet<Document>();

function commandExampleRoots(ownerDocument: Document) {
  return Array.from(ownerDocument.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="command"] aria-command'));
}

function syncCommandControlledExample(root: HTMLElement) {
  const output = root.closest(".ariaui-web-preview")?.querySelector<HTMLElement>("[data-command-selected-value]");
  if (!output) {
    return;
  }

  output.textContent = root.getAttribute("value") || "None";
}

export function syncCommandExamples(ownerDocument: Document = document) {
  for (const root of commandExampleRoots(ownerDocument)) {
    syncCommandControlledExample(root);
  }
}

export function installCommandExamples(ownerDocument: Document = document) {
  if (installedCommandExampleDocuments.has(ownerDocument)) {
    return;
  }

  installedCommandExampleDocuments.add(ownerDocument);
  ownerDocument.addEventListener("valuechange", () => syncCommandExamples(ownerDocument));
  ownerDocument.addEventListener("commandselect", () => syncCommandExamples(ownerDocument));

  const observer = new MutationObserver(() => syncCommandExamples(ownerDocument));
  observer.observe(ownerDocument.documentElement, {
    attributes: true,
    attributeFilter: ["value"],
    childList: true,
    subtree: true,
  });

  syncCommandExamples(ownerDocument);
}
```

Modify `web/doc/docs/.vitepress/theme/index.ts`:

```ts
import { installCommandExamples } from "./command-examples";
```

and call:

```ts
installCommandExamples();
```

- [ ] **Step 5: Add scoped Command CSS**

In `web/doc/docs/.vitepress/theme/style.css`, add a scoped section:

```css
.ariaui-web-preview[data-component="command"] {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  justify-content: center;
  overflow-x: auto;
  padding: 2.5rem 1.5rem;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="command"] * {
  box-sizing: border-box;
}

.ariaui-web-command-root {
  display: flex;
  width: min(100%, 32rem);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  box-shadow: 0 8px 24px rgb(0 0 0 / 10%);
}

.ariaui-web-command-trigger {
  display: flex;
  min-height: 3rem;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0.75rem;
}

.ariaui-web-command-icon {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: var(--vp-c-text-2);
}

.ariaui-web-command-input {
  min-width: 0;
  flex: 1 1 auto;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
}

.ariaui-web-command-input:empty::before {
  color: var(--vp-c-text-3);
  content: attr(placeholder);
}

.ariaui-web-command-content {
  display: block;
  padding: 0.25rem 0;
}

.ariaui-web-command-empty {
  display: block;
  padding: 1.5rem;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.ariaui-web-command-empty[hidden],
.ariaui-web-command-option[hidden],
.ariaui-web-command-group[hidden],
.ariaui-web-command-separator[hidden] {
  display: none !important;
}

.ariaui-web-command-group {
  display: block;
  padding: 0.25rem 0.5rem;
}

.ariaui-web-command-label {
  display: block;
  padding: 0.375rem 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
}

.ariaui-web-command-option {
  display: flex;
  width: 100%;
  min-height: 2.75rem;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.625rem 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
}

.ariaui-web-command-option[aria-selected="true"],
.ariaui-web-command-option[data-selected="true"] {
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
}

.ariaui-web-command-option[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
}

.ariaui-web-command-option-label {
  min-width: 0;
  flex: 1 1 auto;
}

.ariaui-web-command-shortcut {
  margin-left: auto;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  line-height: 1rem;
}

.ariaui-web-command-separator {
  display: block;
  height: 1px;
  margin: 0.25rem 0.5rem;
  background: var(--vp-c-divider);
}

.ariaui-web-command-controlled-state {
  margin-top: 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .ariaui-web-preview[data-component="command"] {
    padding: 1.5rem 1rem;
  }
}
```

- [ ] **Step 6: Regenerate and inspect**

Run:

```bash
node scripts/generate-from-ariaui.mjs
git diff -- web/doc/docs/components/command.md web/doc/docs/.vitepress/theme/style.css web/doc/docs/.vitepress/theme/index.ts web/doc/docs/.vitepress/theme/command-examples.ts web/doc/__test__/docs.test.ts scripts/generate-from-ariaui.mjs
```

Expected: `command.md` has the new page sections and native examples. `style.css` has scoped Command selectors. `index.ts` imports and installs Command examples. No unrelated Pagination changes appear in this worktree diff.

- [ ] **Step 7: Run docs GREEN checks**

Run:

```bash
pnpm --dir web/doc exec vitest run __test__/docs.test.ts --run
pnpm --filter doc build
```

Expected: docs tests and docs build pass.

- [ ] **Step 8: Commit Task 5**

Commit only Task 5 files:

```bash
git add scripts/generate-from-ariaui.mjs web/doc/__test__/docs.test.ts web/doc/docs/components/command.md web/doc/docs/.vitepress/theme/style.css web/doc/docs/.vitepress/theme/index.ts web/doc/docs/.vitepress/theme/command-examples.ts
git commit -m "docs(command): add native live examples"
```

## Task 6: Final Verification and Visual Testing

**Files:**
- No planned source edits unless verification reveals a defect.

- [ ] **Step 1: Run full scoped verification**

Run:

```bash
pnpm --filter @ariaui-web/command test -- --run
pnpm exec tsc --noEmit -p packages/command/tsconfig.json --rootDir .
pnpm --dir web/doc exec vitest run __test__/docs.test.ts --run
pnpm --filter doc build
node --check scripts/generate-from-ariaui.mjs
node scripts/generate-from-ariaui.mjs
git diff --check
git status --short
```

Expected:

- Command package tests pass.
- Workspace-root TypeScript command passes for the Command package.
- Docs tests pass.
- Docs build passes.
- Generator syntax passes.
- Generator run is stable.
- Diff check passes.
- Worktree is clean except for committed branch history.

- [ ] **Step 2: Launch docs dev server**

Run:

```bash
pnpm --dir web/doc dev --hostname 127.0.0.1 --port 3000
```

Leave the server running for browser checks. If port 3000 is busy, use 3001 and record the URL.

- [ ] **Step 3: Run browser visual checks**

Using Playwright/browser tooling, verify `http://127.0.0.1:3000/components/command`:

- desktop viewport around `1280x900`
- mobile viewport around `390x844`
- page has the section headings in order
- default command example is visible and styled like the source palette
- typing `zzz` into the command input shows `No commands found.`
- clearing search and typing `bud` leaves `Calculate budget` visible
- `ArrowDown` then `Enter` selects the active option
- controlled example updates `[data-command-selected-value]`
- there is no horizontal overflow on mobile
- browser console has no relevant errors

- [ ] **Step 4: Fix any visual/runtime defects with TDD**

For every defect found, add a focused failing test first in one of these files:

- package runtime defect: `packages/command/__test__/command.test.ts`
- docs contract/style defect: `web/doc/__test__/docs.test.ts`
- docs helper defect: add focused assertions to `web/doc/__test__/docs.test.ts`

Run the failing test, fix the defect, rerun the focused test, rerun the visual step that found the defect, then commit:

```bash
git add <changed-files>
git commit -m "fix(command): address visual verification defect"
```

- [ ] **Step 5: Final review**

Request final review for the full implementation range:

```bash
BASE_SHA=$(git rev-parse f6d5e26)
HEAD_SHA=$(git rev-parse HEAD)
git diff --stat "$BASE_SHA..$HEAD_SHA"
```

Reviewer scope:

- Verify implementation matches `docs/superpowers/specs/2026-07-15-command-native-parity-design.md`.
- Verify all source-parity runtime behavior is covered.
- Verify docs page structure and live examples match the source Command page style and function.
- Verify no unrelated packages or Pagination files changed.
- Verify visual testing evidence is recorded.

Fix Critical and Important findings before finishing.

- [ ] **Step 6: Finish branch**

After review approval and passing verification, use `finishing-a-development-branch` to present merge/PR/keep/discard options.
