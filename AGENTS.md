## ariaui-web

This project builds browser-native Web Component packages under the @ariaui-web scope.

Rules:
- Keep package names under the @ariaui-web scope.
- Preserve package directory names and docs slugs unless the package catalog changes.
- Prefer browser-native custom elements and separated part modules over framework-specific patterns.
- Every package must keep a readme.md file and package-level unit tests.
- Re-run `node scripts/generate-from-ariaui.mjs` after source package/doc additions, then review generated changes before editing by hand.
