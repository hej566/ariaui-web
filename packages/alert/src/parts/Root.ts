import { createAlertWebComponent } from "../alert-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/alert.");
}

export const Root = createAlertWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
