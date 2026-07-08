# Alert

Displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.

## Features

- **Semantic HTML**
- **Accessible labeling**
- **Headless**
- **Action slot**
- **Dismissible**
- **Close button**
- **Cancel action**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/alert
```

```bash [pnpm]
pnpm add @ariaui-web/alert
```

```bash [yarn]
yarn add @ariaui-web/alert
```

:::

### Register Elements

```ts
import { defineAlertElements } from "@ariaui-web/alert";

defineAlertElements();
```

## Examples

The live examples below are native custom element entries for the `alert` page.

### Success

<div class="ariaui-web-preview" data-component="alert" data-example-variant="success">
  <aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-success" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.573-1.573a.75.75 0 0 0-1.061 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.7-5.18Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Success</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">Your changes have been saved successfully.</aria-alert-description>
      </div>
    </div>
  </aria-alert>
</div>

```html
<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-success" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.573-1.573a.75.75 0 0 0-1.061 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.7-5.18Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Success</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">Your changes have been saved successfully.</aria-alert-description>
      </div>
    </div>
  </aria-alert>
```

### Warning

<div class="ariaui-web-preview" data-component="alert" data-example-variant="warning">
  <aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-warning" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.401 3.003c1.155-1.997 4.043-1.997 5.197 0l7.355 12.73c1.154 1.998-.29 4.495-2.599 4.495H4.645c-2.309 0-3.752-2.497-2.598-4.495l7.354-12.73ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Heads up</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">Your session will expire in 5 minutes. Save your work to avoid losing changes.</aria-alert-description>
      </div>
    </div>
  </aria-alert>
</div>

```html
<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-warning" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.401 3.003c1.155-1.997 4.043-1.997 5.197 0l7.355 12.73c1.154 1.998-.29 4.495-2.599 4.495H4.645c-2.309 0-3.752-2.497-2.598-4.495l7.354-12.73ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Heads up</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">Your session will expire in 5 minutes. Save your work to avoid losing changes.</aria-alert-description>
      </div>
    </div>
  </aria-alert>
```

### Error

<div class="ariaui-web-preview" data-component="alert" data-example-variant="error">
  <aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-destructive" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Something went wrong</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">We could not load your data. Check your connection and try again.</aria-alert-description>
      </div>
    </div>
  </aria-alert>
</div>

```html
<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-destructive" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Something went wrong</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">We could not load your data. Check your connection and try again.</aria-alert-description>
      </div>
    </div>
  </aria-alert>
```

### With actions

<div class="ariaui-web-preview" data-component="alert" data-example-variant="with-actions">
  <aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root" dismissible role="status">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-destructive" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd"></path></svg>
      <div class="min-w-0 flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Payment failed</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">The card was declined. Update your billing method or use a different card.</aria-alert-description>
        <aria-alert-action class="flex flex-wrap gap-2 pt-3" data-example-part="Action">
          <button type="button" class="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted">Update card</button>
          <aria-alert-cancel class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground" data-example-part="Cancel">Dismiss</aria-alert-cancel>
        </aria-alert-action>
      </div>
    </div>
  </aria-alert>
</div>

```html
<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root" dismissible role="status">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-destructive" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd"></path></svg>
      <div class="min-w-0 flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Payment failed</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">The card was declined. Update your billing method or use a different card.</aria-alert-description>
        <aria-alert-action class="flex flex-wrap gap-2 pt-3" data-example-part="Action">
          <button type="button" class="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted">Update card</button>
          <aria-alert-cancel class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground" data-example-part="Cancel">Dismiss</aria-alert-cancel>
        </aria-alert-action>
      </div>
    </div>
  </aria-alert>
```

### Dismissible

<div class="ariaui-web-preview" data-component="alert" data-example-variant="dismissible">
  <aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root" dismissible role="status">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-warning" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.401 3.003c1.155-1.997 4.043-1.997 5.197 0l7.355 12.73c1.154 1.998-.29 4.495-2.599 4.495H4.645c-2.309 0-3.752-2.497-2.598-4.495l7.354-12.73ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Maintenance scheduled</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">System maintenance will occur on Sunday at 2:00 AM UTC.</aria-alert-description>
      </div>
      <aria-alert-close class="ml-2 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" data-example-part="Close">
        <svg class="h-4 w-4 text-icon" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
      </aria-alert-close>
    </div>
  </aria-alert>
</div>

```html
<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root" dismissible role="status">
    <div class="flex items-start gap-3">
      <svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-warning" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.401 3.003c1.155-1.997 4.043-1.997 5.197 0l7.355 12.73c1.154 1.998-.29 4.495-2.599 4.495H4.645c-2.309 0-3.752-2.497-2.598-4.495l7.354-12.73ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Maintenance scheduled</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">System maintenance will occur on Sunday at 2:00 AM UTC.</aria-alert-description>
      </div>
      <aria-alert-close class="ml-2 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" data-example-part="Close">
        <svg class="h-4 w-4 text-icon" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
      </aria-alert-close>
    </div>
  </aria-alert>
```

## Anatomy

```html
<aria-alert>
  <aria-alert-title>Title</aria-alert-title>
  <aria-alert-description>Description</aria-alert-description>
  <aria-alert-action>
    <button type="button">Action</button>
    <aria-alert-cancel>Cancel</aria-alert-cancel>
  </aria-alert-action>
  <aria-alert-close>Close</aria-alert-close>
</aria-alert>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-alert` | `alert` |
| Action | `aria-alert-action` | none |
| Cancel | `aria-alert-cancel` | `button` |
| Close | `aria-alert-close` | `button` |
| Description | `aria-alert-description` | none |
| Title | `aria-alert-title` | `heading` |

## API Reference

The package-level native contract lives in `packages/alert/readme.md`.

### Root

- Element: `aria-alert`
- Defaults to `role="alert"`.
- Supports `open`, `default-open`, `dismissible`, and custom live-region roles such as `status`.
- Emits `openchange` when a dismissible close or cancel control requests dismissal.

### Title

- Element: `aria-alert-title`
- Provides the accessible name for the alert.
- Receives a generated `id` when needed and links to Root through `aria-labelledby`.

### Description

- Element: `aria-alert-description`
- Provides supporting alert text.
- Receives a generated `id` when needed and links to Root through `aria-describedby`.

### Action

- Element: `aria-alert-action`
- Non-interactive host for action content.
- Reflects `data-alert-action`.

### Close

- Element: `aria-alert-close`
- Defaults to `role="button"`.
- Reflects `data-alert-close`.
- Dismisses the nearest Root only when Root is `dismissible`.

### Cancel

- Element: `aria-alert-cancel`
- Defaults to `role="button"`.
- Reflects `data-alert-cancel`.
- Dismisses the nearest Root only when Root is `dismissible`.

## Accessibility

Alert root elements use the [WAI-ARIA alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) by default. Use `role="status"` for less urgent inline messages.

`aria-alert-title` and `aria-alert-description` are automatically linked to the root with `aria-labelledby` and `aria-describedby`, so the live-region announcement includes both the title and the message text.

Dismissible alerts should include a visible close or cancel control with an accessible label.
