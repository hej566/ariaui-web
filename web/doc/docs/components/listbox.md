# Listbox

An accessible listbox with single and multiple selection, grouping, and typeahead.

## Features

- **Single and multiple selection**
- **Grouped options with accessible labels**
- **Native overflow through a measured Viewport**
- **Nested submenus with flipping position**
- **Arrow navigation, Home, End, and typeahead**
- **Active descendant and disabled option reflection**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/listbox
```

```bash [pnpm]
pnpm add @ariaui-web/listbox
```

```bash [yarn]
yarn add @ariaui-web/listbox
```

:::

### Register Elements

```ts
import { defineListboxElements } from "@ariaui-web/listbox";

defineListboxElements();
```

## Examples

The examples use the same content and interaction patterns as the source Aria UI Listbox page with browser-native custom elements.

### Basic

<div class="ariaui-web-preview" data-component="listbox" data-example-variant="basic">
<aria-listbox class="ariaui-web-listbox-root" data-example-part="Root" default-value="apple">
  <aria-listbox-label class="sr-only">Choose a fruit</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content" data-example-part="Content">
    <aria-listbox-group class="ariaui-web-listbox-group" data-example-part="Group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label" data-example-part="GroupLabel">Fruits</aria-listbox-group-label>
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
    </aria-listbox-group>
  </aria-listbox-content>
</aria-listbox>
</div>

```html
<aria-listbox class="ariaui-web-listbox-root" data-example-part="Root" default-value="apple">
  <aria-listbox-label class="sr-only">Choose a fruit</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content" data-example-part="Content">
    <aria-listbox-group class="ariaui-web-listbox-group" data-example-part="Group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label" data-example-part="GroupLabel">Fruits</aria-listbox-group-label>
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
    </aria-listbox-group>
  </aria-listbox-content>
</aria-listbox>
```

### Max visible items

<div class="ariaui-web-preview" data-component="listbox" data-example-variant="max-visible-items">
<aria-listbox class="ariaui-web-listbox-root" default-value="apple">
  <aria-listbox-label class="sr-only">Choose a fruit</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content">
    <aria-listbox-viewport class="ariaui-web-listbox-viewport" max-visible-items="3">
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="mango">Mango</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="kiwi">Kiwi</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="lemon">Lemon</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="peach">Peach</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="pear">Pear</aria-listbox-option>
    </aria-listbox-viewport>
  </aria-listbox-content>
</aria-listbox>
</div>

```html
<aria-listbox class="ariaui-web-listbox-root" default-value="apple">
  <aria-listbox-label class="sr-only">Choose a fruit</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content">
    <aria-listbox-viewport class="ariaui-web-listbox-viewport" max-visible-items="3">
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="mango">Mango</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="kiwi">Kiwi</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="lemon">Lemon</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="peach">Peach</aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="pear">Pear</aria-listbox-option>
    </aria-listbox-viewport>
  </aria-listbox-content>
</aria-listbox>
```

### Single selection with submenu

<div class="ariaui-web-preview" data-component="listbox" data-example-variant="single-submenu">
<aria-listbox class="ariaui-web-listbox-root">
  <aria-listbox-label class="sr-only">Choose food</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content">
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">Fruits</aria-listbox-group-label>
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
    </aria-listbox-group>
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">More</aria-listbox-group-label>
      <aria-listbox-sub offset-y="-5">
        <aria-listbox-sub-trigger class="ariaui-web-listbox-sub-trigger">Vegetables<svg class="ariaui-web-listbox-chevron" viewBox="0 0 15 15" aria-hidden="true"><path d="M6 11L10 7.5L6 4" stroke-linecap="round" stroke-linejoin="round"></path></svg></aria-listbox-sub-trigger>
        <aria-listbox-sub-content class="ariaui-web-listbox-sub-content" hidden>
          <aria-listbox-option class="ariaui-web-listbox-option" value="carrot">Carrot<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
          <aria-listbox-option class="ariaui-web-listbox-option" value="potato">Potato<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
        </aria-listbox-sub-content>
      </aria-listbox-sub>
    </aria-listbox-group>
  </aria-listbox-content>
</aria-listbox>
</div>

```html
<aria-listbox class="ariaui-web-listbox-root">
  <aria-listbox-label class="sr-only">Choose food</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content">
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">Fruits</aria-listbox-group-label>
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
    </aria-listbox-group>
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">More</aria-listbox-group-label>
      <aria-listbox-sub offset-y="-5">
        <aria-listbox-sub-trigger class="ariaui-web-listbox-sub-trigger">Vegetables<svg class="ariaui-web-listbox-chevron" viewBox="0 0 15 15" aria-hidden="true"><path d="M6 11L10 7.5L6 4" stroke-linecap="round" stroke-linejoin="round"></path></svg></aria-listbox-sub-trigger>
        <aria-listbox-sub-content class="ariaui-web-listbox-sub-content" hidden>
          <aria-listbox-option class="ariaui-web-listbox-option" value="carrot">Carrot<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
          <aria-listbox-option class="ariaui-web-listbox-option" value="potato">Potato<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
        </aria-listbox-sub-content>
      </aria-listbox-sub>
    </aria-listbox-group>
  </aria-listbox-content>
