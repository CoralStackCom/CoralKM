# @coralkm/wallet

## Overview

This package provides a single page React.js app for a demonstraction wallet with features to interact and test the CoralKM protocol.

# Developer setup

Use the repository Node version via nvm (the repo includes an `.nvmrc`):

```bash
nvm use
```

Install workspace dependencies from the repository root (Yarn workspaces):

```bash
yarn install
```

## Developing

This project uses Vite to compile and run the app. To start the wallet locally in development mode with hot refresh:

```bash
yarn workspace @coralkm/wallet dev --force
```

## Testing

Run the package test suite using Vitest:

```bash
yarn workspace @coralkm/wallet test
```
