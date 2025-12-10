import type { IMessage } from '@veramo/core'
import type { DIDCommMessagePacking, IDIDCommMessage } from '@veramo/did-comm'
import type { DIDDocument } from 'did-resolver'

import type { ErrorReport } from '@coralkm/core'
import {
  CoordinateMediationV3MessageTypes,
  DIDCOMM_MEDIATION_NEW_ROUTING_DID_METADATA_TYPE,
  getDIDCommDecodedMessage,
  getDIDCommReturnRouteMessage,
  ReportProblemV2MessageTypes,
  RoutingV2MessageTypes,
} from '@coralkm/core'

import type { AppAgent } from './agent'

/**
 * Response from calling invoke()
 */
export interface InvokeResponse {
  /**
   * The DIDComm message response
   */
  message: IDIDCommMessage
  /**
   * The decoded message content, if available
   */
  decoded?: unknown
}

/**
 * A ResposeHandler is a Promise that can be resolved or rejected by the client
 * when an invoke request is made.
 */
type ResposeHandler = {
  // Resolve promise with value on successful response
  resolve: (value: InvokeResponse) => void
  // Reject promise with reason on error
  reject: (reason: DIDCommResponseError) => void
}

/**
 * Callback function to handle outgoing and incoming DIDComm messages
 *
 * @param message     The DIDComm message sent or received
 * @param isSent      True if the message was sent, false if received
 * @param decoded     Optional decoded message content
 * @returns           A promise that resolves when the message has been processed
 */
export type OnMessageCallback = (
  message: IDIDCommMessage,
  isSent: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decoded?: any
) => Promise<void>

/**
 * Custom error class for DIDComm protocol-response errors.
 */
export class DIDCommResponseError extends Error {
  public code: string
  public escalate_to?: string
  public originalMessage?: IDIDCommMessage

  constructor(
    message: string,
    code: string,
    originalMessage: IDIDCommMessage,
    escalate_to?: string
  ) {
    super(message)
    this.name = 'DIDCommResponseError'
    this.code = code
    this.originalMessage = originalMessage
    this.escalate_to = escalate_to
  }
}

/**
 * Options for creating a WebSocketConnection instance.
 */
export interface WebSocketConnectionOptions {
  /**
   * The DID of the mediator to connect to
   */
  mediatorDID: string
  /**
   * The Veramo AppAgent instance
   */
  agent: AppAgent
  /**
   * Optional callback function to handle outgoing and incoming DIDComm messages
   */
  onMessage?: OnMessageCallback
}

/**
 * WebSocketConnection class to manage WebSocket connections.
 */
export class WebSocketConnection {
  private _mediatorDID: string
  private _agent: AppAgent
  private _url: string | null = null
  private _socket: WebSocket | null = null
  private onMessage?: OnMessageCallback
  // Client DID for connecting to the mediator
  private _clientDID: string | null = null
  // Holds list of unresolved Promises from invoke()
  private _replyHandlers = new Map<string, ResposeHandler>()

  /**
   * Create a WebSocketConnection instance.
   *
   * @param mediatorDID The DID of the mediator
   * @param agent       The AppAgent instance
   */
  constructor(options: WebSocketConnectionOptions) {
    console.log('[WebSocketConnection] Initializing with mediatorDID:', options.mediatorDID)
    this._mediatorDID = options.mediatorDID
    this._agent = options.agent
    this.onMessage = options.onMessage
  }

  /**
   * True if socket is currently open
   */
  get isOpen(): boolean {
    const open = !!this._socket && this._socket.readyState === WebSocket.OPEN
    console.debug(
      '[WebSocketConnection.isOpen] Socket open:',
      open,
      'readyState:',
      this._socket?.readyState
    )
    return open
  }

  /**
   * Get the client DID used for the mediator connection.
   *
   * @returns The client DID or null if not set
   */
  get clientDID(): string | null {
    return this._clientDID
  }

