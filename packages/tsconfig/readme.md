# Tsconfig Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/tsconfig`
- Kind: `utility`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Utility | none | none |

## Learned Native Requirements

- Learned from: `../ariaui/packages/tsconfig/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 1 of 1 documented sections are represented after native normalization.
- Requirement lines: 5

### tsconfig

- Shared TypeScript configs for workspace packages.
- `base.json` contains strict, bundler-oriented defaults that are compatible with modern TypeScript.
- `react-library.json` extends the base config for package declaration builds.
- `nextjs.json` extends the base config for Next.js apps.
- Consuming packages should keep path-relative options such as `include`, `exclude`, and `outDir` in their own `tsconfig.json`.






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
