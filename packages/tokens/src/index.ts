export const primitives = {
  zinc: {
    50: "98.5% 0 0",
    500: "55.2% 0.014 286",
    950: "14.5% 0 0",
  },
  blue: {
    500: "62.3% 0.188 259",
    600: "54.6% 0.215 263",
  },
} as const;

export const light = {
  background: "oklch(100% 0 0 / 1)",
  foreground: "oklch(14.5% 0 0 / 1)",
  border: "oklch(92.2% 0 0 / 1)",
  primary: "oklch(var(--color-blue-600) / 1)",
  "primary-foreground": "oklch(100% 0 0 / 1)",
} as const;

export const dark = {
  background: "oklch(14.5% 0 0 / 1)",
  foreground: "oklch(98.5% 0 0 / 1)",
  border: "oklch(26.9% 0 0 / 1)",
  primary: "oklch(var(--color-blue-500) / 1)",
  "primary-foreground": "oklch(14.5% 0 0 / 1)",
} as const;

export function generateCSS() {
  const primitiveLines = Object.entries(primitives)
    .flatMap(([color, steps]) => Object.entries(steps).map(([step, value]) => `  --color-${color}-${step}: ${value};`))
    .join("\n");
  const lightLines = Object.entries(light).map(([name, value]) => `  --${name}: ${value};`).join("\n");
  const darkLines = Object.entries(dark).map(([name, value]) => `  --${name}: ${value};`).join("\n");

  return `:root {\n${primitiveLines}\n${lightLines}\n}\n\n.dark {\n${darkLines}\n}\n\n@theme {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --color-border: var(--border);\n  --color-primary: var(--primary);\n  --color-primary-foreground: var(--primary-foreground);\n}`;
}

export { componentSpec } from "./component-spec";
