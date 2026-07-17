# Disclosure

A headless, accessible disclosure (collapsible) primitive for toggling content visibility.

## Features

- **Toggle visibility**
- **Controlled or uncontrolled open state**
- **Semantic trigger button**
- **ARIA-expanded and ARIA-controls wiring**
- **Unmount-style hidden content**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/disclosure
```

```bash [pnpm]
pnpm add @ariaui-web/disclosure
```

```bash [yarn]
yarn add @ariaui-web/disclosure
```

:::

### Register Elements

```ts
import { defineDisclosureElements } from "@ariaui-web/disclosure";

defineDisclosureElements();
```

## Examples

### Collapsible

<div class="ariaui-web-preview flex justify-center overflow-hidden bg-background py-14 sm:px-12" data-component="disclosure" data-example-variant="collapsible">
  <div class="flex justify-center px-4 py-6 ariaui-web-disclosure-preview-inner">
    <aria-disclosure class="flex w-[350px] max-w-full flex-col gap-2 ariaui-web-disclosure-root" data-example-part="Root">
      <div class="flex h-9 items-center justify-between px-4 ariaui-web-disclosure-header">
        <h4 class="text-sm leading-5 font-semibold text-foreground ariaui-web-disclosure-title">Aria UI released 3 primitives</h4>
        <aria-disclosure-trigger class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent hover:bg-accent-hover ariaui-web-disclosure-trigger" data-example-part="Trigger" aria-label="Toggle">
          <svg class="h-4 w-4 text-icon ariaui-web-disclosure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m7 15 5 5 5-5"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="m7 9 5-5 5 5"></path>
          </svg>
          <span class="sr-only">Toggle</span>
        </aria-disclosure-trigger>
      </div>
      <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/disclosure</div>
      <aria-disclosure-content class="flex flex-col gap-2 ariaui-web-disclosure-content" data-example-part="Content">
        <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/accordion</div>
        <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/tabs</div>
      </aria-disclosure-content>
    </aria-disclosure>
  </div>
</div>

```html
<aria-disclosure class="flex w-[350px] max-w-full flex-col gap-2 ariaui-web-disclosure-root">
  <div class="flex h-9 items-center justify-between px-4 ariaui-web-disclosure-header">
    <h4 class="text-sm leading-5 font-semibold text-foreground ariaui-web-disclosure-title">Aria UI released 3 primitives</h4>
    <aria-disclosure-trigger class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent hover:bg-accent-hover ariaui-web-disclosure-trigger" aria-label="Toggle">
      <svg class="h-4 w-4 text-icon ariaui-web-disclosure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m7 15 5 5 5-5"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m7 9 5-5 5 5"></path>
      </svg>
      <span class="sr-only">Toggle</span>
    </aria-disclosure-trigger>
  </div>
  <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/disclosure</div>
  <aria-disclosure-content class="flex flex-col gap-2 ariaui-web-disclosure-content">
    <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/accordion</div>
    <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/tabs</div>
  </aria-disclosure-content>
