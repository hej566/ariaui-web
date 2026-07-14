# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response. Renders above the page and blocks interaction until dismissed.

## Features

- **Focus trap**
- **Initial focus**
- **Inert outside**
- **Portal rendering**
- **Controlled or uncontrolled**
- **Escape to close**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/alert-dialog
```

```bash [pnpm]
pnpm add @ariaui-web/alert-dialog
```

```bash [yarn]
yarn add @ariaui-web/alert-dialog
```

:::

### Register Elements

```ts
import { defineAlertDialogElements } from "@ariaui-web/alert-dialog";

defineAlertDialogElements();
```

## Examples

The live examples below are native custom element entries for the `alert-dialog` page.

### Destructive confirmation

<div class="ariaui-web-preview" data-component="alert-dialog" data-example-variant="destructive">
  <aria-alert-dialog class="ariaui-web-alert-dialog-example ariaui-web-example" data-example-part="Root">
    <aria-alert-dialog-trigger class="ariaui-web-alert-dialog-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Trigger">
      Delete account
    </aria-alert-dialog-trigger>
    <aria-alert-dialog-portal data-example-part="Portal" hidden>
      <aria-alert-dialog-overlay class="ariaui-web-alert-dialog-overlay fixed inset-0 z-50 bg-overlay/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" data-example-part="Overlay" hidden></aria-alert-dialog-overlay>
      <aria-alert-dialog-content class="ariaui-web-alert-dialog-content fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-alert-dialog-stack flex flex-col gap-4">
          <div class="ariaui-web-alert-dialog-copy flex flex-col gap-2">
            <aria-alert-dialog-title class="text-lg font-semibold text-foreground" data-example-part="Title">Are you absolutely sure?</aria-alert-dialog-title>
            <aria-alert-dialog-description class="text-sm text-muted-foreground" data-example-part="Description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</aria-alert-dialog-description>
          </div>
          <div class="ariaui-web-alert-dialog-actions flex justify-end gap-2">
            <aria-alert-dialog-cancel class="ariaui-web-alert-dialog-button inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Cancel">Cancel</aria-alert-dialog-cancel>
            <aria-alert-dialog-action class="ariaui-web-alert-dialog-button ariaui-web-alert-dialog-button-destructive inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive-hover" data-example-part="Action">Delete account</aria-alert-dialog-action>
          </div>
        </div>
      </aria-alert-dialog-content>
    </aria-alert-dialog-portal>
  </aria-alert-dialog>
</div>

```html
<aria-alert-dialog class="ariaui-web-alert-dialog-example ariaui-web-example" data-example-part="Root">
    <aria-alert-dialog-trigger class="ariaui-web-alert-dialog-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Trigger">
      Delete account
    </aria-alert-dialog-trigger>
    <aria-alert-dialog-portal data-example-part="Portal" hidden>
      <aria-alert-dialog-overlay class="ariaui-web-alert-dialog-overlay fixed inset-0 z-50 bg-overlay/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" data-example-part="Overlay" hidden></aria-alert-dialog-overlay>
      <aria-alert-dialog-content class="ariaui-web-alert-dialog-content fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-alert-dialog-stack flex flex-col gap-4">
          <div class="ariaui-web-alert-dialog-copy flex flex-col gap-2">
            <aria-alert-dialog-title class="text-lg font-semibold text-foreground" data-example-part="Title">Are you absolutely sure?</aria-alert-dialog-title>
            <aria-alert-dialog-description class="text-sm text-muted-foreground" data-example-part="Description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</aria-alert-dialog-description>
          </div>
          <div class="ariaui-web-alert-dialog-actions flex justify-end gap-2">
            <aria-alert-dialog-cancel class="ariaui-web-alert-dialog-button inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Cancel">Cancel</aria-alert-dialog-cancel>
            <aria-alert-dialog-action class="ariaui-web-alert-dialog-button ariaui-web-alert-dialog-button-destructive inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive-hover" data-example-part="Action">Delete account</aria-alert-dialog-action>
          </div>
        </div>
      </aria-alert-dialog-content>
    </aria-alert-dialog-portal>
  </aria-alert-dialog>
