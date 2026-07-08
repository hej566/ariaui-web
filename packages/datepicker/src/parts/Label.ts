import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/datepicker.");
}

export const Label = createDatepickerWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
