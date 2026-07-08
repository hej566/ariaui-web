import { createRadioWebComponent } from "../radio-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Indicator");

if (!partSpec) {
  throw new Error("Missing Indicator part spec for @ariaui-web/radio.");
}

export const Indicator = createRadioWebComponent(partSpec);
export type IndicatorElement = InstanceType<typeof Indicator>;
