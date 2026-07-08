export const badgePreservedDataAttributes = ["data-disabled", "data-slot", "data-state", "data-variant"] as const;

export function isPreservedBadgeDataAttribute(name: string): name is typeof badgePreservedDataAttributes[number] {
  return (badgePreservedDataAttributes as readonly string[]).includes(name);
}

export function badgeInteractiveRole(asValue: string | null) {
  if (asValue === "a") {
    return "link";
  }

  if (asValue === "button") {
    return "button";
  }

  return null;
}
