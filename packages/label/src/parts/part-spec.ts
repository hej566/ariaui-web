import { componentSpec, type ComponentPartName } from "../component-spec";

export function getLabelPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/label.");
  }

  return partSpec;
}
