import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/menubar.");
}

export const Content = createMenubarWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
