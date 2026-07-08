import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/alert-dialog.");
}

export const Trigger = createAlertDialogWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
