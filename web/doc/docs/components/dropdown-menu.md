# Dropdown Menu

A headless, accessible dropdown menu with submenus, checkbox and radio items, typeahead, and full keyboard navigation.

## Features

- **Menu button pattern**
- **Checkbox and radio items**
- **Submenu support**
- **Active descendant tracking**
- **Typeahead**
- **Headless styling**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/dropdown-menu
```

```bash [pnpm]
pnpm add @ariaui-web/dropdown-menu
```

```bash [yarn]
yarn add @ariaui-web/dropdown-menu
```

:::

### Register Elements

```ts
import { defineDropdownMenuElements } from "@ariaui-web/dropdown-menu";

defineDropdownMenuElements();
```

## Examples

The live examples below are native custom element entries for the `dropdown-menu` page, matching the source Aria UI examples.

### Full menu

<div class="ariaui-web-preview ariaui-web-dropdown-menu-preview" data-component="dropdown-menu" data-example-variant="full-menu">
  <aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Open Menu</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-scroll-area class="ariaui-web-dropdown-menu-scroll-area" data-example-part="ScrollArea">
        <aria-scroll-area-viewport class="ariaui-web-dropdown-menu-scroll-viewport" data-example-part="ScrollViewport">
      <div class="ariaui-web-dropdown-menu-account">
        <div class="ariaui-web-dropdown-menu-account-title">My Account</div>
        <div class="ariaui-web-dropdown-menu-account-meta">m@example.com</div>
      </div>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="profile">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"></path></svg>
        <span>Profile</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘P</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="billing">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5h16.5M4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg>
        <span>Billing</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘B</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="settings">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.656.85.11.052.218.108.324.167.325.183.72.19 1.046.01l1.123-.62a1.125 1.125 0 0 1 1.37.241l1.833 1.833c.389.389.49.986.24 1.37l-.62 1.123c-.18.326-.173.721.01 1.046.06.106.115.214.168.324.163.343.475.593.849.656l1.281.213c.542.09.94.56.94 1.11v2.593c0 .55-.398 1.02-.94 1.11l-1.281.213c-.374.063-.686.313-.85.656a7.64 7.64 0 0 1-.167.324c-.183.325-.19.72-.01 1.046l.62 1.123c.25.384.149.981-.24 1.37l-1.833 1.833a1.125 1.125 0 0 1-1.37.24l-1.123-.62c-.326-.18-.721-.173-1.046.01a7.64 7.64 0 0 1-.324.168c-.343.163-.593.475-.656.849l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.656-.85a7.64 7.64 0 0 1-.324-.167c-.325-.183-.72-.19-1.046-.01l-1.123.62a1.125 1.125 0 0 1-1.37-.24L2.9 19.37a1.125 1.125 0 0 1-.24-1.37l.62-1.123c.18-.326.173-.721-.01-1.046a7.64 7.64 0 0 1-.168-.324c-.163-.343-.475-.593-.849-.656l-1.281-.213A1.125 1.125 0 0 1 .03 13.53v-2.593c0-.55.398-1.02.94-1.11l1.281-.213c.374-.063.686-.313.85-.656.052-.11.108-.218.167-.324.183-.325.19-.72.01-1.046l-.62-1.123A1.125 1.125 0 0 1 2.9 5.095l1.833-1.833a1.125 1.125 0 0 1 1.37-.241l1.123.62c.326.18.721.173 1.046-.01.106-.06.214-.115.324-.168.343-.163.593-.475.656-.849l.213-1.281ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
        <span>Settings</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘S</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="team">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path></svg>
        <span>Team</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub" data-example-part="Sub">
      <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger" data-example-part="SubTrigger">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 10.5-6.86"></path></svg>
        <span>Invite users</span>
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      </aria-dropdown-menu-sub-trigger>
      <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content" data-example-part="SubContent" hidden>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="email">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>
        <span>Email</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="message">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.142-4.03 7.5-9 7.5a10.89 10.89 0 0 1-4.495-.952L3 19.5l1.052-3.156A6.97 6.97 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"></path></svg>
        <span>Message</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-sub-content>
    </aria-dropdown-menu-sub>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Appearance</aria-dropdown-menu-label>
        <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="status-bar" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Status Bar</span>
      </aria-dropdown-menu-checkbox-item>
        <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="panel" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Panel</span>
      </aria-dropdown-menu-checkbox-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Panel Position</aria-dropdown-menu-label>
        <aria-dropdown-menu-radio-group class="ariaui-web-dropdown-menu-group" data-example-part="RadioGroup">
          <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="top">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Top</span>
        </aria-dropdown-menu-radio-item>
          <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="bottom" checked="true">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Bottom</span>
        </aria-dropdown-menu-radio-item>
          <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="right">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Right</span>
        </aria-dropdown-menu-radio-item>
        </aria-dropdown-menu-radio-group>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="logout">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"></path></svg>
        <span>Log out</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘Q</span>
      </aria-dropdown-menu-item>
        </aria-scroll-area-viewport>
      </aria-scroll-area>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
</div>

```html
<aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Open Menu</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-scroll-area class="ariaui-web-dropdown-menu-scroll-area" data-example-part="ScrollArea">
        <aria-scroll-area-viewport class="ariaui-web-dropdown-menu-scroll-viewport" data-example-part="ScrollViewport">
      <div class="ariaui-web-dropdown-menu-account">
        <div class="ariaui-web-dropdown-menu-account-title">My Account</div>
        <div class="ariaui-web-dropdown-menu-account-meta">m@example.com</div>
      </div>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="profile">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"></path></svg>
        <span>Profile</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘P</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="billing">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5h16.5M4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg>
        <span>Billing</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘B</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="settings">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.656.85.11.052.218.108.324.167.325.183.72.19 1.046.01l1.123-.62a1.125 1.125 0 0 1 1.37.241l1.833 1.833c.389.389.49.986.24 1.37l-.62 1.123c-.18.326-.173.721.01 1.046.06.106.115.214.168.324.163.343.475.593.849.656l1.281.213c.542.09.94.56.94 1.11v2.593c0 .55-.398 1.02-.94 1.11l-1.281.213c-.374.063-.686.313-.85.656a7.64 7.64 0 0 1-.167.324c-.183.325-.19.72-.01 1.046l.62 1.123c.25.384.149.981-.24 1.37l-1.833 1.833a1.125 1.125 0 0 1-1.37.24l-1.123-.62c-.326-.18-.721-.173-1.046.01a7.64 7.64 0 0 1-.324.168c-.343.163-.593.475-.656.849l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.656-.85a7.64 7.64 0 0 1-.324-.167c-.325-.183-.72-.19-1.046-.01l-1.123.62a1.125 1.125 0 0 1-1.37-.24L2.9 19.37a1.125 1.125 0 0 1-.24-1.37l.62-1.123c.18-.326.173-.721-.01-1.046a7.64 7.64 0 0 1-.168-.324c-.163-.343-.475-.593-.849-.656l-1.281-.213A1.125 1.125 0 0 1 .03 13.53v-2.593c0-.55.398-1.02.94-1.11l1.281-.213c.374-.063.686-.313.85-.656.052-.11.108-.218.167-.324.183-.325.19-.72.01-1.046l-.62-1.123A1.125 1.125 0 0 1 2.9 5.095l1.833-1.833a1.125 1.125 0 0 1 1.37-.241l1.123.62c.326.18.721.173 1.046-.01.106-.06.214-.115.324-.168.343-.163.593-.475.656-.849l.213-1.281ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
        <span>Settings</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘S</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="team">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path></svg>
        <span>Team</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub" data-example-part="Sub">
      <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger" data-example-part="SubTrigger">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 10.5-6.86"></path></svg>
        <span>Invite users</span>
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      </aria-dropdown-menu-sub-trigger>
      <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content" data-example-part="SubContent" hidden>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="email">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>
        <span>Email</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="message">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.142-4.03 7.5-9 7.5a10.89 10.89 0 0 1-4.495-.952L3 19.5l1.052-3.156A6.97 6.97 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"></path></svg>
        <span>Message</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-sub-content>
    </aria-dropdown-menu-sub>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Appearance</aria-dropdown-menu-label>
        <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="status-bar" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Status Bar</span>
      </aria-dropdown-menu-checkbox-item>
        <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="panel" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Panel</span>
      </aria-dropdown-menu-checkbox-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Panel Position</aria-dropdown-menu-label>
        <aria-dropdown-menu-radio-group class="ariaui-web-dropdown-menu-group" data-example-part="RadioGroup">
          <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="top">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Top</span>
        </aria-dropdown-menu-radio-item>
          <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="bottom" checked="true">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Bottom</span>
        </aria-dropdown-menu-radio-item>
          <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="right">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Right</span>
        </aria-dropdown-menu-radio-item>
        </aria-dropdown-menu-radio-group>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="logout">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"></path></svg>
        <span>Log out</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘Q</span>
      </aria-dropdown-menu-item>
        </aria-scroll-area-viewport>
      </aria-scroll-area>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
