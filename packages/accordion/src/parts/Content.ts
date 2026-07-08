import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/accordion.");
}

export const Content = createAccordionWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
