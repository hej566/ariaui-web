# Sidebar

A headless, accessible icon-rail sidebar with controlled and uncontrolled collapse state.

## Features

- Expanded by default with `icon` collapse mode and left-side placement.
- Trigger, rail, keyboard shortcut, stable panel linkage, and native composition support.
- Semantic panel, main content, lists, list items, and buttons.
- Styling metadata for every structural and interactive part.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/sidebar
```

```bash [pnpm]
pnpm add @ariaui-web/sidebar
```

```bash [yarn]
yarn add @ariaui-web/sidebar
```

:::

```ts
import { defineSidebarElements } from "@ariaui-web/sidebar";

defineSidebarElements();
```

## Examples

### Default

<div class="ariaui-web-preview" data-component="sidebar" data-example-variant="default">
  <aria-sidebar class="ariaui-web-sidebar-root group/sidebar mx-auto flex min-h-[420px] w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-sm" data-sidebar-example="default" data-example-part="Root" panel-id="sidebar-default-panel">
    <aria-sidebar-panel class="ariaui-web-sidebar-panel relative flex min-h-[420px] w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground group-data-[state=collapsed]/sidebar:w-14" data-example-part="Panel" aria-label="Project navigation">
      <aria-sidebar-header class="ariaui-web-sidebar-header flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3">
        <span class="ariaui-web-sidebar-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">A</span>
        <span class="ariaui-web-sidebar-select-shell min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden" data-sidebar-collapse-label>
          <aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="workspace" default-value="acme">
            <aria-select-label class="sr-only">Workspace</aria-select-label>
            <aria-select-trigger class="ariaui-web-sidebar-select-trigger" aria-label="Workspace"><span data-select-trigger-label>Acme Analytics</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator"><span></span></aria-select-dropdown-indicator></aria-select-trigger>
            <aria-select-content class="ariaui-web-sidebar-select-content" hidden>
              <aria-select-option class="ariaui-web-sidebar-select-option" value="acme">Acme Analytics<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option>
              <aria-select-option class="ariaui-web-sidebar-select-option" value="design">Design System<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option>
              <aria-select-option class="ariaui-web-sidebar-select-option" value="growth">Growth Team<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option>
            </aria-select-content>
          </aria-select>
        </span>
      </aria-sidebar-header>
      <aria-sidebar-content class="ariaui-web-sidebar-content flex-1 overflow-hidden px-2 py-3">
        <aria-sidebar-group class="ariaui-web-sidebar-group relative space-y-1">
          <aria-sidebar-group-label class="ariaui-web-sidebar-group-label px-2 pb-1 text-xs font-medium text-muted-foreground">Projects</aria-sidebar-group-label>
          <aria-sidebar-group-content>
            <aria-sidebar-menu class="ariaui-web-sidebar-menu flex flex-col gap-1">
              <aria-sidebar-menu-item>
                <aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm" active open data-sidebar-submenu-trigger aria-expanded="true"><span class="ariaui-web-sidebar-icon">H</span><span data-sidebar-collapse-label>Home</span><span class="ariaui-web-sidebar-chevron" data-open></span></aria-sidebar-menu-button>
                <aria-sidebar-menu-sub class="ariaui-web-sidebar-menu-sub ml-5 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-3" data-sidebar-submenu>
                  <aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button flex h-7 items-center rounded-md px-2 text-sm" active>Overview</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item>
                  <aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button flex h-7 items-center rounded-md px-2 text-sm">Reports</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item>
                </aria-sidebar-menu-sub>
              </aria-sidebar-menu-item>
              <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button"><span class="ariaui-web-sidebar-icon">I</span><span data-sidebar-collapse-label>Inbox</span><aria-sidebar-menu-badge class="ariaui-web-sidebar-menu-badge">4</aria-sidebar-menu-badge></aria-sidebar-menu-button></aria-sidebar-menu-item>
              <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button"><span class="ariaui-web-sidebar-icon">S</span><span data-sidebar-collapse-label>Search</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
              <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button"><span class="ariaui-web-sidebar-icon">P</span><span data-sidebar-collapse-label>Settings</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
            </aria-sidebar-menu>
          </aria-sidebar-group-content>
        </aria-sidebar-group>
      </aria-sidebar-content>
      <aria-sidebar-footer class="ariaui-web-sidebar-footer space-y-2 border-t border-sidebar-border p-2"><aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="preference" default-value="notifications"><aria-select-label class="sr-only">Preference</aria-select-label><aria-select-trigger class="ariaui-web-sidebar-select-trigger ariaui-web-sidebar-preference" aria-label="Preference"><span class="ariaui-web-sidebar-icon">P</span><span data-select-trigger-label data-sidebar-collapse-label>Notifications</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator" data-sidebar-collapse-label><span></span></aria-select-dropdown-indicator></aria-select-trigger><aria-select-content class="ariaui-web-sidebar-select-content" hidden><aria-select-option class="ariaui-web-sidebar-select-option" value="notifications">Notifications<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="appearance">Appearance<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="privacy">Privacy<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option></aria-select-content></aria-select></aria-sidebar-footer>
    </aria-sidebar-panel>
    <aria-sidebar-rail class="ariaui-web-sidebar-rail w-1 shrink-0 bg-transparent" data-example-part="Rail"></aria-sidebar-rail>
    <aria-sidebar-inset class="ariaui-web-sidebar-inset flex min-w-0 flex-1 flex-col bg-background">
      <div class="ariaui-web-sidebar-inset-header flex h-14 items-center gap-2 border-b border-border px-4 text-sm font-medium"><aria-sidebar-trigger class="ariaui-web-sidebar-trigger inline-flex h-8 w-8 items-center justify-center rounded-md" data-example-part="Trigger" title="Toggle sidebar">&#9776;</aria-sidebar-trigger><span>Project overview</span></div>
      <div class="ariaui-web-sidebar-inset-body grid flex-1 gap-3 p-4"><div></div><div></div><div></div></div>
    </aria-sidebar-inset>
  </aria-sidebar>
</div>

```html
<aria-sidebar class="group/sidebar mx-auto flex min-h-[420px] w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-sm">
  <aria-sidebar-panel class="relative flex min-h-[420px] w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground group-data-[state=collapsed]/sidebar:w-14">
    <!-- Header, content, menu, submenu, and footer -->
  </aria-sidebar-panel>
  <aria-sidebar-rail class="w-1 shrink-0 bg-transparent"></aria-sidebar-rail>
  <aria-sidebar-inset class="flex min-w-0 flex-1 flex-col bg-background"></aria-sidebar-inset>
