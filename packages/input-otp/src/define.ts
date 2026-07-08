import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Group } from "./parts/Group";
import { InputOTP } from "./parts/InputOTP";
import { InputOTPGroup } from "./parts/InputOTPGroup";
import { InputOTPSeparator } from "./parts/InputOTPSeparator";
import { InputOTPSlot } from "./parts/InputOTPSlot";
import { Separator } from "./parts/Separator";
import { Slot } from "./parts/Slot";

const definitions = [
  ["aria-input-otp", Root],
  ["aria-input-otp-group", Group],
  ["aria-input-otp-input-otp", InputOTP],
  ["aria-input-otp-input-otpgroup", InputOTPGroup],
  ["aria-input-otp-input-otpseparator", InputOTPSeparator],
  ["aria-input-otp-input-otpslot", InputOTPSlot],
  ["aria-input-otp-separator", Separator],
  ["aria-input-otp-slot", Slot],
] as const;

export function defineInputOtpElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
