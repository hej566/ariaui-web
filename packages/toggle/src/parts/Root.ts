import { createToggleWebComponent } from "../toggle-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/toggle.");
}

export const Root = createToggleWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
