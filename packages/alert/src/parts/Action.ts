import { createAlertWebComponent } from "../alert-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Action");

if (!partSpec) {
  throw new Error("Missing Action part spec for @ariaui-web/alert.");
}

export const Action = createAlertWebComponent(partSpec);
export type ActionElement = InstanceType<typeof Action>;
