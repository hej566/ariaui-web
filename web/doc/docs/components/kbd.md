# Kbd

A keyboard input display primitive for shortcuts and key labels.

## Features

- **Native keyboard input semantics**
- **Shortcut grouping**
- **`native-composition` composition**
- **No package-owned state attributes**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/kbd
```

```bash [pnpm]
pnpm add @ariaui-web/kbd
```

```bash [yarn]
yarn add @ariaui-web/kbd
```

:::

### Register Elements

```ts
import { defineKbdElements } from "@ariaui-web/kbd";

defineKbdElements();
```

## Examples

Kbd examples show shortcut keycaps as plain headless primitives. Use `Root` for each key label and `Group` for a related shortcut sequence.

### Shortcut group

<div class="ariaui-web-preview flex w-full justify-center py-6 px-6" data-component="kbd" data-example-variant="shortcut-group">
  <div class="flex flex-col items-center gap-4 text-sm text-muted-foreground ariaui-web-kbd-shortcut-stack">
    <aria-kbd-group class="inline-flex items-center gap-1 ariaui-web-kbd-group" aria-label="Command Shift P" data-example-part="Group">
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">⌘</aria-kbd>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">⇧</aria-kbd>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">P</aria-kbd>
    </aria-kbd-group>
    <aria-kbd-group class="inline-flex items-center gap-1 ariaui-web-kbd-group" aria-label="Control B" data-example-part="Group">
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">Ctrl</aria-kbd>
      <span class="text-xs text-muted-foreground/70 ariaui-web-kbd-plus" aria-hidden="true">+</span>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">B</aria-kbd>
    </aria-kbd-group>
  </div>
</div>

```html
<div class="flex flex-col items-center gap-4 text-sm text-muted-foreground ariaui-web-kbd-shortcut-stack">
    <aria-kbd-group class="inline-flex items-center gap-1 ariaui-web-kbd-group" aria-label="Command Shift P" data-example-part="Group">
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">⌘</aria-kbd>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">⇧</aria-kbd>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">P</aria-kbd>
    </aria-kbd-group>
    <aria-kbd-group class="inline-flex items-center gap-1 ariaui-web-kbd-group" aria-label="Control B" data-example-part="Group">
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">Ctrl</aria-kbd>
      <span class="text-xs text-muted-foreground/70 ariaui-web-kbd-plus" aria-hidden="true">+</span>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">B</aria-kbd>
    </aria-kbd-group>
  </div>
```

### Inline

<div class="ariaui-web-preview flex w-full justify-center py-6 px-6" data-component="kbd" data-example-variant="inline">
  <p class="max-w-md text-center text-sm leading-7 text-muted-foreground ariaui-web-kbd-inline">
    Press
    <aria-kbd-group class="inline-flex items-center gap-1 ariaui-web-kbd-group" aria-label="Command K" data-example-part="Group">
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">⌘</aria-kbd>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">K</aria-kbd>
    </aria-kbd-group>
    to open search, then use
    <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" aria-label="Escape" data-example-part="Root">Esc</aria-kbd>
    to close it.
  </p>
</div>

```html
<p class="max-w-md text-center text-sm leading-7 text-muted-foreground ariaui-web-kbd-inline">
    Press
    <aria-kbd-group class="inline-flex items-center gap-1 ariaui-web-kbd-group" aria-label="Command K" data-example-part="Group">
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">⌘</aria-kbd>
      <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" data-example-part="Root">K</aria-kbd>
    </aria-kbd-group>
    to open search, then use
    <aria-kbd class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs ariaui-web-kbd-key" aria-label="Escape" data-example-part="Root">Esc</aria-kbd>
    to close it.
  </p>
```

## Anatomy

```html
<aria-kbd-group aria-label="Command K">
  <aria-kbd>⌘</aria-kbd>
  <aria-kbd>K</aria-kbd>
</aria-kbd-group>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-kbd` | none |
| Group | `aria-kbd-group` | none |

## API Reference

### Root

- Element: `aria-kbd`
- Purpose: keyboard key display primitive.
- Default role: none.
- Preserves consumer attributes, text content, classes, inline styles, data attributes, and DOM events.
- Supports `native-composition` as the browser-native adaptation of source slot composition.

### Group

- Element: `aria-kbd-group`
- Purpose: neutral shortcut grouping primitive.
- Default role: none.
- Preserves consumer `aria-label`, attributes, classes, inline styles, data attributes, and DOM events.
- Supports `native-composition` as the browser-native adaptation of source slot composition.

## Accessibility

`Root` represents a keyboard-input label, so browser keyboard-input semantics apply to the authored text.

- Use short labels such as `Ctrl`, `⌘`, `Esc`, or `Enter`.
- Use `Group` to keep related key labels together.
- Add `aria-label` to a group when symbols or abbreviations need a clearer spoken label.
- Do not use keycaps as the only way to explain an action; keep surrounding copy readable.

::: info Shortcut labels
Keyboard shortcuts can differ by platform. Use labels that match the user-facing command model in your app, and provide platform-specific copy when needed.
:::
