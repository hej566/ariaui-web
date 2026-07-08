import { setBooleanAttribute } from "./boolean-attributes";
import { isButtonLikeRole, isCheckableRole, isExpandableRole, isFocusableRole, isSelectableRole, isSpaceKey } from "./roles";
import { kebabCase } from "./tag-name";

const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement === "undefined"
    ? (class {} as unknown as typeof HTMLElement)
    : HTMLElement;

export class AriaWebElement extends HTMLElementBase {
  static packageSlug = "primitive";
  static partName = "Root";
  static defaultRole: string | null = null;
  static defaultAttributes: Readonly<Record<string, string>> = {};
  #eventsBound = false;
  #defaultApplied = false;

  static get observedAttributes() {
    return [
      "aria-controls",
      "aria-labelledby",
      "checked",
      "collapsible",
      "default-value",
      "defaultvalue",
      "default-checked",
      "dir",
      "disabled",
      "force-mount",
      "indeterminate",
      "name",
      "open",
      "orientation",
      "pressed",
      "required",
      "selected",
      "type",
      "value",
    ];
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value: boolean) {
    setBooleanAttribute(this, "checked", value);
  }

  get defaultChecked() {
    return this.hasAttribute("default-checked");
  }

  set defaultChecked(value: boolean) {
    setBooleanAttribute(this, "default-checked", value);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, "disabled", value);
  }

  get indeterminate() {
    return this.hasAttribute("indeterminate");
  }

  set indeterminate(value: boolean) {
    setBooleanAttribute(this, "indeterminate", value);
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(value: boolean) {
    setBooleanAttribute(this, "open", value);
  }

  get pressed() {
    return this.hasAttribute("pressed");
  }

  set pressed(value: boolean) {
    setBooleanAttribute(this, "pressed", value);
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  set selected(value: boolean) {
    setBooleanAttribute(this, "selected", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    if (value == null) {
      this.removeAttribute("value");
    } else {
      this.setAttribute("value", String(value));
    }
  }

  connectedCallback() {
    this.bindAriaWebEvents();
    this.applyDefaultChecked();
    this.applyAriaWebContract();
    this.afterAriaWebContractApplied();
  }

  attributeChangedCallback() {
    this.applyDefaultChecked();
    this.applyAriaWebContract();
    this.afterAriaWebContractApplied();
  }

  bindAriaWebEvents() {
    if (this.#eventsBound) {
      return;
    }

    this.addEventListener("click", this.handleAriaWebClick);
    this.addEventListener("keydown", this.handleAriaWebKeyDown);
    this.addEventListener("keyup", this.handleAriaWebKeyUp);
    this.#eventsBound = true;
  }

  applyDefaultChecked() {
    if (this.#defaultApplied) {
      return;
    }

    if (this.hasAttribute("default-checked") && !this.hasAttribute("checked")) {
      this.setAttribute("checked", "");
    }

    this.#defaultApplied = true;
  }

  applyAriaWebContract() {
    const constructor = this.constructor as typeof AriaWebElement;
    this.setAttribute("data-ariaui-web", constructor.packageSlug);
    this.setAttribute("data-package", constructor.packageSlug);
    this.setAttribute("data-part", constructor.partName);

    if (!this.hasAttribute("part")) {
      this.setAttribute("part", kebabCase(constructor.partName));
    }

    for (const [attribute, value] of Object.entries(constructor.defaultAttributes)) {
      if (!this.hasAttribute(attribute)) {
        this.setAttribute(attribute, value);
      }
    }

    if (constructor.defaultRole && !this.hasAttribute("role")) {
      this.setAttribute("role", constructor.defaultRole);
    }

    const role = this.getAttribute("role");

    if (this.hasAttribute("disabled")) {
      this.setAttribute("aria-disabled", "true");
      this.setAttribute("data-disabled", "");
    } else {
      this.removeAttribute("aria-disabled");
      this.removeAttribute("data-disabled");
    }

    const state = this.resolveState(role);
    if (state) {
      this.setAttribute("data-state", state);
    } else {
      this.removeAttribute("data-state");
    }

    if (isCheckableRole(role)) {
      this.setAttribute("aria-checked", this.hasAttribute("indeterminate") ? "mixed" : String(this.hasAttribute("checked")));
    } else {
      this.removeAttribute("aria-checked");
    }

    if (this.hasAttribute("open")) {
      this.setAttribute("aria-expanded", "true");
    } else if (isExpandableRole(role)) {
      this.setAttribute("aria-expanded", "false");
    } else {
      this.removeAttribute("aria-expanded");
    }

    if (this.hasAttribute("pressed")) {
      this.setAttribute("aria-pressed", "true");
    } else {
      this.removeAttribute("aria-pressed");
    }

    if (this.hasAttribute("selected") || isSelectableRole(role)) {
      this.setAttribute("aria-selected", String(this.hasAttribute("selected")));
    } else {
      this.removeAttribute("aria-selected");
    }

    if (this.hasAttribute("value")) {
      this.setAttribute("data-value", this.getAttribute("value") ?? "");
    } else {
      this.removeAttribute("data-value");
    }

    const orientation = this.getAttribute("orientation");
    if (orientation) {
      this.setAttribute("data-orientation", orientation);
    } else {
      this.removeAttribute("data-orientation");
    }

    if (isFocusableRole(role) && (!this.hasAttribute("tabindex") || this.getAttribute("tabindex") === "0" || this.getAttribute("tabindex") === "-1")) {
      this.setAttribute("tabindex", this.hasAttribute("disabled") ? "-1" : "0");
    }

    this.syncHiddenInput(role);
  }

  resolveState(role: string | null) {
    if (this.hasAttribute("open")) {
      return "open";
    }

    if (isCheckableRole(role)) {
      if (this.hasAttribute("indeterminate")) {
        return "indeterminate";
      }

      return this.hasAttribute("checked") ? "checked" : "unchecked";
    }

    if (this.hasAttribute("selected")) {
      return "checked";
    }

    if (this.hasAttribute("pressed")) {
      return "pressed";
    }

    return null;
  }

  syncHiddenInput(role: string | null) {
    const existing = this.querySelector("input[data-ariaui-web-hidden-input='true']");
    if (!isCheckableRole(role) || !this.hasAttribute("name")) {
      existing?.remove();
      return;
    }

    const input = existing instanceof HTMLInputElement ? existing : document.createElement("input");
    input.type = "hidden";
    input.name = this.getAttribute("name") ?? "";
    input.value = this.hasAttribute("value") ? this.getAttribute("value") ?? "" : String(this.hasAttribute("checked"));
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    input.dataset.ariauiWebHiddenInput = "true";

    if (!existing) {
      this.append(input);
    }
  }

  controlledElement() {
    const controlledId = this.getAttribute("aria-controls");
    return controlledId ? this.ownerDocument.getElementById(controlledId) : null;
  }

  afterAriaWebContractApplied() {}

  handleCompositeRovingFocus(_event: KeyboardEvent, _role: string | null) {
    return false;
  }

  toggleControlledElement() {
    const controlledElement = this.controlledElement();
    if (!controlledElement) {
      return false;
    }

    const nextOpen = !this.hasAttribute("open");
    this.open = nextOpen;
    setBooleanAttribute(controlledElement, "open", nextOpen);
    controlledElement.hidden = !nextOpen;
    return true;
  }

  handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }

    const role = this.getAttribute("role");
    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (isCheckableRole(role)) {
      if (this.hasAttribute("indeterminate")) {
        this.removeAttribute("indeterminate");
        this.checked = true;
      } else {
        this.checked = !this.checked;
      }
      return;
    }

    if (isExpandableRole(role) && this.toggleControlledElement()) {
      return;
    }

    if (this.hasAttribute("pressed")) {
      this.pressed = !this.pressed;
    }
  };

  handleAriaWebKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const role = this.getAttribute("role");
    if (!isButtonLikeRole(role)) {
      return;
    }

    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      return;
    }

    if (this.handleCompositeRovingFocus(event, role)) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      this.click();
    }

    if (isSpaceKey(event)) {
      event.preventDefault();
    }
  };

  handleAriaWebKeyUp = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const role = this.getAttribute("role");
    if (!isButtonLikeRole(role) || this.hasAttribute("disabled")) {
      return;
    }

    if (isSpaceKey(event)) {
      event.preventDefault();
      this.click();
    }
  }
}
  
export type AriaWebElementConstructor = typeof AriaWebElement;
