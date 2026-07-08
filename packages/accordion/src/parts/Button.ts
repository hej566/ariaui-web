import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Button");

if (!partSpec) {
  throw new Error("Missing Button part spec for @ariaui-web/accordion.");
}

export const Button = createAccordionWebComponent(partSpec);
export type ButtonElement = InstanceType<typeof Button>;
