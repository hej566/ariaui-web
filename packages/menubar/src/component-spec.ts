export const componentSpec = {
  "kind": "component",
  "name": "Menubar",
  "slug": "menubar",
  "packageName": "@ariaui-web/menubar",
  "description": "When optional Radix and APG details differ, Radix-compatible behavior is normative.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-menubar",
      "defaultRole": "menubar",
      "defaultAttributes": {}
    },
    {
      "name": "CheckboxItem",
      "tagName": "aria-menubar-checkbox-item",
      "defaultRole": "menuitemcheckbox",
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-menubar-content",
      "defaultRole": "menu",
      "defaultAttributes": {}
    },
    {
      "name": "Group",
      "tagName": "aria-menubar-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Item",
      "tagName": "aria-menubar-item",
      "defaultRole": "menuitem",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu"
      }
    },
    {
      "name": "ItemIndicator",
      "tagName": "aria-menubar-item-indicator",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Label",
      "tagName": "aria-menubar-label",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Menu",
      "tagName": "aria-menubar-menu",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "RadioGroup",
      "tagName": "aria-menubar-radio-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "RadioItem",
      "tagName": "aria-menubar-radio-item",
      "defaultRole": "menuitemradio",
      "defaultAttributes": {}
    },
    {
      "name": "Separator",
      "tagName": "aria-menubar-separator",
      "defaultRole": "separator",
      "defaultAttributes": {}
    },
    {
      "name": "Sub",
      "tagName": "aria-menubar-sub",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "SubContent",
      "tagName": "aria-menubar-sub-content",
      "defaultRole": "menu",
      "defaultAttributes": {}
    },
    {
      "name": "Submenu",
      "tagName": "aria-menubar-submenu",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "SubTrigger",
      "tagName": "aria-menubar-sub-trigger",
      "defaultRole": "menuitem",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu"
      }
    },
    {
      "name": "Trigger",
      "tagName": "aria-menubar-trigger",
      "defaultRole": "menuitem",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu"
      }
    }
  ],
  "requirementAttributes": [
    "aria-activedescendant",
    "aria-checked",
    "aria-controls",
    "aria-disabled",
    "aria-expanded",
    "aria-haspopup",
    "aria-labelledby",
    "checked",
    "data-align",
    "data-disabled",
    "data-highlighted",
    "data-menubar-value",
    "data-orientation",
    "data-side",
    "data-state",
    "data-text-value",
    "dir",
    "disabled",
    "open",
    "required",
    "role",
    "selected",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/menubar/readme.md",
    "coverage": {
      "sourceSections": 35,
      "coveredSections": 35,
      "requirements": 210
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Normative behavior/API contract for `@ariaui-web/menubar`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Radix Menubar: https://www.radix-ui.com/primitives/docs/components/menubar",
          "WAI-ARIA APG Menubar: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/",
          "When optional Radix and APG details differ, Radix-compatible behavior is normative."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/menubar` is a Radix-compatible menubar/menu primitive with top-level trigger navigation, popup content, submenu support, and checkable items."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports 15 compound parts:",
          "Table row: Part | Element | Role / Semantic | Description",
          "Table row: `Root` | `<div>` | `role=\"menubar\"` | Top-level menubar container with keyboard navigation context",
          "Table row: `Menu` | `<div>` | none | Wrapper that provides per-menu context (open state, positioning, trigger ref)",
          "Table row: `Trigger` | `<button>` | `role=\"menuitem\"` | Top-level menubar trigger; opens associated Content popup",
          "Table row: `Content` | `<ul>` | `role=\"menu\"` | Popup menu panel; portalled to `document.body`",
          "Table row: `Item` | `<button>` | `role=\"menuitem\"` | Standard menu item",
          "Table row: `CheckboxItem` | `<button>` | `role=\"menuitemcheckbox\"` | Toggleable menu item with checked state",
          "Table row: `RadioGroup` | `<div>` | `role=\"group\"` | Groups RadioItem elements with shared selection",
          "Table row: `RadioItem` | `<button>` | `role=\"menuitemradio\"` | Single-select radio menu item within RadioGroup",
          "Table row: `ItemIndicator` | `<div>` | none | Conditionally rendered indicator; only renders children when parent is checked",
          "Table row: `Sub` | none (context) | - | Submenu state container (no DOM output)",
          "Table row: `SubTrigger` | `<button>` | `role=\"menuitem\"` | Opens associated SubContent popup on hover/keyboard",
          "Table row: `SubContent` | `<ul>` | `role=\"menu\"` | Submenu popup panel; portalled to `document.body`",
          "Table row: `Group` | `<div>` | `role=\"group\"` | Groups related menu items",
          "Table row: `Label` | `<div>` | none | Non-interactive label within menu",
          "Table row: `Separator` | `<div>` | `role=\"separator\"` | Visual divider between menu sections"
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
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string` | - | Controlled open menu value",
          "Table row: `defaultValue` | `string` | `\"\"` | Initial open menu value (uncontrolled)",
          "Table row: `onValueChange` | `(value: string) => void` | - | Called when open menu changes",
          "Table row: `loop` | `boolean` | `false` | Wrap keyboard navigation between first/last trigger"
        ]
      },
      {
        "title": "Menu",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string` | - | Value identifier for this menu",
          "Table row: `onValueChange` | `(value: string) => void` | - | Called when menu value changes",
          "Table row: `offset` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Positioning offset for Content popup"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string` | `\"\"` | Value identifier for this trigger",
          "Table row: `native composition` | `boolean` | - | Render as child element via native composition host pattern",
          "Table row: `disabled` | `boolean` | - | Disable trigger interaction"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `native composition` | `boolean` | - | native composition host menu surface attributes/properties onto a single child element for custom hosts such as Framer Motion components",
          "Table row: `loop` | `boolean` | `false` | Wrap keyboard navigation between first/last item",
          "Table row: `onEntryFocus` | `(event: Event) => void` | - | Called when menu receives initial focus",
          "Table row: `onCloseAutoFocus` | `(event: Event) => void` | - | Called when focus returns after close",
          "Table row: `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Called on Escape key press",
          "Table row: `onPointerDownOutside` | `(event: MouseEvent \\ | TouchEvent) => void` | - | Called on outside pointer down",
          "Table row: `onFocusOutside` | `(event: FocusEvent) => void` | - | Called when focus moves outside",
          "Table row: `onInteractOutside` | `(event: Event) => void` | - | Called on any outside interaction"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `textValue` | `string` | - | Override text for typeahead matching",
          "Table row: `onSelect` | `(event: Event) => void` | - | Called when item is selected",
          "Table row: `disabled` | `boolean` | - | Disable item interaction"
        ]
      },
      {
        "title": "CheckboxItem",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Extends Item attributes/properties.",
          "Table row: Prop | Type | Default | Description",
          "Table row: `checked` | `boolean` | - | Controlled checked state",
          "Table row: `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled)",
          "Table row: `onCheckedChange` | `(checked: boolean) => void` | - | Called when checked state changes",
          "Table row: `showIndicator` | `boolean` | `true` | Whether to show the check indicator"
        ]
      },
      {
        "title": "RadioGroup",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string` | - | Controlled selected value",
          "Table row: `defaultValue` | `string` | - | Initial selected value (uncontrolled)",
          "Table row: `onValueChange` | `(value: string) => void` | - | Called when selection changes"
        ]
      },
      {
        "title": "RadioItem",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Extends Item attributes/properties.",
          "Table row: Prop | Type | Default | Description",
          "Table row: `value` | `string` | **(required)** | Value identifier for this radio item",
          "Table row: `showIndicator` | `boolean` | `true` | Whether to show the radio indicator"
        ]
      },
      {
        "title": "ItemIndicator",
        "sourceHeadingLevel": 3,
        "requirements": [
          "No additional attributes/properties. Renders children only when the parent CheckboxItem or RadioItem is checked."
        ]
      },
      {
        "title": "Sub",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `offset` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Positioning offset (not currently applied to SubContent)",
          "Table row: `open` | `boolean` | - | Controlled open state",
          "Table row: `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled)",
          "Table row: `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes"
        ]
      },
      {
        "title": "SubTrigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Prop | Type | Default | Description",
          "Table row: `disabled` | `boolean` | - | Disable subtrigger interaction",
          "Note: SubTrigger does NOT support `native composition` (unlike Trigger)."
        ]
      },
      {
        "title": "SubContent",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Supports `native composition` plus the same lifecycle/dismissal attributes/properties as Content.",
          "Table row: Prop | Type | Default | Description",
          "Table row: `native composition` | `boolean` | - | native composition host submenu surface attributes/properties onto a single child element for custom hosts such as Framer Motion components",
          "Table row: `loop` | `boolean` | `false` | Wrap keyboard navigation between first/last submenu item",
          "`onEntryFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`."
        ]
      },
      {
        "title": "Group / Label / Separator",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Standard `native element attributes/properties for \"div\"` - no custom attributes/properties."
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Structure, Roles, and ARIA",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` renders `<div role=\"menubar\">`.",
          "`Content`/`SubContent` render `<ul>` elements by default, or slot menu attributes/properties onto a child with `native composition`, with `role=\"menu\"` and are popup containers portalled to `document.body`.",
          "Item roles:",
          "`Item` -> `role=\"menuitem\"`",
          "`CheckboxItem` -> `role=\"menuitemcheckbox\"`",
          "`RadioItem` -> `role=\"menuitemradio\"`",
          "Trigger/SubTrigger ARIA:",
          "`aria-haspopup=\"menu\"`",
          "`aria-expanded` reflects open state",
          "`aria-controls` set to content node ID **only when open** (absent when closed)",
          "Popup labeling:",
          "`aria-labelledby` references the trigger/subtrigger ID on `Content`/`SubContent`.",
          "Active descendant:",
          "`Content`/`SubContent` use `aria-activedescendant` to track the highlighted item.",
          "Disabled/checked semantics:",
          "`disabled`/`aria-disabled` where applicable",
          "`aria-checked` for checkbox/radio items."
        ]
      },
      {
        "title": "Required Data Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root`:",
          "`data-orientation=\"horizontal\"`",
          "`Trigger`:",
          "`data-state=\"open|closed\"`",
          "`data-highlighted` (empty string) when highlighted",
          "`data-disabled` (empty string) when disabled",
          "`data-menubar-value` - resolved value identifying this trigger",
          "`SubTrigger`:",
          "`Content`/`SubContent`:",
          "`data-state=\"open\"` (only rendered when open)",
          "`data-side` - placement side (`\"bottom\"` for Content, `\"right\"` for SubContent)",
          "`data-align` - placement alignment (`\"start\"` default)",
          "`Item`/`CheckboxItem`/`RadioItem`:",
          "`data-text-value` - typeahead override text (on underlying `<button>`)",
          "Checkable items:",
          "`data-state=\"checked|unchecked\"` on checkbox/radio items",
          "`aria-checked=\"true|false\"`"
        ]
      },
      {
        "title": "Positioning",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Content` default placement: `\"bottom-start\"` relative to trigger.",
          "`SubContent` default placement: `\"right-start\"` with hardcoded offset `{ x: 2, y: -4 }`.",
          "Both Content and SubContent are portalled to `document.body` via `@ariaui-web/portal`."
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
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Keyboard Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The local Aria UI package docs include this h3 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Menubar level",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Tab`/`Shift+Tab` enter/exit the menubar composite.",
          "If a trigger is focused and its menu is open:",
          "`Tab` moves focus to the next trigger, closes current menu, opens next trigger menu.",
          "`Shift+Tab` moves focus to the previous trigger, closes current menu, opens previous trigger menu.",
          "`ArrowRight`/`ArrowLeft` move across top-level triggers.",
          "In RTL (`dir=\"rtl\"`), next/previous direction is mirrored.",
          "`Home`/`End` move to first/last trigger.",
          "Trigger typeahead focuses matching trigger labels.",
          "Menubar typeahead accepts any printable single character, not only letters/digits."
        ]
      },
      {
        "title": "Open menu/submenu level",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`ArrowDown`/`ArrowUp` move through enabled items.",
          "`Enter`/`Space` activate item behavior.",
          "`Escape` closes current menu chain and restores focus appropriately.",
          "Direction-aware submenu keys:",
          "open submenu with logical forward arrow (e.g. `ArrowRight` in LTR).",
          "close submenu with logical backward arrow (e.g. `ArrowLeft` in LTR) and restore parent subtrigger focus.",
          "If focus is on an item without submenu in `Content`, logical lateral arrow switches top-level menu context and keeps focus on the target trigger (menu opens, first item is **not** auto-focused).",
          "If focus is on an item in `SubContent`, logical lateral forward arrow switches to the **next** top-level trigger and keeps focus on that trigger.",
          "If `SubContent` is already open and focus is on `SubTrigger`, pressing logical forward arrow moves focus to first enabled item in `SubContent`.",
          "`Home`/`End` move to first/last item in current menu.",
          "Item typeahead matches labels and supports `textValue` override.",
          "Typeahead behavior details:",
          "Uses a short rolling buffer window for multi-character matching.",
          "Exact match is prioritized when present.",
          "Repeated single-character input cycles through items/triggers sharing that prefix.",
          "Printable punctuation keys participate in matching when item/trigger text starts with that character."
        ]
      },
      {
        "title": "Looping",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Looping is attributes/properties-driven (not always on):",
          "`Root.loop` controls trigger wrap.",
          "`Content.loop` controls menu item wrap.",
          "`SubContent.loop` controls submenu item wrap.",
          "Current package defaults: `Root.loop=false`, `Content.loop=false`, `SubContent.loop=false`."
        ]
      },
      {
        "title": "Pointer/Mouse Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Trigger click opens its menu.",
          "Activating another trigger switches open menu context.",
          "Subtrigger pointer interaction opens submenu.",
          "Outside pointer interaction closes relevant menu chain.",
          "Disabled trigger/subtrigger/items are pointer non-interactive.",
          "Item pointer activation:",
          "`Item`: calls `onSelect`, then closes.",
          "`CheckboxItem`: calls `onCheckedChange` before close.",
          "`RadioItem`: calls `RadioGroup.onValueChange` before close.",
          "Consumer-observable state callbacks must occur before close/unmount effects hide menu.",
          "Checkbox/radio state remains correct across close/reopen.",
          "Hover behavior:",
          "Hovering trigger or subtrigger may open/switch menu context and update highlighted state, but does not move DOM focus.",
          "Hovering enabled item in `Content`/`SubContent` updates highlighted state, but does not move DOM focus.",
          "Hovering a sibling trigger while another element is focused may switch open menu context, but focus stays where it was.",
          "Pointer hover and keyboard focus are independent; keyboard remains the authority for DOM focus movement.",
          "Pointer click focus behavior:",
          "Clicking a trigger may move DOM focus to that trigger.",
          "Clicking a subtrigger may move DOM focus to that subtrigger while opening its submenu.",
          "Sibling-hover submenu close:",
          "If submenu is open and focus/hover moves to sibling non-subtrigger item in same parent menu, open submenu closes.",
          "Pointer-open keyboard coherence:",
          "Menu opened via pointer + `ArrowDown` focuses first enabled item.",
          "Menu opened via pointer + `ArrowUp` focuses last enabled item."
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Controlled/Uncontrolled API Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Root selection: `value`, `defaultValue`, `onValueChange`.",
          "Sub open control target: `open`, `defaultOpen`, `onOpenChange`.",
          "Checkbox: `checked`, `defaultChecked`, `onCheckedChange`.",
          "RadioGroup: `value`, `defaultValue`, `onValueChange`.",
          "Item selection: `onSelect`.",
          "Search matching: `textValue`.",
          "Directionality: `dir` at root level."
        ]
      },
      {
        "title": "Consumer Event Handlers",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Consumer event handlers are composed with internal behavior; they do not replace core menubar behavior.",
          "Applies to trigger/subtrigger/content keyboard and pointer handlers.",
          "Consumer handlers run in addition to internal handlers and may observe final state changes."
        ]
      },
      {
        "title": "Dismissal/Focus Hooks",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Hooks apply to `Content`/`SubContent` (not `Root`):",
          "`onCloseAutoFocus`",
          "`onEscapeKeyDown`",
          "`onPointerDownOutside`",
          "`onFocusOutside`",
          "`onInteractOutside`",
          "`onEntryFocus`",
          "If provided, a hook should fire at its corresponding lifecycle/event boundary."
        ]
      },
      {
        "title": "APG Mapping Notes (Informative)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "APG menubar keyboard model is covered by the directional/open/close rules above.",
          "APG optional behavior is configuration-driven in this package.",
          "Wrap behavior is `loop`-driven.",
          "Horizontal arrow semantics are direction-aware (`dir`), not hardcoded LTR."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests live in:",
          "`packages/menubar/__test__` (unit behavior/API)",
          "Expected coverage includes:",
          "Roles/ARIA: menubar role, menu role, menuitem/menuitemcheckbox/menuitemradio roles, aria-haspopup, aria-expanded, aria-controls (conditional), aria-checked, aria-labelledby, aria-activedescendant.",
          "Data attributes: data-state, data-highlighted, data-disabled, data-orientation, data-side, data-align, data-menubar-value, data-text-value.",
          "Rendering: Content/SubContent as default `<ul>` elements or `native composition` slotted hosts, Content/SubContent portalled to `document.body`, Separator/Group/Label element types and roles.",
          "Trigger navigation + RTL directionality.",
          "Item navigation/activation + submenu open/close focus restoration.",
          "Loop matrix for `Root.loop`, `Content.loop`, `SubContent.loop` true/false.",
          "Typeahead regression coverage for printable punctuation and buffered matching.",
          "Pointer interactions including non-focus-stealing hover, click-focus behavior, and sibling-hover submenu close.",
          "Controlled/uncontrolled APIs.",
          "Trigger, Content, and SubContent `native composition` support via native composition host pattern.",
          "ItemIndicator conditional rendering based on checked state."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
