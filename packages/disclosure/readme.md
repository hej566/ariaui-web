# Disclosure Web Component Spec

## Native Web Component Contract

- Package: `@ariaui-web/disclosure`
- Kind: `component`

This file defines the browser-native custom element contract for this package. Tests in `__test__` assert that this spec, the public `componentSpec`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-disclosure` | none |
| Content | `aria-disclosure-content` | `region` |
| Trigger | `aria-disclosure-trigger` | `button` |

## Learned Native Requirements

- Learned from: `../ariaui/packages/disclosure/readme.md`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: 39 of 39 documented sections are represented after native normalization.
- Requirement lines: 87

### Purpose

- Define the maintainer-facing normative contract for the disclosure package, including the supported public surface and the observable invariants that refactors must preserve.

### Primary References

- APG disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

### Requirements

- The local Aria UI package docs include this h2 section; the native custom element contract must preserve its coverage when implementation details are adapted.

### Requirement: Disclosure Spec Authority

- The disclosure package MUST maintain a single maintainer-facing normative contract that defines the supported public surface and the observable invariants that refactors must preserve.

### Scenario: Conflicting artifacts

- **WHEN** the package spec, tests, README, docs, or historical plans disagree
- **THEN** the maintainer-facing package spec is authoritative

### Requirement: Open State Management

- The disclosure package MUST support both controlled and uncontrolled open state management.

### Scenario: Uncontrolled usage with defaultOpen

- **WHEN** a disclosure is rendered with `defaultOpen` attributes/properties
- **THEN** the component manages its own open state internally
- **AND** the initial open state matches the `defaultOpen` value

### Scenario: Controlled usage with open attributes/properties

- **WHEN** a disclosure is rendered with `open` attributes/properties
- **THEN** the component's open state is controlled by the parent
- **AND** state changes are communicated via `onOpenChange` callback
- **AND** the component does not manage internal state

### Scenario: Transitioning between controlled and uncontrolled

- **WHEN** a disclosure switches between controlled and uncontrolled modes
- **THEN** the behavior follows native Web Component's standard controllable state patterns
- **AND** warnings or errors follow native Web Component conventions for mode switching

### Requirement: Trigger-Content Association

- The disclosure package MUST establish a programmatic association between trigger and content elements.

### Scenario: ARIA relationship attributes

- **WHEN** a disclosure is rendered
- **THEN** the trigger element has `aria-controls` pointing to the content element's ID
- **AND** the content element has an `id` attribute matching the `aria-controls` value
- **AND** the ID is either user-provided via the `id` attributes/properties or auto-generated

### Scenario: Multiple disclosures with unique IDs

- **WHEN** multiple disclosure instances are rendered without explicit IDs
- **THEN** each disclosure generates a unique content ID
- **AND** no ID collisions occur between instances

### Requirement: Expanded State Communication

- The disclosure package MUST communicate the expanded/collapsed state through ARIA attributes.

### Scenario: Trigger reflects closed state

- **WHEN** the disclosure is closed
- **THEN** the trigger has `aria-expanded="false"`

### Scenario: Trigger reflects open state

- **WHEN** the disclosure is open
- **THEN** the trigger has `aria-expanded="true"`

### Scenario: State changes update aria-expanded

- **WHEN** the open state changes through any mechanism
- **THEN** the `aria-expanded` attribute updates synchronously to reflect the new state

### Requirement: Content Visibility Management

- The disclosure package MUST control content visibility based on open state.

### Scenario: Content hidden when closed

- **WHEN** the disclosure is closed
- **THEN** the content element is not rendered in the DOM
- **AND** the content is not accessible to assistive technologies

### Scenario: Content visible when open

- **WHEN** the disclosure is open
- **THEN** the content element is rendered in the DOM
- **AND** the content is accessible to assistive technologies
- **AND** the content has `hidden={false}` or no hidden attribute

### Requirement: Content Host Composition

- The disclosure package MUST support custom content hosts for animation and composition libraries.

### Scenario: Content rendered with native composition

- **WHEN** a disclosure content is rendered with `native composition`
- **THEN** the content attributes/properties are slotted onto the single child element
- **AND** the generated content `id` remains on that child element
- **AND** custom host components such as Framer Motion elements can receive disclosure content attributes/properties without leaking `native composition` to the DOM

### Requirement: Trigger Interaction

- The disclosure package MUST respond to user interactions on the trigger element.

### Scenario: Click toggles state

- **WHEN** the user clicks the trigger
- **THEN** the open state toggles
- **AND** `onOpenChange` is called with the new state value

### Scenario: Enter key toggles state

- **WHEN** the trigger is focused and the user presses Enter
- **THEN** the open state toggles
- **AND** the behavior matches native button behavior

### Scenario: Space key toggles state

- **WHEN** the trigger is focused and the user presses Space
- **THEN** the open state toggles
- **AND** the behavior matches native button behavior

### Scenario: Custom onClick handlers are preserved

- **WHEN** a consumer provides a custom `onClick` handler on the trigger
- **THEN** the custom handler is called before the toggle logic
- **AND** the toggle behavior still executes unless prevented

### Requirement: Semantic Button Role

- The disclosure package MUST render the trigger as a semantic button element.

### Scenario: Trigger is a button element

- **WHEN** a disclosure trigger is rendered
- **THEN** it renders as a `<button>` element
- **AND** it has `type="button"` to prevent form submission

### Scenario: Button receives all standard button attributes/properties

- **WHEN** consumers pass standard button HTML attributes to the trigger
- **THEN** those attributes are applied to the underlying button element
- **AND** ref forwarding works correctly

### Requirement: Context-Based Component Communication

- The disclosure package MUST use native Web Component Context to share state between Root, Trigger, and Content components.

### Scenario: Trigger accesses disclosure state

- **WHEN** a Trigger component is rendered within a Root
- **THEN** it can access the open state, onOpenChange callback, and contentId from context
- **AND** it throws or warns if rendered outside a Root

### Scenario: Content accesses disclosure state

- **WHEN** a Content component is rendered within a Root
- **THEN** it can access the open state and contentId from context
- **AND** it throws or warns if rendered outside a Root

### Requirement: Accessibility Compliance

- The disclosure package MUST produce markup that passes automated accessibility checks.

### Scenario: No axe violations

- **WHEN** a disclosure is rendered in any valid configuration
- **THEN** automated accessibility testing with axe-core reports no violations
- **AND** the ARIA relationships are correctly established

### Requirement: Contract Tests Assert Public Outcomes

- Contract tests for the disclosure package MUST validate specified public outcomes rather than internal implementation details.

### Scenario: Testing state management

- **WHEN** maintainers add or update contract tests for state behavior
- **THEN** those tests assert public outcomes such as open/closed state, ARIA attributes, and DOM visibility
- **AND** they do not require specific internal hook implementations or context structure unless explicitly specified as public contract

### Scenario: Testing accessibility semantics

- **WHEN** maintainers add or update contract tests for accessibility
- **THEN** those tests assert observable ARIA attributes and relationships
- **AND** they do not depend on internal implementation details like context provider structure

### Requirement: Internal Regression Tests Stay Non-Normative

- Internal regression tests MAY protect implementation strategy, but they MUST NOT silently expand the supported public contract.

### Scenario: A test asserts internal mechanism

- **WHEN** a disclosure test depends on context implementation details, internal hook behavior, or private component structure
- **THEN** that test is treated as internal regression coverage rather than normative contract coverage
- **AND** refactors may break such tests without violating the public contract






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
