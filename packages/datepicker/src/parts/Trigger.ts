import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/datepicker.");
}

export const Trigger = createDatepickerWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
