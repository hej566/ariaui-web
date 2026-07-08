export const componentSpec = {
  "kind": "utility",
  "name": "Keyboard",
  "slug": "keyboard",
  "packageName": "@ariaui-web/keyboard",
  "description": "@ariaui-web/keyboard exposes browser-native custom elements with package-level tests and a native component spec.",
  "parts": [],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/keyboard",
    "coverage": {
      "sourceSections": 1,
      "coveredSections": 1,
      "requirements": 1
    },
    "sections": [
      {
        "title": "Keyboard Spec",
        "sourceHeadingLevel": 1,
        "requirements": [
          "No source readme exists in @ariaui-web/keyboard."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
