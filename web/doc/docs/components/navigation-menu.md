# NavigationMenu

`@ariaui-web/navigation-menu` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/navigation-menu
```

```bash [pnpm]
pnpm add @ariaui-web/navigation-menu
```

```bash [yarn]
yarn add @ariaui-web/navigation-menu
```

:::

## Register Elements

```ts
import { defineNavigationMenuElements } from "@ariaui-web/navigation-menu";

defineNavigationMenuElements();
```

## Web Component Contract

`@ariaui-web/navigation-menu` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="navigation-menu">
  <aria-navigation-menu class="ariaui-web-example" data-example-part="Root">Root</aria-navigation-menu>
  <aria-navigation-menu-content class="ariaui-web-example" data-example-part="Content">Content</aria-navigation-menu-content>
  <aria-navigation-menu-item class="ariaui-web-example" data-example-part="Item">Item</aria-navigation-menu-item>
  <aria-navigation-menu-link class="ariaui-web-example" data-example-part="Link">Link</aria-navigation-menu-link>
</div>

### Markup

```html
<aria-navigation-menu class="ariaui-web-example" data-example-part="Root">Root</aria-navigation-menu>
  <aria-navigation-menu-content class="ariaui-web-example" data-example-part="Content">Content</aria-navigation-menu-content>
  <aria-navigation-menu-item class="ariaui-web-example" data-example-part="Item">Item</aria-navigation-menu-item>
  <aria-navigation-menu-link class="ariaui-web-example" data-example-part="Link">Link</aria-navigation-menu-link>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-navigation-menu` | `navigation` |
| Content | `aria-navigation-menu-content` | `region` |
| Item | `aria-navigation-menu-item` | `listitem` |
| Link | `aria-navigation-menu-link` | `link` |
| List | `aria-navigation-menu-list` | `list` |
| Sub | `aria-navigation-menu-sub` | none |
| SubContent | `aria-navigation-menu-sub-content` | none |
| Submenu | `aria-navigation-menu-submenu` | none |
| SubTrigger | `aria-navigation-menu-sub-trigger` | `button` |
| Trigger | `aria-navigation-menu-trigger` | `button` |

### Usage

```ts
import { defineNavigationMenuElements } from "@ariaui-web/navigation-menu";

defineNavigationMenuElements();
```

The package-level native contract lives in `packages/navigation-menu/readme.md`.
