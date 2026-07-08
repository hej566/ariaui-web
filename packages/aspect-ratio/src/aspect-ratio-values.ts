const fallbackRatio = 1;

function resolveRatioPair(value: string, separator: "/" | ":") {
  const pattern = separator === "/"
    ? /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/
    : /^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/;
  const match = value.match(pattern);
  if (!match) {
    return null;
  }

  const [widthValue, heightValue] = match.slice(1);
  if (!widthValue || !heightValue) {
    return null;
  }

  const width = Number.parseFloat(widthValue);
  const height = Number.parseFloat(heightValue);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return width / height;
}

function resolveNumericRatio(value: string) {
  if (!/^\d+(?:\.\d+)?$/.test(value)) {
    return null;
  }

  const ratio = Number.parseFloat(value);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : null;
}

export function resolveAspectRatio(ratio: number | string | null | undefined) {
  if (ratio == null) {
    return fallbackRatio;
  }

  if (typeof ratio === "number") {
    return Number.isFinite(ratio) && ratio > 0 ? ratio : fallbackRatio;
  }

  const value = String(ratio).trim();
  if (!value) {
    return fallbackRatio;
  }

  return resolveRatioPair(value, "/")
    ?? resolveRatioPair(value, ":")
    ?? resolveNumericRatio(value)
    ?? fallbackRatio;
}
