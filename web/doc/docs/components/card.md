# Card

A composable content container with Header, Title, Description, Content, and Footer parts.

## Features

- **Six composable parts**
- **Headless styling**
- **Semantic title default**
- **Attribute and event passthrough**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/card
```

```bash [pnpm]
pnpm add @ariaui-web/card
```

```bash [yarn]
yarn add @ariaui-web/card
```

:::

### Register Elements

```ts
import { defineCardElements } from "@ariaui-web/card";

defineCardElements();
```

## Examples

The live examples below are native custom element entries for the `card` page, matching the source Aria UI examples.

### Account form

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="card" data-example-variant="account-form">
  <aria-card class="w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root backdrop-blur-xl" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Create an account</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">Enter your email below to create your account.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="grid gap-4 p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="grid gap-2 ariaui-web-card-field">
        <label for="card-email" class="text-sm font-medium leading-none text-foreground">Email</label>
        <input id="card-email" type="email" placeholder="m@example.com" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
      <div class="grid gap-2 ariaui-web-card-field">
        <label for="card-password" class="text-sm font-medium leading-none text-foreground">Password</label>
        <input id="card-password" type="password" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
    </aria-card-content>
    <aria-card-footer class="flex justify-between p-6 pt-0 ariaui-web-card-footer" data-example-part="Footer">
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button border border-border bg-background text-foreground hover:bg-muted ariaui-web-card-button-outline">Cancel</button>
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button bg-primary text-primary-foreground hover:bg-primary-hover ariaui-web-card-button-primary">Create account</button>
    </aria-card-footer>
  </aria-card>
</div>

```html
<aria-card class="w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root backdrop-blur-xl" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Create an account</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">Enter your email below to create your account.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="grid gap-4 p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="grid gap-2 ariaui-web-card-field">
        <label for="card-email" class="text-sm font-medium leading-none text-foreground">Email</label>
        <input id="card-email" type="email" placeholder="m@example.com" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
      <div class="grid gap-2 ariaui-web-card-field">
        <label for="card-password" class="text-sm font-medium leading-none text-foreground">Password</label>
        <input id="card-password" type="password" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
    </aria-card-content>
    <aria-card-footer class="flex justify-between p-6 pt-0 ariaui-web-card-footer" data-example-part="Footer">
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button border border-border bg-background text-foreground hover:bg-muted ariaui-web-card-button-outline">Cancel</button>
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button bg-primary text-primary-foreground hover:bg-primary-hover ariaui-web-card-button-primary">Create account</button>
    </aria-card-footer>
  </aria-card>
```

### Basic layout

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="card" data-example-variant="basic-layout">
  <aria-card class="w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Title Text</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">This is a card description.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/60 p-6 text-center text-sm text-muted-foreground ariaui-web-card-dashed-slot">Slot (swap it with your content)</div>
    </aria-card-content>
    <aria-card-footer class="p-6 pt-0 ariaui-web-card-footer" data-example-part="Footer">
      <div class="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/60 p-6 text-center text-sm text-muted-foreground ariaui-web-card-dashed-slot">Slot (swap it with your content)</div>
    </aria-card-footer>
  </aria-card>
</div>

```html
<aria-card class="w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Title Text</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">This is a card description.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/60 p-6 text-center text-sm text-muted-foreground ariaui-web-card-dashed-slot">Slot (swap it with your content)</div>
    </aria-card-content>
    <aria-card-footer class="p-6 pt-0 ariaui-web-card-footer" data-example-part="Footer">
      <div class="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/60 p-6 text-center text-sm text-muted-foreground ariaui-web-card-dashed-slot">Slot (swap it with your content)</div>
    </aria-card-footer>
  </aria-card>
