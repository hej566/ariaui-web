# Combobox

A composable searchable selection primitive with filtering, keyboard navigation, and single or multi-select modes.

## Features

- Trigger-owned `role="combobox"` wiring with popup listbox state.
- Search input filtering with grouped options and fallback content.
- Single selection, multi-selection, removable tags, and overflow tags.
- Keyboard navigation with Arrow keys, Home, End, Enter, Escape, and Backspace removal.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/combobox
```

```bash [pnpm]
pnpm add @ariaui-web/combobox
```

```bash [yarn]
yarn add @ariaui-web/combobox
```

:::

```ts
import { defineComboboxElements } from "@ariaui-web/combobox";

defineComboboxElements();
```

## Examples

### Grouped options

<div class="ariaui-web-preview flex justify-center overflow-visible bg-background py-12 sm:px-12" data-component="combobox" data-example-variant="grouped-options">
  <aria-combobox class="ariaui-web-combobox-root" data-example-part="Root">
    <aria-combobox-trigger class="ariaui-web-combobox-trigger">
      <span class="ariaui-web-combobox-trigger-label" data-combobox-trigger-label></span>
      <aria-combobox-input class="ariaui-web-combobox-input" placeholder="Search..."></aria-combobox-input>
      <aria-combobox-button class="ariaui-web-combobox-button" aria-label="Open" data-example-part="Button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-combobox-button>
    </aria-combobox-trigger>
    <aria-combobox-content class="ariaui-web-combobox-content" data-example-part="Content">
      <aria-combobox-group class="ariaui-web-combobox-group" data-example-part="Group">
        <aria-combobox-label class="ariaui-web-combobox-label">Fruits</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Apple" data-combobox-label="Apple">Apple<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Banana" data-combobox-label="Banana">Banana<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Orange" data-combobox-label="Orange">Orange<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Mango" data-combobox-label="Mango">Mango<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div class="ariaui-web-combobox-separator"></div>
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Animals</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Dog" data-combobox-label="Dog">Dog<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Cat" data-combobox-label="Cat">Cat<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Cow" data-combobox-label="Cow">Cow<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div data-combobox-fallback hidden>No items found</div>
    </aria-combobox-content>
  </aria-combobox>
</div>

### Framer Motion

<div class="ariaui-web-preview flex justify-center overflow-visible bg-background py-12 sm:px-12" data-component="combobox" data-example-variant="framer-motion">
  <aria-combobox class="ariaui-web-combobox-root">
    <aria-combobox-trigger class="ariaui-web-combobox-trigger">
      <span class="ariaui-web-combobox-trigger-label" data-combobox-trigger-label></span>
      <aria-combobox-input class="ariaui-web-combobox-input" placeholder="Search..."></aria-combobox-input>
      <aria-combobox-button class="ariaui-web-combobox-button" aria-label="Open">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-combobox-button>
    </aria-combobox-trigger>
    <aria-combobox-content class="ariaui-web-combobox-content" force-mount>
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Fruits</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Apple" data-combobox-label="Apple">Apple<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Banana" data-combobox-label="Banana">Banana<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Orange" data-combobox-label="Orange">Orange<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Mango" data-combobox-label="Mango">Mango<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div class="ariaui-web-combobox-separator"></div>
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Animals</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Dog" data-combobox-label="Dog">Dog<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Cat" data-combobox-label="Cat">Cat<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Cow" data-combobox-label="Cow">Cow<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div data-combobox-fallback hidden>No items found</div>
    </aria-combobox-content>
  </aria-combobox>
</div>

### User selector

<div class="ariaui-web-preview flex justify-center overflow-visible bg-background py-12 sm:px-12" data-component="combobox" data-example-variant="user-selector">
  <aria-combobox class="ariaui-web-combobox-root">
    <aria-combobox-trigger class="ariaui-web-combobox-trigger">
      <aria-combobox-tag-group class="ariaui-web-combobox-tag-group"></aria-combobox-tag-group>
      <aria-combobox-input class="ariaui-web-combobox-input" placeholder="Search..."></aria-combobox-input>
      <aria-combobox-button class="ariaui-web-combobox-button" aria-label="Open">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-combobox-button>
    </aria-combobox-trigger>
    <aria-combobox-content class="ariaui-web-combobox-content">
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-option class="ariaui-web-combobox-option" value="shadcn" data-combobox-label="shadcn" data-combobox-avatar="https://github.com/shadcn.png"><img src="https://github.com/shadcn.png" alt="" class="ariaui-web-combobox-avatar"><span>shadcn</span><span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="leerob" data-combobox-label="leerob" data-combobox-avatar="https://github.com/leerob.png"><img src="https://github.com/leerob.png" alt="" class="ariaui-web-combobox-avatar"><span>leerob</span><span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="evilrabbit" data-combobox-label="evilrabbit" data-combobox-avatar="https://github.com/evilrabbit.png"><img src="https://github.com/evilrabbit.png" alt="" class="ariaui-web-combobox-avatar"><span>evilrabbit</span><span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div data-combobox-fallback hidden>No users found</div>
    </aria-combobox-content>
  </aria-combobox>
</div>

### Multi-select

<div class="ariaui-web-preview flex justify-center overflow-visible bg-background py-12 sm:px-12" data-component="combobox" data-example-variant="multi-select">
  <aria-combobox class="ariaui-web-combobox-root" selection-mode="multiple">
    <aria-combobox-trigger class="ariaui-web-combobox-trigger">
      <div class="ariaui-web-combobox-selection-group">
        <aria-combobox-tag-group class="ariaui-web-combobox-tag-group"></aria-combobox-tag-group>
        <aria-combobox-input class="ariaui-web-combobox-input" placeholder="Search..."></aria-combobox-input>
      </div>
      <aria-combobox-button class="ariaui-web-combobox-button" aria-label="Open">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-combobox-button>
    </aria-combobox-trigger>
    <aria-combobox-content class="ariaui-web-combobox-content">
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Fruits</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Apple" data-combobox-label="Apple">Apple<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Banana" data-combobox-label="Banana">Banana<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Cherry" data-combobox-label="Cherry">Cherry<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div class="ariaui-web-combobox-separator"></div>
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Vegetables</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Broccoli" data-combobox-label="Broccoli">Broccoli<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Carrot" data-combobox-label="Carrot">Carrot<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Spinach" data-combobox-label="Spinach">Spinach<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div data-combobox-fallback hidden>No items found</div>
    </aria-combobox-content>
  </aria-combobox>
</div>

### Multi-select (Advanced)

<div class="ariaui-web-preview flex justify-center overflow-visible bg-background py-12 sm:px-12" data-component="combobox" data-example-variant="multiple-advanced">
  <aria-combobox class="ariaui-web-combobox-root" selection-mode="multiple" data-combobox-overflow-limit="2">
    <aria-combobox-trigger class="ariaui-web-combobox-trigger">
      <div class="ariaui-web-combobox-advanced-selection-group">
        <aria-combobox-tag-group class="ariaui-web-combobox-advanced-tag-group"></aria-combobox-tag-group>
        <aria-combobox-input class="ariaui-web-combobox-input" placeholder="Search..."></aria-combobox-input>
      </div>
      <aria-combobox-button class="ariaui-web-combobox-button" aria-label="Open">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-combobox-button>
    </aria-combobox-trigger>
    <aria-combobox-content class="ariaui-web-combobox-content">
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Fruits</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Apple" data-combobox-label="Apple">Apple<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Banana" data-combobox-label="Banana">Banana<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Cherry" data-combobox-label="Cherry">Cherry<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div class="ariaui-web-combobox-separator"></div>
      <aria-combobox-group class="ariaui-web-combobox-group">
        <aria-combobox-label class="ariaui-web-combobox-label">Vegetables</aria-combobox-label>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Broccoli" data-combobox-label="Broccoli">Broccoli<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Carrot" data-combobox-label="Carrot">Carrot<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
        <aria-combobox-option class="ariaui-web-combobox-option" value="Spinach" data-combobox-label="Spinach">Spinach<span class="ariaui-web-combobox-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg></span></aria-combobox-option>
      </aria-combobox-group>
      <div data-combobox-fallback hidden>No items found</div>
    </aria-combobox-content>
  </aria-combobox>
</div>

## Anatomy

```html
<aria-combobox>
  <aria-combobox-trigger>
    <aria-combobox-input></aria-combobox-input>
    <aria-combobox-button></aria-combobox-button>
  </aria-combobox-trigger>
  <aria-combobox-content>
    <aria-combobox-group>
      <aria-combobox-label></aria-combobox-label>
      <aria-combobox-option value="Apple"></aria-combobox-option>
    </aria-combobox-group>
  </aria-combobox-content>
