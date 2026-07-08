import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Overlay");

if (!partSpec) {
  throw new Error("Missing Overlay part spec for @ariaui-web/drawer.");
}

export const Overlay = createDrawerWebComponent(partSpec);
export type OverlayElement = InstanceType<typeof Overlay>;