```

### With submenu

<div class="ariaui-web-preview ariaui-web-dropdown-menu-preview" data-component="dropdown-menu" data-example-variant="submenu">
  <aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Open Menu</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="new-file">
        <span>New File</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="new-folder">
        <span>New Folder</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub" data-example-part="Sub">
      <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger" data-example-part="SubTrigger">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 10.5-6.86"></path></svg>
        <span>Invite users</span>
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      </aria-dropdown-menu-sub-trigger>
      <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content" data-example-part="SubContent" hidden>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="email">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>
        <span>Email</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="message">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.142-4.03 7.5-9 7.5a10.89 10.89 0 0 1-4.495-.952L3 19.5l1.052-3.156A6.97 6.97 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"></path></svg>
        <span>Message</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="more">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>
        <span>More...</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-sub-content>
    </aria-dropdown-menu-sub>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
</div>

```html
<aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Open Menu</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="new-file">
        <span>New File</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="new-folder">
        <span>New Folder</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub" data-example-part="Sub">
      <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger" data-example-part="SubTrigger">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 10.5-6.86"></path></svg>
        <span>Invite users</span>
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      </aria-dropdown-menu-sub-trigger>
      <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content" data-example-part="SubContent" hidden>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="email">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>
        <span>Email</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="message">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.142-4.03 7.5-9 7.5a10.89 10.89 0 0 1-4.495-.952L3 19.5l1.052-3.156A6.97 6.97 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"></path></svg>
        <span>Message</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="more">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>
        <span>More...</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-sub-content>
    </aria-dropdown-menu-sub>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
