# Dialog Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/dialog`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-dialog` | none |
| Action | `aria-dialog-action` | `button` |
| Cancel | `aria-dialog-cancel` | `button` |
| Close | `aria-dialog-close` | `button` |
| Content | `aria-dialog-content` | none |
| Description | `aria-dialog-description` | none |
| Overlay | `aria-dialog-overlay` | `presentation` |
| Portal | `aria-dialog-portal` | none |
| Title | `aria-dialog-title` | `heading` |
| Trigger | `aria-dialog-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/dialog/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 46 of 46 documented sections are represented after native normalization.
- Requirement lines: 319

### Scope

- This document defines the current implementation contract for `@ariaui-web/dialog`.
- `@ariaui-web/dialog` is a headless, accessible modal dialog primitive that provides a dialog interface with focus trapping, keyboard dismissal, and proper ARIA semantics following the WAI-ARIA Dialog (Modal) pattern.

### Primary References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Radix Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
- Implementation: [packages/dialog/src](./src)

### Mental Model

- A modal dialog is an overlay window that appears on top of the main content, requiring user interaction before returning to the main application. Focus is trapped within the dialog, and the underlying content is inert.
- Key characteristics:
- **Headless architecture**: Behavior and accessibility without imposed styling
- **Focus management**: Automatic focus trapping and restoration
- **Keyboard dismissal**: Escape key closes the dialog
- **Composable**: Flexible part structure for trigger, content, overlay, and close buttons
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled open state

### Part Model

- The package exports these composable parts:

### Core Parts

- `Root` - Container that owns state and context
- `Trigger` - Button that opens the dialog
- `Portal` - Portal container for rendering overlay and content in `document.body`
- `Content` - Dialog content container with focus trap and optional custom host composition
- `Close` - Button that closes the dialog

### Structural Parts

- `Overlay` - Background overlay (typically dimmed) with optional custom host composition
- `Title` - Accessible title for the dialog
- `Description` - Accessible description for the dialog

### Hooks

- `useDialogContext` - Access dialog context from any child component

### State Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Open State

- `Root` manages the dialog open/closed state:
- Code line: interface RootProps {
- Code line: open?: boolean; // Controlled open state
- Code line: defaultOpen?: boolean; // Initial open state for uncontrolled mode
- Code line: onOpenChange?: (open: boolean) => void; // State change callback
- Code line: onClose?: () => void; // Close callback (fires after dialog closes)
- Code line: children: Node | string;
- **Behavior:**
- Controlled mode: `open` attributes/properties controls the state
- Uncontrolled mode: `defaultOpen` sets initial state
- `onOpenChange` fires when open state changes
- `onClose` fires specifically when dialog closes (not on open)
- State is shared via context to all child components

### ID Management

- Root generates and provides unique IDs for accessibility:
- `titleId` - Used by Title component
- `descriptionId` - Used by Description component
- `contentId` - Used by Content component
- These IDs wire up ARIA labeling relationships.

### Part Contracts

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Root

- **Responsibilities:**
- Own dialog open/closed state (controlled/uncontrolled)
- Provide context to all child components
- Generate unique IDs for accessibility
- Coordinate state changes across all parts
- **Props:**
- Code line: interface RootProps {
- Code line: open?: boolean;
- Code line: defaultOpen?: boolean;
- Code line: onOpenChange?: (open: boolean) => void;
- Code line: onClose?: () => void;
- Code line: children: Node | string;
- **Context Provided:**
- `open` - Current open state
- `onOpenChange` - Update open state
- `onClose` - Close callback function
- `titleId` - ID for dialog title
- `descriptionId` - ID for dialog description
- `contentId` - ID for dialog content

### Trigger

- **Responsibilities:**
- Toggle dialog open state on click
- Reflect dialog state with ARIA attributes
- Control relationship to dialog content
- **Props:**
- Code line: interface TriggerProps extends ComponentPropsWithoutRef<"button"> {
- Code line: children: Node | string;
- **ARIA Attributes:**
- `aria-haspopup="dialog"`
- `aria-expanded` - "true" when open, "false" when closed
- `aria-controls` - Points to content ID
- `data-state` - "open" or "closed" for styling
- **Behavior:**
- Click toggles dialog open state
- Respects default prevented click events

### Portal

- **Responsibilities:**
- Render composed overlay and content through `@ariaui-web/portal`
- Portal children to `document.body` in the browser
- Render children inline during SSR when `document` is unavailable
- **Props:**
- Code line: interface PortalProps {
- Code line: children?: Node | string;

### Content

- **Responsibilities:**
- Render dialog content with proper ARIA semantics
- Trap focus within dialog using FocusScope
- Handle keyboard dismissal (Escape key)
- Restore focus on close
- Only render when dialog is open
- **Props:**
- Code line: interface ContentProps extends ComponentPropsWithoutRef<"div"> {
- Code line: children: Node | string;
- Code line: native composition?: boolean;
- **ARIA Attributes:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` - Points to title ID
- `aria-describedby` - Points to description ID
- `id` - Content ID from context
- **Behavior:**
- Returns `null` when dialog is closed
- Traps focus using FocusScope with loop enabled
- Escape key closes dialog
- Focus restored to trigger on close
- Portaled to document body when composed inside `Portal`
- Slots dialog, focus, and ARIA attributes/properties onto a single child element when `native composition` is set for Framer Motion or other custom hosts