  /**
   * Establish a WebSocket connection to the mediator.
   *
   * @param clientDID   Optional client DID to use for the mediator connection. If not provided,
   *                    a new peer DID will be created.
   * @returns           An object containing the clientDID and routingDID used for the connection
   * @throws Error if the mediator's DID Document does not contain a valid WebSocket endpoint
   */
  async connect(clientDID?: string): Promise<{ clientDID: string; routingDID: string }> {
    console.log('[WebSocketConnection.connect] Starting connection with clientDID:', clientDID)

    if (!this._url) {
      // Connecting first time, resolve mediator DID Document
      console.log('[WebSocketConnection.connect] Resolving mediator DID:', this._mediatorDID)
      try {
        const mediatorDIDDoc = await this._agent.resolveDid({ didUrl: this._mediatorDID })
        console.log(
          '[WebSocketConnection.connect] Mediator DID resolved:',
          mediatorDIDDoc.didDocument ? 'success' : 'failed'
        )
        this._url = this._getWebSocketUrl(mediatorDIDDoc.didDocument)
        console.log('[WebSocketConnection.connect] WebSocket URL extracted:', this._url)
      } catch (error) {
        console.error('[WebSocketConnection.connect] Failed to resolve mediator DID:', error)
        throw error
      }
    }

    if (!clientDID) {
      // Create a new peer DID for this connection
      console.log('[WebSocketConnection.connect] Creating new peer DID')
      try {
        const identifier = await this._agent.didManagerCreate({
          provider: 'did:peer',
          alias: 'wallet-client',
          options: { num_algo: 2 },
        })
        this._clientDID = identifier.did
        console.log('[WebSocketConnection.connect] Peer DID created:', this._clientDID)
      } catch (error) {
        console.error('[WebSocketConnection.connect] Failed to create peer DID:', error)
        throw error
      }
    } else {
      this._clientDID = clientDID
      console.log('[WebSocketConnection.connect] Using provided clientDID:', clientDID)
    }

    // Return a promise that resolves when mediation setup is complete
    let resolvePromise: (value: { clientDID: string; routingDID: string }) => void
    let rejectPromise: (reason?: unknown) => void
    const promise = new Promise<{ clientDID: string; routingDID: string }>((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })

    // Initialize WebSocket connection
    if (!this._socket) {
      console.log('[WebSocketConnection.connect] Creating WebSocket connection to:', this._url)
      this._socket = new WebSocket(this._url)

      // Handle WebSocket open event
      this._socket.onopen = async () => {
        console.log('[WebSocketConnection.onopen] WebSocket connection established')
        try {
          const routingDID = await this._setupMediation()
          console.log(
            '[WebSocketConnection.onopen] Mediation setup successful, routingDID:',
            routingDID
          )
          resolvePromise({ clientDID: this._clientDID as string, routingDID })
        } catch (error) {
          console.error('[WebSocketConnection.onopen] Mediation setup failed:', error)
          rejectPromise(error)
        }
      }

      // Handle incoming messages
      this._socket.onmessage = async event => {
        console.log('[WebSocketConnection.onmessage] Received message, parsing...')
        try {
          const packedMessage = JSON.parse(event.data)
          console.log(
            '[WebSocketConnection.onmessage] Packed message type:',
            packedMessage.type || 'unknown'
          )

          const response = await this._agent.handleMessage({ raw: packedMessage })
          console.log('[WebSocketConnection.onmessage] Message handled, type:', response.type)

          const didCommMessage = this._reconstructDIDCommMessage(response)
          const decoded = getDIDCommDecodedMessage(response) ?? this._getDIDCommRoutingDID(response)

          console.log('[WebSocketConnection.onmessage] Decoded content available:', !!decoded)
          console.log('[WebSocketConnection.onmessage] Thread ID:', response.threadId)

          if (response.threadId && this._replyHandlers.has(response.threadId)) {
            console.log(
              '[WebSocketConnection.onmessage] Found reply handler for threadId:',
              response.threadId
            )
            // This is a response to an invoke() call
            const handler = this._replyHandlers.get(response.threadId)
            if (handler) {
              if (response.type === ReportProblemV2MessageTypes.PROBLEM_REPORT) {
                console.warn(
                  '[WebSocketConnection.onmessage] Problem report received:',
                  (decoded as ErrorReport)?.comment
                )
                // Reject the promise with the problem report details
                const problemReport = decoded as ErrorReport
                const error = new DIDCommResponseError(
                  problemReport.comment || 'DIDComm Problem Report received',
                  problemReport.code,
                  didCommMessage,
                  problemReport.escalate_to
                )
                handler.reject(error)
              } else {
                console.log('[WebSocketConnection.onmessage] Resolving handler with response')
                // Resolve the promise with the response message and decoded content
                handler.resolve({ message: didCommMessage, decoded: decoded ?? undefined })
              }
              this._replyHandlers.delete(response.threadId)
            }
          }

          if (this.onMessage) {
            await this.onMessage(didCommMessage, false, decoded ?? undefined)
          }

          const returnRouteResponse = getDIDCommReturnRouteMessage(response)
          if (returnRouteResponse) {
            console.log(
              '[WebSocketConnection.onmessage] Return route response detected, sending...'
            )
            this.send(returnRouteResponse.message)
          }
        } catch (error) {
          console.error('[WebSocketConnection.onmessage] Error handling message:', error)
        }
      }

      // Handle WebSocket error event
      this._socket.onerror = error => {
        console.error('[WebSocketConnection.onerror] WebSocket error:', error)
      }

      // Handle WebSocket close event
      this._socket.onclose = () => {
        console.warn('[WebSocketConnection.onclose] WebSocket connection closed')
      }
    }

    // Wait for mediation setup to complete
    return promise
  }

