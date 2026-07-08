export const componentSpec = {
  "kind": "utility",
  "name": "Tsconfig",
  "slug": "tsconfig",
  "packageName": "@ariaui-web/tsconfig",
  "description": "Shared TypeScript configs for workspace packages.",
  "parts": [],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/tsconfig/readme.md",
    "coverage": {
      "sourceSections": 1,
      "coveredSections": 1,
      "requirements": 5
    },
    "sections": [
      {
        "title": "tsconfig",
        "sourceHeadingLevel": 1,
        "requirements": [
          "Shared TypeScript configs for workspace packages.",
          "`base.json` contains strict, bundler-oriented defaults that are compatible with modern TypeScript.",
          "`react-library.json` extends the base config for package declaration builds.",
          "`nextjs.json` extends the base config for Next.js apps.",
          "Consuming packages should keep path-relative options such as `include`, `exclude`, and `outDir` in their own `tsconfig.json`."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
