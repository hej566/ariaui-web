# Context Menu

A headless, accessible context menu triggered by right-click with keyboard navigation, submenus, and grouped items.

## Features

- Opens from the native `contextmenu` event on a designated area.
- Positions the menu at the pointer location and keeps submenus anchored to their trigger.
- Supports item selection, disabled items, grouped labels, separators, and nested submenus.
- Handles Arrow keys, Home/End, typeahead, Enter, Space, Escape, and outside click dismissal.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/context-menu
```

```bash [pnpm]
pnpm add @ariaui-web/context-menu
```

```bash [yarn]
yarn add @ariaui-web/context-menu
```

:::

```ts
import { defineContextMenuElements } from "@ariaui-web/context-menu";

defineContextMenuElements();
```

## Examples

### Default

<div class="ariaui-web-preview flex w-full items-center justify-center" data-component="context-menu" data-example-variant="default">
  <div id="context-menu-default-area" class="ariaui-web-context-menu-area flex h-[300px] w-[500px] items-center justify-center rounded-lg border-2 border-dashed border-border text-sm font-medium text-muted-foreground">Right click anywhere in this area</div>
  <aria-context-menu area="context-menu-default-area" class="ariaui-web-context-menu-root" data-example-part="Root">
    <aria-context-menu-content class="ariaui-web-context-menu-content z-50 w-64 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md" data-example-part="Content" hidden>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="back">Back<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Alt+Left</span></aria-context-menu-item>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="forward" disabled>Forward<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Alt+Right</span></aria-context-menu-item>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="reload">Reload<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Cmd+R</span></aria-context-menu-item>
      <aria-context-menu-sub class="ariaui-web-context-menu-sub" data-example-part="Sub" offset="-4 4">
        <aria-context-menu-sub-trigger class="ariaui-web-context-menu-sub-trigger relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 aria-expanded:bg-accent-hover" data-example-part="SubTrigger">More Tools<svg class="ariaui-web-context-menu-chevron ml-auto size-4 text-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></aria-context-menu-sub-trigger>
        <aria-context-menu-sub-content class="ariaui-web-context-menu-sub-content z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg" data-example-part="SubContent" hidden>
          <aria-context-menu-item class="ariaui-web-context-menu-sub-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="save-as">Save Page As<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Cmd+S</span></aria-context-menu-item>
          <aria-context-menu-item class="ariaui-web-context-menu-sub-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="create-shortcut">Create Shortcut</aria-context-menu-item>
          <aria-context-menu-item class="ariaui-web-context-menu-sub-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="developer-tools">Developer Tools</aria-context-menu-item>
        </aria-context-menu-sub-content>
      </aria-context-menu-sub>
      <aria-context-menu-separator class="ariaui-web-context-menu-separator -mx-1 my-1 h-px bg-border" data-example-part="Separator"></aria-context-menu-separator>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="show-full-urls">Show Full URLs</aria-context-menu-item>
      <aria-context-menu-separator class="ariaui-web-context-menu-separator -mx-1 my-1 h-px bg-border" data-example-part="Separator"></aria-context-menu-separator>
      <aria-context-menu-group class="ariaui-web-context-menu-group" data-example-part="Group">
        <aria-context-menu-label class="ariaui-web-context-menu-label flex h-8 items-center rounded-xs py-1.5 pl-8 pr-2 text-sm font-semibold leading-5 text-foreground" data-example-part="Label">Text size</aria-context-menu-label>
        <aria-context-menu-item class="ariaui-web-context-menu-item ariaui-web-context-menu-radio-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" role="menuitemradio" value="small"><span class="ariaui-web-context-menu-indicator absolute left-2 flex size-3.5 items-center justify-center" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot size-2 rounded-full bg-primary"></span></span>Small</aria-context-menu-item>
        <aria-context-menu-item class="ariaui-web-context-menu-item ariaui-web-context-menu-radio-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" role="menuitemradio" value="comfortable" checked><span class="ariaui-web-context-menu-indicator absolute left-2 flex size-3.5 items-center justify-center" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot size-2 rounded-full bg-primary"></span></span>Comfortable</aria-context-menu-item>
        <aria-context-menu-item class="ariaui-web-context-menu-item ariaui-web-context-menu-radio-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" role="menuitemradio" value="large"><span class="ariaui-web-context-menu-indicator absolute left-2 flex size-3.5 items-center justify-center" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot size-2 rounded-full bg-primary"></span></span>Large</aria-context-menu-item>
      </aria-context-menu-group>
      <aria-context-menu-separator class="ariaui-web-context-menu-separator -mx-1 my-1 h-px bg-border" data-example-part="Separator"></aria-context-menu-separator>
      <aria-context-menu-group class="ariaui-web-context-menu-group" data-example-part="Group">
        <aria-context-menu-label class="ariaui-web-context-menu-label flex h-8 items-center rounded-xs py-1.5 pl-8 pr-2 text-sm font-semibold leading-5 text-foreground" data-example-part="Label">People</aria-context-menu-label>
        <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="pedro-duarte">Pedro Duarte</aria-context-menu-item>
        <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="colm-tuite">Colm Tuite</aria-context-menu-item>
      </aria-context-menu-group>
    </aria-context-menu-content>
  </aria-context-menu>
</div>

```html
<div id="context-menu-default-area" class="ariaui-web-context-menu-area flex h-[300px] w-[500px] items-center justify-center rounded-lg border-2 border-dashed border-border text-sm font-medium text-muted-foreground">Right click anywhere in this area</div>
<aria-context-menu area="context-menu-default-area">
  <aria-context-menu-content class="z-50 w-64 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
    <aria-context-menu-item value="back">Back</aria-context-menu-item>
    <aria-context-menu-sub>
      <aria-context-menu-sub-trigger>More Tools</aria-context-menu-sub-trigger>
      <aria-context-menu-sub-content>
        <aria-context-menu-item value="save-as">Save Page As</aria-context-menu-item>
      </aria-context-menu-sub-content>
    </aria-context-menu-sub>
    <aria-context-menu-group>
      <aria-context-menu-label>Text size</aria-context-menu-label>
      <aria-context-menu-item role="menuitemradio" value="small">
        <span class="ariaui-web-context-menu-indicator" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot"></span></span>
        Small
      </aria-context-menu-item>
      <aria-context-menu-item role="menuitemradio" value="comfortable" checked>
        <span class="ariaui-web-context-menu-indicator" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot"></span></span>
        Comfortable
      </aria-context-menu-item>
    </aria-context-menu-group>
  </aria-context-menu-content>
