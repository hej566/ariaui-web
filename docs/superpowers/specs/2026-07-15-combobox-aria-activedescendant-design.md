# Combobox aria-activedescendant Web Component Design

## Status

Approved on July 15, 2026.

## Goal

Port the approved `@ariaui/combobox` active-descendant ownership design to `@ariaui-web/combobox` so the focused editable custom element owns the combobox semantics and never references an inactive, hidden, or disconnected option.

The change must preserve the package name, package directory, docs slug, compound custom-element API, filtering, selection, keyboard behavior, and rendered appearance.

## Source Contract

The source design is `../ariaui/docs/superpowers/specs/2026-07-15-combobox-aria-activedescendant-design.md`.

At the time of this port, the source design is approved but the source React runtime, package readme, and tests still describe the older Trigger-owned model. This Web Component port therefore treats the approved design as the feature contract while keeping its adaptation local to `ariaui-web`.

The current uncommitted changes in `web/doc/__test__/docs.test.ts` and `web/doc/docs/components/combobox.md` predate this feature and must be preserved.

## Decision

Use a direct native parity port:

- update the generated package contract and focused package tests before runtime code;
- verify the new behavior tests fail against the current runtime;
- implement the role relocation and cleanup in the existing separated combobox modules;
- keep Content's mirrored `aria-activedescendant` behavior;
- leave the generator unchanged until the source package readme and tests ship the same contract.

The generator must not be run for this design-only source addition. It does not consume source design specs, and running it while the source package contract remains stale would overwrite the existing native combobox implementation and the user's in-progress docs work. When the source runtime/readme/tests land, `node scripts/generate-from-ariaui.mjs` must be rerun and its output reconciled with this port.

## Component Contract

### Root

`aria-combobox` remains the state owner. It keeps selected value, input value, open state, selection mode, outside-dismissal behavior, and disabled propagation. It has no combobox role.

### Trigger

`aria-combobox-trigger` remains the structural wrapper and positioning anchor. It continues to expose `data-has-value` and disabled styling state.

The package removes these semantics from Trigger:

- `role="combobox"`;
- `aria-haspopup`;
- `aria-expanded`;
- `aria-controls`;
- package-authored `aria-disabled` used as the combobox control state.

Trigger remains non-focusable unless the consumer explicitly authors separate semantics.

### Input

`aria-combobox-input` remains the focused editable element. When it has no nested native input, it retains the existing `contenteditable="plaintext-only"` and `tabindex="0"` behavior.

The Input owns:

- `role="combobox"`;
- `aria-haspopup="listbox"`;
- `aria-expanded`, reflecting Root's open state;
- `aria-controls`, referencing Content only while open;
- `aria-autocomplete="list"`;
- `aria-activedescendant`, referencing the active rendered option;
- `aria-disabled` and `data-disabled`, reflecting Root or Input disabled state;
- `tabindex="-1"` while disabled and `tabindex="0"` otherwise.

Package-owned combobox semantics are authoritative inside a composed Root. Equivalent consumer-authored values are corrected during tree synchronization so assistive technology receives the actual runtime state.

### Content

`aria-combobox-content` remains the popup listbox. It keeps:

- `role="listbox"`;
- its generated stable ID;
- `aria-labelledby` referencing Trigger's generated ID;
- `aria-multiselectable`;
- `tabindex="0"`;
- open/closed state and portal-compatible visibility;
- the existing mirrored `aria-activedescendant` value.

Keeping the Content mirror preserves current native listbox behavior while making Input the accessible combobox owner.

### Options

`aria-combobox-option` retains stable generated IDs, selection state, disabled state, filtering, active styling, and registration behavior. No public Option API changes.

## Active Descendant Invariant

Input and Content may expose `aria-activedescendant` only when all of the following are true:

1. Root is open.
2. Content is connected and belongs to that Root.
3. The referenced Option is connected and belongs to that Content.
4. The Option is visible.
5. The Option is enabled.
6. The Option remains the runtime active option.

Keyboard navigation and pointer hover continue to set the active option through the existing `setComboboxActiveOption` path. Tree synchronization validates the active ID before mirroring it.

The active ID and both mirrored attributes are cleared when:

