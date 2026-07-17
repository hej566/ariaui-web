# Menubar

An accessible horizontal menubar with menus, submenus, and selection items.

## Features

- **Horizontal menus**
- **Checkbox and radio items**
- **Nested submenus**
- **Typeahead**
- **Managed focus**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/menubar
```

```bash [pnpm]
pnpm add @ariaui-web/menubar
```

```bash [yarn]
yarn add @ariaui-web/menubar
```

:::

Register the custom elements once before rendering a menubar.

```ts
import { defineMenubarElements } from "@ariaui-web/menubar";

defineMenubarElements();
```

## Examples

### Menubar

<div class="ariaui-web-preview flex w-full justify-center overflow-visible bg-background px-4 py-14 sm:px-12" data-component="menubar" data-example-variant="default">
  <aria-menubar loop data-example-part="Root" class="flex h-9 w-[245px] items-center gap-1 rounded-md border border-border bg-background p-1 text-foreground shadow-xs">
    <aria-menubar-menu>
      <aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">File</aria-menubar-trigger>
      <aria-menubar-content loop data-example-part="Content" class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ">
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">New Tab <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘T</span></aria-menubar-item>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">New Window <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘N</span></aria-menubar-item>
        <aria-menubar-item disabled class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">New Incognito Window</aria-menubar-item>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Menubar Item Text <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘P</span></aria-menubar-item>
        <aria-menubar-sub>
          <aria-menubar-sub-trigger class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Share <span class="ml-auto size-4 text-icon">›</span></aria-menubar-sub-trigger>
          <aria-menubar-sub-content loop class="z-50 w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ">
            <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Email link</aria-menubar-item>
            <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Messages</aria-menubar-item>
            <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Notes</aria-menubar-item>
          </aria-menubar-sub-content>
        </aria-menubar-sub>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Menubar Item Text <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘P</span></aria-menubar-item>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Print <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘P</span></aria-menubar-item>
      </aria-menubar-content>
    </aria-menubar-menu>
    <aria-menubar-menu>
      <aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">Edit</aria-menubar-trigger>
      <aria-menubar-content loop class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ">
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Undo <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘Z</span></aria-menubar-item>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Redo <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⇧⌘Z</span></aria-menubar-item>
        <aria-menubar-separator class="my-1 h-px bg-border/20"></aria-menubar-separator>
        <aria-menubar-group data-example-part="Group">
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Cut <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘X</span></aria-menubar-item>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Copy <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘C</span></aria-menubar-item>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Paste <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘V</span></aria-menubar-item>
        </aria-menubar-group>
      </aria-menubar-content>
    </aria-menubar-menu>
    <aria-menubar-menu>
      <aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">View</aria-menubar-trigger>
      <aria-menubar-content loop class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ">
        <aria-menubar-checkbox-item checked data-example-part="CheckboxItem" class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="flex size-4 items-center justify-center text-icon">✓</span></aria-menubar-item-indicator></span>Always Show Bookmarks</aria-menubar-checkbox-item>
        <aria-menubar-checkbox-item class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="flex size-4 items-center justify-center text-icon">✓</span></aria-menubar-item-indicator></span>Always Show Full URLs</aria-menubar-checkbox-item>
        <aria-menubar-separator class="my-1 h-px bg-border/20"></aria-menubar-separator>
        <aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Reload <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘R</span></aria-menubar-item>
      </aria-menubar-content>
    </aria-menubar-menu>
    <aria-menubar-menu>
      <aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">Profiles</aria-menubar-trigger>
      <aria-menubar-content loop class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ">
        <aria-menubar-radio-group default-value="pedro">
          <aria-menubar-label class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">People</aria-menubar-label>
          <aria-menubar-radio-item value="andy" class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="size-2 rounded-full bg-primary"></span></aria-menubar-item-indicator></span>Andy</aria-menubar-radio-item>
          <aria-menubar-radio-item value="pedro" class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="size-2 rounded-full bg-primary"></span></aria-menubar-item-indicator></span>Pedro</aria-menubar-radio-item>
        </aria-menubar-radio-group>
      </aria-menubar-content>
    </aria-menubar-menu>
  </aria-menubar>
</div>

```html
<aria-menubar loop class="flex h-9 w-[245px] items-center gap-1 rounded-md border border-border bg-background p-1 text-foreground shadow-xs">
  <aria-menubar-menu>
    <aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground hover:bg-accent-hover">File</aria-menubar-trigger>
    <aria-menubar-content loop class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
      <aria-menubar-item>New Tab <span>⌘T</span></aria-menubar-item>
      <aria-menubar-sub>
        <aria-menubar-sub-trigger>Share <span>›</span></aria-menubar-sub-trigger>
        <aria-menubar-sub-content loop>
          <aria-menubar-item>Email link</aria-menubar-item>
          <aria-menubar-item>Messages</aria-menubar-item>
        </aria-menubar-sub-content>
      </aria-menubar-sub>
    </aria-menubar-content>
  </aria-menubar-menu>
  <!-- Add Edit, View checkbox items, and Profiles radio items as shown above. -->
