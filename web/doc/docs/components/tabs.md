# Tabs

A set of layered sections of content, known as tab panels, that display one panel at a time.

## Features

- **Headless**
- **Automatic activation**
- **Horizontal or vertical**
- **Disabled triggers**
- **Accessible tab panels**
- **Composable parts**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/tabs
```

```bash [pnpm]
pnpm add @ariaui-web/tabs
```

```bash [yarn]
yarn add @ariaui-web/tabs
```

:::

```ts
import { defineTabsElements } from "@ariaui-web/tabs";

defineTabsElements();
```

## Examples

These live examples use the same content, controls, and Tailwind CSS composition as the Aria UI Tabs page.

### Default

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="tabs" data-example-variant="default">
  <aria-tabs default-value="signin" class="ariaui-web-tabs-auth w-[400px] max-w-sm">
    <aria-tabs-list class="ariaui-web-tabs-auth-list relative flex w-full items-center justify-around rounded-lg bg-muted p-1">
      <aria-tabs-trigger value="signin" class="ariaui-web-tabs-auth-trigger group flex-1 min-w-0 rounded-md   "><span class="box-border flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground group-aria-[selected=true]:border group-aria-[selected=true]:border-border group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-foreground group-aria-[selected=true]:shadow-sm">Sign in</span></aria-tabs-trigger>
      <aria-tabs-trigger value="signup" class="ariaui-web-tabs-auth-trigger group flex-1 min-w-0 rounded-md   "><span class="box-border flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground group-aria-[selected=true]:border group-aria-[selected=true]:border-border group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-foreground group-aria-[selected=true]:shadow-sm">Sign up</span></aria-tabs-trigger>
    </aria-tabs-list>
    <div class="ariaui-web-tabs-auth-shell mt-4 flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <aria-tabs-panel>
        <aria-tabs-content value="signin">
          <div class="ariaui-web-tabs-auth-header flex flex-col gap-1.5">
            <h3 class="text-base font-semibold tracking-tight text-foreground">Log in to your account</h3>
            <p class="text-sm text-muted-foreground">Welcome back! Please enter your details.</p>
          </div>
          <form class="ariaui-web-tabs-auth-form flex flex-col mt-6">
            <div class="ariaui-web-tabs-auth-fields flex flex-col gap-4">
              <div class="ariaui-web-tabs-auth-field flex w-full flex-col">
                <label for="tabs-auth-email-in" class="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <input id="tabs-auth-email-in" type="email" placeholder="Enter your email" autocomplete="email" class="ariaui-web-tabs-auth-input h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground  " />
              </div>
              <div class="ariaui-web-tabs-auth-field flex w-full flex-col">
                <label for="tabs-auth-password-in" class="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                <input id="tabs-auth-password-in" type="password" placeholder="Enter your password" autocomplete="current-password" class="ariaui-web-tabs-auth-input h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground  " />
              </div>
              <div class="ariaui-web-tabs-auth-meta flex items-center justify-between gap-4 pt-1">
                <div class="ariaui-web-tabs-auth-remember flex items-start gap-2">
                  <aria-checkbox id="tabs-auth-remember" default-checked class="ariaui-web-tabs-checkbox group flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-border bg-background shadow-xs disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary">
                    <aria-checkbox-indicator><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 4 4L19 6"></path></svg></aria-checkbox-indicator>
                  </aria-checkbox>
                  <label for="tabs-auth-remember" class="cursor-pointer pt-0.5 text-sm font-medium leading-none text-foreground">Remember me</label>
                </div>
                <button type="button" class="ariaui-web-tabs-text-button shrink-0 rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline">Forgot password</button>
              </div>
            </div>
            <div class="ariaui-web-tabs-auth-actions mt-6 flex"><button type="button" class="ariaui-web-tabs-primary flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover w-full">Sign in</button></div>
          </form>
        </aria-tabs-content>
        <aria-tabs-content value="signup">
          <div class="ariaui-web-tabs-auth-header flex flex-col gap-1.5">
            <h3 class="text-base font-semibold tracking-tight text-foreground">Create an account</h3>
            <p class="text-sm text-muted-foreground">Start your 30-day free trial.</p>
          </div>
          <form class="ariaui-web-tabs-auth-form flex flex-col mt-6">
            <div class="ariaui-web-tabs-auth-fields flex flex-col gap-4">
              <div class="ariaui-web-tabs-auth-field flex w-full flex-col"><label for="tabs-auth-name-up" class="mb-1.5 block text-sm font-medium text-foreground">Name</label><input id="tabs-auth-name-up" type="text" placeholder="Enter your name" autocomplete="name" class="ariaui-web-tabs-auth-input h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground  " /></div>
              <div class="ariaui-web-tabs-auth-field flex w-full flex-col"><label for="tabs-auth-email-up" class="mb-1.5 block text-sm font-medium text-foreground">Email</label><input id="tabs-auth-email-up" type="email" placeholder="Enter your email" autocomplete="email" class="ariaui-web-tabs-auth-input h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground  " /></div>
              <div class="ariaui-web-tabs-auth-field flex w-full flex-col"><label for="tabs-auth-password-up" class="mb-1.5 block text-sm font-medium text-foreground">Password</label><input id="tabs-auth-password-up" type="password" placeholder="Create a password" autocomplete="new-password" class="ariaui-web-tabs-auth-input h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground  " /><p class="ariaui-web-tabs-helper mt-1.5 text-xs text-muted-foreground">Must be at least 8 characters.</p></div>
            </div>
            <div class="ariaui-web-tabs-auth-actions mt-6 flex"><button type="button" class="ariaui-web-tabs-primary flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover w-full">Sign up</button></div>
          </form>
        </aria-tabs-content>
      </aria-tabs-panel>
    </div>
  </aria-tabs>
</div>

```html
<aria-tabs default-value="signin" class="w-[400px] max-w-sm">
  <aria-tabs-list class="relative flex w-full items-center justify-around rounded-lg bg-muted p-1">
    <aria-tabs-trigger value="signin" class="group flex-1 min-w-0 rounded-md"><span class="box-border flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground group-aria-[selected=true]:border group-aria-[selected=true]:border-border group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-foreground group-aria-[selected=true]:shadow-sm">Sign in</span></aria-tabs-trigger>
    <aria-tabs-trigger value="signup" class="group flex-1 min-w-0 rounded-md"><span class="box-border flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground group-aria-[selected=true]:border group-aria-[selected=true]:border-border group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-foreground group-aria-[selected=true]:shadow-sm">Sign up</span></aria-tabs-trigger>
  </aria-tabs-list>
  <div class="mt-4 flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
    <aria-tabs-panel>
      <aria-tabs-content value="signin">Log in to your account</aria-tabs-content>
      <aria-tabs-content value="signup">Create an account</aria-tabs-content>
    </aria-tabs-panel>
  </div>
