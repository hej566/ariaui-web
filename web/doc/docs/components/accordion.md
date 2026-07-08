# Accordion

A vertically stacked set of interactive headings that each reveal an associated section of content.

## Features

- **Vertical or horizontal**
- **Single or multiple**
- **Collapsible**
- **Controlled or uncontrolled**
- **Headless**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/accordion
```

```bash [pnpm]
pnpm add @ariaui-web/accordion
```

```bash [yarn]
yarn add @ariaui-web/accordion
```

:::

### Register Elements

```ts
import { defineAccordionElements } from "@ariaui-web/accordion";

defineAccordionElements();
```

## Examples

The live examples below are native custom element entries for the `accordion` page, matching the source Aria UI examples.

### Single

<div class="ariaui-web-preview flex w-full justify-center overflow-hidden bg-background py-14 sm:px-12" data-component="accordion" data-example-variant="single">
  <aria-accordion class="w-full max-w-md rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="single" collapsible="true" default-value="accessible">
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="accessible">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-accessible-trigger" aria-controls="accordion-accessible-panel" open>
          <span class="min-w-0">Is it accessible?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-accessible-panel" aria-labelledby="accordion-accessible-trigger" open>
        Yes. It adheres to the WAI-ARIA design pattern.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="styled">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-styled-trigger" aria-controls="accordion-styled-panel">
          <span class="min-w-0">Is it styled?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-styled-panel" aria-labelledby="accordion-styled-trigger" hidden>
        Yes. It comes with default styles that match the other components' aesthetic.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="animated">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-animated-trigger" aria-controls="accordion-animated-panel">
          <span class="min-w-0">Is it animated?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-animated-panel" aria-labelledby="accordion-animated-trigger" hidden>
        Yes. It's animated by default, but you can disable it if you prefer.
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
</div>

```html
<aria-accordion class="w-full max-w-md rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="single" collapsible="true" default-value="accessible">
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="accessible">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-accessible-trigger" aria-controls="accordion-accessible-panel" open>
          <span class="min-w-0">Is it accessible?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-accessible-panel" aria-labelledby="accordion-accessible-trigger" open>
        Yes. It adheres to the WAI-ARIA design pattern.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="styled">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-styled-trigger" aria-controls="accordion-styled-panel">
          <span class="min-w-0">Is it styled?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-styled-panel" aria-labelledby="accordion-styled-trigger" hidden>
        Yes. It comes with default styles that match the other components' aesthetic.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="animated">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-animated-trigger" aria-controls="accordion-animated-panel">
          <span class="min-w-0">Is it animated?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-animated-panel" aria-labelledby="accordion-animated-trigger" hidden>
        Yes. It's animated by default, but you can disable it if you prefer.
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
```

### Multiple

Use `type="multiple"` and a comma-separated `default-value` or `value` to keep more than one item open.

<div class="ariaui-web-preview flex w-full justify-center overflow-hidden bg-background py-14 sm:px-12" data-component="accordion" data-example-variant="multiple">
  <aria-accordion class="w-full max-w-md rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="multiple" default-value="multiple-open,accessible">
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="multiple-open">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-multiple-multiple-open-trigger" aria-controls="accordion-multiple-multiple-open-panel" open>
          <span class="min-w-0">Can I open multiple items?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-multiple-multiple-open-panel" aria-labelledby="accordion-multiple-multiple-open-trigger" open>
        Yes. Set type to multiple so more than one section can stay open. Pass defaultValue as an array to open specific panels on first render.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="accessible">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-multiple-accessible-trigger" aria-controls="accordion-multiple-accessible-panel" open>
          <span class="min-w-0">Is it accessible?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-multiple-accessible-panel" aria-labelledby="accordion-multiple-accessible-trigger" open>
        Yes. It follows the WAI-ARIA accordion pattern with keyboard support and appropriate roles.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="animated">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-multiple-animated-trigger" aria-controls="accordion-multiple-animated-panel">
          <span class="min-w-0">Can it be animated?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-multiple-animated-panel" aria-labelledby="accordion-multiple-animated-trigger" hidden>
        You can animate height with CSS, Framer Motion, or any library. The headless API exposes open state via data attributes.
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
</div>

```html
<aria-accordion class="w-full max-w-md rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="multiple" default-value="multiple-open,accessible">
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="multiple-open">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-multiple-multiple-open-trigger" aria-controls="accordion-multiple-multiple-open-panel" open>
          <span class="min-w-0">Can I open multiple items?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-multiple-multiple-open-panel" aria-labelledby="accordion-multiple-multiple-open-trigger" open>
        Yes. Set type to multiple so more than one section can stay open. Pass defaultValue as an array to open specific panels on first render.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="accessible">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-multiple-accessible-trigger" aria-controls="accordion-multiple-accessible-panel" open>
          <span class="min-w-0">Is it accessible?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-multiple-accessible-panel" aria-labelledby="accordion-multiple-accessible-trigger" open>
        Yes. It follows the WAI-ARIA accordion pattern with keyboard support and appropriate roles.
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="animated">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-multiple-animated-trigger" aria-controls="accordion-multiple-animated-panel">
          <span class="min-w-0">Can it be animated?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground" data-example-part="Content" id="accordion-multiple-animated-panel" aria-labelledby="accordion-multiple-animated-trigger" hidden>
        You can animate height with CSS, Framer Motion, or any library. The headless API exposes open state via data attributes.
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
```

### Horizontal

Set `orientation="horizontal"` for horizontal roving-focus key mapping and horizontal styling hooks.

<div class="ariaui-web-preview flex w-full justify-center overflow-hidden bg-background px-1 py-8 sm:px-4" data-component="accordion" data-example-variant="horizontal">
  <aria-accordion class="flex h-56 flex-row overflow-hidden rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="single" default-value="overview" orientation="horizontal">
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="overview">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-overview-trigger" aria-controls="accordion-horizontal-overview-panel" open>
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Overview</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-overview-panel" aria-labelledby="accordion-horizontal-overview-trigger" open>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Project</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Overview</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">View key metrics, recent activity, and important notifications at a glance.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="analytics">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-analytics-trigger" aria-controls="accordion-horizontal-analytics-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Analytics</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-analytics-panel" aria-labelledby="accordion-horizontal-analytics-trigger" hidden>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Real-time</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Analytics</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Track performance metrics, user engagement, and conversion rates.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="reports">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-reports-trigger" aria-controls="accordion-horizontal-reports-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Reports</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-reports-panel" aria-labelledby="accordion-horizontal-reports-trigger" hidden>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Generate</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Reports</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Create and export custom reports with filtering and scheduling options.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="settings">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-settings-trigger" aria-controls="accordion-horizontal-settings-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Settings</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-settings-panel" aria-labelledby="accordion-horizontal-settings-trigger" hidden>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Configure</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Settings</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Manage account preferences, integrations, and team permissions.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
</div>

```html
<aria-accordion class="flex h-56 flex-row overflow-hidden rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="single" default-value="overview" orientation="horizontal">
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="overview">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-overview-trigger" aria-controls="accordion-horizontal-overview-panel" open>
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Overview</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-overview-panel" aria-labelledby="accordion-horizontal-overview-trigger" open>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Project</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Overview</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">View key metrics, recent activity, and important notifications at a glance.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="analytics">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-analytics-trigger" aria-controls="accordion-horizontal-analytics-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Analytics</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-analytics-panel" aria-labelledby="accordion-horizontal-analytics-trigger" hidden>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Real-time</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Analytics</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Track performance metrics, user engagement, and conversion rates.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="reports">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-reports-trigger" aria-controls="accordion-horizontal-reports-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Reports</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-reports-panel" aria-labelledby="accordion-horizontal-reports-trigger" hidden>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Generate</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Reports</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Create and export custom reports with filtering and scheduling options.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background" data-example-part="Item" value="settings">
      <aria-accordion-header class="relative z-10 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4" data-example-part="Trigger" id="accordion-horizontal-settings-trigger" aria-controls="accordion-horizontal-settings-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground">Settings</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 flex-1 overflow-hidden bg-background" data-example-part="Content" id="accordion-horizontal-settings-panel" aria-labelledby="accordion-horizontal-settings-trigger" hidden>
        <div class="flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Configure</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Settings</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Manage account preferences, integrations, and team permissions.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
