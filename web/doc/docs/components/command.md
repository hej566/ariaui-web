# Command

A browser-native command palette primitive with searchable listbox options, grouped commands, empty/loading states, and keyboard selection.

## Features

- Searchable command palette with combobox input semantics.
- DOM-order option registration with keyboard navigation.
- Grouped options, empty state, loading state, and separators.
- Controlled selected value and search value through native attributes, properties, and events.

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/command
```

```bash [pnpm]
pnpm add @ariaui-web/command
```

```bash [yarn]
yarn add @ariaui-web/command
```

:::

### Register Elements

```ts
import { defineCommandElements } from "@ariaui-web/command";

defineCommandElements();
```

## Examples

The live examples below use native custom elements with grouped options, filtering, keyboard navigation, and selected-value state.

### Default

<div class="ariaui-web-preview" data-component="command" data-example-variant="default">
  <aria-command class="ariaui-web-command-root" label="Command menu" data-example-part="Root">
    <div class="ariaui-web-command-trigger" aria-hidden="true">
      <span class="ariaui-web-command-icon">⌘</span>
      <aria-command-input class="ariaui-web-command-input" placeholder="Search commands..." data-example-part="Input"></aria-command-input>
    </div>
    <aria-command-content class="ariaui-web-command-content" data-example-part="Content">
      <aria-command-empty class="ariaui-web-command-empty" data-example-part="Empty">No commands found.</aria-command-empty>
      <aria-command-group class="ariaui-web-command-group" heading="Quick Actions" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Quick Actions</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Calculate budget" keywords="budget,finance,report" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Calculate budget</span>
          <span class="ariaui-web-command-shortcut">⌘ B</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="Create invoice" keywords="invoice,billing" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Create invoice</span>
          <span class="ariaui-web-command-shortcut">⌘ I</span>
        </aria-command-option>
      </aria-command-group>
      <aria-command-separator class="ariaui-web-command-separator" data-example-part="Separator"></aria-command-separator>
      <aria-command-group class="ariaui-web-command-group" heading="Views" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Views</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Open dashboard" keywords="dashboard,home" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Open dashboard</span>
          <span class="ariaui-web-command-shortcut">⌘ D</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="View reports" keywords="reports,analytics" data-example-part="Option">
          <span class="ariaui-web-command-option-label">View reports</span>
          <span class="ariaui-web-command-shortcut">⌘ R</span>
        </aria-command-option>
      </aria-command-group>
    </aria-command-content>
  </aria-command>
</div>

```html
<aria-command class="ariaui-web-command-root" label="Command menu" data-example-part="Root">
    <div class="ariaui-web-command-trigger" aria-hidden="true">
      <span class="ariaui-web-command-icon">⌘</span>
      <aria-command-input class="ariaui-web-command-input" placeholder="Search commands..." data-example-part="Input"></aria-command-input>
    </div>
    <aria-command-content class="ariaui-web-command-content" data-example-part="Content">
      <aria-command-empty class="ariaui-web-command-empty" data-example-part="Empty">No commands found.</aria-command-empty>
      <aria-command-group class="ariaui-web-command-group" heading="Quick Actions" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Quick Actions</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Calculate budget" keywords="budget,finance,report" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Calculate budget</span>
          <span class="ariaui-web-command-shortcut">⌘ B</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="Create invoice" keywords="invoice,billing" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Create invoice</span>
          <span class="ariaui-web-command-shortcut">⌘ I</span>
        </aria-command-option>
      </aria-command-group>
      <aria-command-separator class="ariaui-web-command-separator" data-example-part="Separator"></aria-command-separator>
      <aria-command-group class="ariaui-web-command-group" heading="Views" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Views</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Open dashboard" keywords="dashboard,home" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Open dashboard</span>
          <span class="ariaui-web-command-shortcut">⌘ D</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="View reports" keywords="reports,analytics" data-example-part="Option">
          <span class="ariaui-web-command-option-label">View reports</span>
          <span class="ariaui-web-command-shortcut">⌘ R</span>
        </aria-command-option>
      </aria-command-group>
    </aria-command-content>
  </aria-command>
