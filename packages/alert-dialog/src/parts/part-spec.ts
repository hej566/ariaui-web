import { componentSpec, type ComponentPartName } from "../component-spec";

export function getAlertDialogPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/alert-dialog.");
  }

  return partSpec;
}
