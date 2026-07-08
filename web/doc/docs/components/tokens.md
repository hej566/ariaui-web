# Tokens

`@ariaui-web/tokens` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/tokens
```

```bash [pnpm]
pnpm add @ariaui-web/tokens
```

```bash [yarn]
yarn add @ariaui-web/tokens
```

:::

## Register Elements

```ts
import { defineTokensElements } from "@ariaui-web/tokens";

defineTokensElements();
```

## Web Component Contract

`@ariaui-web/tokens` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="tokens">
  <pre class="ariaui-web-example" data-example-part="Utility">Tokens is a utility package.</pre>
</div>

### Markup

```html
<pre class="ariaui-web-example" data-example-part="Utility">Tokens is a utility package.</pre>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

### Usage

```ts
import { defineTokensElements } from "@ariaui-web/tokens";

defineTokensElements();
```

The package-level native contract lives in `packages/tokens/readme.md`.
