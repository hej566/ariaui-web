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
npm install @ariaui-web/sidebar @ariaui-web/select @ariaui-web/portal
```

```bash [pnpm]
pnpm add @ariaui-web/sidebar @ariaui-web/select @ariaui-web/portal
```

```bash [yarn]
yarn add @ariaui-web/sidebar @ariaui-web/select @ariaui-web/portal
```

:::

```ts
import { definePortalElements } from "@ariaui-web/portal";
import { defineSelectElements } from "@ariaui-web/select";
import { defineSidebarElements } from "@ariaui-web/sidebar";

definePortalElements();
defineSelectElements();
defineSidebarElements();
```

## Examples

### Default

<div class="ariaui-web-preview" data-component="sidebar" data-example-variant="default">
  <aria-sidebar class="ariaui-web-sidebar-root group/sidebar mx-auto flex min-h-[420px] w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-sm" data-sidebar-example="default" data-example-part="Root" panel-id="sidebar-default-panel">
    <aria-sidebar-panel class="ariaui-web-sidebar-panel relative flex min-h-[420px] w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground group-data-[state=collapsed]/sidebar:w-14" data-example-part="Panel" aria-label="Project navigation">
      <aria-sidebar-header class="ariaui-web-sidebar-header flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3">
        <span class="ariaui-web-sidebar-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"><svg aria-hidden="true" data-sidebar-icon="bar-chart-3" viewBox="0 0 24 24"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg></span>
        <span class="ariaui-web-sidebar-select-shell min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden" data-sidebar-collapse-label>
          <aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="workspace" default-value="acme">
            <aria-select-label class="sr-only">Workspace</aria-select-label>
            <aria-select-trigger class="ariaui-web-sidebar-select-trigger flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" aria-label="Workspace"><span data-select-trigger-label>Acme Analytics</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator"><svg aria-hidden="true" data-sidebar-icon="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></aria-select-dropdown-indicator></aria-select-trigger>
            <aria-portal data-sidebar-select-portal data-select-portal="content"></aria-portal>
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
          <aria-sidebar-group-label class="ariaui-web-sidebar-group-label px-2 pb-1 text-xs font-medium text-muted-foreground group-data-[state=collapsed]/sidebar:hidden">Platform</aria-sidebar-group-label>
          <aria-sidebar-group-content>
            <aria-sidebar-menu class="ariaui-web-sidebar-menu flex flex-col gap-1">
              <aria-sidebar-menu-item>
                <aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground" active open data-sidebar-submenu-trigger aria-expanded="true"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="home" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span><span class="truncate group-data-[state=collapsed]/sidebar:hidden" data-sidebar-collapse-label>Home</span><svg aria-hidden="true" class="ariaui-web-sidebar-chevron ml-auto h-4 w-4 shrink-0 group-data-[state=collapsed]/sidebar:hidden" data-open data-sidebar-icon="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></aria-sidebar-menu-button>
                <aria-sidebar-menu-sub class="ariaui-web-sidebar-menu-sub ml-5 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-3 group-data-[state=collapsed]/sidebar:hidden" data-sidebar-submenu>
                  <aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button flex h-7 items-center rounded-md px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground" active>Overview</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item>
                  <aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button flex h-7 items-center rounded-md px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground">Reports</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item>
                </aria-sidebar-menu-sub>
              </aria-sidebar-menu-item>
              <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="inbox" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg></span><span class="truncate group-data-[state=collapsed]/sidebar:hidden" data-sidebar-collapse-label>Inbox</span><aria-sidebar-menu-badge class="ariaui-web-sidebar-menu-badge">4</aria-sidebar-menu-badge></aria-sidebar-menu-button></aria-sidebar-menu-item>
              <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="search" viewBox="0 0 24 24"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg></span><span class="truncate group-data-[state=collapsed]/sidebar:hidden" data-sidebar-collapse-label>Search</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
              <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg></span><span class="truncate group-data-[state=collapsed]/sidebar:hidden" data-sidebar-collapse-label>Settings</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
            </aria-sidebar-menu>
          </aria-sidebar-group-content>
        </aria-sidebar-group>
      </aria-sidebar-content>
      <aria-sidebar-footer class="ariaui-web-sidebar-footer space-y-2 border-t border-sidebar-border p-2"><aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="preference" default-value="notifications"><aria-select-label class="sr-only">Preference</aria-select-label><aria-select-trigger class="ariaui-web-sidebar-select-trigger ariaui-web-sidebar-preference flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring" aria-label="Preference"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg></span><span class="min-w-0 flex-1 truncate text-left group-data-[state=collapsed]/sidebar:hidden" data-select-trigger-label data-sidebar-collapse-label>Notifications</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator" data-sidebar-collapse-label><svg aria-hidden="true" data-sidebar-icon="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></aria-select-dropdown-indicator></aria-select-trigger><aria-portal data-sidebar-select-portal data-select-portal="content"></aria-portal><aria-select-content class="ariaui-web-sidebar-select-content" hidden><aria-select-option class="ariaui-web-sidebar-select-option" value="notifications">Notifications<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="appearance">Appearance<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="privacy">Privacy<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option></aria-select-content></aria-select></aria-sidebar-footer>
    </aria-sidebar-panel>
    <aria-sidebar-rail class="ariaui-web-sidebar-rail w-1 shrink-0 bg-transparent hover:bg-sidebar-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring" data-example-part="Rail"></aria-sidebar-rail>
    <aria-sidebar-inset class="ariaui-web-sidebar-inset flex min-w-0 flex-1 flex-col bg-background">
      <div class="ariaui-web-sidebar-inset-header flex h-14 items-center gap-2 border-b border-border px-4 text-sm font-medium"><aria-sidebar-trigger class="ariaui-web-sidebar-trigger inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-example-part="Trigger" title="Toggle sidebar"><svg aria-hidden="true" data-sidebar-icon="panel-left" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg></aria-sidebar-trigger><span>Project overview</span></div>
      <div class="ariaui-web-sidebar-inset-body grid flex-1 gap-3 p-4"><div class="h-20 rounded-md border border-border bg-muted/40"></div><div class="h-20 rounded-md border border-border bg-muted/40"></div><div class="h-20 rounded-md border border-border bg-muted/40"></div></div>
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
      <aria-sidebar-header class="ariaui-web-sidebar-header flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3">
        <span class="ariaui-web-sidebar-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"><svg aria-hidden="true" data-sidebar-icon="bar-chart-3" viewBox="0 0 24 24"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg></span>
        <span class="ariaui-web-sidebar-select-shell min-w-0" data-sidebar-motion-flex><aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="workspace" default-value="acme"><aria-select-label class="sr-only">Workspace</aria-select-label><aria-select-trigger class="ariaui-web-sidebar-select-trigger flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" aria-label="Workspace"><span class="min-w-0 flex-1 truncate text-left" data-select-trigger-label>Acme Analytics</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator"><svg aria-hidden="true" data-sidebar-icon="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></aria-select-dropdown-indicator></aria-select-trigger><aria-portal data-sidebar-select-portal data-select-portal="content"></aria-portal><aria-select-content class="ariaui-web-sidebar-select-content" hidden><aria-select-option class="ariaui-web-sidebar-select-option" value="acme">Acme Analytics<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="design">Design System<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="growth">Growth Team<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option></aria-select-content></aria-select></span>
      </aria-sidebar-header>
      <aria-sidebar-content class="ariaui-web-sidebar-content flex-1 overflow-hidden px-2 py-3"><aria-sidebar-group class="ariaui-web-sidebar-group relative space-y-1"><aria-sidebar-group-label class="ariaui-web-sidebar-group-label px-2 pb-1 text-xs font-medium text-muted-foreground" data-sidebar-motion-label>Platform</aria-sidebar-group-label><aria-sidebar-group-content><aria-sidebar-menu class="ariaui-web-sidebar-menu flex flex-col gap-1">
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground" active open data-sidebar-submenu-trigger aria-expanded="true"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="home" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span><span class="truncate" data-sidebar-motion-label>Home</span><svg aria-hidden="true" class="ariaui-web-sidebar-chevron h-4 w-4" data-sidebar-motion-accessory data-open data-sidebar-icon="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></aria-sidebar-menu-button><aria-sidebar-menu-sub class="ariaui-web-sidebar-menu-sub ml-5 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-3" data-sidebar-submenu><aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button flex h-7 items-center rounded-md px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground" active>Overview</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-item><aria-sidebar-menu-sub-button class="ariaui-web-sidebar-menu-sub-button flex h-7 items-center rounded-md px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground">Reports</aria-sidebar-menu-sub-button></aria-sidebar-menu-sub-item></aria-sidebar-menu-sub></aria-sidebar-menu-item>
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="inbox" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg></span><span class="truncate" data-sidebar-motion-label>Inbox</span><aria-sidebar-menu-badge class="ariaui-web-sidebar-menu-badge" data-sidebar-motion-accessory>4</aria-sidebar-menu-badge></aria-sidebar-menu-button></aria-sidebar-menu-item>
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="search" viewBox="0 0 24 24"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg></span><span class="truncate" data-sidebar-motion-label>Search</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
        <aria-sidebar-menu-item><aria-sidebar-menu-button class="ariaui-web-sidebar-menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg></span><span class="truncate" data-sidebar-motion-label>Settings</span></aria-sidebar-menu-button></aria-sidebar-menu-item>
      </aria-sidebar-menu></aria-sidebar-group-content></aria-sidebar-group></aria-sidebar-content>
      <aria-sidebar-footer class="ariaui-web-sidebar-footer space-y-2 border-t border-sidebar-border p-2"><aria-select class="ariaui-web-sidebar-select-root" data-sidebar-select="preference" default-value="notifications"><aria-select-label class="sr-only">Preference</aria-select-label><aria-select-trigger class="ariaui-web-sidebar-select-trigger ariaui-web-sidebar-preference flex h-9 w-full items-center gap-2 overflow-hidden rounded-md pl-3 pr-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring" aria-label="Preference"><span class="ariaui-web-sidebar-icon flex size-4 shrink-0 items-center justify-center"><svg aria-hidden="true" data-sidebar-icon="settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg></span><span class="min-w-0 flex-1 truncate text-left" data-select-trigger-label data-sidebar-motion-label>Notifications</span><aria-select-dropdown-indicator class="ariaui-web-sidebar-select-indicator" data-sidebar-motion-accessory><svg aria-hidden="true" data-sidebar-icon="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></aria-select-dropdown-indicator></aria-select-trigger><aria-portal data-sidebar-select-portal data-select-portal="content"></aria-portal><aria-select-content class="ariaui-web-sidebar-select-content" hidden><aria-select-option class="ariaui-web-sidebar-select-option" value="notifications">Notifications<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="appearance">Appearance<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option><aria-select-option class="ariaui-web-sidebar-select-option" value="privacy">Privacy<span class="ariaui-web-sidebar-select-check">&#10003;</span></aria-select-option></aria-select-content></aria-select></aria-sidebar-footer>
    </aside></aria-sidebar-panel>
    <aria-sidebar-rail class="ariaui-web-sidebar-rail w-1 shrink-0 bg-transparent hover:bg-sidebar-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"></aria-sidebar-rail>
    <aria-sidebar-inset class="ariaui-web-sidebar-inset flex min-w-0 flex-1 flex-col bg-background"><div class="ariaui-web-sidebar-inset-header flex h-14 items-center gap-2 border-b border-border px-4 text-sm font-medium"><aria-sidebar-trigger class="ariaui-web-sidebar-trigger inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" title="Toggle animated sidebar"><svg aria-hidden="true" data-sidebar-icon="panel-left" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg></aria-sidebar-trigger><span>Project overview</span></div><div class="ariaui-web-sidebar-inset-body grid flex-1 gap-3 p-4"><div class="h-20 rounded-md border border-border bg-muted/40"></div><div class="h-20 rounded-md border border-border bg-muted/40"></div><div class="h-20 rounded-md border border-border bg-muted/40"></div></div></aria-sidebar-inset>
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
