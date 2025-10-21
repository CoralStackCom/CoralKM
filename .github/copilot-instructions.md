# CoralKM: Decentralized Key Management Protocol

## Project Overview

CoralKM is a user-friendly protocol for decentralized key management built as a TypeScript monorepo with Yarn Workspaces. The system uses DidComm messaging for secure peer-to-peer communication between components.

## Architecture Overview

### Monorepo Structure (Yarn Workspaces)

```
./packages/
  @coralstack/core/     # Core library shared across packages, contains Veramo Agent plugins for the CoralKM protocol, DIDComm Protocol Handler plugin, and a fork of the web-did-resolver that adds an override function to resolve web DIDs locally
  @coralstack/wallet/       # A React Single Page Application (SPA) wallet for demoing the CoralKM protocol. It sets up a new wallet and mediation via the gateway, and allows the user to interact with the CoralKM protocol
  @coralstack/gateway/      # This is a Cloudflare worker that acts as a gateway for the wallet to communicate with other peers using DidComm messaging and websockets
```

### Inter-Package Communication

- Uses the Veramo Agent framework for DID and key management and the DIDComm plugin for secure messaging
- The gateway acts as a DIDComm mediator between wallets, and as the CoralKM wallet gateway to backup their namespace/data
- All communication goes via websockets to the gateway, which routes messages to the appropriate peer DID

## Architecture Principles

- **Security First**: All cryptographic operations must follow industry best practices
- **User-Friendly**: Complex key management operations should be abstracted behind simple APIs
- **Decentralized**: No single point of failure or centralized key storage
- **Protocol-Agnostic**: Support multiple cryptographic schemes and blockchain protocols

## Development Guidelines

### Security Considerations

- Never log or expose private keys, seeds, or sensitive cryptographic material
- Use secure random number generation for all cryptographic operations
- Implement proper key derivation functions (KDFs) following standards like PBKDF2, scrypt, or Argon2
- Follow the principle of least privilege for key access and operations
- Consider timing attack resistance in cryptographic implementations

### Package Organization

#### `@coralstack/core`

Core key management protocol implementation

- `/src/coralkm-protocol/`: The core CoralKM protocol handler plugin for the didcomm-protocols Veramo plugin
- `/src/didcomm-protocols/`: A new Veramo DIDComm Protocols plugin that managed DIDComm message protocols on top of the base DIDComm plugin
- `/src/utils/`: Any shared utility functions
- `/src/web-did-resolver/`: A fork of the web-did-resolver that adds an override function to resolve web DIDs locally

#### `@coralstack/gateway`

Cloudflare worker gateway implementation. Acts as a DidComm mediator and message router using websockets and a CoralKM wallet gateway and guardian for backup and recovery.

- `/migrations/`: D1 database migration scripts
- `/test/`: Vitest test suites and setup scripts
- `/src/agent/`: Veramo agent setup and configuration
- `/src/agent/d1-data-store`: All Veramo data store implementations using Cloudflare D1
- `/src/agent/cl-kv-store`: An implementation of a key-value store using Cloudflare KV for Veramo. Not used but kept for reference
- `/src/index.ts`: The Cloudflare worker entry point with endpoint routing
- `/src/websocket-worker.ts`: A Cloudflare Durable Object implementation for managing websocket connections with hibernation support

#### `@coralstack/wallet`

A React.js Single Page Application (SPA) wallet for demoing the CoralKM protocol.

- `public`: Any public static assets
- `/src/main.tsx`: Main entry point for the React app
- `/src/components/`: React components for the wallet UI
- `/src/app/`: Main App logic and page
- `/src/lib/`: Any library functions and utilities
- `/src/providers/wallet`: The main implementation of the wallet that wraps the Veramo agent and provides the interface for the UI to interact with the CoralKM protocol. It is implemented as a React context provider with a hook `useWallet()` for easy access throughout the app. Also contains the logic for
  `websock-connection.ts` to setup and manage the websocket connection to the gateway.

### Workspace Configuration

- `package.json`: Root workspace configuration
- `yarn.lock`: Dependency lock file
- `tsconfig.base.json`: Shared TypeScript configuration
- `packages/*/tsconfig.json`: Package-specific TS configs

### Testing Requirements

- Unit tests for all cryptographic functions
- Integration tests for protocol interactions
- Security-focused fuzzing and property-based testing
- Cross-platform compatibility testing

### Documentation Standards

- Document all cryptographic assumptions and security models
- Provide clear API documentation with security considerations
- Include threat model analysis
- Document key derivation paths and standards used
- Maintain compatibility matrices for supported protocols

### Monorepo Development Patterns

- Use `yarn workspace @coralstack/[package] [command]` for package-specific operations
- Shared dependencies go in root `package.json`
- Package-specific dependencies in individual `package.json` files
- Use TypeScript project references for fast builds
- Implement consistent logging across all packages

### Dependencies

- The Veramo Agent framework for DID and key management (https://veramo.io/)

## Common Patterns

This section will be updated as the codebase develops and patterns emerge.

## Getting Started
