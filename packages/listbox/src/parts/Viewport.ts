import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Viewport");

if (!partSpec) {
  throw new Error("Missing Viewport part spec for @ariaui-web/listbox.");
}

export const Viewport = createListboxWebComponent(partSpec);
export type ViewportElement = InstanceType<typeof Viewport>;
