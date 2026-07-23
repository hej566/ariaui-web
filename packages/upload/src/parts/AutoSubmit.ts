import { createUploadWebComponent } from "../upload-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "AutoSubmit");
if (!partSpec) throw new Error("Missing AutoSubmit part spec for @ariaui-web/upload.");
export const AutoSubmit = createUploadWebComponent(partSpec);
export type AutoSubmitElement = InstanceType<typeof AutoSubmit>;