</aria-disclosure>
```

### Framer Motion

The package remains framework-free. This docs example keeps the content mounted with `force-mount`, slots disclosure attributes onto a custom host with `native-composition`, and uses the docs runtime to animate the host.

<div class="ariaui-web-preview flex justify-center overflow-hidden bg-background py-14 sm:px-12" data-component="disclosure" data-example-variant="framer-motion">
  <div class="flex justify-center px-4 py-6 ariaui-web-disclosure-preview-inner">
    <aria-disclosure class="flex w-[350px] max-w-full flex-col gap-2 ariaui-web-disclosure-root" data-example-part="Root" data-disclosure-motion>
      <div class="flex h-9 items-center justify-between px-4 ariaui-web-disclosure-header">
        <h4 class="text-sm leading-5 font-semibold text-foreground ariaui-web-disclosure-title">Aria UI released 3 primitives</h4>
        <aria-disclosure-trigger class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent hover:bg-accent-hover ariaui-web-disclosure-trigger" data-example-part="Trigger" aria-label="Toggle">
          <svg class="h-4 w-4 text-icon ariaui-web-disclosure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m7 15 5 5 5-5"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="m7 9 5-5 5 5"></path>
          </svg>
          <span class="sr-only">Toggle</span>
        </aria-disclosure-trigger>
      </div>
      <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/disclosure</div>
      <aria-disclosure-content class="flex flex-col gap-2 overflow-hidden ariaui-web-disclosure-content" data-example-part="Content" force-mount native-composition>
        <div class="flex flex-col gap-2 overflow-hidden ariaui-web-disclosure-motion-content" data-disclosure-motion-content>
          <div class="ariaui-web-disclosure-motion-inner">
            <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/accordion</div>
            <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/tabs</div>
          </div>
        </div>
      </aria-disclosure-content>
    </aria-disclosure>
  </div>
</div>

```html
<aria-disclosure class="flex w-[350px] max-w-full flex-col gap-2 ariaui-web-disclosure-root" data-disclosure-motion>
  <div class="flex h-9 items-center justify-between px-4 ariaui-web-disclosure-header">
    <h4 class="text-sm leading-5 font-semibold text-foreground ariaui-web-disclosure-title">Aria UI released 3 primitives</h4>
    <aria-disclosure-trigger class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent hover:bg-accent-hover ariaui-web-disclosure-trigger" aria-label="Toggle">
      <svg class="h-4 w-4 text-icon ariaui-web-disclosure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m7 15 5 5 5-5"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m7 9 5-5 5 5"></path>
      </svg>
      <span class="sr-only">Toggle</span>
    </aria-disclosure-trigger>
  </div>
  <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/disclosure</div>
  <aria-disclosure-content class="flex flex-col gap-2 overflow-hidden ariaui-web-disclosure-content" force-mount native-composition>
    <div class="flex flex-col gap-2 overflow-hidden ariaui-web-disclosure-motion-content" data-disclosure-motion-content>
      <div class="ariaui-web-disclosure-motion-inner">
        <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/accordion</div>
        <div class="flex min-h-9 items-center rounded-md border border-border bg-background px-4 py-2 font-mono text-sm leading-5 text-foreground ariaui-web-disclosure-row">@ariaui/tabs</div>
      </div>
    </div>
  </aria-disclosure-content>
</aria-disclosure>
```

## Anatomy

```html
<aria-disclosure>
  <aria-disclosure-trigger>Toggle</aria-disclosure-trigger>
  <aria-disclosure-content>Content</aria-disclosure-content>
</aria-disclosure>
```

## API Reference

### Root

State container for Trigger and Content.

| Attribute / event | Default | Description |
| --- | --- | --- |
| `open` | closed | Controlled-style open state. When present during initialization, trigger interaction reports changes without mutating the attribute. |
| `default-open` | `false` | Initial open state for uncontrolled disclosures. |
| `openchange` | - | Bubbling event with `event.detail.open` and `event.detail.source`. |

### Trigger

Button-like custom element that toggles the disclosure open and closed.

| Attribute | Value |
| --- | --- |
| `role` | `button` |
| `type` | `button` |
| `aria-expanded` | `true` when open, `false` when closed |
| `aria-controls` | ID of the Content host |
| `data-state` | `open` or `closed` |

### Content

Container for collapsible content. It is hidden while closed unless `force-mount` is present.

| Attribute | Default | Description |
| --- | --- | --- |
| `role` | `region` | Region role reflected by the content host. |
| `force-mount` | absent | Keeps content mounted while closed for animation. |
| `native-composition` | absent | Slots content metadata onto a single child host for animation libraries. |
| `aria-hidden` | `true` when closed | Removes closed content from the accessibility tree. |
| `data-state` | `closed` | `open` or `closed`. |

## Keyboard

| Key | Action |
| --- | --- |
| `Enter` | Toggle the disclosure open or closed when Trigger is focused. |
| `Space` | Toggle the disclosure open or closed when Trigger is focused. |
| `Tab` | Move focus to the next focusable element. |
| `Shift` + `Tab` | Move focus to the previous focusable element. |

## Accessibility

- Trigger exposes `role="button"`, `type="button"`, `aria-expanded`, and `aria-controls`.
- Content receives an ID that matches Trigger `aria-controls`.
- Closed content is hidden and marked `aria-hidden="true"`.
- Click, Enter, and Space toggle the disclosure unless the activation event is prevented or the Trigger is disabled.
