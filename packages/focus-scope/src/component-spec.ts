export const componentSpec = {
  "kind": "component",
  "name": "FocusScope",
  "slug": "focus-scope",
  "packageName": "@ariaui-web/focus-scope",
  "description": "Current options: - `loop?: boolean` - `trapped?: boolean` - `restoreFocus?: boolean` - `initialFocus?: HTMLElement reference | (() => HTMLElement | null)` - `onMountAutoFocus?: (event: Event) => void` - `on",
  "parts": [
    {
      "name": "FocusScope",
      "tagName": "aria-focus-scope",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-disabled",
    "disabled",
    "tabindex"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/focus-scope/readme.md",
    "coverage": {
      "sourceSections": 15,
      "coveredSections": 15,
      "requirements": 53
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/focus-scope`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG dialog and composite widget focus guidance: https://www.w3.org/WAI/ARIA/apg/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/focus-scope` is a focus-management utility for trapping, looping, and restoring focus within a DOM subtree."
        ]
      },
      {
        "title": "API Surface",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`FocusScope`",
          "`useFocusScope`",
          "Current options:",
          "`loop?: boolean`",
          "`trapped?: boolean`",
          "`restoreFocus?: boolean`",
          "`initialFocus?: HTMLElement reference | (() => HTMLElement | null)`",
          "`onMountAutoFocus?: (event: Event) => void`",
          "`onUnmountAutoFocus?: (event: Event) => void`"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The hook tracks the active container element used for tabbable-candidate discovery."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package supports accessible composite behavior by managing keyboard focus boundaries; it does not assign dialog or menu semantics itself."
        ]
      },
      {
        "title": "Tabbable Element Definition",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A tabbable element is one that:",
          "Has `tabindex >= 0` (explicitly or implicitly focusable)",
          "Is visible (not `display: none` or `visibility: hidden`)",
          "Is not disabled (`disabled` attribute or `aria-disabled=\"true\"`)",
          "Is not inert (not within an `inert` subtree)",
          "Includes: `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<audio controls>`, `<video controls>`, elements with `tabindex >= 0`, and `contenteditable` elements",
          "Tabbable elements are discovered in DOM order, respecting explicit `tabindex` values when present."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Initial Focus",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When `initialFocus` is provided, the scope attempts to focus that element first",
          "`initialFocus` must resolve to an element inside the scope that is connected, visible, and enabled",
          "`onMountAutoFocus` fires before the initial focus move; call `event.preventDefault()` to skip default autofocus",
          "When mounted, the scope attempts to focus the first tabbable element within the container",
          "If no tabbable elements exist, the container itself receives focus if it has `tabindex=\"-1\"` or higher",
          "If the container is not focusable and has no tabbable children, no focus change occurs"
        ]
      },
      {
        "title": "Trapped Mode",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When `trapped` is enabled, both `Tab` and `Shift+Tab` movement is kept within the container",
          "Attempting to tab beyond the last element moves focus to the first element",
          "Attempting to shift-tab before the first element moves focus to the last element",
          "External programmatic focus changes (e.g., `element.focus()`) are not prevented"
        ]
      },
      {
        "title": "Loop Mode",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When `loop` is enabled without `trapped`, tabbing past the last element wraps to the first element within the scope",
          "Shift-tabbing before the first element wraps to the last element within the scope",
          "Focus can still leave the scope through external programmatic changes"
        ]
      },
      {
        "title": "Trapped + Loop Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When both `trapped` and `loop` are enabled, `trapped` takes precedence and both behaviors produce the same result (focus wraps at boundaries)",
          "When `trapped` is true and `loop` is false, focus still wraps at boundaries (trapped implies looping)"
        ]
      },
      {
        "title": "Focus Restoration",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When `restoreFocus` is enabled, focus returns to the previously focused element on unmount",
          "`onUnmountAutoFocus` fires before focus is restored; call `event.preventDefault()` to skip restoration",
          "If the restore target no longer exists in the DOM, is disabled, or is hidden, focus moves to `document.body`",
          "If no element was focused before mount, no restoration occurs"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This package does not add custom ARIA or `data-*` state reflection by default."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "Initial focus placement on first tabbable element",
          "Initial focus fallback when no tabbable elements exist",
          "Trapped tab behavior (Tab and Shift+Tab)",
          "Looping tab behavior at boundaries",
          "Trapped + loop interaction (both enabled)",
          "Focus restoration on unmount",
          "Focus restoration fallback when target is invalid",
          "External programmatic focus changes are not prevented",
          "Tabbable element discovery (visible, enabled, correct order)"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
