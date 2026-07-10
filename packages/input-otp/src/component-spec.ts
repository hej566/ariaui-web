export const componentSpec = {
  "kind": "component",
  "name": "InputOtp",
  "slug": "input-otp",
  "packageName": "@ariaui-web/input-otp",
  "description": "**Group:** - All standard div attributes/properties (className, children, etc.)",
  "parts": [
    {
      "name": "Root",
      "tagName": "aria-input-otp",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Group",
      "tagName": "aria-input-otp-group",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "InputOTP",
      "tagName": "aria-input-otp-input-otp",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "InputOTPGroup",
      "tagName": "aria-input-otp-input-otpgroup",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "InputOTPSeparator",
      "tagName": "aria-input-otp-input-otpseparator",
      "defaultRole": "separator",
      "defaultAttributes": {}
    },
    {
      "name": "InputOTPSlot",
      "tagName": "aria-input-otp-input-otpslot",
      "defaultRole": null,
      "defaultAttributes": {}
    },
    {
      "name": "Separator",
      "tagName": "aria-input-otp-separator",
      "defaultRole": "separator",
      "defaultAttributes": {}
    },
    {
      "name": "Slot",
      "tagName": "aria-input-otp-slot",
      "defaultRole": null,
      "defaultAttributes": {}
    }
  ],
  "requirementAttributes": [
    "disabled",
    "required",
    "value"
  ],
  "learnedRequirements": {
    "learningSource": "../ariaui/packages/input-otp/readme.md",
    "coverage": {
      "sourceSections": 11,
      "coveredSections": 11,
      "requirements": 49
    },
    "sections": [
      {
        "title": "Scope",
        "sourceHeadingLevel": 2,
        "requirements": [
          "This document defines the current contract for `@ariaui-web/input-otp`."
        ]
      },
      {
        "title": "Primary References",
        "sourceHeadingLevel": 2,
        "requirements": [
          "shadcn input-otp docs: https://ui.shadcn.com/docs/components/input-otp"
        ]
      },
      {
        "title": "Mental Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "`@ariaui-web/input-otp` is a one-time-code entry primitive that uses one visually hidden text input plus visible slot components."
        ]
      },
      {
        "title": "Part Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The package exports:",
          "`InputOTP.Root` - container with hidden input and context provider",
          "`InputOTP.Group` - visual grouping container for slots",
          "`InputOTP.native composition host` - individual character display slot",
          "`InputOTP.Separator` - visual separator between slot groups"
        ]
      },
      {
        "title": "State Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The root coordinates shared OTP value, focus state, slot registration, and current focused slot index."
        ]
      },
      {
        "title": "Props Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "**Root:**",
          "`value?: string` - controlled value",
          "`defaultValue?: string` - uncontrolled initial value (defaults to empty string)",
          "`onChange?: (value: string) => void` - callback when value changes",
          "`maxLength: number` - maximum number of characters (required)",
          "`disabled?: boolean` - disables the input",
          "`autoFocus?: boolean` - auto-focuses the input on mount",
          "`onComplete?: (value: string) => void` - callback when value reaches maxLength",
          "All standard div attributes/properties (className, onClick, etc.)",
          "**Group:**",
          "All standard div attributes/properties (className, children, etc.)",
          "**native composition host:**",
          "`index?: number` - optional explicit slot index (auto-calculated if omitted)",
          "`native composition?: boolean` - slot state, value, caret, className, and data attributes onto a single child element for custom hosts such as Framer Motion components",
          "All standard div attributes/properties (className, etc.)",
          "**Separator:**"
        ]
      },
      {
        "title": "Accessibility Model",
        "sourceHeadingLevel": 2,
        "requirements": [
          "The implementation relies on one native text input for actual text entry while visible slots mirror the current value and focus position.",
          "The hidden input uses:",
          "`inputMode=\"numeric\"` for mobile keyboard optimization",
          "`pattern=\"[0-9]*\"` to indicate numeric-only input",
          "`autoComplete=\"one-time-code\"` for browser autofill integration",
          "Note: This component is designed for numeric OTP codes only."
        ]
      },
      {
        "title": "Behavior Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "the hidden input owns real text entry",
          "visible slots reflect individual characters and focused-position state",
          "values are clipped to `maxLength`",
          "`onComplete` fires when the entered value reaches `maxLength`",
          "clicking the visible shell focuses the hidden input",
          "pressing Backspace deletes the focused value; from the next empty slot, it focuses the previous filled slot and deletes it in the same key press",
          "slots auto-register and sort themselves by DOM position"
        ]
      },
      {
        "title": "Styling Contract",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Consumers own visual layout and styling through `className`. The root keeps only functional inline positioning for the hidden native input overlay."
        ]
      },
      {
        "title": "Data and ARIA Reflection",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Native input semantics come from the hidden input; slot-level focus and value reflection are driven from shared context."
        ]
      },
      {
        "title": "Coverage Expectations",
        "sourceHeadingLevel": 2,
        "requirements": [
          "Tests for this package should cover:",
          "value entry and clipping to maxLength",
          "focus mirroring into visible slots",
          "slot registration and rendering",
          "completion callback behavior",
          "disabled attributes/properties prevents input",
          "autoFocus attributes/properties focuses on mount",
          "controlled and uncontrolled modes",
          "Backspace focuses and deletes the previous filled slot in one key press"
        ]
      }
    ]
  },
  "sourceTestParity": {
    "learningSources": [
      "../ariaui/packages/input-otp/__test__/input-otp.test.tsx"
    ],
    "sourceTestCases": 22,
    "nativeRequirements": [
      "Root owns one visually hidden native text input with numeric input mode, one-time-code autocomplete, maxLength, and root-scoped absolute positioning",
      "Root clips entered values to maxLength and mirrors each character into Slot and InputOTPSlot hosts in DOM order",
      "Root composes native input events with valuechange events and complete events when the OTP reaches maxLength",
      "Root supports default-value initialization and controlled-style value property updates",
      "Backspace deletes the focused digit, deletes selected ranges, and from the next empty slot deletes the previous filled slot in one key press",
      "focus, blur, select, Tab, and root click keep slot data-active and caret rendering aligned with the hidden input selection",
      "disabled maps to the hidden input and prevents value changes, while auto-focus focuses the hidden input on mount",
      "Slot supports explicit index, DOM-order auto registration, and native-composition child hosts for motion-style examples",
      "Group and Separator remain visual parts with no injected layout styles beyond authored classes, while Separator exposes separator semantics",
      "docs examples include verification-code and framer-motion variants with source-equivalent group, slot, and caret classes"
    ]
  }
} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
