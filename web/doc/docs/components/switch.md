# Switch

A headless, accessible switch for toggling a single on/off value with keyboard and native form support.

## Features

- **Headless switch primitive**
- **Controlled or uncontrolled**
- **Keyboard accessible**
- **Native form integration**
- **Disabled state support**
- **Composable parts and state data**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/switch
```

```bash [pnpm]
pnpm add @ariaui-web/switch
```

```bash [yarn]
yarn add @ariaui-web/switch
```

:::

```ts
import { defineSwitchElements } from "@ariaui-web/switch";

defineSwitchElements();
```

## Examples

These examples use the same content, compact layout, state styling, and Tailwind CSS composition as the Aria UI Switch page.

### Uncontrolled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="switch" data-example-variant="uncontrolled">
  <div class="ariaui-web-switch-row flex items-start gap-3">
    <aria-switch id="switch-uncontrolled-1" default-checked class="group">
      <aria-switch-track class="ariaui-web-switch-track relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
        <aria-switch-thumb class="ariaui-web-switch-thumb pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm group-has-[:checked]:translate-x-4"></aria-switch-thumb>
      </aria-switch-track>
    </aria-switch>
    <label for="switch-uncontrolled-1" class="ariaui-web-switch-label select-none">
      <span class="ariaui-web-switch-title text-sm font-medium text-foreground">Remember me</span>
      <span class="ariaui-web-switch-description text-sm font-normal text-muted-foreground">Save my login details for next time.</span>
    </label>
  </div>
</div>

```html
<div class="flex items-start gap-3">
  <aria-switch id="switch-uncontrolled-1" default-checked class="group">
    <aria-switch-track class="relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
      <aria-switch-thumb class="pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm group-has-[:checked]:translate-x-4"></aria-switch-thumb>
    </aria-switch-track>
  </aria-switch>
  <label for="switch-uncontrolled-1" class="select-none">
    <p class="text-sm font-medium text-foreground">Remember me</p>
    <p class="text-sm font-normal text-muted-foreground">Save my login details for next time.</p>
  </label>
</div>
```

### Controlled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="switch" data-example-variant="controlled">
  <div class="ariaui-web-switch-row flex items-start gap-3">
    <aria-switch id="switch-controlled-1" checked class="group">
      <aria-switch-track class="ariaui-web-switch-track relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
        <aria-switch-thumb class="ariaui-web-switch-thumb pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm group-has-[:checked]:translate-x-4"></aria-switch-thumb>
      </aria-switch-track>
    </aria-switch>
    <label for="switch-controlled-1" class="ariaui-web-switch-label select-none">
      <span class="ariaui-web-switch-title text-sm font-medium text-foreground">Remember me</span>
      <span class="ariaui-web-switch-description text-sm font-normal text-muted-foreground">Save my login details for next time.</span>
    </label>
  </div>
</div>

```html
<div class="flex items-start gap-3">
  <aria-switch id="switch-controlled-1" checked class="group">
    <aria-switch-track class="relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
      <aria-switch-thumb class="pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm group-has-[:checked]:translate-x-4"></aria-switch-thumb>
    </aria-switch-track>
  </aria-switch>
  <label for="switch-controlled-1" class="select-none">
    <p class="text-sm font-medium text-foreground">Remember me</p>
    <p class="text-sm font-normal text-muted-foreground">Save my login details for next time.</p>
  </label>
