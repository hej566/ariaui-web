# Table

A structural, stateless table primitive with composable rows, cells, headers, captions, and horizontal overflow support.

## Features

- **Table semantics**
- **Composable parts**
- **Row and column headers**
- **Stateless**
- **Native attributes and events**
- **Horizontal overflow support**

## Installation

::: code-group

```bash [npm]
npm install @ariaui-web/table
```

```bash [pnpm]
pnpm add @ariaui-web/table
```

```bash [yarn]
yarn add @ariaui-web/table
```

:::

```ts
import { defineTableElements } from "@ariaui-web/table";

defineTableElements();
```

## Examples

The examples use the same records, controls, responsive columns, status treatments, and Tailwind CSS composition as the Aria UI Table page.

### Invoice table

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="table" data-example-variant="invoice">
  <div class="ariaui-web-table-example w-full">
    <div class="ariaui-web-table-shell overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <aria-table class="ariaui-web-table ariaui-web-invoice-table w-full text-sm" aria-label="Recent invoices">
        <aria-table-header>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid border-b border-border bg-muted/50">
            <aria-table-column-header class="ariaui-web-table-header h-10 px-4 text-left align-middle font-medium text-foreground">Invoice</aria-table-column-header>
            <aria-table-column-header class="ariaui-web-table-header h-10 px-4 text-left align-middle font-medium text-foreground">Status</aria-table-column-header>
            <aria-table-column-header data-responsive-column class="ariaui-web-table-header h-10 px-4 text-left align-middle font-medium text-foreground hidden sm:table-cell">Method</aria-table-column-header>
            <aria-table-column-header data-responsive-column class="ariaui-web-table-header h-10 px-4 text-left align-middle font-medium text-foreground hidden sm:table-cell">Date</aria-table-column-header>
            <aria-table-column-header class="ariaui-web-table-header ariaui-web-table-right h-10 px-4 text-left align-middle font-medium text-foreground text-right">Amount</aria-table-column-header>
          </aria-table-row>
        </aria-table-header>
        <aria-table-body>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid group border-b border-border last:border-b-0 hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground font-medium">INV001</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground"><span class="ariaui-web-table-status ariaui-web-table-status-paid inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-success/10 text-success ring-success/20">Paid</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell"><span class="ariaui-web-method"><i class="ariaui-web-method-dot ariaui-web-method-card h-1.5 w-1.5 shrink-0 rounded-full bg-icon-brand"></i>Credit Card</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell">2023-11-23</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 align-middle text-foreground text-right font-medium">$250.00</aria-table-cell>
          </aria-table-row>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid group border-b border-border last:border-b-0 hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground font-medium">INV002</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground"><span class="ariaui-web-table-status ariaui-web-table-status-pending inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-warning/10 text-warning ring-warning/20">Pending</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell"><span class="ariaui-web-method"><i class="ariaui-web-method-dot ariaui-web-method-paypal h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2"></i>PayPal</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell">2023-11-24</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 align-middle text-foreground text-right font-medium">$150.00</aria-table-cell>
          </aria-table-row>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid group border-b border-border last:border-b-0 hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground font-medium">INV003</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground"><span class="ariaui-web-table-status ariaui-web-table-status-unpaid inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-destructive/10 text-destructive ring-destructive/20">Unpaid</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell"><span class="ariaui-web-method"><i class="ariaui-web-method-dot ariaui-web-method-bank h-1.5 w-1.5 shrink-0 rounded-full bg-icon-success"></i>Bank Transfer</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell">2023-11-25</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 align-middle text-foreground text-right font-medium">$350.00</aria-table-cell>
          </aria-table-row>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid group border-b border-border last:border-b-0 hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground font-medium">INV004</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground"><span class="ariaui-web-table-status ariaui-web-table-status-paid inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-success/10 text-success ring-success/20">Paid</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell"><span class="ariaui-web-method"><i class="ariaui-web-method-dot ariaui-web-method-card h-1.5 w-1.5 shrink-0 rounded-full bg-icon-brand"></i>Credit Card</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell">2023-11-26</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 align-middle text-foreground text-right font-medium">$450.00</aria-table-cell>
          </aria-table-row>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid group border-b border-border last:border-b-0 hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground font-medium">INV005</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground"><span class="ariaui-web-table-status ariaui-web-table-status-paid inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-success/10 text-success ring-success/20">Paid</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell"><span class="ariaui-web-method"><i class="ariaui-web-method-dot ariaui-web-method-paypal h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2"></i>PayPal</span></aria-table-cell>
            <aria-table-cell data-responsive-column class="ariaui-web-table-cell h-[52px] px-4 align-middle text-foreground hidden sm:table-cell">2023-11-27</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 align-middle text-foreground text-right font-medium">$550.00</aria-table-cell>
          </aria-table-row>
        </aria-table-body>
        <aria-table-footer>
          <aria-table-row class="ariaui-web-table-row ariaui-web-invoice-grid bg-muted/50 font-medium hover:bg-muted/50">
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-total h-[52px] px-4 align-middle text-foreground">Total</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 align-middle text-foreground text-right">$1,300.00</aria-table-cell>
          </aria-table-row>
        </aria-table-footer>
        <aria-table-caption class="ariaui-web-table-caption caption-bottom pt-4 text-center text-sm text-muted-foreground">A list of your recent invoices.</aria-table-caption>
      </aria-table>
    </div>
  </div>
