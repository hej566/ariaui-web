import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CheckboxItem");

if (!partSpec) {
  throw new Error("Missing CheckboxItem part spec for @ariaui-web/menubar.");
}

export const CheckboxItem = createMenubarWebComponent(partSpec);
export type CheckboxItemElement = InstanceType<typeof CheckboxItem>;
