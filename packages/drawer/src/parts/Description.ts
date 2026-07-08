import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Description");

if (!partSpec) {
  throw new Error("Missing Description part spec for @ariaui-web/drawer.");
}

export const Description = createDrawerWebComponent(partSpec);
export type DescriptionElement = InstanceType<typeof Description>;
