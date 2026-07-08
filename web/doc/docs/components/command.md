# Command

`@ariaui-web/command` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/command
```

```bash [pnpm]
pnpm add @ariaui-web/command
```

```bash [yarn]
yarn add @ariaui-web/command
```

:::

## Register Elements

```ts
import { defineCommandElements } from "@ariaui-web/command";

defineCommandElements();
```

## Web Component Contract

`@ariaui-web/command` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="command">
  <aria-command class="ariaui-web-example" data-example-part="Root">Root</aria-command>
  <aria-command-content class="ariaui-web-example" data-example-part="Content">Content</aria-command-content>
  <aria-command-empty class="ariaui-web-example" data-example-part="Empty">Empty</aria-command-empty>
  <aria-command-group class="ariaui-web-example" data-example-part="Group">Group</aria-command-group>
</div>

### Markup

```html
<aria-command class="ariaui-web-example" data-example-part="Root">Root</aria-command>
  <aria-command-content class="ariaui-web-example" data-example-part="Content">Content</aria-command-content>
  <aria-command-empty class="ariaui-web-example" data-example-part="Empty">Empty</aria-command-empty>
  <aria-command-group class="ariaui-web-example" data-example-part="Group">Group</aria-command-group>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-command` | none |
| Content | `aria-command-content` | `listbox` |
| Empty | `aria-command-empty` | none |
| Group | `aria-command-group` | `group` |
| Input | `aria-command-input` | `textbox` |
| Label | `aria-command-label` | `label` |
| Loading | `aria-command-loading` | none |
| Option | `aria-command-option` | `option` |
| Separator | `aria-command-separator` | `separator` |

### Usage

```ts
import { defineCommandElements } from "@ariaui-web/command";

defineCommandElements();
```

The package-level native contract lives in `packages/command/readme.md`.
