import { createTabsWebComponent } from "../tabs-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/tabs.");
}

export const Content = createTabsWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
