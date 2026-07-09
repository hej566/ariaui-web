# Breadcrumb

Displays the path to the current resource using a hierarchy of links.

## Features

- **Semantic navigation**
- **Ordered trail**
- **Current page state**
- **Custom separators**
- **Collapsed paths**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/breadcrumb
```

```bash [pnpm]
pnpm add @ariaui-web/breadcrumb
```

```bash [yarn]
yarn add @ariaui-web/breadcrumb
```

:::

### Register Elements

```ts
import { defineBreadcrumbElements } from "@ariaui-web/breadcrumb";

defineBreadcrumbElements();
```

## Examples

The live examples below are native custom element entries for the `breadcrumb` page, matching the source Aria UI examples.

### Default

<div class="ariaui-web-preview ariaui-web-breadcrumb-preview" data-component="breadcrumb" data-example-variant="default">
  <aria-breadcrumb class="ariaui-web-breadcrumb-root" data-example-part="Root">
    <aria-breadcrumb-list class="ariaui-web-breadcrumb-list" data-example-part="List">
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/">Home</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/components">Components</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-page class="ariaui-web-breadcrumb-page" data-example-part="Page">Breadcrumb</aria-breadcrumb-page>
      </aria-breadcrumb-item>
    </aria-breadcrumb-list>
  </aria-breadcrumb>
</div>

```html
<aria-breadcrumb class="ariaui-web-breadcrumb-root" data-example-part="Root">
    <aria-breadcrumb-list class="ariaui-web-breadcrumb-list" data-example-part="List">
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/">Home</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/components">Components</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-page class="ariaui-web-breadcrumb-page" data-example-part="Page">Breadcrumb</aria-breadcrumb-page>
      </aria-breadcrumb-item>
    </aria-breadcrumb-list>
  </aria-breadcrumb>
```

### Collapsed

<div class="ariaui-web-preview ariaui-web-breadcrumb-preview" data-component="breadcrumb" data-example-variant="collapsed">
  <aria-breadcrumb class="ariaui-web-breadcrumb-root" data-example-part="Root">
    <aria-breadcrumb-list class="ariaui-web-breadcrumb-list" data-example-part="List">
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/">Home</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <button type="button" class="ariaui-web-breadcrumb-ellipsis-trigger" aria-label="Show hidden trail">
          <aria-breadcrumb-ellipsis class="ariaui-web-breadcrumb-ellipsis" data-example-part="Ellipsis"></aria-breadcrumb-ellipsis>
        </button>
        <div class="ariaui-web-breadcrumb-menu" hidden>
          <span>Documentation</span>
          <span>Themes</span>
          <span>GitHub</span>
        </div>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/components">Components</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-page class="ariaui-web-breadcrumb-page" data-example-part="Page">Breadcrumb</aria-breadcrumb-page>
      </aria-breadcrumb-item>
    </aria-breadcrumb-list>
  </aria-breadcrumb>
</div>

```html
<aria-breadcrumb class="ariaui-web-breadcrumb-root" data-example-part="Root">
    <aria-breadcrumb-list class="ariaui-web-breadcrumb-list" data-example-part="List">
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/">Home</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <button type="button" class="ariaui-web-breadcrumb-ellipsis-trigger" aria-label="Show hidden trail">
          <aria-breadcrumb-ellipsis class="ariaui-web-breadcrumb-ellipsis" data-example-part="Ellipsis"></aria-breadcrumb-ellipsis>
        </button>
        <div class="ariaui-web-breadcrumb-menu" hidden>
          <span>Documentation</span>
          <span>Themes</span>
          <span>GitHub</span>
        </div>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/components">Components</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator"></aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-page class="ariaui-web-breadcrumb-page" data-example-part="Page">Breadcrumb</aria-breadcrumb-page>
      </aria-breadcrumb-item>
    </aria-breadcrumb-list>
  </aria-breadcrumb>
