# Avatar

An image element with a fallback for representing the user.

## Features

- **Automatic fallback**
- **Accessible defaults**
- **Image lifecycle hooks**
- **Group support**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/avatar
```

```bash [pnpm]
pnpm add @ariaui-web/avatar
```

```bash [yarn]
yarn add @ariaui-web/avatar
```

:::

### Register Elements

```ts
import { defineAvatarElements } from "@ariaui-web/avatar";

defineAvatarElements();
```

## Examples

The live examples below are native custom element entries for the `avatar` page.

### With image

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="avatar" data-example-variant="with-image">
  <aria-avatar class="relative flex shrink-0 overflow-hidden rounded-full border-2 border-background [&_img]:absolute [&_img]:inset-0 [&_img]:size-full [&_img]:object-cover h-12 w-12" data-example-part="Root">
    <aria-avatar-image src="/avatar.png" alt="Profile photo" data-example-part="Image"></aria-avatar-image>
    <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">SC</aria-avatar-fallback>
  </aria-avatar>
</div>

```html
<aria-avatar class="relative flex shrink-0 overflow-hidden rounded-full border-2 border-background [&_img]:absolute [&_img]:inset-0 [&_img]:size-full [&_img]:object-cover h-12 w-12" data-example-part="Root">
    <aria-avatar-image src="/avatar.png" alt="Profile photo" data-example-part="Image"></aria-avatar-image>
    <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">SC</aria-avatar-fallback>
  </aria-avatar>
```

### Initials

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="avatar" data-example-variant="initials">
  <aria-avatar aria-label="Fallback avatar initials SC" class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary h-12 w-12" data-example-part="Root">
    <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">SC</aria-avatar-fallback>
  </aria-avatar>
</div>

```html
<aria-avatar aria-label="Fallback avatar initials SC" class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary h-12 w-12" data-example-part="Root">
    <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">SC</aria-avatar-fallback>
  </aria-avatar>
```

### Overlapping row

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="avatar" data-example-variant="overlapping-row">
  <aria-avatar-group class="-space-x-3 flex items-center pr-3" data-example-part="Group">
    <aria-avatar class="relative flex shrink-0 overflow-hidden rounded-full [&>img]:aspect-square [&>img]:h-full [&>img]:w-full [&>img]:object-cover h-12 w-12 border-2 border-background" data-example-part="Root">
      <aria-avatar-image src="/avatar.png" alt="Team member 1" data-example-part="Image"></aria-avatar-image>
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">A1</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar class="relative flex shrink-0 overflow-hidden rounded-full [&>img]:aspect-square [&>img]:h-full [&>img]:w-full [&>img]:object-cover h-12 w-12 border-2 border-background" data-example-part="Root">
      <aria-avatar-image src="/avatar.png" alt="Team member 2" data-example-part="Image"></aria-avatar-image>
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">A2</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar aria-label="Member initials MW" class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary h-12 w-12" data-example-part="Root">
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">MW</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar aria-label="Member initials SD" class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary h-12 w-12" data-example-part="Root">
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">SD</aria-avatar-fallback>
    </aria-avatar>
  </aria-avatar-group>
</div>

```html
<aria-avatar-group class="-space-x-3 flex items-center pr-3" data-example-part="Group">
    <aria-avatar class="relative flex shrink-0 overflow-hidden rounded-full [&>img]:aspect-square [&>img]:h-full [&>img]:w-full [&>img]:object-cover h-12 w-12 border-2 border-background" data-example-part="Root">
      <aria-avatar-image src="/avatar.png" alt="Team member 1" data-example-part="Image"></aria-avatar-image>
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">A1</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar class="relative flex shrink-0 overflow-hidden rounded-full [&>img]:aspect-square [&>img]:h-full [&>img]:w-full [&>img]:object-cover h-12 w-12 border-2 border-background" data-example-part="Root">
      <aria-avatar-image src="/avatar.png" alt="Team member 2" data-example-part="Image"></aria-avatar-image>
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">A2</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar aria-label="Member initials MW" class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary h-12 w-12" data-example-part="Root">
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">MW</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar aria-label="Member initials SD" class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary h-12 w-12" data-example-part="Root">
      <aria-avatar-fallback class="absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary" data-example-part="Fallback">SD</aria-avatar-fallback>
    </aria-avatar>
  </aria-avatar-group>
```

## Anatomy

```html
<aria-avatar>
  <aria-avatar-image src="/avatar.png" alt="Profile photo"></aria-avatar-image>
  <aria-avatar-fallback>SC</aria-avatar-fallback>
</aria-avatar>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-avatar` | none |
| Fallback | `aria-avatar-fallback` | none |
| Group | `aria-avatar-group` | `group` |
| Image | `aria-avatar-image` | none |

## API Reference

The package-level native contract lives in `packages/avatar/readme.md`.

### Root

- Element: `aria-avatar`
- Coordinates Image and Fallback loading state.
- Applies `role="img"` and `aria-label="avatar"` while fallback content is visible unless consumers provide their own values.
- Removes only its default image semantics after the image loads.
- Supports convenience `src`, `alt`, `fallback`, and `fallback-delay-ms` attributes for simple one-element usage.

### Image

- Element: `aria-avatar-image`
- Renders a native `<img>` only when `src` is present.
- Forwards `src`, `alt`, `srcset`, `sizes`, `crossorigin`, `referrerpolicy`, `loading`, `decoding`, and `fetchpriority`.
- Reflects `data-loading-status` as `loading`, `loaded`, or `error`.
- Hides the internal `<img>` with `aria-hidden="true"` and `visibility: hidden` while loading or errored.
- Emits `load`, `error`, and `loadingstatuschange` events when the internal image state changes.

### Fallback

- Element: `aria-avatar-fallback`
- Renders while the nearest Root image status is not `loaded`.
- Supports `delay-ms` to delay fallback display and avoid a quick flash during fast image loads.

### Group

- Element: `aria-avatar-group`
- Defaults to `role="group"`.
- Allows consumer role overrides such as `role="presentation"`.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus to the next focusable control placed near or inside an avatar. |
| `Shift+Tab` | Moves focus to the previous focusable control. |

## Accessibility

There is no dedicated WAI-ARIA APG pattern for avatars. `aria-avatar` applies `role="img"` and `aria-label="avatar"` while fallback content is visible; once the image loads, those defaults are removed and the internal image follows native `alt` text semantics.

::: tip Alt text
Provide meaningful `alt` text whenever the photo identifies the user. Use `alt=""` only when the avatar is decorative and nearby text already names the person.
:::

::: tip Groups
Use `aria-avatar-group` when multiple avatars represent one related set. The default `role="group"` exposes that relationship to assistive technology.
:::
