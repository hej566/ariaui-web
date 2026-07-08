import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Panel");

if (!partSpec) {
  throw new Error("Missing Panel part spec for @ariaui-web/accordion.");
}

export const Panel = createAccordionWebComponent(partSpec);
export type PanelElement = InstanceType<typeof Panel>;
