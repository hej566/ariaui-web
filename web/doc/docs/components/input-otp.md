# InputOtp

`@ariaui-web/input-otp` is a browser-native Web Component package. It exposes custom elements, a typed `componentSpec`, and package-level tests for the native runtime contract.

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

## Register Elements

```ts
import { defineInputOtpElements } from "@ariaui-web/input-otp";

defineInputOtpElements();
```

## Web Component Contract

`@ariaui-web/input-otp` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="input-otp">
  <aria-input-otp class="ariaui-web-example" data-example-part="Root">Root</aria-input-otp>
  <aria-input-otp-group class="ariaui-web-example" data-example-part="Group">Group</aria-input-otp-group>
  <aria-input-otp-input-otp class="ariaui-web-example" data-example-part="InputOTP">InputOTP</aria-input-otp-input-otp>
  <aria-input-otp-input-otpgroup class="ariaui-web-example" data-example-part="InputOTPGroup">InputOTPGroup</aria-input-otp-input-otpgroup>
</div>

### Markup

```html
<aria-input-otp class="ariaui-web-example" data-example-part="Root">Root</aria-input-otp>
  <aria-input-otp-group class="ariaui-web-example" data-example-part="Group">Group</aria-input-otp-group>
  <aria-input-otp-input-otp class="ariaui-web-example" data-example-part="InputOTP">InputOTP</aria-input-otp-input-otp>
  <aria-input-otp-input-otpgroup class="ariaui-web-example" data-example-part="InputOTPGroup">InputOTPGroup</aria-input-otp-input-otpgroup>
```

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-input-otp` | none |
| Group | `aria-input-otp-group` | `group` |
| InputOTP | `aria-input-otp-input-otp` | none |
| InputOTPGroup | `aria-input-otp-input-otpgroup` | none |
| InputOTPSeparator | `aria-input-otp-input-otpseparator` | none |
| InputOTPSlot | `aria-input-otp-input-otpslot` | none |
| Separator | `aria-input-otp-separator` | `separator` |
| Slot | `aria-input-otp-slot` | none |

### Usage

```ts
import { defineInputOtpElements } from "@ariaui-web/input-otp";

defineInputOtpElements();
```

The package-level native contract lives in `packages/input-otp/readme.md`.
