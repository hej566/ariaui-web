# Slider

A headless, accessible slider with single- or multi-thumb selection, keyboard support, and horizontal or vertical orientation.

## Features

- **Horizontal or vertical orientation**
- **Single or multi-thumb values**
- **Controlled or uncontrolled state**
- **Keyboard and pointer support**
- **Headless composition**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/slider
```

```bash [pnpm]
pnpm add @ariaui-web/slider
```

```bash [yarn]
yarn add @ariaui-web/slider
```

:::

```ts
import { defineSliderElements } from "@ariaui-web/slider";

defineSliderElements();
```

## Examples

### Uncontrolled

<div class="ariaui-web-preview" data-component="slider" data-example-variant="uncontrolled">
  <div class="ariaui-web-slider-stage">
    <aria-slider class="ariaui-web-slider-root" min="100" max="200" step="1" default-value="150" data-example-part="Root">
      <aria-slider-track class="ariaui-web-slider-track" data-example-part="Track">
        <aria-slider-range class="ariaui-web-slider-range" data-example-part="Range"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb" aria-label="Level" data-example-part="Thumb"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="w-full" min="100" max="200" step="1" default-value="150">
  <aria-slider-track class="relative flex h-2 w-full items-center rounded bg-muted hover:cursor-pointer">
    <aria-slider-range class="h-full rounded bg-brand"></aria-slider-range>
    <aria-slider-thumb class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Level"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

### Controlled

<div class="ariaui-web-preview" data-component="slider" data-example-variant="controlled">
  <div class="ariaui-web-slider-stage">
    <aria-slider class="ariaui-web-slider-root" min="0" max="100" step="1" value="60" data-slider-controlled>
      <aria-slider-track class="ariaui-web-slider-track">
        <aria-slider-range class="ariaui-web-slider-range"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb" aria-label="Controlled value"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="w-full" min="0" max="100" step="1" value="60">
  <aria-slider-track class="relative flex h-2 w-full items-center rounded bg-muted hover:cursor-pointer">
    <aria-slider-range class="h-full rounded bg-brand"></aria-slider-range>
    <aria-slider-thumb class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Controlled value"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

### Disabled

<div class="ariaui-web-preview" data-component="slider" data-example-variant="disabled">
  <div class="ariaui-web-slider-stage">
    <aria-slider class="ariaui-web-slider-root" min="0" max="100" step="1" default-value="35" disabled>
      <aria-slider-track class="ariaui-web-slider-track ariaui-web-slider-track-disabled">
        <aria-slider-range class="ariaui-web-slider-range ariaui-web-slider-range-disabled"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb ariaui-web-slider-thumb-disabled" aria-label="Volume"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="w-full" min="0" max="100" step="1" default-value="35" disabled>
  <aria-slider-track class="relative flex h-2 w-full items-center rounded bg-muted opacity-70">
    <aria-slider-range class="h-full rounded bg-muted-accent"></aria-slider-range>
    <aria-slider-thumb class="absolute flex h-4 w-4 rounded-full border-2 border-muted-foreground/40 bg-muted shadow-none" aria-label="Volume"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

### Multi-thumb

<div class="ariaui-web-preview" data-component="slider" data-example-variant="multi-thumb">
  <div class="ariaui-web-slider-stage">
    <aria-slider class="ariaui-web-slider-root" min="0" max="100" step="1" default-value="30,70">
      <aria-slider-track class="ariaui-web-slider-track">
        <aria-slider-range class="ariaui-web-slider-range"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb" index="0" aria-label="Lower bound"></aria-slider-thumb>
        <aria-slider-thumb class="ariaui-web-slider-thumb" index="1" aria-label="Upper bound"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="w-full" min="0" max="100" step="1" default-value="30,70">
  <aria-slider-track class="relative flex h-2 w-full items-center rounded bg-muted hover:cursor-pointer">
    <aria-slider-range class="h-full rounded bg-brand"></aria-slider-range>
    <aria-slider-thumb index="0" class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Lower bound"></aria-slider-thumb>
    <aria-slider-thumb index="1" class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Upper bound"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

### Custom Tooltip

<div class="ariaui-web-preview" data-component="slider" data-example-variant="custom-tooltip">
  <div class="ariaui-web-slider-stage">
    <aria-slider class="ariaui-web-slider-root" min="0" max="100" step="5" default-value="40" value-text-suffix="%">
      <aria-slider-track class="ariaui-web-slider-track">
        <aria-slider-range class="ariaui-web-slider-range"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb ariaui-web-slider-thumb-value-text" aria-label="Completion"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="w-full" min="0" max="100" step="5" default-value="40" value-text-suffix="%">
  <aria-slider-track class="relative flex h-2 w-full items-center rounded bg-muted hover:cursor-pointer">
    <aria-slider-range class="h-full rounded bg-brand"></aria-slider-range>
    <aria-slider-thumb class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Completion"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

### Vertical

<div class="ariaui-web-preview" data-component="slider" data-example-variant="vertical">
  <div class="ariaui-web-slider-vertical-stage">
    <aria-slider class="ariaui-web-slider-vertical-root" min="0" max="100" step="1" default-value="50" orientation="vertical" aria-label="Vertical level">
      <aria-slider-track class="ariaui-web-slider-vertical-track">
        <aria-slider-range class="ariaui-web-slider-vertical-range"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb ariaui-web-slider-vertical-thumb"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="h-48" min="0" max="100" step="1" default-value="50" orientation="vertical" aria-label="Vertical level">
  <aria-slider-track class="relative flex h-full w-2 cursor-pointer items-center justify-center rounded bg-muted">
    <aria-slider-range class="h-full w-full rounded bg-brand"></aria-slider-range>
    <aria-slider-thumb class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

### Vertical Multi-thumb

<div class="ariaui-web-preview" data-component="slider" data-example-variant="vertical-multi-thumb">
  <div class="ariaui-web-slider-vertical-stage">
    <aria-slider class="ariaui-web-slider-vertical-root" min="0" max="100" step="1" default-value="25,75" orientation="vertical" aria-label="Vertical range">
      <aria-slider-track class="ariaui-web-slider-vertical-track">
        <aria-slider-range class="ariaui-web-slider-vertical-range"></aria-slider-range>
        <aria-slider-thumb class="ariaui-web-slider-thumb ariaui-web-slider-vertical-thumb" index="0" aria-label="Lower bound"></aria-slider-thumb>
        <aria-slider-thumb class="ariaui-web-slider-thumb ariaui-web-slider-vertical-thumb" index="1" aria-label="Upper bound"></aria-slider-thumb>
      </aria-slider-track>
    </aria-slider>
  </div>
</div>

```html
<aria-slider class="h-48" min="0" max="100" step="1" default-value="25,75" orientation="vertical" aria-label="Vertical range">
  <aria-slider-track class="relative flex h-full w-2 cursor-pointer items-center justify-center rounded bg-muted">
    <aria-slider-range class="h-full w-full rounded bg-brand"></aria-slider-range>
    <aria-slider-thumb index="0" class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Lower bound"></aria-slider-thumb>
    <aria-slider-thumb index="1" class="absolute flex h-4 w-4 rounded-full border-2 border-brand bg-background shadow-md" aria-label="Upper bound"></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

