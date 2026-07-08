import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Sub");

if (!partSpec) {
  throw new Error("Missing Sub part spec for @ariaui-web/menubar.");
}

export const Sub = createMenubarWebComponent(partSpec);
export type SubElement = InstanceType<typeof Sub>;
