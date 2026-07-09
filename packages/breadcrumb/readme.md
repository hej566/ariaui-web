# Breadcrumb Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/breadcrumb`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-breadcrumb` | `navigation` |
| List | `aria-breadcrumb-list` | `list` |
| Item | `aria-breadcrumb-item` | `listitem` |
| Link | `aria-breadcrumb-link` | `link` |
| Page | `aria-breadcrumb-page` | `link` |
| Separator | `aria-breadcrumb-separator` | `presentation` |
| Ellipsis | `aria-breadcrumb-ellipsis` | `presentation` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/breadcrumb/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 20 of 20 documented sections are represented after native normalization.
- Requirement lines: 177

### Scope

- This document defines the breadcrumb contract for `@ariaui-web/breadcrumb`.
- It uses:
- WAI-ARIA APG breadcrumb guidance as the accessibility baseline
- shadcn/ui breadcrumb composition as the higher-level structural reference
- This file also records where the current package implementation differs from that fuller model.

### Primary References

- APG breadcrumb pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- shadcn/ui breadcrumb docs: https://ui.shadcn.com/docs/components/breadcrumb
- Note:
- Radix does not provide a dedicated breadcrumb primitive comparable to dialog, tabs, or dropdown-menu primitives, so it is not the primary source for this package.

### Mental Model

- A breadcrumb represents the hierarchical path to the current page.
- The intended composed structure is:
- a labeled navigation landmark
- an ordered list of breadcrumb items
- links for navigable ancestors
- a current-page representation for the final item
- optional separators between items
- optional ellipsis treatment for collapsed paths
- This package exposes all of those pieces as separate parts.

### Public API

- The package exports:
- `Root`
- `List`
- `Item`
- `Link`
- `Page`
- `Separator`
- `Ellipsis`
- Associated type exports:
- `RootProps`
- `ListProps`
- `ItemProps`
- `LinkProps`
- `PageProps`
- `SeparatorProps`
- `EllipsisProps`

### APG-Aligned Accessibility Model

- APG guidance for breadcrumbs is intentionally light:
- the breadcrumb trail is contained in a navigation landmark
- that landmark is labeled
- the current page is identified with `aria-current="page"` when appropriate
- no special keyboard interaction is required beyond standard link navigation
- Implications for this package:
- `Root` should represent the breadcrumb landmark
- `List` and `Item` should provide semantic list structure
- ancestor items should typically render links
- the terminal item should indicate the current page
- separators should be hidden from assistive technology

### shadcn-Aligned Structural Model

- shadcn's breadcrumb examples establish a practical composition model:
- `Root` wraps the breadcrumb in a `nav`
- `List` is the ordered list container
- `Item` is the list item
- `Link` is the navigable ancestor
- `Page` is the current page label
- `Separator` is decorative only
- `Ellipsis` represents collapsed hidden path segments
- This package follows that same part breakdown.

### Part Contracts

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Type:
- Code line: type RootProps = native element attributes/properties for "nav";
- Current behavior:
- renders a `nav`
- applies `aria-label="breadcrumb"` by default
- spreads consumer attributes/properties after the default label
- forwards a ref to the `nav`
- Implications:
- consumers may override `aria-label`
- consumers may pass `className`, `style`, `data-*`, and other `nav` attributes/properties directly

### List

- Type:
- Code line: type ListProps = native element attributes/properties for "ol";
- Current behavior:
- renders an `ol`
- forwards all attributes/properties directly
- forwards ref to the `ol`

### Item

- Type:
- Code line: type ItemProps = native element attributes/properties for "li";
- Current behavior:
- renders an `li`
- forwards all attributes/properties directly
- forwards ref to the `li`

### Link

- Type:
- Code line: type LinkProps = native element attributes/properties for "a";
- Current behavior:
- renders an `a`
- forwards all attributes/properties directly
- forwards ref to the anchor
- Expected usage:
- use for ancestor pages in the breadcrumb trail
- consumers are responsible for supplying `href`

### Page

- Type:
- Code line: type PageProps = native element attributes/properties for "span";
- Current behavior:
- renders a `span`
- applies:
- `role="link"`
- `aria-disabled="true"`
- `aria-current="page"`
- spreads consumer attributes/properties after those defaults
- forwards ref to the `span`
- APG note:
- APG requires identifying the current page, but does not require it to behave like a disabled link.
- Current implementation difference:
- this package represents the current page as a `span` with link-like semantics, not as plain text or an anchor.

