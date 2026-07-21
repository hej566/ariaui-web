---
title: Radio
description: A headless, accessible radio group with roving tabindex, arrow-key selection, and native form support.
---

# Radio

A headless, accessible radio group with roving tabindex, arrow-key selection, and native form support.

## Features

- **Accessible radio groups**
- **Controlled or uncontrolled**
- **Roving tabindex**
- **Item or group disabled state**
- **Native form integration**
- **Composable indicator**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/radio
```

```bash [pnpm]
pnpm add @ariaui-web/radio
```

```bash [yarn]
yarn add @ariaui-web/radio
```

:::

Register the Radio custom elements once in your browser entry point:

```ts
import { defineRadioElements } from "@ariaui-web/radio";

defineRadioElements();
```

## Examples

### Uncontrolled

<div class="ariaui-web-preview" data-component="radio" data-example-variant="uncontrolled">
  <aria-radio default-value="comfortable" aria-label="Density" class="ariaui-web-radio-stack" data-example-part="Root">
    <div class="ariaui-web-radio-row">
      <aria-radio-item id="density-default" value="default" class="ariaui-web-radio-circle" data-example-part="Item">
        <aria-radio-indicator class="ariaui-web-radio-dot" data-example-part="Indicator"></aria-radio-indicator>
      </aria-radio-item>
      <label for="density-default" class="ariaui-web-radio-label">Default</label>
    </div>
    <div class="ariaui-web-radio-row">
      <aria-radio-item id="density-comfortable" value="comfortable" class="ariaui-web-radio-circle" data-example-part="Item">
        <aria-radio-indicator class="ariaui-web-radio-dot" data-example-part="Indicator"></aria-radio-indicator>
      </aria-radio-item>
      <label for="density-comfortable" class="ariaui-web-radio-label">Comfortable</label>
    </div>
    <div class="ariaui-web-radio-row">
      <aria-radio-item id="density-compact" value="compact" class="ariaui-web-radio-circle" data-example-part="Item">
        <aria-radio-indicator class="ariaui-web-radio-dot" data-example-part="Indicator"></aria-radio-indicator>
      </aria-radio-item>
      <label for="density-compact" class="ariaui-web-radio-label">Compact</label>
    </div>
  </aria-radio>
</div>

```html
<aria-radio
  default-value="comfortable"
  aria-label="Density"
  class="ariaui-web-radio-stack"
>
  <div class="ariaui-web-radio-row">
    <aria-radio-item
      id="density-default"
      value="default"
      class="ariaui-web-radio-circle"
    >
      <aria-radio-indicator class="ariaui-web-radio-dot"></aria-radio-indicator>
    </aria-radio-item>
    <label for="density-default" class="ariaui-web-radio-label">Default</label>
  </div>
  <div class="ariaui-web-radio-row">
    <aria-radio-item
      id="density-comfortable"
      value="comfortable"
      class="ariaui-web-radio-circle"
    >
      <aria-radio-indicator class="ariaui-web-radio-dot"></aria-radio-indicator>
    </aria-radio-item>
    <label for="density-comfortable" class="ariaui-web-radio-label"
      >Comfortable</label
    >
  </div>
  <div class="ariaui-web-radio-row">
    <aria-radio-item
      id="density-compact"
      value="compact"
      class="ariaui-web-radio-circle"
    >
      <aria-radio-indicator class="ariaui-web-radio-dot"></aria-radio-indicator>
    </aria-radio-item>
    <label for="density-compact" class="ariaui-web-radio-label">Compact</label>
  </div>
