import { createProgressWebComponent } from "../progress-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Indicator");

if (!partSpec) {
  throw new Error("Missing Indicator part spec for @ariaui-web/progress.");
}

export const Indicator = createProgressWebComponent(partSpec);
export type IndicatorElement = InstanceType<typeof Indicator>;
