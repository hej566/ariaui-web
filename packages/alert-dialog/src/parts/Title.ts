import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Title");

if (!partSpec) {
  throw new Error("Missing Title part spec for @ariaui-web/alert-dialog.");
}

export const Title = createAlertDialogWebComponent(partSpec);
export type TitleElement = InstanceType<typeof Title>;
