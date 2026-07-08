import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Page");

if (!partSpec) {
  throw new Error("Missing Page part spec for @ariaui-web/breadcrumb.");
}

export const Page = createBreadcrumbWebComponent(partSpec);
export type PageElement = InstanceType<typeof Page>;
