# Select

A headless, accessible select built on the WAI-ARIA Listbox pattern with single/multiple selection and nested submenus.

## Features

- **Single and multiple selection**
- **Trigger to listbox wiring**
- **Grouped options**
- **Nested submenus**
- **Typeahead and active option tracking**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/select
```

```bash [pnpm]
pnpm add @ariaui-web/select
```

```bash [yarn]
yarn add @ariaui-web/select
```

:::

### Register Elements

```ts
import { defineSelectElements } from "@ariaui-web/select";

defineSelectElements();
```

## Examples

The live examples below are native custom element entries for the `select` page, matching the source Aria UI examples.

### Uncontrolled

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="uncontrolled">
  <aria-select class="ariaui-web-select-root" data-example-part="Root" default-value="blueberry">
    <aria-select-label class="sr-only" data-example-part="Label">Fruit</aria-select-label>
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <span data-select-trigger-label>Blueberry</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Fruits</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="blueberry">Blueberry<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Grapes</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="pineapple">Pineapple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root" default-value="blueberry">
  <aria-select-label class="sr-only" data-example-part="Label">Fruit</aria-select-label>
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
    <span data-select-trigger-label>Blueberry</span>
    <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
    </aria-select-dropdown-indicator>
  </aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
      <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Fruits</aria-select-group-label>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="blueberry">Blueberry<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    </aria-select-group>
    <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
      <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Grapes</aria-select-group-label>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="pineapple">Pineapple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    </aria-select-group>
  </aria-select-content>
</aria-select>
```

### Disabled

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="disabled">
  <aria-select class="ariaui-web-select-root" data-example-part="Root" disabled>
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <span data-select-trigger-label>Disabled</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="orange">Orange<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root" disabled>
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
    <span data-select-trigger-label>Disabled</span>
    <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
    </aria-select-dropdown-indicator>
  </aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="orange">Orange<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
  </aria-select-content>
</aria-select>
```

### With icon

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="with-icon">
  <aria-select class="ariaui-web-select-root" data-example-part="Root">
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-trigger-icon viewBox="0 0 24 24"><path d="M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Zm0 3.25v10M7 12h10"></path></svg>
      <span data-select-trigger-label>With Icon</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="line"><svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-option-icon viewBox="0 0 24 24"><path d="M4 19V5m0 14h16M8 16l3-4 3 2 4-7"></path></svg><span>Line</span><span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="bar"><svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-option-icon viewBox="0 0 24 24"><path d="M5 19V5m4 14V9m4 10V7m4 12v-6"></path></svg><span>Bar</span><span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="pie"><svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-option-icon viewBox="0 0 24 24"><path d="M12 3v9h9A9 9 0 1 1 12 3Zm3 0a9 9 0 0 1 6 6h-6V3Z"></path></svg><span>Pie</span><span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root">
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
    <svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-trigger-icon viewBox="0 0 24 24"><path d="M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Zm0 3.25v10M7 12h10"></path></svg>
    <span data-select-trigger-label>With Icon</span>
    <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
    </aria-select-dropdown-indicator>
  </aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="line"><svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-option-icon viewBox="0 0 24 24"><path d="M4 19V5m0 14h16M8 16l3-4 3 2 4-7"></path></svg>Line<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="bar"><svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-option-icon viewBox="0 0 24 24"><path d="M5 19V5m4 14V9m4 10V7m4 12v-6"></path></svg>Bar<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="pie"><svg aria-hidden="true" class="ariaui-web-select-leading-icon" data-select-option-icon viewBox="0 0 24 24"><path d="M12 3v9h9A9 9 0 1 1 12 3Zm3 0a9 9 0 0 1 6 6h-6V3Z"></path></svg>Pie<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
  </aria-select-content>
</aria-select>
```

