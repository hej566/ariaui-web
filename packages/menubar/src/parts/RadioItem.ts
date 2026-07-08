import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "RadioItem");

if (!partSpec) {
  throw new Error("Missing RadioItem part spec for @ariaui-web/menubar.");
}

export const RadioItem = createMenubarWebComponent(partSpec);
export type RadioItemElement = InstanceType<typeof RadioItem>;
