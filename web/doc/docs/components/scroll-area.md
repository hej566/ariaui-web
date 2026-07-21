---
title: Scroll Area
description: A headless scroll area primitive that keeps native browser scrolling while exposing composable parts.
---

# Scroll Area

A headless scroll area primitive that keeps native browser scrolling while exposing composable parts.

## Features

- **Native browser scrolling**
- **Composable scrollbar anatomy**
- **Vertical and horizontal orientation hooks**
- **Visibility state data attributes**
- **Token-friendly unstyled parts**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/scroll-area
```

```bash [pnpm]
pnpm add @ariaui-web/scroll-area
```

```bash [yarn]
yarn add @ariaui-web/scroll-area
```

:::

Register the Scroll Area custom elements once in your browser entry point:

```ts
import { defineScrollAreaElements } from "@ariaui-web/scroll-area";

defineScrollAreaElements();
```

## Examples

### Default

<div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="default">
  <aria-scroll-area class="ariaui-web-scroll-area-default-root" data-example-part="Root">
    <aria-scroll-area-viewport aria-label="Release tags" class="ariaui-web-scroll-area-default-viewport" data-example-part="Viewport">
      <div class="ariaui-web-scroll-area-tags-shell">
        <p class="ariaui-web-scroll-area-tags-title">Tags</p>
        <div class="ariaui-web-scroll-area-tags" data-scroll-area-tags></div>
      </div>
    </aria-scroll-area-viewport>
    <aria-scroll-area-scrollbar class="ariaui-web-scroll-area-compatibility-part" data-example-part="Scrollbar">
      <aria-scroll-area-thumb data-example-part="Thumb"></aria-scroll-area-thumb>
    </aria-scroll-area-scrollbar>
    <aria-scroll-area-corner class="ariaui-web-scroll-area-compatibility-part" data-example-part="Corner"></aria-scroll-area-corner>
  </aria-scroll-area>
</div>

```html
<aria-scroll-area class="ariaui-web-scroll-area-default-root">
  <aria-scroll-area-viewport
    aria-label="Release tags"
    tabindex="0"
    class="ariaui-web-scroll-area-default-viewport"
  >
    <div class="ariaui-web-scroll-area-tags-shell">
      <p class="ariaui-web-scroll-area-tags-title">Tags</p>
      <div class="ariaui-web-scroll-area-tags">
        <div class="ariaui-web-scroll-area-tag-row">v1.2.0-beta.50</div>
        <!-- Continue through v1.2.0-beta.1. -->
      </div>
    </div>
  </aria-scroll-area-viewport>
</aria-scroll-area>
```

### Horizontal

<div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="horizontal">
  <aria-scroll-area class="ariaui-web-scroll-area-horizontal-root" data-example-part="Root">
    <aria-scroll-area-viewport aria-label="Sprint status" class="ariaui-web-scroll-area-horizontal-viewport" data-example-part="Viewport">
      <div class="ariaui-web-scroll-area-horizontal-track">
        <article class="ariaui-web-scroll-area-horizontal-card"><p class="ariaui-web-scroll-area-card-title">Backlog</p><p class="ariaui-web-scroll-area-card-value">18</p><p class="ariaui-web-scroll-area-card-description">Ready for triage</p></article>
        <article class="ariaui-web-scroll-area-horizontal-card"><p class="ariaui-web-scroll-area-card-title">In progress</p><p class="ariaui-web-scroll-area-card-value">7</p><p class="ariaui-web-scroll-area-card-description">Active this sprint</p></article>
        <article class="ariaui-web-scroll-area-horizontal-card"><p class="ariaui-web-scroll-area-card-title">Review</p><p class="ariaui-web-scroll-area-card-value">4</p><p class="ariaui-web-scroll-area-card-description">Awaiting approval</p></article>
        <article class="ariaui-web-scroll-area-horizontal-card"><p class="ariaui-web-scroll-area-card-title">Blocked</p><p class="ariaui-web-scroll-area-card-value">2</p><p class="ariaui-web-scroll-area-card-description">Needs decision</p></article>
        <article class="ariaui-web-scroll-area-horizontal-card"><p class="ariaui-web-scroll-area-card-title">Done</p><p class="ariaui-web-scroll-area-card-value">31</p><p class="ariaui-web-scroll-area-card-description">Shipped this cycle</p></article>
      </div>
    </aria-scroll-area-viewport>
  </aria-scroll-area>
</div>

```html
<aria-scroll-area class="ariaui-web-scroll-area-horizontal-root">
  <aria-scroll-area-viewport
    aria-label="Sprint status"
    class="ariaui-web-scroll-area-horizontal-viewport"
  >
    <div class="ariaui-web-scroll-area-horizontal-track">
      <article class="ariaui-web-scroll-area-horizontal-card">
        <p class="ariaui-web-scroll-area-card-title">Backlog</p>
        <p class="ariaui-web-scroll-area-card-value">18</p>
        <p class="ariaui-web-scroll-area-card-description">Ready for triage</p>
      </article>
      <!-- Add the remaining sprint status cards. -->
    </div>
  </aria-scroll-area-viewport>
