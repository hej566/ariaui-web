import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Footer");

if (!partSpec) {
  throw new Error("Missing Footer part spec for @ariaui-web/drawer.");
}

export const Footer = createDrawerWebComponent(partSpec);
export type FooterElement = InstanceType<typeof Footer>;
