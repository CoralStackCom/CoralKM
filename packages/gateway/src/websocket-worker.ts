import { DurableObject } from 'cloudflare:workers'

import {
  CoralKMV01MessageTypes,
  getDIDCommForwardMessages,
  getDIDCommReturnRouteMessage,
} from '@coralkm/core'

import type { AppAgent, Env } from './env'

/**
 * Type definition for WebSocket attachment data used for serialization.
 */
type WSAttachment = {
  /**
   * The URL associated with the WebSocket connection.
   */
  url: string
  /**
   * The requester DID associated with the WebSocket connection.
   */
  requester_did?: string
}

/**
 * A Durable Object that manages WebSocket connections with hibernation support.
 * This allows the WebSocket connection to remain active even when the Durable Object
 * is not in memory reducing resource usage (costs).
 */
export class WebSocketsHub extends DurableObject {
  private _agent!: AppAgent
  /**
   * Initializes the WebSocketsHub Durable Object.
   *
   * @param _state  Durable Object state
   * @param env     Environment variables
   */
  constructor(
    state: DurableObjectState,
    public override env: Env
  ) {
    super(state, env)
  }

  /**
   * Creates or retrieves an instance of AppAgent for the given URL.
   *
   * @param url The URL to create the agent for
   * @returns   An instance of AppAgent
   */
  private async _getAgent(url: string): Promise<AppAgent> {
    if (this._agent) {
      return this._agent
    }
    console.log('Creating new agent for URL:', url)
    if (!this.env.WALLET_GW_DB) {
      throw new Error('WALLET_GW_DB is not available in Durable Object environment')
    }
    const { createVeramoAgent } = await import('./agent/agent.js')
    this._agent = createVeramoAgent(this.env.WALLET_GW_DB, new URL(url), this.env.SECRET_BOX_KEY)
    return this._agent
  }

  /**
   *  Handles incoming fetch requests to upgrade to a WebSocket connection.
   *
   * @param request   The incoming request to upgrade to a WebSocket connection
   * @returns         A response with the WebSocket connection
   */
  override async fetch(request: Request): Promise<Response> {
    // Upgrade to WebSocket
    if (request.headers.get('Upgrade') === 'websocket') {
      // Creates two ends of a WebSocket connection.
      const webSocketPair = new WebSocketPair()
      const [client, server] = Object.values(webSocketPair)

      // Calling `acceptWebSocket()` connects the WebSocket to the Durable Object, allowing the WebSocket to send and receive messages.
      // Unlike `ws.accept()`, `state.acceptWebSocket(ws)` allows the Durable Object to be hibernated
      // When the Durable Object receives a message during Hibernation, it will run the `constructor` to be re-initialized
      this.ctx.acceptWebSocket(server)
      server.serializeAttachment({ url: request.url } as WSAttachment)

      return new Response(null, {
        status: 101,
        webSocket: client,
      })
    }
    // Invalid request, must be a WebSocket upgrade
    return new Response('Expected WebSocket', { status: 426 })
  }

  /**
   * Handles incoming WebSocket messages.
   *
   * @param ws          The WebSocket connection
   * @param message     The message received from the client
   */
  override async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
    const wsAttachment = ws.deserializeAttachment() as WSAttachment
    const agent = await this._getAgent(wsAttachment.url)
    const packedMessage = JSON.parse(message.toString())
    console.debug('Received message:', packedMessage)
    try {
      const response = await agent.handleMessage({ raw: packedMessage })
      if (!wsAttachment.requester_did) {
        ws.serializeAttachment({
          ...wsAttachment,
          requester_did: response?.from,
        } as WSAttachment)
        console.log('Stored requester DID in WebSocket attachment:', response?.from)
      }

      // If recovery request, broadcast to all connections
      if (response.type === CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST) {
        console.log('Broadcasting namespace recovery request to all connected clients')
        // Send a plaintext DIDComm message to all connected clients
        const packedMessage = await agent.packDIDCommMessage({
          message: {
            id: response.id,
            type: CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST,
            body: response.data,
          },
          packing: 'none',
        })
        this._broadcastMessage(packedMessage.message)
        return
      }

      // Check for response from handleMessage
      const returnRouteResponse = getDIDCommReturnRouteMessage(response)
      if (returnRouteResponse) {
        console.log('Return route response:', returnRouteResponse)
        if (returnRouteResponse.id) {
          agent.emit('DIDCommV2Message-sent', returnRouteResponse.message)
        }
        const packedMessage = await agent.packDIDCommMessage({
          message: returnRouteResponse.message,
          packing: 'authcrypt',
        })
        ws.send(JSON.stringify(packedMessage.message))
      }

      // Check for any forwarded messages to send
      const forwardMessages = getDIDCommForwardMessages(response)
      if (forwardMessages && forwardMessages.messages.length > 0) {
        const requester_did = forwardMessages.requester_did
        for (const msg of forwardMessages.messages) {
          const requesterWs = this._getRequesterWebSocket(requester_did)
          if (requesterWs && requesterWs.readyState === WebSocket.OPEN) {
            console.log('Forwarding message to requester DID:', requester_did, msg)
            requesterWs.send(msg)
          } else {
            console.warn('No open WebSocket found for requester DID:', requester_did)
          }
        }
      }
    } catch (e) {
      console.error('Error handling WebSocket message:', packedMessage, e)
    }
  }

  /**
   * Retrieves the WebSocket connection associated with a given requester DID.
   *
   * @param requester_did The requester DID to look up
   * @returns The WebSocket connection associated with the requester DID, or null if not found
   */
  private _getRequesterWebSocket(requester_did: string): WebSocket | null {
    for (const ws of this.ctx.getWebSockets()) {
      const wsAttachment = ws.deserializeAttachment() as WSAttachment
      if (wsAttachment.requester_did === requester_did) return ws
    }
    return null
  }

  /**
   * Relay or broadcast a message to all connected WebSocket clients.
   *
   * @param message The message to broadcast
   */
  private _broadcastMessage(message: string) {
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    }
  }

  override async webSocketClose(ws: WebSocket, code: number, reason: string, _wasClean: boolean) {
    // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
    ws.close(code, reason)
  }

  override async webSocketError(ws: WebSocket, error: Error) {
    // If the connection experiences an error, the runtime will invoke the webSocketError() handler.
    console.error('WebSocket error:', error)
    ws.close(1011, `WebSocket error occurred: ${error.message}`)
  }
}