</aria-sidebar>
```

### Framer Motion

<div class="ariaui-web-preview" data-component="sidebar" data-example-variant="framer-motion">
  <aria-sidebar class="ariaui-web-sidebar-root group/sidebar mx-auto flex min-h-[420px] w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-sm" data-sidebar-example="motion" panel-id="sidebar-motion-panel">
    <aria-sidebar-panel native-composition aria-label="Animated project navigation"><aside class="ariaui-web-sidebar-panel ariaui-web-sidebar-motion-panel relative flex min-h-[420px] shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <aria-sidebar-header class="ariaui-web-sidebar-header"><span class="ariaui-web-sidebar-brand">A</span><span class="ariaui-web-sidebar-select-shell" data-sidebar-motion-label><aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="workspace" default-value="acme"><aria-select-label class="sr-only">Workspace</aria-select-label><aria-select-trigger class="ariaui-web-sidebar-select-trigger" aria-label="Workspace"><span data-select-trigger-label>Acme Analytics</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator"><span></span></aria-select-dropdown-indicator></aria-select-trigger><aria-select-content class="ariaui-web-sidebar-select-content" hidden><aria-select-option class="ariaui-web-sidebar-select-option" value="acme">Acme Analytics<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="design">Design System<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="growth">Growth Team<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option></aria-select-content></aria-select></span></aria-sidebar-header>
      <aria-sidebar-content class="ariaui-web-sidebar-content"><aria-sidebar-group class="ariaui-web-sidebar-group"><aria-sidebar-group-label class="ariaui-web-sidebar-group-label" data-sidebar-motion-label>Projects</aria-sidebar-group-label><aria-sidebar-group-content><aria-sidebar-menu class="ariaui-web-sidebar-menu">
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button" active open data-sidebar-submenu-trigger aria-expanded="true"><span class="ariaui-web-sidebar-icon">H</span><span data-sidebar-motion-label>Home</span><span class="ariaui-web-sidebar-chevron" data-sidebar-motion-accessory data-open></span></aria-sidebar-menu-button><aria-sidebar-menu-sub class="ariaui-web-sidebar-menu-sub" data-sidebar-submenu><aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button" active>Overview</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button">Reports</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item></aria-sidebar-menu-sub></aria-sidebar-menu-item>
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button"><span class="ariaui-web-sidebar-icon">I</span><span data-sidebar-motion-label>Inbox</span><aria-sidebar-menu-badge class="ariaui-web-sidebar-menu-badge" data-sidebar-motion-accessory>4</aria-sidebar-menu-badge></aria-sidebar-menu-button></aria-sidebar-menu-item>
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button"><span class="ariaui-web-sidebar-icon">S</span><span data-sidebar-motion-label>Search</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button"><span class="ariaui-web-sidebar-icon">P</span><span data-sidebar-motion-label>Settings</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
      </aria-sidebar-menu></aria-sidebar-group-content></aria-sidebar-group></aria-sidebar-content>
      <aria-sidebar-footer class="ariaui-web-sidebar-footer"><aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="preference" default-value="notifications"><aria-select-label class="sr-only">Preference</aria-select-label><aria-select-trigger class="ariaui-web-sidebar-select-trigger ariaui-web-sidebar-preference" aria-label="Preference"><span class="ariaui-web-sidebar-icon">P</span><span data-select-trigger-label data-sidebar-motion-label>Notifications</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator" data-sidebar-motion-accessory><span></span></aria-select-dropdown-indicator></aria-select-trigger><aria-select-content class="ariaui-web-sidebar-select-content" hidden><aria-select-option class="ariaui-web-sidebar-select-option" value="notifications">Notifications<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="appearance">Appearance<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="privacy">Privacy<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option></aria-select-content></aria-select></aria-sidebar-footer>
    </aside></aria-sidebar-panel>
    <aria-sidebar-rail class="ariaui-web-sidebar-rail"></aria-sidebar-rail>
    <aria-sidebar-inset class="ariaui-web-sidebar-inset"><div class="ariaui-web-sidebar-inset-header"><aria-sidebar-trigger class="ariaui-web-sidebar-trigger" title="Toggle animated sidebar">&#9776;</aria-sidebar-trigger><span>Project overview</span></div><div class="ariaui-web-sidebar-inset-body"><div></div><div></div><div></div></div></aria-sidebar-inset>
  </aria-sidebar>
</div>

```ts
import { animate } from "framer-motion/dom";

