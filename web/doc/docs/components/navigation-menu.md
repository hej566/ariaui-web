# Navigation Menu

An accessible navigation menu with rich content panels, nested submenus, pointer opening, and keyboard support.

## Features

- **Rich content panels**
- **Nested submenus**
- **Pointer and keyboard opening**
- **Managed focus**
- **Composable links**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/navigation-menu
```

```bash [pnpm]
pnpm add @ariaui-web/navigation-menu
```

```bash [yarn]
yarn add @ariaui-web/navigation-menu
```

:::

### Register Elements

```ts
import { defineNavigationMenuElements } from "@ariaui-web/navigation-menu";

defineNavigationMenuElements();
```

## Examples

### Navigation Menu

<div class="ariaui-web-preview flex w-full justify-center overflow-visible bg-background px-4 py-14 sm:px-12" data-component="navigation-menu" data-example-variant="default">
  <div class="flex flex-col items-center overflow-x-auto rounded-xl border border-border bg-background shadow-sm ariaui-web-navigation-menu-showcase">
    <div class="flex flex-wrap items-center justify-center gap-1 ariaui-web-navigation-menu-row">
      <aria-navigation-menu class="w-full ariaui-web-navigation-menu-root" data-example-part="Root">
        <aria-navigation-menu-list aria-label="Main navigation" class="flex list-none items-center gap-1 ariaui-web-navigation-menu-list" data-example-part="List">
          <aria-navigation-menu-item value="getting-started" data-example-part="Item">
            <aria-navigation-menu-trigger class="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium leading-5 text-foreground hover:bg-accent-hover focus-visible:bg-accent-hover data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground outline-none ariaui-web-navigation-menu-trigger" data-example-part="Trigger">Getting Started <svg class="ml-1 size-3 shrink-0 text-current group-data-[state=open]:rotate-180 ariaui-web-navigation-menu-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd"></path></svg></aria-navigation-menu-trigger>
            <aria-navigation-menu-content class="z-50 overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-sm w-[min(100vw-2rem,512px)] min-w-0 max-w-[512px] ariaui-web-navigation-menu-content ariaui-web-navigation-menu-getting-started-panel" data-example-part="Content">
              <div class="flex min-h-0 min-w-0 flex-col gap-4 sm:min-h-[254px] sm:flex-row sm:items-stretch sm:gap-2 ariaui-web-navigation-menu-getting-started-layout">
                <aria-navigation-menu-link href="/" class="relative flex h-full w-full flex-col justify-end gap-1 overflow-hidden rounded-sm border border-border/40 bg-muted bg-gradient-to-b from-background/40 to-muted p-6 text-left text-popover-foreground no-underline hover:from-background/55 hover:to-muted min-h-[160px] shrink-0 sm:min-h-0 sm:h-auto sm:w-[210px] sm:self-stretch ariaui-web-navigation-menu-hero" data-example-part="Link">
                  <div class="pb-2 pt-4 text-lg font-medium leading-7 text-popover-foreground ariaui-web-navigation-menu-hero-title">Aria UI</div>
                  <p class="w-full text-sm leading-5 text-muted-foreground ariaui-web-navigation-menu-description">Accessible headless components composed with Tailwind CSS.</p>
                </aria-navigation-menu-link>
                <div class="flex min-w-0 flex-1 flex-col gap-2 ariaui-web-navigation-menu-link-stack">
                  <aria-navigation-menu-link href="/docs" class="relative flex w-full min-w-0 flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover sm:min-w-[228px] ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Introduction</div><p class="text-sm leading-5 text-muted-foreground">Re-usable components built using Radix UI and Tailwind CSS.</p></aria-navigation-menu-link>
                  <aria-navigation-menu-link href="/docs/installation" class="relative flex w-full min-w-0 flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover sm:min-w-[228px] ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Installation</div><p class="text-sm leading-5 text-muted-foreground">How to install dependencies and structure your app.</p></aria-navigation-menu-link>
                  <aria-navigation-menu-link href="/docs/primitives/typography" class="relative flex w-full min-w-0 flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover sm:min-w-[228px] ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Typography</div><p class="text-sm leading-5 text-muted-foreground">Styles for headings, paragraphs, lists, etc.</p></aria-navigation-menu-link>
                </div>
              </div>
            </aria-navigation-menu-content>
          </aria-navigation-menu-item>
          <aria-navigation-menu-item value="components">
            <aria-navigation-menu-trigger class="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium leading-5 text-foreground hover:bg-accent-hover focus-visible:bg-accent-hover data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground outline-none ariaui-web-navigation-menu-trigger">Components <svg class="ml-1 size-3 shrink-0 text-current group-data-[state=open]:rotate-180 ariaui-web-navigation-menu-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd"></path></svg></aria-navigation-menu-trigger>
            <aria-navigation-menu-content class="z-50 overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-sm w-[512px] box-border ariaui-web-navigation-menu-content ariaui-web-navigation-menu-components-panel">
              <div class="flex w-full min-w-0 gap-2 ariaui-web-navigation-menu-grid">
                <div class="flex min-w-0 flex-1 flex-col gap-2 ariaui-web-navigation-menu-grid-column">
                  <aria-navigation-menu-link href="/docs/primitives/alert-dialog" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Alert Dialog</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">A modal dialog that interrupts the user with important content and expects a response.</p></aria-navigation-menu-link>
                  <aria-navigation-menu-link href="/docs/primitives/hover-card" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Hover Card</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">For sighted users to preview content available behind a link.</p></aria-navigation-menu-link>
                  <aria-navigation-menu-link href="/docs/primitives/progress" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Progress</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">Displays an indicator showing the completion progress of a task, typically...</p></aria-navigation-menu-link>
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-2 ariaui-web-navigation-menu-grid-column">
                  <aria-navigation-menu-link href="/docs/primitives/scroll-area" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Scroll-area</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">Visually or semantically separates content.</p></aria-navigation-menu-link>
                  <aria-navigation-menu-link href="/docs/primitives/tabs" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Tabs</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">A set of layered sections of content that are displayed one at a time.</p></aria-navigation-menu-link>
                  <aria-navigation-menu-link href="/docs/primitives/tooltip" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Tooltip</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">A popup that displays information related to an element when it receives focus.</p></aria-navigation-menu-link>
                </div>
              </div>
            </aria-navigation-menu-content>
          </aria-navigation-menu-item>
          <aria-navigation-menu-item>
            <aria-navigation-menu-link href="/docs" class="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium leading-5 text-foreground hover:bg-accent-hover focus-visible:bg-accent-hover outline-none no-underline ariaui-web-navigation-menu-trigger">Documentation</aria-navigation-menu-link>
          </aria-navigation-menu-item>
        </aria-navigation-menu-list>
      </aria-navigation-menu>
    </div>
  </div>
</div>

```html
<aria-navigation-menu>
  <aria-navigation-menu-list aria-label="Main navigation">
    <aria-navigation-menu-item value="getting-started">
      <aria-navigation-menu-trigger>Getting Started</aria-navigation-menu-trigger>
      <aria-navigation-menu-content>
        <aria-navigation-menu-link href="/">Aria UI</aria-navigation-menu-link>
        <aria-navigation-menu-link href="/docs">Introduction</aria-navigation-menu-link>
        <aria-navigation-menu-link href="/docs/installation">Installation</aria-navigation-menu-link>
      </aria-navigation-menu-content>
    </aria-navigation-menu-item>
    <aria-navigation-menu-item value="components">
      <aria-navigation-menu-trigger>Components</aria-navigation-menu-trigger>
      <aria-navigation-menu-content>
        <aria-navigation-menu-link href="/docs/primitives/alert-dialog">Alert Dialog</aria-navigation-menu-link>
        <aria-navigation-menu-link href="/docs/primitives/hover-card">Hover Card</aria-navigation-menu-link>
      </aria-navigation-menu-content>
    </aria-navigation-menu-item>
    <aria-navigation-menu-item>
      <aria-navigation-menu-link href="/docs">Documentation</aria-navigation-menu-link>
    </aria-navigation-menu-item>
  </aria-navigation-menu-list>
