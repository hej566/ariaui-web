# Textarea

A thin, headless wrapper around the native textarea element with controlled and uncontrolled value support and a string-typed change event.

## Features

- **Native textarea wrapper**
- **Controlled or uncontrolled**
- **String-based `valuechange` event**
- **Native `input` and `change` events**
- **Native focus and selection APIs**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/textarea
```

```bash [pnpm]
pnpm add @ariaui-web/textarea
```

```bash [yarn]
yarn add @ariaui-web/textarea
```

:::

```ts
import { defineTextareaElements } from "@ariaui-web/textarea";

defineTextareaElements();
```

## Examples

These live examples use the same labels, help text, states, and Tailwind CSS composition as the Aria UI Textarea page.

### Uncontrolled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="textarea" data-example-variant="uncontrolled">
  <div class="ariaui-web-textarea-stack mx-auto flex w-full max-w-md flex-col">
    <label for="textarea-uncontrolled" class="ariaui-web-textarea-label mb-1.5 block text-sm font-medium text-foreground">Description</label>
    <aria-textarea id="textarea-uncontrolled" default-value="" class="ariaui-web-textarea-field h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground   min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type your message here" aria-describedby="textarea-uncontrolled-hint"></aria-textarea>
    <p id="textarea-uncontrolled-hint" class="ariaui-web-textarea-hint mt-1.5 text-xs text-muted-foreground">This is a hint text to help user.</p>
  </div>
</div>

```html
<div class="mx-auto flex w-full max-w-md flex-col">
  <label for="textarea-uncontrolled" class="mb-1.5 block text-sm font-medium text-foreground">Description</label>
  <aria-textarea
    id="textarea-uncontrolled"
    default-value=""
    placeholder="Type your message here"
    aria-describedby="textarea-uncontrolled-hint"
    class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground   min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
  ></aria-textarea>
  <p id="textarea-uncontrolled-hint" class="mt-1.5 text-xs text-muted-foreground">This is a hint text to help user.</p>
</div>
```

### Controlled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="textarea" data-example-variant="controlled">
  <div class="ariaui-web-textarea-stack mx-auto flex w-full max-w-md flex-col">
    <label for="textarea-controlled" class="ariaui-web-textarea-label mb-1.5 block text-sm font-medium text-foreground">Description</label>
    <aria-textarea id="textarea-controlled" value="" data-textarea-controlled class="ariaui-web-textarea-field h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground   min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type your message here" aria-describedby="textarea-controlled-hint"></aria-textarea>
    <p id="textarea-controlled-hint" class="ariaui-web-textarea-hint mt-1.5 text-xs text-muted-foreground">This is a hint text to help user.</p>
  </div>
</div>

```html
<div class="mx-auto flex w-full max-w-md flex-col">
  <label for="textarea-controlled" class="mb-1.5 block text-sm font-medium text-foreground">Description</label>
  <aria-textarea
    id="textarea-controlled"
    value=""
    data-textarea-controlled
    placeholder="Type your message here"
    aria-describedby="textarea-controlled-hint"
    class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground   min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
  ></aria-textarea>
  <p id="textarea-controlled-hint" class="mt-1.5 text-xs text-muted-foreground">This is a hint text to help user.</p>
</div>
```

The documentation theme listens for `valuechange` and updates the controlled value property. Applications can use the same event to update their own state.

### Disabled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="textarea" data-example-variant="disabled">
  <div class="ariaui-web-textarea-stack mx-auto flex w-full max-w-md flex-col">
    <label for="textarea-disabled" class="ariaui-web-textarea-label mb-1.5 block text-sm font-medium text-foreground text-muted-foreground">Description</label>
    <aria-textarea id="textarea-disabled" disabled default-value="" class="ariaui-web-textarea-field h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground   min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type your message here" aria-describedby="textarea-disabled-hint"></aria-textarea>
    <p id="textarea-disabled-hint" class="ariaui-web-textarea-hint mt-1.5 text-xs text-muted-foreground text-muted-foreground">This is a hint text to help user.</p>
  </div>
</div>

```html
<div class="mx-auto flex w-full max-w-md flex-col">
  <label for="textarea-disabled" class="mb-1.5 block text-sm font-medium text-foreground text-muted-foreground">Description</label>
  <aria-textarea
    id="textarea-disabled"
    disabled
    default-value=""
    placeholder="Type your message here"
    aria-describedby="textarea-disabled-hint"
    class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground   min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
  ></aria-textarea>
  <p id="textarea-disabled-hint" class="mt-1.5 text-xs text-muted-foreground">This is a hint text to help user.</p>
</div>
```

## Anatomy

```html
<aria-textarea></aria-textarea>
```

## API Reference

### Root

| Attribute / property | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `""` | Current value. Setting the property updates the native textarea. |
| `default-value` | `string` | `""` | Initial value when uncontrolled. |
| `disabled` | `boolean` | `false` | Disables the native textarea. |
| `required` | `boolean` | `false` | Marks the native textarea as required. |
| `control` | `HTMLTextAreaElement` | — | The owned native textarea. |

`Root` emits the native `input` and `change` events and a bubbling `valuechange` custom event with `{ value: string }` detail. Native textarea attributes are forwarded to the owned control, while `focus()`, `select()`, and selection range methods delegate to it.

## Accessibility

Textarea owns a native `<textarea>`, so assistive technology and keyboard behavior match the platform:

- Always provide a visible `<label>` connected through the Textarea ID, or use `aria-label` / `aria-labelledby`.
- Connect help text using `aria-describedby`.
- Use `aria-invalid="true"` and connect validation feedback when reporting an error.
- Native `required`, `maxlength`, `minlength`, and `disabled` attributes are forwarded unchanged.
- Keep vertical resizing available unless the surrounding workflow provides another accessible way to inspect long content.
