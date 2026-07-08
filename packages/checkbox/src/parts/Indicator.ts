import { createCheckboxWebComponent } from "../checkbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Indicator");

if (!partSpec) {
  throw new Error("Missing Indicator part spec for @ariaui-web/checkbox.");
}

export const Indicator = createCheckboxWebComponent(partSpec);
export type IndicatorElement = InstanceType<typeof Indicator>;
