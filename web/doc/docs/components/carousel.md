# Carousel

A carousel is a set of items, often images, that users can navigate through.

## Features

- **Horizontal or vertical**
- **Finite or infinite loop**
- **Multiple visible slides**
- **Source-equivalent slide labels**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/carousel
```

```bash [pnpm]
pnpm add @ariaui-web/carousel
```

```bash [yarn]
yarn add @ariaui-web/carousel
```

:::

### Register Elements

```ts
import { defineCarouselElements } from "@ariaui-web/carousel";

defineCarouselElements();
```

## Examples

### Default

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="carousel" data-example-variant="default">
  <aria-carousel aria-label="Featured items" class="flex w-full max-w-[414px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[200px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
</div>

```html
<aria-carousel aria-label="Featured items" class="flex w-full max-w-[414px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[200px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
```

### Multiple slides

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="carousel" data-example-variant="multiple-slides">
  <aria-carousel aria-label="Featured item groups" class="flex w-full max-w-[503px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root" slides-per-view="3">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[165px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
</div>

```html
<aria-carousel aria-label="Featured item groups" class="flex w-full max-w-[503px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root" slides-per-view="3">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[165px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
```

### Infinite loop multiple slides

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="carousel" data-example-variant="infinite-loop-multiple-slides">
  <aria-carousel aria-label="Featured loop item groups" class="flex w-full max-w-[503px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root" loop slides-per-view="3">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[165px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
</div>

```html
<aria-carousel aria-label="Featured loop item groups" class="flex w-full max-w-[503px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root" loop slides-per-view="3">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[165px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2rem)/3)] ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
```

### Vertical

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="carousel" data-example-variant="vertical">
  <aria-carousel aria-label="Featured vertical items" class="flex w-full max-w-[320px] flex-col items-center gap-4 ariaui-web-carousel-root" data-example-part="Root" orientation="vertical" slides-per-view="2">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 7-7 7 7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[288px] w-full overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full flex-col gap-1 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m19 12-7 7-7-7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
</div>

```html
<aria-carousel aria-label="Featured vertical items" class="flex w-full max-w-[320px] flex-col items-center gap-4 ariaui-web-carousel-root" data-example-part="Root" orientation="vertical" slides-per-view="2">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 7-7 7 7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[288px] w-full overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full flex-col gap-1 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m19 12-7 7-7-7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
```

### Infinite loop vertical

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="carousel" data-example-variant="infinite-loop-vertical">
  <aria-carousel aria-label="Featured vertical loop items" class="flex w-full max-w-[320px] flex-col items-center gap-4 ariaui-web-carousel-root" data-example-part="Root" loop orientation="vertical" slides-per-view="2">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 7-7 7 7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[288px] w-full overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full flex-col gap-1 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m19 12-7 7-7-7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
</div>

```html
<aria-carousel aria-label="Featured vertical loop items" class="flex w-full max-w-[320px] flex-col items-center gap-4 ariaui-web-carousel-root" data-example-part="Root" loop orientation="vertical" slides-per-view="2">
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 7-7 7 7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[288px] w-full overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full flex-col gap-1 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="h-[142px] shrink-0 grow-0 basis-[142px] p-1 ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-3xl font-semibold leading-9 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m19 12-7 7-7-7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
```

### Infinite loop

<div class="ariaui-web-preview flex w-full justify-center px-4 py-6" data-component="carousel" data-example-variant="infinite-loop">
  <aria-carousel aria-label="Featured loop items" class="flex w-full max-w-[414px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root" loop>
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[200px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
</div>

```html
<aria-carousel aria-label="Featured loop items" class="flex w-full max-w-[414px] items-center justify-center gap-4 ariaui-web-carousel-root" data-example-part="Root" loop>
    <aria-carousel-previous-button aria-label="Previous slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="PreviousButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"></path>
      </svg>
    </aria-carousel-previous-button>
    <aria-carousel-viewport class="h-[200px] min-w-0 flex-1 overflow-hidden ariaui-web-carousel-viewport" data-example-part="Viewport">
      <aria-carousel-container class="flex h-full gap-4 ariaui-web-carousel-container" data-example-part="Container">
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">1</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">2</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">3</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">4</div>
        </aria-carousel-slide>
        <aria-carousel-slide class="min-w-0 shrink-0 grow-0 basis-full ariaui-web-carousel-slide" data-example-part="Slide">
          <div class="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-6 text-4xl font-semibold leading-10 text-card-foreground shadow-sm ariaui-web-carousel-slide-surface">5</div>
        </aria-carousel-slide>
      </aria-carousel-container>
    </aria-carousel-viewport>
    <aria-carousel-next-button aria-label="Next slide" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-icon shadow-sm hover:bg-accent hover:text-icon disabled:cursor-not-allowed disabled:opacity-50 ariaui-web-carousel-icon-button" data-example-part="NextButton">
      <svg aria-hidden="true" class="ariaui-web-carousel-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path>
      </svg>
    </aria-carousel-next-button>
  </aria-carousel>
```

## Anatomy

```html
<aria-carousel>
  <aria-carousel-previous-button></aria-carousel-previous-button>
  <aria-carousel-viewport>
    <aria-carousel-container>
      <aria-carousel-slide></aria-carousel-slide>
    </aria-carousel-container>
  </aria-carousel-viewport>
  <aria-carousel-next-button></aria-carousel-next-button>
</aria-carousel>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-carousel` | `region` |
| Container | `aria-carousel-container` | none |
| NextButton | `aria-carousel-next-button` | `button` |
| PreviousButton | `aria-carousel-previous-button` | `button` |
| Slide | `aria-carousel-slide` | `group` |
| Viewport | `aria-carousel-viewport` | none |

## API Reference

The package-level native contract lives in `packages/carousel/readme.md`.

### Root

- Element: `aria-carousel`
- Defaults to `role="region"` and `aria-roledescription="carousel"`.
- Supports `loop`, `orientation="horizontal"`, `orientation="vertical"`, `slides-per-view`, `default-index`, and `index`.
- Emits `indexchange` with the next slide index when navigation is requested.

### Viewport

- Element: `aria-carousel-viewport`
- Defaults to `aria-live="polite"` and `aria-atomic="false"`.

### Container

- Element: `aria-carousel-container`
- Owns the axis, orientation, transform, transition, and loop clone rendering.

### Slide

- Element: `aria-carousel-slide`
- Defaults to `role="group"` and `aria-roledescription="slide"`.
- Receives `aria-label` values such as `1 of 5`.
- The selected canonical slide receives `data-active="true"`.

### PreviousButton

- Element: `aria-carousel-previous-button`
- Defaults to `role="button"`.
- Disabled at the first finite slide.

### NextButton

- Element: `aria-carousel-next-button`
- Defaults to `role="button"`.
- Disabled at the last finite snap point.

## Keyboard interactions

| Key | Interaction |
| --- | --- |
| `Tab` | Moves focus through previous and next buttons in normal document order. |
| `Enter` | Activates the focused previous or next button. |
| `Space` | Activates the focused previous or next button. |

## Accessibility

- Root exposes carousel region semantics with `aria-roledescription="carousel"`.
- Viewport announces changes politely with `aria-live="polite"`.
- Each canonical slide is labelled as `n of total`.
- Loop clones are marked `aria-hidden="true"`.
- Previous and next controls are button-like custom elements with boundary disabled state in finite carousels.
