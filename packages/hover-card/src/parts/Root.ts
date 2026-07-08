import { createHoverCardWebComponent } from "../hover-card-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/hover-card.");
}

export const Root = createHoverCardWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
