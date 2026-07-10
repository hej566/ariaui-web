import { componentSpec, type ComponentPartName } from "../component-spec";

export function getGridPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((part) => part.name === partName);
  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/grid.");
  }

  return partSpec;
}