</aria-listbox>
```

### Multiple selection with submenu

<div class="ariaui-web-preview" data-component="listbox" data-example-variant="multiple-submenu">
<aria-listbox class="ariaui-web-listbox-root" selection-mode="multiple">
  <aria-listbox-label class="sr-only">Choose food</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content">
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">Fruits</aria-listbox-group-label>
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
    </aria-listbox-group>
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">More</aria-listbox-group-label>
      <aria-listbox-sub offset-y="-5">
        <aria-listbox-sub-trigger class="ariaui-web-listbox-sub-trigger">Vegetables<svg class="ariaui-web-listbox-chevron" viewBox="0 0 15 15" aria-hidden="true"><path d="M6 11L10 7.5L6 4" stroke-linecap="round" stroke-linejoin="round"></path></svg></aria-listbox-sub-trigger>
        <aria-listbox-sub-content class="ariaui-web-listbox-sub-content" hidden>
          <aria-listbox-option class="ariaui-web-listbox-option" value="carrot">Carrot<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
          <aria-listbox-option class="ariaui-web-listbox-option" value="potato">Potato<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
        </aria-listbox-sub-content>
      </aria-listbox-sub>
    </aria-listbox-group>
  </aria-listbox-content>
</aria-listbox>
</div>

```html
<aria-listbox class="ariaui-web-listbox-root" selection-mode="multiple">
  <aria-listbox-label class="sr-only">Choose food</aria-listbox-label>
  <aria-listbox-content class="ariaui-web-listbox-content">
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">Fruits</aria-listbox-group-label>
      <aria-listbox-option class="ariaui-web-listbox-option" value="apple">Apple<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="banana">Banana<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
      <aria-listbox-option class="ariaui-web-listbox-option" value="orange">Orange<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
    </aria-listbox-group>
    <aria-listbox-group class="ariaui-web-listbox-group">
      <aria-listbox-group-label class="ariaui-web-listbox-group-label">More</aria-listbox-group-label>
      <aria-listbox-sub offset-y="-5">
        <aria-listbox-sub-trigger class="ariaui-web-listbox-sub-trigger">Vegetables<svg class="ariaui-web-listbox-chevron" viewBox="0 0 15 15" aria-hidden="true"><path d="M6 11L10 7.5L6 4" stroke-linecap="round" stroke-linejoin="round"></path></svg></aria-listbox-sub-trigger>
        <aria-listbox-sub-content class="ariaui-web-listbox-sub-content" hidden>
          <aria-listbox-option class="ariaui-web-listbox-option" value="carrot">Carrot<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
          <aria-listbox-option class="ariaui-web-listbox-option" value="potato">Potato<span class="ariaui-web-listbox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-listbox-option>
        </aria-listbox-sub-content>
      </aria-listbox-sub>
    </aria-listbox-group>
  </aria-listbox-content>
