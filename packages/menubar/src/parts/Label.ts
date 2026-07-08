import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/menubar.");
}

export const Label = createMenubarWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