```

### Framer Motion

Animation libraries can target the native overlay and content elements through `data-state` attributes while keeping the same alert dialog structure.

<div class="ariaui-web-preview" data-component="alert-dialog" data-example-variant="framer-motion">
  <aria-alert-dialog class="ariaui-web-alert-dialog-example ariaui-web-alert-dialog-motion-example ariaui-web-example" data-example-part="Root">
    <aria-alert-dialog-trigger class="ariaui-web-alert-dialog-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Trigger">
      Delete account
    </aria-alert-dialog-trigger>
    <aria-alert-dialog-portal data-example-part="Portal" hidden>
      <aria-alert-dialog-overlay class="ariaui-web-alert-dialog-overlay fixed inset-0 z-50 bg-overlay/50 backdrop-blur-sm" data-example-part="Overlay" hidden></aria-alert-dialog-overlay>
      <aria-alert-dialog-content class="ariaui-web-alert-dialog-content fixed left-1/2 top-1/2 z-50 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-alert-dialog-stack flex flex-col gap-4">
          <div class="ariaui-web-alert-dialog-copy flex flex-col gap-2">
            <aria-alert-dialog-title class="text-lg font-semibold text-foreground" data-example-part="Title">Are you absolutely sure?</aria-alert-dialog-title>
            <aria-alert-dialog-description class="text-sm text-muted-foreground" data-example-part="Description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</aria-alert-dialog-description>
          </div>
          <div class="ariaui-web-alert-dialog-actions flex justify-end gap-2">
            <aria-alert-dialog-cancel class="ariaui-web-alert-dialog-button inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Cancel">Cancel</aria-alert-dialog-cancel>
            <aria-alert-dialog-action class="ariaui-web-alert-dialog-button ariaui-web-alert-dialog-button-destructive inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive-hover" data-example-part="Action">Delete account</aria-alert-dialog-action>
          </div>
        </div>
      </aria-alert-dialog-content>
    </aria-alert-dialog-portal>
  </aria-alert-dialog>
</div>

```html
<aria-alert-dialog class="ariaui-web-alert-dialog-example ariaui-web-alert-dialog-motion-example ariaui-web-example" data-example-part="Root">
    <aria-alert-dialog-trigger class="ariaui-web-alert-dialog-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Trigger">
      Delete account
    </aria-alert-dialog-trigger>
    <aria-alert-dialog-portal data-example-part="Portal" hidden>
      <aria-alert-dialog-overlay class="ariaui-web-alert-dialog-overlay fixed inset-0 z-50 bg-overlay/50 backdrop-blur-sm" data-example-part="Overlay" hidden></aria-alert-dialog-overlay>
      <aria-alert-dialog-content class="ariaui-web-alert-dialog-content fixed left-1/2 top-1/2 z-50 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-alert-dialog-stack flex flex-col gap-4">
          <div class="ariaui-web-alert-dialog-copy flex flex-col gap-2">
            <aria-alert-dialog-title class="text-lg font-semibold text-foreground" data-example-part="Title">Are you absolutely sure?</aria-alert-dialog-title>
            <aria-alert-dialog-description class="text-sm text-muted-foreground" data-example-part="Description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</aria-alert-dialog-description>
          </div>
          <div class="ariaui-web-alert-dialog-actions flex justify-end gap-2">
            <aria-alert-dialog-cancel class="ariaui-web-alert-dialog-button inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted" data-example-part="Cancel">Cancel</aria-alert-dialog-cancel>
            <aria-alert-dialog-action class="ariaui-web-alert-dialog-button ariaui-web-alert-dialog-button-destructive inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive-hover" data-example-part="Action">Delete account</aria-alert-dialog-action>
          </div>
        </div>
      </aria-alert-dialog-content>
    </aria-alert-dialog-portal>
  </aria-alert-dialog>
```

## Anatomy

```html
<aria-alert-dialog>
  <aria-alert-dialog-trigger>Delete account</aria-alert-dialog-trigger>
  <aria-alert-dialog-portal>
    <aria-alert-dialog-overlay></aria-alert-dialog-overlay>
    <aria-alert-dialog-content>
      <aria-alert-dialog-title>Are you absolutely sure?</aria-alert-dialog-title>
      <aria-alert-dialog-description>
        This action cannot be undone.
      </aria-alert-dialog-description>
      <aria-alert-dialog-cancel>Cancel</aria-alert-dialog-cancel>
      <aria-alert-dialog-action>Delete account</aria-alert-dialog-action>
    </aria-alert-dialog-content>
  </aria-alert-dialog-portal>