  /**
   * Send a DIDComm message over the WebSocket connection. This sends an asynchronously packed message
   * and will not wait for a response. If the message is not being sent directly to the mediator, will route it
   * via the mediator using a Forward message.
   *
   * @param message The DIDComm message to send
   * @param packing The packing method to use (default: 'authcrypt')
   * @throws        Error if the WebSocket is not open, or if client DID is not set when routing is needed or error packing the message
   */
  async send(
    message: IDIDCommMessage,
    packing: DIDCommMessagePacking = 'authcrypt'
  ): Promise<void> {
    console.log(
      '[WebSocketConnection.send] Sending message, type:',
      message.type,
      'to:',
      message.to?.[0]
    )

    if (this.isOpen && this._socket) {
      try {
        console.debug('[WebSocketConnection.send] Packing message...')
        const packedMessage = await this._agent.packDIDCommMessage({
          message: message,
          packing: packing,
        })
        console.debug('[WebSocketConnection.send] Message packed successfully')

        // Check if message is being sent to mediator directly or being routed
        if (message.to && Array.isArray(message.to) && message.to[0] !== this._mediatorDID) {
          if (!this._clientDID) {
            const error = 'Client DID is not set. Cannot route message via mediator.'
            console.error('[WebSocketConnection.send]', error)
            throw new Error(error)
          }
          // Message is being routed, set the "to" field to the routing DID
          console.log('[WebSocketConnection.send] Routing message via mediator')
          const routedMessage = await this._agent.createProtocolMessage({
            type: RoutingV2MessageTypes.FORWARD,
            to: this._mediatorDID,
            from: this._clientDID,
            next: message.to?.[0] as string,
            packedMessages: [packedMessage.message],
          })
          const routerPackedMessage = await this._agent.packDIDCommMessage({
            message: routedMessage,
            packing: 'authcrypt',
          })
          this._socket.send(JSON.stringify(routerPackedMessage.message))
        } else {
          console.debug('[WebSocketConnection.send] Sending direct message to mediator')
          this._socket.send(JSON.stringify(packedMessage.message))
        }
        console.log('[WebSocketConnection.send] Message sent successfully')

        if (this.onMessage) {
          await this.onMessage(message, true)
        }
      } catch (error) {
        console.error('[WebSocketConnection.send] Error sending message:', error)
        throw error
      }
    } else {
      const error = 'WebSocket is not open. Unable to send message.'
      console.error(
        '[WebSocketConnection.send]',
        error,
        'isOpen:',
        this.isOpen,
        'socket:',
        !!this._socket
      )
      throw new Error(error)
    }
  }

