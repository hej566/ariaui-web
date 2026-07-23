export const componentSpec = {
  "kind": "component",
  "name": "Upload",
  "slug": "upload",
  "packageName": "@ariaui-web/upload",
  "description": "| Part | Element | Role | Notes | |---|---|---|---| | `Upload.Root` | `<div>` | - | Context provider; wraps `Selector` + `List` | | `Upload.Selector` | `<div>` | `button` | Drop zone; clicks through to hidden `<input typ",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-upload",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Item",
      "tagName": "aria-upload-item",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "List",
      "tagName": "aria-upload-list",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Selector",
      "tagName": "aria-upload-selector",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "AutoSubmit",
      "tagName": "aria-upload-auto-submit",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Clear",
      "tagName": "aria-upload-clear",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "Submit",
      "tagName": "aria-upload-submit",
      "defaultRole": "button",
      "defaultAttributes": {}
    },
    {
      "name": "FileName",
      "tagName": "aria-upload-file-name",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "FileSize",
      "tagName": "aria-upload-file-size",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "FileExtension",
      "tagName": "aria-upload-file-extension",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "FileStatus",
      "tagName": "aria-upload-file-status",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "FileProgress",
      "tagName": "aria-upload-file-progress",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "FileRemove",
      "tagName": "aria-upload-file-remove",
      "defaultRole": "button",
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "aria-1",
    "aria-atomic",
    "aria-label",
    "aria-live",
    "aria-posinset",
    "aria-setsize",
    "data-disabled",
    "data-progress",
    "data-state",
    "data-value",
    "disabled",
    "id",
    "role",
    "selected",
    "tabindex"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/upload/readme.md",
    "coverage": {
      "sourceSections": 19,
      "coveredSections": 19,
      "requirements": 88
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/upload`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "HTML file input specification: https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)",
          "ARIA live regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live",
          "ARIA button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/upload` is a composable file-upload primitive. It wraps a native `<input type=\"file\">` in an accessible drop zone (`Selector`), reflects selected files as a list (`List`), and exposes public action and file parts so examples do not need to read internal upload state directly."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Part | Element | Role | Notes",
          "Table row: `Root` | `<div>` | - | Context provider; wraps `Selector` + `List`",
          "Table row: `Selector` | `<div>` | `button` | Drop zone; clicks through to hidden `<input type=\"file\">`",
          "Table row: `List` | `<div>` | - | Emits selected files to its child render function; reports upload failures through `onError` and completions through `onSuccess`",
          "Table row: `Item` | `<div>` | - | Per-file row for a file emitted by `List`; owns upload lifecycle and feedback",
          "Table row: `Upload.AutoSubmit` | - | - | Starts upload when files are ready",
          "Table row: `Upload.Clear` | `<button>` | `button` | Clears all selected files",
          "Table row: `Upload.Submit` | `<button>` | `button` | Starts upload for selected files",
          "Table row: `Upload.FileName` | `<span>` | - | Renders the current item file name",
          "Table row: `Upload.FileSize` | `<span>` | - | Renders the current item file size",
          "Table row: `Upload.FileExtension` | `<span>` | - | Renders the current item file extension",
          "Table row: `Upload.FileStatus` | `<span>` | - | Renders ready/progress/done/error text",
          "Table row: `Upload.FileProgress` | `<div>` | - | Renders progress track and indicator",
          "Table row: `Upload.FileRemove` | `<button>` | `button` | Removes the current item file",
          "The hidden `<input type=\"file\">` inside `Selector` carries `aria-label=\"Upload files\"` for screen reader identification."
        ]
      },
      {
        "title": "State Machine",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`filesState` in `UploadProvider` follows this state machine:",
          "Code line: EMPTY -> PROCESSED (files selected)",
          "Code line: PROCESSED -> UPLOADING (submit triggered)",
          "Code line: UPLOADING -> UPLOADED (all files complete)",
          "Code line: any state -> EMPTY (clear all files)",
          "Per-file `fileState` in `Item`:",
          "Code line: PROCESSED -> UPLOADING -> UPLOADED",
          "Code line: -> ERROR",
          "Code line: -> ABORT"
        ]
      },
      {
        "title": "ARIA Attribute Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Selector",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `role` | `button`",
          "Table row: `tabIndex` | `0` when enabled; `-1` when disabled",
          "Table row: `data-disabled` | `true` when disabled"
        ]
      },
      {
        "title": "Item and file parts",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `data-state` | `processed`, `uploading`, `uploaded`, `error`, or `abort`",
          "Table row: `data-progress` | Current per-file upload progress on `Item`",
          "Table row: `data-value` | Current per-file upload progress on status/progress parts"
        ]
      },
      {
        "title": "Hidden <input type=\"file\">",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `aria-label` | `\"Upload files\"`",
          "Table row: `multiple` | always present (multi-file)",
          "Table row: `disabled` | set when `Selector` is disabled"
        ]
      },
      {
        "title": "Status live region (inside UploadProvider)",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Table row: Attribute | Value",
          "Table row: `role` | `status`",
          "Table row: `aria-live` | `polite`",
          "Table row: `aria-atomic` | `true`",
          "Table row: content | Human-readable state message (empty string when `EMPTY`)",
          "State -> message mapping:",
          "`EMPTY` -> `\"\"` (silent)",
          "`PROCESSED` -> `\"Files selected and ready to upload.\"`",
          "`UPLOADING` -> `\"Uploading files, please wait.\"`",
          "`UPLOADED` -> `\"All files uploaded successfully.\"`"
        ]
      },
      {
        "title": "Keyboard Interaction Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Table row: Key | Behavior",
          "Table row: `Enter` / `Space` | Activates `Selector` - opens native file picker",
          "Table row: `Tab` | Moves focus in/out of `Selector` normally",
          "Drag-and-drop (`onDrop`) is a pointer-only interaction; it supplements but does not replace keyboard access."
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
        "title": "File validation",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`format` attributes/properties on `Root` is a list of MIME type substrings (e.g. `[\"pdf\", \"png\"]`)",
          "Files not matching any format string are silently excluded",
          "When `format` is empty or omitted, all file types are accepted"
        ]
      },
      {
        "title": "File selection",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Files are accumulated across multiple selections (additive, not replace)",
          "Each file is assigned a stable UUID on selection",
          "An object URL is created per file for preview purposes",
          "`List` passes selected files to its child render function as `UploadListFile[]`",
          "Map the emitted array to `Item file={file}` rows; render actions such as `Upload.Clear` from the same render function when `files.length > 0`"
        ]
      },
      {
        "title": "Object URL lifecycle",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Created: when a file is added via `handleFiles`",
          "Revoked: when a file is removed (`clearFile`, `clearFiles`) or when upload completes (`handleUploadedFiles`)"
        ]
      },
      {
        "title": "Upload",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Triggered by `Upload.Submit` or `Upload.AutoSubmit`",
          "Each `Item` initiates its own XHR when `filesState` transitions to `UPLOADING`",
          "`List onError` is called once per failed file upload with `{ file, reason, status }`",
          "`List onSuccess` is called once per successful file upload with `{ file, status }`",
          "`handleUploadedFiles(id)` is called by each `Item` on XHR completion",
          "When all file IDs appear in `uploadedIds`, `filesState` transitions to `UPLOADED`"
        ]
      },
      {
        "title": "Disabled behavior",
        "sourceHeadingLevel": 3,
        "requirements": [
          "`isDisabled` on `Selector` suppresses all pointer and keyboard interaction"
        ]
      },
      {
        "title": "Known Limitations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Format rejection is silent - no error message is surfaced to the user when a file is excluded",
          "`aria-setsize` / `aria-posinset` are not set on file list items",
          "No `accept` attribute is set on the hidden `<input>` to pre-filter the OS file picker"
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "**Structure**: `Root`, `Selector`, `List`, `Item` render correctly; `Selector` has `role=\"button\"`",
          "**Accessibility**: `axe` reports no violations; file input has `aria-label`; live region is present",
          "**File selection**: selecting files via input change populates the file list",
          "**Drag and drop**: dropping files onto `Selector` populates the file list",
          "**Format filtering**: files not matching `format` are excluded; all files accepted when `format` is empty",
          "**State transitions**: `filesState` progresses through `PROCESSED -> UPLOADING -> UPLOADED`",
          "**Upload callbacks**: `List onError` fires once for a failed file, even when multiple XHR error signals arrive; `onSuccess` fires once for a completed file",
          "**Clear**: `Upload.Clear` empties the list and resets state; `Upload.FileRemove` removes a single file",
          "**Disabled**: interaction is suppressed when `Selector` is disabled",
          "**Live region**: status message updates as `filesState` changes"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/upload/__test__/upload.test.tsx",
      "../ariaui/web/doc/src/components/upload/UploadExample.tsx",
      "../ariaui/web/doc/src/components/upload/UploadDemo.tsx",
      "../ariaui/web/doc/src/components/upload/UploadApiTable.tsx",
      "../ariaui/web/doc/src/components/upload/UploadKeyboardTable.tsx"
    ],
    "sourceTestCases": 42,
    "nativeRequirements": [
      "Root, Selector, List, Item, action parts, and file metadata parts expose source-equivalent structure, state, and accessibility semantics",
      "input selection and drag-and-drop accumulate accepted files with stable IDs and object URLs while format filtering silently excludes invalid files",
      "clear and remove operations revoke object URLs, preserve unaffected files, abort active requests, and honor canceled click events",
      "manual and automatic submission transition files through processed, uploading, uploaded, error, and abort states with progress reflection",
      "list-level success and error callbacks fire once per terminal file result even when multiple XHR terminal signals arrive",
      "the root live region announces aggregate processed, uploading, and uploaded states while disabled selectors suppress interaction",
      "documentation preserves the upstream Upload, Manual Upload, and Successful Upload examples and source-equivalent Tailwind classes"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