```

### With checkboxes

<div class="ariaui-web-preview ariaui-web-dropdown-menu-preview" data-component="dropdown-menu" data-example-variant="checkboxes">
  <aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root" selection-mode="multiple">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Checkboxes</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Appearance</aria-dropdown-menu-label>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="status-bar" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Status Bar</span>
      </aria-dropdown-menu-checkbox-item>
      <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="activity-bar">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Activity Bar</span>
      </aria-dropdown-menu-checkbox-item>
      <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="panel" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Panel</span>
      </aria-dropdown-menu-checkbox-item>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
</div>

```html
<aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root" selection-mode="multiple">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Checkboxes</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Appearance</aria-dropdown-menu-label>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="status-bar" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Status Bar</span>
      </aria-dropdown-menu-checkbox-item>
      <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="activity-bar">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Activity Bar</span>
      </aria-dropdown-menu-checkbox-item>
      <aria-dropdown-menu-checkbox-item class="ariaui-web-dropdown-menu-check-item" data-example-part="CheckboxItem" value="panel" checked="true">
        <span class="ariaui-web-dropdown-menu-indicator"><svg aria-hidden="true" class="ariaui-web-dropdown-menu-check" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>
        <span>Panel</span>
      </aria-dropdown-menu-checkbox-item>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
```

### With radio group

<div class="ariaui-web-preview ariaui-web-dropdown-menu-preview" data-component="dropdown-menu" data-example-variant="radio">
  <aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Radio Group</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Panel Position</aria-dropdown-menu-label>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-radio-group class="ariaui-web-dropdown-menu-group" data-example-part="RadioGroup">
        <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="top">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Top</span>
        </aria-dropdown-menu-radio-item>
        <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="bottom" checked="true">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Bottom</span>
        </aria-dropdown-menu-radio-item>
        <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="right">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Right</span>
        </aria-dropdown-menu-radio-item>
      </aria-dropdown-menu-radio-group>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
</div>

```html
<aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Radio Group</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content" data-example-part="Content" hidden>
      <aria-dropdown-menu-label class="ariaui-web-dropdown-menu-label" data-example-part="Label">Panel Position</aria-dropdown-menu-label>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-radio-group class="ariaui-web-dropdown-menu-group" data-example-part="RadioGroup">
        <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="top">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Top</span>
        </aria-dropdown-menu-radio-item>
        <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="bottom" checked="true">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Bottom</span>
        </aria-dropdown-menu-radio-item>
        <aria-dropdown-menu-radio-item class="ariaui-web-dropdown-menu-check-item" data-example-part="RadioItem" value="right">
          <span class="ariaui-web-dropdown-menu-indicator"><span class="ariaui-web-dropdown-menu-radio-dot"></span></span>
          <span>Right</span>
        </aria-dropdown-menu-radio-item>
      </aria-dropdown-menu-radio-group>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
