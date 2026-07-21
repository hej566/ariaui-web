# Sidebar Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/sidebar`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-sidebar` | none |
| Panel | `aria-sidebar-panel` | `complementary` |
| Trigger | `aria-sidebar-trigger` | `button` |
| Rail | `aria-sidebar-rail` | `button` |
| Inset | `aria-sidebar-inset` | `main` |
| Header | `aria-sidebar-header` | none |
| Content | `aria-sidebar-content` | none |
| Footer | `aria-sidebar-footer` | none |
| Group | `aria-sidebar-group` | none |
| GroupLabel | `aria-sidebar-group-label` | none |
| GroupAction | `aria-sidebar-group-action` | `button` |
| GroupContent | `aria-sidebar-group-content` | none |
| Menu | `aria-sidebar-menu` | `list` |
| MenuItem | `aria-sidebar-menu-item` | `listitem` |
| MenuButton | `aria-sidebar-menu-button` | `button` |
| MenuAction | `aria-sidebar-menu-action` | `button` |
| MenuBadge | `aria-sidebar-menu-badge` | none |
| MenuSub | `aria-sidebar-menu-sub` | `list` |
| MenuSubItem | `aria-sidebar-menu-sub-item` | `listitem` |
| MenuSubButton | `aria-sidebar-menu-sub-button` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/sidebar/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 31 of 31 documented sections are represented after native normalization.
- Requirement lines: 242

### Scope

- `@ariaui-web/sidebar` is a headless, accessible collapsible sidebar primitive that owns expanded/collapsed state, state metadata, trigger wiring, keyboard shortcut handling, and structural parts. It follows the shadcn sidebar structural model as a higher-level reference while keeping the package unstyled and behavior-only.
- This package does not ship visual styling, dimensions, animations, cookies, mobile sheet behavior, tooltips, or class recipes.

### Primary References

- shadcn/ui sidebar: <https://ui.shadcn.com/docs/components/sidebar>
- Radix compound-component pattern: <https://www.radix-ui.com/primitives/docs/guides/composition>

### Server rendering (SSR)

- Custom elements must be registered on the client. Use them from a **client-side custom element registration** in frameworks with server-rendered HTML (e.g., Next.js App Router), or wrap usage in your own client boundary.
- Server-rendered HTML is supported: state derived from `defaultOpen` / controlled `open` matches the first client render for the same attributes/properties, so hydration stays consistent. Browser-only APIs (keyboard shortcut listeners) run inside effects, not during render.

### Mental Model

- `@ariaui-web/sidebar` is a compound-component sidebar system. `Root` owns open/close state and a keyboard shortcut; interactive descendants (`Trigger`, `Rail`) toggle that state; structural descendants (`Panel`, `Inset`, `Header`, etc.) read state via context and reflect it as `data-*` attributes.

### Public API

- The package exports:
- `Root`
- `Panel`
- `Trigger`
- `Rail`
- `Inset`
- `Sidebar.Header` / `Sidebar.Content` / `Sidebar.Footer`
- `Group` / `Sidebar.GroupLabel` / `Sidebar.GroupAction` / `Sidebar.GroupContent`
- `Menu` / `Sidebar.MenuItem` / `Sidebar.MenuButton`
- `Sidebar.MenuAction` / `Sidebar.MenuBadge`
- `Sidebar.MenuSub` / `Sidebar.MenuSubItem` / `Sidebar.MenuSubButton`
- `useSidebar`
- Type exports:
- `SidebarState`, `SidebarSide`, `SidebarCollapsible`
- `SidebarMenuButtonSize`, `SidebarMenuButtonVariant`
- `SidebarMenuSubButtonSize`
- Per-component `Props` types (`RootProps`, `PanelProps`, `TriggerProps`, etc.)

### Root Contract