</aria-listbox>
```

## Anatomy

```html
<aria-listbox>
  <aria-listbox-label>Choose an option</aria-listbox-label>
  <aria-listbox-content>
    <aria-listbox-group>
      <aria-listbox-group-label>Group</aria-listbox-group-label>
      <aria-listbox-option value="option">Option</aria-listbox-option>
    </aria-listbox-group>
    <aria-listbox-viewport max-visible-items="3"></aria-listbox-viewport>
    <aria-listbox-sub>
      <aria-listbox-sub-trigger>More</aria-listbox-sub-trigger>
      <aria-listbox-sub-content></aria-listbox-sub-content>
    </aria-listbox-sub>
  </aria-listbox-content>
</aria-listbox>
```

## API Reference

### Root

| API | Type | Description |
| --- | --- | --- |
| `value` | `string` | Reflected comma-separated selection. |
| `default-value` | `string` | Initial uncontrolled selection. |
| `selection-mode` | `single \| multiple` | Selection behavior; defaults to `single`. |
| `valuechange` | `CustomEvent` | Bubbling composed event with `detail.value` and `detail.values`. |

### Label

`aria-listbox-label` supplies the accessible name for the primary Content. An authored `id` is preserved; otherwise the element receives a stable generated ID.

### Content

| API | Value | Description |
| --- | --- | --- |
| Default role | `listbox` | Owns the selectable options and keyboard behavior. |
| `tabindex` | `0` | Places the listbox in the tab order. |
| `aria-labelledby` | Label ID | References the owning Label. |
| `aria-activedescendant` | active item ID | Tracks the current Option or SubTrigger. |
| `aria-multiselectable` | `true \| false` | Reflects Root's selection mode. |

### Viewport

| Attribute | Type | Description |
| --- | --- | --- |
| `max-visible-items` | positive number | Measures the first option row and enables native vertical overflow. |

### Option

| Attribute | Type | Description |
| --- | --- | --- |
| `value` | `string` | Unique selection value. |
| `disabled` | boolean | Prevents selection while preserving keyboard reachability. |

Options expose `role="option"` and reflect selection, disabled, and active state through ARIA and data attributes.

### Group

`aria-listbox-group` exposes `role="group"` and references its GroupLabel through `aria-labelledby`.

### GroupLabel

`aria-listbox-group-label` supplies the accessible name for its owning Group. An authored `id` is preserved; otherwise the element receives a stable generated ID.

### Sub

| API | Type | Description |
| --- | --- | --- |
| `offset-x` | number | Horizontal submenu offset in CSS pixels. |
| `offset-y` | number | Vertical submenu offset in CSS pixels. |
| `offset` | `{ x: number; y: number }` | Property form of the two offsets. |

### SubTrigger

| Attribute | Value | Description |
| --- | --- | --- |
| `disabled` | boolean | Prevents the submenu from opening. |
| `aria-haspopup` | `listbox` | Announces the nested Listbox popup. |
| `aria-expanded` | `true \| false` | Reflects Sub's open state. |
| `aria-controls` | SubContent ID | Associates the trigger with its submenu. |

### SubContent

`aria-listbox-sub-content` exposes `role="listbox"`, is labelled by SubTrigger, and remains hidden while Sub is closed. In single-selection mode, choosing a nested Option closes the submenu and restores focus to SubTrigger; multiple-selection mode keeps it open.

## Keyboard

| Key | Behavior |
| --- | --- |
| ArrowDown | Move to the next item and wrap. |
| ArrowUp | Move to the previous item and wrap. |
| Home | Move to the first item. |
| End | Move to the last item. |
| Enter | Select the active option or open the active submenu. |
| Space | Select or toggle the active option, or open the active submenu. |
| ArrowRight | Open the active submenu and focus its first option. |
| ArrowLeft | Close SubContent and restore SubTrigger focus. |
| Escape | Close SubContent and restore SubTrigger focus. |
| Printable characters | Run case-insensitive prefix typeahead with a 500 ms reset. |

## Accessibility

Content implements the WAI-ARIA Listbox pattern and references Label with `aria-labelledby`. Options reflect selected and disabled state. Groups reference GroupLabel. SubTrigger exposes `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`, while SubContent retains listbox semantics.