</aria-context-menu>
```

### Framer Motion

<div class="ariaui-web-preview flex w-full items-center justify-center" data-component="context-menu" data-example-variant="framer-motion">
  <div id="context-menu-motion-area" class="ariaui-web-context-menu-area flex h-[300px] w-[500px] items-center justify-center rounded-lg border-2 border-dashed border-border text-sm font-medium text-muted-foreground">Right click anywhere in this area</div>
  <aria-context-menu area="context-menu-motion-area" class="ariaui-web-context-menu-root" data-example-part="Root">
    <aria-context-menu-content class="ariaui-web-context-menu-content ariaui-web-context-menu-motion-content z-50 w-64 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md" data-example-part="Content" hidden>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="back">Back<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Alt+Left</span></aria-context-menu-item>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="forward" disabled>Forward<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Alt+Right</span></aria-context-menu-item>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="reload">Reload<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Cmd+R</span></aria-context-menu-item>
      <aria-context-menu-sub class="ariaui-web-context-menu-sub" data-example-part="Sub" offset="-4 4">
        <aria-context-menu-sub-trigger class="ariaui-web-context-menu-sub-trigger relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 aria-expanded:bg-accent-hover" data-example-part="SubTrigger">More Tools<svg class="ariaui-web-context-menu-chevron ml-auto size-4 text-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></aria-context-menu-sub-trigger>
        <aria-context-menu-sub-content class="ariaui-web-context-menu-sub-content z-50 w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg" data-example-part="SubContent" hidden>
          <aria-context-menu-item class="ariaui-web-context-menu-sub-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="save-as">Save Page As<span class="ariaui-web-context-menu-shortcut ml-auto pl-4 text-xs leading-4 text-muted-foreground">Cmd+S</span></aria-context-menu-item>
          <aria-context-menu-item class="ariaui-web-context-menu-sub-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="create-shortcut">Create Shortcut</aria-context-menu-item>
          <aria-context-menu-item class="ariaui-web-context-menu-sub-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="developer-tools">Developer Tools</aria-context-menu-item>
        </aria-context-menu-sub-content>
      </aria-context-menu-sub>
      <aria-context-menu-separator class="ariaui-web-context-menu-separator -mx-1 my-1 h-px bg-border" data-example-part="Separator"></aria-context-menu-separator>
      <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="show-full-urls">Show Full URLs</aria-context-menu-item>
      <aria-context-menu-separator class="ariaui-web-context-menu-separator -mx-1 my-1 h-px bg-border" data-example-part="Separator"></aria-context-menu-separator>
      <aria-context-menu-group class="ariaui-web-context-menu-group" data-example-part="Group">
        <aria-context-menu-label class="ariaui-web-context-menu-label flex h-8 items-center rounded-xs py-1.5 pl-8 pr-2 text-sm font-semibold leading-5 text-foreground" data-example-part="Label">Text size</aria-context-menu-label>
        <aria-context-menu-item class="ariaui-web-context-menu-item ariaui-web-context-menu-radio-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" role="menuitemradio" value="small"><span class="ariaui-web-context-menu-indicator absolute left-2 flex size-3.5 items-center justify-center" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot size-2 rounded-full bg-primary"></span></span>Small</aria-context-menu-item>
        <aria-context-menu-item class="ariaui-web-context-menu-item ariaui-web-context-menu-radio-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" role="menuitemradio" value="comfortable" checked><span class="ariaui-web-context-menu-indicator absolute left-2 flex size-3.5 items-center justify-center" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot size-2 rounded-full bg-primary"></span></span>Comfortable</aria-context-menu-item>
        <aria-context-menu-item class="ariaui-web-context-menu-item ariaui-web-context-menu-radio-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" role="menuitemradio" value="large"><span class="ariaui-web-context-menu-indicator absolute left-2 flex size-3.5 items-center justify-center" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot size-2 rounded-full bg-primary"></span></span>Large</aria-context-menu-item>
      </aria-context-menu-group>
      <aria-context-menu-separator class="ariaui-web-context-menu-separator -mx-1 my-1 h-px bg-border" data-example-part="Separator"></aria-context-menu-separator>
      <aria-context-menu-group class="ariaui-web-context-menu-group" data-example-part="Group">
        <aria-context-menu-label class="ariaui-web-context-menu-label flex h-8 items-center rounded-xs py-1.5 pl-8 pr-2 text-sm font-semibold leading-5 text-foreground" data-example-part="Label">People</aria-context-menu-label>
        <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="pedro-duarte">Pedro Duarte</aria-context-menu-item>
        <aria-context-menu-item class="ariaui-web-context-menu-item relative flex h-8 w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm leading-5 text-popover-foreground data-[active=true]:bg-accent-hover hover:bg-accent-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-example-part="Item" value="colm-tuite">Colm Tuite</aria-context-menu-item>
      </aria-context-menu-group>
    </aria-context-menu-content>
  </aria-context-menu>
</div>

```html
<aria-context-menu-content class="ariaui-web-context-menu-motion-content z-50 w-64 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
  <aria-context-menu-item value="reload">Reload</aria-context-menu-item>
  <aria-context-menu-sub>
    <aria-context-menu-sub-trigger>More Tools</aria-context-menu-sub-trigger>
    <aria-context-menu-sub-content>
      <aria-context-menu-item value="save-as">Save Page As</aria-context-menu-item>
    </aria-context-menu-sub-content>
  </aria-context-menu-sub>
  <aria-context-menu-item role="menuitemradio" value="comfortable" checked>
    <span class="ariaui-web-context-menu-indicator" aria-hidden="true"><span class="ariaui-web-context-menu-radio-dot"></span></span>
    Comfortable
  </aria-context-menu-item>