</aria-menubar>
```

### Framer Motion

The package remains framework-free. This example uses `framer-motion/dom` only in the documentation runtime and animates each native-composition menu surface.

<div class="ariaui-web-preview flex w-full justify-center overflow-visible bg-background px-4 py-14 sm:px-12" data-component="menubar" data-example-variant="framer-motion">
  <aria-menubar loop class="flex h-9 w-[245px] items-center gap-1 rounded-md border border-border bg-background p-1 text-foreground shadow-xs">
    <aria-menubar-menu>
      <aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">File</aria-menubar-trigger>
      <aria-menubar-content loop native-composition class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md "><div data-menubar-motion-content><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">New Tab <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘T</span></aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">New Window <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘N</span></aria-menubar-item><aria-menubar-item disabled class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">New Incognito Window</aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Menubar Item Text <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘P</span></aria-menubar-item><aria-menubar-sub><aria-menubar-sub-trigger class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Share <span class="ml-auto size-4 text-icon">›</span></aria-menubar-sub-trigger><aria-menubar-sub-content loop native-composition class="z-50 w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md "><div data-menubar-motion-content><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Email link</aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Messages</aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Notes</aria-menubar-item></div></aria-menubar-sub-content></aria-menubar-sub><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Menubar Item Text <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘P</span></aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Print <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘P</span></aria-menubar-item></div></aria-menubar-content>
    </aria-menubar-menu>
    <aria-menubar-menu><aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">Edit</aria-menubar-trigger><aria-menubar-content loop native-composition class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md "><div data-menubar-motion-content><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Undo <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘Z</span></aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Redo <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⇧⌘Z</span></aria-menubar-item><aria-menubar-separator class="my-1 h-px bg-border/20"></aria-menubar-separator><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Cut <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘X</span></aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Copy <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘C</span></aria-menubar-item><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Paste <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘V</span></aria-menubar-item></div></aria-menubar-content></aria-menubar-menu>
    <aria-menubar-menu><aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">View</aria-menubar-trigger><aria-menubar-content loop native-composition class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md "><div data-menubar-motion-content><aria-menubar-checkbox-item checked class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="flex size-4 items-center justify-center text-icon">✓</span></aria-menubar-item-indicator></span>Always Show Bookmarks</aria-menubar-checkbox-item><aria-menubar-checkbox-item class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="flex size-4 items-center justify-center text-icon">✓</span></aria-menubar-item-indicator></span>Always Show Full URLs</aria-menubar-checkbox-item><aria-menubar-separator class="my-1 h-px bg-border/20"></aria-menubar-separator><aria-menubar-item class="relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[state=open]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Reload <span class="ml-auto pl-4 text-xs leading-4 text-muted-foreground">⌘R</span></aria-menubar-item></div></aria-menubar-content></aria-menubar-menu>
    <aria-menubar-menu><aria-menubar-trigger class="flex h-7 items-center justify-center rounded-xs px-3 py-1 text-sm font-normal leading-5 text-foreground  hover:bg-accent-hover hover:text-accent-foreground focus:bg-accent-hover focus:text-accent-foreground data-[state=open]:bg-accent-hover data-[state=open]:text-accent-foreground">Profiles</aria-menubar-trigger><aria-menubar-content loop native-composition class="z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md "><div data-menubar-motion-content><aria-menubar-radio-group default-value="pedro"><aria-menubar-label class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">People</aria-menubar-label><aria-menubar-radio-item value="andy" class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="size-2 rounded-full bg-primary"></span></aria-menubar-item-indicator></span>Andy</aria-menubar-radio-item><aria-menubar-radio-item value="pedro" class="relative text-left flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground  hover:bg-accent-hover data-[highlighted]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50"><span class="absolute left-2 flex size-4 items-center justify-center"><aria-menubar-item-indicator><span class="size-2 rounded-full bg-primary"></span></aria-menubar-item-indicator></span>Pedro</aria-menubar-radio-item></aria-menubar-radio-group></div></aria-menubar-content></aria-menubar-menu>
  </aria-menubar>
</div>

```html
<aria-menubar>
  <aria-menubar-menu>
    <aria-menubar-trigger>File</aria-menubar-trigger>
    <aria-menubar-content native-composition>
      <div data-menubar-motion-content>
        <aria-menubar-item>New Tab</aria-menubar-item>
      </div>
    </aria-menubar-content>
  </aria-menubar-menu>
