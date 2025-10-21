# @coralkm/gateway

## Overview

This package provides a Cloudflare worker implementation of the Wallet Gateway used for:

- DIDComm Mediation between wallets/guardians using the Coordinate Mediation/Routing protocols over websockets
- A wallet CoralKM namespace for wallets to send recovery requests that are broadcast to all guardians listening and to backup (sync) the user's wallet data for recovery
- It also supports the guardian role of the CoralKM protocol to support being a guardian and storing recovery shards on behalf of wallets

All datastores for the Veramo Agent are implemented using D1 for keeping state between worker invokations.

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

Setup D1 tables/schema using migrations under the `./migrations` folder:

```bash
yarn workspace @coralkm/gateway apply-migrations
```

The start the worker locally in development mode:

```bash
yarn workspace @coralkm/gateway dev
```

## Testing

Run the package test suite:

```bash
yarn workspace @coralkm/gateway test
```

## Deploy to Cloudflare

Make sure you review the settings under the `wrangler.toml` file before starting. You will also need to setup a secret `SECRET_BOX_KEY` and provide a secret as described in the `.dev.vars.template`

Once setup you can then run the deployment to Cloudflare:

```bash
yarn workspace @coralkm/gateway apply-migrations --remote
yarn workspace @coralkm/gateway deploy
```
