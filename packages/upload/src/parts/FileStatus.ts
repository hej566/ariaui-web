import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "FileStatus");
if (!partSpec) throw new Error("Missing FileStatus part spec for @ariaui-web/upload.");
export const FileStatus = createUploadWebComponent(partSpec);
export type FileStatusElement = InstanceType<typeof FileStatus>;
