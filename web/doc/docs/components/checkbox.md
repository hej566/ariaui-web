# Checkbox

A control that can be checked, unchecked, or indeterminate.

## Features

- **APG checkbox semantics**
- **Checked and indeterminate state**
- **Controlled or uncontrolled**
- **Group multi-select state**
- **Native form integration**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/checkbox
```

```bash [pnpm]
pnpm add @ariaui-web/checkbox
```

```bash [yarn]
yarn add @ariaui-web/checkbox
```

:::

### Register Elements

```ts
import { defineCheckboxElements } from "@ariaui-web/checkbox";

defineCheckboxElements();
```

## Examples

The live examples below are native custom element entries for the `checkbox` page, matching the source Aria UI examples.

### Basic

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="checkbox" data-example-variant="basic">
  <div class="flex items-start gap-2 ariaui-web-checkbox-row">
    <aria-checkbox id="checkbox-doc-basic" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Root">
      <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
    </aria-checkbox>
    <label for="checkbox-doc-basic" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Accept terms and conditions</label>
  </div>
</div>

```html
<div class="flex items-start gap-2 ariaui-web-checkbox-row">
    <aria-checkbox id="checkbox-doc-basic" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Root">
      <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
    </aria-checkbox>
    <label for="checkbox-doc-basic" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Accept terms and conditions</label>
  </div>
```

### With description

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="checkbox" data-example-variant="description">
  <div class="flex items-start gap-2 ariaui-web-checkbox-row">
    <aria-checkbox id="checkbox-doc-desc" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Root">
      <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
    </aria-checkbox>
    <div class="grid gap-1.5 ariaui-web-checkbox-description-stack">
      <label for="checkbox-doc-desc" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Accept terms and conditions</label>
      <p class="text-sm leading-normal text-muted-foreground ariaui-web-checkbox-description">By clicking this checkbox, you agree to the terms and conditions.</p>
    </div>
  </div>
</div>

```html
<div class="flex items-start gap-2 ariaui-web-checkbox-row">
    <aria-checkbox id="checkbox-doc-desc" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Root">
      <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
    </aria-checkbox>
    <div class="grid gap-1.5 ariaui-web-checkbox-description-stack">
      <label for="checkbox-doc-desc" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Accept terms and conditions</label>
      <p class="text-sm leading-normal text-muted-foreground ariaui-web-checkbox-description">By clicking this checkbox, you agree to the terms and conditions.</p>
    </div>
  </div>
```

### Disabled

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="checkbox" data-example-variant="disabled">
  <div class="flex cursor-not-allowed items-start gap-2 opacity-60 ariaui-web-checkbox-disabled-row">
    <aria-checkbox id="checkbox-doc-disabled" default-checked disabled class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root" data-example-part="Root">
      <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
    </aria-checkbox>
    <label for="checkbox-doc-disabled" class="text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed ariaui-web-checkbox-disabled-label">Enable notifications</label>
  </div>
</div>

```html
<div class="flex cursor-not-allowed items-start gap-2 opacity-60 ariaui-web-checkbox-disabled-row">
    <aria-checkbox id="checkbox-doc-disabled" default-checked disabled class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root" data-example-part="Root">
      <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
    </aria-checkbox>
    <label for="checkbox-doc-disabled" class="text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed ariaui-web-checkbox-disabled-label">Enable notifications</label>
  </div>
