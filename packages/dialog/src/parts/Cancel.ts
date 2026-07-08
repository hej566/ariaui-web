import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cancel");

if (!partSpec) {
  throw new Error("Missing Cancel part spec for @ariaui-web/dialog.");
}

export const Cancel = createDialogWebComponent(partSpec);
export type CancelElement = InstanceType<typeof Cancel>;