### Large list + scroll area

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="large-list-scroll-area">
  <aria-select class="ariaui-web-select-root" data-example-part="Root" default-value="item-3">
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <span data-select-trigger-label>Item 3</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content ariaui-web-select-scroll-content" data-example-part="Content" hidden>
      <div class="ariaui-web-select-scroll-root">
        <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options up" data-select-scroll-direction="up"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"></path></svg></button>
        <div aria-hidden="true" class="ariaui-web-select-scroll-active-background"></div>
        <div class="ariaui-web-select-scroll-viewport" aria-label="Options">
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-0"><span class="ariaui-web-select-scroll-option-label">Item 0</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-1"><span class="ariaui-web-select-scroll-option-label">Item 1</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-2"><span class="ariaui-web-select-scroll-option-label">Item 2</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-3"><span class="ariaui-web-select-scroll-option-label">Item 3</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-4"><span class="ariaui-web-select-scroll-option-label">Item 4</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-5"><span class="ariaui-web-select-scroll-option-label">Item 5</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-6"><span class="ariaui-web-select-scroll-option-label">Item 6</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-7"><span class="ariaui-web-select-scroll-option-label">Item 7</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-8"><span class="ariaui-web-select-scroll-option-label">Item 8</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-9"><span class="ariaui-web-select-scroll-option-label">Item 9</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-10"><span class="ariaui-web-select-scroll-option-label">Item 10</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-11"><span class="ariaui-web-select-scroll-option-label">Item 11</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-12"><span class="ariaui-web-select-scroll-option-label">Item 12</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-13"><span class="ariaui-web-select-scroll-option-label">Item 13</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-14"><span class="ariaui-web-select-scroll-option-label">Item 14</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-15"><span class="ariaui-web-select-scroll-option-label">Item 15</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-16"><span class="ariaui-web-select-scroll-option-label">Item 16</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-17"><span class="ariaui-web-select-scroll-option-label">Item 17</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-18"><span class="ariaui-web-select-scroll-option-label">Item 18</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-19"><span class="ariaui-web-select-scroll-option-label">Item 19</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-20"><span class="ariaui-web-select-scroll-option-label">Item 20</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-21"><span class="ariaui-web-select-scroll-option-label">Item 21</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-22"><span class="ariaui-web-select-scroll-option-label">Item 22</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-23"><span class="ariaui-web-select-scroll-option-label">Item 23</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-24"><span class="ariaui-web-select-scroll-option-label">Item 24</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-25"><span class="ariaui-web-select-scroll-option-label">Item 25</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-26"><span class="ariaui-web-select-scroll-option-label">Item 26</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-27"><span class="ariaui-web-select-scroll-option-label">Item 27</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-28"><span class="ariaui-web-select-scroll-option-label">Item 28</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-29"><span class="ariaui-web-select-scroll-option-label">Item 29</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-30"><span class="ariaui-web-select-scroll-option-label">Item 30</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-31"><span class="ariaui-web-select-scroll-option-label">Item 31</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-32"><span class="ariaui-web-select-scroll-option-label">Item 32</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-33"><span class="ariaui-web-select-scroll-option-label">Item 33</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-34"><span class="ariaui-web-select-scroll-option-label">Item 34</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-35"><span class="ariaui-web-select-scroll-option-label">Item 35</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-36"><span class="ariaui-web-select-scroll-option-label">Item 36</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-37"><span class="ariaui-web-select-scroll-option-label">Item 37</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-38"><span class="ariaui-web-select-scroll-option-label">Item 38</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-39"><span class="ariaui-web-select-scroll-option-label">Item 39</span></aria-select-option>
        </div>
        <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options down" data-select-scroll-direction="down"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></button>
      </div>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root" default-value="item-3">
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger"><span data-select-trigger-label>Item 3</span></aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content ariaui-web-select-scroll-content" data-example-part="Content" hidden>
    <div class="ariaui-web-select-scroll-root">
      <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options up" data-select-scroll-direction="up">...</button>
      <div aria-hidden="true" class="ariaui-web-select-scroll-active-background"></div>
      <div class="ariaui-web-select-scroll-viewport" aria-label="Options">
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-scroll-option" data-example-part="Option" value="item-3"><span class="ariaui-web-select-scroll-option-label">Item 3</span></aria-select-option>
      </div>
      <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options down" data-select-scroll-direction="down">...</button>
    </div>
  </aria-select-content>
