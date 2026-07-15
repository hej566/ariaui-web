# Hover Card

A headless, accessible hover card for showing rich preview content when a trigger is hovered or focused.

## Features

- Opens on pointer hover and keyboard focus of the trigger.
- Closes on pointer leave, blur, or `Escape`.
- Content uses the browser top layer and viewport-aware collision placement.
- Configurable placement, offset, and optional arrow pointer.
- Supports uncontrolled state, `default-open`, and cancelable `openchange` control.
- Works with arbitrary preview content.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/hover-card
```

```bash [pnpm]
pnpm add @ariaui-web/hover-card
```

```bash [yarn]
yarn add @ariaui-web/hover-card
```

:::

Register the custom elements once before using them:

```ts
import { defineHoverCardElements } from "@ariaui-web/hover-card";

defineHoverCardElements();
```

## Examples

The live examples below use the browser-native `@ariaui-web/hover-card` elements while matching the source AriaUI examples.

### Hover Card

<div class="ariaui-web-preview flex min-h-[260px] w-full items-center justify-center px-6 py-10" data-component="hover-card" data-example-variant="default">
  <aria-hover-card data-example-part="Root">
    <aria-hover-card-trigger data-example-part="Trigger" class="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-brand ariaui-web-hover-card-trigger">@nextjs</aria-hover-card-trigger>
    <aria-hover-card-content data-example-part="Content" class="z-50 w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md ariaui-web-hover-card-content">
      <div class="flex gap-4 ariaui-web-hover-card-layout">
        <aria-avatar class="size-12 shrink-0 overflow-hidden rounded-full bg-muted ariaui-web-hover-card-avatar">
          <aria-avatar-image src="https://www.figma.com/api/mcp/asset/985bb6f4-c0df-4534-b789-c0d135a0fc51" alt=""></aria-avatar-image>
          <aria-avatar-fallback class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ariaui-web-hover-card-fallback">NX</aria-avatar-fallback>
        </aria-avatar>
        <div class="flex min-w-0 flex-1 flex-col gap-1 ariaui-web-hover-card-copy">
          <h4 class="text-sm font-semibold text-popover-foreground">@nextjs</h4>
          <p class="text-sm leading-5 text-popover-foreground">The React Framework - created and maintained by @vercel.</p>
          <div class="flex items-center gap-2 pt-2 ariaui-web-hover-card-meta"><svg aria-hidden="true" class="size-4 shrink-0 text-muted-foreground ariaui-web-hover-card-calendar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A2.25 2.25 0 0 1 20.25 7.5v11.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 6 5.25Z"></path></svg><span class="text-xs text-muted-foreground">Joined December 2024</span></div>
        </div>
      </div>
    </aria-hover-card-content>
  </aria-hover-card>
</div>

```html
<aria-hover-card data-example-part="Root">
    <aria-hover-card-trigger data-example-part="Trigger" class="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-brand ariaui-web-hover-card-trigger">@nextjs</aria-hover-card-trigger>
    <aria-hover-card-content data-example-part="Content" class="z-50 w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md ariaui-web-hover-card-content">
      <div class="flex gap-4 ariaui-web-hover-card-layout">
        <aria-avatar class="size-12 shrink-0 overflow-hidden rounded-full bg-muted ariaui-web-hover-card-avatar">
          <aria-avatar-image src="https://www.figma.com/api/mcp/asset/985bb6f4-c0df-4534-b789-c0d135a0fc51" alt=""></aria-avatar-image>
          <aria-avatar-fallback class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ariaui-web-hover-card-fallback">NX</aria-avatar-fallback>
        </aria-avatar>
        <div class="flex min-w-0 flex-1 flex-col gap-1 ariaui-web-hover-card-copy">
          <h4 class="text-sm font-semibold text-popover-foreground">@nextjs</h4>
          <p class="text-sm leading-5 text-popover-foreground">The React Framework - created and maintained by @vercel.</p>
          <div class="flex items-center gap-2 pt-2 ariaui-web-hover-card-meta"><svg aria-hidden="true" class="size-4 shrink-0 text-muted-foreground ariaui-web-hover-card-calendar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A2.25 2.25 0 0 1 20.25 7.5v11.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 6 5.25Z"></path></svg><span class="text-xs text-muted-foreground">Joined December 2024</span></div>
        </div>
      </div>
    </aria-hover-card-content>
  </aria-hover-card>