</div>

```html
<div class="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
  <aria-table class="w-full text-sm" aria-label="Recent invoices">
    <aria-table-header>
      <aria-table-row class="border-b border-border bg-muted/50">
        <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Invoice</aria-table-column-header>
        <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Status</aria-table-column-header>
        <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Method</aria-table-column-header>
        <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Date</aria-table-column-header>
        <aria-table-column-header class="h-10 px-4 text-right align-middle font-medium text-foreground">Amount</aria-table-column-header>
      </aria-table-row>
    </aria-table-header>
    <aria-table-body>
      <aria-table-row class="group border-b border-border last:border-b-0 hover:bg-muted/40">
        <aria-table-cell class="h-[52px] px-4 align-middle text-foreground font-medium">INV001</aria-table-cell>
        <aria-table-cell class="h-[52px] px-4 align-middle text-foreground">Paid</aria-table-cell>
        <aria-table-cell class="h-[52px] px-4 align-middle text-foreground">Credit Card</aria-table-cell>
        <aria-table-cell class="h-[52px] px-4 align-middle text-foreground">2023-11-23</aria-table-cell>
        <aria-table-cell class="h-[52px] px-4 text-right align-middle text-foreground">$250.00</aria-table-cell>
      </aria-table-row>
    </aria-table-body>
    <aria-table-caption class="caption-bottom pt-4 text-center text-sm text-muted-foreground">A list of your recent invoices.</aria-table-caption>
  </aria-table>
</div>
```

### Data table

