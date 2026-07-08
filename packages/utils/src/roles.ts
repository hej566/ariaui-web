export function isFocusableRole(role: string | null) {
  return role === "button" || role === "checkbox" || role === "link" || role === "menuitemcheckbox" || role === "menuitemradio" || role === "option" || role === "switch" || role === "tab";
}

export function isButtonLikeRole(role: string | null) {
  return role === "button" || isCheckableRole(role) || role === "link" || role === "option" || role === "tab";
}

export function isCheckableRole(role: string | null) {
  return role === "checkbox" || role === "menuitemcheckbox" || role === "menuitemradio" || role === "radio" || role === "switch";
}

export function isExpandableRole(role: string | null) {
  return role === "button" || role === "combobox" || role === "menuitem";
}

export function isSelectableRole(role: string | null) {
  return role === "option" || role === "row" || role === "tab" || role === "treeitem";
}

export function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}
