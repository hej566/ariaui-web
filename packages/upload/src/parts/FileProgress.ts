import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "FileProgress");
if (!partSpec) throw new Error("Missing FileProgress part spec for @ariaui-web/upload.");
export const FileProgress = createUploadWebComponent(partSpec);
export type FileProgressElement = InstanceType<typeof FileProgress>;