</aria-tabs>
```

### Framer Motion

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="tabs" data-example-variant="framer-motion">
  <aria-tabs value="overview" class="ariaui-web-tabs-motion w-full max-w-md">
    <aria-tabs-list native-composition>
      <div class="ariaui-web-tabs-motion-list relative grid h-10 grid-cols-3 items-center rounded-lg bg-muted p-1">
        <span data-tabs-motion-indicator aria-hidden="true" class="ariaui-web-tabs-motion-indicator absolute inset-0 z-0 rounded-md border border-border bg-background shadow-sm"></span>
        <aria-tabs-trigger native-composition value="overview"><button type="button" class="ariaui-web-tabs-motion-trigger relative z-10 flex h-8 min-w-0 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground  aria-[selected=true]:text-foreground "><span class="relative z-10 truncate">Overview</span></button></aria-tabs-trigger>
        <aria-tabs-trigger native-composition value="activity"><button type="button" class="ariaui-web-tabs-motion-trigger relative z-10 flex h-8 min-w-0 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground  aria-[selected=true]:text-foreground "><span class="relative z-10 truncate">Activity</span></button></aria-tabs-trigger>
        <aria-tabs-trigger native-composition value="settings"><button type="button" class="ariaui-web-tabs-motion-trigger relative z-10 flex h-8 min-w-0 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground  aria-[selected=true]:text-foreground "><span class="relative z-10 truncate">Settings</span></button></aria-tabs-trigger>
      </div>
    </aria-tabs-list>
    <aria-tabs-panel class="ariaui-web-tabs-motion-panel mt-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <aria-tabs-content native-composition value="overview"><div class="ariaui-web-tabs-motion-content space-y-1.5"><h3 class="text-base font-semibold tracking-tight text-foreground">Launch overview</h3><p class="text-sm leading-6 text-muted-foreground">Review product metrics, release readiness, and the ownership notes for the next milestone.</p></div></aria-tabs-content>
      <aria-tabs-content native-composition value="activity"><div class="ariaui-web-tabs-motion-content space-y-1.5"><h3 class="text-base font-semibold tracking-tight text-foreground">Team activity</h3><p class="text-sm leading-6 text-muted-foreground">Track recent changes, handoffs, and unresolved decisions without leaving the current workflow.</p></div></aria-tabs-content>
      <aria-tabs-content native-composition value="settings"><div class="ariaui-web-tabs-motion-content space-y-1.5"><h3 class="text-base font-semibold tracking-tight text-foreground">Workspace settings</h3><p class="text-sm leading-6 text-muted-foreground">Tune notifications, access controls, and workflow defaults for the active workspace.</p></div></aria-tabs-content>
    </aria-tabs-panel>
  </aria-tabs>
</div>

```html
<aria-tabs value="overview" class="w-full max-w-md">
  <aria-tabs-list native-composition>
    <div class="relative grid h-10 grid-cols-3 items-center rounded-lg bg-muted p-1">
      <span data-tabs-motion-indicator class="absolute inset-0 z-0 rounded-md border border-border bg-background shadow-sm"></span>
      <aria-tabs-trigger native-composition value="overview"><button class="relative z-10 flex h-8 min-w-0 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground aria-[selected=true]:text-foreground">Overview</button></aria-tabs-trigger>
      <aria-tabs-trigger native-composition value="activity"><button class="relative z-10 flex h-8 min-w-0 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground aria-[selected=true]:text-foreground">Activity</button></aria-tabs-trigger>
      <aria-tabs-trigger native-composition value="settings"><button class="relative z-10 flex h-8 min-w-0 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground aria-[selected=true]:text-foreground">Settings</button></aria-tabs-trigger>
    </div>
  </aria-tabs-list>
  <aria-tabs-panel class="mt-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
    <aria-tabs-content value="overview">Launch overview</aria-tabs-content>
    <aria-tabs-content value="activity">Team activity</aria-tabs-content>
    <aria-tabs-content value="settings">Workspace settings</aria-tabs-content>
  </aria-tabs-panel>
