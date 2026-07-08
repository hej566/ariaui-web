import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Submenu");

if (!partSpec) {
  throw new Error("Missing Submenu part spec for @ariaui-web/listbox.");
}

export const Submenu = createListboxWebComponent(partSpec);
export type SubmenuElement = InstanceType<typeof Submenu>;
