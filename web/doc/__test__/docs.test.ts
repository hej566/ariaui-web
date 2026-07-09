import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineAccordionElements } from "@ariaui-web/accordion";
import { defineAlertElements } from "@ariaui-web/alert";
import { defineAspectRatioElements } from "@ariaui-web/aspect-ratio";
import { defineAvatarElements } from "@ariaui-web/avatar";
import { defineBadgeElements } from "@ariaui-web/badge";
import { defineDialogElements } from "@ariaui-web/dialog";
import { defineAlertDialogElements } from "@ariaui-web/alert-dialog";
import { computeDropdownMenuExamplePosition, syncDropdownMenuExampleScrollLock } from "../docs/.vitepress/theme/dropdown-menu-examples";
import { describe, expect, it } from "vitest";

const packageSlugs = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "combobox",
  "command",
  "context-menu",
  "datepicker",
  "dialog",
  "disclosure",
  "drawer",
  "dropdown-menu",
  "grid",
  "hover-card",
  "input",
  "input-otp",
  "kbd",
  "keyboard",
  "label",
  "listbox",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "portal",
  "position",
  "progress",
  "radio",
  "scroll-area",
  "select",
  "separator",
  "sidebar",
  "skeleton",
  "slider",
  "slot",
  "spinbutton",
  "spinner",
  "splitter",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "tokens",
  "tooltip",
  "treegrid",
  "treeview",
  "tsconfig",
  "upload",
  "utils"
] as const;
const hiddenPackageSlugs = [
  "arrow",
  "focus-scope",
  "hooks"
] as const;
const nativePackageExpectations = [
  {
    "slug": "accordion",
    "packageName": "@ariaui-web/accordion",
    "defineFunctionName": "defineAccordionElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-accordion"
      },
      {
        "name": "Button",
        "tagName": "aria-accordion-button"
      },
      {
        "name": "Content",
        "tagName": "aria-accordion-content"
      },
      {
        "name": "Header",
        "tagName": "aria-accordion-header"
      },
      {
        "name": "Item",
        "tagName": "aria-accordion-item"
      },
      {
        "name": "Panel",
        "tagName": "aria-accordion-panel"
      },
      {
        "name": "Trigger",
        "tagName": "aria-accordion-trigger"
      }
    ]
  },
  {
    "slug": "alert",
    "packageName": "@ariaui-web/alert",
    "defineFunctionName": "defineAlertElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-alert"
      },
      {
        "name": "Action",
        "tagName": "aria-alert-action"
      },
      {
        "name": "Cancel",
        "tagName": "aria-alert-cancel"
      },
      {
        "name": "Close",
        "tagName": "aria-alert-close"
      },
      {
        "name": "Description",
        "tagName": "aria-alert-description"
      },
      {
        "name": "Title",
        "tagName": "aria-alert-title"
      }
    ]
  },
  {
    "slug": "alert-dialog",
    "packageName": "@ariaui-web/alert-dialog",
    "defineFunctionName": "defineAlertDialogElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-alert-dialog"
      },
      {
        "name": "Action",
        "tagName": "aria-alert-dialog-action"
      },
      {
        "name": "Cancel",
        "tagName": "aria-alert-dialog-cancel"
      },
      {
        "name": "Content",
        "tagName": "aria-alert-dialog-content"
      },
      {
        "name": "Description",
        "tagName": "aria-alert-dialog-description"
      },
      {
        "name": "Icon",
        "tagName": "aria-alert-dialog-icon"
      },
      {
        "name": "Overlay",
        "tagName": "aria-alert-dialog-overlay"
      },
      {
        "name": "Portal",
        "tagName": "aria-alert-dialog-portal"
      },
      {
        "name": "Title",
        "tagName": "aria-alert-dialog-title"
      },
      {
        "name": "Trigger",
        "tagName": "aria-alert-dialog-trigger"
      }
    ]
  },
  {
    "slug": "arrow",
    "packageName": "@ariaui-web/arrow",
    "defineFunctionName": "defineArrowElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-arrow"
      }
    ]
  },
  {
    "slug": "aspect-ratio",
    "packageName": "@ariaui-web/aspect-ratio",
    "defineFunctionName": "defineAspectRatioElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-aspect-ratio"
      }
    ]
  },
  {
    "slug": "avatar",
    "packageName": "@ariaui-web/avatar",
    "defineFunctionName": "defineAvatarElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-avatar"
      },
      {
        "name": "Fallback",
        "tagName": "aria-avatar-fallback"
      },
      {
        "name": "Group",
        "tagName": "aria-avatar-group"
      },
      {
        "name": "Image",
        "tagName": "aria-avatar-image"
      }
    ]
  },
  {
    "slug": "badge",
    "packageName": "@ariaui-web/badge",
    "defineFunctionName": "defineBadgeElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-badge"
      }
    ]
  },
  {
    "slug": "breadcrumb",
    "packageName": "@ariaui-web/breadcrumb",
    "defineFunctionName": "defineBreadcrumbElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-breadcrumb"
      },
      {
        "name": "List",
        "tagName": "aria-breadcrumb-list"
      },
      {
        "name": "Item",
        "tagName": "aria-breadcrumb-item"
      },
      {
        "name": "Link",
        "tagName": "aria-breadcrumb-link"
      },
      {
        "name": "Page",
        "tagName": "aria-breadcrumb-page"
      },
      {
        "name": "Separator",
        "tagName": "aria-breadcrumb-separator"
      },
      {
        "name": "Ellipsis",
        "tagName": "aria-breadcrumb-ellipsis"
      }
    ]
  },
  {
    "slug": "button",
    "packageName": "@ariaui-web/button",
    "defineFunctionName": "defineButtonElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-button"
      },
      {
        "name": "Group",
        "tagName": "aria-button-group"
      },
      {
        "name": "Item",
        "tagName": "aria-button-item"
      }
    ]
  },
  {
    "slug": "calendar",
    "packageName": "@ariaui-web/calendar",
    "defineFunctionName": "defineCalendarElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-calendar"
      },
      {
        "name": "Body",
        "tagName": "aria-calendar-body"
      },
      {
        "name": "Cell",
        "tagName": "aria-calendar-cell"
      },
      {
        "name": "Header",
        "tagName": "aria-calendar-header"
      },
      {
        "name": "Row",
        "tagName": "aria-calendar-row"
      },
      {
        "name": "Select",
        "tagName": "aria-calendar-select"
      }
    ]
  },
  {
    "slug": "card",
    "packageName": "@ariaui-web/card",
    "defineFunctionName": "defineCardElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-card"
      },
      {
        "name": "Content",
        "tagName": "aria-card-content"
      },
      {
        "name": "Description",
        "tagName": "aria-card-description"
      },
      {
        "name": "Footer",
        "tagName": "aria-card-footer"
      },
      {
        "name": "Header",
        "tagName": "aria-card-header"
      },
      {
        "name": "Title",
        "tagName": "aria-card-title"
      }
    ]
  },
  {
    "slug": "carousel",
    "packageName": "@ariaui-web/carousel",
    "defineFunctionName": "defineCarouselElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-carousel"
      },
      {
        "name": "Container",
        "tagName": "aria-carousel-container"
      },
      {
        "name": "NextButton",
        "tagName": "aria-carousel-next-button"
      },
      {
        "name": "PreviousButton",
        "tagName": "aria-carousel-previous-button"
      },
      {
        "name": "Slide",
        "tagName": "aria-carousel-slide"
      },
      {
        "name": "Viewport",
        "tagName": "aria-carousel-viewport"
      }
    ]
  },
  {
    "slug": "checkbox",
    "packageName": "@ariaui-web/checkbox",
    "defineFunctionName": "defineCheckboxElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-checkbox"
      },
      {
        "name": "Group",
        "tagName": "aria-checkbox-group"
      },
      {
        "name": "Indicator",
        "tagName": "aria-checkbox-indicator"
      },
      {
        "name": "Item",
        "tagName": "aria-checkbox-item"
      }
    ]
  },
  {
    "slug": "combobox",
    "packageName": "@ariaui-web/combobox",
    "defineFunctionName": "defineComboboxElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-combobox"
      },
      {
        "name": "Button",
        "tagName": "aria-combobox-button"
      },
      {
        "name": "Content",
        "tagName": "aria-combobox-content"
      },
      {
        "name": "Group",
        "tagName": "aria-combobox-group"
      },
      {
        "name": "Input",
        "tagName": "aria-combobox-input"
      },
      {
        "name": "Label",
        "tagName": "aria-combobox-label"
      },
      {
        "name": "Option",
        "tagName": "aria-combobox-option"
      },
      {
        "name": "Tag",
        "tagName": "aria-combobox-tag"
      },
      {
        "name": "TagGroup",
        "tagName": "aria-combobox-tag-group"
      },
      {
        "name": "Trigger",
        "tagName": "aria-combobox-trigger"
      }
    ]
  },
  {
    "slug": "command",
    "packageName": "@ariaui-web/command",
    "defineFunctionName": "defineCommandElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-command"
      },
      {
        "name": "Content",
        "tagName": "aria-command-content"
      },
      {
        "name": "Empty",
        "tagName": "aria-command-empty"
      },
      {
        "name": "Group",
        "tagName": "aria-command-group"
      },
      {
        "name": "Input",
        "tagName": "aria-command-input"
      },
      {
        "name": "Label",
        "tagName": "aria-command-label"
      },
      {
        "name": "Loading",
        "tagName": "aria-command-loading"
      },
      {
        "name": "Option",
        "tagName": "aria-command-option"
      },
      {
        "name": "Separator",
        "tagName": "aria-command-separator"
      }
    ]
  },
  {
    "slug": "context-menu",
    "packageName": "@ariaui-web/context-menu",
    "defineFunctionName": "defineContextMenuElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-context-menu"
      },
      {
        "name": "Content",
        "tagName": "aria-context-menu-content"
      },
      {
        "name": "Group",
        "tagName": "aria-context-menu-group"
      },
      {
        "name": "Item",
        "tagName": "aria-context-menu-item"
      },
      {
        "name": "Label",
        "tagName": "aria-context-menu-label"
      },
      {
        "name": "Separator",
        "tagName": "aria-context-menu-separator"
      },
      {
        "name": "Submenu",
        "tagName": "aria-context-menu-submenu"
      }
    ]
  },
  {
    "slug": "datepicker",
    "packageName": "@ariaui-web/datepicker",
    "defineFunctionName": "defineDatepickerElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-datepicker"
      },
      {
        "name": "Calendar",
        "tagName": "aria-datepicker-calendar"
      },
      {
        "name": "Content",
        "tagName": "aria-datepicker-content"
      },
      {
        "name": "Input",
        "tagName": "aria-datepicker-input"
      },
      {
        "name": "Label",
        "tagName": "aria-datepicker-label"
      },
      {
        "name": "Trigger",
        "tagName": "aria-datepicker-trigger"
      }
    ]
  },
  {
    "slug": "dialog",
    "packageName": "@ariaui-web/dialog",
    "defineFunctionName": "defineDialogElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-dialog"
      },
      {
        "name": "Action",
        "tagName": "aria-dialog-action"
      },
      {
        "name": "Cancel",
        "tagName": "aria-dialog-cancel"
      },
      {
        "name": "Close",
        "tagName": "aria-dialog-close"
      },
      {
        "name": "Content",
        "tagName": "aria-dialog-content"
      },
      {
        "name": "Description",
        "tagName": "aria-dialog-description"
      },
      {
        "name": "Overlay",
        "tagName": "aria-dialog-overlay"
      },
      {
        "name": "Portal",
        "tagName": "aria-dialog-portal"
      },
      {
        "name": "Title",
        "tagName": "aria-dialog-title"
      },
      {
        "name": "Trigger",
        "tagName": "aria-dialog-trigger"
      }
    ]
  },
  {
    "slug": "disclosure",
    "packageName": "@ariaui-web/disclosure",
    "defineFunctionName": "defineDisclosureElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-disclosure"
      },
      {
        "name": "Content",
        "tagName": "aria-disclosure-content"
      },
      {
        "name": "Trigger",
        "tagName": "aria-disclosure-trigger"
      }
    ]
  },
  {
    "slug": "drawer",
    "packageName": "@ariaui-web/drawer",
    "defineFunctionName": "defineDrawerElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-drawer"
      },
      {
        "name": "Action",
        "tagName": "aria-drawer-action"
      },
      {
        "name": "Cancel",
        "tagName": "aria-drawer-cancel"
      },
      {
        "name": "Close",
        "tagName": "aria-drawer-close"
      },
      {
        "name": "Content",
        "tagName": "aria-drawer-content"
      },
      {
        "name": "Description",
        "tagName": "aria-drawer-description"
      },
      {
        "name": "Footer",
        "tagName": "aria-drawer-footer"
      },
      {
        "name": "Header",
        "tagName": "aria-drawer-header"
      },
      {
        "name": "Overlay",
        "tagName": "aria-drawer-overlay"
      },
      {
        "name": "Portal",
        "tagName": "aria-drawer-portal"
      },
      {
        "name": "Title",
        "tagName": "aria-drawer-title"
      },
      {
        "name": "Trigger",
        "tagName": "aria-drawer-trigger"
      }
    ]
  },
  {
    "slug": "dropdown-menu",
    "packageName": "@ariaui-web/dropdown-menu",
    "defineFunctionName": "defineDropdownMenuElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-dropdown-menu"
      },
      {
        "name": "Trigger",
        "tagName": "aria-dropdown-menu-trigger"
      },
      {
        "name": "Content",
        "tagName": "aria-dropdown-menu-content"
      },
      {
        "name": "Item",
        "tagName": "aria-dropdown-menu-item"
      },
      {
        "name": "CheckboxItem",
        "tagName": "aria-dropdown-menu-checkbox-item"
      },
      {
        "name": "RadioGroup",
        "tagName": "aria-dropdown-menu-radio-group"
      },
      {
        "name": "RadioItem",
        "tagName": "aria-dropdown-menu-radio-item"
      },
      {
        "name": "Sub",
        "tagName": "aria-dropdown-menu-sub"
      },
      {
        "name": "SubTrigger",
        "tagName": "aria-dropdown-menu-sub-trigger"
      },
      {
        "name": "SubContent",
        "tagName": "aria-dropdown-menu-sub-content"
      },
      {
        "name": "Group",
        "tagName": "aria-dropdown-menu-group"
      },
      {
        "name": "Label",
        "tagName": "aria-dropdown-menu-label"
      },
      {
        "name": "Separator",
        "tagName": "aria-dropdown-menu-separator"
      }
    ]
  },
  {
    "slug": "focus-scope",
    "packageName": "@ariaui-web/focus-scope",
    "defineFunctionName": "defineFocusScopeElements",
    "parts": [
      {
        "name": "FocusScope",
        "tagName": "aria-focus-scope"
      }
    ]
  },
  {
    "slug": "grid",
    "packageName": "@ariaui-web/grid",
    "defineFunctionName": "defineGridElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-grid"
      },
      {
        "name": "Body",
        "tagName": "aria-grid-body"
      },
      {
        "name": "Cell",
        "tagName": "aria-grid-cell"
      },
      {
        "name": "Head",
        "tagName": "aria-grid-head"
      },
      {
        "name": "Header",
        "tagName": "aria-grid-header"
      },
      {
        "name": "Row",
        "tagName": "aria-grid-row"
      }
    ]
  },
  {
    "slug": "hooks",
    "packageName": "@ariaui-web/hooks",
    "defineFunctionName": "defineHooksElements",
    "parts": []
  },
  {
    "slug": "hover-card",
    "packageName": "@ariaui-web/hover-card",
    "defineFunctionName": "defineHoverCardElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-hover-card"
      },
      {
        "name": "Content",
        "tagName": "aria-hover-card-content"
      },
      {
        "name": "Trigger",
        "tagName": "aria-hover-card-trigger"
      }
    ]
  },
  {
    "slug": "input",
    "packageName": "@ariaui-web/input",
    "defineFunctionName": "defineInputElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-input"
      }
    ]
  },
  {
    "slug": "input-otp",
    "packageName": "@ariaui-web/input-otp",
    "defineFunctionName": "defineInputOtpElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-input-otp"
      },
      {
        "name": "Group",
        "tagName": "aria-input-otp-group"
      },
      {
        "name": "InputOTP",
        "tagName": "aria-input-otp-input-otp"
      },
      {
        "name": "InputOTPGroup",
        "tagName": "aria-input-otp-input-otpgroup"
      },
      {
        "name": "InputOTPSeparator",
        "tagName": "aria-input-otp-input-otpseparator"
      },
      {
        "name": "InputOTPSlot",
        "tagName": "aria-input-otp-input-otpslot"
      },
      {
        "name": "Separator",
        "tagName": "aria-input-otp-separator"
      },
      {
        "name": "Slot",
        "tagName": "aria-input-otp-slot"
      }
    ]
  },
  {
    "slug": "kbd",
    "packageName": "@ariaui-web/kbd",
    "defineFunctionName": "defineKbdElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-kbd"
      },
      {
        "name": "Group",
        "tagName": "aria-kbd-group"
      }
    ]
  },
  {
    "slug": "keyboard",
    "packageName": "@ariaui-web/keyboard",
    "defineFunctionName": "defineKeyboardElements",
    "parts": []
  },
  {
    "slug": "label",
    "packageName": "@ariaui-web/label",
    "defineFunctionName": "defineLabelElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-label"
      }
    ]
  },
  {
    "slug": "listbox",
    "packageName": "@ariaui-web/listbox",
    "defineFunctionName": "defineListboxElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-listbox"
      },
      {
        "name": "Content",
        "tagName": "aria-listbox-content"
      },
      {
        "name": "Group",
        "tagName": "aria-listbox-group"
      },
      {
        "name": "GroupLabel",
        "tagName": "aria-listbox-group-label"
      },
      {
        "name": "Label",
        "tagName": "aria-listbox-label"
      },
      {
        "name": "Option",
        "tagName": "aria-listbox-option"
      },
      {
        "name": "Submenu",
        "tagName": "aria-listbox-submenu"
      },
      {
        "name": "Viewport",
        "tagName": "aria-listbox-viewport"
      }
    ]
  },
  {
    "slug": "menubar",
    "packageName": "@ariaui-web/menubar",
    "defineFunctionName": "defineMenubarElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-menubar"
      },
      {
        "name": "CheckboxItem",
        "tagName": "aria-menubar-checkbox-item"
      },
      {
        "name": "Content",
        "tagName": "aria-menubar-content"
      },
      {
        "name": "Group",
        "tagName": "aria-menubar-group"
      },
      {
        "name": "Item",
        "tagName": "aria-menubar-item"
      },
      {
        "name": "ItemIndicator",
        "tagName": "aria-menubar-item-indicator"
      },
      {
        "name": "Label",
        "tagName": "aria-menubar-label"
      },
      {
        "name": "Menu",
        "tagName": "aria-menubar-menu"
      },
      {
        "name": "RadioGroup",
        "tagName": "aria-menubar-radio-group"
      },
      {
        "name": "RadioItem",
        "tagName": "aria-menubar-radio-item"
      },
      {
        "name": "Separator",
        "tagName": "aria-menubar-separator"
      },
      {
        "name": "Sub",
        "tagName": "aria-menubar-sub"
      },
      {
        "name": "SubContent",
        "tagName": "aria-menubar-sub-content"
      },
      {
        "name": "Submenu",
        "tagName": "aria-menubar-submenu"
      },
      {
        "name": "SubTrigger",
        "tagName": "aria-menubar-sub-trigger"
      },
      {
        "name": "Trigger",
        "tagName": "aria-menubar-trigger"
      }
    ]
  },
  {
    "slug": "navigation-menu",
    "packageName": "@ariaui-web/navigation-menu",
    "defineFunctionName": "defineNavigationMenuElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-navigation-menu"
      },
      {
        "name": "Content",
        "tagName": "aria-navigation-menu-content"
      },
      {
        "name": "Item",
        "tagName": "aria-navigation-menu-item"
      },
      {
        "name": "Link",
        "tagName": "aria-navigation-menu-link"
      },
      {
        "name": "List",
        "tagName": "aria-navigation-menu-list"
      },
      {
        "name": "Sub",
        "tagName": "aria-navigation-menu-sub"
      },
      {
        "name": "SubContent",
        "tagName": "aria-navigation-menu-sub-content"
      },
      {
        "name": "Submenu",
        "tagName": "aria-navigation-menu-submenu"
      },
      {
        "name": "SubTrigger",
        "tagName": "aria-navigation-menu-sub-trigger"
      },
      {
        "name": "Trigger",
        "tagName": "aria-navigation-menu-trigger"
      }
    ]
  },
  {
    "slug": "pagination",
    "packageName": "@ariaui-web/pagination",
    "defineFunctionName": "definePaginationElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-pagination"
      },
      {
        "name": "Content",
        "tagName": "aria-pagination-content"
      },
      {
        "name": "Ellipsis",
        "tagName": "aria-pagination-ellipsis"
      },
      {
        "name": "Item",
        "tagName": "aria-pagination-item"
      },
      {
        "name": "Link",
        "tagName": "aria-pagination-link"
      },
      {
        "name": "Next",
        "tagName": "aria-pagination-next"
      },
      {
        "name": "Pages",
        "tagName": "aria-pagination-pages"
      },
      {
        "name": "Previous",
        "tagName": "aria-pagination-previous"
      }
    ]
  },
  {
    "slug": "popover",
    "packageName": "@ariaui-web/popover",
    "defineFunctionName": "definePopoverElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-popover"
      },
      {
        "name": "Close",
        "tagName": "aria-popover-close"
      },
      {
        "name": "Content",
        "tagName": "aria-popover-content"
      },
      {
        "name": "Description",
        "tagName": "aria-popover-description"
      },
      {
        "name": "Heading",
        "tagName": "aria-popover-heading"
      },
      {
        "name": "Trigger",
        "tagName": "aria-popover-trigger"
      }
    ]
  },
  {
    "slug": "portal",
    "packageName": "@ariaui-web/portal",
    "defineFunctionName": "definePortalElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-portal"
      }
    ]
  },
  {
    "slug": "position",
    "packageName": "@ariaui-web/position",
    "defineFunctionName": "definePositionElements",
    "parts": []
  },
  {
    "slug": "progress",
    "packageName": "@ariaui-web/progress",
    "defineFunctionName": "defineProgressElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-progress"
      },
      {
        "name": "Indicator",
        "tagName": "aria-progress-indicator"
      }
    ]
  },
  {
    "slug": "radio",
    "packageName": "@ariaui-web/radio",
    "defineFunctionName": "defineRadioElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-radio"
      },
      {
        "name": "Indicator",
        "tagName": "aria-radio-indicator"
      },
      {
        "name": "Item",
        "tagName": "aria-radio-item"
      }
    ]
  },
  {
    "slug": "scroll-area",
    "packageName": "@ariaui-web/scroll-area",
    "defineFunctionName": "defineScrollAreaElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-scroll-area"
      },
      {
        "name": "Corner",
        "tagName": "aria-scroll-area-corner"
      },
      {
        "name": "Scrollbar",
        "tagName": "aria-scroll-area-scrollbar"
      },
      {
        "name": "ScrollDownButton",
        "tagName": "aria-scroll-area-scroll-down-button"
      },
      {
        "name": "ScrollUpButton",
        "tagName": "aria-scroll-area-scroll-up-button"
      },
      {
        "name": "Thumb",
        "tagName": "aria-scroll-area-thumb"
      },
      {
        "name": "Viewport",
        "tagName": "aria-scroll-area-viewport"
      }
    ]
  },
  {
    "slug": "select",
    "packageName": "@ariaui-web/select",
    "defineFunctionName": "defineSelectElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-select"
      },
      {
        "name": "Content",
        "tagName": "aria-select-content"
      },
      {
        "name": "DropdownIndicator",
        "tagName": "aria-select-dropdown-indicator"
      },
      {
        "name": "Group",
        "tagName": "aria-select-group"
      },
      {
        "name": "GroupLabel",
        "tagName": "aria-select-group-label"
      },
      {
        "name": "Label",
        "tagName": "aria-select-label"
      },
      {
        "name": "Option",
        "tagName": "aria-select-option"
      },
      {
        "name": "Sub",
        "tagName": "aria-select-sub"
      },
      {
        "name": "SubContent",
        "tagName": "aria-select-sub-content"
      },
      {
        "name": "SubTrigger",
        "tagName": "aria-select-sub-trigger"
      },
      {
        "name": "Tag",
        "tagName": "aria-select-tag"
      },
      {
        "name": "TagGroup",
        "tagName": "aria-select-tag-group"
      },
      {
        "name": "Trigger",
        "tagName": "aria-select-trigger"
      }
    ]
  },
  {
    "slug": "separator",
    "packageName": "@ariaui-web/separator",
    "defineFunctionName": "defineSeparatorElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-separator"
      }
    ]
  },
  {
    "slug": "sidebar",
    "packageName": "@ariaui-web/sidebar",
    "defineFunctionName": "defineSidebarElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-sidebar"
      },
      {
        "name": "Group",
        "tagName": "aria-sidebar-group"
      },
      {
        "name": "Inset",
        "tagName": "aria-sidebar-inset"
      },
      {
        "name": "Layout",
        "tagName": "aria-sidebar-layout"
      },
      {
        "name": "Menu",
        "tagName": "aria-sidebar-menu"
      },
      {
        "name": "Panel",
        "tagName": "aria-sidebar-panel"
      },
      {
        "name": "Rail",
        "tagName": "aria-sidebar-rail"
      },
      {
        "name": "Trigger",
        "tagName": "aria-sidebar-trigger"
      }
    ]
  },
  {
    "slug": "skeleton",
    "packageName": "@ariaui-web/skeleton",
    "defineFunctionName": "defineSkeletonElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-skeleton"
      }
    ]
  },
  {
    "slug": "slider",
    "packageName": "@ariaui-web/slider",
    "defineFunctionName": "defineSliderElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-slider"
      },
      {
        "name": "Range",
        "tagName": "aria-slider-range"
      },
      {
        "name": "Thumb",
        "tagName": "aria-slider-thumb"
      },
      {
        "name": "Track",
        "tagName": "aria-slider-track"
      }
    ]
  },
  {
    "slug": "slot",
    "packageName": "@ariaui-web/slot",
    "defineFunctionName": "defineSlotElements",
    "parts": [
      {
        "name": "Slot",
        "tagName": "aria-slot-slot"
      }
    ]
  },
  {
    "slug": "spinbutton",
    "packageName": "@ariaui-web/spinbutton",
    "defineFunctionName": "defineSpinbuttonElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-spinbutton"
      },
      {
        "name": "Decrement",
        "tagName": "aria-spinbutton-decrement"
      },
      {
        "name": "Increment",
        "tagName": "aria-spinbutton-increment"
      },
      {
        "name": "Input",
        "tagName": "aria-spinbutton-input"
      }
    ]
  },
  {
    "slug": "spinner",
    "packageName": "@ariaui-web/spinner",
    "defineFunctionName": "defineSpinnerElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-spinner"
      }
    ]
  },
  {
    "slug": "splitter",
    "packageName": "@ariaui-web/splitter",
    "defineFunctionName": "defineSplitterElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-splitter"
      },
      {
        "name": "Panel",
        "tagName": "aria-splitter-panel"
      },
      {
        "name": "Separator",
        "tagName": "aria-splitter-separator"
      }
    ]
  },
  {
    "slug": "switch",
    "packageName": "@ariaui-web/switch",
    "defineFunctionName": "defineSwitchElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-switch"
      },
      {
        "name": "Thumb",
        "tagName": "aria-switch-thumb"
      },
      {
        "name": "Track",
        "tagName": "aria-switch-track"
      }
    ]
  },
  {
    "slug": "table",
    "packageName": "@ariaui-web/table",
    "defineFunctionName": "defineTableElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-table"
      },
      {
        "name": "Body",
        "tagName": "aria-table-body"
      },
      {
        "name": "Caption",
        "tagName": "aria-table-caption"
      },
      {
        "name": "Cell",
        "tagName": "aria-table-cell"
      },
      {
        "name": "ColumnHeader",
        "tagName": "aria-table-column-header"
      },
      {
        "name": "Footer",
        "tagName": "aria-table-footer"
      },
      {
        "name": "Header",
        "tagName": "aria-table-header"
      },
      {
        "name": "Row",
        "tagName": "aria-table-row"
      },
      {
        "name": "RowHeader",
        "tagName": "aria-table-row-header"
      }
    ]
  },
  {
    "slug": "tabs",
    "packageName": "@ariaui-web/tabs",
    "defineFunctionName": "defineTabsElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-tabs"
      },
      {
        "name": "Content",
        "tagName": "aria-tabs-content"
      },
      {
        "name": "List",
        "tagName": "aria-tabs-list"
      },
      {
        "name": "Panel",
        "tagName": "aria-tabs-panel"
      },
      {
        "name": "Trigger",
        "tagName": "aria-tabs-trigger"
      }
    ]
  },
  {
    "slug": "textarea",
    "packageName": "@ariaui-web/textarea",
    "defineFunctionName": "defineTextareaElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-textarea"
      }
    ]
  },
  {
    "slug": "toast",
    "packageName": "@ariaui-web/toast",
    "defineFunctionName": "defineToastElements",
    "parts": [
      {
        "name": "Close",
        "tagName": "aria-toast-close"
      },
      {
        "name": "Item",
        "tagName": "aria-toast-item"
      },
      {
        "name": "List",
        "tagName": "aria-toast-list"
      }
    ]
  },
  {
    "slug": "toggle",
    "packageName": "@ariaui-web/toggle",
    "defineFunctionName": "defineToggleElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-toggle"
      }
    ]
  },
  {
    "slug": "toggle-group",
    "packageName": "@ariaui-web/toggle-group",
    "defineFunctionName": "defineToggleGroupElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-toggle-group"
      },
      {
        "name": "Item",
        "tagName": "aria-toggle-group-item"
      }
    ]
  },
  {
    "slug": "tokens",
    "packageName": "@ariaui-web/tokens",
    "defineFunctionName": "defineTokensElements",
    "parts": []
  },
  {
    "slug": "tooltip",
    "packageName": "@ariaui-web/tooltip",
    "defineFunctionName": "defineTooltipElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-tooltip"
      },
      {
        "name": "Content",
        "tagName": "aria-tooltip-content"
      },
      {
        "name": "Trigger",
        "tagName": "aria-tooltip-trigger"
      }
    ]
  },
  {
    "slug": "treegrid",
    "packageName": "@ariaui-web/treegrid",
    "defineFunctionName": "defineTreegridElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-treegrid"
      },
      {
        "name": "Body",
        "tagName": "aria-treegrid-body"
      },
      {
        "name": "Cell",
        "tagName": "aria-treegrid-cell"
      },
      {
        "name": "ColumnHeader",
        "tagName": "aria-treegrid-column-header"
      },
      {
        "name": "Group",
        "tagName": "aria-treegrid-group"
      },
      {
        "name": "Header",
        "tagName": "aria-treegrid-header"
      },
      {
        "name": "Row",
        "tagName": "aria-treegrid-row"
      },
      {
        "name": "RowHeader",
        "tagName": "aria-treegrid-row-header"
      }
    ]
  },
  {
    "slug": "treeview",
    "packageName": "@ariaui-web/treeview",
    "defineFunctionName": "defineTreeviewElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-treeview"
      },
      {
        "name": "CheckboxItem",
        "tagName": "aria-treeview-checkbox-item"
      },
      {
        "name": "Group",
        "tagName": "aria-treeview-group"
      },
      {
        "name": "Item",
        "tagName": "aria-treeview-item"
      },
      {
        "name": "Toggle",
        "tagName": "aria-treeview-toggle"
      }
    ]
  },
  {
    "slug": "tsconfig",
    "packageName": "@ariaui-web/tsconfig",
    "defineFunctionName": "defineTsconfigElements",
    "parts": []
  },
  {
    "slug": "upload",
    "packageName": "@ariaui-web/upload",
    "defineFunctionName": "defineUploadElements",
    "parts": [
      {
        "name": "Root",
        "tagName": "aria-upload"
      },
      {
        "name": "Item",
        "tagName": "aria-upload-item"
      },
      {
        "name": "List",
        "tagName": "aria-upload-list"
      },
      {
        "name": "Selector",
        "tagName": "aria-upload-selector"
      }
    ]
  },
  {
    "slug": "utils",
    "packageName": "@ariaui-web/utils",
    "defineFunctionName": "defineUtilsElements",
    "parts": []
  }
] as const;

