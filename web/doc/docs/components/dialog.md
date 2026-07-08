# Dialog

A modal dialog that opens above the page for focused tasks such as editing profile details.

## Features

- **Focus trap**
- **Initial focus**
- **Portal rendering**
- **Controlled or uncontrolled**
- **Escape to close**
- **Headless**
- **Composable close controls**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/dialog
```

```bash [pnpm]
pnpm add @ariaui-web/dialog
```

```bash [yarn]
yarn add @ariaui-web/dialog
```

:::

### Register Elements

```ts
import { defineDialogElements } from "@ariaui-web/dialog";

defineDialogElements();
```

## Examples

The live examples below are native custom element entries for the `dialog` page.

### Edit profile

<div class="ariaui-web-preview" data-component="dialog" data-example-variant="edit-profile">
  <aria-dialog class="ariaui-web-dialog-example ariaui-web-example" data-example-part="Root">
    <aria-dialog-trigger class="ariaui-web-dialog-trigger" data-example-part="Trigger">
      Edit Profile
    </aria-dialog-trigger>
    <aria-dialog-portal data-example-part="Portal" hidden>
      <aria-dialog-overlay class="ariaui-web-dialog-overlay" data-example-part="Overlay" hidden></aria-dialog-overlay>
      <aria-dialog-content class="ariaui-web-dialog-content" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-dialog-copy">
          <aria-dialog-title data-example-part="Title">Edit profile</aria-dialog-title>
          <aria-dialog-description data-example-part="Description">Make changes to your profile here. Click save when you're done.</aria-dialog-description>
        </div>
        <div class="ariaui-web-dialog-form">
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-name">Name</label>
            <input id="dialog-demo-name" value="Pedro Duarte"></input>
          </div>
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-username">Username</label>
            <input id="dialog-demo-username" value="@peduarte"></input>
          </div>
        </div>
        <div class="ariaui-web-dialog-actions">
          <aria-dialog-cancel class="ariaui-web-dialog-button" data-example-part="Cancel">Cancel</aria-dialog-cancel>
          <aria-dialog-action class="ariaui-web-dialog-button ariaui-web-dialog-button-primary" data-example-part="Action">Save changes</aria-dialog-action>
        </div>
        <aria-dialog-close class="ariaui-web-dialog-close" data-example-part="Close" aria-label="Close">
          <svg class="h-4 w-4 text-icon" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
          <span class="sr-only">Close</span>
        </aria-dialog-close>
      </aria-dialog-content>
    </aria-dialog-portal>
  </aria-dialog>
</div>

```html
<aria-dialog class="ariaui-web-dialog-example ariaui-web-example" data-example-part="Root">
    <aria-dialog-trigger class="ariaui-web-dialog-trigger" data-example-part="Trigger">
      Edit Profile
    </aria-dialog-trigger>
    <aria-dialog-portal data-example-part="Portal" hidden>
      <aria-dialog-overlay class="ariaui-web-dialog-overlay" data-example-part="Overlay" hidden></aria-dialog-overlay>
      <aria-dialog-content class="ariaui-web-dialog-content" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-dialog-copy">
          <aria-dialog-title data-example-part="Title">Edit profile</aria-dialog-title>
          <aria-dialog-description data-example-part="Description">Make changes to your profile here. Click save when you're done.</aria-dialog-description>
        </div>
        <div class="ariaui-web-dialog-form">
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-name">Name</label>
            <input id="dialog-demo-name" value="Pedro Duarte"></input>
          </div>
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-username">Username</label>
            <input id="dialog-demo-username" value="@peduarte"></input>
          </div>
        </div>
        <div class="ariaui-web-dialog-actions">
          <aria-dialog-cancel class="ariaui-web-dialog-button" data-example-part="Cancel">Cancel</aria-dialog-cancel>
          <aria-dialog-action class="ariaui-web-dialog-button ariaui-web-dialog-button-primary" data-example-part="Action">Save changes</aria-dialog-action>
        </div>
        <aria-dialog-close class="ariaui-web-dialog-close" data-example-part="Close" aria-label="Close">
          <svg class="h-4 w-4 text-icon" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
          <span class="sr-only">Close</span>
        </aria-dialog-close>
      </aria-dialog-content>
    </aria-dialog-portal>
  </aria-dialog>
