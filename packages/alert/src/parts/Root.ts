import { AlertElement } from "../alert-element";
import { requestAlertDismiss } from "../alert-actions";
import { syncAlertTreeFromRoot } from "../alert-sync";
import { getAlertPartSpec } from "./part-spec";

const partSpec = getAlertPartSpec("Root");

export class Root extends AlertElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertSyncing = false;

  syncAlertTreeFromRoot() {
    if (this.#alertSyncing || !this.isConnected) {
      return;
    }

    this.#alertSyncing = true;
    try {
      syncAlertTreeFromRoot(this);
    } finally {
      this.#alertSyncing = false;
    }
  }

  requestAlertDismiss(source: Element) {
    return requestAlertDismiss(this, source);
  }
}

export type RootElement = InstanceType<typeof Root>;
