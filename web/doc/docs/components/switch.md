# Switch

`@ariaui-web/switch` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/switch
```

```bash [pnpm]
pnpm add @ariaui-web/switch
```

```bash [yarn]
yarn add @ariaui-web/switch
```

:::

## Register Elements

```ts
import { defineSwitchElements } from "@ariaui-web/switch";

defineSwitchElements();
```

## Web Component Contract

`@ariaui-web/switch` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="switch">
  <aria-switch class="ariaui-web-example" data-example-part="Root">Root</aria-switch>
  <aria-switch-thumb class="ariaui-web-example" data-example-part="Thumb">Thumb</aria-switch-thumb>
  <aria-switch-track class="ariaui-web-example" data-example-part="Track">Track</aria-switch-track>
</div>

### Markup

```html
<aria-switch class="ariaui-web-example" data-example-part="Root">Root</aria-switch>
  <aria-switch-thumb class="ariaui-web-example" data-example-part="Thumb">Thumb</aria-switch-thumb>
  <aria-switch-track class="ariaui-web-example" data-example-part="Track">Track</aria-switch-track>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-switch` | `switch` |
| Thumb | `aria-switch-thumb` | `presentation` |
| Track | `aria-switch-track` | `presentation` |

### Usage

```ts
import { defineSwitchElements } from "@ariaui-web/switch";

defineSwitchElements();
```

The package-level native contract lives in `packages/switch/readme.md`.
