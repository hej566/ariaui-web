import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "Clear");
if (!partSpec) throw new Error("Missing Clear part spec for @ariaui-web/upload.");
export const Clear = createUploadWebComponent(partSpec);
export type ClearElement = InstanceType<typeof Clear>;