</aria-select>
```

### Grouped With Submenu

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="grouped-with-submenu">
  <aria-select class="ariaui-web-select-root" data-example-part="Root" default-value="apple">
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <span data-select-trigger-label>Apple</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Fruits</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="orange">Orange<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">More</aria-select-group-label>
        <aria-select-sub class="ariaui-web-select-sub" data-example-part="Sub">
          <aria-select-sub-trigger class="ariaui-web-select-sub-trigger" data-example-part="SubTrigger">
            <span>Vegetables</span>
            <svg aria-hidden="true" class="ariaui-web-select-chevron" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"></path></svg>
          </aria-select-sub-trigger>
          <aria-select-sub-content class="ariaui-web-select-sub-content" data-example-part="SubContent" hidden>
            <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="carrot">Carrot<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
            <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="potato">Potato<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          </aria-select-sub-content>
        </aria-select-sub>
      </aria-select-group>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root" default-value="apple">
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger"><span data-select-trigger-label>Apple</span></aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
      <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Fruits</aria-select-group-label>
      <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    </aria-select-group>
    <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
      <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">More</aria-select-group-label>
      <aria-select-sub class="ariaui-web-select-sub" data-example-part="Sub">
        <aria-select-sub-trigger class="ariaui-web-select-sub-trigger" data-example-part="SubTrigger">Vegetables</aria-select-sub-trigger>
        <aria-select-sub-content class="ariaui-web-select-sub-content" data-example-part="SubContent" hidden>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="carrot">Carrot<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        </aria-select-sub-content>
      </aria-select-sub>
    </aria-select-group>
  </aria-select-content>
</aria-select>
```

### Grouped Multiple With Submenu

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="grouped-multiple-with-submenu">
  <aria-select class="ariaui-web-select-root" data-example-part="Root" selection-mode="multiple" default-value="apple,banana">
    <aria-select-trigger class="ariaui-web-select-trigger ariaui-web-select-combobox-trigger" data-example-part="Trigger">
      <span class="ariaui-web-select-selection-group">
        <span class="ariaui-web-select-chip" data-select-chip-value="apple">Apple<span aria-hidden="true" class="ariaui-web-select-remove">&times;</span></span>
        <span class="ariaui-web-select-chip" data-select-chip-value="banana">Banana<span aria-hidden="true" class="ariaui-web-select-remove">&times;</span></span>
        <span class="ariaui-web-select-combobox-input"></span>
      </span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content ariaui-web-select-combobox-content" data-example-part="Content" hidden>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Fruits</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="orange">Orange<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
      <div class="ariaui-web-select-separator"></div>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">More</aria-select-group-label>
        <aria-select-sub class="ariaui-web-select-sub" data-example-part="Sub">
          <aria-select-sub-trigger class="ariaui-web-select-sub-trigger ariaui-web-select-combobox-option" data-example-part="SubTrigger">
            <span>Vegetables</span>
            <svg aria-hidden="true" class="ariaui-web-select-chevron" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"></path></svg>
          </aria-select-sub-trigger>
          <aria-select-sub-content class="ariaui-web-select-sub-content ariaui-web-select-combobox-content" data-example-part="SubContent" hidden>
            <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="carrot">Carrot<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
            <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="potato">Potato<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          </aria-select-sub-content>
        </aria-select-sub>
      </aria-select-group>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root" selection-mode="multiple" default-value="apple,banana">
  <aria-select-trigger class="ariaui-web-select-trigger ariaui-web-select-combobox-trigger" data-example-part="Trigger">
    <span class="ariaui-web-select-selection-group">
      <span class="ariaui-web-select-chip" data-select-chip-value="apple">Apple<span aria-hidden="true" class="ariaui-web-select-remove">&times;</span></span>
      <span class="ariaui-web-select-chip" data-select-chip-value="banana">Banana<span aria-hidden="true" class="ariaui-web-select-remove">&times;</span></span>
    </span>
  </aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-sub class="ariaui-web-select-sub" data-example-part="Sub">
      <aria-select-sub-trigger class="ariaui-web-select-sub-trigger" data-example-part="SubTrigger">Vegetables</aria-select-sub-trigger>
      <aria-select-sub-content class="ariaui-web-select-sub-content" data-example-part="SubContent" hidden>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="carrot">Carrot<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-sub-content>
    </aria-select-sub>
  </aria-select-content>
