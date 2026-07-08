import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Layout");

if (!partSpec) {
  throw new Error("Missing Layout part spec for @ariaui-web/sidebar.");
}

export const Layout = createSidebarWebComponent(partSpec);
export type LayoutElement = InstanceType<typeof Layout>;
