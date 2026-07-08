# Toast Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/toast`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Close | `aria-toast-close` | `button` |
| Item | `aria-toast-item` | `listitem` |
| List | `aria-toast-list` | `list` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/toast/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 13 of 13 documented sections are represented after native normalization.
- Requirement lines: 93

### Scope

- This document defines the current contract for `@ariaui-web/toast`.

### Primary References

- Radix toast docs: https://www.radix-ui.com/primitives/docs/components/toast
- WAI-ARIA `status` role: https://www.w3.org/TR/wai-aria-1.2/#status

### Mental Model

- The current `@ariaui-web/toast` implementation is a lightweight global toast store plus a list/item rendering pair. A module-level array holds the active toasts. Any component can push a toast via `createToast`, and any mounted `List` subscribes to the store via `useToast` and renders the queue. Newest toasts are prepended (newest-first order).

### Part Model

- Table row: Export | Element | Role
- Table row: `createToast` | - | Imperative function; pushes a new toast into the global store and returns its dismiss handler
- Table row: `useToast` | - | Hook; subscribes a component to store updates
- Table row: `List` | `<ul>` | Container that renders all active toasts
- Table row: `Item` | `<li>` | Individual toast; manages auto-dismiss timer and live-region semantics

### State Contract

- Toast state is kept in a module-level `currentToasts` array (not native Web Component state).
- `createToast({ template, duration, id })` prepends a toast to the array, notifies all observers, and returns a dismiss handler for that toast.
- `useToast()` returns `{ toasts }` and subscribes the calling component to store changes via an observer list.
- Dismissal (via close button or auto-dismiss timeout) removes the toast from the array by `id` and notifies observers.
- There is no controlled/uncontrolled toggle; the store is always the source of truth.

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Roles and Live Regions

- `List` renders `role="region"` with `aria-label="Notifications"` and `aria-live="polite"`. New toast additions are announced to assistive technology through the container.
- `Item` renders `role="status"` with `aria-live="off"`. The explicit `aria-live="off"` prevents individual items from triggering duplicate announcements (the List container handles it).
- `aria-atomic="true"` is set on each item so the entire toast content is announced as a unit.

### Focus Management

- `List` (`<ul>`) has `tabIndex={0}`, making the list itself focusable.
- `Item` (`<li>`) has `tabIndex={0}`, making each toast focusable.
- When a trigger element has a ref passed as `triggerRef` to `List`:
- A `keydown` listener is attached to the trigger; pressing **Tab** while the trigger is focused stops propagation and moves focus to the toast list.
- When the toast queue empties (`toasts.length === 0`), focus is restored to `triggerRef.current`.

### Keyboard Interactions

- Table row: Key | Context | Behavior
- Table row: Tab | Trigger (with `triggerRef`) | Prevented; focus moves to `List`
- Table row: Enter | Close button | Dismisses the toast (standard button activation)
- Table row: Space | Close button | Dismisses the toast (standard button activation)
- **Not currently implemented:** Escape to dismiss, arrow-key navigation between toasts.

### Behavior Contract

