export const componentSpec = {
  "kind": "component",
  "name": "DropdownMenu",
  "slug": "dropdown-menu",
  "packageName": "@ariaui-web/dropdown-menu",
  "description": "This package follows the WAI-ARIA APG menu button pattern, using the \"actions with `aria-activedescendant`\" model as the keyboard/ARIA baseline, and Radix Dropdown Menu as the component/API reference point.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-dropdown-menu",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-dropdown-menu-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-dropdown-menu-content",
      "defaultRole": "menu",
      "defaultAttributes": {
        "data-dropdown-menu-content": "",
        "tabindex": "-1"
      }
    },
    {
      "name": "Item",
      "tagName": "aria-dropdown-menu-item",
      "defaultRole": "menuitem",
      "defaultAttributes": {
        "tabindex": "-1"
      }
    },
    {
      "name": "CheckboxItem",
      "tagName": "aria-dropdown-menu-checkbox-item",
      "defaultRole": "menuitemcheckbox",
      "defaultAttributes": {}
    },
    {
      "name": "RadioGroup",
      "tagName": "aria-dropdown-menu-radio-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "RadioItem",
      "tagName": "aria-dropdown-menu-radio-item",
      "defaultRole": "menuitemradio",
      "defaultAttributes": {}
    },
    {
      "name": "Sub",
      "tagName": "aria-dropdown-menu-sub",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "SubTrigger",
      "tagName": "aria-dropdown-menu-sub-trigger",
      "defaultRole": "menuitem",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu",
        "tabindex": "-1"
      }
    },
    {
      "name": "SubContent",
      "tagName": "aria-dropdown-menu-sub-content",
      "defaultRole": "menu",
      "defaultAttributes": {
        "data-dropdown-menu-content": "",
        "tabindex": "-1"
      }
    },
    {
      "name": "Group",
      "tagName": "aria-dropdown-menu-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Label",
      "tagName": "aria-dropdown-menu-label",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Separator",
      "tagName": "aria-dropdown-menu-separator",
      "defaultRole": "separator",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-activedescendant",
    "aria-checked",
    "aria-controls",
    "aria-expanded",
    "aria-haspopup",
    "aria-labelledby",
    "checked",
    "data-disabled",
    "data-dropdown-menu-content",
    "disabled",
    "id",
    "open",
    "role",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/dropdown-menu/readme.md",
    "coverage": {
      "sourceSections": 16,
      "coveredSections": 16,
      "requirements": 132
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Normative behavior and API contract for `@ariaui-web/dropdown-menu`.",
          "This package follows the WAI-ARIA APG menu button pattern, using the \"actions with `aria-activedescendant`\" model as the keyboard/ARIA baseline, and Radix Dropdown Menu as the component/API reference point.",
          "Source references:",
          "WAI-ARIA APG Menu Button Example using `aria-activedescendant`:",
          "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-actions-active-descendant/",
          "Radix Dropdown Menu:",
          "https://www.radix-ui.com/primitives/docs/components/dropdown-menu",
          "This package currently exposes:",
          "`Root`",
          "`Trigger`",
          "`Content`",
          "`Item`",
          "`CheckboxItem`",
          "`RadioGroup`",
          "`RadioItem`",
          "`Sub`",
          "`SubTrigger`",
          "`SubContent`",
          "`Group`",
          "`Label`",
          "`Separator`",
          "Other Radix parts not currently exposed by this package, such as arrows, shortcut slots, or portals as public parts, are informative only and are not part of the contract in this spec."
        ]
      },
      {
        "title": "Structure and Roles",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` is structural state/context and does not itself define the popup semantics.",
          "`Trigger` is a button that opens the menu and:",
          "sets `aria-haspopup=\"menu\"`",
          "sets `aria-expanded`",
          "sets `aria-controls` to the open menu id when open",
          "`Content` renders the root popup menu as a `ul` by default, or slots the menu attributes/properties onto a single child element when `native composition` is set, with:",
          "`role=\"menu\"`",
          "`id` referenced by the trigger",
          "`aria-labelledby` referencing the trigger id",
          "`aria-activedescendant` reflecting the currently active item id when one exists",
          "`Item` renders `role=\"menuitem\"`.",
          "`CheckboxItem` is a menu item with `role=\"menuitemcheckbox\"` and `aria-checked`.",
          "`RadioGroup` is a structural grouping for related radio items.",
          "`RadioItem` is a menu item with `role=\"menuitemradio\"` and `aria-checked`.",
          "`SubTrigger` renders `role=\"menuitem\"` and:",
          "sets `aria-controls` to the submenu id when open",
          "`SubContent` renders the submenu popup as a `ul` by default, or slots the menu attributes/properties onto a single child element when `native composition` is set, with `role=\"menu\"`.",
          "`Group` is structural grouping for related items.",
          "`Label` provides non-interactive section labeling and does not participate in roving item focus.",
          "`Separator` provides non-interactive visual/semantic separation between item groups."
        ]
      },
      {
        "title": "Focus Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Trigger focus remains on the trigger until the menu opens.",
          "When a menu opens, DOM focus moves to the menu container, and item navigation uses active-item tracking with `aria-activedescendant` pointing to the active item's id.",
          "Active items also receive DOM focusability state (`tabIndex=0` for active, `-1` for inactive) as a fallback mechanism to ensure keyboard and pointer interactions remain coherent if focus accidentally moves to an item.",
          "On open, the active item targets the first or last enabled item depending on the opening key (ArrowDown targets first, ArrowUp targets last).",
          "On close, DOM focus returns to the owning trigger."
        ]
      },
      {
        "title": "Open and Close Behavior",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Clicking `Trigger` toggles the root menu open/closed.",
          "`Enter` or `Space` on `Trigger` toggles the root menu open/closed.",
          "`ArrowDown` on closed `Trigger` opens the menu and targets the first item.",
          "`ArrowUp` on closed `Trigger` opens the menu and targets the last item.",
          "`Escape` closes the currently open menu layer and restores focus to its trigger.",
          "Pointer interaction outside the active menu tree closes the open menu.",
          "`Root` supports controlled open state through `open` and `onOpenChange`, and uncontrolled initial state through `defaultOpen`.",
          "`Sub` supports controlled submenu open state through `open` and `onOpenChange`, and uncontrolled initial state through `defaultOpen`."
        ]
      },
      {
        "title": "Keyboard Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Enter` opens the menu and targets the first item when closed.",
          "`Space` opens the menu and targets the first item when closed.",
          "`ArrowDown` opens the menu and targets the first item.",
          "`ArrowUp` opens the menu and targets the last item.",
          "`Escape` closes the menu if open."
        ]
      },
      {
        "title": "Root Content / SubContent",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`ArrowDown` moves to the next enabled item, skipping disabled items.",
          "`ArrowUp` moves to the previous enabled item, skipping disabled items.",
          "Navigation wraps between first and last enabled item.",
          "`Home` moves to the first enabled item.",
          "`End` moves to the last enabled item.",
          "Printable character typeahead uses a short-lived prefix buffer (500ms timeout), moving to the next item whose label/value matches the typed prefix; repeated identical characters cycle through items sharing that prefix.",
          "`Enter` or `Space` activates the current item if it is enabled; disabled items cannot be activated.",
          "`Escape` closes the current menu layer and restores focus to its trigger.",
          "`CheckboxItem` toggles checked state on activation, exposes the updated `aria-checked` state, and closes the current menu layer after activation.",
          "`RadioItem` selects its value on activation, updates checked state within its owning `RadioGroup`, and closes the current menu layer after activation."
        ]
      },
      {
        "title": "Submenu",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`SubTrigger` opens its submenu with the logical forward arrow.",
          "`SubTrigger` closes or returns to its parent context with the logical backward arrow when the submenu is open.",
          "In `ltr`, forward is `ArrowRight` and backward is `ArrowLeft`.",
          "In `rtl`, forward is `ArrowLeft` and backward is `ArrowRight`.",
          "Once `SubContent` is open, `ArrowDown`, `ArrowUp`, `Home`, `End`, and typeahead behave the same as root content.",
          "`Escape` closes the submenu first; repeated escape may continue closing ancestor menu layers."
        ]
      },
      {
        "title": "Pointer Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Clicking `Trigger` toggles the root menu.",
          "Hovering a menu item makes it active and updates `aria-activedescendant`, but does not move DOM focus from the menu container.",
          "Pointer click on `SubTrigger` closes any open submenu first, closes the root menu content, and then restores focus to the root `Trigger`.",
          "Hovering a `SubTrigger` opens the submenu after a brief delay (approximately 300ms) and moves active state to that subtrigger.",
          "Hovering sibling items outside an open submenu moves active state away from the subtrigger and closes the submenu.",
          "Clicking an `Item` activates it, calls selection handlers, and closes the menu.",
          "Clicking a `CheckboxItem` toggles it and closes the current menu layer.",
          "Clicking a `RadioItem` selects it and closes the current menu layer."
        ]
      },
      {
        "title": "Selection Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Root` supports `onValueChange`.",
          "`Item` may provide a string `value`.",
          "In default single-selection behavior, activating an item reports its value through `onValueChange` and closes the menu.",
          "`Root.selectionMode` supports `\"single\"` and `\"multiple\"` as package state/configuration.",
          "Selection reporting is distinct from keyboard active-item tracking.",
          "In `\"multiple\"` mode, generic `Item` activation keeps the menu open to allow multiple selections, but `CheckboxItem` and `RadioItem` are exceptions and close the current menu layer after activation.",
          "`CheckboxItem` supports controlled checked state plus `onCheckedChange`, and may be initialized with `defaultChecked` for uncontrolled mounted-state usage.",
          "`RadioGroup` and `RadioItem` support controlled selection state plus `onValueChange`, and may be initialized with `defaultValue` for uncontrolled mounted-state usage.",
          "**Important:** Uncontrolled checkbox/radio state is only guaranteed for the current mounted lifecycle. Because `Content` and `SubContent` unmount on close, uncontrolled state is re-initialized from default attributes/properties on remount."
        ]
      },
      {
        "title": "Positioning Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Root content opens relative to `Trigger`.",
          "Root content default placement is bottom-start.",
          "Submenu content opens relative to `SubTrigger`.",
          "Root offset is configurable through `Root.offset`; submenu offset is configurable through `Sub.offset`."
        ]
      },
      {
        "title": "State and Data Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Root open state controls whether `Content` is rendered, and submenu open state controls whether `SubContent` is rendered.",
          "`aria-expanded` on `Trigger` and `SubTrigger` must stay synchronized with actual open state.",
          "`aria-activedescendant` on menu containers must reflect the current active item id or be removed when no active item exists.",
          "`CheckboxItem` and `RadioItem` must keep `aria-checked` synchronized with actual checked state.",
          "`Trigger` and `Content` ARIA relationships must stay synchronized across closed and open states.",
          "Disabled `Item`, `CheckboxItem`, `RadioItem`, and `SubTrigger` must expose `data-disabled` when rendered disabled.",
          "`Content` and `SubContent` must expose `data-dropdown-menu-content` on the actual menu host, including when `native composition` is used.",
          "Because `Content` and `SubContent` unmount on close, uncontrolled checkbox/radio state is only guaranteed for the current mounted lifecycle and is re-initialized from default attributes/properties on remount."
        ]
      },
      {
        "title": "Consumer Handler Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Consumer event handlers are additive.",
          "Internal keyboard, focus, dismissal, and selection behavior remain authoritative unless the package explicitly documents a prevent-default escape hatch."
        ]
      },
      {
        "title": "APG and Radix Mapping Notes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG supplies the normative keyboard and ARIA semantics for menu button behavior.",
          "This package follows the APG `aria-activedescendant` menu example rather than a pure roving-tabindex-only model.",
          "Radix supplies the component vocabulary and submenu expectations.",
          "This package currently implements only a subset of the full Radix Dropdown Menu API."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests in `packages/dropdown-menu/__test__` should cover at least:",
          "Trigger open/close keys and click behavior.",
          "`aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-labelledby`, and `aria-activedescendant`.",
          "Root content item navigation, wrapping, Home/End, and typeahead.",
          "Item activation and `onValueChange`.",
          "Dismissal on outside interaction and Escape.",
          "Submenu open/close and nested keyboard navigation.",
          "Checkbox and radio item roles, `aria-checked`, controlled/uncontrolled state, and activation behavior.",
          "Disabled item variants exposing `data-disabled`.",
          "Pointer hover updating active state without stealing DOM focus.",
          "SubTrigger pointer close behavior, including submenu teardown before root content teardown and focus restoration to the root trigger.",
          "Group, label, and separator rendering semantics.",
          "Trigger/content ARIA synchronization in both closed and open states.",
          "`Content` and `SubContent` `native composition` composition preserving menu roles, data attributes, event handlers, refs, and keyboard navigation on the custom host.",
          "Root controlled and uncontrolled open state through `open`, `defaultOpen`, and `onOpenChange`.",
          "Sub controlled and uncontrolled open state through `open`, `defaultOpen`, and `onOpenChange`."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec",
          "Dropdown-menu unit tests",
          "Docs/examples when dropdown-menu interactions are documented"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/dropdown-menu/__test__/dropdown-menu.test.tsx"
    ],
    "sourceTestCases": 92,
    "nativeRequirements": [
      "Trigger, Content, and SubContent ARIA relationships stay synchronized across closed and open states",
      "Content and SubContent use `role=\"menu\"`, `tabindex=\"-1\"`, `data-dropdown-menu-content`, and `aria-activedescendant` for active-item tracking",
      "Trigger opens and closes the root menu through click, Enter, Space, ArrowDown, ArrowUp, and Escape",
      "active descendant keyboard navigation follows the APG menu button model",
      "Root content keyboard navigation wraps with ArrowDown and ArrowUp, supports Home and End, skips disabled items, and supports printable typeahead",
      "SubTrigger exposes `role=\"menuitem\"`, submenu popup controls, logical arrow opening, and nested menu active-descendant behavior",
      "CheckboxItem and RadioItem expose source-equivalent `aria-checked` state and activation behavior",
      "Group, Label, and Separator keep source-equivalent non-interactive semantics",
      "docs examples include full-menu, submenu, checkboxes, radio group, and Framer Motion variants"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
