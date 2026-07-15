# Combobox Arrow Button Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the combobox Input focused after an arrow-button mouse activation opens or closes the popup, without changing Trigger, keyboard, or programmatic-click focus behavior.

**Architecture:** Add a small package-level focus helper and call it only from the existing `aria-combobox-button` mouse-down toggle path. Prove the behavior first with package regression tests, then exercise the same interaction against all live documentation example markup in a dedicated test file so the unrelated dirty shared docs test remains untouched.

**Tech Stack:** TypeScript, browser-native custom elements, DOM focus APIs, Vitest, JSDOM, VitePress documentation markup.

---

## File Structure

- Modify `packages/combobox/__test__/combobox.test.ts`: package regression coverage for mouse open/close focus, disabled/missing Input guards, and unchanged non-mouse focus behavior.
- Modify `packages/combobox/src/combobox-actions.ts`: synchronously focus the enabled Input after the Button mouse-down path toggles Root state.
- Create `web/doc/__test__/combobox-focus.test.ts`: focused acceptance coverage that extracts every live combobox example and activates its actual arrow button.
- Do not modify `web/doc/__test__/docs.test.ts`: it contains unrelated in-progress pagination work.

### Task 1: Add failing package regressions

**Files:**
- Modify: `packages/combobox/__test__/combobox.test.ts:64-66`
- Modify: `packages/combobox/__test__/combobox.test.ts:91-177`

- [ ] **Step 1: Add a realistic mouse-activation helper**

Insert this helper after `keyDown` so tests cover both the package's `mousedown` toggle and its following `click` deduplication path:

```ts
function mouseActivate(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}
```

- [ ] **Step 2: Add the open-and-close focus regression**

Add this test after the part-role/default-attribute test:

```ts
it("focuses the input when an arrow-button mouse activation opens and closes the popup", () => {
  defineComboboxElements();
  document.body.innerHTML = `
    <button id="outside">Outside</button>
    <aria-combobox>
      <aria-combobox-trigger>
        <aria-combobox-input></aria-combobox-input>
        <aria-combobox-button aria-label="Toggle">Toggle</aria-combobox-button>
      </aria-combobox-trigger>
      <aria-combobox-content>
        <aria-combobox-option value="Apple">Apple</aria-combobox-option>
      </aria-combobox-content>
    </aria-combobox>
  `;

  const outside = document.querySelector("#outside") as HTMLButtonElement;
  const root = document.querySelector("aria-combobox") as RuntimeElement;
  const input = document.querySelector("aria-combobox-input") as RuntimeElement;
  const button = document.querySelector("aria-combobox-button") as RuntimeElement;

  outside.focus();
  mouseActivate(button);

  expect(root.open).toBe(true);
  expect(document.activeElement).toBe(input);

  outside.focus();
  mouseActivate(button);

  expect(root.open).toBe(false);
  expect(document.activeElement).toBe(input);
});
```

- [ ] **Step 3: Add scope and guard regressions**

Add these tests immediately after the open-and-close regression:

