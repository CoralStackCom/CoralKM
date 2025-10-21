import type {
  IDIDManager,
  IDataStore,
  IDataStoreORM,
  IKeyManager,
  IMessageHandler,
  IResolver,
  TAgent,
} from '@veramo/core'
import type { IDIDComm } from '@veramo/did-comm'
import { Context } from 'hono'

import type { IDIDCommProtocols } from '@coralkm/core'

import type { WebSocketsHub } from './websocket-worker'

// Define Worker Environment Variables and Bind to Hono Context
export interface Env {
  // Cloudflare D1 Database binding for storing agent data
  WALLET_GW_DB: D1Database
  // WebSocket Hub Durable Object binding for real-time DIDComm messaging
  WS_HUB: DurableObjectNamespace<WebSocketsHub>
  // Secret key for encrypting/decrypting data using Veramo's SecretBox
  // Store as secret in Cloudflare dashboard
  // Generate using: await SecretBox.createSecretKey()
  SECRET_BOX_KEY: string
}

// Define the Veramo agent type with necessary plugins
export type AppAgent = TAgent<
  IDIDManager &
    IDataStore &
    IDataStoreORM &
    IKeyManager &
    IDIDComm &
    IDIDCommProtocols &
    IMessageHandler &
    IResolver
>

export type AppContext = Context<{ Bindings: Env; Variables: { agent: AppAgent } }, '*', {}>
