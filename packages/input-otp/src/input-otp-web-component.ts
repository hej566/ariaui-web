import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Group } from "./parts/Group";
import { InputOTP } from "./parts/InputOTP";
import { InputOTPGroup } from "./parts/InputOTPGroup";
import { InputOTPSeparator } from "./parts/InputOTPSeparator";
import { InputOTPSlot } from "./parts/InputOTPSlot";
import { Root } from "./parts/Root";
import { Separator } from "./parts/Separator";
import { Slot } from "./parts/Slot";

const inputOtpPartConstructors = {
  Group,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Root,
  Separator,
  Slot,
} as const;

export function createInputOtpWebComponent(part: WebComponentPartSpec) {
  const constructor = inputOtpPartConstructors[part.name as keyof typeof inputOtpPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/input-otp.");
  }

  return constructor;
}
