import { componentSpec, type ComponentPartName } from "../component-spec";

export function getListboxPartSpec(partName: ComponentPartName) {
  const part = componentSpec.parts.find((candidate) => candidate.name === partName);
  if (!part) {
    throw new Error(`Missing ${partName} part spec for @ariaui-web/listbox.`);
  }
  return part;
}
