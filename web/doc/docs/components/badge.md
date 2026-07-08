# Badge

A minimal headless wrapper for status labels, counts, and tags.

## Features

- **Polymorphic**
- **Zero defaults**
- **Composable**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/badge
```

```bash [pnpm]
pnpm add @ariaui-web/badge
```

```bash [yarn]
yarn add @ariaui-web/badge
```

:::

### Register Elements

```ts
import { defineBadgeElements } from "@ariaui-web/badge";

defineBadgeElements();
```

## Examples

The live examples below are native custom element entries for the `badge` page.

### Default

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="default">
  <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">Badge</aria-badge>
</div>

```html
<aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">Badge</aria-badge>
```

### Secondary

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="secondary">
  <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-foreground hover:bg-secondary/80" data-example-part="Root">Secondary</aria-badge>
</div>

```html
<aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-foreground hover:bg-secondary/80" data-example-part="Root">Secondary</aria-badge>
```

### Outline

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="outline">
  <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">Outline</aria-badge>
</div>

```html
<aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">Outline</aria-badge>
```

### Destructive

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="destructive">
  <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover" data-example-part="Root">Destructive</aria-badge>
</div>

```html
<aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover" data-example-part="Root">Destructive</aria-badge>
```

### With icon

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="with-icon">
  <div class="flex flex-wrap gap-4">
    <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">
      <svg aria-hidden="true" data-icon="CheckIcon" class="h-3.5 w-3.5 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      Badge
    </aria-badge>
    <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover" data-example-part="Root">
      <svg aria-hidden="true" data-icon="ExclamationCircleIcon" class="h-3.5 w-3.5 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path></svg>
      Alert
    </aria-badge>
  </div>
</div>

```html
<div class="flex flex-wrap gap-4">
    <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">
      <svg aria-hidden="true" data-icon="CheckIcon" class="h-3.5 w-3.5 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      Badge
    </aria-badge>
    <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover" data-example-part="Root">
      <svg aria-hidden="true" data-icon="ExclamationCircleIcon" class="h-3.5 w-3.5 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path></svg>
      Alert
    </aria-badge>
  </div>
```

### Circular / count

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="count">
  <div class="flex flex-wrap gap-4">
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-transparent bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground" data-example-part="Root">8</aria-badge>
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-transparent bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground" data-example-part="Root">99</aria-badge>
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-border bg-transparent px-1 text-[10px] font-semibold leading-none text-foreground" data-example-part="Root">20+</aria-badge>
  </div>
</div>

```html
<div class="flex flex-wrap gap-4">
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-transparent bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground" data-example-part="Root">8</aria-badge>
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-transparent bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground" data-example-part="Root">99</aria-badge>
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-border bg-transparent px-1 text-[10px] font-semibold leading-none text-foreground" data-example-part="Root">20+</aria-badge>
  </div>
```

### Action / link

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="link">
  <div class="flex flex-wrap gap-4">
    <aria-badge as="a" href="#" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">
      Link
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="h-3 w-3 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path></svg>
    </aria-badge>
    <aria-badge as="a" href="#" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-secondary text-foreground hover:bg-secondary/80" data-example-part="Root">
      Link
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="h-3 w-3 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path></svg>
    </aria-badge>
    <aria-badge as="a" href="#" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">
      Link
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="h-3 w-3 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path></svg>
    </aria-badge>
  </div>
</div>

```html
<div class="flex flex-wrap gap-4">
    <aria-badge as="a" href="#" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">
      Link
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="h-3 w-3 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path></svg>
    </aria-badge>
    <aria-badge as="a" href="#" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-secondary text-foreground hover:bg-secondary/80" data-example-part="Root">
      Link
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="h-3 w-3 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path></svg>
    </aria-badge>
    <aria-badge as="a" href="#" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">
      Link
      <svg aria-hidden="true" data-icon="ArrowRightIcon" class="h-3 w-3 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path></svg>
    </aria-badge>
  </div>
```

### Verified

<div class="ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10" data-component="badge" data-example-variant="verified">
  <aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">
    <svg aria-hidden="true" data-icon="CheckBadgeIcon" class="h-3.5 w-3.5 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path></svg>
    Verified
  </aria-badge>
</div>

```html
<aria-badge class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold gap-1 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">
    <svg aria-hidden="true" data-icon="CheckBadgeIcon" class="h-3.5 w-3.5 text-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path></svg>
    Verified
  </aria-badge>
```

## Anatomy

```html
<aria-badge>Badge</aria-badge>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-badge` | none |

## API Reference

The package-level native contract lives in `packages/badge/readme.md`.

### Root

- Element: `aria-badge`
- Renders as a browser-native custom element host with no default role, ARIA label, classes, styles, state, keyboard behavior, or focusability.
- Forwards attributes, text, child elements, inline styles, classes, and DOM event listeners to the host.
- Preserves consumer-supplied `role`, `aria-*`, `data-*`, `id`, and `title` attributes.
- Supports `as="a"` with `href` as a native custom-element adaptation of link badges by applying `role="link"` and `tabindex="0"`.
- Supports `as="button"` as a native custom-element adaptation of button badges by applying `role="button"` and `tabindex="0"`.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus to the next focusable badge, for example when using `as="a"` or `as="button"`. |
| `Shift+Tab` | Moves focus to the previous focusable badge. |
| `Enter` | Activates a focused link-styled or button-styled badge. |
| `Space` | Activates a focused button-styled badge. |

## Accessibility

Use visible text such as "Beta", "New", or "Paid" as the primary label. Do not add `role="img"` or `tabindex` for purely decorative status chips. The primitive applies no default role or keyboard behavior.

When a badge is only decorative next to explicit text, you may hide redundant visuals from assistive technology with `aria-hidden="true"` on the badge wrapper.

If you use `as="a"`, treat it as a focusable control: provide a meaningful accessible name, visible focus styles, and a real `href` in production. The demo uses `href="#"` only for the playground.

::: tip Interactive vs static
Reserve button or link semantics and keyboard support for badges that perform an action. For static labels and counts, keep them non-focusable and rely on surrounding context or adjacent text.
:::
