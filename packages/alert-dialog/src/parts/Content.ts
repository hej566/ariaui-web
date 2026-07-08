import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/alert-dialog.");
}

export const Content = createAlertDialogWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