function readDoc(path: string) {
  return readFileSync(join(process.cwd(), "web", "doc", "docs", path), "utf8");
}

type RuntimeAccordionElement = HTMLElement & {
  open: boolean;
  value: string;
};

type RuntimeAlertElement = HTMLElement & {
  open: boolean;
};

type RuntimeDialogElement = HTMLElement & {
  open: boolean;
};

type RuntimeAlertDialogElement = HTMLElement & {
  open: boolean;
};

type RuntimeAspectRatioElement = HTMLElement & {
  ratio: string;
};

type RuntimeAvatarElement = HTMLElement & {
  src?: string;
};

type RuntimeBadgeElement = HTMLElement & {
  pressed: boolean;
};

function accordionPreviewMarkup(doc: string) {
  const match = doc.match(/<aria-accordion\b[\s\S]*?<\/aria-accordion>/);

  if (!match) {
    throw new Error("Missing accordion preview markup.");
  }

  return match[0];
}

function accordionExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="accordion" data-example-variant="([^"]+)">\n\s*(<aria-accordion[\s\S]*?<\/aria-accordion>)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function alertExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="ariaui-web-preview" data-component="alert" data-example-variant="([^"]+)">\n\s*(<aria-alert[\s\S]*?<\/aria-alert>)\n<\/div>/g),
  ).map((match) => ({
    variant: match[1],
    markup: match[2],
  }));
}

function dialogExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="ariaui-web-preview" data-component="dialog" data-example-variant="([^"]+)">\n\s*(<aria-dialog[\s\S]*?<\/aria-dialog>)\n<\/div>/g),
  ).map((match) => ({
    variant: match[1],
    markup: match[2],
  }));
}

function alertDialogExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="ariaui-web-preview" data-component="alert-dialog" data-example-variant="([^"]+)">\n\s*(<aria-alert-dialog[\s\S]*?<\/aria-alert-dialog>)\n<\/div>/g),
  ).map((match) => ({
    variant: match[1],
    markup: match[2],
  }));
}

function aspectRatioExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="aspect-ratio" data-example-variant="([^"]+)">\n\s*<div class="([^"]*\bariaui-web-aspect-ratio-frame\b[^"]*)">\n\s*(<aria-aspect-ratio[\s\S]*?<\/aria-aspect-ratio>)\n\s*<\/div>\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    frameClassName: match[3],
    markup: match[4],
  }));
}

function avatarExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="avatar" data-example-variant="([^"]+)">\n\s*(<aria-avatar[\s\S]*?<\/aria-avatar(?:-group)?>)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function badgeExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="badge" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function expectHeadingsInOrder(doc: string, headings: readonly string[]) {
  let previousIndex = -1;

  for (const heading of headings) {
    const index = doc.indexOf(`\n${heading}\n`);
    expect(index, `missing heading: ${heading}`).toBeGreaterThan(previousIndex);
    previousIndex = index;
  }
}