</aria-navigation-menu>
```

### Framer Motion

The package remains framework-free. This docs example keeps menu surfaces mounted with `force-mount`, slots surface attributes onto a motion host with `native-composition`, and uses `framer-motion/dom` only in the documentation runtime.

<div class="ariaui-web-preview flex w-full justify-center overflow-visible bg-background px-4 py-14 sm:px-12" data-component="navigation-menu" data-example-variant="framer-motion">
  <div class="flex flex-col items-center overflow-x-auto rounded-xl border border-border bg-background shadow-sm ariaui-web-navigation-menu-showcase">
    <div class="flex flex-wrap items-center justify-center gap-1 ariaui-web-navigation-menu-row">
      <aria-navigation-menu class="w-full ariaui-web-navigation-menu-root" data-navigation-menu-motion>
        <aria-navigation-menu-list aria-label="Main navigation" class="flex list-none items-center gap-1 ariaui-web-navigation-menu-list">
          <aria-navigation-menu-item value="getting-started">
            <aria-navigation-menu-trigger class="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium leading-5 text-foreground hover:bg-accent-hover focus-visible:bg-accent-hover data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground outline-none ariaui-web-navigation-menu-trigger">Getting Started <svg class="ml-1 size-3 shrink-0 text-current group-data-[state=open]:rotate-180 ariaui-web-navigation-menu-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd"></path></svg></aria-navigation-menu-trigger>
            <aria-navigation-menu-content force-mount native-composition class="z-50 overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-sm w-[min(100vw-2rem,512px)] min-w-0 max-w-[512px] ariaui-web-navigation-menu-content ariaui-web-navigation-menu-getting-started-panel">
              <div class="ariaui-web-navigation-menu-motion-content" data-navigation-menu-motion-content>
                <div class="flex min-h-0 min-w-0 flex-col gap-4 sm:min-h-[254px] sm:flex-row sm:items-stretch sm:gap-2 ariaui-web-navigation-menu-getting-started-layout">
                  <aria-navigation-menu-link href="/" class="relative flex h-full w-full flex-col justify-end gap-1 overflow-hidden rounded-sm border border-border/40 bg-muted bg-gradient-to-b from-background/40 to-muted p-6 text-left text-popover-foreground no-underline hover:from-background/55 hover:to-muted min-h-[160px] shrink-0 sm:min-h-0 sm:h-auto sm:w-[210px] sm:self-stretch ariaui-web-navigation-menu-hero"><div class="pb-2 pt-4 text-lg font-medium leading-7 text-popover-foreground ariaui-web-navigation-menu-hero-title">Aria UI</div><p class="w-full text-sm leading-5 text-muted-foreground ariaui-web-navigation-menu-description">Accessible headless components composed with Tailwind CSS.</p></aria-navigation-menu-link>
                  <div class="flex min-w-0 flex-1 flex-col gap-2 ariaui-web-navigation-menu-link-stack"><aria-navigation-menu-link href="/docs" class="relative flex w-full min-w-0 flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover sm:min-w-[228px] ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Introduction</div><p class="text-sm leading-5 text-muted-foreground">Re-usable components built using Radix UI and Tailwind CSS.</p></aria-navigation-menu-link><aria-navigation-menu-link href="/docs/installation" class="relative flex w-full min-w-0 flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover sm:min-w-[228px] ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Installation</div><p class="text-sm leading-5 text-muted-foreground">How to install dependencies and structure your app.</p></aria-navigation-menu-link><aria-navigation-menu-link href="/docs/primitives/typography" class="relative flex w-full min-w-0 flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover sm:min-w-[228px] ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Typography</div><p class="text-sm leading-5 text-muted-foreground">Styles for headings, paragraphs, lists, etc.</p></aria-navigation-menu-link></div>
                </div>
              </div>
            </aria-navigation-menu-content>
          </aria-navigation-menu-item>
          <aria-navigation-menu-item value="components">
            <aria-navigation-menu-trigger class="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium leading-5 text-foreground hover:bg-accent-hover focus-visible:bg-accent-hover data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground outline-none ariaui-web-navigation-menu-trigger">Components <svg class="ml-1 size-3 shrink-0 text-current group-data-[state=open]:rotate-180 ariaui-web-navigation-menu-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd"></path></svg></aria-navigation-menu-trigger>
            <aria-navigation-menu-content force-mount native-composition class="z-50 overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-sm w-[512px] box-border ariaui-web-navigation-menu-content ariaui-web-navigation-menu-components-panel">
              <div class="ariaui-web-navigation-menu-motion-content" data-navigation-menu-motion-content>
                <div class="flex w-full min-w-0 gap-2 ariaui-web-navigation-menu-grid"><div class="flex min-w-0 flex-1 flex-col gap-2 ariaui-web-navigation-menu-grid-column"><aria-navigation-menu-link href="/docs/primitives/alert-dialog" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Alert Dialog</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">A modal dialog that interrupts the user with important content and expects a response.</p></aria-navigation-menu-link><aria-navigation-menu-link href="/docs/primitives/hover-card" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Hover Card</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">For sighted users to preview content available behind a link.</p></aria-navigation-menu-link><aria-navigation-menu-link href="/docs/primitives/progress" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Progress</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">Displays an indicator showing the completion progress of a task, typically...</p></aria-navigation-menu-link></div><div class="flex min-w-0 flex-1 flex-col gap-2 ariaui-web-navigation-menu-grid-column"><aria-navigation-menu-link href="/docs/primitives/scroll-area" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Scroll-area</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">Visually or semantically separates content.</p></aria-navigation-menu-link><aria-navigation-menu-link href="/docs/primitives/tabs" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Tabs</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">A set of layered sections of content that are displayed one at a time.</p></aria-navigation-menu-link><aria-navigation-menu-link href="/docs/primitives/tooltip" class="relative flex w-full flex-col gap-1 rounded-sm p-2 text-left hover:bg-accent-hover data-[highlighted]:bg-accent-hover focus-visible:bg-accent-hover ariaui-web-navigation-menu-list-item"><div class="text-sm font-medium leading-5 text-popover-foreground">Tooltip</div><p class="min-h-[60px] text-sm leading-5 text-muted-foreground">A popup that displays information related to an element when it receives focus.</p></aria-navigation-menu-link></div></div>
              </div>
            </aria-navigation-menu-content>
          </aria-navigation-menu-item>
          <aria-navigation-menu-item><aria-navigation-menu-link href="/docs" class="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium leading-5 text-foreground hover:bg-accent-hover focus-visible:bg-accent-hover outline-none no-underline ariaui-web-navigation-menu-trigger">Documentation</aria-navigation-menu-link></aria-navigation-menu-item>
        </aria-navigation-menu-list>
      </aria-navigation-menu>
    </div>
  </div>
</div>

```html
<aria-navigation-menu data-navigation-menu-motion>
  <aria-navigation-menu-list aria-label="Main navigation">
    <aria-navigation-menu-item value="components">
      <aria-navigation-menu-trigger>Components</aria-navigation-menu-trigger>
      <aria-navigation-menu-content force-mount native-composition>
        <div data-navigation-menu-motion-content>
          <aria-navigation-menu-link href="/docs/primitives/alert-dialog">Alert Dialog</aria-navigation-menu-link>
          <aria-navigation-menu-link href="/docs/primitives/hover-card">Hover Card</aria-navigation-menu-link>
        </div>
      </aria-navigation-menu-content>
    </aria-navigation-menu-item>
  </aria-navigation-menu-list>
