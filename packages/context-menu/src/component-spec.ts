export const componentSpec = {
  "kind": "component",
  "name": "ContextMenu",
  "slug": "context-menu",
  "packageName": "@ariaui-web/context-menu",
  "description": "This document defines the current implementation contract for `@ariaui-web/context-menu`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-context-menu",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-context-menu-content",
      "defaultRole": "menu",
      "defaultAttributes": {
        "tabindex": "0"
      }
    },
    {
      "name": "Item",
      "tagName": "aria-context-menu-item",
      "defaultRole": "menuitem",
      "defaultAttributes": {}
    },
    {
      "name": "Sub",
      "tagName": "aria-context-menu-sub",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "SubTrigger",
      "tagName": "aria-context-menu-sub-trigger",
      "defaultRole": "menuitem",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "menu",
        "tabindex": "-1"
      }
    },
    {
      "name": "SubContent",
      "tagName": "aria-context-menu-sub-content",
      "defaultRole": "menu",
      "defaultAttributes": {
        "tabindex": "0"
      }
    },
    {
      "name": "Group",
      "tagName": "aria-context-menu-group",
      "defaultRole": "group",
      "defaultAttributes": {}
    },
    {
      "name": "Label",
      "tagName": "aria-context-menu-label",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Separator",
      "tagName": "aria-context-menu-separator",
      "defaultRole": "separator",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-activedescendant",
    "aria-expanded",
    "aria-haspopup",
    "aria-labelledby",
    "data-active",
    "data-focused",
    "disabled",
    "id",
    "open",
    "role",
    "selected",
    "tabindex",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/context-menu/readme.md",
    "coverage": {
      "sourceSections": 49,
      "coveredSections": 49,
      "requirements": 384
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current implementation contract for `@ariaui-web/context-menu`.",
          "`@ariaui-web/context-menu` is a headless, accessible context menu primitive that provides a menu interface triggered by right-click or context menu events. It supports keyboard navigation, submenus, groups, and follows WAI-ARIA menu patterns."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/",
          "WAI-ARIA Menubar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/",
          "Radix Context Menu: https://www.radix-ui.com/primitives/docs/components/context-menu",
          "Implementation: [packages/context-menu/src](./src)"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A context menu is a floating menu that appears at the cursor position when a user right-clicks (or uses context menu key) on a designated area. Users navigate with keyboard or mouse and select items to execute commands.",
          "Key characteristics:",
          "**Headless architecture**: Behavior and accessibility without imposed styling",
          "**Context-triggered**: Opens on right-click or context menu key",
          "**Keyboard-first**: Full keyboard navigation with roving tabindex",
          "**Composable**: Flexible part structure for menus, submenus, and groups",
          "**Floating UI**: Positioned at cursor location using virtual reference"
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports these composable parts:"
        ]
      },
      {
        "title": "Core Parts",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` - Container that owns state and context",
          "`Content` - Floating menu container for items",
          "`Item` - Selectable menu item"
        ]
      },
      {
        "title": "Submenu Parts",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Sub` - Submenu state container",
          "`SubTrigger` - Trigger that opens a submenu",
          "`SubContent` - Floating submenu container"
        ]
      },
      {
        "title": "Structural Parts",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Group` - Groups related items",
          "`Label` - Label for a group",
          "`Separator` - Visual separator between groups"
        ]
      },
      {
        "title": "Hooks",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`useRootContext` - Access root context from any child component",
          "`useContentContext` - Access content context for item registration",
          "`useSubContext` - Access submenu context"
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
        "title": "Open State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Root` manages the menu open/closed state:",
          "Code line: interface RootProps {",
          "Code line: areaRef: native Web Component.RefObject<HTMLElement>; // Element to attach context menu to",
          "Code line: onValueChange?: (value: string) => void; // Selection callback",
          "Code line: offset?: { x: number; y: number }; // Position offset from cursor",
          "**Behavior:**",
          "Menu opens on right-click (contextmenu event) within areaRef element",
          "Menu closes on item selection, Escape, Tab, or click outside",
          "Position calculated from cursor coordinates using virtual reference",
          "`onValueChange` fires when an item is selected"
        ]
      },
      {
        "title": "Focus Intent State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Internal state for managing keyboard focus:",
          "`'first'` - Focus first item",
          "`'last'` - Focus last item",
          "`null` - No focus intent (content container focused)",
          "Used to coordinate focus between Content and Items."
        ]
      },
      {
        "title": "Submenu State",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Each `Sub` manages its own open state:",
          "Opens on hover, ArrowRight, Enter, or Space",
          "Closes on ArrowLeft or when parent closes",
          "Supports deep nesting"
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
          "**Responsibilities:**",
          "Own menu open/closed state",
          "Provide context to all child components",
          "Attach context menu listener to areaRef element",
          "Calculate menu position from cursor coordinates",
          "Handle click outside to close menu",
          "Coordinate focus intent",
          "**Props:**",
          "Code line: interface RootProps extends ComponentPropsWithoutRef<\"div\"> {",
          "Code line: areaRef: native Web Component.RefObject<HTMLElement>;",
          "Code line: onValueChange?: (value: string) => void;",
          "Code line: offset?: { x: number; y: number };",
          "Code line: open?: boolean;",
          "Code line: defaultOpen?: boolean;",
          "Code line: onOpenChange?: (open: boolean) => void;",
          "Code line: children: Node | string;",
          "**Context Provided:**",
          "`isOpen` - Current open state",
          "`setIsOpen` - Update open state",
          "`closeMenu` - Close menu function",
          "`onValueChange` - Selection callback",
          "`focusIntent` - Focus coordination state",
          "`setFocusIntent` - Update focus intent",
          "`nodeId` - Unique ID for the menu instance",
          "`virtualRef` - Cursor position reference",
          "`registerFloatingEl` - Register floating element for positioning"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render floating menu container with menu role",
          "Register and track menu items",
          "Manage active item state with roving tabindex",
          "Coordinate keyboard navigation",
          "Handle focus management (content vs items)",
          "Portal to body for proper stacking",
          "**Props:**",
          "Code line: interface ContentProps extends ComponentPropsWithoutRef<\"ul\"> {",
          "Code line: children: Node | string;",
          "Code line: native composition?: boolean;",
          "`native composition` - native composition host menu attributes/properties onto a custom element, such as a Framer Motion component",
          "**ARIA Attributes:**",
          "`role=\"menu\"`",
          "`tabindex=\"0\"` when content focused, `\"-1\"` when item focused",
          "`aria-activedescendant` - ID of active item (when item focused)",
          "`data-focused` - \"true\" when content focused, \"false\" when item focused",
          "**Behavior:**",
          "Initially focuses the content container (not an item)",
          "ArrowDown from content focuses first item",
          "ArrowUp from content focuses last item",
          "Tracks all registered items via refs",
          "Provides keyboard navigation handlers"
        ]
      },
      {
        "title": "Item",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render selectable menu item",
          "Register with Content when mounted",
          "Handle selection on click, Enter, or Space",
          "Manage focus state with roving tabindex",
          "Scroll into view when focused",
          "**Props:**",
          "Code line: interface ItemProps extends ComponentPropsWithoutRef<\"button\"> {",
          "Code line: value: string; // Item value (passed to onValueChange)",
          "Code line: disabled?: boolean; // Disable selection",
          "**ARIA Attributes:**",
          "`role=\"menuitem\"`",
          "`tabindex=\"0\"` when focused, `\"-1\"` otherwise",
          "`data-active` - \"true\" when focused, \"false\" otherwise",
          "**Selection:**",
          "Click selects the item",
          "Enter or Space selects when focused",
          "Calls `root.onValueChange(value)`",
          "Closes menu after selection",
          "Disabled items cannot be selected"
        ]
      },
      {
        "title": "Sub",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Own submenu open/closed state",
          "Provide submenu context to SubTrigger and SubContent",
          "Coordinate trigger and content refs",
          "**Props:**",
          "Code line: interface SubProps {",
          "Code line: children: Node | string;",
          "Code line: offset?: { x: number; y: number };",
          "Code line: open?: boolean;",
          "Code line: defaultOpen?: boolean;",
          "Code line: onOpenChange?: (open: boolean) => void;",
          "**Context Provided:**",
          "`isOpen` - Submenu open state",
          "`setIsOpen` - Update submenu state",
          "`focusIntent` - Focus coordination for submenu",
          "`triggerRef` - Ref to SubTrigger element",
          "`floatingEl` - Submenu floating element",
          "`nodeId` - Unique submenu ID"
        ]
      },
      {
        "title": "SubTrigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render menu item that opens a submenu",
          "Open submenu on hover, ArrowRight, Enter, or Space",
          "Register as a menu item for navigation",
          "Manage ARIA expanded state",
          "**Props:**",
          "Code line: interface SubTriggerProps extends ComponentPropsWithoutRef<\"button\"> {",
          "Code line: children: Node | string;",
          "**ARIA Attributes:**",
          "`role=\"menuitem\"`",
          "`aria-haspopup=\"menu\"`",
          "`aria-expanded` - \"true\" when submenu open, \"false\" otherwise",
          "`tabindex=\"0\"` when focused, `\"-1\"` otherwise",
          "**Behavior:**",
          "Hover opens submenu after delay",
          "ArrowRight opens submenu and focuses first item",
          "Enter/Space opens submenu",
          "Participates in parent menu navigation"
        ]
      },
      {
        "title": "SubContent",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render floating submenu container",
          "Same behavior as Content but for submenus",
          "Position relative to SubTrigger",
          "Close on ArrowLeft (returns focus to trigger)",
          "**Props:**",
          "Code line: interface SubContentProps extends ComponentPropsWithoutRef<\"ul\"> {",
          "Code line: children: Node | string;",
          "Code line: native composition?: boolean;",
          "`native composition` - native composition host submenu attributes/properties onto a custom element, such as a Framer Motion component",
          "**ARIA Attributes:**",
          "Same as Content",
          "`role=\"menu\"`",
          "`aria-activedescendant` when item focused"
        ]
      },
      {
        "title": "Group",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Group related menu items together",
          "Associate with Label via aria-labelledby",
          "**Props:**",
          "Code line: interface GroupProps extends ComponentPropsWithoutRef<\"div\"> {",
          "Code line: children: Node | string;",
          "**ARIA Attributes:**",
          "`role=\"group\"`",
          "`aria-labelledby` - Points to Label ID if present"
        ]
      },
      {
        "title": "Label",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Provide accessible label for a Group",
          "Register label ID with parent Group",
          "**Props:**",
          "Code line: interface LabelProps extends ComponentPropsWithoutRef<\"div\"> {",
          "Code line: children: Node | string;",
          "**ARIA Attributes:**",
          "`id` - Unique label ID",
          "Used by Group's `aria-labelledby`"
        ]
      },
      {
        "title": "Separator",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Visual separator between groups or sections",
          "**Props:**",
          "Code line: interface SeparatorProps extends ComponentPropsWithoutRef<\"div\"> {",
          "Code line: children?: Node | string;",
          "**ARIA Attributes:**",
          "`role=\"separator\"`"
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
        "title": "ARIA Roles and Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Content (Menu):**",
          "`role=\"menu\"`",
          "`tabindex=\"0\"` or `\"-1\"` (roving tabindex)",
          "`aria-activedescendant=\"{activeItemId}\"` - Points to active item when item focused",
          "`data-focused` - Indicates if content container is focused",
          "**Item (Menuitem):**",
          "`role=\"menuitem\"`",
          "`tabindex=\"0\"` when focused, `\"-1\"` otherwise",
          "`data-active` - \"true\" when focused",
          "**SubTrigger (Menuitem with submenu):**",
          "`aria-haspopup=\"menu\"`",
          "`aria-expanded=\"{isOpen}\"`",
          "**Group:**",
          "`role=\"group\"`",
          "`aria-labelledby=\"{labelId}\"`",
          "**Separator:**",
          "`role=\"separator\"`"
        ]
      },
      {
        "title": "Keyboard Navigation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Opening:**",
          "Right-click on areaRef element opens menu at cursor position",
          "Context menu key opens menu",
          "**From Content Container (initially focused):**",
          "`ArrowDown` - Focus first item",
          "`ArrowUp` - Focus last item",
          "`Home` - Focus first item",
          "`End` - Focus last item",
          "`Escape` - Close menu",
          "`Tab` - Close menu",
          "**From Item:**",
          "`ArrowDown` - Move to next item (wraps to first)",
          "`ArrowUp` - Move to previous item (wraps to last)",
          "`Home` - Jump to first item",
          "`End` - Jump to last item",
          "`Enter` - Select item and close menu",
          "`Space` - Select item and close menu",
          "**From SubTrigger:**",
          "`ArrowRight` - Open submenu and focus first item",
          "`Enter` - Open submenu",
          "`Space` - Open submenu",
          "`ArrowDown/Up` - Navigate to next/previous item in parent menu",
          "**From Submenu Item:**",
          "`ArrowLeft` - Close submenu and return focus to SubTrigger",
          "All other navigation same as Item",
          "**Navigation Behavior:**",
          "Navigation is cyclic (wraps around)",
          "Disabled items are skipped",
          "Active item scrolls into view automatically",
          "Roving tabindex pattern (only one focusable element at a time)"
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
        "title": "Opening",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Right-click (contextmenu event) on areaRef element opens menu",
          "Menu positioned at cursor coordinates using virtual reference",
          "Content container receives focus initially (no item focused)",
          "Prevents default browser context menu"
        ]
      },
      {
        "title": "Focus Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Initially: Content container focused, no item active",
          "First navigation: Moves focus to an item",
          "Roving tabindex: Only focused element has tabindex=\"0\"",
          "`aria-activedescendant` tracks active item on content container"
        ]
      },
      {
        "title": "Selection",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Click**: Clicking an item selects it",
          "**Enter/Space**: Selects the focused item",
          "**Callback**: Calls `onValueChange(value)` on selection",
          "**Close**: Menu closes after item selection",
          "**Disabled**: Disabled items cannot be selected"
        ]
      },
      {
        "title": "Submenu Behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Opens on hover (with delay), ArrowRight, Enter, or Space",
          "Closes on ArrowLeft or when parent menu closes",
          "Supports deep nesting (submenus within submenus)",
          "ArrowRight from SubTrigger focuses first item in submenu",
          "ArrowLeft from submenu item returns focus to SubTrigger"
        ]
      },
      {
        "title": "Dismissal",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Escape key closes menu",
          "Tab key closes menu",
          "Click outside closes menu",
          "Item selection closes menu",
          "Clicking on areaRef while open closes menu"
        ]
      },
      {
        "title": "Positioning",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Menu positioned at cursor coordinates",
          "Uses virtual reference element for floating-ui",
          "Optional offset can be applied",
          "Automatically adjusts to viewport boundaries"
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
        "title": "Data Attributes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Items expose these data attributes for styling:",
          "`data-active` - \"true\" when item is focused, \"false\" otherwise",
          "`data-focused` - On content: \"true\" when content focused, \"false\" when item focused"
        ]
      },
      {
        "title": "Context Values",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Components can access menu state via context hooks:",
          "Code line: const root = useRootContext();",
          "Code line: // Access: isOpen, closeMenu, onValueChange, focusIntent, etc.",
          "Code line: const content = useContentContext();",
          "Code line: // Access: itemsRef, registerItem, activeItemRef, etc.",
          "Code line: const sub = useSubContext();",
          "Code line: // Access: isOpen, triggerRef, floatingEl, etc."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests should cover:"
        ]
      },
      {
        "title": "Core Functionality",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Right-click opens menu at cursor position",
          "Menu closes on Escape, Tab, click outside",
          "Item selection fires onValueChange callback",
          "Menu closes after item selection"
        ]
      },
      {
        "title": "Keyboard Navigation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "ArrowDown/ArrowUp navigate through items",
          "Home/End keys jump to first/last",
          "Enter/Space selects focused item",
          "Navigation wraps around (cyclic)",
          "Content container initially focused (no item active)",
          "First ArrowDown/ArrowUp moves from content to item"
        ]
      },
      {
        "title": "Submenu Behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Hover opens submenu",
          "ArrowRight opens submenu and focuses first item",
          "Enter/Space on SubTrigger opens submenu",
          "ArrowLeft closes submenu and returns to trigger",
          "Deep nesting works correctly"
        ]
      },
      {
        "title": "Group Behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Groups render with correct ARIA attributes",
          "Label associates with group via aria-labelledby",
          "Navigation works across groups"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Proper ARIA roles and attributes",
          "aria-activedescendant updates correctly",
          "Roving tabindex pattern implemented",
          "No accessibility violations (axe)",
          "SubTrigger has aria-haspopup and aria-expanded"
        ]
      },
      {
        "title": "Error Handling",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Components throw errors when used outside Root"
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
        "title": "Basic Context Menu",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineContextMenuElements } from \"@ariaui-web/context-menu\";",
          "Code line: function BasicExample() {",
          "Code line: const areaRef = element reference<HTMLDivElement>(null);",
          "Code line: return (",
          "Code line: <>",
          "Code line: <div ref={areaRef} style={{ width: 300, height: 200 }}>",
          "Code line: Right click here",
          "Code line: </div>",
          "Code line: <aria-context-menu areaRef={areaRef} onValueChange={(v) => console.log(v)}>",
          "Code line: <aria-context-menu-content>",
          "Code line: <aria-context-menu-item value=\"copy\">Copy</aria-context-menu-item>",
          "Code line: <aria-context-menu-item value=\"paste\">Paste</aria-context-menu-item>",
          "Code line: <aria-context-menu-item value=\"cut\">Cut</aria-context-menu-item>",
          "Code line: </aria-context-menu-content>",
          "Code line: </aria-context-menu>",
          "Code line: </>"
        ]
      },
      {
        "title": "With Submenus",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-context-menu areaRef={areaRef} onValueChange={handleSelect}>",
          "Code line: <aria-context-menu-content>",
          "Code line: <aria-context-menu-item value=\"new\">New File</aria-context-menu-item>",
          "Code line: <aria-context-menu-sub>",
          "Code line: <aria-context-menu-sub-trigger>Open Recent</aria-context-menu-sub-trigger>",
          "Code line: <aria-context-menu-sub-content>",
          "Code line: <aria-context-menu-item value=\"file1\">Document.txt</aria-context-menu-item>",
          "Code line: <aria-context-menu-item value=\"file2\">Image.png</aria-context-menu-item>",
          "Code line: </aria-context-menu-sub-content>",
          "Code line: </aria-context-menu-sub>",
          "Code line: <aria-context-menu-item value=\"save\">Save</aria-context-menu-item>",
          "Code line: </aria-context-menu-content>",
          "Code line: </aria-context-menu>"
        ]
      },
      {
        "title": "With Groups and Separators",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-context-menu areaRef={areaRef} onValueChange={handleSelect}>",
          "Code line: <aria-context-menu-content>",
          "Code line: <aria-context-menu-group>",
          "Code line: <aria-context-menu-label>File</aria-context-menu-label>",
          "Code line: <aria-context-menu-item value=\"new\">New</aria-context-menu-item>",
          "Code line: <aria-context-menu-item value=\"open\">Open</aria-context-menu-item>",
          "Code line: </aria-context-menu-group>",
          "Code line: <aria-context-menu-separator />",
          "Code line: <aria-context-menu-label>Edit</aria-context-menu-label>",
          "Code line: <aria-context-menu-item value=\"undo\">Undo</aria-context-menu-item>",
          "Code line: <aria-context-menu-item value=\"redo\">Redo</aria-context-menu-item>",
          "Code line: </aria-context-menu-content>",
          "Code line: </aria-context-menu>"
        ]
      },
      {
        "title": "With Position Offset",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-context-menu",
          "Code line: areaRef={areaRef}",
          "Code line: onValueChange={handleSelect}",
          "Code line: offset={{ x: 10, y: 10 }}",
          "Code line: >",
          "Code line: <aria-context-menu-content>",
          "Code line: <aria-context-menu-item value=\"action\">Action</aria-context-menu-item>",
          "Code line: </aria-context-menu-content>",
          "Code line: </aria-context-menu>"
        ]
      },
      {
        "title": "Implementation Status",
        "sourceHeadingLevel": 2,
        "requirements": [
          "yes **Implemented:**",
          "Context menu trigger on right-click",
          "Virtual reference positioning at cursor",
          "Full keyboard navigation with roving tabindex",
          "Submenu support with deep nesting",
          "Groups and separators",
          "Click outside to close",
          "ARIA menu pattern compliance",
          "Focus management (content vs items)",
          "Ref forwarding for all components",
          "yes **Test Coverage:**",
          "Comprehensive test suite covering all features",
          "Accessibility validation with jest-axe",
          "Keyboard navigation tests",
          "Submenu behavior tests",
          "Group and separator tests",
          "Error boundary tests",
          "yes **Accessibility Compliant:**",
          "Proper menu ARIA pattern",
          "Roving tabindex implementation",
          "aria-activedescendant tracking",
          "Keyboard navigation per APG guidelines",
          "Screen reader compatible",
          "No axe violations"
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
          "Documentation examples"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
