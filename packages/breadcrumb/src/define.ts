import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Ellipsis } from "./parts/Ellipsis";
import { Item } from "./parts/Item";
import { Link } from "./parts/Link";
import { List } from "./parts/List";
import { Page } from "./parts/Page";
import { Separator } from "./parts/Separator";

const definitions = [
  ["aria-breadcrumb", Root],
  ["aria-breadcrumb-ellipsis", Ellipsis],
  ["aria-breadcrumb-item", Item],
  ["aria-breadcrumb-link", Link],
  ["aria-breadcrumb-list", List],
  ["aria-breadcrumb-page", Page],
  ["aria-breadcrumb-separator", Separator],
] as const;

export function defineBreadcrumbElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
