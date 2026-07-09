import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Ellipsis } from "./parts/Ellipsis";
import { Item } from "./parts/Item";
import { Link } from "./parts/Link";
import { List } from "./parts/List";
import { Page } from "./parts/Page";
import { Root } from "./parts/Root";
import { Separator } from "./parts/Separator";

const breadcrumbPartConstructors = {
  Ellipsis,
  Item,
  Link,
  List,
  Page,
  Root,
  Separator,
} as const;

export function createBreadcrumbWebComponent(part: WebComponentPartSpec) {
  const constructor = breadcrumbPartConstructors[part.name as keyof typeof breadcrumbPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/breadcrumb.");
  }

  return constructor;
}
