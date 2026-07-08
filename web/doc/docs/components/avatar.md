# Avatar

`@ariaui-web/avatar` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/avatar
```

```bash [pnpm]
pnpm add @ariaui-web/avatar
```

```bash [yarn]
yarn add @ariaui-web/avatar
```

:::

## Register Elements

```ts
import { defineAvatarElements } from "@ariaui-web/avatar";

defineAvatarElements();
```

## Web Component Contract

`@ariaui-web/avatar` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="avatar">
  <aria-avatar class="ariaui-web-example" data-example-part="Root">Root</aria-avatar>
  <aria-avatar-fallback class="ariaui-web-example" data-example-part="Fallback">Fallback</aria-avatar-fallback>
  <aria-avatar-group class="ariaui-web-example" data-example-part="Group">Group</aria-avatar-group>
  <aria-avatar-image class="ariaui-web-example" data-example-part="Image">Image</aria-avatar-image>
</div>

### Markup

```html
<aria-avatar class="ariaui-web-example" data-example-part="Root">Root</aria-avatar>
  <aria-avatar-fallback class="ariaui-web-example" data-example-part="Fallback">Fallback</aria-avatar-fallback>
  <aria-avatar-group class="ariaui-web-example" data-example-part="Group">Group</aria-avatar-group>
  <aria-avatar-image class="ariaui-web-example" data-example-part="Image">Image</aria-avatar-image>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-avatar` | none |
| Fallback | `aria-avatar-fallback` | none |
| Group | `aria-avatar-group` | `group` |
| Image | `aria-avatar-image` | none |

### Usage

```ts
import { defineAvatarElements } from "@ariaui-web/avatar";

defineAvatarElements();
```

The package-level native contract lives in `packages/avatar/readme.md`.
