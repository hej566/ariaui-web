---
title: Popover
description: A headless, accessible popover with smart positioning, optional arrow, and optional modal focus trap.
---

# Popover

A headless, accessible popover with smart positioning, optional arrow, and optional modal focus trap.

## Features

- **Controlled or uncontrolled**
- **Modal or non-modal**
- **Flexible placement**
- **Optional arrow**
- **Automatic focus management**
- **Escape and outside-click dismissal**
- **Top-layer rendering**
- **Accessible labelling**

## Installation

```bash
pnpm add @ariaui-web/popover
```

Register the Popover custom elements once in your browser entry point:

```ts
import { definePopoverElements } from "@ariaui-web/popover";

definePopoverElements();
```

## Examples

### Popover

<div class="ariaui-web-preview" data-component="popover" data-example-variant="default">
  <aria-popover class="ariaui-web-popover-example" placement="bottom" offset="8">
    <aria-popover-trigger class="ariaui-web-popover-trigger" aria-label="Update dimensions">
      <svg class="ariaui-web-popover-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
      Dimensions
    </aria-popover-trigger>
    <aria-popover-content class="ariaui-web-popover-content" arrow arrow-class="ariaui-web-popover-arrow">
      <div class="ariaui-web-popover-stack">
        <div class="ariaui-web-popover-header">
          <aria-popover-heading class="ariaui-web-popover-heading">Dimensions</aria-popover-heading>
          <aria-popover-description class="ariaui-web-popover-description">Set the dimensions for the layer.</aria-popover-description>
        </div>
        <div class="ariaui-web-popover-form-grid">
          <div class="ariaui-web-popover-field-row">
            <label for="popover-width">Width</label>
            <input id="popover-width" class="ariaui-web-popover-field" value="100%" />
          </div>
          <div class="ariaui-web-popover-field-row">
            <label for="popover-max-width">Max. width</label>
            <input id="popover-max-width" class="ariaui-web-popover-field" value="300px" />
          </div>
          <div class="ariaui-web-popover-field-row">
            <label for="popover-height">Height</label>
            <input id="popover-height" class="ariaui-web-popover-field" value="25px" />
          </div>
          <div class="ariaui-web-popover-field-row">
            <label for="popover-max-height">Max. height</label>
            <input id="popover-max-height" class="ariaui-web-popover-field" value="none" />
          </div>
        </div>
      </div>
      <aria-popover-close class="ariaui-web-popover-close" aria-label="Close">
        <svg class="ariaui-web-popover-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </aria-popover-close>
    </aria-popover-content>
  </aria-popover>
</div>

```html
<aria-popover class="ariaui-web-popover-example" placement="bottom" offset="8">
  <aria-popover-trigger class="ariaui-web-popover-trigger" aria-label="Update dimensions">
    <svg class="ariaui-web-popover-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
    Dimensions
  </aria-popover-trigger>
  <aria-popover-content class="ariaui-web-popover-content" arrow arrow-class="ariaui-web-popover-arrow">
    <div class="ariaui-web-popover-stack">
      <div class="ariaui-web-popover-header">
        <aria-popover-heading class="ariaui-web-popover-heading">Dimensions</aria-popover-heading>
        <aria-popover-description class="ariaui-web-popover-description">Set the dimensions for the layer.</aria-popover-description>
      </div>
      <div class="ariaui-web-popover-form-grid">
        <div class="ariaui-web-popover-field-row">
          <label for="popover-width">Width</label>
          <input id="popover-width" class="ariaui-web-popover-field" value="100%" />
        </div>
        <div class="ariaui-web-popover-field-row">
          <label for="popover-max-width">Max. width</label>
          <input id="popover-max-width" class="ariaui-web-popover-field" value="300px" />
        </div>
        <div class="ariaui-web-popover-field-row">
          <label for="popover-height">Height</label>
          <input id="popover-height" class="ariaui-web-popover-field" value="25px" />
        </div>
        <div class="ariaui-web-popover-field-row">
          <label for="popover-max-height">Max. height</label>
          <input id="popover-max-height" class="ariaui-web-popover-field" value="none" />
        </div>
      </div>
    </div>
    <aria-popover-close class="ariaui-web-popover-close" aria-label="Close">
      <svg class="ariaui-web-popover-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </aria-popover-close>
  </aria-popover-content>
</aria-popover>
```