```

### Framer Motion

<div class="ariaui-web-preview ariaui-web-dropdown-menu-preview" data-component="dropdown-menu" data-example-variant="framer-motion">
  <aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Motion Menu</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content ariaui-web-dropdown-menu-motion" data-example-part="Content" hidden>
      <div class="ariaui-web-dropdown-menu-account">
        <div class="ariaui-web-dropdown-menu-account-title">Workspace</div>
        <div class="ariaui-web-dropdown-menu-account-meta">design@example.com</div>
      </div>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="profile">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"></path></svg>
        <span>Profile</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘P</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="billing">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5h16.5M4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg>
        <span>Billing</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘B</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="settings">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.656.85.11.052.218.108.324.167.325.183.72.19 1.046.01l1.123-.62a1.125 1.125 0 0 1 1.37.241l1.833 1.833c.389.389.49.986.24 1.37l-.62 1.123c-.18.326-.173.721.01 1.046.06.106.115.214.168.324.163.343.475.593.849.656l1.281.213c.542.09.94.56.94 1.11v2.593c0 .55-.398 1.02-.94 1.11l-1.281.213c-.374.063-.686.313-.85.656a7.64 7.64 0 0 1-.167.324c-.183.325-.19.72-.01 1.046l.62 1.123c.25.384.149.981-.24 1.37l-1.833 1.833a1.125 1.125 0 0 1-1.37.24l-1.123-.62c-.326-.18-.721-.173-1.046.01a7.64 7.64 0 0 1-.324.168c-.343.163-.593.475-.656.849l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.656-.85a7.64 7.64 0 0 1-.324-.167c-.325-.183-.72-.19-1.046-.01l-1.123.62a1.125 1.125 0 0 1-1.37-.24L2.9 19.37a1.125 1.125 0 0 1-.24-1.37l.62-1.123c.18-.326.173-.721-.01-1.046a7.64 7.64 0 0 1-.168-.324c-.163-.343-.475-.593-.849-.656l-1.281-.213A1.125 1.125 0 0 1 .03 13.53v-2.593c0-.55.398-1.02.94-1.11l1.281-.213c.374-.063.686-.313.85-.656.052-.11.108-.218.167-.324.183-.325.19-.72.01-1.046l-.62-1.123A1.125 1.125 0 0 1 2.9 5.095l1.833-1.833a1.125 1.125 0 0 1 1.37-.241l1.123.62c.326.18.721.173 1.046-.01.106-.06.214-.115.324-.168.343-.163.593-.475.656-.849l.213-1.281ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
        <span>Settings</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘S</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub" data-example-part="Sub">
      <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger" data-example-part="SubTrigger">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 10.5-6.86"></path></svg>
        <span>Invite users</span>
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      </aria-dropdown-menu-sub-trigger>
      <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content" data-example-part="SubContent" hidden>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="email">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>
        <span>Email</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="message">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.142-4.03 7.5-9 7.5a10.89 10.89 0 0 1-4.495-.952L3 19.5l1.052-3.156A6.97 6.97 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"></path></svg>
        <span>Message</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-sub-content>
    </aria-dropdown-menu-sub>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="logout">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"></path></svg>
        <span>Log out</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘Q</span>
      </aria-dropdown-menu-item>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
</div>

```html
<aria-dropdown-menu class="ariaui-web-dropdown-menu-root" data-example-part="Root">
    <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger" data-example-part="Trigger">Motion Menu</aria-dropdown-menu-trigger>
    <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content ariaui-web-dropdown-menu-motion" data-example-part="Content" hidden>
      <div class="ariaui-web-dropdown-menu-account">
        <div class="ariaui-web-dropdown-menu-account-title">Workspace</div>
        <div class="ariaui-web-dropdown-menu-account-meta">design@example.com</div>
      </div>
      <aria-dropdown-menu-group class="ariaui-web-dropdown-menu-group" data-example-part="Group">
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="profile">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"></path></svg>
        <span>Profile</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘P</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="billing">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5h16.5M4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg>
        <span>Billing</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘B</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="settings">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.656.85.11.052.218.108.324.167.325.183.72.19 1.046.01l1.123-.62a1.125 1.125 0 0 1 1.37.241l1.833 1.833c.389.389.49.986.24 1.37l-.62 1.123c-.18.326-.173.721.01 1.046.06.106.115.214.168.324.163.343.475.593.849.656l1.281.213c.542.09.94.56.94 1.11v2.593c0 .55-.398 1.02-.94 1.11l-1.281.213c-.374.063-.686.313-.85.656a7.64 7.64 0 0 1-.167.324c-.183.325-.19.72-.01 1.046l.62 1.123c.25.384.149.981-.24 1.37l-1.833 1.833a1.125 1.125 0 0 1-1.37.24l-1.123-.62c-.326-.18-.721-.173-1.046.01a7.64 7.64 0 0 1-.324.168c-.343.163-.593.475-.656.849l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.656-.85a7.64 7.64 0 0 1-.324-.167c-.325-.183-.72-.19-1.046-.01l-1.123.62a1.125 1.125 0 0 1-1.37-.24L2.9 19.37a1.125 1.125 0 0 1-.24-1.37l.62-1.123c.18-.326.173-.721-.01-1.046a7.64 7.64 0 0 1-.168-.324c-.163-.343-.475-.593-.849-.656l-1.281-.213A1.125 1.125 0 0 1 .03 13.53v-2.593c0-.55.398-1.02.94-1.11l1.281-.213c.374-.063.686-.313.85-.656.052-.11.108-.218.167-.324.183-.325.19-.72.01-1.046l-.62-1.123A1.125 1.125 0 0 1 2.9 5.095l1.833-1.833a1.125 1.125 0 0 1 1.37-.241l1.123.62c.326.18.721.173 1.046-.01.106-.06.214-.115.324-.168.343-.163.593-.475.656-.849l.213-1.281ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
        <span>Settings</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⌘S</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-group>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub" data-example-part="Sub">
      <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger" data-example-part="SubTrigger">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 10.5-6.86"></path></svg>
        <span>Invite users</span>
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      </aria-dropdown-menu-sub-trigger>
      <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content" data-example-part="SubContent" hidden>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="email">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>
        <span>Email</span>
      </aria-dropdown-menu-item>
        <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="message">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.142-4.03 7.5-9 7.5a10.89 10.89 0 0 1-4.495-.952L3 19.5l1.052-3.156A6.97 6.97 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"></path></svg>
        <span>Message</span>
      </aria-dropdown-menu-item>
      </aria-dropdown-menu-sub-content>
    </aria-dropdown-menu-sub>
      <aria-dropdown-menu-separator class="ariaui-web-dropdown-menu-separator" data-example-part="Separator"></aria-dropdown-menu-separator>
      <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" data-example-part="Item" value="logout">
        <svg aria-hidden="true" class="ariaui-web-dropdown-menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"></path></svg>
        <span>Log out</span>
        <span class="ariaui-web-dropdown-menu-shortcut">⇧⌘Q</span>
      </aria-dropdown-menu-item>
    </aria-dropdown-menu-content>
  </aria-dropdown-menu>