describe("docs package coverage", () => {
  it("has a docs page for every generated package", () => {
    const packagesPage = readDoc("overview/packages.md");

    for (const slug of packageSlugs) {
      expect(packagesPage).toContain(`/components/${slug}`);
      expect(readDoc(`components/${slug}.md`)).toContain(`@ariaui-web/${slug}`);
    }

    for (const slug of hiddenPackageSlugs) {
      expect(packagesPage).not.toContain(`/components/${slug}`);
      expect(readDoc(`components/${slug}.md`)).toContain(`@ariaui-web/${slug}`);
    }
  });

  it("uses readable package labels in the sidebar", () => {
    const config = readDoc(".vitepress/config.ts");

    for (const label of [
      "Alert Dialog",
      "Aspect Ratio",
      "Context Menu",
      "Dropdown Menu",
      "Hover Card",
      "Input OTP",
      "Navigation Menu",
      "Scroll Area",
      "Toggle Group",
    ]) {
      expect(config).toContain(`"text": "${label}"`);
    }

    for (const label of [
      "AlertDialog",
      "AspectRatio",
      "ContextMenu",
      "DropdownMenu",
      "FocusScope",
      "HoverCard",
      "InputOtp",
      "NavigationMenu",
      "ScrollArea",
      "ToggleGroup",
    ]) {
      expect(config).not.toContain(`"text": "${label}"`);
    }
  });
});

