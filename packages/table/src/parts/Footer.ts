import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Footer");

if (!partSpec) {
  throw new Error("Missing Footer part spec for @ariaui-web/table.");
}

export const Footer = createTableWebComponent(partSpec);
export type FooterElement = InstanceType<typeof Footer>;