</div>
```

### Disabled

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="switch" data-example-variant="disabled">
  <div class="ariaui-web-switch-row flex items-start gap-3">
    <aria-switch id="switch-disabled-1" disabled class="group">
      <aria-switch-track class="ariaui-web-switch-track relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
        <aria-switch-thumb class="ariaui-web-switch-thumb pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm group-has-[:checked]:translate-x-4"></aria-switch-thumb>
      </aria-switch-track>
    </aria-switch>
    <label for="switch-disabled-1" class="ariaui-web-switch-label select-none">
      <span class="ariaui-web-switch-title text-sm font-medium text-foreground">Remember me</span>
      <span class="ariaui-web-switch-description text-sm font-normal text-muted-foreground">Save my login details for next time.</span>
    </label>
  </div>
</div>

```html
<div class="flex items-start gap-3">
  <aria-switch id="switch-disabled-1" disabled class="group">
    <aria-switch-track class="relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
      <aria-switch-thumb class="pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm group-has-[:checked]:translate-x-4"></aria-switch-thumb>
    </aria-switch-track>
  </aria-switch>
  <label for="switch-disabled-1" class="select-none">
    <p class="text-sm font-medium text-foreground">Remember me</p>
    <p class="text-sm font-normal text-muted-foreground">Save my login details for next time.</p>
  </label>
</div>
```

### Framer Motion

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="switch" data-example-variant="framer-motion">
  <div class="ariaui-web-switch-row flex items-start gap-3">
    <aria-switch id="switch-motion-1" checked class="group">
      <aria-switch-track class="ariaui-web-switch-track relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
        <aria-switch-thumb native-composition>
          <span aria-hidden="true" data-switch-motion-thumb class="ariaui-web-switch-thumb ariaui-web-switch-motion-thumb pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm" style="transform: translateX(16px)"></span>
        </aria-switch-thumb>
      </aria-switch-track>
    </aria-switch>
    <label for="switch-motion-1" class="ariaui-web-switch-label select-none">
      <span class="ariaui-web-switch-title text-sm font-medium text-foreground">Remember me</span>
      <span class="ariaui-web-switch-description text-sm font-normal text-muted-foreground">Save my login details for next time.</span>
    </label>
  </div>
</div>

```html
<div class="flex items-start gap-3">
  <aria-switch id="switch-motion-1" checked class="group">
    <aria-switch-track class="relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5    group-has-[:checked]:bg-primary hover:group-has-[:checked]:bg-primary/90 group-has-[:disabled]:pointer-events-none group-has-[:disabled]:bg-muted">
      <aria-switch-thumb native-composition>
        <span aria-hidden="true" data-switch-motion-thumb class="pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm"></span>
      </aria-switch-thumb>
    </aria-switch-track>
  </aria-switch>
  <label for="switch-motion-1" class="select-none">
    <p class="text-sm font-medium text-foreground">Remember me</p>
    <p class="text-sm font-normal text-muted-foreground">Save my login details for next time.</p>
  </label>
</div>
```

The Framer Motion example imports `animate` from `framer-motion/dom` in the documentation theme. The Switch package remains framework independent.

## Anatomy

```html
<aria-switch>
  <aria-switch-track>
    <aria-switch-thumb></aria-switch-thumb>
  </aria-switch-track>
</aria-switch>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `checked` | `false` | Current checked state. |
| `default-checked` | `false` | Initial value for an uncontrolled switch. |
| `disabled` | `false` | Disables the checkbox and all Track interaction. |
| `name` | unset | Hidden checkbox name used in form submission. |
| `value` | `on` | Submitted value when checked. |
| `required` | `false` | Applies native checkbox validation. |
| `id` | unset | Associates a label with the hidden checkbox. |

Root emits a bubbling `checkedchange` event with `detail.checked` whenever interaction changes the state.

### Track

Track receives `role="switch"`, `aria-checked`, `aria-disabled`, and the appropriate tab index. Its own `disabled` attribute overrides an enabled Root.

### Thumb

Thumb receives `data-state="checked"` or `data-state="unchecked"` and `data-disabled` when Root is disabled. With `native-composition`, these states are also applied to its first element child.

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Toggles the focused switch. |
| <kbd>Tab</kbd> | Moves focus to or away from Track. |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | Moves focus to the previous element. |

## Accessibility

Switch follows the WAI-ARIA Switch pattern. Track carries `role="switch"` and reflects its state through `aria-checked`; Root keeps a hidden checkbox for labels, form submission, and native validation. Always provide a visible label or an accessible name.
