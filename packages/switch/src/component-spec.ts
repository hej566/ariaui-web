export const componentSpec = {
  "kind": "component",
  "name": "Switch",
  "slug": "switch",
  "packageName": "@ariaui-web/switch",
  "description": "It uses: 1. WAI-ARIA APG switch pattern as the accessibility baseline 2. Radix UI Switch API as the ergonomic reference 3. Native HTML checkbox as the underlying mechanism",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-switch",
      "defaultRole": "switch",
      "defaultAttributes": {}
    },
    {
      "name": "Thumb",
      "tagName": "aria-switch-thumb",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Track",
      "tagName": "aria-switch-track",
      "defaultRole": "presentation",
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
    "id",
    "required",
    "role",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/switch/readme.md",
    "coverage": {
      "sourceSections": 26,
      "coveredSections": 26,
      "requirements": 228
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/switch`.",
          "It uses:",
          "WAI-ARIA APG switch pattern as the accessibility baseline",
          "Radix UI Switch API as the ergonomic reference",
          "Native HTML checkbox as the underlying mechanism"
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG switch pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/",
          "Radix UI Switch: https://www.radix-ui.com/primitives/docs/components/switch",
          "shadcn/ui Switch: https://ui.shadcn.com/docs/components/switch"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/switch` is a composable primitive for creating accessible on/off toggles. It uses a hidden checkbox for form integration and state management, while providing custom visual elements (Track and Thumb) for styling."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` - Container that manages state and renders hidden checkbox input",
          "`Track` - Visual track element that receives focus and user interaction",
          "`Thumb` - Visual thumb element (sliding indicator), with `native composition` support for animation primitives"
        ]
      },
      {
        "title": "API Reference",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Root",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Container component that manages checked state and renders a hidden checkbox for form integration.",
          "**Props:**",
          "`checked?: boolean` - Controlled checked state",
          "`defaultChecked?: boolean` - Initial checked state for uncontrolled mode (default: `false`)",
          "`onCheckedChange?: (checked: boolean) => void` - Callback fired when checked state changes",
          "`disabled?: boolean` - Disables all interactions (default: `false`)",
          "`name?: string` - Name attribute for form submission",
          "`value?: string` - Value attribute for form submission",
          "`required?: boolean` - Required attribute for form validation",
          "`id?: string` - ID for the hidden input element",
          "`children: Node | string` - Must contain a Track component",
          "Standard `HTMLInputElement` attributes/properties (passed to hidden checkbox)",
          "**Behavior:**",
          "Supports both controlled and uncontrolled modes",
          "Renders a wrapper div that provides context to children",
          "Contains a hidden checkbox input for form integration",
          "Provides SwitchContext with state and handlers to Track and Thumb",
          "Handles Space key to toggle state",
          "Prevents event propagation to avoid bubbling",
          "**Example:**",
          "Code line: <aria-switch checked={isOn} onCheckedChange={setIsOn}>",
          "Code line: <aria-switch-track>",
          "Code line: <aria-switch-thumb />",
          "Code line: </aria-switch-track>",
          "Code line: </aria-switch>"
        ]
      },
      {
        "title": "Track",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Visual track element that receives focus and displays the switch background.",
          "**Props:**",
          "`disabled?: boolean` - Overrides context disabled state if provided",
          "Standard `HTMLDivElement` attributes/properties (className, style, etc.)",
          "**Behavior:**",
          "Renders as `<div>` element",
          "Automatically receives `role=\"switch\"` from context",
          "Automatically receives `aria-checked` from context",
          "Automatically receives `aria-disabled` from context when disabled",
          "Focusable (`tabIndex={0}`) when enabled",
          "Not focusable (`tabIndex={-1}`) when disabled",
          "Click and keyboard handlers provided via context",
          "**Example:**",
          "Code line: <aria-switch-track className=\"bg-gray-200 rounded-full\">",
          "Code line: <aria-switch-thumb />",
          "Code line: </aria-switch-track>"
        ]
      },
      {
        "title": "Thumb",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Visual thumb element that represents the sliding indicator.",
          "**Props:**",
          "`native composition?: boolean` - Slots state attributes onto a single child element instead of rendering a `<div>` (default: `false`)",
          "Standard `HTMLDivElement` attributes/properties (className, style, etc.)",
          "**Behavior:**",
          "Renders as `<div>` element by default",
          "Renders the single child element when `native composition` is true",
          "Automatically receives `data-state=\"checked\" | \"unchecked\"` from context",
          "Automatically receives `data-disabled` from context when disabled",
          "Purely presentational (no interaction logic)",
          "Position typically controlled via CSS based on data-state attribute",
          "**Example:**",
          "Code line: <aria-switch-thumb className=\"bg-white rounded-full\" />",
          "Code line: <aria-switch-thumb native composition>",
          "Code line: <motion.div className=\"bg-white rounded-full\" />",
          "Code line: </aria-switch-thumb>"
        ]
      },
      {
        "title": "Keyboard Interaction",
        "sourceHeadingLevel": 2,
        "requirements": [
          "All keyboard interactions follow the ARIA switch pattern."
        ]
      },
      {
        "title": "Standard Keys",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Space` - Toggle switch between checked and unchecked",
          "`Tab` - Focus the Track element",
          "`Shift+Tab` - Focus previous element"
        ]
      },
      {
        "title": "Constraints",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Space key calls `preventDefault()` to avoid page scrolling",
          "All keyboard interactions respect `disabled` state",
          "Enter key is not implemented (optional per APG)"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The Root component manages:",
          "`checked: boolean` - Current checked state (controlled or uncontrolled)",
          "`disabled: boolean` - Global disabled state",
          "Hidden checkbox input for form integration",
          "Event handlers for click and keyboard interaction",
          "SwitchContext providing state and handlers to children",
          "State updates trigger:",
          "`onCheckedChange` callback with new boolean value",
          "Native checkbox change event",
          "Context update causing Track and Thumb to re-render"
        ]
      },
      {
        "title": "Interaction Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The component uses a context-based interaction approach:",
          "**Root** - Provides SwitchContext with state and handlers",
          "**Hidden checkbox** - Manages actual state, enables form integration",
          "**Track** - Consumes context for ARIA attributes and handlers, receives focus via `tabIndex`",
          "**Thumb** - Consumes context for state attributes (data-state, data-disabled)",
          "Clicks on Track trigger the toggle handler from context, which calls `inputRef.current?.click()` to toggle the checkbox."
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The implementation satisfies ARIA switch requirements through automatic context-based ARIA attributes."
        ]
      },
      {
        "title": "Current Implementation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**ARIA Attributes (Automatic):**",
          "Track automatically has `role=\"switch\"`",
          "Track automatically has `aria-checked` reflecting current state",
          "Track automatically has `aria-disabled` when disabled",
          "No manual ARIA attributes required from consumers",
          "**Focus Management:**",
          "Track is focusable (`tabIndex=\"0\"`)",
          "Disabled Track not focusable (`tabIndex=\"-1\"`)",
          "Hidden checkbox has `tabIndex=\"-1\"`",
          "**Keyboard Support:**",
          "Space key toggles state",
          "Prevents default to avoid scrolling",
          "Disabled state blocks all keyboard interaction",
          "**Form Integration:**",
          "Hidden checkbox enables native form submission",
          "Supports `name`, `value`, `required` attributes",
          "Works with FormData and form validation",
          "**State Attributes:**",
          "Thumb automatically has `data-state=\"checked\" | \"unchecked\"`",
          "Thumb automatically has `data-disabled` when disabled",
          "Enables CSS-based styling without JavaScript",
          "The following attributes are required by APG but not currently implemented:",
          "`role=\"switch\"` on Track",
          "`aria-checked` on Track",
          "`aria-disabled` on Track",
          "`data-state` attribute for styling"
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
        "title": "Value Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Supports controlled mode (`checked` + `onCheckedChange`)",
          "Supports uncontrolled mode (`defaultChecked`)",
          "Mutually exclusive: only one mode active at a time",
          "Default value is `false` when neither attributes/properties provided"
        ]
      },
      {
        "title": "Toggle Logic",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Click on wrapper div triggers hidden checkbox",
          "Space key on focused Track triggers hidden checkbox",
          "Checkbox change event fires `onCheckedChange` callback",
          "Event propagation stopped to prevent bubbling"
        ]
      },
      {
        "title": "Disabled State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "When `disabled={true}`:",
          "Click handler not attached",
          "Keyboard handler not attached",
          "Track has `tabIndex={-1}`",
          "Hidden checkbox has `disabled` attribute",
          "`onCheckedChange` not called"
        ]
      },
      {
        "title": "Component Cloning",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Root clones Track child to inject `disabled` attributes/properties",
          "Uses `DOM composition` to pass attributes/properties",
          "Only first child (Track) receives cloned attributes/properties"
        ]
      },
      {
        "title": "Edge Cases",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**State Mode Conflicts:**",
          "If both `checked` and `defaultChecked` provided, controlled mode takes precedence",
          "Hidden checkbox receives only one: `checked` OR `defaultChecked`, never both",
          "**Event Propagation:**",
          "All events call `stopPropagation()` to prevent bubbling",
          "Custom click handlers on Track will not receive events from Root's wrapper",
          "**Children Requirements:**",
          "Root expects Track as direct child for cloning",
          "Multiple children or non-Track children may cause issues",
          "Cloning only affects first child",
          "**Form Submission:**",
          "Unchecked switches don't submit (standard checkbox behavior)",
          "Only checked switches include `name=value` in FormData",
          "Hidden input enables native form integration"
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Current state reflection:",
          "Hidden checkbox `checked` attribute reflects state",
          "Track receives `disabled` attributes/properties via cloning",
          "No ARIA attributes on Track (see Known Limitations)",
          "Missing reflection (should be added):",
          "`role=\"switch\"` on Track",
          "`aria-checked` on Track",
          "`aria-disabled` on Track",
          "`data-state` for CSS styling"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests must cover:",
          "**State Modes:**",
          "Controlled mode (checked + onCheckedChange)",
          "Uncontrolled mode (defaultChecked)",
          "Default unchecked state",
          "**User Interactions:**",
          "Toggle on click",
          "Toggle on Space key",
          "Tab focus navigation",
          "Disabled state prevents interaction",
          "**Callbacks:**",
          "onCheckedChange called with correct boolean value",
          "Not called when disabled",
          "**Accessibility:**",
          "ARIA role and attributes present",
          "No axe violations",
          "Keyboard navigation works",
          "Focus management correct",
          "**Form Integration:**",
          "Hidden input with name/value",
          "Form submission includes checked switches",
          "Required attribute validation"
        ]
      },
      {
        "title": "Known Limitations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**~~Missing ARIA Attributes~~ (FIXED):**",
          "~~Track does not have `role=\"switch\"`~~ yes Now automatically applied via context",
          "~~Track does not have `aria-checked` attribute~~ yes Now automatically applied via context",
          "~~Track does not have `aria-disabled` attribute~~ yes Now automatically applied via context",
          "**~~No data-state attribute~~ (FIXED):**",
          "~~Missing `data-state=\"checked\" | \"unchecked\"` for CSS styling~~ yes Now automatically applied to Thumb via context",
          "**~~Type safety issues~~ (FIXED):**",
          "~~Change handler uses `any` type~~ yes Now uses proper `Event<HTMLInputElement>`",
          "**~~Performance concerns~~ (FIXED):**",
          "~~Event handlers recreated on every render~~ yes Now memoized with useCallback",
          "~~`DOM composition` called on every render~~ yes Removed, now uses context",
          "**Enter key not supported:**",
          "Only Space key toggles (Enter is optional per APG)",
          "**~~Limited cloning~~ (FIXED):**",
          "~~Only first child receives cloned attributes/properties~~ yes Context allows any component structure",
          "**~~No useControllableState hook~~ (FIXED):**",
          "~~Manual controlled/uncontrolled logic~~ yes Now uses shared `useControllableState` hook from @ariaui-web/utils",
          "~~Inconsistent with other components~~ yes Now consistent with spinbutton, slider, etc."
        ]
      },
      {
        "title": "Accessibility Requirements",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**IMPORTANT:** Consumers MUST provide the following for full accessibility compliance:",
          "**Accessible Name (Required):** Track must have an accessible name via `aria-label` or `aria-labelledby`",
          "Code line: <aria-switch-track aria-label=\"Enable notifications\">",
          "**Visual State Indication (Required):** Provide clear visual feedback for checked/unchecked states",
          "Code line: <aria-switch-track className={checked ? \"bg-blue-500\" : \"bg-gray-300\"}>",
          "Or use the automatic `data-state` attribute on Thumb:",
          "Code line: [data-state=\"checked\"] { transform: translateX(20px); }",
          "**Focus Indicator (Required):** Ensure Track has visible focus styling",
          "Code line: [role=\"switch\"]:focus { outline: 2px solid blue; }"
        ]
      },
      {
        "title": "Implementation Recommendations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "To achieve full APG compliance, the following changes are recommended:",
          "**Add ARIA attributes to Track via cloning:**",
          "Code line: const Track = DOM composition(children as Element, {",
          "Code line: disabled,",
          "Code line: role: \"switch\",",
          "Code line: \"aria-checked\": checked,",
          "Code line: \"aria-disabled\": disabled,",
          "Code line: \"data-state\": checked ? \"checked\" : \"unchecked\"",
          "**Use proper TypeScript types:**",
          "Code line: function changeHandler(e: Event<HTMLInputElement>) {",
          "**Memoize event handlers:**",
          "Code line: const keyDownHandler = event callback((e: KeyboardEvent) => {",
          "Code line: // handler logic",
          "Code line: }, [disabled]);",
          "**Use useControllableState hook:**",
          "Consistent with other components",
          "Cleaner controlled/uncontrolled logic",
          "Better maintainability"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
