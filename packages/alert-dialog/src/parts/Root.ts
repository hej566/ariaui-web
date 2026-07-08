import { AlertDialogElement } from "../alert-dialog-element";
import {
  focusInitialAlertDialogTarget,
  requestAlertDialogClose,
  requestAlertDialogOpen,
  restoreAlertDialogFocus,
} from "../alert-dialog-actions";
import {
  releaseAlertDialogModalEffects,
  syncAlertDialogTreeFromRoot,
} from "../alert-dialog-sync";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Root");

export class Root extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogObserver: MutationObserver | null = null;
  #alertDialogSyncing = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.observeAlertDialogTree();
  }

  disconnectedCallback() {
    releaseAlertDialogModalEffects(this);
    this.#alertDialogObserver?.disconnect();
    this.#alertDialogObserver = null;
  }

  observeAlertDialogTree() {
    if (this.#alertDialogObserver || typeof MutationObserver === "undefined") {
      return;
    }

    this.#alertDialogObserver = new MutationObserver(() => {
      if (!this.#alertDialogSyncing) {
        this.syncAlertDialogTreeFromRoot();
      }
    });
    this.#alertDialogObserver.observe(this, { childList: true, subtree: true });
  }

  syncAlertDialogTreeFromRoot() {
    if (this.#alertDialogSyncing || !this.isConnected) {
      return;
    }

    this.#alertDialogSyncing = true;
    try {
      syncAlertDialogTreeFromRoot(this);
    } finally {
      this.#alertDialogSyncing = false;
    }
  }

  requestAlertDialogOpen(source: Element) {
    return requestAlertDialogOpen(this, source);
  }

  requestAlertDialogClose(source: Element = this) {
    return requestAlertDialogClose(this, source);
  }

  focusInitialAlertDialogTarget() {
    focusInitialAlertDialogTarget(this);
  }

  restoreAlertDialogFocus(content: HTMLElement | null) {
    restoreAlertDialogFocus(this, content);
  }
}

export type RootElement = InstanceType<typeof Root>;
