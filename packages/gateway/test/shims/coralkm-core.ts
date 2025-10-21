// Test-only shim for '@coralkm/core' to avoid pulling heavy CJS deps (like z-schema)
// during Cloudflare Workers tests. Only exports what's needed by gateway/src/index.ts.

export const DID_DOC_PATH = '/.well-known/did.json'

type MinimalIdentifier = { did: string }

export function didDocForIdentifier(identifier: MinimalIdentifier) {
  // Minimal DID Document shape used by the gateway DID route in tests
  return {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: identifier.did,
    verificationMethod: [],
    service: [],
  }
}

export function getDIDCommReturnRouteMessage(_response: unknown): null {
  // For unit tests that don't exercise DIDComm return routing, return null
  return null
}
