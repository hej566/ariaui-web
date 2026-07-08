# ariaui-web

Browser-native Web Component packages under the `@ariaui-web` scope.

This workspace keeps package directory names under the `@ariaui-web` scope and exposes native custom elements. Each package has:

- separated source files for each component part
- `readme.md` for the native Web Component contract
- unit tests for runtime behavior and spec alignment
- VitePress documentation under `web/doc`

## Commands

```bash
pnpm install
pnpm generate
pnpm test
pnpm lint
pnpm --filter @ariaui-web/doc build
```

Generated packages: 63.
