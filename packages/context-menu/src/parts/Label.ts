import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/context-menu.");
}

export const Label = createContextMenuWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
