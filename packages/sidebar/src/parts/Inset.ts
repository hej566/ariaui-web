import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Inset");

if (!partSpec) {
  throw new Error("Missing Inset part spec for @ariaui-web/sidebar.");
}

export const Inset = createSidebarWebComponent(partSpec);
export type InsetElement = InstanceType<typeof Inset>;
