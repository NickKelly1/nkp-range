# @nkp/range

[![npm version](https://badge.fury.io/js/%40nkp%2Frange.svg)](https://www.npmjs.com/package/@nkp/range)
[![deploy status](https://github.com/NickKelly1/nkp-range/actions/workflows/release.yml/badge.svg)](https://github.com/NickKelly1/nkp-range/actions/workflows/release.yml)
[![known vulnerabilities](https://snyk.io/test/github/NickKelly1/nkp-range/badge.svg)](https://snyk.io/test/github/NickKelly1/nkp-range)

Zero dependency utility to create iterable discrete and continuous ranges.

```ts
import { range } from '@nkp/range';

for (const state of range({ start: 0, end: 6, step: 2, inclusive: true })) {
    const { cursor, step, to, set, isInBounds, } = state;
    console.log(cursor);
}

// 0
// 2
// 4
// 6
```

## Table of contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [pnpm](#pnpm)
  - [Exports](#exports)
- [Usage](#usage)
- [Updating Dependencies](#updating-dependencies)
- [Publishing](#publishing)

## Installation

### npm

```sh
npm install @nkp/range
```

### yarn

```sh
yarn add @nkp/range
```

### pnpm

```sh
pnpm add @nkp/range
```

### Exports

`@nkp/range` targets CommonJS and ES modules. To utilise ES modules consider using a bundler like `webpack` or `rollup`.

## Usage


```ts
import { range } from '@nkp/range';

for (const state of range({ start: 0, end: 6, step: 2, inclusive: true })) {
    const { cursor, step, to, set, isInBounds, } = state;
    console.log(cursor);
}

// 0
// 2
// 4
// 6
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
