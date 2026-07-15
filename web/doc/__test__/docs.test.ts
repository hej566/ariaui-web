import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineAccordionElements } from "@ariaui-web/accordion";
import { defineAlertElements } from "@ariaui-web/alert";
import { defineAspectRatioElements } from "@ariaui-web/aspect-ratio";
import { defineAvatarElements } from "@ariaui-web/avatar";
import { defineBadgeElements } from "@ariaui-web/badge";
import { defineButtonElements } from "@ariaui-web/button";
import { defineBreadcrumbElements } from "@ariaui-web/breadcrumb";
import { defineCalendarElements } from "@ariaui-web/calendar";
import { defineCardElements } from "@ariaui-web/card";
import { defineCarouselElements } from "@ariaui-web/carousel";
import { defineCheckboxElements } from "@ariaui-web/checkbox";
import { defineComboboxElements } from "@ariaui-web/combobox";
import { defineDialogElements } from "@ariaui-web/dialog";
import { defineDropdownMenuElements } from "@ariaui-web/dropdown-menu";
import { defineGridElements } from "@ariaui-web/grid";
import { defineAlertDialogElements } from "@ariaui-web/alert-dialog";
import { defineInputElements } from "@ariaui-web/input";
import { defineInputOtpElements } from "@ariaui-web/input-otp";
import { defineKbdElements } from "@ariaui-web/kbd";
import { defineLabelElements } from "@ariaui-web/label";
import { definePortalElements } from "@ariaui-web/portal";
import { defineSelectElements } from "@ariaui-web/select";
import { installCalendarExamples, syncCalendarExamples } from "../docs/.vitepress/theme/calendar-examples";
import { computeComboboxExamplePosition, installComboboxExamples, syncComboboxExamples } from "../docs/.vitepress/theme/combobox-examples";
import { computeDropdownMenuExamplePosition, syncDropdownMenuExampleScrollLock } from "../docs/.vitepress/theme/dropdown-menu-examples";
import { computeSelectExamplePosition, installSelectExamples, syncSelectExampleScrollLock, syncSelectExamples } from "../docs/.vitepress/theme/select-examples";
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
        "name": "Header",
        "tagName": "aria-calendar-header"
      },
      {
        "name": "HeaderPrevious",
        "tagName": "aria-calendar-header-previous"
      },
      {
        "name": "HeaderMonth",
        "tagName": "aria-calendar-header-month"
      },
      {
        "name": "HeaderYear",
        "tagName": "aria-calendar-header-year"
      },
      {
        "name": "HeaderNext",
        "tagName": "aria-calendar-header-next"
      },
      {
        "name": "Body",
        "tagName": "aria-calendar-body"
      },
      {
        "name": "Head",
        "tagName": "aria-calendar-head"
      },
      {
        "name": "Row",
        "tagName": "aria-calendar-row"
      },
      {
        "name": "DayHeader",
        "tagName": "aria-calendar-day-header"
      },
      {
        "name": "Rows",
        "tagName": "aria-calendar-rows"
      },
      {
        "name": "Cell",
        "tagName": "aria-calendar-cell"
      },
      {
        "name": "MonthSelect",
        "tagName": "aria-calendar-month-select"
      },
      {
        "name": "YearSelect",
        "tagName": "aria-calendar-year-select"
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

type RuntimeButtonElement = HTMLElement & {
  disabled: boolean;
  pressed: boolean;
};

type RuntimeCalendarElement = HTMLElement & {
  mode: string;
  value: string;
  visibleMonth: string;
};

type RuntimeCardElement = HTMLElement & {
  disabled: boolean;
  open: boolean;
  pressed: boolean;
  selected: boolean;
  value: string;
};

type RuntimeCarouselElement = HTMLElement & {
  disabled: boolean;
};

type RuntimeCheckboxElement = HTMLElement & {
  checked: boolean;
  disabled: boolean;
  value: string;
};

type RuntimeComboboxElement = HTMLElement & {
  disabled: boolean;
  open: boolean;
  value: string;
};

type RuntimeDropdownMenuElement = HTMLElement & {
  open: boolean;
  value: string;
};

type RuntimeGridElement = HTMLElement & {
  value: string;
};

type RuntimeInputElement = HTMLElement & {
  disabled: boolean;
  value: string;
};

type RuntimeInputOtpElement = HTMLElement & {
  disabled: boolean;
  value: string;
};

type RuntimeKbdElement = HTMLElement & {
  disabled: boolean;
  value: string;
};

type RuntimeLabelElement = HTMLElement & {
  disabled: boolean;
  htmlFor: string;
};

type RuntimePortalElement = HTMLElement & {
  disabled: boolean;
  open: boolean;
  pressed: boolean;
  selected: boolean;
  value: string;
};

type RuntimeSelectElement = HTMLElement & {
  disabled: boolean;
  open: boolean;
  value: string;
};

function accordionPreviewMarkup(doc: string) {
  const match = doc.match(/<aria-accordion\b[\s\S]*?<\/aria-accordion>/);

  if (!match) {
    throw new Error("Missing accordion preview markup.");
  }

  return match[0];
}

function accordionExamplePreviews(doc: string) {
  const previews: Array<{ className: string; variant: string; shell: string; markup: string }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="accordion" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const fenceStart = doc.indexOf("\n\n```html", start);
    const shell = doc.slice(start, fenceStart === -1 ? undefined : fenceStart).trim();
    const accordionMatch = shell.match(/<aria-accordion\b[\s\S]*<\/aria-accordion>/);

    if (!accordionMatch) {
      throw new Error("Missing accordion preview markup for " + match[2]);
    }

    previews.push({
      className: match[1] ?? "",
      variant: match[2] ?? "",
      shell,
      markup: accordionMatch[0],
    });
  }

  return previews;
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

function breadcrumbExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="breadcrumb" data-example-variant="([^"]+)">\n\s*(<aria-breadcrumb[\s\S]*?<\/aria-breadcrumb>)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function gridExamplePreviews(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="grid" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);

    previews.push({
      className: match[1],
      variant: match[2],
      markup: doc.slice(start, end === -1 ? undefined : end).trim(),
    });
  }

  return previews;
}

function calendarExamplePreviews(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="calendar" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);

    previews.push({
      className: match[1],
      variant: match[2],
      markup: doc.slice(start, end === -1 ? undefined : end).trim(),
    });
  }

  return previews;
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

function buttonExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="button" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function cardExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="card" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function carouselExamplePreviews(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="carousel" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);

    previews.push({
      className: match[1],
      variant: match[2],
      markup: doc.slice(start, end === -1 ? undefined : end).trim(),
    });
  }

  return previews;
}

function checkboxExamplePreviews(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="checkbox" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);

    previews.push({
      className: match[1],
      variant: match[2],
      markup: doc.slice(start, end === -1 ? undefined : end).trim(),
    });
  }

  return previews;
}

function inputExampleVariants(doc: string) {
  return Array.from(doc.matchAll(/data-component="input" data-example-variant="([^"]+)"/g)).map((match) => match[1]);
}

function inputOtpExampleVariants(doc: string) {
  return Array.from(doc.matchAll(/data-component="input-otp" data-example-variant="([^"]+)"/g)).map((match) => match[1]);
}

function kbdExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="kbd" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function labelExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="label" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function portalExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="portal" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function positionExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="position" data-example-variant="([^"]+)">\n\s*([\s\S]*?)\n<\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function selectExamplePreviews(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="select" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);

    previews.push({
      className: match[1],
      variant: match[2],
      markup: doc.slice(start, end === -1 ? undefined : end).trim(),
    });
  }

  return previews;
}

function normalizeExampleMarkup(value: string) {
  const lines = value.replace(/\r\n/g, "\n").replace(/^\n+|\n+$/g, "").split("\n");
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)?.[0].length ?? 0);
  const commonIndent = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(commonIndent)).join("\n").trim();
}

function comboboxExampleEntries(doc: string) {
  const previews: Array<{ className: string | undefined; variant: string | undefined; markup: string; snippet: string | undefined }> = [];

  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="combobox" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const closingIndex = doc.indexOf("\n</div>", start);
    const snippetStart = closingIndex === -1 ? -1 : closingIndex + "\n</div>".length;
    const snippet = snippetStart === -1
      ? undefined
      : doc.slice(snippetStart).match(/^\n\n```html\n([\s\S]*?)\n```/)?.[1]?.trim();

    previews.push({
      className: match[1],
      variant: match[2],
      markup: normalizeExampleMarkup(doc.slice(start, closingIndex === -1 ? undefined : closingIndex)),
      snippet,
    });
  }

  return previews;
}

function comboboxExamplePreviews(doc: string) {
  return comboboxExampleEntries(doc).map(({ className, variant, markup }) => ({ className, variant, markup }));
}

function flushSelectExampleFrame() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

function selectScrollAreaTestRect(top: number, height: number, width = 200) {
  return {
    x: 0,
    y: top,
    top,
    right: width,
    bottom: top + height,
    left: 0,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect;
}

function installSelectScrollAreaTestLayout(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>(".ariaui-web-select-scroll-viewport");
  const options = Array.from(root.querySelectorAll<HTMLElement>(".ariaui-web-select-scroll-option"));
  let scrollTop = 0;

  if (!viewport) {
    throw new Error("Missing select scroll-area viewport.");
  }

  Object.defineProperty(viewport, "clientHeight", {
    configurable: true,
    get: () => 96,
  });
  Object.defineProperty(viewport, "scrollHeight", {
    configurable: true,
    get: () => options.length * 32,
  });
  Object.defineProperty(viewport, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value) => {
      scrollTop = Number(value);
    },
  });
  Object.defineProperty(viewport, "scrollTo", {
    configurable: true,
    value: (optionsOrX?: ScrollToOptions | number, y?: number) => {
      scrollTop = typeof optionsOrX === "number"
        ? Number(y ?? 0)
        : Number(optionsOrX?.top ?? 0);
    },
  });
  viewport.getBoundingClientRect = () => selectScrollAreaTestRect(0, 96);

  options.forEach((option, index) => {
    Object.defineProperty(option, "offsetHeight", {
      configurable: true,
      get: () => 32,
    });
    Object.defineProperty(option, "offsetTop", {
      configurable: true,
      get: () => index * 32,
    });
    option.getBoundingClientRect = () => selectScrollAreaTestRect(index * 32 - scrollTop, 32);
  });

  return {
    options,
    viewport,
  };
}

