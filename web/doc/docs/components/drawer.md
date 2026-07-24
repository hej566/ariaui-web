# Drawer

A headless, accessible slide-out drawer panel with focus trapping, scroll lock, and directional positioning.

## Features

- **Focus trap**
- **Scroll lock**
- **Directional panels**
- **Controlled or uncontrolled**
- **Escape and overlay dismissal**
- **Native composition for motion hosts**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/drawer
```

```bash [pnpm]
pnpm add @ariaui-web/drawer
```

```bash [yarn]
yarn add @ariaui-web/drawer
```

:::

### Register Elements

```ts
import { defineDrawerElements } from "@ariaui-web/drawer";

defineDrawerElements();
```

## Examples

### Slide-out drawer

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="drawer" data-example-variant="default">
  <div class="ariaui-web-drawer-preview-shell">
    <aria-drawer data-example-part="Root">
      <aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-trigger ariaui-web-drawer-trigger-primary" data-example-part="Trigger">Open Drawer</aria-drawer-trigger>
      <aria-drawer-portal data-example-part="Portal" hidden>
        <aria-drawer-overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay" data-example-part="Overlay" hidden></aria-drawer-overlay>
        <aria-drawer-content side="right" class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-background shadow-xl ariaui-web-drawer-content" data-example-part="Content" hidden aria-hidden="true">
          <aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header" data-example-part="Header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title" data-example-part="Title">Edit profile</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description" data-example-part="Description">Make changes to your profile here. Click save when you're done.</aria-drawer-description></aria-drawer-header>
          <div class="flex-1 overflow-y-auto px-6 ariaui-web-drawer-body"><div class="grid gap-4 ariaui-web-drawer-form"><div class="grid grid-cols-4 items-center gap-4 ariaui-web-drawer-field"><label for="drawer-demo-name" class="text-right text-sm font-medium text-foreground">Name</label><input id="drawer-demo-name" value="Pedro Duarte" class="col-span-3 flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"></input></div><div class="grid grid-cols-4 items-center gap-4 ariaui-web-drawer-field"><label for="drawer-demo-username" class="text-right text-sm font-medium text-foreground">Username</label><input id="drawer-demo-username" value="@peduarte" class="col-span-3 flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"></input></div></div></div>
          <aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer" data-example-part="Footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted ariaui-web-drawer-button" data-example-part="Cancel">Cancel</aria-drawer-cancel><aria-drawer-action class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary" data-example-part="Action">Save changes</aria-drawer-action></aria-drawer-footer>
          <aria-drawer-close class="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 ariaui-web-drawer-close" data-example-part="Close" aria-label="Close"><svg class="h-4 w-4 text-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg><span class="sr-only">Close</span></aria-drawer-close>
        </aria-drawer-content>
      </aria-drawer-portal>
    </aria-drawer>
  </div>
</div>

```html
<aria-drawer>
  <aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">Open Drawer</aria-drawer-trigger>
  <aria-drawer-content side="right" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-background shadow-xl">...</aria-drawer-content>
