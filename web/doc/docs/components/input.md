# Input

A native text input primitive with controlled and uncontrolled value handling.

## Features

- **Native input semantics**
- **Controlled or uncontrolled**
- **String value changes**
- **Disabled and required support**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/input
```

```bash [pnpm]
pnpm add @ariaui-web/input
```

```bash [yarn]
yarn add @ariaui-web/input
```

:::

### Register Elements

```ts
import { defineInputElements } from "@ariaui-web/input";

defineInputElements();
```

## Examples

The live examples below are native custom element entries for the `input` page, matching the source Aria UI examples.

### Basic controlled

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="input" data-example-variant="basic-controlled">
  <aria-input class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-input-field" placeholder="Email" aria-label="Email" data-example-part="Root"></aria-input>
</div>

```html
<aria-input class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-input-field" placeholder="Email" aria-label="Email" data-example-part="Root"></aria-input>
```

### Password

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="input" data-example-variant="password">
  <aria-input class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-input-field" type="password" value="password123" aria-label="Password" data-example-part="Root"></aria-input>
</div>

```html
<aria-input class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-input-field" type="password" value="password123" aria-label="Password" data-example-part="Root"></aria-input>
```

### With button

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="input" data-example-variant="with-button">
  <div class="flex w-full max-w-md flex-col gap-2 ariaui-web-input-with-button">
    <aria-input class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-input-field" placeholder="Placeholder" aria-label="Input with button" data-example-part="Root"></aria-input>
    <aria-button class="inline-flex h-9 w-fit items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover ariaui-web-input-button" data-example-part="Button">Send</aria-button>
  </div>
</div>

```html
<div class="flex w-full max-w-md flex-col gap-2 ariaui-web-input-with-button">
    <aria-input class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-input-field" placeholder="Placeholder" aria-label="Input with button" data-example-part="Root"></aria-input>
    <aria-button class="inline-flex h-9 w-fit items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover ariaui-web-input-button" data-example-part="Button">Send</aria-button>
  </div>
```

### File (native)

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="input" data-example-variant="file-native">
  <div class="relative flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-input bg-background px-3 py-1 ariaui-web-input-file-shell">
    <label class="flex cursor-pointer items-center text-sm font-medium text-foreground ariaui-web-input-file-label">
      <span>Choose file</span>
      <input type="file" class="sr-only" />
    </label>
    <span class="text-sm text-muted-foreground ariaui-web-input-file-hint">No file chosen</span>
  </div>
</div>

```html
<div class="relative flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-input bg-background px-3 py-1 ariaui-web-input-file-shell">
    <label class="flex cursor-pointer items-center text-sm font-medium text-foreground ariaui-web-input-file-label">
      <span>Choose file</span>
      <input type="file" class="sr-only" />
    </label>
    <span class="text-sm text-muted-foreground ariaui-web-input-file-hint">No file chosen</span>
  </div>
```

## Anatomy

```html
<aria-input placeholder="Email" data-example-part="Root"></aria-input>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-input` | none |

## API Reference

The package-level native contract lives in `packages/input/readme.md`.

### Root

- Element: `aria-input`
- Owns a real native `<input>` in light DOM and delegates focus to it.
- `type` defaults to `text` and forwards string-compatible input types such as `email`, `password`, `tel`, `url`, and `search`.
- `default-value` initializes uncontrolled native input state.
- The `value` property updates the owned native input for controlled-style usage.
- Native `input` events bubble from the owned input, and the host dispatches `valuechange` with `detail.value`.
- `disabled` and `required` map to the owned native input without host ARIA or data-state reflection.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus to the input through the browser's native focus order. |
| Text editing keys | Follow native input editing behavior for the active `type`. |
| `Enter` | Uses native form submission behavior when the input belongs to a form. |

## Accessibility

Input relies on the native `<input>` element for role, focus, disabled, required, and value semantics. Provide a visible label or an accessible name through standard input labeling patterns such as `aria-label`, `aria-labelledby`, or an associated `label`.

Do not use Input for non-string controls such as checkbox, radio, file, date, color, or number. Use the native element directly for those cases, as shown in the file example.
