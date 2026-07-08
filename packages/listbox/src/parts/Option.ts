import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Option");

if (!partSpec) {
  throw new Error("Missing Option part spec for @ariaui-web/listbox.");
}

export const Option = createListboxWebComponent(partSpec);
export type OptionElement = InstanceType<typeof Option>;