```ts
it("does not force input focus for trigger or programmatic arrow-button clicks", () => {
  defineComboboxElements();
  document.body.innerHTML = `
    <button id="outside">Outside</button>
    <aria-combobox>
      <aria-combobox-trigger>
        <aria-combobox-input></aria-combobox-input>
        <aria-combobox-button aria-label="Toggle">Toggle</aria-combobox-button>
      </aria-combobox-trigger>
      <aria-combobox-content></aria-combobox-content>
    </aria-combobox>
  `;

  const outside = document.querySelector("#outside") as HTMLButtonElement;
  const root = document.querySelector("aria-combobox") as RuntimeElement;
  const trigger = document.querySelector("aria-combobox-trigger") as RuntimeElement;
  const button = document.querySelector("aria-combobox-button") as RuntimeElement;

  outside.focus();
  trigger.click();
  expect(root.open).toBe(true);
  expect(document.activeElement).toBe(outside);

  trigger.click();
  outside.focus();
  button.click();
  expect(root.open).toBe(true);
  expect(document.activeElement).toBe(outside);
});

it("leaves focus unchanged for disabled or incomplete arrow-button interactions", () => {
  defineComboboxElements();
  document.body.innerHTML = `
    <button id="outside">Outside</button>
    <aria-combobox id="disabled-root" disabled>
      <aria-combobox-trigger>
        <aria-combobox-input></aria-combobox-input>
        <aria-combobox-button>Toggle</aria-combobox-button>
      </aria-combobox-trigger>
    </aria-combobox>
    <aria-combobox id="disabled-button">
      <aria-combobox-trigger>
        <aria-combobox-input></aria-combobox-input>
        <aria-combobox-button disabled>Toggle</aria-combobox-button>
      </aria-combobox-trigger>
    </aria-combobox>
    <aria-combobox id="disabled-input">
      <aria-combobox-trigger>
        <aria-combobox-input disabled></aria-combobox-input>
        <aria-combobox-button>Toggle</aria-combobox-button>
      </aria-combobox-trigger>
    </aria-combobox>
    <aria-combobox id="missing-input">
      <aria-combobox-trigger>
        <aria-combobox-button>Toggle</aria-combobox-button>
      </aria-combobox-trigger>
    </aria-combobox>
  `;

  const outside = document.querySelector("#outside") as HTMLButtonElement;
  const cases = [
    { root: "#disabled-root", toggles: false },
    { root: "#disabled-button", toggles: false },
    { root: "#disabled-input", toggles: true },
    { root: "#missing-input", toggles: true },
  ] as const;

  for (const testCase of cases) {
    const root = document.querySelector(testCase.root) as RuntimeElement;
    const button = root.querySelector("aria-combobox-button") as RuntimeElement;
    outside.focus();
    mouseActivate(button);

    expect(root.open).toBe(testCase.toggles);
    expect(document.activeElement).toBe(outside);
  }
});
```

- [ ] **Step 4: Run the focused regression and verify it fails for the missing behavior**

Run:

```bash
pnpm exec vitest run packages/combobox/__test__/combobox.test.ts -t "focuses the input when an arrow-button mouse activation"
```

Expected: FAIL because `document.activeElement` is the outside button instead of `aria-combobox-input`.

- [ ] **Step 5: Run the scope/guard regressions and verify existing behavior remains green**

Run:

```bash
pnpm exec vitest run packages/combobox/__test__/combobox.test.ts -t "does not force input focus|leaves focus unchanged"
```

Expected: PASS for both tests, proving the existing boundary before runtime changes.

- [ ] **Step 6: Commit the red regression checkpoint**

```bash
git add packages/combobox/__test__/combobox.test.ts
git commit -m "test(combobox): cover arrow button input focus"
```

### Task 2: Focus the Input in the Button mouse-down path

**Files:**
- Modify: `packages/combobox/src/combobox-actions.ts:90-92`
- Modify: `packages/combobox/src/combobox-actions.ts:268-276`
- Test: `packages/combobox/__test__/combobox.test.ts`

- [ ] **Step 1: Add the focused Input helper**

Insert this helper after `closeRootCombobox`:

```ts
function focusComboboxInput(root: HTMLElement) {
  const input = comboboxInput(root);
  if (!input || isComboboxDisabled(input)) {
    return;
  }

  input.focus({ preventScroll: true });
}
```

- [ ] **Step 2: Focus after both Button state transitions**

Change only the `partName === "Button"` mouse-down branch to focus after the existing toggle:

```ts
if (partName === "Button") {
  event.preventDefault();
  comboboxButtonMouseDownRoots.add(root);
  if (root.hasAttribute("open")) {
    closeRootCombobox(root);
  } else {
    openRootCombobox(root, "none");
  }
  focusComboboxInput(root);
}
```

- [ ] **Step 3: Run the focused regression and verify it passes**

Run:

```bash
pnpm exec vitest run packages/combobox/__test__/combobox.test.ts -t "focuses the input when an arrow-button mouse activation"
```

Expected: PASS.

- [ ] **Step 4: Prove the regression test is causally linked to the fix**

Temporarily remove the `focusComboboxInput(root);` call with `apply_patch`, rerun the focused command, and confirm it FAILS with the outside button still focused. Restore the call with `apply_patch`, rerun the same command, and confirm it PASSES.

- [ ] **Step 5: Run the complete package suite and static checks**

Run:

```bash
pnpm exec vitest run packages/combobox/__test__/combobox.test.ts
pnpm --filter @ariaui-web/combobox lint
pnpm --filter @ariaui-web/combobox build
```

Expected: all combobox tests pass; lint and build exit 0.

- [ ] **Step 6: Commit the minimal runtime fix**

```bash
git add packages/combobox/src/combobox-actions.ts
git commit -m "fix(combobox): retain input focus on arrow toggle"
```

### Task 3: Cover every rendered documentation example

