import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/accordion.");
}

export const Trigger = createAccordionWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
