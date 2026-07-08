# Hooks

`@ariaui-web/hooks` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/hooks
```

```bash [pnpm]
pnpm add @ariaui-web/hooks
```

```bash [yarn]
yarn add @ariaui-web/hooks
```

:::

## Register Elements

```ts
import { defineHooksElements } from "@ariaui-web/hooks";

defineHooksElements();
```

## Web Component Contract

`@ariaui-web/hooks` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="hooks">
  <pre class="ariaui-web-example" data-example-part="Utility">Hooks is a utility package.</pre>
</div>

### Markup

```html
<pre class="ariaui-web-example" data-example-part="Utility">Hooks is a utility package.</pre>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

### Usage

```ts
import { defineHooksElements } from "@ariaui-web/hooks";

defineHooksElements();
```

The package-level native contract lives in `packages/hooks/readme.md`.
