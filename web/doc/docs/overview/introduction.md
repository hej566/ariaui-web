# Introduction

Aria UI Web is a Web Component workspace for browser-native custom elements. It keeps package names and docs slugs under the `@ariaui-web` scope while exposing a native custom-element runtime boundary.

The first implementation layer gives every package a tested contract:

- separated part modules such as `Root`, `Trigger`, `Content`, and `Item`
- idempotent `define*Elements()` registration functions
- a `componentSpec` export that maps package parts to custom element names
- a `readme.md` file that documents the native Web Component contract

The workspace currently contains 63 packages.
