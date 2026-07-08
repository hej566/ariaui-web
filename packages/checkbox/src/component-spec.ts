export const componentSpec = {
  "kind": "component",
  "name": "Checkbox",
  "slug": "checkbox",
  "packageName": "@ariaui-web/checkbox",
  "description": "It uses: 1. WAI-ARIA APG checkbox pattern as the accessibility baseline 2. Radix UI Checkbox API as the ergonomic reference 3. Native HTML checkbox behavior as the functional model",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-checkbox",
      "defaultRole": "checkbox",
      "defaultAttributes": {}
    },
    {
      "name": "Group",
      "tagName": "aria-checkbox-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Indicator",
      "tagName": "aria-checkbox-indicator",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Item",
      "tagName": "aria-checkbox-item",
      "defaultRole": "checkbox",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-checked",
    "aria-disabled",
    "aria-label",
    "aria-labelledby",
    "checked",
    "data-disabled",
    "data-state",
    "disabled",
    "required",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/checkbox/readme.md",
    "coverage": {
      "sourceSections": 30,
      "coveredSections": 30,
      "requirements": 193
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the intended contract for `@ariaui-web/checkbox`.",
          "It uses:",
          "WAI-ARIA APG checkbox pattern as the accessibility baseline",
          "Radix UI Checkbox API as the ergonomic reference",
          "Native HTML checkbox behavior as the functional model",
          "This package provides a headless, accessible checkbox component with support for controlled/uncontrolled modes, indeterminate state, form integration, and multi-select group composition."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
          "APG checkbox group: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/",
          "Radix UI Checkbox: https://www.radix-ui.com/primitives/docs/components/checkbox",
          "HTML checkbox spec: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/checkbox` is a composable primitive for creating accessible checkboxes that can be checked, unchecked, or indeterminate. `Group` composes multiple items into a managed multi-select group.",
          "Key principles:",
          "Headless architecture: behavior and accessibility without imposed styling",
          "Radix-compatible API: familiar attributes/properties and patterns",
          "APG-compliant: proper ARIA roles and keyboard support",
          "Form-ready: integrates with native form submission",
          "Indeterminate support: three-state checkbox capability",
          "Group composition: optional multi-select group with context-based state sync"
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exposes a composable part structure:",
          "`Root` - Interactive checkbox button with state management",
          "`Indicator` - Visual indicator that shows checked/indeterminate state",
          "`Item` - Alias of `Root`; use inside `Group` for semantic clarity",
          "`Group` - Multi-select group that owns `string[]` state and syncs it across child items"
        ]
      },
      {
        "title": "Checked State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Controlled and Uncontrolled Modes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package supports both controlled and uncontrolled checked state.",
          "Public API:",
          "`checked?: boolean` - Controlled checked state",
          "`defaultChecked?: boolean` - Initial checked state for uncontrolled mode (default: `false`)",
          "`onCheckedChange?: (checked: boolean) => void` - Callback when checked state changes",
          "Behavior:",
          "When `checked` is provided, component is controlled",
          "When only `defaultChecked` is provided, component is uncontrolled",
          "`onCheckedChange` fires on every state change",
          "Clicking toggles between checked and unchecked",
          "When indeterminate, clicking sets to checked",
          "When inside a `Group`:",
          "The item's `checked`, `defaultChecked`, and `onCheckedChange` attributes/properties are superseded by group state",
          "`checked` is derived from `groupValue.includes(item.value)`",
          "Click calls the group's `onItemChange` instead of local state"
        ]
      },
      {
        "title": "Indeterminate State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Public API:",
          "`indeterminate?: boolean` - Whether checkbox is in indeterminate state (default: `false`)",
          "Behavior:",
          "Indeterminate is a visual-only state, not a true third value",
          "When indeterminate is true, `aria-checked=\"mixed\"`",
          "Clicking an indeterminate checkbox sets it to checked (not unchecked)",
          "Indeterminate state is independent of checked state",
          "Common use case: parent checkbox when some (but not all) children are checked",
          "When inside a `Group`, indeterminate passes through unchanged - the group does not own it"
        ]
      },
      {
        "title": "Part Contracts",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "Render interactive button with checkbox role",
          "Own checked and indeterminate state (standalone) or derive checked from group context",
          "Coordinate controlled and uncontrolled modes",
          "Handle click interactions",
          "Provide hidden input for form integration",
          "Expose state via context to Indicator",
          "Props:",
          "Code line: interface RootProps extends Omit<ComponentPropsWithoutRef<\"button\">, \"onChange\"> {",
          "Code line: checked?: boolean;",
          "Code line: defaultChecked?: boolean;",
          "Code line: onCheckedChange?: (checked: boolean) => void;",
          "Code line: indeterminate?: boolean;",
          "Code line: name?: string;",
          "Code line: value?: string; // group identifier when inside Group; form value otherwise",
          "Code line: required?: boolean;",
          "Code line: disabled?: boolean;",
          "Code line: children?: Node | string;",
          "ARIA and data attributes:",
          "`role=\"checkbox\"`",
          "`aria-checked=\"true\" | \"false\" | \"mixed\"`",
          "`aria-disabled=\"true\"` when disabled (own or group-level)",
          "`data-state=\"checked\" | \"unchecked\" | \"indeterminate\"`",
          "`data-disabled` when disabled",
          "Group-aware behavior:",
          "Detects `Group` via optional context hook - never throws when used standalone",
          "When grouped and `value` is provided: derived checked state, click routed to group",
          "When grouped but `value` is absent: falls back to standalone behavior silently",
          "Effective `disabled` = `group.disabled || item.disabled`",
          "Effective `name` = `item.name ?? group.name`",
          "Effective `required` = `item.required ?? group.required`"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Item` is a re-export alias of `Root`. It is behaviorally identical. The alias exists for semantic clarity inside `Group`:",
          "Code line: <aria-checkbox-group value={selected} onValueChange={setSelected}>",
          "Code line: <aria-checkbox-item value=\"a\" />",
          "Code line: <aria-checkbox-item value=\"b\" />",
          "Code line: </aria-checkbox-group>",
          "The `value` attributes/properties is required for group participation. Without it, the item falls back to standalone behavior."
        ]
      },
      {
        "title": "Indicator",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "Render visual indicator for checked/indeterminate state",
          "Conditionally render based on state",
          "Provide styling hook via data attributes",
          "Props:",
          "Code line: interface IndicatorProps extends ComponentPropsWithoutRef<\"span\"> {",
          "Code line: forceMount?: boolean;",
          "Behavior:",
          "Renders only when checked or indeterminate (unless `forceMount`)",
          "Exposes `data-state=\"checked\" | \"unchecked\" | \"indeterminate\"` for styling",
          "Typically contains a checkmark or minus icon"
        ]
      },
      {
        "title": "Group",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Responsibilities:",
          "Own multi-select `string[]` state (controlled or uncontrolled)",
          "Provide stable context to child items via `CheckboxGroupContext`",
          "Propagate group-level `disabled`, `name`, and `required` to items",
          "Props:",
          "Code line: interface GroupProps extends Omit<ComponentPropsWithoutRef<\"div\">, \"onChange\"> {",
          "Code line: value?: string[];",
          "Code line: defaultValue?: string[];",
          "Code line: onValueChange?: (value: string[]) => void;",
          "Code line: disabled?: boolean;",
          "Code line: name?: string;",
          "Code line: required?: boolean;",
          "Code line: children?: Node | string;",
          "Context shape provided to items:",
          "Code line: interface CheckboxGroupContextValue {",
          "Code line: groupValue: string[]; // reactive - items derive checked from this",
          "Code line: onItemChange: (itemValue: string, checked: boolean) => void; // stable via ref sync",
          "Code line: groupDisabled: boolean;",
          "Code line: groupName: string | undefined;",
          "Code line: groupRequired: boolean | undefined;",
          "Behavior:",
          "Renders `<div role=\"group\">`",
          "`data-disabled` present when disabled",
          "`onItemChange` is stable - uses a ref to read current value, preventing unnecessary re-renders",
          "Clicking a checked item removes its value; clicking unchecked appends it",
          "No item registration - items self-identify via their `value` attributes/properties"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "APG Alignment Target",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The package should satisfy APG checkbox pattern expectations:",
          "Interactive element has `role=\"checkbox\"`",
          "Checked state communicated via `aria-checked`",
          "Indeterminate state uses `aria-checked=\"mixed\"`",
          "Disabled state uses `aria-disabled=\"true\"`",
          "Keyboard accessible (Space to toggle)",
          "Focusable via Tab key",
          "Associated label via `aria-label`, `aria-labelledby`, or wrapping label",
          "Group container uses `role=\"group\"` with `aria-label` or `aria-labelledby`"
        ]
      },
      {
        "title": "Keyboard Navigation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Required keyboard support per APG:",
          "**On checkbox:**",
          "`Space` - Toggle checked state",
          "`Tab` - Move focus to next focusable element",
          "`Shift+Tab` - Move focus to previous focusable element",
          "**Not supported (intentionally):**",
          "Arrow keys do not navigate between checkboxes (no roving tabindex in Group)"
        ]
      },
      {
        "title": "Form Integration",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Hidden Input Pattern",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When `name` is provided (directly or inherited from Group), Root renders a hidden input:",
          "Code line: <input type=\"hidden\" name=\"interests\" value=\"react\" />",
          "Behavior:",
          "Hidden input syncs with checked state",
          "When `value` attributes/properties is set, that string is used as the submission value",
          "When `value` is absent, defaults to `\"true\"` (checked) or `\"false\"` (unchecked)",
          "Inside a Group, `value` is always the item identifier string, so the submission value equals the identifier",
          "Supports `required` attribute for validation",
          "Item-level `name` / `required` overrides group-level"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/checkbox/__test__` should cover:"
        ]
      },
      {
        "title": "Core Functionality",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Controlled and uncontrolled checked state behavior",
          "Toggle on click",
          "`onCheckedChange` callback fires with correct value",
          "`defaultChecked` sets initial state",
          "Disabled state prevents interaction"
        ]
      },
      {
        "title": "Indeterminate State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Indeterminate renders with `aria-checked=\"mixed\"`",
          "Clicking indeterminate checkbox sets to checked",
          "Indicator shows correct state for indeterminate"
        ]
      },
      {
        "title": "Form Integration",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Hidden input renders when `name` provided",
          "Hidden input value syncs with checked state",
          "`required` attribute works for validation"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Proper ARIA role and attributes",
          "Keyboard navigation (Space toggles)",
          "Focus management",
          "No accessibility violations (axe)"
        ]
      },
      {
        "title": "Edge Cases",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Ref forwarding to Root",
          "Ref forwarding to Indicator",
          "Additional attributes/properties spread correctly",
          "Indicator with `forceMount` always renders"
        ]
      },
      {
        "title": "CheckboxGroup - Controlled",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Items matching `value[]` are checked; non-matching are unchecked",
          "Clicking unchecked item calls `onValueChange` with value appended",
          "Clicking checked item calls `onValueChange` with value removed"
        ]
      },
      {
        "title": "CheckboxGroup - Uncontrolled",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`defaultValue` pre-checks the matching items",
          "Clicking items updates internal state"
        ]
      },
      {
        "title": "CheckboxGroup - Disabled",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Group `disabled` propagates `data-disabled` and `aria-disabled` to all items",
          "Clicking a group-disabled item does not fire `onValueChange`",
          "Item-level `disabled` disables one item; siblings remain interactive"
        ]
      },
      {
        "title": "CheckboxGroup - Form Integration",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Group `name` propagates to all hidden inputs",
          "Item-level `name` overrides group name",
          "Hidden input `value` equals the item `value` string",
          "Group `required` propagates to hidden inputs"
        ]
      },
      {
        "title": "CheckboxGroup - Edge Cases",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Indeterminate passthrough: `aria-checked=\"mixed\"` inside group",
          "Value-less item inside group falls back to standalone without throwing",
          "Ref forwarding to group `<div>`",
          "`Item` alias behaves identically to `Root`"
        ]
      },
      {
        "title": "CheckboxGroup - Accessibility",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`role=\"group\"` on container",
          "No accessibility violations (axe) with `aria-label`"
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec file",
          "Unit tests for this package",
          "Implementation",
          "Docs examples and visual/docs tests that consume the package"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