</aria-combobox>
```

## API Reference

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-combobox` | none |
| Trigger | `aria-combobox-trigger` | `combobox` |
| Input | `aria-combobox-input` | `textbox` |
| Button | `aria-combobox-button` | `button` |
| Content | `aria-combobox-content` | `listbox` |
| Group | `aria-combobox-group` | `group` |
| Label | `aria-combobox-label` | none |
| Option | `aria-combobox-option` | `option` |
| TagGroup | `aria-combobox-tag-group` | none |
| Tag | `aria-combobox-tag` | none |

`aria-combobox` supports `value`, `default-value`, `input-value`, `default-input-value`, `open`, `default-open`, `disabled`, and `selection-mode="single | multiple"`.

## Keyboard Interactions

| Key | Behavior |
| --- | --- |
| `ArrowDown` | Opens the listbox and moves to the next visible option. |
| `ArrowUp` | Opens the listbox and moves to the previous visible option. |
| `Home` | Moves to the first visible enabled option. |
| `End` | Moves to the last visible enabled option. |
| `Enter` | Selects the active option. |
| `Escape` | Closes the listbox. |
| `Backspace` | Removes the last selected value when the input is empty. |

## Accessibility

The trigger owns `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls` while open. The input exposes `aria-autocomplete="list"` and tracks the active option through `aria-activedescendant`. The content exposes `role="listbox"` and `aria-multiselectable` in multiple mode, while options reflect `aria-selected`, `data-state`, `data-active`, and disabled state.
