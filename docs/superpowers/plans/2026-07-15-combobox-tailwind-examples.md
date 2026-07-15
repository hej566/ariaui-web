# Combobox Tailwind Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compile Tailwind CSS 4 in the VitePress docs and migrate all five Combobox examples from component-specific theme CSS to explicit Tailwind utilities without changing their appearance or behavior.

**Architecture:** VitePress loads a Tailwind theme-and-utilities entry without Preflight, leaving the rest of the docs theme untouched. Static example markup and matching snippets carry their visual utilities directly; the Combobox installer adds utilities only to elements it creates dynamically and continues to write only measured popup `top` and `left` coordinates.

**Tech Stack:** VitePress 1.6, Vite 6, Tailwind CSS 4, `@tailwindcss/vite`, native Web Components, TypeScript, Vitest, pnpm.

---

## File Map

- Create `web/doc/docs/.vitepress/theme/tailwind.css`: load Tailwind's theme and utilities layers without Preflight and explicitly scan the Combobox page and runtime helper.
- Modify `web/doc/package.json`: declare documentation-only Tailwind build dependencies.
- Modify `pnpm-lock.yaml`: lock the Tailwind dependency graph.
- Modify `web/doc/docs/.vitepress/config.ts`: register the Tailwind Vite plugin.
- Modify `web/doc/docs/.vitepress/theme/index.ts`: import Tailwind before the existing theme stylesheet.
- Modify `web/doc/docs/components/combobox.md`: put utilities on all five live examples and their matching HTML snippets.
- Modify `web/doc/docs/.vitepress/theme/combobox-examples.ts`: style dynamically created elements with utilities and stop writing inline `position`.
- Modify `web/doc/docs/.vitepress/theme/style.css`: delete only the legacy Combobox example selector block.
- Modify `web/doc/__test__/docs.test.ts`: cover Tailwind integration, utility-owned example styling, dynamic styling, coordinate-only runtime styles, and removal of legacy CSS.

### Task 1: Add the focused Tailwind build pipeline

**Files:**
- Create: `web/doc/docs/.vitepress/theme/tailwind.css`
- Modify: `web/doc/package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `web/doc/docs/.vitepress/config.ts`
- Modify: `web/doc/docs/.vitepress/theme/index.ts`
- Test: `web/doc/__test__/docs.test.ts`

- [ ] **Step 1: Write the failing Tailwind integration test**

Add this test beside the existing Combobox documentation tests:

```ts
it("builds the VitePress docs with Tailwind utilities and no Preflight", () => {
  const config = readDoc(".vitepress/config.ts");
  const theme = readDoc(".vitepress/theme/index.ts");
  const tailwind = readDoc(".vitepress/theme/tailwind.css");
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), "web", "doc", "package.json"), "utf8"),
  ) as { devDependencies?: Record<string, string> };

  expect(packageJson.devDependencies).toMatchObject({
    "@tailwindcss/vite": "^4.3.2",
    tailwindcss: "^4.3.2",
  });
  expect(config).toContain('import tailwindcss from "@tailwindcss/vite";');
  expect(config).toContain("plugins: [tailwindcss()]");
  expect(theme.indexOf('import "./tailwind.css";')).toBeLessThan(
    theme.indexOf('import "./style.css";'),
  );
  expect(tailwind).toContain('@import "tailwindcss/theme.css" layer(theme);');
  expect(tailwind).toContain('@import "tailwindcss/utilities.css" layer(utilities);');
  expect(tailwind).toContain('@source "../../components/combobox.md";');
  expect(tailwind).toContain('@source "./combobox-examples.ts";');
  expect(tailwind).not.toContain("preflight");
});
```

- [ ] **Step 2: Run the test and verify the red state**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "builds the VitePress docs with Tailwind utilities and no Preflight"
```

Expected: FAIL because `tailwind.css` does not exist and the Tailwind dependencies and plugin are absent.

- [ ] **Step 3: Install Tailwind in the documentation workspace**

Run:

```bash
pnpm --dir web/doc add -D tailwindcss@^4.3.2 @tailwindcss/vite@^4.3.2
```

Expected: `web/doc/package.json` and `pnpm-lock.yaml` change; no package under `packages/` gains a Tailwind dependency.