```

### Fold Effect

Fold-style examples should keep content mounted and animate dimensions from the `data-state` and `data-orientation` attributes.

<div class="ariaui-web-preview flex w-full justify-center overflow-hidden bg-background px-1 py-8 sm:px-4" data-component="accordion" data-example-variant="fold">
  <aria-accordion class="flex h-56 w-full flex-row gap-0 overflow-hidden rounded-lg border border-border bg-muted p-0 shadow-sm sm:gap-1 sm:p-1" data-example-part="Root" type="single" default-value="overview" orientation="horizontal" collapsible="true">
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="overview">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-overview-trigger" aria-controls="accordion-fold-overview-panel" open>
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Overview</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-overview-panel" aria-labelledby="accordion-fold-overview-trigger" open force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Project</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Overview</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">View key metrics, recent activity, and important notifications at a glance.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="analytics">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-analytics-trigger" aria-controls="accordion-fold-analytics-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Analytics</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-analytics-panel" aria-labelledby="accordion-fold-analytics-trigger" hidden force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Real-time</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Analytics</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Track performance metrics, user engagement, and conversion rates.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="reports">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-reports-trigger" aria-controls="accordion-fold-reports-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Reports</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-reports-panel" aria-labelledby="accordion-fold-reports-trigger" hidden force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Generate</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Reports</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Create and export custom reports with filtering and scheduling options.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="settings">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-settings-trigger" aria-controls="accordion-fold-settings-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Settings</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-settings-panel" aria-labelledby="accordion-fold-settings-trigger" hidden force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Configure</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Settings</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Manage account preferences, integrations, and team permissions.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
</div>

```html
<aria-accordion class="flex h-56 w-full flex-row gap-0 overflow-hidden rounded-lg border border-border bg-muted p-0 shadow-sm sm:gap-1 sm:p-1" data-example-part="Root" type="single" default-value="overview" orientation="horizontal" collapsible="true">
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="overview">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-overview-trigger" aria-controls="accordion-fold-overview-panel" open>
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Overview</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-overview-panel" aria-labelledby="accordion-fold-overview-trigger" open force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Project</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Overview</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">View key metrics, recent activity, and important notifications at a glance.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="analytics">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-analytics-trigger" aria-controls="accordion-fold-analytics-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Analytics</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-analytics-panel" aria-labelledby="accordion-fold-analytics-trigger" hidden force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Real-time</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Analytics</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Track performance metrics, user engagement, and conversion rates.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="reports">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-reports-trigger" aria-controls="accordion-fold-reports-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Reports</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-reports-panel" aria-labelledby="accordion-fold-reports-trigger" hidden force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Generate</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Reports</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Create and export custom reports with filtering and scheduling options.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1" data-example-part="Item" value="settings">
      <aria-accordion-header class="relative z-20 flex min-h-0 shrink-0 flex-col" data-example-part="Header">
        <aria-accordion-trigger class="flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4" data-example-part="Trigger" id="accordion-fold-settings-trigger" aria-controls="accordion-fold-settings-panel">
          <span class="h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl">Settings</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100" data-example-part="Content" id="accordion-fold-settings-panel" aria-labelledby="accordion-fold-settings-trigger" hidden force-mount>
        <div class="flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6">
          <div class="space-y-0.5">
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Configure</span>
            <span class="block text-4xl font-semibold leading-none tracking-tight text-foreground">Settings</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Manage account preferences, integrations, and team permissions.</p>
        </div>
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
```

### Framer Motion

Animation libraries can target the native content element or a child wrapper. Use `force-mount` when closed panels must remain in the DOM for exit animations.

<div class="ariaui-web-preview flex w-full justify-center overflow-hidden bg-background py-14 sm:px-12" data-component="accordion" data-example-variant="framer-motion">
  <aria-accordion class="w-full max-w-md rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="single" collapsible="true" default-value="accessible">
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="accessible">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-motion-accessible-trigger" aria-controls="accordion-motion-accessible-panel" open>
          <span class="min-w-0">Is it accessible?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100" data-example-part="Content" id="accordion-motion-accessible-panel" aria-labelledby="accordion-motion-accessible-trigger" open force-mount>
        <div class="px-5 pb-5">Yes. It adheres to the WAI-ARIA design pattern.</div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="styled">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-motion-styled-trigger" aria-controls="accordion-motion-styled-panel">
          <span class="min-w-0">Is it styled?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100" data-example-part="Content" id="accordion-motion-styled-panel" aria-labelledby="accordion-motion-styled-trigger" hidden force-mount>
        <div class="px-5 pb-5">Yes. It comes with default styles that match the other components' aesthetic.</div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="animated">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-motion-animated-trigger" aria-controls="accordion-motion-animated-panel">
          <span class="min-w-0">Is it animated?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100" data-example-part="Content" id="accordion-motion-animated-panel" aria-labelledby="accordion-motion-animated-trigger" hidden force-mount>
        <div class="px-5 pb-5">Yes. It's animated by default, but you can disable it if you prefer.</div>
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
</div>

```html
<aria-accordion class="w-full max-w-md rounded-lg border border-border bg-background shadow-sm" data-example-part="Root" type="single" collapsible="true" default-value="accessible">
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="accessible">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-motion-accessible-trigger" aria-controls="accordion-motion-accessible-panel" open>
          <span class="min-w-0">Is it accessible?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100" data-example-part="Content" id="accordion-motion-accessible-panel" aria-labelledby="accordion-motion-accessible-trigger" open force-mount>
        <div class="px-5 pb-5">Yes. It adheres to the WAI-ARIA design pattern.</div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="styled">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-motion-styled-trigger" aria-controls="accordion-motion-styled-panel">
          <span class="min-w-0">Is it styled?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100" data-example-part="Content" id="accordion-motion-styled-panel" aria-labelledby="accordion-motion-styled-trigger" hidden force-mount>
        <div class="px-5 pb-5">Yes. It comes with default styles that match the other components' aesthetic.</div>
      </aria-accordion-content>
    </aria-accordion-item>
    <aria-accordion-item class="border-b border-border last:border-b-0 data-[state=open]:bg-muted/20" data-example-part="Item" value="animated">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50" data-example-part="Trigger" id="accordion-motion-animated-trigger" aria-controls="accordion-motion-animated-panel">
          <span class="min-w-0">Is it animated?</span>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100" data-example-part="Content" id="accordion-motion-animated-panel" aria-labelledby="accordion-motion-animated-trigger" hidden force-mount>
        <div class="px-5 pb-5">Yes. It's animated by default, but you can disable it if you prefer.</div>
      </aria-accordion-content>
    </aria-accordion-item>
  </aria-accordion>