### Close

- **Responsibilities:**
- Close the dialog when clicked
- Invoke onClose callback
- **Props:**
- Code line: interface CloseProps extends ComponentPropsWithoutRef<"button"> {
- Code line: children: Node | string;
- **Behavior:**
- Click closes dialog
- Calls root's onClose function
- Typically rendered inside Content

### Overlay

- **Responsibilities:**
- Render background overlay
- Close dialog on click (optional behavior)
- **Props:**
- Code line: interface OverlayProps extends ComponentPropsWithoutRef<"div"> {
- Code line: children?: Node | string;
- Code line: native composition?: boolean;
- **Behavior:**
- Typically styled with semi-transparent background
- Click can trigger dialog close
- Portaled to document body when composed inside `Portal`
- Slots overlay attributes/properties onto a single child element when `native composition` is set for Framer Motion or other custom hosts

### Title

- **Responsibilities:**
- Provide accessible title for dialog
- Register title ID with dialog content
- **Props:**
- Code line: interface TitleProps extends ComponentPropsWithoutRef<"h2"> {
- Code line: children: Node | string;
- **ARIA Attributes:**
- `id` - Title ID from context
- Referenced by Content's `aria-labelledby`

### Description

- **Responsibilities:**
- Provide accessible description for dialog
- Register description ID with dialog content
- **Props:**
- Code line: interface DescriptionProps extends ComponentPropsWithoutRef<"p"> {
- Code line: children: Node | string;
- **ARIA Attributes:**
- `id` - Description ID from context
- Referenced by Content's `aria-describedby`

### Accessibility Model

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### ARIA Roles and Attributes

- **Trigger:**
- `aria-haspopup="dialog"`
- `aria-expanded="{open}"`
- `aria-controls="{contentId}"`
- `data-state="open" | "closed"`
- **Content:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="{titleId}"`
- `aria-describedby="{descriptionId}"`
- `id="{contentId}"`
- `data-dialog-content` - Present on the actual content host, including when `native composition` is used
- **Title:**
- `id="{titleId}"` - Referenced by Content
- **Description:**
- `id="{descriptionId}"` - Referenced by Content
- `Title` native custom element defaults to `aria-level="2"` while preserving `role="heading"`.
- `Content` native custom element exposes `data-dialog-content`.
- `Action` native custom element exposes `data-dialog-action`.
- `Cancel` native custom element exposes `data-dialog-cancel`.

### Focus Management

- **Focus Trap:**
- Focus trapped within Content using FocusScope
- Tab cycles through focusable elements within dialog
- Shift+Tab cycles backward
- Focus loops back to first element after last
- **Focus Restoration:**
- Focus automatically restored to trigger on close
- Uses FocusScope's restoreFocus feature

### Keyboard Navigation

- **Opening:**
- Click trigger button opens dialog
- Enter/Space on trigger opens dialog
- **Within Dialog:**
- `Tab` - Move to next focusable element (loops to first)
- `Shift+Tab` - Move to previous focusable element (loops to last)
- `Escape` - Close dialog
- **After Closing:**
- Focus restored to trigger element

### Portal and Layering

- `Portal` is a dialog-scoped alias for `@ariaui-web/portal`'s `Root` component
- in the browser, portal children render into `document.body`
- during SSR, portal children render inline so default-open dialog content exists in server HTML
- overlay should be composed before content so the backdrop layers behind the dialog panel

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Opening

- Trigger click toggles open state
- Dialog content only renders when open
- Focus moves to first focusable element in dialog
- Underlying content becomes inert (via aria-modal)

### Focus Trapping

- Focus trapped within dialog content
- Tab navigation loops within dialog
- Cannot focus elements outside dialog while open
- FocusScope handles all focus management

### Dismissal

- Escape key closes dialog
- Close button click closes dialog
- Overlay click closes dialog (if implemented)
- All dismissal paths call onClose callback

### Focus Restoration

- Focus automatically returns to trigger on close
- Works regardless of dismissal method
- Handled by FocusScope's restoreFocus

### State Management

- Controlled mode: Parent manages open state via `open` attributes/properties
- Uncontrolled mode: Dialog manages own state via `defaultOpen`
- `onOpenChange` fires on any state change
- `onClose` fires only when closing (not opening)

### Data and ARIA Reflection

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Data Attributes

- Trigger exposes data attribute for styling:
- `data-state` - "open" when dialog is open, "closed" when closed

### Context Values

- Components can access dialog state via `useDialogContext()`:
- Code line: const dialog = useDialogContext();
- Code line: // Access: open, onOpenChange, onClose, titleId, descriptionId, contentId

### Coverage Expectations

- Tests should cover:

### Core Functionality

- Controlled and uncontrolled open state
- Trigger toggles dialog open/closed
- Close button closes dialog
- Content only renders when open
- onClose callback fires on dismissal

### Focus Management

- Focus trap works (Tab loops within dialog)
- Focus restoration to trigger on close
- First focusable element receives focus on open

### Keyboard Interaction

- Escape key closes dialog
- Tab/Shift+Tab navigate within dialog

### Accessibility

- Proper ARIA roles and attributes
- Title and description IDs wire correctly
- aria-modal="true" on content
- No accessibility violations (axe)

### Dismissal Paths

- Close button dismissal
- Escape key dismissal
- Overlay click dismissal (if implemented)
- Content and Overlay `native composition` slot attributes/properties onto custom hosts for animation composition
- Portal rendering in the client and inline SSR output through `Portal`

### Usage Examples

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Basic Dialog

- Code line: import { defineDialogElements } from "@ariaui-web/dialog";
- Code line: function BasicExample() {
- Code line: return (
- Code line: <aria-dialog>
- Code line: <aria-dialog-trigger>Open Dialog</aria-dialog-trigger>
- Code line: <aria-dialog-portal>
- Code line: <aria-dialog-content>
- Code line: <aria-dialog-title>Dialog Title</aria-dialog-title>
- Code line: <aria-dialog-description>
- Code line: This is a description of the dialog content.
- Code line: </aria-dialog-description>
- Code line: <p>Dialog content goes here.</p>
- Code line: <aria-dialog-close>Close</aria-dialog-close>
- Code line: </aria-dialog-content>
- Code line: </aria-dialog-portal>
- Code line: </aria-dialog>

### With Overlay

- Code line: <aria-dialog>
- Code line: <aria-dialog-trigger>Open</aria-dialog-trigger>
- Code line: <aria-dialog-portal>
- Code line: <aria-dialog-overlay />
- Code line: <aria-dialog-content>
- Code line: <aria-dialog-title>Confirm Action</aria-dialog-title>
- Code line: <aria-dialog-description>Are you sure you want to proceed?</aria-dialog-description>
- Code line: <button>Confirm</button>
- Code line: <aria-dialog-close>Cancel</aria-dialog-close>
- Code line: </aria-dialog-content>
- Code line: </aria-dialog-portal>
- Code line: </aria-dialog>

### Controlled Dialog

- Code line: function ControlledExample() {
- Code line: const [open, setOpen] = custom element state(false);
- Code line: return (
- Code line: <aria-dialog open={open} onOpenChange={setOpen}>
- Code line: <aria-dialog-trigger>Open Dialog</aria-dialog-trigger>
- Code line: <aria-dialog-portal>
- Code line: <aria-dialog-content>
- Code line: <aria-dialog-title>Controlled Dialog</aria-dialog-title>
- Code line: <aria-dialog-description>
- Code line: This dialog's state is controlled by the parent component.
- Code line: </aria-dialog-description>
- Code line: <aria-dialog-close>Close</aria-dialog-close>
- Code line: </aria-dialog-content>
- Code line: </aria-dialog-portal>
- Code line: </aria-dialog>

### With onClose Callback

- Code line: <aria-dialog onClose={() => console.log("Dialog closed")}>
- Code line: <aria-dialog-trigger>Open</aria-dialog-trigger>
- Code line: <aria-dialog-portal>
- Code line: <aria-dialog-content>
- Code line: <aria-dialog-title>Dialog with Callback</aria-dialog-title>
- Code line: <aria-dialog-description>
- Code line: The onClose callback fires when the dialog is dismissed.
- Code line: </aria-dialog-description>
- Code line: <aria-dialog-close>Close</aria-dialog-close>
- Code line: </aria-dialog-content>
- Code line: </aria-dialog-portal>
- Code line: </aria-dialog>

### Implementation Status

- yes **Implemented:**
- Controlled and uncontrolled open state
- Focus trapping with FocusScope
- Focus restoration on close
- Keyboard dismissal (Escape key)
- ARIA dialog pattern compliance
- Title and description labeling
- Trigger state reflection
- `Portal` rendering for overlay and content
- Framer Motion/custom host composition through Content and Overlay `native composition`
- Ref forwarding for all components
- yes **Test Coverage:**
- Comprehensive test suite covering all features
- Accessibility validation with jest-axe
- Focus trap and restoration tests
- Keyboard interaction tests
- Controlled/uncontrolled state tests
- yes **Accessibility Compliant:**
- Proper dialog ARIA pattern
- Focus trap implementation
- Focus restoration
- Keyboard navigation per APG guidelines
- Screen reader compatible
- No axe violations

### Change Control

- Behavior or API changes must update, in order:
- This spec file
- Unit tests for this package
- Implementation
- Documentation examples



## Dialog Source Test Parity

- Learned from: `../ariaui/packages/dialog/__test__/dialog.test.tsx`
- Source test cases: 29
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, `openchange` events, focus movement, hidden state, and native custom element hosts instead of framework rendering helpers.
- Native dialog tests must cover:
- closed-by-default content that is outside the dialog accessibility tree
- trigger-open and trigger-close behavior
- prevented trigger clicks
- uncontrolled `default-open`, controlled-style `open` and `openchange` behavior
- content `role="dialog"`, `aria-modal`, title linkage, and description linkage
- close, cancel, action, overlay, and Escape dismissal
- focus movement to Cancel or the first tabbable element and Trigger focus restoration
- force-mounted portal, overlay, and content hidden/ARIA state
- native composition equivalents for root, trigger, portal, overlay, content, title, description, action, cancel, and close hosts



## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and `componentSpec`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
- dialog source test parity remains documented and covered by package-level native tests
- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep `readme.md` aligned with `componentSpec`