</aria-drawer>
```

### Drawer sides

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="drawer" data-example-variant="sides">
  <div class="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4 ariaui-web-drawer-sides-grid">
    <aria-drawer data-example-part="Root"><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger" data-example-part="Trigger">Top</aria-drawer-trigger><aria-drawer-portal data-example-part="Portal" hidden><aria-drawer-overlay class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay" data-example-part="Overlay" hidden></aria-drawer-overlay><aria-drawer-content side="top" class="fixed z-50 flex flex-col bg-background shadow-xl inset-x-0 top-0 max-h-[22rem] border-b border-border ariaui-web-drawer-content" data-example-part="Content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header" data-example-part="Header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title" data-example-part="Title">Top drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description" data-example-part="Description">This drawer opens from the top side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Quick access panel content can stay aligned to the edge that best fits the workflow.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer" data-example-part="Footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary" data-example-part="Cancel">Close</aria-drawer-cancel></aria-drawer-footer><aria-drawer-close class="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 ariaui-web-drawer-close" data-example-part="Close" aria-label="Close"><span class="sr-only">Close</span></aria-drawer-close></aria-drawer-content></aria-drawer-portal></aria-drawer>
    <aria-drawer><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Right</aria-drawer-trigger><aria-drawer-portal hidden><aria-drawer-overlay class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay" hidden></aria-drawer-overlay><aria-drawer-content side="right" class="fixed z-50 flex flex-col bg-background shadow-xl inset-y-0 right-0 w-full max-w-sm border-l border-border ariaui-web-drawer-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Right drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the right side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Quick access panel content can stay aligned to the edge that best fits the workflow.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer><aria-drawer-close class="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 ariaui-web-drawer-close" aria-label="Close"><span class="sr-only">Close</span></aria-drawer-close></aria-drawer-content></aria-drawer-portal></aria-drawer>
    <aria-drawer><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Bottom</aria-drawer-trigger><aria-drawer-portal hidden><aria-drawer-overlay class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay" hidden></aria-drawer-overlay><aria-drawer-content side="bottom" class="fixed z-50 flex flex-col bg-background shadow-xl inset-x-0 bottom-0 max-h-[22rem] border-t border-border ariaui-web-drawer-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Bottom drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the bottom side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Quick access panel content can stay aligned to the edge that best fits the workflow.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer><aria-drawer-close class="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 ariaui-web-drawer-close" aria-label="Close"><span class="sr-only">Close</span></aria-drawer-close></aria-drawer-content></aria-drawer-portal></aria-drawer>
    <aria-drawer><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Left</aria-drawer-trigger><aria-drawer-portal hidden><aria-drawer-overlay class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay" hidden></aria-drawer-overlay><aria-drawer-content side="left" class="fixed z-50 flex flex-col bg-background shadow-xl inset-y-0 left-0 w-full max-w-sm border-r border-border ariaui-web-drawer-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Left drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the left side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Quick access panel content can stay aligned to the edge that best fits the workflow.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer><aria-drawer-close class="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 ariaui-web-drawer-close" aria-label="Close"><span class="sr-only">Close</span></aria-drawer-close></aria-drawer-content></aria-drawer-portal></aria-drawer>
  </div>
</div>

```html
<aria-drawer-content side="top">...</aria-drawer-content>
<aria-drawer-content side="right">...</aria-drawer-content>
<aria-drawer-content side="bottom">...</aria-drawer-content>
<aria-drawer-content side="left">...</aria-drawer-content>
```

### Framer Motion

The package remains framework-free. This docs example keeps overlay and content mounted with `force-mount`, uses `framer-motion/dom` in the docs runtime, and animates the `aria-drawer-content` element directly.

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="drawer" data-example-variant="framer-motion">
  <div class="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4 ariaui-web-drawer-sides-grid">
    <aria-drawer data-drawer-motion><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Top</aria-drawer-trigger><aria-drawer-portal force-mount hidden><aria-drawer-overlay force-mount native-composition hidden><div class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay ariaui-web-drawer-motion-overlay" data-drawer-motion-overlay></div></aria-drawer-overlay><aria-drawer-content force-mount data-drawer-motion-content side="top" class="fixed z-50 flex flex-col bg-background shadow-xl inset-x-0 top-0 max-h-[22rem] border-b border-border ariaui-web-drawer-content ariaui-web-drawer-motion-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Top drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the top side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Framer Motion drives the panel transition while the drawer keeps focus management, dismissal, and side placement.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer></aria-drawer-content></aria-drawer-portal></aria-drawer>
    <aria-drawer data-drawer-motion><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Right</aria-drawer-trigger><aria-drawer-portal force-mount hidden><aria-drawer-overlay force-mount native-composition hidden><div class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay ariaui-web-drawer-motion-overlay" data-drawer-motion-overlay></div></aria-drawer-overlay><aria-drawer-content force-mount data-drawer-motion-content side="right" class="fixed z-50 flex flex-col bg-background shadow-xl inset-y-0 right-0 w-full max-w-sm border-l border-border ariaui-web-drawer-content ariaui-web-drawer-motion-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Right drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the right side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Framer Motion drives the panel transition while the drawer keeps focus management, dismissal, and side placement.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer></aria-drawer-content></aria-drawer-portal></aria-drawer>
    <aria-drawer data-drawer-motion><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Bottom</aria-drawer-trigger><aria-drawer-portal force-mount hidden><aria-drawer-overlay force-mount native-composition hidden><div class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay ariaui-web-drawer-motion-overlay" data-drawer-motion-overlay></div></aria-drawer-overlay><aria-drawer-content force-mount data-drawer-motion-content side="bottom" class="fixed z-50 flex flex-col bg-background shadow-xl inset-x-0 bottom-0 max-h-[22rem] border-t border-border ariaui-web-drawer-content ariaui-web-drawer-motion-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Bottom drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the bottom side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Framer Motion drives the panel transition while the drawer keeps focus management, dismissal, and side placement.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer></aria-drawer-content></aria-drawer-portal></aria-drawer>
    <aria-drawer data-drawer-motion><aria-drawer-trigger class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted ariaui-web-drawer-trigger">Left</aria-drawer-trigger><aria-drawer-portal force-mount hidden><aria-drawer-overlay force-mount native-composition hidden><div class="fixed inset-0 z-50 cursor-pointer bg-overlay/50 backdrop-blur-sm ariaui-web-drawer-overlay ariaui-web-drawer-motion-overlay" data-drawer-motion-overlay></div></aria-drawer-overlay><aria-drawer-content force-mount data-drawer-motion-content side="left" class="fixed z-50 flex flex-col bg-background shadow-xl inset-y-0 left-0 w-full max-w-sm border-r border-border ariaui-web-drawer-content ariaui-web-drawer-motion-content" hidden aria-hidden="true"><aria-drawer-header class="flex flex-col gap-1.5 p-6 ariaui-web-drawer-header"><aria-drawer-title class="heading-xs text-foreground ariaui-web-drawer-title">Left drawer</aria-drawer-title><aria-drawer-description class="text-sm text-muted-foreground ariaui-web-drawer-description">This drawer opens from the left side of the viewport.</aria-drawer-description></aria-drawer-header><div class="flex-1 px-6 pb-6 text-sm text-muted-foreground ariaui-web-drawer-body">Framer Motion drives the panel transition while the drawer keeps focus management, dismissal, and side placement.</div><aria-drawer-footer class="flex justify-end gap-2 border-t border-border p-6 ariaui-web-drawer-footer"><aria-drawer-cancel class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ariaui-web-drawer-button ariaui-web-drawer-button-primary">Close</aria-drawer-cancel></aria-drawer-footer></aria-drawer-content></aria-drawer-portal></aria-drawer>
  </div>
</div>

```html
<aria-drawer data-drawer-motion>
  <aria-drawer-portal force-mount>
    <aria-drawer-overlay force-mount native-composition><div data-drawer-motion-overlay></div></aria-drawer-overlay>
    <aria-drawer-content side="right" force-mount data-drawer-motion-content>...</aria-drawer-content>
  </aria-drawer-portal>
