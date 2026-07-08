import { createAlertWebComponent } from "../alert-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cancel");

if (!partSpec) {
  throw new Error("Missing Cancel part spec for @ariaui-web/alert.");
}

export const Cancel = createAlertWebComponent(partSpec);
export type CancelElement = InstanceType<typeof Cancel>;