</aria-scroll-area>
```

### Select Menu

<div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="select-menu">
  <aria-scroll-area class="ariaui-web-scroll-area-picker" data-example-part="Root">
    <aria-scroll-area-scroll-up-button aria-label="Scroll options up" class="ariaui-web-scroll-area-picker-button" data-example-part="ScrollUpButton"><span class="ariaui-web-scroll-area-chevron ariaui-web-scroll-area-chevron-up" aria-hidden="true"></span></aria-scroll-area-scroll-up-button>
    <aria-scroll-area-viewport aria-label="Options" role="listbox" max-visible-items="7" anchor-selected class="ariaui-web-scroll-area-picker-viewport" data-example-part="Viewport">
      <div id="scroll-area-option-0" role="option" class="ariaui-web-scroll-area-option">Item 0<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-1" role="option" class="ariaui-web-scroll-area-option">Item 1<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-2" role="option" class="ariaui-web-scroll-area-option">Item 2<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-3" role="option" class="ariaui-web-scroll-area-option">Item 3<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-4" role="option" class="ariaui-web-scroll-area-option">Item 4<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-5" role="option" class="ariaui-web-scroll-area-option">Item 5<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-6" role="option" class="ariaui-web-scroll-area-option">Item 6<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-7" role="option" class="ariaui-web-scroll-area-option">Item 7<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-8" role="option" class="ariaui-web-scroll-area-option">Item 8<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-9" role="option" class="ariaui-web-scroll-area-option">Item 9<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-10" role="option" class="ariaui-web-scroll-area-option">Item 10<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-11" role="option" class="ariaui-web-scroll-area-option">Item 11<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
      <div id="scroll-area-option-12" role="option" class="ariaui-web-scroll-area-option">Item 12<span data-selected-check hidden class="ariaui-web-scroll-area-check" aria-hidden="true">&#10003;</span></div>
    </aria-scroll-area-viewport>
    <aria-scroll-area-scroll-down-button aria-label="Scroll options down" class="ariaui-web-scroll-area-picker-button" data-example-part="ScrollDownButton"><span class="ariaui-web-scroll-area-chevron ariaui-web-scroll-area-chevron-down" aria-hidden="true"></span></aria-scroll-area-scroll-down-button>
  </aria-scroll-area>
</div>

```html
<aria-scroll-area class="ariaui-web-scroll-area-picker">
  <aria-scroll-area-scroll-up-button aria-label="Scroll options up">
    <span aria-hidden="true">&#8963;</span>
  </aria-scroll-area-scroll-up-button>
  <aria-scroll-area-viewport
    aria-label="Options"
    role="listbox"
    max-visible-items="7"
    anchor-selected
  >
    <div id="scroll-area-option-0" role="option">Item 0</div>
    <!-- Continue through Item 12. -->
  </aria-scroll-area-viewport>
  <aria-scroll-area-scroll-down-button aria-label="Scroll options down">
    <span aria-hidden="true">&#8964;</span>
  </aria-scroll-area-scroll-down-button>
