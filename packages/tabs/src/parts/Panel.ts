import { createTabsWebComponent } from "../tabs-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Panel");

if (!partSpec) {
  throw new Error("Missing Panel part spec for @ariaui-web/tabs.");
}

export const Panel = createTabsWebComponent(partSpec);
export type PanelElement = InstanceType<typeof Panel>;
