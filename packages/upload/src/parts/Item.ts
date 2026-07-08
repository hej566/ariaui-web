import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/upload.");
}

export const Item = createUploadWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
