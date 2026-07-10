import { AriaWebElement } from "@ariaui-web/utils";
import { handleGridCellClick, handleGridCellFocus, handleGridCellKeyDown } from "./grid-actions";
import { disconnectGridTree, observeGridTree, syncGridTreeAround } from "./grid-sync";

export class GridElement extends AriaWebElement {
  static override packageSlug = "grid";
  #gridEventsBound = false;

  get defaultValue() {
    return this.getAttribute("default-value") ?? "";
  }

  set defaultValue(value: string) {
    if (value == null) {
      this.removeAttribute("default-value");
    } else {
      this.setAttribute("default-value", String(value));
    }
  }

  gridPartName() {
    return (this.constructor as typeof GridElement).partName;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.bindGridEvents();

    if (this.gridPartName() === "Root") {
      observeGridTree(this);
    }

    syncGridTreeAround(this);
  }

  disconnectedCallback() {
    if (this.gridPartName() === "Root") {
      disconnectGridTree(this);
    }
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    syncGridTreeAround(this);
  }

  override afterAriaWebContractApplied() {
    syncGridTreeAround(this);
  }

  bindGridEvents() {
    if (this.#gridEventsBound || this.gridPartName() !== "Cell") {
      return;
    }

    this.addEventListener("click", this.handleGridClick);
    this.addEventListener("focus", this.handleGridFocus);
    this.addEventListener("keydown", this.handleGridKeyDown);
    this.#gridEventsBound = true;
  }

  handleGridClick = (event: Event) => {
    handleGridCellClick(this, event);
  };

  handleGridFocus = () => {
    handleGridCellFocus(this);
  };

  handleGridKeyDown = (event: Event) => {
    handleGridCellKeyDown(this, event as KeyboardEvent);
  };
}
