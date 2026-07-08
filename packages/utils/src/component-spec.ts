export const componentSpec = {
  "kind": "utility",
  "name": "Utils",
  "slug": "utils",
  "packageName": "@ariaui-web/utils",
  "description": "@ariaui-web/utils exposes browser-native custom elements with package-level tests and a native component spec.",
  "parts": [],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/utils",
    "coverage": {
      "sourceSections": 1,
      "coveredSections": 1,
      "requirements": 1
    },
    "sections": [
      {
        "title": "Utils Spec",
        "sourceHeadingLevel": 1,
        "requirements": [
          "No source readme exists in @ariaui-web/utils."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