- `Root` controls the sidebar state and provides context to all child parts through `SidebarContext`.
- Code line: interface RootProps
- Code line: extends Omit<native element attributes/properties for "div", "defaultValue"> {
- Code line: open?: boolean;
- Code line: defaultOpen?: boolean; // default: true
- Code line: onOpenChange?: (open: boolean) => void;
- Code line: side?: "left" | "right"; // default: "left"
- Code line: collapsible?: "icon" | "none"; // default: "icon"
- Code line: keyboardShortcut?: string | null; // default: "b"; null disables
- Code line: panelId?: string; // default: generated ID
- **Behavior:**
- `defaultOpen` initializes uncontrolled state.
- `open` and `onOpenChange` control state externally.
- `collapsible="icon"` allows collapse; `collapsible="none"` forces the sidebar to remain expanded. When `collapsible="none"`, `setOpen` is a no-op and `toggleSidebar` does nothing.
- Keyboard shortcut fires on `Ctrl+<key>` / `Cmd+<key>` (case-insensitive). Shortcut is disabled when `keyboardShortcut={null}`.
- `panelId` provides a stable ID shared by `Panel` and `Trigger`'s `aria-controls`; when omitted, a generated ID is used.
- Root renders a `<div>` with `data-state`, `data-side`, `data-collapsible`, and `data-sidebar="root"`.
- **Context values provided:**
- Table row: Property | Type | Description
- Table row: `open` | `boolean` | Resolved open state (forced `true` when `collapsible="none"`)
- Table row: `state` | `"expanded" \ | "collapsed"` | State string for data attributes
- Table row: `side` | `"left" \ | "right"` | Side attributes/properties
- Table row: `collapsible` | `"icon" \ | "none"` | Collapsible mode
- Table row: `panelId` | `string` | Generated or consumer-provided panel ID for ARIA linkage
- Table row: `setOpen` | `(open: boolean) => void` | Programmatic open/close (no-op when `collapsible="none"`)
- Table row: `toggleSidebar` | `() => void` | Toggle between expanded and collapsed

### Part Contracts

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Panel

- The sidebar container. Renders as `<aside>`. Supports `native composition`.
- **Props:**
- Code line: interface PanelProps
- Code line: extends native element attributes/properties for "aside",
- Code line: SlottableProps {}
- **Behavior:**
- Reads `panelId`, `state`, `side`, and `collapsible` from context.
- Sets `id` to `attributes/properties.id ?? panelId` for ARIA linkage with `Trigger`.
- When `native composition` is true, slots all attributes/properties onto the immediate child element via `@ariaui-web/slot`.
- **Data attributes:** `data-sidebar="sidebar"`, `data-slot="sidebar"`, `data-state`, `data-side`, `data-collapsible`
- **DOM:** `<aside>` by default.

### Trigger

- Toggle button. Supports `native composition`. Wired to `aria-controls` and `aria-expanded`.
- **Props:**
- Code line: interface TriggerProps
- Code line: extends native element attributes/properties for "button",
- Code line: SlottableProps {}
- **Behavior:**
- Click toggles sidebar state unless `event.defaultPrevented` or `disabled`.
- Reflects `aria-controls={panelId}` and `aria-expanded={open}`.
- Default `aria-label` is `"Toggle Sidebar"`.
- When `native composition`, attributes/properties are slotted onto the child element; `onClick` is composed (child handler runs first, internal toggle after unless prevented).
- **Data attributes:** `data-sidebar="trigger"`, `data-slot="sidebar-trigger"`, `data-state`
- **DOM:** `<button type="button">` by default.

### Rail

- Secondary toggle button, typically shown as a narrow icon strip in collapsed state.
- **Props:**
- Code line: interface RailProps extends native element attributes/properties for "button" {}
- **Behavior:**
- Click toggles sidebar state unless `event.defaultPrevented` or `disabled`.
- Default `tabIndex={-1}` (out of tab order; programmatically focusable).
- Default `aria-label` and `title` are `"Toggle Sidebar"`.
- **Data attributes:** `data-sidebar="rail"`, `data-slot="sidebar-rail"`, `data-state`
- **DOM:** `<button type="button">`.

### Inset

- Wrapper for main content that gets pushed when the sidebar expands. Renders as `<main>`.
- **Props:**
- Code line: type InsetProps = native element attributes/properties for "main";
- **Data attributes:** `data-sidebar="inset"`, `data-slot="sidebar-inset"`
- **DOM:** `<main>`.

### Sidebar.Header / Content / Footer

- Layout sections inside the panel. All render as `<div>` with `forwardRef`.
- Code line: type HeaderProps = native element attributes/properties for "div";
- Code line: type ContentProps = native element attributes/properties for "div";
- Code line: type FooterProps = native element attributes/properties for "div";
- **Data attributes:** `data-sidebar="header"` / `"content"` / `"footer"`, corresponding `data-slot` values.
- **DOM:** `<div>`.

### Group / GroupContent

- Container primitives for grouping menu sections. Render as `<div>` with `forwardRef`.
- Code line: type GroupProps = native element attributes/properties for "div";
- Code line: type GroupContentProps = native element attributes/properties for "div";
- **Data attributes:** `data-sidebar="group"` / `"group-content"`, corresponding `data-slot`.
- **DOM:** `<div>`.

### Sidebar.GroupLabel

- Label for a menu section group. Renders as `<div>`. Supports `native composition`.
- **Props:**
- Code line: interface GroupLabelProps
- Code line: extends native element attributes/properties for "div",
- Code line: SlottableProps {}
- **Data attributes:** `data-sidebar="group-label"`, `data-slot="sidebar-group-label"`
- **DOM:** `<div>` by default.

### Sidebar.GroupAction

- Action button inside a group header (e.g., add/new button). Supports `native composition`.
- **Props:**
- Code line: interface GroupActionProps
- Code line: extends native element attributes/properties for "button",
- Code line: SlottableProps {}
- **Data attributes:** `data-sidebar="group-action"`, `data-slot="sidebar-group-action"`
- **DOM:** `<button type="button">` by default.

### Menu / MenuItem

- List container and item for the navigation menu. Render as `<ul>` and `<li>`.
- Code line: type MenuProps = native element attributes/properties for "ul";
- Code line: type MenuItemProps = native element attributes/properties for "li";
- **Data attributes:** `data-sidebar="menu"` / `"menu-item"`, corresponding `data-slot`.
- **DOM:** `<ul>` / `<li>`.

### Sidebar.MenuButton

- The primary interactive menu item. Renders as `<button>`. Supports `native composition`. Reads `state` from sidebar context.
- **Props:**
- Code line: interface MenuButtonProps
- Code line: extends native element attributes/properties for "button",
- Code line: SlottableProps {
- Code line: isActive?: boolean; // default: false
- Code line: size?: "default" | "sm" | "lg"; // default: "default"
- Code line: variant?: "default" | "outline"; // default: "default"
- **Behavior:**
- When `native composition` and `disabled`, sets `aria-disabled="true"` on the slotted element.
- Reflects `data-active` (`"true"` or `"false"`), `data-disabled` (`""` when disabled), `data-size`, `data-variant`, and `data-state`.
- **Data attributes:** `data-active`, `data-disabled`, `data-size`, `data-variant`, `data-state`, `data-sidebar="menu-button"`, `data-slot="sidebar-menu-button"`
- **DOM:** `<button type="button">` by default.

### Sidebar.MenuAction

- Contextual action button inside a menu item (e.g., "More" dropdown trigger). Supports `native composition`.
- **Props:**
- Code line: interface MenuActionProps
- Code line: extends native element attributes/properties for "button",
- Code line: SlottableProps {
- Code line: showOnHover?: boolean; // default: false
- **Behavior:**
- When `showOnHover` is `true`, sets `data-show-on-hover="true"`. When `false`, the attribute is omitted entirely (not `"false"`).
- **Data attributes:** `data-sidebar="menu-action"`, `data-slot="sidebar-menu-action"`, `data-show-on-hover` (conditional)
- **DOM:** `<button type="button">` by default.

### Sidebar.MenuBadge

- Count or indicator badge inside a menu item. Renders as `<div>`.
- Code line: type MenuBadgeProps = native element attributes/properties for "div";
- **Data attributes:** `data-sidebar="menu-badge"`, `data-slot="sidebar-menu-badge"`
- **DOM:** `<div>`.

### Sidebar.MenuSub / MenuSubItem

- Nested sub-menu list container and item. Render as `<ul>` and `<li>`.
- Code line: type MenuSubProps = native element attributes/properties for "ul";
- Code line: type MenuSubItemProps = native element attributes/properties for "li";
- **Data attributes:** `data-sidebar="menu-sub"` / `"menu-sub-item"`, corresponding `data-slot`.
- **DOM:** `<ul>` / `<li>`.

### Sidebar.MenuSubButton

- Interactive sub-menu item button. Renders as `<button>`. Supports `native composition`. Reads `state` from sidebar context.
- **Props:**
- Code line: interface MenuSubButtonProps
- Code line: extends native element attributes/properties for "button",
- Code line: SlottableProps {
- Code line: isActive?: boolean; // default: false
- Code line: size?: "sm" | "md"; // default: "md"
- **Behavior:**
- Reflects `data-active` (`"true"` or `"false"`), `data-size`, and `data-state`.
- **Data attributes:** `data-active`, `data-size`, `data-state`, `data-sidebar="menu-sub-button"`, `data-slot="sidebar-menu-sub-button"`
- **DOM:** `<button type="button">` by default.

### useSidebar()

- Hook to access sidebar context from custom child components.
- Code line: function useSidebar(): SidebarContextValue;
- **Returns** the `SidebarContextValue` object (see Root Contract above).
- **Throws** if called outside a `Root`.

### Data and ARIA Reflection

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### ARIA attributes

- Table row: Component | Attribute | Value
- Table row: `Trigger` | `aria-controls` | `panelId`
- Table row: `Trigger` | `aria-expanded` | `"true"` / `"false"`
- Table row: `Trigger` | `aria-label` | `"Toggle Sidebar"` (default; overridable)
- Table row: `Rail` | `aria-label` | `"Toggle Sidebar"` (default; overridable)
- Table row: `MenuButton` (native composition, disabled) | `aria-disabled` | `"true"`

### Data attributes

- Every component sets `data-sidebar` to a unique string identifying the component role. Most interactive components also set `data-slot` for CSS targeting and `data-state` (from the sidebar context) for collapse-aware styling.
- Table row: Component | `data-sidebar` | `data-slot` | `data-state` | Other
- Table row: `Root` | `"root"` | - | yes | `data-side`, `data-collapsible`
- Table row: `Panel` | `"sidebar"` | `"sidebar"` | yes | `data-side`, `data-collapsible`
- Table row: `Trigger` | `"trigger"` | `"sidebar-trigger"` | yes
- Table row: `Rail` | `"rail"` | `"sidebar-rail"` | yes
- Table row: `Inset` | `"inset"` | `"sidebar-inset"` | -
- Table row: `Header` | `"header"` | `"sidebar-header"` | -
- Table row: `Content` | `"content"` | `"sidebar-content"` | -
- Table row: `Footer` | `"footer"` | `"sidebar-footer"` | -
- Table row: `Group` | `"group"` | `"sidebar-group"` | -
- Table row: `GroupLabel` | `"group-label"` | `"sidebar-group-label"` | -
- Table row: `GroupAction` | `"group-action"` | `"sidebar-group-action"` | -
- Table row: `GroupContent` | `"group-content"` | `"sidebar-group-content"` | -
- Table row: `Menu` | `"menu"` | `"sidebar-menu"` | -
- Table row: `MenuItem` | `"menu-item"` | `"sidebar-menu-item"` | -
- Table row: `MenuButton` | `"menu-button"` | `"sidebar-menu-button"` | yes | `data-active`, `data-disabled`, `data-size`, `data-variant`
- Table row: `MenuAction` | `"menu-action"` | `"sidebar-menu-action"` | - | `data-show-on-hover` (conditional)
- Table row: `MenuBadge` | `"menu-badge"` | `"sidebar-menu-badge"` | -
- Table row: `MenuSub` | `"menu-sub"` | `"sidebar-menu-sub"` | -
- Table row: `MenuSubItem` | `"menu-sub-item"` | `"sidebar-menu-sub-item"` | -
- Table row: `MenuSubButton` | `"menu-sub-button"` | `"sidebar-menu-sub-button"` | yes | `data-active`, `data-size`

### Keyboard Contract

- **Shortcut toggle:** `Ctrl+<key>` / `Cmd+<key>` toggles the sidebar. The shortcut key is case-insensitive. Shortcut runs `event.preventDefault()` before toggling.
- **No shortcut:** Pass `keyboardShortcut={null}` to `Root` to disable the global keyboard listener. The event listener is cleaned up on unmount.
- **Within the sidebar:** All interactive elements (`Trigger`, `Rail`, `MenuButton`, `MenuSubButton`, `GroupAction`, `MenuAction`) are native `<button>` elements and inherit standard button keyboard behavior (Enter/Space activation).

### Pointer Contract

- `Trigger` and `Rail` toggle state on click unless `event.defaultPrevented` or `disabled`.
- `MenuButton`, `MenuSubButton`, `GroupAction`, and `MenuAction` are standard buttons; they do not inject their own toggle/activation logic beyond the native button behavior and `native composition` slot composition.
- Consumer `onClick` handlers run before internal toggle logic on `Trigger` and `Rail`. Internal toggle is gated by `event.defaultPrevented` and `disabled`.

### Styling Contract

- This package is intentionally unstyled.
- Consumers own width, collapse sizing, transition, animation, and all visual treatment. Styling is driven entirely through the `data-*` attributes described above.
- **Example (Tailwind CSS):**
- Code line: <aria-sidebar className="group/sidebar">
- Code line: <aria-sidebar-panel className="w-64 transition-all duration-300 group-data-[state=collapsed]/sidebar:w-12" />
- Code line: </aria-sidebar>
- **Example (CSS):**
- Code line: [data-sidebar="sidebar"] {
- Code line: width: 16rem;
- Code line: [data-sidebar="sidebar"][data-state="collapsed"] {
- Code line: width: 3rem;
- Code line: [data-sidebar="menu-button"][data-active="true"] {
- Code line: background: var(--color-accent);

### Accessibility Model

- **Semantic HTML:** `Panel` renders `<aside>`, `Inset` renders `<main>`, interactive elements render `<button>`, menus render `<ul>` / `<li>`.
- **ARIA linkage:** `Trigger` is wired to `Panel` via `aria-controls` and `aria-expanded`. `Panel` gets its `id` from `Root`'s `panelId`.
- **Labels:** `Trigger` and `Rail` have default `aria-label="Toggle Sidebar"`. Both are overridable.
- **Disabled states:** `Trigger`, `Rail`, and `MenuButton` support native `disabled`. `MenuButton` additionally sets `aria-disabled` on slotted children when `native composition` and `disabled`.

### Coverage Expectations

- Tests should cover:
- Default expanded rendering with correct `data-*` attributes and ARIA linkage.
- Stable `panelId` linkage between `Panel` and `Trigger`.
- Accessible composed layout coverage via `axe`.
- `defaultOpen={false}` collapsed rendering.
- `side="left"` and `side="right"` attribute reflection.
- `collapsible="none"` forces expanded state and no-ops toggle.
- Uncontrolled toggle from `Trigger` and `Rail`.
- Controlled state with `open` / `onOpenChange`.
- `defaultPrevented` on click prevents toggle (Trigger and Rail).
- `disabled` prevents toggle (Trigger and Rail).
- Keyboard shortcut toggle with `Ctrl` / `Meta` key and case-insensitive matching.
- `keyboardShortcut={null}` disables the shortcut.
- Event listener cleanup on unmount.
- `native composition` slot composition on `Panel`, `Trigger`, `GroupLabel`, `GroupAction`, `MenuButton`, `MenuAction`, and `MenuSubButton`.
- `MenuButton` `data-active`, `data-disabled`, `aria-disabled` (native composition + disabled), `data-size`, `data-variant`.
- `MenuAction` `data-show-on-hover` conditional attribute.
- `MenuSubButton` `data-active`, `data-size`, `data-state`.
- Semantic element tag verification for all rendered elements.
- All 19 `data-slot` attribute values.
- `useSidebar` throws when called outside `Root`.

### Change Control

- Behavior or API changes must update, in order:
- This spec file.
- Unit tests in `packages/sidebar/__test__`.
- Documentation examples and API tables in `web/doc`.






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
