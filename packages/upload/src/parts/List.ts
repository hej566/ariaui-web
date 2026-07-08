import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "List");

if (!partSpec) {
  throw new Error("Missing List part spec for @ariaui-web/upload.");
}

export const List = createUploadWebComponent(partSpec);
export type ListElement = InstanceType<typeof List>;