</aria-menubar>

<script type="module">
  import { animate } from "framer-motion/dom";
  animate(document.querySelector("[data-menubar-motion-content]"), {
    opacity: [0, 1], y: [8, 0], scale: [0.98, 1]
  }, { duration: 0.18, ease: "easeOut" });
</script>
```

## Anatomy

```html
<aria-menubar>
  <aria-menubar-menu>
    <aria-menubar-trigger />
    <aria-menubar-content>
      <aria-menubar-item />
      <aria-menubar-checkbox-item><aria-menubar-item-indicator /></aria-menubar-checkbox-item>
      <aria-menubar-radio-group><aria-menubar-radio-item /></aria-menubar-radio-group>
      <aria-menubar-sub><aria-menubar-sub-trigger /><aria-menubar-sub-content /></aria-menubar-sub>
    </aria-menubar-content>
  </aria-menubar-menu>
</aria-menubar>
```

## API Reference

| Part | Custom element | Purpose and key attributes |
| --- | --- | --- |
| Root | `aria-menubar` | Horizontal container; `value`, `default-value`, `loop`, `valuechange` |
| Menu | `aria-menubar-menu` | Trigger and panel context; `value` |
| Trigger | `aria-menubar-trigger` | Opens its menu; `disabled`, `aria-expanded`, `aria-controls` |
| Content | `aria-menubar-content` | Floating surface; `loop`, `native-composition`, `data-side`, `data-align` |
| Item | `aria-menubar-item` | Selectable command; `disabled`, `text-value`, `select` |
| CheckboxItem | `aria-menubar-checkbox-item` | Toggleable item; `checked`, `checkedchange` |
| RadioGroup | `aria-menubar-radio-group` | Single-selection group; `value`, `default-value`, `valuechange` |
| RadioItem | `aria-menubar-radio-item` | Radio menu item; `value`, `aria-checked` |
| ItemIndicator | `aria-menubar-item-indicator` | Visible when its checkbox or radio item is checked |
| Group | `aria-menubar-group` | Groups related items |
| Label | `aria-menubar-label` | Non-interactive menu label |
| Separator | `aria-menubar-separator` | Visual and semantic divider |
| Sub | `aria-menubar-sub` | Nested menu state; `open`, `default-open` |
| SubTrigger | `aria-menubar-sub-trigger` | Opens a nested menu |
| SubContent | `aria-menubar-sub-content` | Nested floating menu surface |
| Submenu | `aria-menubar-submenu` | Compatibility alias retained by the package catalog |

## Keyboard

| Keys | Action |
| --- | --- |
| <kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd> | Move focus between menubar triggers. |
| <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>ArrowDown</kbd> | Open the focused menu and focus its first item. |
| <kbd>ArrowUp</kbd> | Open the focused menu and focus its last item. |
| <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd> | Move through enabled items in an open menu. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Focus the first or last item. |
| <kbd>Escape</kbd> | Close the menu and restore trigger focus. |
| Printable characters | Move focus using typeahead. |

## Accessibility

The component implements the [WAI-ARIA Menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/). Root, trigger, content, submenu, checkbox, and radio parts expose the corresponding menubar roles and state. Disabled items expose `aria-disabled="true"`, and focus is managed between triggers and menu items.
