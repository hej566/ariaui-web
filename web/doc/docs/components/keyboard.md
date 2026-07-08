# Keyboard

`@ariaui-web/keyboard` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/keyboard
```

```bash [pnpm]
pnpm add @ariaui-web/keyboard
```

```bash [yarn]
yarn add @ariaui-web/keyboard
```

:::

## Register Elements

```ts
import { defineKeyboardElements } from "@ariaui-web/keyboard";

defineKeyboardElements();
```

## Web Component Contract

`@ariaui-web/keyboard` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="keyboard">
  <pre class="ariaui-web-example" data-example-part="Utility">Keyboard is a utility package.</pre>
</div>

### Markup

```html
<pre class="ariaui-web-example" data-example-part="Utility">Keyboard is a utility package.</pre>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

### Usage

```ts
import { defineKeyboardElements } from "@ariaui-web/keyboard";

defineKeyboardElements();
```

The package-level native contract lives in `packages/keyboard/readme.md`.