### Framer Motion

<div class="ariaui-web-preview" data-component="popover" data-example-variant="framer-motion">
  <aria-popover class="ariaui-web-popover-example" placement="bottom" offset="10">
    <aria-popover-trigger class="ariaui-web-popover-trigger" aria-label="Open motion popover">
      <svg class="ariaui-web-popover-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
      </svg>
      Motion Popover
    </aria-popover-trigger>
    <aria-popover-content class="ariaui-web-popover-content ariaui-web-popover-motion-content" arrow force-mount arrow-class="ariaui-web-popover-arrow">
      <div class="ariaui-web-popover-motion-stack">
        <div class="ariaui-web-popover-motion-header">
          <span class="ariaui-web-popover-motion-icon-shell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>
          </span>
          <div class="ariaui-web-popover-header">
            <aria-popover-heading class="ariaui-web-popover-heading">Release checks</aria-popover-heading>
            <aria-popover-description class="ariaui-web-popover-description">Animated content is slotted onto a native custom-element host.</aria-popover-description>
          </div>
        </div>
        <div class="ariaui-web-popover-motion-list">
          <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Design tokens</div>
          <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Keyboard paths</div>
          <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Docs preview</div>
        </div>
      </div>
      <aria-popover-close class="ariaui-web-popover-close" aria-label="Close">
        <svg class="ariaui-web-popover-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </aria-popover-close>
    </aria-popover-content>
  </aria-popover>
</div>

```html
<aria-popover class="ariaui-web-popover-example" placement="bottom" offset="10">
  <aria-popover-trigger class="ariaui-web-popover-trigger" aria-label="Open motion popover">
    <svg class="ariaui-web-popover-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
    Motion Popover
  </aria-popover-trigger>
  <aria-popover-content class="ariaui-web-popover-content ariaui-web-popover-motion-content" arrow force-mount arrow-class="ariaui-web-popover-arrow">
    <div class="ariaui-web-popover-motion-stack">
      <div class="ariaui-web-popover-motion-header">
        <span class="ariaui-web-popover-motion-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
          </svg>
        </span>
        <div class="ariaui-web-popover-header">
          <aria-popover-heading class="ariaui-web-popover-heading">Release checks</aria-popover-heading>
          <aria-popover-description class="ariaui-web-popover-description">Animated content is slotted onto a native custom-element host.</aria-popover-description>
        </div>
      </div>
      <div class="ariaui-web-popover-motion-list">
        <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Design tokens</div>
        <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Keyboard paths</div>
        <div class="ariaui-web-popover-motion-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>Docs preview</div>
      </div>
    </div>
    <aria-popover-close class="ariaui-web-popover-close" aria-label="Close">
      <svg class="ariaui-web-popover-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </aria-popover-close>
  </aria-popover-content>
</aria-popover>
```

## Anatomy

```html
<aria-popover placement="bottom" offset="10">
  <aria-popover-trigger>Open popover</aria-popover-trigger>
  <aria-popover-content arrow>
    <aria-popover-heading>Popover heading</aria-popover-heading>
    <aria-popover-description>Popover description</aria-popover-description>
    <aria-popover-close aria-label="Close">Close</aria-popover-close>
  </aria-popover-content>
</aria-popover>
```

## API Reference

### Root

Context provider and state container for the popover. Manages open state, positioning, and modal behavior.

