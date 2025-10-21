import { TKeyType } from '@veramo/core-types'

import type { AppContext } from './env'

/**
 * Get the web DID identifier based on the request context
 *
 * @param context   The request context containing the environment and request details
 * @returns         The DID identifier, alias and serverEndpoint for the web DID based on
 *                  the request context
 */
export function getWebDIDUris(url: URL): {
  id: string
  alias: string
  serverHTTPEndpoint: string
  serverWSEndpoint: string
  origin: string
} {
  const origin = url.hostname
  return {
    id: `did:web:${origin}${origin === 'localhost' ? `%3A${url.port}` : ''}`,
    alias: origin === 'localhost' ? `${origin}%3A${url.port}` : origin,
    serverHTTPEndpoint: `${origin === 'localhost' ? `http://localhost:${url.port}` : `https://${origin}`}`,
    serverWSEndpoint: `${origin === 'localhost' ? `ws://localhost:${url.port}` : `wss://${origin}`}`,
    origin,
  }
}

/**
 * This can be used to automatically create a did:web with signing and encryption keys and listing messaging and
 * DIDComm service endpoints.
 *
 * @param options - The options guiding the creation of the default DID
 */
export async function createDefaultDid(context: AppContext) {
  const didId = getWebDIDUris(new URL(context.req.url))
  const agent = context.get('agent')
  try {
    const existing = await agent.didManagerGet({ did: didId.id })
    return existing
  } catch (_error) {
    // Create a new DID for the gateway
    console.log('Creating new DID for', didId)
    const newIdentifier = await agent.didManagerCreate({
      provider: 'did:web',
      alias: didId.alias,
      options: {
        keyType: <TKeyType>'Ed25519',
      },
    })
    // Add a service endpoints for DIDComm messages
    await agent.didManagerAddService({
      did: newIdentifier.did,
      service: {
        id: '#service',
        type: 'DIDCommMessaging',
        serviceEndpoint: {
          uri: `${didId.serverHTTPEndpoint}/messages`,
          accept: ['didcomm/v2'],
        },
      },
    })
    await agent.didManagerAddService({
      did: newIdentifier.did,
      service: {
        id: '#service-1',
        type: 'DIDCommMessaging',
        serviceEndpoint: {
          uri: `${didId.serverWSEndpoint}/ws`,
          accept: ['didcomm/v2'],
        },
      },
    })

    // Return updated identifier
    return await agent.didManagerGet({ did: didId.id })
  }
}