function installScrollableSelectContentTestLayout(select: HTMLElement) {
  const content = select.querySelector<HTMLElement>("aria-select-content");
  const options = Array.from(select.querySelectorAll<HTMLElement>("aria-select-option"));
  let scrollTop = 0;

  if (!content) {
    throw new Error("Missing select content.");
  }

  Object.defineProperty(content, "clientHeight", {
    configurable: true,
    get: () => 96,
  });
  Object.defineProperty(content, "scrollHeight", {
    configurable: true,
    get: () => options.length * 32,
  });
  Object.defineProperty(content, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value) => {
      scrollTop = Number(value);
    },
  });
  Object.defineProperty(content, "scrollTo", {
    configurable: true,
    value: (optionsOrX?: ScrollToOptions | number, y?: number) => {
      scrollTop = typeof optionsOrX === "number"
        ? Number(y ?? 0)
        : Number(optionsOrX?.top ?? 0);
    },
  });

  options.forEach((option, index) => {
    Object.defineProperty(option, "offsetHeight", {
      configurable: true,
      get: () => 32,
    });
    Object.defineProperty(option, "offsetTop", {
      configurable: true,
      get: () => index * 32,
    });
  });

  return {
    content,
    options,
  };
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
      if (native.slug === "position") {
        expect(doc).not.toContain("definePositionElements");
      } else {
        expect(doc).toContain(`import { ${native.defineFunctionName} } from "${native.packageName}";`);
        expect(doc).toContain(`${native.defineFunctionName}();`);
      }
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
        if (native.slug === "position") {
          expect(doc).toContain('data-example-variant="default"');
        } else {
          expect(doc).toContain('data-example-part="Utility"');
        }
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

  it("keeps the button docs structured like the source Aria UI button page", () => {
    const doc = readDoc("components/button.md");

    expect(doc).toContain("A button is an action-triggering control.");
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
      "### Primary",
      "### Secondary",
      "### Destructive",
      "### Outline",
      "### Ghost",
      "### Link",
      "### With icon",
      "### Loading",
      "### Sizes",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Group",
      "### Item",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source button example as a live custom element preview", () => {
    const previews = buttonExamplePreviews(readDoc("components/button.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "primary",
      "secondary",
      "destructive",
      "outline",
      "ghost",
      "link",
      "with-icon",
      "loading",
      "sizes",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("flex");
      expect(preview.className).toContain("flex-wrap");
      expect(preview.className).toContain("gap-4");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
      expect(preview.markup).toContain("<aria-button");
    }

    for (const variant of ["primary", "secondary", "destructive", "outline", "ghost", "link", "with-icon", "loading", "sizes"]) {
      expect(previews.find((preview) => preview.variant === variant)?.markup).toContain("inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium");
    }

    expect(previews.find((preview) => preview.variant === "primary")?.markup).toContain("Button");
    expect(previews.find((preview) => preview.variant === "primary")?.markup).toContain("bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover");
    expect(previews.find((preview) => preview.variant === "secondary")?.markup).toContain("Secondary");
    expect(previews.find((preview) => preview.variant === "secondary")?.markup).toContain("border border-border bg-secondary");
    expect(previews.find((preview) => preview.variant === "destructive")?.markup).toContain("Destructive");
    expect(previews.find((preview) => preview.variant === "outline")?.markup).toContain("Outline");
    expect(previews.find((preview) => preview.variant === "ghost")?.markup).toContain("Ghost");
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain('as="a"');
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain('href="#"');
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("Send");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("Learn more");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("M6 12 3.269");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("M17.25 8.25 21 12");
    expect(previews.find((preview) => preview.variant === "loading")?.markup).toContain("Please wait");
    expect(previews.find((preview) => preview.variant === "loading")?.markup).toContain("disabled");
    expect(previews.find((preview) => preview.variant === "loading")?.markup).toContain("M16.023 9.348");
    expect(previews.find((preview) => preview.variant === "sizes")?.markup).toContain("Small");
    expect(previews.find((preview) => preview.variant === "sizes")?.markup).toContain("Default");
    expect(previews.find((preview) => preview.variant === "sizes")?.markup).toContain("Large");
  });

  it("keeps the generated button live examples behaviorally rendered", () => {
    defineButtonElements();
    const previews = buttonExamplePreviews(readDoc("components/button.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-button")) as RuntimeButtonElement[];
    const primary = roots[0] ?? null;
    const link = document.querySelector('aria-button[as="a"]') as RuntimeButtonElement | null;
    const loading = document.querySelector("aria-button[disabled]") as RuntimeButtonElement | null;
    const iconSvgs = Array.from(document.querySelectorAll('aria-button svg[aria-hidden="true"]'));

    expect(roots).toHaveLength(12);
    expect(primary?.textContent?.trim()).toBe("Button");
    expect(primary?.getAttribute("role")).toBe("button");
    expect(primary?.getAttribute("tabindex")).toBe("0");
    expect(primary?.getAttribute("type")).toBe("button");
    expect(primary?.hasAttribute("data-state")).toBe(false);
    expect(primary?.hasAttribute("aria-expanded")).toBe(false);
    expect(iconSvgs.length).toBeGreaterThanOrEqual(3);

    let clickCount = 0;
    primary?.addEventListener("click", () => {
      clickCount += 1;
    });
    primary?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    const spaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    primary?.dispatchEvent(spaceKeyDown);
    primary?.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));

    expect(spaceKeyDown.defaultPrevented).toBe(true);
    expect(clickCount).toBe(2);

    expect(link?.getAttribute("role")).toBe("link");
    expect(link?.getAttribute("href")).toBe("#");
    expect(link?.hasAttribute("type")).toBe(false);

    const linkSpaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    link?.dispatchEvent(linkSpaceKeyDown);
    expect(linkSpaceKeyDown.defaultPrevented).toBe(false);

    let disabledClicks = 0;
    loading?.addEventListener("click", () => {
      disabledClicks += 1;
    });
    loading?.click();

    expect(loading?.getAttribute("aria-disabled")).toBe("true");
    expect(loading?.getAttribute("data-disabled")).toBe("");
    expect(loading?.hasAttribute("tabindex")).toBe(false);
    expect(disabledClicks).toBe(0);

    document.body.replaceChildren();
  });

  it("keeps button live example styles scoped to the button docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="button"]');
    expect(style).toContain(".ariaui-web-button-root");
    expect(style).toContain(".ariaui-web-button-primary");
    expect(style).toContain(".ariaui-web-button-spin");
    expect(style).toContain("@keyframes ariaui-web-button-spin");
    expect(style).toContain("text-decoration: none;");
  });

  it("keeps the card docs structured like the source Aria UI card page", () => {
    const doc = readDoc("components/card.md");

    expect(doc).toContain("A composable content container with Header, Title, Description, Content, and Footer parts.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Account form",
      "### Basic layout",
      "### Login",
      "### Meeting notes",
      "### With image area",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Header",
      "### Title",
      "### Description",
      "### Content",
      "### Footer",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
    expect(doc).not.toMatch(/^## Keyboard$/m);
  });

  it("renders every source card example as a live custom element preview", () => {
    const previews = cardExamplePreviews(readDoc("components/card.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "account-form",
      "basic-layout",
      "login",
      "meeting-notes",
      "with-image-area",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
      expect(preview.markup).toContain("<aria-card");
      expect(preview.markup).toContain("<aria-card-header");
      expect(preview.markup).toContain("<aria-card-title");
      expect(preview.markup).toContain("<aria-card-description");
      expect(preview.markup).toContain("<aria-card-content");
      expect(preview.markup).toContain("<aria-card-footer");
    }

    expect(previews.find((preview) => preview.variant === "account-form")?.markup).toContain("Create an account");
    expect(previews.find((preview) => preview.variant === "account-form")?.markup).toContain("w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(previews.find((preview) => preview.variant === "account-form")?.markup).toContain("Enter your email below to create your account.");
    expect(previews.find((preview) => preview.variant === "account-form")?.markup).toContain('id="card-email"');
    expect(previews.find((preview) => preview.variant === "basic-layout")?.markup).toContain("Title Text");
    expect(previews.find((preview) => preview.variant === "basic-layout")?.markup).toContain("w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(previews.find((preview) => preview.variant === "basic-layout")?.markup).toContain("Slot (swap it with your content)");
    expect(previews.find((preview) => preview.variant === "login")?.markup).toContain("Login to your account");
    expect(previews.find((preview) => preview.variant === "login")?.markup).toContain("w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(previews.find((preview) => preview.variant === "login")?.markup).toContain("Forgot your password?");
    expect(previews.find((preview) => preview.variant === "meeting-notes")?.markup).toContain("Meeting Notes");
    expect(previews.find((preview) => preview.variant === "meeting-notes")?.markup).toContain("w-[420px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(previews.find((preview) => preview.variant === "meeting-notes")?.markup).toContain("Client requested dashboard redesign");
    expect(previews.find((preview) => preview.variant === "with-image-area")?.markup).toContain("Is this an image?");
    expect(previews.find((preview) => preview.variant === "with-image-area")?.markup).toContain("w-[420px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(previews.find((preview) => preview.variant === "with-image-area")?.markup).toContain("$135,000");
    expect(previews.find((preview) => preview.variant === "with-image-area")?.markup).toContain("M3.75 9h16.5");
  });

  it("keeps the generated card live examples behaviorally rendered", () => {
    defineCardElements();
    const previews = cardExamplePreviews(readDoc("components/card.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-card")) as RuntimeCardElement[];
    const titles = Array.from(document.querySelectorAll("aria-card-title")) as RuntimeCardElement[];
    const root = roots[0] ?? null;

    expect(roots).toHaveLength(5);
    expect(titles).toHaveLength(5);
    expect(root?.textContent).toContain("Create an account");
    expect(root?.hasAttribute("role")).toBe(false);
    expect(root?.hasAttribute("data-state")).toBe(false);
    expect(root?.querySelector("aria-card-header")?.hasAttribute("role")).toBe(false);
    expect(root?.querySelector("aria-card-content")?.hasAttribute("role")).toBe(false);
    expect(root?.querySelector("aria-card-footer")?.hasAttribute("role")).toBe(false);

    for (const title of titles) {
      expect(title.getAttribute("role")).toBe("heading");
      expect(title.getAttribute("aria-level")).toBe("3");
    }

    root!.open = true;
    root!.pressed = true;
    root!.selected = true;
    root!.disabled = true;
    root!.value = "alpha";

    expect(root?.hasAttribute("data-state")).toBe(false);
    expect(root?.hasAttribute("aria-expanded")).toBe(false);
    expect(root?.hasAttribute("aria-pressed")).toBe(false);
    expect(root?.hasAttribute("aria-selected")).toBe(false);
    expect(root?.hasAttribute("aria-disabled")).toBe(false);
    expect(root?.hasAttribute("data-disabled")).toBe(false);
    expect(root?.hasAttribute("data-value")).toBe(false);

    document.body.replaceChildren();
  });

  it("keeps card live example styles scoped to the card docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="card"]');
    expect(style).toContain(".ariaui-web-card-root");
    expect(style).toContain(".ariaui-web-card-dashed-slot");
    expect(style).toContain(".ariaui-web-card-avatar-ring");
    expect(style).toContain(".ariaui-web-card-image-area");
    expect(style).toContain(".ariaui-web-card-input:focus,");
    expect(style).toContain(".ariaui-web-card-input:focus-visible");
    expect(style).toContain("box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);");
    expect(style).toContain("width: 21.875rem;");
  });

  it("keeps the carousel docs structured like the source Aria UI carousel page", () => {
    const doc = readDoc("components/carousel.md");

    expect(doc).toContain("A carousel is a set of items, often images, that users can navigate through.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard interactions",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Default",
      "### Multiple slides",
      "### Infinite loop multiple slides",
      "### Vertical",
      "### Infinite loop vertical",
      "### Infinite loop",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Viewport",
      "### Container",
      "### Slide",
      "### PreviousButton",
      "### NextButton",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source carousel example as a live custom element preview", () => {
    const previews = carouselExamplePreviews(readDoc("components/carousel.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "default",
      "multiple-slides",
      "infinite-loop-multiple-slides",
      "vertical",
      "infinite-loop-vertical",
      "infinite-loop",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("px-4");
      expect(preview.className).toContain("py-6");
      expect(preview.markup).toContain("<aria-carousel");
      expect(preview.markup).toContain("<aria-carousel-previous-button");
      expect(preview.markup).toContain("<aria-carousel-viewport");
      expect(preview.markup).toContain("<aria-carousel-container");
      expect(preview.markup).toContain("<aria-carousel-slide");
      expect(preview.markup).toContain("<aria-carousel-next-button");
      expect(preview.markup).toContain("ariaui-web-carousel-icon-button");
      expect(preview.markup).toContain("ariaui-web-carousel-slide-surface");
    }

    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain('aria-label="Featured items"');
    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain("max-w-[414px]");
    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain("M5 12h14");
    expect(previews.find((preview) => preview.variant === "multiple-slides")?.markup).toContain('slides-per-view="3"');
    expect(previews.find((preview) => preview.variant === "multiple-slides")?.markup).toContain("basis-[calc((100%_-_2rem)/3)]");
    expect(previews.find((preview) => preview.variant === "infinite-loop-multiple-slides")?.markup).toContain("loop");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain('orientation="vertical"');
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain("M12 5v14");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain('slides-per-view="2"');
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain("flex w-full max-w-[320px] flex-col items-center gap-4");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain("flex h-full flex-col gap-1");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain("h-[142px] shrink-0 grow-0 basis-[142px] p-1");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).toContain("text-3xl font-semibold leading-9");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).not.toContain("basis-full ariaui-web-carousel-slide");
    expect(previews.find((preview) => preview.variant === "vertical")?.markup).not.toContain("text-4xl font-semibold leading-10");
    expect(previews.find((preview) => preview.variant === "infinite-loop-vertical")?.markup).toContain('orientation="vertical"');
    expect(previews.find((preview) => preview.variant === "infinite-loop-vertical")?.markup).toContain('slides-per-view="2"');
    expect(previews.find((preview) => preview.variant === "infinite-loop-vertical")?.markup).toContain("h-[142px] shrink-0 grow-0 basis-[142px] p-1");
    expect(previews.find((preview) => preview.variant === "infinite-loop-vertical")?.markup).toContain("text-3xl font-semibold leading-9");
    expect(previews.find((preview) => preview.variant === "infinite-loop")?.markup).toContain('aria-label="Featured loop items"');
  });

  it("keeps generated carousel live examples behaviorally rendered", () => {
    defineCarouselElements();
    const previews = carouselExamplePreviews(readDoc("components/carousel.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-carousel")) as RuntimeCarouselElement[];
    const defaultRoot = roots[0] ?? null;
    const defaultSlides = Array.from(defaultRoot?.querySelectorAll("aria-carousel-slide:not([data-clone='true'])") ?? []);
    const defaultPrevious = defaultRoot?.querySelector("aria-carousel-previous-button") as RuntimeCarouselElement | null;
    const defaultNext = defaultRoot?.querySelector("aria-carousel-next-button") as RuntimeCarouselElement | null;
    const defaultViewport = defaultRoot?.querySelector("aria-carousel-viewport");
    const verticalRoot = roots.find((root) => root.getAttribute("data-example-part") === "Root" && root.getAttribute("orientation") === "vertical" && !root.hasAttribute("loop"));
    const verticalSlides = Array.from(verticalRoot?.querySelectorAll("aria-carousel-slide:not([data-clone='true'])") ?? []);
    const loopRoot = roots.find((root) => root.hasAttribute("loop"));

    expect(roots).toHaveLength(6);
    expect(defaultRoot?.getAttribute("role")).toBe("region");
    expect(defaultRoot?.getAttribute("aria-roledescription")).toBe("carousel");
    expect(defaultRoot?.getAttribute("data-axis")).toBe("x");
    expect(defaultRoot?.getAttribute("data-orientation")).toBe("horizontal");
    expect(defaultViewport?.getAttribute("aria-live")).toBe("polite");
    expect(defaultViewport?.getAttribute("aria-atomic")).toBe("false");
    expect(defaultSlides).toHaveLength(5);
    expect(defaultSlides[0]?.getAttribute("role")).toBe("group");
    expect(defaultSlides[0]?.getAttribute("aria-label")).toBe("1 of 5");
    expect(defaultSlides[0]?.getAttribute("data-active")).toBe("true");
    expect(defaultPrevious?.getAttribute("aria-disabled")).toBe("true");
    expect(defaultNext?.hasAttribute("aria-disabled")).toBe(false);

    defaultNext?.click();
    expect(defaultSlides[1]?.getAttribute("data-active")).toBe("true");

    expect(verticalRoot?.getAttribute("data-orientation")).toBe("vertical");
    expect(verticalRoot?.getAttribute("data-axis")).toBe("y");
    expect(verticalRoot?.getAttribute("slides-per-view")).toBe("2");
    expect(verticalRoot?.querySelector("aria-carousel-container")?.getAttribute("data-orientation")).toBe("vertical");
    expect(verticalSlides).toHaveLength(5);
    expect(verticalSlides[0]?.className).toContain("basis-[142px]");
    expect(verticalSlides[0]?.className).toContain("p-1");

    expect(loopRoot?.querySelectorAll("aria-carousel-slide[data-clone='true']").length).toBeGreaterThan(0);

    document.body.replaceChildren();
  });

  it("keeps carousel live example styles scoped to the carousel docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="carousel"]');
    expect(style).toContain(".ariaui-web-carousel-root");
    expect(style).toContain(".ariaui-web-carousel-icon-button");
    expect(style).toContain(".ariaui-web-carousel-viewport");
    expect(style).toContain(".ariaui-web-carousel-container");
    expect(style).toContain(".ariaui-web-carousel-slide-surface");
    expect(style).toContain("max-width: 25.875rem;");
    expect(style).toContain(".ariaui-web-carousel-viewport.flex-1");
    expect(style).toContain("flex: 1 1 0%;");
    expect(style).toContain(".ariaui-web-carousel-slide-surface {\n  box-sizing: border-box;");
    expect(style).toContain("basis: calc((100% - 2rem) / 3);");
    expect(style).toContain(".ariaui-web-carousel-container.gap-1");
    expect(style).toContain("height: 8.875rem;");
    expect(style).toContain("flex-basis: 8.875rem;");
    expect(style).toContain("padding: 0.25rem;");
  });

  it("keeps the checkbox docs structured like the source Aria UI checkbox page", () => {
    const doc = readDoc("components/checkbox.md");

    expect(doc).toContain("A control that can be checked, unchecked, or indeterminate.");
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
      "### Basic",
      "### With description",
      "### Disabled",
      "### Group",
      "### Box group",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source checkbox example as a live custom element preview", () => {
    const previews = checkboxExamplePreviews(readDoc("components/checkbox.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "basic",
      "description",
      "disabled",
      "group",
      "box-group",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
      expect(preview.markup).toContain("ariaui-web-checkbox-indicator");
      expect(preview.markup).toContain("ariaui-web-checkbox-check-icon");
    }

    expect(previews.find((preview) => preview.variant === "basic")?.markup).toContain("<aria-checkbox");
    expect(previews.find((preview) => preview.variant === "basic")?.markup).toContain("Accept terms and conditions");
    expect(previews.find((preview) => preview.variant === "description")?.markup).toContain("By clicking this checkbox");
    expect(previews.find((preview) => preview.variant === "disabled")?.markup).toContain("default-checked disabled");
    expect(previews.find((preview) => preview.variant === "group")?.markup).toContain("<aria-checkbox-group");
    expect(previews.find((preview) => preview.variant === "group")?.markup).toContain('value="tech,product,tips"');
    expect(previews.find((preview) => preview.variant === "group")?.markup).toContain("Events & Webinars");
    expect(previews.find((preview) => preview.variant === "box-group")?.markup).toContain("ariaui-web-checkbox-box-item");
    expect(previews.find((preview) => preview.variant === "box-group")?.markup).toContain('value="tech"');
  });

  it("keeps generated checkbox live examples behaviorally rendered", () => {
    defineCheckboxElements();
    const previews = checkboxExamplePreviews(readDoc("components/checkbox.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const basic = document.querySelector("#checkbox-doc-basic") as RuntimeCheckboxElement | null;
    const basicIndicator = basic?.querySelector("aria-checkbox-indicator") as HTMLElement | null;
    const basicLabel = document.querySelector('label[for="checkbox-doc-basic"]') as HTMLLabelElement | null;
    const disabled = document.querySelector("#checkbox-doc-disabled") as RuntimeCheckboxElement | null;
    const groups = Array.from(document.querySelectorAll("aria-checkbox-group")) as RuntimeCheckboxElement[];
    const listGroup = groups[0] ?? null;
    const listItems = Array.from(listGroup?.querySelectorAll("aria-checkbox-item") ?? []) as RuntimeCheckboxElement[];
    const boxGroup = groups[1] ?? null;
    const boxItems = Array.from(boxGroup?.querySelectorAll("aria-checkbox-item") ?? []) as RuntimeCheckboxElement[];
    const values: string[][] = [];

    listGroup?.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ values: string[] }>).detail.values);
    });

    expect(basic?.getAttribute("role")).toBe("checkbox");
    expect(basic?.getAttribute("aria-checked")).toBe("false");
    expect(basic?.getAttribute("data-state")).toBe("unchecked");
    expect(basicIndicator?.hidden).toBe(true);

    basicLabel?.click();

    expect(basic?.checked).toBe(true);
    expect(basic?.getAttribute("aria-checked")).toBe("true");
    expect(basicIndicator?.hidden).toBe(false);

    expect(disabled?.checked).toBe(true);
    expect(disabled?.getAttribute("aria-disabled")).toBe("true");
    disabled?.click();
    expect(disabled?.checked).toBe(true);

    expect(groups).toHaveLength(2);
    expect(listGroup?.getAttribute("role")).toBe("group");
    expect(listGroup?.value).toBe("tech,product,tips");
    expect(listItems).toHaveLength(4);
    expect(listItems[0]?.getAttribute("aria-checked")).toBe("true");
    expect(listItems[3]?.getAttribute("aria-checked")).toBe("false");

    listItems[3]?.click();

    expect(listGroup?.value).toBe("tech,product,tips,events");
    expect(values).toEqual([["tech", "product", "tips", "events"]]);
    expect(listItems[3]?.getAttribute("aria-checked")).toBe("true");

    expect(boxGroup?.value).toBe("tech");
    expect(boxItems).toHaveLength(2);
    expect(boxItems[0]?.getAttribute("aria-checked")).toBe("true");
    expect(boxItems[1]?.getAttribute("aria-checked")).toBe("false");

    boxItems[1]?.click();

    expect(boxGroup?.value).toBe("tech,product");
    expect(boxItems[1]?.getAttribute("aria-checked")).toBe("true");

    document.body.replaceChildren();
  });

  it("keeps checkbox live example styles scoped to the checkbox docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="checkbox"]');
    expect(style).toContain(".ariaui-web-checkbox-root");
    expect(style).toContain(".ariaui-web-checkbox-indicator");
    expect(style).toContain(".ariaui-web-checkbox-box-item");
    expect(style).toContain(".ariaui-web-checkbox-box-tick");
    expect(style).toContain(".ariaui-web-checkbox-root:focus-visible");
    expect(style).toContain('data-component="checkbox"');
  });

  it("keeps the input docs structured like the source Aria UI input page", () => {
    const doc = readDoc("components/input.md");

    expect(doc).toContain("A native text input primitive with controlled and uncontrolled value handling.");
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
      "### Basic controlled",
      "### Password",
      "### With button",
      "### File (native)",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source input example as a live preview", () => {
    const doc = readDoc("components/input.md");

    expect(inputExampleVariants(doc)).toEqual([
      "basic-controlled",
      "password",
      "with-button",
      "file-native",
    ]);
    expect(doc).toContain("<aria-input");
    expect(doc).toContain("placeholder=\"Email\"");
    expect(doc).toContain("type=\"password\"");
    expect(doc).toContain("value=\"password123\"");
    expect(doc).toContain("placeholder=\"Placeholder\"");
    expect(doc).toContain("<aria-button");
    expect(doc).toContain("Button");
    expect(doc).toContain("<input type=\"file\"");
    expect(doc).toContain("Choose file");
    expect(doc).toContain("No file chosen");
    expect(doc).toContain("flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm");
    expect(doc).toContain("inline-flex h-9 w-fit items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium");
  });

  it("keeps the generated input live examples behaviorally rendered", () => {
    defineInputElements();
    defineButtonElements();
    document.body.innerHTML = `
      <aria-input placeholder="Email" class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm" data-example-part="Root"></aria-input>
      <aria-input type="password" value="password123" class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm" data-example-part="Root"></aria-input>
      <div>
        <aria-input placeholder="Placeholder" class="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm" data-example-part="Root"></aria-input>
        <aria-button type="button">Button</aria-button>
      </div>
    `;

    const roots = Array.from(document.querySelectorAll("aria-input")) as RuntimeInputElement[];
    const nativeInputs = roots.map((root) => root.querySelector("input[data-ariaui-web-input='true']") as HTMLInputElement | null);
    const values: string[] = [];
    roots[0]?.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    expect(roots).toHaveLength(3);
    expect(nativeInputs.every((input) => input instanceof HTMLInputElement)).toBe(true);
    expect(nativeInputs[0]?.type).toBe("text");
    expect(nativeInputs[0]?.placeholder).toBe("Email");
    expect(nativeInputs[1]?.type).toBe("password");
    expect(nativeInputs[1]?.value).toBe("password123");
    expect(roots[0]?.hasAttribute("role")).toBe(false);
    expect(roots[0]?.hasAttribute("data-state")).toBe(false);

    if (nativeInputs[0]) {
      nativeInputs[0].value = "hello";
      nativeInputs[0].dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "hello" }));
    }

    expect(values).toEqual(["hello"]);
    expect(roots[0]?.value).toBe("hello");
    expect(document.querySelector("aria-button")?.getAttribute("role")).toBe("button");

    document.body.replaceChildren();
  });

  it("keeps input live example styles scoped to the input docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="input"]');
    expect(style).toContain(".ariaui-web-input-field");
    expect(style).toContain(".ariaui-web-input-with-button");
    expect(style).toContain(".ariaui-web-input-file-shell");
    expect(style).toContain("border-color: var(--vp-c-divider);");
  });

  it("keeps the input-otp docs structured like the source Aria UI input-otp page", () => {
    const doc = readDoc("components/input-otp.md");

    expect(doc).toContain("A one-time passcode input with split slots, paste support, and SMS autofill.");
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
      "### Verification code",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Group",
      "### Slot",
      "### Separator",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source input-otp example as a live preview", () => {
    const doc = readDoc("components/input-otp.md");

    expect(inputOtpExampleVariants(doc)).toEqual([
      "verification-code",
      "framer-motion",
    ]);
    expect(doc).toContain("<aria-input-otp");
    expect(doc).toContain("<aria-input-otp-group");
    expect(doc).toContain("<aria-input-otp-slot");
    expect(doc).toContain("<aria-input-otp-separator");
    expect(doc).toContain("<aria-input-otp-input-otp");
    expect(doc).toContain("<aria-input-otp-input-otpgroup");
    expect(doc).toContain("max-length=\"6\"");
    expect(doc).toContain("aria-label=\"Verification code\"");
    expect(doc).toContain("flex items-center gap-2");
    expect(doc).toContain("relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2");
    expect(doc).toContain("native-composition");
    expect(doc).toContain("pointer-events-none absolute left-1/2 top-1/2 h-4 w-px");
  });

  it("keeps the generated input-otp live examples behaviorally rendered", () => {
    defineInputOtpElements();
    document.body.innerHTML = `
      <aria-input-otp max-length="6" aria-label="Verification code">
        <aria-input-otp-group>
          <aria-input-otp-slot></aria-input-otp-slot>
          <aria-input-otp-slot></aria-input-otp-slot>
          <aria-input-otp-slot></aria-input-otp-slot>
          <aria-input-otp-separator></aria-input-otp-separator>
          <aria-input-otp-slot></aria-input-otp-slot>
          <aria-input-otp-slot></aria-input-otp-slot>
          <aria-input-otp-slot></aria-input-otp-slot>
        </aria-input-otp-group>
      </aria-input-otp>
    `;

    const root = document.querySelector("aria-input-otp") as RuntimeInputOtpElement | null;
    const input = root?.querySelector("input[data-ariaui-web-input-otp='true']") as HTMLInputElement | null;
    const slots = Array.from(root?.querySelectorAll("aria-input-otp-slot") ?? []) as RuntimeInputOtpElement[];
    const separator = root?.querySelector("aria-input-otp-separator");
    const values: string[] = [];
    const completed: string[] = [];
    root?.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ value: string }>).detail.value);
    });
    root?.addEventListener("complete", (event) => {
      completed.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input?.inputMode).toBe("numeric");
    expect(input?.pattern).toBe("[0-9]*");
    expect(input?.autocomplete).toBe("one-time-code");
    expect(input?.maxLength).toBe(6);
    expect(input?.getAttribute("aria-label")).toBe("Verification code");
    expect(separator?.getAttribute("role")).toBe("separator");
    expect(root?.hasAttribute("role")).toBe(false);
    expect(root?.hasAttribute("data-state")).toBe(false);

    if (input) {
      input.value = "1234567";
      input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "7" }));
    }

    expect(input?.value).toBe("123456");
    expect(root?.value).toBe("123456");
    expect(slots.map((slot) => slot.textContent)).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(values).toEqual(["123456"]);
    expect(completed).toEqual(["123456"]);

    root?.click();
    expect(document.activeElement).toBe(input);

    document.body.replaceChildren();
  });

  it("keeps input-otp live example styles scoped to the input-otp docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="input-otp"]');
    expect(style).toContain(".ariaui-web-input-otp-group");
    expect(style).toContain(".ariaui-web-input-otp-slot");
    expect(style).toContain(".ariaui-web-input-otp-caret");
    expect(style).toContain("@keyframes ariaui-web-input-otp-caret-blink");
  });

  it("keeps the label docs structured like the source Aria UI label page", () => {
    const doc = readDoc("components/label.md");

    expect(doc).toContain("A native label primitive for naming form controls.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Default",
      "### Wrapped control",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Keyboard$/m);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source label example as a live custom element preview", () => {
    const previews = labelExamplePreviews(readDoc("components/label.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "default",
      "wrapped-control",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("flex");
      expect(preview.className).toContain("justify-center");
      expect(preview.className).toContain("px-6");
      expect(preview.markup).toContain("<aria-label");
      expect(preview.markup).toContain("ariaui-web-label-input");
    }

    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain('for="label-email"');
    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain('placeholder="name@example.com"');
    expect(previews.find((preview) => preview.variant === "wrapped-control")?.markup).toContain("Project name");
    expect(previews.find((preview) => preview.variant === "wrapped-control")?.markup).toContain('value="Design system"');
    expect(readDoc("components/label.md")).toContain("text-sm font-medium leading-none text-foreground");
    expect(readDoc("components/label.md")).toContain("grid w-full max-w-sm gap-2");
  });

  it("keeps generated label live examples behaviorally rendered", () => {
    defineLabelElements();
    const previews = labelExamplePreviews(readDoc("components/label.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const labels = Array.from(document.querySelectorAll("aria-label")) as RuntimeLabelElement[];
    const inputs = Array.from(document.querySelectorAll("input")) as HTMLInputElement[];
    let defaultInputClicks = 0;
    let wrappedInputClicks = 0;
    inputs[0]?.addEventListener("click", () => {
      defaultInputClicks += 1;
    });
    inputs[1]?.addEventListener("click", () => {
      wrappedInputClicks += 1;
    });

    expect(labels).toHaveLength(2);
    expect(inputs).toHaveLength(2);
    expect(labels[0]?.htmlFor).toBe("label-email");
    expect(inputs[0]?.id).toBe("label-email");
    expect(inputs[0]?.type).toBe("email");
    expect(inputs[0]?.placeholder).toBe("name@example.com");
    expect(labels[1]?.textContent).toContain("Project name");
    expect(inputs[1]?.value).toBe("Design system");

    labels[0]?.click();
    labels[1]?.click();

    expect(defaultInputClicks).toBe(1);
    expect(wrappedInputClicks).toBe(1);

    for (const label of labels) {
      expect(label.hasAttribute("role")).toBe(false);
      expect(label.hasAttribute("tabindex")).toBe(false);
      expect(label.hasAttribute("data-state")).toBe(false);
      expect(label.hasAttribute("data-value")).toBe(false);
      expect(label.hasAttribute("aria-disabled")).toBe(false);
      expect(label.hasAttribute("data-disabled")).toBe(false);
    }

    const surfaceMouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true, detail: 2 });
    labels[0]?.dispatchEvent(surfaceMouseDown);
    expect(surfaceMouseDown.defaultPrevented).toBe(true);

    const nestedMouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true, detail: 2 });
    inputs[1]?.dispatchEvent(nestedMouseDown);
    expect(nestedMouseDown.defaultPrevented).toBe(false);

    document.body.replaceChildren();
  });

  it("keeps label live example styles scoped to the label docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="label"]');
    expect(style).toContain(".ariaui-web-label-field");
    expect(style).toContain(".ariaui-web-label-root");
    expect(style).toContain(".ariaui-web-label-input");
    expect(style).toContain(".ariaui-web-label-wrapper");
  });

  it("keeps the portal docs structured like the source Aria UI portal page", () => {
    const doc = readDoc("components/portal.md");

    expect(doc).toContain("Renders children outside the local DOM hierarchy while preserving DOM node identity.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Default",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Keyboard$/m);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders the source portal usage example as a live custom element preview", () => {
    const previews = portalExamplePreviews(readDoc("components/portal.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "default",
    ]);
    expect(previews[0]?.className).toContain("ariaui-web-preview");
    expect(previews[0]?.markup).toContain("<aria-portal");
    expect(previews[0]?.markup).toContain("<div");
    expect(previews[0]?.markup).toContain("Content rendered to document.body");
    expect(previews[0]?.markup).toContain("ariaui-web-portal-card");
    expect(readDoc("components/portal.md")).not.toContain("data-example-part=\"Root\">Root</aria-portal>");
  });

  it("keeps generated portal live example behaviorally rendered into document.body", async () => {
    definePortalElements();
    const previews = portalExamplePreviews(readDoc("components/portal.md"));
    const fixture = document.createElement("section");
    fixture.innerHTML = previews.map((preview) => preview.markup).join("\n");
    document.body.append(fixture);
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    const root = fixture.querySelector("aria-portal") as RuntimePortalElement | null;
    const card = document.body.querySelector(".ariaui-web-portal-card") as HTMLElement | null;

    expect(root).toBeInstanceOf(HTMLElement);
    expect(card).toBeInstanceOf(HTMLElement);
    expect(card?.parentElement).toBe(document.body);
    expect(root?.contains(card)).toBe(false);
    expect(card?.textContent).toContain("Content rendered to document.body");

    root?.setAttribute("orientation", "vertical");
    if (root) {
      root.value = "alpha";
      root.open = true;
      root.pressed = true;
      root.selected = true;
      root.disabled = true;
    }
    let clickCount = 0;
    root?.addEventListener("click", () => {
      clickCount += 1;
    });
    root?.click();

    expect(clickCount).toBe(1);
    expect(root?.hasAttribute("role")).toBe(false);
    expect(root?.hasAttribute("tabindex")).toBe(false);
    expect(root?.hasAttribute("data-orientation")).toBe(false);
    expect(root?.hasAttribute("data-state")).toBe(false);
    expect(root?.hasAttribute("data-value")).toBe(false);
    expect(root?.hasAttribute("aria-expanded")).toBe(false);
    expect(root?.hasAttribute("aria-pressed")).toBe(false);
    expect(root?.hasAttribute("aria-selected")).toBe(false);
    expect(root?.hasAttribute("aria-disabled")).toBe(false);
    expect(root?.hasAttribute("data-disabled")).toBe(false);

    root?.remove();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(document.body.contains(card)).toBe(false);

    document.body.replaceChildren();
  });

  it("keeps portal live example styles scoped to the portal docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="portal"]');
    expect(style).toContain(".ariaui-web-portal-frame");
    expect(style).toContain(".ariaui-web-portal-host");
    expect(style).toContain(".ariaui-web-portal-card");
  });

  it("keeps the kbd docs structured like the source Aria UI kbd page", () => {
    const doc = readDoc("components/kbd.md");

    expect(doc).toContain("A keyboard input display primitive for shortcuts and key labels.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Shortcut group",
      "### Inline",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Group",
    ]);
    expect(doc).not.toMatch(/^## Keyboard$/m);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source kbd example as a live custom element preview", () => {
    const previews = kbdExamplePreviews(readDoc("components/kbd.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "shortcut-group",
      "inline",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("flex");
      expect(preview.className).toContain("justify-center");
      expect(preview.className).toContain("px-6");
      expect(preview.markup).toContain("<aria-kbd");
    }

    expect(previews.find((preview) => preview.variant === "shortcut-group")?.markup).toContain('aria-label="Command Shift P"');
    expect(previews.find((preview) => preview.variant === "shortcut-group")?.markup).toContain('aria-label="Control B"');
    expect(previews.find((preview) => preview.variant === "shortcut-group")?.markup).toContain("⌘");
    expect(previews.find((preview) => preview.variant === "shortcut-group")?.markup).toContain("⇧");
    expect(previews.find((preview) => preview.variant === "shortcut-group")?.markup).toContain("Ctrl");
    expect(previews.find((preview) => preview.variant === "shortcut-group")?.markup).toContain('aria-hidden="true"');
    expect(previews.find((preview) => preview.variant === "inline")?.markup).toContain("Press");
    expect(previews.find((preview) => preview.variant === "inline")?.markup).toContain('aria-label="Command K"');
    expect(previews.find((preview) => preview.variant === "inline")?.markup).toContain('aria-label="Escape"');
    expect(previews.find((preview) => preview.variant === "inline")?.markup).toContain("Esc");
    expect(readDoc("components/kbd.md")).toContain("inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs");
  });

  it("keeps generated kbd live examples behaviorally rendered", () => {
    defineKbdElements();
    const previews = kbdExamplePreviews(readDoc("components/kbd.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-kbd")) as RuntimeKbdElement[];
    const groups = Array.from(document.querySelectorAll("aria-kbd-group")) as RuntimeKbdElement[];
    const plus = document.querySelector('[aria-hidden="true"]');

    expect(roots).toHaveLength(8);
    expect(groups).toHaveLength(3);
    expect(roots.map((root) => root.textContent?.trim())).toEqual(["⌘", "⇧", "P", "Ctrl", "B", "⌘", "K", "Esc"]);
    expect(groups.map((group) => group.getAttribute("aria-label"))).toEqual(["Command Shift P", "Control B", "Command K"]);
    expect(plus?.textContent?.trim()).toBe("+");

    for (const root of roots) {
      expect(root.hasAttribute("role")).toBe(false);
      expect(root.hasAttribute("tabindex")).toBe(false);
      expect(root.hasAttribute("data-state")).toBe(false);
      expect(root.hasAttribute("data-value")).toBe(false);
      expect(root.hasAttribute("aria-disabled")).toBe(false);
      expect(root.hasAttribute("data-disabled")).toBe(false);
      expect(root.className).toContain("ariaui-web-kbd-key");
    }

    for (const group of groups) {
      expect(group.hasAttribute("role")).toBe(false);
      expect(group.hasAttribute("data-state")).toBe(false);
      expect(group.className).toContain("ariaui-web-kbd-group");
    }

    let clickCount = 0;
    roots[0]?.setAttribute("disabled", "");
    roots[0]?.addEventListener("click", () => {
      clickCount += 1;
    });
    roots[0]?.click();

    expect(clickCount).toBe(1);
    expect(roots[0]?.hasAttribute("aria-disabled")).toBe(false);
    expect(roots[0]?.hasAttribute("data-disabled")).toBe(false);

    document.body.replaceChildren();
  });

  it("keeps kbd live example styles scoped to the kbd docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="kbd"]');
    expect(style).toContain(".ariaui-web-kbd-key");
    expect(style).toContain(".ariaui-web-kbd-group");
    expect(style).toContain(".ariaui-web-kbd-plus");
    expect(style).toContain(".ariaui-web-kbd-inline");
    expect(style).toContain("font-family: var(--vp-font-family-mono);");
    expect(style).toContain("box-shadow: 0 1px 2px color-mix(in srgb, var(--vp-c-text-1) 12%, transparent);");
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
      expect(markup).toContain("inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted");
      expect(markup).toContain("fixed inset-0 z-50 bg-overlay/50 backdrop-blur-sm");
      expect(markup).toContain("fixed left-1/2 top-1/2 z-50 w-full max-w-md");
      expect(markup).toContain("rounded-lg border border-border bg-background p-6 shadow-lg");
      expect(markup).toContain("flex flex-col gap-4");
      expect(markup).toContain("flex flex-col gap-2");
      expect(markup).toContain("text-lg font-semibold text-foreground");
      expect(markup).toContain("text-sm text-muted-foreground");
      expect(markup).toContain("flex justify-end gap-2");
      expect(markup).toContain("bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive-hover");

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
    expect(previews.find((preview) => preview.variant === "destructive")?.markup).toContain("data-[state=open]:zoom-in-95");
    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).not.toContain("data-[state=open]:zoom-in-95");
  });

  it("keeps alert-dialog live example styles aligned with the source Aria UI preview layout", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="alert-dialog"]');
    expect(style).toContain(':not([data-component="alert-dialog"])');
    expect(style).toContain("\n.ariaui-web-alert-dialog-overlay {");
    expect(style).toContain("\n.ariaui-web-alert-dialog-content {");
    expect(style).toContain("\n.ariaui-web-alert-dialog-button {");
    expect(style).toContain("min-height: 12.5rem;");
    expect(style).toContain("place-items: center;");
    expect(style).toContain("height: 2.25rem;");
    expect(style).toContain("border-radius: 0.375rem;");
    expect(style).toContain("font-weight: 500;");
    expect(style).toContain("background: color-mix(in srgb, var(--vp-c-overlay, #0f172a) 50%, transparent);");
    expect(style).toContain("backdrop-filter: blur(4px);");
    expect(style).toContain("width: min(calc(100vw - 2rem), 28rem);");
    expect(style).toContain("border-radius: 0.5rem;");
    expect(style).toContain("padding: 1.5rem;");
    expect(style).toContain("box-shadow: var(--vp-shadow-3);");
    expect(style).toContain("font-size: 1.125rem;");
    expect(style).toContain("font-weight: 600;");
    expect(style).toContain("color: var(--vp-c-text-2);");
    expect(style).toContain("background: var(--vp-c-danger-1, #dc2626);");
    expect(style).toContain("background: var(--vp-c-danger-2, #b91c1c);");
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

    expect(doc).not.toContain("ariaui-web-accordion-root");
    expect(doc).not.toContain("ariaui-web-accordion-trigger");
    expect(doc).toContain("w-full max-w-xl bg-background");
    expect(doc).toContain("group flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium leading-5 text-foreground");
    expect(doc).toContain("h-4 w-4 shrink-0 text-foreground transition-transform group-aria-[expanded=true]:rotate-180");
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
      expect(preview.className).toContain("py-14");
      expect(preview.className).toContain("sm:px-12");
      expect(preview.shell.split("\n").find((line) => line.trimStart().startsWith("<aria-accordion "))).toMatch(/^ {2}<aria-accordion /);
      expect(preview.markup).not.toContain("ariaui-web-accordion");
      expect(preview.markup).toContain("<aria-accordion-item");
      expect(preview.markup).toContain("<aria-accordion-trigger");
      expect(preview.markup).toContain("<aria-accordion-content");
    }

    for (const variant of ["single", "multiple", "framer-motion"]) {
      expect(previews.find((preview) => preview.variant === variant)?.shell).toContain("flex w-full justify-center py-6 ariaui-web-accordion-preview-inner");
    }

    for (const variant of ["horizontal", "fold"]) {
      const shell = previews.find((preview) => preview.variant === variant)?.shell ?? "";
      expect(shell).toContain("flex w-full justify-center px-1 py-8 sm:px-4 ariaui-web-accordion-preview-wide");
      expect(shell).toContain("w-full max-w-5xl ariaui-web-accordion-preview-wide-inner");
    }

    for (const variant of ["single", "multiple", "framer-motion"]) {
      const markup = previews.find((preview) => preview.variant === variant)?.markup ?? "";
      expect(markup).toContain("w-full max-w-xl bg-background");
      expect(markup).toContain("border-b border-border");
      expect(markup).not.toContain("data-[state=open]:bg-muted/20");
      expect(markup).toContain("group flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium leading-5 text-foreground");
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

  it("keeps accordion live example styles aligned with the Figma Tailwind preview layout", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain(".ariaui-web-accordion-preview-inner");
    expect(style).toContain(".ariaui-web-accordion-preview-wide");
    expect(style).toContain(".ariaui-web-accordion-preview-wide-inner");
    expect(style).toContain('.ariaui-web-preview:not([data-component="accordion"])');
    expect(style).toContain("max-width: 64rem;");
    expect(style).toContain("padding: 8rem 1rem;");
    expect(style).toContain("border-radius: 16px;");
    expect(style).toContain("max-width: 36rem;");
    expect(style).toContain('data-example-variant="framer-motion"] [data-example-part="Root"] {\n  display: block;\n  width: 100%;\n  max-width: 36rem;\n  overflow: visible;');
    expect(style).toContain(`[data-example-part="Content"] {\n  display: block;\n  text-align: left;`);
    expect(style).toContain('data-example-variant="horizontal"] [data-example-part="Root"]');
    expect(style).toContain('data-example-variant="fold"] [data-example-part="Root"]');
    expect(style).not.toContain("max-width: 44rem;");
    expect(style).toContain("font-size: 2.25rem;");
    expect(style).toContain('data-example-part="Item"][data-state="open"]');
    expect(style).toContain("background: transparent;");
    expect(style).toContain("font-weight: 500;");
    expect(style).toContain("line-height: 1.25rem;");
    expect(style).toContain("background: color-mix(in srgb, var(--vp-c-bg-soft) 50%, transparent);");
    expect(style).toContain("background: color-mix(in srgb, var(--vp-c-bg-soft) 40%, transparent);");
    expect(style).toContain('[data-example-part="Trigger"]:focus,');
    expect(style).toContain('[data-example-part="Trigger"]:focus-visible');
    expect(style).toContain('data-example-variant="single"] [data-example-part="Trigger"]:focus,');
    expect(style).toContain('data-example-variant="framer-motion"] [data-example-part="Trigger"]:focus-visible');
    expect(style).toContain("position: relative;");
    expect(style).toContain("z-index: 1;");
    expect(style).toContain("outline-width: 2px;");
    expect(style).toContain("outline-style: solid;");
    expect(style).toContain("outline-color: var(--vp-c-brand-1);");
    expect(style).toContain("outline-offset: 2px;");
    expect(style).toContain("outline-offset: -2px;");
    expect(style).toContain('data-example-variant="framer-motion"] [data-example-part="Item"] {\n  position: relative;\n  display: block;\n  overflow: visible;');
    expect(style).toContain('.ariaui-web-preview[data-component="accordion"] .text-icon {\n  color: var(--vp-c-text-1);\n}');
    expect(style).toContain('[data-example-part="Trigger"][aria-expanded="true"] svg {\n  color: var(--vp-c-text-1);');
    expect(style).toContain('data-example-variant="fold"] [data-example-part="Trigger"]:focus,');
    expect(style).toContain("transition: width 200ms ease-out, opacity 200ms ease-out;");
    expect(style).toContain("grid-template-rows: 1fr;");
    expect(style).toContain("transition: grid-template-rows 200ms ease-out, opacity 200ms ease-out;");
    expect(style).toContain("grid-template-rows: 0fr;");
    expect(style).toContain("min-height: 0;");
    expect(style).not.toContain("transition: max-height 200ms ease-out, opacity 200ms ease-out;");
  });

  it("renders the collapsed breadcrumb source example as a working dropdown menu", () => {
    const previews = breadcrumbExamplePreviews(readDoc("components/breadcrumb.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "default",
      "collapsed",
      "custom-separator",
    ]);

    const collapsed = previews.find((preview) => preview.variant === "collapsed")?.markup ?? "";

    expect(collapsed).toContain("<aria-dropdown-menu");
    expect(collapsed).toContain("<aria-dropdown-menu-trigger");
    expect(collapsed).toContain("<aria-dropdown-menu-content");
    expect(collapsed).toContain("<aria-dropdown-menu-item");
    expect(collapsed).toContain("Show hidden trail");
    expect(collapsed).not.toContain("<button");

    defineBreadcrumbElements();
    defineDropdownMenuElements();
    document.body.innerHTML = collapsed;

    const root = document.querySelector("aria-dropdown-menu") as RuntimeDropdownMenuElement | null;
    const trigger = document.querySelector("aria-dropdown-menu-trigger") as HTMLElement | null;
    const content = document.querySelector("aria-dropdown-menu-content") as RuntimeDropdownMenuElement | null;
    const items = Array.from(content?.querySelectorAll("aria-dropdown-menu-item") ?? []);

    expect(root?.open).toBe(false);
    expect(content?.hidden).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(items.map((item) => item.textContent?.trim())).toEqual(["Documentation", "Themes", "GitHub"]);

    trigger?.click();

    expect(root?.open).toBe(true);
    expect(content?.hidden).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(content?.getAttribute("aria-activedescendant")).toBeTruthy();

    document.body.replaceChildren();
  });

  it("installs dropdown menu live example scroll locking and overflow-aware positioning", () => {
    const theme = readDoc(".vitepress/theme/index.ts");
    const style = readDoc(".vitepress/theme/style.css");
    const helper = readDoc(".vitepress/theme/dropdown-menu-examples.ts");

    expect(theme).toContain('import { installDropdownMenuExamples } from "./dropdown-menu-examples";');
    expect(theme).toContain("installDropdownMenuExamples();");
    expect(theme).toContain('import { installSelectExamples } from "./select-examples";');
    expect(theme).toContain("installSelectExamples();");
    expect(style).toContain('.ariaui-web-preview[data-component="dropdown-menu"] .ariaui-web-dropdown-menu-content[data-side]');
    expect(style).toContain('.ariaui-web-preview[data-component="breadcrumb"] .ariaui-web-breadcrumb-menu[data-side]');
    expect(style).toContain("max-height: min(24rem, calc(100vh - 1rem));");
    expect(style).toContain("overscroll-behavior: contain;");
    expect(helper).toContain("syncDropdownMenuExampleScrollLock");
    expect(helper).toContain("computeDropdownMenuExamplePosition");
    expect(helper).toContain('data-component="breadcrumb"] aria-dropdown-menu');
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

  it("keeps the calendar docs structured like the source Aria UI calendar page", () => {
    const doc = readDoc("components/calendar.md");

    expect(doc).toContain("A grid-backed calendar for single-date and range selection");
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
      "### Range",
      "### Manual Grid",
      "### Dual Range",
      "### Month/Year Selector",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source calendar example as a live custom element preview", () => {
    const previews = calendarExamplePreviews(readDoc("components/calendar.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "single",
      "range",
      "manual-grid",
      "dual-range",
      "month-year-selector",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("justify-center");
      expect(preview.markup).toContain("<aria-calendar");
      expect(preview.markup).toContain("<aria-calendar-header");
      expect(preview.markup).toContain("<aria-calendar-body");
      expect(preview.markup).toContain("days-in-week");
      expect(preview.markup).toContain("w-[248px] rounded-lg border");
      expect(preview.markup).toContain("calendar-cell-inner");
    }

    const singleMarkup = previews.find((preview) => preview.variant === "single")?.markup ?? "";
    expect(singleMarkup).toContain('mode="single"');
    expect(singleMarkup).toContain('default-dates="2025-01-10"');
    expect(previews.find((preview) => preview.variant === "range")?.markup).toContain('mode="range"');
    expect(previews.find((preview) => preview.variant === "range")?.markup).toContain('default-dates="2025-01-10,2025-01-20"');
    const manualGridMarkup = previews.find((preview) => preview.variant === "manual-grid")?.markup ?? "";
    expect(manualGridMarkup).toContain('default-dates="2025-01-17"');
    expect(manualGridMarkup).toContain('visible-month="2025-01-17"');
    expect(manualGridMarkup).toContain('data-calendar-generated="true"');
    expect(manualGridMarkup.match(/<aria-calendar[^>]* class="([^"]+)"/)?.[1])
      .toBe(singleMarkup.match(/<aria-calendar[^>]* class="([^"]+)"/)?.[1]);
    expect(previews.find((preview) => preview.variant === "dual-range")?.markup).toContain('mode="dual-range"');
    expect(previews.find((preview) => preview.variant === "dual-range")?.markup).toContain('default-dates="2025-01-12,2025-02-08"');
    const monthYearMarkup = previews.find((preview) => preview.variant === "month-year-selector")?.markup ?? "";
    expect(monthYearMarkup).toContain("<aria-select");
    expect(monthYearMarkup).toContain("<aria-select-trigger");
    expect(monthYearMarkup).toContain("<aria-select-content");
    expect(monthYearMarkup).toContain('data-calendar-select="month"');
    expect(monthYearMarkup).toContain('data-calendar-select="year"');
    expect(monthYearMarkup).not.toContain("<aria-calendar-month-select");
    expect(monthYearMarkup).not.toContain("<aria-calendar-year-select");
  });

  it("keeps the generated calendar live examples behaviorally interactive", () => {
    defineCalendarElements();
    defineSelectElements();
    const previews = calendarExamplePreviews(readDoc("components/calendar.md"));
    document.body.innerHTML = previews
      .map((preview) => '<div class="' + preview.className + '" data-component="calendar" data-example-variant="' + preview.variant + '">\n' + preview.markup + "\n</div>")
      .join("\n");
    installCalendarExamples(document);
    syncCalendarExamples(document);

    const roots = Array.from(document.querySelectorAll("aria-calendar")) as RuntimeCalendarElement[];
    const single = roots[0] ?? null;
    const range = roots[1] ?? null;
    const manualGrid = roots[2] ?? null;
    const dual = roots[3] ?? null;

    expect(roots).toHaveLength(5);
    expect(single?.mode).toBe("single");
    expect(single?.value).toBe("2025-01-10");
    expect(single?.visibleMonth).toBe("2025-01-10");
    expect(single?.querySelectorAll("[role='gridcell']")).toHaveLength(42);
    expect(single?.querySelector("[data-slot='calendar-cell-inner']")).toBeTruthy();
    expect(single?.querySelector("[aria-selected='true']")?.textContent?.trim()).toBe("10");

    const singleFifteen = Array.from(single?.querySelectorAll<HTMLElement>("[role='gridcell']") ?? [])
      .find((cell) => cell.textContent?.trim() === "15" && cell.getAttribute("aria-disabled") !== "true");
    singleFifteen?.click();
    expect(single?.value).toBe("2025-01-15");
    expect(singleFifteen?.getAttribute("aria-selected")).toBe("true");

    const rangeTwentieth = Array.from(range?.querySelectorAll<HTMLElement>("[role='gridcell']") ?? [])
      .find((cell) => cell.textContent?.trim() === "20" && cell.getAttribute("aria-disabled") !== "true");
    expect(rangeTwentieth?.getAttribute("data-range-end")).toBe("true");
    expect(rangeTwentieth?.getAttribute("data-in-range")).toBe("true");

    expect(manualGrid?.value).toBe("2025-01-17");
    expect(manualGrid?.visibleMonth).toBe("2025-01-17");
    expect(manualGrid?.querySelector("[aria-selected='true']")?.textContent?.trim()).toBe("17");
    const manualNext = manualGrid?.querySelector("aria-calendar-header-next") as HTMLElement | null;
    manualNext?.click();
    expect(manualGrid?.visibleMonth).toBe("2025-02-17");
    expect(manualGrid?.textContent).toContain("February");
    expect(manualGrid?.querySelector("[date='2025-01-17']")).toBeNull();
    expect(manualGrid?.querySelector("[date='2025-02-17']")).toBeTruthy();

    expect(dual?.querySelectorAll("[role='grid']")).toHaveLength(2);
    expect(dual?.textContent).toContain("January");
    expect(dual?.textContent).toContain("February");

    const selectorCalendar = roots[4] ?? null;
    const monthSelector = selectorCalendar?.querySelector("aria-select[data-calendar-select='month']") as RuntimeSelectElement | null;
    const monthTrigger = monthSelector?.querySelector("aria-select-trigger") as HTMLElement | null;
    monthTrigger?.click();
    const marchOption = Array.from(monthSelector?.querySelectorAll<HTMLElement>("aria-select-option") ?? [])
      .find((option) => option.textContent?.trim() === "March");
    marchOption?.click();
    expect(selectorCalendar?.visibleMonth).toBe("2025-03-10");
    expect(monthSelector?.value).toBe("2");
    expect(monthTrigger?.textContent?.trim()).toContain("March");
    expect((monthSelector?.querySelector("aria-select-content") as HTMLElement | null)?.hidden).toBe(true);

    const yearSelector = selectorCalendar?.querySelector("aria-select[data-calendar-select='year']") as RuntimeSelectElement | null;
    const yearTrigger = yearSelector?.querySelector("aria-select-trigger") as HTMLElement | null;
    yearTrigger?.click();
    const yearOption = Array.from(yearSelector?.querySelectorAll<HTMLElement>("aria-select-option") ?? [])
      .find((option) => option.textContent?.trim() === "2027");
    yearOption?.click();
    expect(selectorCalendar?.visibleMonth).toBe("2027-03-10");
    expect(yearSelector?.value).toBe("2027");
    expect(yearTrigger?.textContent?.trim()).toContain("2027");

    document.body.replaceChildren();
  });

  it("scrolls calendar month/year select panels during keyboard navigation", async () => {
    defineCalendarElements();
    defineSelectElements();
    const preview = calendarExamplePreviews(readDoc("components/calendar.md"))
      .find((candidate) => candidate.variant === "month-year-selector");
    expect(preview).toBeDefined();
    document.body.innerHTML = '<div class="' + preview?.className + '" data-component="calendar" data-example-variant="' + preview?.variant + '">\n' + preview?.markup + "\n</div>";
    installCalendarExamples(document);
    syncCalendarExamples(document);

    const yearSelector = document.querySelector("aria-select[data-calendar-select='year']") as RuntimeSelectElement | null;
    const yearTrigger = yearSelector?.querySelector("aria-select-trigger") as HTMLElement | null;
    expect(yearSelector).not.toBe(null);
    const { content, options } = installScrollableSelectContentTestLayout(yearSelector as HTMLElement);

    yearTrigger?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    await flushSelectExampleFrame();
    expect(yearSelector?.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-activedescendant")).toBe(options[5]?.id);
    expect(content.scrollTop).toBe(96);

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    await flushSelectExampleFrame();
    expect(content.getAttribute("aria-activedescendant")).toBe(options[11]?.id);
    expect(content.scrollTop).toBe(288);

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    await flushSelectExampleFrame();
    expect(content.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
    expect(content.scrollTop).toBe(0);

    document.body.replaceChildren();
  });

  it("flips calendar month/year select panels before they overflow the viewport", () => {
    defineCalendarElements();
    defineSelectElements();
    const preview = calendarExamplePreviews(readDoc("components/calendar.md"))
      .find((candidate) => candidate.variant === "month-year-selector");
    expect(preview).toBeDefined();
    document.body.innerHTML = '<div class="' + preview?.className + '" data-component="calendar" data-example-variant="' + preview?.variant + '">\n' + preview?.markup + "\n</div>";
    installCalendarExamples(document);
    syncCalendarExamples(document);

    const yearSelector = document.querySelector("aria-select[data-calendar-select='year']") as RuntimeSelectElement | null;
    const yearTrigger = yearSelector?.querySelector("aria-select-trigger") as HTMLElement | null;
    const yearContent = yearSelector?.querySelector("aria-select-content") as HTMLElement | null;
    expect(yearSelector).not.toBe(null);
    expect(yearTrigger).not.toBe(null);
    expect(yearContent).not.toBe(null);

    yearTrigger!.getBoundingClientRect = () => ({
      x: 100,
      y: 560,
      top: 560,
      right: 196,
      bottom: 596,
      left: 100,
      width: 96,
      height: 36,
      toJSON: () => ({}),
    } as DOMRect);
    yearContent!.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 120,
      bottom: 180,
      left: 0,
      width: 120,
      height: 180,
      toJSON: () => ({}),
    } as DOMRect);

    yearTrigger?.click();
    syncCalendarExamples(document);

    expect(yearSelector?.open).toBe(true);
    expect(yearContent?.hidden).toBe(false);
    expect(yearContent?.dataset.side).toBe("top");
    expect(yearContent?.dataset.align).toBe("start");
    expect(yearContent?.style.position).toBe("fixed");
    expect(yearContent?.style.top).toBe("375px");
    expect(yearContent?.style.left).toBe("100px");
    expect(yearContent?.style.right).toBe("auto");

    yearSelector?.removeAttribute("open");
    yearContent!.hidden = true;
    syncCalendarExamples(document);

    expect(yearContent?.dataset.side).toBeUndefined();
    expect(yearContent?.style.position).toBe("");
    expect(yearContent?.style.top).toBe("");
    expect(yearContent?.style.left).toBe("");
    expect(yearContent?.style.right).toBe("");

    document.body.replaceChildren();
  });

  it("keeps calendar live example styles scoped to the calendar docs page", () => {
    const theme = readDoc(".vitepress/theme/index.ts");
    const helper = readDoc(".vitepress/theme/calendar-examples.ts");
    const style = readDoc(".vitepress/theme/style.css");

    expect(theme).toContain('import { installCalendarExamples } from "./calendar-examples";');
    expect(theme).toContain("installCalendarExamples();");
    expect(helper).toContain("syncCalendarExamples");
    expect(helper).toContain("data-calendar-select");
    expect(style).toContain('.ariaui-web-preview[data-component="calendar"]');
    expect(style).toContain('[data-slot="calendar-cell"]');
    expect(style).toContain(".ariaui-web-calendar-select-trigger");
    expect(style).toContain('[data-range-start="true"]');
    expect(style).toContain('[data-slot="calendar-cell-inner"][data-today="true"]');
    expect(style).not.toContain('[data-example-variant="manual-grid"]');
    expect(style).not.toContain("--ariaui-web-calendar-manual");
    expect(style).toContain("grid-template-columns: repeat(7, 2rem);");
    expect(style).toContain(
      [
        '.ariaui-web-preview[data-component="calendar"] .ariaui-web-calendar-select-content {',
        "  position: absolute;",
        "  top: calc(100% + 0.25rem);",
        "  left: 0;",
        "  z-index: 30;",
        "  display: grid;",
        "  width: 9.375rem;",
        "  max-width: calc(100vw - 1rem);",
        "  max-height: 14rem;",
        "  min-width: 9.375rem;",
      ].join("\n"),
    );
  });

  it("keeps the grid docs structured like the source Aria UI grid page", () => {
    const doc = readDoc("components/grid.md");

    expect(doc).toContain("A headless, accessible grid primitive with roving tabindex");
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
      "### Uncontrolled",
      "### Controlled",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Head",
      "### Header",
      "### Body",
      "### Row",
      "### Cell",
      "### Parts",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source grid example as a live custom element preview", () => {
    const previews = gridExamplePreviews(readDoc("components/grid.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "uncontrolled",
      "controlled",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("justify-center");
      expect(preview.markup).toContain("<aria-grid");
      expect(preview.markup).toContain("<aria-grid-head");
      expect(preview.markup).toContain("<aria-grid-header");
      expect(preview.markup).toContain("<aria-grid-body");
      expect(preview.markup).toContain("<aria-grid-row");
      expect(preview.markup).toContain("<aria-grid-cell");
      expect(preview.markup).toContain('aria-label="Team members"');
      expect(preview.markup).toContain("John Doe");
      expect(preview.markup).toContain("Jane Smith");
      expect(preview.markup).toContain("Bob Jones");
      expect(preview.markup).toContain("Selected values");
      expect(preview.markup).toContain("w-full max-w-md rounded-xl border border-border/20 bg-background/90 text-left shadow-lg backdrop-blur-xl");
      expect(preview.markup).toContain("p-3 text-sm text-foreground data-[selected]:bg-accent data-[focused]:z-50 data-[focused]:[outline:auto]");
    }

    expect(previews.find((preview) => preview.variant === "uncontrolled")?.markup).toContain('default-value="jane:role"');
    expect(previews.find((preview) => preview.variant === "uncontrolled")?.markup).toContain("jane:role");
    expect(previews.find((preview) => preview.variant === "controlled")?.markup).toContain('value="bob:status"');
    expect(previews.find((preview) => preview.variant === "controlled")?.markup).toContain("bob:status");
  });

  it("keeps the generated grid live examples behaviorally interactive", () => {
    defineGridElements();
    const previews = gridExamplePreviews(readDoc("components/grid.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\n");

    const roots = Array.from(document.querySelectorAll("aria-grid")) as RuntimeGridElement[];
    const uncontrolled = roots[0] ?? null;
    const controlled = roots[1] ?? null;
    const cells = Array.from(uncontrolled?.querySelectorAll("aria-grid-cell") ?? []) as RuntimeGridElement[];

    expect(roots).toHaveLength(2);
    expect(uncontrolled?.getAttribute("role")).toBe("grid");
    expect(uncontrolled?.value).toBe("jane:role");
    expect(controlled?.value).toBe("bob:status");
    expect(cells).toHaveLength(9);
    expect(cells[4]?.getAttribute("data-selected")).toBe("true");
    expect(cells[4]?.getAttribute("aria-selected")).toBe("true");
    expect(cells[4]?.getAttribute("tabindex")).toBe("0");
    expect(cells[0]?.getAttribute("data-row")).toBe("0");
    expect(cells[0]?.getAttribute("data-col")).toBe("0");
    expect(cells[0]?.getAttribute("data-value")).toBe("john:name");

    cells[5]?.click();
    expect(uncontrolled?.value).toBe("jane:status");
    expect(cells[5]?.getAttribute("data-selected")).toBe("true");
    expect(cells[4]?.hasAttribute("data-selected")).toBe(false);

    cells[5]?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(cells[4]);
    cells[4]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(uncontrolled?.value).toBe("jane:status,jane:role");
    expect(cells[4]?.getAttribute("data-selected")).toBe("true");

    document.body.replaceChildren();
  });

  it("keeps grid live example styles scoped to the grid docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="grid"]');
    expect(style).toContain('[data-example-part="Root"]');
    expect(style).toContain('[data-example-part="Cell"][data-selected="true"]');
    expect(style).toContain("display: table;");
    expect(style).toContain("border-collapse: separate;");
    expect(style).toContain("outline: 2px solid var(--vp-c-brand-1);");
    expect(style).toContain(".VPDoc .content-container");
    expect(style).toContain("overflow-wrap: break-word;");
  });

  it("keeps the combobox docs structured like the source Aria UI combobox page", () => {
    const doc = readDoc("components/combobox.md");

    expect(doc).toContain("A composable searchable selection primitive with filtering, keyboard navigation, and single or multi-select modes.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard Interactions",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Grouped options",
      "### Framer Motion",
      "### User selector",
      "### Multi-select",
      "### Multi-select (Advanced)",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source combobox example as a live custom element preview", () => {
    const previews = comboboxExamplePreviews(readDoc("components/combobox.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "grouped-options",
      "framer-motion",
      "user-selector",
      "multi-select",
      "multiple-advanced",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("justify-center");
      expect(preview.markup).toContain("<aria-combobox");
      expect(preview.markup).toContain("<aria-combobox-trigger");
      expect(preview.markup).toContain("<aria-combobox-input");
      expect(preview.markup).toContain("<aria-combobox-content");
      expect(preview.markup).toContain("<aria-combobox-option");
      expect(preview.markup).toContain("ariaui-web-combobox-trigger");
    }

    expect(previews.find((preview) => preview.variant === "grouped-options")?.markup).toContain("Fruits");
    expect(previews.find((preview) => preview.variant === "grouped-options")?.markup).toContain("Animals");
    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain("force-mount");
    expect(previews.find((preview) => preview.variant === "user-selector")?.markup).toContain("https://github.com/shadcn.png");
    expect(previews.find((preview) => preview.variant === "multi-select")?.markup).toContain('selection-mode="multiple"');
    expect(previews.find((preview) => preview.variant === "multiple-advanced")?.markup).toContain('data-combobox-overflow-limit="2"');
  });

  it("pairs every combobox live example with a matching HTML snippet", () => {
    const entries = comboboxExampleEntries(readDoc("components/combobox.md"));

    expect(entries.map((entry) => entry.variant)).toEqual([
      "grouped-options",
      "framer-motion",
      "user-selector",
      "multi-select",
      "multiple-advanced",
    ]);

    for (const entry of entries) {
      expect(entry.snippet, entry.variant).toBe(entry.markup);
      expect(entry.snippet).toMatch(/^<aria-combobox\b/);
    }
  });

  it("keeps combobox live examples behaviorally interactive", async () => {
    defineComboboxElements();
    const previews = comboboxExamplePreviews(readDoc("components/combobox.md"));
    document.body.innerHTML = previews
      .map((preview) => '<div class="' + preview.className + '" data-component="combobox" data-example-variant="' + preview.variant + '">\n' + preview.markup + "\n</div>")
      .join("\n");

    const roots = Array.from(document.querySelectorAll("aria-combobox")) as RuntimeComboboxElement[];
    const grouped = roots[0] ?? null;
    const motion = roots[1] ?? null;
    const userSelector = roots[2] ?? null;
    const multi = roots[3] ?? null;
    const advanced = roots[4] ?? null;

    expect(roots).toHaveLength(5);
    installComboboxExamples(document);
    syncComboboxExamples(document);

    for (const root of roots) {
      const trigger = root.querySelector("aria-combobox-trigger") as RuntimeComboboxElement | null;
      const input = root.querySelector("aria-combobox-input") as RuntimeComboboxElement | null;

      expect(trigger?.hasAttribute("tabindex")).toBe(false);
      expect(trigger?.tabIndex).toBe(-1);
      expect(input?.getAttribute("tabindex")).toBe("0");
    }

    const groupedTrigger = grouped?.querySelector("aria-combobox-trigger") as RuntimeComboboxElement | null;
    const groupedInput = grouped?.querySelector("aria-combobox-input") as RuntimeComboboxElement | null;
    const groupedContent = grouped?.querySelector("aria-combobox-content") as RuntimeComboboxElement | null;
    const groupedLabel = groupedTrigger?.querySelector("[data-combobox-trigger-label]");
    const apple = grouped?.querySelector("aria-combobox-option[value='Apple']") as RuntimeComboboxElement | null;
    const banana = grouped?.querySelector("aria-combobox-option[value='Banana']") as RuntimeComboboxElement | null;
    const dog = grouped?.querySelector("aria-combobox-option[value='Dog']") as RuntimeComboboxElement | null;
    const fallback = groupedContent?.querySelector("[data-combobox-fallback]") as HTMLElement | null;

    expect(groupedTrigger?.getAttribute("role")).toBe("combobox");
    expect(groupedTrigger?.getAttribute("aria-expanded")).toBe("false");
    expect(groupedContent?.hidden).toBe(true);

    groupedTrigger?.click();
    groupedInput!.textContent = "Ba";
    groupedInput?.dispatchEvent(new Event("input", { bubbles: true }));
    expect(grouped?.getAttribute("input-value")).toBe("Ba");
    expect(apple?.hidden).toBe(true);
    expect(banana?.hidden).toBe(false);
    expect(dog?.hidden).toBe(true);
    expect(fallback?.hidden).toBe(true);

    banana?.click();
    await flushSelectExampleFrame();
    syncComboboxExamples(document);
    expect(grouped?.value).toBe("Banana");
    expect(groupedLabel?.textContent).toBe("Banana");
    expect(groupedContent?.hidden).toBe(true);

    const motionTrigger = motion?.querySelector("aria-combobox-trigger") as RuntimeComboboxElement | null;
    const motionContent = motion?.querySelector("aria-combobox-content") as RuntimeComboboxElement | null;
    expect(motionContent?.hidden).toBe(false);
    expect(motionContent?.getAttribute("data-state")).toBe("closed");
    motionTrigger?.click();
    expect(motionContent?.getAttribute("data-state")).toBe("open");
    motionTrigger?.click();
    expect(motionContent?.hidden).toBe(false);
    expect(motionContent?.getAttribute("data-state")).toBe("closed");

    const userTrigger = userSelector?.querySelector("aria-combobox-trigger") as RuntimeComboboxElement | null;
    const leerob = userSelector?.querySelector("aria-combobox-option[value='leerob']") as RuntimeComboboxElement | null;
    userTrigger?.click();
    leerob?.click();
    await flushSelectExampleFrame();
    syncComboboxExamples(document);
    expect(userSelector?.value).toBe("leerob");
    expect(userSelector?.querySelector(".ariaui-web-combobox-chip")?.textContent?.trim()).toBe("leerob×");
    expect(userSelector?.querySelector(".ariaui-web-combobox-chip img")?.getAttribute("src")).toBe("https://github.com/leerob.png");

    const multiTrigger = multi?.querySelector("aria-combobox-trigger") as RuntimeComboboxElement | null;
    const multiApple = multi?.querySelector("aria-combobox-option[value='Apple']") as RuntimeComboboxElement | null;
    const multiCarrot = multi?.querySelector("aria-combobox-option[value='Carrot']") as RuntimeComboboxElement | null;
    multiTrigger?.click();
    multiApple?.click();
    multiCarrot?.click();
    await flushSelectExampleFrame();
    syncComboboxExamples(document);
    expect(multi?.value).toBe("Apple,Carrot");
    expect(Array.from(multi?.querySelectorAll(".ariaui-web-combobox-chip") ?? []).map((chip) => chip.textContent?.trim())).toEqual(["Apple×", "Carrot×"]);
    multi?.querySelector(".ariaui-web-combobox-chip[data-combobox-chip-value='Apple'] .ariaui-web-combobox-remove")?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await flushSelectExampleFrame();
    syncComboboxExamples(document);
    expect(multi?.value).toBe("Carrot");

    const advancedTrigger = advanced?.querySelector("aria-combobox-trigger") as RuntimeComboboxElement | null;
    advancedTrigger?.click();
    advanced?.querySelector<RuntimeComboboxElement>("aria-combobox-option[value='Apple']")?.click();
    advanced?.querySelector<RuntimeComboboxElement>("aria-combobox-option[value='Banana']")?.click();
    advanced?.querySelector<RuntimeComboboxElement>("aria-combobox-option[value='Spinach']")?.click();
    await flushSelectExampleFrame();
    syncComboboxExamples(document);
    expect(Array.from(advanced?.querySelectorAll(".ariaui-web-combobox-chip") ?? []).map((chip) => chip.textContent?.trim())).toEqual(["Apple×", "Banana×"]);
    expect(advanced?.querySelector(".ariaui-web-combobox-overflow-count")?.textContent).toBe("+1");
    expect(advanced?.querySelector(".ariaui-web-combobox-overflow-count")?.getAttribute("aria-label")).toBe("1 more selected");
    expect(advanced?.querySelector(".ariaui-web-combobox-overflow-badge")).toBe(null);

    document.body.replaceChildren();
  });

  it("keeps combobox live example styles scoped to the combobox docs page", () => {
    const theme = readDoc(".vitepress/theme/index.ts");
    const style = readDoc(".vitepress/theme/style.css");
    const helper = readDoc(".vitepress/theme/combobox-examples.ts");

    expect(theme).toContain('import { installComboboxExamples } from "./combobox-examples";');
    expect(theme).toContain("installComboboxExamples();");
    expect(helper).toContain("syncComboboxExamples");
    expect(helper).toContain("data-combobox-chip-value");
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"]');
    expect(style).toContain(".ariaui-web-combobox-trigger");
    expect(style).toContain(".ariaui-web-combobox-content");
    expect(style).toContain(".ariaui-web-combobox-option[data-active=\"true\"]");
    expect(style).toContain(".ariaui-web-combobox-option:not([data-state=\"checked\"]) .ariaui-web-combobox-check");
    expect(style).toContain(".ariaui-web-combobox-chip");
    expect(helper).toContain("ariaui-web-combobox-overflow-count");
    expect(helper).not.toContain("ariaui-web-combobox-overflow-badge");
    expect(style).toContain(".ariaui-web-combobox-overflow-count");
    expect(style).not.toContain(".ariaui-web-combobox-overflow-badge");
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"] .ariaui-web-combobox-content[data-side]');
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"][data-example-variant="multi-select"] .ariaui-web-combobox-trigger');
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"][data-example-variant="multi-select"] .ariaui-web-combobox-selection-group');
    expect(style).toContain("padding-inline: 0.125rem;");
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"][data-example-variant="multi-select"] .ariaui-web-combobox-button {\n  align-self: center;\n}');
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"][data-example-variant="multi-select"] .ariaui-web-combobox-tag-group');
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"][data-example-variant="multi-select"] .ariaui-web-combobox-tag-group {\n  display: contents;');
    expect(style).toContain('.ariaui-web-preview[data-component="combobox"][data-example-variant="multi-select"] .ariaui-web-combobox-trigger[data-has-value="true"] .ariaui-web-combobox-input');
    expect(style).toContain("flex: 0 1 2px;");
    expect(style).toContain("flex-wrap: wrap;");
    expect(style).toContain("overflow: visible;");
    expect(style).toContain('[data-example-variant="framer-motion"] .ariaui-web-combobox-content[data-state="open"]');
  });

  it("flips combobox example panels before they overflow the viewport", () => {
    const bottomPosition = computeComboboxExamplePosition(
      { top: 560, right: 300, bottom: 596, left: 100, width: 200, height: 36 },
      { width: 200, height: 180 },
      { width: 800, height: 640 },
    );
    const topPosition = computeComboboxExamplePosition(
      { top: 120, right: 300, bottom: 156, left: 100, width: 200, height: 36 },
      { width: 200, height: 180 },
      { width: 800, height: 640 },
    );
    const clampedPosition = computeComboboxExamplePosition(
      { top: 560, right: 780, bottom: 596, left: 700, width: 80, height: 36 },
      { width: 200, height: 180 },
      { width: 800, height: 640 },
    );
    const offscreenTopPosition = computeComboboxExamplePosition(
      { top: -60, right: 300, bottom: -24, left: 100, width: 200, height: 36 },
      { width: 200, height: 180 },
      { width: 800, height: 640 },
    );
    const offscreenBottomPosition = computeComboboxExamplePosition(
      { top: 690, right: 300, bottom: 726, left: 100, width: 200, height: 36 },
      { width: 200, height: 180 },
      { width: 800, height: 640 },
    );

    expect(bottomPosition).toEqual({
      top: 375,
      left: 100,
      side: "top",
      align: "start",
    });
    expect(topPosition).toEqual({
      top: 161,
      left: 100,
      side: "bottom",
      align: "start",
    });
    expect(clampedPosition).toEqual({
      top: 375,
      left: 592,
      side: "top",
      align: "start",
    });
    expect(offscreenTopPosition).toEqual({
      top: -19,
      left: 100,
      side: "bottom",
      align: "start",
    });
    expect(offscreenBottomPosition).toEqual({
      top: 505,
      left: 100,
      side: "top",
      align: "start",
    });
  });

  it("positions open combobox docs example panels and clears the position when closed", () => {
    document.body.innerHTML = `
      <div class="ariaui-web-preview" data-component="combobox">
        <aria-combobox open>
          <aria-combobox-trigger class="ariaui-web-combobox-trigger"></aria-combobox-trigger>
          <aria-combobox-content class="ariaui-web-combobox-content"></aria-combobox-content>
        </aria-combobox>
      </div>
    `;

    const root = document.querySelector("aria-combobox") as HTMLElement | null;
    const trigger = document.querySelector("aria-combobox-trigger") as HTMLElement | null;
    const content = document.querySelector("aria-combobox-content") as HTMLElement | null;

    expect(root).not.toBe(null);
    expect(trigger).not.toBe(null);
    expect(content).not.toBe(null);

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 640 });
    trigger!.getBoundingClientRect = () => ({
      top: 560,
      right: 300,
      bottom: 596,
      left: 100,
      width: 200,
      height: 36,
      x: 100,
      y: 560,
      toJSON: () => ({}),
    });
    content!.getBoundingClientRect = () => ({
      top: 601,
      right: 300,
      bottom: 781,
      left: 100,
      width: 200,
      height: 180,
      x: 100,
      y: 601,
      toJSON: () => ({}),
    });

    syncComboboxExamples(document);

    expect(content?.dataset.side).toBe("top");
    expect(content?.dataset.align).toBe("start");
    expect(content?.style.position).toBe("fixed");
    expect(content?.style.top).toBe("375px");
    expect(content?.style.left).toBe("100px");

    trigger!.getBoundingClientRect = () => ({
      top: -60,
      right: 300,
      bottom: -24,
      left: 100,
      width: 200,
      height: 36,
      x: 100,
      y: -60,
      toJSON: () => ({}),
    });
    syncComboboxExamples(document);

    expect(content?.dataset.side).toBe("bottom");
    expect(content?.style.top).toBe("-19px");
    expect(content?.style.left).toBe("100px");

    root?.removeAttribute("open");
    syncComboboxExamples(document);

    expect(content?.dataset.side).toBeUndefined();
    expect(content?.dataset.align).toBeUndefined();
    expect(content?.style.position).toBe("");
    expect(content?.style.top).toBe("");
    expect(content?.style.left).toBe("");

    document.body.replaceChildren();
  });

  it("keeps open combobox docs example panels anchored while the page scrolls", async () => {
    let triggerTop = 120;
    let triggerBottom = 156;

    document.body.innerHTML = `
      <div class="ariaui-web-preview" data-component="combobox">
        <aria-combobox open>
          <aria-combobox-trigger class="ariaui-web-combobox-trigger"></aria-combobox-trigger>
          <aria-combobox-content class="ariaui-web-combobox-content"></aria-combobox-content>
        </aria-combobox>
      </div>
    `;

    const trigger = document.querySelector("aria-combobox-trigger") as HTMLElement | null;
    const content = document.querySelector("aria-combobox-content") as HTMLElement | null;

    expect(trigger).not.toBe(null);
    expect(content).not.toBe(null);

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 640 });
    trigger!.getBoundingClientRect = () => ({
      top: triggerTop,
      right: 300,
      bottom: triggerBottom,
      left: 100,
      width: 200,
      height: 36,
      x: 100,
      y: triggerTop,
      toJSON: () => ({}),
    });
    content!.getBoundingClientRect = () => ({
      top: triggerBottom + 5,
      right: 300,
      bottom: triggerBottom + 185,
      left: 100,
      width: 200,
      height: 180,
      x: 100,
      y: triggerBottom + 5,
      toJSON: () => ({}),
    });

    installComboboxExamples(document);
    syncComboboxExamples(document);

    expect(content?.style.top).toBe("161px");
    await flushSelectExampleFrame();

    triggerTop = -60;
    triggerBottom = -24;
    window.dispatchEvent(new Event("scroll"));
    await flushSelectExampleFrame();

    expect(content?.style.top).toBe("-19px");
    expect(content?.dataset.side).toBe("bottom");

    document.body.replaceChildren();
  });

  it("keeps the select docs structured like the source Aria UI select page", () => {
    const doc = readDoc("components/select.md");

    expect(doc).toContain("A headless, accessible select built on the WAI-ARIA Listbox pattern");
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
      "### Uncontrolled",
      "### Disabled",
      "### With icon",
      "### Large list + scroll area",
      "### Grouped With Submenu",
      "### Grouped Multiple With Submenu",
      "### Multiple Selection (Uncontrolled)",
      "### Framer Motion",
      "### Framer Motion + Scroll Area",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source select example as a live custom element preview", () => {
    const previews = selectExamplePreviews(readDoc("components/select.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "uncontrolled",
      "disabled",
      "with-icon",
      "large-list-scroll-area",
      "grouped-with-submenu",
      "grouped-multiple-with-submenu",
      "multiple-uncontrolled",
      "framer-motion",
      "scroll-area",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("justify-center");
      expect(preview.markup).toContain("<aria-select");
      expect(preview.markup).toContain("<aria-select-trigger");
      expect(preview.markup).toContain("<aria-select-content");
      expect(preview.markup).toContain("<aria-select-option");
      expect(preview.markup).toContain("ariaui-web-select-trigger");
    }

    const uncontrolledMarkup = previews.find((preview) => preview.variant === "uncontrolled")?.markup ?? "";
    expect(uncontrolledMarkup).toContain('default-value="blueberry"');
    expect(uncontrolledMarkup).toContain("Blueberry");
    expect(uncontrolledMarkup).toContain("Fruits");
    expect(uncontrolledMarkup).toContain("Grapes");

    const disabledMarkup = previews.find((preview) => preview.variant === "disabled")?.markup ?? "";
    expect(disabledMarkup).toContain("<aria-select");
    expect(disabledMarkup).toContain("disabled");

    const withIconMarkup = previews.find((preview) => preview.variant === "with-icon")?.markup ?? "";
    expect(withIconMarkup).toContain("With Icon");
    expect(withIconMarkup).toContain("Line");
    expect(withIconMarkup).toContain("Bar");
    expect(withIconMarkup).toContain("Pie");

    const largeListMarkup = previews.find((preview) => preview.variant === "large-list-scroll-area")?.markup ?? "";
    expect(largeListMarkup.match(/class="ariaui-web-select-option ariaui-web-select-scroll-option"/g)).toHaveLength(40);
    expect(largeListMarkup).toContain('value="item-39"');
    expect(largeListMarkup).toContain("ariaui-web-select-scroll-active-background");
    expect(largeListMarkup).toContain('data-select-scroll-direction="up"');
    expect(largeListMarkup).toContain('data-select-scroll-direction="down"');
    expect(largeListMarkup).not.toContain("ariaui-web-select-check");

    const groupedMarkup = previews.find((preview) => preview.variant === "grouped-with-submenu")?.markup ?? "";
    expect(groupedMarkup).toContain("<aria-select-sub");
    expect(groupedMarkup).toContain("<aria-select-sub-trigger");
    expect(groupedMarkup).toContain("Vegetables");

    const groupedMultipleMarkup = previews.find((preview) => preview.variant === "grouped-multiple-with-submenu")?.markup ?? "";
    expect(groupedMultipleMarkup).toContain('selection-mode="multiple"');
    expect(groupedMultipleMarkup).toContain('data-select-chip-value="apple"');
    expect(groupedMultipleMarkup).toContain('data-select-chip-value="banana"');
    expect(groupedMultipleMarkup).toContain("ariaui-web-select-remove");

    const multipleMarkup = previews.find((preview) => preview.variant === "multiple-uncontrolled")?.markup ?? "";
    expect(multipleMarkup).toContain('selection-mode="multiple"');
    expect(multipleMarkup).toContain('default-value="apple,banana,orange,carrot"');
    expect(multipleMarkup).toContain('data-select-overflow-limit="2"');
    expect(multipleMarkup).toContain('data-select-chip-remove="false"');
    expect(multipleMarkup).toContain("ariaui-web-select-chip");
    expect(multipleMarkup.match(/class="ariaui-web-select-chip"/g)).toHaveLength(2);
    expect(multipleMarkup).not.toContain("ariaui-web-select-remove");
    expect(multipleMarkup).toContain('<span class="ariaui-web-select-overflow-count" aria-label="2 more selected">+2</span>');
    expect(multipleMarkup).not.toContain("ariaui-web-select-overflow-badge");
  });

  it("keeps the generated select live examples behaviorally interactive", () => {
    defineSelectElements();
    const previews = selectExamplePreviews(readDoc("components/select.md"));
    document.body.innerHTML = previews
      .map((preview) => '<div class="' + preview.className + '" data-component="select" data-example-variant="' + preview.variant + '">\n' + preview.markup + "\n</div>")
      .join("\n");

    const roots = Array.from(document.querySelectorAll("aria-select")) as RuntimeSelectElement[];
    const uncontrolled = roots[0] ?? null;
    const disabled = roots[1] ?? null;
    const withIcon = roots[2] ?? null;
    const largeList = roots[3] ?? null;
    const grouped = roots[4] ?? null;
    const groupedMultiple = roots[5] ?? null;
    const multiple = roots[6] ?? null;
    const scrollArea = roots[8] ?? null;

    expect(roots).toHaveLength(9);
    installSelectExamples(document);
    syncSelectExamples(document);
    expect(uncontrolled?.value).toBe("blueberry");
    const uncontrolledTrigger = uncontrolled?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const uncontrolledContent = uncontrolled?.querySelector("aria-select-content") as RuntimeSelectElement | null;
    const uncontrolledTriggerLabel = uncontrolledTrigger?.querySelector("[data-select-trigger-label]");
    const apple = uncontrolled?.querySelector("aria-select-option[value='apple']") as RuntimeSelectElement | null;

    expect(uncontrolledTrigger?.getAttribute("role")).toBe("combobox");
    expect(uncontrolledTrigger?.getAttribute("aria-expanded")).toBe("false");
    expect(uncontrolledTrigger?.getAttribute("data-has-value")).toBe("true");
    expect(uncontrolledContent?.hidden).toBe(true);

    uncontrolledTrigger?.click();
    expect(uncontrolledContent?.hidden).toBe(false);
    expect(uncontrolledTrigger?.getAttribute("aria-controls")).toBe(uncontrolledContent?.id);
    apple?.click();
    expect(uncontrolled?.value).toBe("apple");
    syncSelectExamples(document);
    expect(uncontrolledTriggerLabel?.textContent).toBe("Apple");
    expect(uncontrolledContent?.hidden).toBe(true);

    const disabledTrigger = disabled?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    disabledTrigger?.click();
    expect(disabled?.open).toBe(false);

    const withIconTrigger = withIcon?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const withIconTriggerLabel = withIconTrigger?.querySelector("[data-select-trigger-label]");
    const bar = withIcon?.querySelector("aria-select-option[value='bar']") as RuntimeSelectElement | null;
    const barIconPath = bar?.querySelector("[data-select-option-icon] path");
    withIconTrigger?.click();
    bar?.click();
    expect(withIcon?.value).toBe("bar");
    syncSelectExamples(document);
    expect(withIconTriggerLabel?.textContent).toBe("Bar");
    expect(withIconTrigger?.querySelector("[data-select-trigger-icon] path")?.getAttribute("d")).toBe(barIconPath?.getAttribute("d"));

    const largeListTrigger = largeList?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const largeListContent = largeList?.querySelector("aria-select-content") as RuntimeSelectElement | null;
    const largeListTriggerLabel = largeListTrigger?.querySelector("[data-select-trigger-label]");
    const largeListOptions = Array.from(largeList?.querySelectorAll(".ariaui-web-select-scroll-option") ?? []) as RuntimeSelectElement[];
    const scrollDownButton = largeList?.querySelector("[data-select-scroll-direction='down']") as HTMLButtonElement | null;
    expect(largeList?.value).toBe("item-3");
    expect(largeListOptions).toHaveLength(40);
    expect(largeListOptions[3]?.getAttribute("data-scroll-active")).toBe("true");
    largeListTrigger?.click();
    scrollDownButton?.click();
    expect(largeList?.value).toBe("item-4");
    syncSelectExamples(document);
    expect(largeListTriggerLabel?.textContent).toBe("Item 4");
    expect(largeListOptions[4]?.getAttribute("data-scroll-active")).toBe("true");
    expect(largeListContent?.hidden).toBe(false);

    const groupedTrigger = grouped?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const subTrigger = grouped?.querySelector("aria-select-sub-trigger") as RuntimeSelectElement | null;
    const subContent = grouped?.querySelector("aria-select-sub-content") as RuntimeSelectElement | null;
    const groupedSubOptions = Array.from(grouped?.querySelectorAll("aria-select-sub-content aria-select-option") ?? []) as RuntimeSelectElement[];
    groupedTrigger?.click();
    subTrigger?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    expect(subContent?.hidden).toBe(false);
    expect(subTrigger?.getAttribute("data-active")).toBe("true");
    expect(groupedSubOptions.map((option) => option.getAttribute("data-active"))).toEqual(["false", "false"]);
    expect(groupedSubOptions.map((option) => option.getAttribute("data-state"))).toEqual(["unchecked", "unchecked"]);
    expect(groupedSubOptions.map((option) => option.getAttribute("aria-selected"))).toEqual(["false", "false"]);
    expect(subContent?.getAttribute("aria-activedescendant")).toBe(null);

    subTrigger?.click();
    expect(subContent?.hidden).toBe(false);
    expect(document.activeElement).toBe(grouped?.querySelector("aria-select-sub-content aria-select-option"));
    groupedSubOptions[0]?.click();
    syncSelectExamples(document);
    expect(grouped?.value).toBe("carrot");
    expect(groupedSubOptions[0]?.getAttribute("data-state")).toBe("checked");

    const groupedMultipleContent = groupedMultiple?.querySelector("aria-select-content") as RuntimeSelectElement | null;
    const groupedMultipleAppleRemove = groupedMultiple?.querySelector(".ariaui-web-select-chip[data-select-chip-value='apple'] .ariaui-web-select-remove") as HTMLElement | null;
    expect(groupedMultiple?.value).toBe("apple,banana");
    groupedMultipleAppleRemove?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    syncSelectExamples(document);
    expect(groupedMultiple?.value).toBe("banana");
    expect(Array.from(groupedMultiple?.querySelectorAll(".ariaui-web-select-chip") ?? []).map((chip) => chip.textContent?.trim())).toEqual(["Banana×"]);
    expect(groupedMultipleContent?.hidden).toBe(true);
    expect(groupedMultiple?.open).toBe(false);

    const multipleTrigger = multiple?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const potato = multiple?.querySelector("aria-select-option[value='potato']") as RuntimeSelectElement | null;
    multipleTrigger?.click();
    potato?.click();
    expect(multiple?.value).toBe("apple,banana,orange,carrot,potato");
    syncSelectExamples(document);
    expect(Array.from(multiple?.querySelectorAll(".ariaui-web-select-chip") ?? []).map((chip) => chip.textContent?.trim())).toEqual(["Apple", "Banana"]);
    expect(multiple?.querySelector(".ariaui-web-select-remove")).toBe(null);
    expect(multiple?.querySelector(".ariaui-web-select-overflow-count")?.textContent).toBe("+3");
    expect(multiple?.querySelector(".ariaui-web-select-overflow-count")?.getAttribute("aria-label")).toBe("3 more selected");
    expect(multiple?.querySelector(".ariaui-web-select-overflow-badge")).toBe(null);
    expect(multiple?.open).toBe(true);

    const scrollAreaTrigger = scrollArea?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const scrollAreaContent = scrollArea?.querySelector("aria-select-content") as RuntimeSelectElement | null;
    const scrollAreaTriggerLabel = scrollAreaTrigger?.querySelector("[data-select-trigger-label]");
    const scrollAreaOptions = Array.from(scrollArea?.querySelectorAll(".ariaui-web-select-scroll-option") ?? []) as RuntimeSelectElement[];
    scrollAreaTrigger?.click();
    const scrollAreaArrowDown = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
    scrollAreaContent?.dispatchEvent(scrollAreaArrowDown);
    expect(scrollAreaArrowDown.defaultPrevented).toBe(true);
    expect(scrollArea?.value).toBe("item-4");
    expect(scrollAreaTriggerLabel?.textContent).toBe("Item 4");
    expect(scrollAreaOptions[4]?.getAttribute("data-scroll-active")).toBe("true");
    expect(scrollAreaOptions[4]?.getAttribute("data-active")).toBe("true");
    expect(scrollAreaContent?.getAttribute("aria-activedescendant")).toBe(scrollAreaOptions[4]?.id);
    expect(scrollAreaContent?.hidden).toBe(false);

    const scrollAreaArrowUp = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true });
    scrollAreaContent?.dispatchEvent(scrollAreaArrowUp);
    expect(scrollAreaArrowUp.defaultPrevented).toBe(true);
    expect(scrollArea?.value).toBe("item-3");
    expect(scrollAreaTriggerLabel?.textContent).toBe("Item 3");
    expect(scrollAreaOptions[3]?.getAttribute("data-scroll-active")).toBe("true");
    expect(scrollAreaOptions[3]?.getAttribute("data-active")).toBe("true");
    expect(scrollAreaContent?.getAttribute("aria-activedescendant")).toBe(scrollAreaOptions[3]?.id);
    expect(scrollAreaContent?.hidden).toBe(false);

    document.body.replaceChildren();
    syncSelectExampleScrollLock(document);
  });

  it("keeps select scroll-area examples scrollable with mouse wheel input", async () => {
    defineSelectElements();
    document.body.replaceChildren();
    syncSelectExampleScrollLock(document);

    const preview = selectExamplePreviews(readDoc("components/select.md"))
      .find((candidate) => candidate.variant === "large-list-scroll-area");
    expect(preview).toBeDefined();
    document.body.innerHTML = '<div class="' + preview?.className + '" data-component="select" data-example-variant="' + preview?.variant + '">\n' + preview?.markup + "\n</div>";

    const root = document.querySelector("aria-select") as RuntimeSelectElement | null;
    const trigger = root?.querySelector("aria-select-trigger") as RuntimeSelectElement | null;
    const triggerLabel = trigger?.querySelector("[data-select-trigger-label]");
    expect(root).not.toBe(null);

    const { options, viewport } = installSelectScrollAreaTestLayout(root as HTMLElement);
    installSelectExamples(document);
    syncSelectExamples(document);
    expect(viewport.scrollTop).toBe(64);

    trigger?.click();
    syncSelectExamples(document);
    await flushSelectExampleFrame();

    const wheel = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 96 });
    viewport.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);

    viewport.scrollTop = 160;
    viewport.dispatchEvent(new Event("scroll"));
    await flushSelectExampleFrame();
    await flushSelectExampleFrame();

    expect(viewport.scrollTop).toBe(160);
    expect(root?.value).toBe("item-6");
    expect(triggerLabel?.textContent).toBe("Item 6");
    expect(options[6]?.getAttribute("data-scroll-active")).toBe("true");
    expect(options[6]?.getAttribute("data-active")).not.toBe("true");

    document.body.replaceChildren();
    syncSelectExampleScrollLock(document);
  });

  it("keeps select live example styles scoped to the select docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="select"]');
    expect(style).toContain(".ariaui-web-select-trigger");
    expect(style).toContain(".ariaui-web-select-content");
    expect(style).toContain(".ariaui-web-select-option");
    expect(style).toContain(".ariaui-web-select-option[data-state=\"checked\"]");
    expect(style).toContain(".ariaui-web-select-option:not([data-state=\"checked\"]) .ariaui-web-select-check");
    expect(style).toContain(".ariaui-web-select-sub-trigger");
    expect(style).toContain(".ariaui-web-select-chip");
    expect(style).toContain(".ariaui-web-select-scroll-viewport");
    expect(style).toContain(".ariaui-web-select-scroll-viewport::before");
    expect(style).toContain(".ariaui-web-select-scroll-option[data-scroll-active=\"true\"]");
    expect(style).toContain("--ariaui-web-select-primary-foreground");
    expect(style).toContain(".ariaui-web-select-option:hover,");
    expect(style).toContain(".ariaui-web-select-sub-trigger:hover");
    expect(style).toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-combobox-trigger');
    expect(style).toContain('.ariaui-web-preview[data-component="select"] .ariaui-web-select-content[data-side]');
    expect(style).toContain('.ariaui-web-preview[data-component="select"] .ariaui-web-select-sub-content[data-side]');
    expect(style).toContain('.ariaui-web-preview[data-component="select"] .ariaui-web-select-sub-content[data-side] {\n  width: 12.5rem;\n  margin: 0;');
    expect(style).toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-selection-group');
    expect(style).toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-tag-group');
    expect(style).toContain("grid-template-columns: max-content max-content max-content;");
    expect(style).toContain("column-gap: 0.25rem;");
    expect(style).toContain("justify-content: start;");
    expect(style).toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-chip');
    expect(style).toContain("justify-self: start;");
    expect(style).toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-overflow-count');
    expect(style).toContain("width: max-content;");
    expect(style).toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-combobox-input');
    expect(style).toContain("justify-content: center;");
    expect(style).not.toContain('[data-example-variant="multiple-uncontrolled"] .ariaui-web-select-chip,\n.ariaui-web-preview[data-component="select"][data-example-variant="multiple-uncontrolled"] .ariaui-web-select-overflow-count');
    expect(style).not.toContain("ariaui-web-select-overflow-badge");
    expect(style).not.toContain('.ariaui-web-select-sub-trigger[data-active="true"],');
    expect(style).not.toContain('.ariaui-web-select-option:not([data-state="checked"])[data-active="true"],');
    expect(style).not.toContain('.ariaui-web-select-option:not([data-state="checked"]):hover,');
    expect(style).not.toContain('.ariaui-web-select-option[data-active="true"],');
    expect(style).not.toContain('[data-example-variant="grouped-with-submenu"] .ariaui-web-select-option[data-state="checked"]');
    expect(style).not.toContain(".ariaui-web-select-option[data-state=\"checked\"],");
    expect(style).not.toContain("data-select-submenu-has-value");
  });

  it("flips select example panels before they overflow the viewport", () => {
    const rootPosition = computeSelectExamplePosition(
      { top: 560, right: 300, bottom: 596, left: 100, width: 200, height: 36 },
      { width: 200, height: 180 },
      { width: 800, height: 640 },
    );
    const subPosition = computeSelectExamplePosition(
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

  it("freezes and restores document scrolling while a select docs example panel is open", () => {
    document.body.replaceChildren();
    syncSelectExampleScrollLock(document);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "scroll";
    document.body.innerHTML = '<div class="ariaui-web-preview" data-component="select"><aria-select open></aria-select></div>';

    syncSelectExampleScrollLock(document);

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.dataset.ariauiWebSelectScrollLocked).toBe("true");

    document.querySelector("aria-select")?.removeAttribute("open");
    syncSelectExampleScrollLock(document);

    expect(document.documentElement.style.overflow).toBe("auto");
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.documentElement.dataset.ariauiWebSelectScrollLocked).toBeUndefined();

    document.body.replaceChildren();
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
  });

  it("freezes and restores document scrolling while a calendar month/year select panel is open", () => {
    document.body.replaceChildren();
    syncSelectExampleScrollLock(document);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "scroll";
    document.body.innerHTML = '<div class="ariaui-web-preview" data-component="calendar"><aria-calendar><aria-select data-calendar-select="month" open></aria-select></aria-calendar></div>';

    syncSelectExampleScrollLock(document);

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.dataset.ariauiWebSelectScrollLocked).toBe("true");

    document.querySelector("aria-select")?.removeAttribute("open");
    syncSelectExampleScrollLock(document);

    expect(document.documentElement.style.overflow).toBe("auto");
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.documentElement.dataset.ariauiWebSelectScrollLocked).toBeUndefined();

    document.body.replaceChildren();
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
  });

  it("installs select live example trigger-value syncing and overflow-aware positioning", () => {
    const theme = readDoc(".vitepress/theme/index.ts");
    const helper = readDoc(".vitepress/theme/select-examples.ts");

    expect(theme).toContain('import { installSelectExamples } from "./select-examples";');
    expect(theme).toContain("installSelectExamples();");
    expect(helper).toContain("syncSelectExamples");
    expect(helper).toContain("syncSelectExampleScrollLock");
    expect(helper).toContain("computeSelectExamplePosition");
    expect(helper).toContain("positionSelectExampleContent");
    expect(helper).toContain("positionSelectExampleSubContent");
    expect(helper).toContain("handleSelectScrollAreaKeyDown");
    expect(helper).toContain("setSelectScrollAreaKeyboardActiveOption");
    expect(helper).toContain("isSelectScrollAreaViewportScroll");
    expect(helper).toContain("data-select-trigger-label");
    expect(helper).toContain("data-select-trigger-icon");
    expect(helper).toContain("data-select-overflow-limit");
    expect(helper).toContain("data-select-chip-remove");
    expect(helper).toContain("ariaui-web-select-overflow-count");
    expect(helper).not.toContain("ariaui-web-select-overflow-badge");
    expect(helper).toContain("data-select-chip-value");
    expect(helper).toContain(".ariaui-web-select-remove");
    expect(helper).toContain("selectScrollAreaViewport");
    expect(helper).toContain("data-select-scroll-direction");
    expect(helper).toContain("data-scroll-active");
  });

  it("keeps hidden preview content visually hidden", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain(".ariaui-web-preview [hidden]");
    expect(style).toContain("display: none !important;");
    expect(style).not.toContain("ariaui-web-accordion-root");
    expect(style).not.toContain("ariaui-web-accordion-trigger");
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
    const motionPreview = previews.find((preview) => preview.variant === "framer-motion")?.markup ?? "";
    expect(motion?.value).toBe("accessible");
    expect(motionContents.every((content) => content.hasAttribute("force-mount"))).toBe(true);
    expect(motionPreview).not.toContain("hidden force-mount");
    expect(motionContents.map((content) => content.hidden)).toEqual([false, false, false]);

    const motionTriggers = Array.from(motion?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    motionTriggers[0]?.click();
    expect(motion?.value).toBe("");
    expect(motionContents[0]?.hidden).toBe(false);
    expect(motionContents[0]?.getAttribute("data-state")).toBe("closed");

    motionTriggers[1]?.click();
    expect(motion?.value).toBe("styled");
    expect(motionContents[1]?.hidden).toBe(false);
    expect(motionContents[1]?.getAttribute("data-state")).toBe("open");
    expect(motionContents[0]?.getAttribute("data-state")).toBe("closed");

    document.body.replaceChildren();
  });

  it("keeps the position docs structured like the source Aria UI position page", () => {
    const doc = readDoc("components/position.md");

    expect(doc).toContain("A low-level utility for computing floating element coordinates.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## API Reference",
    ]);
    expectHeadingsInOrder(doc, [
      "### Position",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders the source Position utility example as a live preview", () => {
    const doc = readDoc("components/position.md");
    const previews = positionExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual(["default"]);
    expect(previews[0]?.className).toContain("ariaui-web-preview");
    expect(previews[0]?.markup).toContain("Reference");
    expect(previews[0]?.markup).toContain("Click button to compute position");
    expect(previews[0]?.markup).toContain("Get Position");
    expect(previews[0]?.markup).toContain("Floating element");
    expect(doc).toContain('import { computePosition } from "@ariaui-web/position";');
    expect(doc).not.toContain("Position is a utility package.");
  });

  it("keeps the Hover Card docs structured like the source AriaUI page", () => {
    const doc = readDoc("components/hover-card.md");
    expect(doc).toContain("# Hover Card");
    expect(doc).toContain(
      "A headless, accessible hover card for showing rich preview content when a trigger is hovered or focused.",
    );
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, ["### Hover Card", "### Framer Motion"]);
    expect(doc).toContain("@nextjs");
    expect(doc).toContain("The React Framework - created and maintained by @vercel.");
    expect(doc).toContain("Joined December 2024");
    expect(doc).toContain("<aria-hover-card");
    expect(doc).toContain("<aria-hover-card-trigger");
    expect(doc).toContain("<aria-hover-card-content");
    expect(doc).toContain("<aria-avatar");
    expect(doc).not.toContain('data-example-part="Root">Root</aria-hover-card>');
  });

  it("keeps Hover Card examples source-styled and token backed", () => {
    const doc = readDoc("components/hover-card.md");
    const style = readDoc(".vitepress/theme/style.css");
    expect(doc.match(/data-component="hover-card"/g)).toHaveLength(2);
    expect(doc).toContain('data-example-variant="default"');
    expect(doc).toContain('data-example-variant="framer-motion"');
    expect(doc).toContain(
      "w-80 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md",
    );
    expect(style).toContain('.ariaui-web-preview[data-component="hover-card"]');
    expect(style).toContain("var(--vp-c-bg)");
    expect(style).toContain("var(--vp-c-divider)");
    expect(style).toContain("var(--vp-c-text-1)");
  });
});