```

### Controlled

<div class="ariaui-web-preview" data-component="command" data-example-variant="controlled">
  <aria-command class="ariaui-web-command-root" label="Command menu" data-example-part="Root" value="Open dashboard">
    <div class="ariaui-web-command-trigger" aria-hidden="true">
      <span class="ariaui-web-command-icon">⌘</span>
      <aria-command-input class="ariaui-web-command-input" placeholder="Search commands..." data-example-part="Input"></aria-command-input>
    </div>
    <aria-command-content class="ariaui-web-command-content" data-example-part="Content">
      <aria-command-empty class="ariaui-web-command-empty" data-example-part="Empty">No commands found.</aria-command-empty>
      <aria-command-group class="ariaui-web-command-group" heading="Quick Actions" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Quick Actions</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Calculate budget" keywords="budget,finance,report" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Calculate budget</span>
          <span class="ariaui-web-command-shortcut">⌘ B</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="Create invoice" keywords="invoice,billing" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Create invoice</span>
          <span class="ariaui-web-command-shortcut">⌘ I</span>
        </aria-command-option>
      </aria-command-group>
      <aria-command-separator class="ariaui-web-command-separator" data-example-part="Separator"></aria-command-separator>
      <aria-command-group class="ariaui-web-command-group" heading="Views" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Views</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Open dashboard" keywords="dashboard,home" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Open dashboard</span>
          <span class="ariaui-web-command-shortcut">⌘ D</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="View reports" keywords="reports,analytics" data-example-part="Option">
          <span class="ariaui-web-command-option-label">View reports</span>
          <span class="ariaui-web-command-shortcut">⌘ R</span>
        </aria-command-option>
      </aria-command-group>
    </aria-command-content>
  </aria-command>
  <p class="ariaui-web-command-controlled-state">Selected command: <span data-command-selected-value>Open dashboard</span></p>
</div>

```html
<aria-command class="ariaui-web-command-root" label="Command menu" data-example-part="Root" value="Open dashboard">
    <div class="ariaui-web-command-trigger" aria-hidden="true">
      <span class="ariaui-web-command-icon">⌘</span>
      <aria-command-input class="ariaui-web-command-input" placeholder="Search commands..." data-example-part="Input"></aria-command-input>
    </div>
    <aria-command-content class="ariaui-web-command-content" data-example-part="Content">
      <aria-command-empty class="ariaui-web-command-empty" data-example-part="Empty">No commands found.</aria-command-empty>
      <aria-command-group class="ariaui-web-command-group" heading="Quick Actions" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Quick Actions</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Calculate budget" keywords="budget,finance,report" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Calculate budget</span>
          <span class="ariaui-web-command-shortcut">⌘ B</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="Create invoice" keywords="invoice,billing" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Create invoice</span>
          <span class="ariaui-web-command-shortcut">⌘ I</span>
        </aria-command-option>
      </aria-command-group>
      <aria-command-separator class="ariaui-web-command-separator" data-example-part="Separator"></aria-command-separator>
      <aria-command-group class="ariaui-web-command-group" heading="Views" data-example-part="Group">
        <aria-command-label class="ariaui-web-command-label" data-example-part="Label">Views</aria-command-label>
        <aria-command-option class="ariaui-web-command-option" value="Open dashboard" keywords="dashboard,home" data-example-part="Option">
          <span class="ariaui-web-command-option-label">Open dashboard</span>
          <span class="ariaui-web-command-shortcut">⌘ D</span>
        </aria-command-option>
        <aria-command-option class="ariaui-web-command-option" value="View reports" keywords="reports,analytics" data-example-part="Option">
          <span class="ariaui-web-command-option-label">View reports</span>
          <span class="ariaui-web-command-shortcut">⌘ R</span>
        </aria-command-option>
      </aria-command-group>
    </aria-command-content>
  </aria-command>
  <p class="ariaui-web-command-controlled-state">Selected command: <span data-command-selected-value>Open dashboard</span></p>
```

## Anatomy

```html
<aria-command label="Command menu">
  <aria-command-input></aria-command-input>
  <aria-command-content>
    <aria-command-empty>No commands found.</aria-command-empty>
    <aria-command-group heading="Quick Actions">
      <aria-command-option value="Calculate budget">Calculate budget</aria-command-option>
    </aria-command-group>
  </aria-command-content>
</aria-command>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-command` | none |
| Content | `aria-command-content` | `listbox` |
| Empty | `aria-command-empty` | `presentation` |
| Group | `aria-command-group` | `group` |
| Input | `aria-command-input` | `combobox` |
| Label | `aria-command-label` | none |
| Loading | `aria-command-loading` | `progressbar` |
| Option | `aria-command-option` | `option` |
| Separator | `aria-command-separator` | `separator` |

## API Reference

### Root

- Element: `aria-command`
- Owns selected `value`, `search-value`, active option, registration, filtering, and keyboard navigation.
- `default-value` initializes selected value.
- `default-search-value` initializes the filter query.
- `should-filter="false"` disables client-side filtering.
- `disable-pointer-selection` prevents pointer hover from changing the active option.
- Dispatches `valuechange`, `searchvaluechange`, and `commandselect`.

### Input

- Element: `aria-command-input`
- Role: `combobox`
- Reads and writes the root `search-value` and controls the listbox content with `aria-controls`.

### Content

- Element: `aria-command-content`
- Role: `listbox`
- Owns visible options, groups, separators, empty content, and loading content.

### Option

- Element: `aria-command-option`
- Role: `option`
- `value` is the selected command value.
- `keywords` is a comma-separated list of extra search terms matched alongside `value` by the default filter.
- Reflects `aria-selected`, `data-selected`, `data-disabled`, `data-value`, `hidden`, and roving `tabindex`.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| ArrowDown / Ctrl+J / Ctrl+N | Move to the next visible enabled option. |
| ArrowUp / Ctrl+K / Ctrl+P | Move to the previous visible enabled option. |
| Home | Move to the first visible enabled option. |
| End | Move to the last visible enabled option. |
| Enter | Select the active option. |
| Text input | Updates `search-value` and filters options. |

## Accessibility

Command follows combobox plus listbox semantics for searchable command menus.

- `Input` exposes `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"`, and `aria-activedescendant`.
- `Content` exposes `role="listbox"` and receives a stable id for `aria-controls`.
- `Option` exposes `role="option"` and `aria-selected`.
- `Empty` uses `role="presentation"` and is shown only when filtering hides all items.
- Use clear command labels and include shortcuts as supplemental text, not the only accessible label.