describe("native component docs", () => {
  it("documents native installation and registration without source-mirror framing", () => {
    for (const native of nativePackageExpectations) {
      const doc = readDoc(`components/${native.slug}.md`);
      const lowerDoc = doc.toLowerCase();

      expect(doc).toContain(native.packageName);
      expect(doc).toContain(`npm install ${native.packageName}`);
      expect(doc).toContain(`pnpm add ${native.packageName}`);
      expect(doc).toContain(`yarn add ${native.packageName}`);
      expect(doc).toContain(`import { ${native.defineFunctionName} } from "${native.packageName}";`);
      expect(doc).toContain(`${native.defineFunctionName}();`);
      expect(doc).not.toContain(`@ariaui/${native.slug}`);
      expect(doc).not.toContain("Source page:");
      expect(doc).not.toContain("Source live example");
      expect(doc).not.toContain("Aria UI renders");
      expect(lowerDoc).not.toContain("mirrors");
      expect(lowerDoc).not.toContain("mirrored");
    }
  });

  it("documents native custom element tags for every component part", () => {
    for (const native of nativePackageExpectations) {
      const doc = readDoc(`components/${native.slug}.md`);

      for (const part of native.parts) {
        expect(doc).toContain(part.name);
        expect(doc).toContain(part.tagName);
      }
    }
  });

  it("renders stable live preview examples for every package page", () => {
    for (const native of nativePackageExpectations) {
      const doc = readDoc(`components/${native.slug}.md`);

      expect(doc).toMatch(new RegExp(`<div class="[^"]*\\bariaui-web-preview\\b[^"]*" data-component="${native.slug}"`));

      if (native.parts.length === 0) {
        expect(doc).toContain('data-example-part="Utility"');
        continue;
      }

      const expectedExampleParts = native.slug === "accordion"
        ? native.parts.filter((part) => ["Content", "Header", "Item", "Root", "Trigger"].includes(part.name))
        : native.slug === "dialog"
          ? native.parts
        : native.parts.slice(0, 4);

      for (const part of expectedExampleParts) {
        expect(doc).toContain(`<${part.tagName}`);
        expect(doc).toContain(`data-example-part="${part.name}"`);
      }
    }
  });
});

