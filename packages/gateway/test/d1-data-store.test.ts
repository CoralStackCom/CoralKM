import type { FindArgs, TMessageColumns } from '@veramo/core-types'
import { env } from 'cloudflare:test'

import { D1DIDStore, D1KeyStore, D1PrivateKeyStore } from '../src/agent/d1-data-store/indentifier'
import { buildQ1Query } from '../src/agent/d1-data-store/utils'

describe('D1 Key Store', () => {
  const keyStore = new D1KeyStore(env.WALLET_GW_DB)

  it('test key import and get', async () => {
    expect(keyStore).toBeDefined()
    const success = await keyStore.importKey({
      kid: 'test-key',
      type: 'Secp256k1',
      publicKeyHex: 'abcdef1234567890',
      kms: 'local',
      meta: { alias: 'test-key' },
    })
    expect(success).toBe(true)
    const retrievedKey = await keyStore.getKey({ kid: 'test-key' })
    expect(retrievedKey).toBeDefined()
    expect(retrievedKey.kid).toBe('test-key')
    expect(retrievedKey.type).toBe('Secp256k1')
    expect(retrievedKey.publicKeyHex).toBe('abcdef1234567890')
    expect(retrievedKey.kms).toBe('local')
    expect(retrievedKey.meta?.alias).toBe('test-key')
  })

  it('get non-existing key should throw', async () => {
    await expect(keyStore.getKey({ kid: 'non-existing' })).rejects.toThrow('Key not found')
  })

  it('test list keys', async () => {
    expect(keyStore).toBeDefined()
    const success = await keyStore.importKey({
      kid: 'test-key',
      type: 'Secp256k1',
      publicKeyHex: 'abcdef1234567890',
      kms: 'local',
      meta: { alias: 'test-key' },
    })
    expect(success).toBe(true)
    const keys = await keyStore.listKeys()
    expect(keys).toBeDefined()
    expect(Array.isArray(keys)).toBe(true)
    expect(keys.length).toBeGreaterThan(0)
  })

  it('delete key', async () => {
    expect(keyStore).toBeDefined()
    const success = await keyStore.importKey({
      kid: 'test-key',
      type: 'Secp256k1',
      publicKeyHex: 'abcdef1234567890',
      kms: 'local',
      meta: { alias: 'test-key' },
    })
    expect(success).toBe(true)
    const deleteResult = await keyStore.deleteKey({ kid: 'test-key' })
    expect(deleteResult).toBe(true)
  })
})

describe('D1 Private Key Store', () => {
  const keyStore = new D1PrivateKeyStore(env.WALLET_GW_DB)

  it('test key import and get', async () => {
    expect(keyStore).toBeDefined()
    await keyStore.importKey({
      alias: 'test-key',
      type: 'Secp256k1',
      privateKeyHex: 'abcdef1234567890',
    })
    const retrievedKey = await keyStore.getKey({ alias: 'test-key' })
    expect(retrievedKey).toBeDefined()
    expect(retrievedKey.alias).toBe('test-key')
    expect(retrievedKey.type).toBe('Secp256k1')
    expect(retrievedKey.privateKeyHex).toBe('abcdef1234567890')
  })

  it('get non-existing key should throw', async () => {
    await expect(keyStore.getKey({ alias: 'non-existing' })).rejects.toThrow('Key not found')
  })

  it('test list keys', async () => {
    expect(keyStore).toBeDefined()
    await keyStore.importKey({
      alias: 'test-key',
      type: 'Secp256k1',
      privateKeyHex: 'abcdef1234567890',
    })
    const keys = await keyStore.listKeys()
    expect(keys).toBeDefined()
    expect(Array.isArray(keys)).toBe(true)
    expect(keys.length).toBeGreaterThan(0)
  })

  it('delete key', async () => {
    expect(keyStore).toBeDefined()
    await keyStore.importKey({
      alias: 'test-key',
      type: 'Secp256k1',
      privateKeyHex: 'abcdef1234567890',
    })
    const deleteResult = await keyStore.deleteKey({ alias: 'test-key' })
    expect(deleteResult).toBe(true)
  })
})