</aria-select>
```

### Multiple Selection (Uncontrolled)

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="multiple-uncontrolled">
  <aria-select class="ariaui-web-select-root" data-example-part="Root" selection-mode="multiple" default-value="apple,banana,orange,carrot" data-select-overflow-limit="2" data-select-chip-remove="false">
    <aria-select-trigger class="ariaui-web-select-trigger ariaui-web-select-combobox-trigger" data-example-part="Trigger">
      <span class="ariaui-web-select-selection-group">
        <span class="ariaui-web-select-tag-group">
          <span class="ariaui-web-select-chip">Apple</span>
          <span class="ariaui-web-select-chip">Banana</span>
        </span>
        <span class="ariaui-web-select-overflow-count" aria-label="2 more selected">+2</span>
        <span class="ariaui-web-select-combobox-input"></span>
      </span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content ariaui-web-select-combobox-content" data-example-part="Content" hidden>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Fruits</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="banana">Banana<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="orange">Orange<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
      <div class="ariaui-web-select-separator"></div>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Vegetables</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="carrot">Carrot<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option ariaui-web-select-combobox-option" data-example-part="Option" value="potato">Potato<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root" data-example-part="Root" selection-mode="multiple" default-value="apple,banana,orange,carrot" data-select-overflow-limit="2" data-select-chip-remove="false">
  <aria-select-trigger class="ariaui-web-select-trigger ariaui-web-select-combobox-trigger" data-example-part="Trigger">
    <span class="ariaui-web-select-selection-group">
      <span class="ariaui-web-select-tag-group">
        <span class="ariaui-web-select-chip">Apple</span>
        <span class="ariaui-web-select-chip">Banana</span>
      </span>
      <span class="ariaui-web-select-overflow-count" aria-label="2 more selected">+2</span>
    </span>
  </aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="apple">Apple<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="potato">Potato<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
  </aria-select-content>
</aria-select>
```

### Framer Motion

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="framer-motion">
  <aria-select class="ariaui-web-select-root ariaui-web-select-motion" data-example-part="Root" default-value="line">
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <span data-select-trigger-label>Line chart</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">Charts</aria-select-group-label>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="line">Line chart<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="bar">Bar chart<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="area">Area chart<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </aria-select-group>
      <aria-select-group class="ariaui-web-select-group" data-example-part="Group">
        <aria-select-group-label class="ariaui-web-select-label" data-example-part="GroupLabel">More</aria-select-group-label>
        <aria-select-sub class="ariaui-web-select-sub" data-example-part="Sub">
          <aria-select-sub-trigger class="ariaui-web-select-sub-trigger" data-example-part="SubTrigger">
            <span>Exports</span>
            <svg aria-hidden="true" class="ariaui-web-select-chevron" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"></path></svg>
          </aria-select-sub-trigger>
          <aria-select-sub-content class="ariaui-web-select-sub-content" data-example-part="SubContent" hidden>
            <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="csv">CSV export<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
            <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="pdf">PDF report<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          </aria-select-sub-content>
        </aria-select-sub>
      </aria-select-group>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root ariaui-web-select-motion" data-example-part="Root" default-value="line">
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger"><span data-select-trigger-label>Line chart</span></aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content" data-example-part="Content" hidden>
    <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="line">Line chart<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
    <aria-select-sub class="ariaui-web-select-sub" data-example-part="Sub">
      <aria-select-sub-trigger class="ariaui-web-select-sub-trigger" data-example-part="SubTrigger">Exports</aria-select-sub-trigger>
    </aria-select-sub>
  </aria-select-content>