</aria-scroll-area>
```

### Framer Motion

<div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="framer-motion">
  <aria-scroll-area class="ariaui-web-scroll-area-picker ariaui-web-scroll-area-motion-picker" data-example-part="Root">
    <aria-scroll-area-scroll-up-button aria-label="Select previous option" class="ariaui-web-scroll-area-picker-button" data-example-part="ScrollUpButton"><span class="ariaui-web-scroll-area-chevron ariaui-web-scroll-area-chevron-up" aria-hidden="true"></span></aria-scroll-area-scroll-up-button>
    <div class="ariaui-web-scroll-area-motion-active" data-motion-active-background aria-hidden="true"></div>
    <aria-scroll-area-viewport native-composition anchor-selected max-visible-items="7" class="ariaui-web-scroll-area-motion-viewport-source" data-example-part="Viewport">
      <div aria-label="Options" role="listbox" class="ariaui-web-scroll-area-picker-viewport ariaui-web-scroll-area-motion-viewport">
        <div id="scroll-area-motion-option-0" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 0</div>
        <div id="scroll-area-motion-option-1" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 1</div>
        <div id="scroll-area-motion-option-2" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 2</div>
        <div id="scroll-area-motion-option-3" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 3</div>
        <div id="scroll-area-motion-option-4" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 4</div>
        <div id="scroll-area-motion-option-5" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 5</div>
        <div id="scroll-area-motion-option-6" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 6</div>
        <div id="scroll-area-motion-option-7" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 7</div>
        <div id="scroll-area-motion-option-8" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 8</div>
        <div id="scroll-area-motion-option-9" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 9</div>
        <div id="scroll-area-motion-option-10" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 10</div>
        <div id="scroll-area-motion-option-11" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 11</div>
        <div id="scroll-area-motion-option-12" role="option" class="ariaui-web-scroll-area-option ariaui-web-scroll-area-motion-option">Item 12</div>
      </div>
    </aria-scroll-area-viewport>
    <aria-scroll-area-scroll-down-button aria-label="Select next option" class="ariaui-web-scroll-area-picker-button" data-example-part="ScrollDownButton"><span class="ariaui-web-scroll-area-chevron ariaui-web-scroll-area-chevron-down" aria-hidden="true"></span></aria-scroll-area-scroll-down-button>
  </aria-scroll-area>
</div>

```ts
import { animate } from "framer-motion/dom";

const viewport = document.querySelector("aria-scroll-area-viewport");
const options = viewport?.querySelectorAll('[role="option"]') ?? [];

function selectOption(index: number) {
  options.forEach((option, optionIndex) => {
    const selected = optionIndex === index;
    option.setAttribute("aria-selected", String(selected));
    animate(
      option,
      {
        x: selected ? 2 : 0,
        opacity: selected ? 1 : 0.76,
        scale: selected ? 1 : 0.985,
      },
      { type: "spring", stiffness: 420, damping: 32 },
    );
  });
}
```

## Anatomy

```html
<aria-scroll-area>
  <aria-scroll-area-viewport></aria-scroll-area-viewport>
  <aria-scroll-area-scroll-up-button></aria-scroll-area-scroll-up-button>
  <aria-scroll-area-scroll-down-button></aria-scroll-area-scroll-down-button>
  <aria-scroll-area-scrollbar>
    <aria-scroll-area-thumb></aria-scroll-area-thumb>
  </aria-scroll-area-scrollbar>
  <aria-scroll-area-corner></aria-scroll-area-corner>
</aria-scroll-area>
```

## API Reference

### Root

Relative overflow shell that provides Scroll Area configuration to descendant parts.

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `hover` | Compatibility visibility mode: `auto`, `always`, `scroll`, `hover`, or `never`. |

### Viewport

Native scroll container. Style its dimensions and native scrollbar from application CSS.

| Attribute | Default | Description |
| --- | --- | --- |
| `native-composition` | `false` | Applies viewport behavior to the first child host. |
| `max-visible-items` | - | Caps height to the first direct row height multiplied by this number. |
| `anchor-selected` | `false` | Centers the selected descendant after layout and selection changes. |
| `data-ariaui-scroll-area-viewport` | `true` | Identifies the effective native scroll container. |

### ScrollUpButton

Button that scrolls the registered Viewport upward.

| Attribute | Default | Description |
| --- | --- | --- |
| `behavior` | `smooth` | Native `scrollBy` behavior. |
| `data-direction` | `up` | Reflected scroll direction. |

### ScrollDownButton

Button that scrolls the registered Viewport downward.

| Attribute | Default | Description |
| --- | --- | --- |
| `behavior` | `smooth` | Native `scrollBy` behavior. |
| `data-direction` | `down` | Reflected scroll direction. |

### Scrollbar

Render-only compatibility rail. Native browser scrollbars provide the scrolling surface.

| Attribute | Default | Description |
| --- | --- | --- |
| `orientation` | `vertical` | Reflected as `data-orientation`. |
| `data-state` | `visible` | Compatibility visibility state. |

### Thumb

Render-only compatibility thumb with `data-state="visible"`.

### Corner

Render-only area where horizontal and vertical compatibility rails meet.

## Accessibility

Scroll Area keeps browser-native scrolling behavior:

- Use Viewport as the actual scroll container and add `aria-label` when the region needs an independent accessible name.
- Compatibility scrollbar parts remain role-neutral; the native scroll container is the accessible control.
- Add `tabindex="0"` only when keyboard users need to focus and scroll a nested region directly.
- Keep content semantics inside Viewport; Scroll Area does not change headings, lists, or landmarks.