```

### Login

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="card" data-example-variant="login">
  <aria-card class="w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="heading-xs leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Login to your account</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">Enter your email below to login to your account</aria-card-description>
    </aria-card-header>
    <aria-card-content class="grid gap-4 p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="grid gap-2 ariaui-web-card-field">
        <label class="text-sm font-medium leading-5 text-foreground" for="card-login-email">Email</label>
        <input id="card-login-email" placeholder="m@example.com" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
      <div class="relative grid gap-2 ariaui-web-card-field">
        <div class="flex items-center justify-between gap-2 ariaui-web-card-label-row">
          <label class="text-sm font-medium leading-5 text-foreground" for="card-login-password">Password</label>
          <a href="#" class="whitespace-nowrap text-sm font-normal text-foreground underline decoration-solid underline-offset-4 ariaui-web-card-link">Forgot your password?</a>
        </div>
        <input id="card-login-password" type="password" placeholder="••••••••" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
    </aria-card-content>
    <aria-card-footer class="flex flex-col gap-2 p-6 pt-0 ariaui-web-card-footer" data-example-part="Footer">
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button w-full bg-brand text-brand-foreground hover:bg-brand-hover ariaui-web-card-button-primary">Login</button>
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button w-full border border-border bg-background text-foreground hover:bg-muted ariaui-web-card-button-outline">Login with Google</button>
      <div class="mt-4 text-center text-sm ariaui-web-card-signup">
        <span class="text-muted-foreground">Don't have an account? </span>
        <a href="#" class="font-normal text-foreground underline decoration-solid underline-offset-4 ariaui-web-card-link">Sign up</a>
      </div>
    </aria-card-footer>
  </aria-card>
</div>

```html
<aria-card class="w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="heading-xs leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Login to your account</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">Enter your email below to login to your account</aria-card-description>
    </aria-card-header>
    <aria-card-content class="grid gap-4 p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="grid gap-2 ariaui-web-card-field">
        <label class="text-sm font-medium leading-5 text-foreground" for="card-login-email">Email</label>
        <input id="card-login-email" placeholder="m@example.com" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
      <div class="relative grid gap-2 ariaui-web-card-field">
        <div class="flex items-center justify-between gap-2 ariaui-web-card-label-row">
          <label class="text-sm font-medium leading-5 text-foreground" for="card-login-password">Password</label>
          <a href="#" class="whitespace-nowrap text-sm font-normal text-foreground underline decoration-solid underline-offset-4 ariaui-web-card-link">Forgot your password?</a>
        </div>
        <input id="card-login-password" type="password" placeholder="••••••••" class="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground ariaui-web-card-input" />
      </div>
    </aria-card-content>
    <aria-card-footer class="flex flex-col gap-2 p-6 pt-0 ariaui-web-card-footer" data-example-part="Footer">
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button w-full bg-brand text-brand-foreground hover:bg-brand-hover ariaui-web-card-button-primary">Login</button>
      <button type="button" class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ariaui-web-card-button w-full border border-border bg-background text-foreground hover:bg-muted ariaui-web-card-button-outline">Login with Google</button>
      <div class="mt-4 text-center text-sm ariaui-web-card-signup">
        <span class="text-muted-foreground">Don't have an account? </span>
        <a href="#" class="font-normal text-foreground underline decoration-solid underline-offset-4 ariaui-web-card-link">Sign up</a>
      </div>
    </aria-card-footer>
  </aria-card>
