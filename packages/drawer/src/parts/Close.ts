import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Close");

if (!partSpec) {
  throw new Error("Missing Close part spec for @ariaui-web/drawer.");
}

export const Close = createDrawerWebComponent(partSpec);
export type CloseElement = InstanceType<typeof Close>;
