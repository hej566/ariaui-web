# ContextMenu Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/context-menu`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-context-menu` | none |
| Content | `aria-context-menu-content` | `menu` |
| Group | `aria-context-menu-group` | `group` |
| Item | `aria-context-menu-item` | `menuitem` |
| Label | `aria-context-menu-label` | `label` |
| Separator | `aria-context-menu-separator` | `separator` |
| Submenu | `aria-context-menu-submenu` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/context-menu/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 49 of 49 documented sections are represented after native normalization.
- Requirement lines: 384

### Scope

- This document defines the current implementation contract for `@ariaui-web/context-menu`.
- `@ariaui-web/context-menu` is a headless, accessible context menu primitive that provides a menu interface triggered by right-click or context menu events. It supports keyboard navigation, submenus, groups, and follows WAI-ARIA menu patterns.

### Primary References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
- WAI-ARIA Menubar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- Radix Context Menu: https://www.radix-ui.com/primitives/docs/components/context-menu
- Implementation: [packages/context-menu/src](./src)

### Mental Model

- A context menu is a floating menu that appears at the cursor position when a user right-clicks (or uses context menu key) on a designated area. Users navigate with keyboard or mouse and select items to execute commands.
- Key characteristics:
- **Headless architecture**: Behavior and accessibility without imposed styling
- **Context-triggered**: Opens on right-click or context menu key
- **Keyboard-first**: Full keyboard navigation with roving tabindex
- **Composable**: Flexible part structure for menus, submenus, and groups
- **Floating UI**: Positioned at cursor location using virtual reference

### Part Model

- The package exports these composable parts:

### Core Parts

- `Root` - Container that owns state and context
- `Content` - Floating menu container for items
- `Item` - Selectable menu item

### Submenu Parts

- `ContextMenu.Sub` - Submenu state container
- `ContextMenu.SubTrigger` - Trigger that opens a submenu
- `ContextMenu.SubContent` - Floating submenu container

### Structural Parts

- `Group` - Groups related items
- `Label` - Label for a group
- `Separator` - Visual separator between groups

### Hooks

- `useRootContext` - Access root context from any child component
- `useContentContext` - Access content context for item registration
- `useSubContext` - Access submenu context

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Open State

