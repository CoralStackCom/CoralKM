import { createAgent } from '@veramo/core'
import { DIDComm, DIDCommMessageHandler } from '@veramo/did-comm'
import { DIDManager } from '@veramo/did-manager'
import { PeerDIDProvider, getResolver as peerDidResolver } from '@veramo/did-provider-peer'
import { WebDIDProvider } from '@veramo/did-provider-web'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager } from '@veramo/key-manager'
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
import { MessageHandler } from '@veramo/message-handler'
import { Resolver } from 'did-resolver'

import {
  DCCoralKMProtocolV01,
  DCMediationProtocolV3,
  DCMessagePickupProtocolV3,
  DCRoutingProtocolV2,
  DCUserProfileProtocolV1,
  DIDCommProtocolMessageHandler,
  DIDCommProtocols,
  didDocForIdentifier,
  getResolver as webDidResolver,
} from '@coralkm/core'

import { getWebDIDUris } from '../default-did'
import type { AppAgent } from '../env'
import { GatewayUserProfileStore } from './agent-profile'
import {
  D1DataStore,
  D1DIDStore,
  D1GuardianStore,
  D1KeyStore,
  D1MediatorStore,
  D1NamespaceStore,
  D1PrivateKeyStore,
} from './d1-data-store'

/**
 * Create a Veramo agent with DID management and DIDComm capabilities
 *
 * @param d1dbConnection The D1 database connection
 * @param url            The base URL of the gateway
 * @param secret         The secret key for PrivateKeyStore encryption at rest
 * @returns A Veramo agent instance with DID management and DIDComm capabilities
 */
export function createVeramoAgent(d1dbConnection: D1Database, url: URL, secret: string): AppAgent {
  const mediatorStore = new D1MediatorStore(d1dbConnection)
  const gatewayDid = getWebDIDUris(url).id
  const agent = createAgent<AppAgent>({
    plugins: [
      new KeyManager({
        store: new D1KeyStore(d1dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new D1PrivateKeyStore(d1dbConnection, new SecretBox(secret))
          ),
        },
      }),
      new DIDManager({
        store: new D1DIDStore(d1dbConnection),
        defaultProvider: 'did:peer',
        providers: {
          'did:peer': new PeerDIDProvider({ defaultKms: 'local' }),
          'did:web': new WebDIDProvider({ defaultKms: 'local' }),
        },
      }),
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
            return null
          }),
        }),
      }),
      new D1DataStore(d1dbConnection),
      new MessageHandler({
        messageHandlers: [new DIDCommMessageHandler(), new DIDCommProtocolMessageHandler()],
      }),
      new DIDComm(),
      new DIDCommProtocols([
        new DCMediationProtocolV3({ role: 'mediator', store: mediatorStore }),
        new DCMessagePickupProtocolV3('mediator'),
        new DCUserProfileProtocolV1(new GatewayUserProfileStore()),
        new DCRoutingProtocolV2(mediatorStore),
        new DCCoralKMProtocolV01({
          roles: ['gateway', 'guardian'],
          namespaceStore: new D1NamespaceStore(d1dbConnection, gatewayDid),
          guardianStore: new D1GuardianStore(d1dbConnection),
        }),
      ]),
    ],
  })

  return agent as AppAgent
}
