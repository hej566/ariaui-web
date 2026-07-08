import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Rail");

if (!partSpec) {
  throw new Error("Missing Rail part spec for @ariaui-web/sidebar.");
}

export const Rail = createSidebarWebComponent(partSpec);
export type RailElement = InstanceType<typeof Rail>;