describe('D1 DID Store', () => {
  const didStore = new D1DIDStore(env.WALLET_GW_DB)

  it('test DID import and get', async () => {
    expect(didStore).toBeDefined()
    const success = await didStore.importDID({
      did: 'peer:example:123',
      provider: 'did:example',
      alias: 'example-did',
      keys: [
        {
          kid: 'test-key',
          type: 'Secp256k1',
          publicKeyHex: 'abcdef1234567890',
          kms: 'local',
          meta: { alias: 'test-key' },
        },
      ],
      services: [],
    })
    expect(success).toBe(true)
    const retrievedDID = await didStore.getDID({
      did: 'peer:example:123',
    })
    expect(retrievedDID).toBeDefined()
    expect(retrievedDID.did).toBe('peer:example:123')
    expect(retrievedDID.provider).toBe('did:example')
    expect(retrievedDID.alias).toBe('example-did')
    expect(retrievedDID.keys[0].kid).toBe('test-key')
    expect(retrievedDID.keys[0].type).toBe('Secp256k1')
    expect(retrievedDID.keys[0].publicKeyHex).toBe('abcdef1234567890')
    expect(retrievedDID.keys[0].kms).toBe('local')
    expect(retrievedDID.keys[0].meta?.alias).toBe('test-key')
  })

  it('test DID import and get with services', async () => {
    expect(didStore).toBeDefined()
    const success = await didStore.importDID({
      did: 'peer:example:123',
      provider: 'did:example',
      alias: 'example-did',
      keys: [
        {
          kid: 'test-key',
          type: 'Secp256k1',
          publicKeyHex: 'abcdef1234567890',
          kms: 'local',
          meta: { alias: 'test-key' },
        },
      ],
      services: [
        {
          id: 'service-1',
          type: 'ExampleService',
          serviceEndpoint: 'https://example.com/endpoint',
          description: 'An example service',
        },
        {
          id: 'service-2',
          type: 'ExampleService',
          serviceEndpoint: {
            uri: 'https://example.com/another-endpoint',
            accept: ['didcomm/v2', 'didcomm/aip2;env=rfc19'],
          },
          description: 'Another example service',
        },
      ],
    })
    expect(success).toBe(true)
    const retrievedDID = await didStore.getDID({
      did: 'peer:example:123',
    })
    expect(retrievedDID).toBeDefined()
    console.log('Retrieved DID:', retrievedDID)
    expect(retrievedDID.did).toBe('peer:example:123')
    expect(retrievedDID.provider).toBe('did:example')
    expect(retrievedDID.alias).toBe('example-did')
    expect(retrievedDID.keys[0].kid).toBe('test-key')
    expect(retrievedDID.keys[0].type).toBe('Secp256k1')
    expect(retrievedDID.keys[0].publicKeyHex).toBe('abcdef1234567890')
    expect(retrievedDID.keys[0].kms).toBe('local')
    expect(retrievedDID.keys[0].meta?.alias).toBe('test-key')
    expect(retrievedDID.services.length).toBe(2)
    expect(retrievedDID.services[0].id).toBe('service-1')
    expect(retrievedDID.services[0].type).toBe('ExampleService')
    expect(retrievedDID.services[0].serviceEndpoint).toBe('https://example.com/endpoint')
    expect(retrievedDID.services[0].description).toBe('An example service')
    expect(retrievedDID.services[1].id).toBe('service-2')
    expect(retrievedDID.services[1].type).toBe('ExampleService')
    // @ts-ignore
    expect(retrievedDID.services[1].serviceEndpoint.uri).toBe(
      'https://example.com/another-endpoint'
    )
    // @ts-ignore
    expect(retrievedDID.services[1].serviceEndpoint.accept).toEqual([
      'didcomm/v2',
      'didcomm/aip2;env=rfc19',
    ])
    expect(retrievedDID.services[1].description).toBe('Another example service')
  })

  it('get non-existing DID should throw', async () => {
    await expect(didStore.getDID({ did: 'non-existing' })).rejects.toThrow('Identifier not found')
  })

  it('test list DIDs', async () => {
    expect(didStore).toBeDefined()
    const success = await didStore.importDID({
      did: 'peer:example:123',
      provider: 'did:example',
      alias: 'example-did',
      keys: [
        {
          kid: 'test-key',
          type: 'Secp256k1',
          publicKeyHex: 'abcdef1234567890',
          kms: 'local',
          meta: { alias: 'test-key' },
        },
      ],
      services: [
        {
          id: 'service-1',
          type: 'ExampleService',
          serviceEndpoint: 'https://example.com/endpoint',
          description: 'An example service',
        },
        {
          id: 'service-2',
          type: 'ExampleService',
          serviceEndpoint: {
            uri: 'https://example.com/another-endpoint',
            accept: ['didcomm/v2', 'didcomm/aip2;env=rfc19'],
          },
          description: 'Another example service',
        },
      ],
    })
    expect(success).toBe(true)
    const dids = await didStore.listDIDs({})
    expect(dids).toBeDefined()
    expect(Array.isArray(dids)).toBe(true)
    expect(dids.length).toBeGreaterThan(0)
    console.log('DIDs:', dids)
  })

  it('delete key', async () => {
    expect(didStore).toBeDefined()
    const success = await didStore.importDID({
      did: 'peer:example:123',
      provider: 'did:example',
      alias: 'example-did',
      keys: [
        {
          kid: 'test-key',
          type: 'Secp256k1',
          publicKeyHex: 'abcdef1234567890',
          kms: 'local',
          meta: { alias: 'test-key' },
        },
      ],
      services: [],
    })
    expect(success).toBe(true)
    const deleteResult = await didStore.deleteDID({ did: 'peer:example:123' })
    expect(deleteResult).toBe(true)
  })
})

describe('D1 Store Utils', () => {
  it('buildQ1Query should build correct SQL and params', () => {
    const args: FindArgs<TMessageColumns> = {
      where: [
        {
          column: 'id',
          value: ['123'],
          not: false,
          op: 'Equal',
        },
        {
          column: 'createdAt',
          value: ['2020-01-01T00:00:00Z', '2024-01-01T00:00:00Z'],
          not: false,
          op: 'Between',
        },
      ],
      order: [
        {
          column: 'createdAt',
          direction: 'DESC',
        },
      ],
      take: 10,
      skip: 5,
    }
    const { sql, params } = buildQ1Query('SELECT * FROM messages', args)
    console.log('Generated SQL:', sql, 'Params:', params)
    expect(sql).toBe(
      'SELECT * FROM messages WHERE "id" = ? AND "createdAt" BETWEEN ? AND ? ORDER BY "createdAt" DESC LIMIT ? OFFSET ?'
    )
    expect(params).toEqual(['123', '2020-01-01T00:00:00Z', '2024-01-01T00:00:00Z', 10, 5])
  })
})
