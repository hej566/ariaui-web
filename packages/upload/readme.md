# Upload Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/upload`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-upload` | none |
| Item | `aria-upload-item` | `listitem` |
| List | `aria-upload-list` | `list` |
| Selector | `aria-upload-selector` | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/upload/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 19 of 19 documented sections are represented after native normalization.
- Requirement lines: 88

### Scope

- This document defines the current contract for `@ariaui-web/upload`.

### Primary References

- HTML file input specification: https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)
- ARIA live regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
- ARIA button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

### Mental Model

- `@ariaui-web/upload` is a composable file-upload primitive. It wraps a native `<input type="file">` in an accessible drop zone (`Selector`), reflects selected files as a list (`List`), and exposes public action and file parts so examples do not need to read internal upload state directly.

### Part Model

- Table row: Part | Element | Role | Notes
- Table row: `Root` | `<div>` | - | Context provider; wraps `Selector` + `List`
- Table row: `Selector` | `<div>` | `button` | Drop zone; clicks through to hidden `<input type="file">`
- Table row: `List` | `<div>` | - | Emits selected files to its child render function; reports upload failures through `onError` and completions through `onSuccess`
- Table row: `Item` | `<div>` | - | Per-file row for a file emitted by `List`; owns upload lifecycle and feedback
- Table row: `Upload.AutoSubmit` | - | - | Starts upload when files are ready
- Table row: `Upload.Clear` | `<button>` | `button` | Clears all selected files
- Table row: `Upload.Submit` | `<button>` | `button` | Starts upload for selected files
- Table row: `Upload.FileName` | `<span>` | - | Renders the current item file name
- Table row: `Upload.FileSize` | `<span>` | - | Renders the current item file size
- Table row: `Upload.FileExtension` | `<span>` | - | Renders the current item file extension
- Table row: `Upload.FileStatus` | `<span>` | - | Renders ready/progress/done/error text
- Table row: `Upload.FileProgress` | `<div>` | - | Renders progress track and indicator
- Table row: `Upload.FileRemove` | `<button>` | `button` | Removes the current item file
- The hidden `<input type="file">` inside `Selector` carries `aria-label="Upload files"` for screen reader identification.

### State Machine

- `filesState` in `UploadProvider` follows this state machine:
- Code line: EMPTY -> PROCESSED (files selected)
- Code line: PROCESSED -> UPLOADING (submit triggered)
- Code line: UPLOADING -> UPLOADED (all files complete)
- Code line: any state -> EMPTY (clear all files)
- Per-file `fileState` in `Item`:
- Code line: PROCESSED -> UPLOADING -> UPLOADED
- Code line: -> ERROR
- Code line: -> ABORT

### ARIA Attribute Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Selector

- Table row: Attribute | Value
- Table row: `role` | `button`
- Table row: `tabIndex` | `0` when enabled; `-1` when disabled
- Table row: `data-disabled` | `true` when disabled

### Item and file parts

- Table row: Attribute | Value
- Table row: `data-state` | `processed`, `uploading`, `uploaded`, `error`, or `abort`
- Table row: `data-progress` | Current per-file upload progress on `Item`
- Table row: `data-value` | Current per-file upload progress on status/progress parts

### Hidden <input type="file">

- Table row: Attribute | Value
- Table row: `aria-label` | `"Upload files"`
- Table row: `multiple` | always present (multi-file)
- Table row: `disabled` | set when `Selector` is disabled

### Status live region (inside UploadProvider)

- Table row: Attribute | Value
- Table row: `role` | `status`
- Table row: `aria-live` | `polite`
- Table row: `aria-atomic` | `true`
- Table row: content | Human-readable state message (empty string when `EMPTY`)
- State -> message mapping:
- `EMPTY` -> `""` (silent)
- `PROCESSED` -> `"Files selected and ready to upload."`
- `UPLOADING` -> `"Uploading files, please wait."`
- `UPLOADED` -> `"All files uploaded successfully."`

### Keyboard Interaction Contract

- Table row: Key | Behavior
- Table row: `Enter` / `Space` | Activates `Selector` - opens native file picker
- Table row: `Tab` | Moves focus in/out of `Selector` normally
- Drag-and-drop (`onDrop`) is a pointer-only interaction; it supplements but does not replace keyboard access.

### Behavior Contract

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### File validation

- `format` attributes/properties on `Root` is a list of MIME type substrings (e.g. `["pdf", "png"]`)
- Files not matching any format string are silently excluded
- When `format` is empty or omitted, all file types are accepted

### File selection

- Files are accumulated across multiple selections (additive, not replace)
- Each file is assigned a stable UUID on selection
- An object URL is created per file for preview purposes
- `List` passes selected files to its child render function as `UploadListFile[]`
- Map the emitted array to `Item file={file}` rows; render actions such as `Upload.Clear` from the same render function when `files.length > 0`

### Object URL lifecycle

- Created: when a file is added via `handleFiles`
- Revoked: when a file is removed (`clearFile`, `clearFiles`) or when upload completes (`handleUploadedFiles`)

### Upload

- Triggered by `Upload.Submit` or `Upload.AutoSubmit`
- Each `Item` initiates its own XHR when `filesState` transitions to `UPLOADING`
- `List onError` is called once per failed file upload with `{ file, reason, status }`
- `List onSuccess` is called once per successful file upload with `{ file, status }`
- `handleUploadedFiles(id)` is called by each `Item` on XHR completion
- When all file IDs appear in `uploadedIds`, `filesState` transitions to `UPLOADED`

### Disabled behavior

- `isDisabled` on `Selector` suppresses all pointer and keyboard interaction

### Known Limitations

- Format rejection is silent - no error message is surfaced to the user when a file is excluded
- `aria-setsize` / `aria-posinset` are not set on file list items
- No `accept` attribute is set on the hidden `<input>` to pre-filter the OS file picker

### Coverage Expectations

- Tests for this package should cover:
- **Structure**: `Root`, `Selector`, `List`, `Item` render correctly; `Selector` has `role="button"`
- **Accessibility**: `axe` reports no violations; file input has `aria-label`; live region is present
- **File selection**: selecting files via input change populates the file list
- **Drag and drop**: dropping files onto `Selector` populates the file list
- **Format filtering**: files not matching `format` are excluded; all files accepted when `format` is empty
- **State transitions**: `filesState` progresses through `PROCESSED -> UPLOADING -> UPLOADED`
- **Upload callbacks**: `List onError` fires once for a failed file, even when multiple XHR error signals arrive; `onSuccess` fires once for a completed file
- **Clear**: `Upload.Clear` empties the list and resets state; `Upload.FileRemove` removes a single file
- **Disabled**: interaction is suppressed when `Selector` is disabled
- **Live region**: status message updates as `filesState` changes






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
