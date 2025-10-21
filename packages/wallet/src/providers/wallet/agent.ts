import type { IDIDManager, IKeyManager, IMessageHandler, IResolver, TAgent } from '@veramo/core'
import { createAgent } from '@veramo/core'
import type { IDIDComm } from '@veramo/did-comm'
import { DIDComm, DIDCommMessageHandler } from '@veramo/did-comm'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { PeerDIDProvider, getResolver as peerDidResolver } from '@veramo/did-provider-peer'
import { WebDIDProvider } from '@veramo/did-provider-web'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager, MemoryKeyStore, type AbstractPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { MessageHandler } from '@veramo/message-handler'
import { Resolver } from 'did-resolver'

import type { ICoralKMGuardianStore, IDIDCommProtocols, IUserProfileStore } from '@coralkm/core'
import {
  DCCoralKMProtocolV01,
  DCMediationProtocolV3,
  DCMessagePickupProtocolV3,
  DCRoutingProtocolV2,
  DCUserProfileProtocolV1,
  DIDCommProtocolMessageHandler,
  DIDCommProtocols,
  getResolver as webDidResolver,
} from '@coralkm/core'

// Define the Veramo agent type with necessary plugins
export type AppAgent = TAgent<
  IResolver & IDIDManager & IKeyManager & IDIDComm & IDIDCommProtocols & IMessageHandler
>

/**
 * Options for creating the Veramo agent
 */
export type AgentOptions = {
  privateKeyStore: AbstractPrivateKeyStore
  userProfileStore: IUserProfileStore
  guardianStore: ICoralKMGuardianStore
}

/**
 * Create a Veramo agent with DID management and DIDComm capabilities
 *
 * @returns A Veramo agent instance with DID management and DIDComm capabilities
 */
export function createVeramoAgent(options: AgentOptions): AppAgent {
  const agent = createAgent<AppAgent>({
    plugins: [
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(options.privateKeyStore),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:peer',
        providers: {
          'did:peer': new PeerDIDProvider({ defaultKms: 'local' }),
          'did:web': new WebDIDProvider({ defaultKms: 'local' }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...peerDidResolver(),
          ...webDidResolver(async (did: string, url: string) => {
            // For did:web DIDs hosted on http://localhost during development
            if (did.startsWith('did:web:localhost')) {
              try {
                const httpUrl = url.replace('https://', 'http://')
                console.debug('Resolving DID Locally:', did, 'via', httpUrl)
                const res = await fetch(httpUrl, { mode: 'cors' })
                if (res.status >= 400) {
                  throw new Error(`Bad response ${res.statusText}`)
                }
                return res.json()
              } catch (e) {
                console.error('Error fetching local DID document:', e)
              }
            }
            return null
          }),
        }),
      }),
      new MessageHandler({
        messageHandlers: [new DIDCommMessageHandler(), new DIDCommProtocolMessageHandler()],
      }),
      new DIDComm(),
      new DIDCommProtocols([
        new DCMediationProtocolV3({ role: 'recipient' }),
        new DCMessagePickupProtocolV3('recipient'),
        new DCUserProfileProtocolV1(options.userProfileStore),
        new DCRoutingProtocolV2(),
        new DCCoralKMProtocolV01({
          roles: ['wallet', 'guardian'],
          guardianStore: options.guardianStore,
        }),
      ]),
    ],
  })

  return agent
}
