import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/listbox.");
}

export const Content = createListboxWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
