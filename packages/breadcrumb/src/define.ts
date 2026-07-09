import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { List } from "./parts/List";
import { Item } from "./parts/Item";
import { Link } from "./parts/Link";
import { Page } from "./parts/Page";
import { Separator } from "./parts/Separator";
import { Ellipsis } from "./parts/Ellipsis";

const definitions = [
  ["aria-breadcrumb", Root],
  ["aria-breadcrumb-list", List],
  ["aria-breadcrumb-item", Item],
  ["aria-breadcrumb-link", Link],
  ["aria-breadcrumb-page", Page],
  ["aria-breadcrumb-separator", Separator],
  ["aria-breadcrumb-ellipsis", Ellipsis],
] as const;

export function defineBreadcrumbElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