```

### Framer Motion

Animation libraries can target the native overlay and content elements through `data-state` attributes while keeping the same dialog structure.

<div class="ariaui-web-preview" data-component="dialog" data-example-variant="framer-motion">
  <aria-dialog class="ariaui-web-dialog-example ariaui-web-dialog-motion-example ariaui-web-example" data-example-part="Root">
    <aria-dialog-trigger class="ariaui-web-dialog-trigger" data-example-part="Trigger">
      Edit Profile
    </aria-dialog-trigger>
    <aria-dialog-portal data-example-part="Portal" hidden>
      <aria-dialog-overlay class="ariaui-web-dialog-overlay" data-example-part="Overlay" hidden></aria-dialog-overlay>
      <aria-dialog-content class="ariaui-web-dialog-content" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-dialog-copy">
          <aria-dialog-title data-example-part="Title">Edit profile</aria-dialog-title>
          <aria-dialog-description data-example-part="Description">Make changes to your profile here. Click save when you're done.</aria-dialog-description>
        </div>
        <div class="ariaui-web-dialog-form">
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-name">Name</label>
            <input id="dialog-demo-name" value="Pedro Duarte"></input>
          </div>
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-username">Username</label>
            <input id="dialog-demo-username" value="@peduarte"></input>
          </div>
        </div>
        <div class="ariaui-web-dialog-actions">
          <aria-dialog-cancel class="ariaui-web-dialog-button" data-example-part="Cancel">Cancel</aria-dialog-cancel>
          <aria-dialog-action class="ariaui-web-dialog-button ariaui-web-dialog-button-primary" data-example-part="Action">Save changes</aria-dialog-action>
        </div>
        <aria-dialog-close class="ariaui-web-dialog-close" data-example-part="Close" aria-label="Close">
          <svg class="h-4 w-4 text-icon" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
          <span class="sr-only">Close</span>
        </aria-dialog-close>
      </aria-dialog-content>
    </aria-dialog-portal>
  </aria-dialog>
</div>

```html
<aria-dialog class="ariaui-web-dialog-example ariaui-web-dialog-motion-example ariaui-web-example" data-example-part="Root">
    <aria-dialog-trigger class="ariaui-web-dialog-trigger" data-example-part="Trigger">
      Edit Profile
    </aria-dialog-trigger>
    <aria-dialog-portal data-example-part="Portal" hidden>
      <aria-dialog-overlay class="ariaui-web-dialog-overlay" data-example-part="Overlay" hidden></aria-dialog-overlay>
      <aria-dialog-content class="ariaui-web-dialog-content" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-dialog-copy">
          <aria-dialog-title data-example-part="Title">Edit profile</aria-dialog-title>
          <aria-dialog-description data-example-part="Description">Make changes to your profile here. Click save when you're done.</aria-dialog-description>
        </div>
        <div class="ariaui-web-dialog-form">
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-name">Name</label>
            <input id="dialog-demo-name" value="Pedro Duarte"></input>
          </div>
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-username">Username</label>
            <input id="dialog-demo-username" value="@peduarte"></input>
          </div>
        </div>
        <div class="ariaui-web-dialog-actions">
          <aria-dialog-cancel class="ariaui-web-dialog-button" data-example-part="Cancel">Cancel</aria-dialog-cancel>
          <aria-dialog-action class="ariaui-web-dialog-button ariaui-web-dialog-button-primary" data-example-part="Action">Save changes</aria-dialog-action>
        </div>
        <aria-dialog-close class="ariaui-web-dialog-close" data-example-part="Close" aria-label="Close">
          <svg class="h-4 w-4 text-icon" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
          <span class="sr-only">Close</span>
        </aria-dialog-close>
      </aria-dialog-content>
    </aria-dialog-portal>
  </aria-dialog>
