# Skeleton Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/skeleton`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-skeleton` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/skeleton/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 7 of 7 documented sections are represented after native normalization.
- Requirement lines: 33

### Scope

- `@ariaui-web/skeleton` is a headless loading placeholder primitive inspired by Radix Themes Skeleton. It provides loading-state semantics and size attributes/properties, but no visual styling.

### Public API

- The package exports:
- `Root`
- `RootProps`
- No aliases, hooks, context, or compound parts are exported.

### Root Contract

- `Root` renders loading placeholders while `loading` is true and exposes children as direct content through `display: contents` when `loading` is false.
- Code line: interface RootProps
- Code line: extends Omit<native element attributes/properties for "span", "children"> {
- Code line: children?: Node | string;
- Code line: loading?: boolean; // default: true
- Code line: width?: CSS properties["width"];
- Code line: minWidth?: CSS properties["minWidth"];
- Code line: maxWidth?: CSS properties["maxWidth"];
- Code line: height?: CSS properties["height"];
- Code line: minHeight?: CSS properties["minHeight"];
- Code line: maxHeight?: CSS properties["maxHeight"];

### Loading behavior

- `loading={true}` is the default.
- When `native-composition` is present and the first child is an element, that child becomes the effective loading placeholder host.
- If children are text, missing, or not explicitly composed, `aria-skeleton` remains the loading placeholder host.
- The loading host receives `aria-hidden`, `inert`, `tabIndex={-1}`, and `data-state="loading"`.
- Text and non-element placeholders also receive `data-inline-skeleton`.
- `loading="false"` removes placeholder semantics and uses `display: contents` so authored children remain direct rendered content.

### Styling Contract

- This package is intentionally unstyled. Consumers provide all placeholder visuals through `className`, `style`, or the size attributes/properties.
- Recommended examples:
- `className="h-4 w-48 animate-pulse rounded-md bg-muted"`
- `width={192} height={16}`
- `className="animate-pulse rounded-md bg-muted text-transparent"` when wrapping text.

### Accessibility Contract

- Skeletons are visual loading affordances, not interactive widgets or progress announcements. The loading host is hidden from assistive technology and made inert so pending content cannot be focused or used.
- When `loading={false}`, final content is rendered directly and must carry its own roles, labels, and keyboard behavior.

### Change Control

- Behavior or API changes must update, in order:
- Unit tests in `packages/skeleton/__test__`.
- This spec.
- Documentation examples and API tables in `web/doc`.






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

## Skeleton Source Test Parity

- Learning sources: `../ariaui/packages/skeleton/__test__/skeleton.test.tsx`, `../ariaui/web/doc/src/app/docs/components/skeleton/page.md`, and `../ariaui/web/doc/src/components/skeleton/SkeletonDemo.tsx`
- Source test cases: 6
- Native adaptation: `aria-skeleton` defaults to loading, uses `native-composition` to apply source child-cloning behavior to the first child host, and exposes loaded children through `display: contents`.
- Documentation parity: Card, With Children, and With Text examples retain the source Tailwind class composition and page structure.
