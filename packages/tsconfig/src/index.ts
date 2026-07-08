export const webComponentTsConfig = {
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "Bundler",
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    strict: true,
  },
} as const;

export default webComponentTsConfig;

export { componentSpec } from "./component-spec";
