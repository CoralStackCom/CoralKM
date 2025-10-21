import type { IAgentPlugin } from '@veramo/core'
import type { IDIDCommMessage } from '@veramo/did-comm'
import Debug from 'debug'

import type {
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from './didcomm-protocols-interface'
import { getMessageType } from './didcomm-utils'
import {
  DCDiscoveryProtocolV2,
  DCReportProblemProtocolV2,
  DCTrustPingProtocolV2,
} from './protocols'

const debug = Debug('veramo:did-comm:protocols-plugin')

/**
 * Default protocol handlers to register
 */
const DEFAULT_PROTOCOLS: IDIDCommProtocolHandler[] = [
  new DCTrustPingProtocolV2(),
  new DCDiscoveryProtocolV2(),
  new DCReportProblemProtocolV2(),
]

/**
 * DIDComm Protocols Plugin for {@link @veramo/core#Agent}
 *
 * Registers DIDComm protocols which can be used to send and receive DIDComm messages on top of DIDComm v2.
 * You must also include the {@link @veramo/did-comm#DIDComm} plugin to enable DIDComm v2 transport.
 */
export class DIDCommProtocols implements IAgentPlugin {
  /**
   * Holds a Map of supported protocols that can be looked up using their full PIURI and Version
   * as the key (e.g., "https://didcomm.org/messaging/2.0")
   */
  private protocols: Map<string, IDIDCommProtocolHandler> = new Map<
    string,
    IDIDCommProtocolHandler
  >()

  /** Plugin methods */
  readonly methods: IDIDCommProtocols

  /**
   * Create a new instance of the DIDCommProtocols plugin. Will automatically register default protocols:
   * Trust Ping and Discovery.
   *
   * @param protocols   An optional array of DIDComm protocol handlers to register upon initialization.
   * @throws {Error}    If any of the provided protocol handlers are invalid or if there are duplicates.
   */
  constructor(protocols: IDIDCommProtocolHandler[] = []) {
    this.methods = {
      registerDIDCommProtocol: this.registerDIDCommProtocol.bind(this),
      unregisterDIDCommProtocol: this.unregisterDIDCommProtocol.bind(this),
      listDIDCommProtocols: this.listDIDCommProtocols.bind(this),
      getDIDCommProtocol: this.getDIDCommProtocol.bind(this),
      createProtocolMessage: this.createProtocolMessage.bind(this),
    }
    for (const protocol of [...DEFAULT_PROTOCOLS, ...protocols]) {
      this._registerDIDCommProtocol(protocol)
    }
  }

  /** {@inheritdoc IDIDCommProtocols.registerDIDCommProtocol} */
  async registerDIDCommProtocol(protocol: IDIDCommProtocolHandler): Promise<void> {
    this._registerDIDCommProtocol(protocol)
  }

  /** {@inheritdoc IDIDCommProtocols.listDIDCommProtocols} */
  async listDIDCommProtocols(): Promise<IDIDCommProtocolHandler[]> {
    return Array.from(this.protocols.values())
  }

  /** {@inheritdoc IDIDCommProtocols.unregisterDIDCommProtocol} */
  async unregisterDIDCommProtocol({
    piuri,
    version,
  }: {
    piuri: string
    version: string
  }): Promise<void> {
    const key = `${piuri}/${version}`
    if (!this.protocols.has(key)) {
      throw new Error(`Protocol handler for ${key} is not registered.`)
    }
    this.protocols.delete(key)
  }

  /** {@inheritdoc IDIDCommProtocols.getDIDCommProtocol} */
  async getDIDCommProtocol(messageType: string): Promise<IDIDCommProtocolHandler> {
    const { piuri, version } = getMessageType(messageType)
    const key = `${piuri}/${version}`
    const protocol = this.protocols.get(key)
    if (!protocol) {
      throw new Error(`No protocol handler found for message type: ${messageType}`)
    }
    return protocol
  }

  /** {@inheritdoc IDIDCommProtocols.createProtocolMessage} */
  async createProtocolMessage(args: IProtocolMessageArgs): Promise<IDIDCommMessage> {
    const { piuri, version } = getMessageType(args.type)
    const key = `${piuri}/${version}`
    const protocol = this.protocols.get(key)
    if (!protocol) {
      throw new Error(`No protocol handler found for message type: ${args.type}`)
    }
    return protocol.createMessage(args)
  }

  /**
   * Implementation of protocol registration.
   *
   * @param protocol The protocol handler to register.
   * @throws {Error} If any of the provided protocol handlers are invalid or if there are duplicates.
   */
  private _registerDIDCommProtocol(protocol: IDIDCommProtocolHandler) {
    debug('Registering DIDComm protocol handler:', protocol)
    if (!protocol.name || !protocol.version || !protocol.piuri || !protocol.handle) {
      throw new Error(
        `Invalid protocol handler: ${JSON.stringify(
          protocol
        )}. A protocol handler must have 'name', 'version', 'piuri', and 'handle' properties.`
      )
    }
    const key = `${protocol.piuri}/${protocol.version}`
    if (this.protocols.has(key)) {
      throw new Error(`Protocol handler for ${key} is already registered.`)
    }
    this.protocols.set(key, protocol)
  }
}
