import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Header");

if (!partSpec) {
  throw new Error("Missing Header part spec for @ariaui-web/accordion.");
}

export const Header = createAccordionWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