```

## Anatomy

```html
<aria-accordion>
  <aria-accordion-item value="item-1">
    <aria-accordion-header>
      <aria-accordion-trigger>Trigger</aria-accordion-trigger>
    </aria-accordion-header>
    <aria-accordion-content>Content</aria-accordion-content>
  </aria-accordion-item>
  <aria-accordion-item value="item-2">
    <aria-accordion-header>
      <aria-accordion-trigger>Trigger</aria-accordion-trigger>
    </aria-accordion-header>
    <aria-accordion-content>Content</aria-accordion-content>
  </aria-accordion-item>
</aria-accordion>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-accordion` | none |
| Button | `aria-accordion-button` | `button` |
| Content | `aria-accordion-content` | `region` |
| Header | `aria-accordion-header` | `heading` |
| Item | `aria-accordion-item` | `listitem` |
| Panel | `aria-accordion-panel` | `region` |
| Trigger | `aria-accordion-trigger` | `button` |

## API Reference

The package-level native contract lives in `packages/accordion/readme.md`.

### Root

- Element: `aria-accordion`
- Owns single or multiple item state.
- Supports `type="single"`, `type="multiple"`, `value`, `default-value`, `collapsible`, `disabled`, `orientation`, and `dir`.
- Emits `valuechange` with the selected value and value list.

### Item

- Element: `aria-accordion-item`
- Requires a unique `value` inside the nearest root.
- Reflects `open`, `disabled`, `data-state`, and `data-orientation`.

### Header

- Element: `aria-accordion-header`
- Defaults to `role="heading"` and `aria-level="3"`.
- Contains the item trigger.

### Trigger

- Element: `aria-accordion-trigger`
- Alias: `aria-accordion-button`
- Defaults to `role="button"`.
- Reflects `aria-expanded`, `aria-controls`, `aria-disabled`, `open`, and `data-state`.

### Content

- Element: `aria-accordion-content`
- Alias: `aria-accordion-panel`
- Defaults to `role="region"`.
- Receives `id`, `aria-labelledby`, `hidden`, `open`, and `data-state`.
- Supports `force-mount` for animation workflows.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Enter` | Opens or closes the focused trigger according to the accordion state rules. |
| `Space` | Opens or closes the focused trigger according to the accordion state rules. |
| `ArrowDown` | Moves focus to the next enabled trigger in vertical accordions. |
| `ArrowUp` | Moves focus to the previous enabled trigger in vertical accordions. |
| `ArrowRight` | Moves focus forward in horizontal LTR accordions and backward in horizontal RTL accordions. |
| `ArrowLeft` | Moves focus backward in horizontal LTR accordions and forward in horizontal RTL accordions. |
| `Home` | Moves focus to the first enabled trigger. |
| `End` | Moves focus to the last enabled trigger. |

## Accessibility

The Accordion component implements the [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). Each trigger exposes `role="button"`, `aria-expanded`, and `aria-controls` pointing to its associated content region. Content panels carry `role="region"` and `aria-labelledby` linking back to the trigger.

::: tip Heading level
`aria-accordion-header` defaults to `role="heading"` and `aria-level="3"`. Set `aria-level` to match the page hierarchy when a different heading depth is needed.
:::
