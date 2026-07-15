# Combobox Arrow Button Focus Design

**Status:** Approved on 2026-07-15

## Goal

Keep the `aria-combobox-input` focused whenever a mouse press on the combobox's arrow button opens or closes the popup. The behavior must apply to every combobox package consumer, including all documentation examples.

## Root Cause

The `aria-combobox-button` `mousedown` handler prevents the browser's default focus movement and toggles the Root, but it never focuses the Input. The handler also records the Root so the following `click` is ignored for toggle deduplication. Consequently, focus remains on whichever unrelated element was active before the mouse press.

## Decision

Implement the behavior in the combobox package's arrow-button `mousedown` path. After the open state has been toggled in either direction, synchronously focus the enabled `aria-combobox-input` with `preventScroll`.

Synchronous focus is intentional: it makes the completed mouse interaction immediately observable and avoids a deferred callback that could restore focus after a subsequent user action.

## Scope

- Apply focus only to mouse activation of `aria-combobox-button`.
- Focus after both opening and closing.
- Keep clicks on `aria-combobox-trigger` and `aria-combobox-input` unchanged.
- Keep keyboard and programmatic `click` behavior unchanged.
- Do nothing when the Root, Button, or Input is disabled, or when the Input is absent.
- Focus the `aria-combobox-input` custom-element host, which is the package's input component and current focus owner.

## Event Flow

1. A primary mouse press reaches the enabled `aria-combobox-button` handler.
2. The handler prevents the Button from taking browser focus.
3. The handler marks the Root in the existing mouse-down deduplication set.
4. The handler toggles the Root's open state.
5. The handler synchronously focuses the enabled Input with `{ preventScroll: true }`.
6. The subsequent `click` is consumed by the existing deduplication path and does not toggle or move focus again.

## Testing

Add package-level regression coverage using an unrelated focused element:

- Mouse-pressing the arrow button to open focuses the Input.
- Moving focus away and mouse-pressing the arrow button to close focuses the Input again.
- Disabled or missing Input cases remain safe no-ops.
- Existing trigger, keyboard, and toggle behavior remains covered by the package suite.

Add a documentation-example assertion that activates an example's actual arrow button and verifies the Input owns focus after open and close. Because the documentation test file contains unrelated in-progress work, make only a narrow combobox-specific edit and preserve all existing changes.

## Verification

- Run the focused combobox package tests.
- Run the focused documentation tests that exercise combobox examples.
- Run the relevant type and build checks required by the repository.
- Verify an actual rendered combobox example in a browser when the available browser tooling supports it. This is a focus-only change and should not alter visual styling.

## Out of Scope

- The separate `aria-activedescendant` feature.
- Focusing the Input for mouse clicks anywhere in the Trigger wrapper.
- Changing keyboard or programmatic Button activation semantics.
- Changing popup styling, animation, or layout.