  /**
   * Send a DIDComm message and await a response message. Returns a promise that resolves
   * when a response is received with the response message (using thid to correlate).
   *
   * @param message The DIDComm message to send and await a response for
   * @param packing The packing method to use (default: 'authcrypt')
   * @returns       The response DIDComm message
   */
  async invoke(
    message: IDIDCommMessage,
    packing: DIDCommMessagePacking = 'authcrypt'
  ): Promise<InvokeResponse> {
    console.log(
      '[WebSocketConnection.invoke] Invoking with message id:',
      message.id,
      'type:',
      message.type
    )
    await this.send(message, packing)
    return new Promise<InvokeResponse>((resolve, reject) => {
      console.log('[WebSocketConnection.invoke] Waiting for response with id:', message.id)
      this._replyHandlers.set(message.id, { resolve, reject })
    })
  }

  /**
   * Disconnect the WebSocket connection.
   */
  disconnect(): void {
    console.log('[WebSocketConnection.disconnect] Disconnecting...')
    if (this._socket) {
      this._socket.close()
      this._socket = null
    }
  }

  /**
   * Set up mediation with the mediator:
   * - Send a mediation request
   * - Await mediation grant
   * - Store mediator information
   *
   * @returns   The routing DID provided by the mediator
   * @throws    Error if mediation setup fails
   */
  private async _setupMediation(): Promise<string> {
    console.log('[WebSocketConnection._setupMediation] Starting mediation setup')

    if (!this._clientDID) {
      const error = 'Mediation setup failed: Client DID is not set. Cannot setup mediation.'
      console.error('[WebSocketConnection._setupMediation]', error)
      throw new Error(error)
    }

    console.log(
      '[WebSocketConnection._setupMediation] Creating mediation request, clientDID:',
      this._clientDID
    )

    // Setup mediation with mediator
    const mediationRequest = await this._agent.createProtocolMessage({
      type: CoordinateMediationV3MessageTypes.MEDIATE_REQUEST,
      to: this._mediatorDID,
      from: this._clientDID,
    })

    console.log('[WebSocketConnection._setupMediation] Mediation request created, invoking...')
    const response = await this.invoke(mediationRequest)

    console.log(
      '[WebSocketConnection._setupMediation] Response received, type:',
      response.message.type
    )
    console.log('[WebSocketConnection._setupMediation] Decoded response:', response.decoded)

    if (response.message.type === CoordinateMediationV3MessageTypes.MEDIATE_DENY) {
      const error = 'Mediation setup failed: Mediation denied by mediator'
      console.error('[WebSocketConnection._setupMediation]', error)
      throw new Error(error)
    }

    if (response.message.type === CoordinateMediationV3MessageTypes.MEDIATE_GRANT) {
      if (!response.decoded) {
        const error = 'Mediation setup failed: No decoded response from MEDIATE_GRANT'
        console.error('[WebSocketConnection._setupMediation]', error)
        throw new Error(error)
      }

      const routingDID = response.decoded as string

      if (!routingDID || typeof routingDID !== 'string' || routingDID.trim() === '') {
        const error = `Mediation setup failed: Invalid routing_did "${routingDID}" in MEDIATE_GRANT`
        console.error('[WebSocketConnection._setupMediation]', error)
        throw new Error(error)
      }

      console.log(
        '[WebSocketConnection._setupMediation] ✓ Mediation setup successful. Routing DID:',
        routingDID
      )
      return routingDID
    } else {
      const error = `Mediation setup failed: Unexpected response type "${response.message.type}", expected MEDIATE_GRANT`
      console.error('[WebSocketConnection._setupMediation]', error)
      throw new Error(error)
    }
  }

  /**
   * Helper function to reconstruct a DIDComm message from a Veramo IMessage
   *
   * @param message The Veramo IMessage to reconstruct from
   */
  private _reconstructDIDCommMessage(message: IMessage): IDIDCommMessage {
    console.debug(
      '[WebSocketConnection._reconstructDIDCommMessage] Reconstructing message:',
      message.id
    )
    return {
      id: message.id,
      type: message.type,
      from: message.from,
      to: message.to ? [message.to] : [],
      created_time: message.createdAt,
      expires_time: message.expiresAt,
      body: message.data,
      attachments: message.attachments,
      thid: message.threadId,
      return_route: message.returnRoute,
    }
  }