```

### Meeting notes

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="card" data-example-variant="meeting-notes">
  <aria-card class="w-[420px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 pb-4 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Meeting Notes</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">Transcript from the meeting with the client.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="whitespace-pre-wrap text-sm leading-5 text-foreground ariaui-web-card-notes">Client requested dashboard redesign with focus on mobile responsiveness.<br><br>1. New analytics widgets for daily/weekly metrics<br>2. Simplified navigation menu<br>3. Dark mode support<br>4. Timeline: 6 weeks<br>5. Follow-up meeting scheduled for next Tuesday</div>
    </aria-card-content>
    <aria-card-footer class="px-6 pb-6 pt-2 ariaui-web-card-footer" data-example-part="Footer">
      <div class="-space-x-2 flex items-center pr-2 ariaui-web-card-avatar-row">
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring"><span>A1</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring"><span>A2</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring"><span>A3</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring" aria-label="MW"><span>MW</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring" aria-label="SD"><span>SD</span></span>
      </div>
    </aria-card-footer>
  </aria-card>
</div>

```html
<aria-card class="w-[420px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 pb-4 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Meeting Notes</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">Transcript from the meeting with the client.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="p-6 pt-0 ariaui-web-card-content" data-example-part="Content">
      <div class="whitespace-pre-wrap text-sm leading-5 text-foreground ariaui-web-card-notes">Client requested dashboard redesign with focus on mobile responsiveness.<br><br>1. New analytics widgets for daily/weekly metrics<br>2. Simplified navigation menu<br>3. Dark mode support<br>4. Timeline: 6 weeks<br>5. Follow-up meeting scheduled for next Tuesday</div>
    </aria-card-content>
    <aria-card-footer class="px-6 pb-6 pt-2 ariaui-web-card-footer" data-example-part="Footer">
      <div class="-space-x-2 flex items-center pr-2 ariaui-web-card-avatar-row">
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring"><span>A1</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring"><span>A2</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring"><span>A3</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring" aria-label="MW"><span>MW</span></span>
        <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted ariaui-web-card-avatar-ring" aria-label="SD"><span>SD</span></span>
      </div>
    </aria-card-footer>
  </aria-card>
```

### With image area

<div class="ariaui-web-preview flex w-full items-center justify-center px-6 py-10" data-component="card" data-example-variant="with-image-area">
  <aria-card class="w-[420px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 pb-4 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Is this an image?</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">This is a card with an image.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="p-0 ariaui-web-card-content" data-example-part="Content">
      <div class="relative flex aspect-[240/135] w-full items-center justify-center bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 ariaui-web-card-image-area">
        <div class="text-muted-foreground/40 ariaui-web-card-image-icon"><svg aria-hidden="true" class="h-12 w-12 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg></div>
      </div>
    </aria-card-content>
    <aria-card-footer class="flex items-center justify-between gap-4 p-6 ariaui-web-card-footer" data-example-part="Footer">
      <div class="flex flex-wrap items-center gap-2 ariaui-web-card-stat-row">
        <div class="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 ariaui-web-card-stat"><svg aria-hidden="true" class="h-3 w-3 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5M5.25 12V8.25A2.25 2.25 0 0 1 7.5 6h9a2.25 2.25 0 0 1 2.25 2.25V12M5.25 12v5.25m13.5-5.25v5.25"></path></svg><span class="text-xs font-semibold text-foreground">4</span></div>
        <div class="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 ariaui-web-card-stat"><svg aria-hidden="true" class="h-3 w-3 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 11.25h15m-13.5 0V7.5A2.25 2.25 0 0 1 8.25 5.25h.75m10.5 6v1.5a5.25 5.25 0 0 1-5.25 5.25h-4.5A5.25 5.25 0 0 1 4.5 12.75v-1.5"></path></svg><span class="text-xs font-semibold text-foreground">2</span></div>
        <div class="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 ariaui-web-card-stat"><svg aria-hidden="true" class="h-3 w-3 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg><span class="text-xs font-semibold text-foreground">350m<sup class="text-[7px] font-bold">2</sup></span></div>
      </div>
      <p class="whitespace-nowrap text-base font-medium leading-6 text-foreground ariaui-web-card-price">$135,000</p>
    </aria-card-footer>
  </aria-card>
</div>

```html
<aria-card class="w-[420px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ariaui-web-card-root" data-example-part="Root">
    <aria-card-header class="flex flex-col gap-1.5 p-6 pb-4 ariaui-web-card-header" data-example-part="Header">
      <aria-card-title class="text-base font-semibold leading-none text-foreground ariaui-web-card-title" data-example-part="Title">Is this an image?</aria-card-title>
      <aria-card-description class="text-sm text-muted-foreground ariaui-web-card-description" data-example-part="Description">This is a card with an image.</aria-card-description>
    </aria-card-header>
    <aria-card-content class="p-0 ariaui-web-card-content" data-example-part="Content">
      <div class="relative flex aspect-[240/135] w-full items-center justify-center bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 ariaui-web-card-image-area">
        <div class="text-muted-foreground/40 ariaui-web-card-image-icon"><svg aria-hidden="true" class="h-12 w-12 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg></div>
      </div>
    </aria-card-content>
    <aria-card-footer class="flex items-center justify-between gap-4 p-6 ariaui-web-card-footer" data-example-part="Footer">
      <div class="flex flex-wrap items-center gap-2 ariaui-web-card-stat-row">
        <div class="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 ariaui-web-card-stat"><svg aria-hidden="true" class="h-3 w-3 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5M5.25 12V8.25A2.25 2.25 0 0 1 7.5 6h9a2.25 2.25 0 0 1 2.25 2.25V12M5.25 12v5.25m13.5-5.25v5.25"></path></svg><span class="text-xs font-semibold text-foreground">4</span></div>
        <div class="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 ariaui-web-card-stat"><svg aria-hidden="true" class="h-3 w-3 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 11.25h15m-13.5 0V7.5A2.25 2.25 0 0 1 8.25 5.25h.75m10.5 6v1.5a5.25 5.25 0 0 1-5.25 5.25h-4.5A5.25 5.25 0 0 1 4.5 12.75v-1.5"></path></svg><span class="text-xs font-semibold text-foreground">2</span></div>
        <div class="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 ariaui-web-card-stat"><svg aria-hidden="true" class="h-3 w-3 text-icon ariaui-web-card-stat-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg><span class="text-xs font-semibold text-foreground">350m<sup class="text-[7px] font-bold">2</sup></span></div>
      </div>
      <p class="whitespace-nowrap text-base font-medium leading-6 text-foreground ariaui-web-card-price">$135,000</p>
    </aria-card-footer>
  </aria-card>
