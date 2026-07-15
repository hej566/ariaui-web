# Combobox Tailwind Examples Design

**Status:** Approved on 2026-07-15

## Goal

Make every Combobox documentation example use Tailwind CSS utilities for its visual styling. Preserve the current appearance and behavior of all five examples while removing the component-specific Combobox rules from the VitePress theme stylesheet.

## Current State

The Combobox page renders five live examples from `web/doc/docs/components/combobox.md`:

- Grouped options
- Framer Motion
- User selector
- Multi-select
- Multi-select (Advanced)

Their visual presentation currently comes from a large selector block in `web/doc/docs/.vitepress/theme/style.css`. The example installer in `combobox-examples.ts` also creates chips, avatars, remove controls, and overflow indicators with semantic classes that the stylesheet styles. Although other documentation markup already contains utility-looking class names, `ariaui-web` does not currently compile Tailwind CSS.

The sibling AriaUI documentation uses Tailwind CSS 4 and explicit utility bundles for the equivalent Combobox examples. It is the visual and semantic reference for this migration, but the browser-native examples keep their existing custom-element markup and installer behavior.

## Chosen Approach

Add a real Tailwind CSS 4 pipeline to the VitePress documentation and put explicit Tailwind utilities on the Combobox example elements. Remove the complete Combobox-specific theme CSS block. Retain `ariaui-web-combobox-*` classes only where they are useful as stable JavaScript or test hooks; those semantic hooks no longer carry styling.

This is preferred over shared TypeScript-only class bundles because the rendered HTML and displayed snippets remain self-explanatory and reviewable. It is preferred over Tailwind `@apply` because `@apply` would leave the example styling hidden behind component selectors and would not satisfy the intent of Tailwind-only examples.

## Tailwind Integration

`web/doc` adds `tailwindcss` and `@tailwindcss/vite` as development dependencies. The VitePress config registers the Tailwind Vite plugin, and the custom theme imports a focused Tailwind entry stylesheet before the existing VitePress theme stylesheet.

The Tailwind entry includes the Tailwind theme and utilities layers without Preflight. Omitting Preflight prevents this Combobox migration from resetting or otherwise changing the existing VitePress site globally. Combobox utilities reference the existing VitePress theme variables through arbitrary values where needed, so light and dark themes continue to use the established documentation color contract without adding component CSS.

Tailwind source detection must include the VitePress Markdown and theme TypeScript files so utilities in both static examples and dynamically assigned class strings are emitted in production builds.

## Example Markup

Each live example wrapper and custom-element part receives the utilities that replace its existing CSS declarations. The same utilities appear in the corresponding displayed HTML snippet because the documentation tests require live markup and snippets to stay synchronized.

The migration covers:

- Preview sizing, alignment, spacing, and background.
- Root, Trigger, Input, Button, and popup Content layout.
- Labels, groups, options, separators, selection indicators, and disabled states.
- Selected-value colors and open, hover, active, and highlighted states through Tailwind variants.
- User avatars and selected-user chips.
- Multi-select tag rows, removable chips, and overflow count badges.
- Framer Motion entry and exit state presentation.
- Placeholder pseudo-content for the contenteditable Input.

State-dependent presentation uses Tailwind variants such as `hover:`, `aria-disabled:`, `data-[state=open]:`, and other existing reflected data attributes. Dark-mode appearance continues to come from the VitePress variables referenced by those utilities rather than from a second Combobox stylesheet.

## Dynamic Elements and Positioning

`combobox-examples.ts` assigns Tailwind utility strings when it creates chips, avatars, chip labels, remove buttons, and overflow indicators. It may retain semantic hook classes alongside those utilities for queries and event binding.

Popup coordinates remain a runtime concern. The installer may continue writing computed `top` and `left` values because those values depend on live element geometry. Fixed positioning mode, dimensions, colors, borders, shadows, spacing, and transitions come from Tailwind utilities; the installer no longer writes `position` as an inline style.

The installer retains its current lifecycle, event handling, selection synchronization, arrow-button focus behavior, and cleanup. This task changes styling ownership, not Combobox runtime semantics.

## CSS Removal Boundary

Remove all selectors in `style.css` whose purpose is styling `.ariaui-web-preview[data-component="combobox"]` or its Combobox descendants. After the migration, no Combobox example visual rule remains in the handwritten theme stylesheet.

Do not remove general VitePress theme rules or styles for other component examples. Do not modify unrelated Pagination work in the shared main worktree.

## Testing Strategy

Follow a red-green-refactor sequence in the isolated worktree:

1. Add documentation assertions that fail while Tailwind is absent and the legacy Combobox CSS remains.
2. Assert that the VitePress build registers Tailwind, the Tailwind entry is imported, and its dependencies are declared.
3. Assert that each Combobox example and its matching snippet contains the expected Tailwind utility styling and stable behavior hooks.
4. Assert that dynamic elements receive Tailwind utilities from the installer.
5. Assert that the legacy Combobox selector block is absent from `style.css`.
6. Add the Tailwind pipeline and migrate the examples until focused tests pass.
7. Refactor repeated utility strings only when doing so does not hide styling from displayed examples or weaken live-markup parity.

Existing Combobox behavior tests remain authoritative for opening, closing, selection, filtering, chip removal, overflow, Framer Motion state, positioning, and arrow-button focus. The migration must not weaken or replace those interaction assertions.

## Verification

Completion requires fresh evidence from:

- Focused Combobox documentation tests.
- The complete documentation test file.
- Documentation type checking.
- A VitePress production build that proves Tailwind emits the required utilities.
- The broader repository test suite, with the four known clean-`main` Pagination failures recorded separately if they remain unresolved.
- Rendered interaction and visual checks of all five examples in light and dark themes.

Rendered checks cover closed and open popups, active options, selected values, user avatars, removable chips, overflow badges, Framer Motion entry and exit, popup placement, and arrow-button focus. Source inspection alone is not sufficient for this visible migration.

## Scope Boundaries

- Do not change Combobox package runtime behavior or public APIs.
- Do not change example content, docs slug, custom-element names, or example ordering.
- Do not introduce React or framework-specific example code.
- Do not migrate unrelated component examples to Tailwind in this task.
- Do not use Tailwind `@apply` to recreate the removed Combobox selector block.
- Do not add direct inline visual styles; only computed popup coordinates may remain runtime style mutations.
- Preserve package names under the `@ariaui-web` scope and keep all package directories unchanged.

## Success Criteria

The work is complete when Tailwind CSS 4 is part of the VitePress build, every Combobox example and dynamically created example element is styled with Tailwind utilities, the legacy Combobox CSS block is gone, live examples and displayed snippets remain synchronized, existing interactions still work, production builds contain the required styles, and rendered light- and dark-theme checks confirm visual parity.
