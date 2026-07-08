import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Close");

if (!partSpec) {
  throw new Error("Missing Close part spec for @ariaui-web/dialog.");
}

export const Close = createDialogWebComponent(partSpec);
export type CloseElement = InstanceType<typeof Close>;