</aria-tabs>
```

The animation imports `animate` from `framer-motion/dom` in the documentation theme. The Tabs package remains framework independent.

## Anatomy

```html
<aria-tabs default-value="account">
  <aria-tabs-list>
    <aria-tabs-trigger value="account"></aria-tabs-trigger>
  </aria-tabs-list>
  <aria-tabs-panel>
    <aria-tabs-content value="account"></aria-tabs-content>
  </aria-tabs-panel>
</aria-tabs>
```

## API Reference

| Part | Attributes | Description |
| --- | --- | --- |
| Root | `default-value`, `value`, `orientation`, `disabled` | Owns selection and coordinates all parts. Emits `valuechange`. |
| List | `native-composition` | Tablist container with reflected orientation. |
| Trigger | `value`, `disabled`, `native-composition` | Activates its matching content and participates in roving focus. |
| Panel | none | Structural owner for the coordinated content panels. |
| Content | `value`, `native-composition` | Receives tabpanel semantics and is hidden while inactive. |

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>ArrowRight</kbd> | Moves focus and selection to the next horizontal tab, wrapping at the end. |
| <kbd>ArrowLeft</kbd> | Moves focus and selection to the previous horizontal tab, wrapping at the start. |
| <kbd>ArrowDown</kbd> | Moves to the next tab when orientation is vertical. |
| <kbd>ArrowUp</kbd> | Moves to the previous tab when orientation is vertical. |
| <kbd>Home</kbd> | Moves focus and selection to the first enabled tab. |
| <kbd>End</kbd> | Moves focus and selection to the last enabled tab. |

## Accessibility

Tabs follows the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with automatic activation. The list exposes `role="tablist"`; triggers expose `role="tab"`, roving tabindex, `aria-selected`, and `aria-controls`; content panels expose `role="tabpanel"`, `aria-labelledby`, and the native `hidden` attribute while inactive. Disabled triggers are removed from roving navigation.
