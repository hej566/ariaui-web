import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/upload.");
}

export const Root = createUploadWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
