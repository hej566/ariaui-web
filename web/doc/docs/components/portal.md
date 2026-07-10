# Portal

Renders children outside the local DOM hierarchy while preserving DOM node identity.

## Features

- **Body portal rendering**
- **Inline pre-connection fallback**
- **No wrapper semantics**
- **No ARIA state**
- **DOM node identity preservation**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/portal
```

```bash [pnpm]
pnpm add @ariaui-web/portal
```

```bash [yarn]
yarn add @ariaui-web/portal
```

:::

### Register Elements

```ts
import { definePortalElements } from "@ariaui-web/portal";

definePortalElements();
```

## Examples

The live example below is the browser-native equivalent of the source `Portal.Root` usage.

### Default

<div class="ariaui-web-preview" data-component="portal" data-example-variant="default">
  <div class="ariaui-web-portal-frame">
    <div class="ariaui-web-portal-host" aria-hidden="true">Portal host</div>
    <aria-portal class="ariaui-web-portal-root" data-example-part="Root"><div class="ariaui-web-portal-card" data-example-part="Content">Content rendered to document.body</div></aria-portal>
  </div>
</div>

```html
<div class="ariaui-web-portal-frame">
    <div class="ariaui-web-portal-host" aria-hidden="true">Portal host</div>
    <aria-portal class="ariaui-web-portal-root" data-example-part="Root"><div class="ariaui-web-portal-card" data-example-part="Content">Content rendered to document.body</div></aria-portal>
  </div>
```

## Anatomy

```html
<aria-portal>
  <div>Content rendered to document.body</div>
</aria-portal>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-portal` | none |

## API Reference

The package-level native contract lives in `packages/portal/readme.md`.

### Root

- Element: `aria-portal`
- Moves child nodes into `document.body` when connected in the browser.
- Keeps child nodes inline before connection, matching the source server-rendering fallback.
- Does not support a `container` attribute or property.
- Adds no default role, focusability, keyboard behavior, ARIA state, or state data attributes.
- Removes owned portalled nodes when the host disconnects.

## Accessibility

Portal does not add accessibility semantics itself. The child content remains responsible for its own roles, names, focus behavior, and dismissal behavior.

Use the component that owns the portalled content, such as Dialog or Dropdown Menu, to provide the required accessibility model.