### Separator

- Type:
- Code line: interface SeparatorProps extends native element attributes/properties for "li" {
- Code line: children?: Node | string;
- Current behavior:
- renders an `li`
- applies:
- `role="presentation"`
- `aria-hidden="true"`
- renders custom `children` when provided
- otherwise renders a default chevron icon
- forwards ref to the `li`
- Expected usage:
- place between breadcrumb items
- keep decorative only

### Ellipsis

- Type:
- Code line: type EllipsisProps = native element attributes/properties for "span";
- Current behavior:
- renders a `span`
- applies:
- `role="presentation"`
- `aria-hidden="true"`
- renders a default ellipsis icon
- also renders a visually hidden `"More"` label inside the same span
- forwards ref to the `span`
- Current implementation caveat:
- because the outer span is `aria-hidden="true"`, the inner `"More"` text is also hidden from assistive technology in practice

### Keyboard Contract

- APG does not define special breadcrumb keyboard behavior.
- Current contract:
- no roving tabindex
- no arrow key navigation
- no typeahead
- normal browser link navigation only
- Implications:
- `Tab` and `Shift+Tab` move through focusable breadcrumb links according to normal document order
- non-link parts are not made focusable by the package

### Pointer Contract

- The package has no internal pointer behavior.
- Current contract:
- `Link` behaves like a normal anchor
- `Page`, `Separator`, and `Ellipsis` are non-interactive by default
- any click handling beyond native anchor behavior is consumer-defined

### Styling Contract

- The package is intentionally unstyled.
- Current behavior:
- no default classes
- no layout classes
- no spacing between items
- no default typography tokens
- default icons are provided only for `Separator` and `Ellipsis`
- Consumers are responsible for:
- layout direction
- spacing
- colors
- icon sizing
- overflow/collapsing presentation

### Current Package Differences From Fuller shadcn-style Model

- Compared with a fuller shadcn-style breadcrumb abstraction, this package currently does not provide:
- built-in collapsed breadcrumb logic
- built-in responsive truncation or overflow management
- predefined styling tokens or variants
- a dedicated router-link integration abstraction
- Notable implementation choices:
- `Page` uses a `span` with `role="link"` and `aria-disabled="true"`
- `Separator` is a real `li` with presentation semantics
- `Ellipsis` is decorative and currently hidden from assistive technology as a whole

### Coverage Expectations

- Tests under `packages/breadcrumb/__test__` currently cover:
- Rendering the breadcrumb fixture.
- Basic accessibility via `axe`.
- `Root` rendering as a labeled breadcrumb `nav`.
- `List` rendering as an ordered list.
- Ancestor links rendering as anchors with `href`.
- `Page` carrying `aria-current="page"` and `aria-disabled="true"`.
- Separators rendering hidden from assistive technology.
- `Item` list structure.
- Custom separator content.
- Ellipsis rendering hidden from assistive technology.

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests for this package.
- Docs examples and visual interaction tests when present.

## Breadcrumb Source Test Parity

- Learned from: `../ariaui/packages/breadcrumb/__test__/breadcrumb.test.tsx`
- Source test cases: 10
- Native adaptation: assertions use browser-native custom element hosts, source-equivalent roles and default attributes, generated SVG content, and static docs markup instead of framework rendering helpers.
- Native breadcrumb tests must cover:
- Root defaults to a navigation landmark with `aria-label="breadcrumb"` while allowing consumer label overrides
- List and Item expose ordered-list and list-item semantics on native custom element hosts
- Link exposes link semantics and forwards link attributes such as `href` and `title`
- Page exposes `role="link"`, `aria-disabled="true"`, and `aria-current="page"` current-page semantics
- Separator defaults to `role="presentation"`, `aria-hidden="true"`, and a chevron SVG when no custom content is provided
- Ellipsis defaults to `role="presentation"`, `aria-hidden="true"`, an ellipsis SVG, and hidden `More` text
- Separator and Ellipsis render source-equivalent default SVG content while staying hidden from assistive technology
- docs examples include default, collapsed, and custom-separator breadcrumb trails





## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- breadcrumb source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