```

### Custom separator

<div class="ariaui-web-preview ariaui-web-breadcrumb-preview" data-component="breadcrumb" data-example-variant="custom-separator">
  <aria-breadcrumb class="ariaui-web-breadcrumb-root" data-example-part="Root">
    <aria-breadcrumb-list class="ariaui-web-breadcrumb-list" data-example-part="List">
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/">Home</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator">
        <svg aria-hidden="true" class="ariaui-web-breadcrumb-slash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2 2 22"></path>
        </svg>
      </aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/components">Components</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator">
        <svg aria-hidden="true" class="ariaui-web-breadcrumb-slash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2 2 22"></path>
        </svg>
      </aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-page class="ariaui-web-breadcrumb-page" data-example-part="Page">Breadcrumb</aria-breadcrumb-page>
      </aria-breadcrumb-item>
    </aria-breadcrumb-list>
  </aria-breadcrumb>
</div>

```html
<aria-breadcrumb class="ariaui-web-breadcrumb-root" data-example-part="Root">
    <aria-breadcrumb-list class="ariaui-web-breadcrumb-list" data-example-part="List">
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/">Home</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator">
        <svg aria-hidden="true" class="ariaui-web-breadcrumb-slash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2 2 22"></path>
        </svg>
      </aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-link class="ariaui-web-breadcrumb-link" data-example-part="Link" href="/components">Components</aria-breadcrumb-link>
      </aria-breadcrumb-item>
      <aria-breadcrumb-separator class="ariaui-web-breadcrumb-separator" data-example-part="Separator">
        <svg aria-hidden="true" class="ariaui-web-breadcrumb-slash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2 2 22"></path>
        </svg>
      </aria-breadcrumb-separator>
      <aria-breadcrumb-item class="ariaui-web-breadcrumb-item" data-example-part="Item">
        <aria-breadcrumb-page class="ariaui-web-breadcrumb-page" data-example-part="Page">Breadcrumb</aria-breadcrumb-page>
      </aria-breadcrumb-item>
    </aria-breadcrumb-list>
  </aria-breadcrumb>
```

## Anatomy

```html
<aria-breadcrumb>
  <aria-breadcrumb-list>
    <aria-breadcrumb-item>
      <aria-breadcrumb-link href="/"></aria-breadcrumb-link>
    </aria-breadcrumb-item>
    <aria-breadcrumb-separator></aria-breadcrumb-separator>
    <aria-breadcrumb-item>
      <aria-breadcrumb-page></aria-breadcrumb-page>
    </aria-breadcrumb-item>
    <aria-breadcrumb-item>
      <aria-breadcrumb-ellipsis></aria-breadcrumb-ellipsis>
    </aria-breadcrumb-item>
  </aria-breadcrumb-list>
</aria-breadcrumb>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-breadcrumb` | `navigation` |
| List | `aria-breadcrumb-list` | `list` |
| Item | `aria-breadcrumb-item` | `listitem` |
| Link | `aria-breadcrumb-link` | `link` |
| Page | `aria-breadcrumb-page` | `link` |
| Separator | `aria-breadcrumb-separator` | `presentation` |
| Ellipsis | `aria-breadcrumb-ellipsis` | `presentation` |

## API Reference

The package-level native contract lives in `packages/breadcrumb/readme.md`.

### Root

- Element: `aria-breadcrumb`
- Defaults to `role="navigation"` and `aria-label="breadcrumb"`.
- Consumers may override `aria-label`.

### List

- Element: `aria-breadcrumb-list`
- Defaults to `role="list"`.
- Wraps the ordered breadcrumb trail.

### Item

- Element: `aria-breadcrumb-item`
- Defaults to `role="listitem"`.
- Wraps a link, page, ellipsis, or other breadcrumb segment content.

### Link

- Element: `aria-breadcrumb-link`
- Defaults to `role="link"`.
- Use for navigable ancestor pages and provide `href`.

### Page

- Element: `aria-breadcrumb-page`
- Defaults to `role="link"`, `aria-disabled="true"`, and `aria-current="page"`.
- Represents the current page.

### Separator

- Element: `aria-breadcrumb-separator`
- Defaults to `role="presentation"` and `aria-hidden="true"`.
- Renders a chevron SVG when no custom content is provided.

### Ellipsis

- Element: `aria-breadcrumb-ellipsis`
- Defaults to `role="presentation"` and `aria-hidden="true"`.
- Renders an ellipsis SVG and hidden `More` text when no custom content is provided.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus through breadcrumb links in normal document order. |
| `Shift+Tab` | Moves focus to the previous focusable link. |

## Accessibility

The Breadcrumb component implements the [WAI-ARIA Breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/). `aria-breadcrumb` exposes a navigation landmark with `aria-label="breadcrumb"`. Links use `aria-breadcrumb-link`, while the current page is marked with `aria-current="page"`.

::: tip Separators
Separators and ellipsis are marked as `aria-hidden="true"` to avoid redundant screen reader announcements. Provide text alternatives only when necessary for context.
:::
