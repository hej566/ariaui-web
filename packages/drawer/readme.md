# Drawer Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/drawer`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-drawer` | none |
| Action | `aria-drawer-action` | `button` |
| Cancel | `aria-drawer-cancel` | `button` |
| Close | `aria-drawer-close` | `button` |
| Content | `aria-drawer-content` | none |
| Description | `aria-drawer-description` | none |
| Footer | `aria-drawer-footer` | none |
| Header | `aria-drawer-header` | none |
| Overlay | `aria-drawer-overlay` | `presentation` |
| Portal | `aria-drawer-portal` | none |
| Title | `aria-drawer-title` | `heading` |
| Trigger | `aria-drawer-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/drawer/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 27 of 27 documented sections are represented after native normalization.
- Requirement lines: 140

### Scope

- This document defines the current contract for `@ariaui-web/drawer`.
- It uses:
- WAI-ARIA Dialog (Modal) pattern as the accessibility baseline
- shadcn/ui Drawer (Vaul) as the compositional API model
- `@ariaui-web/dialog` as reference for focus management and ARIA wiring conventions
- This package is the slide-out drawer composition layer. It is not a generic dialog - it is a directional panel that slides in from an edge of the viewport.

### Primary References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- shadcn/ui Drawer: https://ui.shadcn.com/docs/components/drawer
- Vaul: https://github.com/emilkowalski/vaul
- `packages/dialog/readme.md`

### Mental Model

- `@ariaui-web/drawer` is a composable primitive for presenting a slide-out panel anchored to an edge of the viewport. It shares the same dialog accessibility model as `@ariaui-web/dialog` - modal focus trap, `role="dialog"`, `aria-modal`, label wiring - but adds directional slide-in/out positioning and a structural part hierarchy (header, footer, close) suited to side and bottom panels.
- Ownership:
- `drawer` owns open state, focus management, body scroll lock, portal rendering, and dialog ARIA semantics
- directional positioning and animation are applied to `Content` via the `side` attributes/properties

### Part Model

- The package exports a composable part structure:
- `Root`
- `Trigger`
- `Portal`
- `Overlay`
- `Content`
- `Header`
- `Title`
- `Description`
- `Footer`
- `Close`

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Open State

- The package supports controlled and uncontrolled open state.
- Current public shape:
- `open?: boolean`
- `default-open` / `defaultopen` attributes for uncontrolled initial state
- `openchange` event with `event.detail.open`
- Behavior:
- `Root` is the source of truth for drawer visibility
- `Trigger` opens the drawer
- `Close` and `Overlay` click close the drawer
- `Escape` closes the drawer unless `onEscapeKeyDown` calls `event.preventDefault()`
- overlay click closes the drawer unless `onInteractOutside` calls `event.preventDefault()`
- closing restores focus to the trigger by default

### Side State

- The package supports a `side` attributes/properties on `Content`:
- `side?: "top" | "right" | "bottom" | "left"` - defaults to `"bottom"`
- Side controls which edge the panel is displayed from. Positioning and animation reflect the resolved side.

### Part Contracts

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Responsibilities:
- own drawer open/closed state (controlled/uncontrolled)
- provide context to all descendant parts
- generate unique IDs for title and description accessibility wiring

### Trigger

- Responsibilities:
- open the drawer on click
- expose drawer-expanded state via ARIA attributes
- act as the focus restoration target when the drawer closes

### Portal

- Responsibilities:
- portal the overlay and content to `document.body` by default
- accept an optional `container` attributes/properties to render into a custom element

### Overlay

- Responsibilities:
- render the background backdrop behind the drawer content as a custom element by default, or slot the overlay attributes/properties onto a single child element when `native-composition` is set
- support Framer Motion and other custom overlay hosts through `native-composition` while preserving overlay click dismissal
- close the drawer on click (unless `onInteractOutside` prevents it)
- only render when the drawer is open

### Content

- Responsibilities:
- render the drawer panel as a custom element by default, or slot the panel attributes/properties onto a single child element when `native-composition` is set
- support Framer Motion and other custom hosts through `native-composition` while preserving dialog ARIA semantics
- trap focus within the panel using FocusScope
- handle `Escape` dismissal
- restore focus on close
- lock body scroll while open
- prevent scroll outside the content area (wheel, touch, keyboard)
- display from the edge specified by the `side` attributes/properties
- only render when the drawer is open

### Header

- Responsibilities:
- provide a layout container for the drawer title and description
- renders a `<div>`

### Title

- Responsibilities:
- provide the accessible title for the drawer
- its `id` is auto-generated and wired to `Content`'s `aria-labelledby`
- renders an `<h2>`

### Description

- Responsibilities:
- provide the accessible description for the drawer
- its `id` is auto-generated and wired to `Content`'s `aria-describedby`
- renders a `<p>`

### Footer

- Responsibilities:
- provide a layout container for drawer actions (e.g. confirm/cancel buttons)
- renders a custom element
- `aria-drawer-cancel` exposes `data-drawer-cancel` and `type="button"`
- `aria-drawer-action` exposes `data-drawer-action` and `type="button"`

### Close

- Responsibilities:
- close the drawer on click
- renders an `aria-drawer-close` custom element with `type="button"`

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### APG alignment

- The package satisfies the WAI-ARIA dialog modal expectations by default:
- `Trigger` exposes `aria-haspopup="dialog"` and `aria-expanded`
- `Content` exposes `role="dialog"` and `aria-modal="true"`
- `Content` is labelled by `Title` via `aria-labelledby`
- `Content` is described by `Description` via `aria-describedby`
- focus moves into `Content` when the drawer opens
- `Escape` closes the drawer
- focus returns to `Trigger` when the drawer closes

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Dismissal paths

- `Close` click closes the drawer
- `Overlay` click closes the drawer (preventable via `onInteractOutside`)
- `Escape` keydown closes the drawer (preventable via `onEscapeKeyDown`)
- all dismissal paths call `onOpenChange(false)`

### Focus management

- focus moves to the first focusable element in `Content` on open
- `Tab` and `Shift+Tab` cycle focus only within `Content`
- focus returns to `Trigger` on close

### Scroll lock

- body and document scroll are locked while the drawer is open
- wheel, touch, and keyboard scroll events outside `Content` are prevented
- scroll is restored when the drawer closes

### Portal and layering

- `Portal` renders overlay and content into `document.body` by default
- a custom `container` attributes/properties on `Portal` redirects rendering

### Data and ARIA Reflection

- Table row: Part | Attribute | Value
- Table row: `Trigger` | `aria-haspopup` | `"dialog"`
- Table row: `Trigger` | `aria-expanded` | `true \ | false`
- Table row: `Trigger` | `aria-controls` | id of `Content`
- Table row: `Trigger` | `data-state` | `"open" \ | "closed"`
- Table row: `Content` | `role` | `"dialog"`
- Table row: `Content` | `aria-modal` | `"true"`
- Table row: `Content` | `aria-labelledby` | id of `Title`
- Table row: `Content` | `aria-describedby` | id of `Description`
- Table row: `Content` | `data-side` | `"top" \ | "right" \ | "bottom" \ | "left"`
- Table row: `Content` | `data-drawer-content` | present on the actual content host, including when `native-composition` is used
- Table row: `Title` | `id` | auto-generated, referenced by `Content`
- Table row: `Description` | `id` | auto-generated, referenced by `Content`

### Coverage Expectations

- Tests under `packages/drawer/__test__` should cover:
- controlled and uncontrolled open-state behavior
- `Trigger` opens the drawer
- `Close` closes the drawer
- `Overlay` click closes the drawer
- `onInteractOutside` prevents overlay-click dismissal
- `Escape` closes the drawer
- `onEscapeKeyDown` prevents escape dismissal
- focus moves into `Content` on open
- focus trap - Tab and Shift+Tab cycle within `Content`
- focus restoration to `Trigger` on close
- body scroll locked while open; restored on close
- dialog ARIA semantics on `Content`
- `aria-labelledby` / `aria-describedby` wired to `Title` / `Description` ids
- `Trigger` ARIA state reflection (`aria-expanded`, `data-state`)
- portal renders into `document.body` by default
- `side` attributes/properties changes display side on `Content`
- `Content native composition` slots drawer attributes/properties onto a custom host for animation composition
- `Overlay native composition` slots overlay attributes/properties onto a custom host for animation composition
- axe passes in all valid configurations

## Drawer Source Test Parity

- Learned from: `../ariaui/packages/drawer/__test__/drawer.test.tsx`
- Source test cases: 19
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, `openchange` events, focus and scroll behavior, hidden state, and `native-composition` child hosts instead of framework rendering helpers.

Native parity requirements:
- controlled and uncontrolled open-state behavior
- Trigger opens the drawer and respects prevented clicks
- Close, Cancel, Action, Overlay, and Escape dismissal paths
- focus moves into Content, traps with Tab, and restores on close
- body scroll is locked while open and restored when closed
- dialog ARIA semantics and title/description id wiring on Content
- Trigger aria-expanded, aria-controls, aria-haspopup, and data-state reflection
- side attributes reflect `top`, `right`, `bottom`, and `left` on Content
- Content native-composition slots dialog props onto a custom host
- Overlay native-composition slots backdrop props onto a custom host
- Cancel and Action expose data attributes and close unless activation is prevented
- force-mounted overlay and content remain present for docs-only Framer Motion exit animation






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
