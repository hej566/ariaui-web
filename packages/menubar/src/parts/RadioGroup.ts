import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "RadioGroup");

if (!partSpec) {
  throw new Error("Missing RadioGroup part spec for @ariaui-web/menubar.");
}

export const RadioGroup = createMenubarWebComponent(partSpec);
export type RadioGroupElement = InstanceType<typeof RadioGroup>;
