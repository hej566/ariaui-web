import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "FileSize");
if (!partSpec) throw new Error("Missing FileSize part spec for @ariaui-web/upload.");
export const FileSize = createUploadWebComponent(partSpec);
export type FileSizeElement = InstanceType<typeof FileSize>;