| Attribute / event | Default | Description |
| --- | --- | --- |
| `open` | closed | Controlled open state. |
| `default-open` | `false` | Uncontrolled initial open state. |
| `modal` | `false` | Traps focus in Content and marks it as modal when present. |
| `placement` | `bottom` | Preferred placement of Content relative to Trigger. |
| `offset` | `10` | Pixel offset between Trigger and Content along the placement axis. |
| `openchange` | — | Cancelable bubbling event with `event.detail.open` and `event.detail.source`. |

### Trigger

Button-like custom element that toggles the popover open and closed.

| Attribute | Value |
| --- | --- |
| `aria-haspopup` | `dialog` |
| `aria-expanded` | `true` when open, `false` when closed |
| `aria-controls` | ID of the Content element while open |
| `data-state` | `open` or `closed` |

### Content

Floating dialog panel containing the popover body. It positions itself against Trigger and hides when closed unless `force-mount` is set.

| Attribute | Default | Description |
| --- | --- | --- |
| `arrow` | absent | Renders an arrow pointing to Trigger. |
| `arrow-class` | — | CSS class applied to the generated arrow element. |
| `loop` | `true` | Wraps keyboard focus from the last focusable element back to the first, and from first back to last. |
| `force-mount` | absent | Keeps Content mounted while closed for animation libraries such as Framer Motion in docs. |
| `native-composition` | absent | Slots dialog, focus, ARIA, and positioning attributes onto a custom host element instead of relying on React `asChild`. |
| `role` | `dialog` | Dialog role reflected by the custom element. |
| `aria-modal` | `true` when modal | Matches Root modality. |
| `aria-labelledby` | Heading ID | Links Content to Heading. |
| `aria-describedby` | Description ID | Links Content to Description. |
| `data-side` | placement side | `top`, `right`, `bottom`, or `left`. |

### Heading

Accessible title for Content. Registered as `aria-labelledby` on Content.

| Attribute | Default | Description |
| --- | --- | --- |
| `native-composition` | absent | Applies heading semantics to a custom host element. |
| `role` | `heading` | Reflected when Heading is the semantic host. |
| `aria-level` | `2` | Reflected when Heading is the semantic host. |

### Description

Accessible description for Content. Registered as `aria-describedby` on Content.

| Attribute | Default | Description |
| --- | --- | --- |
| `id` | generated | Stable ID used by Content when no authored ID is provided. |

### Close

Button-like custom element that requests closure and restores focus to Trigger.

| Attribute / event | Default | Description |
| --- | --- | --- |
| `disabled` | absent | Prevents the close request when present. |
| `click` | — | Cancelable event; preventing it keeps the popover open. |

`openchange` bubbles with `event.detail.open` and `event.detail.source`. Prevent the event to keep state controlled, then set `root.open` yourself when the requested state is accepted.

## Keyboard

| Keys | Action |
| --- | --- |
| <kbd>Enter</kbd> or <kbd>Space</kbd> | When focus is on Trigger, opens the popover and moves focus to the first focusable element in Content. |
| <kbd>Tab</kbd> | Moves focus to the next focusable element. Focus wraps when `loop` is enabled. |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | Moves focus to the previous focusable element. Focus wraps when `loop` is enabled. |
| <kbd>Escape</kbd> | Closes the popover and returns focus to Trigger. |

## Accessibility

Popover follows the [WAI-ARIA Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) with a non-modal mode for lightweight surfaces:

- Trigger exposes `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` pointing at Content while open.
- Content uses `role="dialog"`, reflects `aria-modal` from the `modal` attribute, and exposes `data-side` for styling.
- Heading registers its id through `aria-labelledby`; Description registers through `aria-describedby`.
- With `modal`, focus is trapped in Content and the rest of the page is made inert until closure.
- Without `modal`, focus moves into Content on open and can leave when `loop="false"`.
- Escape and Close return focus to Trigger; outside mouse interaction dismisses the popover.
- The HTML Popover API renders Content in the top layer where supported, avoiding ancestor clipping; the fallback uses fixed viewport positioning.