```

### Group

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="checkbox" data-example-variant="group">
  <aria-checkbox-group value="tech,product,tips" aria-label="Newsletter topics" class="flex flex-col gap-4 ariaui-web-checkbox-group-list" data-example-part="Group">
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-tech" value="tech" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-tech" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Technology News</label>
    </div>
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-product" value="product" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-product" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Product Updates</label>
    </div>
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-tips" value="tips" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-tips" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Tips & Tricks</label>
    </div>
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-events" value="events" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-events" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Events & Webinars</label>
    </div>
  </aria-checkbox-group>
</div>

```html
<aria-checkbox-group value="tech,product,tips" aria-label="Newsletter topics" class="flex flex-col gap-4 ariaui-web-checkbox-group-list" data-example-part="Group">
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-tech" value="tech" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-tech" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Technology News</label>
    </div>
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-product" value="product" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-product" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Product Updates</label>
    </div>
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-tips" value="tips" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-tips" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Tips & Tricks</label>
    </div>
    <div class="flex items-start gap-2 ariaui-web-checkbox-row">
      <aria-checkbox-item id="checkbox-doc-group-events" value="events" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-background text-primary-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary ariaui-web-checkbox-root ariaui-web-checkbox-primary-root" data-example-part="Item">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </aria-checkbox-item>
      <label for="checkbox-doc-group-events" class="cursor-pointer text-sm font-medium leading-none text-foreground ariaui-web-checkbox-label">Events & Webinars</label>
    </div>
  </aria-checkbox-group>
```

### Box group

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="checkbox" data-example-variant="box-group">
  <aria-checkbox-group value="tech" aria-label="Newsletter topics" class="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2 ariaui-web-checkbox-box-grid" data-example-part="Group">
    <aria-checkbox-item id="checkbox-doc-box-tech" value="tech" class="group flex w-full items-start gap-3 rounded-lg border border-border bg-background p-3 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-accent ariaui-web-checkbox-box-item" data-example-part="Item">
      <div class="h-4 w-4 shrink-0 rounded-sm border border-border bg-background shadow-xs group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary ariaui-web-checkbox-box-tick">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </div>
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1.5 text-left ariaui-web-checkbox-box-text">
        <label for="checkbox-doc-box-tech" class="cursor-pointer text-sm font-medium leading-none text-foreground group-data-[state=checked]:text-accent-foreground ariaui-web-checkbox-box-label">Technology News</label>
        <p class="text-sm leading-5 text-muted-foreground ariaui-web-checkbox-box-description">Latest updates from the tech world delivered to your inbox.</p>
      </div>
    </aria-checkbox-item>
    <aria-checkbox-item id="checkbox-doc-box-product" value="product" class="group flex w-full items-start gap-3 rounded-lg border border-border bg-background p-3 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-accent ariaui-web-checkbox-box-item" data-example-part="Item">
      <div class="h-4 w-4 shrink-0 rounded-sm border border-border bg-background shadow-xs group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary ariaui-web-checkbox-box-tick">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </div>
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1.5 text-left ariaui-web-checkbox-box-text">
        <label for="checkbox-doc-box-product" class="cursor-pointer text-sm font-medium leading-none text-foreground group-data-[state=checked]:text-accent-foreground ariaui-web-checkbox-box-label">Product Updates</label>
        <p class="text-sm leading-5 text-muted-foreground ariaui-web-checkbox-box-description">New features and improvements to the platform.</p>
      </div>
    </aria-checkbox-item>
  </aria-checkbox-group>
</div>

```html
<aria-checkbox-group value="tech" aria-label="Newsletter topics" class="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2 ariaui-web-checkbox-box-grid" data-example-part="Group">
    <aria-checkbox-item id="checkbox-doc-box-tech" value="tech" class="group flex w-full items-start gap-3 rounded-lg border border-border bg-background p-3 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-accent ariaui-web-checkbox-box-item" data-example-part="Item">
      <div class="h-4 w-4 shrink-0 rounded-sm border border-border bg-background shadow-xs group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary ariaui-web-checkbox-box-tick">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </div>
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1.5 text-left ariaui-web-checkbox-box-text">
        <label for="checkbox-doc-box-tech" class="cursor-pointer text-sm font-medium leading-none text-foreground group-data-[state=checked]:text-accent-foreground ariaui-web-checkbox-box-label">Technology News</label>
        <p class="text-sm leading-5 text-muted-foreground ariaui-web-checkbox-box-description">Latest updates from the tech world delivered to your inbox.</p>
      </div>
    </aria-checkbox-item>
    <aria-checkbox-item id="checkbox-doc-box-product" value="product" class="group flex w-full items-start gap-3 rounded-lg border border-border bg-background p-3 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-accent ariaui-web-checkbox-box-item" data-example-part="Item">
      <div class="h-4 w-4 shrink-0 rounded-sm border border-border bg-background shadow-xs group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary ariaui-web-checkbox-box-tick">
        <aria-checkbox-indicator class="flex h-full w-full items-center justify-center ariaui-web-checkbox-indicator" data-example-part="Indicator">
        <svg aria-hidden="true" class="h-3.5 w-3.5 stroke-[3] ariaui-web-checkbox-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
      </aria-checkbox-indicator>
      </div>
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1.5 text-left ariaui-web-checkbox-box-text">
        <label for="checkbox-doc-box-product" class="cursor-pointer text-sm font-medium leading-none text-foreground group-data-[state=checked]:text-accent-foreground ariaui-web-checkbox-box-label">Product Updates</label>
        <p class="text-sm leading-5 text-muted-foreground ariaui-web-checkbox-box-description">New features and improvements to the platform.</p>
      </div>
    </aria-checkbox-item>
  </aria-checkbox-group>
