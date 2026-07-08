import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cancel");

if (!partSpec) {
  throw new Error("Missing Cancel part spec for @ariaui-web/drawer.");
}

export const Cancel = createDrawerWebComponent(partSpec);
export type CancelElement = InstanceType<typeof Cancel>;
