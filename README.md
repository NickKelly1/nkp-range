# Nkp package template

Template for @nkp/ npm packages.

This tempalte uses pnpm as a package manager instead of npm or yarn.

Pnpm improves local development by symbolically linking dependencies and speeding up the installation process.

Comes with:

1. Language: TypeScript & JavaScript
2. Linting: Eslint
3. Testing: Jest
    - Support TypeScript test files
    - Support e2e and unit tests
    - Easy to configure for DOM testing
4. Building: Rollup
    1. Builds commonjs
    2. Builds ES Modules (targets package.json#module)
        - Package consumers using build tools such as `rollup` and `webpack` target package.json#module, the ES Module export of the package, for tree shaking. Tree shaking generates smaller packages and reduces build times.
5. CI: GitHub actions
    - Builds, tests and publishes to `npm` when a new release is created on GitHub.

## Getting started

1. Clone the repository
    - `git clone git@github.com:NickKelly1/nkp-template.git`
    - (optional): use GitHub's `template` feature.
2. Install dependencies and run tests
    1. If using nvm, run `nvm use` to set the NodeJS version
    2. run `npm install`
    3. run `npm test`
3. Find and replace placeholders in the project
    1. Functions to create discrete and continuous iterable ranges.
    2. @nkp/range
    3. https://github.com/NickKelly1/nkp-range.git
    4. NickKelly1
    5. nkp-range
    6. nkp
    7. range
    8. Functions to create discrete and continuous iterable ranges.
    9. ---USAGE-TEXT---
4. Remove stubs and reset the repos state
    1. Remove the contents of `src/index.ts`
    2. set the testEnvironment in `jest.config.ts
    3. Remove `src/examples`
5. Add an NPM_TOKEN to the repository for CI
    1. Using npmjs, generate a CI token
    2. Add the token to this GitHub repositories secrets as "NPM_TOKEN"
6. Set up the README.MD

## @nkp/range

Fill in the following:

```txt
![npm version](https://badge.fury.io/js/%40nkp%2Frange.svg)
[![Node.js Package](https://github.com/NickKelly1/range/actions/workflows/release.yml/badge.svg)](https://github.com/NickKelly1/nkp-range/actions/workflows/release.yml)
![Known Vulnerabilities](https://snyk.io/test/github/NickKelly1/nkp-range/badge.svg)
```

Functions to create discrete and continuous iterable ranges.

## Table of contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [pnpm](#pnpm)
  - [Exports](#exports)
- [Usage](#usage)
- [Updating Dependencies](#updating-dependencies)

## Installation

### NPM

```sh
npm install @nkp/range
```

### Yarn

```sh
yarn add @nkp/range
```

### PNPM

```sh
pnpm add @nkp/range
```

### Exports

`@nkp/range` targets CommonJS and ES modules. To utilise ES modules consider using a bundler like `webpack` or `rollup`.

## Usage


```ts
import { range } from '@nkp/range';

for (const state of range) {
    const {} = state;
    //
}
```

## Updating dependencies

To update dependencies run one of

```sh
# if npm
# update package.json
npx npm-check-updates -u
# install
npm install

# if yarn
# update package.json
yarn create npm-check-updates -u
# install
yarn

# if pnpm
# update package.json
pnpx npm-check-updates -u
# install
pnpm install
```

## Publishing

To a release a new version:

1. Update the version number in package.json
2. Push the new version to the `master` branch on GitHub
3. Create a `new release` on GitHub for the latest version

This will trigger a GitHub action that tests and publishes the npm package.
