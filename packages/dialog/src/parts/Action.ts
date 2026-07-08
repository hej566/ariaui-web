import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Action");

if (!partSpec) {
  throw new Error("Missing Action part spec for @ariaui-web/dialog.");
}

export const Action = createDialogWebComponent(partSpec);
export type ActionElement = InstanceType<typeof Action>;
