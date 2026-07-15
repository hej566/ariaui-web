import { fileURLToPath } from "node:url";
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
        items: [
        {
                "text": "Introduction",
                "link": "/overview/introduction"
        },
        {
                "text": "Packages",
                "link": "/overview/packages"
        },
        {
                "text": "Testing",
                "link": "/overview/testing"
        }
],
      },
      {
        text: "Packages",
        items: [
        {
                "text": "Accordion",
                "link": "/components/accordion"
        },
        {
                "text": "Alert",
                "link": "/components/alert"
        },
        {
                "text": "Alert Dialog",
                "link": "/components/alert-dialog"
        },
        {
                "text": "Aspect Ratio",
                "link": "/components/aspect-ratio"
        },
        {
                "text": "Avatar",
                "link": "/components/avatar"
        },
        {
                "text": "Badge",
                "link": "/components/badge"
        },
        {
                "text": "Breadcrumb",
                "link": "/components/breadcrumb"
        },
        {
                "text": "Button",
                "link": "/components/button"
        },
        {
                "text": "Calendar",
                "link": "/components/calendar"
        },
        {
                "text": "Card",
                "link": "/components/card"
        },
        {
                "text": "Carousel",
                "link": "/components/carousel"
        },
        {
                "text": "Checkbox",
                "link": "/components/checkbox"
        },
        {
                "text": "Combobox",
                "link": "/components/combobox"
        },
        {
                "text": "Command",
                "link": "/components/command"
        },
        {
                "text": "Context Menu",
                "link": "/components/context-menu"
        },
        {
                "text": "Datepicker",
                "link": "/components/datepicker"
        },
        {
                "text": "Dialog",
                "link": "/components/dialog"
        },
        {
                "text": "Disclosure",
                "link": "/components/disclosure"
        },
        {
                "text": "Drawer",
                "link": "/components/drawer"
        },
        {
                "text": "Dropdown Menu",
                "link": "/components/dropdown-menu"
        },
        {
                "text": "Grid",
                "link": "/components/grid"
        },
        {
                "text": "Hover Card",
                "link": "/components/hover-card"
        },
        {
                "text": "Input",
                "link": "/components/input"
        },
        {
                "text": "Input OTP",
                "link": "/components/input-otp"
        },
        {
                "text": "Kbd",
                "link": "/components/kbd"
        },
        {
                "text": "Keyboard",
                "link": "/components/keyboard"
        },
        {
                "text": "Label",
                "link": "/components/label"
        },
        {
                "text": "Listbox",
                "link": "/components/listbox"
        },
        {
                "text": "Menubar",
                "link": "/components/menubar"
        },
        {
                "text": "Navigation Menu",
                "link": "/components/navigation-menu"
        },
        {
                "text": "Pagination",
                "link": "/components/pagination"
        },
        {
                "text": "Popover",
                "link": "/components/popover"
        },
        {
                "text": "Portal",
                "link": "/components/portal"
        },
        {
                "text": "Position",
                "link": "/components/position"
        },
        {
                "text": "Progress",
                "link": "/components/progress"
        },
        {
                "text": "Radio",
                "link": "/components/radio"
        },
        {
                "text": "Scroll Area",
                "link": "/components/scroll-area"
        },
        {
                "text": "Select",
                "link": "/components/select"
        },
        {
                "text": "Separator",
                "link": "/components/separator"
        },
        {
                "text": "Sidebar",
                "link": "/components/sidebar"
        },
        {
                "text": "Skeleton",
                "link": "/components/skeleton"
        },
        {
                "text": "Slider",
                "link": "/components/slider"
        },
        {
                "text": "Slot",
                "link": "/components/slot"
        },
        {
                "text": "Spinbutton",
                "link": "/components/spinbutton"
        },
        {
                "text": "Spinner",
                "link": "/components/spinner"
        },
        {
                "text": "Splitter",
                "link": "/components/splitter"
        },
        {
                "text": "Switch",
                "link": "/components/switch"
        },
        {
                "text": "Table",
                "link": "/components/table"
        },
        {
                "text": "Tabs",
                "link": "/components/tabs"
        },
        {
                "text": "Textarea",
                "link": "/components/textarea"
        },
        {
                "text": "Toast",
                "link": "/components/toast"
        },
        {
                "text": "Toggle",
                "link": "/components/toggle"
        },
        {
                "text": "Toggle Group",
                "link": "/components/toggle-group"
        },
        {
                "text": "Tokens",
                "link": "/components/tokens"
        },
        {
                "text": "Tooltip",
                "link": "/components/tooltip"
        },
        {
                "text": "Treegrid",
                "link": "/components/treegrid"
        },
        {
                "text": "Treeview",
                "link": "/components/treeview"
        },
        {
                "text": "Tsconfig",
                "link": "/components/tsconfig"
        },
        {
                "text": "Upload",
                "link": "/components/upload"
        },
        {
                "text": "Utils",
                "link": "/components/utils"
        }
],
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
      "@ariaui-web/accordion": fileURLToPath(new URL("../../../../packages/accordion/src/index.ts", import.meta.url)),
      "@ariaui-web/alert": fileURLToPath(new URL("../../../../packages/alert/src/index.ts", import.meta.url)),
      "@ariaui-web/alert-dialog": fileURLToPath(new URL("../../../../packages/alert-dialog/src/index.ts", import.meta.url)),
      "@ariaui-web/arrow": fileURLToPath(new URL("../../../../packages/arrow/src/index.ts", import.meta.url)),
      "@ariaui-web/aspect-ratio": fileURLToPath(new URL("../../../../packages/aspect-ratio/src/index.ts", import.meta.url)),
      "@ariaui-web/avatar": fileURLToPath(new URL("../../../../packages/avatar/src/index.ts", import.meta.url)),
      "@ariaui-web/badge": fileURLToPath(new URL("../../../../packages/badge/src/index.ts", import.meta.url)),
      "@ariaui-web/breadcrumb": fileURLToPath(new URL("../../../../packages/breadcrumb/src/index.ts", import.meta.url)),
      "@ariaui-web/button": fileURLToPath(new URL("../../../../packages/button/src/index.ts", import.meta.url)),
      "@ariaui-web/calendar": fileURLToPath(new URL("../../../../packages/calendar/src/index.ts", import.meta.url)),
      "@ariaui-web/card": fileURLToPath(new URL("../../../../packages/card/src/index.ts", import.meta.url)),
      "@ariaui-web/carousel": fileURLToPath(new URL("../../../../packages/carousel/src/index.ts", import.meta.url)),
      "@ariaui-web/checkbox": fileURLToPath(new URL("../../../../packages/checkbox/src/index.ts", import.meta.url)),
      "@ariaui-web/combobox": fileURLToPath(new URL("../../../../packages/combobox/src/index.ts", import.meta.url)),
      "@ariaui-web/command": fileURLToPath(new URL("../../../../packages/command/src/index.ts", import.meta.url)),
      "@ariaui-web/context-menu": fileURLToPath(new URL("../../../../packages/context-menu/src/index.ts", import.meta.url)),
      "@ariaui-web/datepicker": fileURLToPath(new URL("../../../../packages/datepicker/src/index.ts", import.meta.url)),
      "@ariaui-web/dialog": fileURLToPath(new URL("../../../../packages/dialog/src/index.ts", import.meta.url)),
      "@ariaui-web/disclosure": fileURLToPath(new URL("../../../../packages/disclosure/src/index.ts", import.meta.url)),
      "@ariaui-web/drawer": fileURLToPath(new URL("../../../../packages/drawer/src/index.ts", import.meta.url)),
      "@ariaui-web/dropdown-menu": fileURLToPath(new URL("../../../../packages/dropdown-menu/src/index.ts", import.meta.url)),
      "@ariaui-web/focus-scope": fileURLToPath(new URL("../../../../packages/focus-scope/src/index.ts", import.meta.url)),
      "@ariaui-web/grid": fileURLToPath(new URL("../../../../packages/grid/src/index.ts", import.meta.url)),
      "@ariaui-web/hooks": fileURLToPath(new URL("../../../../packages/hooks/src/index.ts", import.meta.url)),
      "@ariaui-web/hover-card": fileURLToPath(new URL("../../../../packages/hover-card/src/index.ts", import.meta.url)),
      "@ariaui-web/input": fileURLToPath(new URL("../../../../packages/input/src/index.ts", import.meta.url)),
      "@ariaui-web/input-otp": fileURLToPath(new URL("../../../../packages/input-otp/src/index.ts", import.meta.url)),
      "@ariaui-web/kbd": fileURLToPath(new URL("../../../../packages/kbd/src/index.ts", import.meta.url)),
      "@ariaui-web/keyboard": fileURLToPath(new URL("../../../../packages/keyboard/src/index.ts", import.meta.url)),
      "@ariaui-web/label": fileURLToPath(new URL("../../../../packages/label/src/index.ts", import.meta.url)),
      "@ariaui-web/listbox": fileURLToPath(new URL("../../../../packages/listbox/src/index.ts", import.meta.url)),
      "@ariaui-web/menubar": fileURLToPath(new URL("../../../../packages/menubar/src/index.ts", import.meta.url)),
      "@ariaui-web/navigation-menu": fileURLToPath(new URL("../../../../packages/navigation-menu/src/index.ts", import.meta.url)),
      "@ariaui-web/pagination": fileURLToPath(new URL("../../../../packages/pagination/src/index.ts", import.meta.url)),
      "@ariaui-web/popover": fileURLToPath(new URL("../../../../packages/popover/src/index.ts", import.meta.url)),
      "@ariaui-web/portal": fileURLToPath(new URL("../../../../packages/portal/src/index.ts", import.meta.url)),
      "@ariaui-web/position": fileURLToPath(new URL("../../../../packages/position/src/index.ts", import.meta.url)),
      "@ariaui-web/progress": fileURLToPath(new URL("../../../../packages/progress/src/index.ts", import.meta.url)),
      "@ariaui-web/radio": fileURLToPath(new URL("../../../../packages/radio/src/index.ts", import.meta.url)),
      "@ariaui-web/scroll-area": fileURLToPath(new URL("../../../../packages/scroll-area/src/index.ts", import.meta.url)),
      "@ariaui-web/select": fileURLToPath(new URL("../../../../packages/select/src/index.ts", import.meta.url)),
      "@ariaui-web/separator": fileURLToPath(new URL("../../../../packages/separator/src/index.ts", import.meta.url)),
      "@ariaui-web/sidebar": fileURLToPath(new URL("../../../../packages/sidebar/src/index.ts", import.meta.url)),
      "@ariaui-web/skeleton": fileURLToPath(new URL("../../../../packages/skeleton/src/index.ts", import.meta.url)),
      "@ariaui-web/slider": fileURLToPath(new URL("../../../../packages/slider/src/index.ts", import.meta.url)),
      "@ariaui-web/slot": fileURLToPath(new URL("../../../../packages/slot/src/index.ts", import.meta.url)),
      "@ariaui-web/spinbutton": fileURLToPath(new URL("../../../../packages/spinbutton/src/index.ts", import.meta.url)),
      "@ariaui-web/spinner": fileURLToPath(new URL("../../../../packages/spinner/src/index.ts", import.meta.url)),
      "@ariaui-web/splitter": fileURLToPath(new URL("../../../../packages/splitter/src/index.ts", import.meta.url)),
      "@ariaui-web/switch": fileURLToPath(new URL("../../../../packages/switch/src/index.ts", import.meta.url)),
      "@ariaui-web/table": fileURLToPath(new URL("../../../../packages/table/src/index.ts", import.meta.url)),
      "@ariaui-web/tabs": fileURLToPath(new URL("../../../../packages/tabs/src/index.ts", import.meta.url)),
      "@ariaui-web/textarea": fileURLToPath(new URL("../../../../packages/textarea/src/index.ts", import.meta.url)),
      "@ariaui-web/toast": fileURLToPath(new URL("../../../../packages/toast/src/index.ts", import.meta.url)),
      "@ariaui-web/toggle": fileURLToPath(new URL("../../../../packages/toggle/src/index.ts", import.meta.url)),
      "@ariaui-web/toggle-group": fileURLToPath(new URL("../../../../packages/toggle-group/src/index.ts", import.meta.url)),
      "@ariaui-web/tokens": fileURLToPath(new URL("../../../../packages/tokens/src/index.ts", import.meta.url)),
      "@ariaui-web/tooltip": fileURLToPath(new URL("../../../../packages/tooltip/src/index.ts", import.meta.url)),
      "@ariaui-web/treegrid": fileURLToPath(new URL("../../../../packages/treegrid/src/index.ts", import.meta.url)),
      "@ariaui-web/treeview": fileURLToPath(new URL("../../../../packages/treeview/src/index.ts", import.meta.url)),
      "@ariaui-web/tsconfig": fileURLToPath(new URL("../../../../packages/tsconfig/src/index.ts", import.meta.url)),
      "@ariaui-web/upload": fileURLToPath(new URL("../../../../packages/upload/src/index.ts", import.meta.url)),
      "@ariaui-web/utils": fileURLToPath(new URL("../../../../packages/utils/src/index.ts", import.meta.url))
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
