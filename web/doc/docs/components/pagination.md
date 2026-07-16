# Pagination

A headless, accessible pagination primitive with Previous, Next, page links, and ellipsis.

## Features

- Semantic navigation
- Composable parts
- Controlled or uncontrolled page state
- Configurable visible page window
- Current page state
- Previous and next controls
- Router agnostic

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/pagination
```

```bash [pnpm]
pnpm add @ariaui-web/pagination
```

```bash [yarn]
yarn add @ariaui-web/pagination
```

:::

```ts
import { definePaginationElements } from "@ariaui-web/pagination";

definePaginationElements();
```

## Examples

### Uncontrolled

<div class="ariaui-web-preview flex w-full justify-center overflow-x-auto px-4 py-6" data-component="pagination" data-example-variant="uncontrolled">
  <aria-pagination aria-label="Pagination" class="ariaui-web-pagination-root" total-pages="8" max-visible-pages="6" default-page="1" data-example-part="Root">
    <aria-pagination-content class="ariaui-web-pagination-content" data-example-part="Content">
      <aria-pagination-item data-example-part="Item">
        <aria-pagination-previous class="ariaui-web-pagination-control" data-example-part="Previous">
          <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
          <span>Previous</span>
        </aria-pagination-previous>
      </aria-pagination-item>
      <aria-pagination-pages data-example-part="Pages">
        <aria-pagination-item data-example-part="Item">
          <aria-pagination-link class="ariaui-web-pagination-page" active-class="ariaui-web-pagination-page ariaui-web-pagination-page-active" data-example-part="Link"></aria-pagination-link>
          <aria-pagination-ellipsis class="ariaui-web-pagination-ellipsis" data-example-part="Ellipsis">
            <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"></path></svg>
            <span class="sr-only">More pages</span>
          </aria-pagination-ellipsis>
        </aria-pagination-item>
      </aria-pagination-pages>
      <aria-pagination-item data-example-part="Item">
        <aria-pagination-next class="ariaui-web-pagination-control" data-example-part="Next">
          <span>Next</span>
          <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
        </aria-pagination-next>
      </aria-pagination-item>
    </aria-pagination-content>
  </aria-pagination>
</div>

```html
<aria-pagination aria-label="Pagination" class="ariaui-web-pagination-root" total-pages="8" max-visible-pages="6" default-page="1" data-example-part="Root">
  <aria-pagination-content class="ariaui-web-pagination-content" data-example-part="Content">
    <aria-pagination-item data-example-part="Item">
      <aria-pagination-previous class="ariaui-web-pagination-control" data-example-part="Previous">
        <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
        <span>Previous</span>
      </aria-pagination-previous>
    </aria-pagination-item>
    <aria-pagination-pages data-example-part="Pages">
      <aria-pagination-item data-example-part="Item">
        <aria-pagination-link class="ariaui-web-pagination-page" active-class="ariaui-web-pagination-page ariaui-web-pagination-page-active" data-example-part="Link"></aria-pagination-link>
        <aria-pagination-ellipsis class="ariaui-web-pagination-ellipsis" data-example-part="Ellipsis">
          <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"></path></svg>
          <span class="sr-only">More pages</span>
        </aria-pagination-ellipsis>
      </aria-pagination-item>
    </aria-pagination-pages>
    <aria-pagination-item data-example-part="Item">
      <aria-pagination-next class="ariaui-web-pagination-control" data-example-part="Next">
        <span>Next</span>
        <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
      </aria-pagination-next>
    </aria-pagination-item>
  </aria-pagination-content>
