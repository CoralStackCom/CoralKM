import type { IDIDManager, IIdentifier, TAgent } from '@veramo/core'

/**
 * Utility function to create a new Peer DID using the provided Veramo agent
 *
 * @param alias     The alias for the new DID
 * @param agent     The Veramo agent instance
 * @returns         The created DID identifier
 */
export async function createPeer2DID(
  alias: string,
  agent: TAgent<IDIDManager>
): Promise<IIdentifier> {
  return await agent.didManagerCreate({
    provider: 'did:peer',
    alias,
    options: {
      num_algo: 2,
      service: [
        {
          id: '#service',
          type: 'DIDCommMessaging',
          serviceEndpoint: {
            uri: 'https://example.com/endpoint',
            accept: ['didcomm/v2'],
          },
        },
      ],
    },
  })
}
