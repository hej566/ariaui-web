import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Sub");

if (!partSpec) {
  throw new Error("Missing Sub part spec for @ariaui-web/context-menu.");
}

export const Sub = createContextMenuWebComponent(partSpec);
export type SubElement = InstanceType<typeof Sub>;
