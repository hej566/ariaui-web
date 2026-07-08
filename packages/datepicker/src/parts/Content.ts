import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/datepicker.");
}

export const Content = createDatepickerWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
