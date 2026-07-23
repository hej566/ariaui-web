# Upload

A composable file upload primitive with an accessible drop zone, file queue, progress state, and automatic or manual submission.

## Features

- **Click, keyboard, and drag-and-drop selection**
- **MIME type and extension filtering**
- **Additive multi-file queues**
- **Automatic and manual submission**
- **Progress, success, error, and abort states**
- **Accessible aggregate status announcements**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/upload
```

```bash [pnpm]
pnpm add @ariaui-web/upload
```

```bash [yarn]
yarn add @ariaui-web/upload
```

:::

```ts
import { defineUploadElements } from "@ariaui-web/upload";

defineUploadElements();
```

## Examples

### Upload

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="upload" data-example-variant="upload">
  <aria-upload format="pdf,png,jpg,jpeg" class="flex w-full max-w-[300px] flex-col gap-3">
    <aria-upload-auto-submit></aria-upload-auto-submit>
    <aria-upload-selector class="group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-xs transition-colors hover:border-border-brand hover:bg-accent">
      <span class="ariaui-upload-icon" aria-hidden="true"></span>
      <span class="ariaui-upload-copy"><strong>Click to upload or drag and drop</strong><small>PDF, PNG, JPG or JPEG (max. 10MB)</small></span>
    </aria-upload-selector>
    <aria-upload-list url="/api/upload" method="POST" class="flex w-full flex-col gap-2">
      <aria-upload-clear class="ariaui-upload-button">Clear</aria-upload-clear>
    </aria-upload-list>
  </aria-upload>
</div>

```html
<aria-upload format="pdf,png,jpg,jpeg">
  <aria-upload-auto-submit></aria-upload-auto-submit>
  <aria-upload-selector>Click to upload or drag and drop</aria-upload-selector>
  <aria-upload-list url="/api/upload" method="POST">
    <aria-upload-clear>Clear</aria-upload-clear>
  </aria-upload-list>
</aria-upload>
```

### Manual Upload

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="upload" data-example-variant="manual-upload">
  <aria-upload format="pdf,png,jpg,jpeg" class="flex w-full max-w-[300px] flex-col gap-3">
    <aria-upload-selector class="group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-xs transition-colors hover:border-border-brand hover:bg-accent">
      <span class="ariaui-upload-icon" aria-hidden="true"></span>
      <span class="ariaui-upload-copy"><strong>Choose files before uploading</strong><small>Review the queue, then submit manually.</small></span>
    </aria-upload-selector>
    <aria-upload-list url="/api/upload/manual" method="POST" class="flex w-full flex-col gap-2">
      <aria-upload-clear class="ariaui-upload-button">Clear</aria-upload-clear>
      <aria-upload-submit class="ariaui-upload-button">Upload files</aria-upload-submit>
    </aria-upload-list>
  </aria-upload>
</div>

```html
<aria-upload format="pdf,png,jpg,jpeg">
  <aria-upload-selector>Choose files before uploading</aria-upload-selector>
  <aria-upload-list url="/api/upload/manual" method="POST">
    <aria-upload-clear>Clear</aria-upload-clear>
    <aria-upload-submit>Upload files</aria-upload-submit>
  </aria-upload-list>
</aria-upload>
```

### Successful Upload

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="upload" data-example-variant="successful-upload">
  <aria-upload format="pdf,png,jpg,jpeg" data-upload-demo-success class="flex w-full max-w-[300px] flex-col gap-3">
    <aria-upload-auto-submit></aria-upload-auto-submit>
    <aria-upload-selector class="group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-xs transition-colors hover:border-border-brand hover:bg-accent">
      <span class="ariaui-upload-icon" aria-hidden="true"></span>
      <span class="ariaui-upload-copy"><strong>Upload a file to complete it</strong><small>PDF, PNG, JPG or JPEG (max. 10MB)</small></span>
    </aria-upload-selector>
    <aria-upload-list url="/api/upload/success" method="POST" class="flex w-full flex-col gap-2">
      <aria-upload-clear class="ariaui-upload-button">Clear</aria-upload-clear>
    </aria-upload-list>
  </aria-upload>
</div>

```html
<aria-upload format="pdf,png,jpg,jpeg">
  <aria-upload-auto-submit></aria-upload-auto-submit>
  <aria-upload-selector>Upload a file to complete it</aria-upload-selector>
  <aria-upload-list url="/api/upload/success" method="POST">
    <aria-upload-clear>Clear</aria-upload-clear>
  </aria-upload-list>
</aria-upload>
```

<aria-portal>
  <aria-toast-list stack visible-toasts="3" data-upload-toast-list data-position="bottom-right" class="ariaui-web-toast-list pointer-events-none fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4 data-[expanded=true]:pointer-events-auto data-[expanded=false]:grid data-[expanded=false]:gap-0 md:max-w-[420px]"></aria-toast-list>
</aria-portal>

File rows are generated with `aria-upload-item` and the public `aria-upload-file-extension`, `aria-upload-file-name`, `aria-upload-file-status`, `aria-upload-file-size`, `aria-upload-file-progress`, and `aria-upload-file-remove` parts.

## Anatomy

```html
<aria-upload>
  <aria-upload-auto-submit></aria-upload-auto-submit>
  <aria-upload-selector></aria-upload-selector>
  <aria-upload-list>
    <aria-upload-item>
      <aria-upload-file-extension></aria-upload-file-extension>
      <aria-upload-file-name></aria-upload-file-name>
      <aria-upload-file-status></aria-upload-file-status>
      <aria-upload-file-size></aria-upload-file-size>
      <aria-upload-file-progress></aria-upload-file-progress>
      <aria-upload-file-remove></aria-upload-file-remove>
    </aria-upload-item>
    <aria-upload-clear></aria-upload-clear>
    <aria-upload-submit></aria-upload-submit>
  </aria-upload-list>
</aria-upload>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `format` | empty | Comma-separated MIME substrings or file extensions accepted by the queue. |
| `files` | `[]` | Read-only selected file records with stable IDs and preview URLs. |
| `fileschange` | — | Bubbling event emitted whenever accepted files are added. |
| `uploadrequest` | — | Cancelable event for custom transports; detail exposes `progress`, `resolve`, and `reject`. |

### Selector

`Selector` exposes `role="button"`, owns a hidden labeled multi-file input, accepts dropped files, and supports `disabled` / `is-disabled`.

### List And Item

`List` accepts `url` and `method`, plus `onSuccess` and `onError` callback properties. Generated items expose `data-state` and `data-progress`; metadata parts expose the same state and current value.

### Actions

`AutoSubmit` starts processed files automatically. `Submit` starts them manually. `Clear` revokes previews and empties the queue, while `FileRemove` removes one file. Canceling an action’s click event prevents its default operation.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| <kbd>Tab</kbd> | Moves through the selector and visible queue actions. |
| <kbd>Enter</kbd> | Opens the native file picker from the selector. |
| <kbd>Space</kbd> | Opens the native file picker from the selector. |

## Accessibility

The selector follows the [ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) and contains a native file input labeled “Upload files.” The root includes a polite, atomic status region that announces when files are ready, uploading, or complete. Drag and drop supplements rather than replaces keyboard access.