  /**
   * Helper function to extract the routing DID from a Message Handler Response's metaData
   * Added null safety checks for metadata extraction
   *
   * @param message The Message Handler Response to search metaData for
   * @returns       The routing DID if found, otherwise undefined
   */
  private _getDIDCommRoutingDID(message: IMessage): string | undefined {
    try {
      if (!message?.metaData || !Array.isArray(message.metaData)) {
        console.debug('[WebSocketConnection._getDIDCommRoutingDID] No metadata found')
        return undefined
      }

      const routingDidMessage = message.metaData.find(
        v => v?.type === DIDCOMM_MEDIATION_NEW_ROUTING_DID_METADATA_TYPE
      )

      if (routingDidMessage?.value) {
        console.debug(
          '[WebSocketConnection._getDIDCommRoutingDID] Routing DID found:',
          routingDidMessage.value
        )
        return routingDidMessage.value
      }

      console.debug('[WebSocketConnection._getDIDCommRoutingDID] No routing DID in metadata')
      return undefined
    } catch (error) {
      console.error(
        '[WebSocketConnection._getDIDCommRoutingDID] Error extracting routing DID:',
        error
      )
      return undefined
    }
  }

  /**
   * Helper function to extract the WebSocket DIDCommV2 URL from a mediator's DID Document
   * Added better error messaging for React Native compatibility
   *
   * @param mediatorDID   The DID Document of the mediator
   * @returns             The WebSocket URL of the mediator's DIDCommMessaging service endpoint
   * @throws              If no suitable WebSocket service endpoint is found
   */
  private _getWebSocketUrl(mediatorDID: DIDDocument | null): string {
    console.log('[WebSocketConnection._getWebSocketUrl] Extracting WebSocket URL from mediator DID')

    if (!mediatorDID) {
      const error = 'Mediator DID Document is null'
      console.error('[WebSocketConnection._getWebSocketUrl]', error)
      throw new Error(error)
    }

    console.debug(
      '[WebSocketConnection._getWebSocketUrl] Services in DID document:',
      mediatorDID.service?.length
    )

    // Find a DIDCommMessaging service with a ws:// or wss:// endpoint
    const service = mediatorDID.service?.find(s => {
      if (!s) return false

      const endpoint = s.serviceEndpoint
      const uri =
        typeof endpoint === 'string'
          ? endpoint
          : typeof endpoint === 'object' &&
              endpoint !== null &&
              'uri' in endpoint &&
              typeof endpoint.uri === 'string'
            ? endpoint.uri
            : null

      console.debug('[WebSocketConnection._getWebSocketUrl] Checking service:', s.type, 'uri:', uri)
      return (
        s.type === 'DIDCommMessaging' &&
        typeof uri === 'string' &&
        (uri.startsWith('ws') || uri.startsWith('wss'))
      )
    })

    if (!service) {
      const error = 'Mediator DID does not have a WebSocket DIDCommMessaging service endpoint'
      console.error('[WebSocketConnection._getWebSocketUrl]', error)
      console.debug(
        '[WebSocketConnection._getWebSocketUrl] Available services:',
        mediatorDID.service?.map(s => ({ type: s?.type, endpoint: s?.serviceEndpoint }))
      )
      throw new Error(error)
    }

    const endpoint = service.serviceEndpoint
    const wsUrl =
      typeof endpoint === 'string'
        ? endpoint
        : typeof endpoint === 'object' &&
            endpoint !== null &&
            'uri' in endpoint &&
            typeof endpoint.uri === 'string'
          ? endpoint.uri
          : null

    if (
      !wsUrl ||
      typeof wsUrl !== 'string' ||
      (!wsUrl.startsWith('ws') && !wsUrl.startsWith('wss'))
    ) {
      const error = `Mediator DIDCommMessaging service endpoint is not a valid WebSocket URL: "${wsUrl}"`
      console.error('[WebSocketConnection._getWebSocketUrl]', error)
      throw new Error(error)
    }

    console.log('[WebSocketConnection._getWebSocketUrl] ✓ WebSocket URL extracted:', wsUrl)
    return wsUrl
  }
}
