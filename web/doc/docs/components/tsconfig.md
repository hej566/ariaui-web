# Tsconfig

`@ariaui-web/tsconfig` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/tsconfig
```

```bash [pnpm]
pnpm add @ariaui-web/tsconfig
```

```bash [yarn]
yarn add @ariaui-web/tsconfig
```

:::

## Register Elements

```ts
import { defineTsconfigElements } from "@ariaui-web/tsconfig";

defineTsconfigElements();
```

## Web Component Contract

`@ariaui-web/tsconfig` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="tsconfig">
  <pre class="ariaui-web-example" data-example-part="Utility">Tsconfig is a utility package.</pre>
</div>

### Markup

```html
<pre class="ariaui-web-example" data-example-part="Utility">Tsconfig is a utility package.</pre>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

### Usage

```ts
import { defineTsconfigElements } from "@ariaui-web/tsconfig";

defineTsconfigElements();
```

The package-level native contract lives in `packages/tsconfig/readme.md`.
