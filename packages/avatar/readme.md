# Avatar Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/avatar`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-avatar` | none |
| Fallback | `aria-avatar-fallback` | none |
| Group | `aria-avatar-group` | `group` |
| Image | `aria-avatar-image` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/avatar/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 18 of 18 documented sections are represented after native normalization.
- Requirement lines: 152

### Scope

- This document describes the current behavior of `@ariaui-web/avatar` as implemented in this package.
- There is no dedicated WAI-ARIA APG pattern for avatars. This file records the package's actual contract, not an idealized design-system target.

### Mental Model

- `@ariaui-web/avatar` is a small attributes/properties-driven primitive:
- `Root` renders the shared avatar container and coordinates image loading status for child parts
- `Image` renders and tracks the avatar image
- `Fallback` renders fallback content while the image is not loaded
- `Group` renders a plain grouping container for multiple avatars
- The package is intentionally unstyled. Consumers own layout, shape, sizing, clipping, and visual layering.

### Public API

- The package exports:
- `Root`
- `Image`
- `Fallback`
- `Group`
- Associated type exports:
- `RootProps`
- `ImageProps`
- `FallbackProps`
- `GroupProps`
- The package does not export context or utility helpers.

### Root Contract

- `Root` renders a `div` and provides shared image loading status to `Image` and `Fallback`. It also keeps the existing convenience `src`/`fallback` attributes/properties by rendering internal `Image` and `Fallback` parts when those attributes/properties are supplied.
- Type:
- Code line: interface RootProps extends native element attributes/properties for "div" {
- Code line: src?: string;
- Code line: alt?: string;
- Code line: fallback?: Node | string;
- Code line: fallbackDelayMs?: number;
- Code line: imgProps?: Omit<
- Code line: native element attributes/properties for "img",
- Code line: "alt" | "onError" | "onLoad" | "src"
- Code line: >;
- Code line: onLoad?: EventListener<HTMLImageElement>;
- Code line: onError?: EventListener<HTMLImageElement>;
- Code line: onLoadingStatusChange?: (status: "idle" | "loading" | "loaded" | "error") => void;

### Props

- Table row: Prop | Type | Default | Description
- Table row: `src` | `string \ | undefined` | - | Image source URL. When omitted, no `<img>` is rendered.
- Table row: `alt` | `string` | `""` | Alt text passed to the internal `<img>`.
- Table row: `fallback` | `Node | string` | - | Content rendered whenever the image is not in the `"loaded"` state.
- Table row: `fallbackDelayMs` | `number` | - | Delays fallback rendering by the given number of milliseconds while the image is not loaded.
- Table row: `imgProps` | `Omit<native element attributes/properties for "img", "alt" \ | "onError" \ | "onLoad" \ | "src">` | - | Extra attributes/properties forwarded to the internal `<img>`, such as `srcSet`, `sizes`, `crossOrigin`, `referrerPolicy`, `loading`, and `decoding`.
- Table row: `onLoad` | `EventListener<HTMLImageElement>` | - | Called when the rendered `<img>` resolves as loaded.
- Table row: `onError` | `EventListener<HTMLImageElement>` | - | Called when the rendered `<img>` resolves as failed.
- Table row: `onLoadingStatusChange` | `(status) => void` | - | Called whenever the internal image status changes.
- Table row: `children` | `Node | string` | - | Additional content rendered inside the root container.

### Default behavior

- renders as a `div`
- renders with `role="img"` and `aria-label="avatar"` while the image is not loaded
- removes those default semantics once the image reaches `"loaded"`
- spreads consumer attributes/properties after the defaults, so `role`, `aria-label`, `className`, `style`, and other `div` attributes/properties can override the built-ins

### Image Contract

- `Image` renders an `<img>` when `src` is truthy and reports image loading status to the nearest `Root`.
- Type:
- Code line: interface ImageProps extends native element attributes/properties for "img" {
- Code line: onLoadingStatusChange?: (status: "idle" | "loading" | "loaded" | "error") => void;

### Image lifecycle

- `Image` delegates image status tracking to `useImageLoadingStatus(src, imgRef, onLoad, onError)`.
- Current behavior:
- initial status is `"loading"` when `src` is truthy, otherwise `"error"`
- if `src` is falsy, no `<img>` is rendered
- when `src` is truthy, a real `<img>` is rendered immediately
- when `src` changes, status resets to `"loading"` for the new source until that image loads or errors
- the hook observes the rendered image element, not an off-DOM preload image
- if the rendered image is already complete on effect mount:
- `naturalWidth > 0` resolves to `"loaded"` and invokes `onLoad`
- otherwise, when `src` exists, resolves to `"error"` and invokes `onError`
- if the image is not already complete, DOM `load` and `error` listeners are attached to the rendered `<img>`
- on `load`, status becomes `"loaded"` and `onLoad` is called
- on `error`, status becomes `"error"` and `onError` is called
- `onLoadingStatusChange` is notified for each status value emitted by the image
- listeners are removed on cleanup

### Render behavior by status

- `"loaded"`:
- `<img>` is visible and not `aria-hidden`
- `"loading"` or `"error"`:
- `<img>` stays mounted when `src` exists, but is hidden with `style={{ visibility: "hidden" }}` and `aria-hidden="true"`
- `style` is preserved while the built-in hidden visibility style is added

### Fallback Contract

- `Fallback` renders a `span` while the nearest `Root` status is not `"loaded"`.
- Type:
- Code line: interface FallbackProps extends native element attributes/properties for "span" {
- Code line: delayMs?: number;
- Default behavior:
- renders immediately while image status is not `"loaded"`
- does not render once the image status is `"loaded"`
- delays rendering by `delayMs` when provided
- forwards all other `span` attributes/properties

### Current limitations

- no controlled status API
- no retry API
- the default root label is always `"avatar"` unless the consumer overrides it

### Group Contract

- `Group` renders a `div`.
- Type:
- Code line: type GroupProps = native element attributes/properties for "div";
- Default behavior:
- renders with `role="group"`
- forwards all other `div` attributes/properties
- spreads consumer attributes/properties after the default role, so callers may override `role`
- The component does not provide overlap, stacking, spacing, ordering, or labeling behavior beyond that default role.

### Accessibility Contract

- The package provides only minimal built-in semantics:
- `Root` behaves like an image container while fallback content is visible by defaulting to `role="img"` and `aria-label="avatar"`
- once the actual image is loaded, those root semantics are removed and the `<img>` becomes the accessible image
- `Group` defaults to `role="group"`
- Consumers remain responsible for:
- providing meaningful `alt` text when the image itself should be descriptive
- overriding `aria-label` on `Root` when `"avatar"` is too generic
- labeling `Group` where grouping semantics alone are insufficient

### Styling Contract

- This package is intentionally unstyled.
- Current behavior:
- no default classes
- no built-in sizing, border radius, overflow clipping, layout, or object-fit styles
- the only built-in inline style is `visibility: "hidden"` on the internal `<img>` while the image is not loaded
- consumers are expected to style the root, fallback content, and any additional children

### State And Runtime Contract

- Image status is managed by `useImageLoadingStatus` in [`src/hooks/useStatus.ts`](./src/hooks/useStatus.ts):
- status union: `"idle" | "loading" | "loaded" | "error"`
- current implementation initializes to `"loading"` or `"error"` and returns `"loading"` again when `src` changes
- uses `useLayoutEffect` in the browser and `useEffect` elsewhere via an isomorphic alias
- relies on `img.complete` and `img.naturalWidth` for the already-resolved fast path
- otherwise relies on native DOM `load` and `error` events from the rendered `<img>`
- The package does not currently provide:
- controlled status
- retries

### SSR And Runtime Constraints

- Both public entrypoints are client components.
- Current implications:
- the package is intended for client-rendered native Web Component trees
- image resolution state depends on browser DOM image APIs
- there is no server-specific image loading branch

### Coverage Expectations

- Tests under `packages/avatar/__test__` currently cover:
- Root default `role="img"` and `aria-label="avatar"` while fallback is shown.
- Basic accessibility via `axe`.
- Fallback rendering when `src` is omitted.
- Fallback rendering while an image is still loading.
- Fallback removal after `load`.
- Already-complete successful image path.
- Removal of default root semantics once the image is loaded.
- Fallback retention after `error`.
- Already-complete broken image path.
- `Node | string` fallback content.
- Consumer overrides for `role` and `aria-label`.
- `onLoad` callback invocation.
- `onError` callback invocation.
- Combined fallback/state behavior with `onLoad`.
- Fallback reset while a changed image `src` is loading.
- Delayed fallback rendering via `fallbackDelayMs`.
- Suppression of delayed fallback when the image loads before the delay.
- Forwarding `imgProps` to the rendered `<img>`.
- `onLoadingStatusChange` callback invocation.
- Coordination between independent `Image` and `Fallback` parts.
- Delayed rendering on independent `Fallback`.
- Prop forwarding and status reporting on independent `Image`.
- Combined fallback/state behavior with `onError`.
- Correct `src` and `alt` on the rendered `<img>`.
- No `<img>` when `src` is omitted.
- `Group` default `role="group"`.
- `Group` role override.
- Separate example tests cover docs/demo compositions.

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests for this package.
- Docs examples and visual interaction tests when present.






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