- [ ] **Step 4: Create the no-Preflight Tailwind entry**

Create `web/doc/docs/.vitepress/theme/tailwind.css` with exactly:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) source(none);

@source "../../components/combobox.md";
@source "./combobox-examples.ts";
```

- [ ] **Step 5: Register Tailwind with VitePress**

Add the plugin import and merge the plugin into the existing `vite` block in `web/doc/docs/.vitepress/config.ts` at the shown locations:

```diff
 import { fileURLToPath } from "node:url";
+import tailwindcss from "@tailwindcss/vite";
 import { defineConfig } from "vitepress";

 export default defineConfig({
   title: "Aria UI Web",
   description: "Web Component port of Aria UI packages.",
   cleanUrls: true,
   themeConfig: {
     nav: [
       { text: "Guide", link: "/overview/introduction" },
       { text: "Packages", link: "/overview/packages" },
       { text: "Components", link: "/components/accordion" },
     ],
     sidebar: [
       {
         text: "Overview",
         items: [
           { text: "Introduction", link: "/overview/introduction" },
           { text: "Packages", link: "/overview/packages" },
           { text: "Testing", link: "/overview/testing" },
         ],
       },
     ],
   },
   vite: {
+    plugins: [tailwindcss()],
     resolve: {
```

Do not add a second `vite` property or rewrite the generated navigation and alias data; only add `plugins: [tailwindcss()]` to the existing `vite` object.

In `web/doc/docs/.vitepress/theme/index.ts`, keep the import order:

```ts
import DefaultTheme from "vitepress/theme";
import "./tailwind.css";
import "./style.css";
```

- [ ] **Step 6: Run the focused test and production build**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "builds the VitePress docs with Tailwind utilities and no Preflight"
pnpm --dir web/doc build
```

Expected: PASS, and VitePress completes a production build without Tailwind import or plugin errors.

- [ ] **Step 7: Commit the build integration**

```bash
git add web/doc/package.json pnpm-lock.yaml web/doc/docs/.vitepress/config.ts web/doc/docs/.vitepress/theme/index.ts web/doc/docs/.vitepress/theme/tailwind.css web/doc/__test__/docs.test.ts
git commit -m "build(doc): add Tailwind utilities pipeline"
```

### Task 2: Migrate static Combobox markup and remove legacy CSS

**Files:**
- Modify: `web/doc/docs/components/combobox.md`
- Modify: `web/doc/docs/.vitepress/theme/style.css`
- Test: `web/doc/__test__/docs.test.ts`

- [ ] **Step 1: Replace the legacy styling assertions with a failing Tailwind ownership test**

Replace `keeps combobox live example styles scoped to the combobox docs page` with:

```ts
it("styles every combobox example with Tailwind utilities instead of theme CSS", () => {
  const previews = comboboxExamplePreviews(readDoc("components/combobox.md"));
  const style = readDoc(".vitepress/theme/style.css");

  for (const preview of previews) {
    expect(preview.className).toContain("min-h-72");
    expect(preview.className).toContain("bg-[var(--vp-c-bg)]");
    expect(preview.markup).toContain("group/root");
    expect(preview.markup).toContain("w-[12.5rem]");
    expect(preview.markup).toContain("border-[var(--vp-c-divider)]");
    expect(preview.markup).toContain("data-[active=true]:bg-[color-mix(");
    expect(preview.markup).toContain("aria-disabled:pointer-events-none");
    expect(preview.markup).toContain("empty:before:content-[attr(placeholder)]");
  }

  expect(previews.find((preview) => preview.variant === "framer-motion")?.markup)
    .toContain("data-[state=open]:opacity-100");
  expect(previews.find((preview) => preview.variant === "multi-select")?.markup)
    .toContain("group-data-[has-value=true]/trigger:flex-[0_1_2px]");
  expect(previews.find((preview) => preview.variant === "multiple-advanced")?.markup)
    .toContain("flex-nowrap");

  expect(style).not.toContain('.ariaui-web-preview[data-component="combobox"]');
  expect(style).not.toContain(".ariaui-web-combobox-");
});
```

Keep the existing live/snippet equality test unchanged; it guards every duplicated class edit.

- [ ] **Step 2: Run the ownership test and verify the red state**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "styles every combobox example with Tailwind utilities instead of theme CSS"
```

Expected: FAIL because the examples still rely on semantic classes and the legacy CSS block is present.

- [ ] **Step 3: Apply the common utility mapping to live markup and snippets**

In every live preview and its matching code fence, retain the semantic hook at the start of `class` and append the exact utility bundle from this mapping:

```ts
const comboboxExampleUtilities = {
  preview: "box-border flex min-h-72 w-full items-start justify-center overflow-visible bg-[var(--vp-c-bg)] px-6 pt-12 pb-32",
  root: "group/root relative inline-flex w-[12.5rem] justify-center text-[var(--vp-c-text-1)]",
  trigger: "group/trigger box-border inline-flex min-h-9 w-[12.5rem] shrink-0 cursor-text items-center justify-between gap-2 rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] py-1 pr-3 pl-1 text-sm leading-5 font-normal text-[var(--vp-c-text-2)] shadow-sm hover:bg-[color-mix(in_srgb,var(--vp-c-brand-1)_10%,var(--vp-c-bg-soft))] group-data-[state=open]/root:bg-[color-mix(in_srgb,var(--vp-c-brand-1)_10%,var(--vp-c-bg-soft))] data-[has-value=true]:text-[var(--vp-c-text-1)] aria-disabled:pointer-events-none aria-disabled:opacity-50",
  triggerLabel: "min-w-0 flex-[0_1_auto] overflow-hidden text-left text-ellipsis whitespace-nowrap",
  input: "min-w-[2px] flex-auto border-0 bg-transparent p-0 text-sm leading-5 font-medium text-[var(--vp-c-text-1)] outline-none empty:before:text-[var(--vp-c-text-2)] empty:before:content-[attr(placeholder)] [&[value]:empty]:before:content-['']",
  button: "ml-auto inline-flex size-4 flex-none cursor-pointer items-center justify-center text-[var(--vp-c-text-2)] [&_svg]:size-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.5]",
  content: "fixed z-20 box-border max-h-[min(18rem,calc(100vh-1rem))] w-[12.5rem] overflow-y-auto overscroll-contain rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] p-1 text-[var(--vp-c-text-1)] shadow-[0_4px_10px_rgb(0_0_0_/_12%)] [scrollbar-width:thin]",
  group: "block",
  label: "block px-2 py-1.5 text-xs leading-4 font-medium text-[var(--vp-c-text-2)]",
  option: "group/option relative flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm leading-5 text-[var(--vp-c-text-1)] hover:bg-[color-mix(in_srgb,var(--vp-c-brand-1)_10%,var(--vp-c-bg-soft))] data-[active=true]:bg-[color-mix(in_srgb,var(--vp-c-brand-1)_10%,var(--vp-c-bg-soft))] aria-disabled:pointer-events-none aria-disabled:opacity-50",
  check: "absolute right-2 inline-flex size-4 items-center justify-center text-[var(--vp-c-text-1)] opacity-0 group-data-[state=checked]/option:opacity-100 [&_svg]:size-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.5]",
  separator: "-mx-1 my-1 h-px bg-[color-mix(in_srgb,var(--vp-c-divider)_72%,transparent)]",
  fallback: "px-2 py-1.5 text-sm leading-5 text-[var(--vp-c-text-2)]",
};
```

For example, the first Root/Trigger/Input sequence becomes:

```html
<aria-combobox class="ariaui-web-combobox-root group/root relative inline-flex w-[12.5rem] justify-center text-[var(--vp-c-text-1)]" data-example-part="Root">
  <aria-combobox-trigger class="ariaui-web-combobox-trigger group/trigger box-border inline-flex min-h-9 w-[12.5rem] shrink-0 cursor-text items-center justify-between gap-2 rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] py-1 pr-3 pl-1 text-sm leading-5 font-normal text-[var(--vp-c-text-2)] shadow-sm hover:bg-[color-mix(in_srgb,var(--vp-c-brand-1)_10%,var(--vp-c-bg-soft))] group-data-[state=open]/root:bg-[color-mix(in_srgb,var(--vp-c-brand-1)_10%,var(--vp-c-bg-soft))] data-[has-value=true]:text-[var(--vp-c-text-1)] aria-disabled:pointer-events-none aria-disabled:opacity-50">
    <span class="ariaui-web-combobox-trigger-label min-w-0 flex-[0_1_auto] overflow-hidden text-left text-ellipsis whitespace-nowrap" data-combobox-trigger-label></span>
    <aria-combobox-input class="ariaui-web-combobox-input min-w-[2px] flex-auto border-0 bg-transparent p-0 text-sm leading-5 font-medium text-[var(--vp-c-text-1)] outline-none empty:before:text-[var(--vp-c-text-2)] empty:before:content-[attr(placeholder)] [&[value]:empty]:before:content-['']" placeholder="Search..."></aria-combobox-input>
  </aria-combobox-trigger>
</aria-combobox>
```

Use the literal `&` form shown above in Markdown source. The live/snippet equality test remains the guard that both copies stay identical.

- [ ] **Step 4: Apply the variant-specific utility bundles**

Use these exact additions in both live markup and matching snippets:

```ts
const comboboxVariantUtilities = {
  framerContent: "pointer-events-none origin-top -translate-y-1 scale-[.98] opacity-0 transition-[opacity,transform] duration-[160ms] ease-out data-[state=open]:pointer-events-auto data-[state=open]:translate-y-0 data-[state=open]:scale-100 data-[state=open]:opacity-100",
  userTagGroup: "flex min-w-0 items-center gap-1 overflow-hidden",
  avatar: "size-5 flex-none rounded-full object-cover",
  multiTrigger: "items-start",
  multiSelectionGroup: "flex min-w-0 flex-auto flex-wrap items-center gap-1 px-0.5 py-1",
  multiTagGroup: "contents",
  multiInput: "group-data-[has-value=true]/trigger:w-[2px] group-data-[has-value=true]/trigger:flex-[0_1_2px]",
  centeredButton: "self-center",
  advancedSelectionGroup: "flex min-w-0 flex-auto flex-nowrap items-center gap-1 p-1",
  advancedTagGroup: "flex min-w-0 items-center gap-1 overflow-hidden",
};
```

Keep `.ariaui-web-combobox-*` hook names alongside these bundles. Do not introduce a stylesheet or `@apply` rule for any bundle.

- [ ] **Step 5: Delete the legacy Combobox CSS block**

From `web/doc/docs/.vitepress/theme/style.css`, delete the contiguous block beginning with:

```css
.ariaui-web-preview[data-component="combobox"] {
```

and ending after:

```css
.ariaui-web-preview[data-component="combobox"][data-example-variant="framer-motion"] .ariaui-web-combobox-content[data-state="open"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
```

Leave the preceding Select keyframes and following Grid rules byte-for-byte unchanged.

- [ ] **Step 6: Run the static styling and snippet-parity tests**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "styles every combobox example with Tailwind utilities instead of theme CSS|pairs every combobox live example with a matching HTML snippet|renders every source combobox example as a live custom element preview"
```

Expected: PASS for all three tests.

- [ ] **Step 7: Commit the static migration**

```bash
git add web/doc/docs/components/combobox.md web/doc/docs/.vitepress/theme/style.css web/doc/__test__/docs.test.ts
git commit -m "docs(combobox): migrate examples to Tailwind utilities"
```

### Task 3: Migrate dynamic elements and restrict inline positioning

**Files:**
- Modify: `web/doc/docs/.vitepress/theme/combobox-examples.ts`
- Modify: `web/doc/__test__/docs.test.ts`

- [ ] **Step 1: Add failing assertions for dynamic utility styling**

In `keeps combobox live examples behaviorally interactive`, after the user-selector chip assertions, add:

```ts
const selectedUserChip = userSelector?.querySelector<HTMLElement>(".ariaui-web-combobox-chip");
expect(selectedUserChip?.classList.contains("inline-flex")).toBe(true);
expect(selectedUserChip?.classList.contains("bg-[var(--vp-c-bg-soft)]")).toBe(true);
expect(selectedUserChip?.querySelector("img")?.classList.contains("object-cover")).toBe(true);
expect(selectedUserChip?.querySelector(".ariaui-web-combobox-chip-label")?.classList.contains("text-ellipsis")).toBe(true);
expect(selectedUserChip?.querySelector(".ariaui-web-combobox-remove")?.classList.contains("hover:bg-[color-mix(in_srgb,var(--vp-c-text-2)_12%,transparent)]")).toBe(true);
```

After the advanced overflow assertions, add:

```ts
const overflowCount = advanced?.querySelector<HTMLElement>(".ariaui-web-combobox-overflow-count");
expect(overflowCount?.classList.contains("inline-flex")).toBe(true);
expect(overflowCount?.classList.contains("text-[var(--vp-c-text-2)]")).toBe(true);
```

In `positions open combobox docs example panels and clears the position when closed`, add `fixed` to the test Content class and replace both position assertions with coordinate-only expectations:

```ts
expect(content?.classList.contains("fixed")).toBe(true);
expect(content?.style.position).toBe("");
expect(content?.style.top).toBe("375px");
expect(content?.style.left).toBe("100px");

// After closing:
expect(content?.classList.contains("fixed")).toBe(true);
expect(content?.style.position).toBe("");
expect(content?.style.top).toBe("");
expect(content?.style.left).toBe("");
```

Also add `fixed` to the Content fixture in `keeps open combobox docs example panels anchored while the page scrolls`.

- [ ] **Step 2: Run the dynamic and positioning tests and verify the red state**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "keeps combobox live examples behaviorally interactive|positions open combobox docs example panels and clears the position when closed|keeps open combobox docs example panels anchored while the page scrolls"
```

Expected: FAIL because generated elements have only semantic classes and the installer writes `style.position = "fixed"`.

- [ ] **Step 3: Define and apply utility strings for generated elements**

Add these constants near the installer constants:

```ts
const comboboxChipClass = "ariaui-web-combobox-chip inline-flex flex-none items-center gap-1 whitespace-nowrap rounded-md bg-[var(--vp-c-bg-soft)] px-1.5 py-0.5 text-xs leading-4 font-medium text-[var(--vp-c-text-1)]";
const comboboxAvatarClass = "ariaui-web-combobox-avatar size-5 flex-none rounded-full object-cover";
const comboboxChipLabelClass = "ariaui-web-combobox-chip-label min-w-0 overflow-hidden text-ellipsis whitespace-nowrap";
const comboboxRemoveClass = "ariaui-web-combobox-remove inline-flex size-3.5 items-center justify-center rounded-full text-[var(--vp-c-text-1)] opacity-[.78] hover:bg-[color-mix(in_srgb,var(--vp-c-text-2)_12%,transparent)]";
const comboboxOverflowCountClass = "ariaui-web-combobox-overflow-count inline-flex shrink-0 flex-row flex-nowrap items-center whitespace-nowrap py-0.5 text-xs leading-4 font-medium text-[var(--vp-c-text-2)]";
```

Use the constants at each creation site:

```ts
chip.className = comboboxChipClass;
image.className = comboboxAvatarClass;
text.className = comboboxChipLabelClass;
remove.className = comboboxRemoveClass;
overflow.className = comboboxOverflowCountClass;
```

- [ ] **Step 4: Keep runtime styles coordinate-only**

Change the position helpers to:

```ts
function setComboboxExamplePosition(element: HTMLElement, position: ComboboxExamplePosition) {
  element.dataset.side = position.side;
  element.dataset.align = position.align;
  element.style.top = position.top + "px";
  element.style.left = position.left + "px";
}

function clearComboboxExamplePosition(element: HTMLElement) {
  delete element.dataset.side;
  delete element.dataset.align;
  element.style.removeProperty("top");
  element.style.removeProperty("left");
}
```

- [ ] **Step 5: Run all Combobox documentation tests**

Run:

```bash
pnpm exec vitest run web/doc/__test__/docs.test.ts -t "combobox"
pnpm exec vitest run web/doc/__test__/combobox-focus.test.ts
```

Expected: all Combobox tests pass, including chip removal, overflow, filtering, animation state, placement, scrolling, and arrow-button focus.

- [ ] **Step 6: Commit the dynamic migration**

```bash
git add web/doc/docs/.vitepress/theme/combobox-examples.ts web/doc/__test__/docs.test.ts
git commit -m "docs(combobox): style generated elements with Tailwind"
```

### Task 4: Verify the complete automated contract

**Files:**
- Verify only; modify files only to correct failures caused by Tasks 1-3.

- [ ] **Step 1: Check formatting and prohibited styling remnants**

Run:

```bash
git diff --check main...HEAD
grep -n 'ariaui-web-preview\[data-component="combobox"\]\|\.ariaui-web-combobox-' web/doc/docs/.vitepress/theme/style.css
grep -n 'style\.position\|style\.setProperty("position"' web/doc/docs/.vitepress/theme/combobox-examples.ts
```

Expected: `git diff --check` exits 0; both `grep` commands print no matches and exit 1.

- [ ] **Step 2: Run the complete documentation test suite**

Run:

```bash
pnpm --dir web/doc test
```

Expected: PASS with no failed documentation tests.

- [ ] **Step 3: Run documentation type checking and the production build**

Run:

```bash
pnpm --dir web/doc lint
pnpm --dir web/doc build
grep -R -E 'min-height:18rem|width:12\.5rem|data-state|--vp-c-bg-soft' web/doc/docs/.vitepress/dist/assets/*.css
```

Expected: the lint and build commands exit 0, and `grep` prints generated CSS covering the 18rem preview height, 12.5rem Combobox width, data-state variants, and dynamic chip theme color.

- [ ] **Step 4: Run the repository suite and compare with the baseline**

Run:

```bash
pnpm test
```

Expected: every Combobox and docs test passes. If the clean-`main` Pagination baseline remains unchanged, the only failures are the same four tests in `packages/pagination/__test__/pagination.test.ts`; no new test file or failure is accepted.

- [ ] **Step 5: Review the final diff boundary**

Run:

```bash
git status --short
git diff main...HEAD --stat
git diff main...HEAD -- web/doc/package.json web/doc/docs/.vitepress/config.ts web/doc/docs/.vitepress/theme/index.ts web/doc/docs/.vitepress/theme/tailwind.css web/doc/docs/components/combobox.md web/doc/docs/.vitepress/theme/combobox-examples.ts web/doc/docs/.vitepress/theme/style.css web/doc/__test__/docs.test.ts
```

Expected: only the design, plan, lockfile, and files listed in this plan are changed; no Pagination or package runtime file is present.

### Task 5: Perform rendered interaction and visual verification

**Files:**
- Verify only; preserve screenshots as external QA evidence rather than repository artifacts unless the project already tracks them.

- [ ] **Step 1: Start the VitePress development server**

Run in a persistent terminal:

```bash
pnpm --dir web/doc exec vitepress dev docs --host 127.0.0.1 --port 4173
```

Expected: VitePress serves `http://127.0.0.1:4173/components/combobox` without build or console errors.

- [ ] **Step 2: Load the browser-testing skill before browser actions**

Read and follow `/home/neo/.agents/skills/gstack/browse/SKILL.md`. If that browser cannot initialize, use another available browser automation surface and record the exact blocker rather than claiming rendered verification.

- [ ] **Step 3: Verify all five examples in light theme**

At desktop width around 1280px:

1. Capture the closed page showing all example preview frames.
2. Open Grouped options, hover and keyboard-highlight options, select Banana, and confirm the Trigger label and foreground color update.
3. Toggle Framer Motion open and closed and inspect opacity, translation, scale, transform origin, and pointer behavior at both endpoints.
4. Select `leerob` in User selector and inspect avatar size, crop, chip truncation, and remove control.
5. Select Apple and Carrot in Multi-select, remove Apple, and inspect wrapping, Input width, button centering, and popup position.
6. Select three values in Multi-select (Advanced) and confirm two visible chips plus a `+1` overflow count without clipping.
7. Click each arrow button to open and close and verify the Input remains focused.

Expected: dimensions, spacing, borders, colors, shadows, states, and interactions match the pre-migration Combobox presentation.

- [ ] **Step 4: Verify dark theme and responsive layout**

Switch VitePress to dark theme, repeat closed/open screenshots for each example, and confirm every arbitrary color utility follows the `--vp-*` variables. At a mobile width around 390px, confirm the 200px Trigger and popup remain visible, chips wrap or truncate correctly, previews do not clip overflow, and popup collision logic still flips and clamps.

- [ ] **Step 5: Stop the server and record verification evidence**

Stop the persistent VitePress process. Record the tested URL, viewport sizes, themes, interactions, screenshot identifiers, console status, and any known baseline failures in the completion report.
