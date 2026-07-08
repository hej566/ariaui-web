export const componentSpec = {
  "kind": "component",
  "name": "Dialog",
  "slug": "dialog",
  "packageName": "@ariaui-web/dialog",
  "description": "This document defines the current implementation contract for `@ariaui-web/dialog`.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-dialog",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Action",
      "tagName": "aria-dialog-action",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "dialog",
        "data-dialog-action": ""
      }
    },
    {
      "name": "Cancel",
      "tagName": "aria-dialog-cancel",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "dialog",
        "data-dialog-cancel": ""
      }
    },
    {
      "name": "Close",
      "tagName": "aria-dialog-close",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "dialog"
      }
    },
    {
      "name": "Content",
      "tagName": "aria-dialog-content",
      "defaultRole": null,
      "defaultAttributes": {
        "data-dialog-content": ""
      }
    },
    {
      "name": "Description",
      "tagName": "aria-dialog-description",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Overlay",
      "tagName": "aria-dialog-overlay",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Portal",
      "tagName": "aria-dialog-portal",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Title",
      "tagName": "aria-dialog-title",
      "defaultRole": "heading",
      "defaultAttributes": {
        "aria-level": "2"
      }
    },
    {
      "name": "Trigger",
      "tagName": "aria-dialog-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false",
        "aria-haspopup": "dialog"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-describedby",
    "aria-expanded",
    "aria-haspopup",
    "aria-labelledby",
    "aria-level",
    "aria-modal",
    "data-dialog-action",
    "data-dialog-cancel",
    "data-dialog-content",
    "data-state",
    "default-open",
    "id",
    "open",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/dialog/readme.md",
    "coverage": {
      "sourceSections": 46,
      "coveredSections": 46,
      "requirements": 319
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current implementation contract for `@ariaui-web/dialog`.",
          "`@ariaui-web/dialog` is a headless, accessible modal dialog primitive that provides a dialog interface with focus trapping, keyboard dismissal, and proper ARIA semantics following the WAI-ARIA Dialog (Modal) pattern."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
          "Radix Dialog: https://www.radix-ui.com/primitives/docs/components/dialog",
          "Implementation: [packages/dialog/src](./src)"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "A modal dialog is an overlay window that appears on top of the main content, requiring user interaction before returning to the main application. Focus is trapped within the dialog, and the underlying content is inert.",
          "Key characteristics:",
          "**Headless architecture**: Behavior and accessibility without imposed styling",
          "**Focus management**: Automatic focus trapping and restoration",
          "**Keyboard dismissal**: Escape key closes the dialog",
          "**Composable**: Flexible part structure for trigger, content, overlay, and close buttons",
          "**Controlled/Uncontrolled**: Supports both controlled and uncontrolled open state"
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
          "`Trigger` - Button that opens the dialog",
          "`Portal` - Portal container for rendering overlay and content in `document.body`",
          "`Content` - Dialog content container with focus trap and optional custom host composition",
          "`Close` - Button that closes the dialog"
        ]
      },
      {
        "title": "Structural Parts",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Overlay` - Background overlay (typically dimmed) with optional custom host composition",
          "`Title` - Accessible title for the dialog",
          "`Description` - Accessible description for the dialog"
        ]
      },
      {
        "title": "Hooks",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`useDialogContext` - Access dialog context from any child component"
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
          "`Root` manages the dialog open/closed state:",
          "Code line: interface RootProps {",
          "Code line: open?: boolean; // Controlled open state",
          "Code line: defaultOpen?: boolean; // Initial open state for uncontrolled mode",
          "Code line: onOpenChange?: (open: boolean) => void; // State change callback",
          "Code line: onClose?: () => void; // Close callback (fires after dialog closes)",
          "Code line: children: Node | string;",
          "**Behavior:**",
          "Controlled mode: `open` attributes/properties controls the state",
          "Uncontrolled mode: `defaultOpen` sets initial state",
          "`onOpenChange` fires when open state changes",
          "`onClose` fires specifically when dialog closes (not on open)",
          "State is shared via context to all child components"
        ]
      },
      {
        "title": "ID Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Root generates and provides unique IDs for accessibility:",
          "`titleId` - Used by Title component",
          "`descriptionId` - Used by Description component",
          "`contentId` - Used by Content component",
          "These IDs wire up ARIA labeling relationships."
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
          "Own dialog open/closed state (controlled/uncontrolled)",
          "Provide context to all child components",
          "Generate unique IDs for accessibility",
          "Coordinate state changes across all parts",
          "**Props:**",
          "Code line: interface RootProps {",
          "Code line: open?: boolean;",
          "Code line: defaultOpen?: boolean;",
          "Code line: onOpenChange?: (open: boolean) => void;",
          "Code line: onClose?: () => void;",
          "Code line: children: Node | string;",
          "**Context Provided:**",
          "`open` - Current open state",
          "`onOpenChange` - Update open state",
          "`onClose` - Close callback function",
          "`titleId` - ID for dialog title",
          "`descriptionId` - ID for dialog description",
          "`contentId` - ID for dialog content"
        ]
      },
      {
        "title": "Trigger",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Toggle dialog open state on click",
          "Reflect dialog state with ARIA attributes",
          "Control relationship to dialog content",
          "**Props:**",
          "Code line: interface TriggerProps extends ComponentPropsWithoutRef<\"button\"> {",
          "Code line: children: Node | string;",
          "**ARIA Attributes:**",
          "`aria-haspopup=\"dialog\"`",
          "`aria-expanded` - \"true\" when open, \"false\" when closed",
          "`aria-controls` - Points to content ID",
          "`data-state` - \"open\" or \"closed\" for styling",
          "**Behavior:**",
          "Click toggles dialog open state",
          "Respects default prevented click events"
        ]
      },
      {
        "title": "Portal",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render composed overlay and content through `@ariaui-web/portal`",
          "Portal children to `document.body` in the browser",
          "Render children inline during SSR when `document` is unavailable",
          "**Props:**",
          "Code line: interface PortalProps {",
          "Code line: children?: Node | string;"
        ]
      },
      {
        "title": "Content",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render dialog content with proper ARIA semantics",
          "Trap focus within dialog using FocusScope",
          "Handle keyboard dismissal (Escape key)",
          "Restore focus on close",
          "Only render when dialog is open",
          "**Props:**",
          "Code line: interface ContentProps extends ComponentPropsWithoutRef<\"div\"> {",
          "Code line: children: Node | string;",
          "Code line: native composition?: boolean;",
          "**ARIA Attributes:**",
          "`role=\"dialog\"`",
          "`aria-modal=\"true\"`",
          "`aria-labelledby` - Points to title ID",
          "`aria-describedby` - Points to description ID",
          "`id` - Content ID from context",
          "**Behavior:**",
          "Returns `null` when dialog is closed",
          "Traps focus using FocusScope with loop enabled",
          "Escape key closes dialog",
          "Focus restored to trigger on close",
          "Portaled to document body when composed inside `Portal`",
          "Slots dialog, focus, and ARIA attributes/properties onto a single child element when `native composition` is set for Framer Motion or other custom hosts"
        ]
      },
      {
        "title": "Close",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Close the dialog when clicked",
          "Invoke onClose callback",
          "**Props:**",
          "Code line: interface CloseProps extends ComponentPropsWithoutRef<\"button\"> {",
          "Code line: children: Node | string;",
          "**Behavior:**",
          "Click closes dialog",
          "Calls root's onClose function",
          "Typically rendered inside Content"
        ]
      },
      {
        "title": "Overlay",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Render background overlay",
          "Close dialog on click (optional behavior)",
          "**Props:**",
          "Code line: interface OverlayProps extends ComponentPropsWithoutRef<\"div\"> {",
          "Code line: children?: Node | string;",
          "Code line: native composition?: boolean;",
          "**Behavior:**",
          "Typically styled with semi-transparent background",
          "Click can trigger dialog close",
          "Portaled to document body when composed inside `Portal`",
          "Slots overlay attributes/properties onto a single child element when `native composition` is set for Framer Motion or other custom hosts"
        ]
      },
      {
        "title": "Title",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Provide accessible title for dialog",
          "Register title ID with dialog content",
          "**Props:**",
          "Code line: interface TitleProps extends ComponentPropsWithoutRef<\"h2\"> {",
          "Code line: children: Node | string;",
          "**ARIA Attributes:**",
          "`id` - Title ID from context",
          "Referenced by Content's `aria-labelledby`"
        ]
      },
      {
        "title": "Description",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Responsibilities:**",
          "Provide accessible description for dialog",
          "Register description ID with dialog content",
          "**Props:**",
          "Code line: interface DescriptionProps extends ComponentPropsWithoutRef<\"p\"> {",
          "Code line: children: Node | string;",
          "**ARIA Attributes:**",
          "`id` - Description ID from context",
          "Referenced by Content's `aria-describedby`"
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
          "**Trigger:**",
          "`aria-haspopup=\"dialog\"`",
          "`aria-expanded=\"{open}\"`",
          "`aria-controls=\"{contentId}\"`",
          "`data-state=\"open\" | \"closed\"`",
          "**Content:**",
          "`role=\"dialog\"`",
          "`aria-modal=\"true\"`",
          "`aria-labelledby=\"{titleId}\"`",
          "`aria-describedby=\"{descriptionId}\"`",
          "`id=\"{contentId}\"`",
          "`data-dialog-content` - Present on the actual content host, including when `native composition` is used",
          "**Title:**",
          "`id=\"{titleId}\"` - Referenced by Content",
          "**Description:**",
          "`id=\"{descriptionId}\"` - Referenced by Content",
          "`Title` native custom element defaults to `aria-level=\"2\"` while preserving `role=\"heading\"`.",
          "`Content` native custom element exposes `data-dialog-content`.",
          "`Action` native custom element exposes `data-dialog-action`.",
          "`Cancel` native custom element exposes `data-dialog-cancel`."
        ]
      },
      {
        "title": "Focus Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Focus Trap:**",
          "Focus trapped within Content using FocusScope",
          "Tab cycles through focusable elements within dialog",
          "Shift+Tab cycles backward",
          "Focus loops back to first element after last",
          "**Focus Restoration:**",
          "Focus automatically restored to trigger on close",
          "Uses FocusScope's restoreFocus feature"
        ]
      },
      {
        "title": "Keyboard Navigation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "**Opening:**",
          "Click trigger button opens dialog",
          "Enter/Space on trigger opens dialog",
          "**Within Dialog:**",
          "`Tab` - Move to next focusable element (loops to first)",
          "`Shift+Tab` - Move to previous focusable element (loops to last)",
          "`Escape` - Close dialog",
          "**After Closing:**",
          "Focus restored to trigger element"
        ]
      },
      {
        "title": "Portal and Layering",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`Portal` is a dialog-scoped alias for `@ariaui-web/portal`'s `Root` component",
          "in the browser, portal children render into `document.body`",
          "during SSR, portal children render inline so default-open dialog content exists in server HTML",
          "overlay should be composed before content so the backdrop layers behind the dialog panel"
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
          "Trigger click toggles open state",
          "Dialog content only renders when open",
          "Focus moves to first focusable element in dialog",
          "Underlying content becomes inert (via aria-modal)"
        ]
      },
      {
        "title": "Focus Trapping",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Focus trapped within dialog content",
          "Tab navigation loops within dialog",
          "Cannot focus elements outside dialog while open",
          "FocusScope handles all focus management"
        ]
      },
      {
        "title": "Dismissal",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Escape key closes dialog",
          "Close button click closes dialog",
          "Overlay click closes dialog (if implemented)",
          "All dismissal paths call onClose callback"
        ]
      },
      {
        "title": "Focus Restoration",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Focus automatically returns to trigger on close",
          "Works regardless of dismissal method",
          "Handled by FocusScope's restoreFocus"
        ]
      },
      {
        "title": "State Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Controlled mode: Parent manages open state via `open` attributes/properties",
          "Uncontrolled mode: Dialog manages own state via `defaultOpen`",
          "`onOpenChange` fires on any state change",
          "`onClose` fires only when closing (not opening)"
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
          "Trigger exposes data attribute for styling:",
          "`data-state` - \"open\" when dialog is open, \"closed\" when closed"
        ]
      },
      {
        "title": "Context Values",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Components can access dialog state via `useDialogContext()`:",
          "Code line: const dialog = useDialogContext();",
          "Code line: // Access: open, onOpenChange, onClose, titleId, descriptionId, contentId"
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
          "Controlled and uncontrolled open state",
          "Trigger toggles dialog open/closed",
          "Close button closes dialog",
          "Content only renders when open",
          "onClose callback fires on dismissal"
        ]
      },
      {
        "title": "Focus Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Focus trap works (Tab loops within dialog)",
          "Focus restoration to trigger on close",
          "First focusable element receives focus on open"
        ]
      },
      {
        "title": "Keyboard Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Escape key closes dialog",
          "Tab/Shift+Tab navigate within dialog"
        ]
      },
      {
        "title": "Accessibility",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Proper ARIA roles and attributes",
          "Title and description IDs wire correctly",
          "aria-modal=\"true\" on content",
          "No accessibility violations (axe)"
        ]
      },
      {
        "title": "Dismissal Paths",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Close button dismissal",
          "Escape key dismissal",
          "Overlay click dismissal (if implemented)",
          "Content and Overlay `native composition` slot attributes/properties onto custom hosts for animation composition",
          "Portal rendering in the client and inline SSR output through `Portal`"
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
        "title": "Basic Dialog",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: import { defineDialogElements } from \"@ariaui-web/dialog\";",
          "Code line: function BasicExample() {",
          "Code line: return (",
          "Code line: <aria-dialog>",
          "Code line: <aria-dialog-trigger>Open Dialog</aria-dialog-trigger>",
          "Code line: <aria-dialog-portal>",
          "Code line: <aria-dialog-content>",
          "Code line: <aria-dialog-title>Dialog Title</aria-dialog-title>",
          "Code line: <aria-dialog-description>",
          "Code line: This is a description of the dialog content.",
          "Code line: </aria-dialog-description>",
          "Code line: <p>Dialog content goes here.</p>",
          "Code line: <aria-dialog-close>Close</aria-dialog-close>",
          "Code line: </aria-dialog-content>",
          "Code line: </aria-dialog-portal>",
          "Code line: </aria-dialog>"
        ]
      },
      {
        "title": "With Overlay",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-dialog>",
          "Code line: <aria-dialog-trigger>Open</aria-dialog-trigger>",
          "Code line: <aria-dialog-portal>",
          "Code line: <aria-dialog-overlay />",
          "Code line: <aria-dialog-content>",
          "Code line: <aria-dialog-title>Confirm Action</aria-dialog-title>",
          "Code line: <aria-dialog-description>Are you sure you want to proceed?</aria-dialog-description>",
          "Code line: <button>Confirm</button>",
          "Code line: <aria-dialog-close>Cancel</aria-dialog-close>",
          "Code line: </aria-dialog-content>",
          "Code line: </aria-dialog-portal>",
          "Code line: </aria-dialog>"
        ]
      },
      {
        "title": "Controlled Dialog",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: function ControlledExample() {",
          "Code line: const [open, setOpen] = custom element state(false);",
          "Code line: return (",
          "Code line: <aria-dialog open={open} onOpenChange={setOpen}>",
          "Code line: <aria-dialog-trigger>Open Dialog</aria-dialog-trigger>",
          "Code line: <aria-dialog-portal>",
          "Code line: <aria-dialog-content>",
          "Code line: <aria-dialog-title>Controlled Dialog</aria-dialog-title>",
          "Code line: <aria-dialog-description>",
          "Code line: This dialog's state is controlled by the parent component.",
          "Code line: </aria-dialog-description>",
          "Code line: <aria-dialog-close>Close</aria-dialog-close>",
          "Code line: </aria-dialog-content>",
          "Code line: </aria-dialog-portal>",
          "Code line: </aria-dialog>"
        ]
      },
      {
        "title": "With onClose Callback",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Code line: <aria-dialog onClose={() => console.log(\"Dialog closed\")}>",
          "Code line: <aria-dialog-trigger>Open</aria-dialog-trigger>",
          "Code line: <aria-dialog-portal>",
          "Code line: <aria-dialog-content>",
          "Code line: <aria-dialog-title>Dialog with Callback</aria-dialog-title>",
          "Code line: <aria-dialog-description>",
          "Code line: The onClose callback fires when the dialog is dismissed.",
          "Code line: </aria-dialog-description>",
          "Code line: <aria-dialog-close>Close</aria-dialog-close>",
          "Code line: </aria-dialog-content>",
          "Code line: </aria-dialog-portal>",
          "Code line: </aria-dialog>"
        ]
      },
      {
        "title": "Implementation Status",
        "sourceHeadingLevel": 2,
        "requirements": [
          "yes **Implemented:**",
          "Controlled and uncontrolled open state",
          "Focus trapping with FocusScope",
          "Focus restoration on close",
          "Keyboard dismissal (Escape key)",
          "ARIA dialog pattern compliance",
          "Title and description labeling",
          "Trigger state reflection",
          "`Portal` rendering for overlay and content",
          "Framer Motion/custom host composition through Content and Overlay `native composition`",
          "Ref forwarding for all components",
          "yes **Test Coverage:**",
          "Comprehensive test suite covering all features",
          "Accessibility validation with jest-axe",
          "Focus trap and restoration tests",
          "Keyboard interaction tests",
          "Controlled/uncontrolled state tests",
          "yes **Accessibility Compliant:**",
          "Proper dialog ARIA pattern",
          "Focus trap implementation",
          "Focus restoration",
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