</aria-navigation-menu>
```

## Anatomy

```html
<aria-navigation-menu>
  <aria-navigation-menu-list>
    <aria-navigation-menu-item>
      <aria-navigation-menu-trigger />
      <aria-navigation-menu-content>
        <aria-navigation-menu-link />
        <aria-navigation-menu-sub>
          <aria-navigation-menu-sub-trigger />
          <aria-navigation-menu-sub-content />
        </aria-navigation-menu-sub>
      </aria-navigation-menu-content>
    </aria-navigation-menu-item>
  </aria-navigation-menu-list>
</aria-navigation-menu>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-navigation-menu` | `navigation` |
| List | `aria-navigation-menu-list` | `menubar` |
| Item | `aria-navigation-menu-item` | none |
| Trigger | `aria-navigation-menu-trigger` | `menuitem` |
| Content | `aria-navigation-menu-content` | `menu` |
| Link | `aria-navigation-menu-link` | `link` |
| Sub | `aria-navigation-menu-sub` | none |
| SubTrigger | `aria-navigation-menu-sub-trigger` | `menuitem` |
| SubContent | `aria-navigation-menu-sub-content` | `menu` |
| Submenu | `aria-navigation-menu-submenu` | none |

## API Reference

The package-level native contract lives in `packages/navigation-menu/readme.md`.

### Root

Navigation landmark and state container for the active top-level item. It exposes `value`, `open`, `data-open-mode`, and bubbling `valuechange` / `openchange` events.

### List

Menubar container. Top-level `Trigger` and top-level `Link` elements participate in arrow-key and typeahead navigation.

### Item

Structural wrapper for a top-level trigger/content pair or a top-level link. Use `value` to provide a stable active item key.

### Trigger

Menu item trigger with `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `data-state`, and `data-ariaui-navigation-menu-value`.

