import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { CheckboxItem } from "./parts/CheckboxItem";
import { Content } from "./parts/Content";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";
import { Label } from "./parts/Label";
import { RadioGroup } from "./parts/RadioGroup";
import { RadioItem } from "./parts/RadioItem";
import { Root } from "./parts/Root";
import { Separator } from "./parts/Separator";
import { Sub } from "./parts/Sub";
import { SubContent } from "./parts/SubContent";
import { SubTrigger } from "./parts/SubTrigger";
import { Trigger } from "./parts/Trigger";

const dropdownMenuPartConstructors = {
  CheckboxItem,
  Content,
  Group,
  Item,
  Label,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} as const;

export function createDropdownMenuWebComponent(part: WebComponentPartSpec) {
  const constructor = dropdownMenuPartConstructors[part.name as keyof typeof dropdownMenuPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/dropdown-menu.");
  }

  return constructor;
}
