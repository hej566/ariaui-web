import { createBadgeWebComponent } from "../badge-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/badge.");
}

export const Root = createBadgeWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
