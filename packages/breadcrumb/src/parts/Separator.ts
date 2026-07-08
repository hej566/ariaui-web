import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Separator");

if (!partSpec) {
  throw new Error("Missing Separator part spec for @ariaui-web/breadcrumb.");
}

export const Separator = createBreadcrumbWebComponent(partSpec);
export type SeparatorElement = InstanceType<typeof Separator>;
