/**
 * CoralKM Gateway - Network gateway and routing
 *
 * This package handles DidComm message routing, peer discovery,
 * and network transport for the CoralKM protocol.
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { DID_DOC_PATH, didDocForIdentifier } from '@coralkm/core'

import { getDIDCommReturnRouteMessage } from '@coralkm/core'
import { createDefaultDid } from './default-did'
import type { AppAgent, Env } from './env'

const app = new Hono<{ Bindings: Env; Variables: { agent: AppAgent } }>()

// Middleware to create and attach Veramo agent to context
app.use('*', async (c, next) => {
  const { createVeramoAgent } = await import('./agent/agent.js')
  const agent = createVeramoAgent(c.env.WALLET_GW_DB, new URL(c.req.url), c.env.SECRET_BOX_KEY)
  c.set('agent', agent)
  await next()
})
app.use('*', cors())

// Endpoint to retrieve the gateway's DID Document
app.get(DID_DOC_PATH, async c => {
  // Create or get a DID for the gateway with the service endpoint
  const serverIdentifier = await createDefaultDid(c)
  const gatewayDID = didDocForIdentifier(serverIdentifier)
  return c.json(gatewayDID)
})

// Root endpoint to show status and stored DIDs/keys
app.get('/', async c => {
  const agent = c.get('agent')
  const dids = await agent.didManagerFind()

  const keys = await c.env.WALLET_GW_DB.prepare('SELECT * FROM keys').all()
  const privateKeys = await c.env.WALLET_GW_DB.prepare('SELECT * FROM `private-keys`').all()
  const services = await c.env.WALLET_GW_DB.prepare('SELECT * FROM services').all()
  const messages = await c.env.WALLET_GW_DB.prepare('SELECT * FROM messages').all()
  const mediationPolicies = await c.env.WALLET_GW_DB.prepare(
    'SELECT * FROM mediation_policies'
  ).all()
  const mediations = await c.env.WALLET_GW_DB.prepare('SELECT * FROM mediations').all()
  const namespacePolicies = await c.env.WALLET_GW_DB.prepare(
    'SELECT * FROM namespace_policies'
  ).all()
  const namespaces = await c.env.WALLET_GW_DB.prepare('SELECT * FROM namespaces').all()
  const guardianPolicies = await c.env.WALLET_GW_DB.prepare('SELECT * FROM guardian_policies').all()
  const guardianShares = await c.env.WALLET_GW_DB.prepare('SELECT * FROM guardian_shares').all()

  return c.json({
    dids,
    keys: keys.results.map(k => {
      let meta = {}
      try {
        meta = JSON.parse(k.meta as string)
      } catch {}
      return { ...k, meta }
    }),
    privateKeys: privateKeys.results.map(pk => {
      return { ...pk, privateKeyHex: '••••••••' }
    }),
    services: services.results.map(s => {
      let endpoint
      try {
        endpoint = JSON.parse(s.serviceEndpoint as string)
      } catch {
        endpoint = s.serviceEndpoint
      }
      return { ...s, serviceEndpoint: endpoint }
    }),
    messages: messages.results,
    mediations: {
      mediationPolicies: mediationPolicies.results,
      mediations: mediations.results,
    },
    namespaces: {
      namespacePolicies: namespacePolicies.results,
      namespaces: namespaces.results,
    },
    guardians: {
      guardianPolicies: guardianPolicies.results,
      guardianShares: guardianShares.results,
    },
  })
})

// Endpoint to reset the gateway's D1 Database (for testing purposes)
app.get('/reset', async c => {
  await c.env.WALLET_GW_DB.prepare('DELETE FROM identifiers').run()
  await c.env.WALLET_GW_DB.prepare('DELETE FROM keys').run()
  await c.env.WALLET_GW_DB.prepare('DELETE FROM `private-keys`').run()
  await c.env.WALLET_GW_DB.prepare('DELETE FROM services').run()
  await c.env.WALLET_GW_DB.prepare('DELETE FROM mediation_policies').run()
  await c.env.WALLET_GW_DB.prepare('DELETE FROM namespace_policies').run()
  await c.env.WALLET_GW_DB.prepare('DELETE FROM guardian_policies').run()
  return c.json({ message: 'Gateway Database reset' })
})

// Endpoint to receive and process incoming DIDComm messages via HTTP POST
app.post('/messages', async c => {
  try {
    const agent = c.get('agent')
    const message = await c.req.json()
    console.log('Received message:', message)
    const response = await agent.handleMessage({ raw: message })
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
      return c.json(packedMessage.message, 200, {
        'Content-Type': returnRouteResponse.contentType,
      })
    } else if (message) {
      return c.json({ id: message.id })
    }
    console.log('No response from handleMessage')
    return c.json({ error: 'Failed to handle message' }, 500)
  } catch (e) {
    console.error('Error handling message:', e)
    return c.json({ error: 'Failed to handle message' }, 500)
  }
})

// WebSocket endpoint for real-time DIDComm messaging
app.get('/ws', c => {
  const id = c.env.WS_HUB.idFromName('global')
  const stub = c.env.WS_HUB.get(id)
  return stub.fetch(c.req.raw)
})

/**
 * Main Fetch Event Handler
 */
export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
// Export the WebSocketsHub Durable Object class
export { WebSocketsHub } from './websocket-worker'
