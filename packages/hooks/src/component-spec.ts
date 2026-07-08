export const componentSpec = {
  "kind": "utility",
  "name": "Hooks",
  "slug": "hooks",
  "packageName": "@ariaui-web/hooks",
  "description": "@ariaui-web/hooks exposes browser-native custom elements with package-level tests and a native component spec.",
  "parts": [],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/hooks",
    "coverage": {
      "sourceSections": 1,
      "coveredSections": 1,
      "requirements": 1
    },
    "sections": [
      {
        "title": "Hooks Spec",
        "sourceHeadingLevel": 1,
        "requirements": [
          "No source readme exists in @ariaui-web/hooks."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
