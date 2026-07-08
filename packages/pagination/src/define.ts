import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Ellipsis } from "./parts/Ellipsis";
import { Item } from "./parts/Item";
import { Link } from "./parts/Link";
import { Next } from "./parts/Next";
import { Pages } from "./parts/Pages";
import { Previous } from "./parts/Previous";

const definitions = [
  ["aria-pagination", Root],
  ["aria-pagination-content", Content],
  ["aria-pagination-ellipsis", Ellipsis],
  ["aria-pagination-item", Item],
  ["aria-pagination-link", Link],
  ["aria-pagination-next", Next],
  ["aria-pagination-pages", Pages],
  ["aria-pagination-previous", Previous],
] as const;

export function definePaginationElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