```

## Anatomy

```html
<aria-card>
  <aria-card-header>
    <aria-card-title>Card Title</aria-card-title>
    <aria-card-description>Card Description</aria-card-description>
  </aria-card-header>
  <aria-card-content>Card Content</aria-card-content>
  <aria-card-footer>Card Footer</aria-card-footer>
</aria-card>
```

| Part | Custom element | Default role |
| --- | --- | --- |
| Root | `aria-card` | none |
| Content | `aria-card-content` | none |
| Description | `aria-card-description` | none |
| Footer | `aria-card-footer` | none |
| Header | `aria-card-header` | none |
| Title | `aria-card-title` | `heading` |

## API Reference

The package-level native contract lives in `packages/card/readme.md`.

### Root

- Element: `aria-card`
- Purpose: outermost neutral structural container.
- Default role: none.
- Preserves consumer attributes, classes, inline styles, data attributes, children, and DOM events.

### Header

- Element: `aria-card-header`
- Purpose: groups Title and Description at the top of the card.
- Default role: none.

### Title

- Element: `aria-card-title`
- Purpose: card heading.
- Defaults to `role="heading"` and `aria-level="3"` as the native custom element adaptation of source `h3`.

### Description

- Element: `aria-card-description`
- Purpose: supporting text below the Title.
- Default role: none.

### Content

- Element: `aria-card-content`
- Purpose: main body for arbitrary content such as forms, images, or lists.
- Default role: none.

### Footer

- Element: `aria-card-footer`
- Purpose: actions or metadata at the bottom of the card.
- Default role: none.

## Accessibility

Card is a structural primitive with no built-in interactive behavior. Accessibility depends on the content you place inside:

- Use `aria-card-title` for a meaningful heading, or override `aria-level` to match the document outline.
- Keep form labels, buttons, and links inside the card accessible with standard HTML labeling and focus behavior.
- If the entire card is clickable, wrap the relevant content in an anchor or button and provide a clear accessible name.

::: info Not a landmark
Cards do not map to an ARIA landmark role. If you need a self-contained section with its own heading, wrap the card in a `section` element with `aria-labelledby` pointing at the title.
:::
