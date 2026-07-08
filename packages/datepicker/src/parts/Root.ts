import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/datepicker.");
}

export const Root = createDatepickerWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
