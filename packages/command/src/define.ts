import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Empty } from "./parts/Empty";
import { Group } from "./parts/Group";
import { Input } from "./parts/Input";
import { Label } from "./parts/Label";
import { Loading } from "./parts/Loading";
import { Option } from "./parts/Option";
import { Separator } from "./parts/Separator";

const definitions = [
  ["aria-command", Root],
  ["aria-command-content", Content],
  ["aria-command-empty", Empty],
  ["aria-command-group", Group],
  ["aria-command-input", Input],
  ["aria-command-label", Label],
  ["aria-command-loading", Loading],
  ["aria-command-option", Option],
  ["aria-command-separator", Separator],
] as const;

export function defineCommandElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
