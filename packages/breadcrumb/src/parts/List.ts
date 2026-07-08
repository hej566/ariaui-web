import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "List");

if (!partSpec) {
  throw new Error("Missing List part spec for @ariaui-web/breadcrumb.");
}

export const List = createBreadcrumbWebComponent(partSpec);
export type ListElement = InstanceType<typeof List>;
