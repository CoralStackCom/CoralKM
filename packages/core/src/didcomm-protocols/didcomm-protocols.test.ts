import type { IDIDManager, IKeyManager, IMessageHandler, IResolver, TAgent } from '@veramo/core'
import { createAgent } from '@veramo/core'
import type { IDIDComm } from '@veramo/did-comm'
import { DIDComm, DIDCommMessageHandler } from '@veramo/did-comm'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { PeerDIDProvider, getResolver as peerDidResolver } from '@veramo/did-provider-peer'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { MessageHandler } from '@veramo/message-handler'
import { Resolver } from 'did-resolver'

import { DIDCommProtocolMessageHandler } from './dicomm-protocols-message-handler'
import type { IDIDCommProtocols } from './didcomm-protocols-interface'
import { DIDCommProtocols } from './didcomm-protocols-plugin'
import { getDIDCommReturnRouteMessage } from './didcomm-utils'
import { DiscoverFeaturesV2MessageTypes, TrustPingV2MessageTypes } from './protocols'

import { AssertionError } from 'assert'
import { createPeer2DID } from '../__tests__/utils'

type AppAgent = TAgent<
  IKeyManager & IDIDManager & IResolver & IDIDCommProtocols & IDIDComm & IMessageHandler
>
let agent: AppAgent

beforeAll(() => {
  agent = createAgent<AppAgent>({
    plugins: [
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:peer',
        providers: {
          'did:peer': new PeerDIDProvider({ defaultKms: 'local' }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...peerDidResolver(),
        }),
      }),
      new DIDComm(),
      new DIDCommProtocols(),
      new MessageHandler({
        messageHandlers: [new DIDCommMessageHandler(), new DIDCommProtocolMessageHandler()],
      }),
    ],
  })
})

describe('test didcomm-protocols-plugin', () => {
  it('test listDIDCommProtocols', async () => {
    const protocols = await agent.listDIDCommProtocols()
    expect(protocols).toBeDefined()
    expect(protocols.length).toBe(3)
  })

  it('test discover features protocol', async () => {
    const alice = await createPeer2DID('alice', agent)
    const bob = await createPeer2DID('bob', agent)

    const discoveryRequest = await agent.createProtocolMessage({
      type: DiscoverFeaturesV2MessageTypes.QUERIES_REQUEST,
      from: alice.did,
      to: bob.did,
    })
    const packedRequest = await agent.packDIDCommMessage({
      message: discoveryRequest,
      packing: 'authcrypt',
    })

    // Handle message as if it was received over the wire
    const response = await agent.handleMessage({ raw: packedRequest.message, save: false })

    // Wait for the response message to be received on the bus
    const discoveryResponse = getDIDCommReturnRouteMessage(response)
    if (!discoveryResponse) throw new AssertionError({ message: 'discoveryResponse is undefined' })
    expect(discoveryResponse).toBeDefined()
    expect(discoveryResponse.message.type).toBe(
      'https://didcomm.org/discover-features/2.0/disclose'
    )
    expect(discoveryResponse.message.thid).toBe(discoveryRequest.id)
    expect(discoveryResponse.message.body.disclosures).toBeDefined()
    expect(discoveryResponse.message.body.disclosures.length).toBe(3)
  })

  it('test trust ping protocol', async () => {
    const alice = await createPeer2DID('alice2', agent)
    const bob = await createPeer2DID('bob2', agent)

    const pingRequest = await agent.createProtocolMessage({
      type: TrustPingV2MessageTypes.PING,
      from: alice.did,
      to: bob.did,
    })
    const packedRequest = await agent.packDIDCommMessage({
      message: pingRequest,
      packing: 'authcrypt',
    })

    // Handle message as if it was received over the wire
    const response = await agent.handleMessage({ raw: packedRequest.message, save: false })
    const pingResponse = getDIDCommReturnRouteMessage(response)
    if (!pingResponse) throw new AssertionError({ message: 'pingResponse is undefined' })
    expect(pingResponse.message.type).toBe('https://didcomm.org/trust-ping/2.0/ping-response')
    expect(pingResponse.message.thid).toBe(pingRequest.id)
  })
})
