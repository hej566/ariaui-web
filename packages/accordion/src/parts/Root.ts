import { createAccordionWebComponent } from "../accordion-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/accordion.");
}

export const Root = createAccordionWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
