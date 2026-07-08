import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/listbox.");
}

export const Root = createListboxWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
