import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubContent");

if (!partSpec) {
  throw new Error("Missing SubContent part spec for @ariaui-web/menubar.");
}

export const SubContent = createMenubarWebComponent(partSpec);
export type SubContentElement = InstanceType<typeof SubContent>;