</aria-pagination>
```

### Controlled

<div class="ariaui-web-preview flex w-full justify-center overflow-x-auto px-4 py-6" data-component="pagination" data-example-variant="controlled">
  <aria-pagination aria-label="Pagination" class="ariaui-web-pagination-root" total-pages="8" max-visible-pages="6" page="3" data-pagination-controlled data-example-part="Root">
    <aria-pagination-content class="ariaui-web-pagination-content" data-example-part="Content">
      <aria-pagination-item data-example-part="Item">
        <aria-pagination-previous class="ariaui-web-pagination-control" data-example-part="Previous">
          <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
          <span>Previous</span>
        </aria-pagination-previous>
      </aria-pagination-item>
      <aria-pagination-pages data-example-part="Pages">
        <aria-pagination-item data-example-part="Item">
          <aria-pagination-link class="ariaui-web-pagination-page" active-class="ariaui-web-pagination-page ariaui-web-pagination-page-active" data-example-part="Link"></aria-pagination-link>
          <aria-pagination-ellipsis class="ariaui-web-pagination-ellipsis" data-example-part="Ellipsis">
            <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"></path></svg>
            <span class="sr-only">More pages</span>
          </aria-pagination-ellipsis>
        </aria-pagination-item>
      </aria-pagination-pages>
      <aria-pagination-item data-example-part="Item">
        <aria-pagination-next class="ariaui-web-pagination-control" data-example-part="Next">
          <span>Next</span>
          <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
        </aria-pagination-next>
      </aria-pagination-item>
    </aria-pagination-content>
  </aria-pagination>
</div>

```html
<aria-pagination aria-label="Pagination" class="ariaui-web-pagination-root" total-pages="8" max-visible-pages="6" page="3" data-pagination-controlled data-example-part="Root">
  <aria-pagination-content class="ariaui-web-pagination-content" data-example-part="Content">
    <aria-pagination-item data-example-part="Item">
      <aria-pagination-previous class="ariaui-web-pagination-control" data-example-part="Previous">
        <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
        <span>Previous</span>
      </aria-pagination-previous>
    </aria-pagination-item>
    <aria-pagination-pages data-example-part="Pages">
      <aria-pagination-item data-example-part="Item">
        <aria-pagination-link class="ariaui-web-pagination-page" active-class="ariaui-web-pagination-page ariaui-web-pagination-page-active" data-example-part="Link"></aria-pagination-link>
        <aria-pagination-ellipsis class="ariaui-web-pagination-ellipsis" data-example-part="Ellipsis">
          <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"></path></svg>
          <span class="sr-only">More pages</span>
        </aria-pagination-ellipsis>
      </aria-pagination-item>
    </aria-pagination-pages>
    <aria-pagination-item data-example-part="Item">
      <aria-pagination-next class="ariaui-web-pagination-control" data-example-part="Next">
        <span>Next</span>
        <svg class="ariaui-web-pagination-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
      </aria-pagination-next>
    </aria-pagination-item>
  </aria-pagination-content>
</aria-pagination>
```

## Anatomy

```html
<aria-pagination total-pages="8" max-visible-pages="6" default-page="1">
  <aria-pagination-content>
    <aria-pagination-item>
      <aria-pagination-previous>Previous</aria-pagination-previous>
    </aria-pagination-item>
    <aria-pagination-pages>
      <aria-pagination-item>
        <aria-pagination-link active-class="active"></aria-pagination-link>
        <aria-pagination-ellipsis>...</aria-pagination-ellipsis>
      </aria-pagination-item>
    </aria-pagination-pages>
    <aria-pagination-item>
      <aria-pagination-next>Next</aria-pagination-next>
    </aria-pagination-item>
  </aria-pagination-content>
</aria-pagination>
```

## API Reference

### Root

- Element: `aria-pagination`
- Role: `navigation`
- `total-pages` sets the total page count and is normalized to a positive integer.
- `max-visible-pages` sets the generated numeric page window and defaults to `5`.
- `default-page` initializes uncontrolled page state.
- `page` enables controlled page state.
- Dispatches `pagechange` with `detail.page` when a control requests another page.

### Content

- Element: `aria-pagination-content`
- Role: `list`
- Wraps pagination items.

### Item

- Element: `aria-pagination-item`
- Role: `listitem`
- Wrap each `Previous`, `Next`, generated page, or ellipsis control.

### Pages

- Element: `aria-pagination-pages`
- Repeats its child tree for each generated page-window item.
- Use `Link` and `Ellipsis` inside the repeated item; each renders only for its matching generated item type.

### Link

- Element: `aria-pagination-link`
- Role: `link`
- `page` targets a specific page.
- `active-class` replaces the base class when the link is current.
- Reflects `aria-current="page"` for the current page.

### Previous

- Element: `aria-pagination-previous`
- Role: `link`
- Defaults to `aria-label="Go to previous page"`.
- Reflects `aria-disabled="true"` and `tabindex="-1"` on the first page.

### Next

- Element: `aria-pagination-next`
- Role: `link`
- Defaults to `aria-label="Go to next page"`.
- Reflects `aria-disabled="true"` and `tabindex="-1"` on the final page.

### Ellipsis

- Element: `aria-pagination-ellipsis`
- Reflects `aria-hidden="true"`.
- Renders generated gap items when composed inside `Pages`.

### Parts

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

## Accessibility

Pagination follows standard navigation patterns:

- `Root` renders as a navigation landmark with `aria-label="pagination"` by default.
- `Content` and `Item` provide list structure for the page controls.
- `Link` with the current page sets `aria-current="page"` so screen readers announce the active page.
- `Link` renders only for numbered items when composed inside `Pages` without an explicit `page`.
- `Previous` and `Next` have default labels so icon-only variants stay understandable.
- `Ellipsis` renders only for generated gap items, is marked `aria-hidden`, and carries no interactive role.
- Focus management uses link semantics: Tab or Shift+Tab to move between controls, Enter or Space to activate.