## Anatomy

```html
<aria-slider>
  <aria-slider-track>
    <aria-slider-range></aria-slider-range>
    <aria-slider-thumb></aria-slider-thumb>
  </aria-slider-track>
</aria-slider>
```

## API Reference

### Root

| Attribute | Default | Description |
| --- | --- | --- |
| `value` | - | Controlled numeric value or comma-separated values. |
| `default-value` | minimum | Initial uncontrolled value or comma-separated values. |
| `min` | `0` | Minimum value. |
| `max` | `100` | Maximum value. |
| `step` | `1` | Increment used for pointer and keyboard input. |
| `min-steps-between-thumbs` | `0` | Minimum number of steps between adjacent thumbs. |
| `orientation` | `horizontal` | `horizontal` or `vertical`. |
| `disabled` | `false` | Disables all slider interaction. |
| `name` | - | Creates one hidden form value per thumb. |
| `value-text-prefix` | - | Prefix for generated `aria-valuetext` values. |
| `value-text-suffix` | - | Suffix for generated `aria-valuetext` values. |
| `valuechange` | - | Bubbling event with `event.detail.value` and `event.detail.values`. |

### Thumb

| Attribute | Default | Description |
| --- | --- | --- |
| `index` | `0` | Value index for multi-thumb sliders. |
| `aria-label` | - | Accessible label for the thumb. |
| `aria-valuetext` | - | Optional authored text alternative for the numeric value. |

### Track

The Track is the pointer target and the positioning container for Range and Thumb parts.

### Range

The Range visualizes the selected interval from the minimum or between multiple thumbs.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| <kbd>Arrow Right</kbd> / <kbd>Arrow Up</kbd> | Increase by one step. |
| <kbd>Arrow Left</kbd> / <kbd>Arrow Down</kbd> | Decrease by one step. |
| <kbd>Home</kbd> | Move to the minimum allowed value. |
| <kbd>End</kbd> | Move to the maximum allowed value. |

## Accessibility

Each thumb uses `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-orientation`. Provide an accessible name for every thumb. Disabled thumbs expose `aria-disabled="true"` and leave the tab order.
