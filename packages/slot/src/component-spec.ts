export const componentSpec = {
  "kind": "component",
  "name": "Slot",
  "slug": "slot",
  "packageName": "@ariaui-web/slot",
  "description": "@ariaui-web/slot exposes browser-native custom elements with package-level tests and a native component spec.",
  "parts": [
    {
      "name": "Slot",
      "tagName": "aria-slot-slot",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/slot",
    "coverage": {
      "sourceSections": 1,
      "coveredSections": 1,
      "requirements": 1
    },
    "sections": [
      {
        "title": "native composition host Spec",
        "sourceHeadingLevel": 1,
        "requirements": [
          "No source readme exists in @ariaui-web/slot."
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
