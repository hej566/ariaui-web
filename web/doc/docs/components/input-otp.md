# Input OTP

A one-time passcode input with split slots, paste support, and SMS autofill.

## Features

- **One-time passcodes**
- **Controlled or uncontrolled**
- **Paste and SMS autofill**
- **Split slot layouts**
- **`complete` event**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/input-otp
```

```bash [pnpm]
pnpm add @ariaui-web/input-otp
```

```bash [yarn]
yarn add @ariaui-web/input-otp
```

:::

### Register Elements

```ts
import { defineInputOtpElements } from "@ariaui-web/input-otp";

defineInputOtpElements();
```

## Examples

The live examples below are native custom element entries for the `input-otp` page, matching the source Aria UI examples.

### Verification code

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="input-otp" data-example-variant="verification-code">
  <aria-input-otp class="ariaui-web-input-otp-root" max-length="6" aria-label="Verification code" data-example-part="Root">
    <aria-input-otp-group class="flex items-center gap-2 ariaui-web-input-otp-group" data-example-part="Group">
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
    </aria-input-otp-group>
  </aria-input-otp>
</div>

```html
<aria-input-otp class="ariaui-web-input-otp-root" max-length="6" aria-label="Verification code" data-example-part="Root">
    <aria-input-otp-group class="flex items-center gap-2 ariaui-web-input-otp-group" data-example-part="Group">
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" data-example-part="Slot"></aria-input-otp-slot>
    </aria-input-otp-group>
  </aria-input-otp>
```

### Framer Motion

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="input-otp" data-example-variant="framer-motion">
  <aria-input-otp class="ariaui-web-input-otp-root ariaui-web-input-otp-motion-example" max-length="6" aria-label="Verification code" data-example-part="Root">
    <aria-input-otp-group class="flex items-center gap-2 ariaui-web-input-otp-group" data-example-part="Group">
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="0" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="1" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="2" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="3" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="4" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="5" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
    </aria-input-otp-group>
  </aria-input-otp>
</div>

```html
<aria-input-otp class="ariaui-web-input-otp-root ariaui-web-input-otp-motion-example" max-length="6" aria-label="Verification code" data-example-part="Root">
    <aria-input-otp-group class="flex items-center gap-2 ariaui-web-input-otp-group" data-example-part="Group">
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="0" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="1" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="2" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="3" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="4" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
      <aria-input-otp-slot class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2 ariaui-web-input-otp-slot" index="5" native-composition data-example-part="Slot">
        <span class="ariaui-web-input-otp-motion-frame"></span>
      </aria-input-otp-slot>
    </aria-input-otp-group>
  </aria-input-otp>
```

## Anatomy

```html
<aria-input-otp max-length="6" data-example-part="Root">
  <aria-input-otp-group data-example-part="Group">
    <aria-input-otp-slot data-example-part="Slot"></aria-input-otp-slot>
    <aria-input-otp-separator data-example-part="Separator"></aria-input-otp-separator>
    <aria-input-otp-slot data-example-part="Slot"></aria-input-otp-slot>
  </aria-input-otp-group>
</aria-input-otp>

<aria-input-otp-input-otp max-length="6" data-example-part="InputOTP">
  <aria-input-otp-input-otpgroup data-example-part="InputOTPGroup">
    <aria-input-otp-input-otpslot data-example-part="InputOTPSlot"></aria-input-otp-input-otpslot>
    <aria-input-otp-input-otpseparator data-example-part="InputOTPSeparator"></aria-input-otp-input-otpseparator>
  </aria-input-otp-input-otpgroup>
</aria-input-otp-input-otp>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-input-otp` | none |
| Group | `aria-input-otp-group` | none |
| InputOTP | `aria-input-otp-input-otp` | none |
| InputOTPGroup | `aria-input-otp-input-otpgroup` | none |
| InputOTPSeparator | `aria-input-otp-input-otpseparator` | `separator` |
| InputOTPSlot | `aria-input-otp-input-otpslot` | none |
| Separator | `aria-input-otp-separator` | `separator` |
| Slot | `aria-input-otp-slot` | none |

## API Reference

The package-level native contract lives in `packages/input-otp/readme.md`.

### Root

- Element: `aria-input-otp`
- Owns a visually hidden native `<input type="text">` with `inputmode="numeric"`, `pattern="[0-9]*"`, and `autocomplete="one-time-code"`.
- `max-length` is required for the intended number of characters and maps to the hidden input `maxLength`.
- `default-value` initializes uncontrolled native input state.
- The `value` property updates the hidden input and visible slots for controlled-style usage.
- Native `input` events bubble from the hidden input, while the host dispatches `valuechange` and `complete` custom events with `detail.value`.
- `disabled` and `auto-focus` map to the hidden input.

### Group

- Element: `aria-input-otp-group`
- Visual grouping container for slots. It has no default role or injected layout styles.

### Slot

- Element: `aria-input-otp-slot`
- Displays the character for its DOM-order index or explicit `index`.
- Reflects `data-active="true"` when the hidden input selection is at this slot.
- `native-composition` slots state and text onto a single child host for motion-style examples.
- Motion caret class: `pointer-events-none absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground`.

### Separator

- Element: `aria-input-otp-separator`
- Decorative separator between slot groups with `role="separator"`.

### Aliases

- `aria-input-otp-input-otp` aliases Root.
- `aria-input-otp-input-otpgroup` aliases Group.
- `aria-input-otp-input-otpslot` aliases Slot.
- `aria-input-otp-input-otpseparator` aliases Separator.

## Keyboard

| Key | Interaction |
| --- | --- |
| `0-9` | Enter a digit at the current slot and advance through the native input. |
| `Backspace` | Delete the focused value. From the next empty slot, focus the previous filled slot and delete it. |
| `ArrowLeft` | Move the hidden input caret to the previous slot. |
| `ArrowRight` | Move the hidden input caret to the next slot. |
| `Home` | Move the hidden input caret to the first slot. |
| `End` | Move the hidden input caret to the last filled slot. |
| `Ctrl+V` / `Cmd+V` | Paste an OTP code; characters fill from the first slot up to max-length. |
| `Tab` | Move focus out of the OTP input. |

## Accessibility

Input OTP uses a single visually hidden native `<input>` so browser autofill and assistive technology work as expected.

- `inputmode="numeric"` and `pattern="[0-9]*"` can surface the numeric keypad on mobile.
- `autocomplete="one-time-code"` lets platforms offer SMS passcode autofill.
- Always label the field with a visible `label` or `aria-label`.
- Use `aria-describedby` for help text, error text, or instructions.
- Slots and separators are presentational; focus stays on the hidden input.