- `createToast` adds a new toast with `{ template, duration, id }` and returns a dismiss handler that removes that toast.
- `Item` auto-dismisses after `duration` ms (default `3000`) while it is not paused by item hover, list hover, or focus.
- `Item` reflects `data-mounted="true"` after the item has mounted, which is used by examples to trigger enter animations.
- Mouse enter on a toast item clears the active dismiss timer (pause).
- Mouse leave on a toast item restarts the dismiss timer with the full `duration`.
- Mouse enter on the toast list clears dismiss timers for all rendered items.
- Mouse leave on the toast list restarts every unpaused item with the full `duration`.
- Focus on a toast item clears the active dismiss timer (pause for keyboard users).
- Blur on a toast item restarts the dismiss timer with the full `duration`.
- `List` provides each rendered toast instance with context containing its dismiss handler, duration, newest-first index, list-hover pause state, and optional stack metadata.
- `Close` reads the active toast context and dismisses its owning toast when activated.
- `List` restores focus to the `triggerRef` element when the queue empties.
- `List` clears the global toast queue on unmount and replaces the store array, so rendered templates are not retained after the list is removed.
- `visibleToasts` defaults to `3`. Non-stacked lists register it as the maximum number of active toasts kept by the mounted list.
- When a non-stacked mounted list has registered a limit, `createToast` removes older bottom-list toasts before notifying subscribers, so the queue never emits an over-limit snapshot.
- In stack mode, `visibleToasts` is the collapsed visible count. When a new toast arrives past that count, the newest toast renders at the top of the stack first. After the enter duration, the extra bottom stack item gets `data-exiting="true"` and `data-removed="true"`, scales down for `150ms`, fades for another `150ms`, and then leaves the store.
- Rapid stack overflow is coalesced to the newest visible toasts plus the current bottom overflow candidate. Pending exits are replaced before they start, and hidden older overflow is pruned so a burst of `createToast` calls does not replay stale bottom items later.
- `List` can opt into stack metadata with `stack`.
- `stack` defaults to `false`; visual stack metadata remains opt-in.
- The stack expands while the list is hovered or contains focus.
- `stackOffset` configures the pixel distance between collapsed stack layers (default `14`).
- `stackScaleStep` configures the per-layer scale reduction in the collapsed stack (default `0.08`).
- The package writes stack metadata and CSS variables to each item for styling rather than applying visual styles.
- Stack offset variables include `--toast-offset-up` and `--toast-offset-down` so consumers can choose whether collapsed items move upward or downward. The default stack uses a pronounced offset and scale step so layered items remain visible while collapsed.
- Stack exit variables include `--toast-exit-scale` so consumers can scale the outgoing bottom toast before fading it out.

### Data and ARIA Reflection

- Minimum expected reflection on `List`:
- `role="region"`
- `aria-live="polite"`
- `aria-label="Notifications"`
- `tabIndex={0}`
- When `stack` is enabled: `data-stack="true"` and `data-expanded="true|false"`
- Minimum expected reflection on `Item`:
- `role="status"`
- `aria-live="off"`
- `aria-atomic="true"`
- `data-state="open"`
- `data-mounted="true|false"`
- `data-removed="true|false"`
- When rendered inside a `List`: `data-index` reflects the zero-based newest-first item index.
- When rendered inside a stacked List:
- `data-stack="true"`
- `data-expanded="true|false"`
- `data-exiting="true|false"`
- `data-exit-phase="scale|fade"` while the bottom stack item is exiting
- `data-front="true|false"`
- `data-visible="true|false"`
- CSS variables: `--toast-index`, `--toast-count`, `--toast-offset`, `--toast-offset-up`, `--toast-offset-down`, `--toast-scale`, `--toast-exit-scale`, `--toast-visible-toasts`, `--toast-z-index`

### Composition Rules

- `List` must be mounted for toasts to render. It is typically placed inside a `Portal.Root` at the application root.
- `Item` is passed as the `template` attributes/properties to `createToast`; it is not rendered directly by the consumer.
- `Close` must be rendered inside `Item` so it can read the active toast context.
- `useToast()` can be called from any component to read the toast queue, but `List` already handles rendering.

### Coverage Expectations

- Tests for this package should cover:
- Toast creation and list rendering
- Auto-dismiss timing
- Hover pause and resume behavior
- Close-button wiring through the rendered template
- Focus restoration through `triggerRef`
- Accessibility (axe) - no violations on default render
- Keyboard activation of trigger and close button
- Trigger `Tab` routing from `triggerRef` to `List`
- Focus pause and blur resume behavior
- Opt-in stack metadata and hover/focus expansion behavior
- Dynamic newest-first `data-index` reflection for list-managed items
- Instant `visibleToasts` trimming for non-stacked lists, immediate newest-toast reveal before deferred two-phase bottom stack exit, and rapid stack overflow coalescing
- `List` unmount cleanup clears the store and releases the previous toast array reference






## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
