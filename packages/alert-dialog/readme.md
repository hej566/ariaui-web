# AlertDialog Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/alert-dialog`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-alert-dialog` | none |
| Action | `aria-alert-dialog-action` | `button` |
| Cancel | `aria-alert-dialog-cancel` | `button` |
| Content | `aria-alert-dialog-content` | none |
| Description | `aria-alert-dialog-description` | none |
| Icon | `aria-alert-dialog-icon` | none |
| Overlay | `aria-alert-dialog-overlay` | `presentation` |
| Portal | `aria-alert-dialog-portal` | none |
| Title | `aria-alert-dialog-title` | `heading` |
| Trigger | `aria-alert-dialog-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/alert-dialog/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 16 of 16 documented sections are represented after native normalization.
- Requirement lines: 156

### Scope

- This document describes the current behavior of `@ariaui-web/alert-dialog` as implemented in this package.
- Primary sources:
- WAI-ARIA APG Alert and Message Dialogs: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- Radix Alert Dialog: https://www.radix-ui.com/primitives/docs/components/alert-dialog
- APG `alertdialog` behavior is the design target. Where the current implementation differs, this document records the current package contract rather than the ideal target.

### Mental Model

- `@ariaui-web/alert-dialog` is an interruptive, modal confirmation dialog for important actions.
- It is not a passive inline callout and it is not a generic non-modal dialog.
- Package goals:
- require immediate user attention
- prevent interaction outside the alert dialog while open
- announce urgent context and consequences clearly
- move focus into the dialog when it opens
- restore focus appropriately when it closes

### Part Model

- The package exposes a composable part structure modeled after Radix Alert Dialog:
- `Root`
- `Trigger`
- `Portal`
- `Overlay`
- `Content`
- `Title`
- `Description`
- `Icon`
- `Action`
- `Cancel`
- No additional public aliases are defined in the current implementation.

### Open State Contract

- The component supports both controlled and uncontrolled state.
- Public API:
- `open?: boolean`
- `defaultOpen?: boolean`
- `onOpenChange?: (open: boolean) => void`
- Behavior:
- `Root` is the source of truth for open state
- `Trigger` opens the alert dialog
- `Action` and `Cancel` close the alert dialog unless prevented by composed user handlers
- `Escape` closes the dialog unless prevented by the component contract
- when closed, modal content is removed from the active interaction tree

### Modal Contract

- While open:
- the alert dialog is modal
- background content is marked inert by traversing ancestor siblings from the content node
- viewport scrolling is locked by applying `overflow: hidden` to both `document.body` and `document.documentElement`
- pointer interaction outside the dialog does not activate background controls
- focus cannot escape the dialog with normal keyboard navigation
- outside-tree inerting is reference-counted, so shared background elements remain inert until the last open alert dialog that claimed them closes
- viewport scroll locking is reference-counted, so the original overflow styles are restored only after the last open alert dialog closes
- While closed:
- portal, overlay, and content may be unmounted by default
- `forceMount` may keep portal/overlay/content mounted for animation or measurement use cases
- `native composition` may slot overlay/content attributes/properties onto a custom host such as a Framer Motion element

### Roles, Labels, and ARIA

- Open-state semantics:
- dialog container exposes `role="alertdialog"`
- dialog container exposes `aria-modal="true"`
- dialog container is labelled by `Title`
- dialog container is described by `Description` when present
- Part behavior:
- `Title` provides the accessible name source for the dialog
- `Description` provides additional consequence/context text
- `Title` and `Description` support `native composition` while preserving ID registration
- `Icon` renders decorative icon content with `aria-hidden="true"`
- `Action` and `Cancel` are interactive buttons
- ID linkage implementation:
- `Title` and `Description` generate stable IDs with `@ariaui-web/utils` `useId`
- `Title` and `Description` register their IDs through `ContentContext`
- registration currently happens during render, and unregister happens in `useIsomorphicLayoutEffect` cleanup
- `Content` syncs `aria-labelledby` and `aria-describedby` onto the dialog element via `useIsomorphicLayoutEffect`
- multiple mounted `Title` parts concatenate into `aria-labelledby`
- multiple mounted `Description` parts concatenate into `aria-describedby`
- when one of several registered titles or descriptions unmounts, the remaining IDs stay linked
- `Title` native custom element defaults to `aria-level="2"` while preserving `role="heading"`.
- `Icon` native custom element exposes `aria-hidden="true"`.
- `Content` native custom element exposes `data-alert-dialog-content`.
- `Cancel` native custom element exposes `data-alert-dialog-cancel`.

### Focus Management

- Opening behavior:
- focus moves into the alert dialog when it opens
- default initial focus should land on the least destructive action when the dialog presents a destructive choice (prefers `Cancel` over `Action`)
- `onOpenAutoFocus` may prevent the default initial focus move
- Open-state behavior:
- tab order is trapped within the modal dialog via `@ariaui-web/focus-scope` (`useFocusScope` with `loop` and `trapped`)
- `Tab` and `Shift+Tab` cycle within focusable descendants
- Closing behavior:
- focus returns to the trigger when one is present
- when no trigger is present, focus restore falls back to `@ariaui-web/focus-scope` and attempts to return focus to the previously focused element
- `onCloseAutoFocus` may prevent the default focus restoration
- viewport scroll styles are restored to their pre-open values after the last open alert dialog closes

### Keyboard Contract

- Supported:
- `Enter` activates the focused action button
- `Space` activates the focused button
- `Escape` closes the alert dialog
- `Tab` and `Shift+Tab` remain trapped within the open dialog
- Not in scope:
- no listbox/menu-style arrow-key roving model is required
- no typeahead behavior is required

### Pointer Contract

- Supported:
- clicking the trigger opens the dialog
- clicking `Action` closes the dialog after the action runs unless prevented
- clicking `Cancel` closes the dialog unless prevented
- Current behavior:
- pointer interaction outside the content does not interact with underlying UI
- outside pointer interaction is blocked by inert background content rather than by a dedicated outside-click dismiss handler

### Action Semantics

- `Action`:
- represents the affirmative or destructive confirmation path
- closes the dialog by default after activation unless prevented
- `Cancel`:
- represents the safe dismissal path
- closes the dialog by default
- should be present when the dialog requests confirmation for a potentially destructive action

### Portal and Layering

- `Portal` groups overlay/content under a native custom element host rather than relocating DOM nodes.
- content and overlay stay inside the `Portal` host when composed inside `Portal`
- `Portal` does not expose a `container` attribute in the native custom element contract; consumers choose DOM placement by placing the `aria-alert-dialog-portal` host.
- `Portal` accepts `force-mount` to keep children mounted while the dialog is closed
- during server-rendered HTML, `Portal` children remain inline so open dialog content exists in authored DOM order
- in the browser, the `Portal` host stays where authored and coordinates state for its child custom elements
- layering order must keep overlay behind content and above background content
- nested overlays/focus scopes are not explicitly coordinated beyond the underlying focus scope and inert logic

### Data Attributes

- The package should expose state metadata consistent with the rest of the design system and Radix-style expectations.
- Minimum contract when relevant:
- `data-state="open|closed"` on stateful parts such as `Trigger`, `Overlay`, and `Content`
- `data-state`, dialog ARIA, focus-scope refs, and inert markers are applied to the slotted host when `native composition` is used
- Optional state reflection where supported:
- `data-disabled`
- `data-placeholder`
- ARIA and `data-*` state must remain synchronized at every transition.

### Consumer Event Composition

- Consumer handlers are additive:
- user-provided handlers run alongside internal handlers
- internal open/close/focus behavior remains authoritative unless the consumer explicitly prevents default where supported
- Observable ordering:
- state callbacks should fire before teardown side effects that remove the content tree

### SSR Contract

- If `defaultOpen` is used during SSR:
- the server-rendered tree must reflect the open state (role, id, content text)
- `aria-labelledby` and `aria-describedby` are not present in the static SSR output because they are applied in `useIsomorphicLayoutEffect` after child registration
- hydration must not change the open/closed state unexpectedly

### Coverage Expectations

- Tests under `packages/alert-dialog/__test__` cover:
- `role="alertdialog"` and `aria-modal="true"` on open content.
- `Title` and `Description` labelling linkage.
- Controlled and uncontrolled open-state behavior.
- Trigger opens the dialog.
- `Action` and `Cancel` close behavior.
- `Escape` dismissal.
- Focus moves into the dialog on open.
- Focus is trapped while open.
- Focus returns to the trigger on close.
- Overlay/content mounting and optional `forceMount`.
- Portal rendering behavior in the client and inline SSR output when composed through `Portal`.
- `data-state` synchronization.
- Multiple `Title` / `Description` ID concatenation.
- `preventDefault()` on `Action` / `Cancel` preserving the open state.
- Reference-counted inerting across multiple open dialogs.
- Viewport scroll locking while open, including restoration of prior overflow styles after the last open dialog closes.
- Overlay and Content slot attributes/properties onto custom hosts with `native composition` for animation composition.
- Portal `container` and `forceMount` behavior.
- Title and Description slot attributes/properties onto custom hosts with `native composition`.
- `onOpenAutoFocus` and `onCloseAutoFocus` cancellation.

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests for this package.
- Implementation.
- Docs examples and visual interaction tests when present.




## Alert Dialog Source Test Parity

- Learned from: `../ariaui/packages/alert-dialog/__test__/alert-dialog.test.tsx`
- Learned from accessibility: `../ariaui/packages/alert-dialog/__test__/accessibility.test.tsx`
- Source test cases: 64
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, `openchange` events, focus movement, hidden state, inert markers, and native custom element hosts, not framework portals.
- Native alert-dialog tests must cover:
- closed-by-default content that is outside the alertdialog accessibility tree
- trigger-open behavior and prevented trigger clicks
- uncontrolled `default-open`, controlled-style `open` and `openchange` behavior
- content `role="alertdialog"`, `aria-modal`, title linkage, and description linkage
- cancel and action close behavior with `preventDefault` guards
- Escape dismissal, non-Escape key handling, and preventable Escape close hooks
- focus trapping and trigger focus restoration
- disabled trigger focus restoration guard
- force-mounted portal, overlay, and content hidden/ARIA state
- Portal host placement and `force-mount` behavior
- unique and concatenated title and description ids, including removal updates
- reference-counted inert background and scroll locking
- preventable `openautofocus` and `closeautofocus` custom events
- native composition equivalents for root, trigger, portal, overlay, content, title, description, action, and cancel hosts


## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- alert-dialog source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