</aria-select>
```

### Framer Motion + Scroll Area

<div class="ariaui-web-preview flex w-full items-start justify-center px-6 py-12" data-component="select" data-example-variant="scroll-area">
  <aria-select class="ariaui-web-select-root ariaui-web-select-motion" data-example-part="Root" default-value="item-3">
    <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger">
      <span data-select-trigger-label>Item 3</span>
      <aria-select-dropdown-indicator class="ariaui-web-select-indicator" data-example-part="DropdownIndicator">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </aria-select-dropdown-indicator>
    </aria-select-trigger>
    <aria-select-content class="ariaui-web-select-content ariaui-web-select-scroll-content" data-example-part="Content" hidden>
      <div class="ariaui-web-select-scroll-root">
        <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options up"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"></path></svg></button>
        <div aria-hidden="true" class="ariaui-web-select-scroll-active-background"></div>
        <div class="ariaui-web-select-scroll-viewport" aria-label="Options">
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-0">Item 0<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-1">Item 1<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-2">Item 2<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-3">Item 3<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-4">Item 4<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-5">Item 5<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-6">Item 6<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
          <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-7">Item 7<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
        </div>
        <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options down"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></button>
      </div>
    </aria-select-content>
  </aria-select>
</div>

```html
<aria-select class="ariaui-web-select-root ariaui-web-select-motion" data-example-part="Root" default-value="item-3">
  <aria-select-trigger class="ariaui-web-select-trigger" data-example-part="Trigger"><span data-select-trigger-label>Item 3</span></aria-select-trigger>
  <aria-select-content class="ariaui-web-select-content ariaui-web-select-scroll-content" data-example-part="Content" hidden>
    <div class="ariaui-web-select-scroll-root">
      <button class="ariaui-web-select-scroll-button" type="button" aria-label="Scroll options up">...</button>
      <div class="ariaui-web-select-scroll-viewport" aria-label="Options">
        <aria-select-option class="ariaui-web-select-option" data-example-part="Option" value="item-3">Item 3<span class="ariaui-web-select-check">&#10003;</span></aria-select-option>
      </div>
    </div>
  </aria-select-content>
</aria-select>
```

## Anatomy

```html
<aria-select>
  <aria-select-trigger>Choose fruit</aria-select-trigger>
  <aria-select-content>
    <aria-select-group>
      <aria-select-group-label>Fruits</aria-select-group-label>
      <aria-select-option value="apple">Apple</aria-select-option>
    </aria-select-group>
  </aria-select-content>
</aria-select>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-select` | none |
| Trigger | `aria-select-trigger` | `combobox` |
| Content | `aria-select-content` | `listbox` |
| Option | `aria-select-option` | `option` |
| Group | `aria-select-group` | `group` |
| GroupLabel | `aria-select-group-label` | none |
| Sub | `aria-select-sub` | none |
| SubTrigger | `aria-select-sub-trigger` | `option` |
| SubContent | `aria-select-sub-content` | `listbox` |
| DropdownIndicator | `aria-select-dropdown-indicator` | none |
| TagGroup | `aria-select-tag-group` | none |
| Tag | `aria-select-tag` | none |
| Label | `aria-select-label` | `label` |

## API Reference

The package-level native contract lives in `packages/select/readme.md`.

### Root

- Element: `aria-select`
- Supports `value`, `default-value`, `open`, `default-open`, `disabled`, and `selection-mode="single | multiple"`.
- Emits a bubbling `valuechange` event with `detail.value` and `detail.values`.

### Trigger

- Element: `aria-select-trigger`
- Uses `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, and `aria-labelledby`.
- Reflects `data-has-value` when the root has a selected value.

### Content

- Element: `aria-select-content`
- Uses `role="listbox"`, `aria-multiselectable`, and `aria-activedescendant`.
- Hides when the root is closed unless `force-mount` is present.

### Option

- Element: `aria-select-option`
- Uses `role="option"`, `aria-selected`, `data-state`, `data-active`, and `data-value`.
- Disabled options expose `aria-disabled="true"` and ignore selection.

### Submenu

- Elements: `aria-select-sub`, `aria-select-sub-trigger`, `aria-select-sub-content`
- Sub triggers use option semantics with `aria-haspopup="listbox"` and `aria-expanded`.
- Keyboard-triggered submenu opens focus the first nested option.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Enter` | Opens the select or selects the active option. |
| `Space` | Opens the select or selects the active option. |
| `ArrowDown` | Opens the select and moves to the next option. |
| `ArrowUp` | Opens the select and moves to the previous option. |
| `Home` | Moves to the first option. |
| `End` | Moves to the last option. |
| `Escape` | Closes the open select and returns focus to the trigger. |
| Printable character | Moves focus with typeahead. |

## Accessibility

Use a label when the trigger text is not enough context. Keep option text concise, avoid interactive descendants inside options, and use multiple selection only when users can clearly understand that the listbox remains open after each selection.