- pointer navigation leaves the active option;
- filtering hides the active option;
- the popup closes;
- the active Option disconnects or is removed;
- Content disconnects or is removed;
- no enabled visible option remains.

Disconnect cleanup is initiated from the custom-element lifecycle and resynchronizes the owning Root after the removed node is no longer part of the composed tree.

## Runtime Boundaries

The implementation stays within the existing separated modules:

- `combobox-sync.ts` owns semantic reflection, active-option validation, mirroring, and cleanup;
- `combobox-element.ts` connects removal lifecycle events back to Root synchronization;
- `combobox-actions.ts` continues to route keyboard and pointer navigation through the shared active-option functions;
- `combobox-dom.ts` remains responsible for scoped Root, Input, Content, and Option lookup.

No new production module or public export is required.

## Contract And Testing Checkpoint

Before changing runtime code:

1. Update `packages/combobox/src/component-spec.ts` so Input has the combobox role/default ARIA and Trigger has no default role or combobox ARIA.
2. Update `packages/combobox/readme.md` to describe Input-owned semantics and the cleanup invariant.
3. Update package contract assertions for the new part metadata.
4. Add focused runtime tests covering ownership, open-state attributes, navigation, cleanup, disabled state, and existing behavior preservation.
5. Run the focused tests and confirm they fail because the old runtime still assigns semantics to Trigger or retains stale active IDs.

This failing-test checkpoint is recorded before production changes, then implementation proceeds without another user pause.

## Test Cases

Package tests must verify:

- Root has no package-authored combobox role.
- Trigger is a semantic wrapper with no package-authored combobox role or open-state ARIA.
- Input owns `role="combobox"`, `aria-haspopup`, `aria-expanded`, `aria-autocomplete`, and open-only `aria-controls`.
- Root and Input disabled state continues to disable Input interaction and reflect disabled state.
- Arrow navigation updates Input and Content to the same active Option ID.
- Pointer navigation updates Input and Content to the same active Option ID.
- Pointer leave clears both active-descendant attributes.
- Filtering clears a reference to an Option that becomes hidden.
- Closing clears the active ID and both attributes.
- Removing the active Option clears both attributes and its active state.
- Removing Content clears Input's attribute.
- Existing selection, multiple mode, filtering, fallback, outside dismissal, and keyboard behavior remain passing.

Tests use real custom elements and DOM events. No mock active-item store is introduced.

## Documentation

Update the package-level `readme.md` because every package must retain a current native contract. Update the generated `componentSpec` metadata used by package and docs consumers.

The existing docs examples and anatomy do not change because composition and visual output remain the same. Any accessibility prose touched in the existing dirty combobox docs file must be reconciled without overwriting the user's example/snippet work.

## Compatibility

The public exports, custom-element names, attributes/properties for state and selection, emitted events, and DOM structure remain unchanged.

Intentional semantic changes:

- accessibility queries find `aria-combobox-input` as the combobox;
- Trigger no longer appears as a combobox;
- Input receives open-state and popup relationship attributes;
- stale active-descendant references disappear as soon as their invariant is broken.

## Verification

Run fresh verification in this order:

1. focused new combobox tests during each red-green cycle;
2. the full `@ariaui-web/combobox` package test suite;
3. combobox package lint;
4. combobox package build;
5. repository-level tests or affected docs tests if documentation metadata changes their output;
6. inspect `git diff` to confirm the existing docs work is preserved and generated artifacts were not edited accidentally.

No visual QA is required unless rendered docs markup or styles change. The ARIA runtime change has no intended visual output.

## Success Criteria

The feature is complete when:

- Input is the only package-owned combobox role;
- Input owns accurate open-state and popup relationship attributes;
- Input and Content mirror the active rendered Option ID;
- no stale active-descendant reference survives filtering, closing, Option removal, or Content removal;
- existing combobox interactions remain passing;
- the package contract and tests describe the new behavior;
- the user's pre-existing docs changes remain intact;
- focused tests, the full package suite, lint, and build succeed.

## Out Of Scope

- changing the package catalog, package scope, directory name, or docs slug;
- changing filtering, selection, or value events;
- changing popup focusability or tab behavior;
- removing Content's mirrored active descendant;
- redesigning examples or styles;
- changing the React source package in the sibling repository;
- teaching the generator to consume unimplemented design documents.
