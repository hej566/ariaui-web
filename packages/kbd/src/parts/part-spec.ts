import { componentSpec, type ComponentPartName } from "../component-spec";

export function getKbdPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/kbd.");
  }

  return partSpec;
}
