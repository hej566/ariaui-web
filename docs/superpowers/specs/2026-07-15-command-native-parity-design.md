# Command Native Parity Design

## Goal

Refactor `@ariaui-web/command` so its browser-native custom elements match the behavior, spec coverage, package tests, docs page structure, and live example experience of the source AriaUI `@ariaui/command` package.

## Scope

This work applies only to the Command package and its documentation surfaces:

- `packages/command`
- `scripts/generate-from-ariaui.mjs`, only where required to keep generated Command artifacts stable
- `web/doc/docs/components/command.md`
- `web/doc/docs/.vitepress/theme/index.ts`
- `web/doc/docs/.vitepress/theme/style.css`
- `web/doc/docs/.vitepress/theme/command-examples.ts`, only if a docs helper is needed for example state display
- `web/doc/__test__/docs.test.ts`

The package name stays `@ariaui-web/command`, the package directory stays `packages/command`, and the docs slug stays `command`.

## Source Contract

The source package is `/home/neo/Projects/ariaui/packages/command`. The native package must preserve the user-visible behavior from:

- `/home/neo/Projects/ariaui/packages/command/readme.md`
- `/home/neo/Projects/ariaui/packages/command/__test__/command.test.tsx`
- `/home/neo/Projects/ariaui/packages/command/src/*`
- `/home/neo/Projects/ariaui/web/doc/src/app/docs/components/command/page.md`
- `/home/neo/Projects/ariaui/web/doc/src/components/command/*`
- `/home/neo/Projects/ariaui/web/doc/src/markdoc/partials/command/*`

React-only APIs are adapted to browser-native custom element APIs. The package must not introduce framework-specific runtime dependencies.

## Native API Design

`aria-command` owns the Command state:

- selected value
- search value
- active option id and active option value
- registered options and groups in DOM order
- filtering and visibility
- keyboard navigation and selection

State is exposed through attributes, properties, and DOM events:

- `value` and `default-value` for selected command state
- `search-value` and `default-search-value` for filter text
- `should-filter`, `loop`, `disable-pointer-selection`, and `label`
- `filter` property for custom filter functions
- `onValueChange` and `onSearchValueChange` properties for callback parity
- option `onSelect` property for option-level callback parity
- `valuechange` event with `{ value }`
- `searchvaluechange` event with `{ value }`
- `commandselect` event with `{ value, option }`

Boolean attributes are accepted in kebab-case and camel-case where the existing generator already supports both forms for other packages. DOM events are the durable public browser API; callback properties are convenience parity for source-style integration.

## Part Behavior

### Root

`aria-command` is the state owner and keyboard handler. It applies `tabindex="-1"` by default, creates a hidden label target for the input naming contract, and listens for bubbled keydown events from descendants.

Root keyboard handling matches the source package:

- `ArrowDown` moves to the next visible enabled option.
- `ArrowUp` moves to the previous visible enabled option.
- `Ctrl+N` and `Ctrl+J` move next.
- `Ctrl+P` and `Ctrl+K` move previous.
- `Home` moves to the first visible enabled option.
- `End` moves to the last visible enabled option.
- `Enter` selects the active option.
- IME composition and already-prevented keydown events are ignored.
- `loop` wraps navigation from end to start and start to end.

### Input

`aria-command-input` is an autonomous custom element, not a customized built-in input. It follows the existing local pattern used by input-like web components: it is focusable and editable, exposes `value`, and syncs its value to root search state.

When no nested native input exists, it uses `contenteditable="plaintext-only"` and `tabindex="0"` so it can receive text input in docs and tests. It reflects:

- `role="combobox"`
- `aria-autocomplete="list"`
- `aria-controls` pointing at content
- `aria-expanded="true"`
- `aria-activedescendant` pointing at the active option
- `aria-labelledby` pointing at the root hidden label

Typing updates root `search-value`, dispatches `searchvaluechange`, clears the active option, and resyncs filtering.

### Content

`aria-command-content` reflects:

- `role="listbox"`
- `tabindex="-1"`
- `aria-label`, defaulting to `Suggestions`
- `aria-activedescendant` when an option is active
- stable `id` for input `aria-controls`

### Option

`aria-command-option` registers with the nearest root in DOM order. It exposes:

- `role="option"`
- stable `id`
- `aria-selected`
- `aria-disabled`
- `data-value`
- `data-selected`
- `data-disabled`
- `tabindex="0"` only for the active enabled option, otherwise `-1`

