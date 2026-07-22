export const componentSpec = {
  "kind": "component",
  "name": "Slider",
  "slug": "slider",
  "packageName": "@ariaui-web/slider",
  "description": "**Behavior:** - Supports controlled and uncontrolled state - Single value: `value={50}` or `defaultValue={50}` - Multiple values: `value={[20, 80]}` or `defaultValue={[20, 80]}` - `minStepsBetweenThumbs` enforces minimum",
  "sourceTestParity": {
    "sourceFiles": [
      "slider.test.tsx",
      "slider-multithumb.test.tsx"
    ],
    "nativeTestFile": "slider.test.ts"
  },
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-slider",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Range",
      "tagName": "aria-slider-range",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Thumb",
      "tagName": "aria-slider-thumb",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Track",
      "tagName": "aria-slider-track",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-disabled",
    "aria-orientation",
    "aria-valuemax",
    "aria-valuemin",
    "aria-valuenow",
    "aria-valuetext",
    "data-active",
    "data-disabled",
    "data-orientation",
    "disabled",
    "orientation",
    "role",
    "selected",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/slider/readme.md",
    "coverage": {
      "sourceSections": 19,
      "coveredSections": 19,
      "requirements": 107
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/slider`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG slider pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/slider` is a composable slider primitive with root, track, range, and thumb parts. It supports single and multi-thumb configurations for selecting numeric values within a range."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports 4 parts:",
          "`Root` - Container that manages slider state",
          "`Track` - Visual rail representing the full range",
          "`Range` - Visual indicator of selected portion",
          "`Thumb` - Draggable handle for adjusting values"
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface RootProps extends Omit<native element attributes/properties for \"div\", \"defaultValue\" | \"onChange\"> {",
          "Code line: value?: number | number[];",
          "Code line: defaultValue?: number | number[];",
          "Code line: onValueChange?: (value: number | number[]) => void;",
          "Code line: min?: number; // Default: 0",
          "Code line: max?: number; // Default: 100",
          "Code line: step?: number; // Default: 1",
          "Code line: minStepsBetweenThumbs?: number; // Default: 0",
          "Code line: isDisabled?: boolean; // Default: false",
          "Code line: orientation?: \"horizontal\" | \"vertical\"; // Default: \"horizontal\"",
          "Code line: getValueText?: (value: number) => string;",
          "Code line: name?: string;",
          "**Behavior:**",
          "Supports controlled and uncontrolled state",
          "Single value: `value={50}` or `defaultValue={50}`",
          "Multiple values: `value={[20, 80]}` or `defaultValue={[20, 80]}`",
          "`minStepsBetweenThumbs` enforces minimum distance between thumbs"
        ]
      },
      {
        "title": "Track",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface TrackProps extends native element attributes/properties for \"div\" {",
          "Code line: // Inherits div attributes/properties"
        ]
      },
      {
        "title": "Range",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface RangeProps extends native element attributes/properties for \"div\" {",
          "Code line: // Inherits div attributes/properties"
        ]
      },
      {
        "title": "Thumb",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: interface ThumbProps extends native element attributes/properties for \"div\" {",
          "Code line: index?: number; // Default: 0 (for multi-thumb sliders)"
        ]
      },
      {
        "title": "Usage Examples",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Basic Single Slider",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineSliderElements } from \"@ariaui-web/slider\";",
          "Code line: <aria-slider value={value} onValueChange={setValue} min={0} max={100}>",
          "Code line: <aria-slider-track>",
          "Code line: <aria-slider-range />",
          "Code line: </aria-slider-track>",
          "Code line: <aria-slider-thumb />",
          "Code line: </aria-slider>"
        ]
      },
      {
        "title": "Range Slider (Multi-Thumb)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-slider",
          "Code line: value={[20, 80]}",
          "Code line: onValueChange={setRange}",
          "Code line: min={0}",
          "Code line: max={100}",
          "Code line: minStepsBetweenThumbs={1}",
          "Code line: >",
          "Code line: <aria-slider-track>",
          "Code line: <aria-slider-range />",
          "Code line: </aria-slider-track>",
          "Code line: <aria-slider-thumb index={0} />",
          "Code line: <aria-slider-thumb index={1} />",
          "Code line: </aria-slider>"
        ]
      },
      {
        "title": "Vertical Slider with Custom Step",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-slider",
          "Code line: orientation=\"vertical\"",
          "Code line: value={volume}",
          "Code line: onValueChange={setVolume}",
          "Code line: min={0}",
          "Code line: max={100}",
          "Code line: step={5}",
          "Code line: getValueText={(v) => '${v}%'}",
          "Code line: >",
          "Code line: <aria-slider-track>",
          "Code line: <aria-slider-range />",
          "Code line: </aria-slider-track>",
          "Code line: <aria-slider-thumb />",
          "Code line: </aria-slider>"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root coordinates shared slider value and thumb state through native Web Component Context.",
          "**Controlled mode:** When `value` is provided, the component is controlled.",
          "**Uncontrolled mode:** When `value` is omitted, state is managed internally using `defaultValue`."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package satisfies APG slider semantics:",
          "Each thumb renders `role=\"slider\"`",
          "Thumbs expose `aria-valuemin`, `aria-valuemax`, `aria-valuenow`",
          "Thumbs expose `aria-orientation` (horizontal or vertical)",
          "Thumbs expose `aria-valuetext` when `getValueText` is provided",
          "Thumbs expose `aria-disabled` when disabled",
          "Keyboard navigation follows APG pattern"
        ]
      },
      {
        "title": "Keyboard Interactions",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Key | Action",
          "Table row: `ArrowRight` / `ArrowUp` | Increase value by step",
          "Table row: `ArrowLeft` / `ArrowDown` | Decrease value by step",
          "Table row: `Home` | Set to minimum value",
          "Table row: `End` | Set to maximum value"
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Track defines the slider rail",
          "Range reflects the selected portion (from min to value for single thumb, between thumbs for multi-thumb)",
          "Thumbs reflect and control current slider values",
          "Thumbs can be dragged with mouse/touch",
          "Active thumb receives `data-active` attribute",
          "Root exposes `data-orientation` and `data-disabled` attributes",
          "Multi-thumb sliders maintain sorted order",
          "`minStepsBetweenThumbs` prevents thumbs from overlapping"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`role=\"slider\"` on each thumb",
          "`aria-valuenow`, `aria-valuemin`, `aria-valuemax` on thumbs",
          "`aria-orientation` on thumbs",
          "`aria-valuetext` on thumbs (when `getValueText` provided)",
          "`aria-disabled` on thumbs when disabled",
          "`data-active` on active thumb",
          "`data-orientation` on root",
          "`data-disabled` on root when disabled"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "root, track, range, and thumb composition",
          "single and multi-thumb value adjustment behavior",
          "slider semantics and current-value reflection",
          "keyboard navigation (arrows, home, end)",
          "controlled and uncontrolled state",
          "horizontal and vertical orientation",
          "disabled state",
          "minStepsBetweenThumbs enforcement"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
