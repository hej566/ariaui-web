import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Portal");

if (!partSpec) {
  throw new Error("Missing Portal part spec for @ariaui-web/drawer.");
}

export const Portal = createDrawerWebComponent(partSpec);
export type PortalElement = InstanceType<typeof Portal>;
