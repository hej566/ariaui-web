import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/accordion.");
}

export const Item = createAccordionWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
