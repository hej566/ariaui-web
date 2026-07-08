import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/context-menu.");
}

export const Content = createContextMenuWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
