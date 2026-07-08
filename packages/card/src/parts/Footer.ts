import { createCardWebComponent } from "../card-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Footer");

if (!partSpec) {
  throw new Error("Missing Footer part spec for @ariaui-web/card.");
}

export const Footer = createCardWebComponent(partSpec);
export type FooterElement = InstanceType<typeof Footer>;
