# Treeview

A hierarchical collection for navigating, expanding, and selecting nested items with one roving tab stop.

## Features

- **Single and multi-selection**
- **Recursive checkbox selection**
- **Controlled and uncontrolled state**
- **Roving focus and typeahead**
- **Mounted animation branches**
- **Disabled item support**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/treeview
```

```bash [pnpm]
pnpm add @ariaui-web/treeview
```

```bash [yarn]
yarn add @ariaui-web/treeview
```

:::

```ts
import { defineTreeviewElements } from "@ariaui-web/treeview";

defineTreeviewElements();
```

## Examples

### Treeview

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="treeview" data-example-variant="base">
  <aria-treeview aria-label="Organization" default-expanded="organization,design" class="flex w-[220px] flex-col gap-0.5 rounded-md bg-card">
    <aria-treeview-item value="organization" class="group/treeview-root relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron" aria-label="Toggle Organization"></aria-treeview-toggle><span>Organization</span></span>
      <aria-treeview-group class="flex flex-col gap-0.5">
        <aria-treeview-item value="design" class="group/treeview-nested relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label level-2"><aria-treeview-toggle class="ariaui-treeview-chevron" aria-label="Toggle Design"></aria-treeview-toggle><span>Design</span></span>
          <aria-treeview-group class="flex flex-col gap-0.5"><aria-treeview-item value="sienna" class="relative flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label level-3 leaf">Sienna Hewitt</span></aria-treeview-item><aria-treeview-item value="ammar" class="relative flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label level-3 leaf">Ammar Foley</span></aria-treeview-item></aria-treeview-group>
        </aria-treeview-item>
        <aria-treeview-item value="product" class="relative flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label level-2 leaf">Product</span></aria-treeview-item>
      </aria-treeview-group>
    </aria-treeview-item>
    <aria-treeview-item value="projects" class="group/treeview-root relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron" aria-label="Toggle Projects"></aria-treeview-toggle><span>Projects</span></span><aria-treeview-group><aria-treeview-item value="roadmap" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2 leaf">Roadmap</span></aria-treeview-item></aria-treeview-group></aria-treeview-item>
  </aria-treeview>
</div>

```html
<aria-treeview aria-label="Organization" default-expanded="organization,design">
  <aria-treeview-item value="organization">
    <span><aria-treeview-toggle></aria-treeview-toggle>Organization</span>
    <aria-treeview-group><!-- Nested items --></aria-treeview-group>
  </aria-treeview-item>
</aria-treeview>
```

### Advanced Multi-select

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="treeview" data-example-variant="advanced-multi-select">
  <aria-treeview aria-label="Workspace access" multi-select default-expanded="organization,design,projects" default-value="sienna,assets" class="flex w-full max-w-[260px] flex-col gap-0.5 rounded-md bg-card">
    <aria-treeview-checkbox-item value="organization" class="group/treeview-checkbox relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-secondary-hover data-[selected]:bg-accent"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span class="ariaui-treeview-check" aria-hidden="true"></span><span>Organization</span></span><aria-treeview-group>
      <aria-treeview-checkbox-item value="design" class="group/treeview-checkbox relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span class="ariaui-treeview-check"></span><span>Design</span></span><aria-treeview-group><aria-treeview-checkbox-item value="sienna" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-3 checkbox-leaf"><span class="ariaui-treeview-check"></span><span class="ariaui-treeview-avatar">SH</span><span>Sienna Hewitt</span></span></aria-treeview-checkbox-item><aria-treeview-checkbox-item value="assets" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-3 checkbox-leaf"><span class="ariaui-treeview-check"></span><span class="ariaui-treeview-file"></span><span>Assets</span></span></aria-treeview-checkbox-item></aria-treeview-group></aria-treeview-checkbox-item>
    </aria-treeview-group></aria-treeview-checkbox-item>
    <aria-treeview-checkbox-item value="projects" class="group/treeview-checkbox relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span class="ariaui-treeview-check"></span><span>Projects</span></span><aria-treeview-group><aria-treeview-checkbox-item value="powersurge" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2 checkbox-leaf"><span class="ariaui-treeview-check"></span><span class="ariaui-treeview-file"></span><span>Powersurge</span></span></aria-treeview-checkbox-item></aria-treeview-group></aria-treeview-checkbox-item>
  </aria-treeview>
</div>

```html
<aria-treeview multi-select default-expanded="organization,design" default-value="sienna,assets">
  <aria-treeview-checkbox-item value="organization">
    <aria-treeview-toggle></aria-treeview-toggle> Organization
    <aria-treeview-group><!-- Checkbox descendants --></aria-treeview-group>
  </aria-treeview-checkbox-item>
