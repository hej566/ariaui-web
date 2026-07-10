# Label

A native label primitive for naming form controls.

## Features

- **Native label semantics**
- **`for` and wrapped-control support**
- **Double-click selection protection**
- **`native-composition` composition**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/label
```

```bash [pnpm]
pnpm add @ariaui-web/label
```

```bash [yarn]
yarn add @ariaui-web/label
```

:::

### Register Elements

```ts
import { defineLabelElements } from "@ariaui-web/label";

defineLabelElements();
```

## Examples

Label examples show visible text associated with native form controls by id or by wrapping the control.

### Default

<div class="ariaui-web-preview flex w-full justify-center py-6 px-6" data-component="label" data-example-variant="default">
  <div class="grid w-full max-w-sm gap-2 ariaui-web-label-field">
    <aria-label for="label-email" class="text-sm font-medium leading-none text-foreground ariaui-web-label-root" data-example-part="Root">
      Email
    </aria-label>
    <input
      id="label-email"
      type="email"
      placeholder="name@example.com"
      class="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ariaui-web-label-input"
    />
  </div>
</div>

```html
<div class="grid w-full max-w-sm gap-2 ariaui-web-label-field">
    <aria-label for="label-email" class="text-sm font-medium leading-none text-foreground ariaui-web-label-root" data-example-part="Root">
      Email
    </aria-label>
    <input
      id="label-email"
      type="email"
      placeholder="name@example.com"
      class="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ariaui-web-label-input"
    />
  </div>
```

### Wrapped control

<div class="ariaui-web-preview flex w-full justify-center py-6 px-6" data-component="label" data-example-variant="wrapped-control">
  <aria-label class="flex w-full max-w-sm flex-col gap-2 ariaui-web-label-wrapper" data-example-part="Root">
    <span class="text-sm font-medium leading-none text-foreground ariaui-web-label-root">Project name</span>
    <input type="text" value="Design system" class="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ariaui-web-label-input" />
  </aria-label>
</div>

```html
<aria-label class="flex w-full max-w-sm flex-col gap-2 ariaui-web-label-wrapper" data-example-part="Root">
    <span class="text-sm font-medium leading-none text-foreground ariaui-web-label-root">Project name</span>
    <input type="text" value="Design system" class="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ariaui-web-label-input" />
  </aria-label>
```

## Anatomy

```html
<aria-label for="email">Email</aria-label>
<input id="email" type="email" />
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-label` | none |

## API Reference

### Root

- Element: `aria-label`
- Purpose: native label primitive for form controls.
- Default role: none.
- Preserves consumer `for`, id, attributes, text content, classes, inline styles, data attributes, and DOM events.
- Supports `native-composition` as the browser-native adaptation of source slot composition.
- Prevents double-click text selection on the label surface while leaving nested native controls untouched.

## Accessibility

`Root` labels a native form control. Use `for` with a matching control `id`, or wrap the control inside the label.

- Keep visible label text close to the field it names.
- Use one primary label per control, then connect helper or error copy with `aria-describedby`.
- Avoid using labels for arbitrary non-form content.

::: info Native association
Clicking or tapping a label forwards activation to its associated native control. Custom controls should still be backed by native form elements when they need label behavior.
:::