```

## Anatomy

```html
<aria-dialog>
  <aria-dialog-trigger>Edit Profile</aria-dialog-trigger>
  <aria-dialog-portal>
    <aria-dialog-overlay></aria-dialog-overlay>
    <aria-dialog-content>
      <aria-dialog-title>Edit profile</aria-dialog-title>
      <aria-dialog-description>
        Make changes to your profile here.
      </aria-dialog-description>
      <aria-dialog-cancel>Cancel</aria-dialog-cancel>
      <aria-dialog-action>Save changes</aria-dialog-action>
      <aria-dialog-close aria-label="Close"></aria-dialog-close>
    </aria-dialog-content>
  </aria-dialog-portal>
</aria-dialog>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-dialog` | none |
| Action | `aria-dialog-action` | `button` |
| Cancel | `aria-dialog-cancel` | `button` |
| Close | `aria-dialog-close` | `button` |
| Content | `aria-dialog-content` | none |
| Description | `aria-dialog-description` | none |
| Overlay | `aria-dialog-overlay` | `presentation` |
| Portal | `aria-dialog-portal` | none |
| Title | `aria-dialog-title` | `heading` |
| Trigger | `aria-dialog-trigger` | `button` |

## API Reference

The package-level native contract lives in `packages/dialog/readme.md`.

### Root

- Element: `aria-dialog`
- Owns controlled or uncontrolled open state.
- Supports `open`, `default-open`, and `defaultopen`.
- Emits `openchange` with the next open state and the requesting source element.
- Starts closed unless `open` or `default-open` is present.

### Trigger

- Element: `aria-dialog-trigger`
- Defaults to `role="button"`.
- Opens the nearest Root on click, Enter, or Space.
- Closes the dialog when clicked while the nearest Root is open.
- Reflects `open`, `aria-expanded`, and `data-state`.

### Portal

- Element: `aria-dialog-portal`
- Groups Overlay and Content under a native custom element host.
- Reflects `data-state` and hides while closed unless `force-mount` is present.
- Native consumers choose DOM placement by placing this host.

### Overlay

- Element: `aria-dialog-overlay`
- Defaults to `role="presentation"`.
- Renders the backdrop layer behind Content.
- Reflects `data-state` and hides while closed unless `force-mount` is present.
- Closes the dialog by default when clicked directly.

### Content

- Element: `aria-dialog-content`
- Exposes `data-dialog-content`.
- Applies `role="dialog"`, `aria-modal="true"`, and `tabindex="-1"` while open.
- Auto-wires `aria-labelledby` to Title and `aria-describedby` to Description.
- Traps focus, supports Escape dismissal, and emits cancellable `openautofocus`, `closeautofocus`, and `escapekeydown` events.

### Title

- Element: `aria-dialog-title`
- Defaults to `role="heading"` and `aria-level="2"`.
- Provides the accessible name for Content through generated ID linkage.

### Description

- Element: `aria-dialog-description`
- Provides supporting text for Content through generated ID linkage.
- Multiple descriptions are concatenated into `aria-describedby`.

### Close

- Element: `aria-dialog-close`
- Defaults to `role="button"`.
- Closes the dialog by default and is suitable for the X icon control.

### Cancel

- Element: `aria-dialog-cancel`
- Defaults to `role="button"`.
- Exposes `data-dialog-cancel`.
- Receives initial focus when present and closes the dialog by default.

### Action

- Element: `aria-dialog-action`
- Defaults to `role="button"`.
- Exposes `data-dialog-action`.
- Represents the primary action and closes the dialog by default.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Space` / `Enter` | Opens the dialog when focus is on the Trigger. |
| `Tab` / `Shift+Tab` | Cycles focus forward or backward through interactive elements inside the open dialog. Focus is trapped inside Content. |
| `Escape` | Closes the dialog and returns focus to the Trigger. |

## Accessibility

The Dialog component implements the [WAI-ARIA Dialog Modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Content renders with `role="dialog"` and `aria-modal="true"` only while open. Title and Description are auto-wired via `aria-labelledby` and `aria-describedby`.

::: tip Keep Content labelled
`aria-dialog-title` should be present for an accessible name, and `aria-dialog-description` should describe what changes inside the modal.
:::

::: warning Closed by default
Closed Content stays hidden and outside the dialog accessibility tree until Trigger opens the Root.
:::