describe("working component docs examples", () => {
  it("keeps the aspect-ratio docs structured like the source Aria UI aspect ratio page", () => {
    const doc = readDoc("components/aspect-ratio.md");

    expect(doc).toContain("Displays content within a desired width-to-height ratio.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### 16 : 9",
      "### 21 : 9",
      "### 4 : 3",
      "### 1 : 1",
      "### 9 : 16",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source aspect-ratio example as a live custom element preview", () => {
    const doc = readDoc("components/aspect-ratio.md");
    const previews = aspectRatioExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "widescreen",
      "cinematic",
      "classic",
      "square",
      "portrait",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("p-12");
      expect(preview.frameClassName).toContain("ariaui-web-aspect-ratio-frame");
      expect(preview.markup).toContain("<aria-aspect-ratio");
      expect(preview.markup).toContain("/aspect-ratio-light.png");
      expect(preview.markup).toContain("/aspect-ratio-dark.png");
      expect(preview.markup).toContain("overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl");
      expect(preview.markup).toContain("h-full w-full object-cover rounded-xl");
      expect(preview.markup).toContain('alt="Colorful abstract gradient');
    }

    expect(previews.find((preview) => preview.variant === "widescreen")?.markup).toContain('ratio="16 / 9"');
    expect(previews.find((preview) => preview.variant === "cinematic")?.markup).toContain('ratio="21 / 9"');
    expect(previews.find((preview) => preview.variant === "classic")?.markup).toContain('ratio="4 / 3"');
    expect(previews.find((preview) => preview.variant === "square")?.markup).toContain('ratio="1"');
    expect(previews.find((preview) => preview.variant === "portrait")?.markup).toContain('ratio="9 / 16"');
  });

  it("keeps the generated aspect-ratio live examples behaviorally rendered", () => {
    defineAspectRatioElements();
    const previews = aspectRatioExamplePreviews(readDoc("components/aspect-ratio.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-aspect-ratio")) as RuntimeAspectRatioElement[];
    const expectedPadding = [56.25, 100 / (21 / 9), 75, 100, 100 / (9 / 16)];

    expect(roots).toHaveLength(5);
    roots.forEach((root, index) => {
      const fill = root.firstElementChild as HTMLElement | null;
      const lightImage = root.querySelector("img:not(.hidden)") as HTMLImageElement | null;

      expect(root.style.position).toBe("relative");
      expect(root.style.width).toBe("100%");
      expect(parseFloat(root.style.paddingBottom)).toBeCloseTo(expectedPadding[index] ?? 100, 3);
      expect(root.hasAttribute("role")).toBe(false);
      expect(root.hasAttribute("data-state")).toBe(false);
      expect(fill?.style.position).toBe("absolute");
      expect(fill?.style.inset).toBe("0px");
      expect(lightImage?.alt).toContain("Colorful abstract gradient");
    });

    document.body.replaceChildren();
  });

  it("keeps aspect-ratio live example containers full-width while the image frame stays compact", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="aspect-ratio"]');
    expect(style).toContain("box-sizing: border-box;");
    expect(style).toContain("width: 100%;");
    expect(style).toContain(".ariaui-web-aspect-ratio-frame");
    expect(style).toContain("max-width: 21.875rem;");
    const rootRule = style.match(/\.ariaui-web-preview\[data-component="aspect-ratio"\] \[data-example-part="Root"\] \{[^}]*\}/)?.[0] ?? "";
    expect(rootRule).not.toContain("max-width:");
  });

  it("keeps the avatar docs structured like the source Aria UI avatar page", () => {
    const doc = readDoc("components/avatar.md");

    expect(doc).toContain("An image element with a fallback for representing the user.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### With image",
      "### Initials",
      "### Overlapping row",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Image",
      "### Fallback",
      "### Group",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source avatar example as a live custom element preview", () => {
    const previews = avatarExamplePreviews(readDoc("components/avatar.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "with-image",
      "initials",
      "overlapping-row",
    ]);

    const withImage = previews.find((preview) => preview.variant === "with-image")?.markup ?? "";
    expect(withImage).toContain("<aria-avatar");
    expect(withImage).toContain("<aria-avatar-image");
    expect(withImage).toContain('src="/avatar.png"');
    expect(withImage).toContain('alt="Profile photo"');
    expect(withImage).toContain("<aria-avatar-fallback");
    expect(withImage).toContain(">SC</aria-avatar-fallback>");
    expect(withImage).toContain("relative flex shrink-0 overflow-hidden rounded-full border-2 border-background");

    const initials = previews.find((preview) => preview.variant === "initials")?.markup ?? "";
    expect(initials).toContain('aria-label="Fallback avatar initials SC"');
    expect(initials).not.toContain("<aria-avatar-image");
    expect(initials).toContain(">SC</aria-avatar-fallback>");

    const group = previews.find((preview) => preview.variant === "overlapping-row")?.markup ?? "";
    expect(group).toContain("<aria-avatar-group");
    expect(group).toContain("-space-x-3 flex items-center pr-3");
    expect(group).toContain('alt="Team member 1"');
    expect(group).toContain('alt="Team member 2"');
    expect(group).toContain("MW");
    expect(group).toContain("SD");

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
    }
  });

  it("keeps the generated avatar live examples behaviorally rendered", () => {
    defineAvatarElements();
    const previews = avatarExamplePreviews(readDoc("components/avatar.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-avatar")) as RuntimeAvatarElement[];
    const images = Array.from(document.querySelectorAll("aria-avatar-image")) as RuntimeAvatarElement[];
    const fallbacks = Array.from(document.querySelectorAll("aria-avatar-fallback")) as RuntimeAvatarElement[];
    const group = document.querySelector("aria-avatar-group") as RuntimeAvatarElement | null;

    expect(roots.length).toBeGreaterThanOrEqual(6);
    expect(images).toHaveLength(3);
    expect(fallbacks.length).toBeGreaterThanOrEqual(6);
    expect(group?.getAttribute("role")).toBe("group");

    const firstImage = images[0];
    const firstRoot = firstImage?.closest("aria-avatar") as RuntimeAvatarElement | null;
    const firstFallback = firstRoot?.querySelector("aria-avatar-fallback") as HTMLElement | null;
    const img = firstImage?.querySelector("img") as HTMLImageElement | null;

    expect(firstRoot?.getAttribute("role")).toBe("img");
    expect(firstRoot?.getAttribute("aria-label")).toBe("avatar");
    expect(firstFallback?.hidden).toBe(false);
    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(img?.getAttribute("alt")).toBe("Profile photo");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");

    img?.dispatchEvent(new Event("load", { bubbles: false }));

    expect(firstRoot?.hasAttribute("role")).toBe(false);
    expect(firstRoot?.hasAttribute("aria-label")).toBe(false);
    expect(firstFallback?.hidden).toBe(true);
    expect(img?.hasAttribute("aria-hidden")).toBe(false);
    expect(img?.style.visibility).toBe("");

    document.body.replaceChildren();
  });

  it("keeps the badge docs structured like the source Aria UI badge page", () => {
    const doc = readDoc("components/badge.md");

    expect(doc).toContain("A minimal headless wrapper for status labels, counts, and tags.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Default",
      "### Secondary",
      "### Outline",
      "### Destructive",
      "### With icon",
      "### Circular / count",
      "### Action / link",
      "### Verified",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source badge example as a live custom element preview", () => {
    const previews = badgeExamplePreviews(readDoc("components/badge.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "default",
      "secondary",
      "outline",
      "destructive",
      "with-icon",
      "count",
      "link",
      "verified",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("flex");
      expect(preview.className).toContain("flex-wrap");
      expect(preview.className).toContain("gap-4");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
      expect(preview.markup).toContain("<aria-badge");
    }

    for (const variant of ["default", "secondary", "outline", "destructive", "with-icon", "link", "verified"]) {
      expect(previews.find((preview) => preview.variant === variant)?.markup).toContain("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold");
    }

    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain("Badge");
    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain("bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover");
    expect(previews.find((preview) => preview.variant === "secondary")?.markup).toContain("Secondary");
    expect(previews.find((preview) => preview.variant === "outline")?.markup).toContain("border-border bg-transparent text-foreground hover:bg-secondary");
    expect(previews.find((preview) => preview.variant === "destructive")?.markup).toContain("Destructive");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("m4.5 12.75 6 6 9-13.5");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("M12 9v3.75m9-.75a9 9");
    expect(previews.find((preview) => preview.variant === "count")?.markup).toContain("20+");
    expect(previews.find((preview) => preview.variant === "count")?.markup).toContain("inline-flex h-5 min-w-5 items-center justify-center rounded-full");
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain('as="a"');
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain('href="#"');
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain("M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3");
    expect(previews.find((preview) => preview.variant === "verified")?.markup).toContain("CheckBadgeIcon");
    expect(previews.find((preview) => preview.variant === "verified")?.markup).toContain("Verified");
  });

  it("keeps the generated badge live examples behaviorally rendered", () => {
    defineBadgeElements();
    const previews = badgeExamplePreviews(readDoc("components/badge.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-badge")) as RuntimeBadgeElement[];
    const staticRoot = roots[0] ?? null;
    const linkRoots = Array.from(document.querySelectorAll('aria-badge[as="a"]')) as RuntimeBadgeElement[];
    const iconSvgs = Array.from(document.querySelectorAll('aria-badge svg[aria-hidden="true"]'));

    expect(roots).toHaveLength(13);
    expect(staticRoot?.textContent?.trim()).toBe("Badge");
    expect(staticRoot?.hasAttribute("role")).toBe(false);
    expect(staticRoot?.hasAttribute("aria-label")).toBe(false);
    expect(staticRoot?.hasAttribute("tabindex")).toBe(false);
    expect(staticRoot?.hasAttribute("data-state")).toBe(false);
    expect(staticRoot?.hasAttribute("data-variant")).toBe(false);
    expect(staticRoot?.hasAttribute("data-slot")).toBe(false);
    expect(iconSvgs.length).toBeGreaterThanOrEqual(5);

    expect(linkRoots).toHaveLength(3);
    for (const linkRoot of linkRoots) {
      expect(linkRoot.getAttribute("href")).toBe("#");
      expect(linkRoot.getAttribute("role")).toBe("link");
      expect(linkRoot.getAttribute("tabindex")).toBe("0");
    }

    let clickCount = 0;
    linkRoots[0]?.addEventListener("click", (event) => {
      event.preventDefault();
      clickCount += 1;
    });
    linkRoots[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(clickCount).toBe(1);

    document.body.replaceChildren();
  });

  it("keeps badge live example styles scoped to the badge docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="badge"]');
    expect(style).toContain('.ariaui-web-preview[data-component="badge"] [data-example-part="Root"]');
    expect(style).toContain("inline-flex");
    expect(style).toContain("border-radius: 0.375rem;");
    expect(style).toContain("text-decoration: none;");
  });

  it("keeps the alert docs structured like the source Aria UI alert page", () => {
    const doc = readDoc("components/alert.md");

    expect(doc).toContain("Displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Success",
      "### Warning",
      "### Error",
      "### With actions",
      "### Dismissible",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Title",
      "### Description",
      "### Action",
      "### Close",
      "### Cancel",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source alert example as a live custom element preview", () => {
    const doc = readDoc("components/alert.md");
    const previews = alertExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "success",
      "warning",
      "error",
      "with-actions",
      "dismissible",
    ]);

    for (const preview of previews) {
      expect(preview.markup).toContain('class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm"');
      expect(preview.markup).toContain("<aria-alert-title");
      expect(preview.markup).toContain("<aria-alert-description");
    }

    expect(previews.find((preview) => preview.variant === "success")?.markup).toContain("Your changes have been saved successfully.");
    expect(previews.find((preview) => preview.variant === "warning")?.markup).toContain("Your session will expire in 5 minutes.");
    expect(previews.find((preview) => preview.variant === "error")?.markup).toContain("We could not load your data.");
    expect(previews.find((preview) => preview.variant === "with-actions")?.markup).toContain("Payment failed");
    expect(previews.find((preview) => preview.variant === "with-actions")?.markup).toContain("<aria-alert-action");
    expect(previews.find((preview) => preview.variant === "with-actions")?.markup).toContain("<aria-alert-cancel");
    expect(previews.find((preview) => preview.variant === "dismissible")?.markup).toContain("Maintenance scheduled");
    expect(previews.find((preview) => preview.variant === "dismissible")?.markup).toContain("<aria-alert-close");
    expect(previews.find((preview) => preview.variant === "success")?.markup).toContain("text-icon-success");
    expect(previews.find((preview) => preview.variant === "warning")?.markup).toContain("text-icon-warning");
    expect(previews.find((preview) => preview.variant === "error")?.markup).toContain("text-icon-destructive");
  });

  it("keeps the generated alert live examples behaviorally interactive", async () => {
    defineAlertElements();
    const previews = alertExamplePreviews(readDoc("components/alert.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-alert")) as RuntimeAlertElement[];
    const dismissible = roots.find((root) => root.textContent?.includes("Maintenance scheduled"));
    const withActions = roots.find((root) => root.textContent?.includes("Payment failed"));

    expect(roots).toHaveLength(5);
    expect(roots.every((root) => root.getAttribute("aria-labelledby"))).toBe(true);
    expect(roots.every((root) => root.getAttribute("aria-describedby"))).toBe(true);
    expect(dismissible?.open).toBe(true);
    expect(dismissible?.hidden).toBe(false);

    const close = dismissible?.querySelector("aria-alert-close") as RuntimeAlertElement | null;
    close?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(dismissible?.open).toBe(false);
    expect(dismissible?.hidden).toBe(true);

    const cancel = withActions?.querySelector("aria-alert-cancel") as RuntimeAlertElement | null;
    cancel?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(withActions?.open).toBe(false);
    expect(withActions?.hidden).toBe(true);

    document.body.replaceChildren();
  });

  it("keeps the dialog docs structured like the source Aria UI dialog page", () => {
    const doc = readDoc("components/dialog.md");

    expect(doc).toContain("A modal dialog that opens above the page for focused tasks such as editing profile details.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Edit profile",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Trigger",
      "### Portal",
      "### Overlay",
      "### Content",
      "### Title",
      "### Description",
      "### Close",
      "### Cancel",
      "### Action",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source dialog example as a live custom element preview", () => {
    const doc = readDoc("components/dialog.md");
    const previews = dialogExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "edit-profile",
      "framer-motion",
    ]);

    for (const preview of previews) {
      expect(preview.markup).toContain('class="ariaui-web-dialog-example');
      expect(preview.markup).toContain("<aria-dialog-trigger");
      expect(preview.markup).toContain("<aria-dialog-portal");
      expect(preview.markup).toContain("<aria-dialog-overlay");
      expect(preview.markup).toContain("<aria-dialog-content");
      expect(preview.markup).toContain("<aria-dialog-title");
      expect(preview.markup).toContain("<aria-dialog-description");
      expect(preview.markup).toContain("<aria-dialog-cancel");
      expect(preview.markup).toContain("<aria-dialog-action");
      expect(preview.markup).toContain("<aria-dialog-close");
      expect(preview.markup).toContain("Edit Profile");
      expect(preview.markup).toContain("Edit profile");
      expect(preview.markup).toContain("Make changes to your profile here. Click save when you're done.");
      expect(preview.markup).toContain("Pedro Duarte");
      expect(preview.markup).toContain("@peduarte");
      expect(preview.markup).toContain("Save changes");
      expect(preview.markup).toContain("M6 18 18 6M6 6l12 12");
    }

    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain("ariaui-web-dialog-motion-example");
  });

  it("keeps the generated dialog live examples behaviorally interactive", async () => {
    defineDialogElements();
    const previews = dialogExamplePreviews(readDoc("components/dialog.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-dialog")) as RuntimeDialogElement[];
    const root = roots[0] ?? null;
    const trigger = root?.querySelector("aria-dialog-trigger") as RuntimeDialogElement | null;
    const portal = root?.querySelector("aria-dialog-portal") as RuntimeDialogElement | null;
    const overlay = root?.querySelector("aria-dialog-overlay") as RuntimeDialogElement | null;
    const content = root?.querySelector("aria-dialog-content") as RuntimeDialogElement | null;
    const title = root?.querySelector("aria-dialog-title") as RuntimeDialogElement | null;
    const description = root?.querySelector("aria-dialog-description") as RuntimeDialogElement | null;
    const cancel = root?.querySelector("aria-dialog-cancel") as RuntimeDialogElement | null;

    expect(roots).toHaveLength(2);
    expect(root?.open).toBe(false);
    expect(root?.hasAttribute("aria-expanded")).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(portal?.hidden).toBe(true);
    expect(overlay?.hidden).toBe(true);
    expect(content?.hidden).toBe(true);
    expect(content?.hasAttribute("role")).toBe(false);

    trigger?.click();
    await new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));

    expect(root?.open).toBe(true);
    expect(root?.hasAttribute("aria-expanded")).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(trigger?.getAttribute("aria-controls")).toBe(content?.id);
    expect(portal?.hidden).toBe(false);
    expect(overlay?.hidden).toBe(false);
    expect(content?.hidden).toBe(false);
    expect(content?.getAttribute("role")).toBe("dialog");
    expect(content?.getAttribute("aria-modal")).toBe("true");
    expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
    expect(document.activeElement).toBe(cancel);

    trigger?.click();
    await new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));

    expect(root?.open).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(content?.hidden).toBe(true);
    expect(content?.hasAttribute("role")).toBe(false);
    expect(document.activeElement).toBe(trigger);

    document.body.replaceChildren();
  });

  it("keeps the alert-dialog docs structured like the source Aria UI alert dialog page", () => {
    const doc = readDoc("components/alert-dialog.md");

    expect(doc).toContain("A modal dialog that interrupts the user with important content and expects a response.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Destructive confirmation",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Trigger",
      "### Portal",
      "### Overlay",
      "### Content",
      "### Title",
      "### Description",
      "### Icon",
      "### Cancel",
      "### Action",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source alert-dialog example as a live custom element preview", () => {
    const doc = readDoc("components/alert-dialog.md");
    const previews = alertDialogExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "destructive",
      "framer-motion",
    ]);

    for (const preview of previews) {
      const markup = preview.markup ?? "";
      expect(markup).toContain('class="ariaui-web-alert-dialog-example');
      expect(markup).toContain("<aria-alert-dialog-trigger");
      expect(markup).toContain("<aria-alert-dialog-portal");
      expect(markup).toContain("<aria-alert-dialog-overlay");
      expect(markup).toContain("<aria-alert-dialog-content");
      expect(markup).toContain("<aria-alert-dialog-title");
      expect(markup).toContain("<aria-alert-dialog-description");
      expect(markup).toContain("<aria-alert-dialog-cancel");
      expect(markup).toContain("<aria-alert-dialog-action");
      expect(markup).toContain("Delete account");
      expect(markup).toContain("Are you absolutely sure?");
      expect(markup).toContain("This action cannot be undone. This will permanently delete your account and remove your data from our servers.");
      expect(markup).toContain("Cancel");

      const template = document.createElement("template");
      template.innerHTML = markup;
      const root = template.content.querySelector("aria-alert-dialog");
      const portal = root?.querySelector("aria-alert-dialog-portal");
      const content = root?.querySelector("aria-alert-dialog-content");
      const stack = content?.firstElementChild;
      const copy = stack?.children[0] ?? null;
      const actions = stack?.children[1] ?? null;

      expect(root?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-trigger");
      expect(root?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-portal");
      expect(portal?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-overlay");
      expect(portal?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-content");
      expect(stack?.classList.contains("ariaui-web-alert-dialog-stack")).toBe(true);
      expect(copy?.classList.contains("ariaui-web-alert-dialog-copy")).toBe(true);
      expect(copy?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-title");
      expect(copy?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-description");
      expect(actions?.classList.contains("ariaui-web-alert-dialog-actions")).toBe(true);
      expect(actions?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-cancel");
      expect(actions?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-action");
    }

    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain("ariaui-web-alert-dialog-motion-example");
  });

  it("keeps the generated alert-dialog live examples behaviorally interactive", async () => {
    defineAlertDialogElements();
    const previews = alertDialogExamplePreviews(readDoc("components/alert-dialog.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-alert-dialog")) as RuntimeAlertDialogElement[];
    const root = roots[0] ?? null;
    const trigger = root?.querySelector("aria-alert-dialog-trigger") as RuntimeAlertDialogElement | null;
    const portal = root?.querySelector("aria-alert-dialog-portal") as RuntimeAlertDialogElement | null;
    const overlay = root?.querySelector("aria-alert-dialog-overlay") as RuntimeAlertDialogElement | null;
    const content = root?.querySelector("aria-alert-dialog-content") as RuntimeAlertDialogElement | null;
    const title = root?.querySelector("aria-alert-dialog-title") as RuntimeAlertDialogElement | null;
    const description = root?.querySelector("aria-alert-dialog-description") as RuntimeAlertDialogElement | null;
    const cancel = root?.querySelector("aria-alert-dialog-cancel") as RuntimeAlertDialogElement | null;

    expect(roots).toHaveLength(2);
    expect(root?.open).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(portal?.hidden).toBe(true);
    expect(overlay?.hidden).toBe(true);
    expect(content?.hidden).toBe(true);

    trigger?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(root?.open).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(portal?.hidden).toBe(false);
    expect(overlay?.hidden).toBe(false);
    expect(content?.hidden).toBe(false);
    expect(content?.getAttribute("role")).toBe("alertdialog");
    expect(content?.getAttribute("aria-modal")).toBe("true");
    expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
    expect(document.activeElement).toBe(cancel);

    cancel?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(root?.open).toBe(false);
    expect(content?.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);

    document.body.replaceChildren();
  });

  it("keeps the accordion docs structured like the source Aria UI accordion page", () => {
    const doc = readDoc("components/accordion.md");

    expect(doc).toContain("A vertically stacked set of interactive headings that each reveal an associated section of content.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Single",
      "### Multiple",
      "### Horizontal",
      "### Fold Effect",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Item",
      "### Header",
      "### Trigger",
      "### Content",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders an interactive accordion web component example", () => {
    const doc = readDoc("components/accordion.md");

    expect(doc).not.toContain("ariaui-web-accordion");
    expect(doc).toContain("w-full max-w-md rounded-lg border border-border bg-background shadow-sm");
    expect(doc).toContain("group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50");
    expect(doc).toContain("h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon");
    expect(doc).toContain("M5.22 8.22a.75.75");
    expect(doc).toContain('type="single"');
    expect(doc).toContain('collapsible="true"');
    expect(doc).toContain('default-value="accessible"');
    expect(doc).toContain('value="accessible"');
    expect(doc).toContain('value="styled"');
    expect(doc).toContain('value="animated"');
    expect(doc).toContain('aria-controls="accordion-accessible-panel"');
    expect(doc).toContain("Is it accessible?");
    expect(doc).toContain("Yes. It adheres to the WAI-ARIA design pattern.");
    expect(doc).toContain("Is it styled?");
    expect(doc).toContain("Yes. It comes with default styles that match the other components' aesthetic.");
    expect(doc).toContain("Is it animated?");
    expect(doc).toContain("Yes. It's animated by default, but you can disable it if you prefer.");
    expect(doc).not.toContain("Shipping");
    expect(doc).not.toContain("Returns");
    expect(doc).toContain('<aria-accordion-trigger');
    expect(doc).toContain('<aria-accordion-content');
    expect(doc).toContain('hidden');
  });

  it("renders every source accordion example as a live custom element preview", () => {
    const doc = readDoc("components/accordion.md");
    const previews = accordionExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "single",
      "multiple",
      "horizontal",
      "fold",
      "framer-motion",
    ]);
    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.markup).not.toContain("ariaui-web-accordion");
      expect(preview.markup).toContain("<aria-accordion-item");
      expect(preview.markup).toContain("<aria-accordion-trigger");
      expect(preview.markup).toContain("<aria-accordion-content");
    }

    for (const variant of ["single", "multiple", "framer-motion"]) {
      const markup = previews.find((preview) => preview.variant === variant)?.markup ?? "";
      expect(markup).toContain("w-full max-w-md rounded-lg border border-border bg-background shadow-sm");
      expect(markup).toContain("border-b border-border last:border-b-0 data-[state=open]:bg-muted/20");
      expect(markup).toContain("group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50");
      expect(markup).toContain("group-aria-[expanded=true]:rotate-180");
    }

    expect(previews.find((preview) => preview.variant === "multiple")?.markup).toContain('type="multiple"');
    expect(previews.find((preview) => preview.variant === "multiple")?.markup).toContain("Pass defaultValue as an array");
    expect(previews.find((preview) => preview.variant === "horizontal")?.markup).toContain('orientation="horizontal"');
    expect(previews.find((preview) => preview.variant === "horizontal")?.markup).toContain("flex h-56 flex-row overflow-hidden rounded-lg border border-border bg-background shadow-sm");
    expect(previews.find((preview) => preview.variant === "horizontal")?.markup).toContain("writing-vertical-rl group-data-[state=open]:text-foreground");
    expect(previews.find((preview) => preview.variant === "fold")?.markup).toContain('force-mount');
    expect(previews.find((preview) => preview.variant === "fold")?.markup).toContain("flex h-56 w-full flex-row gap-0 overflow-hidden rounded-lg border border-border bg-muted p-0 shadow-sm sm:gap-1 sm:p-1");
    expect(previews.find((preview) => preview.variant === "fold")?.markup).toContain("sm:w-xs");
    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain('force-mount');
  });

  it("installs dropdown menu live example scroll locking and overflow-aware positioning", () => {
    const theme = readDoc(".vitepress/theme/index.ts");
    const style = readDoc(".vitepress/theme/style.css");
    const helper = readDoc(".vitepress/theme/dropdown-menu-examples.ts");

    expect(theme).toContain('import { installDropdownMenuExamples } from "./dropdown-menu-examples";');
    expect(theme).toContain("installDropdownMenuExamples();");
    expect(style).toContain('.ariaui-web-preview[data-component="dropdown-menu"] .ariaui-web-dropdown-menu-content[data-side]');
    expect(style).toContain("max-height: min(24rem, calc(100vh - 1rem));");
    expect(style).toContain("overscroll-behavior: contain;");
    expect(helper).toContain("syncDropdownMenuExampleScrollLock");
    expect(helper).toContain("computeDropdownMenuExamplePosition");
  });

  it("flips dropdown menu example panels before they overflow the viewport", () => {
    const rootPosition = computeDropdownMenuExamplePosition(
      { top: 560, right: 196, bottom: 596, left: 100, width: 96, height: 36 },
      { width: 220, height: 180 },
      { width: 800, height: 640 },
    );
    const subPosition = computeDropdownMenuExamplePosition(
      { top: 120, right: 790, bottom: 152, left: 760, width: 30, height: 32 },
      { width: 180, height: 96 },
      { width: 800, height: 640 },
      "right",
    );

    expect(rootPosition).toEqual({
      top: 375,
      left: 100,
      side: "top",
      align: "start",
    });
    expect(subPosition).toEqual({
      top: 120,
      left: 575,
      side: "left",
      align: "start",
    });
  });

  it("freezes and restores document scrolling while a dropdown menu docs example is open", () => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "scroll";
    document.body.innerHTML = '<div class="ariaui-web-preview" data-component="dropdown-menu"><aria-dropdown-menu open></aria-dropdown-menu></div>';

    syncDropdownMenuExampleScrollLock(document);

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.dataset.ariauiWebDropdownMenuScrollLocked).toBe("true");

    document.querySelector("aria-dropdown-menu")?.removeAttribute("open");
    syncDropdownMenuExampleScrollLock(document);

    expect(document.documentElement.style.overflow).toBe("auto");
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.documentElement.dataset.ariauiWebDropdownMenuScrollLocked).toBeUndefined();

    document.body.replaceChildren();
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
  });

  it("keeps hidden preview content visually hidden", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain(".ariaui-web-preview [hidden]");
    expect(style).toContain("display: none !important;");
    expect(style).not.toContain("ariaui-web-accordion");
  });

  it("keeps the generated accordion live example behaviorally interactive", () => {
    defineAccordionElements();
    const previews = accordionExamplePreviews(readDoc("components/accordion.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-accordion")) as RuntimeAccordionElement[];
    const root = roots[0] ?? null;
    const triggers = Array.from(root?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    const contents = Array.from(root?.querySelectorAll("aria-accordion-content") ?? []) as RuntimeAccordionElement[];

    expect(roots).toHaveLength(5);
    expect(root).not.toBeNull();
    expect(root?.value).toBe("accessible");
    expect(triggers).toHaveLength(3);
    expect(contents).toHaveLength(3);
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");
    expect(triggers[2]?.getAttribute("aria-expanded")).toBe("false");
    expect(contents[0]?.hidden).toBe(false);
    expect(contents[1]?.hidden).toBe(true);
    expect(contents[2]?.hidden).toBe(true);

    triggers[1]?.click();
    expect(root?.value).toBe("styled");
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[2]?.getAttribute("aria-expanded")).toBe("false");
    expect(contents[0]?.hidden).toBe(true);
    expect(contents[1]?.hidden).toBe(false);
    expect(contents[2]?.hidden).toBe(true);

    triggers[1]?.click();
    expect(root?.value).toBe("");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");
    expect(contents[1]?.hidden).toBe(true);

    const multiple = roots[1];
    const multipleTriggers = Array.from(multiple?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    expect(multiple?.value).toBe("multiple-open,accessible");
    expect(multipleTriggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual(["true", "true", "false"]);
    multipleTriggers[2]?.click();
    expect(multiple?.value).toBe("multiple-open,accessible,animated");

    const horizontal = roots[2];
    const horizontalTriggers = Array.from(horizontal?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    expect(horizontal?.getAttribute("orientation")).toBe("horizontal");
    expect(horizontal?.value).toBe("overview");
    horizontalTriggers[1]?.click();
    expect(horizontal?.value).toBe("analytics");

    const fold = roots[3];
    const foldContents = Array.from(fold?.querySelectorAll("aria-accordion-content") ?? []) as RuntimeAccordionElement[];
    expect(fold?.getAttribute("orientation")).toBe("horizontal");
    expect(foldContents.every((content) => content.hasAttribute("force-mount"))).toBe(true);

    const motion = roots[4];
    const motionContents = Array.from(motion?.querySelectorAll("aria-accordion-content") ?? []) as RuntimeAccordionElement[];
    expect(motion?.value).toBe("accessible");
    expect(motionContents.every((content) => content.hasAttribute("force-mount"))).toBe(true);

    document.body.replaceChildren();
  });
});
