import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Selector");

if (!partSpec) {
  throw new Error("Missing Selector part spec for @ariaui-web/upload.");
}

export const Selector = createUploadWebComponent(partSpec);
export type SelectorElement = InstanceType<typeof Selector>;
