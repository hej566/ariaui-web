import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const targetRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(dirname(targetRoot), "ariaui");
const sourcePackages = join(sourceRoot, "packages");
const sourceDocsRoot = join(sourceRoot, "web", "doc", "src");
const sourceDocsPublicRoot = join(sourceRoot, "web", "doc", "public");
const sourceComponentPages = join(sourceDocsRoot, "app", "docs", "components");
const sourceMarkdocPartials = join(sourceDocsRoot, "markdoc", "partials");
const sourceDocComponents = join(sourceDocsRoot, "components");
const sourceAnatomySnippetsPath = join(sourceDocsRoot, "lib", "code-snippet", "docAnatomySnippets.ts");
const sourceMarkdocTagsPath = join(sourceDocsRoot, "markdoc", "tags.js");
const targetPackages = join(targetRoot, "packages");
const docsRoot = join(targetRoot, "web", "doc");

const packageScope = "@ariaui-web";
const sourceScope = "@ariaui";
const typescriptVersion = "7.0.1-rc";
const componentExcludedPackages = new Set(["hooks", "keyboard", "position", "tokens", "tsconfig", "utils"]);
const docsHiddenPackages = new Set(["arrow", "focus-scope", "hooks"]);

const rootRoleByPackage = new Map([
  ["alert", "alert"],
  ["button", "group"],
  ["checkbox", "group"],
  ["dialog", "dialog"],
  ["alert-dialog", "alertdialog"],
  ["grid", "grid"],
  ["listbox", "listbox"],
  ["menubar", "menubar"],
  ["navigation-menu", "navigation"],
  ["progress", "progressbar"],
  ["radio", "radiogroup"],
  ["separator", "separator"],
  ["slider", "group"],
  ["spinbutton", "spinbutton"],
  ["switch", "switch"],
  ["table", "table"],
  ["tabs", "tablist"],
  ["toast", "status"],
  ["toolbar", "toolbar"],
  ["treegrid", "treegrid"],
  ["treeview", "tree"],
]);

const roleByPart = new Map([
  ["Action", "button"],
  ["Button", "button"],
  ["Cancel", "button"],
  ["CheckboxItem", "menuitemcheckbox"],
  ["Close", "button"],
  ["ColumnHeader", "columnheader"],
  ["Content", "region"],
  ["Description", "note"],
  ["Group", "group"],
  ["Header", "heading"],
  ["Indicator", "presentation"],
  ["Input", "textbox"],
  ["Item", "listitem"],
  ["ItemIndicator", "presentation"],
  ["Label", "label"],
  ["Link", "link"],
  ["List", "list"],
  ["Option", "option"],
  ["Overlay", "presentation"],
  ["Panel", "tabpanel"],
  ["RadioGroup", "radiogroup"],
  ["RadioItem", "menuitemradio"],
  ["Range", "presentation"],
  ["Row", "row"],
  ["RowHeader", "rowheader"],
  ["Scrollbar", "scrollbar"],
  ["Separator", "separator"],
  ["SubTrigger", "button"],
  ["Thumb", "presentation"],
  ["Title", "heading"],
  ["Toggle", "button"],
  ["Track", "presentation"],
  ["Trigger", "button"],
  ["Viewport", "group"],
]);

const roleByPackagePart = new Map([
  ["accordion:Panel", "region"],
  ["alert:Action", null],
  ["alert:Description", null],
  ["dialog:Content", null],
  ["dialog:Description", null],
  ["dialog:Root", null],
  ["alert-dialog:Content", null],
  ["alert-dialog:Description", null],
  ["alert-dialog:Root", null],
  ["button:Root", "button"],
  ["button:Item", "button"],
  ["checkbox:Root", "checkbox"],
  ["checkbox:Item", "checkbox"],
  ["command:Content", "listbox"],
  ["command:Item", "option"],
  ["command:Option", "option"],
  ["combobox:Content", "listbox"],
  ["combobox:Root", "combobox"],
  ["context-menu:Content", "menu"],
  ["context-menu:Item", "menuitem"],
  ["dropdown-menu:Content", "menu"],
  ["dropdown-menu:Item", "menuitem"],
  ["listbox:Content", "listbox"],
  ["menubar:Content", "menu"],
  ["menubar:Item", "menuitem"],
  ["radio:Item", "radio"],
  ["select:Content", "listbox"],
  ["select:Option", "option"],
  ["tabs:Content", null],
  ["tabs:List", "tablist"],
  ["tabs:Root", null],
  ["tabs:Trigger", "tab"],
  ["toggle:Root", "button"],
  ["toggle-group:Item", "button"],
  ["toggle-group:Root", "group"],
]);

function resetDir(path) {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function write(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, `${content.replace(/\s+$/, "")}\n`, "utf8");
}

function writeJson(path, value) {
  write(path, JSON.stringify(value, null, 2));
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function maybeRead(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function displaySourcePath(path) {
  return path.replace(sourceRoot, "../ariaui");
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n*/, "");
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = match?.[1] ?? "";
  return {
    title: frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? "",
    description:
      frontmatter.match(/^\s+description:\s*(.+)$/m)?.[1]?.trim() ??
      frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ??
      "",
  };
}

function parseMarkdocAttributes(source) {
  return Object.fromEntries(
    Array.from(source.matchAll(/([A-Za-z][A-Za-z0-9-]*)="([^"]*)"/g)).map((match) => [match[1], match[2]]),
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractConstObjectLiteral(source, name) {
  const start = source.indexOf(`const ${name} = {`);
  if (start === -1) {
    return "{}";
  }

  const objectStart = source.indexOf("{", start);
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = objectStart; index < source.length; index++) {
    const character = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = "";
      }
      continue;
    }

    if (character === "\"" || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "{") {
      depth++;
    } else if (character === "}") {
      depth--;
      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  throw new Error(`Could not parse ${name} object literal`);
}

function readConstObject(path, name) {
  const objectLiteral = extractConstObjectLiteral(readFileSync(path, "utf8"), name);
  return runInNewContext(`(${objectLiteral})`, Object.create(null), { timeout: 1000 });
}

let sourceDemoDescriptionsCache;
function sourceDemoDescriptions() {
  sourceDemoDescriptionsCache ??= new Map(Object.entries(readConstObject(sourceMarkdocTagsPath, "exampleDemoDescriptions")));
  return sourceDemoDescriptionsCache;
}

let sourceAnatomySnippetsCache;
function sourceAnatomySnippets() {
  sourceAnatomySnippetsCache ??= new Map(Object.entries(readConstObject(sourceAnatomySnippetsPath, "DOC_ANATOMY_SNIPPETS")));
  return sourceAnatomySnippetsCache;
}

function kebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function pascalCase(value) {
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("");
}

function titleCase(value) {
  const acronyms = new Map([
    ["otp", "OTP"],
  ]);

  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => acronyms.get(part.toLowerCase()) ?? `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function camelCase(value) {
  const pascal = pascalCase(value);
  return `${pascal[0].toLowerCase()}${pascal.slice(1)}`;
}

function customElementTag(packageName, partName) {
  if (packageName === "focus-scope" && partName === "FocusScope") {
    return "aria-focus-scope";
  }

  return partName === "Root"
    ? `aria-${packageName}`
    : `aria-${packageName}-${kebabCase(partName)}`;
}

function findPackageNames() {
  return readdirSync(sourcePackages, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(sourcePackages, entry.name, "package.json")))
    .map((entry) => entry.name)
    .sort();
}

function findSourceIndex(packageName) {
  const base = join(sourcePackages, packageName);
  for (const file of ["index.tsx", "index.ts"]) {
    const path = join(base, file);
    if (existsSync(path)) return path;
  }

  return null;
}

function collectParts(packageName) {
  if (componentExcludedPackages.has(packageName)) {
    return [];
  }

  const packageRoot = join(sourcePackages, packageName);
  const parts = new Set();
  const indexPath = findSourceIndex(packageName);

  if (indexPath) {
    const indexSource = readFileSync(indexPath, "utf8");
    for (const match of indexSource.matchAll(/\bexport\s+\{\s*([^}]+)\s*\}/g)) {
      for (const rawName of match[1].split(",")) {
        const exportedName = rawName.split(/\s+as\s+/).pop().trim();
        if (/^[A-Z][A-Za-z0-9]*$/.test(exportedName)) {
          parts.add(exportedName);
        }
      }
    }

    for (const match of indexSource.matchAll(/\bexport\s+\*\s+from\s+["']\.\/src\/([^"']+)["']/g)) {
      const part = match[1].split("/")[0];
      if (/^[A-Z][A-Za-z0-9]*$/.test(part)) {
        parts.add(part);
      }
    }
  }

  const sourceDir = join(packageRoot, "src");
  if (existsSync(sourceDir)) {
    for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !/^[A-Z]/.test(entry.name)) {
        continue;
      }

      if (
        existsSync(join(sourceDir, entry.name, "index.tsx")) ||
        existsSync(join(sourceDir, entry.name, "index.ts"))
      ) {
        parts.add(entry.name);
      }
    }
  }

  if (packageName === "portal") {
    parts.add("Root");
  }

  if (parts.size === 0) {
    parts.add("Root");
  }

  return Array.from(parts).sort((left, right) => {
    if (left === "Root") return -1;
    if (right === "Root") return 1;
    return left.localeCompare(right);
  });
}

function sourcePartPath(packageName, partName) {
  const sourceDir = join(sourcePackages, packageName, "src", partName);
  if (existsSync(join(sourceDir, "index.tsx"))) {
    return `src/${partName}/index.tsx`;
  }

  if (existsSync(join(sourceDir, "index.ts"))) {
    return `src/${partName}/index.ts`;
  }

  return findSourceIndex(packageName) ? findSourceIndex(packageName).replace(`${join(sourcePackages, packageName)}/`, "") : "index.ts";
}

function getReadmePath(packageName) {
  const packageRoot = join(sourcePackages, packageName);
  for (const file of ["readme.md", "README.md"]) {
    const path = join(packageRoot, file);
    if (existsSync(path)) return path;
  }

  return null;
}

function readSourceSpec(packageName) {
  const readmePath = getReadmePath(packageName);
  if (!readmePath) {
    return `# ${pascalCase(packageName)} Spec\n\nNo source readme exists in ${sourceScope}/${packageName}.`;
  }

  return readFileSync(readmePath, "utf8");
}

function firstParagraph(markdown) {
  return stripFrontmatter(markdown)
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("---") && !block.includes("{%"))
    ?.replace(/\s+/g, " ")
    .slice(0, 220) || "Browser-native Web Component package.";
}

function nativePackageDescription(packageName, sourceSpec) {
  const fallback = `${packageScope}/${packageName} exposes browser-native custom elements with package-level tests and a native component spec.`;
  const description = firstParagraph(sourceSpec);

  if (description.startsWith("No source readme exists in")) {
    return fallback;
  }

  return nativeSourceText(description, packageName);
}

function asciiText(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[\u201c\u201d]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2192/g, "->")
    .replace(/\u2190/g, "<-")
    .replace(/\u2194/g, "<->")
    .replace(/\u00d7/g, "x")
    .replace(/\u00f7/g, "/")
    .replace(/\u2264/g, "<=")
    .replace(/\u2265/g, ">=")
    .replace(/\u2260/g, "!=")
    .replace(/[\u2705\u2713\u2714]/g, "yes")
    .replace(/[\u274c\u2717\u2718]/g, "no")
    .replace(/\u2022/g, "*")
    .replace(/\u25bc/g, "v")
    .replace(/[\u2500-\u257f]/g, (character) => {
      if (character === "\u2500") return "-";
      if (character === "\u2502") return "|";
      return "+";
    })
    .replace(/\u2026/g, "...");
}

function nativeSourceText(text, packageName) {
  return asciiText(text)
    .replaceAll(`${sourceScope}/${packageName}`, `${packageScope}/${packageName}`)
    .replaceAll(`${sourceScope}/`, `${packageScope}/`)
    .replace(/https:\/\/react\.dev\/reference\/react-dom\/components\/input/g, "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input")
    .replace(/https:\/\/react\.dev\/reference\/react-dom\/components\/textarea/g, "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea")
    .replace(/https:\/\/react\.dev\/reference\/react-dom\/createPortal/g, "https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild")
    .replace(/Server output from `react-dom\/server` \([^)]*\) is supported:/g, "Server-rendered HTML is supported:")
    .replace(/`react-dom\/server` \([^)]*\)/g, "server-rendered HTML")
    .replace(/react-dom\/server/g, "server-rendered HTML")
    .replace(/React\.ComponentPropsWithoutRef<([^>]+)>/g, "native element attributes/properties for $1")
    .replace(/React\.ComponentPropsWithRef<([^>]+)>/g, "native element attributes/properties for $1")
    .replace(/React\.HTMLAttributes<([^>]+)>/g, "native HTML attributes/properties for $1")
    .replace(/React\.ButtonHTMLAttributes<([^>]+)>/g, "native button attributes/properties for $1")
    .replace(/React\.LabelHTMLAttributes<([^>]+)>/g, "native label attributes/properties for $1")
    .replace(/React\.InputHTMLAttributes<([^>]+)>/g, "native input attributes/properties for $1")
    .replace(/React\.TextareaHTMLAttributes<([^>]+)>/g, "native textarea attributes/properties for $1")
    .replace(/React\.AriaAttributes/g, "ARIA attributes")
    .replace(/React\.CSSProperties/g, "CSS properties")
    .replace(/React\.KeyboardEvent/g, "KeyboardEvent")
    .replace(/React\.MouseEvent/g, "MouseEvent")
    .replace(/React\.PointerEvent/g, "PointerEvent")
    .replace(/React\.FocusEvent/g, "FocusEvent")
    .replace(/React\.FormEvent/g, "Event")
    .replace(/React\.ChangeEvent/g, "Event")
    .replace(/React\.ReactNode/g, "Node | string")
    .replace(/\bReactNode\b/g, "Node | string")
    .replace(/\bHeadless React\b/g, "Headless Web Component")
    .replace(/\bReact Server Components\b/g, "server-rendered HTML")
    .replace(/\bReact Component\b/g, "custom element")
    .replace(/\bReact component\b/g, "custom element")
    .replace(/\bReactDOM\.createPortal\(\.\.\.\)/g, "native DOM portal insertion")
    .replace(/\bReactDOM\b/g, "native DOM")
    .replace(/\bReact\.cloneElement\b/g, "DOM composition")
    .replace(/\bReact\.useCallback\b/g, "event callback")
    .replace(/\bReact\.useEffect\b/g, "custom element lifecycle callback")
    .replace(/\bReact\.useMemo\b/g, "cached value")
    .replace(/\bReact\.useRef\b/g, "element reference")
    .replace(/\bReact\.useState\b/g, "custom element state")
    .replace(/\bReact\.ReactElement\b/g, "Element")
    .replace(/\bReact\.ReactEventHandler\b/g, "EventListener")
    .replace(/\bReact\.Children\b/g, "DOM child traversal")
    .replace(/\bReact\.forwardRef\b/g, "custom element host references")
    .replace(/\bReact\.RefObject<HTMLElement \| null>/g, "HTMLElement reference")
    .replace(/\bReactEventHandler\b/g, "EventListener")
    .replace(/\bReact context\b/g, "DOM context")
    .replace(/\bReact\b/g, "native Web Component")
    .replace(/\bClient Component boundary\b/g, "client-side custom element registration boundary")
    .replace(/\bClient Component\b/g, "client-side custom element registration")
    .replace(/\bclient modules\b/g, "client-side custom element modules")
    .replace(/\bcomponents are client modules\b/g, "custom elements are client-side modules")
    .replace(/\bComponents are client modules\b/g, "Custom elements are client-side modules")
    .replace(/\bSubcomponents are \*\*client-side custom element modules\*\* \(`"use client"`\)\./g, "Custom elements must be registered on the client.")
    .replace(/\bAll exported components are client-side custom element modules \(`"use client"`\)\./g, "All exported custom elements must be registered on the client.")
    .replace(/\bprops?\b/g, "attributes/properties")
    .replace(/\basChild\b/g, "native composition")
    .replace(/\bSlot\b/g, "native composition host")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceLearningPath(packageName) {
  const readmePath = getReadmePath(packageName);
  return readmePath ? displaySourcePath(readmePath) : `../ariaui/packages/${packageName}`;
}

function markdownSections(markdown) {
  const sections = [];
  let current = null;

  for (const rawLine of stripFrontmatter(markdown).split("\n")) {
    const line = rawLine.trim();
    const heading = line.match(/^(#{1,6})\s+(.+)$/);

    if (heading) {
      if (current) {
        sections.push(current);
      }
      current = {
        level: heading[1].length,
        title: heading[2].replace(/#+$/, "").trim(),
        lines: [],
      };
      continue;
    }

    if (!current) {
      current = { level: 2, title: "Overview", lines: [] };
    }

    current.lines.push(rawLine);
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}

function nativeRequirementText(text, spec) {
  const partNames = spec.parts.map((part) => part.name).join("|");
  const partTags = new Map(spec.parts.map((part) => [part.name, part.tagName]));
  let result = nativeSourceText(text, spec.slug);

  if (partNames) {
    const componentName = pascalCase(spec.slug);
    result = result.replace(new RegExp(`<(/?)${componentName}\\.(${partNames})(?=[\\s>/]|$)`, "g"), (_, slash, partName) => {
      return `<${slash}${partTags.get(partName) ?? kebabCase(partName)}`;
    });
    result = result.replace(new RegExp(`\\b${pascalCase(spec.slug)}\\.(${partNames})\\b`, "g"), "$1");
  }

  return result;
}

function cleanSourceHeading(title, spec) {
  return nativeRequirementText(title, spec)
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTableLine(line, spec) {
  if (!line.startsWith("|")) {
    return null;
  }

  if (/^\|?[\s:-]+\|[\s|:-]*$/.test(line)) {
    return "";
  }

  const cells = line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => nativeRequirementText(cell.trim(), spec))
    .filter(Boolean);

  if (cells.length === 0) {
    return "";
  }

  return `Table row: ${cells.join(" | ")}`;
}

function normalizeSourceCodeLine(line, spec) {
  const trimmed = line.trim();
  if (!trimmed || /^[{}[\]();,]+$/.test(trimmed)) {
    return "";
  }

  const importMatch = trimmed.match(/^import\s+\*\s+as\s+\w+\s+from\s+['"]@ariaui(?:-web)?\/([^'"]+)['"];?$/);
  if (importMatch?.[1] === spec.slug) {
    return `Code line: import { define${pascalCase(spec.slug)}Elements } from "${spec.packageName}";`;
  }

  const normalized = nativeRequirementText(trimmed, spec).replace(/`/g, "'");
  return normalized ? `Code line: ${normalized}` : "";
}

function collectRequirementLines(section, spec) {
  const requirements = [];
  let inFence = false;

  for (const rawLine of section.lines) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }

    if (!trimmed || trimmed === "---" || trimmed.includes("{%") || trimmed.startsWith("![")) {
      continue;
    }

    const tableLine = normalizeTableLine(trimmed, spec);
    let line = tableLine;

    if (line == null) {
      line = inFence
        ? normalizeSourceCodeLine(rawLine, spec)
        : nativeRequirementText(trimmed.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").trim(), spec);
    }

    if (!line || line.length < 2) {
      continue;
    }

    if (!requirements.includes(line)) {
      requirements.push(line);
    }
  }

  return requirements;
}

function replaceRequirement(requirements, from, to) {
  const index = requirements.indexOf(from);
  if (index !== -1) {
    requirements[index] = to;
  }
}

function addRequirement(requirements, requirement) {
  if (!requirements.includes(requirement)) {
    requirements.push(requirement);
  }
}

function augmentLearnedRequirements(packageName, learnedSections) {
  if (packageName === "alert") {
    const stateSection = learnedSections.find((section) => section.title === "State Contract");
    if (stateSection) {
      addRequirement(stateSection.requirements, "Native custom elements use `default-open` for the uncontrolled initial open state.");
    }

    const behaviorSection = learnedSections.find((section) => section.title === "Behavior Contract");
    if (behaviorSection) {
      addRequirement(behaviorSection.requirements, "`native-composition` slots alert metadata onto a single child host for Root, Title, Description, Action, Close, and Cancel.");
    }

    const dataSection = learnedSections.find((section) => section.title === "Data and ARIA Reflection");
    if (dataSection) {
      addRequirement(dataSection.requirements, "Table row: Root | `aria-hidden` | `\"false\"` when open and `\"true\"` when closed");
      addRequirement(dataSection.requirements, "Table row: Root | `data-state` | `\"open\"` or `\"closed\"`");
      addRequirement(dataSection.requirements, "Table row: Root | `data-dismissible` | Present when `dismissible` is true");
      addRequirement(dataSection.requirements, "Table row: Title | `aria-level` | Defaults to `\"5\"` when the title keeps `role=\"heading\"`");
      addRequirement(dataSection.requirements, "Table row: Action | `data-alert-action` | `\"\"`");
      addRequirement(dataSection.requirements, "Table row: Close and Cancel | `tabindex` | `\"0\"` when enabled and `\"-1\"` when disabled");
    }

    return learnedSections;
  }

  if (packageName === "dialog") {
    const rolesSection = learnedSections.find((section) => section.title === "ARIA Roles and Attributes");
    if (rolesSection) {
      addRequirement(rolesSection.requirements, "`Title` native custom element defaults to `aria-level=\"2\"` while preserving `role=\"heading\"`.");
      addRequirement(rolesSection.requirements, "`Content` native custom element exposes `data-dialog-content`.");
      addRequirement(rolesSection.requirements, "`Action` native custom element exposes `data-dialog-action`.");
      addRequirement(rolesSection.requirements, "`Cancel` native custom element exposes `data-dialog-cancel`.");
    }

    return learnedSections;
  }

  if (packageName !== "alert-dialog") {
    return learnedSections;
  }

  const rolesSection = learnedSections.find((section) => section.title === "Roles, Labels, and ARIA");
  if (rolesSection) {
    addRequirement(rolesSection.requirements, "`Title` native custom element defaults to `aria-level=\"2\"` while preserving `role=\"heading\"`.");
    addRequirement(rolesSection.requirements, "`Icon` native custom element exposes `aria-hidden=\"true\"`.");
    addRequirement(rolesSection.requirements, "`Content` native custom element exposes `data-alert-dialog-content`.");
    addRequirement(rolesSection.requirements, "`Cancel` native custom element exposes `data-alert-dialog-cancel`.");
  }

  const portalSection = learnedSections.find((section) => section.title === "Portal and Layering");
  if (portalSection) {
    replaceRequirement(
      portalSection.requirements,
      "`Portal` renders overlay/content outside the current DOM subtree:",
      "`Portal` groups overlay/content under a native custom element host rather than relocating DOM nodes.",
    );
    replaceRequirement(
      portalSection.requirements,
      "content and overlay render in a portal when composed inside `Portal`",
      "content and overlay stay inside the `Portal` host when composed inside `Portal`",
    );
    replaceRequirement(
      portalSection.requirements,
      "`Portal` accepts `container?: HTMLElement | null` to choose the portal target",
      "`Portal` does not expose a `container` attribute in the native custom element contract; consumers choose DOM placement by placing the `aria-alert-dialog-portal` host.",
    );
    replaceRequirement(
      portalSection.requirements,
      "`Portal` accepts `forceMount?: boolean` to keep children mounted while the dialog is closed",
      "`Portal` accepts `force-mount` to keep children mounted while the dialog is closed",
    );
    replaceRequirement(
      portalSection.requirements,
      "during SSR, `Portal` renders children inline so open dialog content exists in server HTML",
      "during server-rendered HTML, `Portal` children remain inline so open dialog content exists in authored DOM order",
    );
    replaceRequirement(
      portalSection.requirements,
      "in the browser, `Portal` portals into `container ?? document.body`",
      "in the browser, the `Portal` host stays where authored and coordinates state for its child custom elements",
    );
  }

  return learnedSections;
}

function hasDocumentedSourceContent(section) {
  return section.lines.some((line) => {
    const trimmed = line.trim();
    return trimmed && trimmed !== "---" && !trimmed.startsWith("```");
  });
}

function buildLearnedRequirements(packageName, sourceSpec, partialSpec) {
  const sourceSections = markdownSections(sourceSpec).filter((section, index) => {
    if (/^table of contents$/i.test(section.title)) {
      return false;
    }

    if (index === 0 && section.level === 1 && !hasDocumentedSourceContent(section)) {
      return false;
    }

    return true;
  });
  const learnedSections = sourceSections.map((section) => {
    const title = cleanSourceHeading(section.title, partialSpec) || "Overview";
    const requirements = collectRequirementLines(section, partialSpec);

    if (requirements.length === 0) {
      requirements.push(`The local Aria UI package docs include this h${section.level} section; the native custom element contract must preserve its coverage when implementation details are adapted.`);
    }

    return {
      title,
      sourceHeadingLevel: section.level,
      requirements,
      };
    });

  augmentLearnedRequirements(packageName, learnedSections);

  if (learnedSections.length === 0) {
    learnedSections.push({
      title: "Native Package Contract",
      sourceHeadingLevel: 2,
      requirements: [
        `${partialSpec.packageName} must expose a native package contract for its public exports.`,
        "Public exports must remain stable and documented in this native Web Component spec.",
        "Package tests must keep the generated spec, runtime exports, and documentation aligned.",
      ],
    });
  }

  return {
    learningSource: sourceLearningPath(packageName),
    coverage: {
      sourceSections: sourceSections.length,
      coveredSections: learnedSections.length,
      requirements: learnedSections.reduce((count, section) => count + section.requirements.length, 0),
    },
    sections: learnedSections,
  };
}

const requirementAttributePattern =
  /\b(?:aria|data)-[a-z0-9-]+\b|\bnative-composition\b|\bdefault-open\b|\bdismissible\b|\btabIndex\b|\btabindex\b|\brole\b|\bid\b|\bdir\b|\borientation\b|\bdisabled\b|\brequired\b|\bvalue\b|\bopen\b|\bchecked\b|\bselected\b|\bpressed\b/g;

function buildRequirementAttributes(learnedRequirements, parts) {
  const attributes = new Set();
  const tagNames = new Set(parts.map((part) => part.tagName));

  for (const section of learnedRequirements.sections) {
    for (const requirement of section.requirements) {
      for (const match of requirement.matchAll(requirementAttributePattern)) {
        const attribute = match[0] === "tabIndex" ? "tabindex" : match[0];
        if (!tagNames.has(attribute)) {
          attributes.add(attribute);
        }
      }
    }
  }

  return Array.from(attributes).sort();
}

function sourceTestParitySpec(packageName) {
  if (packageName === "badge") {
    return {
      learningSources: [
        "../ariaui/packages/badge/__test__/badge.test.tsx",
      ],
      sourceTestCases: 10,
      nativeRequirements: [
        "Root renders a browser-native custom element host with no default role, aria-label, focusability, or badge state attributes",
        "Root forwards id, title, data attributes, classes, inline styles, children, and consumer DOM events",
        "consumer-supplied ARIA roles and labels are preserved",
        "`as=\"a\"` and `href` provide native link-equivalent role, focus, and keyboard activation on the custom element host",
        "`as=\"button\"` provides native button-equivalent role, focus, click, Enter, and Space activation on the custom element host",
        "docs examples include default, secondary, outline, destructive, with-icon, count, link, and verified badges with Heroicons-style SVGs",
      ],
    };
  }

  if (packageName === "avatar") {
    return {
      learningSources: [
        "../ariaui/packages/avatar/__test__/avatar.test.tsx",
        "../ariaui/packages/avatar/__test__/avatar-examples.test.tsx",
      ],
      sourceTestCases: 36,
      nativeRequirements: [
        "Root defaults to `role=\"img\"` and `aria-label=\"avatar\"` while fallback content is visible",
        "Image owns a real rendered `<img>`, forwards image attributes, and hides it with `aria-hidden` plus `visibility: hidden` while loading or errored",
        "Fallback renders while image status is not loaded and supports delayed rendering",
        "load and error events update Root semantics, Fallback visibility, Image visibility, and loading status notifications",
        "changing `src` resets image status to loading and shows fallback again",
        "Root convenience `src`, `alt`, `fallback`, and `fallback-delay-ms` attributes render native Image and Fallback parts",
        "Group defaults to `role=\"group\"` while allowing consumer role override",
        "docs examples include with-image, initials-only, and overlapping group rows with `/avatar.png` media",
      ],
    };
  }

  if (packageName === "aspect-ratio") {
    return {
      learningSources: [
        "../ariaui/packages/aspect-ratio/__test__/aspect-ratio.test.tsx",
      ],
      sourceTestCases: 27,
      nativeRequirements: [
        "`resolveAspectRatio` normalizes undefined, numeric, slash, colon, decimal, and invalid ratios",
        "Root constrains children with a private ratio shell and absolutely positioned fill layer",
        "consumer styles cannot override structural ratio shell or fill positioning",
        "native composition uses the first child element as the fill host while preserving the ratio shell",
        "Root has no default ARIA role, keyboard behavior, focus management, `data-state`, `data-ratio`, or `data-slot`",
        "media examples keep descriptive image alt text",
      ],
    };
  }

  if (packageName !== "alert") {
    return null;
  }

  return {
    learningSources: [
      "../ariaui/packages/alert/__test__/alert.test.tsx",
      "../ariaui/packages/alert/__test__/accessibility.test.tsx",
    ],
    sourceTestCases: 19,
    nativeRequirements: [
      "root alert semantics and custom `status` live-region role override",
      "title and description ARIA linkage with generated unique ids",
      "action content metadata and non-interactive action host behavior",
      "`defaultOpen` native equivalent through `default-open`",
      "dismissible close and cancel behavior",
      "prevented close and cancel click guards",
      "controlled-style `open` and `openchange` behavior",
      "native composition equivalents for root, title, description, action, close, and cancel hosts",
    ],
  };
}

function defaultPopupKind(packageName, partName, role) {
  if (/dialog/.test(packageName)) return "dialog";
  if (/menu/.test(packageName) || role === "menuitem") return "menu";
  if (/combobox|listbox|select/.test(packageName) || /Content|Option|Trigger/.test(partName)) return "listbox";
  return "true";
}

function defaultAttributesForPart(packageName, part, requirementAttributes) {
  const attributes = {};
  const requirements = new Set(requirementAttributes);
  const role = part.defaultRole;

  if (packageName === "accordion" && part.name === "Root") {
    if (requirements.has("orientation")) attributes.orientation = "vertical";
    if (requirements.has("dir")) attributes.dir = "ltr";
  }

  if (packageName === "alert-dialog") {
    if (part.name === "Content" && requirements.has("data-alert-dialog-content")) {
      attributes["data-alert-dialog-content"] = "";
    }

    if (part.name === "Cancel" && requirements.has("data-alert-dialog-cancel")) {
      attributes["data-alert-dialog-cancel"] = "";
    }

    if (part.name === "Icon" && requirements.has("aria-hidden")) {
      attributes["aria-hidden"] = "true";
    }

    if (part.name === "Title" && requirements.has("aria-level")) {
      attributes["aria-level"] = "2";
    }
  }

  if (packageName === "dialog") {
    if (part.name === "Content" && requirements.has("data-dialog-content")) {
      attributes["data-dialog-content"] = "";
    }

    if (part.name === "Action" && requirements.has("data-dialog-action")) {
      attributes["data-dialog-action"] = "";
    }

    if (part.name === "Cancel" && requirements.has("data-dialog-cancel")) {
      attributes["data-dialog-cancel"] = "";
    }

    if (part.name === "Title" && requirements.has("aria-level")) {
      attributes["aria-level"] = "2";
    }
  }

  if (role === "heading" && requirements.has("aria-level") && !(packageName === "alert" && part.name === "Title")) {
    attributes["aria-level"] ??= "3";
  }

  if (role && requirements.has("aria-expanded") && roleByPartCanExpand(role)) {
    attributes["aria-expanded"] = "false";
  }

  if (role && requirements.has("aria-selected") && roleByPartCanSelect(role)) {
    attributes["aria-selected"] = "false";
  }

  if (role && requirements.has("aria-haspopup") && (roleByPartCanExpand(role) || /Trigger|Button/.test(part.name))) {
    attributes["aria-haspopup"] = defaultPopupKind(packageName, part.name, role);
  }

  if (role === "listbox" && requirements.has("aria-multiselectable")) {
    attributes["aria-multiselectable"] = "false";
  }

  if ((role === "listbox" || /Content|Viewport/.test(part.name)) && requirements.has("tabindex")) {
    attributes.tabindex = "0";
  }

  if (role === "progressbar") {
    if (requirements.has("aria-valuemin")) attributes["aria-valuemin"] = "0";
    if (requirements.has("aria-valuemax")) attributes["aria-valuemax"] = "100";
    if (requirements.has("aria-valuenow")) attributes["aria-valuenow"] = "0";
  }

  return Object.fromEntries(Object.entries(attributes).sort(([left], [right]) => left.localeCompare(right)));
}

function roleByPartCanExpand(role) {
  return role === "button" || role === "combobox" || role === "menuitem";
}

function roleByPartCanSelect(role) {
  return role === "option" || role === "row" || role === "tab" || role === "treeitem";
}

function buildComponentSpec(packageName) {
  const parts = collectParts(packageName);
  const sourceSpec = readSourceSpec(packageName);
  const partialSpec = {
    kind: parts.length === 0 ? "utility" : "component",
    name: pascalCase(packageName),
    slug: packageName,
    packageName: `${packageScope}/${packageName}`,
    description: nativePackageDescription(packageName, sourceSpec),
    parts: parts.map((partName) => ({
      name: partName,
      tagName: customElementTag(packageName, partName),
      defaultRole: defaultRoleForPart(packageName, partName),
    })),
  };
  const learnedRequirements = buildLearnedRequirements(packageName, sourceSpec, partialSpec);
  const requirementAttributes = buildRequirementAttributes(learnedRequirements, partialSpec.parts);
  const sourceTestParity = sourceTestParitySpec(packageName);

  const spec = {
    ...partialSpec,
    requirementAttributes,
    parts: partialSpec.parts.map((part) => ({
      ...part,
      defaultAttributes: defaultAttributesForPart(packageName, part, requirementAttributes),
    })),
    learnedRequirements,
  };

  if (sourceTestParity) {
    spec.sourceTestParity = sourceTestParity;
  }

  return spec;
}

function defaultRoleForPart(packageName, partName) {
  const packagePart = `${packageName}:${partName}`;
  if (roleByPackagePart.has(packagePart)) {
    return roleByPackagePart.get(packagePart);
  }

  return partName === "Root" ? rootRoleByPackage.get(packageName) || null : roleByPart.get(partName) || null;
}

function rootPackageJson(packageNames) {
  return {
    name: "ariaui-web",
    private: true,
    packageManager: "pnpm@11.1.1",
    type: "module",
    workspaces: ["packages/*", "web/doc"],
    scripts: {
      generate: "node scripts/generate-from-ariaui.mjs",
      dev: "turbo run dev",
      build: "turbo run build",
      test: "vitest run --passWithNoTests",
      "test:watch": "vitest watch",
      lint: "tsc --noEmit -p tsconfig.json",
      clean: "turbo run clean && rimraf node_modules packages/*/node_modules web/doc/node_modules",
    },
    devDependencies: {
      "@types/node": "^24.1.0",
      "@vitest/coverage-v8": "^2.1.9",
      esbuild: "^0.28.1",
      jsdom: "^24.1.0",
      prettier: "^3.3.2",
      rimraf: "^6.0.1",
      turbo: "^2.4.2",
      typescript: typescriptVersion,
      vite: "^6.0.7",
      vitepress: "^1.6.3",
      vitest: "^2.1.9",
    },
    engines: {
      node: ">=20.0.0",
    },
    ariauiWeb: {
      source: "../ariaui",
      packageCount: packageNames.length,
    },
  };
}

function rootTsConfig(packageNames) {
  const paths = Object.fromEntries(
    packageNames.map((name) => [`${packageScope}/${name}`, [`./packages/${name}/src/index.ts`]]),
  );

  return {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "Bundler",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      strict: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
      useDefineForClassFields: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      skipLibCheck: true,
      isolatedModules: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      types: ["node", "vitest/globals"],
      paths,
    },
    include: ["packages/**/*.ts", "web/doc/**/*.ts"],
    exclude: ["node_modules", "**/dist", "web/doc/docs/.vitepress/cache", "web/doc/docs/.vitepress/dist"],
  };
}

function packageTsConfig() {
  return {
    extends: "../../tsconfig.json",
    compilerOptions: {
      rootDir: ".",
      outDir: "dist",
      tsBuildInfoFile: "dist/.tsbuildinfo",
    },
    include: ["index.ts", "src/**/*.ts", "__test__/**/*.ts"],
    exclude: ["dist", "node_modules"],
  };
}

function packageBuildTsConfig() {
  return {
    extends: "./tsconfig.json",
    compilerOptions: {
      paths: {
        "@ariaui-web/*": ["../*/dist/index.d.ts"],
      },
    },
    include: ["index.ts", "src/**/*.ts"],
    exclude: ["__test__", "dist", "node_modules"],
  };
}

function packageJson(name, spec) {
  const sourcePackageJson = readJson(join(sourcePackages, name, "package.json"));
  const dependencies = spec.kind === "component" ? { [`${packageScope}/utils`]: "workspace:*" } : {};

  return {
    name: `${packageScope}/${name}`,
    version: sourcePackageJson.version || "0.1.0",
    type: "module",
    main: "./dist/index.js",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        default: "./dist/index.js",
      },
      "./readme.md": "./readme.md",
    },
    files: ["dist", "readme.md"],
    scripts: {
      build:
        "rimraf dist && esbuild index.ts src/index.ts --format=esm --platform=browser --target=es2022 --sourcemap --outdir=dist --outbase=. && tsc -p tsconfig.build.json --emitDeclarationOnly --outDir dist --noEmit false",
      dev: "pnpm build -- --watch",
      lint: "tsc --noEmit -p tsconfig.json",
      test: `pnpm --dir ../.. exec vitest run packages/${name}/__test__`,
      "test:watch": `pnpm --dir ../.. exec vitest watch packages/${name}/__test__`,
      clean: "rimraf dist",
    },
    dependencies,
    publishConfig: {
      access: "public",
    },
  };
}

function componentSpecSource(spec) {
  return `export const componentSpec = ${JSON.stringify(spec, null, 2)} as const;

export type ComponentSpec = typeof componentSpec;
export type ComponentPartSpec = ComponentSpec["parts"][number];
export type ComponentPartName = ComponentPartSpec["name"];
`;
}

function utilsSource() {
  return `export type { ClassNameParts } from "./class-names";
export { joinClassNames, mergeClassNames } from "./class-names";
export { AriaWebElement } from "./aria-web-element";
export type { AriaWebElementConstructor } from "./aria-web-element";
export { createAriaWebComponent } from "./component-factory";
export { createComponentPartHelpers } from "./component-helpers";
export { defineCustomElement } from "./custom-elements";
export { createElementTagName, kebabCase } from "./tag-name";
export type { WebComponentHelperSpec, WebComponentPartSpec, WebComponentSpec } from "./types";
`;
}

function utilsClassNamesSource() {
  return `export type ClassNameParts<TParts extends string> = Partial<Record<TParts, string>>;

export function joinClassNames(...classNames: Array<string | null | undefined | false>): string {
  return classNames.filter(Boolean).join(" ");
}

export function mergeClassNames<TParts extends string>(
  defaults: ClassNameParts<TParts>,
  overrides?: ClassNameParts<TParts>,
): ClassNameParts<TParts> {
  return { ...defaults, ...(overrides ?? {}) };
}
`;
}

function utilsTypesSource() {
  return `export interface WebComponentPartSpec {
  readonly name: string;
  readonly tagName: string;
  readonly defaultRole: string | null;
  readonly defaultAttributes: Readonly<Record<string, string>>;
}

export interface WebComponentSpec {
  readonly slug: string;
  readonly packageName: string;
  readonly requirementAttributes: readonly string[];
  readonly parts: readonly WebComponentPartSpec[];
}

export interface WebComponentHelperSpec<TPartSpec extends WebComponentPartSpec = WebComponentPartSpec> {
  readonly packageName: string;
  readonly parts: readonly TPartSpec[];
}
`;
}

function utilsBooleanAttributesSource() {
  return `export function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}
`;
}

function utilsRolesSource() {
  return `export function isFocusableRole(role: string | null) {
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
`;
}

function utilsAriaWebElementSource() {
  return `import { setBooleanAttribute } from "./boolean-attributes";
import { isButtonLikeRole, isCheckableRole, isExpandableRole, isFocusableRole, isSelectableRole, isSpaceKey } from "./roles";
import { kebabCase } from "./tag-name";

const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement === "undefined"
    ? (class {} as unknown as typeof HTMLElement)
    : HTMLElement;

export class AriaWebElement extends HTMLElementBase {
  static packageSlug = "primitive";
  static partName = "Root";
  static defaultRole: string | null = null;
  static defaultAttributes: Readonly<Record<string, string>> = {};
  #eventsBound = false;
  #defaultApplied = false;

  static get observedAttributes() {
    return [
      "aria-controls",
      "aria-labelledby",
      "checked",
      "collapsible",
      "default-value",
      "defaultvalue",
      "default-checked",
      "dir",
      "disabled",
      "force-mount",
      "indeterminate",
      "name",
      "open",
      "orientation",
      "pressed",
      "required",
      "selected",
      "type",
      "value",
    ];
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value: boolean) {
    setBooleanAttribute(this, "checked", value);
  }

  get defaultChecked() {
    return this.hasAttribute("default-checked");
  }

  set defaultChecked(value: boolean) {
    setBooleanAttribute(this, "default-checked", value);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, "disabled", value);
  }

  get indeterminate() {
    return this.hasAttribute("indeterminate");
  }

  set indeterminate(value: boolean) {
    setBooleanAttribute(this, "indeterminate", value);
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(value: boolean) {
    setBooleanAttribute(this, "open", value);
  }

  get pressed() {
    return this.hasAttribute("pressed");
  }

  set pressed(value: boolean) {
    setBooleanAttribute(this, "pressed", value);
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  set selected(value: boolean) {
    setBooleanAttribute(this, "selected", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    if (value == null) {
      this.removeAttribute("value");
    } else {
      this.setAttribute("value", String(value));
    }
  }

  connectedCallback() {
    this.bindAriaWebEvents();
    this.applyDefaultChecked();
    this.applyAriaWebContract();
    this.afterAriaWebContractApplied();
  }

  attributeChangedCallback(_name?: string, _oldValue?: string | null, _newValue?: string | null) {
    this.applyDefaultChecked();
    this.applyAriaWebContract();
    this.afterAriaWebContractApplied();
  }

  bindAriaWebEvents() {
    if (this.#eventsBound) {
      return;
    }

    this.addEventListener("click", this.handleAriaWebClick);
    this.addEventListener("keydown", this.handleAriaWebKeyDown);
    this.addEventListener("keyup", this.handleAriaWebKeyUp);
    this.#eventsBound = true;
  }

  applyDefaultChecked() {
    if (this.#defaultApplied) {
      return;
    }

    if (this.hasAttribute("default-checked") && !this.hasAttribute("checked")) {
      this.setAttribute("checked", "");
    }

    this.#defaultApplied = true;
  }

  applyAriaWebContract() {
    const constructor = this.constructor as typeof AriaWebElement;
    this.setAttribute("data-ariaui-web", constructor.packageSlug);
    this.setAttribute("data-package", constructor.packageSlug);
    this.setAttribute("data-part", constructor.partName);

    if (!this.hasAttribute("part")) {
      this.setAttribute("part", kebabCase(constructor.partName));
    }

    for (const [attribute, value] of Object.entries(constructor.defaultAttributes)) {
      if (!this.hasAttribute(attribute)) {
        this.setAttribute(attribute, value);
      }
    }

    if (constructor.defaultRole && !this.hasAttribute("role")) {
      this.setAttribute("role", constructor.defaultRole);
    }

    const role = this.getAttribute("role");

    if (this.hasAttribute("disabled")) {
      this.setAttribute("aria-disabled", "true");
      this.setAttribute("data-disabled", "");
    } else {
      this.removeAttribute("aria-disabled");
      this.removeAttribute("data-disabled");
    }

    const state = this.resolveState(role);
    if (state) {
      this.setAttribute("data-state", state);
    } else {
      this.removeAttribute("data-state");
    }

    if (isCheckableRole(role)) {
      this.setAttribute("aria-checked", this.hasAttribute("indeterminate") ? "mixed" : String(this.hasAttribute("checked")));
    } else {
      this.removeAttribute("aria-checked");
    }

    if (this.hasAttribute("open")) {
      this.setAttribute("aria-expanded", "true");
    } else if (isExpandableRole(role)) {
      this.setAttribute("aria-expanded", "false");
    } else {
      this.removeAttribute("aria-expanded");
    }

    if (this.hasAttribute("pressed")) {
      this.setAttribute("aria-pressed", "true");
    } else {
      this.removeAttribute("aria-pressed");
    }

    if (this.hasAttribute("selected") || isSelectableRole(role)) {
      this.setAttribute("aria-selected", String(this.hasAttribute("selected")));
    } else {
      this.removeAttribute("aria-selected");
    }

    if (this.hasAttribute("value")) {
      this.setAttribute("data-value", this.getAttribute("value") ?? "");
    } else {
      this.removeAttribute("data-value");
    }

    const orientation = this.getAttribute("orientation");
    if (orientation) {
      this.setAttribute("data-orientation", orientation);
    } else {
      this.removeAttribute("data-orientation");
    }

    if (isFocusableRole(role) && (!this.hasAttribute("tabindex") || this.getAttribute("tabindex") === "0" || this.getAttribute("tabindex") === "-1")) {
      this.setAttribute("tabindex", this.hasAttribute("disabled") ? "-1" : "0");
    }

    this.syncHiddenInput(role);
  }

  resolveState(role: string | null) {
    if (this.hasAttribute("open")) {
      return "open";
    }

    if (isCheckableRole(role)) {
      if (this.hasAttribute("indeterminate")) {
        return "indeterminate";
      }

      return this.hasAttribute("checked") ? "checked" : "unchecked";
    }

    if (this.hasAttribute("selected")) {
      return "checked";
    }

    if (this.hasAttribute("pressed")) {
      return "pressed";
    }

    return null;
  }

  syncHiddenInput(role: string | null) {
    const existing = this.querySelector("input[data-ariaui-web-hidden-input='true']");
    if (!isCheckableRole(role) || !this.hasAttribute("name")) {
      existing?.remove();
      return;
    }

    const input = existing instanceof HTMLInputElement ? existing : document.createElement("input");
    input.type = "hidden";
    input.name = this.getAttribute("name") ?? "";
    input.value = this.hasAttribute("value") ? this.getAttribute("value") ?? "" : String(this.hasAttribute("checked"));
    input.disabled = this.hasAttribute("disabled");
    input.required = this.hasAttribute("required");
    input.dataset.ariauiWebHiddenInput = "true";

    if (!existing) {
      this.append(input);
    }
  }

  controlledElement() {
    const controlledId = this.getAttribute("aria-controls");
    return controlledId ? this.ownerDocument.getElementById(controlledId) : null;
  }

  afterAriaWebContractApplied() {}

  handleCompositeRovingFocus(_event: KeyboardEvent, _role: string | null) {
    return false;
  }

  toggleControlledElement() {
    const controlledElement = this.controlledElement();
    if (!controlledElement) {
      return false;
    }

    const nextOpen = !this.hasAttribute("open");
    this.open = nextOpen;
    setBooleanAttribute(controlledElement, "open", nextOpen);
    controlledElement.hidden = !nextOpen;
    return true;
  }

  handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }

    const role = this.getAttribute("role");
    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (isCheckableRole(role)) {
      if (this.hasAttribute("indeterminate")) {
        this.removeAttribute("indeterminate");
        this.checked = true;
      } else {
        this.checked = !this.checked;
      }
      return;
    }

    if (isExpandableRole(role) && this.toggleControlledElement()) {
      return;
    }

    if (this.hasAttribute("pressed")) {
      this.pressed = !this.pressed;
    }
  };

  handleAriaWebKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const role = this.getAttribute("role");
    if (!isButtonLikeRole(role)) {
      return;
    }

    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      return;
    }

    if (this.handleCompositeRovingFocus(event, role)) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      this.click();
    }

    if (isSpaceKey(event)) {
      event.preventDefault();
    }
  };

  handleAriaWebKeyUp = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const role = this.getAttribute("role");
    if (!isButtonLikeRole(role) || this.hasAttribute("disabled")) {
      return;
    }

    if (isSpaceKey(event)) {
      event.preventDefault();
      this.click();
    }
  }
}
  
export type AriaWebElementConstructor = typeof AriaWebElement;
`;
}

function utilsComponentFactorySource() {
  return `import { AriaWebElement } from "./aria-web-element";
import type { WebComponentPartSpec } from "./types";

export function createAriaWebComponent(part: WebComponentPartSpec, packageSlug: string): typeof AriaWebElement {
  return class extends AriaWebElement {
    static override packageSlug = packageSlug;
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function utilsCustomElementsSource() {
  return `export function defineCustomElement(tagName: string, element: CustomElementConstructor) {
  if (typeof customElements === "undefined") {
    return;
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, element);
  }
}
`;
}

function utilsComponentHelpersSource() {
  return `import type { WebComponentHelperSpec, WebComponentPartSpec } from "./types";

export function createComponentPartHelpers<const TPartSpec extends WebComponentPartSpec>(
  spec: WebComponentHelperSpec<TPartSpec>,
  defaultPartName: TPartSpec["name"],
) {
  function getPartSpec(partName: TPartSpec["name"]) {
    const part = spec.parts.find((candidate) => candidate.name === partName);
    if (!part) {
      throw new Error(\`Unknown \${spec.packageName} part: \${partName}\`);
    }

    return part;
  }

  function createElement(partName: TPartSpec["name"] = defaultPartName) {
    const part = getPartSpec(partName);
    return document.createElement(part.tagName);
  }

  return { getPartSpec, createElement } as const;
}
`;
}

function utilsTagNameSource() {
  return `export function createElementTagName(packageSlug: string, partName = "Root") {
  return partName === "Root" ? \`aria-\${packageSlug}\` : \`aria-\${packageSlug}-\${kebabCase(partName)}\`;
}

export function kebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\\s]+/g, "-")
    .toLowerCase();
}
`;
}

function utilsModuleSources() {
  return {
    "aria-web-element.ts": utilsAriaWebElementSource(),
    "boolean-attributes.ts": utilsBooleanAttributesSource(),
    "class-names.ts": utilsClassNamesSource(),
    "component-factory.ts": utilsComponentFactorySource(),
    "component-helpers.ts": utilsComponentHelpersSource(),
    "custom-elements.ts": utilsCustomElementsSource(),
    "roles.ts": utilsRolesSource(),
    "tag-name.ts": utilsTagNameSource(),
    "types.ts": utilsTypesSource(),
  };
}

function tokensSource() {
  return `export const primitives = {
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
    .flatMap(([color, steps]) => Object.entries(steps).map(([step, value]) => \`  --color-\${color}-\${step}: \${value};\`))
    .join("\\n");
  const lightLines = Object.entries(light).map(([name, value]) => \`  --\${name}: \${value};\`).join("\\n");
  const darkLines = Object.entries(dark).map(([name, value]) => \`  --\${name}: \${value};\`).join("\\n");

  return \`:root {\\n\${primitiveLines}\\n\${lightLines}\\n}\\n\\n.dark {\\n\${darkLines}\\n}\\n\\n@theme {\\n  --color-background: var(--background);\\n  --color-foreground: var(--foreground);\\n  --color-border: var(--border);\\n  --color-primary: var(--primary);\\n  --color-primary-foreground: var(--primary-foreground);\\n}\`;
}
`;
}

function keyboardSource() {
  return `export type Direction = "horizontal" | "vertical";

export function getDirectionKeys(direction: Direction) {
  return direction === "horizontal"
    ? { next: "ArrowRight", previous: "ArrowLeft" }
    : { next: "ArrowDown", previous: "ArrowUp" };
}

export function getNextIndex(currentIndex: number, itemCount: number) {
  if (itemCount <= 0) return -1;
  return (currentIndex + 1 + itemCount) % itemCount;
}

export function getPrevIndex(currentIndex: number, itemCount: number) {
  if (itemCount <= 0) return -1;
  return (currentIndex - 1 + itemCount) % itemCount;
}

export function isPrintableTypeaheadKey(key: string) {
  return key.length === 1 && !/\\s/.test(key);
}

export function isAlphanumericTypeaheadKey(key: string) {
  return /^[a-z0-9]$/i.test(key);
}
`;
}

function hooksSource() {
  return `let idCounter = 0;

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function createId(prefix = "ariaui-web") {
  idCounter += 1;
  return \`\${prefix}-\${idCounter}\`;
}

export function useId(prefix?: string) {
  return createId(prefix);
}

export function createControllableState<T>(options: ControllableStateOptions<T>) {
  let internalValue = options.defaultValue;
  return {
    get value() {
      return options.value ?? internalValue;
    },
    setValue(nextValue: T) {
      internalValue = nextValue;
      options.onChange?.(nextValue);
    },
  };
}

export const useControllableState = createControllableState;

export function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T | undefined) {
  return (...args: Parameters<T>) => callback?.(...args);
}

export function useMergeRefs<T>(...refs: Array<((value: T) => void) | { current: T | null } | null | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) ref.current = value;
    }
  };
}
`;
}

function positionSource() {
  return `export type Placement = "top" | "right" | "bottom" | "left";

export interface Options {
  placement?: Placement;
  offset?: number;
}

export interface Return {
  x: number;
  y: number;
  placement: Placement;
}

export function computePosition(reference: Element, floating: HTMLElement, options: Options = {}): Return {
  const placement = options.placement ?? "bottom";
  const offset = options.offset ?? 0;
  const referenceRect = reference.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();

  if (placement === "top") {
    return { x: referenceRect.left, y: referenceRect.top - floatingRect.height - offset, placement };
  }

  if (placement === "right") {
    return { x: referenceRect.right + offset, y: referenceRect.top, placement };
  }

  if (placement === "left") {
    return { x: referenceRect.left - floatingRect.width - offset, y: referenceRect.top, placement };
  }

  return { x: referenceRect.left, y: referenceRect.bottom + offset, placement };
}

export function detectOverflow(element: Element) {
  const rect = element.getBoundingClientRect();
  return {
    top: Math.max(0, -rect.top),
    right: Math.max(0, rect.right - window.innerWidth),
    bottom: Math.max(0, rect.bottom - window.innerHeight),
    left: Math.max(0, -rect.left),
  };
}

export function autoUpdate(_reference: Element, _floating: HTMLElement, update: () => void) {
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}
`;
}

function tsconfigSource() {
  return `export const webComponentTsConfig = {
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "Bundler",
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    strict: true,
  },
} as const;

export default webComponentTsConfig;
`;
}

function utilitySource(name) {
  if (name === "utils") return utilsSource();
  if (name === "tokens") return tokensSource();
  if (name === "keyboard") return keyboardSource();
  if (name === "hooks") return hooksSource();
  if (name === "position") return positionSource();
  if (name === "tsconfig") return tsconfigSource();
  throw new Error(`No utility source generator for ${name}`);
}

function utilityUnitTest(name) {
  if (name === "utils") {
    return `import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createAriaWebComponent,
  createComponentPartHelpers,
  createElementTagName,
  defineCustomElement,
  joinClassNames,
  mergeClassNames,
} from "../src";

let testElementId = 0;

function defineTestElement(part: { name: string; defaultRole: string | null }) {
  const tagName = \`aria-utils-test-\${++testElementId}\`;
  const Element = createAriaWebComponent({ ...part, tagName, defaultAttributes: {} }, "utils-test");
  defineCustomElement(tagName, Element);
  const element = document.createElement(tagName) as HTMLElement & {
    checked: boolean;
    disabled: boolean;
    indeterminate: boolean;
    open: boolean;
    pressed: boolean;
    selected: boolean;
    value: string;
  };
  document.body.append(element);
  return element;
}

describe("${packageScope}/utils", () => {
  it("joins and merges class names", () => {
    expect(joinClassNames("root", false, undefined, "active")).toBe("root active");
    expect(mergeClassNames({ root: "base" }, { root: "override" })).toEqual({ root: "override" });
  });

  it("creates stable custom element tag names", () => {
    expect(createElementTagName("accordion")).toBe("aria-accordion");
    expect(createElementTagName("accordion", "Trigger")).toBe("aria-accordion-trigger");
  });

  it("keeps shared utilities split into focused modules", () => {
    const srcRoot = join(process.cwd(), "packages", "utils", "src");
    const indexSource = readFileSync(join(srcRoot, "index.ts"), "utf8");
    const moduleFiles = [
      "aria-web-element.ts",
      "class-names.ts",
      "component-factory.ts",
      "component-helpers.ts",
      "custom-elements.ts",
      "roles.ts",
      "tag-name.ts",
      "types.ts",
    ];

    expect(indexSource).not.toContain("class AriaWebElement");
    expect(indexSource).not.toContain("function isCheckableRole");
    expect(indexSource.split("\\n").filter((line) => line.trim()).length).toBeLessThanOrEqual(16);
    for (const file of moduleFiles) {
      expect(existsSync(join(srcRoot, file))).toBe(true);
    }
  });

  it("creates reusable component part helpers", () => {
    const componentSpec = {
      packageName: "${packageScope}/utils-test",
      parts: [
        { name: "Root", tagName: "aria-utils-helper", defaultRole: "button", defaultAttributes: {} },
        { name: "Trigger", tagName: "aria-utils-helper-trigger", defaultRole: "button", defaultAttributes: {} },
      ],
    } as const;
    const helpers = createComponentPartHelpers(componentSpec, "Root");

    expect(helpers.getPartSpec("Trigger")).toBe(componentSpec.parts[1]);
    expect(helpers.createElement().tagName.toLowerCase()).toBe("aria-utils-helper");
    expect(helpers.createElement("Trigger").tagName.toLowerCase()).toBe("aria-utils-helper-trigger");
    expect(() => helpers.getPartSpec("__missing__" as "Root")).toThrow("Unknown ${packageScope}/utils-test part");
  });

  it("reflects checkable state to ARIA, data attributes, and named hidden input", () => {
    const element = defineTestElement({ name: "Root", defaultRole: "checkbox" });
    element.setAttribute("name", "accepted");
    element.value = "yes";

    expect(element.getAttribute("role")).toBe("checkbox");
    expect(element.getAttribute("aria-checked")).toBe("false");
    expect(element.getAttribute("data-state")).toBe("unchecked");
    expect(element.getAttribute("tabindex")).toBe("0");

    element.click();

    expect(element.checked).toBe(true);
    expect(element.getAttribute("checked")).toBe("");
    expect(element.getAttribute("aria-checked")).toBe("true");
    expect(element.getAttribute("data-state")).toBe("checked");
    expect(element.querySelector("input[type='hidden']")).toMatchObject({
      name: "accepted",
      value: "yes",
    });

    element.indeterminate = true;

    expect(element.getAttribute("aria-checked")).toBe("mixed");
    expect(element.getAttribute("data-state")).toBe("indeterminate");
  });

  it("reflects open, pressed, selected, disabled, and value properties", () => {
    const element = defineTestElement({ name: "Trigger", defaultRole: "button" });

    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.value = "alpha";
    element.disabled = true;

    expect(element.getAttribute("data-state")).toBe("open");
    expect(element.getAttribute("aria-expanded")).toBe("true");
    expect(element.getAttribute("aria-pressed")).toBe("true");
    expect(element.getAttribute("aria-selected")).toBe("true");
    expect(element.getAttribute("data-value")).toBe("alpha");
    expect(element.getAttribute("aria-disabled")).toBe("true");
    expect(element.getAttribute("data-disabled")).toBe("");
    expect(element.getAttribute("tabindex")).toBe("-1");
  });

  it("adds keyboard activation for non-native button-like custom elements", () => {
    const element = defineTestElement({ name: "Trigger", defaultRole: "button" });
    let clickCount = 0;
    element.addEventListener("click", () => {
      clickCount += 1;
    });

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    const spaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    element.dispatchEvent(spaceKeyDown);
    element.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }));

    expect(spaceKeyDown.defaultPrevented).toBe(true);
    expect(clickCount).toBe(2);
  });
});
`;
  }

  if (name === "tokens") {
    return `import { describe, expect, it } from "vitest";
import { dark, generateCSS, light, primitives } from "../src";

describe("${packageScope}/tokens", () => {
  it("generates CSS variables for light and dark token modes", () => {
    expect(primitives.blue[600]).toContain("%");
    expect(light.background).toContain("oklch");
    expect(dark.foreground).toContain("oklch");
    expect(generateCSS()).toContain("--color-background");
  });
});
`;
  }

  if (name === "keyboard") {
    return `import { describe, expect, it } from "vitest";
import { getDirectionKeys, getNextIndex, getPrevIndex, isAlphanumericTypeaheadKey } from "../src";

describe("${packageScope}/keyboard", () => {
  it("supports wrapped keyboard navigation helpers", () => {
    expect(getDirectionKeys("horizontal")).toEqual({ next: "ArrowRight", previous: "ArrowLeft" });
    expect(getNextIndex(2, 3)).toBe(0);
    expect(getPrevIndex(0, 3)).toBe(2);
    expect(isAlphanumericTypeaheadKey("a")).toBe(true);
  });
});
`;
  }

  if (name === "hooks") {
    return `import { describe, expect, it } from "vitest";
import { createControllableState, createId } from "../src";

describe("${packageScope}/hooks", () => {
  it("provides DOM-friendly state and id helpers", () => {
    const first = createId("case");
    const second = createId("case");
    expect(first).not.toBe(second);

    const state = createControllableState({ defaultValue: "closed" });
    state.setValue("open");
    expect(state.value).toBe("open");
  });
});
`;
  }

  if (name === "position") {
    return `import { describe, expect, it } from "vitest";
import { computePosition } from "../src";

describe("${packageScope}/position", () => {
  it("computes a basic bottom placement", () => {
    const reference = document.createElement("button");
    const floating = document.createElement("div");
    reference.getBoundingClientRect = () => ({ x: 0, y: 0, left: 10, top: 20, right: 50, bottom: 60, width: 40, height: 40, toJSON: () => null });
    floating.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 20, bottom: 20, width: 20, height: 20, toJSON: () => null });

    expect(computePosition(reference, floating, { offset: 4 })).toEqual({ x: 10, y: 64, placement: "bottom" });
  });
});
`;
  }

  return `import { describe, expect, it } from "vitest";
import config from "../src";

describe("${packageScope}/tsconfig", () => {
  it("exports a DOM-ready TypeScript config", () => {
    expect(config.compilerOptions.lib).toContain("DOM");
    expect(config.compilerOptions.strict).toBe(true);
  });
});
`;
}

function componentSharedSource(spec) {
  const defineFunctionName = `define${pascalCase(spec.slug)}Elements`;
  const createFunctionName = `create${pascalCase(spec.slug)}Element`;
  const defaultPartName = spec.parts[0]?.name || "Root";
  return `import { createComponentPartHelpers } from "${packageScope}/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "${defaultPartName}");

export const getPartSpec = helpers.getPartSpec;
export const ${createFunctionName} = helpers.createElement;

export type ${pascalCase(spec.slug)}HostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { ${defineFunctionName} } from "./define";
export { ${defineFunctionName} as defineElements } from "./define";
export { ${createFunctionName} as createElement };
`;
}

function partSource(spec, part) {
  if (spec.slug === "accordion") {
    return accordionPartSource(part.name);
  }

  if (spec.slug === "badge") {
    return badgePartSource(part.name);
  }

  if (spec.slug === "alert") {
    return alertPartSource(part.name);
  }

  if (spec.slug === "alert-dialog") {
    return alertDialogPartSource(part.name);
  }

  const factoryName = `create${pascalCase(spec.slug)}WebComponent`;

  return `import { ${factoryName} } from "../${spec.slug}-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "${part.name}");

if (!partSpec) {
  throw new Error("Missing ${part.name} part spec for ${spec.packageName}.");
}

export const ${part.name} = ${factoryName}(partSpec);
export type ${part.name}Element = InstanceType<typeof ${part.name}>;
`;
}

function defineSource(spec) {
  const imports = spec.parts.map((part) => `import { ${part.name} } from "./parts/${part.name}";`).join("\n");
  const entries = spec.parts.map((part) => `  ["${part.tagName}", ${part.name}],`).join("\n");
  return `import { defineCustomElement } from "${packageScope}/utils";
${imports}

const definitions = [
${entries}
] as const;

export function define${pascalCase(spec.slug)}Elements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
`;
}

function componentIndexSource(spec) {
  const partExports = spec.parts.map((part) => `export { ${part.name} } from "./parts/${part.name}";\nexport type { ${part.name}Element } from "./parts/${part.name}";`).join("\n");
  const elementClassName = componentElementClassName(spec);
  const factoryName = `create${pascalCase(spec.slug)}WebComponent`;
  const elementExports = spec.slug === "accordion"
    ? `export { ${elementClassName} } from "./${spec.slug}-element";
export { ${factoryName} } from "./${spec.slug}-web-component";`
    : spec.slug === "badge"
      ? `export { ${elementClassName}, ${elementClassName} as BadgeWebElement } from "./${spec.slug}-element";
export { ${factoryName} } from "./${spec.slug}-web-component";`
    : spec.slug === "alert"
      ? `export { ${elementClassName}, ${elementClassName} as AlertWebElement } from "./${spec.slug}-element";
export { ${factoryName} } from "./${spec.slug}-web-component";`
    : spec.slug === "alert-dialog"
      ? `export { ${elementClassName}, ${elementClassName} as AlertDialogWebElement } from "./${spec.slug}-element";
export { ${factoryName} } from "./${spec.slug}-web-component";`
    : spec.slug === "aspect-ratio"
      ? `export { ${elementClassName}, ${factoryName}, resolveAspectRatio } from "./${spec.slug}-element";`
    : `export { ${elementClassName}, ${factoryName} } from "./${spec.slug}-element";`;

  return `export { componentSpec } from "./component-spec";
export type { ComponentPartName, ComponentPartSpec, ComponentSpec } from "./component-spec";
export { define${pascalCase(spec.slug)}Elements } from "./define";
export { define${pascalCase(spec.slug)}Elements as defineElements } from "./define";
export { create${pascalCase(spec.slug)}Element, createElement, getPartSpec } from "./shared";
export type { ${pascalCase(spec.slug)}HostElement } from "./shared";
${elementExports}
${partExports}
`;
}

function componentElementSource(spec) {
  if (spec.slug === "accordion") {
    return accordionSplitElementSource();
  }

  if (spec.slug === "aspect-ratio") {
    return aspectRatioElementSource();
  }

  if (spec.slug === "avatar") {
    return avatarElementSource();
  }

  if (spec.slug === "badge") {
    return badgeElementSource();
  }

  if (spec.slug === "alert") {
    return alertElementSource();
  }

  if (spec.slug === "dialog") {
    return dialogElementSource();
  }

  if (spec.slug === "alert-dialog") {
    return alertDialogElementSource();
  }

  const elementClassName = componentElementClassName(spec);
  const factoryName = `create${pascalCase(spec.slug)}WebComponent`;

  return `import { AriaWebElement } from "${packageScope}/utils";
import type { WebComponentPartSpec } from "${packageScope}/utils";

export class ${elementClassName} extends AriaWebElement {}

export function ${factoryName}(part: WebComponentPartSpec): typeof ${elementClassName} {
  return class extends ${elementClassName} {
    static override packageSlug = "${spec.slug}";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function badgeElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import { badgePreservedDataAttributes } from "./badge-dom";
import {
  beginBadgeBaseContract,
  captureBadgeConsumerDataAttributes,
  endBadgeBaseContract,
  isBadgeInternalDataAttributeChange,
  restoreBadgeConsumerDataAttributes,
  syncBadgeInteractiveSemantics,
  trackBadgeConsumerDataAttribute,
} from "./badge-sync";

export class BadgeElement extends AriaWebElement {
  static override packageSlug = "badge";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "as",
      ...badgePreservedDataAttributes,
    ]));
  }

  get as() {
    return this.getAttribute("as") ?? "div";
  }

  set as(value: string | null | undefined) {
    if (value == null || value === "" || value === "div") {
      this.removeAttribute("as");
    } else {
      this.setAttribute("as", String(value));
    }
  }

  override connectedCallback() {
    captureBadgeConsumerDataAttributes(this);
    beginBadgeBaseContract(this);
    try {
      super.connectedCallback();
    } finally {
      endBadgeBaseContract(this);
    }
    restoreBadgeConsumerDataAttributes(this);
    syncBadgeInteractiveSemantics(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (isBadgeInternalDataAttributeChange(this, name)) {
      return;
    }

    trackBadgeConsumerDataAttribute(this, name, newValue);
    beginBadgeBaseContract(this);
    try {
      super.attributeChangedCallback(name, oldValue, newValue);
    } finally {
      endBadgeBaseContract(this);
    }

    restoreBadgeConsumerDataAttributes(this);
    syncBadgeInteractiveSemantics(this);
  }

  override afterAriaWebContractApplied() {
    restoreBadgeConsumerDataAttributes(this);
    syncBadgeInteractiveSemantics(this);
  }
}
`;
}

function badgeDomSource() {
  return `export const badgePreservedDataAttributes = ["data-disabled", "data-slot", "data-state", "data-variant"] as const;

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
`;
}

function badgeSyncSource() {
  return `import {
  badgeInteractiveRole,
  badgePreservedDataAttributes,
  isPreservedBadgeDataAttribute,
} from "./badge-dom";

type BadgeSyncState = {
  appliedRole: string | null;
  appliedTabIndex: string | null;
  applyingBaseContract: boolean;
  restoringDataAttribute: boolean;
  consumerDataAttributes: Map<string, string>;
};

const badgeSyncStates = new WeakMap<HTMLElement, BadgeSyncState>();

function badgeSyncState(element: HTMLElement) {
  let state = badgeSyncStates.get(element);
  if (!state) {
    state = {
      appliedRole: null,
      appliedTabIndex: null,
      applyingBaseContract: false,
      restoringDataAttribute: false,
      consumerDataAttributes: new Map<string, string>(),
    };
    badgeSyncStates.set(element, state);
  }

  return state;
}

export function beginBadgeBaseContract(element: HTMLElement) {
  badgeSyncState(element).applyingBaseContract = true;
}

export function endBadgeBaseContract(element: HTMLElement) {
  badgeSyncState(element).applyingBaseContract = false;
}

export function isBadgeInternalDataAttributeChange(element: HTMLElement, name: string) {
  if (!isPreservedBadgeDataAttribute(name)) {
    return false;
  }

  const state = badgeSyncState(element);
  return state.applyingBaseContract || state.restoringDataAttribute;
}

export function captureBadgeConsumerDataAttributes(element: HTMLElement) {
  const state = badgeSyncState(element);
  for (const attribute of badgePreservedDataAttributes) {
    const value = element.getAttribute(attribute);
    if (value != null) {
      state.consumerDataAttributes.set(attribute, value);
    }
  }
}

export function trackBadgeConsumerDataAttribute(element: HTMLElement, name: string, value: string | null) {
  if (!isPreservedBadgeDataAttribute(name)) {
    return;
  }

  const state = badgeSyncState(element);
  if (value == null) {
    state.consumerDataAttributes.delete(name);
  } else {
    state.consumerDataAttributes.set(name, value);
  }
}

export function restoreBadgeConsumerDataAttributes(element: HTMLElement) {
  const state = badgeSyncState(element);
  if (state.consumerDataAttributes.size === 0) {
    return;
  }

  state.restoringDataAttribute = true;
  try {
    for (const [attribute, value] of state.consumerDataAttributes) {
      if (element.getAttribute(attribute) !== value) {
        element.setAttribute(attribute, value);
      }
    }
  } finally {
    state.restoringDataAttribute = false;
  }
}

export function syncBadgeInteractiveSemantics(element: HTMLElement) {
  const role = badgeInteractiveRole(element.getAttribute("as"));
  syncDefaultRole(element, role);
  syncDefaultTabIndex(element, role ? "0" : null);
}

function syncDefaultRole(element: HTMLElement, role: string | null) {
  const state = badgeSyncState(element);
  const currentRole = element.getAttribute("role");

  if (!role) {
    if (state.appliedRole && currentRole === state.appliedRole) {
      state.appliedRole = null;
      element.removeAttribute("role");
    }
    state.appliedRole = null;
    return;
  }

  if (!currentRole || currentRole === state.appliedRole) {
    state.appliedRole = role;
    if (currentRole !== role) {
      element.setAttribute("role", role);
    }
    return;
  }

  if (currentRole !== role) {
    state.appliedRole = null;
  }
}

function syncDefaultTabIndex(element: HTMLElement, tabIndex: string | null) {
  const state = badgeSyncState(element);
  const currentTabIndex = element.getAttribute("tabindex");

  if (!tabIndex) {
    if (state.appliedTabIndex && currentTabIndex === state.appliedTabIndex) {
      state.appliedTabIndex = null;
      element.removeAttribute("tabindex");
    }
    state.appliedTabIndex = null;
    return;
  }

  if (!currentTabIndex || currentTabIndex === state.appliedTabIndex) {
    state.appliedTabIndex = tabIndex;
    if (currentTabIndex !== tabIndex) {
      element.setAttribute("tabindex", tabIndex);
    }
    return;
  }

  if (currentTabIndex !== tabIndex) {
    state.appliedTabIndex = null;
  }
}
`;
}

function badgeWebComponentSource() {
  return `import type { WebComponentPartSpec } from "${packageScope}/utils";
import { Root } from "./parts/Root";

const badgePartConstructors = {
  Root,
} as const;

export function createBadgeWebComponent(part: WebComponentPartSpec) {
  const constructor = badgePartConstructors[part.name as keyof typeof badgePartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/badge.");
  }

  return constructor;
}
`;
}

function badgePartSpecSource() {
  return `import { componentSpec, type ComponentPartName } from "../component-spec";

export function getBadgePartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/badge.");
  }

  return partSpec;
}
`;
}

function badgePartSource(partName) {
  return `import { BadgeElement } from "../badge-element";
import { getBadgePartSpec } from "./part-spec";

const partSpec = getBadgePartSpec("${partName}");

export class ${partName} extends BadgeElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ${partName}Element = InstanceType<typeof ${partName}>;
`;
}

function avatarElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import type { WebComponentPartSpec } from "${packageScope}/utils";

export type AvatarImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

const imageForwardAttributes = [
  "alt",
  "crossorigin",
  "data-testid",
  "decoding",
  "fetchpriority",
  "loading",
  "referrerpolicy",
  "sizes",
  "src",
  "srcset",
] as const;

function avatarPartName(element: AvatarWebElement) {
  return (element.constructor as typeof AvatarWebElement).partName;
}

function nearestAvatarRoot(element: Element) {
  return element.closest("aria-avatar") as AvatarWebElement | null;
}

function avatarImages(root: Element) {
  return Array.from(root.querySelectorAll("aria-avatar-image")) as AvatarWebElement[];
}

function avatarFallbacks(root: Element) {
  return Array.from(root.querySelectorAll("aria-avatar-fallback")) as AvatarWebElement[];
}

function parseDelay(value: string | null) {
  if (value == null || value.trim() === "") {
    return 0;
  }

  const delay = Number(value);
  return Number.isFinite(delay) && delay > 0 ? delay : 0;
}

function redispatchImageEvent(host: AvatarWebElement, type: "load" | "error") {
  host.dispatchEvent(new Event(type));
}

export class AvatarWebElement extends AriaWebElement {
  #imageElement: HTMLImageElement | null = null;
  #imageStatus: AvatarImageLoadingStatus = "idle";
  #fallbackTimer: number | null = null;
  #fallbackDelayStarted = false;
  #avatarObserver: MutationObserver | null = null;
  #syncingConvenience = false;
  #defaultRoleApplied = false;
  #defaultLabelApplied = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "alt",
      "aria-label",
      "crossorigin",
      "data-testid",
      "decoding",
      "delay-ms",
      "fallback",
      "fallback-delay-ms",
      "fetchpriority",
      "loading",
      "referrerpolicy",
      "role",
      "sizes",
      "src",
      "srcset",
    ]));
  }

  get src() {
    return this.getAttribute("src") ?? "";
  }

  set src(value: string | null | undefined) {
    if (value == null || value === "") {
      this.removeAttribute("src");
    } else {
      this.setAttribute("src", String(value));
    }
  }

  get loadingStatus() {
    return this.#imageStatus;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.observeAvatarChildren();
    this.syncAvatarPart();
  }

  disconnectedCallback() {
    this.#avatarObserver?.disconnect();
    this.#avatarObserver = null;
    this.clearFallbackTimer();
    this.unbindImageElement();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) {
      return;
    }

    if (avatarPartName(this) === "Image" && name === "src") {
      this.setImageStatus(this.hasAttribute("src") ? "loading" : "error", false);
    }

    this.syncAvatarPart();
  }

  override afterAriaWebContractApplied() {
    this.syncAvatarPart();
  }

  observeAvatarChildren() {
    if (typeof MutationObserver === "undefined" || this.#avatarObserver || avatarPartName(this) !== "Root") {
      return;
    }

    this.#avatarObserver = new MutationObserver(() => this.syncRoot());
    this.#avatarObserver.observe(this, { childList: true, subtree: true });
  }

  syncAvatarPart() {
    const partName = avatarPartName(this);

    if (partName === "Root") {
      this.syncRoot();
      return;
    }

    if (partName === "Image") {
      this.syncImage();
      return;
    }

    if (partName === "Fallback") {
      this.syncFallback();
    }
  }

  syncRoot() {
    this.ensureConvenienceParts();
    const status = this.resolveRootImageStatus();
    this.applyRootSemantics(status);

    for (const fallback of avatarFallbacks(this)) {
      if (typeof fallback.syncFallback === "function") {
        fallback.syncFallback(status);
      } else {
        fallback.hidden = status === "loaded";
      }
    }
  }

  ensureConvenienceParts() {
    if (this.#syncingConvenience || avatarPartName(this) !== "Root") {
      return;
    }

    this.#syncingConvenience = true;
    try {
      let generatedImage = this.querySelector("aria-avatar-image[data-avatar-generated='image']") as AvatarWebElement | null;

      if (this.hasAttribute("src")) {
        if (!generatedImage) {
          generatedImage = document.createElement("aria-avatar-image") as AvatarWebElement;
          generatedImage.setAttribute("data-avatar-generated", "image");
          this.prepend(generatedImage);
        }

        generatedImage.setAttribute("src", this.getAttribute("src") ?? "");
        generatedImage.setAttribute("alt", this.getAttribute("alt") ?? "");
        for (const attribute of imageForwardAttributes) {
          if (attribute === "src" || attribute === "alt") {
            continue;
          }

          if (this.hasAttribute(attribute)) {
            generatedImage.setAttribute(attribute, this.getAttribute(attribute) ?? "");
          } else {
            generatedImage.removeAttribute(attribute);
          }
        }
      } else {
        generatedImage?.remove();
      }

      let generatedFallback = this.querySelector("aria-avatar-fallback[data-avatar-generated='fallback']") as AvatarWebElement | null;

      if (this.hasAttribute("fallback")) {
        if (!generatedFallback) {
          generatedFallback = document.createElement("aria-avatar-fallback") as AvatarWebElement;
          generatedFallback.setAttribute("data-avatar-generated", "fallback");
          this.append(generatedFallback);
        }

        generatedFallback.textContent = this.getAttribute("fallback") ?? "";
        if (this.hasAttribute("fallback-delay-ms")) {
          generatedFallback.setAttribute("delay-ms", this.getAttribute("fallback-delay-ms") ?? "");
        } else {
          generatedFallback.removeAttribute("delay-ms");
        }
      } else {
        generatedFallback?.remove();
      }
    } finally {
      this.#syncingConvenience = false;
    }
  }

  resolveRootImageStatus() {
    const image = avatarImages(this).find((candidate) => candidate.hasAttribute("src"));
    if (!image) {
      return "error" satisfies AvatarImageLoadingStatus;
    }

    return image.loadingStatus;
  }

  applyRootSemantics(status: AvatarImageLoadingStatus) {
    const imageLoaded = status === "loaded";
    const hasVisibleFallback = this.hasAttribute("fallback") || avatarFallbacks(this).length > 0;

    if (imageLoaded || !hasVisibleFallback) {
      if (this.#defaultRoleApplied && this.getAttribute("role") === "img") {
        this.removeAttribute("role");
      }
      if (this.#defaultLabelApplied && this.getAttribute("aria-label") === "avatar") {
        this.removeAttribute("aria-label");
      }
      this.#defaultRoleApplied = false;
      this.#defaultLabelApplied = false;
      return;
    }

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "img");
      this.#defaultRoleApplied = true;
    }

    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "avatar");
      this.#defaultLabelApplied = true;
    }
  }

  syncImage() {
    if (!this.hasAttribute("src")) {
      this.unbindImageElement();
      this.querySelector("img")?.remove();
      this.setImageStatus("error", false);
      this.notifyRoot();
      return;
    }

    const img = this.ensureImageElement();
    for (const attribute of imageForwardAttributes) {
      if (this.hasAttribute(attribute)) {
        img.setAttribute(attribute, this.getAttribute(attribute) ?? "");
      } else {
        img.removeAttribute(attribute);
      }
    }

    if (this.#imageStatus === "idle") {
      this.setImageStatus("loading", false);
    }

    if (img.complete) {
      queueMicrotask(() => {
        if (img !== this.#imageElement || !this.hasAttribute("src")) {
          return;
        }

        const status = img.naturalWidth > 0 ? "loaded" : "error";
        this.handleInternalImageStatus(status);
        redispatchImageEvent(this, status === "loaded" ? "load" : "error");
      });
    }

    this.applyImageVisibility();
    this.notifyRoot();
  }

  ensureImageElement() {
    let img = this.#imageElement;

    if (!img || img.parentElement !== this) {
      const existing = this.querySelector("img");
      img = existing instanceof HTMLImageElement ? existing : document.createElement("img");
      this.unbindImageElement();
      this.#imageElement = img;
      img.addEventListener("load", this.handleInternalImageLoad);
      img.addEventListener("error", this.handleInternalImageError);

      if (!img.parentElement) {
        this.append(img);
      }
    }

    return img;
  }

  unbindImageElement() {
    if (!this.#imageElement) {
      return;
    }

    this.#imageElement.removeEventListener("load", this.handleInternalImageLoad);
    this.#imageElement.removeEventListener("error", this.handleInternalImageError);
    this.#imageElement = null;
  }

  handleInternalImageLoad = () => {
    this.handleInternalImageStatus("loaded");
    redispatchImageEvent(this, "load");
  };

  handleInternalImageError = () => {
    this.handleInternalImageStatus("error");
    redispatchImageEvent(this, "error");
  };

  handleInternalImageStatus(status: AvatarImageLoadingStatus) {
    this.setImageStatus(status, true);
    this.applyImageVisibility();
    this.notifyRoot(status);
  }

  setImageStatus(status: AvatarImageLoadingStatus, emitEvent: boolean) {
    if (this.#imageStatus === status) {
      this.setAttribute("data-loading-status", status);
      return;
    }

    this.#imageStatus = status;
    this.setAttribute("data-loading-status", status);
    if (emitEvent) {
      this.dispatchEvent(new CustomEvent("loadingstatuschange", { detail: { status } }));
    }
  }

  applyImageVisibility() {
    const img = this.#imageElement;
    if (!img) {
      return;
    }

    const imageLoaded = this.#imageStatus === "loaded";
    if (imageLoaded) {
      img.removeAttribute("aria-hidden");
      img.style.visibility = "";
    } else {
      img.setAttribute("aria-hidden", "true");
      img.style.visibility = "hidden";
    }
  }

  notifyRoot(status?: AvatarImageLoadingStatus) {
    const root = nearestAvatarRoot(this);
    root?.syncRoot();
    if (root && status) {
      root.dispatchEvent(new CustomEvent("loadingstatuschange", { detail: { status } }));
    }
  }

  syncFallback(status = nearestAvatarRoot(this)?.resolveRootImageStatus() ?? "error") {
    if (status === "loaded") {
      this.clearFallbackTimer();
      this.#fallbackDelayStarted = false;
      this.hidden = true;
      return;
    }

    const delay = parseDelay(this.getAttribute("delay-ms"));
    if (delay <= 0) {
      this.clearFallbackTimer();
      this.#fallbackDelayStarted = false;
      this.hidden = false;
      return;
    }

    if (this.#fallbackTimer != null || (this.#fallbackDelayStarted && this.hidden === false)) {
      return;
    }

    this.#fallbackDelayStarted = true;
    this.hidden = true;
    this.#fallbackTimer = window.setTimeout(() => {
      this.#fallbackTimer = null;
      if ((nearestAvatarRoot(this)?.resolveRootImageStatus() ?? "error") !== "loaded") {
        this.hidden = false;
      }
    }, delay);
  }

  clearFallbackTimer() {
    if (this.#fallbackTimer == null) {
      return;
    }

    window.clearTimeout(this.#fallbackTimer);
    this.#fallbackTimer = null;
  }
}

export function createAvatarWebComponent(part: WebComponentPartSpec): typeof AvatarWebElement {
  return class extends AvatarWebElement {
    static override packageSlug = "avatar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function aspectRatioElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import type { WebComponentPartSpec } from "${packageScope}/utils";

const fallbackRatio = 1;

function resolveRatioPair(value: string, separator: "/" | ":") {
  const pattern = separator === "/"
    ? /^(\\d+(?:\\.\\d+)?)\\s*\\/\\s*(\\d+(?:\\.\\d+)?)$/
    : /^(\\d+(?:\\.\\d+)?)\\s*:\\s*(\\d+(?:\\.\\d+)?)$/;
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
  if (!/^\\d+(?:\\.\\d+)?$/.test(value)) {
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

function applyShellStyles(element: HTMLElement, ratio: number) {
  element.style.display = "block";
  element.style.position = "relative";
  element.style.width = "100%";
  element.style.paddingBottom = String((1 / ratio) * 100) + "%";
}

function applyFillStyles(element: HTMLElement) {
  element.style.position = "absolute";
  element.style.inset = "0px";
}

export class AspectRatioWebElement extends AriaWebElement {
  #fillElement: HTMLElement | null = null;
  #observer: MutationObserver | null = null;
  #syncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "native-composition", "ratio"]));
  }

  get ratio() {
    return this.getAttribute("ratio") ?? "1";
  }

  set ratio(value: string | number | null | undefined) {
    if (value == null) {
      this.removeAttribute("ratio");
      return;
    }

    this.setAttribute("ratio", String(value));
  }

  override connectedCallback() {
    super.connectedCallback();
    this.observeAspectRatioChildren();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  override afterAriaWebContractApplied() {
    this.syncAspectRatioLayout();
  }

  observeAspectRatioChildren() {
    if (typeof MutationObserver === "undefined" || this.#observer) {
      return;
    }

    this.#observer = new MutationObserver(() => {
      if (!this.#syncing) {
        this.syncAspectRatioLayout();
      }
    });
    this.#observer.observe(this, { childList: true });
  }

  firstElementFillHost() {
    return Array.from(this.children).find((child): child is HTMLElement => child instanceof HTMLElement && child !== this.#fillElement) ?? null;
  }

  removeInternalFill() {
    const fill = this.#fillElement;
    if (!fill || fill.parentElement !== this) {
      this.#fillElement = null;
      return;
    }

    while (fill.firstChild) {
      this.insertBefore(fill.firstChild, fill);
    }
    fill.remove();
    this.#fillElement = null;
  }

  ensureInternalFill() {
    if (!this.#fillElement || this.#fillElement.parentElement !== this) {
      this.#fillElement = document.createElement("div");
      this.append(this.#fillElement);
    }

    return this.#fillElement;
  }

  moveChildrenIntoFill(fill: HTMLElement) {
    for (const node of Array.from(this.childNodes)) {
      if (node !== fill) {
        fill.append(node);
      }
    }
  }

  syncAspectRatioLayout() {
    if (this.#syncing) {
      return;
    }

    this.#syncing = true;
    try {
      applyShellStyles(this, resolveAspectRatio(this.getAttribute("ratio") ?? undefined));

      if (this.hasAttribute("native-composition")) {
        this.removeInternalFill();
        const fillHost = this.firstElementFillHost();
        if (fillHost) {
          applyFillStyles(fillHost);
        }
        return;
      }

      const fill = this.ensureInternalFill();
      this.moveChildrenIntoFill(fill);
      applyFillStyles(fill);
    } finally {
      this.#syncing = false;
    }
  }
}

export function createAspectRatioWebComponent(part: WebComponentPartSpec): typeof AspectRatioWebElement {
  return class extends AspectRatioWebElement {
    static override packageSlug = "aspect-ratio";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function componentElementClassName(spec) {
  return spec.slug === "accordion" || spec.slug === "badge" || spec.slug === "alert" || spec.slug === "alert-dialog" ? `${pascalCase(spec.slug)}Element` : `${pascalCase(spec.slug)}WebElement`;
}

function accordionElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import type { WebComponentPartSpec } from "${packageScope}/utils";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export class AccordionElement extends AriaWebElement {
  #accordionSyncing = false;

  accordionPartName() {
    const constructor = this.constructor as typeof AccordionElement;
    return constructor.partName;
  }

  isAccordionDisclosureTrigger(role: string | null) {
    return role === "button" && (this.accordionPartName() === "Trigger" || this.accordionPartName() === "Button");
  }

  accordionRoot() {
    return this.closest("aria-accordion");
  }

  accordionItem() {
    return this.closest("aria-accordion-item");
  }

  accordionItems(root: Element) {
    return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-item")).filter((item) => item.closest("aria-accordion") === root);
  }

  accordionElementsInItem(item: Element, root: Element, selector: string) {
    return Array.from(item.querySelectorAll<HTMLElement>(selector)).filter((element) => {
      return element.closest("aria-accordion") === root && element.closest("aria-accordion-item") === item;
    });
  }

  accordionTriggers(root: Element) {
    return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")).filter((trigger) => {
      return trigger.closest("aria-accordion") === root && !trigger.hasAttribute("disabled");
    });
  }

  accordionValuesFromAttribute(value: string | null, type: string) {
    if (value == null) {
      return [];
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item));
        }
      } catch {
        return [];
      }
    }

    if (type === "multiple") {
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return [trimmed];
  }

  uniqueAccordionValues(values: readonly string[]) {
    return Array.from(new Set(values));
  }

  accordionValuesEqual(first: readonly string[], second: readonly string[]) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }

  serializeAccordionValues(type: string, values: readonly string[]) {
    return type === "multiple" ? values.join(",") : values[0] ?? "";
  }

  writeAccordionRootValue(root: Element, type: string, values: readonly string[]) {
    const serialized = this.serializeAccordionValues(type, this.uniqueAccordionValues(values));
    if (root.getAttribute("value") !== serialized) {
      root.setAttribute("value", serialized);
    }
  }

  accordionRootValues(root: Element, type: string) {
    if (!root.hasAttribute("value")) {
      const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
      if (defaultValue != null) {
        this.writeAccordionRootValue(root, type, this.accordionValuesFromAttribute(defaultValue, type));
      }
    }

    return this.uniqueAccordionValues(this.accordionValuesFromAttribute(root.getAttribute("value"), type));
  }

  accordionItemValue(item: Element, index = 0) {
    return item.getAttribute("value") ?? String(index);
  }

  accordionIdPart(value: string, index: number) {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || String(index);
  }

  setAccordionInheritedDisabled(element: HTMLElement, disabled: boolean) {
    const inheritedAttribute = "data-ariaui-web-inherited-disabled";
    if (disabled) {
      if (!element.hasAttribute("disabled")) {
        element.setAttribute(inheritedAttribute, "");
      }
      element.setAttribute("disabled", "");
      return;
    }

    if (element.hasAttribute(inheritedAttribute)) {
      element.removeAttribute("disabled");
      element.removeAttribute(inheritedAttribute);
    }
  }

  setAccordionDisabledMetadata(element: HTMLElement, disabled: boolean) {
    if (disabled) {
      element.setAttribute("aria-disabled", "true");
      element.setAttribute("data-disabled", "");
    } else {
      element.removeAttribute("aria-disabled");
      element.removeAttribute("data-disabled");
    }
  }

  override afterAriaWebContractApplied() {
    this.syncAccordionTreeAroundSelf();
  }

  syncAccordionTreeAroundSelf() {
    const root = this.accordionPartName() === "Root" ? this : this.accordionRoot();
    if (root instanceof AccordionElement) {
      root.syncAccordionTreeFromRoot();
    }
  }

  syncAccordionTreeFromRoot() {
    if (this.accordionPartName() !== "Root" || this.#accordionSyncing) {
      return;
    }

    this.#accordionSyncing = true;
    try {
      const root = this;
      const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
      const orientation = root.getAttribute("orientation") ?? "vertical";
      const rootDisabled = root.hasAttribute("disabled");
      const itemEntries = this.accordionItems(root).map((item, index) => ({
        item,
        index,
        value: this.accordionItemValue(item, index),
      }));
      const seenValues = new Set<string>();

      if (itemEntries.length === 0) {
        return;
      }

      for (const { value } of itemEntries) {
        if (seenValues.has(value)) {
          throw new Error("Duplicate Accordion.Item value: " + value);
        }
        seenValues.add(value);
      }

      const activeValues = this.accordionRootValues(root, type).filter((value) => seenValues.has(value));
      const serializedActiveValues = this.serializeAccordionValues(type, activeValues);
      if ((root.getAttribute("value") ?? "") !== serializedActiveValues) {
        this.writeAccordionRootValue(root, type, activeValues);
      }

      const activeValueSet = new Set(activeValues);
      for (const entry of itemEntries) {
        const itemOwnDisabled = entry.item.hasAttribute("disabled") && !entry.item.hasAttribute("data-ariaui-web-inherited-disabled");
        const itemDisabled = rootDisabled || itemOwnDisabled;
        const isOpen = activeValueSet.has(entry.value);
        this.syncAccordionItem(root, entry.item, entry.value, entry.index, isOpen, itemDisabled, type, orientation);
      }
    } finally {
      this.#accordionSyncing = false;
    }
  }

  syncAccordionItem(root: Element, item: HTMLElement, value: string, index: number, isOpen: boolean, itemDisabled: boolean, type: string, orientation: string) {
    this.setAccordionInheritedDisabled(item, root.hasAttribute("disabled"));
    this.setAccordionDisabledMetadata(item, itemDisabled);
    setBooleanAttribute(item, "open", isOpen);
    item.setAttribute("data-state", isOpen ? "open" : "closed");
    item.setAttribute("data-orientation", orientation);

    const headers = this.accordionElementsInItem(item, root, "aria-accordion-header");
    const triggers = this.accordionElementsInItem(item, root, "aria-accordion-trigger, aria-accordion-button");
    const contents = this.accordionElementsInItem(item, root, "aria-accordion-content, aria-accordion-panel");
    const baseId = "ariaui-accordion-" + this.accordionIdPart(value, index);
    const primaryTrigger = triggers[0];
    const primaryContent = contents[0];

    if (primaryTrigger && !primaryTrigger.id) {
      primaryTrigger.id = baseId + "-trigger";
    }

    if (primaryContent && !primaryContent.id) {
      primaryContent.id = baseId + "-panel";
    }

    for (const header of headers) {
      header.setAttribute("data-state", isOpen ? "open" : "closed");
      header.setAttribute("data-orientation", orientation);
      this.setAccordionDisabledMetadata(header, itemDisabled);
    }

    for (const trigger of triggers) {
      this.setAccordionInheritedDisabled(trigger, itemDisabled);
      setBooleanAttribute(trigger, "open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      trigger.setAttribute("data-state", isOpen ? "open" : "closed");
      trigger.setAttribute("data-orientation", orientation);
      if (primaryContent) {
        trigger.setAttribute("aria-controls", primaryContent.id);
      }

      const triggerOwnDisabled = trigger.hasAttribute("disabled") && !trigger.hasAttribute("data-ariaui-web-inherited-disabled");
      const triggerDisabled = itemDisabled || triggerOwnDisabled;
      this.setAccordionDisabledMetadata(trigger, triggerDisabled);
      if (!triggerDisabled && type === "single" && isOpen && root.getAttribute("collapsible") !== "true") {
        trigger.setAttribute("aria-disabled", "true");
      }
    }

    contents.forEach((content, contentIndex) => {
      if (!content.id) {
        content.id = baseId + "-panel-" + contentIndex;
      }
      if (primaryTrigger) {
        content.setAttribute("aria-labelledby", primaryTrigger.id);
      }
      setBooleanAttribute(content, "open", isOpen);
      content.setAttribute("aria-hidden", String(!isOpen));
      content.setAttribute("data-state", isOpen ? "open" : "closed");
      content.setAttribute("data-orientation", orientation);
      content.hidden = !isOpen && !content.hasAttribute("force-mount");
      this.setAccordionDisabledMetadata(content, itemDisabled);
    });
  }

  toggleAccordionItem(root: Element) {
    const item = this.accordionItem();
    if (!item || item.closest("aria-accordion") !== root) {
      return false;
    }

    const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
    const itemIndex = this.accordionItems(root).indexOf(item as HTMLElement);
    const itemValue = this.accordionItemValue(item, itemIndex);
    const activeValues = this.accordionRootValues(root, type);
    const isOpen = activeValues.includes(itemValue);
    let nextValues: string[];

    if (type === "multiple") {
      nextValues = isOpen ? activeValues.filter((value) => value !== itemValue) : [...activeValues, itemValue];
    } else if (isOpen && root.getAttribute("collapsible") !== "true") {
      nextValues = activeValues;
    } else {
      nextValues = isOpen ? [] : [itemValue];
    }

    nextValues = this.uniqueAccordionValues(nextValues);
    if (this.accordionValuesEqual(activeValues, nextValues)) {
      if (root instanceof AccordionElement) {
        root.syncAccordionTreeFromRoot();
      }
      return true;
    }

    this.writeAccordionRootValue(root, type, nextValues);
    if (root instanceof AccordionElement) {
      root.syncAccordionTreeFromRoot();
    }
    root.dispatchEvent(new CustomEvent("valuechange", {
      bubbles: true,
      detail: {
        value: type === "multiple" ? nextValues : nextValues[0] ?? "",
        values: nextValues,
      },
    }));
    return true;
  }

  nextAccordionOpenState(root: Element | null) {
    if (!root || root.getAttribute("type") !== "single") {
      return !this.hasAttribute("open");
    }

    if (this.hasAttribute("open") && root.getAttribute("collapsible") !== "true") {
      return true;
    }

    return !this.hasAttribute("open");
  }

  closeAccordionSiblings(root: Element, controlledElement: Element) {
    for (const trigger of root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")) {
      if (trigger === this) {
        continue;
      }

      trigger.removeAttribute("open");
      const controlledId = trigger.getAttribute("aria-controls");
      const siblingPanel = controlledId ? this.ownerDocument.getElementById(controlledId) : null;

      if (siblingPanel && siblingPanel !== controlledElement) {
        siblingPanel.removeAttribute("open");
        siblingPanel.hidden = true;
      }
    }
  }

  override handleCompositeRovingFocus(event: KeyboardEvent, role: string | null) {
    if (!this.isAccordionDisclosureTrigger(role)) {
      return false;
    }

    const root = this.accordionRoot();
    if (!root) {
      return false;
    }

    const triggers = this.accordionTriggers(root);
    const currentIndex = triggers.indexOf(this);
    if (currentIndex === -1 || triggers.length === 0) {
      return false;
    }

    const orientation = root.getAttribute("orientation") ?? "vertical";
    const dir = root.getAttribute("dir") ?? "ltr";
    let nextIndex = -1;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = triggers.length - 1;
    } else if (orientation === "vertical" && event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (orientation === "vertical" && event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (orientation === "horizontal" && event.key === (dir === "rtl" ? "ArrowLeft" : "ArrowRight")) {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (orientation === "horizontal" && event.key === (dir === "rtl" ? "ArrowRight" : "ArrowLeft")) {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    }

    if (nextIndex === -1) {
      return false;
    }

    event.preventDefault();
    triggers[nextIndex]?.focus();
    return true;
  }

  override toggleControlledElement() {
    const role = this.getAttribute("role");
    const root = this.isAccordionDisclosureTrigger(role) ? this.accordionRoot() : null;
    if (root && this.accordionItem()) {
      return this.toggleAccordionItem(root);
    }

    const controlledElement = this.controlledElement();
    if (!controlledElement) {
      return false;
    }

    const nextOpen = this.isAccordionDisclosureTrigger(role) ? this.nextAccordionOpenState(root) : !this.hasAttribute("open");
    if (root && root.getAttribute("type") === "single" && nextOpen) {
      this.closeAccordionSiblings(root, controlledElement);
    }
    this.open = nextOpen;
    setBooleanAttribute(controlledElement, "open", nextOpen);
    controlledElement.hidden = !nextOpen;
    return true;
  }
}

export function createAccordionWebComponent(part: WebComponentPartSpec): typeof AccordionElement {
  return class extends AccordionElement {
    static override packageSlug = "accordion";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function accordionSplitElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import { syncAccordionTreeAround } from "./accordion-sync";

export class AccordionElement extends AriaWebElement {
  static override packageSlug = "accordion";

  override afterAriaWebContractApplied() {
    syncAccordionTreeAround(this);
  }
}
`;
}

function accordionDomSource() {
  return `export type AccordionRootElement = HTMLElement & {
  syncAccordionTreeFromRoot: () => void;
};

export function isAccordionRootElement(element: Element | null): element is AccordionRootElement {
  return element instanceof HTMLElement && typeof (element as Partial<AccordionRootElement>).syncAccordionTreeFromRoot === "function";
}

export function accordionRoot(element: Element) {
  return element.closest("aria-accordion");
}

export function accordionItem(element: Element) {
  return element.closest("aria-accordion-item");
}

export function accordionItems(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-item")).filter((item) => item.closest("aria-accordion") === root);
}

export function accordionElementsInItem(item: Element, root: Element, selector: string) {
  return Array.from(item.querySelectorAll<HTMLElement>(selector)).filter((element) => {
    return element.closest("aria-accordion") === root && element.closest("aria-accordion-item") === item;
  });
}

export function accordionTriggers(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")).filter((trigger) => {
    return trigger.closest("aria-accordion") === root && !trigger.hasAttribute("disabled");
  });
}
`;
}

function accordionValueSource() {
  return `export function accordionValuesFromAttribute(value: string | null, type: string) {
  if (value == null) {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {
      return [];
    }
  }

  if (type === "multiple") {
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [trimmed];
}

export function uniqueAccordionValues(values: readonly string[]) {
  return Array.from(new Set(values));
}

export function accordionValuesEqual(first: readonly string[], second: readonly string[]) {
  return first.length === second.length && first.every((value, index) => value === second[index]);
}

export function serializeAccordionValues(type: string, values: readonly string[]) {
  return type === "multiple" ? values.join(",") : values[0] ?? "";
}

export function writeAccordionRootValue(root: Element, type: string, values: readonly string[]) {
  const serialized = serializeAccordionValues(type, uniqueAccordionValues(values));
  if (root.getAttribute("value") !== serialized) {
    root.setAttribute("value", serialized);
  }
}

export function accordionRootValues(root: Element, type: string) {
  if (!root.hasAttribute("value")) {
    const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
    if (defaultValue != null) {
      writeAccordionRootValue(root, type, accordionValuesFromAttribute(defaultValue, type));
    }
  }

  return uniqueAccordionValues(accordionValuesFromAttribute(root.getAttribute("value"), type));
}

export function accordionItemValue(item: Element, index = 0) {
  return item.getAttribute("value") ?? String(index);
}

export function accordionIdPart(value: string, index: number) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || String(index);
}
`;
}

function accordionSyncSource() {
  return `import {
  accordionElementsInItem,
  accordionItems,
  accordionRoot,
  isAccordionRootElement,
} from "./accordion-dom";
import {
  accordionIdPart,
  accordionItemValue,
  accordionRootValues,
  serializeAccordionValues,
  writeAccordionRootValue,
} from "./accordion-values";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export function setAccordionInheritedDisabled(element: HTMLElement, disabled: boolean) {
  const inheritedAttribute = "data-ariaui-web-inherited-disabled";
  if (disabled) {
    if (!element.hasAttribute("disabled")) {
      element.setAttribute(inheritedAttribute, "");
    }
    element.setAttribute("disabled", "");
    return;
  }

  if (element.hasAttribute(inheritedAttribute)) {
    element.removeAttribute("disabled");
    element.removeAttribute(inheritedAttribute);
  }
}

export function setAccordionDisabledMetadata(element: HTMLElement, disabled: boolean) {
  if (disabled) {
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("data-disabled", "");
  } else {
    element.removeAttribute("aria-disabled");
    element.removeAttribute("data-disabled");
  }
}

export function syncAccordionTreeAround(element: HTMLElement) {
  const root = element.matches("aria-accordion") ? element : accordionRoot(element);
  if (isAccordionRootElement(root)) {
    root.syncAccordionTreeFromRoot();
  }
}

export function syncAccordionTreeFromRoot(root: HTMLElement) {
  const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
  const orientation = root.getAttribute("orientation") ?? "vertical";
  const rootDisabled = root.hasAttribute("disabled");
  const itemEntries = accordionItems(root).map((item, index) => ({
    item,
    index,
    value: accordionItemValue(item, index),
  }));
  const seenValues = new Set<string>();

  if (itemEntries.length === 0) {
    return;
  }

  for (const { value } of itemEntries) {
    if (seenValues.has(value)) {
      throw new Error("Duplicate Accordion.Item value: " + value);
    }
    seenValues.add(value);
  }

  const activeValues = accordionRootValues(root, type).filter((value) => seenValues.has(value));
  const serializedActiveValues = serializeAccordionValues(type, activeValues);
  if ((root.getAttribute("value") ?? "") !== serializedActiveValues) {
    writeAccordionRootValue(root, type, activeValues);
  }

  const activeValueSet = new Set(activeValues);
  for (const entry of itemEntries) {
    const itemOwnDisabled = entry.item.hasAttribute("disabled") && !entry.item.hasAttribute("data-ariaui-web-inherited-disabled");
    const itemDisabled = rootDisabled || itemOwnDisabled;
    const isOpen = activeValueSet.has(entry.value);
    syncAccordionItem(root, entry.item, entry.value, entry.index, isOpen, itemDisabled, type, orientation);
  }
}

export function syncAccordionItem(root: Element, item: HTMLElement, value: string, index: number, isOpen: boolean, itemDisabled: boolean, type: string, orientation: string) {
  setAccordionInheritedDisabled(item, root.hasAttribute("disabled"));
  setAccordionDisabledMetadata(item, itemDisabled);
  setBooleanAttribute(item, "open", isOpen);
  item.setAttribute("data-state", isOpen ? "open" : "closed");
  item.setAttribute("data-orientation", orientation);

  const headers = accordionElementsInItem(item, root, "aria-accordion-header");
  const triggers = accordionElementsInItem(item, root, "aria-accordion-trigger, aria-accordion-button");
  const contents = accordionElementsInItem(item, root, "aria-accordion-content, aria-accordion-panel");
  const baseId = "ariaui-accordion-" + accordionIdPart(value, index);
  const primaryTrigger = triggers[0];
  const primaryContent = contents[0];

  if (primaryTrigger && !primaryTrigger.id) {
    primaryTrigger.id = baseId + "-trigger";
  }

  if (primaryContent && !primaryContent.id) {
    primaryContent.id = baseId + "-panel";
  }

  for (const header of headers) {
    header.setAttribute("data-state", isOpen ? "open" : "closed");
    header.setAttribute("data-orientation", orientation);
    setAccordionDisabledMetadata(header, itemDisabled);
  }

  for (const trigger of triggers) {
    setAccordionInheritedDisabled(trigger, itemDisabled);
    setBooleanAttribute(trigger, "open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("data-state", isOpen ? "open" : "closed");
    trigger.setAttribute("data-orientation", orientation);
    if (primaryContent) {
      trigger.setAttribute("aria-controls", primaryContent.id);
    }

    const triggerOwnDisabled = trigger.hasAttribute("disabled") && !trigger.hasAttribute("data-ariaui-web-inherited-disabled");
    const triggerDisabled = itemDisabled || triggerOwnDisabled;
    setAccordionDisabledMetadata(trigger, triggerDisabled);
    if (!triggerDisabled && type === "single" && isOpen && root.getAttribute("collapsible") !== "true") {
      trigger.setAttribute("aria-disabled", "true");
    }
  }

  contents.forEach((content, contentIndex) => {
    if (!content.id) {
      content.id = baseId + "-panel-" + contentIndex;
    }
    if (primaryTrigger) {
      content.setAttribute("aria-labelledby", primaryTrigger.id);
    }
    setBooleanAttribute(content, "open", isOpen);
    content.setAttribute("aria-hidden", String(!isOpen));
    content.setAttribute("data-state", isOpen ? "open" : "closed");
    content.setAttribute("data-orientation", orientation);
    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    setAccordionDisabledMetadata(content, itemDisabled);
  });
}

export { setBooleanAttribute as setAccordionBooleanAttribute };
`;
}

function accordionActionsSource() {
  return `import {
  accordionItem,
  accordionItems,
  isAccordionRootElement,
} from "./accordion-dom";
import {
  accordionItemValue,
  accordionRootValues,
  accordionValuesEqual,
  uniqueAccordionValues,
  writeAccordionRootValue,
} from "./accordion-values";

export function toggleAccordionItem(trigger: HTMLElement, root: Element) {
  const item = accordionItem(trigger);
  if (!item || item.closest("aria-accordion") !== root) {
    return false;
  }

  const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
  const itemIndex = accordionItems(root).indexOf(item as HTMLElement);
  const itemValue = accordionItemValue(item, itemIndex);
  const activeValues = accordionRootValues(root, type);
  const isOpen = activeValues.includes(itemValue);
  let nextValues: string[];

  if (type === "multiple") {
    nextValues = isOpen ? activeValues.filter((value) => value !== itemValue) : [...activeValues, itemValue];
  } else if (isOpen && root.getAttribute("collapsible") !== "true") {
    nextValues = activeValues;
  } else {
    nextValues = isOpen ? [] : [itemValue];
  }

  nextValues = uniqueAccordionValues(nextValues);
  if (accordionValuesEqual(activeValues, nextValues)) {
    if (isAccordionRootElement(root)) {
      root.syncAccordionTreeFromRoot();
    }
    return true;
  }

  writeAccordionRootValue(root, type, nextValues);
  if (isAccordionRootElement(root)) {
    root.syncAccordionTreeFromRoot();
  }
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: type === "multiple" ? nextValues : nextValues[0] ?? "",
      values: nextValues,
    },
  }));
  return true;
}

export function nextAccordionOpenState(trigger: Element, root: Element | null) {
  if (!root || root.getAttribute("type") !== "single") {
    return !trigger.hasAttribute("open");
  }

  if (trigger.hasAttribute("open") && root.getAttribute("collapsible") !== "true") {
    return true;
  }

  return !trigger.hasAttribute("open");
}

export function closeAccordionSiblings(trigger: HTMLElement, root: Element, controlledElement: Element) {
  for (const siblingTrigger of root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")) {
    if (siblingTrigger === trigger) {
      continue;
    }

    siblingTrigger.removeAttribute("open");
    const controlledId = siblingTrigger.getAttribute("aria-controls");
    const siblingPanel = controlledId ? trigger.ownerDocument.getElementById(controlledId) : null;

    if (siblingPanel && siblingPanel !== controlledElement) {
      siblingPanel.removeAttribute("open");
      siblingPanel.hidden = true;
    }
  }
}
`;
}

function accordionWebComponentSource() {
  return `import type { WebComponentPartSpec } from "${packageScope}/utils";
import { Button } from "./parts/Button";
import { Content } from "./parts/Content";
import { Header } from "./parts/Header";
import { Item } from "./parts/Item";
import { Panel } from "./parts/Panel";
import { Root } from "./parts/Root";
import { Trigger } from "./parts/Trigger";

const accordionPartConstructors = {
  Button,
  Content,
  Header,
  Item,
  Panel,
  Root,
  Trigger,
} as const;

export function createAccordionWebComponent(part: WebComponentPartSpec) {
  const constructor = accordionPartConstructors[part.name as keyof typeof accordionPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/accordion.");
  }

  return constructor;
}
`;
}

function accordionPartSpecSource() {
  return `import { componentSpec, type ComponentPartName } from "../component-spec";

export function getAccordionPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/accordion.");
  }

  return partSpec;
}
`;
}

function accordionPartSource(partName) {
  if (partName === "Root") {
    return `import { AccordionElement } from "../accordion-element";
import { syncAccordionTreeFromRoot } from "../accordion-sync";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Root");

export class Root extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #accordionSyncing = false;

  syncAccordionTreeFromRoot() {
    if (this.#accordionSyncing) {
      return;
    }

    this.#accordionSyncing = true;
    try {
      syncAccordionTreeFromRoot(this);
    } finally {
      this.#accordionSyncing = false;
    }
  }
}

export type RootElement = InstanceType<typeof Root>;
`;
  }

  if (partName === "Trigger") {
    return `import { AccordionElement } from "../accordion-element";
import {
  accordionItem,
  accordionRoot,
  accordionTriggers,
} from "../accordion-dom";
import {
  closeAccordionSiblings,
  nextAccordionOpenState,
  toggleAccordionItem,
} from "../accordion-actions";
import { setAccordionBooleanAttribute } from "../accordion-sync";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Trigger");

export class AccordionTriggerElement extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;

  isAccordionDisclosureTrigger(role: string | null) {
    return role === "button";
  }

  override handleCompositeRovingFocus(event: KeyboardEvent, role: string | null) {
    if (!this.isAccordionDisclosureTrigger(role)) {
      return false;
    }

    const root = accordionRoot(this);
    if (!root) {
      return false;
    }

    const triggers = accordionTriggers(root);
    const currentIndex = triggers.indexOf(this);
    if (currentIndex === -1 || triggers.length === 0) {
      return false;
    }

    const orientation = root.getAttribute("orientation") ?? "vertical";
    const dir = root.getAttribute("dir") ?? "ltr";
    let nextIndex = -1;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = triggers.length - 1;
    } else if (orientation === "vertical" && event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (orientation === "vertical" && event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (orientation === "horizontal" && event.key === (dir === "rtl" ? "ArrowLeft" : "ArrowRight")) {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (orientation === "horizontal" && event.key === (dir === "rtl" ? "ArrowRight" : "ArrowLeft")) {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    }

    if (nextIndex === -1) {
      return false;
    }

    event.preventDefault();
    triggers[nextIndex]?.focus();
    return true;
  }

  override toggleControlledElement() {
    const role = this.getAttribute("role");
    const root = this.isAccordionDisclosureTrigger(role) ? accordionRoot(this) : null;
    if (root && accordionItem(this)) {
      return toggleAccordionItem(this, root);
    }

    const controlledElement = this.controlledElement();
    if (!controlledElement) {
      return false;
    }

    const nextOpen = this.isAccordionDisclosureTrigger(role) ? nextAccordionOpenState(this, root) : !this.hasAttribute("open");
    if (root && root.getAttribute("type") === "single" && nextOpen) {
      closeAccordionSiblings(this, root, controlledElement);
    }
    this.open = nextOpen;
    setAccordionBooleanAttribute(controlledElement, "open", nextOpen);
    controlledElement.hidden = !nextOpen;
    return true;
  }
}

export class Trigger extends AccordionTriggerElement {}

export type TriggerElement = InstanceType<typeof Trigger>;
`;
  }

  if (partName === "Button") {
    return `import { getAccordionPartSpec } from "./part-spec";
import { AccordionTriggerElement } from "./Trigger";

const partSpec = getAccordionPartSpec("Button");

export class Button extends AccordionTriggerElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ButtonElement = InstanceType<typeof Button>;
`;
  }

  if (partName === "Content") {
    return `import { AccordionElement } from "../accordion-element";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Content");

export class AccordionContentElement extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export class Content extends AccordionContentElement {}

export type ContentElement = InstanceType<typeof Content>;
`;
  }

  if (partName === "Panel") {
    return `import { AccordionContentElement } from "./Content";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Panel");

export class Panel extends AccordionContentElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type PanelElement = InstanceType<typeof Panel>;
`;
  }

  return `import { AccordionElement } from "../accordion-element";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("${partName}");

export class ${partName} extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ${partName}Element = InstanceType<typeof ${partName}>;
`;
}

function alertElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import { syncAlertTreeAround } from "./alert-sync";

export class AlertElement extends AriaWebElement {
  static override packageSlug = "alert";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "dismissible", "native-composition"]));
  }

  override afterAriaWebContractApplied() {
    syncAlertTreeAround(this);
  }
}
`;
}

function alertDomSource() {
  return `export type AlertRootElement = HTMLElement & {
  syncAlertTreeFromRoot: () => void;
};

export function isAlertRootElement(element: Element | null): element is AlertRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertRootElement>).syncAlertTreeFromRoot === "function";
}

export function alertRoot(element: Element) {
  return element.closest("aria-alert");
}

export function alertElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert") === root);
}

export function alertCompositionHost(part: HTMLElement) {
  if (!part.hasAttribute("native-composition")) {
    return part;
  }

  const child = Array.from(part.children).find((element): element is HTMLElement => element instanceof HTMLElement);
  return child ?? part;
}

export function syncAlertCompositionHost(part: HTMLElement) {
  const host = alertCompositionHost(part);
  if (host === part) {
    return host;
  }

  const className = part.getAttribute("class");
  if (className) {
    for (const token of className.split(/\\s+/)) {
      if (token) {
        host.classList.add(token);
      }
    }
  }

  const style = part.getAttribute("style");
  if (style && !host.getAttribute("style")) {
    host.setAttribute("style", style);
  }

  for (const attribute of Array.from(part.attributes)) {
    const name = attribute.name;
    if (name === "class" || name === "style" || name === "native-composition") {
      continue;
    }

    if (name.startsWith("aria-") || name.startsWith("data-") || ["id", "part", "role", "tabindex", "title", "type", "value", "name", "disabled"].includes(name)) {
      host.setAttribute(name, attribute.value);
    }
  }

  host.removeAttribute("native-composition");
  return host;
}
`;
}

function alertSyncSource() {
  return `import {
  alertElements,
  alertRoot,
  isAlertRootElement,
  syncAlertCompositionHost,
} from "./alert-dom";

type AlertSyncState = {
  controlledOpen: boolean;
  defaultOpenApplied: boolean;
};

const alertSyncStates = new WeakMap<Element, AlertSyncState>();
let alertId = 0;

function getAlertSyncState(root: Element) {
  let state = alertSyncStates.get(root);
  if (!state) {
    state = { controlledOpen: false, defaultOpenApplied: false };
    alertSyncStates.set(root, state);
  }
  return state;
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export function isAlertControlledOpen(root: Element) {
  return getAlertSyncState(root).controlledOpen;
}

export function syncAlertTreeAround(element: HTMLElement) {
  const root = element.matches("aria-alert") ? element : alertRoot(element);
  if (isAlertRootElement(root)) {
    root.syncAlertTreeFromRoot();
  }
}

export function syncAlertTreeFromRoot(root: HTMLElement) {
  const state = getAlertSyncState(root);

  if (!state.defaultOpenApplied) {
    state.controlledOpen = root.hasAttribute("open");
    state.defaultOpenApplied = true;

    if (!state.controlledOpen && !isFalseAttributeValue(root.getAttribute("default-open")) && !isFalseAttributeValue(root.getAttribute("defaultopen"))) {
      root.setAttribute("open", "");
    }
  }

  const titlePart = alertElements(root, "aria-alert-title")[0];
  const descriptionPart = alertElements(root, "aria-alert-description")[0];
  const title = titlePart ? syncAlertCompositionHost(titlePart) : null;
  const description = descriptionPart ? syncAlertCompositionHost(descriptionPart) : null;

  if (title) {
    if (!title.id) {
      title.id = "ariaui-alert-" + ++alertId + "-title";
    }
    if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
      title.setAttribute("aria-level", "5");
    }
    root.setAttribute("aria-labelledby", title.id);
  } else {
    root.removeAttribute("aria-labelledby");
  }

  if (description) {
    if (!description.id) {
      description.id = "ariaui-alert-" + ++alertId + "-description";
    }
    root.setAttribute("aria-describedby", description.id);
  } else {
    root.removeAttribute("aria-describedby");
  }

  for (const action of alertElements(root, "aria-alert-action")) {
    const actionHost = syncAlertCompositionHost(action);
    action.setAttribute("data-alert-action", "");
    actionHost.setAttribute("data-alert-action", "");
  }

  for (const close of alertElements(root, "aria-alert-close")) {
    const closeHost = syncAlertCompositionHost(close);
    close.setAttribute("data-alert-close", "");
    closeHost.setAttribute("data-alert-close", "");
  }

  for (const cancel of alertElements(root, "aria-alert-cancel")) {
    const cancelHost = syncAlertCompositionHost(cancel);
    cancel.setAttribute("data-alert-cancel", "");
    cancelHost.setAttribute("data-alert-cancel", "");
  }

  const isOpen = root.hasAttribute("open");
  root.hidden = !isOpen;
  root.setAttribute("aria-hidden", String(!isOpen));
  root.setAttribute("data-state", isOpen ? "open" : "closed");
  if (root.hasAttribute("dismissible")) {
    root.setAttribute("data-dismissible", "");
  } else {
    root.removeAttribute("data-dismissible");
  }

  const rootHost = syncAlertCompositionHost(root);
  if (rootHost !== root) {
    rootHost.hidden = !isOpen;
    rootHost.setAttribute("aria-hidden", String(!isOpen));
    rootHost.setAttribute("data-state", isOpen ? "open" : "closed");
    if (root.hasAttribute("dismissible")) {
      rootHost.setAttribute("data-dismissible", "");
    } else {
      rootHost.removeAttribute("data-dismissible");
    }
  }
}

export { setBooleanAttribute as setAlertBooleanAttribute };
`;
}

function alertActionsSource() {
  return `import {
  alertRoot,
} from "./alert-dom";
import {
  isAlertControlledOpen,
  setAlertBooleanAttribute,
} from "./alert-sync";

type AlertDismissRootElement = HTMLElement & {
  requestAlertDismiss: (source: Element) => boolean;
  syncAlertTreeFromRoot: () => void;
};

function isAlertDismissRootElement(element: Element | null): element is AlertDismissRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDismissRootElement>).requestAlertDismiss === "function"
    && typeof (element as Partial<AlertDismissRootElement>).syncAlertTreeFromRoot === "function";
}

export function requestAlertDismiss(root: HTMLElement, source: Element) {
  if (!root.hasAttribute("dismissible")) {
    return false;
  }

  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: {
      open: false,
      source,
    },
  }));

  if (isAlertControlledOpen(root)) {
    return true;
  }

  setAlertBooleanAttribute(root, "open", false);
  if (isAlertDismissRootElement(root)) {
    root.syncAlertTreeFromRoot();
  }
  return true;
}

export function requestAlertDismissFromPart(part: HTMLElement, event: MouseEvent) {
  const root = alertRoot(part);
  if (!isAlertDismissRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (!event.defaultPrevented) {
      root.requestAlertDismiss(part);
    }
  });
}
`;
}

function alertWebComponentSource() {
  return `import type { WebComponentPartSpec } from "${packageScope}/utils";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Close } from "./parts/Close";
import { Description } from "./parts/Description";
import { Root } from "./parts/Root";
import { Title } from "./parts/Title";

const alertPartConstructors = {
  Action,
  Cancel,
  Close,
  Description,
  Root,
  Title,
} as const;

export function createAlertWebComponent(part: WebComponentPartSpec) {
  const constructor = alertPartConstructors[part.name as keyof typeof alertPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/alert.");
  }

  return constructor;
}
`;
}

function alertPartSpecSource() {
  return `import { componentSpec, type ComponentPartName } from "../component-spec";

export function getAlertPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/alert.");
  }

  return partSpec;
}
`;
}

function alertPartSource(partName) {
  if (partName === "Root") {
    return `import { AlertElement } from "../alert-element";
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
`;
  }

  if (partName === "Close" || partName === "Cancel") {
    return `import { AlertElement } from "../alert-element";
import { requestAlertDismissFromPart } from "../alert-actions";
import { getAlertPartSpec } from "./part-spec";

const partSpec = getAlertPartSpec("${partName}");

export class ${partName} extends AlertElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDismissBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDismissEvents();
  }

  bindAlertDismissEvents() {
    if (this.#alertDismissBound) {
      return;
    }

    this.addEventListener("click", this.handleAlertDismissClick);
    this.#alertDismissBound = true;
  }

  handleAlertDismissClick = (event: MouseEvent) => {
    requestAlertDismissFromPart(this, event);
  };
}

export type ${partName}Element = InstanceType<typeof ${partName}>;
`;
  }

  return `import { AlertElement } from "../alert-element";
import { getAlertPartSpec } from "./part-spec";

const partSpec = getAlertPartSpec("${partName}");

export class ${partName} extends AlertElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ${partName}Element = InstanceType<typeof ${partName}>;
`;
}

function dialogElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import type { WebComponentPartSpec } from "${packageScope}/utils";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function canRestoreFocusTo(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected || element.hasAttribute("disabled")) {
    return false;
  }

  if ("disabled" in element && Boolean((element as HTMLButtonElement).disabled)) {
    return false;
  }

  return true;
}

let dialogId = 0;

export class DialogWebElement extends AriaWebElement {
  #dialogControlledOpen = false;
  #dialogDefaultOpenApplied = false;
  #dialogEventsBound = false;
  #dialogLastTrigger: HTMLElement | null = null;
  #dialogObserver: MutationObserver | null = null;
  #dialogSyncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "force-mount"]));
  }

  dialogPartName() {
    const constructor = this.constructor as typeof DialogWebElement;
    return constructor.partName;
  }

  dialogRoot() {
    return this.dialogPartName() === "Root" ? this : this.closest("aria-dialog");
  }

  dialogElements(root: Element, selector: string) {
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-dialog") === root);
  }

  dialogContent(root: Element) {
    return this.dialogElements(root, "aria-dialog-content")[0] ?? null;
  }

  dialogElementsInContent(content: Element, selector: string) {
    return Array.from(content.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-dialog-content") === content);
  }

  override afterAriaWebContractApplied() {
    this.bindDialogEvents();
    this.syncDialogTreeAroundSelf();
  }

  disconnectedCallback() {
    if (this.dialogPartName() === "Root") {
      this.#dialogObserver?.disconnect();
      this.#dialogObserver = null;
    }
  }

  bindDialogEvents() {
    if (this.#dialogEventsBound) {
      return;
    }

    const partName = this.dialogPartName();
    if (partName === "Root") {
      this.observeDialogTree();
    } else if (partName === "Trigger") {
      this.addEventListener("click", this.handleDialogTriggerClick);
    } else if (partName === "Action" || partName === "Cancel" || partName === "Close") {
      this.addEventListener("click", this.handleDialogCloseClick);
    } else if (partName === "Overlay") {
      this.addEventListener("click", this.handleDialogOverlayClick);
    } else if (partName === "Content") {
      this.addEventListener("keydown", this.handleDialogContentKeyDown);
    }

    this.#dialogEventsBound = true;
  }

  observeDialogTree() {
    if (this.#dialogObserver || typeof MutationObserver === "undefined") {
      return;
    }

    this.#dialogObserver = new MutationObserver(() => {
      if (!this.#dialogSyncing) {
        this.syncDialogTreeFromRoot();
      }
    });
    this.#dialogObserver.observe(this, { childList: true, subtree: true });
  }

  handleDialogTriggerClick = (event: MouseEvent) => {
    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (event.defaultPrevented || this.disabled) {
        return;
      }

      if (root.open) {
        root.requestDialogClose(this);
      } else {
        root.requestDialogOpen(this);
      }
    });
  };

  handleDialogCloseClick = (event: MouseEvent) => {
    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestDialogClose(this);
      }
    });
  };

  handleDialogOverlayClick = (event: MouseEvent) => {
    if (event.target !== this) {
      return;
    }

    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestDialogClose(this);
      }
    });
  };

  handleDialogContentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab" && this.getAttribute("role") === "dialog") {
      this.trapDialogFocus(event);
      return;
    }

    if (event.key !== "Escape") {
      return;
    }

    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (event.defaultPrevented) {
        return;
      }

      const escapeEvent = new CustomEvent("escapekeydown", {
        bubbles: true,
        cancelable: true,
        detail: {
          originalEvent: event,
        },
      });
      this.dispatchEvent(escapeEvent);

      if (escapeEvent.defaultPrevented) {
        return;
      }

      event.preventDefault();
      root.requestDialogClose(this);
    });
  };

  trapDialogFocus(event: KeyboardEvent) {
    const focusableElements = this.dialogFocusableElements(this);
    if (focusableElements.length === 0) {
      return;
    }

    const activeElement = this.ownerDocument.activeElement as HTMLElement | null;
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
      : (currentIndex === -1 || currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);

    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }

  dialogFocusableElements(container: Element) {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        "aria-dialog-cancel, aria-dialog-action, aria-dialog-close, button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => {
      return !element.hidden && !element.hasAttribute("disabled") && (!(element as HTMLButtonElement).disabled);
    });
  }

  syncDialogTreeAroundSelf() {
    const root = this.dialogRoot();
    if (root instanceof DialogWebElement) {
      root.syncDialogTreeFromRoot();
    }
  }

  syncDialogTreeFromRoot() {
    if (this.dialogPartName() !== "Root" || this.#dialogSyncing || !this.isConnected) {
      return;
    }

    this.#dialogSyncing = true;
    try {
      const root = this;
      let shouldFocusDefaultOpen = false;
      if (!this.#dialogDefaultOpenApplied) {
        this.#dialogControlledOpen = root.hasAttribute("open");
        this.#dialogDefaultOpenApplied = true;

        const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
        if (!this.#dialogControlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
          root.setAttribute("open", "");
          shouldFocusDefaultOpen = true;
        }
      }

      if (!root.id) {
        root.id = "ariaui-dialog-" + ++dialogId + "-root";
      }

      const isOpen = root.hasAttribute("open");
      const state = isOpen ? "open" : "closed";
      root.setAttribute("data-state", state);
      root.removeAttribute("aria-expanded");

      const content = this.dialogContent(root);
      const triggers = this.dialogElements(root, "aria-dialog-trigger");
      const overlays = this.dialogElements(root, "aria-dialog-overlay");
      const portals = this.dialogElements(root, "aria-dialog-portal");
      const actions = this.dialogElements(root, "aria-dialog-action");
      const cancels = this.dialogElements(root, "aria-dialog-cancel");
      const closes = this.dialogElements(root, "aria-dialog-close");

      if (content && !content.id) {
        content.id = "ariaui-dialog-" + ++dialogId + "-content";
      }

      for (const trigger of triggers) {
        setBooleanAttribute(trigger, "open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("data-state", state);
        if (content && isOpen) {
          trigger.setAttribute("aria-controls", content.id);
        } else {
          trigger.removeAttribute("aria-controls");
        }
      }

      for (const action of actions) {
        action.setAttribute("data-dialog-action", "");
        if (!action.hasAttribute("type")) {
          action.setAttribute("type", "button");
        }
      }

      for (const cancel of cancels) {
        cancel.setAttribute("data-dialog-cancel", "");
        if (!cancel.hasAttribute("type")) {
          cancel.setAttribute("type", "button");
        }
      }

      for (const close of closes) {
        if (!close.hasAttribute("type")) {
          close.setAttribute("type", "button");
        }
      }

      if (content) {
        this.syncDialogContent(content, isOpen, state);
      }

      for (const overlay of overlays) {
        overlay.setAttribute("data-state", state);
        overlay.hidden = !isOpen && !overlay.hasAttribute("force-mount");
      }

      for (const portal of portals) {
        portal.setAttribute("data-state", state);
        portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
      }

      if (shouldFocusDefaultOpen) {
        queueMicrotask(() => {
          if (this.isConnected && this.hasAttribute("open")) {
            this.focusInitialDialogTarget();
          }
        });
      }
    } finally {
      this.#dialogSyncing = false;
    }
  }

  syncDialogContent(content: HTMLElement, isOpen: boolean, state: string) {
    content.removeAttribute("open");
    content.setAttribute("data-dialog-content", "");

    const titles = this.dialogElementsInContent(content, "aria-dialog-title");
    const descriptions = this.dialogElementsInContent(content, "aria-dialog-description");

    for (const title of titles) {
      if (!title.id) {
        title.id = "ariaui-dialog-" + ++dialogId + "-title";
      }
      if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
        title.setAttribute("aria-level", "2");
      }
    }

    for (const description of descriptions) {
      if (!description.id) {
        description.id = "ariaui-dialog-" + ++dialogId + "-description";
      }
    }

    if (isOpen) {
      content.setAttribute("role", "dialog");
      content.setAttribute("aria-modal", "true");
      content.setAttribute("tabindex", "-1");
      content.removeAttribute("aria-hidden");

      if (titles.length > 0) {
        content.setAttribute("aria-labelledby", titles.map((title) => title.id).join(" "));
      } else {
        content.removeAttribute("aria-labelledby");
      }

      if (descriptions.length > 0) {
        content.setAttribute("aria-describedby", descriptions.map((description) => description.id).join(" "));
      } else {
        content.removeAttribute("aria-describedby");
      }
    } else {
      content.removeAttribute("role");
      content.removeAttribute("aria-modal");
      content.removeAttribute("tabindex");
      content.removeAttribute("aria-labelledby");
      content.removeAttribute("aria-describedby");
      content.setAttribute("aria-hidden", "true");
    }

    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    content.setAttribute("data-state", state);
  }

  requestDialogOpen(source: Element) {
    this.#dialogLastTrigger = source instanceof HTMLElement ? source : null;
    this.dispatchDialogOpenChange(true, source);

    if (this.#dialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", true);
    this.syncDialogTreeFromRoot();
    this.focusInitialDialogTarget();
    return true;
  }

  requestDialogClose(source: Element = this) {
    const content = this.dialogContent(this);
    this.dispatchDialogOpenChange(false, source);

    if (this.#dialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", false);
    this.syncDialogTreeFromRoot();
    this.restoreDialogFocus(content);
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, detail: { source } }));
    return true;
  }

  dispatchDialogOpenChange(open: boolean, source: Element) {
    const detail = { open, source };
    this.dispatchEvent(new CustomEvent("openchange", { bubbles: true, detail }));
    this.dispatchEvent(new CustomEvent("dialog-open-change", { bubbles: true, detail }));
  }

  focusInitialDialogTarget() {
    const content = this.dialogContent(this);
    if (!content) {
      return;
    }

    const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }

    const target = this.dialogElementsInContent(content, "aria-dialog-cancel")[0]
      ?? this.dialogFocusableElements(content)[0]
      ?? content;
    target.focus({ preventScroll: true });
  }

  restoreDialogFocus(content: HTMLElement | null) {
    if (content) {
      const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
      content.dispatchEvent(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    const trigger = this.#dialogLastTrigger ?? this.dialogElements(this, "aria-dialog-trigger")[0] ?? null;
    if (canRestoreFocusTo(trigger)) {
      trigger.focus({ preventScroll: true });
      return;
    }

    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
    }
    document.body.focus({ preventScroll: true });
  }
}

export function createDialogWebComponent(part: WebComponentPartSpec): typeof DialogWebElement {
  return class extends DialogWebElement {
    static override packageSlug = "dialog";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function alertDialogElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import { syncAlertDialogTreeAround } from "./alert-dialog-sync";

export class AlertDialogElement extends AriaWebElement {
  static override packageSlug = "alert-dialog";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "force-mount"]));
  }

  override afterAriaWebContractApplied() {
    syncAlertDialogTreeAround(this);
  }
}
`;
}

function alertDialogDomSource() {
  return `export type AlertDialogRootElement = HTMLElement & {
  syncAlertDialogTreeFromRoot: () => void;
};

export function isAlertDialogRootElement(element: Element | null): element is AlertDialogRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDialogRootElement>).syncAlertDialogTreeFromRoot === "function";
}

export function alertDialogRoot(element: Element) {
  return element.closest("aria-alert-dialog");
}

export function alertDialogElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog") === root);
}

export function alertDialogContent(root: Element) {
  return alertDialogElements(root, "aria-alert-dialog-content")[0] ?? null;
}

export function alertDialogElementsInContent(content: Element, selector: string) {
  return Array.from(content.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog-content") === content);
}
`;
}

function alertDialogSyncSource() {
  return `import {
  alertDialogContent,
  alertDialogElements,
  alertDialogElementsInContent,
  alertDialogRoot,
  isAlertDialogRootElement,
} from "./alert-dialog-dom";

type AlertDialogSyncState = {
  controlledOpen: boolean;
  defaultOpenApplied: boolean;
  inertedElements: Set<HTMLElement>;
  scrollLocked: boolean;
};

type AlertDialogFocusRootElement = HTMLElement & {
  focusInitialAlertDialogTarget: () => void;
};

const alertDialogSyncStates = new WeakMap<Element, AlertDialogSyncState>();
const inertCounts = new WeakMap<HTMLElement, number>();
let alertDialogId = 0;
let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

function getAlertDialogSyncState(root: Element) {
  let state = alertDialogSyncStates.get(root);
  if (!state) {
    state = {
      controlledOpen: false,
      defaultOpenApplied: false,
      inertedElements: new Set<HTMLElement>(),
      scrollLocked: false,
    };
    alertDialogSyncStates.set(root, state);
  }
  return state;
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function isAlertDialogFocusRootElement(element: Element | null): element is AlertDialogFocusRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDialogFocusRootElement>).focusInitialAlertDialogTarget === "function";
}

function preventBackgroundWheel(event: WheelEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest("aria-alert-dialog-content[role='alertdialog']")) {
    return;
  }

  event.preventDefault();
}

function lockViewportScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.addEventListener("wheel", preventBackgroundWheel, { passive: false });
  }

  scrollLockCount += 1;
}

function unlockViewportScroll() {
  if (scrollLockCount <= 0) {
    scrollLockCount = 0;
    return;
  }

  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
    document.body.removeEventListener("wheel", preventBackgroundWheel);
  }
}

export function isAlertDialogControlledOpen(root: Element) {
  return getAlertDialogSyncState(root).controlledOpen;
}

export function syncAlertDialogTreeAround(element: HTMLElement) {
  const root = element.matches("aria-alert-dialog") ? element : alertDialogRoot(element);
  if (isAlertDialogRootElement(root)) {
    root.syncAlertDialogTreeFromRoot();
  }
}

export function syncAlertDialogTreeFromRoot(root: HTMLElement) {
  const syncState = getAlertDialogSyncState(root);
  let shouldFocusDefaultOpen = false;

  if (!syncState.defaultOpenApplied) {
    syncState.controlledOpen = root.hasAttribute("open");
    syncState.defaultOpenApplied = true;

    const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
    if (!syncState.controlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
      root.setAttribute("open", "");
      shouldFocusDefaultOpen = true;
    }
  }

  const isOpen = root.hasAttribute("open");
  const state = isOpen ? "open" : "closed";
  root.setAttribute("data-state", state);

  const content = alertDialogContent(root);
  const triggers = alertDialogElements(root, "aria-alert-dialog-trigger");
  const overlays = alertDialogElements(root, "aria-alert-dialog-overlay");
  const portals = alertDialogElements(root, "aria-alert-dialog-portal");
  const icons = alertDialogElements(root, "aria-alert-dialog-icon");
  const cancels = alertDialogElements(root, "aria-alert-dialog-cancel");

  if (content && !content.id) {
    content.id = "ariaui-alert-dialog-" + ++alertDialogId + "-content";
  }

  for (const trigger of triggers) {
    setBooleanAttribute(trigger, "open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("data-state", state);
  }

  for (const icon of icons) {
    icon.setAttribute("aria-hidden", "true");
  }

  for (const cancel of cancels) {
    cancel.setAttribute("data-alert-dialog-cancel", "");
  }

  if (content) {
    syncAlertDialogContent(content, isOpen, state);
  }

  for (const overlay of overlays) {
    overlay.setAttribute("data-state", state);
    overlay.hidden = !isOpen && !overlay.hasAttribute("force-mount");
  }

  for (const portal of portals) {
    portal.setAttribute("data-state", state);
    portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
  }

  if (isOpen) {
    claimAlertDialogModalEffects(root);
  } else {
    releaseAlertDialogModalEffects(root);
  }

  if (shouldFocusDefaultOpen) {
    queueMicrotask(() => {
      if (isAlertDialogFocusRootElement(root) && root.isConnected && root.hasAttribute("open")) {
        root.focusInitialAlertDialogTarget();
      }
    });
  }
}

export function syncAlertDialogContent(content: HTMLElement, isOpen: boolean, state: string) {
  content.setAttribute("data-alert-dialog-content", "");

  const titles = alertDialogElementsInContent(content, "aria-alert-dialog-title");
  const descriptions = alertDialogElementsInContent(content, "aria-alert-dialog-description");

  for (const title of titles) {
    if (!title.id) {
      title.id = "ariaui-alert-dialog-" + ++alertDialogId + "-title";
    }
    if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
      title.setAttribute("aria-level", "2");
    }
  }

  for (const description of descriptions) {
    if (!description.id) {
      description.id = "ariaui-alert-dialog-" + ++alertDialogId + "-description";
    }
  }

  if (isOpen) {
    content.setAttribute("role", "alertdialog");
    content.setAttribute("aria-modal", "true");
    content.setAttribute("tabindex", "-1");
    content.removeAttribute("aria-hidden");

    if (titles.length > 0) {
      content.setAttribute("aria-labelledby", titles.map((title) => title.id).join(" "));
    } else {
      content.removeAttribute("aria-labelledby");
    }

    if (descriptions.length > 0) {
      content.setAttribute("aria-describedby", descriptions.map((description) => description.id).join(" "));
    } else {
      content.removeAttribute("aria-describedby");
    }
  } else {
    content.removeAttribute("role");
    content.removeAttribute("aria-modal");
    content.removeAttribute("tabindex");
    content.removeAttribute("aria-labelledby");
    content.removeAttribute("aria-describedby");
    content.setAttribute("aria-hidden", "true");
  }

  content.hidden = !isOpen;
  content.setAttribute("data-state", state);
}

export function claimAlertDialogModalEffects(root: HTMLElement) {
  const syncState = getAlertDialogSyncState(root);
  if (syncState.scrollLocked) {
    return;
  }

  const parent = root.parentElement;
  if (parent) {
    for (const sibling of Array.from(parent.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === root || sibling.matches("aria-alert-dialog")) {
        continue;
      }

      const count = inertCounts.get(sibling) ?? 0;
      inertCounts.set(sibling, count + 1);
      sibling.setAttribute("inert", "");
      syncState.inertedElements.add(sibling);
    }
  }

  lockViewportScroll();
  syncState.scrollLocked = true;
}

export function releaseAlertDialogModalEffects(root: HTMLElement) {
  const syncState = getAlertDialogSyncState(root);
  for (const element of syncState.inertedElements) {
    const count = (inertCounts.get(element) ?? 1) - 1;
    if (count <= 0) {
      inertCounts.delete(element);
      element.removeAttribute("inert");
    } else {
      inertCounts.set(element, count);
    }
  }
  syncState.inertedElements.clear();

  if (syncState.scrollLocked) {
    unlockViewportScroll();
    syncState.scrollLocked = false;
  }
}

export { setBooleanAttribute as setAlertDialogBooleanAttribute };
`;
}

function alertDialogActionsSource() {
  return `import {
  alertDialogContent,
  alertDialogElements,
  alertDialogElementsInContent,
  alertDialogRoot,
} from "./alert-dialog-dom";
import {
  isAlertDialogControlledOpen,
  setAlertDialogBooleanAttribute,
} from "./alert-dialog-sync";

type AlertDialogActionState = {
  lastTrigger: HTMLElement | null;
};

type AlertDialogActionRootElement = HTMLElement & {
  syncAlertDialogTreeFromRoot: () => void;
  requestAlertDialogOpen: (source: Element) => boolean;
  requestAlertDialogClose: (source?: Element) => boolean;
  focusInitialAlertDialogTarget: () => void;
  restoreAlertDialogFocus: (content: HTMLElement | null) => void;
};

const alertDialogActionStates = new WeakMap<Element, AlertDialogActionState>();

function getAlertDialogActionState(root: Element) {
  let state = alertDialogActionStates.get(root);
  if (!state) {
    state = { lastTrigger: null };
    alertDialogActionStates.set(root, state);
  }
  return state;
}

function canRestoreFocusTo(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected || element.hasAttribute("disabled")) {
    return false;
  }

  if ("disabled" in element && Boolean((element as HTMLButtonElement).disabled)) {
    return false;
  }

  return true;
}

function isAlertDialogActionRootElement(element: Element | null): element is AlertDialogActionRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDialogActionRootElement>).syncAlertDialogTreeFromRoot === "function"
    && typeof (element as Partial<AlertDialogActionRootElement>).requestAlertDialogOpen === "function"
    && typeof (element as Partial<AlertDialogActionRootElement>).requestAlertDialogClose === "function";
}

export function alertDialogFocusableElements(container: Element) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      "aria-alert-dialog-cancel, aria-alert-dialog-action, button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    ),
  ).filter((element) => {
    return !element.hidden && !element.hasAttribute("disabled") && (!(element as HTMLButtonElement).disabled);
  });
}

export function trapAlertDialogFocus(content: HTMLElement, event: KeyboardEvent) {
  const focusableElements = alertDialogFocusableElements(content);
  if (focusableElements.length === 0) {
    return;
  }

  const activeElement = content.ownerDocument.activeElement as HTMLElement | null;
  const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
  const nextIndex = event.shiftKey
    ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
    : (currentIndex === -1 || currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);

  event.preventDefault();
  focusableElements[nextIndex]?.focus();
}

export function requestAlertDialogOpen(root: HTMLElement, source: Element) {
  getAlertDialogActionState(root).lastTrigger = source instanceof HTMLElement ? source : null;
  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: {
      open: true,
      source,
    },
  }));

  if (isAlertDialogControlledOpen(root)) {
    return true;
  }

  setAlertDialogBooleanAttribute(root, "open", true);
  if (isAlertDialogActionRootElement(root)) {
    root.syncAlertDialogTreeFromRoot();
    root.focusInitialAlertDialogTarget();
  }
  return true;
}

export function requestAlertDialogClose(root: HTMLElement, source: Element = root) {
  const content = alertDialogContent(root);
  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: {
      open: false,
      source,
    },
  }));

  if (isAlertDialogControlledOpen(root)) {
    return true;
  }

  setAlertDialogBooleanAttribute(root, "open", false);
  if (isAlertDialogActionRootElement(root)) {
    root.syncAlertDialogTreeFromRoot();
    root.restoreAlertDialogFocus(content);
  }
  return true;
}

export function focusInitialAlertDialogTarget(root: HTMLElement) {
  const content = alertDialogContent(root);
  if (!content) {
    return;
  }

  const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
  content.dispatchEvent(event);
  if (event.defaultPrevented) {
    return;
  }

  const target = alertDialogElementsInContent(content, "aria-alert-dialog-cancel")[0]
    ?? alertDialogFocusableElements(content)[0]
    ?? content;
  target.focus({ preventScroll: true });
}

export function restoreAlertDialogFocus(root: HTMLElement, content: HTMLElement | null) {
  if (content) {
    const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }
  }

  const trigger = getAlertDialogActionState(root).lastTrigger ?? alertDialogElements(root, "aria-alert-dialog-trigger")[0] ?? null;
  if (canRestoreFocusTo(trigger)) {
    trigger.focus({ preventScroll: true });
    return;
  }

  if (!document.body.hasAttribute("tabindex")) {
    document.body.setAttribute("tabindex", "-1");
  }
  document.body.focus({ preventScroll: true });
}

export function requestAlertDialogOpenFromPart(part: HTMLElement, event: MouseEvent) {
  const root = alertDialogRoot(part);
  if (!isAlertDialogActionRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (!event.defaultPrevented) {
      root.requestAlertDialogOpen(part);
    }
  });
}

export function requestAlertDialogCloseFromPart(part: HTMLElement, event: MouseEvent) {
  const root = alertDialogRoot(part);
  if (!isAlertDialogActionRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (!event.defaultPrevented) {
      root.requestAlertDialogClose(part);
    }
  });
}

export function handleAlertDialogContentKeyDown(content: HTMLElement, event: KeyboardEvent) {
  if (event.key === "Tab" && content.getAttribute("role") === "alertdialog") {
    trapAlertDialogFocus(content, event);
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  const root = alertDialogRoot(content);
  if (!isAlertDialogActionRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (event.defaultPrevented) {
      return;
    }

    const escapeEvent = new CustomEvent("escapekeydown", {
      bubbles: true,
      cancelable: true,
      detail: {
        originalEvent: event,
      },
    });
    content.dispatchEvent(escapeEvent);

    if (escapeEvent.defaultPrevented) {
      return;
    }

    event.preventDefault();
    root.requestAlertDialogClose(content);
  });
}
`;
}

function alertDialogWebComponentSource() {
  return `import type { WebComponentPartSpec } from "${packageScope}/utils";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Icon } from "./parts/Icon";
import { Overlay } from "./parts/Overlay";
import { Portal } from "./parts/Portal";
import { Root } from "./parts/Root";
import { Title } from "./parts/Title";
import { Trigger } from "./parts/Trigger";

const alertDialogPartConstructors = {
  Action,
  Cancel,
  Content,
  Description,
  Icon,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} as const;

export function createAlertDialogWebComponent(part: WebComponentPartSpec) {
  const constructor = alertDialogPartConstructors[part.name as keyof typeof alertDialogPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/alert-dialog.");
  }

  return constructor;
}
`;
}

function alertDialogPartSpecSource() {
  return `import { componentSpec, type ComponentPartName } from "../component-spec";

export function getAlertDialogPartSpec(partName: ComponentPartName) {
  const partSpec = componentSpec.parts.find((candidate) => candidate.name === partName);

  if (!partSpec) {
    throw new Error("Missing " + partName + " part spec for @ariaui-web/alert-dialog.");
  }

  return partSpec;
}
`;
}

function alertDialogPartSource(partName) {
  if (partName === "Root") {
    return `import { AlertDialogElement } from "../alert-dialog-element";
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
`;
  }

  if (partName === "Trigger") {
    return `import { AlertDialogElement } from "../alert-dialog-element";
import { requestAlertDialogOpenFromPart } from "../alert-dialog-actions";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Trigger");

export class Trigger extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogTriggerBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDialogTriggerEvents();
  }

  bindAlertDialogTriggerEvents() {
    if (this.#alertDialogTriggerBound) {
      return;
    }

    this.addEventListener("click", this.handleAlertDialogTriggerClick);
    this.#alertDialogTriggerBound = true;
  }

  handleAlertDialogTriggerClick = (event: MouseEvent) => {
    requestAlertDialogOpenFromPart(this, event);
  };
}

export type TriggerElement = InstanceType<typeof Trigger>;
`;
  }

  if (partName === "Action" || partName === "Cancel") {
    return `import { AlertDialogElement } from "../alert-dialog-element";
import { requestAlertDialogCloseFromPart } from "../alert-dialog-actions";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("${partName}");

export class ${partName} extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogCloseBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDialogCloseEvents();
  }

  bindAlertDialogCloseEvents() {
    if (this.#alertDialogCloseBound) {
      return;
    }

    this.addEventListener("click", this.handleAlertDialogCloseClick);
    this.#alertDialogCloseBound = true;
  }

  handleAlertDialogCloseClick = (event: MouseEvent) => {
    requestAlertDialogCloseFromPart(this, event);
  };
}

export type ${partName}Element = InstanceType<typeof ${partName}>;
`;
  }

  if (partName === "Content") {
    return `import { AlertDialogElement } from "../alert-dialog-element";
import { handleAlertDialogContentKeyDown } from "../alert-dialog-actions";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Content");

export class Content extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogContentBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDialogContentEvents();
  }

  bindAlertDialogContentEvents() {
    if (this.#alertDialogContentBound) {
      return;
    }

    this.addEventListener("keydown", this.handleAlertDialogContentKeyDown);
    this.#alertDialogContentBound = true;
  }

  handleAlertDialogContentKeyDown = (event: KeyboardEvent) => {
    handleAlertDialogContentKeyDown(this, event);
  };
}

export type ContentElement = InstanceType<typeof Content>;
`;
  }

  return `import { AlertDialogElement } from "../alert-dialog-element";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("${partName}");

export class ${partName} extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ${partName}Element = InstanceType<typeof ${partName}>;
`;
}

function alertDialogLegacyElementSource() {
  return `import { AriaWebElement } from "${packageScope}/utils";
import type { WebComponentPartSpec } from "${packageScope}/utils";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function canRestoreFocusTo(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected || element.hasAttribute("disabled")) {
    return false;
  }

  if ("disabled" in element && Boolean((element as HTMLButtonElement).disabled)) {
    return false;
  }

  return true;
}

const inertCounts = new WeakMap<HTMLElement, number>();
let alertDialogId = 0;
let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

function preventBackgroundWheel(event: WheelEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest("aria-alert-dialog-content[role='alertdialog']")) {
    return;
  }

  event.preventDefault();
}

function lockViewportScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.addEventListener("wheel", preventBackgroundWheel, { passive: false });
  }

  scrollLockCount += 1;
}

function unlockViewportScroll() {
  if (scrollLockCount <= 0) {
    scrollLockCount = 0;
    return;
  }

  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
    document.body.removeEventListener("wheel", preventBackgroundWheel);
  }
}

export class AlertDialogWebElement extends AriaWebElement {
  #alertDialogControlledOpen = false;
  #alertDialogDefaultOpenApplied = false;
  #alertDialogEventsBound = false;
  #alertDialogInertedElements = new Set<HTMLElement>();
  #alertDialogLastTrigger: HTMLElement | null = null;
  #alertDialogObserver: MutationObserver | null = null;
  #alertDialogScrollLocked = false;
  #alertDialogSyncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "force-mount"]));
  }

  alertDialogPartName() {
    const constructor = this.constructor as typeof AlertDialogWebElement;
    return constructor.partName;
  }

  alertDialogRoot() {
    return this.alertDialogPartName() === "Root" ? this : this.closest("aria-alert-dialog");
  }

  alertDialogElements(root: Element, selector: string) {
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog") === root);
  }

  alertDialogContent(root: Element) {
    return this.alertDialogElements(root, "aria-alert-dialog-content")[0] ?? null;
  }

  alertDialogElementsInContent(content: Element, selector: string) {
    return Array.from(content.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog-content") === content);
  }

  override afterAriaWebContractApplied() {
    this.bindAlertDialogEvents();
    this.syncAlertDialogTreeAroundSelf();
  }

  disconnectedCallback() {
    if (this.alertDialogPartName() === "Root") {
      this.releaseAlertDialogModalEffects();
      this.#alertDialogObserver?.disconnect();
      this.#alertDialogObserver = null;
    }
  }

  bindAlertDialogEvents() {
    if (this.#alertDialogEventsBound) {
      return;
    }

    const partName = this.alertDialogPartName();
    if (partName === "Root") {
      this.observeAlertDialogTree();
    } else if (partName === "Trigger") {
      this.addEventListener("click", this.handleAlertDialogTriggerClick);
    } else if (partName === "Action" || partName === "Cancel") {
      this.addEventListener("click", this.handleAlertDialogCloseClick);
    } else if (partName === "Content") {
      this.addEventListener("keydown", this.handleAlertDialogContentKeyDown);
    }

    this.#alertDialogEventsBound = true;
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

  handleAlertDialogTriggerClick = (event: MouseEvent) => {
    const root = this.alertDialogRoot();
    if (!(root instanceof AlertDialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestAlertDialogOpen(this);
      }
    });
  };

  handleAlertDialogCloseClick = (event: MouseEvent) => {
    const root = this.alertDialogRoot();
    if (!(root instanceof AlertDialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestAlertDialogClose(this);
      }
    });
  };

  handleAlertDialogContentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab" && this.getAttribute("role") === "alertdialog") {
      this.trapAlertDialogFocus(event);
      return;
    }

    if (event.key !== "Escape") {
      return;
    }

    const root = this.alertDialogRoot();
    if (!(root instanceof AlertDialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (event.defaultPrevented) {
        return;
      }

      const escapeEvent = new CustomEvent("escapekeydown", {
        bubbles: true,
        cancelable: true,
        detail: {
          originalEvent: event,
        },
      });
      this.dispatchEvent(escapeEvent);

      if (escapeEvent.defaultPrevented) {
        return;
      }

      event.preventDefault();
      root.requestAlertDialogClose(this);
    });
  };

  trapAlertDialogFocus(event: KeyboardEvent) {
    const focusableElements = this.alertDialogFocusableElements(this);
    if (focusableElements.length === 0) {
      return;
    }

    const activeElement = this.ownerDocument.activeElement as HTMLElement | null;
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
      : (currentIndex === -1 || currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);

    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }

  alertDialogFocusableElements(container: Element) {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        "aria-alert-dialog-cancel, aria-alert-dialog-action, button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => {
      return !element.hidden && !element.hasAttribute("disabled") && (!(element as HTMLButtonElement).disabled);
    });
  }

  syncAlertDialogTreeAroundSelf() {
    const root = this.alertDialogRoot();
    if (root instanceof AlertDialogWebElement) {
      root.syncAlertDialogTreeFromRoot();
    }
  }

  syncAlertDialogTreeFromRoot() {
    if (this.alertDialogPartName() !== "Root" || this.#alertDialogSyncing || !this.isConnected) {
      return;
    }

    this.#alertDialogSyncing = true;
    try {
      const root = this;
      let shouldFocusDefaultOpen = false;
      if (!this.#alertDialogDefaultOpenApplied) {
        this.#alertDialogControlledOpen = root.hasAttribute("open");
        this.#alertDialogDefaultOpenApplied = true;

        const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
        if (!this.#alertDialogControlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
          root.setAttribute("open", "");
          shouldFocusDefaultOpen = true;
        }
      }

      const isOpen = root.hasAttribute("open");
      const state = isOpen ? "open" : "closed";
      root.setAttribute("data-state", state);

      const content = this.alertDialogContent(root);
      const triggers = this.alertDialogElements(root, "aria-alert-dialog-trigger");
      const overlays = this.alertDialogElements(root, "aria-alert-dialog-overlay");
      const portals = this.alertDialogElements(root, "aria-alert-dialog-portal");
      const icons = this.alertDialogElements(root, "aria-alert-dialog-icon");
      const cancels = this.alertDialogElements(root, "aria-alert-dialog-cancel");

      if (content && !content.id) {
        content.id = "ariaui-alert-dialog-" + ++alertDialogId + "-content";
      }

      for (const trigger of triggers) {
        setBooleanAttribute(trigger, "open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        trigger.setAttribute("data-state", state);
      }

      for (const icon of icons) {
        icon.setAttribute("aria-hidden", "true");
      }

      for (const cancel of cancels) {
        cancel.setAttribute("data-alert-dialog-cancel", "");
      }

      if (content) {
        this.syncAlertDialogContent(root, content, isOpen, state);
      }

      for (const overlay of overlays) {
        overlay.setAttribute("data-state", state);
        overlay.hidden = !isOpen && !overlay.hasAttribute("force-mount");
      }

      for (const portal of portals) {
        portal.setAttribute("data-state", state);
        portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
      }

      if (isOpen) {
        this.claimAlertDialogModalEffects();
      } else {
        this.releaseAlertDialogModalEffects();
      }

      if (shouldFocusDefaultOpen) {
        queueMicrotask(() => {
          if (this.isConnected && this.hasAttribute("open")) {
            this.focusInitialAlertDialogTarget();
          }
        });
      }
    } finally {
      this.#alertDialogSyncing = false;
    }
  }

  syncAlertDialogContent(root: Element, content: HTMLElement, isOpen: boolean, state: string) {
    content.setAttribute("data-alert-dialog-content", "");

    const titles = this.alertDialogElementsInContent(content, "aria-alert-dialog-title");
    const descriptions = this.alertDialogElementsInContent(content, "aria-alert-dialog-description");

    for (const title of titles) {
      if (!title.id) {
        title.id = "ariaui-alert-dialog-" + ++alertDialogId + "-title";
      }
      if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
        title.setAttribute("aria-level", "2");
      }
    }

    for (const description of descriptions) {
      if (!description.id) {
        description.id = "ariaui-alert-dialog-" + ++alertDialogId + "-description";
      }
    }

    if (isOpen) {
      content.setAttribute("role", "alertdialog");
      content.setAttribute("aria-modal", "true");
      content.setAttribute("tabindex", "-1");
      content.removeAttribute("aria-hidden");

      if (titles.length > 0) {
        content.setAttribute("aria-labelledby", titles.map((title) => title.id).join(" "));
      } else {
        content.removeAttribute("aria-labelledby");
      }

      if (descriptions.length > 0) {
        content.setAttribute("aria-describedby", descriptions.map((description) => description.id).join(" "));
      } else {
        content.removeAttribute("aria-describedby");
      }
    } else {
      content.removeAttribute("role");
      content.removeAttribute("aria-modal");
      content.removeAttribute("tabindex");
      content.removeAttribute("aria-labelledby");
      content.removeAttribute("aria-describedby");
      content.setAttribute("aria-hidden", "true");
    }

    content.hidden = !isOpen;
    content.setAttribute("data-state", state);
  }

  requestAlertDialogOpen(source: Element) {
    this.#alertDialogLastTrigger = source instanceof HTMLElement ? source : null;
    this.dispatchEvent(new CustomEvent("openchange", {
      bubbles: true,
      detail: {
        open: true,
        source,
      },
    }));

    if (this.#alertDialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", true);
    this.syncAlertDialogTreeFromRoot();
    this.focusInitialAlertDialogTarget();
    return true;
  }

  requestAlertDialogClose(source: Element) {
    const content = this.alertDialogContent(this);
    this.dispatchEvent(new CustomEvent("openchange", {
      bubbles: true,
      detail: {
        open: false,
        source,
      },
    }));

    if (this.#alertDialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", false);
    this.syncAlertDialogTreeFromRoot();
    this.restoreAlertDialogFocus(content);
    return true;
  }

  focusInitialAlertDialogTarget() {
    const content = this.alertDialogContent(this);
    if (!content) {
      return;
    }

    const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }

    const target = this.alertDialogElementsInContent(content, "aria-alert-dialog-cancel")[0]
      ?? this.alertDialogFocusableElements(content)[0]
      ?? content;
    target.focus({ preventScroll: true });
  }

  restoreAlertDialogFocus(content: HTMLElement | null) {
    if (content) {
      const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
      content.dispatchEvent(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    const trigger = this.#alertDialogLastTrigger ?? this.alertDialogElements(this, "aria-alert-dialog-trigger")[0] ?? null;
    if (canRestoreFocusTo(trigger)) {
      trigger.focus({ preventScroll: true });
      return;
    }

    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
    }
    document.body.focus({ preventScroll: true });
  }

  claimAlertDialogModalEffects() {
    if (this.#alertDialogScrollLocked) {
      return;
    }

    const parent = this.parentElement;
    if (parent) {
      for (const sibling of Array.from(parent.children)) {
        if (!(sibling instanceof HTMLElement) || sibling === this || sibling.matches("aria-alert-dialog")) {
          continue;
        }

        const count = inertCounts.get(sibling) ?? 0;
        inertCounts.set(sibling, count + 1);
        sibling.setAttribute("inert", "");
        this.#alertDialogInertedElements.add(sibling);
      }
    }

    lockViewportScroll();
    this.#alertDialogScrollLocked = true;
  }

  releaseAlertDialogModalEffects() {
    for (const element of this.#alertDialogInertedElements) {
      const count = (inertCounts.get(element) ?? 1) - 1;
      if (count <= 0) {
        inertCounts.delete(element);
        element.removeAttribute("inert");
      } else {
        inertCounts.set(element, count);
      }
    }
    this.#alertDialogInertedElements.clear();

    if (this.#alertDialogScrollLocked) {
      unlockViewportScroll();
      this.#alertDialogScrollLocked = false;
    }
  }
}

export function createAlertDialogWebComponent(part: WebComponentPartSpec): typeof AlertDialogWebElement {
  return class extends AlertDialogWebElement {
    static override packageSlug = "alert-dialog";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
`;
}

function componentTestSource(spec) {
  const defineFunctionName = `define${pascalCase(spec.slug)}Elements`;
  const createFunctionName = `create${pascalCase(spec.slug)}Element`;
  const defaultPartName = spec.parts[0]?.name || "Root";
  const vitestImports = spec.slug === "accordion" || spec.slug === "alert" || spec.slug === "avatar" || spec.slug === "badge" || spec.slug === "dialog" || spec.slug === "alert-dialog" ? "afterEach, describe, expect, it, vi" : "afterEach, describe, expect, it";
  const sourceRuntimeImports = spec.slug === "aspect-ratio" ? ", resolveAspectRatio" : "";
  const runtimeRatioProperty = spec.slug === "aspect-ratio" ? "\n  ratio: string;" : "";
  const accordionDocsExampleTest =
    spec.slug === "accordion"
      ? `

  function dispatchAccordionKey(element: Element, key: string) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event;
  }

  function dispatchAccordionSpace(element: Element) {
    const keydown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    element.dispatchEvent(keydown);
    element.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));
    return keydown;
  }

  function createAccordionFixture(options: {
    aliases?: boolean;
    collapsible?: boolean;
    defaultValue?: string;
    dir?: "ltr" | "rtl";
    disabled?: boolean;
    disabledValues?: readonly string[];
    forceMountValues?: readonly string[];
    nested?: boolean;
    orientation?: "horizontal" | "vertical";
    type?: "multiple" | "single";
    value?: string;
    values?: readonly string[];
  } = {}) {
    ${defineFunctionName}();
    const root = document.createElement("aria-accordion") as RuntimeElement;
    const values = options.values ?? ["alpha", "beta", "gamma", "delta"];
    const triggerTag = options.aliases ? "aria-accordion-button" : "aria-accordion-trigger";
    const contentTag = options.aliases ? "aria-accordion-panel" : "aria-accordion-content";
    const items: RuntimeElement[] = [];
    const headers: RuntimeElement[] = [];
    const triggers: RuntimeElement[] = [];
    const contents: RuntimeElement[] = [];
    const container = options.nested ? document.createElement("div") : root;

    if (options.type) {
      root.setAttribute("type", options.type);
    }

    if (options.defaultValue !== undefined) {
      root.setAttribute("default-value", options.defaultValue);
    }

    if (options.value !== undefined) {
      root.value = options.value;
    }

    if (options.collapsible) {
      root.setAttribute("collapsible", "true");
    }

    if (options.orientation) {
      root.setAttribute("orientation", options.orientation);
    }

    if (options.dir) {
      root.setAttribute("dir", options.dir);
    }

    if (options.disabled) {
      root.disabled = true;
    }

    if (options.nested) {
      root.append(container);
    }

    values.forEach((value) => {
      const item = document.createElement("aria-accordion-item") as RuntimeElement;
      const header = document.createElement("aria-accordion-header") as RuntimeElement;
      const trigger = document.createElement(triggerTag) as RuntimeElement;
      const content = document.createElement(contentTag) as RuntimeElement;

      item.value = value;
      trigger.textContent = "Heading-" + value;
      content.textContent = "Content-" + value;

      if (options.disabledValues?.includes(value)) {
        item.disabled = true;
      }

      if (options.forceMountValues?.includes(value)) {
        content.setAttribute("force-mount", "");
      }

      header.append(trigger);
      item.append(header, content);
      container.append(item);
      items.push(item);
      headers.push(header);
      triggers.push(trigger);
      contents.push(content);
    });

    document.body.append(root);
    return {
      root,
      items: items as unknown as RuntimeElementList,
      headers: headers as unknown as RuntimeElementList,
      triggers: triggers as unknown as RuntimeElementList,
      contents: contents as unknown as RuntimeElementList,
    };
  }

  it("toggles aria-controls targets for the docs accordion example", () => {
    ${defineFunctionName}();
    const trigger = document.createElement("aria-accordion-trigger") as RuntimeElement;
    const content = document.createElement("aria-accordion-content") as RuntimeElement;
    content.id = "accordion-accessible-panel";
    content.hidden = true;
    trigger.setAttribute("aria-controls", "accordion-accessible-panel");
    trigger.textContent = "Is it accessible?";
    content.textContent = "Yes. It adheres to the WAI-ARIA design pattern.";
    document.body.append(trigger, content);

    expect(trigger.open).toBe(false);
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    trigger.click();

    expect(trigger.open).toBe(true);
    expect(content.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("open");

    trigger.click();

    expect(trigger.open).toBe(false);
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("uses the accordion trigger state as the source of truth when toggling content", () => {
    ${defineFunctionName}();
    const trigger = document.createElement("aria-accordion-trigger") as RuntimeElement;
    const content = document.createElement("aria-accordion-content") as RuntimeElement;
    content.id = "accordion-trigger-owned-panel";
    trigger.setAttribute("aria-controls", "accordion-trigger-owned-panel");
    trigger.open = true;
    content.hidden = false;
    document.body.append(trigger, content);

    expect(trigger.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.hidden).toBe(false);

    trigger.click();

    expect(trigger.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("matches the accordion part, alias, and default semantics from the spec", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-accordion");
    const header = document.createElement("aria-accordion-header");
    const trigger = document.createElement("aria-accordion-trigger");
    const button = document.createElement("aria-accordion-button");
    const content = document.createElement("aria-accordion-content");
    const panel = document.createElement("aria-accordion-panel");
    document.body.append(root, header, trigger, button, content, panel);

    expect(root.getAttribute("orientation")).toBe("vertical");
    expect(root.getAttribute("data-orientation")).toBe("vertical");
    expect(root.getAttribute("dir")).toBe("ltr");
    expect(header.getAttribute("role")).toBe("heading");
    expect(header.getAttribute("aria-level")).toBe("3");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(button.getAttribute("role")).toBe("button");
    expect(content.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("role")).toBe("region");
    expect(button.getAttribute("aria-expanded")).toBe(trigger.getAttribute("aria-expanded"));
    expect(button.getAttribute("part")).toBe("button");
    expect(panel.getAttribute("part")).toBe("panel");
    expect(panel.getAttribute("data-part")).toBe("Panel");
  });

  it("renders multiple uncontrolled accordions from default-value", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      disabledValues: ["delta"],
    });

    expect(root).toBeInstanceOf(HTMLElement);
    expect(triggers).toHaveLength(4);
    expect(contents).toHaveLength(4);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[2].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[3].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(false);
    expect(contents[2].hidden).toBe(true);
  });

  it("preserves APG trigger-to-panel ARIA linkage", () => {
    const { headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      disabledValues: ["delta"],
    });

    expect(headers[0].children).toHaveLength(1);
    expect(headers[0].firstElementChild).toBe(triggers[0]);
    expect(triggers[0].getAttribute("aria-controls")).toBe(contents[0].id);
    expect(triggers[1].getAttribute("aria-controls")).toBe(contents[1].id);
    expect(contents[0].getAttribute("aria-labelledby")).toBe(triggers[0].id);
    expect(contents[1].getAttribute("aria-labelledby")).toBe(triggers[1].id);
    expect(contents[0].getAttribute("role")).toBe("region");
  });

  it("implements single, collapsible single, and multiple accordion state models", () => {
    const single = createAccordionFixture({ type: "single", defaultValue: "alpha", values: ["alpha", "beta"] });
    const [singleAlpha, singleBeta] = single.triggers;

    expect(singleAlpha.open).toBe(true);
    expect(singleAlpha.getAttribute("aria-disabled")).toBe("true");
    singleAlpha.click();
    expect(singleAlpha.open).toBe(true);

    singleBeta.click();
    expect(singleAlpha.open).toBe(false);
    expect(singleBeta.open).toBe(true);
    expect(single.contents[0].hidden).toBe(true);
    expect(single.contents[1].hidden).toBe(false);

    document.body.replaceChildren();
    const collapsible = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      collapsible: true,
      values: ["alpha"],
    });
    collapsible.triggers[0].click();
    expect(collapsible.triggers[0].open).toBe(false);
    expect(collapsible.contents[0].hidden).toBe(true);

    document.body.replaceChildren();
    const multiple = createAccordionFixture({ type: "multiple", defaultValue: "alpha,beta", values: ["alpha", "beta", "gamma"] });
    multiple.triggers[2].click();
    expect(multiple.triggers[0].open).toBe(true);
    expect(multiple.triggers[1].open).toBe(true);
    expect(multiple.triggers[2].open).toBe(true);
  });

  it("dispatches native valuechange events for controlled-style single and multiple state", () => {
    const single = createAccordionFixture({ type: "single", value: "alpha", values: ["alpha", "beta"] });
    const singleValues: unknown[] = [];
    single.root.addEventListener("valuechange", (event) => {
      singleValues.push((event as CustomEvent).detail.value);
    });

    single.triggers[1].click();
    expect(singleValues).toEqual(["beta"]);
    expect(single.root.value).toBe("beta");

    document.body.replaceChildren();
    const collapsible = createAccordionFixture({
      type: "single",
      value: "alpha",
      collapsible: true,
      values: ["alpha"],
    });
    const collapsibleValues: unknown[] = [];
    collapsible.root.addEventListener("valuechange", (event) => {
      collapsibleValues.push((event as CustomEvent).detail.value);
    });
    collapsible.triggers[0].click();
    expect(collapsibleValues).toEqual([""]);
    expect(collapsible.root.value).toBe("");

    document.body.replaceChildren();
    const multiple = createAccordionFixture({ type: "multiple", value: "alpha", values: ["alpha", "beta"] });
    const multipleValues: unknown[] = [];
    multiple.root.addEventListener("valuechange", (event) => {
      multipleValues.push((event as CustomEvent).detail.value);
    });
    multiple.triggers[1].click();
    expect(multipleValues).toEqual([["alpha", "beta"]]);
    expect(multiple.root.value).toBe("alpha,beta");
  });

  it("keeps disabled accordion triggers inert", () => {
    const { items, headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      disabledValues: ["delta"],
    });
    const trigger = triggers[3];
    const content = contents[3];

    trigger.click();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    trigger.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));

    expect(items[3].getAttribute("aria-disabled")).toBe("true");
    expect(items[3].getAttribute("data-disabled")).toBe("");
    expect(headers[3].getAttribute("data-disabled")).toBe("");
    expect(trigger.disabled).toBe(true);
    expect(trigger.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.getAttribute("data-disabled")).toBe("");
    expect(trigger.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("implements APG roving focus keys for vertical and horizontal accordions", () => {
    const vertical = createAccordionFixture({
      type: "multiple",
      disabledValues: ["delta"],
      values: ["alpha", "beta", "gamma", "delta"],
    });
    const [first, second, last] = vertical.triggers;

    first.focus();
    dispatchAccordionKey(first, "Enter");
    expect(first.open).toBe(true);
    dispatchAccordionSpace(first);
    expect(first.open).toBe(false);
    dispatchAccordionKey(first, "ArrowDown");
    expect(document.activeElement).toBe(second);
    dispatchAccordionKey(second, "ArrowDown");
    expect(document.activeElement).toBe(last);
    dispatchAccordionKey(last, "ArrowDown");
    expect(document.activeElement).toBe(first);
    dispatchAccordionKey(first, "ArrowUp");
    expect(document.activeElement).toBe(last);
    dispatchAccordionKey(first, "End");
    expect(document.activeElement).toBe(last);
    dispatchAccordionKey(last, "Home");
    expect(document.activeElement).toBe(first);

    document.body.replaceChildren();
    const horizontal = createAccordionFixture({
      type: "multiple",
      orientation: "horizontal",
      dir: "ltr",
      values: ["alpha", "beta", "gamma"],
    });
    horizontal.triggers[1].focus();
    dispatchAccordionKey(horizontal.triggers[1], "ArrowRight");
    expect(document.activeElement).toBe(horizontal.triggers[2]);
    dispatchAccordionKey(horizontal.triggers[2], "ArrowLeft");
    expect(document.activeElement).toBe(horizontal.triggers[1]);
    dispatchAccordionKey(horizontal.triggers[1], "ArrowLeft");
    expect(document.activeElement).toBe(horizontal.triggers[0]);

    document.body.replaceChildren();
    const rtl = createAccordionFixture({
      type: "multiple",
      orientation: "horizontal",
      dir: "rtl",
      values: ["alpha", "beta", "gamma"],
    });
    rtl.triggers[1].focus();
    dispatchAccordionKey(rtl.triggers[1], "ArrowRight");
    expect(document.activeElement).toBe(rtl.triggers[0]);
    dispatchAccordionKey(rtl.triggers[0], "ArrowLeft");
    expect(document.activeElement).toBe(rtl.triggers[1]);
    dispatchAccordionKey(rtl.triggers[1], "ArrowLeft");
    expect(document.activeElement).toBe(rtl.triggers[2]);
  });

  it("keeps horizontal accordions from reacting to vertical arrow keys", () => {
    const { triggers } = createAccordionFixture({
      type: "multiple",
      orientation: "horizontal",
      values: ["alpha", "beta"],
    });

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "ArrowDown");

    expect(document.activeElement).toBe(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
  });

  it("preserves heading and trigger semantics from the spec", () => {
    const { headers, triggers } = createAccordionFixture({ type: "single", defaultValue: "alpha" });

    expect(headers).toHaveLength(4);
    for (const header of headers) {
      expect(header.getAttribute("role")).toBe("heading");
      expect(header.getAttribute("aria-level")).toBe("3");
      expect(header.children).toHaveLength(1);
    }

    triggers[0].setAttribute("aria-level", "2");
    expect(triggers[0].getAttribute("role")).toBe("button");
    expect(triggers[0].getAttribute("role")).not.toBe("heading");
  });

  it("handles empty accordions and all-disabled item sets", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-accordion");
    root.setAttribute("type", "single");
    document.body.append(root);
    expect(root.getAttribute("data-orientation")).toBe("vertical");

    document.body.replaceChildren();
    const { triggers } = createAccordionFixture({
      type: "single",
      disabledValues: ["alpha", "beta"],
      values: ["alpha", "beta"],
    });

    expect(triggers[0].disabled).toBe(true);
    expect(triggers[1].disabled).toBe(true);
    dispatchAccordionKey(triggers[1], "Home");
    expect(document.activeElement).not.toBe(triggers[0]);
  });

  it("uses current DOM order for arrow Home and End navigation after reorder", () => {
    const { root, items, triggers } = createAccordionFixture({
      type: "multiple",
      values: ["a", "b", "c"],
    });

    root.insertBefore(items[1], items[0]);
    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "ArrowDown");
    expect(document.activeElement).toBe(triggers[2]);

    dispatchAccordionKey(triggers[0], "Home");
    expect(document.activeElement).toBe(triggers[1]);

    dispatchAccordionKey(triggers[1], "End");
    expect(document.activeElement).toBe(triggers[2]);
  });

  it("supports nested item registration without requiring direct children", () => {
    const { triggers } = createAccordionFixture({
      type: "multiple",
      nested: true,
      values: ["alpha", "beta"],
    });

    triggers[0].click();
    expect(triggers[0].open).toBe(true);
    expect(triggers[1].open).toBe(false);

    triggers[1].click();
    expect(triggers[0].open).toBe(true);
    expect(triggers[1].open).toBe(true);
  });

  it("throws when multiple items share the same value", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-accordion");
    root.setAttribute("type", "single");
    const first = document.createElement("aria-accordion-item") as RuntimeElement;
    const second = document.createElement("aria-accordion-item") as RuntimeElement;
    first.value = "dup-value";
    second.value = "dup-value";
    root.append(first, second);

    expect(() => {
      (root as RuntimeElement & { syncAccordionTreeFromRoot: () => void }).syncAccordionTreeFromRoot();
    }).toThrow(/Duplicate Accordion\\.Item value/i);
  });

  it("maps open state by item value rather than render index", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      defaultValue: "beta",
      values: ["alpha", "beta"],
    });

    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("applies default-value even when it arrives after an initial root sync", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "single",
      values: ["alpha", "beta"],
    });

    expect(root.hasAttribute("value")).toBe(false);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(true);

    root.setAttribute("default-value", "alpha");

    expect(root.value).toBe("alpha");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(true);
  });

  it("updates registration when an item value changes after mount", () => {
    const { items, root, triggers } = createAccordionFixture({
      type: "multiple",
      values: ["alpha", "beta"],
    });

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(root.value).toBe("alpha");

    items[0].value = "renamed";
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(root.value).toBe("");

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(root.value).toBe("renamed");

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(root.value).toBe("");
  });

  it("sets root dir and data-orientation attributes for styling and SSR-like markup", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      orientation: "horizontal",
      dir: "rtl",
      values: ["alpha", "beta"],
    });

    expect(root.getAttribute("dir")).toBe("rtl");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(root.outerHTML).toContain('dir="rtl"');
    expect(root.outerHTML).toContain('aria-expanded="true"');
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[1].getAttribute("aria-hidden")).toBe("true");
    expect(triggers[0].getAttribute("aria-controls")).toBe(contents[0].id);
  });

  it("exposes item header trigger and content state metadata", () => {
    const { items, headers, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      disabledValues: ["beta"],
      values: ["alpha", "beta"],
    });

    expect(items[0].getAttribute("data-state")).toBe("open");
    expect(items[1].getAttribute("data-state")).toBe("closed");
    expect(headers[0].getAttribute("data-state")).toBe("open");
    expect(headers[0].getAttribute("data-orientation")).toBe("vertical");
    expect(triggers[0].getAttribute("data-state")).toBe("open");
    expect(contents[0].getAttribute("data-state")).toBe("open");
    expect(contents[0].getAttribute("data-orientation")).toBe("vertical");
    expect(contents[1].getAttribute("data-disabled")).toBe("");
  });

  it("composes consumer event handlers and lets preventDefault block native toggles", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      collapsible: true,
      values: ["alpha"],
    });
    let clickCount = 0;
    let keydownCount = 0;
    let focusCount = 0;
    triggers[0].addEventListener("click", () => {
      clickCount += 1;
    });
    triggers[0].addEventListener("keydown", () => {
      keydownCount += 1;
    });
    triggers[0].addEventListener("focus", () => {
      focusCount += 1;
    });

    triggers[0].click();
    expect(clickCount).toBe(1);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Enter");
    expect(keydownCount).toBe(1);
    expect(focusCount).toBe(1);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");

    document.body.replaceChildren();
    ${defineFunctionName}();
    const root = document.createElement("aria-accordion");
    root.setAttribute("type", "single");
    root.setAttribute("collapsible", "true");
    const item = document.createElement("aria-accordion-item") as RuntimeElement;
    const trigger = document.createElement("aria-accordion-trigger") as RuntimeElement;
    const content = document.createElement("aria-accordion-content") as RuntimeElement;
    item.value = "alpha";
    trigger.textContent = "Alpha";
    content.textContent = "Alpha Content";
    trigger.addEventListener("click", (event) => event.preventDefault());
    trigger.addEventListener("keydown", (event) => {
      if ((event as KeyboardEvent).key === "Enter") {
        event.preventDefault();
      }
    });
    item.append(trigger, content);
    root.append(item);
    document.body.append(root);

    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    dispatchAccordionKey(trigger, "Enter");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not react to non-accordion keys", () => {
    const { triggers } = createAccordionFixture({ type: "multiple", values: ["alpha", "beta"] });

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Escape");

    expect(document.activeElement).toBe(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps enabled items closed when root disabled state blocks toggles", () => {
    const { items, root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      disabled: true,
      values: ["alpha"],
    });

    triggers[0].click();

    expect(root.getAttribute("aria-disabled")).toBe("true");
    expect(items[0].getAttribute("aria-disabled")).toBe("true");
    expect(triggers[0].disabled).toBe(true);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(true);
  });

  it("keeps closed content mounted only when force-mount is present", () => {
    const { triggers, contents } = createAccordionFixture({
      type: "single",
      collapsible: true,
      forceMountValues: ["alpha"],
      values: ["alpha", "beta"],
    });

    expect(contents[0].hidden).toBe(false);
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
    expect(contents[0].getAttribute("data-state")).toBe("closed");
    expect(contents[1].hidden).toBe(true);

    triggers[0].click();
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[0].getAttribute("data-state")).toBe("open");
  });

  it("keeps Button and Panel aliases behaviorally identical to Trigger and Content", () => {
    const { headers, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      aliases: true,
      values: ["alpha", "beta"],
    });

    expect(triggers[0].tagName.toLowerCase()).toBe("aria-accordion-button");
    expect(contents[0].tagName.toLowerCase()).toBe("aria-accordion-panel");
    expect(headers[0].getAttribute("role")).toBe("heading");
    expect(headers[0].getAttribute("aria-level")).toBe("3");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(true);

    triggers[1].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("should be rendered as native accordion custom elements", () => {
    const { root, items, headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
    });

    expect(document.body.contains(root)).toBe(true);
    expect(root.tagName.toLowerCase()).toBe("aria-accordion");
    expect(items).toHaveLength(4);
    expect(headers).toHaveLength(4);
    expect(triggers).toHaveLength(4);
    expect(contents).toHaveLength(4);
  });

  it("should expose an accessible APG accordion structure", () => {
    const { root, headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      disabledValues: ["delta"],
    });
    const ids = new Set<string>();

    expect(root.getAttribute("data-orientation")).toBe("vertical");
    expect(root.getAttribute("dir")).toBe("ltr");

    for (const [index, trigger] of triggers.entries()) {
      const header = headers[index]!;
      const content = contents[index]!;
      expect(header.getAttribute("role")).toBe("heading");
      expect(header.getAttribute("aria-level")).toBe("3");
      expect(header.firstElementChild).toBe(trigger);
      expect(trigger.getAttribute("role")).toBe("button");
      expect(content.getAttribute("role")).toBe("region");
      expect(trigger.id).not.toBe("");
      expect(content.id).not.toBe("");
      expect(trigger.getAttribute("aria-controls")).toBe(content.id);
      expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
      ids.add(trigger.id);
      ids.add(content.id);
    }

    expect(ids.size).toBe(triggers.length + contents.length);
  });

  it("should initialize single accordions from default-value", () => {
    const { triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha", "beta"],
    });

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(true);
  });

  it("should call valuechange with the next single value", () => {
    const { root, triggers } = createAccordionFixture({
      type: "single",
      value: "alpha",
      values: ["alpha", "beta"],
    });
    const values: unknown[] = [];
    const valueLists: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
      valueLists.push((event as CustomEvent).detail.values);
    });
    triggers[1].click();

    expect(values).toEqual(["beta"]);
    expect(valueLists).toEqual([["beta"]]);
    expect(root.value).toBe("beta");
  });

  it("should call valuechange with an empty string when a collapsible single item closes", () => {
    const { root, triggers } = createAccordionFixture({
      type: "single",
      value: "alpha",
      collapsible: true,
      values: ["alpha"],
    });
    const values: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
    });
    triggers[0].click();

    expect(values).toEqual([""]);
    expect(root.value).toBe("");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
  });

  it("should call valuechange with the next multiple values", () => {
    const { root, triggers } = createAccordionFixture({
      type: "multiple",
      value: "alpha",
      values: ["alpha", "beta"],
    });
    const values: unknown[] = [];
    const valueLists: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
      valueLists.push((event as CustomEvent).detail.values);
    });
    triggers[1].click();

    expect(values).toEqual([["alpha", "beta"]]);
    expect(valueLists).toEqual([["alpha", "beta"]]);
    expect(root.value).toBe("alpha,beta");
  });

  it("should handle first item disabled navigation", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      defaultValue: "beta",
      disabledValues: ["alpha"],
      values: ["alpha", "beta"],
    });

    triggers[1].focus();
    dispatchAccordionKey(triggers[1], "Home");

    expect(document.activeElement).toBe(triggers[1]);
    expect(triggers[0].disabled).toBe(true);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("preserves disabled content metadata when mounted", () => {
    const { contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      disabledValues: ["alpha"],
      values: ["alpha"],
    });

    expect(contents[0].hidden).toBe(false);
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[0].getAttribute("data-state")).toBe("open");
    expect(contents[0].getAttribute("data-disabled")).toBe("");
    expect(contents[0].getAttribute("data-orientation")).toBe("vertical");
  });

  it("does not refocus a trigger that is already focused", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      collapsible: true,
      values: ["alpha"],
    });
    const focusSpy = vi.spyOn(triggers[0], "focus");

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Enter");

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    focusSpy.mockRestore();
  });

  it("ignores pointer keyboard and focus events from disabled custom triggers", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      disabledValues: ["alpha"],
      values: ["alpha"],
    });
    const values: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
    });
    triggers[0].click();
    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Enter");
    dispatchAccordionSpace(triggers[0]);

    expect(values).toEqual([]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[0].getAttribute("aria-disabled")).toBe("true");
    expect(contents[0].hidden).toBe(true);
  });

  it("adds heading role semantics for the native Header custom element", () => {
    const { headers } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha"],
    });

    expect(headers[0].tagName.toLowerCase()).toBe("aria-accordion-header");
    expect(headers[0].getAttribute("role")).toBe("heading");
    expect(headers[0].getAttribute("aria-level")).toBe("3");
    headers[0].setAttribute("aria-level", "2");
    expect(headers[0].getAttribute("aria-level")).toBe("2");
  });

  it("keeps closed content hidden by default", () => {
    const { contents } = createAccordionFixture({
      type: "single",
      values: ["alpha", "beta"],
    });

    expect(contents[0].hidden).toBe(true);
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
    expect(contents[0].getAttribute("data-state")).toBe("closed");
    expect(contents[1].hidden).toBe(true);
    expect(contents[1].getAttribute("aria-hidden")).toBe("true");
  });

  it("reflects default-open content in SSR-like serialized markup", () => {
    const { root } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha", "beta"],
    });
    const html = root.outerHTML;

    expect(html).toContain('dir="ltr"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-hidden="false"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-hidden="true"');
  });

  it("reflects multiple open sections in SSR-like serialized markup", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      values: ["alpha", "beta"],
    });

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[1].getAttribute("aria-hidden")).toBe("false");
    expect(root.outerHTML).toContain('aria-expanded="true"');
    expect(root.outerHTML).toContain('dir="ltr"');
  });

  it("renders dir=rtl on the root in SSR-like serialized markup", () => {
    const { root } = createAccordionFixture({
      type: "single",
      dir: "rtl",
      values: ["alpha"],
    });

    expect(root.getAttribute("dir")).toBe("rtl");
    expect(root.outerHTML).toContain('dir="rtl"');
  });

  it("renders force-mounted closed content in SSR-like serialized markup", () => {
    const { root, contents } = createAccordionFixture({
      type: "single",
      forceMountValues: ["alpha"],
      values: ["alpha", "beta"],
    });

    expect(contents[0].hidden).toBe(false);
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
    expect(contents[0].getAttribute("data-state")).toBe("closed");
    expect(root.outerHTML).toContain("Content-alpha");
    expect(root.outerHTML).toContain('force-mount=""');
  });

  it("uses native custom element hosts for root item trigger and content composition", () => {
    const { root, items, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      aliases: true,
      nested: true,
      values: ["alpha", "beta"],
    });

    expect(root.tagName.toLowerCase()).toBe("aria-accordion");
    expect(items[0].tagName.toLowerCase()).toBe("aria-accordion-item");
    expect(triggers[0].tagName.toLowerCase()).toBe("aria-accordion-button");
    expect(contents[0].tagName.toLowerCase()).toBe("aria-accordion-panel");
    expect(items[0].getAttribute("data-state")).toBe("open");
    expect(items[1].getAttribute("data-state")).toBe("closed");
  });

  it("does not generate inline content size styles", () => {
    const { contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha"],
    });

    expect(contents[0].style.getPropertyValue("--accordion-content-height")).toBe("");
    expect(contents[0].style.getPropertyValue("--accordion-content-width")).toBe("");
    expect(contents[0].style.width).toBe("");
    expect(contents[0].style.opacity).toBe("");
    expect(contents[0].hasAttribute("style")).toBe(false);
  });
`
      : "";
  const badgeSourceParityTest =
    spec.slug === "badge"
      ? `

  it("matches source Root default static badge semantics", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-badge") as RuntimeElement;
    root.textContent = "New";
    document.body.append(root);

    expect(root.tagName.toLowerCase()).toBe("aria-badge");
    expect(root.textContent).toBe("New");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("aria-label")).toBe(false);
    expect(root.hasAttribute("tabindex")).toBe(false);
    expect(root.hasAttribute("data-state")).toBe(false);
    expect(root.hasAttribute("data-disabled")).toBe(false);
    expect(root.hasAttribute("data-variant")).toBe(false);
    expect(root.hasAttribute("data-slot")).toBe(false);
  });

  it("forwards standard host attributes styles classes children and DOM events", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-badge") as RuntimeElement;
    const child = document.createElement("span");
    const onClick = vi.fn();

    root.id = "billing-badge";
    root.title = "Billing status";
    root.className = "rounded-full";
    root.style.color = "red";
    root.setAttribute("data-testid", "badge-root");
    root.setAttribute("data-state", "active");
    child.textContent = "Paid";
    root.append(child);
    root.addEventListener("click", onClick);
    document.body.append(root);

    root.click();

    expect(root.id).toBe("billing-badge");
    expect(root.title).toBe("Billing status");
    expect(root.className).toBe("rounded-full");
    expect(root.style.color).toBe("red");
    expect(root.getAttribute("data-testid")).toBe("badge-root");
    expect(root.getAttribute("data-state")).toBe("active");
    expect(root.firstElementChild).toBe(child);
    expect(child.textContent).toBe("Paid");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("preserves consumer-supplied aria props", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-badge") as RuntimeElement;
    root.setAttribute("role", "status");
    root.setAttribute("aria-label", "Unread messages");
    root.textContent = "3";
    document.body.append(root);

    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-label")).toBe("Unread messages");
    expect(root.textContent).toBe("3");
  });

  it("adapts source as='a' badges to native custom-element link semantics", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-badge") as RuntimeElement;
    const onClick = vi.fn((event: Event) => event.preventDefault());
    root.setAttribute("as", "a");
    root.setAttribute("href", "/changelog");
    root.textContent = "New";
    root.addEventListener("click", onClick);
    document.body.append(root);

    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));

    expect(root.tagName.toLowerCase()).toBe("aria-badge");
    expect(root.getAttribute("as")).toBe("a");
    expect(root.getAttribute("href")).toBe("/changelog");
    expect(root.getAttribute("role")).toBe("link");
    expect(root.getAttribute("tabindex")).toBe("0");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("adapts source as='button' badges to native custom-element button semantics", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-badge") as RuntimeElement;
    const onClick = vi.fn();
    root.setAttribute("as", "button");
    root.textContent = "Click";
    root.addEventListener("click", onClick);
    document.body.append(root);

    root.click();
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    const spaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    root.dispatchEvent(spaceKeyDown);
    root.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));

    expect(root.tagName.toLowerCase()).toBe("aria-badge");
    expect(root.getAttribute("as")).toBe("button");
    expect(root.getAttribute("role")).toBe("button");
    expect(root.getAttribute("tabindex")).toBe("0");
    expect(spaceKeyDown.defaultPrevented).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(3);
  });
`
      : "";
  const avatarSourceParityTest =
    spec.slug === "avatar"
      ? `

  function createAvatarFixture(options: {
    alt?: string;
    delayMs?: string;
    fallback?: string;
    role?: string;
    ariaLabel?: string;
    src?: string;
  } = {}) {
    ${defineFunctionName}();
    const root = document.createElement("aria-avatar") as RuntimeElement;
    const image = document.createElement("aria-avatar-image") as RuntimeElement;
    const fallback = document.createElement("aria-avatar-fallback") as RuntimeElement;

    image.setAttribute("src", options.src ?? "/avatar.png");
    image.setAttribute("alt", options.alt ?? "User avatar");
    fallback.textContent = options.fallback ?? "CT";

    if (options.delayMs) {
      fallback.setAttribute("delay-ms", options.delayMs);
    }

    if (options.role) {
      root.setAttribute("role", options.role);
    }

    if (options.ariaLabel) {
      root.setAttribute("aria-label", options.ariaLabel);
    }

    root.append(image, fallback);
    document.body.append(root);
    return { root, image, fallback, img: image.querySelector("img") as HTMLImageElement | null };
  }

  function dispatchImageLoad(image: HTMLElement) {
    const img = image.querySelector("img") as HTMLImageElement | null;
    expect(img).not.toBeNull();
    img?.dispatchEvent(new Event("load", { bubbles: false }));
    return img;
  }

  function dispatchImageError(image: HTMLElement) {
    const img = image.querySelector("img") as HTMLImageElement | null;
    expect(img).not.toBeNull();
    img?.dispatchEvent(new Event("error", { bubbles: false }));
    return img;
  }

  it("matches source Root, Image, and Fallback semantics while image is loading", () => {
    const { root, image, fallback, img } = createAvatarFixture();

    expect(root.tagName.toLowerCase()).toBe("aria-avatar");
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("avatar");
    expect(fallback.hidden).toBe(false);
    expect(fallback.textContent).toBe("CT");
    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(img?.getAttribute("alt")).toBe("User avatar");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");
    expect(image.getAttribute("data-loading-status")).toBe("loading");
  });

  it("hides fallback and removes default root image semantics when image loads", () => {
    const { root, image, fallback } = createAvatarFixture();
    const loadEvents: string[] = [];
    const statusEvents: string[] = [];
    image.addEventListener("load", () => loadEvents.push("load"));
    root.addEventListener("loadingstatuschange", (event) => {
      statusEvents.push((event as CustomEvent<{ status: string }>).detail.status);
    });

    const img = dispatchImageLoad(image);

    expect(loadEvents).toEqual(["load"]);
    expect(statusEvents).toContain("loaded");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("aria-label")).toBe(false);
    expect(fallback.hidden).toBe(true);
    expect(img?.hasAttribute("aria-hidden")).toBe(false);
    expect(img?.style.visibility).toBe("");
    expect(image.getAttribute("data-loading-status")).toBe("loaded");
  });

  it("keeps fallback visible and default semantics when image errors", () => {
    const { root, image, fallback } = createAvatarFixture({ src: "/broken.png" });
    const errorEvents: string[] = [];
    image.addEventListener("error", () => errorEvents.push("error"));

    const img = dispatchImageError(image);

    expect(errorEvents).toEqual(["error"]);
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("avatar");
    expect(fallback.hidden).toBe(false);
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");
    expect(image.getAttribute("data-loading-status")).toBe("error");
  });

  it("allows consumers to override root role and aria-label", () => {
    const { root, image } = createAvatarFixture({ role: "presentation", ariaLabel: "Profile photo" });

    expect(root.getAttribute("role")).toBe("presentation");
    expect(root.getAttribute("aria-label")).toBe("Profile photo");
    dispatchImageLoad(image);
    expect(root.getAttribute("role")).toBe("presentation");
    expect(root.getAttribute("aria-label")).toBe("Profile photo");
  });

  it("resets fallback visibility when image src changes after loading", () => {
    const { root, image, fallback } = createAvatarFixture();
    dispatchImageLoad(image);
    expect(root.hasAttribute("role")).toBe(false);
    expect(fallback.hidden).toBe(true);

    image.setAttribute("src", "/avatar-2.png");
    const img = image.querySelector("img") as HTMLImageElement | null;

    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("avatar");
    expect(fallback.hidden).toBe(false);
    expect(img?.getAttribute("src")).toBe("/avatar-2.png");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");
  });

  it("supports delayed fallback rendering and suppresses it if image loads first", () => {
    vi.useFakeTimers();
    try {
      const first = createAvatarFixture({ delayMs: "300" });
      expect(first.fallback.hidden).toBe(true);
      vi.advanceTimersByTime(299);
      expect(first.fallback.hidden).toBe(true);
      vi.advanceTimersByTime(1);
      expect(first.fallback.hidden).toBe(false);

      document.body.replaceChildren();
      const second = createAvatarFixture({ delayMs: "300" });
      dispatchImageLoad(second.image);
      vi.advanceTimersByTime(300);
      expect(second.fallback.hidden).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("forwards image attributes to the rendered img", () => {
    ${defineFunctionName}();
    const image = document.createElement("aria-avatar-image") as RuntimeElement;
    image.setAttribute("src", "/avatar.png");
    image.setAttribute("alt", "User avatar");
    image.setAttribute("srcset", "/avatar@2x.png 2x");
    image.setAttribute("sizes", "48px");
    image.setAttribute("crossorigin", "anonymous");
    image.setAttribute("referrerpolicy", "no-referrer");
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
    document.body.append(image);
    const img = image.querySelector("img") as HTMLImageElement | null;

    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(img?.getAttribute("alt")).toBe("User avatar");
    expect(img?.getAttribute("srcset")).toBe("/avatar@2x.png 2x");
    expect(img?.getAttribute("sizes")).toBe("48px");
    expect(img?.getAttribute("crossorigin")).toBe("anonymous");
    expect(img?.getAttribute("referrerpolicy")).toBe("no-referrer");
    expect(img?.getAttribute("loading")).toBe("lazy");
    expect(img?.getAttribute("decoding")).toBe("async");
  });

  it("supports Root convenience src alt fallback and fallback-delay-ms attributes", () => {
    vi.useFakeTimers();
    try {
      ${defineFunctionName}();
      const root = document.createElement("aria-avatar") as RuntimeElement;
      root.setAttribute("src", "/avatar.png");
      root.setAttribute("alt", "Profile photo");
      root.setAttribute("fallback", "SC");
      root.setAttribute("fallback-delay-ms", "200");
      document.body.append(root);

      const image = root.querySelector("aria-avatar-image") as HTMLElement | null;
      const fallback = root.querySelector("aria-avatar-fallback") as HTMLElement | null;
      const img = image?.querySelector("img") as HTMLImageElement | null;

      expect(image).not.toBeNull();
      expect(fallback).not.toBeNull();
      expect(img?.getAttribute("src")).toBe("/avatar.png");
      expect(img?.getAttribute("alt")).toBe("Profile photo");
      expect(fallback?.textContent).toBe("SC");
      expect(fallback?.hidden).toBe(true);
      vi.advanceTimersByTime(200);
      expect(fallback?.hidden).toBe(false);
      dispatchImageLoad(image as HTMLElement);
      expect(fallback?.hidden).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not render an internal img when Image has no src", () => {
    ${defineFunctionName}();
    const image = document.createElement("aria-avatar-image") as RuntimeElement;
    document.body.append(image);

    expect(image.querySelector("img")).toBeNull();
    expect(image.getAttribute("data-loading-status")).toBe("error");
  });

  it("keeps Group role behavior aligned with the source package", () => {
    ${defineFunctionName}();
    const group = document.createElement("aria-avatar-group") as RuntimeElement;
    document.body.append(group);
    expect(group.getAttribute("role")).toBe("group");

    const presentation = document.createElement("aria-avatar-group") as RuntimeElement;
    presentation.setAttribute("role", "presentation");
    document.body.append(presentation);
    expect(presentation.getAttribute("role")).toBe("presentation");
  });
`
      : "";
  const aspectRatioSourceParityTest =
    spec.slug === "aspect-ratio"
      ? `

  function createAspectRatioFixture(ratio?: string) {
    ${defineFunctionName}();
    const root = document.createElement("aria-aspect-ratio") as RuntimeElement;
    const image = document.createElement("img");
    image.src = "/aspect-ratio-light.png";
    image.alt = "Colorful abstract gradient in 16:9 frame";
    image.className = "h-full w-full object-cover rounded-xl";
    if (ratio !== undefined) {
      root.setAttribute("ratio", ratio);
    }
    root.append(image);
    document.body.append(root);
    const fill = root.firstElementChild as HTMLElement | null;
    return { root, fill, image };
  }

  function expectRootPadding(root: HTMLElement, expected: number) {
    expect(parseFloat(root.style.paddingBottom)).toBeCloseTo(expected, 4);
  }

  it("resolves ratios the same way as the source package helper", () => {
    expect(resolveAspectRatio(undefined)).toBe(1);
    expect(resolveAspectRatio(16 / 9)).toBeCloseTo(16 / 9);
    expect(resolveAspectRatio(0)).toBe(1);
    expect(resolveAspectRatio(-2)).toBe(1);
    expect(resolveAspectRatio(Number.NaN)).toBe(1);
    expect(resolveAspectRatio(Number.POSITIVE_INFINITY)).toBe(1);
    expect(resolveAspectRatio("16 / 9")).toBeCloseTo(16 / 9);
    expect(resolveAspectRatio("16/9")).toBeCloseTo(16 / 9);
    expect(resolveAspectRatio(" 4 / 3 ")).toBeCloseTo(4 / 3);
    expect(resolveAspectRatio("16:9")).toBeCloseTo(16 / 9);
    expect(resolveAspectRatio("4 : 3")).toBeCloseTo(4 / 3);
    expect(resolveAspectRatio("1.777")).toBeCloseTo(1.777);
    expect(resolveAspectRatio("2")).toBe(2);
    expect(resolveAspectRatio("1 / 0")).toBe(1);
    expect(resolveAspectRatio("0 / 1")).toBe(1);
    expect(resolveAspectRatio("0:9")).toBe(1);
    expect(resolveAspectRatio("")).toBe(1);
    expect(resolveAspectRatio("16:9 extra")).toBe(1);
    expect(resolveAspectRatio("foo")).toBe(1);
    expect(resolveAspectRatio("16/9/2")).toBe(1);
  });

  it("renders Root as a native ratio shell with an absolutely positioned private fill layer", () => {
    const { root, fill, image } = createAspectRatioFixture();

    expect(root.tagName.toLowerCase()).toBe("aria-aspect-ratio");
    expect(root.style.display).toBe("block");
    expect(root.style.position).toBe("relative");
    expect(root.style.width).toBe("100%");
    expect(root.style.paddingBottom).toBe("100%");
    expect(fill?.tagName).toBe("DIV");
    expect(fill?.style.position).toBe("absolute");
    expect(fill?.style.inset).toBe("0px");
    expect(fill?.contains(image)).toBe(true);
  });

  it("applies numeric, slash, colon, decimal, and fallback ratio padding", () => {
    const widescreen = createAspectRatioFixture("16 / 9");
    expectRootPadding(widescreen.root, (9 / 16) * 100);

    document.body.replaceChildren();
    const classic = createAspectRatioFixture("4:3");
    expectRootPadding(classic.root, (3 / 4) * 100);

    document.body.replaceChildren();
    const decimal = createAspectRatioFixture("1.777");
    expectRootPadding(decimal.root, (1 / 1.777) * 100);

    document.body.replaceChildren();
    const invalid = createAspectRatioFixture("0");
    expectRootPadding(invalid.root, 100);
  });

  it("keeps structural ratio styles protected while preserving non-structural consumer styles", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-aspect-ratio") as RuntimeElement;
    root.setAttribute("ratio", "16 / 9");
    root.style.position = "static";
    root.style.width = "20px";
    root.style.paddingBottom = "50%";
    root.style.backgroundColor = "red";
    root.append(document.createElement("img"));
    document.body.append(root);
    const fill = root.firstElementChild as HTMLElement;
    fill.style.position = "static";
    fill.style.inset = "4px";
    root.setAttribute("ratio", "4 / 3");

    expect(root.style.position).toBe("relative");
    expect(root.style.width).toBe("100%");
    expectRootPadding(root, 75);
    expect(root.style.backgroundColor).toBe("red");
    expect(fill.style.position).toBe("absolute");
    expect(fill.style.inset).toBe("0px");
  });

  it("supports native-composition by using the first child element as the fill host", () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-aspect-ratio") as RuntimeElement;
    const section = document.createElement("section");
    const image = document.createElement("img");
    root.setAttribute("ratio", "16 / 9");
    root.setAttribute("native-composition", "");
    section.style.color = "blue";
    image.alt = "Colorful abstract gradient in 16:9 frame";
    section.append(image);
    root.append(section);
    document.body.append(root);

    expect(root.firstElementChild).toBe(section);
    expect(section.style.position).toBe("absolute");
    expect(section.style.inset).toBe("0px");
    expect(section.style.color).toBe("blue");
    expect(section.contains(image)).toBe(true);
  });

  it("has no default semantic role or aspect-ratio state data attributes", () => {
    const { root, image } = createAspectRatioFixture("16 / 9");

    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("aria-label")).toBe(false);
    expect(root.hasAttribute("data-state")).toBe(false);
    expect(root.hasAttribute("data-ratio")).toBe(false);
    expect(root.hasAttribute("data-slot")).toBe(false);
    expect(image.alt).toBe("Colorful abstract gradient in 16:9 frame");
  });
`
      : "";
  const alertSourceParityTest =
    spec.slug === "alert"
      ? `

  function createAlertFixture(options: {
    defaultOpen?: boolean;
    dismissible?: boolean;
    open?: boolean;
    role?: string;
  } = {}) {
    ${defineFunctionName}();
    const root = document.createElement("aria-alert") as RuntimeElement;
    const title = document.createElement("aria-alert-title") as RuntimeElement;
    const description = document.createElement("aria-alert-description") as RuntimeElement;
    const action = document.createElement("aria-alert-action") as RuntimeElement;
    const close = document.createElement("aria-alert-close") as RuntimeElement;
    const cancel = document.createElement("aria-alert-cancel") as RuntimeElement;

    title.textContent = "Alert Title";
    description.textContent = "Alert Description";
    action.textContent = "Action content";
    close.textContent = "Close";
    cancel.textContent = "Cancel";

    if (options.defaultOpen === false) {
      root.setAttribute("default-open", "false");
    }

    if (options.dismissible) {
      root.setAttribute("dismissible", "");
    }

    if (options.open) {
      root.setAttribute("open", "");
    }

    if (options.role) {
      root.setAttribute("role", options.role);
    }

    root.append(title, description, action, close, cancel);
    document.body.append(root);
    return { root, title, description, action, close, cancel };
  }

  function flushAlertMicrotasks() {
    return new Promise<void>((resolve) => queueMicrotask(resolve));
  }

  it("matches the alert part and default semantics from the source spec", () => {
    const { root, title, description, action, close, cancel } = createAlertFixture();

    expect(root.getAttribute("role")).toBe("alert");
    expect(root.hasAttribute("data-dismissible")).toBe(false);
    expect(title.getAttribute("role")).toBe("heading");
    expect(title.getAttribute("aria-level")).toBe("5");
    expect(description.hasAttribute("role")).toBe(false);
    expect(action.hasAttribute("role")).toBe(false);
    expect(close.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("role")).toBe("button");
    expect(action.getAttribute("data-alert-action")).toBe("");
    expect(close.getAttribute("data-alert-close")).toBe("");
    expect(cancel.getAttribute("data-alert-cancel")).toBe("");

    document.body.replaceChildren();
    const dismissible = createAlertFixture({ dismissible: true });

    expect(dismissible.root.getAttribute("data-dismissible")).toBe("");
  });

  it("links title and description with unique aria ids", () => {
    const first = createAlertFixture();
    const second = createAlertFixture();
    const firstTitleId = first.root.getAttribute("aria-labelledby");
    const secondTitleId = second.root.getAttribute("aria-labelledby");
    const firstDescriptionId = first.root.getAttribute("aria-describedby");
    const secondDescriptionId = second.root.getAttribute("aria-describedby");

    expect(firstTitleId).toBe(first.title.id);
    expect(firstDescriptionId).toBe(first.description.id);
    expect(secondTitleId).toBe(second.title.id);
    expect(secondDescriptionId).toBe(second.description.id);
    expect(firstTitleId).not.toBe(secondTitleId);
    expect(firstDescriptionId).not.toBe(secondDescriptionId);
  });

  it("defaults alerts open and supports default-open=false", () => {
    const visible = createAlertFixture();

    expect(visible.root.open).toBe(true);
    expect(visible.root.hidden).toBe(false);
    expect(visible.root.getAttribute("aria-hidden")).toBe("false");
    expect(visible.root.getAttribute("data-state")).toBe("open");

    document.body.replaceChildren();
    const hidden = createAlertFixture({ defaultOpen: false });

    expect(hidden.root.open).toBe(false);
    expect(hidden.root.hidden).toBe(true);
    expect(hidden.root.getAttribute("aria-hidden")).toBe("true");
    expect(hidden.root.getAttribute("data-state")).toBe("closed");
  });

  it("dismisses from close and cancel only when the root is dismissible", async () => {
    const persistent = createAlertFixture();

    persistent.close.click();
    await flushAlertMicrotasks();
    expect(persistent.root.open).toBe(true);
    expect(persistent.root.hidden).toBe(false);

    document.body.replaceChildren();
    const closeFixture = createAlertFixture({ dismissible: true });
    const closeChanges: boolean[] = [];
    closeFixture.root.addEventListener("openchange", (event) => {
      closeChanges.push((event as CustomEvent).detail.open);
    });

    closeFixture.close.click();
    await flushAlertMicrotasks();

    expect(closeChanges).toEqual([false]);
    expect(closeFixture.root.open).toBe(false);
    expect(closeFixture.root.hidden).toBe(true);

    document.body.replaceChildren();
    const cancelFixture = createAlertFixture({ dismissible: true });

    cancelFixture.cancel.click();
    await flushAlertMicrotasks();

    expect(cancelFixture.root.open).toBe(false);
    expect(cancelFixture.root.hidden).toBe(true);
  });

  it("does not dismiss when close or cancel clicks are prevented", async () => {
    const closeFixture = createAlertFixture({ dismissible: true });
    closeFixture.close.addEventListener("click", (event) => event.preventDefault());

    closeFixture.close.click();
    await flushAlertMicrotasks();
    expect(closeFixture.root.open).toBe(true);
    expect(closeFixture.root.hidden).toBe(false);

    document.body.replaceChildren();
    const cancelFixture = createAlertFixture({ dismissible: true });
    cancelFixture.cancel.addEventListener("click", (event) => event.preventDefault());

    cancelFixture.cancel.click();
    await flushAlertMicrotasks();
    expect(cancelFixture.root.open).toBe(true);
    expect(cancelFixture.root.hidden).toBe(false);
  });

  it("reports close requests without mutating controlled open state", async () => {
    const { root, close } = createAlertFixture({ dismissible: true, open: true });
    const onOpenChange = vi.fn();

    root.addEventListener("openchange", (event) => {
      onOpenChange((event as CustomEvent).detail.open);
    });

    close.click();
    await flushAlertMicrotasks();

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(root.open).toBe(true);
    expect(root.hidden).toBe(false);
    expect(root.getAttribute("data-state")).toBe("open");
  });

  it("allows the root live region role to be customized", () => {
    const { root } = createAlertFixture({ role: "status" });

    expect(root.getAttribute("role")).toBe("status");
    expect(document.body.querySelector("[role='status']")).toBe(root);
    expect(document.body.querySelector("[role='alert']")).toBeNull();
  });

  it("uses native alert custom element hosts for root title description action close and cancel", () => {
    const { root, title, description, action, close, cancel } = createAlertFixture({ dismissible: true });

    expect(root.tagName.toLowerCase()).toBe("aria-alert");
    expect(title.tagName.toLowerCase()).toBe("aria-alert-title");
    expect(description.tagName.toLowerCase()).toBe("aria-alert-description");
    expect(action.tagName.toLowerCase()).toBe("aria-alert-action");
    expect(close.tagName.toLowerCase()).toBe("aria-alert-close");
    expect(cancel.tagName.toLowerCase()).toBe("aria-alert-cancel");
  });

  it("slots alert metadata and dismissal behavior onto native-composition child hosts", async () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-alert") as RuntimeElement;
    const title = document.createElement("aria-alert-title") as RuntimeElement;
    const description = document.createElement("aria-alert-description") as RuntimeElement;
    const action = document.createElement("aria-alert-action") as RuntimeElement;
    const close = document.createElement("aria-alert-close") as RuntimeElement;
    const titleHost = document.createElement("h2");
    const descriptionHost = document.createElement("p");
    const actionHost = document.createElement("section");
    const closeHost = document.createElement("button");

    root.setAttribute("dismissible", "");
    title.setAttribute("native-composition", "");
    title.setAttribute("class", "custom-title");
    description.setAttribute("native-composition", "");
    description.setAttribute("class", "custom-description");
    action.setAttribute("native-composition", "");
    action.setAttribute("class", "custom-action");
    action.setAttribute("data-testid", "alert-action");
    close.setAttribute("native-composition", "");
    close.setAttribute("aria-label", "Dismiss alert");
    titleHost.className = "title-host";
    descriptionHost.className = "description-host";
    actionHost.className = "action-host";
    closeHost.className = "close-host";
    titleHost.textContent = "Composed title";
    descriptionHost.textContent = "Composed description";
    actionHost.textContent = "Action content";
    closeHost.textContent = "Close custom";
    title.append(titleHost);
    description.append(descriptionHost);
    action.append(actionHost);
    close.append(closeHost);
    root.append(title, description, action, close);
    document.body.append(root);

    expect(root.getAttribute("aria-labelledby")).toBe(titleHost.id);
    expect(root.getAttribute("aria-describedby")).toBe(descriptionHost.id);
    expect(titleHost.getAttribute("role")).toBe("heading");
    expect(titleHost.getAttribute("aria-level")).toBe("5");
    expect(titleHost.className).toContain("title-host");
    expect(titleHost.className).toContain("custom-title");
    expect(descriptionHost.className).toContain("description-host");
    expect(descriptionHost.className).toContain("custom-description");
    expect(actionHost.getAttribute("data-alert-action")).toBe("");
    expect(actionHost.getAttribute("data-testid")).toBe("alert-action");
    expect(actionHost.className).toContain("action-host");
    expect(actionHost.className).toContain("custom-action");
    expect(closeHost.getAttribute("data-alert-close")).toBe("");
    expect(closeHost.getAttribute("aria-label")).toBe("Dismiss alert");

    closeHost.click();
    await flushAlertMicrotasks();

    expect(root.open).toBe(false);
    expect(root.hidden).toBe(true);

    document.body.replaceChildren();
    const cancelRoot = document.createElement("aria-alert") as RuntimeElement;
    const cancel = document.createElement("aria-alert-cancel") as RuntimeElement;
    const cancelHost = document.createElement("button");

    cancelRoot.setAttribute("dismissible", "");
    cancel.setAttribute("native-composition", "");
    cancelHost.textContent = "Cancel custom";
    cancel.append(cancelHost);
    cancelRoot.append(cancel);
    document.body.append(cancelRoot);

    expect(cancelHost.getAttribute("data-alert-cancel")).toBe("");

    cancelHost.click();
    await flushAlertMicrotasks();

    expect(cancelRoot.open).toBe(false);
    expect(cancelRoot.hidden).toBe(true);
  });
`
      : "";
  const dialogSourceParityTest =
    spec.slug === "dialog"
      ? `

  function createDialogFixture(options: {
    defaultOpen?: boolean;
    disabledTrigger?: boolean;
    forceMount?: boolean;
    omitCancel?: boolean;
    open?: boolean;
  } = {}) {
    ${defineFunctionName}();
    const root = document.createElement("aria-dialog") as RuntimeElement;
    const trigger = document.createElement("aria-dialog-trigger") as RuntimeElement;
    const portal = document.createElement("aria-dialog-portal") as RuntimeElement;
    const overlay = document.createElement("aria-dialog-overlay") as RuntimeElement;
    const content = document.createElement("aria-dialog-content") as RuntimeElement;
    const title = document.createElement("aria-dialog-title") as RuntimeElement;
    const description = document.createElement("aria-dialog-description") as RuntimeElement;
    const close = document.createElement("aria-dialog-close") as RuntimeElement;
    const cancel = document.createElement("aria-dialog-cancel") as RuntimeElement;
    const action = document.createElement("aria-dialog-action") as RuntimeElement;
    const nameField = document.createElement("input");
    const usernameField = document.createElement("input");
    const footer = document.createElement("div");

    trigger.textContent = "Edit Profile";
    title.textContent = "Edit profile";
    description.textContent = "Make changes to your profile here. Click save when you are done.";
    nameField.id = "dialog-demo-name";
    nameField.value = "Pedro Duarte";
    usernameField.id = "dialog-demo-username";
    usernameField.value = "@peduarte";
    close.textContent = "Close";
    cancel.textContent = "Cancel";
    action.textContent = "Save changes";

    if (options.defaultOpen) {
      root.setAttribute("default-open", "");
    }

    if (options.open) {
      root.setAttribute("open", "");
    }

    if (options.disabledTrigger) {
      trigger.disabled = true;
    }

    if (options.forceMount) {
      portal.setAttribute("force-mount", "");
      overlay.setAttribute("force-mount", "");
      content.setAttribute("force-mount", "");
    }

    if (options.omitCancel) {
      footer.append(action);
    } else {
      footer.append(cancel, action);
    }
    content.append(title, description, nameField, usernameField, footer, close);
    portal.append(overlay, content);
    root.append(trigger, portal);
    document.body.append(root);

    return { root, trigger, portal, overlay, content, title, description, close, cancel, action, nameField, usernameField };
  }

  function flushDialogMicrotasks() {
    return new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));
  }

  function dispatchDialogKey(element: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  it("declares dialog source defaults in componentSpec metadata", () => {
    expect(getPartSpec("Root").defaultRole).toBeNull();
    expect(getPartSpec("Content").defaultRole).toBeNull();
    expect(getPartSpec("Description").defaultRole).toBeNull();
    expect(getPartSpec("Content").defaultAttributes).toMatchObject({
      "data-dialog-content": "",
    });
    expect(getPartSpec("Title").defaultAttributes).toMatchObject({
      "aria-level": "2",
    });
    expect(getPartSpec("Action").defaultAttributes).toMatchObject({
      "data-dialog-action": "",
    });
    expect(getPartSpec("Cancel").defaultAttributes).toMatchObject({
      "data-dialog-cancel": "",
    });
  });

  it("matches the dialog part and default semantics from the source spec", () => {
    const { root, trigger, content, title, description, close, cancel, action } = createDialogFixture({ forceMount: true });

    expect(root.hasAttribute("role")).toBe(false);
    expect(trigger.getAttribute("role")).toBe("button");
    expect(content.hasAttribute("role")).toBe(false);
    expect(content.getAttribute("data-dialog-content")).toBe("");
    expect(title.getAttribute("role")).toBe("heading");
    expect(title.getAttribute("aria-level")).toBe("2");
    expect(description.hasAttribute("role")).toBe(false);
    expect(close.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("role")).toBe("button");
    expect(action.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("data-dialog-cancel")).toBe("");
    expect(action.getAttribute("data-dialog-action")).toBe("");
  });

  it("keeps dialog content closed by default until Trigger opens it", () => {
    const { root, trigger, portal, overlay, content } = createDialogFixture();

    expect(root.open).toBe(false);
    expect(root.getAttribute("data-state")).toBe("closed");
    expect(root.hasAttribute("aria-expanded")).toBe(false);
    expect(document.body.querySelector("[role='dialog']")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("data-state")).toBe("closed");
    expect(portal.hidden).toBe(true);
    expect(overlay.hidden).toBe(true);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("closed");
  });

  it("opens from Trigger and exposes dialog semantics with title and description linkage", async () => {
    const { root, trigger, portal, overlay, content, title, description, cancel } = createDialogFixture();

    trigger.click();
    await flushDialogMicrotasks();

    expect(root.open).toBe(true);
    expect(root.getAttribute("data-state")).toBe("open");
    expect(root.hasAttribute("aria-expanded")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-state")).toBe("open");
    expect(document.activeElement).toBe(cancel);
  });

  it("opens from default-open and focuses Cancel before Action", async () => {
    const { root, trigger, portal, overlay, content, cancel } = createDialogFixture({ defaultOpen: true });
    await flushDialogMicrotasks();

    expect(root.open).toBe(true);
    expect(root.getAttribute("data-state")).toBe("open");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
    expect(document.activeElement).toBe(cancel);
  });

  it("focuses the first tabbable element when no Cancel button is present", async () => {
    const { trigger, nameField } = createDialogFixture({ omitCancel: true });

    trigger.click();
    await flushDialogMicrotasks();

    expect(document.activeElement).toBe(nameField);
  });

  it("closes by default when Trigger is clicked while open", async () => {
    const { root, trigger, content } = createDialogFixture();

    trigger.click();
    await flushDialogMicrotasks();
    trigger.click();
    await flushDialogMicrotasks();

    expect(root.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(content.hidden).toBe(true);
    expect(content.hasAttribute("role")).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps the dialog closed when Trigger click is prevented", async () => {
    const { root, trigger, content } = createDialogFixture();
    trigger.addEventListener("click", (event) => event.preventDefault());

    trigger.click();
    await flushDialogMicrotasks();

    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(content.hasAttribute("role")).toBe(false);
  });

  it("does not close when close requests are prevented", async () => {
    const closeFixture = createDialogFixture();
    closeFixture.trigger.click();
    await flushDialogMicrotasks();
    closeFixture.close.addEventListener("click", (event) => event.preventDefault());
    closeFixture.close.click();
    await flushDialogMicrotasks();
    expect(closeFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const cancelFixture = createDialogFixture();
    cancelFixture.trigger.click();
    await flushDialogMicrotasks();
    cancelFixture.cancel.addEventListener("click", (event) => event.preventDefault());
    cancelFixture.cancel.click();
    await flushDialogMicrotasks();
    expect(cancelFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const actionFixture = createDialogFixture();
    actionFixture.trigger.click();
    await flushDialogMicrotasks();
    actionFixture.action.addEventListener("click", (event) => event.preventDefault());
    actionFixture.action.click();
    await flushDialogMicrotasks();
    expect(actionFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const overlayFixture = createDialogFixture();
    overlayFixture.trigger.click();
    await flushDialogMicrotasks();
    overlayFixture.overlay.addEventListener("click", (event) => event.preventDefault());
    overlayFixture.overlay.click();
    await flushDialogMicrotasks();
    expect(overlayFixture.root.open).toBe(true);
  });

  it("closes from Close, Cancel, Action, Overlay, and Escape by default", async () => {
    const closeFixture = createDialogFixture();
    closeFixture.trigger.click();
    await flushDialogMicrotasks();
    closeFixture.close.click();
    await flushDialogMicrotasks();
    expect(closeFixture.root.open).toBe(false);
    expect(closeFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const cancelFixture = createDialogFixture();
    cancelFixture.trigger.click();
    await flushDialogMicrotasks();
    cancelFixture.cancel.click();
    await flushDialogMicrotasks();
    expect(cancelFixture.root.open).toBe(false);
    expect(cancelFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const actionFixture = createDialogFixture();
    actionFixture.trigger.click();
    await flushDialogMicrotasks();
    actionFixture.action.click();
    await flushDialogMicrotasks();
    expect(actionFixture.root.open).toBe(false);
    expect(actionFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const overlayFixture = createDialogFixture();
    overlayFixture.trigger.click();
    await flushDialogMicrotasks();
    overlayFixture.overlay.click();
    await flushDialogMicrotasks();
    expect(overlayFixture.root.open).toBe(false);
    expect(overlayFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const escapeFixture = createDialogFixture();
    escapeFixture.trigger.click();
    await flushDialogMicrotasks();
    const escapeEvent = dispatchDialogKey(escapeFixture.content, "Escape");
    await flushDialogMicrotasks();
    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(escapeFixture.root.open).toBe(false);
    expect(escapeFixture.content.hidden).toBe(true);
  });

  it("does not close when Escape is prevented by keydown or escapekeydown", async () => {
    const keydownFixture = createDialogFixture();
    keydownFixture.trigger.click();
    await flushDialogMicrotasks();
    keydownFixture.content.addEventListener("keydown", (event) => event.preventDefault());
    dispatchDialogKey(keydownFixture.content, "Escape");
    await flushDialogMicrotasks();
    expect(keydownFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const escapeHookFixture = createDialogFixture();
    escapeHookFixture.trigger.click();
    await flushDialogMicrotasks();
    escapeHookFixture.content.addEventListener("escapekeydown", (event) => event.preventDefault());
    dispatchDialogKey(escapeHookFixture.content, "Escape");
    await flushDialogMicrotasks();
    expect(escapeHookFixture.root.open).toBe(true);
  });

  it("traps focus inside open Content", async () => {
    const { trigger, content, cancel, action, close, nameField } = createDialogFixture();

    trigger.click();
    await flushDialogMicrotasks();

    expect(document.activeElement).toBe(cancel);
    dispatchDialogKey(content, "Tab");
    expect(document.activeElement).toBe(action);
    dispatchDialogKey(content, "Tab");
    expect(document.activeElement).toBe(close);
    dispatchDialogKey(content, "Tab");
    expect(document.activeElement).toBe(nameField);
    dispatchDialogKey(content, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(close);
  });

  it("reports close requests without mutating controlled open state", async () => {
    const { root, trigger, content } = createDialogFixture({ open: true });
    const changes: boolean[] = [];

    root.addEventListener("openchange", (event) => {
      changes.push((event as CustomEvent).detail.open);
    });

    trigger.click();
    await flushDialogMicrotasks();

    expect(changes).toEqual([false]);
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
  });

  it("emits preventable open and close autofocus hooks", async () => {
    const { root, trigger, content, cancel } = createDialogFixture();
    const openAutoFocus = vi.fn((event: Event) => event.preventDefault());
    const closeAutoFocus = vi.fn((event: Event) => event.preventDefault());

    content.addEventListener("openautofocus", openAutoFocus);
    content.addEventListener("closeautofocus", closeAutoFocus);

    trigger.click();
    await flushDialogMicrotasks();
    expect(openAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(cancel);

    (root as unknown as { requestDialogClose(source: Element): boolean }).requestDialogClose(trigger);
    await flushDialogMicrotasks();
    expect(closeAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(trigger);
  });

  it("keeps force-mounted portal overlay and content mounted while closed", () => {
    const { portal, overlay, content } = createDialogFixture({ forceMount: true });

    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.hasAttribute("role")).toBe(false);
  });

  it("updates concatenated title and description references when content labels change", async () => {
    const { trigger, content, title, description } = createDialogFixture();
    const secondTitle = document.createElement("aria-dialog-title") as RuntimeElement;
    const secondDescription = document.createElement("aria-dialog-description") as RuntimeElement;

    secondTitle.textContent = "Second title";
    secondDescription.textContent = "Second description";
    content.append(secondTitle, secondDescription);

    trigger.click();
    await flushDialogMicrotasks();

    expect(content.getAttribute("aria-labelledby")).toBe(title.id + " " + secondTitle.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    secondTitle.remove();
    secondDescription.remove();
    await flushDialogMicrotasks();

    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
  });

  it("uses native dialog custom element hosts for root trigger portal overlay content title description action cancel and close", () => {
    const { root, trigger, portal, overlay, content, title, description, action, cancel, close } = createDialogFixture({ defaultOpen: true });

    expect(root.tagName.toLowerCase()).toBe("aria-dialog");
    expect(trigger.tagName.toLowerCase()).toBe("aria-dialog-trigger");
    expect(portal.tagName.toLowerCase()).toBe("aria-dialog-portal");
    expect(overlay.tagName.toLowerCase()).toBe("aria-dialog-overlay");
    expect(content.tagName.toLowerCase()).toBe("aria-dialog-content");
    expect(title.tagName.toLowerCase()).toBe("aria-dialog-title");
    expect(description.tagName.toLowerCase()).toBe("aria-dialog-description");
    expect(action.tagName.toLowerCase()).toBe("aria-dialog-action");
    expect(cancel.tagName.toLowerCase()).toBe("aria-dialog-cancel");
    expect(close.tagName.toLowerCase()).toBe("aria-dialog-close");
  });
`
      : "";
  const alertDialogSourceParityTest =
    spec.slug === "alert-dialog"
      ? `

  function createAlertDialogFixture(options: {
    defaultOpen?: boolean;
    disabledTrigger?: boolean;
    forceMount?: boolean;
    open?: boolean;
  } = {}) {
    ${defineFunctionName}();
    const root = document.createElement("aria-alert-dialog") as RuntimeElement;
    const trigger = document.createElement("aria-alert-dialog-trigger") as RuntimeElement;
    const portal = document.createElement("aria-alert-dialog-portal") as RuntimeElement;
    const overlay = document.createElement("aria-alert-dialog-overlay") as RuntimeElement;
    const content = document.createElement("aria-alert-dialog-content") as RuntimeElement;
    const icon = document.createElement("aria-alert-dialog-icon") as RuntimeElement;
    const title = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    const description = document.createElement("aria-alert-dialog-description") as RuntimeElement;
    const cancel = document.createElement("aria-alert-dialog-cancel") as RuntimeElement;
    const action = document.createElement("aria-alert-dialog-action") as RuntimeElement;

    trigger.textContent = "Open";
    icon.textContent = "!";
    title.textContent = "Delete item?";
    description.textContent = "This action cannot be undone.";
    cancel.textContent = "Cancel";
    action.textContent = "Delete";

    if (options.defaultOpen) {
      root.setAttribute("default-open", "");
    }

    if (options.open) {
      root.setAttribute("open", "");
    }

    if (options.disabledTrigger) {
      trigger.disabled = true;
    }

    if (options.forceMount) {
      portal.setAttribute("force-mount", "");
      overlay.setAttribute("force-mount", "");
      content.setAttribute("force-mount", "");
    }

    content.append(icon, title, description, cancel, action);
    portal.append(overlay, content);
    root.append(trigger, portal);
    document.body.append(root);

    return { root, trigger, portal, overlay, content, icon, title, description, cancel, action };
  }

  function flushAlertDialogMicrotasks() {
    return new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));
  }

  function dispatchAlertDialogKey(element: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  function wheelIsPrevented() {
    const event = new WheelEvent("wheel", { bubbles: true, cancelable: true });
    document.body.dispatchEvent(event);
    return event.defaultPrevented;
  }

  it("declares alert-dialog source defaults in componentSpec metadata", () => {
    expect(getPartSpec("Content").defaultAttributes).toMatchObject({
      "data-alert-dialog-content": "",
    });
    expect(getPartSpec("Icon").defaultAttributes).toMatchObject({
      "aria-hidden": "true",
    });
    expect(getPartSpec("Title").defaultAttributes).toMatchObject({
      "aria-level": "2",
    });
    expect(getPartSpec("Cancel").defaultAttributes).toMatchObject({
      "data-alert-dialog-cancel": "",
    });
  });

  it("matches the alert-dialog part and default semantics from the source spec", () => {
    const { root, trigger, content, icon, title, description, cancel, action } = createAlertDialogFixture({ forceMount: true });

    expect(root.hasAttribute("role")).toBe(false);
    expect(trigger.getAttribute("role")).toBe("button");
    expect(content.hasAttribute("role")).toBe(false);
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(title.getAttribute("role")).toBe("heading");
    expect(title.getAttribute("aria-level")).toBe("2");
    expect(description.hasAttribute("role")).toBe(false);
    expect(cancel.getAttribute("role")).toBe("button");
    expect(action.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("data-alert-dialog-cancel")).toBe("");
    expect(content.getAttribute("data-alert-dialog-content")).toBe("");
  });

  it("keeps content outside the alertdialog tree while closed", () => {
    const { trigger, portal, overlay, content } = createAlertDialogFixture();

    expect(document.body.querySelector("[role='alertdialog']")).toBeNull();
    expect(trigger.getAttribute("data-state")).toBe("closed");
    expect(portal.hidden).toBe(true);
    expect(overlay.hidden).toBe(true);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("closed");
  });

  it("opens from Trigger and exposes alertdialog semantics with title and description linkage", async () => {
    const { trigger, content, title, description, cancel } = createAlertDialogFixture();

    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("data-state")).toBe("open");
    expect(document.activeElement).toBe(cancel);
  });

  it("opens from Trigger keyboard activation with Enter and Space", async () => {
    const enterFixture = createAlertDialogFixture();

    enterFixture.trigger.focus();
    const enterKeyDown = dispatchAlertDialogKey(enterFixture.trigger, "Enter");
    await flushAlertDialogMicrotasks();

    expect(enterKeyDown.defaultPrevented).toBe(true);
    expect(enterFixture.root.open).toBe(true);
    expect(enterFixture.content.getAttribute("role")).toBe("alertdialog");
    expect(document.activeElement).toBe(enterFixture.cancel);

    document.body.replaceChildren();
    const spaceFixture = createAlertDialogFixture();

    spaceFixture.trigger.focus();
    const spaceKeyDown = dispatchAlertDialogKey(spaceFixture.trigger, " ");
    const spaceKeyUp = new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true });
    spaceFixture.trigger.dispatchEvent(spaceKeyUp);
    await flushAlertDialogMicrotasks();

    expect(spaceKeyDown.defaultPrevented).toBe(true);
    expect(spaceKeyUp.defaultPrevented).toBe(true);
    expect(spaceFixture.root.open).toBe(true);
    expect(spaceFixture.content.getAttribute("role")).toBe("alertdialog");
    expect(document.activeElement).toBe(spaceFixture.cancel);
  });

  it("keeps the dialog closed when Trigger click is prevented", async () => {
    const { trigger, content } = createAlertDialogFixture();
    trigger.addEventListener("click", (event) => event.preventDefault());

    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(content.hasAttribute("role")).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("supports default-open open state and controlled open state without requiring a Trigger", () => {
    const defaultOpen = createAlertDialogFixture({ defaultOpen: true });
    expect(defaultOpen.content.getAttribute("role")).toBe("alertdialog");
    expect(defaultOpen.trigger.getAttribute("data-state")).toBe("open");

    document.body.replaceChildren();
    ${defineFunctionName}();
    const controlledRoot = document.createElement("aria-alert-dialog") as RuntimeElement;
    const controlledContent = document.createElement("aria-alert-dialog-content") as RuntimeElement;
    const controlledTitle = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    controlledRoot.setAttribute("open", "");
    controlledTitle.textContent = "Controlled title";
    controlledContent.append(controlledTitle);
    controlledRoot.append(controlledContent);
    document.body.append(controlledRoot);

    expect(controlledContent.getAttribute("role")).toBe("alertdialog");
    expect(controlledContent.getAttribute("aria-labelledby")).toBe(controlledTitle.id);
    expect(controlledContent.hasAttribute("aria-describedby")).toBe(false);
  });

  it("closes from Cancel and Action and dispatches openchange before teardown", async () => {
    const { root, trigger, cancel, action, content } = createAlertDialogFixture();
    const changes: boolean[] = [];
    root.addEventListener("openchange", (event) => {
      changes.push((event as CustomEvent).detail.open);
    });

    trigger.click();
    await flushAlertDialogMicrotasks();
    cancel.click();
    await flushAlertDialogMicrotasks();

    expect(changes).toEqual([true, false]);
    expect(content.hasAttribute("role")).toBe(false);
    expect(content.hidden).toBe(true);

    trigger.click();
    await flushAlertDialogMicrotasks();
    action.click();
    await flushAlertDialogMicrotasks();

    expect(changes).toEqual([true, false, true, false]);
    expect(content.hasAttribute("role")).toBe(false);
  });

  it("keeps controlled open state rendered while reporting close requests", async () => {
    const { root, cancel, content } = createAlertDialogFixture({ open: true });
    const onOpenChange = vi.fn();
    root.addEventListener("openchange", (event) => {
      onOpenChange((event as CustomEvent).detail.open);
    });

    cancel.click();
    await flushAlertDialogMicrotasks();

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(root.open).toBe(true);
    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.hidden).toBe(false);
  });

  it("keeps the dialog open when Cancel or Action click is prevented", async () => {
    const { cancel, action, content } = createAlertDialogFixture({ defaultOpen: true });
    cancel.addEventListener("click", (event) => event.preventDefault());
    action.addEventListener("click", (event) => event.preventDefault());

    cancel.click();
    await flushAlertDialogMicrotasks();
    expect(content.getAttribute("role")).toBe("alertdialog");

    action.click();
    await flushAlertDialogMicrotasks();
    expect(content.getAttribute("role")).toBe("alertdialog");
  });

  it("closes on Escape while allowing keydown and escape-close prevention", async () => {
    const first = createAlertDialogFixture({ defaultOpen: true });
    dispatchAlertDialogKey(first.content, "Enter");
    await flushAlertDialogMicrotasks();
    expect(first.content.getAttribute("role")).toBe("alertdialog");

    dispatchAlertDialogKey(first.content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(first.content.hasAttribute("role")).toBe(false);

    document.body.replaceChildren();
    const keydownPrevented = createAlertDialogFixture({ defaultOpen: true });
    keydownPrevented.content.addEventListener("keydown", (event) => event.preventDefault());
    dispatchAlertDialogKey(keydownPrevented.content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(keydownPrevented.content.getAttribute("role")).toBe("alertdialog");

    document.body.replaceChildren();
    const escapePrevented = createAlertDialogFixture({ defaultOpen: true });
    escapePrevented.content.addEventListener("escapekeydown", (event) => event.preventDefault());
    dispatchAlertDialogKey(escapePrevented.content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(escapePrevented.content.getAttribute("role")).toBe("alertdialog");
  });

  it("traps focus within the open dialog and restores focus to the trigger on close", async () => {
    const { trigger, content, cancel, action } = createAlertDialogFixture();

    trigger.focus();
    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(document.activeElement).toBe(cancel);
    dispatchAlertDialogKey(cancel, "Tab");
    expect(document.activeElement).toBe(action);
    dispatchAlertDialogKey(action, "Tab");
    expect(document.activeElement).toBe(cancel);
    dispatchAlertDialogKey(cancel, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(action);

    dispatchAlertDialogKey(content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(document.activeElement).toBe(trigger);
  });

  it("does not restore focus to a disabled trigger", async () => {
    const { trigger, content } = createAlertDialogFixture({ defaultOpen: true, disabledTrigger: true });

    expect(trigger.disabled).toBe(true);
    dispatchAlertDialogKey(content, "Escape");
    await flushAlertDialogMicrotasks();

    expect(document.activeElement).not.toBe(trigger);
  });

  it("falls back to body focus when closing without a Trigger", async () => {
    ${defineFunctionName}();
    const root = document.createElement("aria-alert-dialog") as RuntimeElement;
    const content = document.createElement("aria-alert-dialog-content") as RuntimeElement;
    const title = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    const cancel = document.createElement("aria-alert-dialog-cancel") as RuntimeElement;

    root.setAttribute("default-open", "");
    title.textContent = "Delete item?";
    cancel.textContent = "Cancel";
    content.append(title, cancel);
    root.append(content);
    document.body.append(root);
    await flushAlertDialogMicrotasks();

    expect(document.activeElement).toBe(cancel);
    dispatchAlertDialogKey(content, "Escape");
    await flushAlertDialogMicrotasks();

    expect(content.hasAttribute("role")).toBe(false);
    expect(document.activeElement).toBe(document.body);
  });

  it("allows open and close autofocus to be prevented", async () => {
    const openFixture = createAlertDialogFixture();
    const openAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
    });
    openFixture.content.addEventListener("openautofocus", openAutoFocus);

    openFixture.trigger.click();
    await flushAlertDialogMicrotasks();

    expect(openAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(openFixture.cancel);

    document.body.replaceChildren();
    const closeFixture = createAlertDialogFixture();
    const closeAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
    });
    closeFixture.content.addEventListener("closeautofocus", closeAutoFocus);
    closeFixture.trigger.focus();
    closeFixture.trigger.click();
    await flushAlertDialogMicrotasks();
    closeFixture.cancel.click();
    await flushAlertDialogMicrotasks();

    expect(closeAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(closeFixture.trigger);
  });

  it("supports force-mounted closed portal overlay and content state", async () => {
    const { trigger, portal, overlay, content } = createAlertDialogFixture({ forceMount: true });

    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(overlay.getAttribute("data-state")).toBe("closed");
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.hasAttribute("role")).toBe(false);

    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("open");
    expect(content.hidden).toBe(false);
  });

  it("uses unique ids and concatenated labelling for multiple titles and descriptions", async () => {
    const { content, title, description } = createAlertDialogFixture({ defaultOpen: true });
    const secondTitle = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    const secondDescription = document.createElement("aria-alert-dialog-description") as RuntimeElement;
    secondTitle.textContent = "Secondary title";
    secondDescription.textContent = "Secondary description";
    content.insertBefore(secondTitle, description);
    content.append(secondDescription);
    await flushAlertDialogMicrotasks();

    expect(new Set([title.id, secondTitle.id]).size).toBe(2);
    expect(new Set([description.id, secondDescription.id]).size).toBe(2);
    expect(content.getAttribute("aria-labelledby")).toBe(title.id + " " + secondTitle.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    secondTitle.remove();
    await flushAlertDialogMicrotasks();
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);

    title.remove();
    await flushAlertDialogMicrotasks();
    expect(content.hasAttribute("aria-labelledby")).toBe(false);
    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    description.remove();
    secondDescription.remove();
    await flushAlertDialogMicrotasks();
    expect(content.hasAttribute("aria-describedby")).toBe(false);
  });

  it("keeps remaining description linkage when one of multiple descriptions unmounts", async () => {
    const { content, description } = createAlertDialogFixture({ defaultOpen: true });
    const secondDescription = document.createElement("aria-alert-dialog-description") as RuntimeElement;
    secondDescription.textContent = "Secondary description";
    content.append(secondDescription);
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    description.remove();
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("aria-describedby")).toBe(secondDescription.id);
  });

  it("marks background content inert while open and keeps it inert until the last dialog closes", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);
    const first = createAlertDialogFixture({ defaultOpen: true });
    const second = createAlertDialogFixture({ defaultOpen: true });
    await flushAlertDialogMicrotasks();

    expect(outside.hasAttribute("inert")).toBe(true);
    first.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(outside.hasAttribute("inert")).toBe(true);

    second.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(outside.hasAttribute("inert")).toBe(false);
  });

  it("locks viewport scroll while open and unlocks after the last dialog closes", async () => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "scroll";
    document.documentElement.style.overflow = "auto";

    expect(wheelIsPrevented()).toBe(false);

    const first = createAlertDialogFixture({ defaultOpen: true });
    const second = createAlertDialogFixture({ defaultOpen: true });
    await flushAlertDialogMicrotasks();

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(wheelIsPrevented()).toBe(true);
    const contentWheel = new WheelEvent("wheel", { bubbles: true, cancelable: true });
    first.content.dispatchEvent(contentWheel);
    expect(contentWheel.defaultPrevented).toBe(false);

    first.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(wheelIsPrevented()).toBe(true);

    second.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(wheelIsPrevented()).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.documentElement.style.overflow).toBe("auto");

    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
  });

  it("uses native Portal host placement instead of framework portal relocation", () => {
    const { root, portal, overlay, content } = createAlertDialogFixture({ defaultOpen: true });

    expect(root.contains(portal)).toBe(true);
    expect(portal.contains(overlay)).toBe(true);
    expect(portal.contains(content)).toBe(true);
    expect(overlay.parentElement).toBe(portal);
    expect(content.parentElement).toBe(portal);
    expect(document.body.contains(root)).toBe(true);
    expect(document.body.contains(overlay)).toBe(true);
    expect(document.body.contains(content)).toBe(true);
  });

  it("uses native alert-dialog custom element hosts for root trigger portal overlay content title description action and cancel", () => {
    const { root, trigger, portal, overlay, content, title, description, action, cancel } = createAlertDialogFixture({ defaultOpen: true });

    expect(root.tagName.toLowerCase()).toBe("aria-alert-dialog");
    expect(trigger.tagName.toLowerCase()).toBe("aria-alert-dialog-trigger");
    expect(portal.tagName.toLowerCase()).toBe("aria-alert-dialog-portal");
    expect(overlay.tagName.toLowerCase()).toBe("aria-alert-dialog-overlay");
    expect(content.tagName.toLowerCase()).toBe("aria-alert-dialog-content");
    expect(title.tagName.toLowerCase()).toBe("aria-alert-dialog-title");
    expect(description.tagName.toLowerCase()).toBe("aria-alert-dialog-description");
    expect(action.tagName.toLowerCase()).toBe("aria-alert-dialog-action");
    expect(cancel.tagName.toLowerCase()).toBe("aria-alert-dialog-cancel");
  });
`
      : "";
  return `import { ${vitestImports} } from "vitest";
import { componentSpec, ${createFunctionName}, ${defineFunctionName}, getPartSpec${sourceRuntimeImports}, type ComponentPartName } from "../src";

type RuntimeElement = HTMLElement & {
  checked: boolean;
  defaultChecked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  open: boolean;
  pressed: boolean;
  selected: boolean;
  value: string;${runtimeRatioProperty}
};

type RuntimePartSpec = {
  readonly name: string;
  readonly tagName: string;
  readonly defaultRole: string | null;
  readonly defaultAttributes: Readonly<Record<string, string>>;
};

type RuntimeElementList = [RuntimeElement, RuntimeElement, RuntimeElement, RuntimeElement, ...RuntimeElement[]];

const checkableRoles = new Set(["checkbox", "menuitemcheckbox", "menuitemradio", "radio", "switch"]);
const buttonLikeRoles = new Set(["button", "checkbox", "link", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch", "tab"]);
const expandableRoles = new Set(["button", "combobox", "menuitem"]);
const selectableRoles = new Set(["option", "row", "tab", "treeitem"]);
const focusableRoles = new Set(["button", "checkbox", "link", "menuitemcheckbox", "menuitemradio", "option", "switch", "tab"]);

function documentedRequirementAttributes() {
  const attributes = new Set<string>();
  const tagNames: ReadonlySet<string> = new Set(componentSpec.parts.map((part) => part.tagName));
  const attributePattern = /\\b(?:aria|data)-[a-z0-9-]+\\b|\\bnative-composition\\b|\\bdefault-open\\b|\\bdismissible\\b|\\btabIndex\\b|\\btabindex\\b|\\brole\\b|\\bid\\b|\\bdir\\b|\\borientation\\b|\\bdisabled\\b|\\brequired\\b|\\bvalue\\b|\\bopen\\b|\\bchecked\\b|\\bselected\\b|\\bpressed\\b/g;

  for (const section of componentSpec.learnedRequirements.sections) {
    for (const requirement of section.requirements) {
      for (const match of requirement.matchAll(attributePattern)) {
        const attribute = match[0] === "tabIndex" ? "tabindex" : match[0];
        if (!tagNames.has(attribute)) {
          attributes.add(attribute);
        }
      }
    }
  }

  return Array.from(attributes).sort();
}

function kebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\\s]+/g, "-").toLowerCase();
}

function appendPart(tagName: string) {
  const element = document.createElement(tagName) as RuntimeElement;
  document.body.append(element);
  return element;
}

describe("${spec.packageName}", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("${spec.packageName}");
    expect(componentSpec.slug).toBe("${spec.slug}");
    expect("sourcePackage" in componentSpec).toBe(false);
    expect(componentSpec.parts.length).toBeGreaterThan(0);
    expect(componentSpec.parts[0]?.name).toBe("${defaultPartName}");

    for (const part of componentSpec.parts) {
      expect(part.tagName).toMatch(/^aria-[a-z0-9-]+$/);
      expect("source" in part).toBe(false);
    }
  });

  it("maps documented spec attributes into runtime metadata", () => {
    const documentedAttributes = documentedRequirementAttributes();
    const specWithRequirements = componentSpec as typeof componentSpec & {
      requirementAttributes?: readonly string[];
      parts: readonly RuntimePartSpec[];
    };

    expect(specWithRequirements.requirementAttributes).toEqual(documentedAttributes);

    for (const part of specWithRequirements.parts) {
      expect(part.defaultAttributes).toBeDefined();

      for (const attribute of Object.keys(part.defaultAttributes)) {
        expect(documentedAttributes).toContain(attribute);
      }

      if (documentedAttributes.includes("aria-expanded") && part.defaultRole && expandableRoles.has(part.defaultRole)) {
        expect(part.defaultAttributes["aria-expanded"]).toBe("false");
      }

      if (documentedAttributes.includes("aria-selected") && part.defaultRole && selectableRoles.has(part.defaultRole)) {
        expect(part.defaultAttributes["aria-selected"]).toBe("false");
      }
    }
  });

  it("exposes helpers that resolve and create every spec part", () => {
    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);

      const element = ${createFunctionName}(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown ${spec.packageName} part");
  });

  it("defines all custom elements idempotently", () => {
    ${defineFunctionName}();
    ${defineFunctionName}();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    ${defineFunctionName}();
    const element = ${createFunctionName}();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("${spec.slug}");
    expect(element.getAttribute("data-part")).toBe("${defaultPartName}");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    ${defineFunctionName}();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("${spec.slug}");
      expect(element.getAttribute("data-package")).toBe("${spec.slug}");
      expect(element.getAttribute("data-part")).toBe(part.name);
      expect(element.getAttribute("part")).toBe(kebabCase(part.name));
      for (const [attribute, value] of Object.entries(runtimePart.defaultAttributes)) {
        expect(element.getAttribute(attribute)).toBe(value);
      }

      if (part.defaultRole) {
        expect(element.getAttribute("role")).toBe(part.defaultRole);
      } else {
        expect(element.hasAttribute("role")).toBe(false);
      }

      const roleOverride = document.createElement(part.tagName);
      roleOverride.setAttribute("role", "presentation");
      document.body.append(roleOverride);
      expect(roleOverride.getAttribute("role")).toBe("presentation");
    }
  });

  it("reflects shared state attributes required by the generated spec", () => {
    ${defineFunctionName}();
    const element = appendPart(componentSpec.parts[0]!.tagName);
    const rootPart = componentSpec.parts[0] as RuntimePartSpec;

    element.setAttribute("orientation", "vertical");
    element.value = "alpha";
    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.disabled = true;

    expect(element.getAttribute("data-orientation")).toBe("vertical");
    expect(element.getAttribute("data-value")).toBe("alpha");
    expect(element.getAttribute("data-state")).toBe("open");
${spec.slug === "dialog" ? '    expect(element.hasAttribute("aria-expanded")).toBe(false);' : '    expect(element.getAttribute("aria-expanded")).toBe("true");'}
    expect(element.getAttribute("aria-pressed")).toBe("true");
    expect(element.getAttribute("aria-selected")).toBe("true");
    expect(element.getAttribute("aria-disabled")).toBe("true");
    expect(element.getAttribute("data-disabled")).toBe("");

    element.removeAttribute("orientation");
    element.removeAttribute("value");
    element.open = false;
    element.pressed = false;
    element.selected = false;
    element.disabled = false;

    if (rootPart.defaultAttributes.orientation) {
      expect(element.getAttribute("data-orientation")).toBe(rootPart.defaultAttributes.orientation);
    } else {
      expect(element.hasAttribute("data-orientation")).toBe(false);
    }
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    ${defineFunctionName}();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !checkableRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      const defaultElement = document.createElement(part.tagName) as RuntimeElement;
      defaultElement.defaultChecked = true;
      document.body.append(defaultElement);

      expect(element.getAttribute("role")).toBe(role);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }
      expect(element.checked).toBe(false);
      expect(element.getAttribute("aria-checked")).toBe("false");
      expect(element.getAttribute("data-state")).toBe("unchecked");
      expect(defaultElement.checked).toBe(true);
      expect(defaultElement.getAttribute("aria-checked")).toBe("true");
      expect(defaultElement.getAttribute("data-state")).toBe("checked");

      element.checked = false;
      element.setAttribute("name", "field");
      element.setAttribute("required", "");
      element.value = "on";
      element.click();

      const hiddenInput = element.querySelector("input[data-ariaui-web-hidden-input='true']");

      expect(element.checked).toBe(true);
      expect(element.getAttribute("aria-checked")).toBe("true");
      expect(element.getAttribute("data-state")).toBe("checked");
      expect(hiddenInput).toBeInstanceOf(HTMLInputElement);
      expect(hiddenInput).toMatchObject({
        name: "field",
        required: true,
        value: "on",
      });

      element.indeterminate = true;
      expect(element.getAttribute("aria-checked")).toBe("mixed");
      expect(element.getAttribute("data-state")).toBe("indeterminate");
      element.click();

      expect(element.indeterminate).toBe(false);
      expect(element.checked).toBe(true);
      expect(element.getAttribute("aria-checked")).toBe("true");

      let clickCount = 0;
      element.disabled = true;
      element.addEventListener("click", () => {
        clickCount += 1;
      });
      element.click();

      expect(element.checked).toBe(true);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("-1");
      }
      expect(clickCount).toBe(0);

      element.removeAttribute("name");
      expect(element.querySelector("input[data-ariaui-web-hidden-input='true']")).toBeNull();
    }
  });

  it("implements expandable and selectable role reflection from the generated spec", () => {
    ${defineFunctionName}();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const role = part.defaultRole as string | null;

      if (role && expandableRoles.has(role)) {
        expect(element.getAttribute("aria-expanded")).toBe("false");
        element.open = true;
        expect(element.getAttribute("aria-expanded")).toBe("true");
        element.open = false;
        expect(element.getAttribute("aria-expanded")).toBe("false");
      }

      if (role && selectableRoles.has(role)) {
        expect(element.getAttribute("aria-selected")).toBe("false");
        element.selected = true;
        expect(element.getAttribute("aria-selected")).toBe("true");
        expect(element.getAttribute("data-state")).toBe("checked");
      }
    }
  });

  it("implements keyboard activation and disabled guards for button-like roles", () => {
    ${defineFunctionName}();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }

      if (role === "button") {
        element.pressed = true;
        element.click();
        expect(element.pressed).toBe(false);
      }

      let clickCount = 0;
      element.addEventListener("click", () => {
        clickCount += 1;
      });
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      const spaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
      element.dispatchEvent(spaceKeyDown);
      element.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }));

      expect(spaceKeyDown.defaultPrevented).toBe(true);
      expect(clickCount).toBe(2);

      element.disabled = true;
      const disabledKeyDown = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
      element.dispatchEvent(disabledKeyDown);
      element.click();

      expect(disabledKeyDown.defaultPrevented).toBe(true);
      expect(element.getAttribute("aria-disabled")).toBe("true");
      expect(element.getAttribute("data-disabled")).toBe("");
      expect(clickCount).toBe(2);
    }
  });
${accordionDocsExampleTest}${badgeSourceParityTest}${avatarSourceParityTest}${aspectRatioSourceParityTest}
${alertSourceParityTest}
${dialogSourceParityTest}
${alertDialogSourceParityTest}
});
`;
}

function specTestSource(spec) {
  const badgeSpecAssertions =
    spec.slug === "badge"
      ? `    expect(markdown).toContain("Badge Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/badge/__test__/badge.test.tsx");
    expect(markdown).toContain("- Source test cases: 10");
    expect(markdown).toContain("no default role, aria-label, focusability, or badge state attributes");
    expect(markdown).toContain("\`as=\\\"a\\\"\` and \`href\` provide native link-equivalent role");
    expect(markdown).toContain("\`as=\\\"button\\\"\` provides native button-equivalent role");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 10,
      learningSources: [
        "../ariaui/packages/badge/__test__/badge.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root renders a browser-native custom element host with no default role, aria-label, focusability, or badge state attributes",
      "\`as=\\\"a\\\"\` and \`href\` provide native link-equivalent role, focus, and keyboard activation on the custom element host",
      "docs examples include default, secondary, outline, destructive, with-icon, count, link, and verified badges with Heroicons-style SVGs",
    ]));
`
      : "";
  const avatarSpecAssertions =
    spec.slug === "avatar"
      ? `    expect(markdown).toContain("Avatar Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/avatar/__test__/avatar.test.tsx");
    expect(markdown).toContain("../ariaui/packages/avatar/__test__/avatar-examples.test.tsx");
    expect(markdown).toContain("- Source test cases: 36");
    expect(markdown).toContain("Root defaults to \`role=\\\"img\\\"\` and \`aria-label=\\\"avatar\\\"\` while fallback content is visible");
    expect(markdown).toContain("Image owns a real rendered \`<img>\`");
    expect(markdown).toContain("Group defaults to \`role=\\\"group\\\"\`");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 36,
      learningSources: [
        "../ariaui/packages/avatar/__test__/avatar.test.tsx",
        "../ariaui/packages/avatar/__test__/avatar-examples.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root defaults to \`role=\\\"img\\\"\` and \`aria-label=\\\"avatar\\\"\` while fallback content is visible",
      "Fallback renders while image status is not loaded and supports delayed rendering",
      "docs examples include with-image, initials-only, and overlapping group rows with \`/avatar.png\` media",
    ]));
`
      : "";
  const aspectRatioSpecAssertions =
    spec.slug === "aspect-ratio"
      ? `    expect(markdown).toContain("Aspect Ratio Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/aspect-ratio/__test__/aspect-ratio.test.tsx");
    expect(markdown).toContain("- Source test cases: 27");
    expect(markdown).toContain("private ratio shell and absolutely positioned fill layer");
    expect(markdown).toContain("native composition uses the first child element as the fill host");
    expect(markdown).toContain("no default ARIA role");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 27,
      learningSources: [
        "../ariaui/packages/aspect-ratio/__test__/aspect-ratio.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "\`resolveAspectRatio\` normalizes undefined, numeric, slash, colon, decimal, and invalid ratios",
      "Root constrains children with a private ratio shell and absolutely positioned fill layer",
      "Root has no default ARIA role, keyboard behavior, focus management, \`data-state\`, \`data-ratio\`, or \`data-slot\`",
    ]));
`
      : "";
  const accordionSpecAssertions =
    spec.slug === "accordion"
      ? `    expect(markdown).toContain("Accordion Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/accordion/__test__/accordion.test.tsx");
    expect(markdown).toContain("../ariaui/packages/accordion/__test__/accordion-aliases.test.tsx");
    expect(markdown).toContain("- Source test cases: 64");
    expect(markdown).toContain("controlled-style \`value\` and \`valuechange\` behavior");
    expect(markdown).toContain("default-open and force-mounted SSR-like serialized markup");
`
      : "";
  const alertSpecAssertions =
    spec.slug === "alert"
      ? `    expect(markdown).toContain("Alert Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/alert/__test__/alert.test.tsx");
    expect(markdown).toContain("../ariaui/packages/alert/__test__/accessibility.test.tsx");
    expect(markdown).toContain("- Source test cases: 19");
    expect(markdown).toContain("title and description ARIA linkage");
    expect(markdown).toContain("dismissible close and cancel behavior");
    expect(markdown).toContain("controlled-style \`open\` and \`openchange\` behavior");
    expect(componentSpec.requirementAttributes).toEqual(expect.arrayContaining([
      "aria-hidden",
      "aria-level",
      "data-alert-action",
      "data-dismissible",
      "data-state",
      "default-open",
      "dismissible",
      "native-composition",
      "tabindex",
    ]));
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 19,
      learningSources: [
        "../ariaui/packages/alert/__test__/alert.test.tsx",
        "../ariaui/packages/alert/__test__/accessibility.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "action content metadata and non-interactive action host behavior",
      "native composition equivalents for root, title, description, action, close, and cancel hosts",
      "controlled-style \`open\` and \`openchange\` behavior",
    ]));
`
      : "";
  const dialogSpecAssertions =
    spec.slug === "dialog"
      ? `    expect(markdown).toContain("Dialog Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/dialog/__test__/dialog.test.tsx");
    expect(markdown).toContain("- Source test cases: 29");
    expect(markdown).toContain("closed-by-default content that is outside the dialog accessibility tree");
    expect(markdown).toContain("trigger-open and trigger-close behavior");
    expect(markdown).toContain("controlled-style \`open\` and \`openchange\` behavior");
`
      : "";
  const alertDialogSpecAssertions =
    spec.slug === "alert-dialog"
      ? `    expect(markdown).toContain("Alert Dialog Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/alert-dialog/__test__/alert-dialog.test.tsx");
    expect(markdown).toContain("../ariaui/packages/alert-dialog/__test__/accessibility.test.tsx");
    expect(markdown).toContain("- Source test cases: 64");
    expect(markdown).toContain("focus trapping and trigger focus restoration");
    expect(markdown).toContain("reference-counted inert background and scroll locking");
    expect(markdown).toContain("controlled-style \`open\` and \`openchange\` behavior");
    expect(markdown).toContain("Portal host placement and \`force-mount\` behavior");
    expect(markdown).toContain("native custom element hosts, not framework portals");
    expect(markdown).not.toContain("container?: HTMLElement | null");
    expect(markdown).not.toContain("container ?? document.body");
`
      : "";
  const componentArchitectureAssertions =
    spec.kind === "component"
      ? `

  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const packageSlug = componentSpec.slug as string;
    const webComponentSource = packageSlug === "accordion" || packageSlug === "alert" || packageSlug === "alert-dialog"
      ? readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-web-component.ts"), "utf8")
      : "";

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    if (packageSlug === "accordion" || packageSlug === "alert" || packageSlug === "alert-dialog") {
      expect(webComponentSource).toContain("WebComponentPartSpec");
    } else {
      expect(elementSource).toContain("WebComponentPartSpec");
    }

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
    }

    if (packageSlug === "accordion") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");
      const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-dom.ts"), "utf8");
      const valuesSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-values.ts"), "utf8");
      const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-sync.ts"), "utf8");
      const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-actions.ts"), "utf8");
      const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
      const triggerSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Trigger.ts"), "utf8");
      const buttonSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Button.ts"), "utf8");

      expect(elementSource).not.toContain("syncAccordionTreeFromRoot");
      expect(elementSource).not.toContain("toggleAccordionItem");
      expect(elementSource).not.toContain("handleCompositeRovingFocus");
      expect(domSource).toContain("accordionRoot");
      expect(domSource).toContain("accordionTriggers");
      expect(domSource).not.toContain("accordionRootValues");
      expect(valuesSource).toContain("accordionValuesFromAttribute");
      expect(valuesSource).toContain("writeAccordionRootValue");
      expect(valuesSource).not.toContain("querySelectorAll");
      expect(syncSource).toContain("syncAccordionTreeFromRoot");
      expect(syncSource).toContain("syncAccordionItem");
      expect(syncSource).not.toContain("toggleAccordionItem");
      expect(actionsSource).toContain("toggleAccordionItem");
      expect(actionsSource).toContain("nextAccordionOpenState");
      expect(actionsSource).not.toContain("syncAccordionItem");
      expect(rootSource).toContain('from "../accordion-sync"');
      expect(triggerSource).toContain("handleCompositeRovingFocus");
      expect(triggerSource).toContain("toggleControlledElement");
      expect(triggerSource).toContain('from "../accordion-dom"');
      expect(triggerSource).toContain('from "../accordion-actions"');
      expect(buttonSource).toContain("extends AccordionTriggerElement");
      expect(utilsElementSource).not.toContain("syncAccordionTreeFromRoot");
      expect(utilsElementSource).not.toContain("toggleAccordionItem");
      expect(utilsElementSource).not.toContain("aria-accordion");
      for (const part of componentSpec.parts) {
        const partName = part.name as string;
        const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
        expect(partSource).not.toContain("createAccordionWebComponent");
        if (partName === "Button") {
          expect(partSource).toContain("extends AccordionTriggerElement");
        } else if (partName === "Panel") {
          expect(partSource).toContain("extends AccordionContentElement");
        } else {
          expect(partSource).toContain("extends AccordionElement");
        }
      }
    }

    if (packageSlug === "alert") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");
      const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "alert-dom.ts"), "utf8");
      const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "alert-sync.ts"), "utf8");
      const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "alert-actions.ts"), "utf8");
      const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
      const closeSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Close.ts"), "utf8");
      const cancelSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Cancel.ts"), "utf8");

      expect(elementSource).not.toContain("syncAlertTreeFromRoot");
      expect(elementSource).not.toContain("requestAlertDismiss");
      expect(elementSource).not.toContain("querySelectorAll");
      expect(domSource).toContain("alertRoot");
      expect(domSource).toContain("syncAlertCompositionHost");
      expect(domSource).not.toContain("requestAlertDismiss");
      expect(syncSource).toContain("syncAlertTreeFromRoot");
      expect(syncSource).toContain("syncAlertTreeAround");
      expect(syncSource).not.toContain("requestAlertDismissFromPart");
      expect(actionsSource).toContain("requestAlertDismiss");
      expect(actionsSource).toContain("requestAlertDismissFromPart");
      expect(actionsSource).not.toContain("syncAlertTreeFromRoot(root");
      expect(rootSource).toContain('from "../alert-sync"');
      expect(rootSource).toContain('from "../alert-actions"');
      expect(closeSource).toContain("requestAlertDismissFromPart");
      expect(cancelSource).toContain("requestAlertDismissFromPart");
      expect(utilsElementSource).not.toContain("syncAlertTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestAlertDismiss");
      expect(utilsElementSource).not.toContain("aria-alert");
      for (const part of componentSpec.parts) {
        const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
        expect(partSource).not.toContain("createAlertWebComponent");
        expect(partSource).toContain("extends AlertElement");
      }
    }

    if (packageSlug === "dialog") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncDialogTreeFromRoot");
      expect(elementSource).toContain("requestDialogOpen");
      expect(elementSource).toContain("requestDialogClose");
      expect(utilsElementSource).not.toContain("syncDialogTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestDialogOpen");
      expect(utilsElementSource).not.toContain("requestDialogClose");
      expect(utilsElementSource).not.toContain("aria-dialog");
    }

    if (packageSlug === "alert-dialog") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");
      const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "alert-dialog-dom.ts"), "utf8");
      const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "alert-dialog-sync.ts"), "utf8");
      const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "alert-dialog-actions.ts"), "utf8");
      const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
      const triggerSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Trigger.ts"), "utf8");
      const contentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Content.ts"), "utf8");
      const actionSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Action.ts"), "utf8");
      const cancelSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Cancel.ts"), "utf8");

      expect(elementSource).not.toContain("syncAlertDialogTreeFromRoot");
      expect(elementSource).not.toContain("requestAlertDialogOpen");
      expect(elementSource).not.toContain("requestAlertDialogClose");
      expect(elementSource).not.toContain("querySelectorAll");
      expect(domSource).toContain("alertDialogRoot");
      expect(domSource).toContain("alertDialogContent");
      expect(domSource).not.toContain("requestAlertDialogOpen");
      expect(syncSource).toContain("syncAlertDialogTreeFromRoot");
      expect(syncSource).toContain("syncAlertDialogContent");
      expect(syncSource).not.toContain("requestAlertDialogOpenFromPart");
      expect(actionsSource).toContain("requestAlertDialogOpen");
      expect(actionsSource).toContain("requestAlertDialogClose");
      expect(actionsSource).toContain("trapAlertDialogFocus");
      expect(actionsSource).not.toContain("syncAlertDialogContent");
      expect(rootSource).toContain('from "../alert-dialog-sync"');
      expect(rootSource).toContain('from "../alert-dialog-actions"');
      expect(triggerSource).toContain("requestAlertDialogOpenFromPart");
      expect(contentSource).toContain("handleAlertDialogContentKeyDown");
      expect(actionSource).toContain("requestAlertDialogCloseFromPart");
      expect(cancelSource).toContain("requestAlertDialogCloseFromPart");
      expect(utilsElementSource).not.toContain("syncAlertDialogTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestAlertDialogOpen");
      expect(utilsElementSource).not.toContain("requestAlertDialogClose");
      expect(utilsElementSource).not.toContain("aria-alert-dialog");
      for (const part of componentSpec.parts) {
        const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
        expect(partSource).not.toContain("createAlertDialogWebComponent");
        expect(partSource).toContain("extends AlertDialogElement");
      }
    }
  });
`
      : "";
  const defaultComponentArchitectureAssertions =
    spec.kind === "component"
      ? `

  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain("WebComponentPartSpec");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).toContain('from "../' + componentSpec.slug + '-element"');
      expect(partSource).not.toContain("createAriaWebComponent");
    }

    const packageSlug = componentSpec.slug as string;
    if (packageSlug === "accordion") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncAccordionTreeFromRoot");
      expect(elementSource).toContain("handleCompositeRovingFocus");
      expect(utilsElementSource).not.toContain("syncAccordionTreeFromRoot");
      expect(utilsElementSource).not.toContain("toggleAccordionItem");
      expect(utilsElementSource).not.toContain("aria-accordion");
    }

    if (packageSlug === "alert") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncAlertTreeFromRoot");
      expect(elementSource).toContain("requestAlertDismiss");
      expect(utilsElementSource).not.toContain("syncAlertTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestAlertDismiss");
      expect(utilsElementSource).not.toContain("aria-alert");
    }

    if (packageSlug === "dialog") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncDialogTreeFromRoot");
      expect(elementSource).toContain("requestDialogOpen");
      expect(elementSource).toContain("requestDialogClose");
      expect(utilsElementSource).not.toContain("syncDialogTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestDialogOpen");
      expect(utilsElementSource).not.toContain("requestDialogClose");
      expect(utilsElementSource).not.toContain("aria-dialog");
    }

    if (packageSlug === "alert-dialog") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncAlertDialogTreeFromRoot");
      expect(elementSource).toContain("requestAlertDialogOpen");
      expect(elementSource).toContain("requestAlertDialogClose");
      expect(utilsElementSource).not.toContain("syncAlertDialogTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestAlertDialogOpen");
      expect(utilsElementSource).not.toContain("requestAlertDialogClose");
      expect(utilsElementSource).not.toContain("aria-alert-dialog");
    }
  });
`
      : "";
  const badgeComponentArchitectureAssertions =
    spec.slug === "badge"
      ? `

  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "badge-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "badge-sync.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "badge-web-component.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("syncDefaultRole");
    expect(elementSource).not.toContain("createBadgeWebComponent");
    expect(domSource).toContain("badgeInteractiveRole");
    expect(domSource).toContain("isPreservedBadgeDataAttribute");
    expect(domSource).not.toContain("setAttribute");
    expect(syncSource).toContain("syncBadgeInteractiveSemantics");
    expect(syncSource).toContain("restoreBadgeConsumerDataAttributes");
    expect(syncSource).toContain("trackBadgeConsumerDataAttribute");
    expect(syncSource).not.toContain("extends AriaWebElement");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("badgePartConstructors");
    expect(rootSource).toContain("extends BadgeElement");
    expect(rootSource).toContain("getBadgePartSpec");
    expect(utilsElementSource).not.toContain("syncBadgeInteractiveSemantics");
    expect(utilsElementSource).not.toContain("restoreBadgeConsumerDataAttributes");
    expect(utilsElementSource).not.toContain("aria-badge");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createBadgeWebComponent");
      expect(partSource).toContain("extends BadgeElement");
    }
  });
`
      : "";
  const scopedComponentArchitectureAssertions = spec.slug === "badge"
    ? badgeComponentArchitectureAssertions
    : spec.slug === "accordion" || spec.slug === "alert" || spec.slug === "alert-dialog"
      ? componentArchitectureAssertions
      : defaultComponentArchitectureAssertions;

  return `import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { componentSpec } from "../src/component-spec";

function parsePartsTable(markdown: string) {
  const learnedSectionStart = markdown.indexOf("## Learned Native Requirements");
  const partsSection = markdown.slice(
    markdown.indexOf("## Parts"),
    learnedSectionStart === -1 ? markdown.indexOf("## Web Component Test Requirements") : learnedSectionStart,
  );
  const rows = partsSection
    .split("\\n")
    .filter((line) => line.startsWith("| ") && !line.includes("---"))
    .slice(1);

  return rows.map((row) => {
    const codeMarker = String.fromCharCode(96);
    const cells = row
      .slice(2, -2)
      .split(" | ")
      .map((cell) => (cell.startsWith(codeMarker) && cell.endsWith(codeMarker) ? cell.slice(1, -1) : cell));
    const [name = "", tagName = "", role = "none"] = cells;

    return {
      name,
      tagName,
      defaultRole: role === "none" ? null : role,
    };
  });
}

describe("${spec.packageName} readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("${spec.packageName}");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
  ${badgeSpecAssertions}${avatarSpecAssertions}${aspectRatioSpecAssertions}${accordionSpecAssertions}${alertSpecAssertions}${dialogSpecAssertions}${alertDialogSpecAssertions}    expect(markdown).toContain("- Kind: " + String.fromCharCode(96) + componentSpec.kind + String.fromCharCode(96));
    expect(componentSpec.learnedRequirements.learningSource).toContain("../ariaui/packages/" + componentSpec.slug);
    expect(componentSpec.learnedRequirements.coverage.coveredSections).toBe(componentSpec.learnedRequirements.sections.length);
    expect(componentSpec.learnedRequirements.coverage.coveredSections).toBe(componentSpec.learnedRequirements.coverage.sourceSections);
    expect(componentSpec.learnedRequirements.coverage.requirements).toBeGreaterThanOrEqual(componentSpec.learnedRequirements.sections.length);
    expect(markdown).toContain("- Coverage: " + componentSpec.learnedRequirements.coverage.coveredSections + " of " + componentSpec.learnedRequirements.coverage.sourceSections + " documented sections are represented after native normalization.");
    expect(markdown).not.toContain("Source package:");
    expect(markdown).not.toContain("Source Package Contract");
    expect(markdown).not.toContain("@ariaui/");
    expect(markdown).not.toMatch(/\\bReact\\b/);
    expect(markdown).not.toContain("react-dom");
    expect(markdown).not.toContain("Client Component");
    expect(markdown).not.toMatch(/\\basChild\\b/);
    expect(componentSpec.description).not.toMatch(/\\bReact\\b/);

    for (const section of componentSpec.learnedRequirements.sections) {
      expect(markdown).toContain("### " + section.title);
      expect(section.requirements.length).toBeGreaterThan(0);
      expect(section.sourceHeadingLevel).toBeGreaterThanOrEqual(1);
      expect(section.sourceHeadingLevel).toBeLessThanOrEqual(6);

      for (const requirement of section.requirements) {
        expect(markdown).toContain(requirement);
      }
    }

    const tableParts = parsePartsTable(markdown);
    const specKind = componentSpec.kind as string;

    if (specKind === "utility") {
      expect(tableParts).toEqual([
        {
          name: "Utility",
          tagName: "none",
          defaultRole: null,
        },
      ]);
      return;
    }

    expect(tableParts).toHaveLength(componentSpec.parts.length);

    for (const part of componentSpec.parts as ReadonlyArray<{ name: string; tagName: string; defaultRole: string | null }>) {
      const tablePart = tableParts.find((candidate) => candidate.name === part.name);
      expect(tablePart).toEqual({
        name: part.name,
        tagName: part.tagName,
        defaultRole: part.defaultRole,
      });
      expect(markdown).toContain(part.name);
      expect(markdown).toContain(part.tagName);
    }
  });
${scopedComponentArchitectureAssertions}
});
`;
}

function learnedRequirementsMarkdown(spec) {
  const sections = spec.learnedRequirements.sections
    .map(
      (section) => `### ${section.title}

${section.requirements.map((requirement) => `- ${requirement}`).join("\n")}`,
    )
    .join("\n\n");

  return `## Learned Native Requirements

- Learned from: \`${spec.learnedRequirements.learningSource}\`
- Native adaptation: requirements below are expressed for browser custom elements, attributes/properties, events, DOM structure, ARIA reflection, and package-level tests.
- Coverage: ${spec.learnedRequirements.coverage.coveredSections} of ${spec.learnedRequirements.coverage.sourceSections} documented sections are represented after native normalization.
- Requirement lines: ${spec.learnedRequirements.coverage.requirements}

${sections}`;
}

function accordionSourceTestParityMarkdown(spec) {
  if (spec.slug !== "accordion") {
    return "";
  }

  return `## Accordion Source Test Parity

- Learned from: \`../ariaui/packages/accordion/__test__/accordion.test.tsx\`
- Learned from aliases: \`../ariaui/packages/accordion/__test__/accordion-aliases.test.tsx\`
- Source test cases: 64
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, \`valuechange\` events, hidden state, and serialized markup instead of framework rendering helpers.
- Native accordion tests must cover:
- initial render and APG accessibility structure
- multiple and single uncontrolled state models
- controlled-style \`value\` and \`valuechange\` behavior
- collapsible and non-collapsible single-item behavior
- disabled item, disabled trigger, and root-disabled behavior
- heading, trigger, content, \`Button\`, and \`Panel\` alias semantics
- default \`dir\`, explicit \`dir\`, vertical navigation, horizontal LTR navigation, and horizontal RTL navigation
- DOM-order registration, nested item registration, duplicate value rejection, and value changes after mount
- default-open and force-mounted SSR-like serialized markup
- closed content hidden by default and disabled content metadata while mounted
- consumer event composition and \`preventDefault\` toggle guards
- native composition equivalents for root, item, heading, trigger, and content hosts where Web Components expose the host directly
- non-accordion key handling and focus stability
`;
}

function badgeSourceTestParityMarkdown(spec) {
  if (spec.slug !== "badge") {
    return "";
  }

  return `## Badge Source Test Parity

- Learned from: \`../ariaui/packages/badge/__test__/badge.test.tsx\`
- Source test cases: 10
- Native adaptation: assertions use browser-native custom elements, host attributes, DOM event listeners, reflected link/button-equivalent semantics, and static docs markup instead of framework rendering helpers.
- Native badge tests must cover:
- Root renders a browser-native custom element host with no default role, aria-label, focusability, or badge state attributes
- Root forwards id, title, data attributes, classes, inline styles, children, and consumer DOM events
- consumer-supplied ARIA roles and labels are preserved
- \`as="a"\` and \`href\` provide native link-equivalent role, focus, and keyboard activation on the custom element host
- \`as="button"\` provides native button-equivalent role, focus, click, Enter, and Space activation on the custom element host
- docs examples include default, secondary, outline, destructive, with-icon, count, link, and verified badges with Heroicons-style SVGs
`;
}

function avatarSourceTestParityMarkdown(spec) {
  if (spec.slug !== "avatar") {
    return "";
  }

  return `## Avatar Source Test Parity

- Learned from: \`../ariaui/packages/avatar/__test__/avatar.test.tsx\`
- Learned from examples: \`../ariaui/packages/avatar/__test__/avatar-examples.test.tsx\`
- Source test cases: 36
- Native adaptation: assertions use browser-native custom elements, a real internal \`<img>\`, reflected attributes, \`loadingstatuschange\` events, hidden fallback hosts, and generated docs media instead of framework props and rendering helpers.
- Native avatar tests must cover:
- Root defaults to \`role="img"\` and \`aria-label="avatar"\` while fallback content is visible
- Image owns a real rendered \`<img>\`, forwards image attributes, and hides it with \`aria-hidden\` plus \`visibility: hidden\` while loading or errored
- Fallback renders while image status is not loaded and supports delayed rendering
- load and error events update Root semantics, Fallback visibility, Image visibility, and loading status notifications
- changing \`src\` resets image status to loading and shows fallback again
- Root convenience \`src\`, \`alt\`, \`fallback\`, and \`fallback-delay-ms\` attributes render native Image and Fallback parts
- Group defaults to \`role="group"\` while allowing consumer role override
- docs examples include with-image, initials-only, and overlapping group rows with \`/avatar.png\` media
`;
}

function aspectRatioSourceTestParityMarkdown(spec) {
  if (spec.slug !== "aspect-ratio") {
    return "";
  }

  return `## Aspect Ratio Source Test Parity

- Learned from: \`../ariaui/packages/aspect-ratio/__test__/aspect-ratio.test.tsx\`
- Source test cases: 27
- Native adaptation: assertions use browser-native custom elements, inline ratio-shell styles, DOM child movement, and native media markup instead of framework rendering helpers.
- Native aspect-ratio tests must cover:
- \`resolveAspectRatio\` normalizes undefined, numeric, slash, colon, decimal, and invalid ratios
- Root constrains children with a private ratio shell and absolutely positioned fill layer
- consumer styles cannot override structural ratio shell or fill positioning
- native composition uses the first child element as the fill host while preserving the ratio shell
- Root has no default ARIA role, keyboard behavior, focus management, \`data-state\`, \`data-ratio\`, or \`data-slot\`
- media examples keep descriptive image alt text
`;
}

function alertSourceTestParityMarkdown(spec) {
  if (spec.slug !== "alert") {
    return "";
  }

  return `## Alert Source Test Parity

- Learned from: \`../ariaui/packages/alert/__test__/alert.test.tsx\`
- Learned from accessibility: \`../ariaui/packages/alert/__test__/accessibility.test.tsx\`
- Source test cases: 19
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, \`openchange\` events, hidden state, and custom-element host metadata instead of framework rendering helpers.
- Native alert tests must cover:
- root alert semantics and custom \`status\` live-region role override
- title and description ARIA linkage with generated unique ids
- action content metadata and non-interactive action host behavior
- \`defaultOpen\` native equivalent through \`default-open\`
- dismissible close and cancel behavior
- prevented close and cancel click guards
- controlled-style \`open\` and \`openchange\` behavior
- native composition equivalents for root, title, description, action, close, and cancel hosts
`;
}

function dialogSourceTestParityMarkdown(spec) {
  if (spec.slug !== "dialog") {
    return "";
  }

  return `## Dialog Source Test Parity

- Learned from: \`../ariaui/packages/dialog/__test__/dialog.test.tsx\`
- Source test cases: 29
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, \`openchange\` events, focus movement, hidden state, and native custom element hosts instead of framework rendering helpers.
- Native dialog tests must cover:
- closed-by-default content that is outside the dialog accessibility tree
- trigger-open and trigger-close behavior
- prevented trigger clicks
- uncontrolled \`default-open\`, controlled-style \`open\` and \`openchange\` behavior
- content \`role="dialog"\`, \`aria-modal\`, title linkage, and description linkage
- close, cancel, action, overlay, and Escape dismissal
- focus movement to Cancel or the first tabbable element and Trigger focus restoration
- force-mounted portal, overlay, and content hidden/ARIA state
- native composition equivalents for root, trigger, portal, overlay, content, title, description, action, cancel, and close hosts
`;
}

function alertDialogSourceTestParityMarkdown(spec) {
  if (spec.slug !== "alert-dialog") {
    return "";
  }

  return `## Alert Dialog Source Test Parity

- Learned from: \`../ariaui/packages/alert-dialog/__test__/alert-dialog.test.tsx\`
- Learned from accessibility: \`../ariaui/packages/alert-dialog/__test__/accessibility.test.tsx\`
- Source test cases: 64
- Native adaptation: assertions use browser-native custom elements, reflected attributes/properties, \`openchange\` events, focus movement, hidden state, inert markers, and native custom element hosts, not framework portals.
- Native alert-dialog tests must cover:
- closed-by-default content that is outside the alertdialog accessibility tree
- trigger-open behavior and prevented trigger clicks
- uncontrolled \`default-open\`, controlled-style \`open\` and \`openchange\` behavior
- content \`role="alertdialog"\`, \`aria-modal\`, title linkage, and description linkage
- cancel and action close behavior with \`preventDefault\` guards
- Escape dismissal, non-Escape key handling, and preventable Escape close hooks
- focus trapping and trigger focus restoration
- disabled trigger focus restoration guard
- force-mounted portal, overlay, and content hidden/ARIA state
- Portal host placement and \`force-mount\` behavior
- unique and concatenated title and description ids, including removal updates
- reference-counted inert background and scroll locking
- preventable \`openautofocus\` and \`closeautofocus\` custom events
- native composition equivalents for root, trigger, portal, overlay, content, title, description, action, and cancel hosts
`;
}

function componentSpecMarkdown(spec) {
  const partRows = spec.parts.length
    ? spec.parts.map((part) => `| ${part.name} | \`${part.tagName}\` | ${part.defaultRole ? `\`${part.defaultRole}\`` : "none"} |`).join("\n")
    : "| Utility | none | none |";
  const accordionSourceTestParity = accordionSourceTestParityMarkdown(spec);
  const badgeSourceTestParity = badgeSourceTestParityMarkdown(spec);
  const avatarSourceTestParity = avatarSourceTestParityMarkdown(spec);
  const aspectRatioSourceTestParity = aspectRatioSourceTestParityMarkdown(spec);
  const alertSourceTestParity = alertSourceTestParityMarkdown(spec);
  const dialogSourceTestParity = dialogSourceTestParityMarkdown(spec);
  const alertDialogSourceTestParity = alertDialogSourceTestParityMarkdown(spec);
  const accordionTestRequirement = spec.slug === "accordion" ? "- accordion source test parity remains documented and covered by package-level native tests\n" : "";
  const badgeTestRequirement = spec.slug === "badge" ? "- badge source test parity remains documented and covered by package-level native tests\n" : "";
  const avatarTestRequirement = spec.slug === "avatar" ? "- avatar source test parity remains documented and covered by package-level native tests\n" : "";
  const aspectRatioTestRequirement = spec.slug === "aspect-ratio" ? "- aspect-ratio source test parity remains documented and covered by package-level native tests\n" : "";
  const alertTestRequirement = spec.slug === "alert" ? "- alert source test parity remains documented and covered by package-level native tests\n" : "";
  const dialogTestRequirement = spec.slug === "dialog" ? "- dialog source test parity remains documented and covered by package-level native tests\n" : "";
  const alertDialogTestRequirement = spec.slug === "alert-dialog" ? "- alert-dialog source test parity remains documented and covered by package-level native tests\n" : "";

  return `# ${spec.name} Web Component Spec

## Native Web Component Contract

- Package: \`${spec.packageName}\`
- Kind: \`${spec.kind}\`

This file defines the browser-native custom element contract for this package. Tests in \`__test__\` assert that this spec, the public \`componentSpec\`, and the package implementation stay aligned.

## Parts

| Part | Custom element | Default role |
| --- | --- | --- |
${partRows}

${learnedRequirementsMarkdown(spec)}

${accordionSourceTestParity}${badgeSourceTestParity}${avatarSourceTestParity}${aspectRatioSourceTestParity}
${alertSourceTestParity}
${dialogSourceTestParity}
${alertDialogSourceTestParity}

## Web Component Test Requirements

Package-level tests must verify:
- package identity, kind, and parts are identical between this file and \`componentSpec\`
- every component part has a stable custom element tag
- learned native requirements are derived from local Aria UI package documentation and rendered in this spec
${accordionTestRequirement}${badgeTestRequirement}${avatarTestRequirement}${aspectRatioTestRequirement}${alertTestRequirement}${dialogTestRequirement}${alertDialogTestRequirement}- every component package registers custom elements idempotently
- every component package can create each custom element part through its public helpers
- custom elements reflect package, part, role, state, value, disabled, orientation, selection, and expansion attributes from the generated spec
- checkable parts support default checked state, click toggling, indeterminate state, ARIA checked state, and named hidden input sync
- button-like parts support Enter and Space keyboard activation and disabled activation guards
- utility packages expose their generated utility contract and keep \`readme.md\` aligned with \`componentSpec\`
`;
}

function writeComponentPackage(name, spec) {
  const packageRoot = join(targetPackages, name);
  resetDir(packageRoot);
  writeJson(join(packageRoot, "package.json"), packageJson(name, spec));
  writeJson(join(packageRoot, "tsconfig.json"), packageTsConfig());
  writeJson(join(packageRoot, "tsconfig.build.json"), packageBuildTsConfig());
  write(join(packageRoot, "readme.md"), componentSpecMarkdown(spec));
  write(join(packageRoot, "index.ts"), `export * from "./src/index";`);
  write(join(packageRoot, "src", "component-spec.ts"), componentSpecSource(spec));
  write(join(packageRoot, "src", "shared.ts"), componentSharedSource(spec));
  write(join(packageRoot, "src", "define.ts"), defineSource(spec));
  write(join(packageRoot, "src", "index.ts"), componentIndexSource(spec));
  write(join(packageRoot, "src", `${spec.slug}-element.ts`), componentElementSource(spec));
  if (spec.slug === "accordion") {
    write(join(packageRoot, "src", "accordion-actions.ts"), accordionActionsSource());
    write(join(packageRoot, "src", "accordion-dom.ts"), accordionDomSource());
    write(join(packageRoot, "src", "accordion-sync.ts"), accordionSyncSource());
    write(join(packageRoot, "src", "accordion-values.ts"), accordionValueSource());
    write(join(packageRoot, "src", "accordion-web-component.ts"), accordionWebComponentSource());
    write(join(packageRoot, "src", "parts", "part-spec.ts"), accordionPartSpecSource());
  }
  if (spec.slug === "badge") {
    write(join(packageRoot, "src", "badge-dom.ts"), badgeDomSource());
    write(join(packageRoot, "src", "badge-sync.ts"), badgeSyncSource());
    write(join(packageRoot, "src", "badge-web-component.ts"), badgeWebComponentSource());
    write(join(packageRoot, "src", "parts", "part-spec.ts"), badgePartSpecSource());
  }
  if (spec.slug === "alert") {
    write(join(packageRoot, "src", "alert-actions.ts"), alertActionsSource());
    write(join(packageRoot, "src", "alert-dom.ts"), alertDomSource());
    write(join(packageRoot, "src", "alert-sync.ts"), alertSyncSource());
    write(join(packageRoot, "src", "alert-web-component.ts"), alertWebComponentSource());
    write(join(packageRoot, "src", "parts", "part-spec.ts"), alertPartSpecSource());
  }
  if (spec.slug === "alert-dialog") {
    write(join(packageRoot, "src", "alert-dialog-actions.ts"), alertDialogActionsSource());
    write(join(packageRoot, "src", "alert-dialog-dom.ts"), alertDialogDomSource());
    write(join(packageRoot, "src", "alert-dialog-sync.ts"), alertDialogSyncSource());
    write(join(packageRoot, "src", "alert-dialog-web-component.ts"), alertDialogWebComponentSource());
    write(join(packageRoot, "src", "parts", "part-spec.ts"), alertDialogPartSpecSource());
  }

  for (const part of spec.parts) {
    write(join(packageRoot, "src", "parts", `${part.name}.ts`), partSource(spec, part));
  }

  write(join(packageRoot, "__test__", `${name}.test.ts`), componentTestSource(spec));
  write(join(packageRoot, "__test__", "component.spec.test.ts"), specTestSource(spec));
}

function writeUtilityPackage(name, spec) {
  const packageRoot = join(targetPackages, name);
  resetDir(packageRoot);
  writeJson(join(packageRoot, "package.json"), packageJson(name, spec));
  writeJson(join(packageRoot, "tsconfig.json"), packageTsConfig());
  writeJson(join(packageRoot, "tsconfig.build.json"), packageBuildTsConfig());
  write(join(packageRoot, "readme.md"), componentSpecMarkdown(spec));
  write(join(packageRoot, "index.ts"), `export * from "./src/index";`);
  write(join(packageRoot, "src", "component-spec.ts"), componentSpecSource(spec));
  write(join(packageRoot, "src", "index.ts"), `${utilitySource(name)}\nexport { componentSpec } from "./component-spec";`);
  if (name === "utils") {
    for (const [fileName, source] of Object.entries(utilsModuleSources())) {
      write(join(packageRoot, "src", fileName), source);
    }
  }
  write(join(packageRoot, "__test__", `${name}.test.ts`), utilityUnitTest(name));
  write(join(packageRoot, "__test__", "component.spec.test.ts"), specTestSource(spec));
}

function docsPackageJson(packageNames) {
  const packageDependencies = Object.fromEntries(
    packageNames
      .filter((name) => name !== "tsconfig")
      .map((name) => [`${packageScope}/${name}`, "workspace:*"]),
  );

  return {
    name: `${packageScope}/doc`,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vitepress dev docs",
      build: "vitepress build docs",
      preview: "vitepress preview docs",
      lint: "tsc --noEmit -p tsconfig.json",
      test: "vitest run --passWithNoTests",
      "test:watch": "vitest watch",
      clean: "rimraf docs/.vitepress/cache docs/.vitepress/dist",
    },
    dependencies: {
      ...packageDependencies,
      vitepress: "^1.6.3",
    },
    devDependencies: {
      "@types/node": "^24.1.0",
      typescript: typescriptVersion,
      vitest: "^2.1.9",
    },
    publishConfig: {
      access: "public",
    },
  };
}

function vitePressConfig(packageNames, specs) {
  const aliases = packageNames
    .map((name) => `      "${packageScope}/${name}": fileURLToPath(new URL("../../../../packages/${name}/src/index.ts", import.meta.url))`)
    .join(",\n");
  const overviewItems = [
    { text: "Introduction", link: "/overview/introduction" },
    { text: "Packages", link: "/overview/packages" },
    { text: "Testing", link: "/overview/testing" },
  ];
  const componentItems = specs
    .filter((spec) => !docsHiddenPackages.has(spec.slug))
    .map((spec) => ({ text: titleCase(spec.slug), link: `/components/${spec.slug}` }));

  return `import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Aria UI Web",
  description: "Web Component port of Aria UI packages.",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/overview/introduction" },
      { text: "Packages", link: "/overview/packages" },
      { text: "Components", link: "/components/accordion" },
    ],
    sidebar: [
      {
        text: "Overview",
        items: ${JSON.stringify(overviewItems, null, 8)},
      },
      {
        text: "Packages",
        items: ${JSON.stringify(componentItems, null, 8)},
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
${aliases}
      },
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("aria-"),
      },
    },
  },
});
`;
}

function docsTheme(packageNames) {
  const importLines = packageNames
    .filter((name) => !componentExcludedPackages.has(name))
    .map((name) => `import { define${pascalCase(name)}Elements } from "${packageScope}/${name}";`)
    .join("\n");
  const defineLines = packageNames
    .filter((name) => !componentExcludedPackages.has(name))
    .map((name) => `      define${pascalCase(name)}Elements();`)
    .join("\n");

  return `import DefaultTheme from "vitepress/theme";
import "./style.css";
${importLines}

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window !== "undefined") {
${defineLines}
    }
  },
};
`;
}

function docsStyle() {
  return `:root {
  --vp-c-brand-1: #0f766e;
  --vp-c-brand-2: #0d9488;
  --vp-c-brand-3: #14b8a6;
}

.VPDoc .content {
  max-width: 1120px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.ariaui-web-preview {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 1.5rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.ariaui-web-preview:not([data-component="alert"]):not([data-component="aspect-ratio"]):not([data-component="avatar"]):not([data-component="badge"]) [data-ariaui-web] {
  display: block;
  padding: 0.65rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="aspect-ratio"] {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  padding: 3rem;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="aspect-ratio"] .ariaui-web-aspect-ratio-frame {
  width: 100%;
  max-width: 21.875rem;
}

.ariaui-web-preview[data-component="aspect-ratio"] [data-example-part="Root"] {
  box-sizing: border-box;
  margin: 0 auto;
}

.ariaui-web-preview[data-component="aspect-ratio"] .ariaui-web-aspect-ratio-card {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 20%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--vp-c-bg) 90%, transparent);
  box-shadow: 0 10px 24px color-mix(in srgb, #000 14%, transparent);
  backdrop-filter: blur(16px);
}

.ariaui-web-preview[data-component="aspect-ratio"] img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
}

.ariaui-web-preview[data-component="aspect-ratio"] img.hidden {
  display: none;
}

html.dark .ariaui-web-preview[data-component="aspect-ratio"] .dark\\:hidden {
  display: none;
}

html.dark .ariaui-web-preview[data-component="aspect-ratio"] .dark\\:block {
  display: block;
}

.ariaui-web-preview[data-component="avatar"] {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  padding: 2.5rem 1.5rem;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="avatar"] [data-example-part] {
  box-sizing: border-box;
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Root"] {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  padding: 0;
  border: 2px solid var(--vp-c-bg);
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Image"] {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Image"] img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  object-fit: cover;
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Fallback"] {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Group"] {
  display: flex;
  align-items: center;
  padding-right: 0.75rem;
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Group"] > [data-example-part="Root"] {
  margin-left: -0.75rem;
}

.ariaui-web-preview[data-component="avatar"] [data-example-part="Group"] > [data-example-part="Root"]:first-child {
  margin-left: 0;
}

.ariaui-web-preview[data-component="badge"] {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  overflow: hidden;
  padding: 2.5rem 1.5rem;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="badge"] [data-example-part="Root"] {
  box-sizing: border-box;
  margin: 0;
  text-decoration: none;
}

.ariaui-web-preview[data-component="badge"] .inline-flex {
  display: inline-flex;
}

.ariaui-web-preview[data-component="badge"] .flex {
  display: flex;
}

.ariaui-web-preview[data-component="badge"] .flex-wrap {
  flex-wrap: wrap;
}

.ariaui-web-preview[data-component="badge"] .items-center {
  align-items: center;
}

.ariaui-web-preview[data-component="badge"] .justify-center {
  justify-content: center;
}

.ariaui-web-preview[data-component="badge"] .gap-1 {
  gap: 0.25rem;
}

.ariaui-web-preview[data-component="badge"] .gap-4 {
  gap: 1rem;
}

.ariaui-web-preview[data-component="badge"] .h-3 {
  height: 0.75rem;
}

.ariaui-web-preview[data-component="badge"] .w-3 {
  width: 0.75rem;
}

.ariaui-web-preview[data-component="badge"] .h-3\\.5 {
  height: 0.875rem;
}

.ariaui-web-preview[data-component="badge"] .w-3\\.5 {
  width: 0.875rem;
}

.ariaui-web-preview[data-component="badge"] .h-5 {
  height: 1.25rem;
}

.ariaui-web-preview[data-component="badge"] .min-w-5 {
  min-width: 1.25rem;
}

.ariaui-web-preview[data-component="badge"] .rounded-md {
  border-radius: 0.375rem;
}

.ariaui-web-preview[data-component="badge"] .rounded-full {
  border-radius: 9999px;
}

.ariaui-web-preview[data-component="badge"] .border {
  border-style: solid;
  border-width: 1px;
}

.ariaui-web-preview[data-component="badge"] .border-transparent {
  border-color: transparent;
}

.ariaui-web-preview[data-component="badge"] .border-border {
  border-color: var(--vp-c-divider);
}

.ariaui-web-preview[data-component="badge"] .bg-primary {
  background-color: var(--vp-c-brand-1);
}

.ariaui-web-preview[data-component="badge"] .bg-secondary {
  background-color: var(--vp-c-bg-soft);
}

.ariaui-web-preview[data-component="badge"] .bg-transparent {
  background-color: transparent;
}

.ariaui-web-preview[data-component="badge"] .bg-destructive {
  background-color: #dc2626;
}

.ariaui-web-preview[data-component="badge"] .px-1 {
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}

.ariaui-web-preview[data-component="badge"] .px-2\\.5 {
  padding-right: 0.625rem;
  padding-left: 0.625rem;
}

.ariaui-web-preview[data-component="badge"] .py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

.ariaui-web-preview[data-component="badge"] .text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.ariaui-web-preview[data-component="badge"] .text-\\[10px\\] {
  font-size: 10px;
}

.ariaui-web-preview[data-component="badge"] .font-semibold {
  font-weight: 600;
}

.ariaui-web-preview[data-component="badge"] .leading-none {
  line-height: 1;
}

.ariaui-web-preview[data-component="badge"] .text-primary-foreground,
.ariaui-web-preview[data-component="badge"] .text-destructive-foreground {
  color: #fff;
}

.ariaui-web-preview[data-component="badge"] .text-foreground {
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="badge"] .text-icon {
  color: currentColor;
}

.ariaui-web-preview[data-component="badge"] .shadow-sm {
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.ariaui-web-preview[data-component="badge"] .hover\\:bg-primary-hover:hover {
  background-color: var(--vp-c-brand-2);
}

.ariaui-web-preview[data-component="badge"] .hover\\:bg-secondary:hover,
.ariaui-web-preview[data-component="badge"] .hover\\:bg-secondary\\/80:hover {
  background-color: color-mix(in srgb, var(--vp-c-bg-soft) 80%, var(--vp-c-text-1) 6%);
}

.ariaui-web-preview[data-component="badge"] .hover\\:bg-destructive-hover:hover {
  background-color: #b91c1c;
}

.ariaui-web-preview[data-component="badge"] svg {
  display: block;
  flex-shrink: 0;
}

.ariaui-web-preview[data-component="badge"] [role="link"],
.ariaui-web-preview[data-component="badge"] [role="button"] {
  cursor: pointer;
}

.ariaui-web-preview[data-component="badge"] [role="link"]:focus-visible,
.ariaui-web-preview[data-component="badge"] [role="button"]:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.ariaui-web-preview[data-component="alert"] {
  place-items: center;
}

.ariaui-web-preview[data-component="alert"] [data-example-part="Root"] {
  box-sizing: border-box;
  display: block;
}

.ariaui-web-preview[data-component="alert"] [data-example-part="Title"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Description"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Action"] {
  display: block;
}

.ariaui-web-preview[data-component="alert"] [data-example-part="Action"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Cancel"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Close"],
.ariaui-web-preview[data-component="alert"] button {
  font: inherit;
  line-height: 1.25rem;
}

.ariaui-web-preview[data-component="alert"] [data-example-part="Cancel"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Close"],
.ariaui-web-preview[data-component="alert"] button {
  cursor: pointer;
}

.ariaui-web-preview[data-component="alert"] [data-example-part="Cancel"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Close"] {
  align-items: center;
  justify-content: center;
}

.ariaui-web-preview[data-component="alert"] .relative {
  position: relative;
}

.ariaui-web-preview[data-component="alert"] .flex {
  display: flex;
}

.ariaui-web-preview[data-component="alert"] .flex-wrap {
  flex-wrap: wrap;
}

.ariaui-web-preview[data-component="alert"] .items-start {
  align-items: flex-start;
}

.ariaui-web-preview[data-component="alert"] .gap-2 {
  gap: 0.5rem;
}

.ariaui-web-preview[data-component="alert"] .gap-3 {
  gap: 0.75rem;
}

.ariaui-web-preview[data-component="alert"] .w-full {
  width: 100%;
}

.ariaui-web-preview[data-component="alert"] .max-w-md {
  max-width: 28rem;
}

.ariaui-web-preview[data-component="alert"] .h-4 {
  height: 1rem;
}

.ariaui-web-preview[data-component="alert"] .w-4 {
  width: 1rem;
}

.ariaui-web-preview[data-component="alert"] .min-w-0 {
  min-width: 0;
}

.ariaui-web-preview[data-component="alert"] .flex-1 {
  flex: 1 1 0%;
}

.ariaui-web-preview[data-component="alert"] .shrink-0 {
  flex-shrink: 0;
}

.ariaui-web-preview[data-component="alert"] .space-y-1 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.25rem;
}

.ariaui-web-preview[data-component="alert"] .ml-2 {
  margin-left: 0.5rem;
}

.ariaui-web-preview[data-component="alert"] .mt-0\\.5 {
  margin-top: 0.125rem;
}

.ariaui-web-preview[data-component="alert"] .rounded-md {
  border-radius: 0.375rem;
}

.ariaui-web-preview[data-component="alert"] .rounded-lg {
  border-radius: 0.5rem;
}

.ariaui-web-preview[data-component="alert"] .border {
  border-style: solid;
  border-width: 1px;
}

.ariaui-web-preview[data-component="alert"] .border-border {
  border-color: var(--vp-c-divider);
}

.ariaui-web-preview[data-component="alert"] .bg-card,
.ariaui-web-preview[data-component="alert"] .bg-background {
  background-color: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="alert"] .p-1 {
  padding: 0.25rem;
}

.ariaui-web-preview[data-component="alert"] .px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.ariaui-web-preview[data-component="alert"] .px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.ariaui-web-preview[data-component="alert"] .py-1\\.5 {
  padding-bottom: 0.375rem;
  padding-top: 0.375rem;
}

.ariaui-web-preview[data-component="alert"] .py-3 {
  padding-bottom: 0.75rem;
  padding-top: 0.75rem;
}

.ariaui-web-preview[data-component="alert"] .pt-3 {
  padding-top: 0.75rem;
}

.ariaui-web-preview[data-component="alert"] .text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.ariaui-web-preview[data-component="alert"] .font-medium {
  font-weight: 500;
}

.ariaui-web-preview[data-component="alert"] .text-foreground {
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="alert"] .text-muted-foreground {
  color: var(--vp-c-text-2);
}

.ariaui-web-preview[data-component="alert"] .text-icon {
  color: var(--vp-c-text-2);
}

.ariaui-web-preview[data-component="alert"] .text-icon-success {
  color: #16a34a;
}

.ariaui-web-preview[data-component="alert"] .text-icon-warning {
  color: #d97706;
}

.ariaui-web-preview[data-component="alert"] .text-icon-destructive {
  color: #dc2626;
}

.ariaui-web-preview[data-component="alert"] .shadow-sm {
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.ariaui-web-preview[data-component="alert"] .hover\\:bg-muted:hover {
  background-color: var(--vp-c-bg-soft);
}

.ariaui-web-preview[data-component="alert"] .hover\\:text-foreground:hover {
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="alert"] svg {
  display: block;
}

.ariaui-web-preview[data-component="alert"] [data-example-part="Cancel"],
.ariaui-web-preview[data-component="alert"] [data-example-part="Close"] {
  display: inline-flex;
  background: transparent;
}

.ariaui-web-preview[data-component="alert"] button {
  appearance: none;
}

.ariaui-web-preview [hidden] {
  display: none !important;
}

.ariaui-web-preview [role="button"] {
  cursor: pointer;
}

.ariaui-web-preview[data-component="dialog"] {
  min-height: 14rem;
  place-items: center;
}

.ariaui-web-dialog-example {
  display: block;
}

.ariaui-web-preview .ariaui-web-dialog-example [data-ariaui-web] {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.ariaui-web-dialog-trigger,
.ariaui-web-dialog-button {
  display: inline-flex;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.ariaui-web-dialog-trigger:hover,
.ariaui-web-dialog-button:hover,
.ariaui-web-dialog-close:hover {
  background: var(--vp-c-bg-soft);
}

.ariaui-web-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgb(15 23 42 / 48%);
  backdrop-filter: blur(4px);
}

.ariaui-web-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1001;
  display: grid;
  width: min(calc(100vw - 2rem), 32rem);
  gap: 1rem;
  transform: translate(-50%, -50%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-4);
}

.ariaui-web-dialog-copy {
  display: grid;
  gap: 0.375rem;
  padding-right: 2rem;
}

.ariaui-web-dialog-example [data-part="Title"] {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.2;
}

.ariaui-web-dialog-example [data-part="Description"] {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.55;
}

.ariaui-web-dialog-form {
  display: grid;
  gap: 1rem;
  padding: 0.75rem 0;
}

.ariaui-web-dialog-field {
  display: grid;
  grid-template-columns: 6rem 1fr;
  align-items: center;
  gap: 1rem;
}

.ariaui-web-dialog-field label {
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: right;
}

.ariaui-web-dialog-field input {
  height: 2.25rem;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0 0.75rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
}

.ariaui-web-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.ariaui-web-dialog-button-primary {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.ariaui-web-dialog-button-primary:hover {
  background: var(--vp-c-brand-2);
}

.ariaui-web-dialog-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.ariaui-web-dialog-close svg {
  width: 1rem;
  height: 1rem;
}

.ariaui-web-dialog-motion-example [data-part="Overlay"][data-state="open"] {
  animation: ariaui-web-alert-dialog-fade-in 180ms ease-out;
}

.ariaui-web-dialog-motion-example [data-part="Content"][data-state="open"] {
  animation: ariaui-web-alert-dialog-zoom-in 180ms ease-out;
}

@media (max-width: 640px) {
  .ariaui-web-dialog-field {
    grid-template-columns: 1fr;
    gap: 0.375rem;
  }

  .ariaui-web-dialog-field label {
    text-align: left;
  }
}

.ariaui-web-preview[data-component="alert-dialog"] {
  min-height: 14rem;
  place-items: center;
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-example,
.ariaui-web-preview[data-component="alert-dialog"] [data-part="Portal"] {
  display: block;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-trigger,
.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-button {
  display: inline-flex;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-trigger:hover,
.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-button:hover {
  background: var(--vp-c-bg-soft);
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgb(15 23 42 / 48%);
  backdrop-filter: blur(4px);
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1001;
  width: min(calc(100vw - 2rem), 28rem);
  transform: translate(-50%, -50%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 24px 72px rgb(0 0 0 / 24%);
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-example [data-part="Title"] {
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-example [data-part="Description"] {
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-button-destructive {
  border-color: #dc2626;
  background: #dc2626;
  color: #fff;
}

.ariaui-web-preview[data-component="alert-dialog"] .ariaui-web-alert-dialog-button-destructive:hover {
  border-color: #b91c1c;
  background: #b91c1c;
}

.ariaui-web-alert-dialog-motion-example [data-part="Overlay"][data-state="open"] {
  animation: ariaui-web-alert-dialog-fade-in 180ms ease-out;
}

.ariaui-web-alert-dialog-motion-example [data-part="Content"][data-state="open"] {
  animation: ariaui-web-alert-dialog-zoom-in 180ms ease-out;
}

@keyframes ariaui-web-alert-dialog-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes ariaui-web-alert-dialog-zoom-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.ariaui-web-preview[data-component="accordion"] {
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  padding: 3.5rem 1rem;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] {
  padding: 2rem 0.25rem;
}

@media (min-width: 640px) {
  .ariaui-web-preview[data-component="accordion"] {
    padding-right: 3rem;
    padding-left: 3rem;
  }

  .ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"],
  .ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}

.ariaui-web-preview[data-component="accordion"] [data-example-part] {
  box-sizing: border-box;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  box-shadow: none;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Root"] {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="single"] [data-example-part="Root"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="multiple"] [data-example-part="Root"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="framer-motion"] [data-example-part="Root"] {
  display: block;
  width: 100%;
  max-width: 28rem;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="single"] [data-example-part="Item"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="multiple"] [data-example-part="Item"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="framer-motion"] [data-example-part="Item"] {
  display: block;
  overflow: hidden;
  border: 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Item"][data-state="open"] {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 70%, transparent);
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Item"]:last-child {
  border-bottom: 0;
  border-right: 0;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="single"] [data-example-part="Trigger"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="multiple"] [data-example-part="Trigger"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="framer-motion"] [data-example-part="Trigger"] {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1.35;
  text-align: left;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Trigger"]:hover {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 65%, transparent);
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Trigger"] svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: var(--vp-c-text-2);
  transition: color 160ms ease, transform 160ms ease;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Trigger"][aria-expanded="true"] svg {
  color: var(--vp-c-brand-1);
  transform: rotate(180deg);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="single"] [data-example-part="Content"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="multiple"] [data-example-part="Content"] {
  overflow: hidden;
  padding: 0 1.25rem 1.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.625;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="framer-motion"] [data-example-part="Content"] {
  max-height: 10rem;
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.625;
  opacity: 1;
  transition: max-height 180ms ease, opacity 180ms ease;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="framer-motion"] [data-example-part="Content"][data-state="closed"] {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="framer-motion"] [data-example-part="Content"] > div {
  padding: 0 1.25rem 1.25rem;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Root"] {
  display: flex;
  width: 100%;
  max-width: 44rem;
  height: 14rem;
  flex-direction: row;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Item"] {
  position: relative;
  display: flex;
  height: 14rem;
  min-width: 0;
  flex: 0 0 4rem;
  overflow: hidden;
  border: 0;
  border-right: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Item"][data-state="open"] {
  flex: 1 1 0;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Header"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Header"] {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 0;
  flex-shrink: 0;
  flex-direction: column;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Trigger"],
.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Trigger"] {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  text-align: left;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Trigger"] {
  gap: 1rem;
  padding: 1.5rem 0.5rem;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Trigger"] > span[class*="writing-vertical-rl"] {
  height: 100%;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Trigger"][data-state="open"] > span,
.ariaui-web-preview[data-component="accordion"] [data-example-part="Trigger"][aria-expanded="true"] > span {
  color: var(--vp-c-text-1);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Content"] {
  display: flex;
  height: 100%;
  min-width: 0;
  flex: 1 1 0;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Content"] > div,
.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Content"] > div {
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 1.25rem 2rem;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Content"] .space-y-0\\.5 {
  display: grid;
  gap: 0.125rem;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Content"] .space-y-0\\.5 span {
  display: block;
  color: var(--vp-c-text-1);
  font-size: clamp(2rem, 7vw, 2.25rem);
  font-weight: 650;
  letter-spacing: 0;
  line-height: 1;
}

.ariaui-web-preview[data-component="accordion"] [data-example-part="Content"] p {
  max-width: 18rem;
  margin: 0.75rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.625;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Root"] {
  display: flex;
  width: 100%;
  max-width: 44rem;
  height: 14rem;
  flex-direction: row;
  gap: 0;
  padding: 0;
  background: var(--vp-c-bg-soft);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Item"] {
  position: relative;
  display: flex;
  height: 100%;
  min-width: 0;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 6px;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Item"][data-state="open"] {
  flex: 1 1 0;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Trigger"] {
  padding: 1.5rem 0.5rem;
  color: var(--vp-c-text-2);
  transition: color 160ms ease, background-color 160ms ease;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Content"] {
  display: flex;
  width: auto;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  background: var(--vp-c-bg);
  opacity: 1;
  transition: width 180ms ease, opacity 180ms ease;
  visibility: visible;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Content"][data-state="closed"] {
  width: 0;
  opacity: 0;
  visibility: hidden;
}

.ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Content"] > div {
  width: 11rem;
  flex: 0 0 auto;
}

@media (min-width: 640px) {
  .ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Trigger"],
  .ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Trigger"] {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .ariaui-web-preview[data-component="accordion"][data-example-variant="horizontal"] [data-example-part="Content"] > div,
  .ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Content"] > div {
    padding: 1.5rem 2rem 2.5rem;
  }

  .ariaui-web-preview[data-component="accordion"][data-example-variant="fold"] [data-example-part="Content"] > div {
    width: 20rem;
  }
}
`;
}

function docsIndex(specs) {
  return `# Aria UI Web

Aria UI Web provides browser-native custom element packages under the \`${packageScope}\` scope. Every package has a native component spec, package-level unit tests, and documentation for the custom element API.

## Package coverage

- ${specs.length} packages under \`${packageScope}\`
- component packages expose separated custom-element part modules
- utility packages keep package-specific unit tests and native contract docs

[Start with the introduction](/overview/introduction) or [browse packages](/overview/packages).
`;
}

function introductionPage(specs) {
  return `# Introduction

Aria UI Web is a Web Component workspace for browser-native custom elements. It keeps package names and docs slugs under the \`${packageScope}\` scope while exposing a native custom-element runtime boundary.

The first implementation layer gives every package a tested contract:

- separated part modules such as \`Root\`, \`Trigger\`, \`Content\`, and \`Item\`
- idempotent \`define*Elements()\` registration functions
- a \`componentSpec\` export that maps package parts to custom element names
- a \`readme.md\` file that documents the native Web Component contract

The workspace currently contains ${specs.length} packages.
`;
}

function testingPage() {
  return `# Testing

Each package includes unit tests generated before the implementation surface:

- \`__test__/<package>.test.ts\` validates runtime behavior or utility helpers
- \`__test__/component.spec.test.ts\` validates the package spec file against \`componentSpec\`
- root \`pnpm test\` runs all package tests with Vitest and jsdom

This keeps package development TDD-friendly: extend the package spec, add the expected test, then deepen the implementation until the package passes.
`;
}

function packagesPage(specs) {
  const rows = specs
    .filter((spec) => !docsHiddenPackages.has(spec.slug))
    .map((spec) => `| [${spec.name}](/components/${spec.slug}) | \`${spec.packageName}\` | ${spec.kind} | ${spec.parts.length} |`)
    .join("\n");

  return `# Packages

| Package | Import | Kind | Parts |
| --- | --- | --- | ---: |
${rows}
`;
}

function sourceComponentPagePath(slug) {
  return join(sourceComponentPages, slug, "page.md");
}

function hasSourceComponentPage(slug) {
  return existsSync(sourceComponentPagePath(slug));
}

function expandSourcePartials(markdown, seen = new Set()) {
  return markdown.replace(/\{% partial file="([^"]+)" \/%%?\}/g, (match, file) => {
    const partialPath = join(sourceMarkdocPartials, file);
    if (!existsSync(partialPath)) {
      return `::: warning Missing source partial\n\`${displaySourcePath(partialPath)}\`\n:::\n`;
    }

    if (seen.has(partialPath)) {
      return `::: warning Circular source partial\n\`${displaySourcePath(partialPath)}\`\n:::\n`;
    }

    seen.add(partialPath);
    const expanded = expandSourcePartials(readFileSync(partialPath, "utf8"), seen);
    seen.delete(partialPath);
    return expanded;
  });
}

function sourceDemoFiles(slug) {
  const componentDir = join(sourceDocComponents, slug);
  if (!existsSync(componentDir)) {
    return [];
  }

  return readdirSync(componentDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name))
    .map((entry) => join(componentDir, entry.name))
    .sort();
}

function extractLiveExampleTags(markdown) {
  return Array.from(new Set(Array.from(markdown.matchAll(/\{% ([a-z0-9-]+(?:-demo|-live)) \/%%?\}/g)).map((match) => match[1]))).sort();
}

function extractSourceCodeSnippets(markdown) {
  const snippets = Array.from(markdown.matchAll(/```[A-Za-z0-9_-]*\n([\s\S]*?)```/g))
    .map((match) => match[1].trim())
    .filter(Boolean);

  for (const match of markdown.matchAll(/\{% doc-anatomy\s+([^%]*?)\/%%?\}/g)) {
    const attrs = parseMarkdocAttributes(match[1]);
    const snippet = attrs.slug ? sourceAnatomySnippets().get(attrs.slug) : null;
    if (snippet) {
      snippets.push(snippet.trim());
    }
  }

  for (const match of markdown.matchAll(/\{% doc-anatomy\s+([^%]*?)%\}[\s\S]*?\{% \/doc-anatomy %\}/g)) {
    const attrs = parseMarkdocAttributes(match[1]);
    const snippet = attrs.slug ? sourceAnatomySnippets().get(attrs.slug) : null;
    if (snippet) {
      snippets.push(snippet.trim());
    }
  }

  for (const match of markdown.matchAll(/\{% doc-installation\s+([^%]*?)\/%%?\}/g)) {
    const attrs = parseMarkdocAttributes(match[1]);
    if (attrs.package) {
      snippets.push(`npm install ${attrs.package}`);
      snippets.push(`pnpm add ${attrs.package}`);
      snippets.push(`yarn add ${attrs.package}`);
    }
  }

  return Array.from(new Set(snippets)).sort();
}

function sourceLiveExampleBlock(tag, slug) {
  const description = sourceDemoDescriptions().get(tag);
  const descriptionText = description ? `${description}\n\n` : "";

  return `::: info Reference live example: \`${tag}\`
${descriptionText}Reference Markdoc tag: \`{% ${tag} /%}\`.
:::`;
}

function sourceReferenceBlock(tag) {
  const title = tag.endsWith("-keyboard") ? "Reference keyboard table" : tag.includes("-api") ? "Reference API tag" : "Reference Markdoc tag";
  return `::: details ${title}: \`${tag}\`
Reference tag: \`{% ${tag} /%}\`.
:::`;
}

function sourceInstallationBlock(attrs) {
  const packageName = attrs.package ?? "PACKAGE_NAME";
  return `::: code-group

\`\`\`bash [npm]
npm install ${packageName}
\`\`\`

\`\`\`bash [pnpm]
pnpm add ${packageName}
\`\`\`

\`\`\`bash [yarn]
yarn add ${packageName}
\`\`\`

:::`;
}

function sourceAnatomyBlock(attrs) {
  const slug = attrs.slug ?? "";
  const snippet = sourceAnatomySnippets().get(slug);
  if (!snippet) {
    return sourceReferenceBlock(`doc-anatomy slug="${slug}"`);
  }

  return `\`\`\`tsx
${snippet.trim()}
\`\`\``;
}

function rewriteSourceDocsLinks(markdown) {
  return markdown
    .replace(/(\]\()\/docs\/components\/([a-z0-9-]+)(#[^)]+)?(\))/g, (_match, prefix, targetSlug, hash = "", suffix) => {
      if (existsSync(join(sourcePackages, targetSlug, "package.json"))) {
        return `${prefix}/components/${targetSlug}${hash}${suffix}`;
      }

      return `${prefix}https://ariaui.dev/docs/components/${targetSlug}${hash}${suffix}`;
    })
    .replace(/(\]\()\/docs\/overview\/([a-z0-9-]+)(#[^)]+)?(\))/g, (_match, prefix, targetSlug, hash = "", suffix) => {
      if (existsSync(join(docsRoot, "docs", "overview", `${targetSlug}.md`))) {
        return `${prefix}/overview/${targetSlug}${hash}${suffix}`;
      }

      return `${prefix}https://ariaui.dev/docs/overview/${targetSlug}${hash}${suffix}`;
    })
    .replace(/(href=")\/docs\/components\/([a-z0-9-]+)(#[^"]+)?(")/g, (_match, prefix, targetSlug, hash = "", suffix) => {
      if (existsSync(join(sourcePackages, targetSlug, "package.json"))) {
        return `${prefix}/components/${targetSlug}${hash}${suffix}`;
      }

      return `${prefix}https://ariaui.dev/docs/components/${targetSlug}${hash}${suffix}`;
    });
}

function transformSourceMarkdoc(markdown, slug) {
  return rewriteSourceDocsLinks(stripFrontmatter(markdown))
    .replace(/\{% doc-features %\}\n?/g, "")
    .replace(/\n?\{% \/doc-features %\}/g, "")
    .replace(/\{% doc-accessibility %\}\n?/g, "")
    .replace(/\n?\{% \/doc-accessibility %\}/g, "")
    .replace(/\{% callout([^%]*?)%\}([\s\S]*?)\{% \/callout %\}/g, (_match, rawAttrs, body) => {
      const attrs = parseMarkdocAttributes(rawAttrs);
      const type = attrs.type === "warning" ? "warning" : "tip";
      const title = attrs.title ? ` ${attrs.title}` : "";
      return `::: ${type}${title}\n${body.trim()}\n:::`;
    })
    .replace(/\{% doc-anatomy([^%]*?)%\}[\s\S]*?\{% \/doc-anatomy %\}/g, (_match, rawAttrs) => {
      return sourceAnatomyBlock(parseMarkdocAttributes(rawAttrs));
    })
    .replace(/\{% button([^%]*?)%\}([\s\S]*?)\{% \/button %\}/g, (_match, rawAttrs, body) => {
      const attrs = parseMarkdocAttributes(rawAttrs);
      return attrs.href ? `[${body.trim()}](${attrs.href})` : body.trim();
    })
    .replace(/\{% ([a-z0-9-]+)([^%]*?)\/%%?\}/g, (match, tag, rawAttrs) => {
      const attrs = parseMarkdocAttributes(rawAttrs);

      if (tag === "doc-installation") {
        return sourceInstallationBlock(attrs);
      }

      if (tag === "doc-anatomy") {
        return sourceAnatomyBlock(attrs);
      }

      if (tag === "doc-examples-intro") {
        return `The live examples below are reference entries for the \`${attrs.slug ?? slug}\` page.`;
      }

      if (/(?:-demo|-live)$/.test(tag)) {
        return sourceLiveExampleBlock(tag, slug);
      }

      return sourceReferenceBlock(tag);
    })
    .replace(new RegExp(`\\n{3,}`, "g"), "\n\n")
    .trim();
}

function sourceAlignedDoc(spec) {
  if (!hasSourceComponentPage(spec.slug)) {
    return null;
  }

  const pagePath = sourceComponentPagePath(spec.slug);
  const rawMarkdown = readFileSync(pagePath, "utf8");
  const metadata = parseFrontmatter(rawMarkdown);
  const expandedMarkdown = expandSourcePartials(rawMarkdown);
  const transformedMarkdown = transformSourceMarkdoc(expandedMarkdown, spec.slug);
  const demoFiles = sourceDemoFiles(spec.slug);
  const demoFileList = demoFiles.length
    ? demoFiles.map((file) => `- \`${displaySourcePath(file)}\``).join("\n")
    : `- \`${displaySourcePath(join(sourceDocComponents, spec.slug))}\``;

  return {
    pagePath,
    title: metadata.title || spec.name,
    description: metadata.description,
    markdown: transformedMarkdown,
    liveTags: extractLiveExampleTags(expandedMarkdown),
    codeSnippets: extractSourceCodeSnippets(expandedMarkdown),
    demoFileList,
  };
}

const accordionDocRootShell =
  "w-full max-w-md rounded-lg border border-border bg-background shadow-sm";
const accordionDocItemClass =
  "border-b border-border last:border-b-0 data-[state=open]:bg-muted/20";
const accordionDocTriggerClass =
  "group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50";
const accordionDocContentClass =
  "overflow-hidden px-5 pb-5 text-sm leading-relaxed font-normal text-muted-foreground";
const accordionDocChevronClass =
  "h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon";

const accordionDocHorizontalRootClass =
  "flex h-56 flex-row overflow-hidden rounded-lg border border-border bg-background shadow-sm";
const accordionDocHorizontalItemClass =
  "group relative flex h-56 min-w-0 overflow-hidden border-r border-border last:border-r-0 data-[state=closed]:shrink-0 data-[state=open]:w-auto data-[state=open]:flex-1 bg-background";
const accordionDocHorizontalHeaderClass =
  "relative z-10 flex min-h-0 shrink-0 flex-col";
const accordionDocHorizontalTriggerClass =
  "flex h-full w-full items-center justify-center gap-4 px-2 py-6 text-left hover:bg-muted/50 data-[state=open]:flex-row data-[state=open]:gap-3 sm:px-4";
const accordionDocHorizontalTriggerLabelClass =
  "h-full select-none text-xs font-bold uppercase tracking-widest text-muted-foreground writing-vertical-rl group-data-[state=open]:text-foreground";
const accordionDocHorizontalContentClass =
  "flex h-full min-w-0 flex-1 overflow-hidden bg-background";
const accordionDocHorizontalContentInnerClass =
  "flex h-full min-w-0 w-full flex-col justify-center px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6";
const accordionDocHorizontalHeadlineLineClass =
  "block text-4xl font-semibold leading-none tracking-tight text-foreground";
const accordionDocHorizontalSublineClass =
  "mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground";

const accordionDocFoldRootClass =
  "flex h-56 w-full flex-row gap-0 overflow-hidden rounded-lg border border-border bg-muted p-0 shadow-sm sm:gap-1 sm:p-1";
const accordionDocFoldItemClass =
  "group relative flex h-full min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-sm data-[state=open]:flex-1";
const accordionDocFoldHeaderClass =
  "relative z-20 flex min-h-0 shrink-0 flex-col";
const accordionDocFoldTriggerClass =
  "flex h-full w-full items-center justify-center px-2 py-6 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground sm:px-4";
const accordionDocFoldTriggerLabelClass =
  "h-full select-none text-xs font-bold uppercase tracking-widest writing-vertical-rl";
const accordionDocFoldContentClass =
  "flex h-full min-w-0 overflow-hidden bg-background transition-[width,opacity] duration-200 ease-out data-[state=closed]:w-0 data-[state=closed]:opacity-0 data-[state=open]:w-auto data-[state=open]:opacity-100";
const accordionDocFoldContentInnerClass =
  "flex h-full min-w-0 w-44 shrink-0 flex-col justify-center px-5 pb-8 pt-4 sm:w-xs sm:px-8 sm:pb-10 sm:pt-6";
const accordionDocMotionContentClass =
  "overflow-hidden text-sm leading-relaxed font-normal text-muted-foreground transition-[max-height,opacity] duration-200 ease-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-40 data-[state=open]:opacity-100";

function accordionChevronSvg() {
  return `<svg aria-hidden="true" class="${accordionDocChevronClass}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
          </svg>`;
}

function accordionVerticalItemMarkup(item, { idPrefix = "accordion", motion = false } = {}) {
  const triggerId = `${idPrefix}-${item.value}-trigger`;
  const panelId = `${idPrefix}-${item.value}-panel`;
  const contentAttributes = `${item.open ? " open" : " hidden"}${motion ? " force-mount" : ""}`;
  const content = motion
    ? `<div class="px-5 pb-5">${item.content}</div>`
    : item.content;
  const contentClass = motion ? accordionDocMotionContentClass : accordionDocContentClass;

  return `<aria-accordion-item class="${accordionDocItemClass}" data-example-part="Item" value="${item.value}">
      <aria-accordion-header data-example-part="Header">
        <aria-accordion-trigger class="${accordionDocTriggerClass}" data-example-part="Trigger" id="${triggerId}" aria-controls="${panelId}"${item.open ? " open" : ""}>
          <span class="min-w-0">${item.title}</span>
          ${accordionChevronSvg()}
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="${contentClass}" data-example-part="Content" id="${panelId}" aria-labelledby="${triggerId}"${contentAttributes}>
        ${content}
      </aria-accordion-content>
    </aria-accordion-item>`;
}

function accordionVerticalMarkup(items, { rootAttributes, idPrefix, motion = false }) {
  return `<aria-accordion class="${accordionDocRootShell}" data-example-part="Root" ${rootAttributes}>
    ${items.map((item) => accordionVerticalItemMarkup(item, { idPrefix, motion })).join("\n    ")}
  </aria-accordion>`;
}

function accordionPreviewExampleMarkup() {
  return accordionVerticalMarkup([
    {
      value: "accessible",
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
      open: true,
    },
    {
      value: "styled",
      title: "Is it styled?",
      content: "Yes. It comes with default styles that match the other components' aesthetic.",
    },
    {
      value: "animated",
      title: "Is it animated?",
      content: "Yes. It's animated by default, but you can disable it if you prefer.",
    },
  ], {
    rootAttributes: 'type="single" collapsible="true" default-value="accessible"',
    idPrefix: "accordion",
  });
}

function accordionPreviewBlock(variant, markup) {
  const className = variant === "horizontal" || variant === "fold"
    ? "ariaui-web-preview flex w-full justify-center overflow-hidden bg-background px-1 py-8 sm:px-4"
    : "ariaui-web-preview flex w-full justify-center overflow-hidden bg-background py-14 sm:px-12";

  return `<div class="${className}" data-component="accordion" data-example-variant="${variant}">
  ${markup}
</div>`;
}

function accordionMultipleExampleMarkup() {
  return accordionVerticalMarkup([
    {
      value: "multiple-open",
      title: "Can I open multiple items?",
      content: "Yes. Set type to multiple so more than one section can stay open. Pass defaultValue as an array to open specific panels on first render.",
      open: true,
    },
    {
      value: "accessible",
      title: "Is it accessible?",
      content: "Yes. It follows the WAI-ARIA accordion pattern with keyboard support and appropriate roles.",
      open: true,
    },
    {
      value: "animated",
      title: "Can it be animated?",
      content: "You can animate height with CSS, Framer Motion, or any library. The headless API exposes open state via data attributes.",
    },
  ], {
    rootAttributes: 'type="multiple" default-value="multiple-open,accessible"',
    idPrefix: "accordion-multiple",
  });
}

function accordionHorizontalContentMarkup(item, innerClass) {
  return `<div class="${innerClass}">
          <div class="space-y-0.5">
            ${item.headlineLines.map((line) => `<span class="${accordionDocHorizontalHeadlineLineClass}">${line}</span>`).join("\n            ")}
          </div>
          <p class="${accordionDocHorizontalSublineClass}">${item.subline}</p>
        </div>`;
}

function accordionHorizontalExampleMarkup({ fold = false } = {}) {
  const idPrefix = fold ? "accordion-fold" : "accordion-horizontal";
  const rootClass = fold ? accordionDocFoldRootClass : accordionDocHorizontalRootClass;
  const itemClass = fold ? accordionDocFoldItemClass : accordionDocHorizontalItemClass;
  const headerClass = fold ? accordionDocFoldHeaderClass : accordionDocHorizontalHeaderClass;
  const triggerClass = fold ? accordionDocFoldTriggerClass : accordionDocHorizontalTriggerClass;
  const labelClass = fold ? accordionDocFoldTriggerLabelClass : accordionDocHorizontalTriggerLabelClass;
  const contentClass = fold ? accordionDocFoldContentClass : accordionDocHorizontalContentClass;
  const contentInnerClass = fold ? accordionDocFoldContentInnerClass : accordionDocHorizontalContentInnerClass;
  const contentAttribute = fold ? " force-mount" : "";
  const items = [
    {
      value: "overview",
      label: "Overview",
      headlineLines: ["Project", "Overview"],
      subline: "View key metrics, recent activity, and important notifications at a glance.",
      open: true,
    },
    {
      value: "analytics",
      label: "Analytics",
      headlineLines: ["Real-time", "Analytics"],
      subline: "Track performance metrics, user engagement, and conversion rates.",
    },
    {
      value: "reports",
      label: "Reports",
      headlineLines: ["Generate", "Reports"],
      subline: "Create and export custom reports with filtering and scheduling options.",
    },
    {
      value: "settings",
      label: "Settings",
      headlineLines: ["Configure", "Settings"],
      subline: "Manage account preferences, integrations, and team permissions.",
    },
  ];

  return `<aria-accordion class="${rootClass}" data-example-part="Root" type="single" default-value="overview" orientation="horizontal"${fold ? ' collapsible="true"' : ""}>
    ${items.map((item) => {
      const triggerId = `${idPrefix}-${item.value}-trigger`;
      const panelId = `${idPrefix}-${item.value}-panel`;
      return `<aria-accordion-item class="${itemClass}" data-example-part="Item" value="${item.value}">
      <aria-accordion-header class="${headerClass}" data-example-part="Header">
        <aria-accordion-trigger class="${triggerClass}" data-example-part="Trigger" id="${triggerId}" aria-controls="${panelId}"${item.open ? " open" : ""}>
          <span class="${labelClass}">${item.label}</span>
        </aria-accordion-trigger>
      </aria-accordion-header>
      <aria-accordion-content class="${contentClass}" data-example-part="Content" id="${panelId}" aria-labelledby="${triggerId}"${item.open ? " open" : " hidden"}${contentAttribute}>
        ${accordionHorizontalContentMarkup(item, contentInnerClass)}
      </aria-accordion-content>
    </aria-accordion-item>`;
    }).join("\n    ")}
  </aria-accordion>`;
}

function accordionFramerMotionExampleMarkup() {
  return accordionVerticalMarkup([
    {
      value: "accessible",
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
      open: true,
    },
    {
      value: "styled",
      title: "Is it styled?",
      content: "Yes. It comes with default styles that match the other components' aesthetic.",
    },
    {
      value: "animated",
      title: "Is it animated?",
      content: "Yes. It's animated by default, but you can disable it if you prefer.",
    },
  ], {
    rootAttributes: 'type="single" collapsible="true" default-value="accessible"',
    idPrefix: "accordion-motion",
    motion: true,
  });
}

function webComponentPartRows(spec) {
  return spec.parts.length
    ? spec.parts.map((part) => `| ${part.name} | \`${part.tagName}\` | ${part.defaultRole ? `\`${part.defaultRole}\`` : "none"} |`).join("\n")
    : "| Utility | none | none |";
}

function webComponentContractSection(spec) {
  const defineFunctionName = `define${pascalCase(spec.slug)}Elements`;
  const partPreview =
    spec.slug === "accordion"
      ? accordionPreviewExampleMarkup()
      : spec.parts.length
        ? spec.parts
            .slice(0, Math.min(4, spec.parts.length))
            .map((part) => `<${part.tagName} class="ariaui-web-example" data-example-part="${part.name}">${part.name}</${part.tagName}>`)
            .join("\n  ")
        : `<pre class="ariaui-web-example" data-example-part="Utility">${spec.name} is a utility package.</pre>`;
  const partRows = webComponentPartRows(spec);

  return `## Web Component Contract

\`${spec.packageName}\` defines browser-native custom elements. Import the package and register its elements once before using the tags.

### Preview

<div class="ariaui-web-preview" data-component="${spec.slug}">
  ${partPreview}
</div>

### Markup

\`\`\`html
${partPreview}
\`\`\`

### Parts

| Part | Custom element | Default role |
| --- | --- | --- |
${partRows}

### Usage

\`\`\`ts
import { ${defineFunctionName} } from "${spec.packageName}";

${defineFunctionName}();
\`\`\`

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.
`;
}

function nativeInstallationSection(spec) {
  const defineFunctionName = `define${pascalCase(spec.slug)}Elements`;

  return `## Installation

::: code-group

\`\`\`bash [npm]
npm install ${spec.packageName}
\`\`\`

\`\`\`bash [pnpm]
pnpm add ${spec.packageName}
\`\`\`

\`\`\`bash [yarn]
yarn add ${spec.packageName}
\`\`\`

:::

### Register Elements

\`\`\`ts
import { ${defineFunctionName} } from "${spec.packageName}";

${defineFunctionName}();
\`\`\``;
}

function accordionFeaturesSection() {
  return `## Features

- **Vertical or horizontal**
- **Single or multiple**
- **Collapsible**
- **Controlled or uncontrolled**
- **Headless**`;
}

function accordionExamplesSection() {
  const singlePreview = accordionPreviewExampleMarkup();
  const multiplePreview = accordionMultipleExampleMarkup();
  const horizontalPreview = accordionHorizontalExampleMarkup();
  const foldPreview = accordionHorizontalExampleMarkup({ fold: true });
  const framerMotionPreview = accordionFramerMotionExampleMarkup();

  return `## Examples

The live examples below are native custom element entries for the \`accordion\` page, matching the source Aria UI examples.

### Single

${accordionPreviewBlock("single", singlePreview)}

\`\`\`html
${singlePreview}
\`\`\`

### Multiple

Use \`type="multiple"\` and a comma-separated \`default-value\` or \`value\` to keep more than one item open.

${accordionPreviewBlock("multiple", multiplePreview)}

\`\`\`html
${multiplePreview}
\`\`\`

### Horizontal

Set \`orientation="horizontal"\` for horizontal roving-focus key mapping and horizontal styling hooks.

${accordionPreviewBlock("horizontal", horizontalPreview)}

\`\`\`html
${horizontalPreview}
\`\`\`

### Fold Effect

Fold-style examples should keep content mounted and animate dimensions from the \`data-state\` and \`data-orientation\` attributes.

${accordionPreviewBlock("fold", foldPreview)}

\`\`\`html
${foldPreview}
\`\`\`

### Framer Motion

Animation libraries can target the native content element or a child wrapper. Use \`force-mount\` when closed panels must remain in the DOM for exit animations.

${accordionPreviewBlock("framer-motion", framerMotionPreview)}

\`\`\`html
${framerMotionPreview}
\`\`\``;
}

function accordionAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-accordion>
  <aria-accordion-item value="item-1">
    <aria-accordion-header>
      <aria-accordion-trigger>Trigger</aria-accordion-trigger>
    </aria-accordion-header>
    <aria-accordion-content>Content</aria-accordion-content>
  </aria-accordion-item>
  <aria-accordion-item value="item-2">
    <aria-accordion-header>
      <aria-accordion-trigger>Trigger</aria-accordion-trigger>
    </aria-accordion-header>
    <aria-accordion-content>Content</aria-accordion-content>
  </aria-accordion-item>
</aria-accordion>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function accordionApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-accordion\`
- Owns single or multiple item state.
- Supports \`type="single"\`, \`type="multiple"\`, \`value\`, \`default-value\`, \`collapsible\`, \`disabled\`, \`orientation\`, and \`dir\`.
- Emits \`valuechange\` with the selected value and value list.

### Item

- Element: \`aria-accordion-item\`
- Requires a unique \`value\` inside the nearest root.
- Reflects \`open\`, \`disabled\`, \`data-state\`, and \`data-orientation\`.

### Header

- Element: \`aria-accordion-header\`
- Defaults to \`role="heading"\` and \`aria-level="3"\`.
- Contains the item trigger.

### Trigger

- Element: \`aria-accordion-trigger\`
- Alias: \`aria-accordion-button\`
- Defaults to \`role="button"\`.
- Reflects \`aria-expanded\`, \`aria-controls\`, \`aria-disabled\`, \`open\`, and \`data-state\`.

### Content

- Element: \`aria-accordion-content\`
- Alias: \`aria-accordion-panel\`
- Defaults to \`role="region"\`.
- Receives \`id\`, \`aria-labelledby\`, \`hidden\`, \`open\`, and \`data-state\`.
- Supports \`force-mount\` for animation workflows.`;
}

function accordionKeyboardSection() {
  return `## Keyboard

| Key | Interaction |
| --- | --- |
| \`Enter\` | Opens or closes the focused trigger according to the accordion state rules. |
| \`Space\` | Opens or closes the focused trigger according to the accordion state rules. |
| \`ArrowDown\` | Moves focus to the next enabled trigger in vertical accordions. |
| \`ArrowUp\` | Moves focus to the previous enabled trigger in vertical accordions. |
| \`ArrowRight\` | Moves focus forward in horizontal LTR accordions and backward in horizontal RTL accordions. |
| \`ArrowLeft\` | Moves focus backward in horizontal LTR accordions and forward in horizontal RTL accordions. |
| \`Home\` | Moves focus to the first enabled trigger. |
| \`End\` | Moves focus to the last enabled trigger. |`;
}

function accordionAccessibilitySection() {
  return `## Accessibility

The Accordion component implements the [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). Each trigger exposes \`role="button"\`, \`aria-expanded\`, and \`aria-controls\` pointing to its associated content region. Content panels carry \`role="region"\` and \`aria-labelledby\` linking back to the trigger.

::: tip Heading level
\`aria-accordion-header\` defaults to \`role="heading"\` and \`aria-level="3"\`. Set \`aria-level\` to match the page hierarchy when a different heading depth is needed.
:::`;
}

function accordionComponentDocPage(spec) {
  return `# Accordion

A vertically stacked set of interactive headings that each reveal an associated section of content.

${accordionFeaturesSection()}

${nativeInstallationSection(spec)}

${accordionExamplesSection()}

${accordionAnatomySection(spec)}

${accordionApiReferenceSection(spec)}

${accordionKeyboardSection()}

${accordionAccessibilitySection()}
`;
}

function aspectRatioExampleMarkup({ ratio, alt }) {
  return `<aria-aspect-ratio class="ariaui-web-aspect-ratio-card overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl" data-example-part="Root" ratio="${ratio}">
    <img src="/aspect-ratio-light.png" alt="${alt}" class="h-full w-full object-cover rounded-xl dark:hidden">
    <img src="/aspect-ratio-dark.png" alt="${alt}" class="h-full w-full object-cover rounded-xl hidden dark:block">
  </aria-aspect-ratio>`;
}

function aspectRatioPreviewBlock(variant, markup) {
  return `<div class="ariaui-web-preview flex w-full justify-center bg-background p-12" data-component="aspect-ratio" data-example-variant="${variant}">
  <div class="ariaui-web-aspect-ratio-frame">
    ${markup}
  </div>
</div>`;
}

function aspectRatioFeaturesSection() {
  return `## Features

- **Any ratio**
- **Any content**
- **No layout shift**
- **Style passthrough**
- **Headless**`;
}

function aspectRatioExamplesSection() {
  const widescreenPreview = aspectRatioExampleMarkup({
    ratio: "16 / 9",
    alt: "Colorful abstract gradient in 16:9 frame",
  });
  const cinematicPreview = aspectRatioExampleMarkup({
    ratio: "21 / 9",
    alt: "Colorful abstract gradient in 21:9 cinematic frame",
  });
  const classicPreview = aspectRatioExampleMarkup({
    ratio: "4 / 3",
    alt: "Colorful abstract gradient in 4:3 frame",
  });
  const squarePreview = aspectRatioExampleMarkup({
    ratio: "1",
    alt: "Colorful abstract gradient in a square frame",
  });
  const portraitPreview = aspectRatioExampleMarkup({
    ratio: "9 / 16",
    alt: "Colorful abstract gradient in 9:16 portrait frame",
  });

  return `## Examples

The live examples below are native custom element entries for the \`aspect-ratio\` page.

### 16 : 9

${aspectRatioPreviewBlock("widescreen", widescreenPreview)}

\`\`\`html
${widescreenPreview}
\`\`\`

### 21 : 9

${aspectRatioPreviewBlock("cinematic", cinematicPreview)}

\`\`\`html
${cinematicPreview}
\`\`\`

### 4 : 3

${aspectRatioPreviewBlock("classic", classicPreview)}

\`\`\`html
${classicPreview}
\`\`\`

### 1 : 1

${aspectRatioPreviewBlock("square", squarePreview)}

\`\`\`html
${squarePreview}
\`\`\`

### 9 : 16

${aspectRatioPreviewBlock("portrait", portraitPreview)}

\`\`\`html
${portraitPreview}
\`\`\``;
}

function aspectRatioAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-aspect-ratio ratio="16 / 9">
  <img src="/aspect-ratio-light.png" alt="Colorful abstract gradient">
</aria-aspect-ratio>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function aspectRatioApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-aspect-ratio\`
- Supports \`ratio\` as a positive number, slash value such as \`16 / 9\`, colon value such as \`16:9\`, or decimal string.
- Falls back to \`1\` for missing, invalid, zero, negative, or non-finite ratios.
- Applies a private ratio shell with an absolutely positioned fill layer so children keep the requested width-to-height ratio.
- Supports \`native-composition\` to use the first child element as the fill host while preserving the ratio shell.
- Does not add a default ARIA role, focus behavior, keyboard behavior, \`data-state\`, \`data-ratio\`, or \`data-slot\`.`;
}

function aspectRatioAccessibilitySection() {
  return `## Accessibility

Aspect Ratio is a layout primitive and does not add roles or keyboard behavior by default.

Use semantic children inside \`aria-aspect-ratio\`, such as descriptive \`alt\` text for images or labelled interactive content when the child itself is interactive.`;
}

function aspectRatioComponentDocPage(spec) {
  return `# Aspect Ratio

Displays content within a desired width-to-height ratio.

${aspectRatioFeaturesSection()}

${nativeInstallationSection(spec)}

${aspectRatioExamplesSection()}

${aspectRatioAnatomySection(spec)}

${aspectRatioApiReferenceSection(spec)}

${aspectRatioAccessibilitySection()}
`;
}

const avatarDocPreviewSizeClass = "h-12 w-12";
const avatarPlaygroundFrameClass = "flex w-full items-center justify-center py-4";
const avatarRootWithImageClass = "relative flex shrink-0 overflow-hidden rounded-full border-2 border-background [&_img]:absolute [&_img]:inset-0 [&_img]:size-full [&_img]:object-cover";
const avatarImageShellClass = "relative flex shrink-0 overflow-hidden rounded-full [&>img]:aspect-square [&>img]:h-full [&>img]:w-full [&>img]:object-cover";
const avatarFallbackLabelClass = "absolute inset-0 flex items-center justify-center rounded-full bg-secondary text-sm font-medium text-fg-primary";
const avatarRootFallbackOnlyClass = "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary";
const avatarGroupInitialsSlotClass = `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary ${avatarDocPreviewSizeClass}`;

function avatarPreviewBlock(variant, markup) {
  return `<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="avatar" data-example-variant="${variant}">
  ${markup}
</div>`;
}

function avatarWithImageExampleMarkup() {
  return `<aria-avatar class="${avatarRootWithImageClass} ${avatarDocPreviewSizeClass}" data-example-part="Root">
    <aria-avatar-image src="/avatar.png" alt="Profile photo" data-example-part="Image"></aria-avatar-image>
    <aria-avatar-fallback class="${avatarFallbackLabelClass}" data-example-part="Fallback">SC</aria-avatar-fallback>
  </aria-avatar>`;
}

function avatarInitialsExampleMarkup() {
  return `<aria-avatar aria-label="Fallback avatar initials SC" class="${avatarRootFallbackOnlyClass} ${avatarDocPreviewSizeClass}" data-example-part="Root">
    <aria-avatar-fallback class="${avatarFallbackLabelClass}" data-example-part="Fallback">SC</aria-avatar-fallback>
  </aria-avatar>`;
}

function avatarGroupExampleMarkup() {
  const imageRootClass = `${avatarImageShellClass} ${avatarDocPreviewSizeClass} border-2 border-background`;

  return `<aria-avatar-group class="-space-x-3 flex items-center pr-3" data-example-part="Group">
    <aria-avatar class="${imageRootClass}" data-example-part="Root">
      <aria-avatar-image src="/avatar.png" alt="Team member 1" data-example-part="Image"></aria-avatar-image>
      <aria-avatar-fallback class="${avatarFallbackLabelClass}" data-example-part="Fallback">A1</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar class="${imageRootClass}" data-example-part="Root">
      <aria-avatar-image src="/avatar.png" alt="Team member 2" data-example-part="Image"></aria-avatar-image>
      <aria-avatar-fallback class="${avatarFallbackLabelClass}" data-example-part="Fallback">A2</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar aria-label="Member initials MW" class="${avatarGroupInitialsSlotClass}" data-example-part="Root">
      <aria-avatar-fallback class="${avatarFallbackLabelClass}" data-example-part="Fallback">MW</aria-avatar-fallback>
    </aria-avatar>
    <aria-avatar aria-label="Member initials SD" class="${avatarGroupInitialsSlotClass}" data-example-part="Root">
      <aria-avatar-fallback class="${avatarFallbackLabelClass}" data-example-part="Fallback">SD</aria-avatar-fallback>
    </aria-avatar>
  </aria-avatar-group>`;
}

function avatarFeaturesSection() {
  return `## Features

- **Automatic fallback**
- **Accessible defaults**
- **Image lifecycle hooks**
- **Group support**
- **Headless**`;
}

function avatarExamplesSection() {
  const withImagePreview = avatarWithImageExampleMarkup();
  const initialsPreview = avatarInitialsExampleMarkup();
  const groupPreview = avatarGroupExampleMarkup();

  return `## Examples

The live examples below are native custom element entries for the \`avatar\` page.

### With image

${avatarPreviewBlock("with-image", withImagePreview)}

\`\`\`html
${withImagePreview}
\`\`\`

### Initials

${avatarPreviewBlock("initials", initialsPreview)}

\`\`\`html
${initialsPreview}
\`\`\`

### Overlapping row

${avatarPreviewBlock("overlapping-row", groupPreview)}

\`\`\`html
${groupPreview}
\`\`\``;
}

function avatarAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-avatar>
  <aria-avatar-image src="/avatar.png" alt="Profile photo"></aria-avatar-image>
  <aria-avatar-fallback>SC</aria-avatar-fallback>
</aria-avatar>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function avatarApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-avatar\`
- Coordinates Image and Fallback loading state.
- Applies \`role="img"\` and \`aria-label="avatar"\` while fallback content is visible unless consumers provide their own values.
- Removes only its default image semantics after the image loads.
- Supports convenience \`src\`, \`alt\`, \`fallback\`, and \`fallback-delay-ms\` attributes for simple one-element usage.

### Image

- Element: \`aria-avatar-image\`
- Renders a native \`<img>\` only when \`src\` is present.
- Forwards \`src\`, \`alt\`, \`srcset\`, \`sizes\`, \`crossorigin\`, \`referrerpolicy\`, \`loading\`, \`decoding\`, and \`fetchpriority\`.
- Reflects \`data-loading-status\` as \`loading\`, \`loaded\`, or \`error\`.
- Hides the internal \`<img>\` with \`aria-hidden="true"\` and \`visibility: hidden\` while loading or errored.
- Emits \`load\`, \`error\`, and \`loadingstatuschange\` events when the internal image state changes.

### Fallback

- Element: \`aria-avatar-fallback\`
- Renders while the nearest Root image status is not \`loaded\`.
- Supports \`delay-ms\` to delay fallback display and avoid a quick flash during fast image loads.

### Group

- Element: \`aria-avatar-group\`
- Defaults to \`role="group"\`.
- Allows consumer role overrides such as \`role="presentation"\`.`;
}

function avatarKeyboardSection() {
  return `## Keyboard

| Key | Interaction |
| --- | --- |
| \`Tab\` | Moves focus to the next focusable control placed near or inside an avatar. |
| \`Shift+Tab\` | Moves focus to the previous focusable control. |`;
}

function avatarAccessibilitySection() {
  return `## Accessibility

There is no dedicated WAI-ARIA APG pattern for avatars. \`aria-avatar\` applies \`role="img"\` and \`aria-label="avatar"\` while fallback content is visible; once the image loads, those defaults are removed and the internal image follows native \`alt\` text semantics.

::: tip Alt text
Provide meaningful \`alt\` text whenever the photo identifies the user. Use \`alt=""\` only when the avatar is decorative and nearby text already names the person.
:::

::: tip Groups
Use \`aria-avatar-group\` when multiple avatars represent one related set. The default \`role="group"\` exposes that relationship to assistive technology.
:::`;
}

function avatarComponentDocPage(spec) {
  return `# Avatar

An image element with a fallback for representing the user.

${avatarFeaturesSection()}

${nativeInstallationSection(spec)}

${avatarExamplesSection()}

${avatarAnatomySection(spec)}

${avatarApiReferenceSection(spec)}

${avatarKeyboardSection()}

${avatarAccessibilitySection()}
`;
}

const badgePreviewClass = "ariaui-web-preview flex w-full flex-wrap items-center justify-center gap-4 px-6 py-10";
const badgeRootBaseClass = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold";

function badgeIcon(name, className) {
  const paths = {
    ArrowRightIcon: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3",
    CheckBadgeIcon: "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z",
    CheckIcon: "m4.5 12.75 6 6 9-13.5",
    ExclamationCircleIcon: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
  };

  return `<svg aria-hidden="true" data-icon="${name}" class="${className}" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${paths[name]}"></path></svg>`;
}

function badgePreviewBlock(variant, markup) {
  return `<div class="${badgePreviewClass}" data-component="badge" data-example-variant="${variant}">
  ${markup}
</div>`;
}

function badgeDefaultExampleMarkup() {
  return `<aria-badge class="${badgeRootBaseClass} border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">Badge</aria-badge>`;
}

function badgeSecondaryExampleMarkup() {
  return `<aria-badge class="${badgeRootBaseClass} border-transparent bg-secondary text-foreground hover:bg-secondary/80" data-example-part="Root">Secondary</aria-badge>`;
}

function badgeOutlineExampleMarkup() {
  return `<aria-badge class="${badgeRootBaseClass} border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">Outline</aria-badge>`;
}

function badgeDestructiveExampleMarkup() {
  return `<aria-badge class="${badgeRootBaseClass} border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover" data-example-part="Root">Destructive</aria-badge>`;
}

function badgeWithIconExampleMarkup() {
  return `<div class="flex flex-wrap gap-4">
    <aria-badge class="${badgeRootBaseClass} gap-1 border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">
      ${badgeIcon("CheckIcon", "h-3.5 w-3.5 text-icon")}
      Badge
    </aria-badge>
    <aria-badge class="${badgeRootBaseClass} gap-1 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover" data-example-part="Root">
      ${badgeIcon("ExclamationCircleIcon", "h-3.5 w-3.5 text-icon")}
      Alert
    </aria-badge>
  </div>`;
}

function badgeCountExampleMarkup() {
  return `<div class="flex flex-wrap gap-4">
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-transparent bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground" data-example-part="Root">8</aria-badge>
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-transparent bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground" data-example-part="Root">99</aria-badge>
    <aria-badge class="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-border bg-transparent px-1 text-[10px] font-semibold leading-none text-foreground" data-example-part="Root">20+</aria-badge>
  </div>`;
}

function badgeLinkExampleMarkup() {
  return `<div class="flex flex-wrap gap-4">
    <aria-badge as="a" href="#" class="${badgeRootBaseClass} gap-1 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">
      Link
      ${badgeIcon("ArrowRightIcon", "h-3 w-3 text-icon")}
    </aria-badge>
    <aria-badge as="a" href="#" class="${badgeRootBaseClass} gap-1 border-transparent bg-secondary text-foreground hover:bg-secondary/80" data-example-part="Root">
      Link
      ${badgeIcon("ArrowRightIcon", "h-3 w-3 text-icon")}
    </aria-badge>
    <aria-badge as="a" href="#" class="${badgeRootBaseClass} gap-1 border-border bg-transparent text-foreground hover:bg-secondary" data-example-part="Root">
      Link
      ${badgeIcon("ArrowRightIcon", "h-3 w-3 text-icon")}
    </aria-badge>
  </div>`;
}

function badgeVerifiedExampleMarkup() {
  return `<aria-badge class="${badgeRootBaseClass} gap-1 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover" data-example-part="Root">
    ${badgeIcon("CheckBadgeIcon", "h-3.5 w-3.5 text-icon")}
    Verified
  </aria-badge>`;
}

function badgeFeaturesSection() {
  return `## Features

- **Polymorphic**
- **Zero defaults**
- **Composable**
- **Headless**`;
}

function badgeExamplesSection() {
  const defaultPreview = badgeDefaultExampleMarkup();
  const secondaryPreview = badgeSecondaryExampleMarkup();
  const outlinePreview = badgeOutlineExampleMarkup();
  const destructivePreview = badgeDestructiveExampleMarkup();
  const withIconPreview = badgeWithIconExampleMarkup();
  const countPreview = badgeCountExampleMarkup();
  const linkPreview = badgeLinkExampleMarkup();
  const verifiedPreview = badgeVerifiedExampleMarkup();

  return `## Examples

The live examples below are native custom element entries for the \`badge\` page.

### Default

${badgePreviewBlock("default", defaultPreview)}

\`\`\`html
${defaultPreview}
\`\`\`

### Secondary

${badgePreviewBlock("secondary", secondaryPreview)}

\`\`\`html
${secondaryPreview}
\`\`\`

### Outline

${badgePreviewBlock("outline", outlinePreview)}

\`\`\`html
${outlinePreview}
\`\`\`

### Destructive

${badgePreviewBlock("destructive", destructivePreview)}

\`\`\`html
${destructivePreview}
\`\`\`

### With icon

${badgePreviewBlock("with-icon", withIconPreview)}

\`\`\`html
${withIconPreview}
\`\`\`

### Circular / count

${badgePreviewBlock("count", countPreview)}

\`\`\`html
${countPreview}
\`\`\`

### Action / link

${badgePreviewBlock("link", linkPreview)}

\`\`\`html
${linkPreview}
\`\`\`

### Verified

${badgePreviewBlock("verified", verifiedPreview)}

\`\`\`html
${verifiedPreview}
\`\`\``;
}

function badgeAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-badge>Badge</aria-badge>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function badgeApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-badge\`
- Renders as a browser-native custom element host with no default role, ARIA label, classes, styles, state, keyboard behavior, or focusability.
- Forwards attributes, text, child elements, inline styles, classes, and DOM event listeners to the host.
- Preserves consumer-supplied \`role\`, \`aria-*\`, \`data-*\`, \`id\`, and \`title\` attributes.
- Supports \`as="a"\` with \`href\` as a native custom-element adaptation of link badges by applying \`role="link"\` and \`tabindex="0"\`.
- Supports \`as="button"\` as a native custom-element adaptation of button badges by applying \`role="button"\` and \`tabindex="0"\`.`;
}

function badgeKeyboardSection() {
  return `## Keyboard

| Key | Interaction |
| --- | --- |
| \`Tab\` | Moves focus to the next focusable badge, for example when using \`as="a"\` or \`as="button"\`. |
| \`Shift+Tab\` | Moves focus to the previous focusable badge. |
| \`Enter\` | Activates a focused link-styled or button-styled badge. |
| \`Space\` | Activates a focused button-styled badge. |`;
}

function badgeAccessibilitySection() {
  return `## Accessibility

Use visible text such as "Beta", "New", or "Paid" as the primary label. Do not add \`role="img"\` or \`tabindex\` for purely decorative status chips. The primitive applies no default role or keyboard behavior.

When a badge is only decorative next to explicit text, you may hide redundant visuals from assistive technology with \`aria-hidden="true"\` on the badge wrapper.

If you use \`as="a"\`, treat it as a focusable control: provide a meaningful accessible name, visible focus styles, and a real \`href\` in production. The demo uses \`href="#"\` only for the playground.

::: tip Interactive vs static
Reserve button or link semantics and keyboard support for badges that perform an action. For static labels and counts, keep them non-focusable and rely on surrounding context or adjacent text.
:::`;
}

function badgeComponentDocPage(spec) {
  return `# Badge

A minimal headless wrapper for status labels, counts, and tags.

${badgeFeaturesSection()}

${nativeInstallationSection(spec)}

${badgeExamplesSection()}

${badgeAnatomySection(spec)}

${badgeApiReferenceSection(spec)}

${badgeKeyboardSection()}

${badgeAccessibilitySection()}
`;
}

function alertIcon(name) {
  if (name === "success") {
    return `<svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-success" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.573-1.573a.75.75 0 0 0-1.061 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.7-5.18Z" clip-rule="evenodd"></path></svg>`;
  }

  if (name === "warning") {
    return `<svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-warning" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.401 3.003c1.155-1.997 4.043-1.997 5.197 0l7.355 12.73c1.154 1.998-.29 4.495-2.599 4.495H4.645c-2.309 0-3.752-2.497-2.598-4.495l7.354-12.73ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>`;
  }

  return `<svg aria-hidden="true" class="mt-0.5 h-4 w-4 shrink-0 text-icon-destructive" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd"></path></svg>`;
}

function alertCardMarkup({ variant, title, description, role = "", dismissible = false, body = "" }) {
  const roleAttribute = role ? ` role="${role}"` : "";
  const dismissibleAttribute = dismissible ? " dismissible" : "";
  const bodyMarkup = body ? `\n${body}` : "";
  const icon = variant === "error" ? alertIcon("error") : alertIcon(variant);

  return `<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root"${dismissibleAttribute}${roleAttribute}>
    <div class="flex items-start gap-3">
      ${icon}
      <div class="${body ? "min-w-0 " : ""}flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">${title}</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">${description}</aria-alert-description>${bodyMarkup}
      </div>
    </div>
  </aria-alert>`;
}

function alertSuccessExampleMarkup() {
  return alertCardMarkup({
    variant: "success",
    title: "Success",
    description: "Your changes have been saved successfully.",
  });
}

function alertWarningExampleMarkup() {
  return alertCardMarkup({
    variant: "warning",
    title: "Heads up",
    description: "Your session will expire in 5 minutes. Save your work to avoid losing changes.",
  });
}

function alertErrorExampleMarkup() {
  return alertCardMarkup({
    variant: "error",
    title: "Something went wrong",
    description: "We could not load your data. Check your connection and try again.",
  });
}

function alertWithActionsExampleMarkup() {
  return alertCardMarkup({
    variant: "error",
    title: "Payment failed",
    description: "The card was declined. Update your billing method or use a different card.",
    role: "status",
    dismissible: true,
    body: `        <aria-alert-action class="flex flex-wrap gap-2 pt-3" data-example-part="Action">
          <button type="button" class="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted">Update card</button>
          <aria-alert-cancel class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground" data-example-part="Cancel">Dismiss</aria-alert-cancel>
        </aria-alert-action>`,
  });
}

function alertDismissibleExampleMarkup() {
  return `<aria-alert class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm" data-example-part="Root" dismissible role="status">
    <div class="flex items-start gap-3">
      ${alertIcon("warning")}
      <div class="flex-1 space-y-1">
        <aria-alert-title class="text-sm font-medium text-foreground" data-example-part="Title">Maintenance scheduled</aria-alert-title>
        <aria-alert-description class="text-sm text-muted-foreground" data-example-part="Description">System maintenance will occur on Sunday at 2:00 AM UTC.</aria-alert-description>
      </div>
      <aria-alert-close class="ml-2 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" data-example-part="Close">
        <svg class="h-4 w-4 text-icon" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
      </aria-alert-close>
    </div>
  </aria-alert>`;
}

function alertPreviewBlock(variant, markup) {
  return `<div class="ariaui-web-preview" data-component="alert" data-example-variant="${variant}">
  ${markup}
</div>`;
}

function alertFeaturesSection() {
  return `## Features

- **Semantic HTML**
- **Accessible labeling**
- **Headless**
- **Action slot**
- **Dismissible**
- **Close button**
- **Cancel action**`;
}

function alertExamplesSection() {
  const successPreview = alertSuccessExampleMarkup();
  const warningPreview = alertWarningExampleMarkup();
  const errorPreview = alertErrorExampleMarkup();
  const withActionsPreview = alertWithActionsExampleMarkup();
  const dismissiblePreview = alertDismissibleExampleMarkup();

  return `## Examples

The live examples below are native custom element entries for the \`alert\` page.

### Success

${alertPreviewBlock("success", successPreview)}

\`\`\`html
${successPreview}
\`\`\`

### Warning

${alertPreviewBlock("warning", warningPreview)}

\`\`\`html
${warningPreview}
\`\`\`

### Error

${alertPreviewBlock("error", errorPreview)}

\`\`\`html
${errorPreview}
\`\`\`

### With actions

${alertPreviewBlock("with-actions", withActionsPreview)}

\`\`\`html
${withActionsPreview}
\`\`\`

### Dismissible

${alertPreviewBlock("dismissible", dismissiblePreview)}

\`\`\`html
${dismissiblePreview}
\`\`\``;
}

function alertAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-alert>
  <aria-alert-title>Title</aria-alert-title>
  <aria-alert-description>Description</aria-alert-description>
  <aria-alert-action>
    <button type="button">Action</button>
    <aria-alert-cancel>Cancel</aria-alert-cancel>
  </aria-alert-action>
  <aria-alert-close>Close</aria-alert-close>
</aria-alert>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function alertApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-alert\`
- Defaults to \`role="alert"\`.
- Supports \`open\`, \`default-open\`, \`dismissible\`, and custom live-region roles such as \`status\`.
- Emits \`openchange\` when a dismissible close or cancel control requests dismissal.

### Title

- Element: \`aria-alert-title\`
- Provides the accessible name for the alert.
- Receives a generated \`id\` when needed and links to Root through \`aria-labelledby\`.

### Description

- Element: \`aria-alert-description\`
- Provides supporting alert text.
- Receives a generated \`id\` when needed and links to Root through \`aria-describedby\`.

### Action

- Element: \`aria-alert-action\`
- Non-interactive host for action content.
- Reflects \`data-alert-action\`.

### Close

- Element: \`aria-alert-close\`
- Defaults to \`role="button"\`.
- Reflects \`data-alert-close\`.
- Dismisses the nearest Root only when Root is \`dismissible\`.

### Cancel

- Element: \`aria-alert-cancel\`
- Defaults to \`role="button"\`.
- Reflects \`data-alert-cancel\`.
- Dismisses the nearest Root only when Root is \`dismissible\`.`;
}

function alertAccessibilitySection() {
  return `## Accessibility

Alert root elements use the [WAI-ARIA alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) by default. Use \`role="status"\` for less urgent inline messages.

\`aria-alert-title\` and \`aria-alert-description\` are automatically linked to the root with \`aria-labelledby\` and \`aria-describedby\`, so the live-region announcement includes both the title and the message text.

Dismissible alerts should include a visible close or cancel control with an accessible label.`;
}

function alertComponentDocPage(spec) {
  return `# Alert

Displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.

${alertFeaturesSection()}

${nativeInstallationSection(spec)}

${alertExamplesSection()}

${alertAnatomySection(spec)}

${alertApiReferenceSection(spec)}

${alertAccessibilitySection()}
`;
}

function dialogExampleMarkup({ motion = false } = {}) {
  const className = motion
    ? "ariaui-web-dialog-example ariaui-web-dialog-motion-example ariaui-web-example"
    : "ariaui-web-dialog-example ariaui-web-example";

  return `<aria-dialog class="${className}" data-example-part="Root">
    <aria-dialog-trigger class="ariaui-web-dialog-trigger" data-example-part="Trigger">
      Edit Profile
    </aria-dialog-trigger>
    <aria-dialog-portal data-example-part="Portal" hidden>
      <aria-dialog-overlay class="ariaui-web-dialog-overlay" data-example-part="Overlay" hidden></aria-dialog-overlay>
      <aria-dialog-content class="ariaui-web-dialog-content" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-dialog-copy">
          <aria-dialog-title data-example-part="Title">Edit profile</aria-dialog-title>
          <aria-dialog-description data-example-part="Description">Make changes to your profile here. Click save when you're done.</aria-dialog-description>
        </div>
        <div class="ariaui-web-dialog-form">
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-name">Name</label>
            <input id="dialog-demo-name" value="Pedro Duarte"></input>
          </div>
          <div class="ariaui-web-dialog-field">
            <label for="dialog-demo-username">Username</label>
            <input id="dialog-demo-username" value="@peduarte"></input>
          </div>
        </div>
        <div class="ariaui-web-dialog-actions">
          <aria-dialog-cancel class="ariaui-web-dialog-button" data-example-part="Cancel">Cancel</aria-dialog-cancel>
          <aria-dialog-action class="ariaui-web-dialog-button ariaui-web-dialog-button-primary" data-example-part="Action">Save changes</aria-dialog-action>
        </div>
        <aria-dialog-close class="ariaui-web-dialog-close" data-example-part="Close" aria-label="Close">
          <svg class="h-4 w-4 text-icon" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
          <span class="sr-only">Close</span>
        </aria-dialog-close>
      </aria-dialog-content>
    </aria-dialog-portal>
  </aria-dialog>`;
}

function dialogPreviewBlock(variant, markup) {
  return `<div class="ariaui-web-preview" data-component="dialog" data-example-variant="${variant}">
  ${markup}
</div>`;
}

function dialogFeaturesSection() {
  return `## Features

- **Focus trap**
- **Initial focus**
- **Portal rendering**
- **Controlled or uncontrolled**
- **Escape to close**
- **Headless**
- **Composable close controls**`;
}

function dialogExamplesSection() {
  const basePreview = dialogExampleMarkup();
  const motionPreview = dialogExampleMarkup({ motion: true });

  return `## Examples

The live examples below are native custom element entries for the \`dialog\` page.

### Edit profile

${dialogPreviewBlock("edit-profile", basePreview)}

\`\`\`html
${basePreview}
\`\`\`

### Framer Motion

Animation libraries can target the native overlay and content elements through \`data-state\` attributes while keeping the same dialog structure.

${dialogPreviewBlock("framer-motion", motionPreview)}

\`\`\`html
${motionPreview}
\`\`\``;
}

function dialogAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-dialog>
  <aria-dialog-trigger>Edit Profile</aria-dialog-trigger>
  <aria-dialog-portal>
    <aria-dialog-overlay></aria-dialog-overlay>
    <aria-dialog-content>
      <aria-dialog-title>Edit profile</aria-dialog-title>
      <aria-dialog-description>
        Make changes to your profile here.
      </aria-dialog-description>
      <aria-dialog-cancel>Cancel</aria-dialog-cancel>
      <aria-dialog-action>Save changes</aria-dialog-action>
      <aria-dialog-close aria-label="Close"></aria-dialog-close>
    </aria-dialog-content>
  </aria-dialog-portal>
</aria-dialog>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function dialogApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-dialog\`
- Owns controlled or uncontrolled open state.
- Supports \`open\`, \`default-open\`, and \`defaultopen\`.
- Emits \`openchange\` with the next open state and the requesting source element.
- Starts closed unless \`open\` or \`default-open\` is present.

### Trigger

- Element: \`aria-dialog-trigger\`
- Defaults to \`role="button"\`.
- Opens the nearest Root on click, Enter, or Space.
- Closes the dialog when clicked while the nearest Root is open.
- Reflects \`open\`, \`aria-expanded\`, and \`data-state\`.

### Portal

- Element: \`aria-dialog-portal\`
- Groups Overlay and Content under a native custom element host.
- Reflects \`data-state\` and hides while closed unless \`force-mount\` is present.
- Native consumers choose DOM placement by placing this host.

### Overlay

- Element: \`aria-dialog-overlay\`
- Defaults to \`role="presentation"\`.
- Renders the backdrop layer behind Content.
- Reflects \`data-state\` and hides while closed unless \`force-mount\` is present.
- Closes the dialog by default when clicked directly.

### Content

- Element: \`aria-dialog-content\`
- Exposes \`data-dialog-content\`.
- Applies \`role="dialog"\`, \`aria-modal="true"\`, and \`tabindex="-1"\` while open.
- Auto-wires \`aria-labelledby\` to Title and \`aria-describedby\` to Description.
- Traps focus, supports Escape dismissal, and emits cancellable \`openautofocus\`, \`closeautofocus\`, and \`escapekeydown\` events.

### Title

- Element: \`aria-dialog-title\`
- Defaults to \`role="heading"\` and \`aria-level="2"\`.
- Provides the accessible name for Content through generated ID linkage.

### Description

- Element: \`aria-dialog-description\`
- Provides supporting text for Content through generated ID linkage.
- Multiple descriptions are concatenated into \`aria-describedby\`.

### Close

- Element: \`aria-dialog-close\`
- Defaults to \`role="button"\`.
- Closes the dialog by default and is suitable for the X icon control.

### Cancel

- Element: \`aria-dialog-cancel\`
- Defaults to \`role="button"\`.
- Exposes \`data-dialog-cancel\`.
- Receives initial focus when present and closes the dialog by default.

### Action

- Element: \`aria-dialog-action\`
- Defaults to \`role="button"\`.
- Exposes \`data-dialog-action\`.
- Represents the primary action and closes the dialog by default.`;
}

function dialogKeyboardSection() {
  return `## Keyboard

| Key | Interaction |
| --- | --- |
| \`Space\` / \`Enter\` | Opens the dialog when focus is on the Trigger. |
| \`Tab\` / \`Shift+Tab\` | Cycles focus forward or backward through interactive elements inside the open dialog. Focus is trapped inside Content. |
| \`Escape\` | Closes the dialog and returns focus to the Trigger. |`;
}

function dialogAccessibilitySection() {
  return `## Accessibility

The Dialog component implements the [WAI-ARIA Dialog Modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Content renders with \`role="dialog"\` and \`aria-modal="true"\` only while open. Title and Description are auto-wired via \`aria-labelledby\` and \`aria-describedby\`.

::: tip Keep Content labelled
\`aria-dialog-title\` should be present for an accessible name, and \`aria-dialog-description\` should describe what changes inside the modal.
:::

::: warning Closed by default
Closed Content stays hidden and outside the dialog accessibility tree until Trigger opens the Root.
:::`;
}

function dialogComponentDocPage(spec) {
  return `# Dialog

A modal dialog that opens above the page for focused tasks such as editing profile details.

${dialogFeaturesSection()}

${nativeInstallationSection(spec)}

${dialogExamplesSection()}

${dialogAnatomySection(spec)}

${dialogApiReferenceSection(spec)}

${dialogKeyboardSection()}

${dialogAccessibilitySection()}
`;
}

function alertDialogExampleMarkup({ motion = false } = {}) {
  const className = motion
    ? "ariaui-web-alert-dialog-example ariaui-web-alert-dialog-motion-example ariaui-web-example"
    : "ariaui-web-alert-dialog-example ariaui-web-example";

  return `<aria-alert-dialog class="${className}" data-example-part="Root">
    <aria-alert-dialog-trigger class="ariaui-web-alert-dialog-trigger" data-example-part="Trigger">
      Delete account
    </aria-alert-dialog-trigger>
    <aria-alert-dialog-portal data-example-part="Portal" hidden>
      <aria-alert-dialog-overlay class="ariaui-web-alert-dialog-overlay" data-example-part="Overlay" hidden></aria-alert-dialog-overlay>
      <aria-alert-dialog-content class="ariaui-web-alert-dialog-content" data-example-part="Content" hidden aria-hidden="true">
        <div class="ariaui-web-alert-dialog-stack">
          <div class="ariaui-web-alert-dialog-copy">
            <aria-alert-dialog-title data-example-part="Title">Are you absolutely sure?</aria-alert-dialog-title>
            <aria-alert-dialog-description data-example-part="Description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</aria-alert-dialog-description>
          </div>
          <div class="ariaui-web-alert-dialog-actions">
            <aria-alert-dialog-cancel class="ariaui-web-alert-dialog-button" data-example-part="Cancel">Cancel</aria-alert-dialog-cancel>
            <aria-alert-dialog-action class="ariaui-web-alert-dialog-button ariaui-web-alert-dialog-button-destructive" data-example-part="Action">Delete account</aria-alert-dialog-action>
          </div>
        </div>
      </aria-alert-dialog-content>
    </aria-alert-dialog-portal>
  </aria-alert-dialog>`;
}

function alertDialogPreviewBlock(variant, markup) {
  return `<div class="ariaui-web-preview" data-component="alert-dialog" data-example-variant="${variant}">
  ${markup}
</div>`;
}

function alertDialogFeaturesSection() {
  return `## Features

- **Focus trap**
- **Initial focus**
- **Inert outside**
- **Portal rendering**
- **Controlled or uncontrolled**
- **Escape to close**
- **Headless**`;
}

function alertDialogExamplesSection() {
  const destructivePreview = alertDialogExampleMarkup();
  const motionPreview = alertDialogExampleMarkup({ motion: true });

  return `## Examples

The live examples below are native custom element entries for the \`alert-dialog\` page.

### Destructive confirmation

${alertDialogPreviewBlock("destructive", destructivePreview)}

\`\`\`html
${destructivePreview}
\`\`\`

### Framer Motion

Animation libraries can target the native overlay and content elements through \`data-state\` attributes while keeping the same alert dialog structure.

${alertDialogPreviewBlock("framer-motion", motionPreview)}

\`\`\`html
${motionPreview}
\`\`\``;
}

function alertDialogAnatomySection(spec) {
  return `## Anatomy

\`\`\`html
<aria-alert-dialog>
  <aria-alert-dialog-trigger>Delete account</aria-alert-dialog-trigger>
  <aria-alert-dialog-portal>
    <aria-alert-dialog-overlay></aria-alert-dialog-overlay>
    <aria-alert-dialog-content>
      <aria-alert-dialog-title>Are you absolutely sure?</aria-alert-dialog-title>
      <aria-alert-dialog-description>
        This action cannot be undone.
      </aria-alert-dialog-description>
      <aria-alert-dialog-cancel>Cancel</aria-alert-dialog-cancel>
      <aria-alert-dialog-action>Delete account</aria-alert-dialog-action>
    </aria-alert-dialog-content>
  </aria-alert-dialog-portal>
</aria-alert-dialog>
\`\`\`

| Part | Custom element | Default role |
| --- | --- | --- |
${webComponentPartRows(spec)}`;
}

function alertDialogApiReferenceSection(spec) {
  return `## API Reference

The package-level native contract lives in \`packages/${spec.slug}/readme.md\`.

### Root

- Element: \`aria-alert-dialog\`
- Owns controlled or uncontrolled open state.
- Supports \`open\`, \`default-open\`, and \`defaultopen\`.
- Emits \`openchange\` with the next open state and the requesting source element.

### Trigger

- Element: \`aria-alert-dialog-trigger\`
- Defaults to \`role="button"\`.
- Opens the nearest Root on click, Enter, or Space.
- Reflects \`open\`, \`aria-expanded\`, and \`data-state\`.

### Portal

- Element: \`aria-alert-dialog-portal\`
- Groups Overlay and Content under a native custom element host.
- Reflects \`data-state\` and hides while closed unless \`force-mount\` is present.
- Native consumers choose DOM placement by placing this host.

### Overlay

- Element: \`aria-alert-dialog-overlay\`
- Defaults to \`role="presentation"\`.
- Renders the backdrop layer behind Content.
- Reflects \`data-state\` and hides while closed unless \`force-mount\` is present.

### Content

- Element: \`aria-alert-dialog-content\`
- Exposes \`data-alert-dialog-content\`.
- Applies \`role="alertdialog"\`, \`aria-modal="true"\`, and \`tabindex="-1"\` while open.
- Auto-wires \`aria-labelledby\` to Title and \`aria-describedby\` to Description.
- Traps focus, supports Escape dismissal, and emits cancellable \`openautofocus\`, \`closeautofocus\`, and \`escapekeydown\` events.

### Title

- Element: \`aria-alert-dialog-title\`
- Defaults to \`role="heading"\` and \`aria-level="2"\`.
- Provides the accessible name for Content through generated ID linkage.

### Description

- Element: \`aria-alert-dialog-description\`
- Provides supporting consequence text for Content through generated ID linkage.
- Multiple descriptions are concatenated into \`aria-describedby\`.

### Icon

- Element: \`aria-alert-dialog-icon\`
- Exposes \`aria-hidden="true"\`.
- Intended for decorative visual emphasis.

### Cancel

- Element: \`aria-alert-dialog-cancel\`
- Defaults to \`role="button"\`.
- Exposes \`data-alert-dialog-cancel\`.
- Receives initial focus before destructive Action when present and closes the dialog by default.

### Action

- Element: \`aria-alert-dialog-action\`
- Defaults to \`role="button"\`.
- Represents the confirm or destructive path and closes the dialog by default.`;
}

function alertDialogKeyboardSection() {
  return `## Keyboard

| Key | Interaction |
| --- | --- |
| \`Space\` / \`Enter\` | Opens the dialog when focus is on the Trigger. |
| \`Tab\` / \`Shift+Tab\` | Cycles focus forward or backward through interactive elements inside the open dialog. Focus is trapped inside Content. |
| \`Escape\` | Closes the dialog and returns focus to the Trigger. |`;
}

function alertDialogAccessibilitySection() {
  return `## Accessibility

The Alert Dialog component implements the [WAI-ARIA Alert Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/). Content renders with \`role="alertdialog"\` and \`aria-modal="true"\`. Title and Description are auto-wired via \`aria-labelledby\` and \`aria-describedby\` so screen readers announce the full context on open.

::: tip Always provide Title and Description
\`aria-alert-dialog-title\` and \`aria-alert-dialog-description\` are required for accessible announcements. Screen readers use them to identify the dialog's purpose and communicate the consequences of the action.
:::

::: warning Use Alert Dialog for destructive actions
Alert Dialog differs from a regular Dialog because users must explicitly choose Cancel or confirm. This enforces intentional interaction for irreversible operations.
:::`;
}

function alertDialogComponentDocPage(spec) {
  return `# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response. Renders above the page and blocks interaction until dismissed.

${alertDialogFeaturesSection()}

${nativeInstallationSection(spec)}

${alertDialogExamplesSection()}

${alertDialogAnatomySection(spec)}

${alertDialogApiReferenceSection(spec)}

${alertDialogKeyboardSection()}

${alertDialogAccessibilitySection()}
`;
}

function componentDocPage(spec) {
  const defineFunctionName = `define${pascalCase(spec.slug)}Elements`;

  if (spec.slug === "accordion") {
    return accordionComponentDocPage(spec);
  }

  if (spec.slug === "aspect-ratio") {
    return aspectRatioComponentDocPage(spec);
  }

  if (spec.slug === "avatar") {
    return avatarComponentDocPage(spec);
  }

  if (spec.slug === "badge") {
    return badgeComponentDocPage(spec);
  }

  if (spec.slug === "alert") {
    return alertComponentDocPage(spec);
  }

  if (spec.slug === "dialog") {
    return dialogComponentDocPage(spec);
  }

  if (spec.slug === "alert-dialog") {
    return alertDialogComponentDocPage(spec);
  }

  return `# ${spec.name}

\`${spec.packageName}\` is a browser-native Web Component package. It exposes custom elements, a typed \`componentSpec\`, and package-level tests for the native runtime contract.

## Installation

::: code-group

\`\`\`bash [npm]
npm install ${spec.packageName}
\`\`\`

\`\`\`bash [pnpm]
pnpm add ${spec.packageName}
\`\`\`

\`\`\`bash [yarn]
yarn add ${spec.packageName}
\`\`\`

:::

## Register Elements

\`\`\`ts
import { ${defineFunctionName} } from "${spec.packageName}";

${defineFunctionName}();
\`\`\`

${webComponentContractSection(spec)}`;
}

function docsTests(specs) {
  const nativePackageExpectations = specs.map((spec) => ({
    slug: spec.slug,
    packageName: spec.packageName,
    defineFunctionName: `define${pascalCase(spec.slug)}Elements`,
    parts: spec.parts.map((part) => ({ name: part.name, tagName: part.tagName })),
  }));

  return `import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineAccordionElements } from "${packageScope}/accordion";
import { defineAlertElements } from "${packageScope}/alert";
import { defineAspectRatioElements } from "${packageScope}/aspect-ratio";
import { defineAvatarElements } from "${packageScope}/avatar";
import { defineBadgeElements } from "${packageScope}/badge";
import { defineDialogElements } from "${packageScope}/dialog";
import { defineAlertDialogElements } from "${packageScope}/alert-dialog";
import { describe, expect, it } from "vitest";

const packageSlugs = ${JSON.stringify(specs.filter((spec) => !docsHiddenPackages.has(spec.slug)).map((spec) => spec.slug), null, 2)} as const;
const hiddenPackageSlugs = ${JSON.stringify(Array.from(docsHiddenPackages), null, 2)} as const;
const nativePackageExpectations = ${JSON.stringify(nativePackageExpectations, null, 2)} as const;

function readDoc(path: string) {
  return readFileSync(join(process.cwd(), "web", "doc", "docs", path), "utf8");
}

type RuntimeAccordionElement = HTMLElement & {
  open: boolean;
  value: string;
};

type RuntimeAlertElement = HTMLElement & {
  open: boolean;
};

type RuntimeDialogElement = HTMLElement & {
  open: boolean;
};

type RuntimeAlertDialogElement = HTMLElement & {
  open: boolean;
};

type RuntimeAspectRatioElement = HTMLElement & {
  ratio: string;
};

type RuntimeAvatarElement = HTMLElement & {
  src?: string;
};

type RuntimeBadgeElement = HTMLElement & {
  pressed: boolean;
};

function accordionPreviewMarkup(doc: string) {
  const match = doc.match(/<aria-accordion\\b[\\s\\S]*?<\\/aria-accordion>/);

  if (!match) {
    throw new Error("Missing accordion preview markup.");
  }

  return match[0];
}

function accordionExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\\bariaui-web-preview\\b[^"]*)" data-component="accordion" data-example-variant="([^"]+)">\\n\\s*(<aria-accordion[\\s\\S]*?<\\/aria-accordion>)\\n<\\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function alertExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="ariaui-web-preview" data-component="alert" data-example-variant="([^"]+)">\\n\\s*(<aria-alert[\\s\\S]*?<\\/aria-alert>)\\n<\\/div>/g),
  ).map((match) => ({
    variant: match[1],
    markup: match[2],
  }));
}

function dialogExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="ariaui-web-preview" data-component="dialog" data-example-variant="([^"]+)">\\n\\s*(<aria-dialog[\\s\\S]*?<\\/aria-dialog>)\\n<\\/div>/g),
  ).map((match) => ({
    variant: match[1],
    markup: match[2],
  }));
}

function alertDialogExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="ariaui-web-preview" data-component="alert-dialog" data-example-variant="([^"]+)">\\n\\s*(<aria-alert-dialog[\\s\\S]*?<\\/aria-alert-dialog>)\\n<\\/div>/g),
  ).map((match) => ({
    variant: match[1],
    markup: match[2],
  }));
}

function aspectRatioExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\\bariaui-web-preview\\b[^"]*)" data-component="aspect-ratio" data-example-variant="([^"]+)">\\n\\s*<div class="([^"]*\\bariaui-web-aspect-ratio-frame\\b[^"]*)">\\n\\s*(<aria-aspect-ratio[\\s\\S]*?<\\/aria-aspect-ratio>)\\n\\s*<\\/div>\\n<\\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    frameClassName: match[3],
    markup: match[4],
  }));
}

function avatarExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\\bariaui-web-preview\\b[^"]*)" data-component="avatar" data-example-variant="([^"]+)">\\n\\s*(<aria-avatar[\\s\\S]*?<\\/aria-avatar(?:-group)?>)\\n<\\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function badgeExamplePreviews(doc: string) {
  return Array.from(
    doc.matchAll(/<div class="([^"]*\\bariaui-web-preview\\b[^"]*)" data-component="badge" data-example-variant="([^"]+)">\\n\\s*([\\s\\S]*?)\\n<\\/div>/g),
  ).map((match) => ({
    className: match[1],
    variant: match[2],
    markup: match[3],
  }));
}

function expectHeadingsInOrder(doc: string, headings: readonly string[]) {
  let previousIndex = -1;

  for (const heading of headings) {
    const index = doc.indexOf(\`\\n\${heading}\\n\`);
    expect(index, \`missing heading: \${heading}\`).toBeGreaterThan(previousIndex);
    previousIndex = index;
  }
}

describe("docs package coverage", () => {
  it("has a docs page for every generated package", () => {
    const packagesPage = readDoc("overview/packages.md");

    for (const slug of packageSlugs) {
      expect(packagesPage).toContain(\`/components/\${slug}\`);
      expect(readDoc(\`components/\${slug}.md\`)).toContain(\`@ariaui-web/\${slug}\`);
    }

    for (const slug of hiddenPackageSlugs) {
      expect(packagesPage).not.toContain(\`/components/\${slug}\`);
      expect(readDoc(\`components/\${slug}.md\`)).toContain(\`@ariaui-web/\${slug}\`);
    }
  });

  it("uses readable package labels in the sidebar", () => {
    const config = readDoc(".vitepress/config.ts");

    for (const label of [
      "Alert Dialog",
      "Aspect Ratio",
      "Context Menu",
      "Dropdown Menu",
      "Hover Card",
      "Input OTP",
      "Navigation Menu",
      "Scroll Area",
      "Toggle Group",
    ]) {
      expect(config).toContain(\`"text": "\${label}"\`);
    }

    for (const label of [
      "AlertDialog",
      "AspectRatio",
      "ContextMenu",
      "DropdownMenu",
      "FocusScope",
      "HoverCard",
      "InputOtp",
      "NavigationMenu",
      "ScrollArea",
      "ToggleGroup",
    ]) {
      expect(config).not.toContain(\`"text": "\${label}"\`);
    }
  });
});

describe("native component docs", () => {
  it("documents native installation and registration without source-mirror framing", () => {
    for (const native of nativePackageExpectations) {
      const doc = readDoc(\`components/\${native.slug}.md\`);
      const lowerDoc = doc.toLowerCase();

      expect(doc).toContain(native.packageName);
      expect(doc).toContain(\`npm install \${native.packageName}\`);
      expect(doc).toContain(\`pnpm add \${native.packageName}\`);
      expect(doc).toContain(\`yarn add \${native.packageName}\`);
      expect(doc).toContain(\`import { \${native.defineFunctionName} } from "\${native.packageName}";\`);
      expect(doc).toContain(\`\${native.defineFunctionName}();\`);
      expect(doc).not.toContain(\`@ariaui/\${native.slug}\`);
      expect(doc).not.toContain("Source page:");
      expect(doc).not.toContain("Source live example");
      expect(doc).not.toContain("Aria UI renders");
      expect(lowerDoc).not.toContain("mirrors");
      expect(lowerDoc).not.toContain("mirrored");
    }
  });

  it("documents native custom element tags for every component part", () => {
    for (const native of nativePackageExpectations) {
      const doc = readDoc(\`components/\${native.slug}.md\`);

      for (const part of native.parts) {
        expect(doc).toContain(part.name);
        expect(doc).toContain(part.tagName);
      }
    }
  });

  it("renders stable live preview examples for every package page", () => {
    for (const native of nativePackageExpectations) {
      const doc = readDoc(\`components/\${native.slug}.md\`);

      expect(doc).toMatch(new RegExp(\`<div class="[^"]*\\\\bariaui-web-preview\\\\b[^"]*" data-component="\${native.slug}"\`));

      if (native.parts.length === 0) {
        expect(doc).toContain('data-example-part="Utility"');
        continue;
      }

      const expectedExampleParts = native.slug === "accordion"
        ? native.parts.filter((part) => ["Content", "Header", "Item", "Root", "Trigger"].includes(part.name))
        : native.slug === "dialog"
          ? native.parts
        : native.parts.slice(0, 4);

      for (const part of expectedExampleParts) {
        expect(doc).toContain(\`<\${part.tagName}\`);
        expect(doc).toContain(\`data-example-part="\${part.name}"\`);
      }
    }
  });
});

describe("working component docs examples", () => {
  it("keeps the aspect-ratio docs structured like the source Aria UI aspect ratio page", () => {
    const doc = readDoc("components/aspect-ratio.md");

    expect(doc).toContain("Displays content within a desired width-to-height ratio.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### 16 : 9",
      "### 21 : 9",
      "### 4 : 3",
      "### 1 : 1",
      "### 9 : 16",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source aspect-ratio example as a live custom element preview", () => {
    const doc = readDoc("components/aspect-ratio.md");
    const previews = aspectRatioExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "widescreen",
      "cinematic",
      "classic",
      "square",
      "portrait",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("p-12");
      expect(preview.frameClassName).toContain("ariaui-web-aspect-ratio-frame");
      expect(preview.markup).toContain("<aria-aspect-ratio");
      expect(preview.markup).toContain("/aspect-ratio-light.png");
      expect(preview.markup).toContain("/aspect-ratio-dark.png");
      expect(preview.markup).toContain("overflow-hidden rounded-xl border border-border/20 bg-background/90 shadow-lg backdrop-blur-xl");
      expect(preview.markup).toContain("h-full w-full object-cover rounded-xl");
      expect(preview.markup).toContain('alt="Colorful abstract gradient');
    }

    expect(previews.find((preview) => preview.variant === "widescreen")?.markup).toContain('ratio="16 / 9"');
    expect(previews.find((preview) => preview.variant === "cinematic")?.markup).toContain('ratio="21 / 9"');
    expect(previews.find((preview) => preview.variant === "classic")?.markup).toContain('ratio="4 / 3"');
    expect(previews.find((preview) => preview.variant === "square")?.markup).toContain('ratio="1"');
    expect(previews.find((preview) => preview.variant === "portrait")?.markup).toContain('ratio="9 / 16"');
  });

  it("keeps the generated aspect-ratio live examples behaviorally rendered", () => {
    defineAspectRatioElements();
    const previews = aspectRatioExamplePreviews(readDoc("components/aspect-ratio.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-aspect-ratio")) as RuntimeAspectRatioElement[];
    const expectedPadding = [56.25, 100 / (21 / 9), 75, 100, 100 / (9 / 16)];

    expect(roots).toHaveLength(5);
    roots.forEach((root, index) => {
      const fill = root.firstElementChild as HTMLElement | null;
      const lightImage = root.querySelector("img:not(.hidden)") as HTMLImageElement | null;

      expect(root.style.position).toBe("relative");
      expect(root.style.width).toBe("100%");
      expect(parseFloat(root.style.paddingBottom)).toBeCloseTo(expectedPadding[index] ?? 100, 3);
      expect(root.hasAttribute("role")).toBe(false);
      expect(root.hasAttribute("data-state")).toBe(false);
      expect(fill?.style.position).toBe("absolute");
      expect(fill?.style.inset).toBe("0px");
      expect(lightImage?.alt).toContain("Colorful abstract gradient");
    });

    document.body.replaceChildren();
  });

  it("keeps aspect-ratio live example containers full-width while the image frame stays compact", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="aspect-ratio"]');
    expect(style).toContain("box-sizing: border-box;");
    expect(style).toContain("width: 100%;");
    expect(style).toContain(".ariaui-web-aspect-ratio-frame");
    expect(style).toContain("max-width: 21.875rem;");
    const rootRule = style.match(/\\.ariaui-web-preview\\[data-component="aspect-ratio"\\] \\[data-example-part="Root"\\] \\{[^}]*\\}/)?.[0] ?? "";
    expect(rootRule).not.toContain("max-width:");
  });

  it("keeps the avatar docs structured like the source Aria UI avatar page", () => {
    const doc = readDoc("components/avatar.md");

    expect(doc).toContain("An image element with a fallback for representing the user.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### With image",
      "### Initials",
      "### Overlapping row",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Image",
      "### Fallback",
      "### Group",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source avatar example as a live custom element preview", () => {
    const previews = avatarExamplePreviews(readDoc("components/avatar.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "with-image",
      "initials",
      "overlapping-row",
    ]);

    const withImage = previews.find((preview) => preview.variant === "with-image")?.markup ?? "";
    expect(withImage).toContain("<aria-avatar");
    expect(withImage).toContain("<aria-avatar-image");
    expect(withImage).toContain('src="/avatar.png"');
    expect(withImage).toContain('alt="Profile photo"');
    expect(withImage).toContain("<aria-avatar-fallback");
    expect(withImage).toContain(">SC</aria-avatar-fallback>");
    expect(withImage).toContain("relative flex shrink-0 overflow-hidden rounded-full border-2 border-background");

    const initials = previews.find((preview) => preview.variant === "initials")?.markup ?? "";
    expect(initials).toContain('aria-label="Fallback avatar initials SC"');
    expect(initials).not.toContain("<aria-avatar-image");
    expect(initials).toContain(">SC</aria-avatar-fallback>");

    const group = previews.find((preview) => preview.variant === "overlapping-row")?.markup ?? "";
    expect(group).toContain("<aria-avatar-group");
    expect(group).toContain("-space-x-3 flex items-center pr-3");
    expect(group).toContain('alt="Team member 1"');
    expect(group).toContain('alt="Team member 2"');
    expect(group).toContain("MW");
    expect(group).toContain("SD");

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
    }
  });

  it("keeps the generated avatar live examples behaviorally rendered", () => {
    defineAvatarElements();
    const previews = avatarExamplePreviews(readDoc("components/avatar.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-avatar")) as RuntimeAvatarElement[];
    const images = Array.from(document.querySelectorAll("aria-avatar-image")) as RuntimeAvatarElement[];
    const fallbacks = Array.from(document.querySelectorAll("aria-avatar-fallback")) as RuntimeAvatarElement[];
    const group = document.querySelector("aria-avatar-group") as RuntimeAvatarElement | null;

    expect(roots.length).toBeGreaterThanOrEqual(6);
    expect(images).toHaveLength(3);
    expect(fallbacks.length).toBeGreaterThanOrEqual(6);
    expect(group?.getAttribute("role")).toBe("group");

    const firstImage = images[0];
    const firstRoot = firstImage?.closest("aria-avatar") as RuntimeAvatarElement | null;
    const firstFallback = firstRoot?.querySelector("aria-avatar-fallback") as HTMLElement | null;
    const img = firstImage?.querySelector("img") as HTMLImageElement | null;

    expect(firstRoot?.getAttribute("role")).toBe("img");
    expect(firstRoot?.getAttribute("aria-label")).toBe("avatar");
    expect(firstFallback?.hidden).toBe(false);
    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(img?.getAttribute("alt")).toBe("Profile photo");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");

    img?.dispatchEvent(new Event("load", { bubbles: false }));

    expect(firstRoot?.hasAttribute("role")).toBe(false);
    expect(firstRoot?.hasAttribute("aria-label")).toBe(false);
    expect(firstFallback?.hidden).toBe(true);
    expect(img?.hasAttribute("aria-hidden")).toBe(false);
    expect(img?.style.visibility).toBe("");

    document.body.replaceChildren();
  });

  it("keeps the badge docs structured like the source Aria UI badge page", () => {
    const doc = readDoc("components/badge.md");

    expect(doc).toContain("A minimal headless wrapper for status labels, counts, and tags.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Default",
      "### Secondary",
      "### Outline",
      "### Destructive",
      "### With icon",
      "### Circular / count",
      "### Action / link",
      "### Verified",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source badge example as a live custom element preview", () => {
    const previews = badgeExamplePreviews(readDoc("components/badge.md"));

    expect(previews.map((preview) => preview.variant)).toEqual([
      "default",
      "secondary",
      "outline",
      "destructive",
      "with-icon",
      "count",
      "link",
      "verified",
    ]);

    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.className).toContain("flex");
      expect(preview.className).toContain("flex-wrap");
      expect(preview.className).toContain("gap-4");
      expect(preview.className).toContain("px-6");
      expect(preview.className).toContain("py-10");
      expect(preview.markup).toContain("<aria-badge");
    }

    for (const variant of ["default", "secondary", "outline", "destructive", "with-icon", "link", "verified"]) {
      expect(previews.find((preview) => preview.variant === variant)?.markup).toContain("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold");
    }

    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain("Badge");
    expect(previews.find((preview) => preview.variant === "default")?.markup).toContain("bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover");
    expect(previews.find((preview) => preview.variant === "secondary")?.markup).toContain("Secondary");
    expect(previews.find((preview) => preview.variant === "outline")?.markup).toContain("border-border bg-transparent text-foreground hover:bg-secondary");
    expect(previews.find((preview) => preview.variant === "destructive")?.markup).toContain("Destructive");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("m4.5 12.75 6 6 9-13.5");
    expect(previews.find((preview) => preview.variant === "with-icon")?.markup).toContain("M12 9v3.75m9-.75a9 9");
    expect(previews.find((preview) => preview.variant === "count")?.markup).toContain("20+");
    expect(previews.find((preview) => preview.variant === "count")?.markup).toContain("inline-flex h-5 min-w-5 items-center justify-center rounded-full");
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain('as="a"');
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain('href="#"');
    expect(previews.find((preview) => preview.variant === "link")?.markup).toContain("M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3");
    expect(previews.find((preview) => preview.variant === "verified")?.markup).toContain("CheckBadgeIcon");
    expect(previews.find((preview) => preview.variant === "verified")?.markup).toContain("Verified");
  });

  it("keeps the generated badge live examples behaviorally rendered", () => {
    defineBadgeElements();
    const previews = badgeExamplePreviews(readDoc("components/badge.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-badge")) as RuntimeBadgeElement[];
    const staticRoot = roots[0] ?? null;
    const linkRoots = Array.from(document.querySelectorAll('aria-badge[as="a"]')) as RuntimeBadgeElement[];
    const iconSvgs = Array.from(document.querySelectorAll('aria-badge svg[aria-hidden="true"]'));

    expect(roots).toHaveLength(13);
    expect(staticRoot?.textContent?.trim()).toBe("Badge");
    expect(staticRoot?.hasAttribute("role")).toBe(false);
    expect(staticRoot?.hasAttribute("aria-label")).toBe(false);
    expect(staticRoot?.hasAttribute("tabindex")).toBe(false);
    expect(staticRoot?.hasAttribute("data-state")).toBe(false);
    expect(staticRoot?.hasAttribute("data-variant")).toBe(false);
    expect(staticRoot?.hasAttribute("data-slot")).toBe(false);
    expect(iconSvgs.length).toBeGreaterThanOrEqual(5);

    expect(linkRoots).toHaveLength(3);
    for (const linkRoot of linkRoots) {
      expect(linkRoot.getAttribute("href")).toBe("#");
      expect(linkRoot.getAttribute("role")).toBe("link");
      expect(linkRoot.getAttribute("tabindex")).toBe("0");
    }

    let clickCount = 0;
    linkRoots[0]?.addEventListener("click", (event) => {
      event.preventDefault();
      clickCount += 1;
    });
    linkRoots[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(clickCount).toBe(1);

    document.body.replaceChildren();
  });

  it("keeps badge live example styles scoped to the badge docs page", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain('.ariaui-web-preview[data-component="badge"]');
    expect(style).toContain('.ariaui-web-preview[data-component="badge"] [data-example-part="Root"]');
    expect(style).toContain("inline-flex");
    expect(style).toContain("border-radius: 0.375rem;");
    expect(style).toContain("text-decoration: none;");
  });

  it("keeps the alert docs structured like the source Aria UI alert page", () => {
    const doc = readDoc("components/alert.md");

    expect(doc).toContain("Displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Success",
      "### Warning",
      "### Error",
      "### With actions",
      "### Dismissible",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Title",
      "### Description",
      "### Action",
      "### Close",
      "### Cancel",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source alert example as a live custom element preview", () => {
    const doc = readDoc("components/alert.md");
    const previews = alertExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "success",
      "warning",
      "error",
      "with-actions",
      "dismissible",
    ]);

    for (const preview of previews) {
      expect(preview.markup).toContain('class="relative w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 shadow-sm"');
      expect(preview.markup).toContain("<aria-alert-title");
      expect(preview.markup).toContain("<aria-alert-description");
    }

    expect(previews.find((preview) => preview.variant === "success")?.markup).toContain("Your changes have been saved successfully.");
    expect(previews.find((preview) => preview.variant === "warning")?.markup).toContain("Your session will expire in 5 minutes.");
    expect(previews.find((preview) => preview.variant === "error")?.markup).toContain("We could not load your data.");
    expect(previews.find((preview) => preview.variant === "with-actions")?.markup).toContain("Payment failed");
    expect(previews.find((preview) => preview.variant === "with-actions")?.markup).toContain("<aria-alert-action");
    expect(previews.find((preview) => preview.variant === "with-actions")?.markup).toContain("<aria-alert-cancel");
    expect(previews.find((preview) => preview.variant === "dismissible")?.markup).toContain("Maintenance scheduled");
    expect(previews.find((preview) => preview.variant === "dismissible")?.markup).toContain("<aria-alert-close");
    expect(previews.find((preview) => preview.variant === "success")?.markup).toContain("text-icon-success");
    expect(previews.find((preview) => preview.variant === "warning")?.markup).toContain("text-icon-warning");
    expect(previews.find((preview) => preview.variant === "error")?.markup).toContain("text-icon-destructive");
  });

  it("keeps the generated alert live examples behaviorally interactive", async () => {
    defineAlertElements();
    const previews = alertExamplePreviews(readDoc("components/alert.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-alert")) as RuntimeAlertElement[];
    const dismissible = roots.find((root) => root.textContent?.includes("Maintenance scheduled"));
    const withActions = roots.find((root) => root.textContent?.includes("Payment failed"));

    expect(roots).toHaveLength(5);
    expect(roots.every((root) => root.getAttribute("aria-labelledby"))).toBe(true);
    expect(roots.every((root) => root.getAttribute("aria-describedby"))).toBe(true);
    expect(dismissible?.open).toBe(true);
    expect(dismissible?.hidden).toBe(false);

    const close = dismissible?.querySelector("aria-alert-close") as RuntimeAlertElement | null;
    close?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(dismissible?.open).toBe(false);
    expect(dismissible?.hidden).toBe(true);

    const cancel = withActions?.querySelector("aria-alert-cancel") as RuntimeAlertElement | null;
    cancel?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(withActions?.open).toBe(false);
    expect(withActions?.hidden).toBe(true);

    document.body.replaceChildren();
  });

  it("keeps the dialog docs structured like the source Aria UI dialog page", () => {
    const doc = readDoc("components/dialog.md");

    expect(doc).toContain("A modal dialog that opens above the page for focused tasks such as editing profile details.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Edit profile",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Trigger",
      "### Portal",
      "### Overlay",
      "### Content",
      "### Title",
      "### Description",
      "### Close",
      "### Cancel",
      "### Action",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source dialog example as a live custom element preview", () => {
    const doc = readDoc("components/dialog.md");
    const previews = dialogExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "edit-profile",
      "framer-motion",
    ]);

    for (const preview of previews) {
      expect(preview.markup).toContain('class="ariaui-web-dialog-example');
      expect(preview.markup).toContain("<aria-dialog-trigger");
      expect(preview.markup).toContain("<aria-dialog-portal");
      expect(preview.markup).toContain("<aria-dialog-overlay");
      expect(preview.markup).toContain("<aria-dialog-content");
      expect(preview.markup).toContain("<aria-dialog-title");
      expect(preview.markup).toContain("<aria-dialog-description");
      expect(preview.markup).toContain("<aria-dialog-cancel");
      expect(preview.markup).toContain("<aria-dialog-action");
      expect(preview.markup).toContain("<aria-dialog-close");
      expect(preview.markup).toContain("Edit Profile");
      expect(preview.markup).toContain("Edit profile");
      expect(preview.markup).toContain("Make changes to your profile here. Click save when you're done.");
      expect(preview.markup).toContain("Pedro Duarte");
      expect(preview.markup).toContain("@peduarte");
      expect(preview.markup).toContain("Save changes");
      expect(preview.markup).toContain("M6 18 18 6M6 6l12 12");
    }

    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain("ariaui-web-dialog-motion-example");
  });

  it("keeps the generated dialog live examples behaviorally interactive", async () => {
    defineDialogElements();
    const previews = dialogExamplePreviews(readDoc("components/dialog.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-dialog")) as RuntimeDialogElement[];
    const root = roots[0] ?? null;
    const trigger = root?.querySelector("aria-dialog-trigger") as RuntimeDialogElement | null;
    const portal = root?.querySelector("aria-dialog-portal") as RuntimeDialogElement | null;
    const overlay = root?.querySelector("aria-dialog-overlay") as RuntimeDialogElement | null;
    const content = root?.querySelector("aria-dialog-content") as RuntimeDialogElement | null;
    const title = root?.querySelector("aria-dialog-title") as RuntimeDialogElement | null;
    const description = root?.querySelector("aria-dialog-description") as RuntimeDialogElement | null;
    const cancel = root?.querySelector("aria-dialog-cancel") as RuntimeDialogElement | null;

    expect(roots).toHaveLength(2);
    expect(root?.open).toBe(false);
    expect(root?.hasAttribute("aria-expanded")).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(portal?.hidden).toBe(true);
    expect(overlay?.hidden).toBe(true);
    expect(content?.hidden).toBe(true);
    expect(content?.hasAttribute("role")).toBe(false);

    trigger?.click();
    await new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));

    expect(root?.open).toBe(true);
    expect(root?.hasAttribute("aria-expanded")).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(trigger?.getAttribute("aria-controls")).toBe(content?.id);
    expect(portal?.hidden).toBe(false);
    expect(overlay?.hidden).toBe(false);
    expect(content?.hidden).toBe(false);
    expect(content?.getAttribute("role")).toBe("dialog");
    expect(content?.getAttribute("aria-modal")).toBe("true");
    expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
    expect(document.activeElement).toBe(cancel);

    trigger?.click();
    await new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));

    expect(root?.open).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(content?.hidden).toBe(true);
    expect(content?.hasAttribute("role")).toBe(false);
    expect(document.activeElement).toBe(trigger);

    document.body.replaceChildren();
  });

  it("keeps the alert-dialog docs structured like the source Aria UI alert dialog page", () => {
    const doc = readDoc("components/alert-dialog.md");

    expect(doc).toContain("A modal dialog that interrupts the user with important content and expects a response.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Destructive confirmation",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Trigger",
      "### Portal",
      "### Overlay",
      "### Content",
      "### Title",
      "### Description",
      "### Icon",
      "### Cancel",
      "### Action",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders every source alert-dialog example as a live custom element preview", () => {
    const doc = readDoc("components/alert-dialog.md");
    const previews = alertDialogExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "destructive",
      "framer-motion",
    ]);

    for (const preview of previews) {
      const markup = preview.markup ?? "";
      expect(markup).toContain('class="ariaui-web-alert-dialog-example');
      expect(markup).toContain("<aria-alert-dialog-trigger");
      expect(markup).toContain("<aria-alert-dialog-portal");
      expect(markup).toContain("<aria-alert-dialog-overlay");
      expect(markup).toContain("<aria-alert-dialog-content");
      expect(markup).toContain("<aria-alert-dialog-title");
      expect(markup).toContain("<aria-alert-dialog-description");
      expect(markup).toContain("<aria-alert-dialog-cancel");
      expect(markup).toContain("<aria-alert-dialog-action");
      expect(markup).toContain("Delete account");
      expect(markup).toContain("Are you absolutely sure?");
      expect(markup).toContain("This action cannot be undone. This will permanently delete your account and remove your data from our servers.");
      expect(markup).toContain("Cancel");

      const template = document.createElement("template");
      template.innerHTML = markup;
      const root = template.content.querySelector("aria-alert-dialog");
      const portal = root?.querySelector("aria-alert-dialog-portal");
      const content = root?.querySelector("aria-alert-dialog-content");
      const stack = content?.firstElementChild;
      const copy = stack?.children[0] ?? null;
      const actions = stack?.children[1] ?? null;

      expect(root?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-trigger");
      expect(root?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-portal");
      expect(portal?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-overlay");
      expect(portal?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-content");
      expect(stack?.classList.contains("ariaui-web-alert-dialog-stack")).toBe(true);
      expect(copy?.classList.contains("ariaui-web-alert-dialog-copy")).toBe(true);
      expect(copy?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-title");
      expect(copy?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-description");
      expect(actions?.classList.contains("ariaui-web-alert-dialog-actions")).toBe(true);
      expect(actions?.children[0]?.tagName.toLowerCase()).toBe("aria-alert-dialog-cancel");
      expect(actions?.children[1]?.tagName.toLowerCase()).toBe("aria-alert-dialog-action");
    }

    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain("ariaui-web-alert-dialog-motion-example");
  });

  it("keeps the generated alert-dialog live examples behaviorally interactive", async () => {
    defineAlertDialogElements();
    const previews = alertDialogExamplePreviews(readDoc("components/alert-dialog.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-alert-dialog")) as RuntimeAlertDialogElement[];
    const root = roots[0] ?? null;
    const trigger = root?.querySelector("aria-alert-dialog-trigger") as RuntimeAlertDialogElement | null;
    const portal = root?.querySelector("aria-alert-dialog-portal") as RuntimeAlertDialogElement | null;
    const overlay = root?.querySelector("aria-alert-dialog-overlay") as RuntimeAlertDialogElement | null;
    const content = root?.querySelector("aria-alert-dialog-content") as RuntimeAlertDialogElement | null;
    const title = root?.querySelector("aria-alert-dialog-title") as RuntimeAlertDialogElement | null;
    const description = root?.querySelector("aria-alert-dialog-description") as RuntimeAlertDialogElement | null;
    const cancel = root?.querySelector("aria-alert-dialog-cancel") as RuntimeAlertDialogElement | null;

    expect(roots).toHaveLength(2);
    expect(root?.open).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(portal?.hidden).toBe(true);
    expect(overlay?.hidden).toBe(true);
    expect(content?.hidden).toBe(true);

    trigger?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(root?.open).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(portal?.hidden).toBe(false);
    expect(overlay?.hidden).toBe(false);
    expect(content?.hidden).toBe(false);
    expect(content?.getAttribute("role")).toBe("alertdialog");
    expect(content?.getAttribute("aria-modal")).toBe("true");
    expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
    expect(document.activeElement).toBe(cancel);

    cancel?.click();
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(root?.open).toBe(false);
    expect(content?.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);

    document.body.replaceChildren();
  });

  it("keeps the accordion docs structured like the source Aria UI accordion page", () => {
    const doc = readDoc("components/accordion.md");

    expect(doc).toContain("A vertically stacked set of interactive headings that each reveal an associated section of content.");
    expectHeadingsInOrder(doc, [
      "## Features",
      "## Installation",
      "## Examples",
      "## Anatomy",
      "## API Reference",
      "## Keyboard",
      "## Accessibility",
    ]);
    expectHeadingsInOrder(doc, [
      "### Single",
      "### Multiple",
      "### Horizontal",
      "### Fold Effect",
      "### Framer Motion",
    ]);
    expectHeadingsInOrder(doc, [
      "### Root",
      "### Item",
      "### Header",
      "### Trigger",
      "### Content",
    ]);
    expect(doc).not.toMatch(/^## Register Elements$/m);
    expect(doc).not.toMatch(/^## Web Component Contract$/m);
  });

  it("renders an interactive accordion web component example", () => {
    const doc = readDoc("components/accordion.md");

    expect(doc).not.toContain("ariaui-web-accordion");
    expect(doc).toContain("w-full max-w-md rounded-lg border border-border bg-background shadow-sm");
    expect(doc).toContain("group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50");
    expect(doc).toContain("h-4 w-4 shrink-0 text-muted-foreground group-aria-[expanded=true]:rotate-180 group-aria-[expanded=true]:text-icon");
    expect(doc).toContain("M5.22 8.22a.75.75");
    expect(doc).toContain('type="single"');
    expect(doc).toContain('collapsible="true"');
    expect(doc).toContain('default-value="accessible"');
    expect(doc).toContain('value="accessible"');
    expect(doc).toContain('value="styled"');
    expect(doc).toContain('value="animated"');
    expect(doc).toContain('aria-controls="accordion-accessible-panel"');
    expect(doc).toContain("Is it accessible?");
    expect(doc).toContain("Yes. It adheres to the WAI-ARIA design pattern.");
    expect(doc).toContain("Is it styled?");
    expect(doc).toContain("Yes. It comes with default styles that match the other components' aesthetic.");
    expect(doc).toContain("Is it animated?");
    expect(doc).toContain("Yes. It's animated by default, but you can disable it if you prefer.");
    expect(doc).not.toContain("Shipping");
    expect(doc).not.toContain("Returns");
    expect(doc).toContain('<aria-accordion-trigger');
    expect(doc).toContain('<aria-accordion-content');
    expect(doc).toContain('hidden');
  });

  it("renders every source accordion example as a live custom element preview", () => {
    const doc = readDoc("components/accordion.md");
    const previews = accordionExamplePreviews(doc);

    expect(previews.map((preview) => preview.variant)).toEqual([
      "single",
      "multiple",
      "horizontal",
      "fold",
      "framer-motion",
    ]);
    for (const preview of previews) {
      expect(preview.className).toContain("ariaui-web-preview");
      expect(preview.markup).not.toContain("ariaui-web-accordion");
      expect(preview.markup).toContain("<aria-accordion-item");
      expect(preview.markup).toContain("<aria-accordion-trigger");
      expect(preview.markup).toContain("<aria-accordion-content");
    }

    for (const variant of ["single", "multiple", "framer-motion"]) {
      const markup = previews.find((preview) => preview.variant === variant)?.markup ?? "";
      expect(markup).toContain("w-full max-w-md rounded-lg border border-border bg-background shadow-sm");
      expect(markup).toContain("border-b border-border last:border-b-0 data-[state=open]:bg-muted/20");
      expect(markup).toContain("group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50");
      expect(markup).toContain("group-aria-[expanded=true]:rotate-180");
    }

    expect(previews.find((preview) => preview.variant === "multiple")?.markup).toContain('type="multiple"');
    expect(previews.find((preview) => preview.variant === "multiple")?.markup).toContain("Pass defaultValue as an array");
    expect(previews.find((preview) => preview.variant === "horizontal")?.markup).toContain('orientation="horizontal"');
    expect(previews.find((preview) => preview.variant === "horizontal")?.markup).toContain("flex h-56 flex-row overflow-hidden rounded-lg border border-border bg-background shadow-sm");
    expect(previews.find((preview) => preview.variant === "horizontal")?.markup).toContain("writing-vertical-rl group-data-[state=open]:text-foreground");
    expect(previews.find((preview) => preview.variant === "fold")?.markup).toContain('force-mount');
    expect(previews.find((preview) => preview.variant === "fold")?.markup).toContain("flex h-56 w-full flex-row gap-0 overflow-hidden rounded-lg border border-border bg-muted p-0 shadow-sm sm:gap-1 sm:p-1");
    expect(previews.find((preview) => preview.variant === "fold")?.markup).toContain("sm:w-xs");
    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain('force-mount');
  });

  it("keeps hidden preview content visually hidden", () => {
    const style = readDoc(".vitepress/theme/style.css");

    expect(style).toContain(".ariaui-web-preview [hidden]");
    expect(style).toContain("display: none !important;");
    expect(style).not.toContain("ariaui-web-accordion");
  });

  it("keeps the generated accordion live example behaviorally interactive", () => {
    defineAccordionElements();
    const previews = accordionExamplePreviews(readDoc("components/accordion.md"));
    document.body.innerHTML = previews.map((preview) => preview.markup).join("\\n");

    const roots = Array.from(document.querySelectorAll("aria-accordion")) as RuntimeAccordionElement[];
    const root = roots[0] ?? null;
    const triggers = Array.from(root?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    const contents = Array.from(root?.querySelectorAll("aria-accordion-content") ?? []) as RuntimeAccordionElement[];

    expect(roots).toHaveLength(5);
    expect(root).not.toBeNull();
    expect(root?.value).toBe("accessible");
    expect(triggers).toHaveLength(3);
    expect(contents).toHaveLength(3);
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");
    expect(triggers[2]?.getAttribute("aria-expanded")).toBe("false");
    expect(contents[0]?.hidden).toBe(false);
    expect(contents[1]?.hidden).toBe(true);
    expect(contents[2]?.hidden).toBe(true);

    triggers[1]?.click();
    expect(root?.value).toBe("styled");
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[2]?.getAttribute("aria-expanded")).toBe("false");
    expect(contents[0]?.hidden).toBe(true);
    expect(contents[1]?.hidden).toBe(false);
    expect(contents[2]?.hidden).toBe(true);

    triggers[1]?.click();
    expect(root?.value).toBe("");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");
    expect(contents[1]?.hidden).toBe(true);

    const multiple = roots[1];
    const multipleTriggers = Array.from(multiple?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    expect(multiple?.value).toBe("multiple-open,accessible");
    expect(multipleTriggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual(["true", "true", "false"]);
    multipleTriggers[2]?.click();
    expect(multiple?.value).toBe("multiple-open,accessible,animated");

    const horizontal = roots[2];
    const horizontalTriggers = Array.from(horizontal?.querySelectorAll("aria-accordion-trigger") ?? []) as RuntimeAccordionElement[];
    expect(horizontal?.getAttribute("orientation")).toBe("horizontal");
    expect(horizontal?.value).toBe("overview");
    horizontalTriggers[1]?.click();
    expect(horizontal?.value).toBe("analytics");

    const fold = roots[3];
    const foldContents = Array.from(fold?.querySelectorAll("aria-accordion-content") ?? []) as RuntimeAccordionElement[];
    expect(fold?.getAttribute("orientation")).toBe("horizontal");
    expect(foldContents.every((content) => content.hasAttribute("force-mount"))).toBe(true);

    const motion = roots[4];
    const motionContents = Array.from(motion?.querySelectorAll("aria-accordion-content") ?? []) as RuntimeAccordionElement[];
    expect(motion?.value).toBe("accessible");
    expect(motionContents.every((content) => content.hasAttribute("force-mount"))).toBe(true);

    document.body.replaceChildren();
  });
});
`;
}

function writeDocs(packageNames, specs) {
  resetDir(docsRoot);
  mkdirSync(join(docsRoot, "docs", "public"), { recursive: true });
  for (const assetName of ["aspect-ratio-light.png", "aspect-ratio-dark.png", "avatar.png"]) {
    const sourceAssetPath = join(sourceDocsPublicRoot, assetName);
    if (existsSync(sourceAssetPath)) {
      copyFileSync(sourceAssetPath, join(docsRoot, "docs", "public", assetName));
    }
  }

  writeJson(join(docsRoot, "package.json"), docsPackageJson(packageNames));
  writeJson(join(docsRoot, "tsconfig.json"), {
    extends: "../../tsconfig.json",
    include: ["docs/**/*.ts", "__test__/**/*.ts"],
    exclude: ["docs/.vitepress/cache", "docs/.vitepress/dist", "node_modules"],
  });
  write(join(docsRoot, "docs", ".vitepress", "config.ts"), vitePressConfig(packageNames, specs));
  write(join(docsRoot, "docs", ".vitepress", "theme", "index.ts"), docsTheme(packageNames));
  write(join(docsRoot, "docs", ".vitepress", "theme", "style.css"), docsStyle());
  write(join(docsRoot, "docs", "index.md"), docsIndex(specs));
  write(join(docsRoot, "docs", "overview", "introduction.md"), introductionPage(specs));
  write(join(docsRoot, "docs", "overview", "testing.md"), testingPage());
  write(join(docsRoot, "docs", "overview", "packages.md"), packagesPage(specs));

  for (const spec of specs) {
    write(join(docsRoot, "docs", "components", `${spec.slug}.md`), componentDocPage(spec));
  }

  write(join(docsRoot, "__test__", "docs.test.ts"), docsTests(specs));
}

function packageMap(packageNames) {
  return `# Package Map

Generated from \`ariaui/packages\`.

| Source | Web Component |
| --- | --- |
${packageNames.map((name) => `| \`${sourceScope}/${name}\` | \`${packageScope}/${name}\` |`).join("\n")}
`;
}

function readme(packageNames) {
  return `# ariaui-web

Browser-native Web Component packages under the \`${packageScope}\` scope.

This workspace keeps package directory names under the \`${packageScope}\` scope and exposes native custom elements. Each package has:

- separated source files for each component part
- \`readme.md\` for the native Web Component contract
- unit tests for runtime behavior and spec alignment
- VitePress documentation under \`web/doc\`

## Commands

\`\`\`bash
pnpm install
pnpm generate
pnpm test
pnpm lint
pnpm --filter ${packageScope}/doc build
\`\`\`

Generated packages: ${packageNames.length}.
`;
}

function agents() {
  return `## ariaui-web

This project builds browser-native Web Component packages under the @ariaui-web scope.

Rules:
- Keep package names under the @ariaui-web scope.
- Preserve package directory names and docs slugs unless the package catalog changes.
- Prefer browser-native custom elements and separated part modules over framework-specific patterns.
- Every package must keep a readme.md file and package-level unit tests.
- Re-run \`node scripts/generate-from-ariaui.mjs\` after source package/doc additions, then review generated changes before editing by hand.
`;
}

function turboConfig() {
  return {
    $schema: "https://turbo.build/schema.json",
    tasks: {
      build: {
        dependsOn: ["^build"],
        outputs: ["dist/**", "docs/.vitepress/dist/**"],
      },
      dev: {
        cache: false,
        persistent: true,
      },
      lint: {
        dependsOn: ["^build"],
      },
      test: {
        dependsOn: ["^build"],
      },
      clean: {
        cache: false,
      },
    },
  };
}

function pnpmWorkspace() {
  return `packages:
  - "packages/*"
  - "web/doc"
`;
}

function writeRoot(packageNames, specs) {
  writeJson(join(targetRoot, "package.json"), rootPackageJson(packageNames));
  writeJson(join(targetRoot, "tsconfig.json"), rootTsConfig(packageNames));
  writeJson(join(targetRoot, "turbo.json"), turboConfig());
  write(join(targetRoot, "pnpm-workspace.yaml"), pnpmWorkspace());
  write(join(targetRoot, "README.md"), readme(packageNames));
  write(join(targetRoot, "AGENTS.md"), agents());
  write(join(targetRoot, "PACKAGE_MAP.md"), packageMap(packageNames));
  write(
    join(targetRoot, "vitest.config.ts"),
    `import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const aliases = {
${packageNames.map((name) => `  "${packageScope}/${name}": fileURLToPath(new URL("./packages/${name}/src/index.ts", import.meta.url)),`).join("\n")}
};

export default defineConfig({
  resolve: {
    alias: aliases,
  },
  test: {
    environment: "jsdom",
    include: ["packages/*/__test__/**/*.test.ts", "web/doc/__test__/**/*.test.ts"],
    globals: true,
  },
});
`,
  );

  const sourcePnpmLock = join(sourceRoot, "pnpm-lock.yaml");
  if (existsSync(sourcePnpmLock)) {
    copyFileSync(sourcePnpmLock, join(targetRoot, "SOURCE-pnpm-lock.yaml"));
  }

  write(
    join(targetRoot, "scripts", "package-count.json"),
    JSON.stringify({ packageCount: packageNames.length, componentCount: specs.filter((spec) => spec.kind === "component").length }, null, 2),
  );
}

function main() {
  if (!existsSync(sourcePackages)) {
    throw new Error(`Cannot find source packages at ${sourcePackages}`);
  }

  const packageNames = findPackageNames();
  const specs = packageNames.map(buildComponentSpec);

  resetDir(targetPackages);
  writeRoot(packageNames, specs);

  for (const spec of specs) {
    if (spec.kind === "component") {
      writeComponentPackage(spec.slug, spec);
    } else {
      writeUtilityPackage(spec.slug, spec);
    }
  }

  writeDocs(packageNames, specs);

  console.log(`Generated ${packageNames.length} packages and ${specs.length} docs pages in ${targetRoot}`);
}

main();
