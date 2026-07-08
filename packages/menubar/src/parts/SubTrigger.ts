import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubTrigger");

if (!partSpec) {
  throw new Error("Missing SubTrigger part spec for @ariaui-web/menubar.");
}

export const SubTrigger = createMenubarWebComponent(partSpec);
export type SubTriggerElement = InstanceType<typeof SubTrigger>;