</aria-context-menu-content>
```

## Anatomy

```html
<aria-context-menu>
  <aria-context-menu-content>
    <aria-context-menu-item></aria-context-menu-item>
    <aria-context-menu-sub>
      <aria-context-menu-sub-trigger></aria-context-menu-sub-trigger>
      <aria-context-menu-sub-content>
        <aria-context-menu-item></aria-context-menu-item>
      </aria-context-menu-sub-content>
    </aria-context-menu-sub>
    <aria-context-menu-group>
      <aria-context-menu-label></aria-context-menu-label>
      <aria-context-menu-item></aria-context-menu-item>
    </aria-context-menu-group>
    <aria-context-menu-separator></aria-context-menu-separator>
  </aria-context-menu-content>
</aria-context-menu>
```

## API Reference

### Root

- Element: `aria-context-menu`
- Use `area`, `area-id`, or `for` to point at the element that should open the menu on right-click.
- Reflects `open`, `default-open`, `value`, `data-state`, and dispatches `openchange` and `valuechange`.

### Content

- Element: `aria-context-menu-content`
- Defaults to `role="menu"`, `tabindex="0"`, and `data-context-menu-content`.
- Tracks active items with `aria-activedescendant` and `data-focused`.

### Item

- Element: `aria-context-menu-item`
- Defaults to `role="menuitem"`.
- Use `value` for the emitted selection value and `disabled` for non-interactive items.

### Sub

- Element: `aria-context-menu-sub`
- Owns open state for a nested submenu and accepts `open`, `default-open`, and `offset`.

### SubTrigger

- Element: `aria-context-menu-sub-trigger`
- Defaults to `role="menuitem"`, `aria-haspopup="menu"`, `aria-expanded="false"`, and `tabindex="-1"`.

### SubContent

- Element: `aria-context-menu-sub-content`
- Defaults to `role="menu"`, `tabindex="0"`, and `data-context-menu-content`.
- Uses `aria-labelledby` to connect back to its trigger.

### Group

- Element: `aria-context-menu-group`
- Defaults to `role="group"` and receives `aria-labelledby` when it contains a label.

### Label

- Element: `aria-context-menu-label`
- Provides a visible label for the nearest group.

### Separator

- Element: `aria-context-menu-separator`
- Defaults to `role="separator"`.

## Keyboard

| Key | Behavior |
| --- | --- |
| ArrowDown | Moves to the next enabled item. |
| ArrowUp | Moves to the previous enabled item. |
| ArrowRight | Opens the active submenu. |
| ArrowLeft | Closes a submenu and returns focus to its trigger. |
| Home | Moves to the first enabled item. |
| End | Moves to the last enabled item. |
| Enter / Space | Activates the active item or opens the active submenu trigger. |
| Escape / Tab | Closes the menu. |

## Accessibility

- `aria-context-menu-content` and `aria-context-menu-sub-content` render as `role="menu"` containers.
- `aria-context-menu-item` and `aria-context-menu-sub-trigger` render as `role="menuitem"`.
- `aria-context-menu-sub-trigger` announces submenu availability with `aria-haspopup="menu"` and live `aria-expanded` state.
- Disabled items expose `aria-disabled="true"` and are skipped by keyboard navigation.
- Group labels are connected with `aria-labelledby`.
