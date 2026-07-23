import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "FileName");
if (!partSpec) throw new Error("Missing FileName part spec for @ariaui-web/upload.");
export const FileName = createUploadWebComponent(partSpec);
export type FileNameElement = InstanceType<typeof FileName>;