```

## Anatomy

```html
<aria-checkbox data-example-part="Root">
  <aria-checkbox-indicator data-example-part="Indicator"></aria-checkbox-indicator>
</aria-checkbox>

<aria-checkbox-group data-example-part="Group">
  <aria-checkbox-item value="tech" data-example-part="Item">
    <aria-checkbox-indicator data-example-part="Indicator"></aria-checkbox-indicator>
  </aria-checkbox-item>
</aria-checkbox-group>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-checkbox` | `checkbox` |
| Group | `aria-checkbox-group` | `group` |
| Indicator | `aria-checkbox-indicator` | `presentation` |
| Item | `aria-checkbox-item` | `checkbox` |

## API Reference

The package-level native contract lives in `packages/checkbox/readme.md`.

### Root

- Element: `aria-checkbox`
- Exposes `role="checkbox"`, `tabindex="0"`, `aria-checked`, and `data-state`.
- `checked` and `default-checked` support controlled-style and uncontrolled initial state.
- `indeterminate` reflects `aria-checked="mixed"` and `data-state="indeterminate"`.
- Dispatches `checkedchange` with `detail.checked` when standalone checked state changes.
- `disabled` reflects `aria-disabled="true"`, `data-disabled`, and removes sequential focus.
- `name`, `value`, and `required` create a hidden form input that stays synced with the checked state.

### Indicator

- Element: `aria-checkbox-indicator`
- Reflects the owning checkbox `data-state`.
- Hidden while unchecked by default.
- `force-mount` keeps the indicator rendered while preserving unchecked metadata.

### Group

- Element: `aria-checkbox-group`
- Exposes `role="group"`.
- Owns a string array represented by the comma-separated `value` attribute.
- `default-value` initializes uncontrolled group state.
- Dispatches `valuechange` with `detail.value` and `detail.values`.
- Propagates `disabled`, `name`, and `required` to value-bearing child items.

### Item

- Element: `aria-checkbox-item`
- Behaviorally matches Root.
- Inside Group, a value-bearing Item derives checked state from Group `value` and toggles the group array.
- Without `value`, an Item inside Group falls back to standalone checkbox behavior.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus to the checkbox in the browser focus order. |
| `Space` | Toggles the focused checkbox. |
| `Enter` | Activates the focused custom element host. |

## Accessibility

Checkbox follows the APG checkbox pattern on the native custom element host. Provide a visible label with `label for`, `aria-label`, or `aria-labelledby`.

Use `aria-checkbox-group` with an accessible name when several checkboxes form one logical choice set. Indeterminate state is visual and announced through `aria-checked="mixed"`; clicking an indeterminate checkbox resolves it to checked.
