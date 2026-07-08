import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Header");

if (!partSpec) {
  throw new Error("Missing Header part spec for @ariaui-web/treegrid.");
}

export const Header = createTreegridWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