</aria-radio>
```

### Controlled

<div class="ariaui-web-preview" data-component="radio" data-example-variant="controlled">
  <aria-radio value="comfortable" aria-label="Density" class="ariaui-web-radio-stack" data-example-part="Root">
    <div class="ariaui-web-radio-row">
      <aria-radio-item id="density-controlled-default" value="default" class="ariaui-web-radio-circle" data-example-part="Item">
        <aria-radio-indicator class="ariaui-web-radio-dot" data-example-part="Indicator"></aria-radio-indicator>
      </aria-radio-item>
      <label for="density-controlled-default" class="ariaui-web-radio-label">Default</label>
    </div>
    <div class="ariaui-web-radio-row">
      <aria-radio-item id="density-controlled-comfortable" value="comfortable" class="ariaui-web-radio-circle" data-example-part="Item">
        <aria-radio-indicator class="ariaui-web-radio-dot" data-example-part="Indicator"></aria-radio-indicator>
      </aria-radio-item>
      <label for="density-controlled-comfortable" class="ariaui-web-radio-label">Comfortable</label>
    </div>
    <div class="ariaui-web-radio-row">
      <aria-radio-item id="density-controlled-compact" value="compact" class="ariaui-web-radio-circle" data-example-part="Item">
        <aria-radio-indicator class="ariaui-web-radio-dot" data-example-part="Indicator"></aria-radio-indicator>
      </aria-radio-item>
      <label for="density-controlled-compact" class="ariaui-web-radio-label">Compact</label>
    </div>
  </aria-radio>
</div>

```html
<aria-radio
  value="comfortable"
  aria-label="Density"
  class="ariaui-web-radio-stack"
>
  <div class="ariaui-web-radio-row">
    <aria-radio-item
      id="density-controlled-default"
      value="default"
      class="ariaui-web-radio-circle"
    >
      <aria-radio-indicator class="ariaui-web-radio-dot"></aria-radio-indicator>
    </aria-radio-item>
    <label for="density-controlled-default" class="ariaui-web-radio-label"
      >Default</label
    >
  </div>
  <div class="ariaui-web-radio-row">
    <aria-radio-item
      id="density-controlled-comfortable"
      value="comfortable"
      class="ariaui-web-radio-circle"
    >
      <aria-radio-indicator class="ariaui-web-radio-dot"></aria-radio-indicator>
    </aria-radio-item>
    <label for="density-controlled-comfortable" class="ariaui-web-radio-label"
      >Comfortable</label
    >
  </div>
  <div class="ariaui-web-radio-row">
    <aria-radio-item
      id="density-controlled-compact"
      value="compact"
      class="ariaui-web-radio-circle"
    >
      <aria-radio-indicator class="ariaui-web-radio-dot"></aria-radio-indicator>
    </aria-radio-item>
    <label for="density-controlled-compact" class="ariaui-web-radio-label"
      >Compact</label
    >
  </div>
</aria-radio>
```

### Radio Cards

<div class="ariaui-web-preview" data-component="radio" data-example-variant="choice-cards">
  <aria-radio default-value="starter" aria-label="Select a plan" class="ariaui-web-radio-choice-group" data-example-part="Root">
    <aria-radio-item value="starter" aria-labelledby="plan-starter-label" aria-describedby="plan-starter-desc" class="ariaui-web-radio-choice-card" data-example-part="Item">
      <span class="ariaui-web-radio-choice-ring">
        <aria-radio-indicator class="ariaui-web-radio-choice-dot" data-example-part="Indicator"></aria-radio-indicator>
      </span>
      <span class="ariaui-web-radio-choice-copy">
        <span id="plan-starter-label" class="ariaui-web-radio-choice-title">Starter Plan</span>
        <span id="plan-starter-desc" class="ariaui-web-radio-choice-description">Perfect for small businesses getting started with our platform</span>
      </span>
    </aria-radio-item>
    <aria-radio-item value="pro" aria-labelledby="plan-pro-label" aria-describedby="plan-pro-desc" class="ariaui-web-radio-choice-card" data-example-part="Item">
      <span class="ariaui-web-radio-choice-ring">
        <aria-radio-indicator class="ariaui-web-radio-choice-dot" data-example-part="Indicator"></aria-radio-indicator>
      </span>
      <span class="ariaui-web-radio-choice-copy">
        <span id="plan-pro-label" class="ariaui-web-radio-choice-title">Pro Plan</span>
        <span id="plan-pro-desc" class="ariaui-web-radio-choice-description">Advanced features for growing businesses with higher demands</span>
      </span>
    </aria-radio-item>
  </aria-radio>
</div>

```html
<aria-radio
  default-value="starter"
  aria-label="Select a plan"
  class="ariaui-web-radio-choice-group"
