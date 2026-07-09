import { AriaWebElement } from "@ariaui-web/utils";
import {
  handleDropdownMenuClick,
  handleDropdownMenuKeyDown,
  handleDropdownMenuKeyUp,
} from "./dropdown-menu-actions";
import { syncDropdownMenuTreeAround } from "./dropdown-menu-sync";

export class DropdownMenuElement extends AriaWebElement {
  static override packageSlug = "dropdown-menu";

  override afterAriaWebContractApplied() {
    syncDropdownMenuTreeAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleDropdownMenuClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleDropdownMenuKeyDown(this, event);
  };

  override handleAriaWebKeyUp = (event: KeyboardEvent) => {
    handleDropdownMenuKeyUp(this, event);
  };
}
