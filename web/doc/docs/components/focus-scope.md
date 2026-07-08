# FocusScope

`@ariaui-web/focus-scope` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/focus-scope
```

```bash [pnpm]
pnpm add @ariaui-web/focus-scope
```

```bash [yarn]
yarn add @ariaui-web/focus-scope
```

:::

## Register Elements

```ts
import { defineFocusScopeElements } from "@ariaui-web/focus-scope";

defineFocusScopeElements();
```

## Web Component Contract

`@ariaui-web/focus-scope` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="focus-scope">
  <aria-focus-scope class="ariaui-web-example" data-example-part="FocusScope">FocusScope</aria-focus-scope>
</div>

### Markup

```html
<aria-focus-scope class="ariaui-web-example" data-example-part="FocusScope">FocusScope</aria-focus-scope>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| FocusScope | `aria-focus-scope` | none |

### Usage

```ts
import { defineFocusScopeElements } from "@ariaui-web/focus-scope";

defineFocusScopeElements();
```

The package-level native contract lives in `packages/focus-scope/readme.md`.