```

## Anatomy

```html
<aria-dropdown-menu>
  <aria-dropdown-menu-trigger>Open Menu</aria-dropdown-menu-trigger>
  <aria-dropdown-menu-content>
    <aria-dropdown-menu-group>
      <aria-dropdown-menu-item></aria-dropdown-menu-item>
      <aria-dropdown-menu-checkbox-item></aria-dropdown-menu-checkbox-item>
      <aria-dropdown-menu-radio-group>
        <aria-dropdown-menu-radio-item></aria-dropdown-menu-radio-item>
      </aria-dropdown-menu-radio-group>
      <aria-dropdown-menu-sub>
        <aria-dropdown-menu-sub-trigger></aria-dropdown-menu-sub-trigger>
        <aria-dropdown-menu-sub-content></aria-dropdown-menu-sub-content>
      </aria-dropdown-menu-sub>
    </aria-dropdown-menu-group>
  </aria-dropdown-menu-content>
</aria-dropdown-menu>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-dropdown-menu` | none |
| Trigger | `aria-dropdown-menu-trigger` | `button` |
| Content | `aria-dropdown-menu-content` | `menu` |
| Item | `aria-dropdown-menu-item` | `menuitem` |
| CheckboxItem | `aria-dropdown-menu-checkbox-item` | `menuitemcheckbox` |
| RadioGroup | `aria-dropdown-menu-radio-group` | `group` |
| RadioItem | `aria-dropdown-menu-radio-item` | `menuitemradio` |
| Sub | `aria-dropdown-menu-sub` | none |
| SubTrigger | `aria-dropdown-menu-sub-trigger` | `menuitem` |
| SubContent | `aria-dropdown-menu-sub-content` | `menu` |
| Group | `aria-dropdown-menu-group` | `group` |
| Label | `aria-dropdown-menu-label` | none |
| Separator | `aria-dropdown-menu-separator` | `separator` |

## API Reference

The package-level native contract lives in `packages/dropdown-menu/readme.md`.

### Root

- Element: `aria-dropdown-menu`
- Owns the open state for the root menu.
- Supports `open`, `default-open`, and `selection-mode="multiple"`.

### Trigger

- Element: `aria-dropdown-menu-trigger`
- Defaults to `role="button"`, `aria-haspopup="menu"`, and `aria-expanded="false"`.
- Opens with click, `Enter`, `Space`, `ArrowDown`, and `ArrowUp`.

### Content

- Element: `aria-dropdown-menu-content`
- Defaults to `role="menu"`, `tabindex="-1"`, and `data-dropdown-menu-content`.
- Tracks the active item with `aria-activedescendant`.

### Item

- Element: `aria-dropdown-menu-item`
- Defaults to `role="menuitem"`.
- Use for regular action items.

### CheckboxItem

- Element: `aria-dropdown-menu-checkbox-item`
- Defaults to `role="menuitemcheckbox"` and synchronizes `aria-checked`.

### RadioGroup

- Element: `aria-dropdown-menu-radio-group`
- Defaults to `role="group"`.

### RadioItem

- Element: `aria-dropdown-menu-radio-item`
- Defaults to `role="menuitemradio"` and synchronizes `aria-checked`.

### Sub

- Element: `aria-dropdown-menu-sub`
- Owns submenu open state.

### SubTrigger

- Element: `aria-dropdown-menu-sub-trigger`
- Defaults to `role="menuitem"`, `aria-haspopup="menu"`, and `aria-expanded="false"`.

### SubContent

- Element: `aria-dropdown-menu-sub-content`
- Defaults to `role="menu"`, `tabindex="-1"`, and `data-dropdown-menu-content`.

### Group

- Element: `aria-dropdown-menu-group`
- Defaults to `role="group"`.

### Label

- Element: `aria-dropdown-menu-label`
- Non-interactive section text.

### Separator

- Element: `aria-dropdown-menu-separator`
- Defaults to `role="separator"`.

## Keyboard

| Key | Interaction |
| --- | --- |
| `Enter` / `Space` | Opens the focused trigger or activates the active item. |
| `ArrowDown` | Opens the trigger and targets the first item, or moves to the next enabled item. |
| `ArrowUp` | Opens the trigger and targets the last item, or moves to the previous enabled item. |
| `Home` | Moves to the first enabled menu item. |
| `End` | Moves to the last enabled menu item. |
| Printable character | Moves to the next enabled item whose text or value starts with that character. |
| `ArrowRight` | Opens a submenu in left-to-right layouts. |
| `ArrowLeft` | Closes a submenu in left-to-right layouts. |
| `Escape` | Closes the active menu layer and restores focus to its trigger. |

## Accessibility

The Dropdown Menu component implements the [WAI-ARIA Menu Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) using the `aria-activedescendant` model.

- `aria-dropdown-menu-trigger` exposes `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` when the menu is open.
- `aria-dropdown-menu-content` and `aria-dropdown-menu-sub-content` render as `role="menu"` containers with `aria-labelledby` and `aria-activedescendant`.
- `aria-dropdown-menu-item`, `aria-dropdown-menu-checkbox-item`, and `aria-dropdown-menu-radio-item` expose menu item roles.
- `aria-dropdown-menu-sub-trigger` announces submenu availability with `aria-haspopup="menu"`.

::: tip Focus model
DOM focus stays on the menu container during keyboard navigation. The active item is communicated through `aria-activedescendant`.
:::
