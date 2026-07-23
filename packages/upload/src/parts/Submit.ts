import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "Submit");
if (!partSpec) throw new Error("Missing Submit part spec for @ariaui-web/upload.");
export const Submit = createUploadWebComponent(partSpec);
export type SubmitElement = InstanceType<typeof Submit>;