Option value comes from the `value` attribute/property, then `data-value`, then trimmed text content. `keywords` may be provided as a property array or as an attribute split on commas. Hidden or disabled options do not participate in active navigation. `force-mount` keeps an option visible even when filtering would hide it.

Click selects enabled options unless the click is already prevented. Pointer movement activates options unless `disable-pointer-selection` is set on root.

### Group

`aria-command-group` registers with root and hides itself when none of its child options are visible. `force-mount` keeps the group visible and becomes the default for child options. `heading` can be supplied by attribute/property; otherwise the group uses a nested label element when present. Groups expose `role="group"` and `aria-labelledby` when a heading label is available.

### Empty

`aria-command-empty` renders only when root has at least one registered option and zero visible options after filtering. In native form, "renders" means its `hidden` state is synchronized rather than removing the element from the DOM.

### Separator

`aria-command-separator` exposes `role="separator"`. It hides while searching unless `always-render` is present.

### Loading

`aria-command-loading` exposes:

- `role="progressbar"`
- `aria-label`, defaulting to `Loading...`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- optional `aria-valuenow` from `progress`

## Filtering

The default filter matches the source package:

- trim and lowercase the search string
- empty search shows all options
- search matches if the joined `value + keywords` string contains the query
- custom filters may return boolean or number
- numeric visibility uses `score > 0`

When `should-filter="false"` is set, options remain visible regardless of search text. Searching still updates `search-value` and clears the active option.

## Docs Design

`web/doc/docs/components/command.md` must use the same page structure as the source AriaUI command page:

1. Features
2. Installation
3. Examples
4. Anatomy
5. API Reference
6. Keyboard Interactions
7. Accessibility

The live examples must use browser-native `@ariaui-web/command` custom elements while matching the source Command example style and function:

- palette shell with search icon
- search input
- Quick Actions group
- Views group
- shortcuts on quick actions
- empty-state copy
- default interactive example
- controlled example that reflects selection through native events/properties

Example styling should use VitePress CSS classes and token-backed CSS variables. Inline layout styles are avoided when classes can express the same layout.

## Generator Design

Generated Command artifacts must stay reproducible. After source package or docs additions, run:

```bash
node scripts/generate-from-ariaui.mjs
```

Then review generated changes before any hand edits. Any Command-specific generator changes must be covered by generator-backed tests in `web/doc/__test__/docs.test.ts` or package-level tests.

## Test Strategy

Implementation must follow TDD. Each behavioral change starts with a failing test that is observed failing for the expected reason.

Package tests must cover:

- native exports and helper functions
- component spec/readme alignment
- combobox/listbox anatomy
- root selected value and search value staying separate
- uncontrolled and controlled selected value
- uncontrolled and controlled search value
- input-controlled search value
- default filtering, custom filtering, keywords, and `should-filter="false"`
- Enter selection and option `onSelect`
- click selection, disabled guards, and prevented click guards
- pointer activation gated by `disable-pointer-selection`
- ArrowUp, ArrowDown, Home, End, loop, Ctrl+N/J/P/K
- IME composition and prevented keydown guards
- group hiding, forced groups, forced options
- Empty, Separator, and Loading states
- active option scrolling

Docs tests must cover:

- Command page section order and headings
- source-equivalent live example variants
- native Command markup rather than generic part preview markup
- theme installer wiring if `command-examples.ts` is added
- scoped CSS selectors for Command examples

## Visual Verification

After docs changes, launch the VitePress docs server with:

```bash
pnpm --dir web/doc dev --hostname 127.0.0.1 --port 3000
```

Run browser visual checks on `/components/command` at desktop and mobile widths:

- page renders the expected section structure
- default command example visually matches the source style
- typing filters the option list
- ArrowDown and Enter select an option
- empty state appears for unmatched search
- controlled example reflects selected state
- no horizontal overflow on mobile
- no relevant console errors

## Acceptance Criteria

- `@ariaui-web/command` remains browser-native and framework-independent.
- The package readme and `componentSpec` represent the adapted source Command contract.
- Package-level Command tests pass.
- Docs tests pass.
- Docs build passes.
- Visual/browser checks pass for the Command page.
- Generated artifacts are stable after running `node scripts/generate-from-ariaui.mjs`.
- Work remains isolated from unrelated Pagination and existing main-checkout changes.
