import { createDisclosureWebComponent } from "../disclosure-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/disclosure.");
}

export const Content = createDisclosureWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
