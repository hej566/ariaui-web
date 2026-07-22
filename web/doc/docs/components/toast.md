# Toast

A headless, accessible toast system with an imperative global queue, polite live-region announcements, and focus-friendly auto-dismiss.

## Features

- **Global imperative queue**
- **No context plumbing**
- **Polite live region**
- **Paused auto-dismiss timers**
- **Focus restoration**
- **Composable parts**

## Usage

Mount one `aria-toast-list` near the root of your app or page. Calls to `createToast` add items to the queue, and the mounted list subscribes to that queue to render the toast items.

Keep the list outside the button or form that creates a toast. The trigger only calls `createToast`; the list owns placement, stacking, visibility limits, and enter or exit state.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/toast @ariaui-web/portal
```

```bash [pnpm]
pnpm add @ariaui-web/toast @ariaui-web/portal
```

```bash [yarn]
yarn add @ariaui-web/toast @ariaui-web/portal
```

:::

```ts
import { defineToastElements } from "@ariaui-web/toast";
import { definePortalElements } from "@ariaui-web/portal";

defineToastElements();
definePortalElements();
```

## Examples

The example mounts one stacked list and moves it between six viewport positions while preserving the upstream styling and queue behavior.

### List

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="toast" data-example-variant="list" data-toast-example="positions">
  <div class="ariaui-web-toast-position-grid grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
    <button type="button" data-toast-position="top-left" aria-pressed="false" class="ariaui-web-toast-position-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Top left</button>
    <button type="button" data-toast-position="top-center" aria-pressed="false" class="ariaui-web-toast-position-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Top center</button>
    <button type="button" data-toast-position="top-right" aria-pressed="true" class="ariaui-web-toast-position-trigger inline-flex h-9 items-center justify-center rounded-md border border-accent bg-accent px-3 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent-hover">Top right</button>
    <button type="button" data-toast-position="bottom-left" aria-pressed="false" class="ariaui-web-toast-position-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Bottom left</button>
    <button type="button" data-toast-position="bottom-center" aria-pressed="false" class="ariaui-web-toast-position-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Bottom center</button>
    <button type="button" data-toast-position="bottom-right" aria-pressed="false" class="ariaui-web-toast-position-trigger inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Bottom right</button>
  </div>
  <aria-portal>
    <aria-toast-list stack stack-offset="14" stack-scale-step="0.08" visible-toasts="3" data-toast-example-list data-position="top-right" class="ariaui-web-toast-list pointer-events-none fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4 data-[expanded=true]:pointer-events-auto data-[expanded=false]:grid data-[expanded=false]:gap-0 md:max-w-[420px]"></aria-toast-list>
  </aria-portal>
</div>

```html
<div class="grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
  <button type="button" data-toast-position="top-left">Top left</button>
  <button type="button" data-toast-position="top-center">Top center</button>
  <button type="button" data-toast-position="top-right" aria-pressed="true">Top right</button>
  <button type="button" data-toast-position="bottom-left">Bottom left</button>
  <button type="button" data-toast-position="bottom-center">Bottom center</button>
  <button type="button" data-toast-position="bottom-right">Bottom right</button>
</div>
<aria-portal>
  <aria-toast-list
    stack
    stack-offset="14"
    stack-scale-step="0.08"
    visible-toasts="3"
    class="pointer-events-none fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4 data-[expanded=true]:pointer-events-auto data-[expanded=false]:grid data-[expanded=false]:gap-0 md:max-w-[420px]"
  ></aria-toast-list>
</aria-portal>
<script type="module">
  import {
    createToast,
    defineToastElements,
  } from "@ariaui-web/toast";
  import { definePortalElements } from "@ariaui-web/portal";

  defineToastElements();
  definePortalElements();

  const list = document.querySelector("aria-toast-list");
  let position = "top-right";
  let dismissers = [];

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-toast-position]");
    if (!trigger) return;

    const nextPosition = trigger.dataset.toastPosition;
    if (nextPosition !== position) {
      dismissers.forEach((dismiss) => dismiss());
      dismissers = [];
      position = nextPosition;
    }
    list.dataset.position = position;

    const edge = position.startsWith("top") ? "top" : "bottom";
    const item = document.createElement("aria-toast-item");
    item.className = edge === "top"
      ? "origin-top data-[mounted=false]:[--toast-y:-100vh]"
      : "origin-bottom data-[mounted=false]:[--toast-y:100vh]";
    item.innerHTML = `
      <div class="grid min-w-0 flex-1 gap-0.5">
        <h3>${trigger.textContent.trim()} toast</h3>
        <p>The mounted list moves notifications in from the ${edge}.</p>
      </div>
      <aria-toast-close aria-label="Dismiss notification">&#215;</aria-toast-close>`;

    const dismiss = createToast({
      id: `toast-${Date.now()}`,
      duration: 5000,
      template: item,
    });
    dismissers.unshift(dismiss);
  });
</script>
```

## Anatomy

```html
<aria-toast-list>
  <aria-toast-item>
    Notification content
    <aria-toast-close aria-label="Dismiss notification"></aria-toast-close>
  </aria-toast-item>
</aria-toast-list>
```

## API Reference

### createToast

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Stable queue identifier. |
| `template` | `HTMLElement \| HTMLTemplateElement \| () => HTMLElement` | required | Native `aria-toast-item` template cloned into every mounted list. |
| `duration` | `number` | `3000` | Auto-dismiss delay in milliseconds. |

### List

| Attribute / property | Type | Default | Description |
| --- | --- | --- | --- |
| `stack` | `boolean` | `false` | Enables layered stack metadata. |
| `visible-toasts` | `number` | `3` | Queue limit or collapsed visible count. |
| `stack-offset` | `number` | `14` | Distance between collapsed layers. |
| `stack-scale-step` | `number` | `0.08` | Scale reduction for each collapsed layer. |
| `trigger` | `HTMLElement \| null` | `null` | Routes Tab to the list and receives restored focus. |

### Item

`aria-toast-item` has `role="status"`, pauses its timer on hover or focus, and reflects list-managed lifecycle state through `data-*` attributes and `--toast-*` CSS variables.

### Close

`aria-toast-close` dismisses its owning item through pointer, Enter, or Space activation.

## Keyboard

| Key | Context | Behavior |
| --- | --- | --- |
| Tab | Trigger assigned through `List.trigger` | Moves focus to the toast list. |
| Enter | Close | Dismisses the toast. |
| Space | Close | Dismisses the toast. |

Escape dismissal and arrow-key navigation between toast items are not implemented.

## Accessibility

- `aria-toast-list` is the live region with `role="region"`, `aria-live="polite"`, and `aria-label="Notifications"`.
- Each item has `role="status"`, `aria-live="off"`, and `aria-atomic="true"`, avoiding duplicate announcements.
- Auto-dismiss pauses when the list or item is hovered and when an item receives focus.
- Keep toast content short and action-focused, and give icon-only close controls an accessible name.
- Use a dedicated alert for assertive errors instead of changing routine notifications to `aria-live="assertive"`.
