# Position

`@ariaui-web/position` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/position
```

```bash [pnpm]
pnpm add @ariaui-web/position
```

```bash [yarn]
yarn add @ariaui-web/position
```

:::

## Register Elements

```ts
import { definePositionElements } from "@ariaui-web/position";

definePositionElements();
```

## Web Component Contract

`@ariaui-web/position` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="position">
  <pre class="ariaui-web-example" data-example-part="Utility">Position is a utility package.</pre>
</div>

### Markup

```html
<pre class="ariaui-web-example" data-example-part="Utility">Position is a utility package.</pre>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

### Usage

```ts
import { definePositionElements } from "@ariaui-web/position";

definePositionElements();
```

The package-level native contract lives in `packages/position/readme.md`.
