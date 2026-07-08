# Utils

`@ariaui-web/utils` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/utils
```

```bash [pnpm]
pnpm add @ariaui-web/utils
```

```bash [yarn]
yarn add @ariaui-web/utils
```

:::

## Register Elements

```ts
import { defineUtilsElements } from "@ariaui-web/utils";

defineUtilsElements();
```

## Web Component Contract

`@ariaui-web/utils` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="utils">
  <pre class="ariaui-web-example" data-example-part="Utility">Utils is a utility package.</pre>
</div>

### Markup

```html
<pre class="ariaui-web-example" data-example-part="Utility">Utils is a utility package.</pre>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

### Usage

```ts
import { defineUtilsElements } from "@ariaui-web/utils";

defineUtilsElements();
```

The package-level native contract lives in `packages/utils/readme.md`.