root.addEventListener("open-change", (event) => {
  animate(panel, { width: event.detail.open ? 256 : 56 }, { duration: 0.2, ease: "linear" });
});
```

## Anatomy

```html
<aria-sidebar>
  <aria-sidebar-panel>
    <aria-sidebar-header></aria-sidebar-header>
    <aria-sidebar-content>
      <aria-sidebar-group>
        <aria-sidebar-group-label></aria-sidebar-group-label>
        <aria-sidebar-group-action></aria-sidebar-group-action>
        <aria-sidebar-group-content>
          <aria-sidebar-menu>
            <aria-sidebar-menu-item>
              <aria-sidebar-menu-button></aria-sidebar-menu-button>
              <aria-sidebar-menu-action></aria-sidebar-menu-action>
              <aria-sidebar-menu-badge></aria-sidebar-menu-badge>
              <aria-sidebar-menu-sub>
                <aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item>
              </aria-sidebar-menu-sub>
            </aria-sidebar-menu-item>
          </aria-sidebar-menu>
        </aria-sidebar-group-content>
      </aria-sidebar-group>
    </aria-sidebar-content>
    <aria-sidebar-footer></aria-sidebar-footer>
  </aria-sidebar-panel>
  <aria-sidebar-rail></aria-sidebar-rail>
  <aria-sidebar-trigger></aria-sidebar-trigger>
  <aria-sidebar-inset></aria-sidebar-inset>
</aria-sidebar>
```

## API Reference

`Root` accepts `open`, `default-open`, `side`, `collapsible`, `panel-id`, and `keyboard-shortcut`. It emits the cancelable `open-change` event with `{ open, source }` detail.

Interactive menu parts support `active`, `disabled`, `size`, `variant`, and `show-on-hover` metadata. `Panel`, `Trigger`, `GroupLabel`, `GroupAction`, `MenuButton`, `MenuAction`, and `MenuSubButton` support `native-composition`.

The complete part set is `Root`, `Panel`, `Trigger`, `Rail`, `Inset`, `Header`, `Content`, `Footer`, `Group`, `GroupLabel`, `GroupAction`, `GroupContent`, `Menu`, `MenuItem`, `MenuButton`, `MenuAction`, `MenuBadge`, `MenuSub`, `MenuSubItem`, and `MenuSubButton`.

## Keyboard

| Key | Action |
| --- | --- |
| `Ctrl+B` / `Cmd+B` | Toggle the sidebar. |
| `Enter` / `Space` | Activate focused buttons and links. |
| `Tab` | Move through interactive sidebar controls. |

## Accessibility

The panel uses the complementary landmark, the inset uses the main landmark, and menu collections use list semantics. Trigger and rail controls expose `aria-controls`, `aria-expanded`, and an overridable accessible label.
