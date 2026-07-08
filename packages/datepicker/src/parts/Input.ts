import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Input");

if (!partSpec) {
  throw new Error("Missing Input part spec for @ariaui-web/datepicker.");
}

export const Input = createDatepickerWebComponent(partSpec);
export type InputElement = InstanceType<typeof Input>;