```

### Framer Motion

<div class="ariaui-web-preview flex min-h-[260px] w-full items-center justify-center px-6 py-10" data-component="hover-card" data-example-variant="framer-motion">
  <aria-hover-card data-hover-card-motion="" data-example-part="Root">
    <aria-hover-card-trigger data-example-part="Trigger" class="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-brand ariaui-web-hover-card-trigger">@nextjs</aria-hover-card-trigger>
    <aria-hover-card-content data-example-part="Content" class="z-50 w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md ariaui-web-hover-card-content">
      <div class="flex gap-4 ariaui-web-hover-card-layout">
        <aria-avatar class="size-12 shrink-0 overflow-hidden rounded-full bg-muted ariaui-web-hover-card-avatar">
          <aria-avatar-image src="https://www.figma.com/api/mcp/asset/985bb6f4-c0df-4534-b789-c0d135a0fc51" alt=""></aria-avatar-image>
          <aria-avatar-fallback class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ariaui-web-hover-card-fallback">NX</aria-avatar-fallback>
        </aria-avatar>
        <div class="flex min-w-0 flex-1 flex-col gap-1 ariaui-web-hover-card-copy">
          <h4 class="text-sm font-semibold text-popover-foreground">@nextjs</h4>
          <p class="text-sm leading-5 text-popover-foreground">The React Framework - created and maintained by @vercel.</p>
          <div class="flex items-center gap-2 pt-2 ariaui-web-hover-card-meta"><svg aria-hidden="true" class="size-4 shrink-0 text-muted-foreground ariaui-web-hover-card-calendar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A2.25 2.25 0 0 1 20.25 7.5v11.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 6 5.25Z"></path></svg><span class="text-xs text-muted-foreground">Joined December 2024</span></div>
        </div>
      </div>
    </aria-hover-card-content>
  </aria-hover-card>
</div>

```html
<aria-hover-card data-hover-card-motion="" data-example-part="Root">
    <aria-hover-card-trigger data-example-part="Trigger" class="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-brand ariaui-web-hover-card-trigger">@nextjs</aria-hover-card-trigger>
    <aria-hover-card-content data-example-part="Content" class="z-50 w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md ariaui-web-hover-card-content">
      <div class="flex gap-4 ariaui-web-hover-card-layout">
        <aria-avatar class="size-12 shrink-0 overflow-hidden rounded-full bg-muted ariaui-web-hover-card-avatar">
          <aria-avatar-image src="https://www.figma.com/api/mcp/asset/985bb6f4-c0df-4534-b789-c0d135a0fc51" alt=""></aria-avatar-image>
          <aria-avatar-fallback class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ariaui-web-hover-card-fallback">NX</aria-avatar-fallback>
        </aria-avatar>
        <div class="flex min-w-0 flex-1 flex-col gap-1 ariaui-web-hover-card-copy">
          <h4 class="text-sm font-semibold text-popover-foreground">@nextjs</h4>
          <p class="text-sm leading-5 text-popover-foreground">The React Framework - created and maintained by @vercel.</p>
          <div class="flex items-center gap-2 pt-2 ariaui-web-hover-card-meta"><svg aria-hidden="true" class="size-4 shrink-0 text-muted-foreground ariaui-web-hover-card-calendar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A2.25 2.25 0 0 1 20.25 7.5v11.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 6 5.25Z"></path></svg><span class="text-xs text-muted-foreground">Joined December 2024</span></div>
        </div>
      </div>
    </aria-hover-card-content>
  </aria-hover-card>
```

## Anatomy

```html
<aria-hover-card>
  <aria-hover-card-trigger>@nextjs</aria-hover-card-trigger>
  <aria-hover-card-content>Preview content</aria-hover-card-content>
</aria-hover-card>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-hover-card` | none |
| Content | `aria-hover-card-content` | `tooltip` |
| Trigger | `aria-hover-card-trigger` | `button` |

## API Reference

The package-level native contract lives in `packages/hover-card/readme.md`.

### Root

- Element: `aria-hover-card`.
- `open`: current boolean open state.
- `default-open`: uncontrolled initial open state.
- `placement`: preferred top, right, bottom, left, or start/end placement; defaults to `bottom`.
- `offset`: trigger-to-content distance in CSS pixels; defaults to `8`.
- `openchange`: bubbling, cancelable request event with `{ open, source }` detail.

### Trigger

- Element: `aria-hover-card-trigger`.
- Opens on pointer hover and focus.
- Reflects `aria-expanded` and is associated with Content.

### Content

- Element: `aria-hover-card-content`.
- Uses `role="tooltip"`, browser top-layer behavior, and viewport-aware fixed positioning.
- `arrow`: renders the optional arrow marker.
- `arrow-class`: applies classes to the arrow marker.
- Reflects resolved placement through `data-side` and `data-align`.

## Keyboard

| Key | Action |
| --- | --- |
| `Tab` | Move focus to Trigger and open the Hover Card. |
| `Shift + Tab` | Move focus away and close the Hover Card. |
| `Escape` | Close the open Hover Card. |

## Accessibility

Hover Card complements but does not replace primary navigation or required information. Preview content must remain available through another route.

- Trigger exposes browser-native button-like semantics and keyboard focus parity.
- Content uses `role="tooltip"` and stable Trigger association.
- Pointer users can move from Trigger into Content without losing the preview.
- Do not put required interactive controls inside Content; use Popover or Dialog for keyboard-reachable controls.
