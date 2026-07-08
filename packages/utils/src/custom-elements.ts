export function defineCustomElement(tagName: string, element: CustomElementConstructor) {
  if (typeof customElements === "undefined") {
    return;
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, element);
  }
}
