import { createTabsWebComponent } from "../tabs-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "List");

if (!partSpec) {
  throw new Error("Missing List part spec for @ariaui-web/tabs.");
}

export const List = createTabsWebComponent(partSpec);
export type ListElement = InstanceType<typeof List>;