### Content

Floating `role="menu"` panel anchored to its trigger. Supports `force-mount` and `native-composition` for docs-only motion hosts.

### Link

Navigation target. Inside `Content` and `SubContent`, it receives menuitem semantics and managed focus. A top-level `Link` participates in menubar navigation.

### SubTrigger

Nested menu trigger with `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, and `data-state`.

### SubContent

Floating nested `role="menu"` panel anchored to its `SubTrigger`.

## Keyboard

| Key | Action |
| --- | --- |
| `ArrowLeft` / `ArrowRight` | Move focus between top-level triggers and links, respecting `dir="rtl"`. |
| `Enter`, `Space`, `ArrowDown` | Open the focused trigger and focus the first content item. |
| `ArrowUp` | Open the focused trigger and focus the last content item. |
| `ArrowDown` / `ArrowUp` | Move through items in an open menu. |
| `Home` / `End` | Focus the first or last item in the current menubar or menu. |
| Printable letters and digits | Move focus using typeahead. |
| `Escape` | Close the open menu and restore top-level trigger focus. |

## Accessibility

- Root exposes a semantic navigation landmark.
- List exposes `role="menubar"` and Item wrappers use `role="none"` in context.
- Trigger and SubTrigger expose `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Content and SubContent expose `role="menu"` and stable IDs for trigger linkage.
- Links inside menus expose `role="menuitem"` and participate in managed focus.
- Pointer hover opens without stealing DOM focus, while click pins the active panel open until dismissal or context switch.
