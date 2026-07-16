# Pagination Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/pagination`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-pagination` | `navigation` |
| Content | `aria-pagination-content` | `list` |
| Ellipsis | `aria-pagination-ellipsis` | none |
| Item | `aria-pagination-item` | `listitem` |
| Link | `aria-pagination-link` | `link` |
| Next | `aria-pagination-next` | `link` |
| Pages | `aria-pagination-pages` | none |
| Previous | `aria-pagination-previous` | `link` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/pagination/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 11 of 11 documented sections are represented after native normalization.
- Requirement lines: 101

### Scope

- This package provides the `@ariaui-web/pagination` navigation primitive.

### Primary References

- APG navigation landmark guidance: https://www.w3.org/WAI/ARIA/apg/

### Mental Model

- `@ariaui-web/pagination` is a structural primitive for page links and related controls, with root-managed page-window state. The public API is built from a small set of reusable parts:
- `Root` owns pagination state and exposes page-link attributes/properties through context.
- `Content` and `Item` provide list structure.
- `Link`, `Previous`, `Next`, and `Ellipsis` render the interactive and non-interactive controls.
- `Pages` repeats its children for each generated page-window item.
- `Pages` uses composition instead of dedicated generated-item components. Put the existing `Link` and `Ellipsis` components inside `Pages`; they read the current page-window item from context and render only when that item matches.

### Part Model

- The package exports:
- `Root`
- `Content`
- `Item`
- `Link`
- `Previous`
- `Next`
- `Ellipsis`
- `Pages`
- Named exports are also available for each part, along with the public types:
- `RootTypes`
- `ContentTypes`
- `ItemTypes`
- `LinkTypes`
- `EllipsisTypes`
- `PagesTypes`
- `PaginationPageItem`
- `PaginationEllipsisItem`
- `PaginationItem`

### Usage

- Code line: import Pagination from "@ariaui-web/pagination";
- Code line: export function Example() {
- Code line: return (
- Code line: <aria-pagination totalPages={8} maxVisiblePages={6} defaultPage={1}>
- Code line: <aria-pagination-content>
- Code line: <aria-pagination-item>
- Code line: <aria-pagination-previous>Previous</aria-pagination-previous>
- Code line: </aria-pagination-item>
- Code line: <aria-pagination-pages>
- Code line: <aria-pagination-link activeClassName="active" />
- Code line: <aria-pagination-ellipsis
- Code line: label={<span className="sr-only">More pages</span>}
- Code line: >
- Code line: ...
- Code line: </aria-pagination-ellipsis>
- Code line: </aria-pagination-pages>
- Code line: <aria-pagination-next>Next</aria-pagination-next>
- Code line: </aria-pagination-content>
- Code line: </aria-pagination>
- `Pages` repeats the child tree once for each generated page-window item. In that repeated tree:
- `Link` renders numbered page items and defaults its children to the page number.
- `Link` renders nothing for generated ellipsis items.
- `Ellipsis` renders generated ellipsis items.
- `Ellipsis` renders nothing for generated page items.

### Root State

- `totalPages` and `maxVisiblePages` are normalized to positive integers.
- Requested pages are clamped into the range `1..totalPages`.
- Collapsed ranges keep both boundary pages visible.
- Activating the visible page before a trailing ellipsis shifts the window forward by one page and introduces a leading ellipsis when needed.
- When both leading and trailing ellipses are visible, the middle page range uses one fewer numeric page so the rendered slot count stays stable.
- Maximum visible window defaults to `5`.
- `maxVisiblePages` is treated as the numeric page-link count, including the first and final pages.
- `Root` accepts:
- `totalPages?: number`
- `maxVisiblePages?: number`
- `page?: number`
- `defaultPage?: number`
- `onPageChange?: (page: number) => void`
- Use `page` with `onPageChange` for controlled state. Use `defaultPage` for uncontrolled state.

### Component Contract

- `Root` renders a `<nav>` element and provides pagination state to descendants.
- `Content` renders the list container.
- `Item` renders each list item.
- `Link` renders an anchor. It accepts:
- `page?: number` to connect a manual page link to root state.
- `isActive?: boolean` for static usage outside root-managed state.
- `activeClassName?: string` to replace `className` when the link is active.
- Inside `Pages`, `Link` can omit `page`; it reads the generated page item from context and renders the page number when no children are provided.
- `Previous` and `Next` are specialized link variants with navigation labels and root-backed click behavior. They do not accept `isActive`.
- `Ellipsis` renders a `<span aria-hidden />`. It accepts `label?: Node | string` for adjacent accessible text. Wrap it in `Item` for valid list structure.
- `Pages` renders nothing outside `Root`. Inside `Root`, it repeats its children for each generated page-window item and provides that item through internal context.

### Accessibility

- the root renders a `<nav>` element (implicit navigation landmark)
- the root has `aria-label="pagination"` (customizable via attributes/properties for i18n or multiple instances)
- active page links reflect `aria-current="page"`
- `Previous` has `aria-label="Go to previous page"`
- `Next` has `aria-label="Go to next page"`
- `Ellipsis` has `aria-hidden="true"`
- `Previous` and `Next` are disabled via `aria-disabled` and `tabIndex={-1}` when at bounds.

### Keyboard Interaction

- Standard link navigation: Tab to focus, Enter/Space to activate
- No custom arrow key navigation (links follow native browser behavior)

### Data and ARIA Reflection

- Minimum expected reflection:
- `<nav>` element on root (no explicit `role="navigation"` needed)
- `aria-label="pagination"` on root
- `aria-current="page"` on the active link (only one link should be active)
- `aria-label="Go to previous page"` on Previous
- `aria-label="Go to next page"` on Next
- `aria-hidden="true"` on Ellipsis

### Coverage Expectations

- Tests for this package should cover:
- root renders `<nav>` with `aria-label="pagination"`
- active link has `aria-current="page"`, inactive links do not
- Previous has `aria-label="Go to previous page"`
- Next has `aria-label="Go to next page"`
- Ellipsis has `aria-hidden="true"`
- no accessibility violations (axe)
- clamped visible page window logic produces ellipsis items and a visible boundary page for collapsed ranges
- `Pages` composes with `Link` and `Ellipsis` through internal page-item context






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