<div class="ariaui-web-preview flex items-center justify-center px-6 py-10" data-component="table" data-example-variant="data-table">
  <div class="ariaui-web-table-example ariaui-web-data-example w-full space-y-4">
    <div class="ariaui-web-table-toolbar flex flex-wrap items-center justify-between gap-4">
      <input data-table-filter class="ariaui-web-table-filter h-9 w-full max-w-[250px] rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground" placeholder="Filter emails..." aria-label="Filter emails" />
      <div class="ariaui-web-table-menu-root">
        <button type="button" data-table-menu-trigger class="ariaui-web-table-toolbar-button inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Columns <span aria-hidden="true">v</span></button>
        <div data-table-menu class="ariaui-web-table-menu z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md" hidden>
          <button type="button" data-table-column-toggle="status" data-active aria-pressed="true" class="ariaui-web-table-menu-item relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent-hover data-[active=true]:bg-accent-hover"><span class="ariaui-web-column-check"></span>Status</button>
          <button type="button" data-table-column-toggle="email" data-active aria-pressed="true" class="ariaui-web-table-menu-item relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent-hover data-[active=true]:bg-accent-hover"><span class="ariaui-web-column-check"></span>Email</button>
          <button type="button" data-table-column-toggle="amount" data-active aria-pressed="true" class="ariaui-web-table-menu-item relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent-hover data-[active=true]:bg-accent-hover"><span class="ariaui-web-column-check"></span>Amount</button>
        </div>
      </div>
    </div>
    <div class="ariaui-web-table-shell overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-sm">
      <aria-table class="ariaui-web-table ariaui-web-data-table w-full" aria-label="Payments">
        <aria-table-header>
          <aria-table-row class="ariaui-web-table-row ariaui-web-data-grid border-b border-border bg-transparent hover:bg-transparent">
            <aria-table-column-header class="ariaui-web-table-header ariaui-web-checkbox-cell h-10 px-4 text-left align-middle font-medium text-foreground"><button type="button" role="checkbox" data-table-select-all aria-checked="false" aria-pressed="false" aria-label="Select all rows" class="ariaui-web-table-checkbox"></button></aria-table-column-header>
            <aria-table-column-header data-column="status" class="ariaui-web-table-header h-10 px-4 text-left align-middle font-medium text-foreground">Status</aria-table-column-header>
            <aria-table-column-header data-column="email" class="ariaui-web-table-header h-10 px-4 text-left align-middle font-medium text-foreground">Email</aria-table-column-header>
            <aria-table-column-header data-column="amount" class="ariaui-web-table-header ariaui-web-table-right h-10 px-4 text-left align-middle font-medium text-foreground">Amount</aria-table-column-header>
            <aria-table-column-header class="ariaui-web-table-header ariaui-web-action-cell h-10 px-4 text-left align-middle font-medium text-foreground"></aria-table-column-header>
          </aria-table-row>
        </aria-table-header>
        <aria-table-body>
          <aria-table-row data-table-data-row data-email="michael.mitc@example.com" aria-selected="false" class="ariaui-web-table-row ariaui-web-data-grid border-b border-border hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-checkbox-cell h-[52px] px-4 align-middle text-sm text-foreground"><button type="button" role="checkbox" data-table-select-row aria-checked="false" aria-pressed="false" aria-label="Select row 1" class="ariaui-web-table-checkbox"></button></aria-table-cell>
            <aria-table-cell data-column="status" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground"><span class="ariaui-web-table-status ariaui-web-data-success inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset bg-success/10 text-success ring-success/20"><i></i>Success</span></aria-table-cell>
            <aria-table-cell data-column="email" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground">michael.mitc@example.com</aria-table-cell>
            <aria-table-cell data-column="amount" class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 text-right align-middle text-sm text-foreground">$630.44</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-action-cell h-[52px] px-4 text-right align-middle"><span class="ariaui-web-table-menu-root"><button type="button" data-table-menu-trigger class="ariaui-web-table-action" aria-label="Row actions">...</button><span data-table-menu class="ariaui-web-table-menu ariaui-web-row-menu" hidden><button>Copy payment ID</button><button>View customer</button><button>View payment details</button></span></span></aria-table-cell>
          </aria-table-row>
          <aria-table-row data-table-data-row data-email="felicia.reid@example.com" aria-selected="false" class="ariaui-web-table-row ariaui-web-data-grid border-b border-border hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-checkbox-cell h-[52px] px-4 align-middle text-sm text-foreground"><button type="button" role="checkbox" data-table-select-row aria-checked="false" aria-pressed="false" aria-label="Select row 2" class="ariaui-web-table-checkbox"></button></aria-table-cell>
            <aria-table-cell data-column="status" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground"><span class="ariaui-web-table-status ariaui-web-data-success inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset bg-success/10 text-success ring-success/20"><i></i>Success</span></aria-table-cell>
            <aria-table-cell data-column="email" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground">felicia.reid@example.com</aria-table-cell>
            <aria-table-cell data-column="amount" class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 text-right align-middle text-sm text-foreground">$767.50</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-action-cell h-[52px] px-4 text-right align-middle"><button type="button" data-table-menu-trigger class="ariaui-web-table-action" aria-label="Row actions">...</button></aria-table-cell>
          </aria-table-row>
          <aria-table-row data-table-data-row data-email="georgia.young@example.com" aria-selected="false" class="ariaui-web-table-row ariaui-web-data-grid border-b border-border hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-checkbox-cell h-[52px] px-4 align-middle text-sm text-foreground"><button type="button" role="checkbox" data-table-select-row aria-checked="false" aria-pressed="false" aria-label="Select row 3" class="ariaui-web-table-checkbox"></button></aria-table-cell>
            <aria-table-cell data-column="status" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground"><span class="ariaui-web-table-status ariaui-web-data-processing inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset bg-warning/10 text-warning ring-warning/20"><i></i>Processing</span></aria-table-cell>
            <aria-table-cell data-column="email" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground">georgia.young@example.com</aria-table-cell>
            <aria-table-cell data-column="amount" class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 text-right align-middle text-sm text-foreground">$396.84</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-action-cell h-[52px] px-4 text-right align-middle"><button type="button" data-table-menu-trigger class="ariaui-web-table-action" aria-label="Row actions">...</button></aria-table-cell>
          </aria-table-row>
          <aria-table-row data-table-data-row data-email="alma.lawson@example.com" aria-selected="false" class="ariaui-web-table-row ariaui-web-data-grid border-b border-border hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-checkbox-cell h-[52px] px-4 align-middle text-sm text-foreground"><button type="button" role="checkbox" data-table-select-row aria-checked="false" aria-pressed="false" aria-label="Select row 4" class="ariaui-web-table-checkbox"></button></aria-table-cell>
            <aria-table-cell data-column="status" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground"><span class="ariaui-web-table-status ariaui-web-data-success inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset bg-success/10 text-success ring-success/20"><i></i>Success</span></aria-table-cell>
            <aria-table-cell data-column="email" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground">alma.lawson@example.com</aria-table-cell>
            <aria-table-cell data-column="amount" class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 text-right align-middle text-sm text-foreground">$475.22</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-action-cell h-[52px] px-4 text-right align-middle"><button type="button" data-table-menu-trigger class="ariaui-web-table-action" aria-label="Row actions">...</button></aria-table-cell>
          </aria-table-row>
          <aria-table-row data-table-data-row data-email="dolores.chambers@example.com" aria-selected="false" class="ariaui-web-table-row ariaui-web-data-grid border-b border-border hover:bg-muted/40">
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-checkbox-cell h-[52px] px-4 align-middle text-sm text-foreground"><button type="button" role="checkbox" data-table-select-row aria-checked="false" aria-pressed="false" aria-label="Select row 5" class="ariaui-web-table-checkbox"></button></aria-table-cell>
            <aria-table-cell data-column="status" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground"><span class="ariaui-web-table-status ariaui-web-data-failed inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset bg-destructive/10 text-destructive ring-destructive/20"><i></i>Failed</span></aria-table-cell>
            <aria-table-cell data-column="email" class="ariaui-web-table-cell h-[52px] px-4 align-middle text-sm text-foreground">dolores.chambers@example.com</aria-table-cell>
            <aria-table-cell data-column="amount" class="ariaui-web-table-cell ariaui-web-table-right h-[52px] px-4 text-right align-middle text-sm text-foreground">$275.43</aria-table-cell>
            <aria-table-cell class="ariaui-web-table-cell ariaui-web-action-cell h-[52px] px-4 text-right align-middle"><button type="button" data-table-menu-trigger class="ariaui-web-table-action" aria-label="Row actions">...</button></aria-table-cell>
          </aria-table-row>
        </aria-table-body>
      </aria-table>
    </div>
    <div class="ariaui-web-table-footer flex flex-wrap items-center justify-between gap-2">
      <span data-table-selection-summary class="text-sm text-muted-foreground">0 of 5 row(s) selected.</span>
      <span class="ariaui-web-table-pagination"><button type="button" disabled class="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-50">Previous</button><button type="button" disabled class="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-50">Next</button></span>
    </div>
  </div>
