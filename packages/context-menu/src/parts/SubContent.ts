import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubContent");

if (!partSpec) {
  throw new Error("Missing SubContent part spec for @ariaui-web/context-menu.");
}

export const SubContent = createContextMenuWebComponent(partSpec);
export type SubContentElement = InstanceType<typeof SubContent>;
