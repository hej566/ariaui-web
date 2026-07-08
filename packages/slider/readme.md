# Slider Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/slider`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-slider` | `group` |
| Range | `aria-slider-range` | `presentation` |
| Thumb | `aria-slider-thumb` | `presentation` |
| Track | `aria-slider-track` | `presentation` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/slider/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 19 of 19 documented sections are represented after native normalization.
- Requirement lines: 107

### Scope

- This document defines the current contract for `@ariaui-web/slider`.

### Primary References

- APG slider pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

### Mental Model

- `@ariaui-web/slider` is a composable slider primitive with root, track, range, and thumb parts. It supports single and multi-thumb configurations for selecting numeric values within a range.

### Part Model

- The package exports 4 parts:
- `Root` - Container that manages slider state
- `Track` - Visual rail representing the full range
- `Range` - Visual indicator of selected portion
- `Thumb` - Draggable handle for adjusting values

### API Surface

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- Code line: interface RootProps extends Omit<native element attributes/properties for "div", "defaultValue" | "onChange"> {
- Code line: value?: number | number[];
- Code line: defaultValue?: number | number[];
- Code line: onValueChange?: (value: number | number[]) => void;
- Code line: min?: number; // Default: 0
- Code line: max?: number; // Default: 100
- Code line: step?: number; // Default: 1
- Code line: minStepsBetweenThumbs?: number; // Default: 0
- Code line: isDisabled?: boolean; // Default: false
- Code line: orientation?: "horizontal" | "vertical"; // Default: "horizontal"
- Code line: getValueText?: (value: number) => string;
- Code line: name?: string;
- **Behavior:**
- Supports controlled and uncontrolled state
- Single value: `value={50}` or `defaultValue={50}`
- Multiple values: `value={[20, 80]}` or `defaultValue={[20, 80]}`
- `minStepsBetweenThumbs` enforces minimum distance between thumbs

### Track

- Code line: interface TrackProps extends native element attributes/properties for "div" {
- Code line: // Inherits div attributes/properties

### Range

- Code line: interface RangeProps extends native element attributes/properties for "div" {
- Code line: // Inherits div attributes/properties

### Thumb

- Code line: interface ThumbProps extends native element attributes/properties for "div" {
- Code line: index?: number; // Default: 0 (for multi-thumb sliders)

### Usage Examples

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Basic Single Slider

- Code line: import { defineSliderElements } from "@ariaui-web/slider";
- Code line: <aria-slider value={value} onValueChange={setValue} min={0} max={100}>
- Code line: <aria-slider-track>
- Code line: <aria-slider-range />
- Code line: </aria-slider-track>
- Code line: <aria-slider-thumb />
- Code line: </aria-slider>

### Range Slider (Multi-Thumb)

- Code line: <aria-slider
- Code line: value={[20, 80]}
- Code line: onValueChange={setRange}
- Code line: min={0}
- Code line: max={100}
- Code line: minStepsBetweenThumbs={1}
- Code line: >
- Code line: <aria-slider-track>
- Code line: <aria-slider-range />
- Code line: </aria-slider-track>
- Code line: <aria-slider-thumb index={0} />
- Code line: <aria-slider-thumb index={1} />
- Code line: </aria-slider>

### Vertical Slider with Custom Step

- Code line: <aria-slider
- Code line: orientation="vertical"
- Code line: value={volume}
- Code line: onValueChange={setVolume}
- Code line: min={0}
- Code line: max={100}
- Code line: step={5}
- Code line: getValueText={(v) => '${v}%'}
- Code line: >
- Code line: <aria-slider-track>
- Code line: <aria-slider-range />
- Code line: </aria-slider-track>
- Code line: <aria-slider-thumb />
- Code line: </aria-slider>

### State Contract

- The root coordinates shared slider value and thumb state through native Web Component Context.
- **Controlled mode:** When `value` is provided, the component is controlled.
- **Uncontrolled mode:** When `value` is omitted, state is managed internally using `defaultValue`.

### Accessibility Model

- The package satisfies APG slider semantics:
- Each thumb renders `role="slider"`
- Thumbs expose `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Thumbs expose `aria-orientation` (horizontal or vertical)
- Thumbs expose `aria-valuetext` when `getValueText` is provided
- Thumbs expose `aria-disabled` when disabled
- Keyboard navigation follows APG pattern

### Keyboard Interactions

- Table row: Key | Action
- Table row: `ArrowRight` / `ArrowUp` | Increase value by step
- Table row: `ArrowLeft` / `ArrowDown` | Decrease value by step
- Table row: `Home` | Set to minimum value
- Table row: `End` | Set to maximum value

### Behavior Contract

- Track defines the slider rail
- Range reflects the selected portion (from min to value for single thumb, between thumbs for multi-thumb)
- Thumbs reflect and control current slider values
- Thumbs can be dragged with mouse/touch
- Active thumb receives `data-active` attribute
- Root exposes `data-orientation` and `data-disabled` attributes
- Multi-thumb sliders maintain sorted order
- `minStepsBetweenThumbs` prevents thumbs from overlapping

### Data and ARIA Reflection

- `role="slider"` on each thumb
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on thumbs
- `aria-orientation` on thumbs
- `aria-valuetext` on thumbs (when `getValueText` provided)
- `aria-disabled` on thumbs when disabled
- `data-active` on active thumb
- `data-orientation` on root
- `data-disabled` on root when disabled

### Coverage Expectations

- Tests for this package should cover:
- root, track, range, and thumb composition
- single and multi-thumb value adjustment behavior
- slider semantics and current-value reflection
- keyboard navigation (arrows, home, end)
- controlled and uncontrolled state
- horizontal and vertical orientation
- disabled state
- minStepsBetweenThumbs enforcement






## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
