# Testing

Each package includes unit tests generated before the implementation surface:

- `__test__/<package>.test.ts` validates runtime behavior or utility helpers
- `__test__/component.spec.test.ts` validates the package spec file against `componentSpec`
- root `pnpm test` runs all package tests with Vitest and jsdom

This keeps package development TDD-friendly: extend the package spec, add the expected test, then deepen the implementation until the package passes.