- `Root` manages the menu open/closed state:
- Code line: interface RootProps {
- Code line: areaRef: native Web Component.RefObject<HTMLElement>; // Element to attach context menu to
- Code line: onValueChange?: (value: string) => void; // Selection callback
- Code line: offset?: { x: number; y: number }; // Position offset from cursor
- **Behavior:**
- Menu opens on right-click (contextmenu event) within areaRef element
- Menu closes on item selection, Escape, Tab, or click outside
- Position calculated from cursor coordinates using virtual reference
- `onValueChange` fires when an item is selected

### Focus Intent State

- Internal state for managing keyboard focus:
- `'first'` - Focus first item
- `'last'` - Focus last item
- `null` - No focus intent (content container focused)
- Used to coordinate focus between Content and Items.

### Submenu State

- Each `ContextMenu.Sub` manages its own open state:
- Opens on hover, ArrowRight, Enter, or Space
- Closes on ArrowLeft or when parent closes
- Supports deep nesting

### Part Contracts

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- **Responsibilities:**
- Own menu open/closed state
- Provide context to all child components
- Attach context menu listener to areaRef element
- Calculate menu position from cursor coordinates
- Handle click outside to close menu
- Coordinate focus intent
- **Props:**
- Code line: interface RootProps extends ComponentPropsWithoutRef<"div"> {
- Code line: areaRef: native Web Component.RefObject<HTMLElement>;
- Code line: onValueChange?: (value: string) => void;
- Code line: offset?: { x: number; y: number };
- Code line: open?: boolean;
- Code line: defaultOpen?: boolean;
- Code line: onOpenChange?: (open: boolean) => void;
- Code line: children: Node | string;
- **Context Provided:**
- `isOpen` - Current open state
- `setIsOpen` - Update open state
- `closeMenu` - Close menu function
- `onValueChange` - Selection callback
- `focusIntent` - Focus coordination state
- `setFocusIntent` - Update focus intent
- `nodeId` - Unique ID for the menu instance
- `virtualRef` - Cursor position reference
- `registerFloatingEl` - Register floating element for positioning

### Content

- **Responsibilities:**
- Render floating menu container with menu role
- Register and track menu items
- Manage active item state with roving tabindex
- Coordinate keyboard navigation
- Handle focus management (content vs items)
- Portal to body for proper stacking
- **Props:**
- Code line: interface ContentProps extends ComponentPropsWithoutRef<"ul"> {
- Code line: children: Node | string;
- Code line: native composition?: boolean;
- `native composition` - native composition host menu attributes/properties onto a custom element, such as a Framer Motion component
- **ARIA Attributes:**
- `role="menu"`
- `tabindex="0"` when content focused, `"-1"` when item focused
- `aria-activedescendant` - ID of active item (when item focused)
- `data-focused` - "true" when content focused, "false" when item focused
- **Behavior:**
- Initially focuses the content container (not an item)
- ArrowDown from content focuses first item
- ArrowUp from content focuses last item
- Tracks all registered items via refs
- Provides keyboard navigation handlers

### Item

- **Responsibilities:**
- Render selectable menu item
- Register with Content when mounted
- Handle selection on click, Enter, or Space
- Manage focus state with roving tabindex
- Scroll into view when focused
- **Props:**
- Code line: interface ItemProps extends ComponentPropsWithoutRef<"button"> {
- Code line: value: string; // Item value (passed to onValueChange)
- Code line: disabled?: boolean; // Disable selection
- **ARIA Attributes:**
- `role="menuitem"`
- `tabindex="0"` when focused, `"-1"` otherwise
- `data-active` - "true" when focused, "false" otherwise
- **Selection:**
- Click selects the item
- Enter or Space selects when focused
- Calls `root.onValueChange(value)`
- Closes menu after selection
- Disabled items cannot be selected

### ContextMenu.Sub

- **Responsibilities:**
- Own submenu open/closed state
- Provide submenu context to SubTrigger and SubContent
- Coordinate trigger and content refs
- **Props:**
- Code line: interface SubProps {
- Code line: children: Node | string;
- Code line: offset?: { x: number; y: number };
- Code line: open?: boolean;
- Code line: defaultOpen?: boolean;
- Code line: onOpenChange?: (open: boolean) => void;
- **Context Provided:**
- `isOpen` - Submenu open state
- `setIsOpen` - Update submenu state
- `focusIntent` - Focus coordination for submenu
- `triggerRef` - Ref to SubTrigger element
- `floatingEl` - Submenu floating element
- `nodeId` - Unique submenu ID

### ContextMenu.SubTrigger

- **Responsibilities:**
- Render menu item that opens a submenu
- Open submenu on hover, ArrowRight, Enter, or Space
- Register as a menu item for navigation
- Manage ARIA expanded state
- **Props:**
- Code line: interface SubTriggerProps extends ComponentPropsWithoutRef<"button"> {
- Code line: children: Node | string;
- **ARIA Attributes:**
- `role="menuitem"`
- `aria-haspopup="menu"`
- `aria-expanded` - "true" when submenu open, "false" otherwise
- `tabindex="0"` when focused, `"-1"` otherwise
- **Behavior:**
- Hover opens submenu after delay
- ArrowRight opens submenu and focuses first item
- Enter/Space opens submenu
- Participates in parent menu navigation

### ContextMenu.SubContent

- **Responsibilities:**
- Render floating submenu container
- Same behavior as Content but for submenus
- Position relative to SubTrigger
- Close on ArrowLeft (returns focus to trigger)
- **Props:**
- Code line: interface SubContentProps extends ComponentPropsWithoutRef<"ul"> {
- Code line: children: Node | string;
- Code line: native composition?: boolean;
- `native composition` - native composition host submenu attributes/properties onto a custom element, such as a Framer Motion component
- **ARIA Attributes:**
- Same as Content
- `role="menu"`
- `aria-activedescendant` when item focused

### Group

- **Responsibilities:**
- Group related menu items together
- Associate with Label via aria-labelledby
- **Props:**
- Code line: interface GroupProps extends ComponentPropsWithoutRef<"div"> {
- Code line: children: Node | string;
- **ARIA Attributes:**
- `role="group"`
- `aria-labelledby` - Points to Label ID if present

### Label

- **Responsibilities:**
- Provide accessible label for a Group
- Register label ID with parent Group
- **Props:**
- Code line: interface LabelProps extends ComponentPropsWithoutRef<"div"> {
- Code line: children: Node | string;
- **ARIA Attributes:**
- `id` - Unique label ID
- Used by Group's `aria-labelledby`

### Separator

- **Responsibilities:**
- Visual separator between groups or sections
- **Props:**
- Code line: interface SeparatorProps extends ComponentPropsWithoutRef<"div"> {
- Code line: children?: Node | string;
- **ARIA Attributes:**
- `role="separator"`

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### ARIA Roles and Attributes

- **Content (Menu):**
- `role="menu"`
- `tabindex="0"` or `"-1"` (roving tabindex)
- `aria-activedescendant="{activeItemId}"` - Points to active item when item focused
- `data-focused` - Indicates if content container is focused
- **Item (Menuitem):**
- `role="menuitem"`
- `tabindex="0"` when focused, `"-1"` otherwise
- `data-active` - "true" when focused
- **SubTrigger (Menuitem with submenu):**
- `aria-haspopup="menu"`
- `aria-expanded="{isOpen}"`
- **Group:**
- `role="group"`
- `aria-labelledby="{labelId}"`
- **Separator:**
- `role="separator"`

### Keyboard Navigation

- **Opening:**
- Right-click on areaRef element opens menu at cursor position
- Context menu key opens menu
- **From Content Container (initially focused):**
- `ArrowDown` - Focus first item
- `ArrowUp` - Focus last item
- `Home` - Focus first item
- `End` - Focus last item
- `Escape` - Close menu
- `Tab` - Close menu
- **From Item:**
- `ArrowDown` - Move to next item (wraps to first)
- `ArrowUp` - Move to previous item (wraps to last)
- `Home` - Jump to first item
- `End` - Jump to last item
- `Enter` - Select item and close menu
- `Space` - Select item and close menu
- **From SubTrigger:**
- `ArrowRight` - Open submenu and focus first item
- `Enter` - Open submenu
- `Space` - Open submenu
- `ArrowDown/Up` - Navigate to next/previous item in parent menu
- **From Submenu Item:**
- `ArrowLeft` - Close submenu and return focus to SubTrigger
- All other navigation same as Item
- **Navigation Behavior:**
- Navigation is cyclic (wraps around)
- Disabled items are skipped
- Active item scrolls into view automatically
- Roving tabindex pattern (only one focusable element at a time)

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Opening

- Right-click (contextmenu event) on areaRef element opens menu
- Menu positioned at cursor coordinates using virtual reference
- Content container receives focus initially (no item focused)
- Prevents default browser context menu

### Focus Management

- Initially: Content container focused, no item active
- First navigation: Moves focus to an item
- Roving tabindex: Only focused element has tabindex="0"
- `aria-activedescendant` tracks active item on content container

### Selection

- **Click**: Clicking an item selects it
- **Enter/Space**: Selects the focused item
- **Callback**: Calls `onValueChange(value)` on selection
- **Close**: Menu closes after item selection
- **Disabled**: Disabled items cannot be selected

### Submenu Behavior

- Opens on hover (with delay), ArrowRight, Enter, or Space
- Closes on ArrowLeft or when parent menu closes
- Supports deep nesting (submenus within submenus)
- ArrowRight from SubTrigger focuses first item in submenu
- ArrowLeft from submenu item returns focus to SubTrigger

### Dismissal

- Escape key closes menu
- Tab key closes menu
- Click outside closes menu
- Item selection closes menu
- Clicking on areaRef while open closes menu

### Positioning

- Menu positioned at cursor coordinates
- Uses virtual reference element for floating-ui
- Optional offset can be applied
- Automatically adjusts to viewport boundaries

### Data and ARIA Reflection

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Data Attributes

- Items expose these data attributes for styling:
- `data-active` - "true" when item is focused, "false" otherwise
- `data-focused` - On content: "true" when content focused, "false" when item focused

### Context Values

- Components can access menu state via context hooks:
- Code line: const root = useRootContext();
- Code line: // Access: isOpen, closeMenu, onValueChange, focusIntent, etc.
- Code line: const content = useContentContext();
- Code line: // Access: itemsRef, registerItem, activeItemRef, etc.
- Code line: const sub = useSubContext();
- Code line: // Access: isOpen, triggerRef, floatingEl, etc.

### Coverage Expectations

- Tests should cover:

### Core Functionality

- Right-click opens menu at cursor position
- Menu closes on Escape, Tab, click outside
- Item selection fires onValueChange callback
- Menu closes after item selection

### Keyboard Navigation

- ArrowDown/ArrowUp navigate through items
- Home/End keys jump to first/last
- Enter/Space selects focused item
- Navigation wraps around (cyclic)
- Content container initially focused (no item active)
- First ArrowDown/ArrowUp moves from content to item

### Submenu Behavior

- Hover opens submenu
- ArrowRight opens submenu and focuses first item
- Enter/Space on SubTrigger opens submenu
- ArrowLeft closes submenu and returns to trigger
- Deep nesting works correctly

### Group Behavior

- Groups render with correct ARIA attributes
- Label associates with group via aria-labelledby
- Navigation works across groups

### Accessibility

- Proper ARIA roles and attributes
- aria-activedescendant updates correctly
- Roving tabindex pattern implemented
- No accessibility violations (axe)
- SubTrigger has aria-haspopup and aria-expanded

### Error Handling

- Components throw errors when used outside Root

### Usage Examples

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Basic Context Menu

- Code line: import { defineContextMenuElements } from "@ariaui-web/context-menu";
- Code line: function BasicExample() {
- Code line: const areaRef = element reference<HTMLDivElement>(null);
- Code line: return (
- Code line: <>
- Code line: <div ref={areaRef} style={{ width: 300, height: 200 }}>
- Code line: Right click here
- Code line: </div>
- Code line: <aria-context-menu areaRef={areaRef} onValueChange={(v) => console.log(v)}>
- Code line: <aria-context-menu-content>
- Code line: <aria-context-menu-item value="copy">Copy</aria-context-menu-item>
- Code line: <aria-context-menu-item value="paste">Paste</aria-context-menu-item>
- Code line: <aria-context-menu-item value="cut">Cut</aria-context-menu-item>
- Code line: </aria-context-menu-content>
- Code line: </aria-context-menu>
- Code line: </>

### With Submenus

- Code line: <aria-context-menu areaRef={areaRef} onValueChange={handleSelect}>
- Code line: <aria-context-menu-content>
- Code line: <aria-context-menu-item value="new">New File</aria-context-menu-item>
- Code line: <ContextMenu.Sub>
- Code line: <ContextMenu.SubTrigger>Open Recent</ContextMenu.SubTrigger>
- Code line: <ContextMenu.SubContent>
- Code line: <aria-context-menu-item value="file1">Document.txt</aria-context-menu-item>
- Code line: <aria-context-menu-item value="file2">Image.png</aria-context-menu-item>
- Code line: </ContextMenu.SubContent>
- Code line: </ContextMenu.Sub>
- Code line: <aria-context-menu-item value="save">Save</aria-context-menu-item>
- Code line: </aria-context-menu-content>
- Code line: </aria-context-menu>

### With Groups and Separators

- Code line: <aria-context-menu areaRef={areaRef} onValueChange={handleSelect}>
- Code line: <aria-context-menu-content>
- Code line: <aria-context-menu-group>
- Code line: <aria-context-menu-label>File</aria-context-menu-label>
- Code line: <aria-context-menu-item value="new">New</aria-context-menu-item>
- Code line: <aria-context-menu-item value="open">Open</aria-context-menu-item>
- Code line: </aria-context-menu-group>
- Code line: <aria-context-menu-separator />
- Code line: <aria-context-menu-label>Edit</aria-context-menu-label>
- Code line: <aria-context-menu-item value="undo">Undo</aria-context-menu-item>
- Code line: <aria-context-menu-item value="redo">Redo</aria-context-menu-item>
- Code line: </aria-context-menu-content>
- Code line: </aria-context-menu>

### With Position Offset

- Code line: <aria-context-menu
- Code line: areaRef={areaRef}
- Code line: onValueChange={handleSelect}
- Code line: offset={{ x: 10, y: 10 }}
- Code line: >
- Code line: <aria-context-menu-content>
- Code line: <aria-context-menu-item value="action">Action</aria-context-menu-item>
- Code line: </aria-context-menu-content>
- Code line: </aria-context-menu>

### Implementation Status

- yes **Implemented:**
- Context menu trigger on right-click
- Virtual reference positioning at cursor
- Full keyboard navigation with roving tabindex
- Submenu support with deep nesting
- Groups and separators
- Click outside to close
- ARIA menu pattern compliance
- Focus management (content vs items)
- Ref forwarding for all components
- yes **Test Coverage:**
- Comprehensive test suite covering all features
- Accessibility validation with jest-axe
- Keyboard navigation tests
- Submenu behavior tests
- Group and separator tests
- Error boundary tests
- yes **Accessibility Compliant:**
- Proper menu ARIA pattern
- Roving tabindex implementation
- aria-activedescendant tracking
- Keyboard navigation per APG guidelines
- Screen reader compatible
- No axe violations

### Change Control

- Behavior or API changes must update, in order:
- This spec file
- Unit tests for this package
- Implementation
- Documentation examples






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
