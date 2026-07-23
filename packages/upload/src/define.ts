import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Item } from "./parts/Item";
import { List } from "./parts/List";
import { Selector } from "./parts/Selector";
import { AutoSubmit } from "./parts/AutoSubmit";
import { Clear } from "./parts/Clear";
import { Submit } from "./parts/Submit";
import { FileName } from "./parts/FileName";
import { FileSize } from "./parts/FileSize";
import { FileExtension } from "./parts/FileExtension";
import { FileStatus } from "./parts/FileStatus";
import { FileProgress } from "./parts/FileProgress";
import { FileRemove } from "./parts/FileRemove";

const definitions = [
  ["aria-upload", Root],
  ["aria-upload-item", Item],
  ["aria-upload-list", List],
  ["aria-upload-selector", Selector],
  ["aria-upload-auto-submit", AutoSubmit],
  ["aria-upload-clear", Clear],
  ["aria-upload-submit", Submit],
  ["aria-upload-file-name", FileName],
  ["aria-upload-file-size", FileSize],
  ["aria-upload-file-extension", FileExtension],
  ["aria-upload-file-status", FileStatus],
  ["aria-upload-file-progress", FileProgress],
  ["aria-upload-file-remove", FileRemove],
] as const;

export function defineUploadElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
