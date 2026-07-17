export const componentSpec = {
  "kind": "component",
  "name": "Disclosure",
  "slug": "disclosure",
  "packageName": "@ariaui-web/disclosure",
  "description": "Define the maintainer-facing normative contract for the disclosure package, including the supported public surface and the observable invariants that refactors must preserve.",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-disclosure",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Content",
      "tagName": "aria-disclosure-content",
      "defaultRole": "region",
      "defaultAttributes": {}
    },
    {
      "name": "Trigger",
      "tagName": "aria-disclosure-trigger",
      "defaultRole": "button",
      "defaultAttributes": {
        "aria-expanded": "false"
      }
    }
  ],
  "requirementAttributes": [
    "aria-controls",
    "aria-expanded",
    "default-open",
    "id",
    "native-composition",
    "open",
    "role",
    "value"
  ],
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/disclosure/__test__/disclosure.test.tsx"
    ],
    "sourceTestCases": 19,
    "nativeRequirements": [
      "closed-by-default content hidden from the accessibility tree",
      "default-open content visibility and aria-expanded state",
      "generated aria-controls/id relationships across multiple roots",
      "click, Enter, and Space trigger activation with prevented-event and disabled guards",
      "controlled-style `open` and `openchange` behavior",
      "type=button trigger semantics on the role=button custom element",
      "native-composition content hosts for motion examples",
      "force-mounted closed content for docs-only Framer Motion exit animation"
    ]
  },
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/disclosure/readme.md",
    "coverage": {
      "sourceSections": 39,
      "coveredSections": 39,
      "requirements": 87
    },
    "sections": [
      {
        "title": "Purpose",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Define the maintainer-facing normative contract for the disclosure package, including the supported public surface and the observable invariants that refactors must preserve."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "APG disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
        ]
      },
      {
        "title": "Requirements",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted."
        ]
      },
      {
        "title": "Requirement: Disclosure Spec Authority",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST maintain a single maintainer-facing normative contract that defines the supported public surface and the observable invariants that refactors must preserve."
        ]
      },
      {
        "title": "Scenario: Conflicting artifacts",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the package spec, tests, README, docs, or historical plans disagree",
          "**THEN** the maintainer-facing package spec is authoritative"
        ]
      },
      {
        "title": "Requirement: Open State Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST support both controlled and uncontrolled open state management."
        ]
      },
      {
        "title": "Scenario: Uncontrolled usage with defaultOpen",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure is rendered with `default-open` or `defaultopen` attributes/properties",
          "**THEN** the component manages its own open state internally",
          "**AND** the initial open state matches the `defaultOpen` value"
        ]
      },
      {
        "title": "Scenario: Controlled usage with open attributes/properties",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure is rendered with `open` attributes/properties",
          "**THEN** the component's open state is controlled by the parent",
          "**AND** state changes are communicated via the `openchange` event",
          "**AND** the component does not manage internal state"
        ]
      },
      {
        "title": "Scenario: Transitioning between controlled and uncontrolled",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure switches between controlled and uncontrolled modes",
          "**THEN** the behavior follows native Web Component's standard controllable state patterns",
          "**AND** warnings or errors follow native Web Component conventions for mode switching"
        ]
      },
      {
        "title": "Requirement: Trigger-Content Association",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST establish a programmatic association between trigger and content elements."
        ]
      },
      {
        "title": "Scenario: ARIA relationship attributes",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure is rendered",
          "**THEN** the trigger element has `aria-controls` pointing to the content element's ID",
          "**AND** the content element has an `id` attribute matching the `aria-controls` value",
          "**AND** the ID is either user-provided via the `id` attributes/properties or auto-generated"
        ]
      },
      {
        "title": "Scenario: Multiple disclosures with unique IDs",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** multiple disclosure instances are rendered without explicit IDs",
          "**THEN** each disclosure generates a unique content ID",
          "**AND** no ID collisions occur between instances"
        ]
      },
      {
        "title": "Requirement: Expanded State Communication",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST communicate the expanded/collapsed state through ARIA attributes."
        ]
      },
      {
        "title": "Scenario: Trigger reflects closed state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the disclosure is closed",
          "**THEN** the trigger has `aria-expanded=\"false\"`"
        ]
      },
      {
        "title": "Scenario: Trigger reflects open state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the disclosure is open",
          "**THEN** the trigger has `aria-expanded=\"true\"`"
        ]
      },
      {
        "title": "Scenario: State changes update aria-expanded",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the open state changes through any mechanism",
          "**THEN** the `aria-expanded` attribute updates synchronously to reflect the new state"
        ]
      },
      {
        "title": "Requirement: Content Visibility Management",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST control content visibility based on open state."
        ]
      },
      {
        "title": "Scenario: Content hidden when closed",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the disclosure is closed",
          "**THEN** the content element is not rendered in the DOM",
          "**AND** the content is not accessible to assistive technologies"
        ]
      },
      {
        "title": "Scenario: Content visible when open",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the disclosure is open",
          "**THEN** the content element is rendered in the DOM",
          "**AND** the content is accessible to assistive technologies",
          "**AND** the content has `hidden={false}` or no hidden attribute"
        ]
      },
      {
        "title": "Requirement: Content Host Composition",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST support custom content hosts for animation and composition libraries."
        ]
      },
      {
        "title": "Scenario: Content rendered with native composition",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure content is rendered with `native-composition`",
          "**THEN** the content attributes/properties are slotted onto the single child element",
          "**AND** the generated content `id` remains on that child element",
          "**AND** custom host components such as Framer Motion elements can receive disclosure content attributes/properties without leaking `native-composition` to the DOM"
        ]
      },
      {
        "title": "Requirement: Trigger Interaction",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST respond to user interactions on the trigger element."
        ]
      },
      {
        "title": "Scenario: Click toggles state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the user clicks the trigger",
          "**THEN** the open state toggles",
          "**AND** `openchange` is dispatched with the new state value"
        ]
      },
      {
        "title": "Scenario: Enter key toggles state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the trigger is focused and the user presses Enter",
          "**THEN** the open state toggles",
          "**AND** the behavior matches native button behavior"
        ]
      },
      {
        "title": "Scenario: Space key toggles state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** the trigger is focused and the user presses Space",
          "**THEN** the open state toggles",
          "**AND** the behavior matches native button behavior"
        ]
      },
      {
        "title": "Scenario: Custom onClick handlers are preserved",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a consumer provides a custom `onClick` handler on the trigger",
          "**THEN** the custom handler is called before the toggle logic",
          "**AND** the toggle behavior still executes unless prevented"
        ]
      },
      {
        "title": "Requirement: Semantic Button Role",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST expose the trigger as a semantic button-like custom element."
        ]
      },
      {
        "title": "Scenario: Trigger is a button-like custom element",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure trigger is rendered",
          "**THEN** it renders as an `aria-disclosure-trigger` custom element with `role=\"button\"`",
          "**AND** it has `type=\"button\"` to prevent form submission"
        ]
      },
      {
        "title": "Scenario: Button receives all standard button attributes/properties",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** consumers pass standard button HTML attributes to the trigger",
          "**THEN** those attributes are applied to the underlying button element",
          "**AND** ref forwarding works correctly"
        ]
      },
      {
        "title": "Requirement: Context-Based Component Communication",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST use native Web Component Context to share state between Root, Trigger, and Content components."
        ]
      },
      {
        "title": "Scenario: Trigger accesses disclosure state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a Trigger component is rendered within a Root",
          "**THEN** it can access the open state, onOpenChange callback, and contentId from context",
          "**AND** it throws or warns if rendered outside a Root"
        ]
      },
      {
        "title": "Scenario: Content accesses disclosure state",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a Content component is rendered within a Root",
          "**THEN** it can access the open state and contentId from context",
          "**AND** it throws or warns if rendered outside a Root"
        ]
      },
      {
        "title": "Requirement: Accessibility Compliance",
        "sourceHeadingLevel": 3,
        "requirements": [
          "The disclosure package MUST produce markup that passes automated accessibility checks."
        ]
      },
      {
        "title": "Scenario: No axe violations",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure is rendered in any valid configuration",
          "**THEN** automated accessibility testing with axe-core reports no violations",
          "**AND** the ARIA relationships are correctly established"
        ]
      },
      {
        "title": "Requirement: Contract Tests Assert Public Outcomes",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Contract tests for the disclosure package MUST validate specified public outcomes rather than internal implementation details."
        ]
      },
      {
        "title": "Scenario: Testing state management",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** maintainers add or update contract tests for state behavior",
          "**THEN** those tests assert public outcomes such as open/closed state, ARIA attributes, and DOM visibility",
          "**AND** they do not require specific internal hook implementations or context structure unless explicitly specified as public contract"
        ]
      },
      {
        "title": "Scenario: Testing accessibility semantics",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** maintainers add or update contract tests for accessibility",
          "**THEN** those tests assert observable ARIA attributes and relationships",
          "**AND** they do not depend on internal implementation details like context provider structure"
        ]
      },
      {
        "title": "Requirement: Internal Regression Tests Stay Non-Normative",
        "sourceHeadingLevel": 3,
        "requirements": [
          "Internal regression tests MAY protect implementation strategy, but they MUST NOT silently expand the supported public contract."
        ]
      },
      {
        "title": "Scenario: A test asserts internal mechanism",
        "sourceHeadingLevel": 4,
        "requirements": [
          "**WHEN** a disclosure test depends on context implementation details, internal hook behavior, or private component structure",
          "**THEN** that test is treated as internal regression coverage rather than normative contract coverage",
          "**AND** refactors may break such tests without violating the public contract"
        ]
      }
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