</aria-treeview>
```

### Advanced Controlled

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="treeview" data-example-variant="advanced-controlled">
  <aria-treeview aria-label="Controlled workspace" multi-select expanded="organization,design" value="sienna" data-treeview-controlled class="flex w-full max-w-[260px] flex-col gap-0.5 rounded-md bg-card">
    <aria-treeview-checkbox-item value="organization" class="relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span class="ariaui-treeview-check"></span><span>Organization</span></span><aria-treeview-group><aria-treeview-checkbox-item value="design" class="relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span class="ariaui-treeview-check"></span><span>Design</span></span><aria-treeview-group><aria-treeview-checkbox-item value="sienna" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-3 checkbox-leaf"><span class="ariaui-treeview-check"></span><span class="ariaui-treeview-avatar">SH</span><span>Sienna Hewitt</span></span></aria-treeview-checkbox-item><aria-treeview-checkbox-item value="ammar" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-3 checkbox-leaf"><span class="ariaui-treeview-check"></span><span class="ariaui-treeview-avatar">AF</span><span>Ammar Foley</span></span></aria-treeview-checkbox-item></aria-treeview-group></aria-treeview-checkbox-item></aria-treeview-group></aria-treeview-checkbox-item>
  </aria-treeview>
</div>

```html
<aria-treeview multi-select expanded="organization,design" value="sienna">
  <!-- Listen for expandedchange and valuechange, then update the attributes. -->
</aria-treeview>
```

### Framer Motion

<div class="ariaui-web-preview flex w-full justify-center py-6" data-component="treeview" data-example-variant="framer-motion">
  <aria-treeview aria-label="Animated organization" default-expanded="organization" class="flex w-[220px] flex-col gap-0.5 rounded-md bg-card">
    <aria-treeview-item value="organization" class="relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span>Organization</span></span><aria-treeview-group native-composition><div class="overflow-hidden" data-treeview-motion-group><aria-treeview-item value="design" class="relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span>Design</span></span><aria-treeview-group native-composition><div class="overflow-hidden" data-treeview-motion-group><aria-treeview-item value="sienna" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-3 leaf">Sienna Hewitt</span></aria-treeview-item><aria-treeview-item value="ammar" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-3 leaf">Ammar Foley</span></aria-treeview-item></div></aria-treeview-group></aria-treeview-item><aria-treeview-item value="product" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2 leaf">Product</span></aria-treeview-item></div></aria-treeview-group></aria-treeview-item>
    <aria-treeview-item value="projects" class="relative flex w-full flex-col cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label"><aria-treeview-toggle class="ariaui-treeview-chevron"></aria-treeview-toggle><span>Projects</span></span><aria-treeview-group native-composition><div class="overflow-hidden" data-treeview-motion-group><aria-treeview-item value="roadmap" class="relative flex w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-secondary-hover"><span class="ariaui-treeview-label level-2 leaf">Roadmap</span></aria-treeview-item></div></aria-treeview-group></aria-treeview-item>
  </aria-treeview>
</div>

```html
<aria-treeview default-expanded="organization">
  <aria-treeview-item value="organization">
    <aria-treeview-group native-composition>
      <div data-treeview-motion-group class="overflow-hidden">...</div>
    </aria-treeview-group>
  </aria-treeview-item>
</aria-treeview>
```

## Anatomy

```html
<aria-treeview>
  <aria-treeview-item>
    <aria-treeview-toggle></aria-treeview-toggle>
    <aria-treeview-group></aria-treeview-group>
  </aria-treeview-item>
  <aria-treeview-checkbox-item></aria-treeview-checkbox-item>
</aria-treeview>
```

## API Reference

### Root

| Attribute / property | Default | Description |
| --- | --- | --- |
| `expanded` | unset | Controlled comma-separated expanded item values. |
| `default-expanded` / `defaultExpanded` | empty | Initial uncontrolled expanded values. |
| `value` | unset | Controlled selected value or values. |
| `default-value` / `defaultValue` | empty | Initial uncontrolled selection. |
| `multi-select` / `multiSelect` | `false` | Enables multiple selected items. |
| `disabled` | `false` | Suppresses all pointer and keyboard interaction. |
| `onExpandedChange` | `null` | Receives requested expanded values. |
| `onValueChange` | `null` | Receives requested selected values. |

### Item And CheckboxItem

Items expose `aria-level`, `aria-selected`, an optional `aria-expanded`, and roving `tabindex`. Checkbox items also expose `aria-checked` and `data-state`, including the `mixed` / `indeterminate` parent state.

### Group And Toggle

`Toggle` changes expansion without selection. `Group` hides collapsed descendants by default. Add `native-composition` to forward group semantics to its first child and keep it mounted for animation.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd> | Moves through visible enabled items. |
| <kbd>ArrowRight</kbd> | Expands a collapsed parent. |
| <kbd>ArrowLeft</kbd> | Collapses an expanded parent or moves to its parent. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Moves to the first or last visible item. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates expansion, selection, or checkbox state. |
| <kbd>Shift+Arrow</kbd> | Extends a multi-selection range. |
| <kbd>Ctrl+A</kbd> | Selects all visible items in multi-select mode. |
| <kbd>*</kbd> | Expands sibling parent items. |
| Printable characters | Moves to the next matching visible item. |

## Accessibility

Treeview follows the [WAI-ARIA APG Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Give the root an accessible name, keep labels concise for typeahead, and use `disabled` rather than removing unavailable items from the hierarchy.
