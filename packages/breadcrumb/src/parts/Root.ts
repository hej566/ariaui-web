import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/breadcrumb.");
}

export const Root = createBreadcrumbWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
