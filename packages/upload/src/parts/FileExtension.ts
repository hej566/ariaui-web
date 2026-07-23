import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "FileExtension");
if (!partSpec) throw new Error("Missing FileExtension part spec for @ariaui-web/upload.");
export const FileExtension = createUploadWebComponent(partSpec);
export type FileExtensionElement = InstanceType<typeof FileExtension>;
