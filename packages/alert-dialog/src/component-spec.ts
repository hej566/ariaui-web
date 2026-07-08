export const componentSpec = {
  "kind": "component",
  "name": "AlertDialog",
  "slug": "alert-dialog",
  "packageName": "@ariaui-web/alert-dialog",
  "description": "Primary sources: 1. WAI-ARIA APG Alert and Message Dialogs: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/ 2. Radix Alert Dialog: https://www.radix-ui.com/primitives/docs/components/alert-dialog",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-alert-dialog",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Action",
      "tagName": "aria-alert-dialog-action",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "Cancel",
      "tagName": "aria-alert-dialog-cancel",
      "defaultRole": "button",
      "defaultAttributes": {
        "data-alert-dialog-cancel": ""
      }
    },
    {
      "name": "Content",
      "tagName": "aria-alert-dialog-content",
      "defaultRole": null,
      "defaultAttributes": {
        "data-alert-dialog-content": ""
      }
    },
    {
      "name": "Description",
      "tagName": "aria-alert-dialog-description",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Icon",
      "tagName": "aria-alert-dialog-icon",
      "defaultRole": null,
      "defaultAttributes": {
        "aria-hidden": "true"
      }
    },
    {
      "name": "Overlay",
      "tagName": "aria-alert-dialog-overlay",
      "defaultRole": "presentation",
      "defaultAttributes": {}
    },
    {
      "name": "Portal",
      "tagName": "aria-alert-dialog-portal",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Title",
      "tagName": "aria-alert-dialog-title",
      "defaultRole": "heading",
      "defaultAttributes": {
        "aria-level": "2"
      }
    },
    {
      "name": "Trigger",
      "tagName": "aria-alert-dialog-trigger",
      "defaultRole": "button",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-describedby",
    "aria-hidden",
    "aria-labelledby",
    "aria-level",
    "aria-modal",
    "data-alert-dialog-cancel",
    "data-alert-dialog-content",
    "data-disabled",
    "data-placeholder",
    "data-state",
    "id",
    "open",
    "required",
    "role"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/alert-dialog/readme.md",
    "coverage": {
      "sourceSections": 16,
      "coveredSections": 16,
      "requirements": 156
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document describes the current behavior of `@ariaui-web/alert-dialog` as implemented in this package.",
          "Primary sources:",
          "WAI-ARIA APG Alert and Message Dialogs: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/",
          "Radix Alert Dialog: https://www.radix-ui.com/primitives/docs/components/alert-dialog",
          "APG `alertdialog` behavior is the design target. Where the current implementation differs, this document records the current package contract rather than the ideal target."
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/alert-dialog` is an interruptive, modal confirmation dialog for important actions.",
          "It is not a passive inline callout and it is not a generic non-modal dialog.",
          "Package goals:",
          "require immediate user attention",
          "prevent interaction outside the alert dialog while open",
          "announce urgent context and consequences clearly",
          "move focus into the dialog when it opens",
          "restore focus appropriately when it closes"
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exposes a composable part structure modeled after Radix Alert Dialog:",
          "`Root`",
          "`Trigger`",
          "`Portal`",
          "`Overlay`",
          "`Content`",
          "`Title`",
          "`Description`",
          "`Icon`",
          "`Action`",
          "`Cancel`",
          "No additional public aliases are defined in the current implementation."
        ]
      },
      {
        "title": "Open State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The component supports both controlled and uncontrolled state.",
          "Public API:",
          "`open?: boolean`",
          "`defaultOpen?: boolean`",
          "`onOpenChange?: (open: boolean) => void`",
          "Behavior:",
          "`Root` is the source of truth for open state",
          "`Trigger` opens the alert dialog",
          "`Action` and `Cancel` close the alert dialog unless prevented by composed user handlers",
          "`Escape` closes the dialog unless prevented by the component contract",
          "when closed, modal content is removed from the active interaction tree"
        ]
      },
      {
        "title": "Modal Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "While open:",
          "the alert dialog is modal",
          "background content is marked inert by traversing ancestor siblings from the content node",
          "viewport scrolling is locked by applying `overflow: hidden` to both `document.body` and `document.documentElement`",
          "pointer interaction outside the dialog does not activate background controls",
          "focus cannot escape the dialog with normal keyboard navigation",
          "outside-tree inerting is reference-counted, so shared background elements remain inert until the last open alert dialog that claimed them closes",
          "viewport scroll locking is reference-counted, so the original overflow styles are restored only after the last open alert dialog closes",
          "While closed:",
          "portal, overlay, and content may be unmounted by default",
          "`forceMount` may keep portal/overlay/content mounted for animation or measurement use cases",
          "`native composition` may slot overlay/content attributes/properties onto a custom host such as a Framer Motion element"
        ]
      },
      {
        "title": "Roles, Labels, and ARIA",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Open-state semantics:",
          "dialog container exposes `role=\"alertdialog\"`",
          "dialog container exposes `aria-modal=\"true\"`",
          "dialog container is labelled by `Title`",
          "dialog container is described by `Description` when present",
          "Part behavior:",
          "`Title` provides the accessible name source for the dialog",
          "`Description` provides additional consequence/context text",
          "`Title` and `Description` support `native composition` while preserving ID registration",
          "`Icon` renders decorative icon content with `aria-hidden=\"true\"`",
          "`Action` and `Cancel` are interactive buttons",
          "ID linkage implementation:",
          "`Title` and `Description` generate stable IDs with `@ariaui-web/utils` `useId`",
          "`Title` and `Description` register their IDs through `ContentContext`",
          "registration currently happens during render, and unregister happens in `useIsomorphicLayoutEffect` cleanup",
          "`Content` syncs `aria-labelledby` and `aria-describedby` onto the dialog element via `useIsomorphicLayoutEffect`",
          "multiple mounted `Title` parts concatenate into `aria-labelledby`",
          "multiple mounted `Description` parts concatenate into `aria-describedby`",
          "when one of several registered titles or descriptions unmounts, the remaining IDs stay linked",
          "`Title` native custom element defaults to `aria-level=\"2\"` while preserving `role=\"heading\"`.",
          "`Icon` native custom element exposes `aria-hidden=\"true\"`.",
          "`Content` native custom element exposes `data-alert-dialog-content`.",
          "`Cancel` native custom element exposes `data-alert-dialog-cancel`."
        ]
      },
      {
        "title": "Focus Management",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Opening behavior:",
          "focus moves into the alert dialog when it opens",
          "default initial focus should land on the least destructive action when the dialog presents a destructive choice (prefers `Cancel` over `Action`)",
          "`onOpenAutoFocus` may prevent the default initial focus move",
          "Open-state behavior:",
          "tab order is trapped within the modal dialog via `@ariaui-web/focus-scope` (`useFocusScope` with `loop` and `trapped`)",
          "`Tab` and `Shift+Tab` cycle within focusable descendants",
          "Closing behavior:",
          "focus returns to the trigger when one is present",
          "when no trigger is present, focus restore falls back to `@ariaui-web/focus-scope` and attempts to return focus to the previously focused element",
          "`onCloseAutoFocus` may prevent the default focus restoration",
          "viewport scroll styles are restored to their pre-open values after the last open alert dialog closes"
        ]
      },
      {
        "title": "Keyboard Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Supported:",
          "`Enter` activates the focused action button",
          "`Space` activates the focused button",
          "`Escape` closes the alert dialog",
          "`Tab` and `Shift+Tab` remain trapped within the open dialog",
          "Not in scope:",
          "no listbox/menu-style arrow-key roving model is required",
          "no typeahead behavior is required"
        ]
      },
      {
        "title": "Pointer Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Supported:",
          "clicking the trigger opens the dialog",
          "clicking `Action` closes the dialog after the action runs unless prevented",
          "clicking `Cancel` closes the dialog unless prevented",
          "Current behavior:",
          "pointer interaction outside the content does not interact with underlying UI",
          "outside pointer interaction is blocked by inert background content rather than by a dedicated outside-click dismiss handler"
        ]
      },
      {
        "title": "Action Semantics",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Action`:",
          "represents the affirmative or destructive confirmation path",
          "closes the dialog by default after activation unless prevented",
          "`Cancel`:",
          "represents the safe dismissal path",
          "closes the dialog by default",
          "should be present when the dialog requests confirmation for a potentially destructive action"
        ]
      },
      {
        "title": "Portal and Layering",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`Portal` groups overlay/content under a native custom element host rather than relocating DOM nodes.",
          "content and overlay stay inside the `Portal` host when composed inside `Portal`",
          "`Portal` does not expose a `container` attribute in the native custom element contract; consumers choose DOM placement by placing the `aria-alert-dialog-portal` host.",
          "`Portal` accepts `force-mount` to keep children mounted while the dialog is closed",
          "during server-rendered HTML, `Portal` children remain inline so open dialog content exists in authored DOM order",
          "in the browser, the `Portal` host stays where authored and coordinates state for its child custom elements",
          "layering order must keep overlay behind content and above background content",
          "nested overlays/focus scopes are not explicitly coordinated beyond the underlying focus scope and inert logic"
        ]
      },
      {
        "title": "Data Attributes",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package should expose state metadata consistent with the rest of the design system and Radix-style expectations.",
          "Minimum contract when relevant:",
          "`data-state=\"open|closed\"` on stateful parts such as `Trigger`, `Overlay`, and `Content`",
          "`data-state`, dialog ARIA, focus-scope refs, and inert markers are applied to the slotted host when `native composition` is used",
          "Optional state reflection where supported:",
          "`data-disabled`",
          "`data-placeholder`",
          "ARIA and `data-*` state must remain synchronized at every transition."
        ]
      },
      {
        "title": "Consumer Event Composition",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Consumer handlers are additive:",
          "user-provided handlers run alongside internal handlers",
          "internal open/close/focus behavior remains authoritative unless the consumer explicitly prevents default where supported",
          "Observable ordering:",
          "state callbacks should fire before teardown side effects that remove the content tree"
        ]
      },
      {
        "title": "SSR Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "If `defaultOpen` is used during SSR:",
          "the server-rendered tree must reflect the open state (role, id, content text)",
          "`aria-labelledby` and `aria-describedby` are not present in the static SSR output because they are applied in `useIsomorphicLayoutEffect` after child registration",
          "hydration must not change the open/closed state unexpectedly"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests under `packages/alert-dialog/__test__` cover:",
          "`role=\"alertdialog\"` and `aria-modal=\"true\"` on open content.",
          "`Title` and `Description` labelling linkage.",
          "Controlled and uncontrolled open-state behavior.",
          "Trigger opens the dialog.",
          "`Action` and `Cancel` close behavior.",
          "`Escape` dismissal.",
          "Focus moves into the dialog on open.",
          "Focus is trapped while open.",
          "Focus returns to the trigger on close.",
          "Overlay/content mounting and optional `forceMount`.",
          "Portal rendering behavior in the client and inline SSR output when composed through `Portal`.",
          "`data-state` synchronization.",
          "Multiple `Title` / `Description` ID concatenation.",
          "`preventDefault()` on `Action` / `Cancel` preserving the open state.",
          "Reference-counted inerting across multiple open dialogs.",
          "Viewport scroll locking while open, including restoration of prior overflow styles after the last open dialog closes.",
          "Overlay and Content slot attributes/properties onto custom hosts with `native composition` for animation composition.",
          "Portal `container` and `forceMount` behavior.",
          "Title and Description slot attributes/properties onto custom hosts with `native composition`.",
          "`onOpenAutoFocus` and `onCloseAutoFocus` cancellation."
        ]
      },
      {
        "title": "Change Control",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Behavior or API changes must update, in order:",
          "This spec file.",
          "Unit tests for this package.",
          "Implementation.",
          "Docs examples and visual interaction tests when present."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