</aria-drawer>
```

## Anatomy

```html
<aria-drawer>
  <aria-drawer-trigger>Open Drawer</aria-drawer-trigger>
  <aria-drawer-portal>
    <aria-drawer-overlay></aria-drawer-overlay>
    <aria-drawer-content>
      <aria-drawer-header>
        <aria-drawer-title>Edit profile</aria-drawer-title>
        <aria-drawer-description>Make changes to your profile here.</aria-drawer-description>
      </aria-drawer-header>
      <aria-drawer-footer>
        <aria-drawer-cancel>Cancel</aria-drawer-cancel>
        <aria-drawer-action>Save changes</aria-drawer-action>
      </aria-drawer-footer>
      <aria-drawer-close aria-label="Close"></aria-drawer-close>
    </aria-drawer-content>
  </aria-drawer-portal>
</aria-drawer>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-drawer` | none |
| Action | `aria-drawer-action` | `button` |
| Cancel | `aria-drawer-cancel` | `button` |
| Close | `aria-drawer-close` | `button` |
| Content | `aria-drawer-content` | none |
| Description | `aria-drawer-description` | none |
| Footer | `aria-drawer-footer` | none |
| Header | `aria-drawer-header` | none |
| Overlay | `aria-drawer-overlay` | `presentation` |
| Portal | `aria-drawer-portal` | none |
| Title | `aria-drawer-title` | `heading` |
| Trigger | `aria-drawer-trigger` | `button` |

## API Reference

The package-level native contract lives in `packages/drawer/readme.md`.

### Root

Supports `open`, `default-open`, and bubbling `openchange` events.

### Trigger

Opens the drawer and reflects `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, and `data-state`.

### Content

Uses `role="dialog"` and `aria-modal="true"` while open. Supports `side`, `force-mount`, and `native-composition`.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| `Escape` | Close the drawer and return focus to the trigger. |
| `Tab` | Move focus to the next focusable element within the drawer, looping to the first. |
| `Shift` + `Tab` | Move focus to the previous focusable element within the drawer, looping to the last. |
| `Enter` / `Space` | Activate the focused button-like part. |

## Accessibility

- Trigger exposes `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- Content exposes `role="dialog"` and `aria-modal="true"` while open.
- Title and Description IDs are generated and wired to Content.
- Focus moves into Content on open, remains trapped while open, and returns to the Trigger on close.
- Body scroll is locked while the drawer is open.
