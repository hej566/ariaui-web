import { createGridWebComponent } from "../grid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Header");

if (!partSpec) {
  throw new Error("Missing Header part spec for @ariaui-web/grid.");
}

export const Header = createGridWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
