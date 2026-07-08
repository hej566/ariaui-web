import { createPortalWebComponent } from "../portal-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/portal.");
}

export const Root = createPortalWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
