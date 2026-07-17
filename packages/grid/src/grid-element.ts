import { AriaWebElement } from "@ariaui-web/utils";
import { handleGridCellClick, handleGridCellFocus, handleGridCellKeyDown } from "./grid-actions";
import { gridCellHost } from "./grid-dom";
import { clearGridCompositionHost, disconnectGridTree, observeGridTree, syncGridTreeAround } from "./grid-sync";

export class GridElement extends AriaWebElement {
  static override packageSlug = "grid";
  #gridEventsBound = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "aria-label", "class", "col-index", "native-composition", "row-index", "style", "title"]));
  }

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

  get rowIndex() {
    const value = Number(this.getAttribute("row-index"));
    return this.hasAttribute("row-index") && Number.isFinite(value) ? value : undefined;
  }

  set rowIndex(value: number | undefined) {
    if (value == null) this.removeAttribute("row-index");
    else this.setAttribute("row-index", String(value));
  }

  get colIndex() {
    const value = Number(this.getAttribute("col-index"));
    return this.hasAttribute("col-index") && Number.isFinite(value) ? value : undefined;
  }

  set colIndex(value: number | undefined) {
    if (value == null) this.removeAttribute("col-index");
    else this.setAttribute("col-index", String(value));
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
    if (name === "native-composition" && oldValue !== null && newValue === null) {
      clearGridCompositionHost(this);
    }
    super.attributeChangedCallback(name, oldValue, newValue);
    if (this.isConnected) syncGridTreeAround(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncGridTreeAround(this);
  }

  bindGridEvents() {
    if (this.#gridEventsBound || this.gridPartName() !== "Cell") {
      return;
    }

    this.addEventListener("click", this.handleGridClick);
    this.addEventListener("focusin", this.handleGridFocus);
    this.addEventListener("keydown", this.handleGridKeyDown);
    this.#gridEventsBound = true;
  }

  handleGridClick = (event: Event) => {
    handleGridCellClick(gridCellHost(this), event);
  };

  handleGridFocus = () => {
    handleGridCellFocus(gridCellHost(this));
  };

  handleGridKeyDown = (event: Event) => {
    handleGridCellKeyDown(gridCellHost(this), event as KeyboardEvent);
  };
}
