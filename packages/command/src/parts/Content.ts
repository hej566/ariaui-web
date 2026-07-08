import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/command.");
}

export const Content = createCommandWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
