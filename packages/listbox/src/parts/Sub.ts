import { ListboxWebElement } from "../listbox-element";
import type { ListboxOffset } from "../listbox-dom";
import { syncListboxTreeAround } from "../listbox-sync";
import { getListboxPartSpec } from "./part-spec";

const partSpec = getListboxPartSpec("Sub");

export class Sub extends ListboxWebElement {
  static override packageSlug = "listbox";
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;

  get offset(): ListboxOffset {
    const x = Number(this.getAttribute("offset-x") ?? 0);
    const y = Number(this.getAttribute("offset-y") ?? 0);
    return {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    };
  }

  set offset(value: ListboxOffset) {
    this.setAttribute("offset-x", String(value.x));
    this.setAttribute("offset-y", String(value.y));
    syncListboxTreeAround(this);
  }
}

export type SubElement = Sub;
