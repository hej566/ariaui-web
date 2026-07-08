export const componentSpec = {
  "kind": "component",
  "name": "NavigationMenu",
  "slug": "navigation-menu",
  "packageName": "@ariaui-web/navigation-menu",
  "description": "This package is a specialized menubar model: 1. Base keyboard/ARIA semantics follow APG menubar/menu patterns. 2. Pointer semantics are intentionally navigation-menu style: - hover is the primary context-switch/open beha",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-navigation-menu",
      "defaultRole": "navigation",
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-navigation-menu-content",
      "defaultRole": "region",
      "defaultAttributes": {
        "tabindex": "0"
      }
    },
    {
      "name": "Item",
      "tagName": "aria-navigation-menu-item",
      "defaultRole": "listitem",
      "defaultAttributes": {}
    },
    {
      "name": "Link",
      "tagName": "aria-navigation-menu-link",
      "defaultRole": "link",
      "defaultAttributes": {}
    },
    {
      "name": "List",
      "tagName": "aria-navigation-menu-list",
      "defaultRole": "list",
      "defaultAttributes": {}
    },
    {
      "name": "Sub",
      "tagName": "aria-navigation-menu-sub",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "SubContent",
      "tagName": "aria-navigation-menu-sub-content",
      "defaultRole": null,
      "defaultAttributes": {
        "tabindex": "0"
      }
    },
    {
      "name": "Submenu",
      "tagName": "aria-navigation-menu-submenu",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "SubTrigger",
      "tagName": "aria-navigation-menu-sub-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu"
      }
    },
    {
      "name": "Trigger",
      "tagName": "aria-navigation-menu-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-current",
    "aria-expanded",
    "aria-haspopup",
    "data-ariaui-navigation-menu-content",
    "data-ariaui-navigation-menu-subcontent",
    "data-ariaui-navigation-menu-value",
    "data-state",
    "dir",
    "id",
    "open",
    "orientation",
    "role",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/navigation-menu/readme.md",
    "coverage": {
      "sourceSections": 35,
      "coveredSections": 35,
      "requirements": 279
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Normative behavior/API contract for `@ariaui-web/navigation-menu`.",
          "This package is a specialized menubar model:",
          "Base keyboard/ARIA semantics follow APG menubar/menu patterns.",
          "Pointer semantics are intentionally navigation-menu style:",
          "hover is the primary context-switch/open behavior.",
          "click is a persistent activate/open action (not a toggle-close on repeated click of the same trigger)."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Radix Navigation Menu: https://www.radix-ui.com/primitives/docs/components/navigation-menu",
          "WAI-ARIA APG Menu and Menubar Pattern (including Navigation Menubar example): https://www.w3.org/WAI/ARIA/apg/patterns/menubar/",
          "This package currently implements a focused subset of Radix Navigation Menu parts:",
          "`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`",
          "`Sub`, `SubTrigger`, `SubContent`",
          "When Radix/APG describe behaviors for parts not implemented here (for example `Viewport`, `Indicator`), those are informative only."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/navigation-menu` is a specialized menubar-like navigation primitive where hover is the primary context-switch behavior and click persists the active trigger context.",
          "The package owns:",
          "active item (trigger) state",
          "open mode tracking (`\"hover\"` | `\"click\"` | `null`)",
          "trigger-to-content wiring",
          "positioned floating content (via `@ariaui-web/portal`)",
          "keyboard navigation at menubar, content, and submenu levels",
          "nested submenu support through Sub parts",
          "**Note:** Consumers render the visible trigger label themselves; the package does not export a dedicated value display part."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports 9 parts:",
          "`Root` - Container that renders `<nav>` and provides state context",
          "`List` - Renders `<ul role=\"menubar\">`",
          "`Item` - Renders `<li role=\"none\">` and provides item context",
          "`Trigger` - Button that opens/switches content panels",
          "`Content` - Portalled menu surface (only renders while active)",
          "`Link` - Anchor element inside content with menuitem semantics",
          "`Sub` - Nested submenu state container (renders no DOM)",
          "`SubTrigger` - Button that triggers a submenu",
          "`SubContent` - Portalled submenu content surface"
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
          "Renders a `<nav>` element and provides state context. Manages active value, open mode, focus intent, and trigger registration.",
          "Code line: type RootProps = native element attributes/properties for \"nav\";",
          "Key attributes/properties: `dir` (inherited from `<nav>`) - when set to `\"rtl\"`, reverses the direction of all arrow key navigation throughout the component tree."
        ]
      },
      {
        "title": "List",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Renders a `<ul>` with `role=\"menubar\"`.",
          "Code line: type ListProps = native element attributes/properties for \"ul\";"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Renders a `<li>` with `role=\"none\"`. Provides item context (`value`, `triggerRef`, `contentId`, `blockHoverDismissRef`).",
          "Code line: interface ItemProps extends native element attributes/properties for \"li\" {",
          "Code line: value?: string; // Default: auto-generated id"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Renders a `<button type=\"button\">`. Supports `native composition` for custom trigger elements via `native composition host`.",
          "Code line: interface TriggerProps extends native element attributes/properties for \"button\" {",
          "Code line: native composition?: boolean;",
          "ARIA and data attributes set automatically:",
          "`role=\"menuitem\"`",
          "`aria-haspopup=\"menu\"`",
          "`aria-expanded` - `\"true\"` when this item is active, `\"false\"` otherwise",
          "`aria-controls` - always references the content's id",
          "`data-state` - `\"open\"` when active, `\"closed\"` otherwise",
          "`data-ariaui-navigation-menu-value` - the item's value string (used internally for trigger identification)",
          "Keyboard behavior:",
          "`Enter` / `Space` / `ArrowDown` - opens content, queues focus to first content item",
          "`ArrowUp` - opens content, queues focus to last content item",
          "Mouse behavior:",
          "`mouseenter` - sets this item active; if not click-pinned, sets open mode to `\"hover\"`",
          "`mouseleave` - if hover-opened (not click-pinned), schedules deferred close unless pointer moves into the controlled Content",
          "`click` - sets open mode to `\"click\"` (pinned open), sets item active"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Portalled via `@ariaui-web/portal`. Renders a `<div>` with menu semantics by default. Only renders while the owning item is active. Use `native composition` to slot menu surface attributes/properties onto a single child element, such as a Framer Motion `motion.div`, instead of rendering the default `<div>`.",
          "Code line: interface ContentProps extends native element attributes/properties for \"div\" {",
          "Code line: native composition?: boolean;",
          "ARIA and data attributes set automatically:",
          "`role=\"menu\"`",
          "`id` - auto-generated, referenced by trigger's `aria-controls`",
          "`data-ariaui-navigation-menu-content` - marker attribute (no value)",
          "Positioned relative to the trigger element using `usePositioning`.",
          "Keyboard behavior (handled on the Content element):",
          "`ArrowDown` - move to next content item (wraps)",
          "`ArrowUp` - move to previous content item (wraps)",
          "`Home` - move to first content item",
          "`End` - move to last content item",
          "`ArrowRight` (LTR) / `ArrowLeft` (RTL) - switch to next trigger context",
          "`ArrowLeft` (LTR) / `ArrowRight` (RTL) - switch to previous trigger context",
          "`Escape` - closes content, restores focus to owning trigger",
          "Alphanumeric typeahead - focuses matching content item (case-insensitive, buffered)",
          "Mouse behavior:",
          "`mouseenter` - keeps owning item active",
          "`mouseleave` - if hover-opened (not click-pinned), clears active content (unless pointer moves into a registered submenu)",
          "`mouseover` on a menuitem - updates active/highlighted state; hovering a non-subtrigger item closes sibling open submenus"
        ]
      },
      {
        "title": "Link",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Renders an `<a>` element with menuitem semantics.",
          "Code line: interface LinkProps extends native element attributes/properties for \"a\" {",
          "Code line: active?: boolean; // When true, sets aria-current=\"page\"",
          "ARIA attributes set automatically:",
          "`role=\"menuitem\"`",
          "`tabIndex={-1}`",
          "`aria-current=\"page\"` - present when `active` is `true`, omitted otherwise",
          "Mouse behavior:",
          "`mouseenter` / `mouseover` - closes sibling submenus and updates active item in parent content (does not move DOM focus)"
        ]
      },
      {
        "title": "Sub",
        "sourceHeadingLevel": 3,
        "requirements": [
          "State container for a nested submenu. **Renders no DOM element.** Manages its own open state, focus intent, trigger ref, and content ref.",
          "Code line: interface SubProps {",
          "Code line: children: Node | string;"
        ]
      },
      {
        "title": "SubTrigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Renders a `<button type=\"button\">` that acts as a menuitem in the parent content and a trigger for its submenu. Supports `native composition` for custom trigger elements via `native composition host`.",
          "Code line: interface SubTriggerProps extends native element attributes/properties for \"button\" {",
          "Code line: native composition?: boolean;",
          "ARIA and data attributes set automatically:",
          "`role=\"menuitem\"`",
          "`tabIndex={-1}`",
          "`aria-haspopup=\"menu\"`",
          "`aria-expanded` - reflects the sub's open state",
          "`aria-controls` - references the SubContent's id",
          "`data-state` - `\"open\"` when sub is open, `\"closed\"` otherwise",
          "Keyboard behavior:",
          "Forward arrow (`ArrowRight` in LTR, `ArrowLeft` in RTL) - opens submenu and focuses first enabled submenu item",
          "Backward arrow (`ArrowLeft` in LTR, `ArrowRight` in RTL) - closes submenu, focuses SubTrigger",
          "`Enter` / `Space` - opens submenu and focuses first enabled submenu item",
          "Mouse behavior:",
          "`mouseenter` / `mouseover` - closes sibling submenus, sets active item, opens submenu (does not move DOM focus)",
          "`click` - opens submenu, focuses SubTrigger, sets open mode to `\"click\"`"
        ]
      },
      {
        "title": "SubContent",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Portalled via `@ariaui-web/portal`. Renders a `<div>` with menu semantics by default. Only renders while the parent Sub is open. Positioned to `\"right-start\"` relative to the SubTrigger with a hardcoded offset of `{ x: 6, y: 0 }`. Use `native composition` to slot submenu surface attributes/properties onto a single child element, such as a Framer Motion `motion.div`, instead of rendering the default `<div>`.",
          "Code line: interface SubContentProps extends native element attributes/properties for \"div\" {",
          "Code line: native composition?: boolean;",
          "ARIA and data attributes set automatically:",
          "`role=\"menu\"`",
          "`id` - auto-generated, referenced by SubTrigger's `aria-controls`",
          "`data-state` - `\"open\"` when sub is open, `\"closed\"` otherwise",
          "`data-ariaui-navigation-menu-subcontent` - marker attribute (no value)",
          "Keyboard behavior:",
          "`ArrowDown` - move to next submenu item (wraps)",
          "`ArrowUp` - move to previous submenu item (wraps)",
          "`Home` - move to first submenu item",
          "`End` - move to last submenu item",
          "Backward arrow - closes sub and restores focus to SubTrigger",
          "`Escape` - closes the full open chain (sub + parent content) and restores focus to the top-level trigger",
          "Alphanumeric typeahead - focuses matching submenu item (case-insensitive, buffered)",
          "Mouse behavior:",
          "`mouseover` on a menuitem - updates active/highlighted state (does not move DOM focus)"
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
          "`Root` renders a `<nav>` container.",
          "`List` renders `<ul>` with `role=\"menubar\"`.",
          "`Item` renders `<li>` with `role=\"none\"` and provides item context (`value`, `triggerRef`, `contentId`).",
          "`Trigger` renders `<button type=\"button\">` with `role=\"menuitem\"` and:",
          "`aria-haspopup=\"menu\"`",
          "`aria-expanded=\"true|false\"` based on active state",
          "`aria-controls` set to related content id (always present)",
          "`data-state=\"open|closed\"`",
          "`data-ariaui-navigation-menu-value` set to the item value",
          "`Content` renders `<div>` by default, or slots onto its child with `native composition`, with `role=\"menu\"`, `id=contentId`, and `data-ariaui-navigation-menu-content`.",
          "`Link` renders `<a>` with `role=\"menuitem\"`, `tabIndex={-1}`, and optional `aria-current=\"page\"` when `active`.",
          "`Sub` is structural context for nested menu popup behavior (renders no DOM).",
          "`SubTrigger` renders `<button type=\"button\">` with `role=\"menuitem\"`, `tabIndex={-1}`, and:",
          "`aria-expanded` reflects sub open state",
          "`aria-controls` references SubContent's id",
          "`SubContent` renders `<div>` by default, or slots onto its child with `native composition`, with `role=\"menu\"` and:",
          "`data-ariaui-navigation-menu-subcontent` marker attribute"
        ]
      },
      {
        "title": "Required State/Data Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Trigger` sets `data-state=\"open|closed\"` synchronized with `aria-expanded`.",
          "`Content` visibility is open-state driven (not rendered when closed).",
          "`SubTrigger` sets `data-state=\"open|closed\"` synchronized with `aria-expanded`.",
          "`SubContent` sets `data-state=\"open|closed\"` and is not rendered when closed."
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
        "title": "Menubar level (List / focused trigger)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "In `ltr`: `ArrowRight` moves focus to next trigger (wraps), `ArrowLeft` moves to previous trigger (wraps).",
          "In `rtl`: `ArrowLeft` moves focus to next trigger (wraps), `ArrowRight` moves to previous trigger (wraps).",
          "`Home` moves focus to first trigger.",
          "`End` moves focus to last trigger.",
          "Alphanumeric typeahead (`a-z`, `0-9`) uses a short-lived prefix buffer and moves among trigger labels with matching prefix; repeated identical characters cycle through same-prefix matches.",
          "Non-alphanumeric printable keys are ignored by navigation-menu typeahead.",
          "`Escape` closes open content and keeps/returns focus to current trigger context."
        ]
      },
      {
        "title": "Trigger open behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Enter`, `Space`, `ArrowDown` open trigger content and queue focus to first content item.",
          "`ArrowUp` opens trigger content and queues focus to last content item."
        ]
      },
      {
        "title": "Open content level (Content / focused link item)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`ArrowDown` moves to next content item (wraps).",
          "`ArrowUp` moves to previous content item (wraps).",
          "`Home`/`End` move to first/last content item.",
          "Alphanumeric typeahead (`a-z`, `0-9`) uses a short-lived prefix buffer and moves among content items with matching prefix; repeated identical characters cycle through same-prefix matches.",
          "Non-alphanumeric printable keys are ignored by content typeahead.",
          "In `ltr`: `ArrowRight` switches to next trigger context, `ArrowLeft` switches to previous trigger context.",
          "In `rtl`: `ArrowLeft` switches to next trigger context, `ArrowRight` switches to previous trigger context.",
          "`Escape` closes content and restores focus to owning trigger."
        ]
      },
      {
        "title": "Submenu level (SubTrigger / SubContent)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Logical forward arrow from a focused `SubTrigger` opens submenu and moves focus to the first enabled submenu item.",
          "If submenu is already open from hover and focus is placed on `SubTrigger`, logical forward arrow still moves focus to the first enabled submenu item.",
          "Logical backward arrow closes submenu and restores focus to `SubTrigger`.",
          "`ArrowDown`/`ArrowUp` navigate submenu items (wraps).",
          "`Home`/`End` move to first/last submenu item.",
          "Alphanumeric typeahead works within submenu items.",
          "Non-alphanumeric printable keys are ignored in submenu typeahead.",
          "`Escape` from `SubContent` closes the full open chain (`SubContent` + parent `Content`) and restores focus to the owning top-level `Trigger`.",
          "`Enter`/`Space` on `SubTrigger` opens submenu and focuses first enabled item."
        ]
      },
      {
        "title": "Tab behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Tab`/`Shift+Tab` follow native browser focus traversal.",
          "The package does not rove focus via `Tab`; arrow keys/typeahead are the composite-navigation mechanism."
        ]
      },
      {
        "title": "Pointer/Mouse Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Hovering a `Trigger` opens/switches active content without moving DOM focus.",
          "Leaving a `Trigger` clears active content, except when pointer is moving into that trigger's controlled `Content`.",
          "Clicking a `Trigger` sets it active and keeps it open (sets open mode to `\"click\"`).",
          "A click-open trigger remains open when pointer later leaves that trigger or its content; it closes on explicit dismiss or active-context switch.",
          "Re-clicking an already-active/open `Trigger` keeps it active/open (non-toggle behavior).",
          "Hovering `Content` keeps owning item active.",
          "Leaving `Content` clears active content when the menu is hover-opened (unless pointer moves into a registered submenu).",
          "Hovering a `Link` inside open content updates active/highlighted state and closes sibling submenus without moving DOM focus.",
          "Outside pointer interaction closes active content.",
          "Submenu pointer behavior:",
          "Hovering `SubTrigger`, including nested content inside the trigger, opens submenu without moving DOM focus.",
          "Clicking `SubTrigger` opens submenu, moves DOM focus to that subtrigger, and sets open mode to `\"click\"`.",
          "Moving pointer from parent `Content` into opened `SubContent` must keep the parent menu and submenu open.",
          "Moving pointer over parent-content non-item surfaces (for example container gaps/padding) must not close an open submenu.",
          "Hovering sibling non-subtrigger items in same parent menu closes open submenu.",
          "Hovering submenu items updates active/highlighted state without moving DOM focus.",
          "Pointer click focus behavior:",
          "Clicking a `Trigger` may move DOM focus to that trigger while keeping it active/open.",
          "Clicking a `SubTrigger` moves DOM focus to that subtrigger while opening its submenu."
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
        "title": "Focus and Registration Model",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Trigger order follows DOM order via ordered trigger registration.",
          "Content item order follows focusable elements discovered in content container.",
          "On content open with pending focus intent, first/last focus target is applied when items are present.",
          "SubContent uses MutationObserver to handle deferred item mounting for focus intent."
        ]
      },
      {
        "title": "Consumer Event Handlers",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Consumer handlers (`onKeyDown`, `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick`, `onMouseOver`, etc.) are additive.",
          "Internal keyboard/pointer behavior remains authoritative unless prevented by explicit consumer logic."
        ]
      },
      {
        "title": "Controlled/Uncontrolled API Contract",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Current `Root` API is effectively uncontrolled for active item state.",
          "`Item` supports optional `value`; default is generated id.",
          "`Link` supports `active` for `aria-current` semantics.",
          "Radix parity note:",
          "Radix Root-level `value/defaultValue/onValueChange`, delay controls, orientation, `Viewport`, and `Indicator` are not part of this package contract yet."
        ]
      },
      {
        "title": "APG Mapping Notes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Composite menubar/menu role model is followed (`menubar` + popup `menu` + `menuitem`).",
          "Horizontal menubar trigger movement follows APG arrow-key model.",
          "Content escape and lateral trigger switching follow APG navigation-menubar guidance.",
          "This implementation chooses wrapping behavior for menubar/content arrow navigation.",
          "Pointer behavior intentionally diverges from click-toggle menubar patterns: hover opens/switches, click pins active/open.",
          "Nested submenu behavior follows APG menubar submenu expectations."
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
        "title": "Basic Navigation Menu",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineNavigationMenuElements } from \"@ariaui-web/navigation-menu\";",
          "Code line: <aria-navigation-menu>",
          "Code line: <aria-navigation-menu-list>",
          "Code line: <aria-navigation-menu-item>",
          "Code line: <aria-navigation-menu-trigger>Products</aria-navigation-menu-trigger>",
          "Code line: <aria-navigation-menu-content>",
          "Code line: <aria-navigation-menu-link href=\"/widgets\">Widgets</aria-navigation-menu-link>",
          "Code line: <aria-navigation-menu-link href=\"/gadgets\">Gadgets</aria-navigation-menu-link>",
          "Code line: </aria-navigation-menu-content>",
          "Code line: </aria-navigation-menu-item>",
          "Code line: <aria-navigation-menu-trigger>Company</aria-navigation-menu-trigger>",
          "Code line: <aria-navigation-menu-link href=\"/about\">About</aria-navigation-menu-link>",
          "Code line: <aria-navigation-menu-link href=\"/careers\" active>Careers</aria-navigation-menu-link>",
          "Code line: </aria-navigation-menu-list>",
          "Code line: </aria-navigation-menu>"
        ]
      },
      {
        "title": "With Submenu",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-navigation-menu>",
          "Code line: <aria-navigation-menu-list>",
          "Code line: <aria-navigation-menu-item>",
          "Code line: <aria-navigation-menu-trigger>Products</aria-navigation-menu-trigger>",
          "Code line: <aria-navigation-menu-content>",
          "Code line: <aria-navigation-menu-link href=\"/overview\">Overview</aria-navigation-menu-link>",
          "Code line: <aria-navigation-menu-sub>",
          "Code line: <aria-navigation-menu-sub-trigger>Categories</aria-navigation-menu-sub-trigger>",
          "Code line: <aria-navigation-menu-sub-content>",
          "Code line: <aria-navigation-menu-link href=\"/electronics\">Electronics</aria-navigation-menu-link>",
          "Code line: <aria-navigation-menu-link href=\"/clothing\">Clothing</aria-navigation-menu-link>",
          "Code line: </aria-navigation-menu-sub-content>",
          "Code line: </aria-navigation-menu-sub>",
          "Code line: </aria-navigation-menu-content>",
          "Code line: </aria-navigation-menu-item>",
          "Code line: </aria-navigation-menu-list>",
          "Code line: </aria-navigation-menu>"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The implementation follows a menubar model:",
          "Root renders `<nav>` container",
          "List renders `role=\"menubar\"`",
          "Item renders `role=\"none\"` (presentational wrapper)",
          "Trigger renders `role=\"menuitem\"` with `aria-haspopup=\"menu\"`, `aria-expanded`, and `aria-controls`",
          "Content renders `role=\"menu\"` portalled via `@ariaui-web/portal`",
          "Link renders `<a role=\"menuitem\">` with `tabIndex={-1}` and optional `aria-current=\"page\"`",
          "SubTrigger renders `role=\"menuitem\"` with `aria-haspopup=\"menu\"`, `aria-expanded`, and `aria-controls`",
          "SubContent renders `role=\"menu\"` portalled via `@ariaui-web/portal`"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests live in `packages/navigation-menu/__test__`.",
          "Expected coverage includes:",
          "Root trigger navigation (`ArrowLeft`/`ArrowRight`/`Home`/`End` + typeahead).",
          "Trigger key-open semantics (`Enter`/`Space`/`ArrowDown`/`ArrowUp`).",
          "Content navigation and cross-trigger switching.",
          "Escape close/focus restoration.",
          "Link role/anchor semantics and behavior inside/outside content context.",
          "Context guard coverage for invalid part nesting.",
          "Submenu behaviors (`Sub`, `SubTrigger`, `SubContent`) including keyboard, pointer, focus restoration, and close-chain semantics.",
          "Hover-open submenu regression coverage, including forward-arrow focus transfer from `SubTrigger` to first submenu item.",
          "Navigation-menu-specific pointer persistence: click on active trigger remains open (non-toggle).",
          "Hover regression coverage for non-focus-stealing trigger/content/submenu behavior.",
          "Typeahead regression coverage for alphanumeric-only matching and punctuation ignore behavior.",
          "Pointer-click regression coverage for trigger/subtrigger focus behavior.",
          "Click-open persistence coverage for trigger/content mouse-leave behavior.",
          "Nested-subtrigger hover regression coverage so composed trigger content still opens submenu.",
          "Hover-open parent-trigger regression coverage so pointer transfer from top-level trigger into subtrigger opens submenu.",
          "Submenu hover persistence regression coverage so open submenu remains open across non-item parent-content hover and closes on sibling item hover.",
          "Submenu escape-chain regression coverage so pressing `Escape` from `SubContent` closes all open levels and restores focus to top-level trigger.",
          "Data attribute coverage: `data-state` on Trigger, SubTrigger, SubContent; `data-ariaui-navigation-menu-value` on Trigger; `data-ariaui-navigation-menu-content` on Content; `data-ariaui-navigation-menu-subcontent` on SubContent.",
          "Portal coverage: Content and SubContent render into `document.body`.",
          "RTL direction coverage at menubar, content, and submenu levels.",
          "`native composition` support on Trigger, Content, SubTrigger, and SubContent."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