**Files:**
- Create: `web/doc/__test__/combobox-focus.test.ts`

- [ ] **Step 1: Add the focused documentation acceptance test**

Create the file with this complete content:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineComboboxElements } from "@ariaui-web/combobox";
import { afterEach, describe, expect, it } from "vitest";

type RuntimeComboboxElement = HTMLElement & {
  open: boolean;
};

function comboboxExampleMarkups() {
  const doc = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", "combobox.md"), "utf8");
  const markups: string[] = [];

  for (const match of doc.matchAll(/<div class="[^"]*\bariaui-web-preview\b[^"]*" data-component="combobox" data-example-variant="[^"]+">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);
    if (end === -1) {
      throw new Error("Missing closing markup for a combobox documentation example.");
    }
    markups.push(doc.slice(start, end).trim());
  }

  return markups;
}

function mouseActivate(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("combobox documentation focus behavior", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps each live example input focused when its arrow button opens and closes", () => {
    defineComboboxElements();
    const markups = comboboxExampleMarkups();
    document.body.innerHTML = markups
      .map((markup, index) => `<button data-outside="${index}">Outside</button><div data-focus-example="${index}">${markup}</div>`)
      .join("\n");

    const examples = Array.from(document.querySelectorAll<HTMLElement>("[data-focus-example]"));
    expect(examples).toHaveLength(5);

    examples.forEach((example, index) => {
      const outside = document.querySelector(`[data-outside="${index}"]`) as HTMLButtonElement;
      const root = example.querySelector("aria-combobox") as RuntimeComboboxElement;
      const input = root.querySelector("aria-combobox-input") as HTMLElement;
      const button = root.querySelector("aria-combobox-button") as HTMLElement;

      outside.focus();
      mouseActivate(button);
      expect(root.open).toBe(true);
      expect(document.activeElement).toBe(input);

      outside.focus();
      mouseActivate(button);
      expect(root.open).toBe(false);
      expect(document.activeElement).toBe(input);
    });
  });
});
```

- [ ] **Step 2: Run the focused documentation acceptance test**

Run:

```bash
pnpm exec vitest run web/doc/__test__/combobox-focus.test.ts
```

Expected: 1 test passes across all five example variants.

- [ ] **Step 3: Run documentation static and build checks**

Run:

```bash
pnpm --filter @ariaui-web/doc lint
pnpm --filter @ariaui-web/doc build
```

Expected: both commands exit 0. If unrelated dirty pagination work causes a failure, record the exact failure separately and keep the combobox-focused test result authoritative for this change.

- [ ] **Step 4: Commit the isolated docs regression**

```bash
git add web/doc/__test__/combobox-focus.test.ts
git commit -m "test(docs): cover combobox arrow focus"
```

### Task 4: Final verification and rendered QA

**Files:**
- Verify: `packages/combobox/src/combobox-actions.ts`
- Verify: `packages/combobox/__test__/combobox.test.ts`
- Verify: `web/doc/__test__/combobox-focus.test.ts`

- [ ] **Step 1: Run combined focused verification**

Run:

```bash
pnpm exec vitest run packages/combobox/__test__/combobox.test.ts web/doc/__test__/combobox-focus.test.ts
pnpm --filter @ariaui-web/combobox lint
pnpm --filter @ariaui-web/combobox build
```

Expected: all tests pass and both package checks exit 0.

- [ ] **Step 2: Review the final diff and working-tree boundaries**

Run:

```bash
git show --check --oneline HEAD~4..HEAD
git log -5 --oneline
git status --short
```

Expected: no whitespace errors; the design, plan, test, runtime, and docs-test commits appear at the branch tip; unrelated pagination and `.superpowers/` work remains present but uncommitted and unchanged by these tasks.

- [ ] **Step 3: Verify the rendered combobox page when browser tooling is available**

Start the documentation server:

```bash
pnpm --dir web/doc dev --hostname 127.0.0.1 --port 4173
```

Open `/components/combobox`, focus an unrelated control, and mouse-click the arrow button in at least the grouped-options and multi-select examples. Verify that the corresponding `aria-combobox-input` is `document.activeElement` after both opening and closing, and that the popup still toggles once per mouse click. No visual layout or styling change is expected.

- [ ] **Step 4: Report verification evidence and any tooling limitation**

Report exact test counts and successful lint/build commands. If browser tooling cannot run, state that limitation explicitly without claiming rendered browser verification.
