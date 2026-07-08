import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/alert-dialog.");
}

export const Root = createAlertDialogWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
