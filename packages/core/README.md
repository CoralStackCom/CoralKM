# @coralkm/core

## Overview

This package provides the shared core library, utilities, types and protocol implementations used across the CoralKM monorepo. It contains [Veramo](https://veramo.io/) agent plugins, DIDComm protocol handlers, DID utilities, and other common code that packages like `@coralkm/gateway` and `@coralkm/wallet` depend on.

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

Build the package (TypeScript compile output goes to `dist`):

```bash
yarn workspace @coralkm/core build
```

## Testing

Run the package test suite:

```bash
yarn workspace @coralkm/core test
```

## src/didcomm-protocols

This is a Veramo plugin that provides a single MessageHandler for managing all DIDComm protocols consistently and easily. Out of the box it supports Trust Ping, Report Problem and Discover Features protocol, and has protocol handlers for Coordinate Mediation, Routing, Message Pickup and User Profile which can be added.

Adding a new protocol is easy by implementing the `IDIDCommProtocolHandler` interface and then adding the new handler to the plugin. The DidComm Protocol Message handler must be used after the DidComm Message Handler which takes care of all the message unpacking etc. before it's passed to the protocol
handler for processing.

## src/coralkm-protocol

This is a DIDComm Protocol Handler for the CoralKM Protocol being demonstrated and developed in this repo. It contains all the key messages and an initial implementation of the protocol for demonstration and testing purposes.

# src/web-did-resolver

This is a fork of the [web-did-resolver](https://github.com/decentralized-identity/web-did-resolver) used by Veramo's Resolver plugin. The plugin works exactly the same but adds a optional `override` function to the constructor which can be used to override web:did lookups.

This is needed during local development, as localhost does not support https, and on Cloudflare workers
where packing DIDComm messages calls this resolver for web:dids and Cloudflare blocks the callback to itself with a 404 error to prevent infinite loops.

Here is an example of how to use the override function on Cloudflare:

```typescript
new DIDResolverPlugin({
        resolver: new Resolver({
          ...peerDidResolver(),
          ...webDidResolver(async (did: string) => {
            // For did:web DIDs hosted by this gateway, resolve locally
            if (did === gatewayDid) {
              console.debug('Resolving DID Locally:', did)
              const didStore = new D1DIDStore(d1dbConnection)
              try {
                const identifier = await didStore.getDID({ did })
                return didDocForIdentifier(identifier)
              } catch (e) {
                // identifier not found, skip it
              }
            }
            // Return null if skipping local resolution so web-did-resolver
            // can resolve it using its own implementation
            return null
          }),
        }),
      }),
```
