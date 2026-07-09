import { DropdownMenuElement } from "../dropdown-menu-element";
import {
  bindDropdownMenuHoverEvents,
  bindDropdownMenuOutsideEvents,
  unbindDropdownMenuHoverEvents,
  unbindDropdownMenuOutsideEvents,
} from "../dropdown-menu-actions";
import { syncDropdownMenuTreeFromRoot } from "../dropdown-menu-sync";
import { getDropdownMenuPartSpec } from "./part-spec";

const partSpec = getDropdownMenuPartSpec("Root");

export class Root extends DropdownMenuElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #dropdownMenuSyncing = false;

  override connectedCallback() {
    super.connectedCallback();
    bindDropdownMenuOutsideEvents(this);
    bindDropdownMenuHoverEvents(this);
  }

  disconnectedCallback() {
    unbindDropdownMenuHoverEvents(this);
    unbindDropdownMenuOutsideEvents(this);
  }

  syncDropdownMenuTreeFromRoot() {
    if (this.#dropdownMenuSyncing) {
      return;
    }

    this.#dropdownMenuSyncing = true;
    try {
      syncDropdownMenuTreeFromRoot(this);
    } finally {
      this.#dropdownMenuSyncing = false;
    }
  }
}

export type RootElement = InstanceType<typeof Root>;
