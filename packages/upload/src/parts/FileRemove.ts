import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "FileRemove");
if (!partSpec) throw new Error("Missing FileRemove part spec for @ariaui-web/upload.");
export const FileRemove = createUploadWebComponent(partSpec);
export type FileRemoveElement = InstanceType<typeof FileRemove>;
