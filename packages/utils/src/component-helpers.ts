import type { WebComponentHelperSpec, WebComponentPartSpec } from "./types";

export function createComponentPartHelpers<const TPartSpec extends WebComponentPartSpec>(
  spec: WebComponentHelperSpec<TPartSpec>,
  defaultPartName: TPartSpec["name"],
) {
  function getPartSpec(partName: TPartSpec["name"]) {
    const part = spec.parts.find((candidate) => candidate.name === partName);
    if (!part) {
      throw new Error(`Unknown ${spec.packageName} part: ${partName}`);
    }

    return part;
  }

  function createElement(partName: TPartSpec["name"] = defaultPartName) {
    const part = getPartSpec(partName);
    return document.createElement(part.tagName);
  }

  return { getPartSpec, createElement } as const;
}