</div>

```html
<div class="w-full space-y-4">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <input data-table-filter placeholder="Filter emails..." class="h-9 w-full max-w-[250px] rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground" />
    <button type="button" class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent-hover">Columns</button>
  </div>
  <div class="overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-sm">
    <aria-table class="w-full" aria-label="Payments">
      <aria-table-header>
        <aria-table-row class="border-b border-border bg-transparent hover:bg-transparent">
          <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Select</aria-table-column-header>
          <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Status</aria-table-column-header>
          <aria-table-column-header class="h-10 px-4 text-left align-middle font-medium text-foreground">Email</aria-table-column-header>
          <aria-table-column-header class="h-10 px-4 text-right align-middle font-medium text-foreground">Amount</aria-table-column-header>
        </aria-table-row>
      </aria-table-header>
      <aria-table-body>
        <aria-table-row class="border-b border-border hover:bg-muted/40">
          <aria-table-cell class="h-[52px] px-4 align-middle text-sm text-foreground">Select row</aria-table-cell>
          <aria-table-cell class="h-[52px] px-4 align-middle text-sm text-foreground">Success</aria-table-cell>
          <aria-table-cell class="h-[52px] px-4 align-middle text-sm text-foreground">michael.mitc@example.com</aria-table-cell>
          <aria-table-cell class="h-[52px] px-4 text-right align-middle text-sm text-foreground">$630.44</aria-table-cell>
        </aria-table-row>
      </aria-table-body>
    </aria-table>
  </div>
  <div class="text-sm text-muted-foreground">0 of 5 row(s) selected.</div>
</div>
```

## Anatomy

```html
<aria-table>
  <aria-table-caption></aria-table-caption>
  <aria-table-header>
    <aria-table-row>
      <aria-table-column-header></aria-table-column-header>
    </aria-table-row>
  </aria-table-header>
  <aria-table-body>
    <aria-table-row>
      <aria-table-row-header></aria-table-row-header>
      <aria-table-cell></aria-table-cell>
    </aria-table-row>
  </aria-table-body>
  <aria-table-footer></aria-table-footer>
</aria-table>
```

## API Reference

| Part | Semantic role | Description |
| --- | --- | --- |
| Root | `table` | Structural table root and horizontal overflow container. |
| Header | `rowgroup` | Groups column-header rows. |
| Body | `rowgroup` | Groups body rows. |
| Footer | `rowgroup` | Groups footer rows. |
| Row | `row` | Contains header or data cells. |
| Cell | `cell` | Standard data cell. |
| ColumnHeader | `columnheader` | Column heading; use `scope="col"` when needed. |
| RowHeader | `rowheader` | Row heading with `scope="row"` by default. |
| Caption | `caption` | Human-readable table caption. |

Table is intentionally stateless. Sorting, filtering, pagination, selection, expansion, and row actions belong to the consumer.

## Accessibility

The custom elements expose the equivalent table, rowgroup, row, cell, columnheader, rowheader, and caption semantics. Give Root an accessible name with Caption, `aria-label`, or `aria-labelledby`. Add `aria-sort` to sortable ColumnHeader parts and manage `aria-selected` yourself when rows are selectable.
