import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Action");

if (!partSpec) {
  throw new Error("Missing Action part spec for @ariaui-web/drawer.");
}

export const Action = createDrawerWebComponent(partSpec);
export type ActionElement = InstanceType<typeof Action>;
