# Skeleton

Headless loading placeholder that can wrap pending content.

## Features

- **Headless placeholder**
- **Radix-style loading behavior**
- **Size properties**
- **Children-aware rendering**
- **Accessible hidden loading state**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/skeleton
```

```bash [pnpm]
pnpm add @ariaui-web/skeleton
```

```bash [yarn]
yarn add @ariaui-web/skeleton
```

:::

```ts
import { defineSkeletonElements } from "@ariaui-web/skeleton";

defineSkeletonElements();
```

## Examples

### Card

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="skeleton" data-example-variant="card">
  <div class="ariaui-web-skeleton-card-preview w-[382px] max-w-full overflow-hidden rounded-[14px] border border-border bg-card py-6 shadow-sm">
    <div class="ariaui-web-skeleton-card-padding flex w-full flex-col items-start px-6">
      <div class="ariaui-web-skeleton-card-content flex w-full flex-col items-start justify-center gap-6">
        <div class="ariaui-web-skeleton-lines flex w-full flex-col items-start gap-2">
          <aria-skeleton class="ariaui-web-skeleton-pulse ariaui-web-skeleton-card-block h-4 w-full animate-pulse rounded-md bg-accent" data-example-part="Root"></aria-skeleton>
          <aria-skeleton class="ariaui-web-skeleton-pulse ariaui-web-skeleton-card-block h-4 w-full animate-pulse rounded-md bg-accent" data-example-part="Root"></aria-skeleton>
        </div>
        <aria-skeleton class="ariaui-web-skeleton-pulse ariaui-web-skeleton-card-media aspect-[334/334] w-full animate-pulse rounded-md bg-accent" data-example-part="Root"></aria-skeleton>
      </div>
    </div>
  </div>
</div>

```html
<div class="w-[382px] max-w-full overflow-hidden rounded-[14px] border border-border bg-card py-6 shadow-sm">
  <div class="flex w-full flex-col items-start px-6">
    <div class="flex w-full flex-col items-start justify-center gap-6">
      <div class="flex w-full flex-col items-start gap-2">
        <aria-skeleton class="h-4 w-full animate-pulse rounded-md bg-accent"></aria-skeleton>
        <aria-skeleton class="h-4 w-full animate-pulse rounded-md bg-accent"></aria-skeleton>
      </div>
      <aria-skeleton class="aspect-[334/334] w-full animate-pulse rounded-md bg-accent"></aria-skeleton>
    </div>
  </div>
</div>
```

### With Children

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="skeleton" data-example-variant="with-children">
  <div class="ariaui-web-skeleton-shell w-full max-w-sm rounded-lg border border-border bg-background p-4 shadow-sm">
    <div class="ariaui-web-skeleton-profile flex items-center gap-3">
      <aria-skeleton native-composition class="ariaui-web-skeleton-pulse animate-pulse rounded-full bg-muted" data-example-part="Root"><div class="ariaui-web-skeleton-avatar h-10 w-10 rounded-full"></div></aria-skeleton>
      <div class="ariaui-web-skeleton-copy space-y-2">
        <aria-skeleton native-composition class="ariaui-web-skeleton-pulse ariaui-web-skeleton-text animate-pulse select-none rounded-md bg-muted text-transparent" data-example-part="Root"><p class="text-sm font-medium text-foreground">Jane Cooper</p></aria-skeleton>
        <aria-skeleton native-composition class="ariaui-web-skeleton-pulse ariaui-web-skeleton-text animate-pulse select-none rounded-md bg-muted text-transparent" data-example-part="Root"><p class="text-sm text-muted-foreground">Product designer</p></aria-skeleton>
      </div>
    </div>
  </div>
</div>

```html
<div class="w-full max-w-sm rounded-lg border border-border bg-background p-4 shadow-sm">
  <div class="flex items-center gap-3">
    <aria-skeleton native-composition class="animate-pulse rounded-full bg-muted">
      <div class="h-10 w-10 rounded-full"></div>
    </aria-skeleton>
    <div class="space-y-2">
      <aria-skeleton native-composition class="animate-pulse select-none rounded-md bg-muted text-transparent">
        <p class="text-sm font-medium text-foreground">Jane Cooper</p>
      </aria-skeleton>
      <aria-skeleton native-composition class="animate-pulse select-none rounded-md bg-muted text-transparent">
        <p class="text-sm text-muted-foreground">Product designer</p>
      </aria-skeleton>
    </div>
  </div>
</div>
```

### With Text

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="skeleton" data-example-variant="with-text">
  <div class="ariaui-web-skeleton-shell w-full max-w-sm rounded-lg border border-border bg-background p-4 shadow-sm">
    <p class="ariaui-web-skeleton-paragraph text-sm leading-6 text-foreground"><aria-skeleton class="ariaui-web-skeleton-pulse ariaui-web-skeleton-inline animate-pulse select-none rounded-md bg-muted text-transparent" data-example-part="Root">Loading placeholder text keeps the same rhythm as final copy.</aria-skeleton></p>
  </div>
</div>

```html
<div class="w-full max-w-sm rounded-lg border border-border bg-background p-4 shadow-sm">
  <p class="text-sm leading-6 text-foreground">
    <aria-skeleton class="animate-pulse select-none rounded-md bg-muted text-transparent">
      Loading placeholder text keeps the same rhythm as final copy.
    </aria-skeleton>
  </p>
</div>
```

## Anatomy

```html
<aria-skeleton></aria-skeleton>
```

Use `native-composition` when an element child should become the effective loading host.

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `loading` | `true` | Set to `false` to remove loading semantics and expose authored children. |
| `native-composition` | `false` | Applies loading semantics, classes, attributes, and styles to the first child element. |
| `width`, `minWidth`, `maxWidth` | unset | Applies horizontal CSS lengths to the effective placeholder host. |
| `height`, `minHeight`, `maxHeight` | unset | Applies vertical CSS lengths to the effective placeholder host. |

Loading hosts expose `aria-hidden="true"`, `inert`, `tabindex="-1"`, and `data-state="loading"`. Text and empty placeholders also expose `data-inline-skeleton`.

## Accessibility

`aria-skeleton` hides pending placeholder content with `aria-hidden`, `inert`, and `tabindex="-1"` so it is not exposed as usable UI.

When `loading="false"`, the element removes placeholder semantics and exposes its children as direct content. Final content must provide its own accessible name, role, labels, and keyboard behavior.

Skeletons are visual loading affordances only. For long-running work that needs progress updates, pair them with visible copy or a status region.
