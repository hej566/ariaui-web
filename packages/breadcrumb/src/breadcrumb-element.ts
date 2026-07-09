import { AriaWebElement } from "@ariaui-web/utils";
import { syncBreadcrumbPart } from "./breadcrumb-sync";

export class BreadcrumbElement extends AriaWebElement {
  static override packageSlug = "breadcrumb";

  override afterAriaWebContractApplied() {
    syncBreadcrumbPart(this);
  }
}