</aria-alert-dialog>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-alert-dialog` | none |
| Action | `aria-alert-dialog-action` | `button` |
| Cancel | `aria-alert-dialog-cancel` | `button` |
| Content | `aria-alert-dialog-content` | none |
| Description | `aria-alert-dialog-description` | none |
| Icon | `aria-alert-dialog-icon` | none |
| Overlay | `aria-alert-dialog-overlay` | `presentation` |
| Portal | `aria-alert-dialog-portal` | none |
| Title | `aria-alert-dialog-title` | `heading` |
| Trigger | `aria-alert-dialog-trigger` | `button` |

## API Reference

The package-level native contract lives in `packages/alert-dialog/readme.md`.

### Root

- Element: `aria-alert-dialog`
- Owns controlled or uncontrolled open state.
- Supports `open`, `default-open`, and `defaultopen`.
- Emits `openchange` with the next open state and the requesting source element.

### Trigger

- Element: `aria-alert-dialog-trigger`
- Defaults to `role="button"`.
- Opens the nearest Root on click, Enter, or Space.
- Reflects `open`, `aria-expanded`, and `data-state`.

### Portal

- Element: `aria-alert-dialog-portal`
- Groups Overlay and Content under a native custom element host.
- Reflects `data-state` and hides while closed unless `force-mount` is present.
- Native consumers choose DOM placement by placing this host.

### Overlay

- Element: `aria-alert-dialog-overlay`
- Defaults to `role="presentation"`.
- Renders the backdrop layer behind Content.
- Reflects `data-state` and hides while closed unless `force-mount` is present.

### Content

- Element: `aria-alert-dialog-content`
- Exposes `data-alert-dialog-content`.
- Applies `role="alertdialog"`, `aria-modal="true"`, and `tabindex="-1"` while open.
- Auto-wires `aria-labelledby` to Title and `aria-describedby` to Description.
- Traps focus, supports Escape dismissal, and emits cancellable `openautofocus`, `closeautofocus`, and `escapekeydown` events.

### Title

- Element: `aria-alert-dialog-title`
- Defaults to `role="heading"` and `aria-level="2"`.
- Provides the accessible name for Content through generated ID linkage.

### Description

- Element: `aria-alert-dialog-description`
- Provides supporting consequence text for Content through generated ID linkage.
- Multiple descriptions are concatenated into `aria-describedby`.

### Icon

- Element: `aria-alert-dialog-icon`
- Exposes `aria-hidden="true"`.
- Intended for decorative visual emphasis.

### Cancel

- Element: `aria-alert-dialog-cancel`
- Defaults to `role="button"`.
- Exposes `data-alert-dialog-cancel`.
- Receives initial focus before destructive Action when present and closes the dialog by default.

### Action

- Element: `aria-alert-dialog-action`
- Defaults to `role="button"`.
- Represents the confirm or destructive path and closes the dialog by default.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Space` / `Enter` | Opens the dialog when focus is on the Trigger. |
| `Tab` / `Shift+Tab` | Cycles focus forward or backward through interactive elements inside the open dialog. Focus is trapped inside Content. |
| `Escape` | Closes the dialog and returns focus to the Trigger. |

## Accessibility

The Alert Dialog component implements the [WAI-ARIA Alert Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/). Content renders with `role="alertdialog"` and `aria-modal="true"`. Title and Description are auto-wired via `aria-labelledby` and `aria-describedby` so screen readers announce the full context on open.

::: tip Always provide Title and Description
`aria-alert-dialog-title` and `aria-alert-dialog-description` are required for accessible announcements. Screen readers use them to identify the dialog's purpose and communicate the consequences of the action.
:::

::: warning Use Alert Dialog for destructive actions
Alert Dialog differs from a regular Dialog because users must explicitly choose Cancel or confirm. This enforces intentional interaction for irreversible operations.
:::
