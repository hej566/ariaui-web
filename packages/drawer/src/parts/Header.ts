import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Header");

if (!partSpec) {
  throw new Error("Missing Header part spec for @ariaui-web/drawer.");
}

export const Header = createDrawerWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