>
  <aria-radio-item
    value="starter"
    aria-labelledby="plan-starter-label"
    aria-describedby="plan-starter-desc"
    class="ariaui-web-radio-choice-card"
  >
    <span class="ariaui-web-radio-choice-ring">
      <aria-radio-indicator
        class="ariaui-web-radio-choice-dot"
      ></aria-radio-indicator>
    </span>
    <span class="ariaui-web-radio-choice-copy">
      <span id="plan-starter-label" class="ariaui-web-radio-choice-title"
        >Starter Plan</span
      >
      <span id="plan-starter-desc" class="ariaui-web-radio-choice-description"
        >Perfect for small businesses getting started with our platform</span
      >
    </span>
  </aria-radio-item>
  <aria-radio-item
    value="pro"
    aria-labelledby="plan-pro-label"
    aria-describedby="plan-pro-desc"
    class="ariaui-web-radio-choice-card"
  >
    <span class="ariaui-web-radio-choice-ring">
      <aria-radio-indicator
        class="ariaui-web-radio-choice-dot"
      ></aria-radio-indicator>
    </span>
    <span class="ariaui-web-radio-choice-copy">
      <span id="plan-pro-label" class="ariaui-web-radio-choice-title"
        >Pro Plan</span
      >
      <span id="plan-pro-desc" class="ariaui-web-radio-choice-description"
        >Advanced features for growing businesses with higher demands</span
      >
    </span>
  </aria-radio-item>
</aria-radio>
```

## Anatomy

```html
<aria-radio default-value="comfortable" aria-label="Density">
  <aria-radio-item value="comfortable">
    <aria-radio-indicator></aria-radio-indicator>
  </aria-radio-item>
</aria-radio>
```

## API Reference

### Root

Radiogroup container. Manages the selected value and roving tabindex across Items.

| Attribute / event       | Default      | Description                                                                        |
| ----------------------- | ------------ | ---------------------------------------------------------------------------------- |
| `value`                 | -            | Controlled selected value. Listen for `valuechange` and write the next value back. |
| `default-value`         | -            | Initial selected value for uncontrolled usage.                                     |
| `disabled`              | `false`      | Disables every Item in the group.                                                  |
| `valuechange`           | -            | Bubbling event with `event.detail.value`.                                          |
| `role`                  | `radiogroup` | Group accessibility role.                                                          |
| `aria-activedescendant` | generated    | ID of the selected Item.                                                           |

### Item

Single radio option. Handles selection, keyboard navigation, and hidden form submission.

| Attribute      | Default     | Description                                         |
| -------------- | ----------- | --------------------------------------------------- |
| `value`        | required    | Unique value representing this option.              |
| `disabled`     | `false`     | Disables this Item.                                 |
| `name`         | -           | Emits a hidden input with this name while checked.  |
| `required`     | `false`     | Applies required state to the checked hidden input. |
| `role`         | `radio`     | Item accessibility role.                            |
| `aria-checked` | `false`     | Reflects whether the Item is selected.              |
| `data-state`   | `unchecked` | `checked` or `unchecked`.                           |

### Indicator

Visual marker that reflects its parent Item state.

| Attribute       | Description                                 |
| --------------- | ------------------------------------------- |
| `data-state`    | `checked` or `unchecked`.                   |
| `data-disabled` | Present when the Item or group is disabled. |

## Keyboard

| Keys                      | Action                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| `Tab`                     | Move focus into the group, landing on the selected Item or first enabled Item. |
| `Shift + Tab`             | Move focus out of the group.                                                   |
| `Space`                   | Select the focused Item.                                                       |
| `ArrowDown`, `ArrowRight` | Move focus to and select the next enabled Item, wrapping to the start.         |
| `ArrowUp`, `ArrowLeft`    | Move focus to and select the previous enabled Item, wrapping to the end.       |

## Accessibility

Radio follows the [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/):

- Root uses `role="radiogroup"` and tracks the selected Item with `aria-activedescendant`.
- Each Item uses `role="radio"` with reflected `aria-checked` state.
- Only the selected Item, or the first enabled Item when no selection exists, participates in the page tab order.
- Arrow keys move selection and focus together and wrap at the ends.
- `disabled` on Root disables the group; `disabled` on Item disables one option.
- A checked Item with `name` emits a hidden input for native form submission.
- Provide an accessible group name through `aria-label` or `aria-labelledby`.
