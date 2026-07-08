import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/dialog.");
}

export const Trigger = createDialogWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
